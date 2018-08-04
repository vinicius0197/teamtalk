// Saves user name in localStorage
document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#btn').onclick = function () {
		let uname = document.getElementById('uname');
		localStorage.setItem('uname', uname.value);
	};
});

// Gets which channel the user has selected and puts that in localStorage
document.addEventListener('DOMContentLoaded', () => {
		document.getElementById('channels').querySelectorAll('a').forEach((element) => {
			element.onclick = () => {
				localStorage.setItem('selected_channel', element.innerHTML);
			};
		});
});

// Handles Socket.IO and updating DOM with new messages
document.addEventListener('DOMContentLoaded', () => {
	const DOM = {
		messages: document.querySelector('.messages'),
		input: document.querySelector('.message-form__input'),
		form: document.querySelector('.message-form'),
	}

	function createMessageElement(text) {
		const el = document.createElement('div');
		el.appendChild(document.createTextNode(text));
		el.className = 'message';
		return el;
	}

	function addMessageToListDOM(text) {
		const el = DOM.messages;
		const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
		el.appendChild(createMessageElement(text));
		if (wasTop) {
			el.scrollTop = el.scrollHeight - el.clientHeight;
		}
	}

	// Gets a channel name saved in localStorage
	function getChannel() {
		return localStorage.getItem('selected_channel');
	}

	// Gets a user name saved in localStorage
	function getUser() {
		return localStorage.getItem('uname');
	}
  
  function cleanMessages() {
    document.querySelector('.messages').querySelectorAll('.message').forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
  }

  function cleanTextBox() {
  	document.querySelector('.message-form__input').value = "";
  }

	// Connect to websocket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure button
	socket.on('connect', () => {

		// Reloads a channel the user has previously visited
		current_channel = getChannel();
		socket.emit('channel selected', {'current_channel': current_channel});

		// Selecting a channel should ask server for channel message history
		document.getElementById('channels').querySelectorAll('a').forEach((element) => {
			element.onclick = () => {
				cleanMessages();
				localStorage.setItem('selected_channel', element.innerHTML);
				current_channel = getChannel();

				socket.emit('channel selected', {'current_channel': current_channel});
			}
		});

		// 'Send' button should emit an event
		document.querySelector('.message-form__button').onclick = () => {
			const message = document.querySelector('.message-form__input').value;
			const channel = getChannel();
			const user = getUser();
			socket.emit('submit message', {'message': message, 'channel': channel, 'user': user});
			cleanTextBox();
		}
	});

	// When a new message is announced, add it to list
	socket.on('announce message', data => {
		let message = data.message;
		let channel = data.channel;
		let timestamp = data.timestamp;
		let user = data.user;
		let selected_channel = getChannel();

		let final_message = user + " | " + timestamp + " : " + message;

		if (channel === selected_channel) {
			addMessageToListDOM(final_message);
		}
	});

	// When a user selects a channel, message history should be displayed
	socket.on('display channel', data => {
		let channel = data.channel;
		let message_history = data.messages;
		let counter = 0;
		
		for(counter = 0; counter < message_history.length; counter ++) {
			addMessageToListDOM(message_history[counter]);
		}
	});
});