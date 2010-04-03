GD.Editor.add("GD.Editor.config", function(E) {
	E.config = {
		editorOptions : {
			width: "100%",
	        height: "300px",
			editorList : ["html", "text"],
			toolbarList: ["html_mini", "html_full", "html_simple", "text"],
	        resizable: false
		},
		editorCSS : "../themes/default/css/ae_editor.css",
		editorPath : ""
	}
	
	/**
	 * 工具栏的配置
	 * font		文字
	 * color	文字颜色、背景颜色
	 * link		超链接
	 * justify	对齐方式
	 * indent	缩进方式
	 * letter	信纸
	 * otehr	其它
	 * history	撤消、恢复
	 * emotion	表情
	 * removeformat	移除应用的格式
	 */
	E.toolbar.setLayout("html_simple", {
	    extendClass: "editor_tools simple_mode",
	    layouts: [{
	        width: "auto",
	        height: "auto",
	        className: "font_tools",
	        buttons: ["fontfamily", "fontsize", "bold", "italic", "underline", "fontcolor"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "typeset_tools",
	        buttons: ["justifyleft", "justifycenter", "justifyright"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "expert_tools",
	        buttons: ["emotions_s", "insertimage_s"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "other_tools",
	        buttons: ["advancedstyle", "help"]
	    }]
	});
	E.toolbar.setLayout("html_mini", {
	    extendClass: "editor_tools simple_mode super_mode",
	    layouts: [{
	        width: "auto",
	        height: "auto",
	        className: "font_tools",
	        buttons: ["fontfamily", "fontsize", "bold", "italic", "underline", "fontcolor", "glowfont"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "typeset_tools",
	        buttons: ["justifyleft", "justifycenter", "justifyright"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "expert_tools super_simple_tools",
	        buttons: ["emotions_s_img", "insertimage_s_img", "music_s_img", "video_s_img"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "other_tools",
	        buttons: ["advancedstyle", "help"]
	    }]
	});
	E.toolbar.setLayout("html_full", {
	    extendClass: "editor_tools",
	    layouts: [{
	        width: "auto",
	        height: "auto",
	        className: "font_tools",
	        buttons: ["fontfamily", "fontsize", "bold", "italic", "underline", "fontcolor", "glowfont", "url", "cleanstyle"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "typeset_tools",
	        buttons: ["justifyleft", "justifycenter", "justifyright", "autoindent", "ollist", "ullist"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "expert_tools",
	        buttons: ["emotions", "insertimage", "qqshowbubble", "music", "video", "flash"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "inout_tools",
	        buttons: ["historyback", "historynext"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "other_tools",
	        buttons: ["normalstyle", "ubbmode", "help"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "secend_line",
	        buttons: ["letter", "fullscreen"]
	    }]
	});
	E.toolbar.setLayout("text", {
	    extendClass: "editor_tools ubb_mode",
	    layouts: [{
	        width: "auto",
	        height: "auto",
	        className: "inout_tools",
	        buttons: ["historyback", "historynext"]
	    }, {
	        width: "auto",
	        height: "auto",
	        className: "other_tools",
	        buttons: ["goback", "help"]
	    }]
	});
});
