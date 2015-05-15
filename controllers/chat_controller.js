ChatController = function(model, mainController, view) {
	model.subscribe(this);

	this.printMessages = function() {
		var message = model.getMessages();
		$("#chatWindow").append("<p>"+message.alias+">> "+message.chatMsg+"</p>");

	}
	
	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");
		if (msg == "newMessage") {
			this.printMessages();
		}
	}
	
	$("#chatButton").click(function(event){
		model.initChat();
		model.subscribeToChat();
	});
	
	$("#sendMsg").click(function(event){
		var msg = $("#textInput").val();
		console.log("con: "+msg);
		model.sendMessage(msg);
	});
}
