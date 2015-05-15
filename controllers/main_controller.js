MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {

		mainController.loginController = new LoginController(model, mainController, $('#loginView'));
		mainController.homeController = new HomeController(model, mainController, $('#mapView'));
		mainController.chatController = new ChatController(model, mainController, $('#chatView'));
	});
}