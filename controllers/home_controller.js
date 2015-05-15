HomeController = function(model, mainController, view) {
	var _this = this;
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
	if (!model.loggedIn) {
		model.getAccessTokenFromUrl();
	}

	this.addMarkers = function() {
		// Lägger till bilder i kartan 
		model.addMarker(this.map, model.userLocation, "ulf.jpg"); // än så länge bara en testbild, på användarens position
	}

	this.foundLocation = function(position) {
		// Anropas när användarens position har fastställts. 
		model.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.setCenter(model.userLocation);
		this.map.setZoom(18);

		this.addMarkers();
	}

	this.noLocation = function(message) {
		// Anropas när användarens position EJ kunde fastställas
		console.log(message);
	}

	
	google.maps.event.addDomListener(window, 'load', function() {
		// Infogar en Google-karta i elementet med id "map"
		_this.map = model.getMap(STANDARD_LONG, STANDARD_LAT, ZOOM, document.getElementById('map')); // Skapa ny karta positionnerad på standardplatsen

		navigator.geolocation.getCurrentPosition( // hämta användarens position
			function(position) { // callback om position hittas
				_this.foundLocation(position)
			},
			function(position) { // callback om position EJ hittas
				_this.noLocation(position)
			}
		);
	});
	
}