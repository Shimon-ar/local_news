from data.CONST import CATEGORIES
from db_utils import get_db, fetch_category_articles

def main():
    db_news = get_db('local_news')
    for category in CATEGORIES:
        fetch_category_articles(db_news, category)
        print(' -- Finished Fetching Category: {}'.format(category))
    fetch_category_articles(db_news)


if __name__ == '__main__':
    main()
