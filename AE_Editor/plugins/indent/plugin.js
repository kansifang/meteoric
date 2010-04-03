GD.Editor.add("GD.Editor.plugins.indent", function(E) {
	/**
	 * 自动对齐
	 * @param {String} editorUniqueID
	 */
	E.buttons.insert({
		name: "autoindent",
    	ButtonClass: function(editorUniqueID){
			
		}
	});
	/**
	 * 插入/删除项目序号
	 * @param {String} editorUniqueID
	 */
	E.buttons.insert({
		name: "ollist",
    	ButtonClass: function(editorUniqueID){
			
		}
	});
	/**
	 * 插入/删除编号列表
	 * @param {String} editorUniqueID
	 */
	E.buttons.insert({
		name: "ullist",
    	ButtonClass: function(editorUniqueID){
			
		}
	});
});