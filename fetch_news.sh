#!/bin/sh

NEWSP=~/Desktop/projects/local_news

cd "$NEWSP"
source venv/bin/activate
export PYTHONPATH="$NEWSP"
python data/fetch_category_articles.py
deactivate
echo "Done fetching, time: $(date)">>/tmp/newslog.txt
