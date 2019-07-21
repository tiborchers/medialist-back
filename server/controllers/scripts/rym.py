"""This script prompts a user to enter and URL
and prints the movie object so MedialistBackend can read it"""

import re
import json
import sys
from bs4 import BeautifulSoup
import requests

URL = sys.argv[1]
TRACKNUMBER = 0


def to_seconds(song_duration):
    minutes_seconds = song_duration.split(":")
    return 60 * int(minutes_seconds[0]) + int(minutes_seconds[1])


def to_disc_track(tracklist_num):
    disc_track = tracklist_num.split(".")
    if len(disc_track) == 1:
        if disc_track[0][0].isalpha():
            if len(disc_track[0]) > 1:
                disc_track = [ord(disc_track[0][0]) - ord("A") + 1] + [disc_track[0][1]]
            else:
                disc_track = [ord(disc_track[0][0]) - ord("A") + 1] + [1]
        else:
            disc_track = [1] + disc_track
    return [int(disc_track[0]), int(disc_track[1])]


def main(url):
    """This script prompts a user to enter an url for an album in RateYourMusic and returns a JSON"""
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0",
        "Referer": "https://rateyourmusic.com/",
    }
    s = requests.session()
    page = s.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")
    title = soup.find("div", class_="album_title").get_text().strip()
    title = title.split("By")
    title = title[0].strip()
    genres_list = []
    for i in soup.find("tr", class_="release_genres").find_all("a"):
        genres_list.append(i.get_text())
    year = soup.find("b").get_text()
    artist = soup.find("span", itemprop="byArtist").find("a").get_text().strip()
    artist = re.sub("[\n\t]", "", artist)
    title = re.sub("[\n\t]", "", title)
    poster = soup.find("img", class_="coverart_img")["src"]
    songs = soup.find("ul", id="tracks").find_all("li", class_="track")
    list_songs = []
    total_time = 0
    for num, i in enumerate(songs, start=1):
        if i.has_attr("style"):
            continue
        if i.find("strong"):
            continue
        try:
            seconds = to_seconds(i.find("span", itemprop="duration").get_text().strip())
        except:
            continue
        total_time += seconds
        list_songs.append(
            {
                "title": i.find("span", itemprop="name").get_text().strip(),
                "duration": seconds,
                "trackNumber": to_disc_track(
                    i.find("span", class_="tracklist_num").get_text().strip()
                )[1],
                "disc": to_disc_track(
                    i.find("span", class_="tracklist_num").get_text().strip()
                )[0],
            }
        )
    score = float(soup.find("span", class_="avg_rating").get_text().strip())
    veamos = {}
    veamos["image"] = poster
    veamos["title"] = title
    veamos["year"] = int(year)
    veamos["genres"] = genres_list
    veamos["rating"] = score * 2
    veamos["artist"] = artist
    veamos["duration"] = total_time
    veamos["songs"] = list_songs
    veamos["numberOfSongs"] = len(songs)
    return veamos


print(json.dumps(main(URL), ensure_ascii=False).encode("utf8"))
sys.stdout.flush()
