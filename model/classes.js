Message = function(chatMsg, alias, textColor, profileImage) {
	this.chatMsg = chatMsg;
	this.alias = alias;
	this.textColor = textColor;
	this.profileImage = profileImage;
}

User = function(alias, profileImage, name){
	this.alias = alias;
	this.profileImage = profileImage;
	this.name = name;
}