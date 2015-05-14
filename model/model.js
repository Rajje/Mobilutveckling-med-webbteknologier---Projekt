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
	
	this.subscribeToChat = function(){
	}
	
	this.numberInChat = function(){
	}
	
	this.sendMessage = function(msg) {
		chatChannel.publish({channel: currentRoom, message : msg});
	}
}