import os

from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

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

    # TODO: pensar numa maneira de não termos um KeyError aqui

    # if channel_name not in channel_list:
    #     dict[channel_name] = []

    dict[channel_name] = []
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

# @app.route("/message_handler", methods=['POST'])
# def message_handler():
#     """ Handles sending and receiving messages """

#     message = request.form.get("message_field")
#     messages.append(message)

#     return render_template("channel_home.html", messages=messages)

@socketio.on("submit message")
def message(data):
    """ Handles user messages between server and client """
    message = data["message"]
    channel = data["channel"]

    add_message_to_channel(channel, message, channel_dict)

    emit("announce message", {"message": message}, broadcast=True)

@socketio.on("channel selected")
def channelHandler(channelData):
    """ Sends message history to client of current channel """
    current_channel = channelData["current_channel"]
    print(channel_dict)
    lastMessages = channel_dict[current_channel]

    emit("display channel", {"channel": current_channel, "messages": lastMessages}, broadcast=True)