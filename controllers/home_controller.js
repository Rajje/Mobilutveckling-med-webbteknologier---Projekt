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

	this.imageContainerLeft = 40;

	this.populateNearbyMedia = function() {
		var media = model.nearbyMedia[model.nearbyMedia.length - 1];
		if (media.data.length > 0) {
			console.log(media.data.length);
			this.imageContainerLeft += 200;
			var top = 200;
			var deg = 7;
			var output = '<div class="imgContainer" style="left: ' + this.imageContainerLeft + 'px; top: ' + top + 'px;">';
			for (var i = 0; i < media.data.length; i++) {
				output += '<img class="imgThumb" src="' + media.data[i].images.low_resolution.url + '" style="transform: rotate(' + deg + 'deg); -webkit-transform: rotate(' + deg + 'deg);"/>';
				deg += 7;
			}
			output += '</div>';
			$("#images").append(output);
		}
	}

	if (!model.loggedIn) {
		model.getAccessTokenFromUrl();
	}
}