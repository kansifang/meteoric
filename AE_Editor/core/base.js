/**
 * @author ZhangYi
 * @fileDescription	
 * 		富文本编辑器
 */
if(typeof GD === 'undefined') {
	var GD = window.GD = {};
}

/**
 * 编辑器挂载至GD命名空间下
 */
GD.Editor = {
	/**
	 * 所有的插件列表
	 */
	plugins: [],
	/**
	 * 所有添加的模块
	 */
	mods : {},
	/**
	 * 所有编辑器实例
	 */
	items: {},
	/**
	 * 编辑器总的实例数量
	 */
	count: 0,
	/**
	 * 编辑器样式是否加载的标识
	 */
	_cssLoaded: false,
	/**
	 * 创建文本编辑器
	 * @param {String} textareaId	文本输入框的id，必须为textarea
	 * @param {Object} options		编辑器的选项
	 */
	create : function(textareaId, options) {
		var _editor = new GD.Editor.Core();
		
		if(!_editor.init(textareaId, options)) {
			return _editor = null;
		}
		
		/**
		 * 保存对此编辑器的引用并返回该实例对象
		 */
		this.items[_editor.uniqueID] = _editor;
		return _editor;
	},
	/**
	 * 获取编辑器实例对象
	 * @param {String} uniqueID
	 */
	get : function(uniqueID) {
		return this.items[uniqueID];
	},
	/**
	 * 添加模块
	 * @param {String} name
	 * @param {Function} fn
	 * @param {Object} details
	 */
	add : function(name, fn, details) {
		var _editor = GD.Editor;
		
		_editor.mods[name] = {
			name : name,
			fn : fn,
			details : details || {}	
		}
		fn(_editor);
		return _editor;
	},
	extend : function(destination, source) {
		for (var property in source) {
		    destination[property] = source[property];
		}
		return destination;
	},
	$extend : function(child, parent) {
		var F = new Function();
			F.prototype = parent.prototype;
		
		child.prototype = new F();
		child.superClass = parent.prototype;
		child.prototype.constructor = child;
		parent.prototype.constructor = parent;
		
		return child;
	}
}
