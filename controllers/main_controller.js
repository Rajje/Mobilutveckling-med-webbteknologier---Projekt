MainController = function(model) {
	mainController = this;
	this.theControllers = {
		'loginView': new Login_controller(model, mainController, $('#loginView')), 
		'homeView': new Home_controller(model, mainController, $('#homeView')), 
		'mapView': new Map_controller(model, mainController, $('#mapView')), 
		'chatView': new Chat_controller(model, mainController, $('#chatView'))
	};

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

	this.showView = function(thePage) {
		var views = $('.view');
    	for (var i=0; i < views.length; i++) {
    		views[i].hide();
   		}
    	$('#' + thePage).show();
    	this.theControllers[thePage];
	}
}