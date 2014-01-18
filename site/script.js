window.addEventListener('load', functionality, false);


function functionality () {
	var menu = document.getElementById('additional-menu'),
		content = document.getElementById('content').children;
	
	menu.addEventListener('click', chooseMenuPoint, false);

	function chooseMenuPoint (event) {
		event = event || window.event;
    	var target  = event.target||event.srcElement;

    	if (target.tagName == 'LI') {
    		hideContent();
    		showContent(target.id);
    	}
	}

	function hideContent () {
		for (var i = 0; i < content.length; i++) {
			content[i].style.display = 'none';
		};
	}

	function showContent (id) {
		switch (id) {
			case 'new' : document.getElementById('news').style.display = 'block'; break;
			case 'uni' : document.getElementById('university').style.display = 'block'; break;
			case 'his' : document.getElementById('history').style.display = 'block'; break;
			case 'mem' : document.getElementById('members').style.display = 'block'; break;
			case 'sci' : document.getElementById('science').style.display = 'block'; break;
			case 'met' : document.getElementById('methodology').style.display = 'block'; break;
			case 'con' : document.getElementById('contacts').style.display = 'block'; break;
		}
	}
}