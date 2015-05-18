PopUpController = function(model, mainController, view) {
	_this = this;

	this.update = function(msg) {
		if (msg == "loadPopup") {
			this.createPopUp("other");
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

	model.subscribe(this);
		
	this.createPopUp = function(type) {
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
}