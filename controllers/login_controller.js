LoginController = function(model, mainController, view) {
	var url = "https://instagram.com/oauth/authorize/?client_id=5e9c2a8a30f747ddbbf5a8d2d7b28961&redirect_uri=" + MY_URL + "&response_type=token";
	var output = '<a class="ui-btn ui-btn-inline ui-btn-b ui-corner-all ui-mini" href="' + url + '">Log in</a>';
	$("#loginButtonContainer").append(output);
}