"""This script prompts a user to enter and URL
and prints the Book object so MedialistBackend can read it"""

import re
import json
import sys
from bs4 import BeautifulSoup
import requests

# URL = sys.argv[1]


def main(url):
    """This script prompts a user to enter an url for a Book in Goodreads and returns a JSON"""
    headers = {"Accept-Language": "en-US,en;q=0.5"}
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")
    title = soup.find("h1", id="bookTitle").get_text()
    title = re.sub("[\n\t]", "", title)[6:]
    author = soup.find("span", itemprop="name").get_text()
    poster = soup.find("img", id="coverImage")["src"]
    pages = re.sub(
        "[\n\t pages]", "", soup.find("span", itemprop="numberOfPages").get_text()
    )
    pages = int(pages)
    time = (pages * 250) / (150 * 60)
    time = round(time, 2)
    score = float(soup.find("span", itemprop="ratingValue").get_text())
    genres = soup.find_all("a", class_="actionLinkLite bookPageGenreLink")
    year = soup.find_all("div", class_="row")[1].get_text()
    year = soup.find("nobr", class_="greyText")
    if not year:
        year = soup.find_all("div", class_="row")[1].get_text()
    else:
        year = year.get_text()
    year = re.sub("[\n\tA-z&%() +/\|!@?<>#^.,]", "", year)
    year = year[len(year) - 4 :]
    year = int(year)
    veamos = {}
    veamos["image"] = poster
    veamos["title"] = title
    veamos["year"] = year
    veamos["pages"] = pages
    genreslist = []
    for i in genres:
        genreslist.append(i.get_text())
    veamos["genres"] = genreslist
    veamos["rating"] = score * 2
    veamos["author"] = author
    return veamos


# print(json.dumps(main(URL)))
# sys.stdout.flush()
