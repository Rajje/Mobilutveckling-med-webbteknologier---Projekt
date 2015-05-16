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
		var name = "<div class ='userInfo'><a href='#popUpView' data-rel='popup' data-transition='pop'><p class='ui-block-a' style = 'width: 30%; !important; color:"+message.textColor+"'>"+message.alias+"</p></a></div>";
		var msg = "<p class='ui-block-b' >"+message.chatMsg+"</p>";
		return name+msg;
	}

	$(document).on("pageshow", "#chatView", function() {
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