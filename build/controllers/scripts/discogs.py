"""This script prompts a user to enter and URL
and prints the movie object so MedialistBackend can read it"""

import re
import json
import sys
from bs4 import BeautifulSoup
import requests

URL = sys.argv[1]


def to_seconds(song_duration):
    minutes_seconds = song_duration.split(":")
    return 60 * int(minutes_seconds[0]) + int(minutes_seconds[1])


def main(url):
    """This script prompts a user to enter an url for a movie in IMDB and returns a JSON"""
    headers = {"Accept-Language": "en-US,en;q=0.5"}
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")
    titles = soup.find("h1", id="profile_title").find_all("span")
    head = soup.find_all("div", class_="content")
    genres_list = []
    genres_list.append(head[0].find("a").get_text())
    for i in head[1].find_all("a"):
        genres_list.append(i.get_text())
    year = int(head[2].find("a").get_text())
    title = titles[2].get_text()
    artist = titles[0].get_text()
    artist = re.sub("[\n\t]", "", artist)
    title = re.sub("[\n\t]", "", title)[44:-36]
    poster = soup.find("span", class_="thumbnail_center").find("img")["src"]
    songs = soup.find_all("tr", class_="tracklist_track track")
    first_song = soup.find("tr", class_="first tracklist_track track")
    songs = [first_song] + songs
    list_songs = []
    total_time = 0
    for num, i in enumerate(songs, start=1):
        try:
            seconds = to_seconds(i.find_all("span")[1].get_text())
        except:
            seconds = 180
        total_time += seconds
        list_songs.append(
            {
                "title": i.find_all("span")[0].get_text(),
                "duration": seconds,
                "trackNumber": num,
                "disc": 1,
            }
        )
    score = float(soup.find("span", class_="rating_value").get_text())
    veamos = {}
    veamos["image"] = poster  # python
    veamos["title"] = title  # python
    veamos["year"] = year  # python
    veamos["genres"] = genres_list  # python
    veamos["rating"] = score * 2
    veamos["artist"] = artist  # python
    veamos["duration"] = total_time  # python
    veamos["songs"] = list_songs  # python
    veamos["numberOfSongs"] = len(songs)  # python
    return veamos


print(json.dumps(main(URL)))
sys.stdout.flush()
