/**
 * @author Administrator
 */
function sprintf(){ 
  var num = arguments.length; 
  var str = arguments[0];   
  for (var i = 1; i < num; ++i) { 
    var pattern = "\\$\\(" + (i-1) + "\\)"; 
    var re = new RegExp(pattern, "g"); 
    str = str.replace(re, arguments[i]); 
  }
  return str;
}