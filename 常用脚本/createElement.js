/**
 * @author caojj
 * @version 1.0.2.2
 * 		 
 * @history
 * 			1.0.1.1 + 创建input时的兼容性 @20080716
 * 			1.0.2.0 + 递归创建子节点
 */

try {
	if(!FWK.DOM){
		throw "ns";
	}
} catch (ex) {
	try{FWK}catch(e){FWK={}}
	FWK.DOM = {}
}


/**
 * 
 * @param {Object} tagName
 * @param {Object} attrs
 * @param {Object} bindDom
 */
FWK.DOM.createElement = function(tagName, attrs, bindDom) {
	var dom = null;
	if (tagName=="input" && document.all) {
		var iptStr = "<"+tagName;
		if (attrs["name"]) {
			iptStr += " name=" + attrs["name"];
		}
		if (attrs["type"]) {
			iptStr += " type=" + attrs["type"];
		}
		
		iptStr += ">";
		dom = document.createElement(iptStr);
	} else{
		dom = document.createElement(tagName);
	}
	
	for (var aName in attrs) {
		var attr = attrs[aName];

		if (typeof(attr) == "object") {
			if (aName == "_childDoms" && attr.length>0) {
				dom.childDoms = [];
				
				for (var chdIdx = 0; chdIdx < attr.length; chdIdx++) {
					var chd = attr[chdIdx];
					var tmpChdDom = FWK.DOM.createElement(chd.tagName, chd.attrs, dom);
					dom.childDoms.push(tmpChdDom);
				}
			}
			
			if (aName == "style") {
				for (var styleName in attr) {
					dom.style[styleName] = attr[styleName].replace(/;$/,"");
				}
			} else {
				dom[aName] = attr;
			}
		} else {
			if (typeof(attr) == "string" && (aName != "className" && aName != "innerHTML")) {
				dom.setAttribute(aName, attr);
			} else {
				dom[aName] = attr;
			}
		}
	}
	
	if (bindDom) {
		bindDom.appendChild(dom);
	}
	
	return dom;
}
	