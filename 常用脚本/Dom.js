/**
 * @author zhangyi
 */
window.undefined = window.undefined;
/*
 * 取到Dom对象
 */
function $(element){
	return (typeof id == "object")?id:document.getElementById(element);
}
/*
 * 在指定元素的后面插入指定元素，与系统inertBefore对应
 */
function insertAfter(newElement,targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement) {// 如果最后的节点是目标元素，则直接添加。因为默认是最后
	    parent.appendChild(newElement);
	} else {
	    parent.insertBefore(newElement,targetElement.nextSibling);//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面。
	}
}
/*
 * 把接收到的参数转换成一个Array对象
 */
function $A(iterable) {
	
  if (!iterable) return [];
  
  if (iterable.toArray) return iterable.toArray();
  
  var length = iterable.length || 0, results = [];

  while (length--) results[length] = iterable[length];
  
  return results;
}
/*
 * 当鼠标移动到一个匹配的元素上面时，会触发指定的第一个函数。当鼠标移出这个元素时，会触发指定的第二个函数。
 */
function hover(f,g) {
	
	function handleHover(e) {
		var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;

		while ( p && p != this ) p = p.parentNode;
		
		if ( p == this ) return false;
		
		return (e.type == "mouseover" ? f : g).apply(this, [e]);
	}
	
	return this.mouseover(handleHover).mouseout(handleHover);
}








