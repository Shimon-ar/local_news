import pymongo

from CONST import API_KEY_IL, CONNECT_STR, CONNECT_LOCAL, APPROVED, MESSAGES
from pymongo import MongoClient
import requests
import maya


def get_db(name):
    cluster = MongoClient(CONNECT_LOCAL)
    return cluster[name]


def get_news_collection(db_news, collection_type, month, year):
    db_entry = '{}_{}_{}'.format(collection_type, month, year)
    return db_news[db_entry]


def get_article(global_id):
    db = get_db('local_news')
    month, year = global_id.split('_')[1:]
    coll = db['allNews_{}_{}'.format(month, year)]
    result = coll.find_one({'global_id': global_id})
    return result


def get_collection_names(db, collection_type):
    names = db.list_collection_names()
    names = [name for name in names if collection_type in name]
    try:
        return sorted(names, key=lambda x: (-int(x.split('_')[2]), -int(x.split('_')[1])))
    except ValueError:
        return names
    except IndexError:
        return names


def fetch_news_everything(page, str_date):
    url = 'https://newsapi.org/v2/everything?sources=ynet&page={}&to={}&apiKey={}'.format(page, str_date, API_KEY_IL)
    r = requests.get(url)
    print(r.json())
    if r.status_code == requests.codes.ok:
        return r.json()
    print(r.json())
    return None


def fetch_news_top_headlines(page, category):
    url = 'https://newsapi.org/v2/top-headlines?country=il&page={}&category={}&apiKey={}' \
        .format(page, category, API_KEY_IL) if category != 'topHeadLines' else \
        'https://newsapi.org/v2/top-headlines?country=il&page={}&apiKey={}' \
            .format(page, API_KEY_IL)
    r = requests.get(url)
    print(r.json())
    if r.status_code == requests.codes.ok:
        return r.json()
    return None


def get_news(db_news, collection_type, page, num_result, field=None, key=None):
    if page <= 0 or num_result <= 0:
        return []
    names = get_collection_names(db_news, collection_type)
    start = (page - 1) * num_result
    news, count = [], 0
    residual = 0
    for name in names:
        count += db_news[name].estimated_document_count()

        if count > start:
            news += list(db_news[name].find({}).sort('publishedAt', pymongo.DESCENDING))
            prev_len = len(news)
            if field and key:
                news = list(filter(lambda x: (x[field] == key), news))
                residual += prev_len - len(news)

            if len(news) >= num_result:
                break
    offset_start = start - (count - len(news)) + residual
    print(offset_start)

    return news[offset_start: offset_start + num_result]


def generate_global_id(month, year):
    db = get_db('local_news')
    entry = get_collection_names(db, 'allNews')[0]
    _id = get_last_index(db[entry], True) + 1
    return '{}_{}_{}'.format(_id, month, year)


def perform_search(collection, key):
    result = collection.find({'description': {'$regex': '.*' + key + '.*'}}).sort('publishedAt', pymongo.DESCENDING)
    if not result:
        return None
    result = list(result)
    return result


def get_collection(db, month=1, year=2000, collection_type='', default_entry=None):
    db_entry = '{}_{}_{}'.format(collection_type, month, year) if not default_entry else default_entry
    return db[db_entry]


def get_collection_and_id(db, month=1, year=2000, collection_type='', default_name=None):
    collection = get_collection(db, month, year, collection_type, default_name)
    start_id = get_last_index(collection)
    return collection, start_id


def get_last_index(collection, is_global=False):
    records = collection.find({'$query': {}, '$orderby': {"_id": -1}})
    records = list(records) if records else None

    if records:
        if is_global:
            return int(records[0]['global_id'].split('_')[0])
        else:
            return int(records[0]['_id'])
    return 0


def handle_category_articles(db_news, articles, category='topHeadLines'):
    if not articles:
        return None

    date = maya.parse(articles[0]['publishedAt']).datetime()
    collection, start_id = get_collection_and_id(db_news, date.month, date.year, category)

    for article in articles:
        if article['source']['id'] != 'ynet':
            print(article['source']['name'] + ' does not support yet')
            continue

        article_date = maya.parse(article['publishedAt']).datetime()
        diff = maya.now().datetime() - article_date
        if diff.days > 30:
            continue

        if article_date.year != date.year or article_date.month != date.month:
            collection, start_id = get_collection_and_id(db_news, article_date.month, article_date.year, category)

        processed_article = process_article_category(db_news, article, article_date, start_id, category)

        if processed_article and not collection.find_one({'global_id': processed_article['global_id']}):
            collection.insert_one(processed_article)
            start_id = start_id + 1
            print('-- Entered Article:{}'.format(start_id))


def fetch_category_articles(db_news, category='topHeadLines'):
    page = 1
    data = fetch_news_top_headlines(page, category)
    while data and len(data['articles']) > 0:
        print('--  Fetch Successfully Articles --')
        articles = data['articles']
        handle_category_articles(db_news, articles, category)
        page = page + 1
        data = fetch_news_top_headlines(page, category)


def create_article(title, description, author, category, coll_type, date_iso, status=APPROVED):
    date = maya.parse(date_iso).datetime()
    article = {
        '_id': get_last_index(get_collection(get_db('local_news'), default_entry=coll_type)) + 1,
        'title': title,
        'description': description,
        'author': author,
        'category': category,
        'publishedAt': date,
        'status': status,
        'urlToImage': '',
        'global_id': generate_global_id(date.month, date.year),
        'isExternal': False
    }

    print(article['_id'])

    return article


# change the code beneath
def process_article_all_news(article, start_id, date, category, is_external=True):
    article.pop('content')
    article.update({'_id': start_id + 1})
    article.update({'global_id': generate_global_id(date.month, date.year)})
    article['isExternal'] = is_external
    article['category'] = category

    return article


def process_article_category(db_news, article, article_date, start_id, category):
    processed_article = {'_id': start_id + 1, 'category': category}
    processed_article.update(article)
    processed_article.pop('content')
    collection, start_id = get_collection_and_id(db_news, article_date.month, article_date.year, 'allNews')
    result = collection.find_one({'title': article['title']})
    if not result:
        result = process_article_all_news(article, start_id, article_date, category)
        collection.insert_one(result)
        print('-- Insert Article to all_news global_id:{}'.format(result['global_id']))

    if not result or category == 'topHeadLines':
        processed_article['global_id'] = result['global_id']
        processed_article['isExternal'] = True
        return processed_article

    return None


def insert_news_to_db(db_news, old_date):
    for i in range(1, 6):
        print(i)
        data = fetch_news_everything(i, old_date)
        if not data or len(data['articles']) == 0:
            return False

        print('Fetch news of page {}'.format(i))

        articles = data['articles']
        date = maya.parse(articles[0]['publishedAt']).datetime()
        collection, start_id = get_collection_and_id(db_news, date.month, date.year, 'allNews')

        for article in articles:
            article_date = maya.parse(article['publishedAt']).datetime()
            if article_date.year != date.year or article_date.month != date.month:
                collection, start_id = get_collection_and_id(db_news, article_date.month, article_date.year, 'allNews')
            if collection.find_one({'title': article['title']}):
                print('----Article is present---')
                continue
            article = process_article_all_news(article, start_id, article_date)
            collection.insert_one(article)
            start_id = start_id + 1
            print(start_id)
    print('----Finished successfully inserting articles:{} '.format(len(articles)))
    return True


def get_relevant_date(db_news):
    collection_entry = get_collection_names(db_news, 'allNews')[0]
    collection = db_news[collection_entry]
    articles = collection.find({})
    articles = list(articles)
    if len(articles) == 0:
        print('-------collection empty-----')
        return None
    str_relevant_date = articles[0]['publishedAt']
    relevant_date = maya.parse(str_relevant_date)
    for article in articles:
        str_date = article['publishedAt']
        date = maya.parse(str_date)
        if date > relevant_date:
            relevant_date = date
    return relevant_date


def insert_article(article, coll_type):
    db = get_db('local_news')
    date = maya.parse(article['publishedAt']).datetime()

    coll = get_collection(db, date.month, date.year, coll_type)
    article['_id'] = get_last_index(coll) + 1

    if coll.find_one({'description': article['description']}):
        print('article present')
        return

    coll.insert_one(article)


def add_message(to, content):
    db = get_db('local_news')
    coll_mess = db[MESSAGES]

    message = {
        '_id': get_last_index(coll_mess) + 1,
        'to': to,
        'isNew': True,
        'content': content,
        'time': maya.now().iso8601()
    }

    coll_mess.insert_one(message)


def add_favorite(username, global_id, is_marked):
    users = get_collection(get_db('local_news'), default_entry='users')
    user = users.find_one({'username': username})
    if not user:
        return []

    if is_marked:
        print('removing')
        if global_id in user['favorites']:
            user['favorites'].remove(global_id)
    else:
        print('adding')
        if global_id not in user['favorites']:
            user['favorites'].append(global_id)

    users.replace_one({'username': username}, user)
    return user['favorites']


def remove_article(global_id):
    db = get_db('local_news')

    coll_temp_articles = get_collection(db, default_entry='temp_articles')
    article = coll_temp_articles.find_one({'global_id': global_id})

    if not article:
        return False

    coll_temp_articles.delete_one({'global_id': global_id})

    _, month, year = global_id.split('_')
    coll_all_news = get_collection(db, month, year, 'allNews')
    coll_all_news.delete_one({'global_id': global_id})

    if article['status'] == APPROVED:
        coll_category = get_collection(db, month, year, article['category'])
        coll_category.delete_one({'global_id': global_id})

    return True


def get_entry_city(city):
    return city.replace(' ', '_')
