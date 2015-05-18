PopUpController = function(model, mainController, view) {
	_this = this;
	this.popupImage = null;

	this.update = function(msg) {
		if (msg === "loadPopup") {
			this.createPopUpUser("other");
		} else if (msg === "loadImage") {
			this.createPopUpImage();
		} else if (msg === "nextPopupImage") {
			this.setPopupImage();
			this.setSwipeListeners();
		}
	}

	$("#messageGrid").on('click', '.userInfo', function(event){
		var clickedUser = $(event.target).html();
		var alias = model.getAlias();
	
		if (clickedUser == alias) {
			_this.createPopUp("user");
		} else {
			model.getNewUser(clickedUser); 
		}
	
	});

	$(document).on("pagecreate", function() {
		$(".imagepopup").on({
			popupbeforeposition: function() {
				var maxHeight = $(window).height() - 60 + "px";
				$(".imagepopup img").css("max-height", maxHeight );
			}
		});
	});

	model.subscribe(this);
		
	this.createPopUpUser = function(type) {
		var person;
		
		if (type == "user") {
			person = model.getUser();
		} else if (type == "other") {
			person = model.getOther();
		}
		
		var profilePic = person.profileImage;
		var name = person.name;
		var alias = person.alias;
		$("#userName").empty();
		$("#userName").append("<p>"+alias+"</p>");
		$("#userName").prepend("<br><b><p>"+name+"</p></b>");
		$("#userName").prepend("<img src='"+profilePic+"'>");
	}

	this.createPopUpImage = function() {
		this.setPopupImage();
		var img = this.popupImage.find("img");

		img.load(function() {
			_this.popupImage.popup("open", {
					"positionTo": "window",
					"transition": "pop"
				}
			);
			_this.setSwipeListeners();
		});
	}

	this.setSwipeListeners = function() {
		$("#popupImage").find("img").on("swipeleft", function(event) {
			event.stopImmediatePropagation(); //Stoppar eventet från att anropas miljoner gånger i rad
			model.getNextPopupImage();
		});
		$("#popupImage").find("img").on("swiperight", function(event) {
			event.stopImmediatePropagation(); //Stoppar eventet från att anropas miljoner gånger i rad
			model.getPreviousPopupImage();
		});
	}

	this.setPopupImage = function() {
		this.popupImage = $("#popupImage");
		this.popupImage.empty();
		this.popupImage.css({
			"max-width": "400px"
		});
		var closebtn = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>';
		this.popupImage.append(closebtn);
		var img = $("<img/>");
		img.attr("src", model.popupImage.url);
		this.popupImage.append(img);
		var info = $("<div>");
		
		if (model.popupImage.caption !== null) {
			var caption = $("<div>");
			caption.text(model.popupImage.caption.text);
			caption.css({
				"word-wrap": "break-word",
				"margin": "5px"
			});
			info.append(caption);
		}



		var comments = $("<div>");
		var commentsString = "";
		for (var i in model.popupImage.comments.data) {
			commentsString += "<p>" + model.popupImage.comments.data[i].from.username + ": " + model.popupImage.comments.data[i].text + "</p>";
		}
		comments.css({
			"word-wrap": "break-word",
			"margin": "5px"
		});
		comments.append(commentsString);
		info.append(comments);
		info.css({
			"width": "100%",
			"height": "100px",
			"max-height": "100px",
			"overflow-y": "scroll",
			"word-wrap": "break-word"
		});
		this.popupImage.append(info);
	}

	// $(document).ready(function() {
		
	// });
}