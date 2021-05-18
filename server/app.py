import flask
from bs4 import BeautifulSoup
from flask import jsonify, Flask, request, session, url_for, abort
from flask_pymongo import PyMongo
from data import db_utils
from data.CONST import CATEGORIES, CONNECT_LOCAL
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
    results = db_utils.get_news(db, category, int(page_num), int(num_result))

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
        return jsonify(False)

    if not article['isExternal']:
        return jsonify(article)

    page = requests.get(article['url'])

    if page.status_code != 200:
        return jsonify(False)

    soup = BeautifulSoup(page.content, 'html.parser')
    content = soup.find_all(class_='text_editor_paragraph')

    body = [p.get_text() for p in content]
    headline = soup.find(class_='mainTitle').get_text()
    subtitle = soup.find(class_='subTitle').get_text()

    return jsonify({
        'headline': headline,
        'subtitle': subtitle,
        'body': body,
        'image': article['urlToImage']
    })


@app.route('/upload', methods=['POST', 'GET'])
def file_upload():
    description = request.form.get('description')
    title = request.form.get('title')
    if 'user' in session:
        username = session['username']
    else:
        return 'user not found', 400

    collection, article = db_utils.create_article(title, description, username,
                                                  maya.now().iso8601(), 'temp_articles')

    if 'file' in request.files:
        image = request.files['file']
        if image:
            date = maya.now()
            type_img = image.filename.split('.')[-1]
            mongo.save_file('{}_{}_{}.{}'.format(date.year, date.month, article['_id'], type_img), image)

    if collection.insert_one(article):
        return 'Article Uploaded'
    return 'Error at uploading', 500


@app.route('/image/<image_id>')
def get_img(image_id):
    return mongo.send_file(image_id)


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return 'missing data', 400

    user = mongo.db.users.find_one_or_404({'username': username})
    if user['password'] == password:
        # session.permanent = True
        session['username'] = username
        return 'successful login'

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
        'password': password
    }

    if mongo.db.users.insert_one(user):
        session['username'] = username
        return 'user created successfully'

    return 'database error', 401


@app.route('/logout')
def logout():
    session.pop('username', None)
    return 'logout'


@app.route('/isLogin')
def is_login():
    print(session['username'])
    return jsonify('username' in session)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
