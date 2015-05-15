ChatController = function(model, mainController, view) {

	this.printMessages = function() {
		var message = model.getMessages();
		$("#messageGrid").append(this.styleMessage(message));
	}
	
	this.update = function(msg) {
		if (msg === "test")	view.append("<p>test update</p>");
		if (msg == "newMessage") this.printMessages();
	}
	
	this.styleMessage = function(message){
		var name = "<p class='ui-block-a' style = 'width: 10%; !important; color:"+message.textColor+"'><b>"+message.alias+"</b></p>";
		var msg = "<p class='ui-block-b' >"+message.chatMsg+"</p>";
		return name+msg;
	}
	
	$("#chatButton").click(function(event){
		model.initChat();
		model.subscribeToChat();
	});
	
	$("#sendMsg").click(function(event){
		var msg = $("#textInput").val();
		model.sendMessage(msg);
		$("#textInput").val('');
	});

	model.subscribe(this);
}