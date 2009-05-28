/**
 * @author caojj
 * @sdoc FireFox兼容IE下XPath的用法
 * @version 1.0.1.3
 * @history
 * 		1.0.1.1	# 修正了loadXml返回	@ 20080417
 */
try {
	if(!FWK.XML){
		throw "ns";
	}
} catch (ex) {
	try{FWK}catch(e){FWK={}}
	FWK.XML = {}
}

var isIE=!!document.all;
function getNodeValue(dom) {
	var str = "";
	try {
		str = dom.firstChild.nodeValue;
	} catch (ex) {
		try {
			str = dom.text;
		}catch(ex1) {
			str = "";
		}
	}
	return str;
}


/**
 * xml 转 Json对象
 * 属性名 前加$
 * 文本节点值 名称 为$_
 * @param {Object} xml
 */
function xmlToJson(xml)
{
	var Json = {};
	var items = selectNodes(xml,"*");
	var ilen=items.length;
	var arr = selectNodes(xml,"@*");
	for(j=0,jlen=arr.length;j<jlen;j++)
	{
		Json["$"+arr[j].nodeName] = arr[j].nodeValue;
	}
	if(ilen<1)
	{
		Json["$_"] = xml.text;
		return Json;
	}
	for(var i=0;i<ilen;i++)
	{
		if(Json[items[i].nodeName] instanceof Array)
		{
			Json[items[i].nodeName].push(xmlToJson(items[i]));
		}
		else if(Json[items[i].nodeName])
		{
			var vl = Json[items[i].nodeName];
			Json[items[i].nodeName] = [];
			Json[items[i].nodeName].push(vl);
			Json[items[i].nodeName].push(xmlToJson(items[i]));
		}
		else
		{
			Json[items[i].nodeName] = xmlToJson(items[i]);
		}
	}
	return Json;
}

/**
 * 生成空的文档对象
 */
function GenXmlDocument(){
	var XMLDoc = null;
	try {
		XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	} catch(e) {
		try {
			XMLDoc = document.implementation.createDocument("text/xml", "", null);;
		}catch(e){
			XMLDoc = false;
		}
	}
	return XMLDoc;
}

if (!isIE) {
	var ex;
	XMLDocument.prototype.__proto__.__defineGetter__("xml", function(){
		try {
			return new XMLSerializer().serializeToString(this);
		} catch (ex) {
			var d = document.createElement("div");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	Element.prototype.__proto__.__defineGetter__("xml", function(){
		try {
			return new XMLSerializer().serializeToString(this);
		} catch (ex) {
			var d = document.createElement("div");
			d.appendChild(this.cloneNode(true));
			return d.innerHTML;
		}
	});
	XMLDocument.prototype.__proto__.__defineGetter__("text", function(){
		return this.firstChild.textContent
	});
	Element.prototype.__proto__.__defineGetter__("text", function(){
		return this.textContent
	});
	
	if (document.implementation && document.implementation.createDocument) {
		XMLDocument.prototype.loadXML = function(xmlString){
			try {
				var childNodes = this.childNodes;
				for (var i = childNodes.length - 1; i >= 0; i--) 
					this.removeChild(childNodes[i]);
				
				var dp = new DOMParser();
				var newDOM = dp.parseFromString(xmlString, "text/xml");
				var newElt = this.importNode(newDOM.documentElement, true);
				this.appendChild(newElt);
				return true;
			} catch (ex) {
				return false;
			}
		};
		
		// check for XPath implementation
		if (document.implementation.hasFeature("XPath", "3.0")) {
			// prototying the XMLDocument
			XMLDocument.prototype.selectNodes = function(cXPathString, xNode){
				if (!xNode) {
					xNode = this;
				}
				var oNSResolver = this.createNSResolver(this.documentElement)
				var aItems = this.evaluate(cXPathString, xNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
				var aResult = [];
				for (var i = 0; i < aItems.snapshotLength; i++) {
					aResult[i] = aItems.snapshotItem(i);
				}
				return aResult;
			}
			
			// prototying the Element
			Element.prototype.selectNodes = function(cXPathString){
				if (this.ownerDocument.selectNodes) {
					return this.ownerDocument.selectNodes(cXPathString, this);
				} else {
					throw "For XML Elements Only";
				}
			}
		}
		
		// check for XPath implementation
		if (document.implementation.hasFeature("XPath", "3.0")) {
			// prototying the XMLDocument
			XMLDocument.prototype.selectSingleNode = function(cXPathString, xNode){
				if (!xNode) {
					xNode = this;
				}
				var xItems = this.selectNodes(cXPathString, xNode);
				if (xItems.length > 0) {
					return xItems[0];
				} else {
					return null;
				}
			}
			
			// prototying the Element
			Element.prototype.selectSingleNode = function(cXPathString){
				if (this.ownerDocument.selectSingleNode) {
					return this.ownerDocument.selectSingleNode(cXPathString, this);
				} else {
					throw "For XML Elements Only";
				}
			}
		}
	}
}