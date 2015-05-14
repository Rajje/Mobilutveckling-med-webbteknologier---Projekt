MainController = function(model) {
	mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {
		if(window.location.hash === "") {
			LoginController(model, mainController, $("#loginView"));
		} else {
			HomeController(model, mainController, $("#homeView"));
		}
	});
}