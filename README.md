# Team Talk

This web app was developed for the CS50 Web Programming with Python and Javascript class. This is a simple web messaging app that can be used as a base for building bigger applications.

The basic architecture of the web app was implemented using websockets (using Socket.IO Javascript library). As it is now, the app supports creating a username and a channel, and sending and receiving messages in real time.

### Objectives

- Get used with Javascript development
- Learn websockets technology (through Socket.IO)
- Get used with client-side web development

### Getting started

First clone the git repository and install the requirements by using:

```
pip3 install -r requirements.txt
```

After that, set the Flask enviroment variable:

```
export FLASK_APP=application.py
```

And run:

```
flask run
```

### Next steps

I will add new functionality to this web app, as in the issues page, and also create a nice front-end.