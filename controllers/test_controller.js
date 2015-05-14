TestController = function(model, mainController, view) {
	this.update = function(msg) {
		console.log("t")
		$('#test').append('<p>test</p>');
	}

	model.subscribe(this);

	this.update();
}
TestController()