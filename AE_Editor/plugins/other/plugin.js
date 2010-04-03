GD.Editor.add("GD.Editor.plugins.other", function(E) {
	var Buttons = E.buttons;
	
	/**
	 * 粗体
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "bold",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("bold", {
		options : {
			className: "font_btn font_bold",
            title: E.lang.getLang("button_bold"),
            isCustomButton: false
		}
	});
	/**
	 * 斜体
	 * @param {String} editorUniqueID
	 */
	Buttons.insert({
		name: "italic",
    	ButtonClass: Buttons.getClass()
	});
	Buttons.addMethod("italic", {
		options : {
			className: "font_btn font_italic",
            title: E.lang.getLang("button_italic"),
            isCustomButton: false
		}
	});
	/**
	 * 下划线
	 * @param {Object} editorUniqueID
	 */
	Buttons.insert({
		name : "underline",
		ButtonClass : Buttons.getClass()
	});
	Buttons.addMethod("underline", {
		options : {
			className: "font_btn font_underline",
            title: E.lang.getLang("button_underline"),
            isCustomButton: false
		}
	});
	/**
	 * mini模式下的表情插入
	 */
	Buttons.insert({
		name : "emotions_s_img",
		ButtonClass : Buttons.getClass()
	});
	Buttons.addMethod("emotions_s_img", {
		options : {
			className: "expert_face_s",
            title: E.lang.getLang("button_emotions"),
            isCustomButton: false
		}
	});
	/**
	 * mini模式下插入图片
	 */
	Buttons.insert({
		name : "insertimage_s_img",
		ButtonClass : Buttons.getClass()
	});
	Buttons.addMethod("insertimage_s_img", {
		options : {
			className: "expert_img_s",
            title: "插入图片",
            isCustomButton: false
		}
	});
	/**
	 * mini模式下音乐的插入
	 */
	Buttons.insert({
		name : "music_s_img",
		ButtonClass : Buttons.getClass()
	})
	Buttons.addMethod("music_s_img", {
		options : {
			className: "expert_music_s",
            title: "插入音乐",
            isCustomButton: false
		}
	});
	/**
	 * mini模式下插入视频
	 */
	Buttons.insert({
		name : "video_s_img",
		ButtonClass : Buttons.getClass()
	})
	Buttons.addMethod("video_s_img", {
		options : {
			className: "expert_video_s",
            title: "插入视频",
            isCustomButton: false
		}
	});
	/**
	 * 切换至高级模式
	 */
	Buttons.insert({
		name : "advancedstyle",
		ButtonClass : Buttons.getClass()
	})
	Buttons.addMethod("advancedstyle", {
		options : {
			className: "btn_expertuse",
            title: "切换到高级模式",
            isCustomButton: false,
            noHighlight: true
		}
	});
	/**
	 * 编辑器的帮助
	 */
	Buttons.insert({
		name : "help",
		ButtonClass : Buttons.getClass()
	})
	Buttons.addMethod("help", {
		options : {
			className: "link_qmark",
            title: "帮助",
            isCustomButton: true
		},
		$initialize : function() {
			this._buttonElement = document.createElement("a");
            this._buttonElement.className = this.options.className;
            this._buttonElement.innerHTML = '<span>使用帮助</span>';
            this._buttonElement.href = 'http://www.9917.com';
            this._buttonElement.target = '_blank';
            this._buttonElement.title = this.options.title;
            this._buttonElement.hidefocus = true;
            this._initEvent();
            return this._buttonElement;
		}
	});
	
	Buttons = null;
});