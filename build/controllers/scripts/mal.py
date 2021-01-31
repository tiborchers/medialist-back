# -*- coding: utf-8 -*-
import re
import json
import sys
import requests
from dateutil.parser import *

# URL = sys.argv[1]


def parseDate(date):
    if date == None:
        return None
    return parse(date).strftime("%m/%d/%Y")


def main(url):
    if "?ref" in url:
        url = url[: url.index("?ref")]
    headers = {"Accept-Language": "en-US,en;q=0.5"}
    new_url = url.split("/")
    id = new_url[new_url.index("anime") + 1]
    page = requests.get("https://api.jikan.moe/v3/anime/" + id, headers=headers)
    page = json.loads(page.content.decode("utf-8-sig"))
    nfy = None
    genres = ["Animation", "Anime"]
    for i in page["genres"]:
        genres.append(i["name"])
    try:
        nfy = int(page["aired"]["prop"]["to"]["year"])
    except:
        nfy = None
    answer = {
        "title": page["title"],
        "image": page["image_url"],
        "rating": float(page["score"]),
        "durationOfEpisode": int(re.sub("[\n\t minperepisode]", "", page["duration"])),
        "initialYear": int(page["aired"]["prop"]["from"]["year"]),
        "finalYear": nfy,
        "link": url,
        "genres": genres,
    }
    page = requests.get(
        "https://api.jikan.moe/v3/anime/" + id + "/episodes", headers=headers
    )
    seasons = {}
    page = json.loads(page.content.decode("utf-8-sig"))
    final = page["episodes_last_page"]
    season = {}
    total = 1
    season["episodes"] = []
    for (num, i) in enumerate(page["episodes"], start=1):
        season["episodes"].append(
            {
                "title": i["title"],
                "episodeNumber": i["episode_id"],
                "aired": parseDate(i["aired"]),
            }
        )
        total += 1
    season["seasonNumber"] = 1
    season["initialDate"] = season["episodes"][0]["aired"]
    season["finalDate"] = season["episodes"][-1]["aired"]
    seasons[1] = season
    if final > 1:
        for j in range(2, final + 1):
            page = requests.get(
                "https://api.jikan.moe/v3/anime/" + id + "/episodes/" + str(j),
                headers=headers,
            )
            page = json.loads(page.content.decode("utf-8-sig"))
            season = {}
            season["episodes"] = []
            for (num, i) in enumerate(page["episodes"], start=1):
                season["episodes"].append(
                    {
                        "title": i["title"],
                        "episodeNumber": i["episode_id"],
                        "aired": parseDate(i["aired"]),
                    }
                )
                total += 1
            season["seasonNumber"] = j
            season["initialDate"] = season["episodes"][0]["aired"]
            season["finalDate"] = season["episodes"][-1]["aired"]
            seasons[j] = season
    answer["seasons"] = seasons
    return answer


# print(json.dumps(main(URL)))
# sys.stdout.flush()
