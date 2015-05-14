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
}