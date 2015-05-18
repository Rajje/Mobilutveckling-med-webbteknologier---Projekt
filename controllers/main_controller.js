MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	this.setContentSize = function() {
		var activePage = $('.ui-page-active').attr('id');
		var screenHeight = $(window).height();
		var screenHeader = $('[data-role="header"]', this).height();
		var screenFooter = $('[data-role="footer"]', this).height();
		var chatScreenBar = $('#chatBar').height();
		var currentRoom = $('#currentRoom').height();
		var mapContentHeight = screenHeight - screenHeader - screenFooter - 2;
		var chatContentHeight = screenHeight - screenHeader - screenFooter - chatScreenBar - 2 - currentRoom;
		$('#map').height(mapContentHeight + "px");
		$('#messageGrid').height(chatContentHeight + "px");
	}

	this.addSearchHeader = function(view) {
		var header = '<form class="searchForm">\
				<input name="searchInput" type="search" data-inline="true" data-mini="true" placeholder="Search"></input>\
				<div id="searchResults"></div>\
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
		mainController.addSearchHeader($('[data-role="header"]'));
		mainController.loginController = new LoginController(model, mainController, $('#loginView'));
		mainController.mapController = new MapController(model, mainController, $('#mapView'));
		mainController.chatController = new ChatController(model, mainController, $('#chatView'));
		mainController.popupController = new PopUpController(model, mainController, $('#popUpView'));
		
		$(".searchForm").submit(function(event) {
			console.log("clicked search");
			model.setChannel(model.userLocation, event.target.category.value, event.target.searchInput.value);
			model.clearNearbyMedia();
			mainController.mapController.displaySearching();
			model.loadNearbyMedia(mainController.mapController.map.getCenter(), event.target.category.value, event.target.searchInput.value);
			return false;
		});
	});

		$(document).on("pageshow","#mapView", this.setContentSize);
		$(document).on("pageshow","#chatView", this.setContentSize);
		window.addEventListener("resize", this.setContentSize);		
	}
