MapController = function(model, mainController, view) {
	var _this = this;

	if (!model.loggedIn) {
		model.getAccessTokenFromUrl();
	}

	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");

		if (msg === "gotNearbyMedia") {
			this.populateNearbyMedia();
		}
	}

	// this.imageContainerLeft = 40;

	this.populateNearbyMedia = function() {
		var media = model.getLatestNearbyMedia();
		if (media.data.length > 0) {
			for (var i in media.data) {
				var image = media.data[i].images.thumbnail.url;
				var latitude = media.data[i].location.latitude;
				var longitude = media.data[i].location.longitude;
				var position = new google.maps.LatLng(latitude, longitude);

				model.addMarker(this.map, position, image);
			}
		}
	}


	// this.addMarkers = function() {
	// 	// Lägger till bilder i kartan 
	// 	model.addMarker(this.map, model.userLocation, "ulf.jpg"); // än så länge bara en testbild, på användarens position
	// }

	this.foundLocation = function(position) {
		// Anropas när användarens position har fastställts. 
		model.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.setCenter(model.userLocation);
		this.map.setZoom(18);

		// model.loadLocationIDs(model.userLocation);

		model.loadNearbyMedia(model.userLocation);

		//this.addMarkers();
	}

	this.noLocation = function(message) {
		// Anropas när användarens position EJ kunde fastställas
		console.log(message);
	}

	
	// google.maps.event.addDomListener(document.getElementById('mapView'), 'load', function() {
	$(document).on("pageshow", "#mapView", function() {
		console.log("map init");
		// Infogar en Google-karta i elementet med id "map"
		_this.map = model.getMap(STANDARD_LONG, STANDARD_LAT, STANDARD_ZOOM, document.getElementById('map')); // Skapa ny karta positionnerad på standardplatsen

		navigator.geolocation.getCurrentPosition( // hämta användarens position
			function(position) { // callback om position hittas
				_this.foundLocation(position);
			},
			function(position) { // callback om position EJ hittas
				_this.noLocation(position);
			}
		);
	});

	model.subscribe(this);
}