Model = function() {
	this.observers = [];
	this.accessToken = "";
	var model = this;

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

	this.getAccessTokenFromUrl = function() {
		this.accessToken = window.location.hash;
		this.accessToken = this.accessToken.substring(this.accessToken.indexOf("=") + 1);
		this.notifyObservers("gotAccessToken");
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
				this.getHttpError(error);
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
				model.notifyObservers("gotLocationIDs");
			});
	}

	this.getNearbyImages = function() {
		var locationID = this.locationIDs.data[0].id;
		this.getHttp("https://api.instagram.com/v1/locations/" + locationID + "/media/recent?access_token=" + this.accessToken, this.successNearbyImages);
	}

	this.successNearbyImages = function(data) {
		this.nearbyImages = data;
		console.log(data);
	}
}