/**
 * @author zhangyi
 */
var Popup = new GD.create();
Popup.prototype = {
	initialize: function(config){
		
	}
}

Popup.getInstance = function() {
	if(!Popup._instance) {
		Popup._instance = new Popup();
	}
	return Popup._instance;
}

Popup.alert = function() {
	
}

Popup.confirm = function() {
	
}

Popup.msgBox = function() {
	
}

Popup.loading = function() {
	
}
