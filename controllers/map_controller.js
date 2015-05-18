MapController = function(model, mainController, view) {
	var _this = this;

	this.mapOverlays = [];

	if (!model.loggedIn) {
		model.getAccessTokenFromUrl();
		//$.mobile.navigate("#mapView");
	}

	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");

		if (msg === "foundLocation") {
			this.map.setCenter(model.userLocation);
			this.map.setZoom(18);
			model.loadNearbyMedia(model.userLocation);
		} else if (msg === "gotNearbyMedia") {
			this.populateNearbyMedia();
		} else if (msg === "nearbyMediaCleared") {
			for (var i in this.mapOverlays) this.mapOverlays[i].close();
			this.mapOverlays = [];
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
				var content = document.createElement('div');
				content.class = "imageOverlay";
				content.style.width = "50px";
				content.style.height = "50px";

				var img = document.createElement('img');
				img.src = image;
				img.class = "imageOverlayImage";
				img.style.width = "100%";
				img.style.height = "100%";
				content.appendChild(img);


				var mapOverlay = (new google.maps.InfoWindow({
					"content": content,
					"position": position,
					"disableAutoPan": true
				}));

				content.addEventListener("click", function() {
					alert("click");
				});

				mapOverlay.open(this.map);

				google.maps.event.addDomListener(mapOverlay, "click", function() {
					console.log("klickade");
				});

				this.mapOverlays.push(mapOverlay);
			}
		}
	}

	$(document).on("pageshow", view, function() {
		// Infogar en Google-karta i elementet med id "map"
		_this.map = model.getMap(STANDARD_LONG, STANDARD_LAT, STANDARD_ZOOM, document.getElementById('map')); // Skapa ny karta positionnerad på standardplatsen
		model.locateUser();
	});

	$("#searchForm").submit(function(event) {
		model.setChatChannel(model.userLocation, event.target.category.value, event.target.searchInput.value);
		model.clearNearbyMedia();
		model.loadNearbyMedia(_this.map.getCenter(), event.target.category.value, event.target.searchInput.value);
		return false;
	});

	model.subscribe(this);
}