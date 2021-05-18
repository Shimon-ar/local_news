import pandas as pd
import sys
import json
from CONST import API_KEY_IL, CONNECT_STR
import pymongo
from pymongo import MongoClient


def read_data(file1, file2):
    return pd.read_excel('datasets/{}.xlsx'.format(file1)), pd.read_excel('datasets/{}.xlsx'.format(file2))


def process_data(df_geo, df_gov):
    df_geo.dropna(inplace=True, subset=['wikiDataId'])
    df = df_geo.merge(df_gov, how='inner', left_on='city', right_on='name_en')
    df = df[['name_en', 'name_he', 'wikiDataId']]
    df.reset_index(inplace=True, drop=True)
    return df


def save_df_db(df):
    cluster = MongoClient(CONNECT_STR)
    db = cluster["cities"]
    collection = db["cities"]
    data_records = df.to_dict('records')
    collection.insert_many(data_records)


def main():
    save_df_db(pd.read_excel('datasets/cities.xlsx'))


if __name__ == '__main__':
    main()
