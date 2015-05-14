ChatController = function(model, mainController, view) {
	this.printMessages = function(){
		var messages = model.getMessages();
		
		for(var i = 0; i< messages.size(); i++){
			$("#chatWindow").append("<p>"+messages[i].alias+">> "+messages[i].chatMsg+"</p>");
		}
	}
	
	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");
		if(msg == "newMessage"){
			this.printMessages();
		}
	}
	
	$("#sendButton").click(function(event){
		var msg = $("#textInput").val();
		model.sendMessage(msg);
	})
	model.subscribe(this);
	model.test();
}
