/**
 * @author Administrator
 */
Function.prototype.createDelegate = function($) {
	var _ = this;
    return function() {
        return _.apply($, arguments)
    }
}
String.prototype.uniEncode = function() {
	var $, _;
    _ = [],
    $ = this;
    for (var A = 0; A < $.length; A++)[_[A] = $.charCodeAt(A).toString(16), (_[A].length % 2) && (_[A] = "0" + _[A]), _[A] = "\\" + "xu".charAt(_[A].length / 2 - 1) + _[A]];
    return _.join("");
}

var Each = function(_, $) {
	$ = $.createDelegate(_);
    for (var A in _)(A in {}) || $(A, _[A]);
}

var Template = function($) {
    this.value = Array.prototype.join.call(arguments.callee.caller.arguments, "")
}

Template.prototype.type = "ustring";
Template.prototype.replace = function(A) {
	var _ = this.value;
    Each(A,function($, A) {
        _ = _.replace(new RegExp("@{" + $.uniEncode() + "}", "g"), A)
    });
    return _;
}

var $ = function(_id) {
	return typeof _id == "string" ? document.getElementById(_id) : _id;
}
$.String = function() {
	return new Template;
}
