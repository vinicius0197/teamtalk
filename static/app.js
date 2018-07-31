document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#btn').onclick = function () {
		let uname = document.getElementById('uname');
		localStorage.setItem('uname', uname.value);
	}
})