# -*- coding: utf-8 -*-
import re
import json
import sys
import requests
from bs4 import BeautifulSoup

# URL = sys.argv[1]


def parse_date(new_date):
    months = {
        "Jan.": "1",
        "Feb.": "2",
        "Mar.": "3",
        "Apr.": "4",
        "May": "5",
        "Jun.": "6",
        "Jul.": "7",
        "Aug.": "8",
        "Sep.": "9",
        "Oct.": "10",
        "Nov.": "11",
        "Dec.": "12",
    }
    date = new_date.split(" ")
    if len(date) != 3:
        return new_date
    new_date = months[date[1]] + "/" + date[0] + "/" + date[2]
    return new_date


def get_episodes(seasons, headers, url):
    hola = {}
    for i in range(1, seasons + 1):
        hola[i] = {}
        hola[i]["episodes"] = []
        if not url[-1] == "/":
            url = url + "/"
        new_url = url + "episodes?season=" + str(i)
        page = requests.get(new_url, headers=headers)
        soup = BeautifulSoup(page.content, "html.parser")
        episodes_cards = soup.find_all("div", class_="list_item")
        for num, j in enumerate(episodes_cards, start=1):
            title = j.find("a", itemprop="name").get_text()
            date = j.find("div", class_="airdate").get_text()
            title = re.sub("[\n\t]", "", title)
            date = re.sub("[\n\t]", "", date)
            try:
                date = parse_date(date.strip()).split("/")
                if len(date) < 3:
                    date = None
                date = "/".join(date)
            except:
                date = None
            hola[i]["episodes"].append(
                {"title": title, "episodeNumber": num, "aired": date}
            )
        if len(hola[i]["episodes"]) == 0:
            del hola[i]
            continue
        hola[i]["seasonNumber"] = i
        hola[i]["initialDate"] = hola[i]["episodes"][0]["aired"]
        hola[i]["finalDate"] = hola[i]["episodes"][-1]["aired"]
    return hola


def main(url):
    if "?ref" in url:
        url = url[: url.index("?ref")]
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0",
        "Accept-Language": "en-US,en;q=0.5",
    }
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")
    title = soup.find("div", class_="title_wrapper").find("h1").get_text().strip()
    seasons = int(soup.find("div", class_="seasons-and-year-nav").find("a").get_text())
    poster = soup.find("div", class_="poster").find("a").find("img")["src"]
    try:
        time = re.sub("[\n\t min]", "", soup.find("time").get_text()).split("h")
    except:
        time = ["0"]
    if len(time) < 2:
        time.append(time[0])
        time[0] = 0
    if not time[1]:
        time[1] = 0
    time = int(time[0]) * 60 + int(time[1])
    if time == 0:
        time = 22
    note = float(soup.find("span", itemprop="ratingValue").get_text())
    genresandyear = soup.find("div", class_="subtext").find_all("a")
    genres = genresandyear[:-1]
    is_finished = not "–" in genresandyear[-1].get_text()
    year = re.sub("[–]", "/", genresandyear[-1].get_text())
    year = re.sub("[ \n\t() MnTVSeries-]", "", year).split("/")
    content = get_episodes(seasons, headers, url)
    veamos = {}
    veamos["title"] = title
    veamos["image"] = poster
    veamos["rating"] = note
    veamos["seasons"] = content
    veamos["durationOfEpisode"] = time
    veamos["initialYear"] = year[0]
    veamos["link"] = url
    try:
        veamos["finalYear"] = year[1]
    except:
        if is_finished:
            veamos["finalYear"] = year[0]
        else:
            veamos["finalYear"] = None
    genres_list = []
    genres_list.append(re.sub("[\n\t ]", "", genres[0].get_text()))
    try:
        genres_list.append(re.sub("[\n\t ]", "", genres[1].get_text()))
    except:
        pass
    try:
        genres_list.append(re.sub("[\n\t ]", "", genres[2].get_text()))
    except:
        pass
    veamos["genres"] = genres_list
    return veamos


# print(json.dumps(main(URL)))
# sys.stdout.flush()
