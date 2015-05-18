MapController = function(model, mainController, view) {
	var _this = this;

	this.mapOverlays = [];

	if (!model.loggedIn) {
		model.getAccessTokenFromUrl();
		//$.mobile.navigate("#mapView");
	}

	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");

		if (msg === "gotAccessToken") {
			console.log("mapView");
			$.mobile.navigate("#mapView");
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
				var mediaID = media.data[i].id;

				var content = document.createElement('div');
				content.class = "imageOverlay";
				content.style.width = "50px";
				content.style.height = "50px";

				// var link = document.createElement('a');
				// link.href = "#popupImage";
				// link.setAttribute("data-rel", "popup");

				var img = document.createElement('img');
				img.src = image;
				img.class = "imageOverlayImage";
				img.style.width = "100%";
				img.style.height = "100%";
				img.setAttribute("id", mediaID);
				//link.appendChild(img);
				content.appendChild(img);

				var mapOverlay = (new google.maps.InfoWindow({
					"content": content,
					"position": position,
					"disableAutoPan": true
				}));

				$(content).click(function(event) {
					model.loadImage($(event.target).attr("id"));
				});

				// content.addEventListener("click", function() {
				// 	alert("click");
				// });

				mapOverlay.open(this.map);

				// google.maps.event.addDomListener(mapOverlay, "click", function() {
				// 	console.log("klickade");
				// });

				this.mapOverlays.push(mapOverlay);
			}
		}
	}

	this.foundLocation = function(position) {
		// Anropas när användarens position har fastställts. 
		model.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.setCenter(model.userLocation);
		this.map.setZoom(18);

		model.loadNearbyMedia(model.userLocation);
	}

	this.noLocation = function(message) {
		// Anropas när användarens position EJ kunde fastställas
		console.log(message);
	}

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

	$("#searchForm").submit(function(event) {
		model.clearNearbyMedia();
		model.loadNearbyMedia(model.userLocation, event.target.category.value, event.target.searchInput.value);

		return false;
	});

	model.subscribe(this);
}