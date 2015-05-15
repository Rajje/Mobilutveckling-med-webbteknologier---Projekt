Message = function(chatMsg, alias) {
	this.chatMsg = chatMsg;
	this.alias = alias;
}

Model = function() {
	this.messages = [];
	this.alias; //TODO get the alias of instagram user name
	this.currentRoom;
	this.observers = [];
	this.accessToken = "";
	this.loggedIn = false;
	this.nearbyMedia = [];
	this.locationIDs = null;
	
	var model = this;
	this.test = function() {
		console.log("test");
		this.notifyObservers("test");
	}
	
	this.subscribe = function(controller) {
		this.observers.push(controller);
	}
	
	this.notifyObservers = function(msg) {
		for (var i in this.observers) {
			this.observers[i].update(msg);
		}
	}

	this.cameFromInstagramLogin = function() {
		if (window.location.hash === "") {
			return false;
		} else {
			return true;
		}
	}

	this.getAccessTokenFromUrl = function() {
		if(window.location.hash !== "") {
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

	this.getLocationIDs = function() {
		this.getHttp("https://api.instagram.com/v1/locations/search?lat=59.34045571&lng=18.03018451&access_token=" + this.accessToken, 
			function(data) {
				model.locationIDs = data;
				console.log(data);
				model.notifyObservers("gotLocationIDs");
			}
		);
	}

	this.getNearbyMedia = function() {
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
	
	this.getUserInfo = function() {
		console.log("user info");
		console.log(this.getHttp("https://api.instagram.com/v1/users/{self}}/?access_token="+ this.accessToken));
	}
	
	//Function that init PUBNUB chat
	this.initChat = function(){
		//var randomID = PUBNUB.uuid();
		chatChannel = PUBNUB.init({
			publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
			subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f',
			uuid: this.alias
		});
	}
	
	this.getMessages = function() {
		return this.messages;
	}
	
	//Function that subscribes to a specific chat channel
	this.subscribeToChat = function(roomName, chatWindow){
		chatChannel.subscribe({
		      channel: roomName,
		      message: function(m){
					this.messages.push(m);
					this.notifyObservers("newMessage");
			  },
		      connect: function(){console.log("Connected"); subscribed = true},
		      disconnect: function(){console.log("Disconnected")},
		      reconnect: function(){console.log("Reconnected")},
		      error: function(){console.log("Network Error")},
	 	});		
		this.currentRoom = roomName;
	}
	
	//Function for sending message in chat
	this.sendMessage = function(chatMsg) {
		chatChannel.publish({channel: this.currentRoom, message : new Message(chatMsg, this.alias)});
	}
	
	//Function for unsubscribing from a chat channel
	this.leaveChat = function(){
		PUBNUB.unsubscribe({
			channel: this.currentRoom,
		});
	}
}
