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
	};
	function createMessageElement(text) {
		const el = document.createElement('div');
		el.appendChild(document.createTextNode(text));
		el.className = 'message';
		return el;
	};

	function addMessageToListDOM(text) {
		const el = DOM.messages;
		const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
		el.appendChild(createMessageElement(text));
		if (wasTop) {
			el.scrollTop = el.scrollHeight - el.clientHeight;
		}
	}

	function getChannel() {
		return localStorage.getItem('selected_channel');
	}

	function displayChannel() {
		// TODO: uses getChannel() and then updates the .message
		// box to display the last 100 messages in the selected
		// channel
	}

	// Connect to websocket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure button
	socket.on('connect', () => {

		// Selecting a channel should ask server for channel message history
		document.getElementById('channels').querySelectorAll('a').forEach((element) => {
			element.onclick = () => {
				localStorage.setItem('selected_channel', element.innerHTML);
				current_channel = getChannel();

				socket.emit('channel selected', {'current_channel': current_channel});
			};
		});

		// 'Send' button should emit an event
		document.querySelector('.message-form__button').onclick = () => {
			const message = document.querySelector('.message-form__input').value;
			const channel = getChannel();
			socket.emit('submit message', {'message': message, 'channel': channel});
		};
	});

	// When a new message is announced, add it to list
	socket.on('announce message', data => {
		let message = data.message;
		addMessageToListDOM(message);
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