GD.Editor.add("GD.Editor.plugins.history", function(E) {
	/**
	 * 撤消操作
	 * @param {String} editorUniqueID
	 */
	E.buttons.insert({
		name: "historyback",
    	ButtonClass: function(editorUniqueID){
			
		}
	});
	/**
	 * 恢复操作
	 * @param {String} editorUniqueID
	 */
	E.buttons.insert({
		name: "historynext",
    	ButtonClass: function(editorUniqueID){
			
		}
	});
});