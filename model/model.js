Message = function(chatMsg, alias) {
	this.chatMsg = chatMsg;
	this.alias = alias;
}

Model = function() {
	this.messages = [];
	this.alias; //TODO get the alias of instagram user name
	this.currentRoom;
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
}