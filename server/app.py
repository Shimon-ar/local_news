import flask
import pymongo
from bs4 import BeautifulSoup
from flask import jsonify, Flask, request, session, url_for, abort
from flask_pymongo import PyMongo
from data import db_utils
from data.CONST import CATEGORIES, CONNECT_LOCAL, MANAGERS, PENDING, APPROVED, UNAPPROVED
import requests
import maya

app = Flask(__name__)
app.config['MONGO_URI'] = CONNECT_LOCAL + '/local_news'
app.secret_key = 'secret_key'
mongo = PyMongo(app)

URL = 'http://localhost:5000/'


@app.route("/home")
def get_home_data():
    db_news = db_utils.get_db('local_news')
    news = [db_utils.get_news(db_news, category, 1, 4) for category in CATEGORIES]
    response = {category: news[i] for i, category in enumerate(CATEGORIES)}
    response['topHeadLines'] = db_utils.get_news(db_news, 'topHeadLines', 1, 10)
    return jsonify(response)


@app.route("/news")
def get_news():
    category = request.args.get('category')
    page_num = request.args.get('page')
    num_result = request.args.get('num_result')
    db = db_utils.get_db('local_news')

    key = request.args.get('key')
    field = request.args.get('field')

    results = db_utils.get_news(db, category, int(page_num), int(num_result), field, key)

    return jsonify(results)


@app.route("/search")
def search_news():
    city = request.args.get('city')
    page_num = int(request.args.get('page'))
    db = db_utils.get_db('local_news')
    names = db_utils.get_collection_names(db, 'allNews')

    result = db_utils.perform_search(db[names[0]], city)
    if len(result) < 10 and len(names) > 1:
        result += db_utils.perform_search(db[names[1]], city)

    offset = (page_num - 1) * 10

    if len(result) < offset:
        return jsonify([])

    return jsonify(result[offset:offset + 10])


@app.route("/cities")
def get_all_cities():
    db = db_utils.get_db('local_news')
    collection = db['cities']
    cities = list(collection.find({}, {'_id': 0, 'name_he': 1}))
    return jsonify(cities)


@app.route("/article/<global_id>")
def get_article_data(global_id):
    article = db_utils.get_article(global_id)
    if not article:
        return 'article was not found', 404

    if article['isExternal']:
        page = requests.get(article['url'])

        if page.status_code != 200:
            return 'article parsing failed', 500

        soup = BeautifulSoup(page.content, 'html.parser')
        content = soup.find_all(class_='text_editor_paragraph')

        body = [p.get_text() for p in content]
        headline = soup.find(class_='mainTitle').get_text()
        subtitle = soup.find(class_='subTitle').get_text()
    else:
        headline = article['title']
        subtitle = article['description']
        body = []

    return jsonify({
        'headline': headline,
        'subtitle': subtitle,
        'body': body,
        'image': article['urlToImage'],
        'isExternal': article['isExternal']
    })


@app.route('/upload', methods=['POST', 'GET'])
def upload_article():
    description = request.form.get('description')
    title = request.form.get('title')
    category = request.form.get('category')
    user = request.form.get('user')

    article = db_utils.create_article(title, description, user, category, 'temp_articles',
                                      maya.now().iso8601(), status=PENDING)
    if 'file' in request.files:
        image = request.files['file']
        if image:
            type_img = image.filename.split('.')[-1]
            file_name = '{}.{}'.format(article['_id'], type_img)
            mongo.save_file(file_name, image)
            article['urlToImage'] = '/image/' + file_name
    else:
        article['urlToImage'] = '/image/default.png'

    coll = db_utils.get_collection(db_utils.get_db('local_news'), default_entry='temp_articles')
    coll.insert_one(article)
    article.pop('status')
    db_utils.insert_article(article, 'allNews')

    for manager in MANAGERS:
        db_utils.add_message(manager, 'הכתבה:' + title + ', ממתינה לאישור.')

    return 'Article Uploaded', 200


@app.route('/image/<name>', methods=['GET'])
def get_img(name):
    return mongo.send_file(name)


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return 'missing data', 400

    user = mongo.db.users.find_one_or_404({'username': username})
    if user['password'] == password:
        return jsonify({
            'name': username,
            'id': user['_id'],
            'is_manager': user['is_manager']
        })

    return 'password or username incorrect', 404


@app.route('/createUser', methods=['POST'])
def create_user():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return 'missing data', 400

    db = db_utils.get_db('local_news')
    collection = db['users']
    index = db_utils.get_last_index(collection)

    if collection.find_one({'username': username}):
        return 'user exist', 404

    user = {
        '_id': index + 1,
        'username': username,
        'password': password,
        'is_manager': True if username in MANAGERS else False,
        'favorites': []
    }

    if mongo.db.users.insert_one(user):
        return jsonify({
            'name': username,
            'id': user['_id'],
            'is_manager': user['is_manager']
        })

    return 'database error', 401


@app.route('/confirmArticle', methods=['POST', 'GET'])
def confirm_article():
    _id = request.args.get('id')
    status = request.args.get('status')
    user = request.args.get('user')
    article = mongo.db.temp_articles.find_one_or_404({'global_id': _id})

    if status in [APPROVED, UNAPPROVED]:

        mongo.db.temp_articles.find_one_and_update(
            {"_id": article['_id']},
            {"$set": {"status": status}
             }
        )
        if status == APPROVED:
            article.pop('status')
            db_utils.insert_article(article, article['category'])
            db_utils.add_message(article['author'], 'הכתבה:' + article['title'] + ', אושרה בהצלחה!')

        elif status == UNAPPROVED:
            db_utils.add_message(article['author'], 'הכתבה:' + article['title'] + ', לא עברה אישור מנהל')

        return 'updated successfully', 200

    return 'status error', 400


@app.route('/messages/<user>', methods=['POST', 'GET'])
def get_messages(user):
    results = mongo.db.messages.find({'to': user}).sort('time', pymongo.DESCENDING)
    results = list(results) if results else []
    return jsonify(results)


@app.route('/confirmMsg/<_id>', methods=['POST', 'GET'])
def confirm_msg(_id):
    mongo.db.messages.find_one_and_update(
        {"_id": int(_id)},
        {"$set": {"isNew": False}
         }
    )

    return 'updated successfully', 200


@app.route('/markFavorite', methods=['POST', 'GET'])
def mark_favorite():
    _id = request.args.get('id')
    user = request.args.get('user')
    is_marked = request.args.get('isMarked')
    is_marked = True if is_marked == 'true' else False
    res = db_utils.add_favorite(user, _id, is_marked)
    return jsonify(res)


@app.route('/getFavorites/<user>', methods=['POST', 'GET'])
def get_favorites(user):
    rec = mongo.db.users.find_one_or_404({'username': user})
    return jsonify(rec['favorites'])


@app.route('/getFavoritesNews/<user>', methods=['POST', 'GET'])
def get_favorites_news(user):
    rec = mongo.db.users.find_one_or_404({'username': user})
    favorites = []
    for global_id in rec['favorites']:
        article = db_utils.get_article(global_id)
        if article:
            favorites.append(article)
    return jsonify(favorites)


@app.route('/deleteArticle/<global_id>', methods=['POST', 'GET'])
def delete_article(global_id):
    if db_utils.remove_article(global_id):
        return 'article removed', 200
    return 'failed to removed article', 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
