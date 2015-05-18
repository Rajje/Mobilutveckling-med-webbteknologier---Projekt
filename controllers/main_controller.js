MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {
		mainController.loginController = new LoginController(model, mainController, $('#loginView'));
		mainController.mapController = new MapController(model, mainController, $('#mapView'));
		mainController.chatController = new ChatController(model, mainController, $('#chatView'));
		mainController.popupController = new PopUpController(model, mainController, $('#popUpView'));
	});
}