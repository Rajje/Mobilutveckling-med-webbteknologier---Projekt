PopUpController = function(model, mainController, view) {

	this.update = function(msg) {
		if (msg == "loadPopup"){
			createPopUp("other");
		} 
	}

		$("#messageGrid").on('click', '.userInfo', function(event){
			var clickedUser = $(event.target).html();
			var alias = model.getAlias();
		
		if(clickedUser == alias){
			createPopUp("user");
		}
		
		else{
			model.getNewUser(clickedUser); 
		}
		
		});
	
		model.subscribe(this);
		
		function createPopUp(type) {
			var person;
			
			if(type == "user"){
				person = model.getUser();
			}
			else if(type == "other"){
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