# om namah shivay

from flask import Flask
from flask import request, jsonify
import imdb
import allmusic
import goodreads
import hltb
import imdbtvseries
import rym
import mal

app = Flask(__name__)


@app.route("/")
def hello():
    dictionary = {"message": "Hello from Python!"}
    return jsonify(dictionary)


@app.route("/imdb", methods=["POST"])
def imdbs():
    return jsonify(imdb.main(request.get_json()["url"]))


@app.route("/allmusic", methods=["POST"])
def allmusics():
    return jsonify(allmusic.main(request.get_json()["url"]))


@app.route("/goodreads", methods=["POST"])
def goodread():
    return jsonify(goodreads.main(request.get_json()["url"]))


@app.route("/hltb", methods=["POST"])
def hltbb():
    return jsonify(hltb.main(request.get_json()["url"]))


@app.route("/imdbtvseries", methods=["POST"])
def imdbtvseriress():
    return jsonify(imdbtvseries.main(request.get_json()["url"]))


@app.route("/rym", methods=["POST"])
def ryms():
    return jsonify(rym.main(request.get_json()["url"]))


@app.route("/mal", methods=["POST"])
def mals():
    return jsonify(mal.main(request.get_json()["url"]))


if __name__ == "__main__":
    app.run(debug=True)
