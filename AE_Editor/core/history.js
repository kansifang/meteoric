GD.Editor.add("GD.Editor.History", function(E) {
	E.History = function() {
		this.items = [];
	    this.current = -1;
	    this._element = null;
	    this._type = 1;
	    this._useNativeHistory = false;
	    this._recordDelay = 200;
	}
	
	E.History.prototype = {
		forward : function() {
			
		},
		back : function() {
			
		},
		bind : function() {
			
		},
		record : function() {
			
		}
	}
});
