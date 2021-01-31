"""This script prompts a user to enter and URL
and prints the movie object so MedialistBackend can read it"""

import re
import json
import sys
from bs4 import BeautifulSoup
import requests

# URL = sys.argv[1]


def to_seconds(song_duration):
    minutes_seconds = song_duration.split(":")
    return 60 * int(minutes_seconds[0]) + int(minutes_seconds[1])


def main(url):
    """This script prompts a user to enter an url for a movie in IMDB and returns a JSON"""
    headers = {
        "Accept-Language": "en-US,en;q=0.5",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0",
    }
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser")
    image = soup.find("img")["src"]
    year = soup.find("div", class_="release-date").find("span").get_text().strip()
    final_genres = []
    genre = soup.find("div", class_="genre").find("a").get_text().strip()
    final_genres.append(genre)
    genres = soup.find("div", class_="styles").find_all("a")
    for i in genres:
        genre = re.sub("[\n\t]", "", i.get_text().strip())
        final_genres.append(genre)
    if len(year) > 4:
        year = year[-4:]
    year = int(year)
    title = re.sub(
        "[\n\t]", "", soup.find("h1", class_="album-title").get_text().strip()
    )
    artist = re.sub(
        "[\n\t]",
        "",
        soup.find("h2", class_="album-artist")
        .find("span")
        .find("a")
        .get_text()
        .strip(),
    )
    try:
        rating = soup.find("div", class_="allmusic-rating").get_text().strip()
    except:
        rating = 3.00 * 2
    discs = soup.find_all("div", class_="disc")
    final_songs = []
    veamos = {}
    total_time = 0
    for i in discs:
        disc_title = re.sub(
            "[\n\tTrackLstingD\- ]", "", i.find("h3").get_text().strip()
        )
        if not disc_title:
            disc_title = 1
        disc_title = int(disc_title)
        songs = i.find("tbody").find_all("tr")
        for j in songs:
            song = {
                "trackNumber": int(
                    re.sub(
                        "[\n\t]", "", j.find("td", class_="tracknum").get_text().strip()
                    )
                ),
                "title": re.sub(
                    "[\n\t]",
                    "",
                    j.find("div", class_="title").find("a").get_text().strip(),
                ),
                "duration": to_seconds(
                    re.sub("[\n\t]", "", j.find("td", class_="time").get_text().strip())
                ),
                "disc": disc_title,
            }
            total_time += song["duration"]
            final_songs.append(song)

    veamos["title"] = title
    veamos["image"] = image
    veamos["year"] = year
    veamos["artist"] = artist
    veamos["songs"] = final_songs
    veamos["duration"] = total_time
    veamos["rating"] = float(rating)
    veamos["genres"] = final_genres
    veamos["numberOfSongs"] = len(final_songs)
    return veamos


# print(json.dumps(main(URL)))
# sys.stdout.flush()
