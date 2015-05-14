MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	$(document).ready(function() {

		this.loginController = new LoginController(model, mainController, $('#loginView'));
		this.homeController = new HomeController(model, mainController, $('#homeView'));
		this.chatView = new ChatController(model, mainController, $('#chatView'));
		if(!model.cameFromInstagramLogin()) {
			mainController.showView('loginView');
		} else {
			mainController.showView('homeView');
		}
	});

	this.showView = function(thePage) {
		$('.view').hide();
    	$('#' + thePage).show();
    	//this.theControllers[thePage];
	}
}