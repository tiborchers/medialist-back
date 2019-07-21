# encoding: utf-8

import re
import json
import sys
from bs4 import BeautifulSoup
import requests


def hltb_calc(text):
    if text.find(u"½") > -1:
        text = text.replace(u"½", u".5")
    if text.find(u"M") > -1:
        return 1.0
    if text.find("H") > -1:
        text = text[0:3]
        if text.find("H") > -1:
            text = text[0:2]
            if text.find("H") > -1:
                text = text[0:1]
    if text.find("h") > -1:
        text = text[0]
    return float(text)


URL = sys.argv[1]
PAGE = requests.get(URL)
SOUP = BeautifulSoup(PAGE.text, "html.parser")
title = SOUP.find("div", class_="profile_header shadow_text").get_text()[1:-1]
veamos = SOUP.find_all("div", class_="profile_info")
poster = SOUP.find("img", class_="shadow_box")["src"]
developer = ""
NA = ""
EU = ""
JP = ""
consoles = ""
genres = ""
onlyOneGenre = False
onlyOneDeveloper = False
HLTB = (
    SOUP.find("div", class_="game_times").find_all("li")[1].find("div").get_text()[0:4]
)
if HLTB.find(u"--") > -1:
    HLTB = (
        SOUP.find("div", class_="game_times")
        .find_all("li")[0]
        .find("div")
        .get_text()[0:4]
    )
rating = SOUP.find("div", class_="profile_details").find_all("li")[4].get_text()
if rating.find("N") > -1:
    rating = None
else:
    rating = float(re.sub("[\n\t%Rating ]", "", rating)) / 10
for i in veamos:
    if i.find("strong").get_text() == u"\nDeveloper:\n":
        onlyOneDeveloper = True
        developer = i.get_text()
    elif i.find("strong").get_text() == u"\nDevelopers:\n":
        developer = i.get_text()
    elif i.find("strong").get_text() == u"\nPlayable On:\n":
        consoles = i.get_text()
    elif i.find("strong").get_text() == u"\nGenres:\n":
        genres = i.get_text()
    elif i.find("strong").get_text() == u"\nGenre:\n":
        onlyOneGenre = True
        genres = i.get_text()
    elif i.find("strong").get_text() == u"NA:":
        NA = i.get_text()
    elif i.find("strong").get_text() == u"EU:":
        EU = i.get_text()
    elif i.find("strong").get_text() == u"JP:":
        JP = i.get_text()

HLTB = hltb_calc(HLTB)
consoles = consoles[16:-1].split(", ")
if onlyOneGenre:
    genres = [genres[10:-1]]
else:
    genres = genres[11:-1].split(", ")
if onlyOneDeveloper:
    developer = developer[14:-1]
else:
    developer = developer[15:-1]
NAY = 3000
EUY = 3000
JPY = 3000
if NA != "":
    NAY = int(NA[-5:])
if EU != "":
    EUY = int(EU[-5:])
if JP != "":
    JPY = int(JP[-5:])
year = min(NAY, EUY, JPY)
if year == 3000:
    year = 1984

final = {}
final["HLTB"] = HLTB
final["developer"] = developer
final["genres"] = genres
final["consoles"] = consoles
final["title"] = title
final["year"] = year
final["image"] = poster
final["rating"] = rating

print(json.dumps(final))
sys.stdout.flush()
