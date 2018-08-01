document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#btn').onclick = function () {
		let uname = document.getElementById('uname');
		localStorage.setItem('uname', uname.value);
	};
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
		};
	};

	// Connect to websocket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure button
	socket.on('connect', () => {

		// 'Send' button should emit an event
		document.querySelector('.message-form__button').onclick = () => {
			const message = document.querySelector('.message-form__input').value;
			socket.emit('submit message', {'message': message});
		};
	});

	// When a new message is announced, add it to list
	socket.on('announce message', data => {
		let message = data.message;
		addMessageToListDOM(message);
	});
});
