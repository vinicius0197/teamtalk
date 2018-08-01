document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#btn').onclick = function () {
		let uname = document.getElementById('uname');
		localStorage.setItem('uname', uname.value);

		// open AJAX request and send data to show in template
		// and warn server to redirect to channels page
	}
});

// document.addEventListener('DOMContentLoaded', function() {
// 	if (localStorage.getItem('uname')) {
// 		const request = new XMLHttpRequest();
// 		request.open('GET', "/channels");
// 		request.send();
// 	}
// 	return false;
// });