GD.Editor.add("GD.Editor.plugins.font", function(E) {
	var Buttons = E.buttons;
	/**
	 * 字体
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "fontfamily",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("fontfamily", {
		options : {
			className: "font_btn font_clean",
            highlight: "nonce",
            title : E.lang.getLang("button_family"),
            isCustomButton: true
		},
		$initialize : function() {
			this._buttonElement = null;
			this._font_list = E.lang.getLang("font_list").split(",");
        	this._font_list_reg = new RegExp("(" + E.lang.getLang("font_list").split(",").join("|") + ")", "i");
			
			this._inID = this._editorUniqueID + '_fontname_text_' + Math.random();
            this._buttonElement = document.createElement("div");
            this._buttonElement.className = "sel_simulate";
            this._buttonElement.innerHTML = '<div unselectable="on"><span unselectable="on" id="' + this._inID + '">' + E.lang.getLang("button_family") + '</span><button type="button" hideFocus="true" style="border:none !important;">▼</button></div>';
            this._buttonElement.title = this.options.title;
			
			var _menuData = [];
            for (var i = 0; i < this._font_list.length; i++) { 
				(function(id) {
                    _menuData.push({
                        text: '<font face="' + this._font_list[id] + '">' + this._font_list[id] + '</font>',
                        onclick: E.event.bind(this, function() {
                            this.execute(this._font_list[id])
                        })
                    })
                }).call(this, i);
            }
            this._menu = new E.Menu();
            this._menu.bind(this._buttonElement, 1, _menuData);
			
			return this._buttonElement;
		},
		_initEvent : function() {},
		getElement : function() {
			return this._buttonElement;
		},
		execute : function(fType) {
			
		},
		query : function() {
			
		}
	});
	/**
	 * 字体大小
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "fontsize",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("fontsize", {
		options : {
			className: "font_btn font_clean",
            highlight: "nonce",
            title: E.lang.getLang("button_size"),
            isCustomButton: true
		},
		$initialize : function() {
			this._inID = this._editorUniqueID + '_fontsize_text_' + Math.random();
            this._buttonElement = document.createElement("div");
            this._buttonElement.className = "sel_simulate font_size";
            this._buttonElement.innerHTML = '<div unselectable="on"><span unselectable="on" id="' + this._inID + '" style="cursor:default">' + E.lang.getLang("button_size") + '</span><button type="button" hideFocus="true" style="border:none !important;">▼</button></div>';
            this._buttonElement.title = this.options.title;
            this._initEvent();
            var _menuData = [];
			
            for (var i = 1; i < 7; i++) { (function(id) {
                    _menuData.push({
                        text: '<font size="' + id + '">' + E.lang.getLang("font_size_" + id) + '</font>',
                        onclick: E.event.bind(this, function() {
                            this.execute(id);
                        })
                    })
                }).call(this, i);
            }
            this._menu = new E.Menu();
            this._menu.bind(this._buttonElement, 1, _menuData)
            return this._buttonElement;
		}
	});
	/**
	 * 字体颜色
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "fontcolor",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("fontcolor", {
		options : {
			className: "font_btn font_color",
            title: E.lang.getLang("button_color"),
            isCustomButton: false
		},
		$initialize : function() {
//            this._colorPanel = QZFL.widget.colorPicker.bind(this._buttonElement);
            this._initEvent();
            return this._buttonElement;
		}
	});
	/**
	 * 设置发光字
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "glowfont",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("glowfont", {
		options : {
			className: "font_btn font_light",
            title: E.lang.getLang("button_glowfont"),
            isCustomButton: false
		}
	});
	
	Buttons = null;
});