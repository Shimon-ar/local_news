import pymongo

from CONST import API_KEY_IL, CONNECT_STR, CONNECT_LOCAL
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
    return sorted(names, key=lambda x: (-int(x.split('_')[2]), -int(x.split('_')[1])))


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
        .format(page, category, API_KEY_IL) if category else \
        'https://newsapi.org/v2/top-headlines?country=il&page={}&apiKey={}' \
            .format(page, API_KEY_IL)
    r = requests.get(url)
    print(r.json())
    if r.status_code == requests.codes.ok:
        return r.json()
    return None


def get_index_total_current(db, names, start):
    i, count_total, count_current = 0, 0, 0
    for name in names:
        count_current = db[name].estimated_document_count()
        count_total = count_total + count_current
        if count_total > start:
            break
        i = i + 1
    return i, count_total, count_current


def get_news(db_news, collection_type, page, num_result):
    if page <= 0 or num_result <= 0:
        return []
    names = get_collection_names(db_news, collection_type)
    start, end = (page - 1) * num_result, page * num_result
    i, count_total, count_current = get_index_total_current(db_news, names, start)
    if i == len(names) or start >= count_total:
        return []

    offset_start = count_current - (count_total - start)
    results = list(db_news[names[i]].find({}).sort('publishedAt', pymongo.DESCENDING)) \
        [offset_start: offset_start + num_result if end <= count_total else None]

    if len(results) == num_result or i == len(names) - 1:
        return results
    results_second_part = list(db_news[names[i + 1]].find({}).sort('publishedAt', pymongo.DESCENDING))[
                          :num_result - len(results)]
    return results + results_second_part


def perform_search(collection, key):
    result = collection.find({'description': {'$regex': '.*' + key + '.*'}}).sort('publishedAt', pymongo.DESCENDING)
    if not result:
        return None
    result = list(result)
    return result


def get_collection_and_id(db, month, year, collection_type):
    db_entry = '{}_{}_{}'.format(collection_type, month, year)
    collection = db[db_entry]
    records = collection.find({'$query': {}, '$orderby': {"_id": -1}})
    records = list(records) if records else None
    start_id = int(records[0]['_id']) if records else 0
    return collection, start_id


def get_last_index(collection):
    records = collection.find({'$query': {}, '$orderby': {"_id": -1}})
    records = list(records) if records else None
    return int(records[0]['_id']) if records else 0


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

        if not collection.find_one({'global_id': processed_article['global_id']}):
            collection.insert_one(processed_article)
            start_id = start_id + 1
            print('-- Entered Article:{}'.format(start_id))


def fetch_category_articles(db_news, category):
    page = 1
    data = fetch_news_top_headlines(page, category)
    while data and len(data['articles']) > 0:
        print('--  Fetch Successfully Articles --')
        articles = data['articles']
        handle_category_articles(db_news, articles, category)
        page = page + 1
        data = fetch_news_top_headlines(page, category)


# def insert_article(db, collection_type, article):


def create_article(title, description, author, date, coll_type):
    article = {
        'title': title,
        'description': description,
        'author': author,
        'publishedAt': date
    }
    date = maya.parse(date)
    collection, _id = get_collection_and_id(get_db('local_news'), date.month, date.year, coll_type)

    article['_id'] = _id + 1
    return collection, article


# change the code beneath
def process_article_all_news(article, start_id, date):
    article.pop('content')
    article.update({'_id': start_id + 1})
    article.update({'global_id': '{}_{}_{}'.format(start_id + 1, date.month, date.year)})
    article['isExternal'] = True
    return article


def process_article_category(db_news, article, article_date, start_id, category):
    processed_article = {'_id': start_id + 1, 'category': category}
    processed_article.update(article)
    processed_article.pop('content')
    collection, start_id = get_collection_and_id(db_news, article_date.month, article_date.year, 'allNews')
    result = collection.find_one({'title': article['title']})
    if not result:
        result = process_article_all_news(article, start_id, article_date)
        collection.insert_one(result)
        print('-- Insert Article to all_news global_id:{}'.format(result['global_id']))
    processed_article['global_id'] = result['global_id']
    processed_article['isExternal'] = True
    return processed_article


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


def get_entry_city(city):
    return city.replace(' ', '_')
