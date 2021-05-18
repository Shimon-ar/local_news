from CONST import API_KEY_IL, CONNECT_STR
import pymongo
from pymongo import MongoClient
import requests
import pandas as pd
import numpy as np
import sys
import datetime
import json
import urllib


# cluster = MongoClient(CONNECT_STR)
# db = cluster["news"]
# collection = db["news"]

# response = requests.get("http://newsapi.org/v2/top-headlines?country=il&category={}&apiKey={}"
#                         .format(categories[1], API_KEY_IL))


# response = requests.get("http://newsapi.org/v2/everything?q=כפר-סבא&apiKey={}"
#                         .format(API_KEY_IL))
#
# news = response.json()['articles']
#
# for article in news:
#     print(article['publishedAt'])

# print(response.text)

# def get_all_news():


def get_process_cities():
    cities_he = pd.read_excel('datasets/cities_he.xlsx')
    cities_en = pd.read_excel('datasets/cities_en.xlsx')
    df_cities = cities_en.merge(cities_he, how='inner', on=['X', 'Y'])
    df_cities = df_cities[['Name_x', 'Name_y']]
    df_cities.columns = ['name_en', 'name_he']
    df_cities = df_cities.replace(regex=r'(\(.*\))', value='')
    return df_cities


def get_process_yishuv():
    df = pd.read_excel('datasets/yishuv_he.xlsx')
    columns = df.columns
    df[columns[9]] = df[columns[9]].replace(np.nan, 0)
    df = df[(df[columns[9]] > 3000) & (~df[columns[-2]].isna())]
    df = df[[columns[0], columns[-2]]].replace(regex=r'(\(.*\))', value='')
    df.columns = ['name_he', 'name_en']
    return df


def merge_and_save_sets(df_cities, df_yishov, file_name):
    df = pd.concat([df_cities, df_yishov])
    df.drop_duplicates(inplace=True, subset=['name_he'])
    df.drop_duplicates(inplace=True, subset=['name_en'])
    df.reset_index(drop=True, inplace=True)
    df.to_excel('datasets/{}.xlsx'.format(file_name))


def main():
    if len(sys.argv) == 2:
        file_name = sys.argv[1]
        df_cities, df_yishov = get_process_cities(), get_process_yishuv()
        merge_and_save_sets(df_cities, df_yishov, file_name)

    else:
        print('please provide file name as argument')


if __name__ == '__main__':
    main()
