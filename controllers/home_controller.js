HomeController = function(model, mainController, view) {
	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");

		if (msg === "gotAccessToken") {
			model.getLocationIDs();
		} else if (msg === "gotLocationIDs") {
			model.getNearbyImages();
		}
	}
	model.subscribe(this);

	model.getAccessTokenFromUrl();

	
	model.test();
}