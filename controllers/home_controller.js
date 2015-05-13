HomeController = function(model, mainController, view) {
	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");
	}

	model.subscribe(this);
	model.test();
}