var app = new appBuilder();

mediator.subscribe('appDataLoaded', app.buildView);
mediator.subscribe('appOpened', app.configSocialBtnsListeners);
mediator.subscribe('appClose', app.close);
mediator.subscribe('imgLoaded', app.requestInboxOpen);

loadAppData();


function loadAppData () {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'http://loopme.me/api/v2/ads?p=1&vt=zi1sa9rfwr&ak=56fabfc17f&pp=1', true);
	xhr.onreadystatechange = function() {
		/*if (this.readyState != 4) {
			app.appData = xhr.responseText;
		}*/
		// Spike for cross-domain request
		app.appData = response;
		mediator.publish('appDataLoaded', null);
	};
	xhr.send(null);
}

function sendGetRequest (url) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {};
	xhr.send(null);
}

function appBuilder () {
	var viewId = 'appView', 
		appView = configureView(),
		socialBtnsActions = {
			'likeBtn': addLike,
			'dislikeBtn': removeLike,
			'showBtn': showApp,
			'shareBtn': shareApp
		};

	this.buildView = function () {
		document.getElementById('viewport').appendChild(appView);
		mediator.publish('appOpened', null);
	};

	this.close = function () {
		var url = response.session.beacons.ad_close;

		document.getElementById('viewport').removeChild(appView);
		sendGetRequest(url);
	};

	this.configSocialBtnsListeners = function () {
		var navigation = document.getElementById('navigationPanel');

		navigation.addEventListener('click', socialBtnsHandler, false);
	};

	this.requestInboxOpen = function () {
		var url = response.session.beacons.inbox_open;

		sendGetRequest(url);
	};

	function socialBtnsHandler (e) {
		var target = e && e.target || event.srcElement,
			action = target.getAttribute('id');

		socialBtnsActions[target.parentNode.id]();
	}

	function configureView () {
		var view,
			closeBtn,
			picture,
			downloadBtn,
			navigationPanel,
			likeBtn,
			dislikeBtn,
			showBtn,
			shareBtn,
			downloadLink;

		view = document.createElement('div');
		view.id = viewId;

		closeBtn = document.createElement('button');
		closeBtn.id = 'closeBtn';
		closeBtn.innerHTML = 'x';
		closeBtn.addEventListener('click', function () { mediator.publish('appClose', null); }, false);

		picture = document.createElement('img');
		picture.id = 'logo';
		picture.src = response.ads[0].data.image_url;
		picture.addEventListener('load', function () { mediator.publish('imgLoaded', null); }, false);

		downloadBtn = document.createElement('button');
		downloadBtn.id = 'downloadBtn';
		downloadBtn.style.cssText = 'background-color: ' + response.ads[0].data.download_btn_color;

		downloadLink = document.createElement('a');
		downloadLink.id = 'downloadLink';
		downloadLink.href = response.ads[0].data.click_url; // should be uri application downloading
		downloadLink.innerHTML = 'Free Download';
		downloadLink.setAttribute('download', 'download');

		downloadBtn.appendChild(downloadLink);

		navigationPanel = document.createElement('div');
		navigationPanel.id = 'navigationPanel';

		likeBtn = document.createElement('button');
		likeBtn.id = 'likeBtn';
		likeBtn.innerHTML = '<img src=' + icons.likeBtn + '>';
		dislikeBtn = document.createElement('button');
		dislikeBtn.id = 'dislikeBtn';
		dislikeBtn.innerHTML = '<img src=' + icons.dislikeBtn + '>';
		showBtn = document.createElement('button');
		showBtn.id = 'showBtn';
		showBtn.innerHTML = '<img src=' + icons.showBtn + '>';
		shareBtn = document.createElement('button');
		shareBtn.id = 'shareBtn';
		shareBtn.innerHTML = '<img src=' + icons.shareBtn + '>';

		navigationPanel.appendChild(likeBtn);
		navigationPanel.appendChild(dislikeBtn);
		navigationPanel.appendChild(showBtn);
		navigationPanel.appendChild(shareBtn);

		view.appendChild(closeBtn);
		view.appendChild(picture);
		view.appendChild(downloadBtn);
		view.appendChild(navigationPanel);

		return view;
	};

	function addLike () {
		var url = response.ads[0].beacons.ad_like,
			data = response.ads[0].data.ad_likes.value;

		sendGetRequest(url);
		localStorage.setItem('likes', data + 1);
	};

	function removeLike () {
		var url = response.ads[0].beacons.ad_hide,
			data = response.ads[0].data.ad_hides.value;
		
		sendGetRequest(url);
		localStorage.setItem('likes', data - 1);
	};

	function showApp () {
		var url = response.ads[0].beacons.ad_show;
		
		sendGetRequest(url);
	};

	function shareApp () {
		var url = response.ads[0].beacons.ad_share,
			data = response.ads[0].data.ad_shares.value;
		
		sendGetRequest(url);
		localStorage.setItem('shares', data + 1);
		googleShare();
	};

	function googleShare () {
		var shareURL = window.location.toString();

		window.open("https://plus.google.com/share?url=" + shareURL, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	};

	return this;
}