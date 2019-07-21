"""This script prompts a user to enter and URL
and prints the movie object so MedialistBackend can read it"""

import re
import json
import sys
from bs4 import BeautifulSoup
import requests

URL = sys.argv[1]

def main(url):
    """This script prompts a user to enter an url for a movie in IMDB and returns a JSON"""
    headers = {"Accept-Language": "en-US,en;q=0.5"}
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, 'html.parser')
    title1 = soup.find('h1').get_text().split('(')
    title = title1[0][:-1]
    year = int(title1[1][:-2])
    poster = soup.find('div', class_='poster').find('a').find('img')['src']
    time = re.sub('[\n\t min]', '', soup.find('time').get_text()).split('h')
    if len(time) < 2:
        time = [0, time[0]]
    if not time[1]:
        time[1] = 0
    time = int(time[0])*60 + int(time[1])
    score = float(soup.find('span', itemprop='ratingValue').get_text())
    genres = soup.find('div', class_='subtext').find_all('a')[:-1]
    veamos = {}
    veamos['image'] = poster
    veamos['title'] = title
    veamos['year'] = year
    veamos['duration'] = time
    genreslist = []
    try:
        genreslist.append(re.sub('[\n\t ]', '', genres[0].get_text()))
    except:
        pass
    try:
        genreslist.append(re.sub('[\n\t ]', '', genres[1].get_text()))
    except:
        pass
    try:
        genreslist.append(re.sub('[\n\t ]', '', genres[2].get_text()))
    except:
        pass
    veamos['genres'] = genreslist
    veamos['rating'] = score
    return veamos

print(json.dumps(main(URL)))
sys.stdout.flush()
