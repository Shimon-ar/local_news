import requests
from bs4 import BeautifulSoup
import time
t = time.time()
page = requests.get("https://www.ynet.co.il/news/article/rJTUwX8H00")

# t = time.time()
if page.status_code == 200:
    print('got here')
    soup = BeautifulSoup(page.content, 'html.parser')
    content = soup.find_all(class_='text_editor_paragraph')
    body = [p.get_text() for p in content]
    headline = soup.find(class_='mainTitle').get_text()
    subtitle = soup.find(class_='subTitle').get_text()



print(time.time() - t)

# print(content[0].get_text())

for c in body:
    print(c)
# print(headline)
# print()
# print(subtitle)
# print()
# print(body)

# print(page.status_code == 200)