PopUpController = function(model, mainController, view) {
	_this = this;

	this.update = function(msg) {
		if (msg === "loadPopup") {
			this.createPopUpUser("other");
		} else if (msg === "loadImage") {
			this.createPopUpImage();
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
		var div = $("#popupImage");
		div.empty();
		var img = $("<img/>");
		img.attr("src", model.popupImage.url);
		div.append(img);
		img.load(function() {
			div.popup("open", {
					"positionTo": "window",
					"transition": "pop"
				}
			);
		});
	}
}