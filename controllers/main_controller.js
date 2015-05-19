MainController = function(model) {
	var mainController = this;

	this.test = function() {
		model.test();
	}

	this.setContentSize = function() {
		// Ändrar storleken på huvudinnehållet beroende på fönstrets storlek
		var activePage = $('.ui-page-active').attr('id');
		var screenHeight = $(window).height();

		var mapHeader = $('#mapHeader').height();
		var chatHeader = $('#chatHeader').height();

		var mapFooter = $('#mapFooter').height();
		var chatFooter = $('#chatFooter').height();


		var chatScreenBar = $('#chatBar').height();
		var theRoom = $('#currentRoom').height();
		var posButton = $('#positionButton').height();
		var mapContentHeight = screenHeight - mapHeader - mapFooter - posButton - 2;
		var chatContentHeight = screenHeight - chatHeader - chatFooter - chatScreenBar - theRoom - 2;
		$('#map').height(mapContentHeight + "px");
		$('#messageGrid').height(chatContentHeight + "px");


	}

	this.addSearchHeader = function(view) {
		// Sidhuvudet med sökrutan, genererad genom script överst på både map view och chat view. 
		var header = '<form class="searchForm">\
				<input name="searchInput" type="search" data-inline="true" data-mini="true" placeholder="Search" class="searchInput"></input>\
				<div id="searchResults"></div>\
				<div class="ui-grid-b">\
					<div class="ui-block-a">\
						<select name="category" data-mini="true" data-inline="true">\
							<option value="hashtags">Hashtags</option>\
							<option value="users">User</option>\
						</select>\
					</div>\
					<div class="ui-block-c"><p style="text-align:center; font-size:50%;" class ="currentRoom"></p></div>\
					<div class="ui-block-c">\
						<button class="ui-btn ui-mini ui-btn-inline ui-corner-all" type="submit" id="searchButton">Search</button>\
					</div>\
				</div>\
			</form>';

		view.append(header);
	}

	$(document).ready(function() {
		// Starta alla controllers i början. 
		// Det fanns en tanke om att chat och allt alltid skulle vara i gång i bakgrunden och att man skulle få notifieringar, men det hanns inte med. 
		mainController.addSearchHeader($('[data-role="header"]'));
		mainController.loginController = new LoginController(model, mainController, $('#loginView'));
		mainController.mapController = new MapController(model, mainController, $('#mapView'));
		mainController.chatController = new ChatController(model, mainController, $('#chatView'));
		mainController.popupController = new PopUpController(model, mainController, $('#popUpView'));
		
		$(".searchForm").submit(function(event) {
			model.currentTag = event.target.searchInput.value;
			var location = mainController.mapController.map.getCenter()
			var category = event.target.category.value;
			var zoom = mainController.mapController.map.getZoom();
			var resolution = model.determineResolution(zoom);
			var distance = model.determineDistance(zoom);

			model.setChannel(model.roundedLocation, category, model.currentTag);

			model.clearNearbyMedia();
			mainController.mapController.displaySearching();
			model.loadNearbyMedia(location, distance, category, model.currentTag);

			return false;
		});
	});

	this.update = function(msg) {
		if (msg == "newChannel") {
			$("#messageGrid").html('');
			$(".currentRoom").empty();
			console.log("hej");
			$(".currentRoom").append("<p>"+model.currentChannel+"</p>");
			mainController.setContentSize();
			model.subscribeToChat();
			model.getChatHistory();
		}

	}

	$(document).on("pageshow","#mapView", this.setContentSize); // när ny sida visas, beräkna dess storlek
	$(document).on("pageshow","#chatView", this.setContentSize);
	window.addEventListener("resize", this.setContentSize);	
	model.subscribe(this);	
}
