MainController = function(model) {
	_this = this;

	var mainController = this;

	this.test = function() {
		model.test();
	}

	this.addSearchHeader = function(view) {
		var header = '<form id="searchForm">\
				<input name="searchInput" type="search" data-inline="true" data-mini="true" placeholder="Search"></input>\
				<div class="ui-grid-a">\
					<div class="ui-block-a">\
							<select name="category" data-mini="true" data-inline="true">\
								<option value="hashtags">Hashtags</option>\
								<option value="users">User</option>\
							</select>\
					</div>\
					<div class="ui-block-b">\
						<button class="ui-btn ui-mini ui-btn-inline ui-corner-all" type="submit" id="searchButton">Search</button>\
					</div>\
				</div>\
			</form>';

		view.append(header);


	}



	$(document).ready(function() {
		_this.addSearchHeader($('[data-role="header"]'));
		mainController.loginController = new LoginController(model, mainController, $('#loginView'));
		mainController.mapController = new MapController(model, mainController, $('#mapView'));
		mainController.chatController = new ChatController(model, mainController, $('#chatView'));
		mainController.popupController = new PopUpController(model, mainController, $('#popUpView'));
	});
}