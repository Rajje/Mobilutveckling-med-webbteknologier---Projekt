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
		var name = "<a href='#userInfoPopup' data-rel='popup' data-transition='pop'><p id = 'userInfo' class='ui-block-a' style = 'width: 30%; !important; color:"+message.textColor+"'>"+message.alias+"</p></a>";
		var msg = "<p class='ui-block-b' >"+message.chatMsg+"</p>";
		return name+msg;
	}

	$(document).on("pageshow", "#chatView", function() {
		model.initChat();
		model.subscribeToChat();
	});
	
	$("#userInfoPopup").load(function(event){
		console.log("hello");
	});
	
	$("#sendMsg").click(function(event){
		var msg = $("#textInput").val();
		model.sendMessage(msg);
		$("#textInput").val('');
	});
	
	$("#messageGrid").on('click', '#userInfo', function(){
		console.log(model.getAlias());
		$("#userName").append("<p>"+model.getAlias()+"</p>");
	});
	
	model.subscribe(this);
}