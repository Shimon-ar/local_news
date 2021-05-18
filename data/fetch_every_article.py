from data.CONST import CATEGORIES, CONNECT_LOCAL
import db_utils
from db_utils import get_db, get_relevant_date, insert_news_to_db
import pymongo
from pymongo import MongoClient
import maya


def main():
    cluster = MongoClient(CONNECT_LOCAL)
    db = cluster['local_news']
    relevant_date = maya.parse('2021-04-10')
    print(relevant_date)
    for i in range(2, 30):
        insert_news_to_db(db, relevant_date.datetime().date())
        print(relevant_date)
        relevant_date = relevant_date.add(days=1)


if __name__ == '__main__':
    main()
