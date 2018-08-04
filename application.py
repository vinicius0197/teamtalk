import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit
import time
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global variables
user_list = []
channel_list = []
messages = []
channel_dict = {}

def add_message_to_channel(channel_name, messages, dict):
    """ Appends messages to channel in dictionary """
    dict[channel_name].append(messages)

    return dict

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/registration", methods=['POST'])
def registration():
    """ Redirects user to channel creation """

    uname = request.form.get("username")
    if uname not in user_list:
        user_list.append(uname)
    else:
        message = "This username is taken"
        return render_template("index.html", message=message)
    return render_template("create_channel.html")

@app.route("/create_channel", methods=['POST'])
def create_channel():
    """ Let user create a new channel """

    channel = request.form.get("channel_name")
    if channel not in channel_list:
        channel_list.append(channel)
        channel_dict[channel] = []
    else:
        message = "This channel already exists"
        return render_template("create_channel.html", message=message)
    return redirect(url_for('channels'))

@app.route("/channels")
def channels():
    """ List of created channels """

    return render_template("channel_home.html", channels=channel_list)

@socketio.on("submit message")
def message(data):
    """ Handles user messages between server and client """
    message = data["message"]
    channel = data["channel"]
    user = data["user"]

    timestamp = time.time()
    st = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

    new_message = user + " | " + st + " : " + message

    add_message_to_channel(channel, new_message, channel_dict)

    # Server should only store the last 100 messages in each channel
    if len(channel_dict[channel]) > 100:
        channel_dict[channel].pop(0)

    emit("announce message", {"user": user, "timestamp": st, "message": message, "channel": channel}, broadcast=True)

@socketio.on("channel selected")
def channelHandler(channelData):
    """ Sends message history to client of current channel """
    current_channel = channelData["current_channel"]
    lastMessages = channel_dict[current_channel]

    emit("display channel", {"channel": current_channel, "messages": lastMessages}, broadcast=False)