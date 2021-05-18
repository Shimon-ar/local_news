import sys
import pandas as pd
import json
import requests
import time


def get_cities_geo_api(offset):
    url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities"
    querystring = {"countryIds": "il", "minPopulation": "2500", 'offset': "{}".format(offset)}

    headers = {
        'x-rapidapi-key': "de5ab132bemshee7a470f0c1a49ep1e054fjsn5808daf3f756",
        'x-rapidapi-host': "wft-geo-db.p.rapidapi.com"
    }

    r = requests.get(url, headers=headers, params=querystring)
    if r.status_code == requests.codes.ok:
        return r.json()['data']
    return None


def save_json_as_xlsx(data, file_name):
    df = pd.DataFrame.from_dict(data)
    df.to_excel('datasets/{}.xlsx'.format(file_name))


def fetch_data():
    data = []
    for offset in range(0, 162, 5):
        r = get_cities_geo_api(offset)
        time.sleep(1.1)
        if r:
            data.extend(r)
    save_json_as_xlsx(data, 'cities_geo')


def main():
    fetch_data()


if __name__ == '__main__':
    main()
