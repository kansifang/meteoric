GD.Editor.add("GD.Editor.selection", function(E) {
	E.selection = {
		get: function(source) {
		    if ( !! source || source.nodeType == 9 || source.tagName.toLowerCase() == "textarea") {
		        return source.defaultView ? source.defaultView.getSelection() : source.selection;
		    }
			return null;
		},
		getText: function(source) {
		    var text;
		    if (E.userAgent.ie) {
		        text = source.selection.createRange().text;
		    } else {
		        text = source.getSelection();
		    }
		    return text;
		},
		createRange: function(source) {
		    return new E.Range(this.get(source));
		}
	}
});
