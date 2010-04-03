GD.Editor.add("GD.Editor.plugins.justify", function(E) {
	var Buttons = E.buttons;
	/**
	 * 居左对齐
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "justifyleft",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("justifyleft", {
		options : {
			className: "typeset_left",
            title: E.lang.getLang("button_justifyleft"),
            isCustomButton: false
		}
	});
	/**
	 * 居中对齐
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "justifycenter",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("justifycenter", {
		options : {
			className: "typeset_center",
            title: E.lang.getLang("button_justifycenter"),
            isCustomButton: false
		}
	});
	/**
	 * 居右对齐
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "justifyright",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("justifyright", {
		options : {
			className: "typeset_right",
            title: E.lang.getLang("button_justifyright"),
            isCustomButton: false
		}
	});
	
	Buttons = null;
});