MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {

		this.loginController = new LoginController(model, mainController, $('#loginView'));
		this.homeController = new HomeController(model, mainController, $('#mapView'));
		this.chatController = new ChatController(model, mainController, $('#chatView'));
	});
}