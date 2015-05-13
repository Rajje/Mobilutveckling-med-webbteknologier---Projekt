MainController = function(model) {
	mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {
		HomeController(model, mainController, $("#homeView"));
	});
}