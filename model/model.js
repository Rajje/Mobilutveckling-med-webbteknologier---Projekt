var currentRoom;
var alias;

Model = function() {
	this.observers = [];

	this.test = function() {
		console.log("test");
		this.notifyObservers("test");
	}

	this.subscribe = function(controller) {
		this.observers.push(controller);
	}

	this.notifyObservers = function(msg) {
		for (i in this.observers) {
			this.observers[i].update(msg);
		}
	}
	
	//CHAT TODO
	this.initChat = function(){
		var randomID = PUBNUB.uuid();
		chatChannel = PUBNUB.init({
			publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
			subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f',
			uuid: randomID
		});
		var alias; //TODO get the alias of instagram user name
	}
	
	this.subscribeToChat = function(roomName, chatWindow){
		chatChannel.subscribe({
		      channel: roomName,
		      message: function(m){chatWindow.value = m + '\n' + chatWindow.value},
		      connect: function(){console.log("Connected"); subscribed = true},
		      disconnect: function(){console.log("Disconnected")},
		      reconnect: function(){console.log("Reconnected")},
		      error: function(){console.log("Network Error")},
	 	});		
		currentRoom = roomName;
	}
	
	this.numberInChat = function(){
	}
	
	this.sendMessage = function(msg) {
		chatChannel.publish({channel: currentRoom, message : msg});
	}
	
	this.leaveChat = function(){
		PUBNUB.unsubscribe({
			channel: currentRoom,
		});
	}
	
	this.getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else { 
			alert("Geolocation is not supported by this browser.");
		}
	}
	this.showPosition = function() {
		function showPosition(position) {
			convertLocation(position.coords.latitude, position.coords.longitude);	
		}
	}
	
	this.convertLocation = function(lat, lng) {
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				var msg = "+alias+"' enter the chatroom from "+results[0].formatted_address;
				chatChannel.publish({channel: currentRoom, message : msg});
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}
	
}