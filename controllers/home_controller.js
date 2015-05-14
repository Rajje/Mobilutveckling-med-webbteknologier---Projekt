HomeController = function(model, mainController, view) {
	model.subscribe(this);

	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");
		
		if (msg === "gotAccessToken") {
			model.getLocationIDs();
		} else if (msg === "gotLocationIDs") {
			model.getNearbyMedia();
		} else if (msg === "gotNearbyMedia") {
			this.populateNearbyMedia();
		}
	}

	this.populateNearbyMedia = function() {
		var media = model.nearbyMedia[model.nearbyMedia.length - 1];
		var output = "";
		for (var i = 0; i < media.data.length; i++) {
			output += '<img src="' + media.data[i].images.low_resolution.url + '"/>';
		}
		$("#images").append(output);
	}

	model.getAccessTokenFromUrl();
}