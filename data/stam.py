import maya
import time
import requests

# time1 = '2021-02-09T15:47:00Z'
#
# dt = maya.parse(time).datetime()
# dt1 = maya.parse(time1).datetime()
# print(dt.isoformat()[:-6] + 'Z')
#
# a = [{'id': 2}, {"id": 4}]
# b = a[0].copy()
# a = ['all_news', 'dsvs', 'dsfvs', 'all_news']
# b = [c for c in a if 'all_news' in c]
# print(b)
import pymongo
from pymongo import MongoClient
import db_utils
from data.CONST import CONNECT_STR, API_KEY_IL, CATEGORIES, CONNECT_LOCAL

t = time.time()

cluster = MongoClient(CONNECT_LOCAL)
db_old = cluster['local_news']
coll_old = db_old['science']
# names = db_old.list_collection_names()
# for name in names:
#     coll = db_old[name]
#     coll.update_many({}, {'$set': {'isExternal': True}})

import maya

# a = [1,2,3,4]
# print(filter(lambda x:x==3, a))

