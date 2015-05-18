Model = function() {
	this.observers = [];
	this.accessToken = "";
	this.loggedIn = false;
	this.loggedIn = false;
	this.nearbyMedia = [];
	this.locationIDs = null;
	this.popupImage = {};

	//For chat
	this.user = "";
	this.currentChannel = "";
	this.newMessage;
	this.chatChannel;
	this.color;
	
	var model = this;

	this.test = function() {
		console.log("test");
		this.notifyObservers("test");
	}

	this.notifyObservers = function(msg) {
		for (var i in this.observers) {
			this.observers[i].update(msg);
		}
	}

	this.foundLocation = function(position) {
		// Anropas när användarens position har fastställts. 
		this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.notifyObservers("foundLocation");
		this.setChannel(this.userLocation, "", ""); // ska kompletteras med hur funktionen faktiskt ska anropas
	}

	this.noLocation = function(message) {
		// Anropas när användarens position EJ kunde fastställas
		console.log(message);
	}

	this.locateUser = function() {
		navigator.geolocation.getCurrentPosition( // hämta användarens position
			function(position) { // callback om position hittas
				model.foundLocation(position);
			},
			function(position) { // callback om position EJ hittas
				model.noLocation(position);
			}
		);
	}
	
	this.subscribe = function(controller) {
		this.observers.push(controller);
	}

	this.cameFromInstagramLogin = function() {
		if (window.location.hash === "") {
			return false;
		} else {
			return true;
		}
	}

	this.getAccessTokenFromUrl = function() {
		console.log(window.location.hash.substring(1, 13));
		if(window.location.hash.substring(1, 13) === "access_token") {
			this.accessToken = window.location.hash;
			this.accessToken = this.accessToken.substring(this.accessToken.indexOf("=") + 1);
			this.loggedIn = true;
			console.log("gotAccessToken");
			this.notifyObservers("gotAccessToken");
		}
	}

	this.getHttp = function(url, successFunction) {
		$.ajax({
			'type': 'GET',
			'dataType': 'jsonp',
			'cache': false,
			'url': url,
			'success': function(data) {
				successFunction(data);
			},
			'error': function(xhr, status, error) {
				model.getHttpError(error);
			}
		});
	}

	this.getHttpError = function(error) {
		console.log(error);
	}

	this.loadLocationIDs = function(position, distance) {
		var latitude = position.A;
		var longitude = position.F;
		if (!distance) var distance = 1000;
		this.getHttp("https://api.instagram.com/v1/locations/search?lat=" + latitude + "&lng=" + longitude + "&distance=" + distance + "&access_token=" + this.accessToken, 
			function(data) {
				model.locationIDs = data;
				model.notifyObservers("gotLocationIDs");
				model.loadNearbyMedia();
			}
		);
	}

	this.loadMediaFromLocations = function() {
		console.log(this.locationIDs.data.length);
		for (var i = 0; i < this.locationIDs.data.length; i++) {
			var locationID = this.locationIDs.data[i].id;
			this.getHttp("https://api.instagram.com/v1/locations/" + locationID + "/media/recent?access_token=" + this.accessToken,
				function(data) {
					model.nearbyMedia.push(data);
					model.notifyObservers("gotNearbyMedia");
				}
			);
		}
	}

	this.numberOfNearbyMedia = function() {
		var length = 0;

		for (i in model.nearbyMedia) {
			length += model.nearbyMedia[i].data.length;
		}

		return length;
	}

	this.filterMedia = function(data, category, searchString) {
		var filteredData = {
			data: [], 
			meta: data.meta
		};

		if (category == "hashtags") {
			for (var i in data.data) {
				var tagFound = false;

				for (var j in data.data[i].tags) {
					if (data.data[i].tags[j].toLowerCase() == searchString.toLowerCase()) tagFound = true;
				}

				if (tagFound) filteredData.data.push(data.data[i]); // om taggen finns i detta objekt, spara objektet i filteredData
			}
		} else if (category == "users") {
			for (var i in data.data) {
				var userData = data.data[i].user;
				if (userData.full_name.toLowerCase() == searchString.toLowerCase() || userData.id.toLowerCase() == searchString.toLowerCase() || userData.username.toLowerCase() == searchString.toLowerCase()) {
					filteredData.data.push(data.data[i]);
				}
			}
		}

		return filteredData;
	}
	
	this.setChannel = function(data, category, searchString) {
		model.notifyObservers("newChannel");
		this.leaveChat();
		
		var resolution = 2;
		var lat = data.A;
		var lang = data.F;
		var position = this.geoHash(lat, 2)+ " "+ this.geoHash(lang,2);
		
		if(category = "hashtags"){						
				this.currentChannel = position +searchString;
		}
		else{
				this.currentChannel = position;
		}
		console.log("subscribed to :"+this.currentChannel);
		this.subscribeToChat();
	}
	
	this.geoHash = function(coord, resolution) {
		var rez = Math.pow( 10, resolution || 0);
		return Math.floor(coord * rez) / rez;
	}

	this.loadImage = function(mediaID, nI, nJ) {
		console.log(nI + " "+  nJ);
		this.setPopupImagePosition(nI, nJ);
		this.getHttp("https://api.instagram.com/v1/media/" + mediaID + "?access_token=" + this.accessToken,
			function(data, nI, nJ) {
				model.setPopupImage(data.data);
				model.notifyObservers("loadImage");
			}
		);
	}

	this.setPopupImagePosition = function(nI, nJ) {
		this.popupImage.nI = nI;
		this.popupImage.nJ = nJ;
	}

	this.setPopupImage = function(data, nI, nJ) {
		this.popupImage.id = data.id;
		this.popupImage.url = data.images.standard_resolution.url;
		this.popupImage.width = data.images.standard_resolution.width;
		this.popupImage.height = data.images.standard_resolution.height;
		this.popupImage.caption = data.caption;
		this.popupImage.comments = data.comments;
	}

	this.getNextPopupImage = function() {
		var nI = parseInt(this.popupImage.nI);
		var nJ = parseInt(this.popupImage.nJ) + 1;
		if (nJ >= this.nearbyMedia[nI].data.length) {
			nJ = 0;
			if (nI >= this.nearbyMedia.length - 1) {
				nI = 0;
			} else {
				nI += 1;
			}
		}
		console.log(nI + " "+  nJ);

		this.setPopupImagePosition(nI, nJ);
		this.setPopupImage(this.nearbyMedia[nI].data[nJ]);
		this.notifyObservers("nextPopupImage");
	}

	this.getPreviousPopupImage = function() {
		//hitta bilden som nu visas i listan med all media
		var nI = parseInt(this.popupImage.nI);
		var nJ = parseInt(this.popupImage.nJ) - 1;

		if (nJ < 0) {
			if (nI <= 0) {
				nI = this.nearbyMedia.length - 1;
			} else {
				nI -= 1;
			}
			nJ = this.nearbyMedia[nI].data.length - 1;
		}
		console.log(nI + " "+  nJ);

		this.setPopupImagePosition(nI, nJ);
		this.setPopupImage(this.nearbyMedia[nI].data[nJ]);
		this.notifyObservers("nextPopupImage");
		
	}

	this.loadNearbyMedia = function(position, category, searchString, maxTimestamp, count) {
		// Hämtar bilder från Instagram tagna på angiven position och sparar dem i modellen
		var latitude = position.A;
		var longitude = position.F;
		var distance = 500;
		var count = count ? count : 0;

		this.getHttp("https://api.instagram.com/v1/media/search?lat=" + latitude + "&lng=" + longitude + "&distance=" + distance + "&max_timestamp=" + maxTimestamp + "&access_token=" + this.accessToken,
			function(data) {
				var oldestTimestamp = data.data[data.data.length - 1].created_time; // den sista bilden i arrayen har det äldsta datumet

				if ((data.data.length > 0) && searchString) data = model.filterMedia(data, category, searchString);
				if (data.data.length > 0) {
					model.nearbyMedia.push(data); // spara bunten med hittade bilder
					model.notifyObservers("gotNearbyMedia");
				}

				count += 1;

				if ((model.numberOfNearbyMedia() < 20) && (count <= MAX_REQUESTS)) { // om färre än 20 bilder har hittats eller tills 5 sökningar har gjorts
					model.loadNearbyMedia(position, category, searchString, oldestTimestamp, count); // kör funktionen igen rekursivt fr.o.m. det äldsta hittade datumet
				} else {
					model.notifyObservers("loadNearbyMedia_done");
				}
			}
		);
	}

	this.clearNearbyMedia = function() {
		this.nearbyMedia = [];
		this.notifyObservers("nearbyMediaCleared");
	}

	this.getLatestNearbyMedia = function() {
		return this.nearbyMedia[this.nearbyMedia.length - 1];
	}
	
	this.getColor = function() {
		return this.color;
	}

	this.getUserInfo = function() {
		this.color = this.randomColorGenerator();
		this.getHttp("https://api.instagram.com/v1/users/self/?access_token=" + this.accessToken,
			function(data) {
					this.user = new User(data.data.username, data.data.profile_picture, data.data.full_name);
			});
	}
	
	this.getNewUserInfo = function(alias) {
		var r = $.Deferred();
		this.getHttp("https://api.instagram.com/v1/users/search?q="+alias+"&access_token=" + this.accessToken,
			function(data){
				var theUser; 
				if(data.data.length > 1){
					console.log("checking");
					for(var i = 0; i < data.data.length; i++){
						if(data.data[i].username == alias){
							theUser = data.data[i];
							break;
						}
					}
				}
				else{
					theUser = data.data;
				}
					this.other = new User(theUser.username , theUser.profile_picture, theUser.full_name);
					r.resolve();
			});
			
		return r;
	}
	
	this.getUser = function() {
		return user;
	}
	
	this.getOther = function() {
		return other;
	}
	
	this.getAlias = function() {
			return user.alias;
	}
	
	this.getNewUser = function(alias) {
			this.getNewUserInfo(alias).done(function (){
				model.notifyObservers("loadPopup");
			});
	}
	
	this.randomColorGenerator = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	//Function that init PUBNUB chat
	this.initChat = function(){
		var randomID = PUBNUB.uuid();
		this.chatChannel = PUBNUB.init({
			publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
			subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f',
			uuid: randomID
		});
		
		console.log("chat init");
	}
	
	this.getMessages = function() {
		return this.newMessage;
	}
	
	//Function that subscribes to a specific chat channel
	this.subscribeToChat = function(){
		if(this.currentChannel == ""){
				//console.log(model.Location);
				this.currentChannel = "123";
		}
		this.chatChannel.subscribe({
		      channel: this.currentChannel,
		      message: function(m){
					model.newMessage = m;
					model.notifyObservers("newMessage");
			  },
		      connect: function(){console.log("Connected"); subscribed = true},
		      disconnect: function(){console.log("Disconnected")},
		      reconnect: function(){console.log("Reconnected")},
		      error: function(){console.log("Network Error")},
	 	});		
	}
	
	//Function for sending message in chat
	this.sendMessage = function(chatMsg) {
		if(chatMsg != ""){
			this.chatChannel.publish({channel: this.currentChannel, message : new Message(chatMsg, user.alias, this.color, user.profileImage)});
		}
	}
	
	//Function for unsubscribing from a chat channel
	this.leaveChat = function(){
		PUBNUB.unsubscribe({
			channel: this.currentChannel,
		});
	}

	this.getMap = function(latitude, longitude, zoom, view) {
		// Tar emot lat, long, zoom och DOM-element. Skapar karta, returnerar kartan, infogar kartan i elementet. 
		var mapOptions = {
			center: {lat: latitude, lng: longitude},
			zoom: zoom,
			mapTypeId: google.maps.MapTypeId.google_earhtview,
			disableDefaultUI: true
		};

		var map = new google.maps.Map(view, mapOptions);

		return map;
	}

	this.addMarker = function(map, position, image) {
		// Tar emot en karta, ett positionsobjekt och en bild. Lägger till bilden på den positionen i den kartan. 
		if (image) {
			new google.maps.Marker({
				map: map, 
				position: position,
				draggable: true,
				icon: image
			});
		} else {
			new google.maps.Marker({
				map: map, 
				position: position,
				draggable: true,
			});
		}
	}
}
