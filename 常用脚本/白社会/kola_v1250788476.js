if (!window._KOLA) {
    window._KOLA = {
        c: [],
        r: []
    };
    window.$call = function() {
        _KOLA.c.push(arguments);
    };
    window.$register = function() {
        _KOLA.r.push(arguments);
    };
}
if (!_KOLA.d) {
    _KOLA.d = function() {
        document.domReady = true;
        if (window.kola && kola.Event && kola.Event._fireDomLoad) kola.Event._fireDomLoad();
    };
    _KOLA.dc = function() {
        if (document.documentElement.doScroll)(function() {
            try {
                document.documentElement.doScroll("left");
            } catch(error) {
                setTimeout(arguments.callee, 5);
                return;
            }
            _KOLA.d();
        })();
    };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", _KOLA.d, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange",
        function() {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                _KOLA.d();
            }
        });
        _KOLA.dc();
    }
}
var kola = {
    version: '0.0.1'
};
Object.extend = function(target, src) {
    for (var it in src) {
        target[it] = src[it];
    }
    return target;
}
Object.create = function(varName, varValue, scope) {
    var a = varName.split('.'),
    obj = scope || window;
    for (var i = 0, il = a.length, it; i < il; i++) {
        it = a[i];
        var v = obj[it];
        if (typeof(v) == 'undefind' || v == null) {
            obj[it] = {};
        }
        if (i == il - 1) {
            if (typeof(varValue) != 'undefined') obj[it] = varValue;
            return obj[it];
        } else {
            obj = obj[it];
        }
    }
}
Object.clone = function(obj, options) {
    var n = {};
    if (options && options.items) {
        options.items.each(function(it, i) {
            n[it] = obj[it];
        });
    } else {
        for (var it in obj) {
            n[it] = obj[it];
        }
    }
    return n;
}
Object.each = function(obj, iterator) {
    var i = 0;
    for (var it in obj) {
        iterator(obj[it], it, i++);
    }
}
Object.toParams = function(obj) {
    var arr = [];
    for (var it in obj) {
        arr.push(it + '=' + obj[it]);
    }
    return arr.join('&');
}
var Class = {
    create: function() {
        var c = function() {
            this.initialize.apply(this, arguments);
        };
        for (var i = 0, il = arguments.length, it; i < il; i++) {
            it = arguments[i];
            if (it == null) continue;
            Object.extend(c.prototype, it);
        }
        return c;
    }
}
Object.extend(Function.prototype, {
    bind: function() {
        var method = this,
        _this = arguments[0],
        args = [];
        for (var i = 1, il = arguments.length; i < il; i++) {
            args.push(arguments[i]);
        }
        return function() {
            var thisArgs = args.concat();
            for (var i = 0, il = arguments.length; i < il; i++) {
                thisArgs.push(arguments[i]);
            }
            return method.apply(_this, thisArgs);
        };
    },
    bindEvent: function() {
        var method = this,
        _this = arguments[0],
        args = [];
        for (var i = 1, il = arguments.length; i < il; i++) {
            args.push(arguments[i]);
        }
        return function(e) {
            var thisArgs = args.concat();
            thisArgs.unshift(e || window.event);
            return method.apply(_this, thisArgs);
        };
    },
    timeout: function(time) {
        if (kola.Browser.mozilla) {
            var f = this;
            return setTimeout(function() {
                f();
            },
            time * 1000);
        }
        return setTimeout(this, time * 1000);
    },
    interval: function(time) {
        return setInterval(this, time * 1000);
    }
});
Object.extend(String.prototype, {
    trim: function() {
        return this.replace(/^\s+|\s+$/g, '');
    },
    left: function(n) {
        var s = this.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
        return this.slice(0, s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length);
    },
    nl2br: function() {
        return this.replace(/\n/gm, '<br />');
    },
    br2nl: function() {
        return this.replace(/<br(\s)*(\/)?>/gim, '\n').replace(/<wbr(\s)*(\/)?>/gim, '');
    },
    sortByIt: function(list) {
        var key = this,
        matchItem = null;
        list.each(function(it, index) {
            if (it.indexOf(key) == 0) {
                matchItem = it;
                list.splice(index, 1);
                throw $break;
            }
        });
        if (matchItem) {
            list.unshift(matchItem);
            list.unshift(true);
            return list;
        }
        list.unshift(false);
        return list;
    },
    escapeHTML: function() {
        var self = arguments.callee;
        self.text.data = this;
        return self.div.innerHTML;
    },
    unescapeHTML: function() {
        var div = document.createElement('div');
        div.innerHTML = this;
        if (div.childNodes.length > 0) {
            var str = [];
            for (var i = 0, il = div.childNodes.length, il; i < il; i++) {
                str.push(div.childNodes[i].nodeValue);
            }
            return str.join('');
        }
        return '';
    },
    byteLength: function() {
        return this.replace(/[^\x00-\xff]/g, "**").length;
    }
});
Object.extend(String.prototype.escapeHTML, {
    div: document.createElement('div'),
    text: document.createTextNode('')
});
with(String.prototype.escapeHTML) div.appendChild(text);
var $break = {};
Object.extend(Array.prototype, {
    _each: function(iterator, collect) {
        var r = [];
        try {
            for (var i = 0, il = this.length; i < il; i++) {
                var v = iterator(this[i], i);
                if (collect && typeof(v) != 'undefined') r.push(v);
            }
        } catch(e) {
            if (e != $break) throw e;
        }
        return r;
    },
    collect: function(iterator) {
        return this._each(iterator, true);
    },
    each: function(iterator) {
        this._each(iterator, false);
        return this;
    },
    include: function(value) {
        return this.index(value) != -1;
    },
    index: function(value) {
        for (var i = 0, il = this.length; i < il; i++) {
            if (this[i] == value) return i;
        }
        return - 1;
    },
    unique: function() {
        for (var i = 0; i < this.length; i++) {
            var it = this[i];
            for (var j = this.length - 1; j > i; j--) {
                if (this[j] == it) this.splice(j, 1);
            }
        }
        return this;
    },
    del: function(obj) {
        var index = this.index(obj);
        if (index >= 0 && index < this.length) {
            this.splice(index, 1);
        }
        return this;
    }
});
var $A = function(obj) {
    if (obj instanceof Array) return obj;
    var arr = [];
    for (var i = 0, il = obj.length; i < il; i++) {
        arr.push(obj[i]);
    }
    return arr;
}
var Hash = Class.create({
    initialize: function() {
        this._names = [];
        this._values = {};
    },
    put: function(name, value) {
        var v = this._values;
        if (!v[name]) {
            this._names.push(name);
        }
        v[name] = value;
        return this;
    },
    get: function(name) {
        return this._values[name];
    },
    concat: function(hash) {
        hash.each(function(it, i) {
            this.put(it.name, it.value);
        }.bind(this));
    },
    clone: function() {
        var a = new Hash();
        this.each(function(it, i) {
            a.put(it.name, it.value);
        });
        return a;
    },
    each: function(iterator) {
        for (var i = 0, il = this._names.length; i < il; i++) {
            var it = this._names[i];
            iterator({
                name: it,
                value: this._values[it]
            },
            i);
        }
        return this;
    },
    collect: function(iterator) {
        var a = [];
        for (var i = 0, il = this._names.length; i < il; i++) {
            var it = this._names[i];
            a.push(iterator({
                name: it,
                value: this._values[it]
            },
            i));
        }
        return a;
    }
});
kola.Template = Class.create({
    initialize: function(template) {
        this.template = template.toString();
        this.pattern = {
            left: "${",
            right: "}"
        };
        this.regPattern = /(?:^|.|\r|\n)(\$\{(.*?)\})/g;
        if (/(\#\{.+?\})/g.test(this.template)) {
            this.pattern = {
                left: "#{",
                right: "}"
            };
            this.regPattern = /(?:^|.|\r|\n)(\#\{(.*?)\})/g;
        }
    },
    evaluate: function(obj) {
        var _template = "";
        if (obj.constructor == Object) {
            var _this = this;
            _template = this.template.replace(this.regPattern,
            function(s, v1, v2) {
                var _left = s.split(_this.pattern.left)[0];
                if (_left && _left == "\\") {
                    return v1;
                }
                if (obj[v2] != undefined) {
                    return _left + obj[v2]
                } else {
                    return _left;
                }
            });
        }
        return _template;
    }
});
(function() {
    var ag = navigator.userAgent.toLowerCase();
    kola.Browser = {
        webkit: ag.indexOf('webkit') != -1,
        opera: ag.indexOf('opera') != -1,
        ie: (ag.indexOf('msie') != -1) && (ag.indexOf('opera') == -1),
        ie6: (ag.indexOf('msie 6.0') != -1 && ag.indexOf('msie 7.0') == -1 && ag.indexOf('msie 8.0') == -1),
        ie7: (ag.indexOf('msie 7.0') != -1 && ag.indexOf('msie 8.0') == -1),
        ie8: (ag.indexOf('msie 8.0') != -1),
        ff2: (ag.indexOf('firefox/2') != -1),
        mozilla: (ag.indexOf('mozilla') != -1) && (ag.indexOf('webkit') == -1) && (ag.indexOf('compatible') == -1),
        version: (ag.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1]
    };
})();
kola.Css = {
    add: function(el, css) {
        if (el == document) {
            if (document.createStyleSheet) {
                var arr = css.split('}');
                arr = arr.collect(function(it) {
                    if (!it) return;
                    it = it.split('{');
                    if (it.length != 2) return;
                    var sel = it[0],
                    style = it[1];
                    if (!sel || !style) return;
                    return {
                        selector: sel,
                        style: style
                    };
                });
                if (arr.length == 0) return null;
                var style = document.createStyleSheet();
                arr.each(function(it) {
                    style.addRule(it.selector, it.style);
                });
                return style;
            } else {
                var style = document.createElement('link');
                style.type = 'text/css';
                style.rel = 'stylesheet';
                style.href = 'data:text/css,' + escape(css);
                style = document.getElementsByTagName('head')[0].appendChild(style);
                return style;
            }
        }
    }
}
kola.Element = Class.create({
    initialize: function(els) {
        this._els = els;
    },
    attr: function(name, value) {
        if (typeof(value) == 'undefined') {
            var el = this._els[0];
            switch (name) {
            case 'class':
                return el.className;
            case 'style':
                return el.style.cssText
            default:
                return el.getAttribute(name);
            }
        } else {
            this._els.each(function(el) {
                switch (name) {
                case 'class':
                    el.className = value;
                    break;
                case 'style':
                    el.style.cssText = value;
                    break;
                default:
                    el.setAttribute(name, value);
                }
            });
            return this;
        }
    },
    removeAttr: function(name) {
        this._els.each(function(el) {
            el.removeAttribute(name);
        });
        return this;
    },
    prop: function(name, value) {
        if (typeof(value) == 'undefined') {
            return this._els[0][name];
        } else {
            this._els.each(function(el) {
                el[name] = value;
            });
            return this;
        }
    },
    html: function(value) {
        return this.prop('innerHTML', value);
    },
    outerHtml: function(value) {
        if (typeof(value) == 'undefined') {
            var el = this._els[0];
            return el.outerHTML ? el.outerHTML: document.createElement("div").appendChild(el.cloneNode(true)).parentNode.innerHTML;
        } else {
            this._els.each(function(el, i) {
                if (el.outerHTML) {
                    el.outerHTML = value;
                } else {
                    var r = el.ownerDocument.createRange();
                    var df = r.createContextualFragment(value);
                    el.parentNode.replaceChild(df, el);
                }
            });
            return this;
        }
    },
    text: function(value) {
        return this.prop(typeof(this._els[0].innerText) != 'undefined' ? 'innerText': 'textContent', value);
    },
    val: function(value) {
        if (typeof(value) == 'undefined') {
            var el = this._els[0];
            var tag = el.tagName.toLowerCase();
            if (tag == 'input') {
                switch (el.type) {
                case 'checkbox':
                case 'radio':
                    return el.checked ? el.value: null;
                    break;
                }
            }
            return el.value;
        } else {
            return this.prop('value', value);
        }
    },
    css: function(name, value) {
        if (typeof(value) == 'undefined') {
            var el = this._els[0];
            if (name == 'opacity') {
                if (kola.Browser.ie) {
                    return el.filter && el.filter.indexOf("opacity=") >= 0 ? parseFloat(el.filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
                } else {
                    return el.style.opacity ? parseFloat(el.style.opacity) : 1;
                }
            } else {
                var hyphenate = function(name) {
                    return name.replace(/[A-Z]/g,
                    function(match) {
                        return '-' + match.toLowerCase();
                    });
                };
                if (window.getComputedStyle) {
                    return window.getComputedStyle(el, null).getPropertyValue(hyphenate(name));
                }
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var computedStyle = document.defaultView.getComputedStyle(el, null);
                    if (computedStyle) return computedStyle.getPropertyValue(hyphenate(name));
                    if (name == "display") return "none";
                }
                if (el.currentStyle) {
                    return el.currentStyle[name];
                }
                return el.style[name];
            }
        } else {
            this._els.each(function(el) {
                if (name == 'opacity') {
                    if (kola.Browser.ie) {
                        el.style.filter = 'Alpha(Opacity=' + value * 100 + ')';
                    } else {
                        el.style.opacity = (value == 1 ? '': '' + value);
                    }
                } else {
                    el.style[name] = value;
                }
            });
            return this;
        }
    },
    pos: function(position) {
        if (typeof(position) == 'undefined') {
            var el = this._els[0],
            left = 0,
            top = 0,
            doc = document,
            de = doc.documentElement,
            db = doc.body,
            add = function(l, t) {
                left += l || 0;
                top += t || 0;
            };
            if (el.getBoundingClientRect) {
                var box = el.getBoundingClientRect();
                add(box.left + Math.max(de.scrollLeft, db.scrollLeft) - de.clientLeft, box.top + Math.max(de.scrollTop, db.scrollTop) - de.clientTop);
            } else {
                var op = el.offsetParent,
                fixed = el.style.position == 'fixed',
                oc = el,
                parent = el.parentNode;
                add(el.offsetLeft, el.offsetTop);
                while (op) {
                    add(op.offsetLeft, op.offsetTop);
                    if (kola.Browser.mozilla && !/^t(able|d|h)$/i.test(op.tagName) || kola.Browser.safari) add(el.style.borderLeftWidth, el.style.borderTopWidth);
                    if (!fixed && op.style.position == 'fixed') fixed = true;
                    oc = op.tagName.toLowerCase() == 'body' ? oc: op;
                    op = op.offsetParent;
                }
                while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                    if (!/^inline|table.*$/i.test(parent.style.display)) add( - parent.scrollLeft, -parent.scrollTop);
                    if (kola.Browser.mozilla && parent.style.overflow != 'visible') add(parent.style.borderLeftWidth, parent.style.borderTopWidth);
                    parent = parent.parentNode;
                }
                if (kola.Browser.mozilla && oc.style.position != 'absolute') add( - db.offsetLeft, -db.offsetTop);
                if (fixed) add(Math.max(de.scrollLeft, db.scrollLeft), Math.max(de.scrollTop, db.scrollTop));
            }
            return {
                left: left,
                top: top
            };
        } else {
            this._els.each(function(el) {
                el.style.left = position.left + 'px';
                el.style.top = position.top + 'px';
            });
            return this;
        }
    },
    box: function() {
        var el = this._els[0],
        rect = this.pos();
        rect.width = el.offsetWidth;
        rect.height = el.offsetHeight;
        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;
        return rect;
    },
    width: function(value) {
        if (typeof(value) == 'undefined') {
            return this._els[0].offsetWidth;
        } else {
            return this.css('width', value + 'px');
        }
    },
    height: function(value) {
        if (typeof(value) == 'undefined') {
            return this._els[0].offsetHeight;
        } else {
            return this.css('height', value + 'px');
        }
    },
    clientWidth: function(value) {
        if (typeof(value) == 'undefined') {
            return this._els[0].clientWidth;
        } else {
            return this.css('width', value + 'px');
        }
    },
    clientHeight: function(value) {
        if (typeof(value) == 'undefined') {
            return this._els[0].clientHeight;
        } else {
            return this.css('height', value + 'px');
        }
    },
    on: function(name, listener, options) {
        this._els.each(function(el) {
            kola.Event.on(el, name, listener, options);
        });
        return this;
    },
    un: function(name, listener) {
        this._els.each(function(el) {
            kola.Event.un(el, name, listener);
        });
        return this;
    },
    out: function(name, listener, canMore) {
        this._els.each(function(el) {
            kola.Event.out(el, name, listener, canMore);
        });
        return this;
    },
    unout: function(name, listener) {
        this._els.each(function(el) {
            kola.Event.unout(el, name, listener);
        });
        return this;
    },
    show: function(value) {
        if (typeof(value) == 'string') {
            this.css('display', value);
        } else {
            this.css('display', 'block');
        }
        return this;
    },
    hide: function() {
        this.css('display', 'none');
        return this;
    },
    toggle: function() {
        this[this._els[0].style.display == 'none' ? 'show': 'hide']();
        return this;
    },
    focus: function() {
        var el = this._els[0];
        if (el.focus) el.focus();
        return this;
    },
    blur: function() {
        var el = this._els[0];
        if (el.blur) el.blur();
        return this;
    },
    remove: function() {
        this._els.each(function(el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    },
    get: function(index) {
        return kola.Element.newInstance(this._els[index]);
    },
    size: function() {
        return this._els.length;
    },
    append: function() {
        var el = this._els[0];
        for (var i = 0, il = arguments.length; i < il; i++) {
            var it = arguments[i],
            itt = typeof(it);
            if (itt == 'object') {
                if (it.attr) {
                    it.elements().each(function(child, j) {
                        this._appendChild(el, child);
                    }.bind(this));
                } else {
                    this._appendChild(el, it);
                }
            } else {
                if (itt == 'string') {
                    var ctr = document.createElement('div');
                    ctr.innerHTML = it;
                    var childs = ctr.childNodes;
                    var nodes = [];
                    for (var j = childs.length - 1; j >= 0; j--) {
                        nodes.push(ctr.removeChild(childs[j]));
                    }
                    nodes = nodes.reverse();
                    for (var j = 0, jl = nodes.length; j < jl; j++) {
                        this._appendChild(el, nodes[j]);
                    }
                }
            }
        }
        return this;
    },
    _appendChild: function(parent, child) {
        if (parent.tagName.toLowerCase() == 'table' && child.tagName.toLowerCase() == 'tr') {
            if (parent.tBodies.length == 0) {
                parent.appendChild(document.createElement('tbody'));
            }
            parent.tBodies[0].appendChild(child);
        } else {
            parent.appendChild(child);
        }
    },
    prepend: function() {
        var el = this._els[0];
        for (var i = arguments.length - 1; i >= 0; i--) {
            var it = arguments[i],
            itt = typeof(it);
            if (itt == 'object') {
                if (it.attr) {
                    it.elements().reverse().each(function(child, j) {
                        el.insertBefore(child, el.firstChild);
                    });
                } else {
                    el.insertBefore(it, el.firstChild);
                }
            } else {
                if (itt == 'string') {
                    var ctr = document.createElement('div');
                    ctr.innerHTML = it;
                    var childs = ctr.childNodes;
                    var nodes = [];
                    for (var j = childs.length - 1; j >= 0; j--) {
                        nodes.push(ctr.removeChild(childs[j]));
                    }
                    nodes = nodes.reverse();
                    for (var j = nodes.length - 1; j >= 0; j--) {
                        el.insertBefore(nodes[j], el.firstChild);
                    }
                }
            }
        }
        return this;
    },
    before: function() {
        var el = this._els[0];
        for (var i = 0, il = arguments.length; i < il; i++) {
            var it = arguments[i],
            itt = typeof(it);
            if (itt == 'object') {
                var parent = el.parentNode;
                if (it.attr) {
                    it.elements().each(function(child, j) {
                        parent.insertBefore(child.parentNode ? child.parentNode.removeChild(child) : child, el);
                    });
                } else {
                    parent.insertBefore(it.parentNode ? it.parentNode.removeChild(it) : it, el);
                }
            } else {
                if (itt == 'string') {
                    var ctr = document.createElement('div');
                    ctr.innerHTML = it;
                    var childs = ctr.childNodes;
                    var nodes = [];
                    for (var j = childs.length - 1; j >= 0; j--) {
                        nodes.push(ctr.removeChild(childs[j]));
                    }
                    nodes = nodes.reverse();
                    for (var j = 0, jl = nodes.length; j < jl; j++) {
                        el.parentNode.insertBefore(nodes[j], el);
                    }
                }
            }
        }
        return this;
    },
    after: function() {
        var el = this._els[0];
        for (var i = arguments.length - 1; i >= 0; i--) {
            var it = arguments[i],
            itt = typeof(it);
            if (itt == 'object') {
                var parent = el.parentNode,
                next = el.nextSibling;
                if (it.attr) {
                    it.elements().each(function(child, j) {
                        if (child == next) return;
                        if (next) {
                            parent.insertBefore(child.parentNode ? child.parentNode.removeChild(child) : child, next);
                        } else {
                            parent.appendChild(child.parentNode ? child.parentNode.removeChild(child) : child);
                        }
                    });
                } else {
                    if (it != next) {
                        if (next) {
                            parent.insertBefore(it.parentNode ? it.parentNode.removeChild(it) : it, next);
                        } else {
                            parent.appendChild(it.parentNode ? it.parentNode.removeChild(it) : it);
                        }
                    }
                }
            } else {
                if (itt == 'string') {
                    var ctr = document.createElement('div');
                    ctr.innerHTML = it;
                    var childs = ctr.childNodes;
                    var nodes = [];
                    for (var j = childs.length - 1; j >= 0; j--) {
                        nodes.push(ctr.removeChild(childs[j]));
                    }
                    nodes = nodes.reverse();
                    for (var j = nodes.length - 1; j >= 0; j--) {
                        el.parentNode.insertBefore(nodes[j], el.nextSibling);
                    }
                }
            }
        }
        return this;
    },
    prev: function(inAllType) {
        var el;
        if (inAllType) {
            el = this._els[0].previousSibling;
        } else {
            var ele = this._els[0];
            while (ele = ele.previousSibling) {
                if (ele.nodeType && ele.nodeType == 1) {
                    el = ele;
                    break;
                }
            }
        }
        return kola.Element.newInstance(el);
    },
    prevAll: function(inAllType) {
        inAllType = !!inAllType;
        var els = [],
        el = this._els[0];
        while (el = el.previousSibling) {
            if (inAllType) els.push(el);
            else {
                if (el.nodeType && el.nodeType == 1) {
                    els.push(el);
                }
            }
        }
        return kola.Element.newInstance(els.reverse());
    },
    next: function(inAllType) {
        var el;
        if (inAllType) {
            el = this._els[0].nextSibling;
        } else {
            var ele = this._els[0];
            while (ele = ele.nextSibling) {
                if (ele.nodeType && ele.nodeType == 1) {
                    el = ele;
                    break;
                }
            }
        }
        return kola.Element.newInstance(el);
    },
    nextAll: function(inAllType) {
        inAllType = !!inAllType;
        var els = [],
        el = this._els[0];
        while (el = el.nextSibling) {
            if (inAllType) els.push(el);
            else {
                if (el.nodeType && el.nodeType == 1) {
                    els.push(el);
                }
            }
        }
        return kola.Element.newInstance(els);
    },
    first: function(inAllType) {
        var el = this._els[0].childNodes[0];
        if (!inAllType) {
            var ele = el;
            el = null;
            while (ele) {
                if (ele.nodeType && ele.nodeType == 1) {
                    el = ele;
                    break;
                }
                ele = ele.nextSibling;
            }
        }
        return kola.Element.newInstance(el);
    },
    last: function(inAllType) {
        var thisEl = this._els[0];
        var el = thisEl.childNodes[thisEl.childNodes.length - 1];
        if (!inAllType) {
            var ele = el;
            el = null;
            while (ele) {
                if (ele.nodeType && ele.nodeType == 1) {
                    el = ele;
                    break;
                }
                ele = ele.previousSibling;
            }
        }
        return kola.Element.newInstance(el);
    },
    swap: function(selector) {
        var el = this._els[0],
        target = $(selector).elements()[0];
        if (el.swapNode) {
            el.swapNode(target);
        } else {
            var parent = target.parentNode;
            if (parent) {
                var div = document.createElement('div');
                parent.insertBefore(div, target);
                parent.removeChild(target);
            }
            el.parentNode.insertBefore(target, el);
            el.parentNode.removeChild(el);
            if (parent) {
                parent.insertBefore(el, div);
                parent.removeChild(div);
            }
        }
        return this;
    },
    up: function(selector) {
        var sel = $.parseSelectorStr(selector)[0];
        var els = this._els.collect(function(el) {
            while (el = el.parentNode) {
                if ($.isMatchSelector(el, sel)) {
                    return el;
                }
            }
        });
        return kola.Element.newInstance(els);
    },
    upWithMe: function(selector) {
        var sel = $.parseSelectorStr(selector)[0];
        var els = this._els.collect(function(el) {
            while (el) {
                if ($.isMatchSelector(el, sel)) {
                    return el;
                }
                el = el.parentNode;
            }
        });
        return kola.Element.newInstance(els);
    },
    down: function(selector) {
        return $(selector, this._els);
    },
    parent: function() {
        return kola.Element.newInstance(this._els[0].parentNode);
    },
    children: function(inAllType) {
        var els = [],
        nodes = this._els[0].childNodes;
        for (var i = 0, il = nodes.length; i < il; i++) {
            var it = nodes[i];
            if (inAllType) {
                els.push(it);
            } else {
                if (it.nodeType && it.nodeType == 1) els.push(it);
            }
        }
        return kola.Element.newInstance(els);
    },
    elements: function() {
        return this._els;
    },
    data: function(name, value) {
        return this.attr('data-' + name, value);
    },
    hasClass: function(name) {
        var el = this._els[0];
        return el.className && el.className.split(' ').include(name);
    },
    addClass: function(name) {
        this._els.each(function(el) {
            var arr = [];
            if (el.className) {
                arr = el.className.split(' ');
                if (!arr.include(name)) arr.push(name);
            } else {
                arr.push(name);
            }
            el.className = arr.join(' ');
        });
        return this;
    },
    removeClass: function(name) {
        this._els.each(function(el) {
            if (el.className) {
                var arr = el.className.split(' '),
                index = arr.index(name);
                if (index != -1) arr.splice(index, 1);
                el.className = arr.join(' ');
            }
        });
        return this;
    },
    toggleClass: function(class1, class2) {
        if (typeof(class2) == 'string') {
            this._els.each(function(el) {
                if (el.className && el.className == class1) {
                    el.className = class2;
                } else {
                    el.className = class1;
                }
            });
        } else {
            this._els.each(function(el) {
                if (el.className) {
                    var arr = el.className.split(' ');
                    if (arr.include(class1)) {
                        el.className = arr.del(class1).join(' ');
                    } else {
                        arr.push(class1);
                        el.className = arr.join(' ');
                    }
                } else {
                    el.className = class1;
                }
            });
        }
        return this;
    },
    concat: function() {
        var els = this._els.concat();
        $A(arguments).each(function(it, i) {
            if (it.attr) it = it.elements();
            els = els.concat(it);
        }.bind(this));
        return kola.Element.newInstance(els);
    },
    push: function(el) {
        this._els.push(el);
        return this;
    },
    each: function(iterator) {
        for (var i = 0, il = this._els.length; i < il; i++) {
            iterator(kola.Element.newInstance(this._els[i]), i);
        }
        return this;
    },
    copy: function(isCloneChild) {
        return kola.Element.newInstance(this._els.collect(function(el) {
            return el.cloneNode(isCloneChild);
        }));
    },
    clone: function() {
        return new kola.Element(this._els);
    }
});
kola.Element.newInstance = function(els) {
    if (els == null) return null;
    if (els.constructor == Array && els.length == 0) return null;
    return new kola.Element(els.constructor == Array ? els: [els]);
};
kola.Element.create = function(tagName, attrs) {
    var el = this.newInstance(document.createElement(tagName));
    if (typeof(attrs) == 'object' && attrs != null) {
        Object.each(attrs,
        function(it, itn, i) {
            el.attr(itn, it);
        });
    }
    return el;
}
window.$ = function(exp, context) {
    var eles = [];
    var expt = typeof(exp);
    if (expt == 'string') {
        if (exp.charAt(0) == '#' && exp.indexOf(' ') == -1 && exp.indexOf('>') == -1) {
            var idEl = document.getElementById(exp.substr(1));
            eles = idEl ? [idEl] : null;
        } else {
            var sels = $.parseSelectorStr(exp),
            parents = null;
            if (context == null) {
                parents = [window];
            } else {
                if (context.attr && context.elements) {
                    if (context.elements().length > 0) {
                        parents = context.elements();
                    } else {
                        parents = [window];
                    }
                } else {
                    if (context.constructor == Array) {
                        parents = context;
                    } else {
                        parents = [context];
                    }
                }
            }
            sels.each(function(sel, i) {
                var el;
                if (sel.scopeType == 0) {
                    parents = [document.getElementById(sel.itemName)];
                } else {
                    if (sel.scopeType == 1) {
                        var els = [];
                        parents.each(function(it, i) {
                            for (var j = 0, jl = it.childNodes.length; j < jl; j++) {
                                els.push(it.childNodes[j]);
                            }
                        });
                        parents = els;
                        if (sel.itemName.length > 0) {
                            parents = parents.collect(function(it, j) {
                                if (it.tagName && it.tagName.toLowerCase() == sel.itemName) {
                                    return it;
                                }
                            });
                        }
                    } else {
                        var els = [];
                        parents.each(function(it, i) {
                            if (it == window) it = document;
                            var childs = it.getElementsByTagName(sel.itemName || '*');
                            for (var j = 0, jl = childs.length; j < jl; j++) {
                                els.push(childs[j]);
                            }
                        });
                        parents = els;
                    }
                }
                if (sel.propName != '') {
                    var needValue = sel.propValue.length > 0;
                    parents = parents.collect(function(it, i) {
                        var v = sel.propName == 'class' ? it.className: it.getAttribute(sel.propName);
                        if (v == null) return;
                        if (needValue) {
                            if (sel.propName == 'class') {
                                v = ' ' + v + ' ';
                                if (v.indexOf(' ' + sel.propValue + ' ') != -1) {
                                    return it;
                                }
                            } else {
                                if (v == sel.propValue) return it;
                            }
                        } else {
                            return it;
                        }
                    });
                }
            });
            eles = parents;
        }
    } else {
        if (exp.attr) {
            return exp;
        } else {
            if (expt == 'object') {
                eles = exp;
            } else {
                return null;
            }
        }
    }
    if (eles && eles != window && eles[0] && eles[0].getAttribute && eles[0].getAttribute('el-class')) {
        return new kola.Element[eles[0].getAttribute('el-class')](eles);
    }
    return kola.Element.newInstance(eles);
};
$.parseSelectorStr = function(str) {
    var sels = [];
    var arr = str.split(' ');
    arr.each(function(it, i) {
        var arr2 = it.split('>');
        arr2.each(function(it2, j) {
            var scopeType = (j == 0) ? 2 : 1,
            itemName = '',
            propName = '',
            propValue = '';
            var propIndex = it2.indexOf('.');
            if (propIndex != -1) {
                propName = 'class';
                propValue = it2.substr(propIndex + 1);
                it2 = it2.substr(0, propIndex);
            } else {
                propIndex = it2.indexOf('[');
                if (propIndex != -1) {
                    propName = it2.substring(propIndex + 1, it2.length - 1).split('=');
                    it2 = it2.substr(0, propIndex);
                    if (propName.length == 2) {
                        propValue = propName[1];
                    }
                    propName = propName[0];
                }
            }
            if (it2.length > 0) {
                var c = it2.charAt(0);
                switch (c) {
                case '*':
                    scopeType = 2;
                    break;
                case '#':
                    scopeType = 0;
                    itemName = it2.substr(1);
                    break;
                default:
                    itemName = it2;
                    break;
                }
            }
            sels.push({
                scopeType: scopeType,
                itemName: itemName,
                propName: propName,
                propValue: propValue
            });
        });
    });
    return sels;
};
$.isMatchSelector = function(el, sel) {
    var el = $(el);
    if (!el) return false;
    el = el.elements()[0];
    var itemName = sel.itemName,
    propName = sel.propName,
    propValue = sel.propValue;
    if (sel.scopeType == 0) {
        if (el.id != itemName) return false;
    }
    if (itemName != '') {
        if (!el.tagName || el.tagName.toLowerCase() != itemName) return false;
    }
    if (propName != '') {
        var needValue = propValue.length > 0,
        v = sel.propName == 'class' ? el.className: (el.getAttribute ? el.getAttribute(sel.propName) : null);
        if (v == null) return false;
        if (needValue) {
            if (propName == 'class') {
                v = ' ' + v + ' ';
                if (v.indexOf(' ' + propValue + ' ') == -1) return false;
            } else {
                if (v != propValue) return false;
            }
        }
    }
    return true;
};
kola.Event = {
    on: function(el, name, func) {
        if (!el || !name || !func) return this;
        if (name == 'domload' && el == window) {
            kola.Event._onDomLoad(func);
            return this;
        }
        if (name == 'keyenter') {
            func = (function(cb) {
                return function(e) {
                    if (e) {
                        if (e.keyCode == 13) {
                            cb(e);
                        }
                    } else {
                        if (event.keyCode == 13) {
                            cb(e);
                        }
                    }
                }
            })(func);
            name = 'keypress';
        }
        if (el.addEventListener) {
            el.addEventListener(name, func, false);
        } else {
            el.attachEvent('on' + name, func);
        }
        return this;
    },
    _onCustom: function(el, name, func) {
        if (!el || !name || !func) return this;
        var D = el._EVENTDATA;
        if (!D[name]) D[name] = [];
        if (D._BEFOREON) {
            var beforeFunc = typeof(D._BEFOREON) == 'function' ? D._BEFOREON: D._BEFOREON[name];
            if (typeof(beforeFunc) == 'function') {
                var v = beforeFunc(el, name, func);
                if (typeof(v) == 'boolean' && v == false) return this;
            }
        }
        D[name].push(func);
        if (D._AFTERON) {
            var afterFunc = typeof(D._AFTERON) == 'function' ? D._AFTERON: D._AFTERON[name];
            if (typeof(afterFunc) == 'function') {
                afterFunc(el, name, func);
            }
        }
        return this;
    },
    un: function(el, name, func) {
        if (!el || !name || !func) return this;
        if (el.removeEventListener) {
            el.removeEventListener(name, func, false);
        } else {
            el.detachEvent('on' + name, func);
        }
        return this;
    },
    _unCustom: function(el, name, func) {
        if (!el || !name || !func) return this;
        var D = el._EVENTDATA;
        if (D._BEFOREUN) {
            var beforeFunc = typeof(D._BEFOREUN) == 'function' ? D._BEFOREUN: D._BEFOREUN[name];
            if (typeof(beforeFunc) == 'function') {
                var v = beforeFunc(el, name, func);
                if (typeof(v) == 'boolean' && v == false) return this;
            }
        }
        if (D[name]) {
            D[name].del(func);
        }
        if (D._AFTERUN) {
            var afterFunc = typeof(D._AFTERUN) == 'function' ? D._AFTERUN: D._AFTERUN[name];
            if (typeof(afterFunc) == 'function') {
                afterFunc(el, name, func);
            }
        }
        return this;
    },
    out: function(el, name, func, canMore) {
        var callback = function(e) {
            var src = kola.Event.element(e).elements()[0];
            var isIn = false;
            while (src) {
                if (src == el) {
                    isIn = true;
                    break;
                }
                src = src.parentNode;
            }
            if (!isIn) {
                func(e);
                if (!canMore) {
                    kola.Event.un(document.body, name, c);
                    if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
                        var arr = el._EVENT.out;
                        for (var i = 0, il = arr.length; i < il; i++) {
                            if (arr[i].efunc == c && arr[i].name == name) {
                                arr.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
            }
        }
        var c = callback.bindEvent(window);
        if (!el._EVENT) {
            el._EVENT = {
                out: []
            }
        }
        el._EVENT.out.push({
            name: name,
            func: func,
            efunc: c
        });
        kola.Event.on(document.body, name, c);
    },
    unout: function(el, name, func) {
        if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
            var arr = el._EVENT.out;
            for (var i = 0, il = arr.length; i < il; i++) {
                if (arr[i].func == func && arr[i].name == name) {
                    kola.Event.un(document.body, name, arr[i].efunc);
                    arr.splice(i, 1);
                    return;
                }
            }
        }
    },
    stop: function(e) {
        kola.Event.stopPropagation(e);
        kola.Event.preventDefault(e);
    },
    stopPropagation: function(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },
    preventDefault: function(e) {
        e.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    element: function(e) {
        return kola.Element.newInstance(e.target || e.srcElement);
    },
    clientPos: function(e) {
        return {
            left: e.clientX,
            top: e.clientY
        }
    },
    pagePos: function(e) {
        var getDocRect = function() {
            var r = {
                left: Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
                top: Math.max(document.body.scrollTop, document.documentElement.scrollTop),
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
            r.right = r.left + r.width;
            r.bottom = r.top + r.height;
            return r;
        };
        var pos = getDocRect();
        return {
            left: e.clientX + pos.left,
            top: e.clientY + pos.top
        };
    },
    fire: function(el, name, e) {
        var D = null;
        if (D = el._EVENTDATA) {
            if (D = D[name]) {
                e = Object.extend({
                    srcElement: el,
                    type: name
                },
                e || {});
                var DC = D.concat();
                for (var i = 0, il = DC.length; i < il; i++) {
                    DC[i](e);
                }
                if (el._EVENTDATA && el._EVENTDATA._ONCE && el._EVENTDATA._ONCE[name]) {
                    D.each(function(it, i) {
                        el.un(name, it);
                    });
                }
            }
        }
        return this;
    },
    initEventObserver: function(obj, options) {
        obj._EVENTDATA = {};
        if (options) {
            if (options.beforeOn) {
                obj._EVENTDATA._BEFOREON = options.beforeOn;
            }
            if (options.afterOn) {
                obj._EVENTDATA._AFTERON = options.afterOn;
            }
            if (options.beforeUn) {
                obj._EVENTDATA._BEFOREUN = options.beforeUn;
            }
            if (options.afterUn) {
                obj._EVENTDATA._AFTERUN = options.afterUn;
            }
            if (options.once) {
                obj._EVENTDATA._ONCE = options.once;
            }
        }
        var E = kola.Event;
        obj.on = E._onCustom.bind(E, obj);
        obj.un = E._unCustom.bind(E, obj);
        obj.fire = E.fire.bind(E, obj);
    },
    _fireDomLoad: function() {
        var a = kola.Event._domFuncs,
        f;
        while (f = a.shift()) {
            f();
        }
    },
    _onDomLoad: function(func) {
        if (document.domReady) {
            func();
        } else {
            kola.Event._domFuncs.push(func);
        }
    },
    _domFuncs: []
};
kola.Ajax = {
    request: function(url, options) {
        var trans = this._getTransport();
        options = Object.extend({
            method: 'get',
            async: true
        },
        options || {});
        if (options.method == 'get' && typeof(options.data) == 'string') {
            url += (url.indexOf('?') == -1 ? '?': '&') + options.data;
            options.data = null;
        }
        trans.open(options.method, url, options.async);
        if (options.method == 'post') {
            trans.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        trans.onreadystatechange = this._onStateChange.bind(this, trans, url, options);
        trans.send(options.data || null);
        return trans;
    },
    text: function(url, options) {
        options.format = 'text';
        return this.request(url, options);
    },
    json: function(url, options) {
        options.format = 'json';
        return this.request(url, options);
    },
    xml: function(url, options) {
        options.format = 'xml';
        return this.request(url, options);
    },
    _getTransport: function() {
        if (window.XMLHttpRequest) return new XMLHttpRequest();
        else {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch(e) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch(e) {
                    return false;
                }
            }
        }
    },
    _onStateChange: function(trans, url, options) {
        if (trans.readyState == 4) {
            trans.onreadystatechange = function() {};
            var s = trans.status;
            if ((typeof(s) == 'number') && s >= 200 && s < 300) {
                if (typeof(options.success) != 'function') return;
                var ctt = trans;
                if (typeof(options.format) == 'string') {
                    switch (options.format) {
                    case 'text':
                        ctt = trans.responseText;
                        break;
                    case 'json':
                        if (Pack.isSrc()) {
                            ctt = eval('(' + trans.responseText + ')');
                        } else {
                            try {
                                ctt = eval('(' + trans.responseText + ')');
                            } catch(e) {
                                sohu.error(e);
                            }
                        }
                        break;
                    case 'xml':
                        ctt = trans.responseXML;
                        break;
                    }
                }
                options.success(ctt);
            } else {
                if (window.closed) return;
                if (typeof(options.failure) == 'function') {
                    var error = {
                        status: trans.status,
                        statusText: trans.statusText
                    }
                    if (trans.readyState == 4 && (trans.status == 0 || trans.status == 12030)) {
                        error.status = -1;
                    }
                    options.failure(error);
                }
            }
        }
    }
};
kola.Cookie = {
    get: function(name) {
        var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");
        if (tmp = reg.exec(unescape(document.cookie))) return (tmp[2]);
        return null;
    },
    set: function(name, value, expires, path, domain) {
        var str = name + "=" + escape(value);
        if (expires) {
            if (expires == 'never') {
                expires = 100 * 365 * 24 * 60;
            }
            var exp = new Date();
            exp.setTime(exp.getTime() + expires * 60 * 1000);
            str += "; expires=" + exp.toGMTString();
        }
        if (path) {
            str += "; path=" + path;
        }
        if (domain) {
            str += "; domain=" + domain;
        }
        document.cookie = str;
    },
    remove: function(name, path, domain) {
        document.cookie = name + "=" + ((path) ? "; path=" + path: "") + ((domain) ? "; domain=" + domain: "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};
var Pack = {
    require: function(packages, callback) {
        var pa = packages.replace(/\s/g, '').split(','),
        requires = [],
        loads = [];
        pa.each(function(it) {
            var st = Pack._status(it);
            if (st != 3) {
                if (st == 0) loads.push(it);
                requires.push(it);
            }
        });
        if (requires.length == 0) {
            if (typeof(callback) == 'function') {
                callback.timeout(0);
            }
            return;
        }
        var ro = new Pack._Require(requires, callback);
        requires.each(function(it) {
            Pack._connect(it, ro);
        });
        var l = function(loadsObj) {
            loadsObj.each(function(it) {
                Pack._load(it);
            });
        };
        l.bind(Pack, loads).timeout(0);
    },
    pushRegister: function(packageName, content, requires) {
        Pack._regStores.push({
            packageName: packageName,
            content: content,
            requires: requires
        });
    },
    flush: function() {
        var it;
        while (it = Pack._regStores.shift()) {
            Pack.register(it.packageName, it.content, it.requires);
        }
    },
    register: function(packageName, content, requires) {
        var st = Pack._status(packageName);
        if (st == 3) return;
        if (typeof(requires) == 'string') {
            Pack._status(packageName, 2);
            $req(requires, $register.bind(window, packageName, content));
        } else {
            if (typeof(content) == 'function') {
                content();
            }
            Pack._status(packageName, 3);
        }
    },
    config: function(config) {
        var path = Pack._paths;
        path._prefix = config._prefix;
        path._suffix = config._suffix;
        path._srcFile = config._srcFile;
        for (var it in config._packs) {
            var iv = config._packs[it];
            if (it.indexOf(',') != -1) {
                var its = it.split(',');
                for (var j = 0, jl = its.length; j < jl; j++) {
                    path[its[j]] = iv;
                }
            } else {
                path[it] = iv;
            }
        }
    },
    isSrc: function() {
        return Pack._paths && Pack._paths._srcFile;
    },
    _path: function(name) {
        var paths = Pack._paths;
        if (paths[name]) return paths[name];
        var src = '',
        names = name.split('.');
        if ((src = names.pop()) && paths._srcFile) {
            names.push(src == '*' ? 'core': src);
        }
        return paths._prefix + names.join('/') + paths._suffix;
    },
    _paths: {},
    _regStores: [],
    _packages: {},
    _loadPaths: {},
    _status: function(packageName, stat) {
        var P = Pack._packages;
        if (!P[packageName]) {
            P[packageName] = {
                status: 0,
                waits: []
            };
            var a = packageName.split('.'),
            s = window;
            a.each(function(it, i) {
                if (i != a.length - 1) {
                    if (!s[it]) {
                        s[it] = {};
                    }
                    s = s[it];
                }
            });
        }
        if (typeof(stat) == 'number') {
            P[packageName].status = stat;
            if (stat == 3) {
                var wa = P[packageName].waits;
                for (var i = wa.length - 1, it; i >= 0; i--) {
                    it = wa[i];
                    it.update(packageName);
                }
            }
        } else {
            return P[packageName].status;
        }
    },
    _connect: function(packageName, requireObj) {
        var P = Pack._packages;
        if (!P[packageName]) {
            P[packageName] = {
                status: 0,
                waits: []
            };
        }
        P[packageName].waits.push(requireObj);
    },
    _disconnect: function(packageName, requireObj) {
        var P = Pack._packages;
        if (!P[packageName]) {
            P[packageName] = {
                status: 0,
                waits: []
            };
        }
        var wa = P[packageName].waits;
        for (var i = wa.length - 1, it; i >= 0; i--) {
            if (wa[i] == requireObj) {
                wa.splice(i, 1);
            }
        }
    },
    _load: function(packageName) {
        var P = Pack,
        st = P._status(packageName),
        obj = P._packages[packageName];
        if (st != 0) return;
        P._status(packageName, 1);
        var path = P._path(packageName);
        if (P._loadPaths[path]) {
            return;
        } else {
            P._loadPaths[path] = true;
        }
        var s = document.createElement("script");
        s.type = 'text/javascript';
        s.src = P._path(packageName);
        document.getElementsByTagName('head')[0].appendChild(s);
    },
    _Require: function(packages, callback) {
        this.packages = packages;
        this.callback = callback;
    }
};
Pack._Require.prototype = {
    update: function(packageName) {
        var pa = this.packages;
        for (var i = pa.length - 1; i >= 0; i--) {
            var it = pa[i],
            stat = Pack._status(it);
            if (stat == 3 || (stat == 2 && it == packageName)) {
                pa.splice(i, 1);
                Pack._disconnect(it, this);
            }
        }
        if (pa.length == 0) {
            if (typeof(this.callback) == 'function') {
                var cb = this.callback;
                cb.timeout(0);
            }
        }
    }
};
if (!window.PATH) {
    PATH = {
        d1: '',
        js: '',
        jsPacks: {},
        jsSrc: true
    };
}
Pack.config({
    _prefix: PATH.d1 + PATH.js,
    _packs: PATH.jsPacks,
    _suffix: '.js',
    _srcFile: PATH.jsSrc
});
Pack.register('kola.core.*');
window.$req = Pack.require;
window.$register = Pack.register;
window.$flush = Pack.flush;
window.$call = function(func, requires, options) {
    if (typeof(func) == 'string') {
        func = eval.bind(window, func);
    }
    if (options && options.afterDom) {
        func = (function(func2) {
            return function() {
                kola.Event.on(window, 'domload', func2);
            };
        })(func);
    }
    if (typeof(requires) == 'string' && requires.length > 0) {
        $req(requires, func);
    } else {
        func();
    }
}
if (window._KOLA) {
    var args;
    if (_KOLA.r.length > 0) {
        while (args = _KOLA.r.shift()) {
            if (document.all) { (function() {
                    var ar = arguments[0];
                    window.setTimeout(function() {
                        $register.apply(window, ar);
                    },
                    0);
                })(args);
            } else {
                $register.apply(window, args);
            }
        }
    }
    if (_KOLA.c.length > 0) {
        while (args = _KOLA.c.shift()) {
            if (document.all) { (function() {
                    var ar = arguments[0];
                    window.setTimeout(function() {
                        $call.apply(window, ar);
                    },
                    0);
                })(args);
            } else {
                $call.apply(window, args);
            }
        }
    }
}
$register('sohu.core.*',
function() {
    var PACK = sohu;
    sohu.core.Model = Class.create({
        initialize: function(options) {
            this._options = options;
            var _this = this;
            Object.each(this._options.actions,
            function(it, itn, i) {
                _this[itn] = _this._action.bind(_this, itn);
            });
            this._data = {};
            this._dataInfo = {};
        },
        _action: function(action, params, opt) {
            var mOpt = this._options,
            tOpt = mOpt.actions[action],
            aOpt = {};
            var url = mOpt.url + tOpt.url;
            tOpt.encode = tOpt.encode || '';
            if (tOpt.encode != 'uri') {
                var encode = function(v) {
                    return v;
                };
            } else {
                var encode = function(v) {
                    return encodeURIComponent(v);
                }
            }
            var arr = [];
            if (params) {
                if (tOpt.params) {
                    tOpt.params.each(function(it, i) {
                        var iv = params[it],
                        ivt = typeof(iv);
                        if (ivt == 'string' || ivt == 'number') {
                            arr.push(it + '=' + encode(iv));
                        } else if (iv && iv.length && iv.each) {
                            iv.each(function(ivit) {
                                arr.push(it + '=' + encode(ivit));
                            });
                        }
                    });
                } else {
                    for (var it in params) {
                        var iv = params[it],
                        ivt = typeof(iv);
                        if (ivt == 'string' || ivt == 'number') {
                            arr.push(it + '=' + encode(iv));
                        } else if (iv && iv.length && iv.each) {
                            iv.each(function(ivit) {
                                arr.push(it + '=' + encode(ivit));
                            });
                        }
                    }
                }
            }
            if (tOpt.method == 'post') {
                if (tOpt.valid !== 'false' && !sohu.user.valid()) return false;
                arr.push('_myid=' + sohu.user.id);
            }
            if (!tOpt.cache) arr.push('ts=' + (new Date()).getTime());
            var data = arr.join('&');
            opt = opt || {};
            var format = tOpt.format;
            aOpt = {
                data: data,
                method: tOpt.method,
                format: format,
                success: opt.success,
                failure: opt.failure
            };
            if (format == 'json') {
                var tObj = {
                    success: opt.success,
                    failure: opt.failure
                };
                aOpt.success = this._jsonSuccess.bind(this, action, tObj);
                aOpt.failure = this._jsonFailure.bind(this, action, tObj);
            }
            return kola.Ajax.request(url, aOpt);
        },
        _jsonSuccess: function(action, options, json) {
            if (json.status == "1") {
                var func = this['_' + action + 'RepData'];
                if (func) func.call(this, json.data);
                if (options.success) options.success(json.data);
            } else {
                if (options.failure) options.failure(json);
            }
        },
        _jsonFailure: function(action, options, trans) {
            if (options.failure) options.failure(trans);
        }
    });
    sohu.You = {
        id: function() {
            var s = window.location.search.replace('?', '').split('&');
            for (var i = s.length - 1; i >= 0; i--) {
                if (s[i] && s[i].indexOf('u=') == 0 && s[i].length > 2) {
                    return s[i].slice(2);
                }
            }
            return null;
        }
    };
    sohu.log = function(data) {
        if (window.console) console.log(data);
    };
    sohu.error = function(data) {
        if (window.console) console.error(data);
    };
    sohu.user = {};
    sohu.user.cookie = kola.Cookie.get('suer');
    if (sohu.user.cookie) {
        sohu.user.cookie = sohu.user.cookie.split('|')
        sohu.user = {
            id: sohu.user.cookie[0],
            token: sohu.user.cookie[1]
        };
    };
    Object.extend(sohu.user, {
        legal: true,
        valid: function() {
            var conf = sohu.user.CONFIG,
            userCookie = kola.Cookie.get('suer');
            if (!this.legal) return false;
            if (userCookie && this.id) {
                if (userCookie.split('|')[0] == this.id) {
                    return true;
                } else {
                    sohu.ctrl.Dialog.alert(conf.otherUserTip, {
                        title: conf.errTipTitle,
                        buttons: {
                            title: conf.buttonOk,
                            func: function() {
                                window.location.reload();
                            },
                            close: true,
                            type: 'main'
                        },
                        close: {
                            callback: function() {
                                sohu.user.legal = true;
                            }
                        }
                    });
                    this.legal = false;
                    return false;
                }
            } else {
                sohu.ctrl.Dialog.alert(conf.notLoginTip, {
                    title: conf.errTipTitle,
                    buttons: {
                        title: conf.buttonOk,
                        func: function() {
                            window.location.reload();
                        },
                        close: true,
                        type: 'main'
                    },
                    close: {
                        callback: function() {
                            sohu.user.legal = true;
                        }
                    }
                });
                this.legal = false;
                return false;
            }
        },
        logout: function() {
            $call(function() {
                PassportSC.logoutHandle(document.body,
                function() {},
                function() {
                    kola.Cookie.remove('suer', '/', PATH.domain);
                    window.location.href = sohu.user.CONFIG.logoutUrl;
                });
            },
            'sohu.passport.*');
        }
    });
    sohu.user.CONFIG = {
        logoutUrl: '/user/logout.do',
        buttonOk: '确定',
        errTipTitle: '出错了',
        notLoginTip: '你还未登录，请先登录再进行此操作~',
        otherUserTip: '你已经用另外一个账号登录白社会，暂时无法进行此操作，待页面刷新后重试~'
    };
    if (!sohu.tool) sohu.tool = {};
    sohu.tool.History = {
        isIE: false,
        isOpera: false,
        isSafari: false,
        isKonquerer: false,
        isGecko: false,
        isSupported: false,
        init: function(callback) {
            this.create({
                debug: false
            });
            this.setFirstLoad();
            this.addListener(callback);
        },
        create: function(options) {
            var that = this;
            var UA = navigator.userAgent.toLowerCase();
            var platform = navigator.platform.toLowerCase();
            var vendor = navigator.vendor || "";
            if (vendor === "KDE") {
                this.isKonqueror = true;
                this.isSupported = false;
            } else if (typeof window.opera !== "undefined") {
                this.isOpera = true;
                this.isSupported = true;
            } else if (typeof document.all !== "undefined") {
                this.isIE = true;
                this.isSupported = true;
            } else if (vendor.indexOf("Apple Computer, Inc.") > -1) {
                this.isSafari = true;
                this.isSupported = (platform.indexOf("mac") > -1);
            } else if (UA.indexOf("gecko") != -1) {
                this.isGecko = true;
                this.isSupported = true;
            }
            sohu.tool.History.storage.setup(options);
            if (this.isSafari) {
                this.createSafari();
            } else if (this.isOpera) {
                this.createOpera();
            }
            var initialHash = this.getCurrentLocation();
            this.currentLocation = initialHash;
            if (this.isIE) {
                this.createIE(initialHash);
            }
            var unloadHandler = function() {
                that.firstLoad = null;
            };
            this.addEventListener(window, 'unload', unloadHandler);
            if (this.isIE) {
                this.ignoreLocationChange = true;
            } else {
                if (!sohu.tool.History.storage.hasKey(this.PAGELOADEDSTRING)) {
                    this.ignoreLocationChange = true;
                    this.firstLoad = true;
                    sohu.tool.History.storage.put(this.PAGELOADEDSTRING, true);
                } else {
                    this.ignoreLocationChange = false;
                    this.fireOnNewListener = true;
                }
            }
            var locationHandler = function() {
                that.checkLocation();
            };
            this._interval = setInterval(locationHandler, 100);
        },
        startListen: function() {
            var that = this;
            this.stopListen();
            this.currentLocation = location.hash.replace('#', '');
            var locationHandler = function() {
                that.checkLocation();
            };
            this._interval = setInterval(locationHandler, 100);
        },
        stopListen: function() {
            window.clearInterval(this._interval);
        },
        setFirstLoad: function() {
            if (this.isIE) {
                if (!sohu.tool.History.storage.hasKey(this.PAGELOADEDSTRING)) {
                    this.fireOnNewListener = false;
                    this.firstLoad = true;
                    sohu.tool.History.storage.put(this.PAGELOADEDSTRING, true);
                }
                else {
                    this.fireOnNewListener = true;
                    this.firstLoad = false;
                }
            }
        },
        addListener: function(listener) {
            this.listener = listener;
            if (this.fireOnNewListener) {
                this.fireHistoryEvent(this.currentLocation);
                this.fireOnNewListener = false;
            }
        },
        addEventListener: function(o, e, l) {
            if (o.addEventListener) {
                o.addEventListener(e, l, false);
            } else if (o.attachEvent) {
                o.attachEvent('on' + e,
                function() {
                    l(window.event);
                });
            }
        },
        add: function(newLocation, historyData) {
            if (this.isSafari) {
                newLocation = this.removeHash(newLocation);
                sohu.tool.History.storage.put(newLocation, historyData);
                this.currentLocation = newLocation;
                window.location.hash = newLocation;
                this.putSafariState(newLocation);
            } else {
                var that = this;
                var addImpl = function() {
                    if (that.currentWaitTime > 0) {
                        that.currentWaitTime = that.currentWaitTime - that.waitTime;
                    }
                    newLocation = that.removeHash(newLocation);
                    if (document.getElementById(newLocation) && that.debugMode) {
                        var e = "Exception: History locations can not have the same value as _any_ IDs that might be in the document," + " due to a bug in IE; please ask the developer to choose a history location that does not match any HTML" + " IDs in this document. The following ID is already taken and cannot be a location: " + newLocation;
                        throw new Error(e);
                    }
                    sohu.tool.History.storage.put(newLocation, historyData);
                    that.ignoreLocationChange = true;
                    that.ieAtomicLocationChange = true;
                    that.currentLocation = newLocation;
                    window.location.hash = newLocation;
                    if (that.isIE) {
                        that.iframe.src = "/support/history.html?" + newLocation;
                    }
                    that.ieAtomicLocationChange = false;
                };
                window.setTimeout(addImpl, this.currentWaitTime);
                this.currentWaitTime = this.currentWaitTime + this.waitTime;
            }
        },
        isFirstLoad: function() {
            return this.firstLoad;
        },
        getVersion: function() {
            return "0.6";
        },
        getCurrentLocation: function() {
            var r = (this.isSafari ? this.getSafariState() : this.getCurrentHash());
            return r;
        },
        getCurrentHash: function() {
            var r = window.location.href;
            var i = r.indexOf("#");
            return (i >= 0 ? r.substr(i + 1) : "");
        },
        PAGELOADEDSTRING: "DhtmlHistory_pageLoaded",
        listener: null,
        waitTime: 200,
        currentWaitTime: 0,
        currentLocation: null,
        iframe: null,
        safariHistoryStartPoint: null,
        safariStack: null,
        safariLength: null,
        ignoreLocationChange: null,
        fireOnNewListener: null,
        firstLoad: null,
        ieAtomicLocationChange: null,
        createIE: function(initialHash) {
            this.waitTime = 400;
            var styles = (sohu.tool.History.storage.debugMode ? 'width: 800px;height:80px;border:1px solid black;': sohu.tool.History.storage.hideStyles);
            var iframeID = "rshHistoryFrame",
            iframeHTML = '<iframe frameborder="0" id="' + iframeID + '" style="' + styles + '" src="/support/history.html?' + initialHash + '"></iframe>',
            iframeContainer = document.createElement('div');
            iframeContainer.innerHTML = iframeHTML;
            document.body.appendChild(iframeContainer);
            this.iframe = document.getElementById(iframeID);
        },
        createOpera: function() {
            this.waitTime = 400;
            var imgHTML = '<img src="javascript:location.href=\'javascript:dhtmlHistory.checkLocation();\';" style="' + sohu.tool.History.storage.hideStyles + '" />',
            imgContainer = document.createElement('div');
            imgContainer.innerHTML = imgHTML;
            document.body.appendChild(imgContainer);
        },
        createSafari: function() {
            var formID = "rshSafariForm";
            var stackID = "rshSafariStack";
            var lengthID = "rshSafariLength";
            var formStyles = sohu.tool.History.storage.debugMode ? sohu.tool.History.storage.showStyles: sohu.tool.History.storage.hideStyles;
            var inputStyles = (sohu.tool.History.storage.debugMode ? 'width:800px;height:20px;border:1px solid black;margin:0;padding:0;': sohu.tool.History.storage.hideStyles);
            var safariHTML = '<form id="' + formID + '" style="' + formStyles + '">' + '<input type="text" style="' + inputStyles + '" id="' + stackID + '" value="[]"/>' + '<input type="text" style="' + inputStyles + '" id="' + lengthID + '" value=""/>' + '</form>';
            var formContainer = document.createElement('div');
            formContainer.innerHTML = safariHTML;
            document.body.appendChild(formContainer);
            this.safariStack = document.getElementById(stackID);
            this.safariLength = document.getElementById(lengthID);
            if (!sohu.tool.History.storage.hasKey(this.PAGELOADEDSTRING)) {
                this.safariHistoryStartPoint = history.length;
                this.safariLength.value = this.safariHistoryStartPoint;
            } else {
                this.safariHistoryStartPoint = this.safariLength.value;
            }
        },
        getSafariStack: function() {
            var r = this.safariStack.value;
            return sohu.tool.History.storage.fromJSON(r);
        },
        getSafariState: function() {
            var stack = this.getSafariStack();
            var state = stack[history.length - this.safariHistoryStartPoint - 1];
            return state;
        },
        putSafariState: function(newLocation) {
            var stack = this.getSafariStack();
            stack[history.length - this.safariHistoryStartPoint] = newLocation;
            this.safariStack.value = sohu.tool.History.storage.toJSON(stack);
        },
        fireHistoryEvent: function(newHash) {
            var historyData = sohu.tool.History.storage.get(newHash);
            this.listener(newHash, historyData);
        },
        checkLocation: function() {
            if (!this.isIE && this.ignoreLocationChange) {
                this.ignoreLocationChange = false;
                return;
            }
            if (!this.isIE && this.ieAtomicLocationChange) {
                return;
            }
            var hash = this.getCurrentLocation();
            if (hash == this.currentLocation) {
                return;
            }
            this.ieAtomicLocationChange = true;
            if (this.isIE && this.getIframeHash() != hash) {
                this.iframe.src = "/support/history.html?" + hash;
            }
            else if (this.isIE) {
                return;
            }
            this.currentLocation = hash;
            this.ieAtomicLocationChange = false;
            this.fireHistoryEvent(hash);
        },
        getIframeHash: function() {
            var doc = this.iframe.contentWindow.document;
            var hash = String(doc.location.search);
            if (hash.length == 1 && hash.charAt(0) == "?") {
                hash = "";
            }
            else if (hash.length >= 2 && hash.charAt(0) == "?") {
                hash = hash.substring(1);
            }
            return hash;
        },
        removeHash: function(hashValue) {
            var r;
            if (hashValue === null || hashValue === undefined) {
                r = null;
            }
            else if (hashValue === "") {
                r = "";
            }
            else if (hashValue.length == 1 && hashValue.charAt(0) == "#") {
                r = "";
            }
            else if (hashValue.length > 1 && hashValue.charAt(0) == "#") {
                r = hashValue.substring(1);
            }
            else {
                r = hashValue;
            }
            return r;
        },
        iframeLoaded: function(newLocation) {
            if (this.ignoreLocationChange) {
                this.ignoreLocationChange = false;
                return;
            }
            var hash = String(newLocation.search);
            if (hash.length == 1 && hash.charAt(0) == "?") {
                hash = "";
            }
            else if (hash.length >= 2 && hash.charAt(0) == "?") {
                hash = hash.substring(1);
            }
            window.location.hash = hash;
            this.fireHistoryEvent(hash);
        }
    };
    sohu.tool.History.storage = {
        setup: function(options) {
            if (typeof options !== "undefined") {
                if (options.debugMode) {
                    this.debugMode = options.debugMode;
                }
            }
            var formID = "rshStorageForm";
            var textareaID = "rshStorageField";
            var formStyles = this.debugMode ? sohu.tool.History.storage.showStyles: sohu.tool.History.storage.hideStyles;
            var textareaStyles = (sohu.tool.History.storage.debugMode ? 'width: 800px;height:80px;border:1px solid black;': sohu.tool.History.storage.hideStyles);
            var textareaHTML = '<form id="' + formID + '" style="' + formStyles + '">' + '<textarea id="' + textareaID + '" style="' + textareaStyles + '"></textarea>' + '</form>';
            var formContainer = document.createElement('div');
            formContainer.innerHTML = textareaHTML;
            document.body.appendChild(formContainer);
            this.storageField = document.getElementById(textareaID);
            if (typeof window.opera !== "undefined") {
                this.storageField.focus();
            }
        },
        put: function(key, value) {
            this.assertValidKey(key);
            if (this.hasKey(key)) {
                this.remove(key);
            }
            this.storageHash[key] = value;
            this.saveHashTable();
        },
        get: function(key) {
            this.assertValidKey(key);
            this.loadHashTable();
            var value = this.storageHash[key];
            if (value === undefined) {
                value = null;
            }
            return value;
        },
        remove: function(key) {
            this.assertValidKey(key);
            this.loadHashTable();
            delete this.storageHash[key];
            this.saveHashTable();
        },
        reset: function() {
            this.storageField.value = "";
            this.storageHash = {};
        },
        hasKey: function(key) {
            this.assertValidKey(key);
            this.loadHashTable();
            return (typeof this.storageHash[key] !== "undefined");
        },
        isValidKey: function(key) {
            return (typeof key === "string");
        },
        showStyles: 'border:0;margin:0;padding:0;',
        hideStyles: 'left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute;',
        debugMode: false,
        storageHash: {},
        hashLoaded: false,
        storageField: null,
        assertValidKey: function(key) {
            var isValid = this.isValidKey(key);
            if (!isValid && this.debugMode) {
                throw new Error("Please provide a valid key for sohu.tool.History.storage. Invalid key = " + key + ".");
            }
        },
        loadHashTable: function() {
            if (!this.hashLoaded) {
                var serializedHashTable = this.storageField.value;
                if (serializedHashTable !== "" && serializedHashTable !== null) {
                    this.storageHash = this.fromJSON(serializedHashTable);
                    this.hashLoaded = true;
                }
            }
        },
        saveHashTable: function() {
            this.loadHashTable();
            var serializedHashTable = this.toJSON(this.storageHash);
            this.storageField.value = serializedHashTable;
        },
        toJSON: function(o) {
            return o.toString();
        },
        fromJSON: function(s) {
            return s;
        }
    };
    PACK.View = {
        init: function() {
            this._initEvents();
            this._initHistory();
            this._firstLoad();
        },
        switchView: function(href, options) {
            var validResult = this._validLocation(href);
            if (validResult) {
                this._switchView(validResult, options);
            } else {
                window.location.href = href;
            }
        },
        _switchView: function(href, options) {
            this._startLoading();
            this._setProperties(href);
            this._setOptions(options);
            if (this._isInAppInner()) {
                if (this._switchBefore()) {
                    this._requestView(href);
                }
            } else {
                window.location.href = this._sourceUrl;
            }
        },
        setHistory: function(href) {
            if (this._firstLoad) {
                this._firstLoad = false;
            } else {
                sohu.tool.History.add(href, '');
            }
        },
        pause: function(autoSetHistory, autoProceed) {
            this._isPause = true;
            this._autoSetHistory = typeof(autoSetHistory) == 'boolean' ? autoSetHistory: true;
            this._autoProceed = typeof(autoProceed) == 'boolean' ? autoProceed: true;
        },
        stop: function(autoStart) {
            this._isStop = true;
            this._autoStart = typeof(autoStart) == 'boolean' ? autoStart: true;
            sohu.tool.History.stopListen();
        },
        start: function() {
            this._isStop = false;
            sohu.tool.History.startListen();
            return true;
        },
        proceed: function() {
            this._isPause = false;
        },
        switchBefore: function(bfCallback) {
            this._beforeCb = bfCallback;
        },
        switchAfter: function(afCallback) {
            this._afterCb = afCallback;
        },
        _setProperties: function(href) {
            href = this._getAbsoluteUrl(href);
            this.location = href;
            this._appName = this._getAppName(href);
            this._appCanvas = this._getAppCanvas(this._appName);
            this._intUrl = this._assembleIntUrl(href);
            this._viewMode = this._getViewMode(href);
            this._sourceUrl = href;
            this._isPause = false;
            this._autoSetHistory = true;
            this._autoProceed = true;
            this._isStop = false;
            this._autoStart = true;
        },
        _setOptions: function(options) {
            this._options = Object.extend({
                bfCallback: typeof(this._beforeCb) == 'function' ? this._beforeCb: function() {
                    return true;
                },
                afCallback: typeof(this._afterCb) == 'function' ? this._afterCb: function() {
                    return true;
                },
                erCallback: function() {
                    return true;
                }
            },
            options || {});
            this._beforeCb = null;
            this._afterCb = null;
        },
        _switchBefore: function() {
            return this._options.bfCallback();
        },
        _switchAfter: function() {
            if (this._options.afCallback()) {
                this.setHistory(this._sourceUrl);
                this.scroll2Top();
                if (this.VisitorApp[this._appName]) {
                    this._setVisitor();
                }
            }
            this._fireLoad();
        },
        _setVisitor: function() {
            $call(function() {
                sohu.visitor.visit();
            },
            'sohu.visitor.*');
        },
        _fireLoad: function() {
            this.fire(sohu.View.EVENTS.load, {
                data: {
                    url: this.location
                }
            });
        },
        scroll2Top: function() {
            var pageEl = $('#page');
            if (pageEl) {
                pageEl.elements()[0].scrollIntoView();
            }
        },
        _switchError: function(rsp) {
            if (this._options.erCallback(rsp)) {
                this.setHistory(this._sourceUrl);
                this._showError(rsp);
            }
            this._endLoading();
        },
        _getAppName: function(url) {
            if (url.indexOf('#') != -1 && url.split('#')[1]) {
                url = url.split('#')[1];
            }
            return url.replace(PACK.View.domain, '').split('/')[2];
        },
        _getAppCanvas: function(appName) {
            return $('#app-' + appName);
        },
        _initEvents: function() {
            $(document).on('click', this._onBodyClick.bindEvent(this));
            kola.Event.initEventObserver(this, {
                afterOn: {
                    'load': this._fireLoad.bind(this)
                }
            });
        },
        _initHistory: function() {
            sohu.tool.History.init(this._historyChange.bind(this));
        },
        _firstLoad: function() {
            var location = this._getAbsoluteUrl(window.location.href);
            this._firstLoad = true;
            if (location != null) {
                this._switchView(location);
                this._reqAppPack(location);
            }
        },
        _onBodyClick: function(e) {
            var isLeftMouseKey = kola.Browser.ie ? e.button == 0 : e.which == 1
            if (isLeftMouseKey && !e.ctrlKey) {
                var el = kola.Event.element(e).upWithMe('a');
                if (el && el.attr('target') != '_blank') {
                    var validResult = this._validLocation(el.attr('href'));
                    if (validResult) {
                        kola.Event.stop(e);
                        this._switchView(validResult, {
                            afCallback: this.start.bind(this)
                        });
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        },
        _validLocation: function(url) {
            var href = this._getAbsoluteUrl(url);
            if (href == null || href == '' || href == '#' || href.indexOf('javascript:') != -1) {
                return null;
            }
            else {
                return href;
            }
        },
        _getAbsoluteUrl: function(url) {
            if (url.indexOf('/app/') == -1) {
                return null;
            }
            if (url == '#' || !this._isSystemApp(url)) {
                return null;
            }
            if (url.lastIndexOf('#') == (url.length - 1)) {
                url = url.slice(0, (url.length - 1));
            }
            if (url.indexOf('#') != -1) {
                url = url.split('#')[1];
            }
            if (url.indexOf('.do') == -1) {
                if (url.lastIndexOf('/') != (url.length - 1)) {
                    url += '/';
                }
            }
            url = url.replace(PACK.View.domain, '');
            return url;
        },
        _reqAppPack: function(url) {
            var pack = 'sohu.' + this._getAppName(url) + '.*';
            $req(pack);
        },
        _getViewMode: function(target) {
            var source = typeof(this._sourceUrl) == 'undefined' ? '': this._sourceUrl,
            s_nodes = source.split('/'),
            t_nodes = target.split('/'),
            arr = [];
            for (var i = 0, len = t_nodes.length; i < len; i++) {
                if (t_nodes[i] != s_nodes[i]) {
                    for (var j = i; j < len; j++) {
                        if (j == (len - 1)) {
                            arr.push(t_nodes[j].split('.')[0]);
                        } else {
                            arr.push(t_nodes[j]);
                        }
                    }
                    break;
                }
            }
            return arr.join('_');
        },
        _isInAppInner: function() {
            if (this._appCanvas) return true;
            else return false;
        },
        _isSystemApp: function(url) {
            var appName = this._getAppName(url);
            if (window.apps_allapps) {
                return (window.apps_allapps[appName] && window.apps_allapps[appName] == 1);
            } else {
                return false;
            }
        },
        _requestView: function() {
            var viewMdl = this._createModel(this._intUrl);
            viewMdl.show({
                '_view_mode': this._viewMode
            },
            {
                success: this._manageView.bind(this),
                failure: this._switchError.bind(this)
            });
        },
        _manageView: function(data) {
            this._bootload(data.bootload);
            this._showView(data.view);
            this._showPageTitle(data.page_title);
            this._onload(data.onload);
            this._endLoading();
            this._switchAfter();
        },
        _delLastLoad: function() {
            try {
                var jsTags = $('head [name=loadByJs]');
                if (jsTags) jsTags.remove();
            } catch(e) {}
        },
        _bootload: function(list) {
            this._load(list);
        },
        _showPageTitle: function(title) {
            document.title = typeof(title) == 'undefined' ? '搜狐 SNS': title.unescapeHTML();
        },
        _showView: function(view) {
            this._appCanvas.html(view);
        },
        _onload: function(list) {
            this._load.bind(this, list).timeout(0);
        },
        _load: function(list) {
            if (typeof(list) == 'object') {
                for (var i = 0; i < list.length; i++) {
                    var it = list[i];
                    if (it.type == 'javascript') {
                        if (typeof(it.src) == 'string' && it.src != '') {
                            if (!this.Cache.get(it.src)) {
                                this.loadJs(it.src);
                                this.Cache.set(it.src, true)
                            }
                        }
                        if (typeof(it.text) == 'string' && it.text != '') {
                            this.evalJs(it.text);
                        }
                    } else if (it.type == 'css') {
                        if (typeof(it.src) == 'string' && it.src != '') {
                            if (!this.Cache.get(it.src)) {
                                this.loadCss(it.src);
                                this.Cache.set(it.src, true)
                            }
                        }
                        if (typeof(it.text) == 'string' && it.text != '') {
                            this.evalCss(it.text);
                        }
                    }
                }
            }
        },
        loadJs: function(jsSrc) {
            var script = kola.Element.create('script');
            script.attr('name', 'loadByJs').attr('type', 'text/javascript').attr('src', jsSrc);
            $('head').append(script);
        },
        evalJs: function(jsText) {
            eval(jsText.unescapeHTML());
        },
        loadCss: function(cssSrc) {
            var link = kola.Element.create('link');
            link.attr('name', 'loadByJs').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', cssSrc);
            $('head').append(link);
        },
        evalCss: function(cssText) {
            var style = kola.Element.create('style');
            style.attr('name', 'loadByJs').attr('type', 'text/css');
            if (style.prop('styleSheet')) {
                style.prop('styleSheet').cssText = cssText;
            } else {
                style.append(document.createTextNode(cssText));
            }
            $('head').append(style);
        },
        _showError: function(rsp) {
            if (rsp.data) {
                if (rsp.data.page_title) {
                    this._showPageTitle(rsp.data.page_title);
                }
                if (rsp.data.view) {
                    this._showView(rsp.data.view);
                }
                else if (rsp.data.toView) {
                    window.location.href = rsp.data.toView;
                }
            } else {
                this._showView(this.ERROR.get(rsp.status));
            }
        },
        _createModel: function(intUrl) {
            return new sohu.core.Model({
                actions: {
                    show: {
                        url: intUrl,
                        method: 'get',
                        format: 'json'
                    }
                },
                url: ''
            });
        },
        _assembleIntUrl: function(href) {
            var url = '/a' + href;
            return url;
        },
        _historyChange: function(locHash) {
            if (this._isPause) {
                if (kola.Browser.ie) {
                    if (this._isFirstCall) {
                        this._isFirstCall = false;
                    } else {
                        this._isFirstCall = true;
                        return
                    }
                } else if (this._autoSetHistory) {
                    this.setHistory(locHash);
                }
                if (this._autoProceed) this.proceed();
            } else {
                if (locHash == '') {
                    locHash = window.location.href;
                    this._firstLoad = true;
                }
                this._switchView(locHash);
            }
        },
        _startLoading: function() {
            $(document.body).addClass('cursor-wait');
        },
        _endLoading: function() {
            $(document.body).removeClass('cursor-wait');
        }
    };
    PACK.View.toView = PACK.View.switchView;
    PACK.View.domain = 'http://' + PATH.domain;
    PACK.View.Cache = {
        data: {},
        set: function(key, value) {
            this.data[key] = value;
        },
        get: function(key) {
            return this.data[key];
        }
    };
    PACK.View.VisitorApp = {
        album: true,
        blog: true
    };
    PACK.View.ERROR = {
        get: function(status) {
            if (status != 404) status = 500;
            if (typeof(viewLyoutType) == 'string' && viewLyoutType == 'blank') return this.blank[status];
            else return this.systemApp[status];
        },
        systemApp: {
            404 : '<div class="msg msg-404-full" style="margin-top: 100px;">' + '<h4>找不到你请求的页面</h4>' + '<p>你可能点击了过期的链接或者输入错误的链接，一些链接区分大小写。</p>' + '<p class="msgActs"><a href="javascript:history.go(-1)">返回上一页</a><span class="pipe">|</span><a title="去首页" href="/home.do">去首页</a></p>' + '</div>',
            500 : '<div class="msg msg-404-full" style="margin-top: 100px;">' + '<h4>此服务暂时不可用</h4>' + '<p>可能运转出现了点小问题，请稍等片刻再尝试一下~如果一直无法解决，请联系客服热线</p>' + '<p class="msgActs"><a href="javascript:history.go(-1)">返回上一页</a><span class="pipe">|</span><a title="去首页" href="/home.do">去首页</a></p>' + '</div>'
        },
        blank: {
            404 : '<div class="msg msg-404-full" style="margin-top: 100px;">' + '<h4>找不到你请求的页面</h4>' + '<p>你可能点击了过期的链接或者输入错误的链接，一些链接区分大小写。</p>' + '<p class="msgActs"><a href="javascript:location.reload()">尝试刷新</a><span class="pipe">|</span><a href="javascript:window.close()">关闭页面</a></p>' + '</div>',
            500 : '<div class="msg msg-404-full" style="margin-top: 100px;">' + '<h4>此应用暂时不可用</h4>' + '<p>可能运转出现了点小问题，请稍等片刻再尝试一下~如果一直无法解决，请联系客服热线</p>' + '<p class="msgActs"><a href="javascript:location.reload()">尝试刷新</a><span class="pipe">|</span><a href="javascript:window.close()">关闭页面</a></p>' + '</div>'
        }
    };
    PACK.View.EVENTS = {
        load: 'load'
    };
    var Config = {
        loading: '<div class="load-page"></div>',
        error: function(obj) {
            var str = '啊哦......白社会运转出现了点小问题，请稍等片刻再尝试一下~';
            if (typeof(obj) == 'object' && obj && !isNaN(obj.status)) {
                var status = parseInt(obj.status);
                if ((status < 400 || status >= 600) && (status != -1)) {
                    var text = obj.statusText;
                    if ((typeof(text) == 'string') && (text.length > 0) && (text.toLowerCase() != 'unknown')) {
                        str = text;
                    }
                }
            }
            return str;
        }
    };
    sohu.config = function(id, obj) {
        var c = Config[id],
        ct = typeof(c);
        if (ct == 'undefined') return null;
        if (ct == 'function') {
            return c(obj);
        }
        if (typeof(obj) == 'object' && obj) {
            var t = new kola.Template(c);
            return t.evaluate(obj);
        } else {
            return c;
        }
    };
},
'kola.core.*');
$register('kola.dom.Form',
function() {
    kola.dom.Form = Class.create({
        initialize: function(form) {
            this.formEle = $(form);
            this.fields = this.readFields();
            if (!this.fields) this.fields = [];
        },
        fieldsToObject: function() {
            var object = {};
            this.fields.each(function(field) {
                var name = field.attr('name');
                var value = field.val();
                if (value == null) return;
                if (typeof(object[name]) == 'undefined') {
                    object[name] = value.escapeHTML();
                } else {
                    object[name] = object[name] + ',' + value.escapeHTML();
                }
            });
            return object;
        },
        disable: function(disable) {
            this.fields.each(function(field) {
                field.prop('disabled', disable);
            });
            this.formEle.down('button').prop('disabled', disable);
            return this;
        },
        val: function() {
            var obj = {};
            this.fields.each(function(field) {
                var name = field.attr('name');
                if (typeof(name) != 'string' || name.length == 0) return;
                var value = field.val();
                if (value == null) return;
                var t = typeof(obj[name]);
                if (t == 'undefined') {
                    obj[name] = value.toString();
                } else {
                    if (t == 'string') {
                        obj[name] = [obj[name]];
                    }
                    obj[name].push(value);
                }
            });
            return obj;
        },
        fieldsToString: function() {
            return Object.toParams(this.fieldsToObject());
        },
        readFields: function() {
            var form = this.formEle.elements()[0];
            return $(form.tagName.toLowerCase() == 'form' ? $($A(form.elements)) : [].concat($A(form.getElementsByTagName('input'))).concat($A(form.getElementsByTagName('select'))).concat($A(form.getElementsByTagName('textarea'))));
        }
    });
    kola.dom.Form.fields = function(form) {
        return new kola.dom.Form(form).readFields();
    };
    kola.dom.Form.objFields = function(form) {
        return new kola.dom.Form(form).fieldsToObject();
    };
    kola.dom.Form.strFields = function(form) {
        return new kola.dom.Form(form).fieldsToString();
    };
    kola.dom.Form.val = function(form) {
        return new kola.dom.Form(form).val();
    };
    kola.dom.Form.setParams = function(params) {
        if (params) {
            for (var o in params) {
                if (params[o] == undefined) {
                    continue;
                }
                document.getElementsByName(o)[0].value = params[o];
            }
        }
    };
    kola.dom.Form.disable = function(form, disable) {
        return new kola.dom.Form(form).disable(disable);
    };
    kola.dom.Form.reset = function(form) {
        return new kola.dom.Form(form).reset();
    };
    kola.dom.Form.maxLength = function(el, max) {
        this._onpropertychange = true;
        el = $(el);
        if (document.attachEvent) {
            el.on('propertychange',
            function(e) {
                if (el.val().byteLength() < max) return;
                if (this._onpropertychange) {
                    this._onpropertychange = false;
                    el.val(el.val().left(max));
                } else {
                    this._onpropertychange = true;
                }
            }.bind(this));
        } else {
            el.on('keyup',
            function(e) {
                if (el.val().byteLength() < max) return;
                el.val(el.val().left(max));
            }.bind(this));
        }
    };
});
$register('kola.dom.Select',
function() {
    Object.extend(kola.Element.prototype, {
        addOptions: function(obj) {
            var el = this._els[0];
            for (var i in obj) {
                if (typeof(obj[i]) == "string") {
                    el.options[el.options.length] = new Option(obj[i], i);
                }
            }
            return this;
        },
        addRange: function(from, to, step) {
            var el = this._els[0];
            step = (typeof(step) == "number" && step != 0) ? Math.abs(step) : 1;
            if (from < to) {
                for (var i = from; i <= to; i += step) {
                    el.options[el.options.length] = new Option(i, i);
                }
            } else {
                for (var i = from; i >= to; i -= step) {
                    el.options[el.options.length] = new Option(i, i);
                }
            }
            return this;
        },
        select: function(val) {
            var el = this._els[0],
            type = typeof(val);
            if (type == "number") {
                el.selectedIndex = (val >= el.options.length ? 0 : val);
            } else if (type == "string") {
                el.value = val;
                if (el.value == '') el.selectedIndex = 0;
            } else {
                el.selectedIndex = 0;
            }
            return this;
        },
        disable: function(val) {
            if (typeof(val) == "boolean") {
                this._els[0].disabled = val;
            }
            return this;
        },
        clear: function() {
            this._els[0].options.length = 0;
            return this;
        }
    });
});
$register('kola.dom.Textarea',
function() {
    Object.extend(kola.Element.prototype, {
        setAutoResize: function(options) {
            this._resizeOptions = Object.extend({
                width: 450,
                minSize: 25,
                maxSize: 1000,
                callback: function() {}
            },
            options || {});
            this.css('overflow', 'hidden');
            this._resizeWrap = $('#textareaResizeWrap');
            if (!this._resizeWrap) {
                this._resizeWrap = kola.Element.create('div', {
                    'id': 'textareaResizeWrap'
                }).css('position', 'absolute').css('top', '-10000px');
                $(document.body).append(this._resizeWrap);
            }
            this.on('keyup',
            function() {
                window.clearTimeout(this._resizeStHandle);
                this._resizeStHandle = window.setTimeout(function() {
                    var height = this._resizeOptions.minSize,
                    width = this.width();
                    width = typeof(width) == 'number' ? width: 0;
                    this._resizeWrap.width(width).html(this.val().nl2br());
                    this._resizeWrap.css('lineHeight', this.css('lineHeight') || '16px');
                    height = this._resizeWrap.height() + 20;
                    if (height != this.height()) {
                        height = Math.max(height, this._resizeOptions.minSize);
                        if (height > this._resizeOptions.maxSize) {
                            height = this._resizeOptions.maxSize;
                            this.css('overflow', 'visible');
                        } else {
                            this.css('overflow', 'hidden');
                        }
                        kola.Anim(this).to('height', height).ondone(function() {
                            this._resizeOptions.callback();
                        }.bind(this)).duration(100).go();
                    }
                }.bind(this), 10);
            }.bind(this));
            return this;
        }
    });
},
'kola.anim.*');
$register('kola.dom.Button',
function() {
    kola.Element.Button = Class.create(kola.Element.prototype, {
        disabled: function() {
            this.up('span.button').addClass('button-disabled');
            this._els[0].setAttribute('disabled', true);
            return this;
        },
        enabled: function() {
            this.up('span.button').removeClass('button-disabled');
            this._els[0].removeAttribute('disabled');
            return this;
        },
        show: function() {
            this.up('span.button').css('display', '');
            return this;
        },
        hide: function() {
            this.up('span.button').hide();
            return this;
        }
    });
})
var Tween = {
    Linear: function(t, b, c, d) {
        return c * t / d + b;
    },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return - c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return - c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return - c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return - c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
};
$register('kola.anim.Tween',
function() {
    kola.anim.Tween = {
        create: function() {
            var c = function() {
                this.init.apply(this, arguments);
                this.__opt = Object.extend({
                    speed: 100,
                    _t: 0,
                    curve: "Quad",
                    curveType: "easeInOut",
                    func: "Linear"
                },
                arguments[0])
                if (!this.__opt.curve && !this.__opt.curveType) {
                    this.__opt._func = Tween.Linear;
                } else {
                    this.__opt._func = Tween[this.__opt.curve][this.__opt.curveType];
                }
                this.stop = function() {
                    clearTimeout(this._timer);
                    return this;
                }
                this._start = function() {
                    if (this.__opt._t < this.__opt.speed) {
                        this.__opt._t++;
                        var _per = Math.ceil(this.__opt._func(this.__opt._t, 0, 200, this.__opt.speed)) / 200;
                        this.method(_per);
                        var _this = this;
                        this.start();
                    } else {
                        this.method(1);
                        this.__opt._t = 0;
                        if (this.callback) this.callback();
                    }
                }
                this.start = function() {
                    this._timer = setTimeout(function() {
                        this._start();
                    }.bind(this), 10)
                    return this;
                }
            }
            for (var i = 0, il = arguments.length, it; i < il; i++) {
                it = arguments[i];
                if (it == null) continue;
                Object.extend(c.prototype, it);
            }
            return c;
        }
    };
    kola.anim.to = kola.anim.Tween.create({
        init: function(options) {
            this._ele = $(options.ele);
            var _info = options.info || this._getAnimInfo(this._ele, options);
            this._attr = options.style;
            this._from = _info.from;
            this._unit = options.unit || _info.unit;
            this._to = _info.to;
            this._callback = options.callback ||
            function() {};
            if (!this._ele.attr("anim-" + this._attr)) {
                this._ele.attr("anim-" + this._attr, true)
            } else {
                return;
            }
            if (_info.type == 1) {
                this.method = this._discolour;
                this.Rgb = kola.anim.colorTool.getColorDetract(_info.to, _info.from)
            }
            if (_info.type == 2) {
                this.method = this._move;
            }
        },
        method: function(per) {
            var st = this._from > this._to ? (this._from - (this._from - this._to) * per) : (this._from + (this._to - this._from) * per);
            this._ele.css(this._attr, st + this._unit);
        },
        _discolour: function(per) {
            var temp = [];
            this.Rgb.each(function(lt, i) {
                temp.push(Math.floor(lt.start - per * lt.value));
            })
            this._ele.css(this._attr, kola.anim.colorTool.getHexColor(temp))
        },
        _move: function(per) {
            var left = this._from[0] > this._to[0] ? (this._from[0] - (this._from[0] - this._to[0]) * per) : (this._from[0] + (this._to[0] - this._from[0]) * per);
            var top = this._from[1] > this._to[1] ? (this._from[1] - (this._from[1] - this._to[1]) * per) : (this._from[1] + (this._to[1] - this._from[1]) * per);
            this._ele.css("left", left + "px");
            this._ele.css("top", top + "px");
        },
        callback: function() {
            this._ele.removeAttr("anim-" + this._attr)
            this._callback();
        },
        _getAnimInfo: function(ele, options) {
            var _info = {
                unit: "",
                type: 0,
                from: "",
                to: ""
            }
            switch (options.style.toLowerCase()) {
            case "width":
            case "height":
            case "left":
            case "top":
            case "padding":
            case "marginLeft":
            case "marginTop":
            case "margin":
                _info.unit = "px";
                _info.from = options.from || ele.box()[options.style] || 0;
                _info.to = options.to;
                break;
            case "background":
            case "color":
            case "borderColor":
                _info.from = kola.anim.colorTool.getRGB(options.from) || ele.css(options.style);
                _info.to = kola.anim.colorTool.getRGB(options.to);
                _info.unit = "#";
                _info.type = 1;
                break;
            case "move":
                _info.from = options.from || [ele.pos().left, ele.pos().top] || [0, 0];
                _info.to = options.to;
                _info.type = 2;
            default:
                break;
            }
            return _info;
        }
    })
    kola.anim.to.action = function(ele, options) {
        return new kola.anim.to(ele, options).start()
    }
    kola.anim.init = function(options) {
        Object.extend(kola.Element.prototype, {
            anim: function(options) {
                options.ele = this;
                kola.anim.to.action(options);
            }
        })
    }
    kola.anim.colorTool = {
        getRGB: function(str) {
            if (!str) {
                return [255, 255, 255]
            }
            if (str.constructor == Array) {
                return str;
            }
            var arr = str.slice(1).split("");
            if (!arr) {
                return false
            }
            while (arr.length < 6) {
                arr[arr.length] = 0
            }
            arr.length = 6;
            return this.getDeci(["" + arr[0] + arr[1], "" + arr[2] + arr[3], "" + arr[4] + arr[5]]);
        },
        getDeci: function(strArray) {
            var result = [];
            strArray.each(function(lt, i) {
                var num = parseInt(lt, 16);
                result[i] = num >= 16 ? num <= 255 ? num: 255 : 16;
            })
            return result;
        },
        getColorDetract: function(arr1, arr2) {
            var temp = [];
            for (var i = 0; i <= 2; i++) {
                var _value = arr2[i] - arr1[i];
                temp[i] = {
                    start: parseInt(arr2[i]),
                    sign: 1,
                    value: _value,
                    type: i
                };
            }
            return temp;
        },
        getHexColor: function(array) {
            var color = "#";
            if (array.length == 3) {
                color += array[0].toString(16) + array[1].toString(16) + array[2].toString(16);
            }
            return color;
        }
    }
    Object.extend(kola.Element.prototype, {
        anim: function(type, options) {
            options.style = type
            options.ele = this;
            kola.anim.to.action(options)
        }
    });
});
$register('kola.anim.Fade',
function() {
    kola.anim.FadeIn = Class.create({
        _setOpacity: function(elem, level) {
            if (kola.Browser.ie) {
                $(elem).css('filter', 'alpha(opacity=' + level + ')');
            } else {
                $(elem).css('opacity', level / 100);
            }
        },
        initialize: function(elem, options) {
            if (elem._els) {
                elem = elem._els[0];
            }
            var ospeed = 10;
            var ofrom = 0;
            var oto = 100;
            var ocallback = null;
            this._setOpacity(elem, ofrom);
            if (options) {
                if (options.speed != null) {
                    ospeed = options.speed;
                }
                if (options.from != null) {
                    ofrom = options.from;
                    this._setOpacity(elem, ofrom);
                }
                if (options.to != null) {
                    oto = options.to;
                }
                if (options.callback != null) {
                    ocallback = options.callback;
                }
            }
            options = {
                speed: ospeed,
                from: ofrom,
                to: oto,
                callback: ocallback
            };
            $(elem).show();
            for (var i = ofrom; i <= oto; i += 5) {
                setTimeout(function(pos) {
                    this._setOpacity(elem, pos);
                }.bind(this, i), (i + 1) * ospeed);
            }
            if (kola.Browser.ie) {
                setTimeout(function() {
                    $(elem).css('display', '');
                    $(elem).css('filter', '')
                },
                ospeed * 105);
            } else {
                setTimeout(function() {
                    $(elem).css('display', '');
                    $(elem).css('opacity', '')
                },
                ospeed * 105);
            }
            if (ocallback) {
                setTimeout(ocallback, ospeed * 100);
            }
        }
    });
    kola.anim.FadeIn.action = function(elem, options) {
        return new kola.anim.FadeIn(elem, options);
    }
    kola.anim.FadeOut = Class.create({
        _setOpacity: function(elem, level) {
            if (kola.Browser.ie) {
                $(elem).css('filter', 'alpha(opacity=' + level + ')');
            } else {
                $(elem).css('opacity', level / 100);
            }
        },
        initialize: function(elem, options) {
            if (elem._els) {
                elem = elem._els[0];
            }
            var ospeed = 10;
            var ofrom = 100;
            var oto = 0;
            var ocallback = null;
            var odisplay = 'none';
            if (options) {
                if (options.speed != null) {
                    ospeed = options.speed;
                }
                if (options.from != null) {
                    ofrom = options.from;
                    this._setOpacity(elem, ofrom);
                }
                if (options.to != null) {
                    oto = options.to;
                }
                if (options.callback != null) {
                    ocallback = options.callback;
                }
                if (options.display != null) {
                    odisplay = options.display;
                }
            }
            options = {
                speed: ospeed,
                from: ofrom,
                to: oto,
                callback: ocallback,
                display: odisplay
            };
            $(elem).show();
            for (var i = oto; i <= ofrom; i += 5) {
                setTimeout(function(pos) {
                    this._setOpacity(elem, 100 - pos);
                }.bind(this, i), (i + 1) * ospeed);
            }
            if (kola.Browser.ie) {
                setTimeout(function() {
                    $(elem).css('display', odisplay);
                    $(elem).css('filter', '')
                },
                ospeed * 105);
            } else {
                setTimeout(function() {
                    $(elem).css('display', odisplay);
                    $(elem).css('opacity', '')
                },
                ospeed * 105);
            }
            if (ocallback) {
                setTimeout(ocallback, ospeed * 105);
            }
        }
    });
    kola.anim.FadeOut.action = function(elem, options) {
        var a = new kola.anim.FadeOut(elem, options);
    }
});
$register('kola.anim.Blind',
function() {
    kola.anim.BlindDown = Class.create({
        initialize: function(elem, options) {
            var ospeed = 10;
            var ocallback = null;
            var oheight = 100;
            if (options) {
                if (options.speed != null) ospeed = options.speed;
                if (options.height != null) oheight = options.height;
                if (options.callback != null) ocallback = options.callback;
            }
            options = {
                speed: ospeed,
                height: oheight,
                callback: ocallback
            };
            if (elem._els) {
                elem = elem._els[0];
            }
            var h = elem.offsetHeight;
            var maxh = oheight;
            function dmove() {
                h += ospeed;
                if (h >= maxh) {
                    elem.style.height = maxh + 'px';
                    clearInterval(iIntervalId);
                } else {
                    elem.style.display = 'block';
                    elem.style.height = h + 'px';
                }
            }
            iIntervalId = setInterval(dmove, 2);
            if (ocallback) {
                setTimeout(ocallback, ospeed * oheight * 0.65);
            }
        }
    });
    kola.anim.BlindDown.action = function(elem, options) {
        return new kola.anim.BlindDown(elem, options);
    }
    kola.anim.BlindUp = Class.create({
        initialize: function(elem, options) {
            var ospeed = 10;
            var ocallback = null;
            var oheight = 0;
            if (options) {
                if (options.speed != null) ospeed = options.speed;
                if (options.height != null) oheight = options.height;
                if (options.callback != null) ocallback = options.callback;
            }
            options = {
                speed: ospeed,
                height: oheight,
                callback: ocallback
            };
            if (elem._els) {
                elem = elem._els[0];
            }
            var h = elem.offsetHeight;
            var maxh = oheight;
            function dmove() {
                h -= ospeed;
                if (h <= 0) {
                    elem.style.display = 'none';
                    clearInterval(iIntervalId);
                } else {
                    elem.style.display = 'block';
                    elem.style.height = h + 'px';
                }
            }
            iIntervalId = setInterval(dmove, 2);
            if (ocallback) {
                setTimeout(ocallback, ospeed * oheight * 0.65);
            }
        }
    });
    kola.anim.BlindUp.action = function(elem, options) {
        return new kola.anim.BlindUp(elem, options);
    }
});
$register("kola.anim.*",
function() {
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
    var version = agent[2] ? parseFloat(agent[2]) : NaN;
    function anim(obj) {
        this.obj = obj;
        this._reset_state();
        this.queue = [];
        this.last_attr = null;
    };
    anim.resolution = 20;
    anim.offset = 0;
    anim.prototype._reset_state = function() {
        this.state = {
            attrs: {},
            duration: 500
        }
    };
    anim.prototype.stop = function() {
        this._reset_state();
        this.queue = [];
        return this;
    };
    anim.prototype._build_container = function() {
        if (this.container_div) {
            this._refresh_container();
            return;
        }
        if (this.obj.firstChild && this.obj.firstChild.__animation_refs) {
            this.container_div = this.obj.firstChild;
            this.container_div.__animation_refs++;
            this._refresh_container();
            return;
        }
        var container = document.createElement('div');
        container.style.padding = '0px';
        container.style.margin = '0px';
        container.style.border = '0px';
        container.__animation_refs = 1;
        var children = this.obj.childNodes;
        while (children.length) {
            container.appendChild(children[0]);
        }
        this.obj.appendChild(container);
        this.obj.style.overflow = 'hidden';
        this.container_div = container;
        this._refresh_container();
    };
    anim.prototype._refresh_container = function() {
        this.container_div.style.height = 'auto';
        this.container_div.style.width = 'auto';
        this.container_div.style.height = this.container_div.offsetHeight + 'px';
        this.container_div.style.width = this.container_div.offsetWidth + 'px';
    };
    anim.prototype._destroy_container = function() {
        if (!this.container_div) {
            return;
        }
        if (!--this.container_div.__animation_refs) {
            var children = this.container_div.childNodes;
            while (children.length) {
                this.obj.appendChild(children[0]);
            }
            this.obj.removeChild(this.container_div);
        }
        this.container_div = null;
    };
    anim.ATTR_TO = 1;
    anim.ATTR_BY = 2;
    anim.ATTR_FROM = 3;
    anim.prototype._attr = function(attr, value, mode) {
        attr = attr.replace(/-[a-z]/gi,
        function(l) {
            return l.substring(1).toUpperCase();
        });
        var auto = false;
        switch (attr) {
        case 'background':
            this._attr('backgroundColor', value, mode);
            return this;
        case 'margin':
            value = anim.parse_group(value);
            this._attr('marginBottom', value[0], mode);
            this._attr('marginLeft', value[1], mode);
            this._attr('marginRight', value[2], mode);
            this._attr('marginTop', value[3], mode);
            return this;
        case 'padding':
            value = anim.parse_group(value);
            this._attr('paddingBottom', value[0], mode);
            this._attr('paddingLeft', value[1], mode);
            this._attr('paddingRight', value[2], mode);
            this._attr('paddingTop', value[3], mode);
            return this;
        case 'backgroundColor':
        case 'borderColor':
        case 'color':
            value = anim.parse_color(value);
            break;
        case 'opacity':
            value = parseFloat(value, 10);
            break;
        case 'height':
        case 'width':
            if (value == 'auto') {
                auto = true;
            } else {
                value = parseInt(value, 10);
            }
            break;
        case 'borderWidth':
        case 'lineHeight':
        case 'fontSize':
        case 'marginBottom':
        case 'marginLeft':
        case 'marginRight':
        case 'marginTop':
        case 'paddingBottom':
        case 'paddingLeft':
        case 'paddingRight':
        case 'paddingTop':
        case 'bottom':
        case 'left':
        case 'right':
        case 'top':
        case 'scrollTop':
        case 'scrollLeft':
            value = parseInt(value, 10);
            break;
        default:
            throw new Error(attr + ' is not a supported attribute!');
        }
        if (this.state.attrs[attr] === undefined) {
            this.state.attrs[attr] = {};
        }
        if (auto) {
            this.state.attrs[attr].auto = true;
        }
        switch (mode) {
        case anim.ATTR_FROM:
            this.state.attrs[attr].start = value;
            break;
        case anim.ATTR_BY:
            this.state.attrs[attr].by = true;
        case anim.ATTR_TO:
            this.state.attrs[attr].value = value;
            break;
        }
    };
    anim.prototype.to = function(attr, value) {
        if (value === undefined) {
            this._attr(this.last_attr, attr, anim.ATTR_TO);
        } else {
            this._attr(attr, value, anim.ATTR_TO);
            this.last_attr = attr;
        }
        return this;
    };
    anim.prototype.by = function(attr, value) {
        if (value === undefined) {
            this._attr(this.last_attr, attr, anim.ATTR_BY);
        } else {
            this._attr(attr, value, anim.ATTR_BY);
            this.last_attr = attr;
        }
        return this;
    };
    anim.prototype.from = function(attr, value) {
        if (value === undefined) {
            this._attr(this.last_attr, attr, anim.ATTR_FROM);
        } else {
            this._attr(attr, value, anim.ATTR_FROM);
            this.last_attr = attr;
        }
        return this;
    };
    anim.prototype.duration = function(duration) {
        this.state.duration = duration ? duration: 0;
        return this;
    };
    anim.prototype.checkpoint = function(distance, callback) {
        if (distance === undefined) {
            distance = 1;
        }
        this.state.checkpoint = distance;
        this.queue.push(this.state);
        this._reset_state();
        this.state.checkpointcb = callback;
        return this;
    };
    anim.prototype.blind = function() {
        this.state.blind = true;
        return this;
    };
    anim.prototype.hide = function() {
        this.state.hide = true;
        return this;
    };
    anim.prototype.show = function() {
        this.state.show = true;
        return this;
    };
    anim.prototype.ease = function(ease) {
        this.state.ease = ease;
        return this;
    };
    anim.prototype.go = function() {
        var time = (new Date()).getTime();
        this.queue.push(this.state);
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].start = time - anim.offset;
            if (this.queue[i].checkpoint) {
                time += this.queue[i].checkpoint * this.queue[i].duration;
            }
        }
        anim.push(this);
        return this;
    };
    anim.prototype._frame = function(time) {
        var done = true;
        var still_needs_container = false;
        var whacky_firefox = false;
        for (var i = 0; i < this.queue.length; i++) {
            var cur = this.queue[i];
            if (cur.start > time) {
                done = false;
                continue;
            }
            if (cur.checkpointcb) {
                this._callback(cur.checkpointcb, time - cur.start);
                cur.checkpointcb = null;
            }
            if (cur.started === undefined) {
                if (cur.show) {
                    this.obj.style.display = 'block';
                }
                for (var a in cur.attrs) {
                    if (cur.attrs[a].start !== undefined) {
                        continue;
                    }
                    switch (a) {
                    case 'backgroundColor':
                    case 'borderColor':
                    case 'color':
                        var val = anim.parse_color($(this.obj).css(a == 'borderColor' ? 'borderLeftColor': a));
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value[0] = Math.min(255, Math.max(0, cur.attrs[a].value[0] + val[0]));
                            cur.attrs[a].value[1] = Math.min(255, Math.max(0, cur.attrs[a].value[1] + val[1]));
                            cur.attrs[a].value[2] = Math.min(255, Math.max(0, cur.attrs[a].value[2] + val[2]));
                        }
                        break;
                    case 'opacity':
                        var val = parseFloat($(this.obj).css('opacity'));
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value = Math.min(1, Math.max(0, cur.attrs[a].value + val));
                        }
                        break;
                    case 'height':
                        var h = $(this.obj).css('height');
                        if (h && h != 'auto') {
                            h = parseInt(h.replace('px', ''));
                        } else {
                            var pt = parseInt($(this.obj).css('paddingTop').replace('px', ''));
                            var pb = parseInt($(this.obj).css('paddingBottom').replace('px', ''));
                            h = $(this.obj).height() - pt - pb;
                        }
                        var val = h;
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value += val;
                        }
                        break;
                    case 'width':
                        var w = $(this.obj).css('width');
                        if (w && w != 'auto') {
                            w = parseInt(w.replace('px', ''));
                        } else {
                            var pl = parseInt($(this.obj).css('paddingLeft').replace('px', ''));
                            var pr = parseInt($(this.obj).css('paddingRight').replace('px', ''));
                            w = $(this.obj).width() - pl - pr;
                        }
                        var val = w;
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value += val;
                        }
                        break;
                    case 'scrollLeft':
                    case 'scrollTop':
                        var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value += val;
                        }
                        cur['last' + a] = val;
                        break;
                    default:
                        var val = parseInt($(this.obj).css(a), 10);
                        if (cur.attrs[a].by) {
                            cur.attrs[a].value += val;
                        }
                        break;
                    }
                    cur.attrs[a].start = val;
                }
                if ((cur.attrs.height && cur.attrs.height.auto) || (cur.attrs.width && cur.attrs.width.auto)) {
                    if (kola.Browser.mozilla && version < 3) {
                        whacky_firefox = true;
                    }
                    this._destroy_container();
                    for (var a in {
                        height: 1,
                        width: 1,
                        fontSize: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 1,
                        paddingBottom: 1
                    }) {
                        if (cur.attrs[a]) {
                            this.obj.style[a] = cur.attrs[a].value + (typeof cur.attrs[a].value == 'number' ? 'px': '');
                        }
                    }
                    if (cur.attrs.height && cur.attrs.height.auto) {
                        var h = $(this.obj).css('height');
                        if (h && h != 'auto') {
                            h = parseInt(h.replace('px', ''));
                        } else {
                            var pt = parseInt($(this.obj).css('paddingTop').replace('px', ''));
                            var pb = parseInt($(this.obj).css('paddingBottom').replace('px', ''));
                            h = $(this.obj).height() - pt - pb;
                        }
                        cur.attrs.height.value = h;
                    }
                    if (cur.attrs.width && cur.attrs.width.auto) {
                        var w = $(this.obj).css('width');
                        if (w && w != 'auto') {
                            w = parseInt(w.replace('px', ''));
                        } else {
                            var pl = parseInt($(this.obj).css('paddingLeft').replace('px', ''));
                            var pr = parseInt($(this.obj).css('paddingRight').replace('px', ''));
                            w = $(this.obj).width() - pl - pr;
                        }
                        cur.attrs.width.value = w;
                    }
                }
                cur.started = true;
                if (cur.blind) {
                    this._build_container();
                }
            }
            var p = (time - cur.start) / cur.duration;
            if (p >= 1) {
                p = 1;
                if (cur.hide) {
                    this.obj.style.display = 'none';
                }
            } else {
                done = false;
            }
            var pc = cur.ease ? cur.ease(p) : p;
            if (!still_needs_container && p != 1 && cur.blind) {
                still_needs_container = true;
            }
            if (whacky_firefox && this.obj.parentNode) {
                var parentNode = this.obj.parentNode;
                var nextChild = this.obj.nextSibling;
                parentNode.removeChild(this.obj);
            }
            for (var a in cur.attrs) {
                switch (a) {
                case 'backgroundColor':
                case 'borderColor':
                case 'color':
                    this.obj.style[a] = 'rgb(' + anim.calc_tween(pc, cur.attrs[a].start[0], cur.attrs[a].value[0], true) + ',' + anim.calc_tween(pc, cur.attrs[a].start[1], cur.attrs[a].value[1], true) + ',' + anim.calc_tween(pc, cur.attrs[a].start[2], cur.attrs[a].value[2], true) + ')';
                    break;
                case 'opacity':
                    $(this.obj).css('opacity', anim.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value));
                    break;
                case 'height':
                case 'width':
                    this.obj.style[a] = pc == 1 && cur.attrs[a].auto ? 'auto': anim.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) + 'px';
                    break;
                case 'scrollLeft':
                case 'scrollTop':
                    var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
                    if (cur['last' + a] != val) {
                        delete cur.attrs[a];
                    } else {
                        var diff = anim.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) - val;
                        if (this.obj != document.body) {
                            this.obj[a] = diff + val;
                        } else {
                            if (a == 'scrollLeft') {
                                window.scrollBy(diff, 0);
                            } else {
                                window.scrollBy(0, diff);
                            }
                        }
                        cur['last' + a] = diff + val;
                    }
                    break;
                default:
                    this.obj.style[a] = anim.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) + 'px';
                    break;
                }
            }
            if (p == 1) {
                this.queue.splice(i--, 1);
                this._callback(cur.ondone, time - cur.start - cur.duration);
            }
        }
        if (whacky_firefox) {
            parentNode[nextChild ? 'insertBefore': 'appendChild'](this.obj, nextChild);
        }
        if (!still_needs_container && this.container_div) {
            this._destroy_container();
        }
        return ! done;
    };
    anim.prototype.ondone = function(fn) {
        this.state.ondone = fn;
        return this;
    };
    anim.prototype._callback = function(callback, offset) {
        if (callback) {
            anim.offset = offset;
            callback.call(this);
            anim.offset = 0;
        }
    };
    anim.calc_tween = function(p, v1, v2, whole) {
        return (whole ? parseInt: parseFloat)((v2 - v1) * p + v1, 10);
    };
    anim.parse_color = function(color) {
        var hex = /^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/i.exec(color);
        if (hex) {
            return [parseInt(hex[1].length == 1 ? hex[1] + hex[1] : hex[1], 16), parseInt(hex[2].length == 1 ? hex[2] + hex[2] : hex[2], 16), parseInt(hex[3].length == 1 ? hex[3] + hex[3] : hex[3], 16)];
        } else {
            var rgb = /^rgba? *\(([0-9]+), *([0-9]+), *([0-9]+)(?:, *([0-9]+))?\)$/.exec(color);
            if (rgb) {
                if (rgb[4] === '0') {
                    return [255, 255, 255];
                } else {
                    return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
                }
            } else if (color == 'transparent') {
                return [255, 255, 255];
            } else {
                throw 'Named color attributes are not supported.';
            }
        }
    };
    anim.parse_group = function(value) {
        var value = value.trim().split(/ +/);
        if (value.length == 4) {
            return value;
        } else if (value.length == 3) {
            return [value[0], value[1], value[2], value[1]];
        } else if (value.length == 2) {
            return [value[0], value[1], value[0], value[1]];
        } else {
            return [value[0], value[0], value[0], value[0]];
        }
    };
    anim.push = function(instance) {
        if (!anim.active) {
            anim.active = [];
        }
        anim.active.push(instance);
        if (!anim._timeout) {
            anim._timeout = setInterval(anim.animate.bind(anim), anim.resolution, false);
        }
        anim.animate(true);
    };
    anim.animate = function(last) {
        var time = (new Date()).getTime();
        for (var i = last === true ? anim.active.length - 1 : 0; i < anim.active.length; i++) {
            try {
                if (!anim.active[i]._frame(time)) {
                    anim.active.splice(i--, 1);
                }
            } catch(e) {
                anim.active.splice(i--, 1);
            }
        }
        if (anim.active.length == 0) {
            clearInterval(anim._timeout);
            anim._timeout = null;
        }
    };
    kola.anim.ease = anim.ease = {};
    kola.anim.ease.begin = anim.ease.begin = function(p) {
        return p * p;
    };
    kola.anim.ease.end = anim.ease.end = function(p) {
        p -= 1;
        return - (p * p) + 1;
    };
    kola.anim.ease.both = anim.ease.both = function(p) {
        if (p <= 0.5) {
            return (p * p) * 2;
        } else {
            p -= 1;
            return (p * p) * -2 + 1;
        }
    };
    anim.prototype.removeEl = function(options) {
        var s = {
            time: 500,
            callback: null
        };
        Object.extend(s, options);
        this.to('height', 0).to('opacity', 0).duration(s.time).ondone(function() {
            $(this.obj).remove();
            if (s.callback) s.callback();
        }.bind(this)).go();
    };
    anim.prototype.insertEl = function(ele, options) {
        var s = {
            method: 'prepend',
            time: 500,
            callback: null
        };
        Object.extend(s, options);
        var obj = $(this.obj);
        obj[s.method](ele);
        var _curEl = null;
        if (typeof ele == 'string') {
            if (s.method == 'prepend') {
                _curEl = obj.first();
            } else if (s.method == 'append') {
                _curEl = obj.last();
            } else if (s.method == 'before') {
                _curEl = obj.prev();
            } else if (s.method == 'after') {
                _curEl = obj.next();
            }
        } else {
            _curEl = ele;
        }
        if (_curEl) {
            _curEl.height(0);
            _curEl.css('overflow', 'hidden');
            _curEl.css('opacity', 0);
            this.obj = _curEl.elements()[0];
            this.to('opacity', 1).to('height', 'auto').duration(s.time).ondone(function() {
                _curEl.removeAttr('style');
                if (s.callback) s.callback();
            }).go();
        }
    };
    anim.prototype.hideEl = function(options) {
        var s = {
            time: 500,
            callback: null
        };
        Object.extend(s, options);
        this.to('height', '0px').to('opacity', 0).hide().duration(s.time).ondone(function() {
            if (s.callback) s.callback();
        }).ease(kola.anim.ease.begin).go();
    };
    anim.prototype.showEl = function(options) {
        var s = {
            time: 500,
            callback: null
        };
        Object.extend(s, options);
        this.to('height', 'auto').to('opacity', 1).hide().duration(s.time).ondone(function() {
            $(this.obj).removeAttr('style');
            if (s.callback) s.callback();
        }.bind(this)).ease(kola.anim.ease.begin).go();
    };
    kola.anim.color = {
        Yellow: '#FFFFCC',
        Red: '#FFCCCC'
    };
    anim.prototype.flashEl = function(options) {
        var s = {
            from: '#FFCCCC',
            to: '#FFFFFF',
            time: 500,
            callback: null
        };
        Object.extend(s, options);
        this.from('backgroundColor', s.from).to('backgroundColor', s.to).duration(s.time).ondone(function() {
            $(this.obj).removeAttr('style');
            if (s.callback) s.callback();
        }).go();
    };
    anim.prototype.fadeColor = function(type, callback) {
        if (!type) type = kola.anim.color.Red;
        this.from('backgroundColor', type).to('backgroundColor', '#FFFFFF').duration(500).ondone(function() {
            $(this.obj).removeAttr('style');
            if (callback) callback();
        }).go();
    };
    kola.Anim = function(obj) {
        if (obj.attr) {
            obj = obj.elements()[0];
        }
        return new anim(obj);
    };
});
$register("sohu.ctrl.Dialog",
function() {
    sohu.ctrl.Dialog = Class.create({
        initialize: function(options) {
            this.opt = Object.extend({
                title: '',
                content: '',
                foot: '',
                width: 400,
                height: '',
                mask: false,
                drag: false,
                close: null,
                open: null,
                buttons: [],
                html: null,
                config: null
            },
            options || {});
            this.buttons = [];
            this.pannel = kola.Element.create("div");
            this._config = {};
            Object.extend(this._config, this.config);
            $(document.body).append(this.pannel);
            this._init();
        },
        config: {
            title: "h4.title",
            body: "div.dBd",
            foot: "div.dFt",
            content: "div.dCt",
            button: "div.dFt .button",
            closeEl: "a.i-close",
            frame: "iframe.maskIframe",
            dialogBox: ".dialog",
            loadClass: "load-page",
            mainButtonClass: "button-main",
            subButtonsClass: "button-sub",
            buttonClass: "button",
            disabledButton: "button-disabled",
            normalButton: "button",
            otherButton: "button-cancel",
            mainButton: "button-main",
            loaddingHtml: "<div class='load-page'></div>"
        },
        _getEls: function() {
            this._els = {
                title: $(this._config.title, this.pannel),
                body: $(this._config.body, this.pannel),
                foot: $(this._config.foot, this.pannel),
                content: $(this._config.content, this.pannel),
                closeEl: $(this._config.closeEl, this.pannel),
                frame: $(this._config.frame, this.pannel),
                dialogBox: $(this._config.dialogBox, this.pannel)
            };
        },
        _init: function() {
            if (this.opt.config) {
                Object.extend(this._config, this.opt.config || {});
            }
            if (this.opt.html) {
                this.template = new kola.Template(this.opt.html);
                this.pannel.html(this.template.evaluate(this.opt)).hide();
            } else {
                var _defaultHtml = [];
                _defaultHtml.push('<div class="dialog"  style="width:');
                _defaultHtml.push(this.opt.width);
                _defaultHtml.push('px;" ><div class="dDc"><span class="tl"></span><span class="tr"></span><span class="br"></span><span class="bl"></span></div><div class="dCt"><div class="dHd"><h4 class="title">');
                _defaultHtml.push(this.opt.title);
                _defaultHtml.push('</h4><div class="option"><a tag="close" href="javascript:void(0)" class="icon i-close">关闭</a></div></div><div class="dBd" style="height:')
                _defaultHtml.push(this.opt.height + 'px;">');
                _defaultHtml.push(this.opt.content);
                _defaultHtml.push('</div><div class="dFt" style="display:none">');
                _defaultHtml.push(this.opt.foot);
                _defaultHtml.push('</div></div></div>');
                this.pannel.html(_defaultHtml.join("")).hide();
            }
            this.body = $(this._config.body, this.pannel) || this.pannel;
            if (this.mask) {
                this.mask.close();
            }
            if (this.opt.mask) {
                this.opt.mask = this.opt.mask.color ? this.opt.mask: {
                    color: "#fff",
                    num: 1
                };
                this.mask = new sohu.ctrl.Mask(this.opt.mask).hide();
            }
            this._getEls();
            this.setButtons(this.opt.buttons);
            this.inUse = true;
            this._regEvent();
            this.setPos();
            if (this.opt.foot) {
                this._els.foot.show();
            }
        },
        _regEvent: function() {
            if (this._els.closeEl) {
                this._els.closeEl.on("click", this._close.bind(this));
            }
            $(document.body).on('keydown', this._keyEvent.bindEvent(this));
            $(window).on("resize", this.setPos.bind(this));
        },
        _show: function() {
            this.pannel.show();
            if (this.mask) {
                this.mask.show.bind(this.mask)();
            }
            if (this.opt.close && this.opt.close.time) {
                this.close(this.opt.close.time);
            }
            if (this._mainButton != undefined && this.buttons[this._mainButton] && this.buttons[this._mainButton].down('button')) {
                this.buttons[this._mainButton].down('button').focus();
            }
            return this;
        },
        _close: function() {
            this.inUse = false;
            if (this.opt.close && this.opt.close.callback) {
                this.opt.close.callback();
            }
            if (this.mask) {
                this.mask.close();
            }
            if (this.pannel && this.pannel.parent()) {
                this.pannel.remove();
            }
            this._clearDom();
        },
        _clearDom: function() {
            this._els = null;
            this.body = null;
            this.pannel = null;
            this.buttons = null;
            this.mask = null;
        },
        _keyEvent: function(e) {
            if (e.keyCode == 27 && this.inUse) {
                this.close();
            }
        },
        setButtons: function(_buttons) {
            if (_buttons && _buttons != [] && _buttons != {}) {
                if (_buttons.constructor == Object) {
                    _buttons = [_buttons];
                }
                var str = "";
                _buttons.each(function(it, i) {
                    if (it && it.constructor == String) {
                        var _title = it;
                        it = {};
                        it.title = _title;
                        it.classType = this._config.subButtonsClass;
                        it.type = '';
                    }
                    if (!it.type) {
                        it.type = '';
                    }
                    if (it && it.constructor == Object) {
                        it.classType = it.type.indexOf("main") > -1 ? this._config.mainButtonClass: this._config.subButtonsClass;
                        it.buttonType = it.form ? it.form: 'button';
                    }
                    str += "<span class='button " + it.classType + "'><span><button type='" + it.buttonType + "' title='" + it.title + "'>" + it.title + "</button></span></span>";
                }.bind(this));
                this.setFoot(str);
                var buttons = $(this._config.button, this.pannel);
                if (buttons) {
                    this.buttons = [];
                    buttons.each(function(it, i) {
                        if (_buttons[i]) {
                            this.buttons.push(it);
                            if (_buttons[i].close == true) {
                                it.on('click', this._close.bind(this));
                            }
                            if (_buttons[i].func && _buttons[i].func.constructor == Function) {
                                it.on('click', _buttons[i].func);
                            }
                            if (_buttons[i].focus || _buttons[i].type == 'main') {
                                if (this.pannel.css('display') != 'none') {
                                    it.down('button').focus();
                                } else {
                                    this._mainButton = i;
                                }
                            }
                        }
                    }.bind(this));
                }
            } else {
                this.setFoot(this.opt.foot);
                this._mainButton = undefined;
            }
            return this;
        },
        disableButton: function(i, title) {
            this.buttons[i].down('button').elements()[0].setAttribute('disabled', 'disabled');
            if (title) {
                this.buttons[i].down('button').html(title);
            }
            this.buttons[i].addClass(this._config.disabledButton);
        },
        enableButton: function(i, title) {
            if (title) {
                this.buttons[i].down('button').html(title);
            }
            this.buttons[i].down('button').removeAttr("disabled");
            this.buttons[i].removeClass(this._config.disabledButton);
        },
        setPos: function(pos) {
            if (!this.inUse) {
                return;
            };
            var pannelBox = this._els.dialogBox ? this._els.dialogBox: this.pannel;
            if (pos && pos.left) {
                pannelBox.pos(pos);
            } else {
                pannelBox.css("marginLeft", -this.opt.width / 2 + "px");
                var top = pannelBox.pos().top;
                var dHeight = pannelBox.height() == 0 ? 180 : pannelBox.height();
                var bHeight = document.documentElement.offsetHeight;
                var bTop = kola.Browser.webkit ? document.body.scrollTop: document.documentElement.scrollTop;
                if (dHeight < bHeight - 30) {
                    pannelBox.css("top", (bHeight - dHeight) / 2 - 30 + bTop + "px");
                } else {
                    pannelBox.css("top", "30px");
                }
            }
            return this;
        },
        setTitle: function(html) {
            if (this._els.title) {
                this._els.title.html(html);
            }
            return this;
        },
        setContent: function(html) {
            if (this._els.body) {
                this._els.body.html(html);
            }
            this.setPos();
            if (this._els.frame && this._els.content) {
                var _height = this._els.content.box().height;
                this._els.frame.css('height', _height + "px");
            }
            return this;
        },
        setHtml: function(html) {
            if (this._els.body) {
                this._els.body.html(html);
            }
            if (this._els.frame && this._els.content) {
                var _height = this._els.content.box().height;
                this._els.frame.css('height', _height + "px");
            }
            return this;
        },
        setFoot: function(html) {
            if (this._els.foot) {
                if (html.trim() == "") {
                    this._els.foot.hide();
                    this._mainButton != undefined;
                } else {
                    this._els.foot.show();
                }
                this._els.foot.html(html);
            }
            return this;
        },
        hide: function() {
            this.pannel.hide();
            if (this.mask) {
                this.mask.hide.bind(this.mask)();
            }
            return this;
        },
        show: function() {
            if (this.opt.open) {
                if (this.opt.open.anim && this.opt.open.anim == 'fade' && !kola.Browser.ie) {
                    var options = {
                        speed: 5,
                        callback: this._show.bind(this)
                    }
                    kola.anim.FadeIn.action(this.pannel, options);
                }
                if (this.opt.open.time) {
                    this.show.timeout(this.opt.open.time);
                } else {
                    this._show();
                }
            } else {
                this._show();
            }
            return this;
        },
        close: function(time) {
            if (time && time.constructor == Number) {
                this.close.bind(this).timeout(time);
                return;
            }
            if (this.opt && this.opt.close) {
                if (this.opt.close.anim && this.opt.close.anim == 'fade' && this.pannel && !kola.Browser.ie) {
                    var options = {
                        speed: 5,
                        callback: this._close.bind(this)
                    }
                    kola.anim.FadeOut.action(this.pannel, options);
                } else {
                    this._close();
                }
            } else {
                this._close();
            }
        },
        setClose: function(num) {
            var _num = num || 2;
            setTimeout(function() {
                this.close();
            }.bind(this), _num * 1000);
        },
        alert: function(info, options) {
            var options = options || {};
            this.opt.content = info;
            this.opt.mask = true;
            this.opt.buttons = {
                title: '确定',
                type: 'main',
                close: true,
                func: options.callback ||
                function() {}
            };
            this.opt.title = "提示";
            sohu.ctrl.Dialog._optionsExtend(this.opt, options);
            this._init();
            this.show();
            return this;
        },
        notice: function(info, options) {
            var options = options || {};
            this.opt.content = info;
            this.opt.mask = true;
            this.opt.close = {
                time: 2,
                anim: 'fade'
            };
            this.opt.buttons = {
                title: '关闭',
                type: 'main',
                close: true,
                func: options.callback ||
                function() {}
            };
            this.opt.title = "提示";
            sohu.ctrl.Dialog._optionsExtend(this.opt, options);
            this._init();
            this.show();
            return this;
        },
        confirm: function(info, options) {
            var options = options || {};
            this.opt.content = info;
            this.opt.mask = true;
            this.opt.buttons = [{
                title: '确定',
                type: 'main',
                close: true,
                func: options.yes ||
                function() {}
            },
            {
                title: '取消',
                type: 'cancel',
                close: true,
                func: options.no ||
                function() {}
            }];
            sohu.ctrl.Dialog._optionsExtend(this.opt, options);
            this._init();
            this.show();
            return this;
        },
        loading: function(title, options) {
            var options = options || {};
            if (title) {
                this.opt.title = title;
            }
            this.opt.mask = true;
            this.opt.content = this._config.loaddingHtml;
            this.opt.foot = '';
            sohu.ctrl.Dialog._optionsExtend(this.opt, options);
            this.opt.buttons = [];
            this._init();
            this.show();
            return this;
        }
    });
    sohu.ctrl.Dialog._optionsExtend = function(opt, options) {
        var _options = options;
        if (options.buttons) {
            var _temp = _options.buttons;
            delete _options.buttons;
            if (_temp.constructor == Array) {
                if (!opt.buttons) {
                    opt.buttons = []
                };
                for (var i = 0; i < _temp.length; i++) {
                    Object.extend(opt.buttons[i], _temp[i]);
                }
            } else if (_temp.constructor == Object) {
                if (!opt.buttons) {
                    opt.buttons = {}
                };
                Object.extend(opt.buttons, _temp)
            }
        };
        if (options.close) {
            var _temp = _options.close;
            delete _options.close;
            if (!opt.close) {
                opt.close = {}
            };
            Object.extend(opt.close, _temp);
        };
        if (options.mask && options.mask.color) {
            var _temp = _options.mask;
            delete _options.mask;
            if (!opt.mask || opt.mask == true) {
                opt.mask = {}
            };
            Object.extend(opt.mask, _temp);
        }
        Object.extend(opt, _options);
        return opt;
    };
    sohu.ctrl.Dialog.alert = function(info, options) {
        var _options = {
            title: '提示',
            content: info,
            mask: true,
            open: {
                anim: 'fade'
            },
            close: {
                anim: 'fade'
            },
            buttons: {
                title: '确定',
                func: function() {},
                close: true,
                type: 'main'
            }
        };
        sohu.ctrl.Dialog._optionsExtend(_options, options || {});
        return new sohu.ctrl.Dialog(_options).show();
    };
    sohu.ctrl.Dialog.confirm = function(info, options) {
        var options = options || {}
        var _options = {
            title: '提示',
            content: info,
            mask: true,
            buttons: [{
                title: '确定',
                func: options.yes ? options.yes: function() {},
                close: options.close == true || options.close == undefined ? true: false,
                type: 'main'
            },
            {
                title: '取消',
                func: options.no ? options.no: function() {},
                close: true,
                type: 'cancel'
            }],
            open: {
                anim: 'fade'
            },
            close: {
                time: 0
            }
        };
        sohu.ctrl.Dialog._optionsExtend(_options, options);
        return new sohu.ctrl.Dialog(_options).show();
    };
    sohu.ctrl.Dialog.loading = function(title, options) {
        var _options = {
            title: title,
            content: "<div class='load-page'></div>",
            mask: true
        };
        sohu.ctrl.Dialog._optionsExtend(_options, options || {});
        _options.buttons = [];
        return new sohu.ctrl.Dialog(_options).show();
    };
    sohu.ctrl.Dialog.notice = function(content, options) {
        var _options = {
            title: '提示',
            content: content,
            open: {
                anim: 'fade'
            },
            close: {
                time: 1,
                anim: 'fade'
            },
            buttons: {
                title: '关闭',
                close: true,
                type: 'main'
            }
        };
        sohu.ctrl.Dialog._optionsExtend(_options, options || {});
        return new sohu.ctrl.Dialog(_options).show();
    },
    sohu.ctrl.Dialog.soMl = function(options) {
        if (options.form_name) {
            options.buttons[0].form = 'submit';
        }
        var _dialog = new sohu.ctrl.Dialog(options);
        if (options.form_name) {
            var _form = document.forms[options.form_name];
            if (_form) {
                $(_form).append(_dialog.pannel);
            }
        }
        _dialog.show();
    };
},
"kola.anim.Fade,sohu.ctrl.Mask");
$register('sohu.ctrl.Emote',
function() {
    var imgPath = PATH.img;
    sohu.ctrl.Emote = Class.create({
        initialize: function(options) {
            this.opt = Object.extend({
                parent: "#uponWrap",
                dataType: "base",
                boxClass: "emoteBox",
                emClass: "emItem",
                path: "",
                pageSize: 32,
                pos: null,
                onSelect: null,
                ctrlEl: null,
                textEl: null,
                preview: false
            },
            options);
            this.dataType = this.opt.dataType;
            this.setData(this.dataType);
            this.pageIndex = 0;
            this.pageSize = this.opt.pageSize;
            this._initEmotePannle();
            return this;
        },
        _initEmotePannle: function() {
            sohu.ctrl.Emote.state = true;
            var _coreHtml = '<div class="emotBox">' + '<div class="emots">' + '</div>' + '<div class="pager pager-simple">' + '<span data-key="up" class="pagePrev pageNow">上一页</span>' + '<span data-key="page">1</span>' + '<a data-key="down" class="pageNext " href="javascript:void(0)">下一页</a>' + '</div>' + '</div>';
            var _html = '<div class="decor">' + '<span class="tl"></span>' + '<span class="tr"></span>' + '<span class="br"></span>' + '<span class="bl"></span>' + '</div>' + '<iframe class="maskIframe" style="width:230px;height:146px;"></iframe>' + '<div class="content">' + _coreHtml + '</div>';
            this.emBox = kola.Element.create("div").css('visibility', 'hidden');
            if (this.opt.parent == "#uponWrap") {
                this.emBox.addClass("popLayer emotLayer");
                this.emBox.html(_html);
                this.coreInUse = true;
            } else {
                this.emBox.html(_coreHtml);
            }
            $(this.opt.parent).append(this.emBox);
            this.emBox.pos(this.opt.pos || {
                left: 0,
                top: 0
            })
            this.emBox.emotsBody = $(".emots", this.emBox);
            this.setPage(this.pageIndex);
            this._initEvent();
            if (this.opt.preview) {
                this._initPreview();
            }
            setTimeout(function() {
                this.emBox.out('click', this.close.bindEvent(this), false);
            }.bind(this), 0);
            if (this.opt.textEl) {
                $(this.opt.textEl).on('keydown',
                function(e) {
                    if (e.keyCode == 13 && sohu.ctrl.Emote.state) {
                        this.close();
                        kola.Event.stop(e);
                    }
                }.bindEvent(this))
                this.opt.onSelect = function(str) {
                    this._initEmoteText($(this.opt.textEl).elements()[0], str);
                    setTimeout(function() {
                        $(this.opt.textEl).focus();
                    }.bind(this), 50);
                }.bind(this);
            }
            if (this.opt.ctrlEl) {
                var cBox = $(this.opt.ctrlEl).box();
                if (cBox.top - this.emBox.box().height < 10) {
                    this.emBox.pos({
                        left: cBox.left,
                        top: cBox.top + cBox.height
                    });
                    this.emBox.css('visibility', 'visible');
                    return;
                }
                if (this.opt.pos == "bottom") {
                    this.emBox.pos({
                        left: cBox.left,
                        top: cBox.top + this.emBox.box().height
                    });
                } else {
                    this.emBox.pos({
                        left: cBox.left,
                        top: cBox.top - this.emBox.box().height
                    });
                }
            }
            this.emBox.css('visibility', 'visible');
        },
        open: function() {
            this.emBox.show();
        },
        hide: function() {
            if (this.pageIndex != 0) {
                this._reSetPage();
            }
            this.emBox.hide();
        },
        close: function(e) {
            this.emBox.remove();
            setTimeout('sohu.ctrl.Emote.state=false', 0);
        },
        setPage: function(num) {
            _num = (this.pageIndex + num) * this.pageSize;
            var _len = this.currentData.length;
            if (_num < 0 || _num > _len) {
                _num = 0;
            }
            this.emBox.emotsBody.html(this._initEmote(_num + 1));
        },
        _initPreview: function() {
            this._previewDiv = kola.Element.create("img");
            this.emBox.append(this._previewDiv);
            this._previewDiv.css("position", "relative");
        },
        _getImg: function(ubb) {
            var url = this.path + ubb + ".gif";
            if (this.opt.preview) {
                this._previewDiv.html('<img src= "' + url + '" />');
            }
        },
        _initEmote: function(index) {
            var _len = this.currentData.length;
            var _html = [];
            for (var i = index; i < index + 32; i++) {
                if (i > _len) {
                    _html.push("</div>");
                    return _html;
                }
                _html.push('<a href="javascript:void(0);return false;" name=' + i + ' class="emot e-' + this.dataType + '-' + i + '" title=""></a>');
            }
            _html.push("</div>");
            return _html.join("");
        },
        _initEvent: function() {
            this._pager = this.emBox.down('.pager');
            this.emBox.on('mouseover', this._choseEmote.bind(this));
            this._pager.on('mousedown', this._pagerEvent.bindEvent(this));
        },
        _boxKeyUp: function(e) {
            if (this.ctrlKeyOn == true && sohu.ctrl.Emote.state) {
                sohu.ctrl.Emote.state = false;
                this.emBox.remove();
            }
        },
        _pagerEvent: function(e) {
            var _upHtml = '<span data-key="up" class="pagePrev pageNow">上一页</span>' + '<span data-key="page">1</span>' + '<a data-key="down" class="pageNext " href="javascript:void(0)">下一页</a>';
            var _downHtml = '<a data-key="up" class="pagePrev " href="javascript:void(0)">上一页</a>' + '<span data-key="page">2</span>' + '<span data-key="down" class="pageNext pageNow">下一页</span>';
            var eSrc = e.srcElement || e.target;
            var src = $(eSrc);
            if (src.attr('data-key') && src.attr('data-key') == "up") {
                this.setPage(0);
                this._pager.html(_upHtml);
                return;
            }
            if (src.attr('data-key') && src.attr('data-key') == 'down') {
                this.setPage(1);
                this._pager.html(_downHtml);
                return;
            }
        },
        _reSetPage: function() {
            var _pageUp = $("a[data-key=up]", this.emBox);
            var _pageDown = $("a[data-key=down]", this.emBox);
            _pageUp.addClass("pageNow");
            _pageDown.removeClass('pageNow');
            this.setPage(0);
        },
        setPos: function(pos) {
            this.emBox.pos(pos);
        },
        _choseEmote: function(e) {
            var eSrc = e.target || e.srcElement;
            var _ele = $(eSrc);
            if (_ele.hasClass("emot")) {
                _num = _ele.attr("name");
                _ubb = this.currentData[_num - 1];
                if (!_ubb) {
                    return;
                }
                _info = this._getInfo(_ubb);
                _ele.attr('title', _info[1]);
                if (!_ele.attr('yes')) {
                    _ele.on('click', this._emoteOnClick.bindEvent(this));
                    _ele.on('mousedown', this._emoteOnMouseDown.bindEvent(this, _ubb));
                    _ele.on('mouseup', this._emoteOnMouseUp.bindEvent(this));
                    _ele.attr("yes", true);
                }
            }
        },
        _emoteOnClick: function(e) {
            if (e.ctrlKey) {
                kola.Event.stop(e);
                return false;
            }
        },
        _emoteOnMouseDown: function(e, ubb) {
            this._setUbb(_ubb);
        },
        _emoteOnMouseUp: function(e) {
            if (!e.ctrlKey) {
                sohu.ctrl.Emote.state = false;
                this.emBox.remove();
            } else {
                this.ctrlKeyOn = true;
            }
        },
        setData: function(type) {
            if (this._Data[type]) {
                this.dataType = type;
                this.currentData = this._Data[this.dataType].data
            }
        },
        _getInfo: function(obj) {
            return this._Ubbs[obj];
        },
        _setUbb: function(str) {
            var ubb = "";
            if (this.dataType == "base") {
                ubb = str;
            } else {
                ubb = "[{" + this.dataType + "}" + str.replace(/[\[\]]/g, "") + "]";
            }
            if (this.opt.onSelect) {
                this.opt.onSelect(ubb, this._getImgTag(ubb));
            }
        },
        _getImgTag: function(ubb) {
            var tag = '',
            imgInfo = this._Ubbs[ubb],
            name = imgInfo[0],
            title = imgInfo[1],
            index = name.substring(0, name.indexOf('.'));
            tag = '<img src="' + imgPath + '/emots/base/' + index + '.gif" title="' + title + '"/>';
            return tag;
        },
        _initEmoteText: function(obj, str) {
            var tc = obj;
            var tclen = tc.value.length;
            tc.focus();
            if (typeof document.selection != "undefined") {
                document.selection.createRange().text = str;
            } else {
                var m = tc.selectionStart;
                tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
                tc.selectionStart = m + str.length;
                tc.setSelectionRange(m + str.length, m + str.length);
            }
        },
        _Data: {
            base: {
                info: {
                    title: "",
                    name: "",
                    icon: ""
                },
                data: ["[:)]", "[#_#]", "[8*)]", "[:D]", "[:-)]", "[:P]", "[B_)]", "[B_I]", "[^_*]", "[:$]", "[:|]", "[:(]", "[:.(]", "[:_(]", "[):(]", "[:V]", "[*_*]", "[:^]", "[:?]", "[:!]", "[=:|]", "[:%]", "[:O]", "[:X]", "[|-)]", "[:Z]", "[:9]", "[:T]", "[:-*]", "[*_/]", "[:#|]", "[:69]", "[//shuang]", "[//qiang]", "[//ku]", "[//zan]", "[//heart]", "[//break]", "[//F]", "[//W]", "[//mail]", "[//strong]", "[//weak]", "[//share]", "[//phone]", "[//mobile]", "[//kiss]", "[//V]", "[//sun]", "[//moon]", "[//star]", "[(!)]", "[//TV]", "[//clock]", "[//gift]", "[//cash]", "[//coffee]", "[//rice]", "[//watermelon]", "[//tomato]", "[//pill]", "[//pig]", "[//football]", "[//shit]"]
            }
        },
        _Ubbs: {
            "[:)]": ["1.gif", "微笑"],
            "[#_#]": ["2.gif", "谄媚"],
            "[8*)]": ["3.gif", "偷笑"],
            "[:D]": ["4.gif", "大笑"],
            "[:-)]": ["5.gif", "害羞"],
            "[:P]": ["6.gif", "调皮"],
            "[B_)]": ["7.gif", "得意"],
            "[B_I]": ["8.gif", "耍酷"],
            "[^_*]": ["9.gif", "讽刺"],
            "[:$]": ["10.gif", "委屈"],
            "[:|]": ["11.gif", "郁闷"],
            "[:(]": ["12.gif", "难过"],
            "[:.(]": ["13.gif", "流泪"],
            "[:_(]": ["14.gif", "大哭"],
            "[):(]": ["15.gif", "发火"],
            "[:V]": ["16.gif", "咒骂"],
            "[*_*]": ["17.gif", "发呆"],
            "[:^]": ["18.gif", "不惑"],
            "[:?]": ["19.gif", "疑惑"],
            "[:!]": ["20.gif", "吃惊"],
            "[=:|]": ["21.gif", "流汗"],
            "[:%]": ["22.gif", "尴尬"],
            "[:O]": ["23.gif", "惊恐"],
            "[:X]": ["24.gif", "闭嘴"],
            "[|-)]": ["25.gif", "犯困"],
            "[:Z]": ["26.gif", "睡觉"],
            "[:9]": ["27.gif", "馋"],
            "[:T]": ["28.gif", "吐"],
            "[:-*]": ["29.gif", "耳语"],
            "[*_/]": ["30.gif", "海盗"],
            "[:#|]": ["31.gif", "重伤"],
            "[:69]": ["32.gif", "拥抱"],
            "[//shuang]": ["33.gif", "爽"],
            "[//qiang]": ["34.gif", "强"],
            "[//ku]": ["35.gif", "酷"],
            "[//zan]": ["36.gif", "赞"],
            "[//heart]": ["37.gif", "红心"],
            "[//break]": ["38.gif", "心碎"],
            "[//F]": ["39.gif", "花开"],
            "[//W]": ["40.gif", "花谢"],
            "[//mail]": ["41.gif", "邮件"],
            "[//strong]": ["42.gif", "手势-棒"],
            "[//weak]": ["43.gif", "手势-逊"],
            "[//share]": ["44.gif", "握手"],
            "[//phone]": ["45.gif", "电话"],
            "[//mobile]": ["46.gif", "手机"],
            "[//kiss]": ["47.gif", "嘴唇"],
            "[//V]": ["48.gif", "V"],
            "[//sun]": ["49.gif", "太阳"],
            "[//moon]": ["50.gif", "月亮"],
            "[//star]": ["51.gif", "星星"],
            "[(!)]": ["52.gif", "灯泡"],
            "[//TV]": ["53.gif", "电视"],
            "[//clock]": ["54.gif", "闹钟"],
            "[//gift]": ["55.gif", "礼物"],
            "[//cash]": ["56.gif", "现金"],
            "[//coffee]": ["57.gif", "咖啡"],
            "[//rice]": ["58.gif", "饭"],
            "[//watermelon]": ["59.gif", "西瓜"],
            "[//tomato]": ["60.gif", "番茄"],
            "[//pill]": ["61.gif", "药丸"],
            "[//pig]": ["62.gif", "猪头"],
            "[//football]": ["63.gif", "足球"],
            "[//shit]": ["64.gif", "便便"]
        }
    });
    sohu.ctrl.Emote.state = false;
    sohu.ctrl.Emote.init = function(options) {
        if (!sohu.ctrl.Emote.state) {
            return new sohu.ctrl.Emote(options);
        } else {
            sohu.ctrl.Emote.state = false;
        }
    };
    sohu.ctrl.Emote.add = function(options) {
        var box = $(options.ctrlEl);
        box.on('click',
        function() {
            sohu.ctrl.Emote.init(options);
        }.bind(this));
    };
});
$register('sohu.ctrl.Lister',
function() {
    var Lister = Class.create({
        initialize: function(options) {
            this.listData = null;
            this._loadingList = false;
            this._setOptions(options);
        },
        _setOptions: function(options) {
            this.options = options;
            this._setBinds();
        },
        _setBinds: function() { ['list', 'del', 'show', 'update'].each(function(it, i) {
                var opt = this.options,
                methodOpt = opt.methods[it];
                if ( !! methodOpt) {
                    this['_model_' + it] = opt.model.obj[methodOpt.action].bind(opt.model.obj);
                }
            }.bind(this));
        },
        _pageList: function(index) {
            this._getListEl().html('<div class="load-page"></div>');
            this.list(index);
        },
        list: function(index) {
            if (this._loadingList) return this;
            this._loadingList = true;
            var opt = this.options;
            this._index = index;
            var data = {};
            switch (opt.type) {
            case 'all':
                break;
            case 'page':
                var data = {
                    start: index,
                    size: opt.list.size
                };
                break;
            case 'more':
                var data = {
                    start: index,
                    size: opt.list.size
                };
                break;
            }
            var func = opt.methods.list.beforeList;
            if (func) func({
                index: index,
                type: opt.type
            });
            return this._action('list', data);
        },
        del: function(id) {
            var data = {};
            data[this.options.model.key] = id;
            return this._action('del', data);
        },
        show: function(id) {
            var data = {};
            data[this.options.model.key] = id;
            return this._action('show', data);
        },
        update: function(data) {
            return this._action('update', data);
        },
        refresh: function() {
            this.list(this._index);
        },
        more: function() {
            var func = null;
            if ((func = this.options) && (func = func.methods) && (func = func.list) && (func = func.getStart) && (typeof(func) == 'function') && (typeof(func = func()) == 'number')) {
                this._start = func;
            }
            this.list(this._start);
        },
        updateItem: function(id, content) {
            this.getItemEl(id).outerHtml(content);
        },
        updateContent: function(data) {
            this._getListEl().html(data.list);
            this._refreshPage(data);
        },
        setContentHtml: function(html) {
            this._getListEl().html(html);
            if (this.options.type == 'page') {
                this._getPageEl().html('');
            }
        },
        delItem: function(id) {
            this.getItemEl(id).remove();
        },
        getItemEl: function(id) {
            var str = this.options.list.itemEl.replace('${id}', id);
            return this._getListEl().down(str);
        },
        setMethodData: function(data, name) {
            this.options.methods[name].data = data;
        },
        setMethodAction: function(str, name) {
            this.options.methods[name].action = str;
            this._setBinds();
        },
        _action: function(method, data) {
            data = Object.extend(data, this.options.methods[method].data || {});
            this['_model_' + method](data, {
                success: this['_' + method + 'Success'].bind(this, data),
                failure: this['_' + method + 'Failure'].bind(this, data)
            });
            return this;
        },
        _refreshPage: function(countInfo) {
            if (this.options.type == 'page') {
                if (!this.pager) {
                    var opt = this.options;
                    this.pager = new sohu.ctrl.Pager(opt.page.ctrEl, {
                        size: opt.list.size,
                        callback: this._pageList.bind(this)
                    });
                }
                this.pager.refresh(countInfo);
            } else {
                var el = this._getPageEl();
                var hadMore = countInfo.start + countInfo.size < countInfo.count;
                if (hadMore) {
                    this._start = countInfo.start + countInfo.size;
                    if (!this.pager) {
                        this.pager = true;
                        if (el.down('a')) el.down('a').on('click', this.more.bind(this));
                        else el.on('click', this.more.bind(this));
                    }
                }
                el[hadMore ? 'show': 'hide']();
            }
        },
        _onBeforeSuccess: function(method, postData, data) {
            var func = this.options.methods[method].beforeSuccess;
            if (func) {
                return func({
                    postData: postData,
                    responseData: data
                });
            } else {
                return data;
            }
        },
        _onAfterSuccess: function(method, postData, data) {
            var func = this.options.methods[method].afterSuccess;
            if (func) {
                func({
                    postData: postData,
                    responseData: data
                });
            }
        },
        _listSuccess: function(postData, data) {
            data = this._onBeforeSuccess('list', postData, data);
            this.listData = data;
            this._loadingList = false;
            var el = this._getListEl(),
            listConfig = this.options.list,
            blank = listConfig.blank;
            switch (this.options.type) {
            case 'all':
                el.html(data || blank || '');
                break;
            case 'page':
                el.html(data.list || blank || '');
                this._refreshPage(data);
                this._setCount(data.count);
                var top = $('#canvas-app');
                if (top) {
                    top.elements()[0].scrollIntoView();
                }
                break;
            case 'more':
                var method = 'append';
                if (postData.start == 0 && (!listConfig.firstMode || listConfig.firstMode == 'replace')) {
                    method = 'html'
                }
                el[method](data.list || blank || '');
                this._refreshPage(data);
                break;
            }
            this._onAfterSuccess('list', postData, data);
        },
        _listFailure: function(postData, error) {
            var loadingEl = this._getListEl().last();
            if (loadingEl && loadingEl.prop('tagName') && (loadingEl.prop('tagName').toLowerCase() == 'div') && (loadingEl.prop('className') == 'load-page')) {
                loadingEl.remove();
            }
            this._getListEl().append('<div class="msg msg-failed">' + sohu.config('error', error) + '</div>');
        },
        _delSuccess: function(postData, data) {
            data = this._onBeforeSuccess('del', postData, data);
            var el = this.getItemEl(postData[this.options.model.key]);
            el.remove();
            this._onAfterSuccess('del', postData, data);
        },
        _delFailure: function(postData, error) {
            $call(function() {
                sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                    title: '出错了'
                });
            },
            'sohu.ctrl.Dialog');
        },
        _showSuccess: function(postData, data) {
            data = this._onBeforeSuccess('show', postData, data);
            this.updateItem(postData[this.options.model.key], data);
            this._onAfterSuccess('show', postData, data);
        },
        _showFailure: function(postData, error) {
            $call(function() {
                sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                    title: '出错了'
                });
            },
            'sohu.ctrl.Dialog');
        },
        _updateSuccess: function(postData, data) {
            data = this._onBeforeSuccess('update', postData, data);
            this.updateItem(postData[this.options.model.key], data);
            this._onAfterSuccess('update', postData, data);
        },
        _updateFailure: function(postData, error) {
            $call(function() {
                sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                    title: '出错了'
                });
            },
            'sohu.ctrl.Dialog');
        },
        _getListEl: function() {
            if (!this._listEl) this._listEl = $(this.options.list.ctrEl);
            return this._listEl;
        },
        _getPageEl: function() {
            if (!this._pageEl) this._pageEl = $(this.options.page.ctrEl);
            return this._pageEl;
        },
        _setCount: function(count) {
            if (this.options.list.countEl) {
                if (!this._countEl) this._countEl = $(this.options.list.countEl);
                this._countEl.html(count);
            }
        }
    });
    Lister.getAllList = function(options) {
        options.type = 'all';
        return new this(options);
    }
    Lister.getPageList = function(options) {
        options.type = 'page';
        return new this(options);
    }
    Lister.getMoreList = function(options) {
        options.type = 'more';
        return new this(options);
    }
    sohu.ctrl.Lister = Lister;
},
'sohu.core.*, sohu.ctrl.Pager, kola.anim.Fade, kola.anim.Blind');
$register("sohu.ctrl.Mask",
function() {
    sohu.ctrl.Mask = Class.create({
        initialize: function(options) {
            var _style = {
                color: options.color,
                per0: options.num / 100,
                per1: options.num
            };
            var _parent = options.parent || document.body;
            var _height = this._getBrowserHeight();
            this.pannel = kola.Element.create("div").html("<iframe height='" + _height + "'> </iframe>");
            this.pannel.addClass("maskLayer");
            this.pannel.attr("style", "background:" + _style.color + ";-moz-opacity:" + _style.per0 + ";opacity:" + _style.per0 + ";filter:alpha(opacity=" + _style.per1 + ");");
            if (options.width) {
                this.pannel.css("width", options.width);
                this.pannel.css("height", options.height);
                this.pannel.css("position", "absolute");
            }
            $(_parent).append(this.pannel);
            if (kola.Browser.ie) {
                this.pannel.css('height', _height + "px");
            }
        },
        show: function() {
            this.pannel.show();
            return this;
        },
        hide: function() {
            this.pannel.hide();
            return this;
        },
        close: function() {
            if (this.pannel.parent()) {
                this.pannel.remove();
            }
        },
        _getBrowserHeight: function() {
            var _h = document.documentElement.scrollHeight;
            var _o = document.documentElement.clientHeight;
            return _h < _o ? _o: _h;
        }
    });
});
$register('sohu.ctrl.Pager',
function() {
    var Pager = Class.create({
        initialize: function(element, options) {
            this._element = $(element);
            this._options = Object.extend({
                category: 1,
                type: 1,
                radios: 1,
                size: 10,
                callback: null
            },
            options || {});
            if (this._options.callback) this._element.on('click', this._activePage.bindEvent(this));
        },
        refresh: function(info) {
            this._updatePages(this._calculate(info));
        },
        _calculate: function(info) {
            var pageCount = 0,
            pageNow = -1,
            pagePrev = -1,
            pageNext = -1,
            pageInfo = {};
            var count = info.count,
            start = info.start,
            size = this._options.size,
            radios = this._options.radios;
            pageCount = Math.ceil(count / size);
            if (pageCount < 2) {
                pageInfo = {
                    pageCount: pageCount
                }
                return pageInfo;
            }
            pageNow = Math.min(Math.floor(start / size), pageCount - 1);
            pagePrev = pageNow - 1;
            pageNext = (pageNow == pageCount - 1 ? -1 : (pageNow + 1));
            if (this._options.category == 1) {
                var first = 0,
                last = pageCount - 1,
                listStart = -1,
                listEnd = -1;
                if (pageCount > 2) {
                    listStart = pageNow - radios,
                    listEnd = pageNow + radios;
                    if (listStart <= first) {
                        var diff = first - listStart + 1;
                        listStart = first + 1;
                        listEnd += diff;
                    }
                    if (listEnd >= last) {
                        var diff = listEnd - last + 1;
                        listEnd -= diff;
                        listStart -= diff;
                        if (listEnd <= first) listEnd = last - 1;
                        if (listStart <= first) listStart = first + 1;
                    }
                }
                pageInfo = {
                    first: first,
                    last: last,
                    listStart: listStart,
                    listEnd: listEnd
                }
            }
            pageInfo.pageCount = pageCount;
            pageInfo.pageNow = pageNow;
            pageInfo.pagePrev = pagePrev;
            pageInfo.pageNext = pageNext;
            return pageInfo;
        },
        _updatePages: function(pageInfo) {
            var html = [];
            if (pageInfo.pageCount > 1) {
                html.push('<a href="javascript:void(0);" class="pagePrev' + (pageInfo.pagePrev > -1 ? '': ' pageNow') + '" data-page="' + pageInfo.pagePrev + '">上一页</a>');
                if (this._options.category == 1) {
                    var getPage = function(page, text) {
                        if (page == pageInfo.pageNow) {
                            return '<strong>' + text + '</strong>';
                        } else {
                            return '<a href="javascript:void(0);" data-page="' + page + '">' + text + '</a>';
                        }
                    }
                    html.push(getPage(pageInfo.first, pageInfo.first + 1));
                    if (pageInfo.listStart > -1 && pageInfo.listStart <= pageInfo.listEnd) {
                        if (pageInfo.listStart > pageInfo.first + 1) {
                            html.push('<span>...</span>');
                        }
                        for (var i = pageInfo.listStart; i <= pageInfo.listEnd; i++) {
                            html.push(getPage(i, i + 1));
                        }
                        if (pageInfo.last > pageInfo.listEnd + 1) {
                            html.push('<span>...</span>');
                        }
                    }
                    html.push(getPage(pageInfo.last, pageInfo.last + 1));
                }
                html.push('<a href="javascript:void(0);" class="pageNext' + (pageInfo.pageNext > -1 ? '': ' pageNow') + '" data-page="' + pageInfo.pageNext + '">下一页</a>');
            }
            this._element.html(html.join(''));
        },
        _activePage: function(e) {
            var element = kola.Event.element(e).upWithMe('[data-page]');
            if (element && element.attr('data-page')) {
                this._options.callback(parseInt(element.attr('data-page')) * this._options.size);
            }
        }
    });
    sohu.ctrl.Pager = Object.extend(Pager, {
        newInstance: function(element, options) {
            return new sohu.ctrl.Pager(element, options);
        }
    });
});
function fOnpropertychange(XEle, XFunc, bCapture) {
    try {
        if (document.addEventListener) {
            return XEle.addEventListener("input", XFunc, bCapture);
        }
        if (document.attachEvent) return XEle.attachEvent("onpropertychange", XFunc);
        throw new Error("浏览器不支持 fOnpropertychange 函数!");
    } catch(e) {
        alert(e)
    }
}
$register("sohu.ctrl.TipSuggest",
function() {
    sohu.ctrl.TipSuggest = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                posto: null,
                isAppend: false,
                position: [0, 0],
                width: 320,
                event: []
            };
            Object.extend(this.settings, options);
            this.element = this.posto = null;
            if (this.settings.element) {
                this.element = $(this.settings.element);
                if (!this.element) return;
                if (this.settings.posto) {
                    this.posto = $(this.settings.posto);
                } else {
                    this.posto = this.element;
                }
                this._bind();
            }
            this._createLayer();
            return this;
        },
        _canChange: true,
        _hide: true,
        _canHide: true,
        _lastValue: '',
        _createLayer: function() {
            this.popWrap = document.createElement('div');
            this.popWrap.className = 'dropWrap';
            if (this.posto) {
                if (this.settings.isAppend) this.posto.append(this.popWrap);
                else this.posto.after(this.popWrap);
            }
            else $(document.body).append(this.popWrap);
            this.popWrap = $(this.popWrap);
            this.popWrap.html('<div class="popLayer" style="display:none;width:' + this.settings.width + 'px;"><iframe class="maskIframe"></iframe><div class="decor"></div><div class="content"><ul class="dropList"></ul></div></div></div>');
            this.pop = this.popWrap.down('.popLayer');
            this.popList = this.pop.down('.dropList');
            this._setPosition();
        },
        _setPosition: function() {
            this.pop.css('left', this.settings.position[0] + 'px');
            this.pop.css('top', this.settings.position[1] + 'px');
        },
        _bind: function() {
            this._bindEvent = function(e, fun) {
                fun.apply(null, [e]);
            };
            this._bindChange = function(e, fun) {
                if (this._canChange) {
                    fun.apply(null, [arguments[2], e]);
                }
            };
            this.settings.event.each(function(i) {
                if (i.e == 'change') {
                    fOnpropertychange(this.element, this._bindChange.bindEvent(this, i.f), true);
                } else {
                    this.element.on(i.e, this._bindEvent.bindEvent(this, i.f));
                }
            }.bind(this));
        },
        setChange: function(bool) {
            this._canChange = bool;
        },
        setElement: function(element, posto, e) {
            this.element = $(element);
            if (this.settings.posto) {
                this.posto = $(this.settings.posto);
            } else {
                this.posto = this.element;
            }
            this.settings.event.each(function(i) {
                if (i.e == e) i.f.apply(null, []);
            });
        },
        setPostion: function() {
            this.popWrap.removeClass("dropWrap");
            this.pop.css('left', (this.element.pos().left + this.settings.position[0]) + 'px');
            this.pop.css('top', (this.element.pos().top + this.settings.position[1]) + 'px');
        },
        tipContent: function(str) {
            if (str.constructor == String) {
                str = [str];
            }
            var r = [];
            str.each(function(i) {
                if (i.indexOf('li') < 0) {
                    r.push("<li class='default'><span>" + i + "</span></li>");
                } else {
                    r.push(i);
                }
            });
            this.popList.html(r.join(''));
        },
        tipAddLi: function(str, id, title) {
            if (this.popList.down('.default')) this.popList.down('.default').remove();
            var t = '';
            if (id != null) t = ' value=' + id;
            if (title) t += ' title="' + title + '"';
            this.popList.append('<li' + t + '>' + str + '</li>');
        },
        tipFirstLiOn: function() {
            this.popList.down('li').get(0).addClass('on');
        },
        clear: function() {
            this.popList.html('');
        },
        tipHide: function() {
            if (!this._hide && this._canHide) {
                this.pop.hide();
                this._hide = true;
            }
        },
        hide: function() {
            this.pop.hide();
            this._hide = true;
        },
        show: function() {
            this.pop.show();
            this._hide = false;
        },
        tipShow: function() {
            if (this._hide) {
                this.pop.show();
                this._hide = false;
            }
        },
        setIframe: function() {
            var height = this.pop.height();
            this.pop.down('.maskIframe').height(height);
        },
        keyAction: function(event, fun) {
            var keys = [38, 40, 13, 9];
            if (!event) return;
            if (keys.include(event.keyCode)) {
                if (event.type == 'keydown') {
                    var index = function(li, cur) {
                        for (var i = 0; i < li.size(); i++) {
                            if (li.get(i).attr('value') == cur.attr('value')) return i;
                        };
                        return - 1;
                    };
                    var li = this.popList.down('li');
                    if (!li) return;
                    var onli = 'li[class=on]';
                    var flag = 0;
                    if (li.get(0).attr('class') == 'default') {
                        if (event.keyCode == 13) {
                            kola.Event.stop(event);
                        }
                        return;
                    }
                    if (!this.popList.down(onli)) {
                        flag = -1;
                    } else {
                        flag = index(li, this.popList.down(onli));
                        this.popList.down(onli).removeClass('on');
                    }
                    var size = li.size();
                    switch (event.keyCode) {
                    case 38:
                        {
                            if (flag == -1 || flag == 0) {
                                li.get(size - 1).addClass('on');
                            } else {
                                li.get(flag - 1).addClass('on');
                            }
                            break;
                        }
                    case 40:
                        {
                            if (flag == -1 || flag == size - 1) {
                                li.get(0).addClass('on');
                            } else {
                                li.get(flag + 1).addClass('on');
                            }
                            break;
                        }
                    case 13:
                        {
                            var r = null;
                            if (flag != -1) {
                                r = {
                                    text: li.get(flag).text(),
                                    value: li.get(flag).attr('value')
                                };
                                this._canHide = true;
                                this.tipHide();
                                fun.apply(null, [r]);
                                this._lastValue = r.value;
                            }
                            kola.Event.stop(event);
                            break;
                        }
                    case 9:
                        {
                            var r = null;
                            if (flag != -1) {
                                r = {
                                    text: li.get(flag).text(),
                                    value: li.get(flag).attr('value')
                                };
                                this._canHide = true;
                                this.tipHide();
                                fun.apply(null, [r]);
                                this._lastValue = r.value;
                            }
                            break;
                        }
                    }
                    return;
                }
            }
        },
        mouseAction: function(fun) {
            this.pop.on('mouseout',
            function() {
                this._canHide = true;
            }.bind(this)).on('mouseover',
            function() {
                this._canHide = false;
            }.bind(this));
            var li = this.popList.down('li');
            if (!li || li.size() == 0) return;
            if (li.get(0).attr('class') == 'default') return;
            if (this.onMouseOver) {
                li.un('mouseover', this.onMouseOver);
            } else {
                this.onMouseOver = this._bindLiOver.bindEvent(this);
            }
            if (this.onClick) {
                li.un('mouseover', this.onClick);
            } else {
                this.onClick = this._bindLiClick.bindEvent(this, fun);
            }
            li.on('mouseover', this.onMouseOver);
            li.on('click', this.onClick);
        },
        _bindLiOver: function(e) {
            var el = kola.Event.element(e).upWithMe('li');
            var onli = this.popList.down('li[class=on]');
            if (onli) onli.removeClass('on');
            el.addClass('on');
        },
        _bindLiClick: function(e, fun) {
            var el = kola.Event.element(e).upWithMe('li');
            var r = {
                text: el.text(),
                value: el.attr('value')
            };
            this._canHide = true;
            this.tipHide();
            fun.apply(null, [r]);
            this._lastValue = r.value;
        }
    });
});
$register("sohu.ctrl.MenuTip",
function() {
    sohu.ctrl.MenuTip = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                posto: null,
                content: [],
                value: [],
                onSelect: function() {},
                show: 'click',
                exceptFrom: '',
                position: [0, 0],
                width: null
            };
            Object.extend(this.settings, options);
            if (this.settings.exceptFrom == '') this.settings.exceptFrom = this.settings.element;
            this.tipSuggest = new sohu.ctrl.TipSuggest({
                element: this.settings.element,
                posto: this.settings.posto,
                position: this.settings.position,
                width: this.settings.width,
                event: [{
                    e: this.settings.show,
                    f: function() {
                        this.tipSuggest.tipContent('');
                        var y = 0;
                        this.settings.content.each(function(i) {
                            this.tipSuggest.tipAddLi(i, this.settings.value[y] ? this.settings.value[y] : '');
                            y++;
                        }.bind(this));
                        this.tipSuggest.tipShow();
                        this.tipSuggest.pop.out('click',
                        function(e) {
                            var el = kola.Event.element(e);
                            var found = el.upWithMe(this.settings.exceptFrom);
                            if (!found) this.tipSuggest.tipHide();
                        }.bind(this), true);
                        this.tipSuggest.mouseAction(function(t) {
                            this.settings.onSelect.apply(null, [t.text, t.value]);
                            this.tipSuggest.tipHide();
                        }.bind(this));
                    }.bind(this)
                }]
            });
        }
    });
});
$register("sohu.ctrl.SelectTip",
function() {
    sohu.ctrl.SelectTip = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                valueEl: null,
                posto: null,
                content: [],
                value: [],
                onSelect: function() {},
                position: [0, 0],
                width: 320
            };
            this.value = "";
            Object.extend(this.settings, options);
            this.element = $(this.settings.element);
            if (this.settings.value.length < 1) {
                this.settings.value = this.settings.content;
            }
            this.tipSuggest = new sohu.ctrl.TipSuggest({
                element: this.settings.element,
                posto: this.settings.posto,
                position: this.settings.position,
                width: this.settings.width,
                event: [{
                    e: 'focus',
                    f: function() {
                        this.tipSuggest.tipClear();
                        this.settings.content.each(function(i, t) {
                            this.tipSuggest.tipAddLi(i, this.settings.value[t]);
                        }.bind(this));
                        this.tipSuggest.tipFirstLiOn();
                        this.tipSuggest.tipShow();
                        this.tipSuggest.mouseAction(function(t) {
                            this.setValue(t.text, t.value);
                            this.settings.onSelect.apply(null, [t.text, t.value])
                        }.bind(this));
                    }.bind(this)
                },
                {
                    e: 'blur',
                    f: function() {
                        this.tipSuggest.tipHide()
                    }.bind(this)
                },
                {
                    e: 'keyup',
                    f: function(e) {
                        this.keyAction(e)
                    }.bind(this)
                },
                {
                    e: 'keydown',
                    f: function(e) {
                        this.keyAction(e)
                    }.bind(this)
                }]
            });
        },
        keyAction: function(e) {
            this.tipSuggest.keyAction(e,
            function(t) {
                this.setValue(t.text, t.value);
            }.bin(this));
        },
        setValue: function(text, value) {
            this.element.val(text);
            this.value = value;
            if (this.settings.valueEl) {
                $(this.settings.valueEl).val(value);
            }
        }
    });
});
$register("sohu.ctrl.SelectChangeTip",
function() {
    sohu.ctrl.SelectChangeTip = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                posto: null,
                isAppend: false,
                isTimer: false,
                valueEl: null,
                position: [0, 0],
                width: 320,
                onFocus: function(v) {},
                onBlur: function() {},
                onChange: function() {},
                onSelect: function() {},
                onBlank: function() {}
            };
            this.value = "";
            this.text = "";
            this.isTiming = false;
            this.timer = null;
            this._cacheData = {};
            Object.extend(this.settings, options);
            this.element = $(this.settings.element);
            this.element.prop('autocomplete', 'off');
            this.tipSuggest = new sohu.ctrl.TipSuggest({
                element: this.settings.element,
                position: this.settings.position,
                isAppend: this.settings.isAppend,
                width: this.settings.width,
                posto: this.settings.posto,
                event: [{
                    e: 'focus',
                    f: function() {
                        var v = this.element.val().trim();
                        this.settings.onFocus(v);
                        this.tipSuggest.setIframe();
                    }.bind(this)
                },
                {
                    e: 'blur',
                    f: function() {
                        this.tipSuggest.tipHide();
                        this.settings.onBlur();
                    }.bind(this)
                },
                {
                    e: 'keyup',
                    f: function(e) {
                        if ([38, 40, 13].include(e.keyCode)) {
                            this.keyaction(e);
                            return;
                        } else {
                            var v = this.element.val().trim();
                            if (v == "") {
                                this.text = v;
                                this.settings.onBlank();
                            } else {
                                if (v != this.text) {
                                    this.text = v;
                                    if (this.settings.isTimer) {
                                        if (!this.isTiming) {
                                            this.isTiming = true;
                                            this.timer = setTimeout(function() {
                                                this._change(v);
                                                this.isTiming = false;
                                            }.bind(this), 400);
                                        } else {
                                            clearTimeout(this.timer);
                                            this.timer = setTimeout(function() {
                                                this._change(v);
                                                this.isTiming = false;
                                            }.bind(this), 400);
                                        }
                                    } else {
                                        this._change(v);
                                    }
                                }
                            }
                        }
                    }.bind(this)
                },
                {
                    e: 'keydown',
                    f: function(e) {
                        this.keyaction(e)
                    }.bind(this)
                }]
            });
        },
        keyaction: function(e) {
            this.tipSuggest.keyAction(e,
            function(t) {
                if (t) {
                    this.setValue(t.text, t.value);
                    this.settings.onSelect.apply(null, [t.text, t.value]);
                }
            }.bind(this));
        },
        content: function(str) {
            this.tipSuggest.tipContent(str);
            this.tipSuggest.tipShow();
        },
        add: function(str, id, title) {
            this.tipSuggest.tipAddLi(str, id, title);
            this.tipSuggest.tipShow();
        },
        firstOn: function() {
            this.tipSuggest.setIframe();
            this.tipSuggest.tipFirstLiOn();
            this.tipSuggest.mouseAction(function(t) {
                this.setValue(t.text, t.value);
                this.settings.onSelect.apply(null, [t.text, t.value]);
            }.bind(this));
        },
        setChange: function(bool) {
            this.tipSuggest.setChange(bool);
        },
        setValue: function(text, value) {
            this.element.val(text);
            this.value = value;
            if (this.settings.valueEl) {
                $(this.settings.valueEl).val(value);
            }
        },
        clear: function() {
            this.tipSuggest.clear();
        },
        hide: function() {
            this.tipSuggest.hide();
        },
        setIframe: function() {
            this.tipSuggest.setIframe();
        },
        setCache: function(key, data) {
            this._cacheData[key] = data;
        },
        getCache: function(key) {
            return this._cacheData[key];
        },
        _change: function(key) {
            var cache = this.getCache(key);
            if (cache) {
                this.settings.onChange.apply(null, [key, cache]);
            } else {
                this.settings.onChange.apply(null, [key]);
            }
        }
    });
});
$register('sohu.channel.*',
function() {
    var PACK = sohu.channel;
    function handleIframeMessageEvent(event) {
        event = event || window.event;
        handleIframeMessage(event.data);
    };
    function handleIframeMessage(msg) {
        channelManager.handleIframeMessage(eval('(' + msg + ')'));
    };
    function jsonToStr(o) {
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "undefined") return "undefined";
        if (typeof o == "object") {
            if (o === null) return "null";
            else if (!o.sort) {
                for (var i in o)
                r.push("\"" + i + "\":" + jsonToStr(o[i]));
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++)
                r.push(jsonToStr(o[i]));
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    };
    function bind(obj, method) {
        var args = [];
        for (var ii = 2; ii < arguments.length; ii++) {
            args.push(arguments[ii]);
        }
        var fn = function() {
            var _obj = obj || (this == window ? false: this);
            var _args = args.slice();
            for (var jj = 0; jj < arguments.length; jj++) {
                _args.push(arguments[jj]);
            }
            if (typeof(method) == "string") {
                if (_obj[method]) {
                    return _obj[method].apply(_obj, _args);
                }
            } else {
                return method.apply(_obj, _args);
            }
        };
        if (typeof method == 'string') {
            fn.name = method;
        } else if (method && method.name) {
            fn.name = method.name;
        }
        return fn;
    };
    PACK.ChannelType = {
        base: {
            domain: 'channel',
            iframe: 'channel_iframe',
            create: true
        },
        game: {
            domain: 'channel1',
            iframe: 'channel_iframe_game',
            create: false
        }
    };
    PACK.ChannelKey = {};
    PACK.set = function(key, channelType) {
        if (!channelType || !PACK.ChannelType[channelType]) {
            PACK.ChannelKey[key] = 'base';
        } else {
            PACK.ChannelKey[key] = channelType;
            var it = PACK.ChannelType[channelType];
            if (!it.create) {
                var iframe = document.createElement('iframe');
                iframe.id = it.iframe;
                var box = document.getElementById('cometWrap');
                if (!box) box = document.body;
                box.appendChild(iframe);
                it.create = true;
            }
        }
    };
    function ChannelManager() {
        this._init();
    };
    ChannelManager.prototype = {
        _init: function() {
            this.keys = [];
            this.path = '/web/bx.html';
            this.cookie = 'cmtChannel';
            this.callback = null;
            this.postMessage = {};
            this.isReady = false;
            this.iframeIsLoaded = false;
            this.iframeIsInit = false;
            this.iframeDomains = {};
            if (window.postMessage) {
                if (window.addEventListener) {
                    window.addEventListener('message', handleIframeMessageEvent, false);
                } else {
                    window.onmessage = handleIframeMessageEvent;
                }
            } else if (document.postMessage) {
                document.addEventListener('message', handleIframeMessageEvent, false);
            } else {}
        },
        _iframeInit: function() {
            this._cookieInit();
            var t = (new Date()).getTime();
            var _iframe, url = '',
            v;
            for (var it in PACK.ChannelType) {
                v = PACK.ChannelType[it];
                _iframe = document.getElementById(v.iframe);
                if (!_iframe) continue;
                this.iframeDomains[v.domain] = false;
                _url = 'http://' + this.url + '.' + v.domain + '.' + PATH.domain + this.path + '?' + t + '#' + PATH.domain + '|' + v.domain;
                this._replaceIframeSrc(_iframe, _url);
            }
        },
        _replaceIframeSrc: function(iframeEl, url) {
            if (iframeEl.contentDocument) {
                try {
                    iframeEl.contentDocument.location.replace(url);
                } catch(e) {}
            } else if (iframeEl.contentWindow) {
                iframeEl.src = url;
            } else if (this.iframe.document) {
                iframeEl.src = url;
            } else {}
            iframeEl = null;
        },
        _cookieInit: function() {
            var n = kola.Cookie.get(this.cookie);
            var i = 0;
            if (!n) {
                this.url = i.toString();
                kola.Cookie.set(this.cookie, '0', '', '/', PATH.domain);
            } else {
                var s = n.split(',');
                while (true) {
                    var ii = i.toString();
                    if (!s.include(ii)) {
                        this.url = ii;
                        s.push(ii);
                        break;
                    }
                    i++;
                }
                kola.Cookie.remove(this.cookie, '/', PATH.domain);
                kola.Cookie.set(this.cookie, s.join(','), '', '/', PATH.domain);
            }
            $(window).on('unload',
            function() {
                var n = kola.Cookie.get(this.cookie);
                if (n) {
                    n = n.split(',');
                    kola.Cookie.remove(this.cookie, '/', PATH.domain);
                    n.splice(n.index(this.url), 1);
                    kola.Cookie.set(this.cookie, n.join(','), '', '/', PATH.domain);
                }
            }.bind(this));
        },
        _checkURL: function() {
            var key = '';
            var path = document.location.pathname;
            if (path.charAt(0) != '/') path = '/' + path;
            var arr = path.split('/');
            if (arr[1] == 'app') {
                key = arr[2] ? arr[2] : '';
            } else {
                var t = arr[1].split('.');
                key = '_' + t[0];
            }
            if (!key) key = '';
            return key;
        },
        _checkAllIframeReady: function(domain) {
            this.iframeDomains[domain] = true;
            var t = true;
            for (var it in this.iframeDomains) {
                if (this.iframeDomains[it] == false) {
                    return false;
                }
            }
            return true;
        },
        handleIframeMessage: function(msg) {
            if (msg.type == 'init') {
                if (this._checkAllIframeReady(msg.domain)) {
                    this.iframeLoaded();
                }
            } else if (msg.type == 'newMsg') {
                this.handleMsg(msg.msg);
            }
        },
        sendIframeMessage: function(msg, type) {
            if (!this.postMessage || !this.postMessage[type]) return;
            this.postMessage[type](jsonToStr(msg), "*");
        },
        subscribe: function(options) {
            this.keys = options.keys;
            this.callback = options.success;
            this.setReady(true);
        },
        stop: function() {
            this.setReady(false);
        },
        setReady: function(isReady) {
            this.isReady = isReady;
            var msg = {
                'type': 'isReady',
                'isReady': isReady
            };
            if (isReady) {
                msg['userid'] = sohu.user.id;
                msg['url'] = this._checkURL();
                var k, t, tmp = {};
                for (var i = 0; i < this.keys.length; i++) {
                    k = this.keys[i];
                    t = PACK.ChannelKey[k];
                    if (t) {
                        if (typeof tmp[t] == 'undefined') {
                            tmp[t] = [];
                        }
                        tmp[t].push(k);
                    }
                }
                for (var it in tmp) {
                    msg['keys'] = tmp[it];
                    this.sendIframeMessage(msg, it);
                }
            }
        },
        handleMsg: function(msg) {
            if (this.callback) this.callback(msg);
        },
        iframeLoaded: function() {
            if (!this.iframeIsLoaded) {
                this.iframeIsLoaded = true;
                for (var it in PACK.ChannelType) {
                    this._iframeItemLoaded(document.getElementById(PACK.ChannelType[it].iframe), it)
                }
                this.setReady(this.isReady);
            }
        },
        _iframeItemLoaded: function(iframeEl, type) {
            if (!iframeEl) return;
            if (window.postMessage) {
                if (typeof window.postMessage == 'object') {
                    var target = iframeEl.contentWindow;
                    this.postMessage[type] = function(message, origin) {
                        target.postMessage(message, origin);
                    };
                } else {
                    this.postMessage[type] = bind(iframeEl.contentWindow, iframeEl.contentWindow.postMessage);
                }
            } else if (document.postMessage) {
                this.postMessage[type] = bind(iframeEl.contentDocument, iframeEl.contentDocument.postMessage);
            } else {
                this.postMessage[type] = bind(iframeEl.contentWindow, iframeEl.contentWindow.handleChannelParentMessage);
            }
            iframeEl = null;
        }
    };
    window.channelManager = new ChannelManager();
    window.handleIframeMessage = handleIframeMessage;
    PACK.init = function() {
        channelManager._iframeInit();
    };
    var Processor = {
        subscribe: function(dataKey) {
            if (!Processor._linker) {
                Processor._linker = channelManager;
            }
            var hadNew = false;
            dataKey.each(function(key) {
                if (Processor._keyMap[key]) return;
                hadNew = true;
                Processor._keyMap[key] = true;
                Processor._keys.push(key);
            });
            if (hadNew) {
                channelManager.subscribe({
                    keys: Processor._keys,
                    success: Processor._succSubscribe
                });
            }
        },
        _succSubscribe: function(data) {
            if (data && data.each && data.length) {
                data.each(function(it) {
                    if (Processor._keyMap[it.k]) {
                        PACK.fire(it.k, {
                            data: it.d
                        });
                    }
                });
            }
        },
        _keys: [],
        _keyMap: {},
        unsubscribe: function(dataKey) {}
    };
    (function() {
        kola.Event.initEventObserver(PACK);
        PACK._on = PACK.on;
        PACK.on = function(name, listener, channelName) {
            var arr = name.toLowerCase().replace(/\s+/g, '').split(',');
            arr.each(function(key) {
                PACK.set(key, channelName);
                PACK._on(key, listener);
            });
            Processor.subscribe(arr);
        };
    })();
},
'sohu.core.*');
$register('sohu.tool.Validator',
function() {
    sohu.tool.Validator = {
        Require: /.+/,
        Username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        Realname: /^[\u4E00-\u9FA5]{2,6}$/,
        Nosign: /^[^\s]{1}[^-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*$/,
        Domain: /^([a-zA-Z0-9]|[-]){4,16}$/,
        V_code: /^[a-zA-Z0-9]{6}$/,
        Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        Phone: /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
        Mobile: /^((\(\d{3}\))|(\d{3}\-))?1(3|5)\d{9}$/,
        Url: /^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./ ? %&=] * ) ? /,
  IdCard : / ^ \d {
            15
        } (\d {
            2
        } [A - Za - z0 - 9]) ? $ / , Currency: /^\d+(\.\d+)?$/, Number: /^\d+$/, Zip: /^[1-9]\d{5}$/, QQ: /^[1-9]\d{4,15}$/, Integer: /^[-\+]?\d+$/, Double: /^[-\+]?\d+(\.\d+)?$/, English: /^[A-Za-z]+$/, Chinese: /^[\u0391-\uFFE5]+$/, UnSafe: /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/, IsSafe: function(str) {
            return ! this.UnSafe.test(str);
        },
        SafeString: "this.IsSafe(value)", Limit: "this.limit(value.trim().length,getAttribute('min'),  getAttribute('max'))", LimitB: "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))", Date: "this.IsDate(value, getAttribute('min'), getAttribute('format'))", Repeat: "value!='' && value == document.getElementsByName(getAttribute('to'))[0].value", Range: "getAttribute('min') < value && value < getAttribute('max')", Compare: "this.compare(value,getAttribute('operator'),getAttribute('to'))", Custom: "this.Exec(value, getAttribute('regexp'))", Group: "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))", ErrorItem: [document.forms[0]], OkItem: [document.forms[0]], ErrorMessage: ["以下原因导致提交失败："], OkMessage: ["以下内容已通过验证："],

        /**
   * @ 验证单个对象
   * @param {Element}
   *            obj 需要被验证的element对象
   * @param {Number}
   *            mode 验证模式
   * @param {Object}
   *            remsg 提示信息 require 是否为必选项 dataType 验证类型与本类的某一静态属性相符 msg
   *            错误提示 okmsg 正确提示
   */
        ValidateThis: function(obj, mode, options) {
            this.ErrorMessage.length = 1;
            this.ErrorItem.length = 1;
            this.ErrorItem[0] = obj;
            this.OkMessage.length = 1;
            this.OkItem.length = 1;
            this.OkItem[0] = obj;

            this.ClearState(obj);
            var goCheck = true;
            if (obj.value == "") {
                if (options.require === true) {
                    this.AddErrorOne(obj, options.remsg);
                    goCheck = false;
                } else if (options.require === false) {
                    goCheck = false;
                }
            }
            if (goCheck) {
                switch (options.dataType) {
                case "Date":
                case "Repeat":
                case "Range":
                case "Compare":
                case "Custom":
                case "Group":
                case "Limit":
                case "LimitB":
                case "SafeString":
                    // alert("不支持此验证方法！");
                    this._alert("不支持此验证方法！");
                    break;
                default:
                    if (!this[options.dataType].test(obj.value)) {
                        this.AddErrorOne(obj, options.msg);
                    } else if (options.okmsg) {
                        this.AddOkOne(obj, options.okmsg);
                    }
                    break;
                }
            }

            this.ShowOkMsg(mode);
            return (this.ShowErrorMsg(mode));
        },

        /**
   * 获得一个对象下所有的提交元素列表
   */
        _elements: function(form) {
            if (form.tagName.toLowerCase() == 'form') {
                return form.elements;
            } else {
                return [].concat($A(form.getElementsByTagName('input'))).concat($A(form.getElementsByTagName('select'))).concat($A(form.getElementsByTagName('textarea')));
            }
        },

        /**
   * 显示Alert方法
   */
        _alert: function(msg) {
            var msgAry = msg.split("\n"),
            alertAry = [];
            if (msgAry.length == 1) {
                alertAry = msgAry;
            } else {
                for (var i = 0; i < msgAry.length; i++) {
                    alertAry[i] = i + 1 + "：" + msgAry[i];
                }
            }

            var alertStr = alertAry.join("<br />");

            sohu.ctrl.Dialog.alert(alertStr);

        },

        /**
   * @ 验证整个表单
   * @param {Form}
   *            theForm 需要被验证的Form对象
   * @param {Number}
   *            mode 验证模式
   */
        Validate: function(theForm, mode) {
            var obj = theForm || event.srcElement;
            var elements = this._elements(obj);
            var count = elements.length;
            this.ErrorMessage.length = 1;
            this.ErrorItem.length = 1;
            this.ErrorItem[0] = obj;
            this.OkMessage.length = 1;
            this.OkItem.length = 1;
            this.OkItem[0] = obj;
            try {
                for (var i = 0; i < count; i++) {
                    var el = elements[i];
                    if (el['disabled']) continue;
                    with(el) {
                        var _dataType = getAttribute("dataType");
                        if (typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined") continue;
                        this.ClearState(elements[i]);
                        if (value == "") {
                            if (getAttribute("require") == "true") {
                                this.AddError(i, getAttribute("remsg"));
                                continue;
                            } else if (getAttribute("require") == "false") {
                                continue;
                            }
                        }
                        switch (_dataType) {
                        case "Date":
                        case "Repeat":
                        case "Range":
                        case "Compare":
                        case "Custom":
                        case "Group":
                        case "Limit":
                        case "LimitB":
                        case "SafeString":
                            if (_dataType == 'Limit' || _dataType == 'LimitB') {
                                var validResult = eval(this[_dataType]),
                                msg = getAttribute("msg");
                                if (validResult == -1) {
                                    this.AddError(i, msg ? msg: getAttribute("lomsg"));
                                } else if (validResult == 1) {
                                    this.AddError(i, msg ? msg: getAttribute("upmsg"));
                                } else if (getAttribute("okmsg")) {
                                    this.AddOkOne(obj, getAttribute("okmsg"));
                                }
                            } else {
                                if (!eval(this[_dataType])) {
                                    this.AddError(i, getAttribute("msg"));
                                } else if (getAttribute("okmsg")) {
                                    this.AddOk(i, getAttribute("okmsg"));
                                }
                            }
                            break;
                        default:
                            if (!this[_dataType].test(value)) {
                                this.AddError(i, getAttribute("msg"));
                            } else if (getAttribute("okmsg")) {
                                this.AddOk(i, getAttribute("okmsg"));
                            }
                            break;
                        }
                    }
                }
            } catch(e) {
                sohu.log('err');
                sohu.log(e.message);
            }
            this.ShowOkMsg(mode);
            return (this.ShowErrorMsg(mode, true));
        },

        /**
   * @ 验证单个元素
   * @param {Form}
   *            theElement 需要被验证的元素
   * @param {Number}
   *            mode 验证模式
   */
        ValidateOne: function(theElement, mode, immediate) {
            var obj = theElement || event.srcElement;
            this.ErrorMessage.length = 1;
            this.ErrorItem.length = 1;
            this.ErrorItem[0] = obj;
            this.OkMessage.length = 1;
            this.OkItem.length = 1;
            this.OkItem[0] = obj;
            with(obj) {
                var _dataType = getAttribute("dataType");
                if (typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined") {
                    var a; // do nothing
                } else {
                    // this.ClearState(obj);
                    var goCheck = true;
                    if (value == "") {
                        if (getAttribute("require") == "true") {
                            this.AddErrorOne(obj, getAttribute("remsg"));
                            goCheck = false;
                        } else if (getAttribute("require") == "false") {
                            goCheck = false;
                        }
                    }
                    if (goCheck) {
                        switch (_dataType) {
                        case "Date":
                        case "Repeat":
                        case "Range":
                        case "Compare":
                        case "Custom":
                        case "Group":
                        case "Limit":
                        case "LimitB":
                        case "SafeString":
                            if (_dataType == 'Limit' || _dataType == 'LimitB') {
                                var validResult = eval(this[_dataType]),
                                msg = getAttribute("msg");
                                if (validResult == -1) {
                                    this.AddErrorOne(obj, msg ? msg: getAttribute("lomsg"));
                                } else if (validResult == 1) {
                                    this.AddErrorOne(obj, msg ? msg: getAttribute("upmsg"));
                                } else if (getAttribute("okmsg")) {
                                    this.AddOkOne(obj, getAttribute("okmsg"));
                                }
                            } else {
                                if (!eval(this[_dataType])) {
                                    this.AddErrorOne(obj, getAttribute("msg"));
                                } else if (getAttribute("okmsg")) {
                                    this.AddOkOne(obj, getAttribute("okmsg"));
                                }
                            }
                            break;
                        default:
                            if (!this[_dataType].test(value)) {
                                this.AddErrorOne(obj, getAttribute("msg"));
                            } else if (getAttribute("okmsg")) {
                                this.AddOkOne(obj, getAttribute("okmsg"));
                            }
                            break;
                        }
                    }
                }
            }
            if (typeof(immediate) == 'boolean' && !immediate) {
                this.ShowOkMsg(mode);
                if (this.ErrorMessage.length == 1) this.ClearState(obj);
                return false;
            } else {
                this.ClearState(obj);
                this.ShowOkMsg(mode);
                return (this.ShowErrorMsg(mode));
            }
        },

        /**
   * @ 添加通知容器
   * @param {Object}
   *            obj 通知容器的父容器
   */
        GetNoticeBox: function(obj) {
            var tipTag = sohu.tool.Validator.tip;
            try {
                // 下面是在GIFT项目时，添加的把消息显示的标签对应到那个元素后面
                if (obj.getAttribute('posto') && $(obj.getAttribute('posto'))) {
                    var posto = $(obj.getAttribute('posto')),
                    tip = posto.next();
                    if (tip && tip.prop('tagName').toLowerCase() == tipTag) {
                        return tip.elements()[0];
                    } else {
                        var tip = kola.Element.create(tipTag);
                        posto.after(tip);
                        return tip.elements()[0];
                    }
                }
                var spanCorrect = $(obj).parent().down('span.formCorrect'),
                spanError = $(obj).parent().down('span.formError');

                if (spanCorrect) {
                    return spanCorrect.elements()[0];
                } else if (spanError) {
                    return spanError.elements()[0];
                } else {
                    var span = document.createElement(tipTag);
                    obj.parentNode.appendChild(span);
                    return span;
                }
            } catch(e) {
                return null;
            }
        },

        /**
   * @ 显示错误
   * @param {Object}
   *            obj 显示信息容器的父容器
   * @param {String}
   *            error 错误内容
   */
        ShowError: function(obj, error) {
            var span = sohu.tool.Validator.GetNoticeBox(obj);
            if (span) {
                span.className = "formError";
                span.innerHTML = error;
                span.style.visibility = "visible";
            }
        },

        /**
   * @ 显示信息
   * @param {Object}
   *            obj 显示信息容器的父容器
   * @param {String}
   *            info 提示内容
   */
        ShowInfo: function(obj, info) {
            var span = sohu.tool.Validator.GetNoticeBox(obj);
            if (span) {
                span.className = "formCorrect";
                span.innerHTML = info;
                span.style.visibility = "hidden";
            }
        },

        /**
   * @ 显示错误信息
   * @param {Number}
   *            mode 显示类型
   * @param {Boolean}
   *            是否滚动到出错的元素
   */
        ShowErrorMsg: function(mode, isToView) {
            if (this.ErrorMessage.length > 1) {
                mode = mode || 1;
                var errCount = this.ErrorItem.length;
                switch (mode) {
                case 2:
                case 1:
                    this.ErrorMessage.shift();
                    var msg = this.ErrorMessage.join("\n");
                    this._alert(msg);
                    try {
                        var item = $(this.ErrorItem[1]);
                        if (item.attr('focusto')) {
                            $(item.attr('focusto')).focus();
                        } else {
                            if (item.attr('type') != 'hidden') {
                                item.focus();
                            }
                        }
                    } catch(e) {}

                    break;
                case 3:
                    for (var i = 1; i < errCount; i++) {
                        try {
                            var span = this.GetNoticeBox(this.ErrorItem[i]);
                            if (span) {
                                span.innerHTML = this.ErrorMessage[i].replace(/\d+:/, "");
                                span.className = "formError";
                                span.style.visibility = "visible";
                            }
                        } catch(e) {
                            this._alert(e.description);
                        }
                    }
                    if (isToView) {
                        try {
                            var item = $(this.ErrorItem[1]);
                            if (item.attr('focusto')) {
                                $(item.attr('focusto')).focus();
                            } else {
                                if (item.attr('type') != 'hidden') {
                                    item.focus();
                                }
                            }
                            // this.ErrorItem[1].scrollIntoView();
                        } catch(e) {}
                    }
                    break;
                case 4:
                    for (var i = 1; i < errCount; i++) {
                        try {
                            var span = this.GetNoticeBox(this.ErrorItem[i]);
                            if (span) {
                                span.innerHTML = this.ErrorMessage[i].replace(/\d+:/, "");
                                span.className = "formError";
                                span.style.visibility = "visible";
                            }
                        } catch(e) {
                            this._alert(e.description);
                        }
                    }
                    this.ErrorMessage.shift();
                    var msg = this.ErrorMessage.join("\n");
                    this._alert(msg);

                    if (isToView) {
                        try {
                            var item = $(this.ErrorItem[1]);
                            if (item.attr('focusto')) {
                                $(item.attr('focusto')).focus();
                            } else {
                                if (item.attr('type') != 'hidden') {
                                    item.focus();
                                }
                            }
                            // this.ErrorItem[1].scrollIntoView();
                        } catch(e) {}
                    }
                    break;
                default:
                    // alert(this.ErrorMessage.join("\n"));
                    var msg = this.ErrorMessage.join("\n");
                    this._alert(msg);
                    break;
                }
                return false;
            }
            return true;
        },

        /**
   * @ 显示正确信息
   * @param {Number}
   *            mode 显示类型
   */
        ShowOkMsg: function(mode) {
            if (this.OkMessage.length > 1) {
                mode = mode || 1;
                var okCount = this.OkItem.length;
                switch (mode) {
                case 2:
                    /*
       * for(var i=1;i<okCount;i++)
       * this.OkItem[i].style.color = "green";
       */
                case 1:
                    // alert(this.OkMessage.join("\n"));
                    // this.OkItem[1].focus();
                    break;
                case 3:
                    for (var i = 1; i < okCount; i++) {
                        try {
                            var span = this.GetNoticeBox(this.OkItem[i]);
                            if (span) {
                                span.innerHTML = this.OkMessage[i].replace(/\d+:/, "");
                                span.className = "formCorrect";
                                span.style.visibility = "visible";
                            }
                        } catch(e) {
                            this._alert(e.description);
                        }
                        // catch(e){alert(e.description);}

                    }
                    break;
                default:
                    // alert(this.OkMessage.join("\n"));
                    break;
                }
                return true;
            }
            return true;
        },

        /**
   * @ 显示错误信息
   * @param {Object}
   *            obj 通知容器的父容器
   * @param {String}
   *            提示内容
   */
        limit: function(len, min, max) {
            min = min || 0;
            max = max || Number.MAX_VALUE;
            if (min != 0) {
                if (len < min) return - 1;
            }
            if (len > max) return 1
            return 2;
        },
        LenB: function(str) {
            return str.replace(/[^\x00-\xff]/g, "**").length;
        },

        /**
   * @ 清空提示内容
   * @param {Object}
   *            obj 提示信息容器的父容器
   */
        Clear: function(obj) {
            var span = sohu.tool.Validator.GetNoticeBox(obj);
            if (span) {
                //span.innerHTML = "";
                span.style.visibility = 'hidden';
            }
            //span.parentNode.removeChild(span);
        },

        /**
   * @ 清空提示内容
   * @param {Element}
   *            elem 提示信息容器的父容器
   */
        ClearState: function(elem) {
            this.Clear(elem);
        },

        /**
   * @ 增加错误提示信息
   * @param {Number}
   *            index 错误信息显示的元素索引
   */

        AddError: function(index, str) {
            this.ErrorItem[this.ErrorItem.length] = this._elements(this.ErrorItem[0])[index];
            this.ErrorMessage[this.ErrorMessage.length] = str;
        },

        /**
   * @ 增加错误提示信息
   * @param {Object}
   *            obj 错误信息显示的元素索引
   */
        AddErrorOne: function(obj, str) {
            this.ErrorItem[this.ErrorItem.length] = obj;
            this.ErrorMessage[this.ErrorMessage.length] = str;
        },
        AddOk: function(index, str) {
            this.OkItem[this.OkItem.length] = this._elements(this.OkItem[0])[index];
            this.OkMessage[this.OkMessage.length] = str;
            // alert(this.OkMessage);
        },

        AddOkOne: function(obj, str) {
            this.OkItem[this.OkItem.length] = obj;
            this.OkMessage[this.OkMessage.length] = str;
        },

        Exec: function(op, reg) {
            return new RegExp(reg, "g").test(op);
        },
        compare: function(op1, operator, op2) {
            switch (operator) {
            case "NotEqual":
                return (op1 != op2);
            case "GreaterThan":
                return (op1 > op2);
            case "GreaterThanEqual":
                return (op1 >= op2);
            case "LessThan":
                return (op1 < op2);
            case "LessThanEqual":
                return (op1 <= op2);
            default:
                return (op1 == op2);
            }
        },
        MustChecked: function(name, min, max) {
            var groups = document.getElementsByName(name);
            var hasChecked = 0;
            min = min || 1;
            max = max || groups.length;
            for (var i = groups.length - 1; i >= 0; i--)
            if (groups[i].checked) hasChecked++;
            return min <= hasChecked && hasChecked <= max;
        },
        IsDate: function(op, formatString) {
            formatString = formatString || "ymd";
            var m, year, month, day;
            switch (formatString) {
            case "ymd":
                m = op.match(new RegExp("^\\s*((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})\\s*$"));
                if (m == null) return false;
                day = m[6];
                month = m[5]--;
                year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(
                m[3], 10));
                break;
            case "dmy":
                m = op.match(new RegExp("^\\s*(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))\\s*$"));
                if (m == null) return false;
                day = m[1];
                month = m[3]--;
                year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(
                m[6], 10));
                break;
            default:
                break;
            }
            var date = new Date(year, month, day);
            return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate());
            function GetFullYear(y) {
                return ((y < 30 ? "20": "19") + y) | 0;
            }
        },
        // 实时验证最大字符数，超过不允许输入
        ValidMaxLength: function(el) {
            var el = $(el);
            if (!el.prop('data-hadBinded')) {
                var maxLength = parseInt(el.attr('max'));
                el.on('keyup',
                function() {
                    if (el.val().trim().length > maxLength) {
                        el.val(el.val().substring(0, maxLength));
                    }
                });
                el.prop('data-hadBinded', true);
            }
        }
    };

    sohu.tool.Validator.tip = 'span';

    window.KTV = sohu.tool.Validator;
},
'sohu.ctrl.Dialog');

$register('sohu.feed.*',
function() {
    var PACK = sohu.feed;
    var feedTip = {
        beforeList: function(contentEl, type, moreEl) {
            var tip1 = '<div class=\"load-page\"></div>';
            var tip2 = '<span class="load-part"></span>';
            contentEl = $(contentEl);
            if (type == 'add') {
                feedTip.afterList(contentEl);
                contentEl.append(tip2);
            }
            if (type == 'clear') {
                contentEl.html(tip1);
                if (moreEl) $(moreEl).hide();
            }
        },
        afterList: function(contentEl) {
            var t = $(contentEl).down('.load-page');
            if (t) {
                t.remove();
            } else {
                t = $(contentEl).down('.load-part');
                if (t) t.remove();
            }
        },
        success: function(contentEl, str) {
            contentEl = $(contentEl);
            if (!contentEl) return;
            var msgEl = contentEl.parent().down('.msg');
            if (msgEl) {
                msgEl.html(str).show('');
            } else {
                var tmp = "<div class=\"msg msg-succeed\">" + str + "</div>";
                contentEl.before(tmp);
            } (function() {
                var el = contentEl.parent().down('.msg');
                if (el) el.remove();
            }).timeout(3);
        }
    };
    var newsMdl = new sohu.core.Model({
        actions: {
            time: {
                url: '/time.do',
                params: ['start', 'size', 'flagid', 'minid'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            user: {
                url: '/user.do',
                params: ['start', 'size', 'flagid'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            app: {
                url: '/app.do',
                params: ['start', 'size', 'appid', 'minid'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            realtime: {
                url: '/realtime.do',
                params: ['id', 'ids', 'lastid'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            realstar: {
                url: '/realstar.do',
                params: ['lastid'],
                method: 'get',
                format: 'json',
                type: 'list'
            }
        },
        url: '/a/feed/news'
    });
    PACK.NewsCtl = {
        init: function(options) {
            this.options = options;
            this.moreEl = $(options.moreEl);
            this.moreWrap = $(options.moreWrap);
            var config = {
                list: {
                    ctrEl: options.listEl,
                    itemsEl: '>div',
                    itemEl: '#request_${id}',
                    size: 30,
                    firstMode: 'append'
                },
                page: {
                    ctrEl: options.moreEl
                },
                model: {
                    obj: newsMdl,
                    key: 'id'
                },
                methods: {
                    list: {
                        action: 'time',
                        data: {
                            u: '2'
                        },
                        beforeList: feedTip.beforeList.bind(this, this.moreWrap, 'add'),
                        afterSuccess: this._checkTime.bind(this),
                        getStart: this._checkNewFeed.bind(this)
                    }
                }
            }
            this.lister = sohu.ctrl.Lister.getMoreList(config);
            this._isFirst = true;
            this._bindAppList("#j-appFeedList");
            this._setMinId($('#homeFeedList').data('minId'));
            this.list();
            PACK.NewsCtl.RealFeed.init();
            PACK.NewsCtl.StarFeed.init();
            return this;
        },
        _curAppList: 0,
        _dragAppList: null,
        _appListShow: false,
        _curListerStart: 0,
        _minId: '',
        _bindAppList: function(el) {
            var apps = [{
                id: 0,
                name: '全部'
            },
            {
                id: 10,
                name: '一句话'
            },
            {
                id: 10101,
                name: '照片'
            },
            {
                id: 10401,
                name: '日志'
            },
            {
                id: 10501,
                name: '分享'
            },
            {
                id: 10701,
                name: '投票'
            },
            {
                id: 11601,
                name: '真心话'
            },
            {
                id: 11001,
                name: '说秘密'
            },
            {
                id: -1,
                name: '大牌档',
                end: true
            }];
            var element = $(el);
            var parentEl = element.parent();
            if (element) {
                element.on('click',
                function(e) {
                    kola.Event.stop(e);
                    if (this._appListShow) {
                        parentEl.removeClass('homeFeedFilter-showFilter');
                        this._appListShow = false;
                        this._dragAppList.unout('click', this._bindAppListOut);
                        return;
                    }
                    if (this._dragAppList) {
                        parentEl.addClass('homeFeedFilter-showFilter');
                        this._appListShow = true;
                        this._dragAppList.out('click', this._bindAppListOut);
                    } else {
                        var temp = document.createElement('div');
                        temp.className = 'popLayer homeFeedFilterLayer';
                        temp.style.width = "68px";
                        var str = '<div class="decor"><span class="tl"></span><span class="tr"></span><span class="br"></span><span class="bl"></span></div>';
                        str += '<div class="content"><ul class="checkList">';
                        apps.each(function(it) {
                            if (this._curAppList == it.id) {
                                str += '<li class="on' + (it.end ? ' end': '') + '" ';
                            } else {
                                str += '<li ' + (it.end ? 'class="end"': '') + ' ';
                            }
                            str += 'appid= ' + it.id + '><a href="javascript:void(0)">' + it.name + '</a></li>';
                        }.bind(this));
                        str += '</ul></div>';
                        temp.innerHTML = str;
                        parentEl.append(temp);
                        parentEl.addClass('homeFeedFilter-showFilter');
                        this._dragAppList = $(temp);
                        this._appListShow = true;
                        this._dragAppList.down('li').on('click',
                        function(e) {
                            var el = kola.Event.element(e).upWithMe('li');
                            var appid = el.attr('appid');
                            this.app(appid);
                        }.bind(this));
                        this._bindAppListOut = function() {
                            parentEl.removeClass('homeFeedFilter-showFilter');
                            this._appListShow = false;
                            this._dragAppList.unout('click', this._bindAppListOut);
                        }.bind(this);
                        this._dragAppList.out('click', this._bindAppListOut);
                    }
                }.bind(this));
            }
        },
        app: function(id) {
            this._dragAppList.parent().removeClass('homeFeedFilter-showFilter');
            this._appListShow = false;
            this._dragAppList.unout('click', this._bindAppListOut);
            if (id.toString() == this._curAppList.toString()) {
                return;
            };
            var lastEl = this._dragAppList.down('li[appid=' + this._curAppList + ']');
            if (lastEl) lastEl.removeClass('on');
            var curEl = this._dragAppList.down('li[appid=' + id + ']');
            if (curEl) curEl.addClass('on');
            this._curAppList = parseInt(id);
            this.moreEl.hide();
            this.goApp();
        },
        goApp: function() {
            if (this._curAppList == 0) {
                this.lister.setMethodAction('time', 'list');
                this.list();
            } else {
                feedTip.beforeList(this.options.listEl, 'clear', this.options.moreEl);
                newsMdl.app({
                    start: 0,
                    size: 30,
                    appid: this._curAppList,
                    minid: this._minId
                },
                {
                    success: function(data) {
                        this.lister.setMethodAction('app', 'list');
                        PACK.NewsCtl.RealFeed._newFeedCount = 0;
                        PACK.NewsCtl.StarFeed.newFeedCount = 0;
                        this._curListerStart = data.start + data.size;
                        this._setMinId(data.minId);
                        var mydata = {
                            appid: this._curAppList
                        };
                        this.moreEl.down('.a-moreFeed').html("查看更多此类新鲜事");
                        this.lister.setMethodData(mydata, 'list');
                        this.lister.updateContent(data);
                    }.bind(this),
                    failure: function(error) {
                        var str = sohu.config('error', error);
                        this.lister.updateContent(str);
                    }.bind(this)
                })
            }
        },
        list: function() {
            var start = this._isFirst ? 10 : 0;
            if (this._isFirst) {
                this._isFirst = false;
                var _realEl = $('#realTimeFeed');
                if (_realEl) {
                    var _last = _realEl.next();
                    var mydata = {};
                    if (_last) {
                        var ele = _last.elements()[0];
                        if (ele.tagName.toLowerCase() != 'ul') _last = _last.next();
                        _last = _last.last();
                        if (_last) {
                            mydata = {
                                flagid: _last.attr('id').replace('feed_', '')
                            };
                        }
                    }
                    mydata.minid = this._minId;
                    this.lister.setMethodData(mydata, 'list');
                }
            } else {
                var mydata = {
                    flagid: 0
                };
                mydata.minid = this._minId;
                this.lister.setMethodData(mydata, 'list');
                feedTip.beforeList(this.options.listEl, 'clear', this.options.moreEl);
            }
            this.lister.list(start);
        },
        _checkTime: function(param) {
            feedTip.afterList(this.options.listEl);
            feedTip.afterList(this.moreEl);
            PACK.NewsCtl.RealFeed._newFeedCount = 0;
            PACK.NewsCtl.StarFeed.newFeedCount = 0;
            this._curListerStart = param.responseData.start + param.responseData.size;
            this._minId = this._setMinId(param.responseData.minId);
            var times = $(this.options.listEl).down('span.label');
            if (times) {
                var timeNow = '';
                times.each(function(it) {
                    var text = it.text();
                    if (text == timeNow) {
                        it.parent().remove();
                    } else {
                        timeNow = text;
                    }
                });
            }
        },
        _checkNewFeed: function() {
            return this._curListerStart + PACK.NewsCtl.RealFeed._newFeedCount + PACK.NewsCtl.StarFeed.newFeedCount;
        },
        _setMinId: function(minId) {
            if (!isNaN(parseInt(minId))) this._minId = minId;
        }
    };
    PACK.NewsCtl.RealFeed = {
        init: function() {
            this.realFeedEl = '#realTimeFeed';
            this.realFeedTipEl = $('#j-realFeedView');
            this.flagHeight = $('#homeFeedList').pos().top;
            this.loading = '<span class="load-part"></span>';
            this.flag = true;
            this._newFeedIDS = [];
            this._newFeedCount = 0;
            this._keppFeedIDS = [];
            this._tipsHasShow = false;
            sohu.channel.on('feed',
            function(e) {
                this._newfeed(e.data);
            }.bind(this));
            var onScroll = function() {
                if (this._checkFlag()) {
                    if (!this.flag && this._keppFeedIDS.length > 0) {
                        if (this._keppFeedIDS.length >= 30) {
                            PACK.NewsCtl.goApp();
                            this._keppFeedIDS = [];
                            this.realFeedTipEl.hide();
                            this._tipsHasShow = false;
                        } else {
                            setTimeout(function() {
                                this.realFeedTipEl.down('a').append(this.loading);
                                this._getFeed(this._keppFeedIDS.reverse(), true);
                                this._keppFeedIDS = [];
                            }.bind(this), 0);
                        }
                    }
                    this.realFeedTipEl.removeClass('homeFeedNew-fixed').css('top', '0');
                    this.flag = true;
                } else {
                    this.flag = false;
                }
            }.bind(this);
            onScroll();
            $(window).on('scroll', onScroll);
            var onClick = function() {
                if (!this.flag) {
                    kola.Anim($(document.body)).to('scrollTop', 0).duration(200).go();
                }
            }.bind(this);
            this.realFeedTipEl.on('click', onClick);
        },
        _newfeed: function(ids) {
            ids = ids.split(',');
            var feedid = ids[0];
            var appid = ids[1];
            if (this._newFeedIDS.include(feedid)) {
                return;
            } else {
                this._newFeedIDS.push(feedid);
            }
            if (PACK.NewsCtl._curAppList == 0) {
                this._newFeedCount++;
            } else if (PACK.NewsCtl._curAppList == parseInt(appid)) {
                this._newFeedCount++;
            } else {}
            if (this.flag) {
                this._getFeed(feedid);
            } else {
                if (this._keppFeedIDS.include(feedid)) return;
                this._keppFeedIDS.push(feedid);
                this.realFeedTipEl.down('strong').html(this._keppFeedIDS.length + '');
                this.realFeedTipEl.show();
                if (!this._tipsHasShow) {
                    this.realFeedTipEl.addClass('homeFeedNew-fixed').css('opacity', 0);
                    kola.Anim(this.realFeedTipEl).from('top', 61).to('top', 31).to('opacity', 1).duration(500).go();
                }
                this._tipsHasShow = true;
            }
        },
        _getFeed: function(id, needHide) {
            var p = {};
            if (typeof id == 'string') {
                p.id = id;
            } else {
                if (id.length == 1) {
                    p.id = id;
                } else {
                    p.ids = id.join(',');
                }
            }
            p.lastid = PACK.NewsCtl.StarFeed.lastId;
            newsMdl.realtime(p, {
                success: function(data) {
                    var box = $(this.realFeedEl);
                    if (box) {
                        kola.Anim(box).insertEl(data.list);
                    }
                    if (needHide) {
                        this.realFeedTipEl.hide();
                        this.realFeedTipEl.down('.load-part').remove();
                        this._tipsHasShow = false;
                    }
                    PACK.NewsCtl.StarFeed.restartTimer(data.lastId);
                }.bind(this),
                failure: function(error) {
                    var str = sohu.config('error', error);
                    if (needHide) {
                        this.realFeedTipEl.hide();
                        this._tipsHasShow = false;
                        this.realFeedTipEl.down('.load-part').remove();
                    }
                }.bind(this)
            });
        },
        _checkFlag: function() {
            var flag = this.flagHeight;
            var top = 0;
            if (typeof(window.pageYOffset) == 'number') {
                top = window.pageYOffset;
            } else {
                if (document.body && document.body.scrollTop) {
                    top = document.body.scrollTop;
                } else {
                    if (document.documentElement && document.documentElement.scrollTop) {
                        top = document.documentElement.scrollTop;
                    }
                }
            }
            return flag > top && flag < (top + document.body.clientHeight);
        }
    };
    PACK.NewsCtl.StarFeed = {
        init: function() {
            var feedList = $('#homeFeedList');
            this.realFeedEl = '#realTimeFeed';
            this.newFeedCount = 0;
            this.lastId = feedList.data('lastId');
            this._timer = null;
            this._startTimer();
        },
        _startTimer: function() {
            this._clearTimer();
            this._timer = setTimeout(this._getFeed.bind(this), 300000);
        },
        restartTimer: function(lastId) {
            if (!isNaN(parseInt(lastId))) {
                this.lastId = lastId;
            }
            this._startTimer();
        },
        _clearTimer: function() {
            if (this._timer != null) {
                clearTimeout(this._timer);
                this._timer = null;
            }
        },
        _getFeed: function() {
            var _this = this,
            params = {
                lastid: this.lastId
            };
            newsMdl.realstar(params, {
                success: function(data) {
                    var box = $(_this.realFeedEl);
                    if (box && data.list != '') {
                        kola.Anim(box).insertEl(data.list);
                    }
                    if (!isNaN(parseInt(data.size))) {
                        _this.newFeedCount += data.size;
                    }
                    if (!isNaN(parseInt(data.lastId))) {
                        _this.lastId = data.lastId;
                    }
                    _this._startTimer();
                }.bind(this),
                failure: function(error) {
                    var str = sohu.config('error', error);
                    _this._startTimer();
                }.bind(this)
            });
        }
    };
    var newsSettingMdl = new sohu.core.Model({
        actions: {
            edit: {
                url: '/edit.do',
                params: [],
                method: 'get',
                format: 'text'
            },
            apps: {
                url: '/apps.do',
                params: ['ids'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            users: {
                url: '/users.do',
                params: ['ids'],
                method: 'post',
                format: 'text'
            }
        },
        url: '/a/feed/setting'
    });
    PACK.NewsSettingsCtl = {
        init: function() {
            $call(function() {
                this._friendSelector = new sohu.friend.Selector({
                    element: '#selector1',
                    type: 2,
                    isButton: true,
                    maxNum: 20
                });
            }.bind(this), 'sohu.friend.FriendSelector');
        },
        apps: function(el, submitEl) {
            var submitEl = $(submitEl);
            submitEl.prop('disabled', true).html('保存中...').parent().parent().addClass('button-disabled');
            var inputs = $(el).down('input'),
            r = [];
            inputs.each(function(i) {
                if (!i.prop('checked')) {
                    r.push(i.prop('value'));
                }
            });
            newsSettingMdl.apps({
                ids: r.join(',')
            },
            {
                success: function(data) {
                    feedTip.success('#newsFeedSetting', '新鲜事类型保存成功');
                    submitEl.prop('disabled', false).html('保存').parent().parent().removeClass('button-disabled');
                }.bind(this),
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了',
                        callback: function() {}
                    });
                    submitEl.prop('disabled', false).html('保存').parent().parent().removeClass('button-disabled');
                }
            });
        },
        user: function(input, inputh, listEl, listTxt, button) {
            var ids = $(input).val();
            if (ids.length == 0) return;
            button = $(button);
            button.data('srctext', button.html()).prop('disabled', true).html('操作中...').parent().parent().addClass('button-disabled');
            if (this.friendSelector1) this.friendSelector1.clear();
            ids += $(inputh).val() ? (',' + $(inputh).val()) : '';
            newsSettingMdl.users({
                ids: ids
            },
            {
                success: function(data) {
                    $(listTxt).show();
                    $(input).val('');
                    $(inputh).val(ids);
                    $(listEl).html(data);
                    button.prop('disabled', false).html(button.data('srctext')).parent().parent().removeClass('button-disabled');
                },
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                    button.prop('disabled', false).html(button.data('srctext')).parent().parent().removeClass('button-disabled');
                }
            })
        },
        delUser: function(id, inputh, listEl) {
            inputh = $(inputh);
            var r = inputh.val().split(',');
            var t = [];
            r.each(function(i) {
                if (i.toString() != id.toString()) {
                    t.push(i)
                }
            });
            var ids = t.join(',');
            newsSettingMdl.users({
                ids: ids
            },
            {
                success: function(data) {
                    $(inputh).val(ids);
                    $(listEl).html(data);
                },
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            })
        }
    };
    PACK.TabCtl = {
        init: function(options) {
            this._newsCtr = sohu.feed.NewsCtl.init({
                listEl: options.contentEl,
                moreEl: options.moreEl
            });
            this._newsCtr.list();
        },
        _tabCall: function(key) {
            if (!this._firstCall || (this._firstCall && !this._isFirst)) {
                this._isFirst = false;
                feedTip.beforeList(this.options.contentEl, 'clear', this.options.moreEl);
            }
            switch (key) {
            case 'time':
                {
                    this.starMoreEl.hide();
                    this.moreEl.show('');
                    if (!this._newsCtr) {
                        this._newsCtr = sohu.feed.NewsCtl.init({
                            listEl: this.options.contentEl,
                            moreEl: this.options.moreEl
                        });
                    }
                    this._newsCtr.list();
                    break;
                }
            case 'star':
                {
                    this.moreEl.hide();
                    this.starMoreEl.show('');
                    if (!this._starCtr) {
                        this._starCtr = sohu.feed.StarCtl.init({
                            listEl: this.options.contentEl,
                            moreEl: this.options.starMoreEl
                        });
                    }
                    this._starCtr.list();
                    break;
                }
            case 'setting':
                {
                    this.starMoreEl.hide();
                    this.moreEl.hide();
                    sohu.feed.NewsSettingsCtl.edit({
                        listEl:
                        this.options.contentEl,
                        moreEl: this.options.moreEl
                    });
                    break;
                }
            }
        }
    };
    var storyMdl = new sohu.core.Model({
        actions: {
            list: {
                url: '/list.do',
                params: ['u', 'start', 'size', 'type', 'flagid'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            del: {
                url: '/del.do',
                params: ['id'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            add: {
                url: '/add.do',
                params: ['u', 'message'],
                method: 'post',
                format: 'json',
                type: 'one'
            }
        },
        url: '/a/wall/story'
    });
    PACK.StoryCtl = {
        init: function(options) {
            this.options = options;
            this.moreEl = $(this.options.moreEl);
            var config = {
                list: {
                    ctrEl: this.options.contentEl,
                    itemsEl: '>div',
                    itemEl: '#feed_${id}',
                    size: 10
                },
                page: {
                    ctrEl: this.options.moreEl
                },
                model: {
                    obj: storyMdl,
                    key: 'id'
                },
                methods: {
                    list: {
                        action: 'list',
                        data: {
                            u: this.options.testId
                        },
                        beforeList: feedTip.beforeList.bind(this, this.moreEl, 'add'),
                        afterSuccess: this._afterList.bind(this)
                    },
                    del: {
                        action: 'del'
                    }
                }
            };
            this.lister = sohu.ctrl.Lister.getMoreList(config);
            this._tabCall(0);
            return this;
        },
        _tabCall: function(key) {
            feedTip.beforeList(this.options.contentEl, 'clear', this.options.moreEl);
            this.lister.options.methods.list.data.type = key;
            this.lister.list(0);
        },
        _afterList: function(data) {
            feedTip.afterList(this.moreEl);
            if (myid && myid != sohu.user.id) return;
            var li = $(this.options.contentEl).down('li.feedItem');
            if (!li) return;
            if (this._liBindMouseOver) {
                li.un('mouseover', this._liBindMouseOver.bindEvent(this));
                li.un('mouseout', this._liBindMouseOut.bindEvent(this));
            } else {
                this._liBindMouseOver = function(e) {
                    var el = kola.Event.element(e).upWithMe('.feedItem');
                    el.down('.option').css('visibility', 'visible');
                }
                this._liBindMouseOut = function(e) {
                    var el = kola.Event.element(e).upWithMe('.feedItem');
                    el.down('.option').css('visibility', 'hidden');
                }
            }
            li.on('mouseover', this._liBindMouseOver.bindEvent(this));
            li.on('mouseout', this._liBindMouseOut.bindEvent(this));
        },
        del: function(id) {
            var el = $('#feed_' + id);
            if (el) kola.Anim(el).hideEl({
                time: 200,
                callback: function() {
                    this.lister.del(id);
                }.bind(this)
            });
        }
    };
},
'sohu.core.*, kola.anim.*, sohu.ctrl.Dialog, sohu.ctrl.TipSuggest, kola.dom.Form, sohu.ctrl.Lister,sohu.channel.*');
$register('sohu.composer.*',
function() {
    sohu.composer = {
        initialize: function(element) {
            this.element = $(element);
            this.currentType = 'status';
            this._initStatus();
            this._initElements();
            this._initEvents();
        },
        _initStatus: function() {
            window.HomeStatus = new sohu.status.Home({
                formEl: '#statusForm'
            });
            this._status = window.HomeStatus;
        },
        _initElements: function() {
            this.layerEl = this.element.down('.mcLayer');
            this.boxEl = this.layerEl.down('.j-box');
            this.switchTabEl = this.element.down('.mcAttachs');
            this.layerEl.css('opacity', 0);
        },
        _initEvents: function() {
            this.switchTabEl.on('click',
            function(e) {
                var el = kola.Event.element(e);
                if (el) {
                    var type = el.attr('key');
                    if (type != this.currentType) {
                        if (type != 'more') {
                            this._switchCpnt(type);
                        } else {
                            this._switchMore();
                        }
                    }
                }
            }.bind(this));
            this.layerEl.down('.mcLayerOpt').on('click',
            function() {
                this._hide(true);
            }.bind(this));
            var _pos = this.switchTabEl.pos();
            var x = -_pos.left;
            var y = -_pos.top;
        },
        _switchMore: function() {},
        _switchCpnt: function(type) {
            var c = sohu.composer.Components[type];
            if (c) {
                if (c.isReged) {
                    this._show(type);
                } else {
                    $call(function() {
                        this._register(type,
                        function() {
                            this._show(type);
                        }.bind(this));
                    }.bind(this), c.pack);
                }
            }
        },
        _show: function(type) {
            this.boxEl.css('height', '66px');
            this.boxEl.css('overflow', 'hidden');
            kola.Anim(this.layerEl).to('top', 0).to('opacity', 1).ondone(function() {
                this.layerEl.css('opacity', '');
                kola.Anim(this.boxEl).to('height', 'auto').ondone(function() {
                    if (type != 'album') {
                        this.boxEl.removeAttr('style');
                        this.boxEl.css('overflow', 'visible');
                    }
                }.bind(this)).duration(500).go();
            }.bind(this)).duration(300).ease(kola.anim.ease.end).go();
            var c = sohu.composer.Components[type];
            this.currentType = type;
            c.show();
        },
        _hide: function(isOwn) {
            var _parent = this.layerEl.parent();
            if (this.boxEl.height() > 66) {
                this.boxEl.css('overflow', 'hidden');
                kola.Anim(this.boxEl).to('height', 66).ondone(function() {
                    kola.Anim(this.layerEl).to('top', -100).to('opacity', 0).ondone(function() {
                        this.boxEl.html('');
                        if (isOwn) {
                            var c = sohu.composer.Components[this.currentType];
                            c.hide();
                        }
                        this.currentType = 'status';
                    }.bind(this)).duration(300).ease(kola.anim.ease.begin).go();
                }.bind(this)).duration(500).go();
                kola.Anim(_parent).to('height', 88).ondone(function() {
                    _parent.css('height', '');
                }).duration(500).go();
            } else {
                kola.Anim(this.layerEl).to('top', -100).to('opacity', 0).ondone(function() {
                    this.boxEl.html('');
                    if (isOwn) {
                        var c = sohu.composer.Components[this.currentType];
                        c.hide();
                    }
                    this.currentType = 'status';
                }.bind(this)).duration(300).ease(kola.anim.ease.begin).go();
            }
        },
        _register: function(type, callback) {
            var c = sohu.composer.Components[type];
            if (c) {
                var _init = eval(c.init);
                var back = _init({
                    element: this.boxEl,
                    hide: this._hide.bind(this)
                });
                c.isReged = true;
                c.show = back.show;
                c.hide = back.hide;
                if (callback) callback();
            }
        }
    };
    sohu.composer.Components = {
        status: {},
        share: {
            name: '分享',
            pack: 'sohu.share.*',
            isReged: false,
            init: 'sohu.share.composer.init'
        },
        album: {
            name: '相册',
            pack: 'sohu.album.PhotoPost',
            isReged: false,
            init: 'sohu.album.PhotoPost.composer'
        },
        vote: {
            name: '投票',
            pack: 'sohu.vote.*',
            isReged: false,
            init: 'sohu.vote.launchInComposer'
        }
    };
},
'kola.anim.*, sohu.status.*, sohu.ctrl.Tip');
$register('sohu.status.*',
function() {
    var PACK = sohu.status;
    var statusMdl = new sohu.core.Model({
        actions: {
            add: {
                url: '/add.do',
                params: ['type', 'content'],
                method: 'post',
                format: 'json',
                encode: 'uri',
                type: 'one'
            },
            del: {
                url: '/del.do',
                params: [],
                method: 'post',
                format: 'json',
                type: 'blank'
            }
        },
        url: '/a/status/info'
    });
    var getStatusText = function() {
        var _default = '说说你在做什么？';
        if (window._st) {
            var _st = window._st;
            var r = _st.c ? _st.c: [];
            var t = new Date();
            var h = t.getHours(),
            d = t.getDay();
            if (h >= 6 && h < 9) {
                r = r.concat(_st.m ? _st.m: []);
            }
            if (h >= 9 && h < 12) {
                r = r.concat(_st.a ? _st.a: []);
            }
            if (h >= 12 && h < 14) {
                r = r.concat(_st.n ? _st.n: []);
            }
            if (h >= 14 && h < 17) {
                r = r.concat(_st.p ? _st.p: []);
            }
            if (h >= 17 && h < 19) {
                r = r.concat(_st.d ? _st.d: []);
            }
            if (h >= 19 && h < 21) {
                r = r.concat(_st.e ? _st.e: []);
            }
            if (h >= 21 && h < 24) {
                r = r.concat(_st.l ? _st.l: []);
            }
            if (h >= 0 && h < 6) {
                r = r.concat(_st.w ? _st.w: []);
            }
            if (d == 0 || d == 6) {
                r = r.concat(_st.k);
            }
            window._st = null;
            if (r.length == 0) {
                return _default;
            } else {
                return r[Math.floor(Math.random() * r.length)];
            }
        } else {
            return _default;
        }
    };
    PACK.Home = Class.create({
        initialize: function(options) {
            this.settings = {
                formEl: ''
            };
            Object.extend(this.settings, options);
            this.formEl = $(this.settings.formEl);
            this.formText = this.formEl.down('textarea');
            this.formAct = this.formEl.down('.mcStatusAct');
            this.formBtn = this.formAct.down('.button');
            this.defaultValue = getStatusText();
            this.formText.val(this.defaultValue);
            this.maxLength = 400;
            this._lastTime = 0;
            this._bind();
            if (!this._emote) {
                var formEmote = this.formAct.down('.emot');
                this._emote = sohu.ctrl.Emote.add({
                    ctrlEl: formEmote,
                    textEl: this.formText
                });
            }
            kola.Event.initEventObserver(PACK, {});
        },
        _init: function() {
            var btn = this.formBtn.down('button');
            this.formText.attr('class', 'blank');
            this.formText.val(this.defaultValue);
            kola.Anim(this.formAct).to('height', 0).duration(100).go();
            btn.html('发送');
            this.formBtn.first().removeClass('button-disabled');
            btn.prop('disabled', '');
        },
        _bind: function() {
            var _bindBlur = function(e) {
                var v = this.formText.val().trim();
                if (v == '') {
                    this.formText.addClass('blank');
                    this.formText.val(this.defaultValue);
                    kola.Anim(this.formAct).to('height', 0).duration(100).go();
                }
            }.bind(this);
            this._outFormEvent = function(e) {
                var tag = kola.Event.element(e).upWithMe('.emotLayer');
                if (tag) return;
                var v = this.formText.val().trim();
                if (v == '' || v == this.defaultValue) {
                    this.formText.addClass('blank');
                    this.formText.val(this.defaultValue);
                    kola.Anim(this.formAct).to('height', 0).duration(100).go();
                }
                this.formEl.unout('click', this._outFormEvent);
            }.bind(this);
            var _bindFocus = function() {
                if (this.formText.val() == this.defaultValue) {
                    this.formText.val('');
                }
                kola.Anim(this.formAct).to('height', 28).duration(100).go();
                this.formText.removeClass('blank');
                this.formEl.out('click', this._outFormEvent);
            }.bind(this);
            var _bindSubmit = function() {
                var val = this.formText.val().trim();
                if (val == '' || val == this.defaultValue) {
                    kola.Anim(this.formText).fadeColor();
                    this.formText.val('');
                    this.formText.focus();
                } else {
                    if (this._lastTime && (new Date().getTime() - this._lastTime) < 10000) {
                        sohu.ctrl.Dialog.alert('呃……你说话太快了，休息，休息一下吧~', {
                            title: '提示'
                        });
                    } else {
                        var btn = this.formBtn.down('button');
                        this.formBtn.first().addClass('button-disabled');
                        btn.prop('disabled', 'disabled');
                        btn.html('发送中');
                        PACK.fire('statussend', {});
                        statusMdl.add({
                            type: 1,
                            content: val.replace(/&#/g, '')
                        },
                        {
                            success: function(data) {
                                this._lastTime = new Date().getTime();
                                this._init();
                            }.bind(this),
                            failure: function(error) {
                                sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                    title: '出错了'
                                });
                                this._init();
                            }.bind(this)
                        });
                    }
                    this.formText.elements()[0].blur();
                }
                return false;
            }.bind(this);
            var _bindKeyDown = function(e) {
                if (e.keyCode == 13) {
                    kola.Event.stop(e);
                    _bindSubmit();
                }
            }.bind(this);
            this.formText.on('focus', _bindFocus);
            this.formText.on('keydown', _bindKeyDown);
            kola.dom.Form.maxLength(this.formText, this.maxLength);
            this.formEl.on('submit', _bindSubmit);
        }
    });
    PACK.Profile = Class.create({
        initialize: function(options) {
            this.settings = {
                statusViewEl: null,
                statusFormEl: null
            };
            Object.extend(this.settings, options);
            this.statusViewEl = $(this.settings.statusViewEl);
            this.curStatus = this.statusViewEl.down('.j_curstatus');
            this.curTime = this.statusViewEl.down('.j_time');
            this.statusFormEl = $(this.settings.statusFormEl);
            this.formEl = this.statusFormEl.down('form');
            this.formText = this.formEl.down('input');
            this.formBtn = this.formEl.down('button');
            this.defaultValue = '说说你在做什么？';
            this.formText.val(this.defaultValue);
            this.optionEl = this.statusViewEl.down('.j_option');
            var t = this.curStatus.text();
            if (t == '') {
                this.curStatus.html(this._noStatus);
            }
            this._bind();
        },
        _noStatus: '为了证明你在地球，<a href="javascript:void(0)" onclick="ProfileStatus.edit(this, true);">说一句话</a>吧~',
        Focus: function(el) {
            if (el.value == this.defaultValue) {
                el.value = '';
            }
            el.className = 'text';
        },
        Blur: function(el) {
            var v = el.value.trim();
            if (v == '' || v == this.defaultValue) {
                el.className = 'text blank';
                el.value = this.defaultValue;
            }
        },
        edit: function(el, isAdd) {
            this.statusViewEl.hide();
            this.statusFormEl.show();
            if (isAdd) {} else {
                var curValue = this.curStatus.text().trim();
                if (curValue != '') {
                    this.formText.val(curValue);
                    this.formText.removeClass('blank');
                }
            }
            this.formText.focus();
        },
        del: function(el) {
            this.curStatus.html(this._noStatus);
            this.curTime.hide();
            this.optionEl.hide();
            statusMdl.del({},
            {
                success: function() {},
                failure: function() {}
            });
        },
        cancel: function(el) {
            this.statusViewEl.show();
            this.statusFormEl.hide();
        },
        _init: function() {
            this.statusViewEl.show();
            this.statusFormEl.hide();
            this.formText.attr('class', 'blank');
            this.formText.val(this.defaultValue);
            this.formBtn.html('保存');
            this.formBtn.removeClass('disabled');
            this.formBtn.prop('disabled', '');
        },
        _setNew: function(str, time) {
            this.curStatus.html(str);
            this.curTime.html(time);
            this.optionEl.show('inline');
        },
        _bind: function() {
            this.formEl.on('submit',
            function() {
                var val = this.formText.val().trim();
                if (val == '' || val == this.defaultValue) {
                    kola.Anim(this.formText).from('backgroundColor', '#ffcccc').to('backgroundColor', '#ffffff').duration(500).go();
                    this.formText.val('');
                    this.formText.focus();
                } else {
                    this.formBtn.addClass('disabled');
                    this.formBtn.prop('disabled', 'disabled');
                    this.formBtn.html('保存中');
                    statusMdl.add({
                        type: 1,
                        content: val.escapeHTML()
                    },
                    {
                        success: function(data) {
                            this._setNew(data.content, '刚刚');
                            this._init();
                        }.bind(this),
                        failure: function(error) {
                            sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                title: '出错了'
                            });
                            this._init();
                        }.bind(this)
                    });
                }
                return false;
            }.bind(this));
        }
    });
},
'sohu.core.*, kola.anim.*, kola.dom.Form,sohu.ctrl.Emote');
$register('sohu.ctrl.Tip',
function() {
    sohu.ctrl.Tip = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                box: null,
                showIn: null,
                showOut: null,
                type: 1,
                direction: "down",
                position: [0, 0],
                close: 0,
                content: ''
            };
            Object.extend(this.settings, options || {});
            this._template = {
                content: this.settings.content,
                direction: ""
            };
            if (this.settings.type == 1) {
                this._template.direction = this.settings.direction == "down" ? "tooltip-top": "tooltip-bottom";
                this._html = this._tipHtml;
            } else {
                this._template.direction = this.settings.direction == "down" ? "balloon-top": "balloon-bottom";
                this._html = this._balloonHtml;
            }
            this.element = $(this.settings.element);
            this.template = new kola.Template(this._html);
            var str = this.template.evaluate(this._template);
            if (this.settings.box) {
                $(this.settings.box).append(str);
                this.pannel = $(this.settings.box).last().hide();
            } else {
                $(document.body).append(str);
                this.pannel = $(document.body).last().hide();
            }
            this.setPos();
            this._setBind();
        },
        setPos: function() {
            var _pos1 = this.element.pos();
            var _pos = {
                left: _pos1.left + this.settings.position[0],
                top: _pos1.top + this.settings.position[1]
            };
            with(this.pannel.elements()[0].style) {
                left = _pos.left + 'px';
                if (this.settings.direction == "up") {
                    bottom = 0;
                } else {
                    top = _pos.top + 'px';
                }
            }
        },
        show: function() {
            this.pannel.show('block');
            if (this.settings.close) {
                this.hide.bind(this).timeout(this.settings.close);
            }
        },
        hide: function() {
            this.pannel.hide();
        },
        _setBind: function() {
            if (this.settings.showIn) this.element.on(this.settings.showIn,
            function() {
                this.show();
            }.bind(this));
            if (this.settings.showOut) this.element.on(this.settings.showOut,
            function() {
                this.hide();
            }.bind(this));
        },
        _tipHtml: "<div class=\"tooltip ${direction}\">\
                        <div class=\"tooltipInt\">${content}</div>\
                    </div>",
        _balloonHtml: "<div class=\"balloon ${direction}\">\
                            <div class=\"decor\">\
                                <span class=\"tl\"></span>\
                                <span class=\"tr\"></span>\
                                <span class=\"br\"></span>\
                                <span class=\"bl\"></span>\
                            </div>\
                            <div class=\"content\">${content}</div>\
                        </div>"
    });
    sohu.ctrl.Tip.tips = function(options) {
        var settings = {
            element: null,
            box: null,
            position: [0, 0]
        };
        Object.extend(settings, options);
        var el = $("[tip]", settings.element);
        var r = new Array();
        el.each(function(i, y) {
            r[y] = new sohu.ctrl.Tip({
                element: i,
                box: settings.box,
                position: settings.position,
                showIn: 'mouseover',
                showOut: 'mouseout',
                content: i.attr('tip')
            });
        });
        return r;
    };
    sohu.ctrl.Tip.balloon = function(options) {
        var r = new sohu.ctrl.Tip({
            element: options.element || document,
            type: 2,
            position: options.option || [0, 0],
            content: options.content || "",
            close: options.close || 0
        });
        return r;
    };
},
'kola.anim.Fade');
$register('sohu.task.*',
function() {
    var _soundLibPath = PATH.d1 + PATH.flash;
    var taskMdl = new sohu.core.Model({
        actions: {
            reward: {
                url: 'reward.do',
                params: ['taskid'],
                method: 'post',
                format: 'json',
                type: 'one'
            },
            status: {
                url: 'status.do',
                method: 'get',
                params: ['taskid'],
                format: 'json',
                type: 'one'
            },
            noticeUpdate: {
                url: 'notice.do',
                method: 'get',
                format: 'json',
                type: 'one'
            },
            statuses: {
                url: 'statuses.do',
                params: ['taskids'],
                method: 'get',
                format: 'json',
                type: 'one'
            },
            view: {
                url: 'view.do',
                params: ['taskid'],
                method: 'get',
                format: 'json',
                type: 'one'
            },
            update: {
                url: 'view.do',
                params: ['taskid', 'reward_html', 'secret_key'],
                method: 'post',
                format: 'json',
                type: 'one'
            },
            next: {
                url: 'next.do',
                params: ['taskid', 'state'],
                method: 'get',
                format: 'json',
                type: 'one'
            }
        },
        url: '/a/task/'
    });
    sohu.task = {
        init: function() {},
        _config: {
            goldbox: "#goldbox",
            wages: "#dwages",
            notice: "#homeTask .taskInt",
            moneyBox: "#moneyBox",
            newTaskTip: "#newTaskTip",
            noticeTask: "#task_notic_id",
            popGoldBox: ".taskCash-large",
            soundLib: "#j_soundLib",
            musicTip: "#newMusicTip",
            taskTip: "#newTaskTip"
        },
        _disabledButton: function(ele, title) {
            var _btn = $(ele);
            var _button = _btn.down('button');
            _btn.attr('class', "button button-disabled");
            _button.elements()[0].setAttribute('disabled', 'disabled');
            if (title && title != "已打卡") {
                _button.attr('style', 'padding:0 10px !important;');
                _button.html(title);
                return;
            }
            _btn.down("button").html("已打卡");
        },
        _enabledButton: function(ele) {
            var _btn = $(ele);
            _btn.attr('class', "button button-main");
            _btn.down("button").removeAttr("disabled");
            _btn.down("button").html("打卡领工资");
        },
        _setMoney: function(gold) {
            var _moneyBox = $(this._config.goldbox);
            _moneyBox.html(gold);
        },
		/**
		 * 打卡的一个动画
		 * @param {Object} data
		 */
        _addMoneyAnim: function(data) {
            this.playSound('card');
            var _btn = $(this._config.wages);
            var _pos = _btn.pos();
            var Tmp = kola.Element.create('div');
            $(document.body).append(Tmp);
            Tmp.attr('style', 'font-weight:bold;font-size:20px;color:#FF7504;');
            Tmp.css('position', 'absolute');
            Tmp.html("+" + data);
            Tmp.pos({
                left: _pos.left + 20,
                top: _pos.top - 40
            });
            Tmp.anim('top', {
                to: _pos.top - 70,
                curve: 'Expo',
                curveType: 'easeIn',
                speed: 50,
                callback: function() {
                    kola.anim.FadeOut.action(Tmp);
                    this._taskDoneAnim(data);
                }.bind(this)
            });
        },
        _taskDoneAnim: function(gold, ele) {
            this.playSound('earnMoney');
            var _pgoldBox = $(this._config.moneyBox);
            if (ele) {
                var _dgoldBox = $(ele);
            } else {
                var _dgoldBox = $(this._config.moneyBox);
            }
            if (!this._gold) {
                this._gold = parseInt(_pgoldBox.html());
            }
            if (_dgoldBox && gold) {
                var _gold = this._gold;
                var gold = this._gold + gold;
                var _itimer = setInterval(function() {
                    if (_gold < gold) {
                        _gold++;
                        _dgoldBox.html(_gold);
                    } else {
                        clearInterval(_itimer);
                        if (_pgoldBox && gold && ele) {
                            _pgoldBox.html(gold);
                        }
                    }
                },
                50);
            }
        },
        _updateGold: function(gold) {
            this._addMoneyAnim(gold);
        },
        delTask: function(id) {
            var _task = $("#li_task_" + id);
            if (_task) {
                _task.remove();
            }
        },
        _noticeFailure: function() {
            if ($(this._config.notice)) {}
        },
        _noticeUpdate: function() {
            taskMdl.noticeUpdate(null, {
                success: this._noticeUpdateSuccess.bind(this),
                failure: this._noticeUpdateFailure.bind(this)
            })
        },
        _noticeUpdateFailure: function(error) {
            var _box = $(this._config.notice);
            if (error.status == 2201 && _box) {
                _box.hide();
            }
        },
        _noticeUpdateSuccess: function(data) {
            var _status = "";
            var _class = "";
            var _ccEvent = "home_task_" + data.taskid + "_undone";
            if (data.state != 1) {
                _class = "taskDone";
                _status = '<span class="taskDone">[已完成，去领奖励]<span>';
                _ccEvent = "home_task_" + data.taskid + "_done";
            }
            var _html = '<div><h3>最新任务<div class="allTask"><a onmousedown="$call(function(){sohu.sa.cc(\'home_task_alltask\')},\'sohu.sa.*\')" href="/task/mytasks.do">全部任务</a></div></h3><div class="taskBag"><a href="javascript:void(0)" onmousedown="$call(function(){sohu.sa.cc(\'home_task_' + data.taskid + '_icon\')},\'sohu.sa.*\')"  onclick="sohu.task.getTask(\'' + data.taskid + '\')"><img src="' + data.icon + '" /></a></div><h4><a class="' + _class + '" href="javascript:void(0)"  onmousedown="$call(function(){sohu.sa.cc(\'' + _ccEvent + '\')},\'sohu.sa.*\')" onclick="sohu.task.getTask(\'' + data.taskid + '\')">' + data.name + _status + '</a></h4><span class="taskCash">奖励：' + data.reward_desc + '</span></div>';
            var _box = $(this._config.notice);
            _box.show();
            if (this._first) {
                kola.Anim(_box).insertEl(_html);
                this._first = false;
            } else {
                _box.html(_html);
            }
        },
        _homeReward: function(data) {
            this.fire('punchDone');
            if ($(this._config.notice).css('display') == 'none') {
                this._firstReward();
            }
            if (data.gold) {
                this._updateGold(data.gold);
            }
        },
        _firstReward: function() {
            this._first = true;
            this._noticeUpdate();
            this.closeTaskTips();
        },
        getreward: function(type, taskid) {
            if (taskid == 1 && type == 0) {
                this._disabledButton(this._config.wages);
            }
            taskMdl.reward({
                taskid: taskid
            },
            {
                success: this._rewardSuccess.bind(this, type),
                failure: this._rewardFailure.bind(this, type)
            });
        },
        _rewardSuccess: function(type, data) {
            switch (type) {
            case 0:
                this._homeReward(data);
                break;
            case 1:
                this._taskDone(data);
                break;
            case 2:
            default:
                break;
            }
        },
        _rewardFailure: function(type, error) {
            if (type == 0) {
                this._disabledButton(this._config.wages, '打卡机故障');
            } else {
                if (this.dialog) {
                    this._taskWinAlert();
                } else {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            }
        },
        getnotice: function() {
            this.topicTask.init();
            this.soundLibInit();
            var id = $(this._config.noticeTask);
            if (!id || !id.val()) {
                return;
            }
            taskMdl.statuses({
                taskids: id.val()
            },
            {
                success: this._noticeSuccess.bind(this)
            });
        },
        _noticeSuccess: function(data) {
            var data = data.statuses[0];
            if (data.state == 4) {
                $(this._config.notice).down(".taskDone").attr('style', '');
                $(this._config.notice).down("h4 a").addClass("taskDone");
            }
            if (sohu.core.reFinish) {
                sohu.core.reFinish('task');
            }
        },
        setStatus: function(ids) {
            var _search = location.search;
            if (/taskid=/i.test(_search) && _search.split("taskid=")[1]) {
                this.getTask(_search.split("taskid=")[1]);
            }
            this.soundLibInit();
            if (!ids || ids == '') {
                return;
            }
            taskMdl.statuses({
                taskids: ids
            },
            {
                success: this._getStatusSuccess.bind(this),
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }.bind(this)
            });
        },
        _getStatusSuccess: function(data) {
            data.statuses.each(function(lt, i) {
                if (lt.state == 4) {
                    var _list = $('#li_task_' + lt.tid);
                    var _task = $("#task_" + lt.tid);
                    _list.addClass('taskDoneBox');
                    _task.attr('style', '');
                }
            });
        },
        getTask: function(taskid) {
            this.dialog = sohu.ctrl.Dialog.loading('任务', {
                html: this._taskWin,
                width: 550,
                height: 350,
                mask: {
                    color: '#999999',
                    num: 50
                },
                close: {
                    anim: 'fade'
                },
                config: {
                    title: '.wHd',
                    body: '.wBd',
                    foot: '.wFt',
                    content: '.wBd',
                    closeEl: '.option .i-close'
                }
            });
            this.dialog.pannel.addClass('window-task');
            this.dialog.mask.pannel.on('click', this.dialog.close.bind(this.dialog));
            taskMdl.view({
                taskid: taskid
            },
            {
                success: function(data) {
                    if (this.dialog.pannel.down('.taskDone')) {
                        this.dialog.pannel.down('.option').addClass('optionDone');
                    }
                    this.dialog.pannel.down(this.dialog._config.closeEl).show();
                    this.dialog.setContent(data.html);
                }.bind(this),
                failure: this._taskWinAlert.bind(this)
            });
        },
        _taskWinAlert: function() {
            if (!this.dialog) {
                return;
            }
            this.dialog.setContent("<div class='taskWindow'><div class='taskError'>啊哦......任务运转出现了点小问题，请稍等片刻再尝试一下~</div></div>");
            this.dialog.pannel.down(this.dialog._config.closeEl).show();
            this.dialog.pannel.down('.option').addClass('optionDone');
        },
        _taskWin: '<div style="width:${width}px;display: ${display}" >' + '<div class="wCt">' + '<div class="wHd"><div class="option" ><a href="javascript:void(0)" class="icon i-close" style="display:none"  title="关闭">关闭</a></div></div>' + '<div class="wBd"><div class="load-page"></div></div>' + '<div class="wFt"></div>' + '</div>' + '</div>',
        _taskDone: function(data) {
            if (/home\.do/.test(location.href)) {
                this._noticeUpdate();
            }
            if (/mytasks\.do/.test(location.href)) {
                sohu.task.delTask(data.taskid);
            }
            if (data.taskid && data.reward_html && data.secret_key) {
                this._taskUpdate({
                    taskid: data.taskid,
                    reward_html: encodeURIComponent(data.reward_html),
                    secret_key: data.secret_key,
                    gold: data.gold
                });
            }
        },
        _taskUpdate: function(options) {
            taskMdl.update(options, {
                success: function(data) {
                    data.gold = options.gold;
                    this._setTaskContent(data);
                }.bind(this),
                failure: function(data) {}
            });
        },
        taskNext: function(taskid, state) {
            taskMdl.next({
                taskid: taskid,
                state: state
            },
            {
                success: this._taskNextSuccess.bind(this),
                failure: function(data) {
                    this.dialog.close();
                }.bind(this)
            });
        },
        _taskNextSuccess: function(data) {
            var options = {
                speed: 5,
                callback: this._setTaskContent.bind(this, data)
            }
            if (/home\.do/.test(location.href)) {
                this._noticeUpdate();
            }
            var _box = this.dialog.body.down('div.taskOpen') || this.dialog.body.down('div.taskDone');
            if (!_box) {
                this.dialog.close()
            };
            kola.anim.FadeOut.action(_box, options);
        },
        _taskUpdateSuccess: function(data) {
            if (this.dialog) {
                this._taskNextSuccess(data);
            } else {
                this.getTask(data.taskid);
            }
        },
        _setTaskContent: function(data) {
            this.dialog.setContent(data.html);
            this._gold = parseInt($(this._config.moneyBox).html());
            if (this.dialog.pannel.down('.taskDone')) {
                this.dialog.pannel.down('.option').addClass('optionDone');
            } else {
                this.dialog.pannel.down('.option').removeClass('optionDone');
            }
            if (this.dialog.pannel.down('.taskCash-large')) {
                this.dialog.pannel.down('.taskCash-large').html(this._gold);
                this._taskDoneAnim(data.gold, this.dialog.pannel.down(this._config.popGoldBox));
            }
        },
        topicTask: {
            config: {
                homeTopicId: "#homeTopic",
                homeTopicName: "#homeTopicName",
                topicDfaultName: "topicTips",
                topicContentId: "#homeTopicContent",
                topicCookieName: "homeTopic_",
                tipBrowserName: "tipBrowser",
                tipBrowserId: "#tipBrowser",
                maintainClass: "homeTip-maintain",
                updateClass: "homeTip-update",
                levelId: "#j-level"
            },
            init: function() {
                var _name = $(this.config.homeTopicName);
                var _taskKey = _name ? _name.val() : this.config.topicDfaultName;
                var _homeTopic = $(this.config.homeTopicId);
                if (!kola.Cookie.get(this.config.topicCookieName + _taskKey)) {
                    var _content = $(this.config.topicContentId);
                    if (_name && _content.html().trim() != '') {
                        var _type = _name.attr('data-key');
                        switch (_type) {
                        case "2":
                            _homeTopic.addClass(this.config.maintainClass);
                            break;
                        case "3":
                            _homeTopic.addClass(this.config.updateClass);
                            break;
                        default:
                            break;
                        }
                        _homeTopic.show();
                        return;
                    }
                } else {
                    _homeTopic.hide();
                }
                if (!kola.Cookie.get(this.config.tipBrowserName)) {
                    var _level = $(this.config.levelId);
                    if (_level) {
                        if (parseInt(_level.html()) <= 3) {
                            return;
                        }
                    }
                    if (/MSIE 6.0/gi.test(navigator.appVersion) && !/MSIE[^6].0/gi.test(navigator.appVersion)) {
                        this.initBrowserTip(1);
                    }
                    if (/Firefox\/2/gi.test(navigator.userAgent)) {
                        this.initBrowserTip(2);
                    }
                }
            },
            del: function() {
                var _name = $(this.config.homeTopicName);
                var _taskKey = _name ? _name.val() : this.config.topicDfaultName;
                kola.Cookie.set(this.config.topicCookieName + _taskKey, true, (60 * 12), '/', PATH.domain);
                $(this.config.homeTopicId).hide();
            },
            closeBrowserTip: function() {
                var _el = $(this.config.tipBrowserId);
                _el.css('overflow', 'hidden');
                kola.Cookie.set(this.config.tipBrowserName, true, (60 * 24 * 30), '/', PATH.domain);
                kola.Anim(_el).to('height', '1px').ondone(_el.hide.bind(_el)).go();
            },
            initBrowserTip: function(type) {
                var ie6 = {
                    title: '<acronym class="browserName" title="Internet Explorer 6">IE6</acronym>',
                    update: '<a href="http://www.microsoft.com/china/windows/internet-explorer/" target="_blank" title="去IE官方网站下载最新版的IE8浏览器">升级到最新版的&nbsp;<acronym class="browserName" title="Internet Explorer 8">IE8</acronym>&nbsp;浏览器 &raquo;</a>'
                }
                var ff2 = {
                    title: '<span class="browserName">Firefox&nbsp;2</span>&nbsp;',
                    update: '<a href="http://www.mozillaonline.com/" target="_blank" title="去Firefox官方网站下载最新版的Firefox3浏览器">升级到最新版的&nbsp;<span class="browserName">Firefox&nbsp;3.5</span>&nbsp;浏览器 &raquo;</a>'
                }
                var _sexEl = $("#currentUserSex")
                var _sexSt = _sexEl.val() == 1 ? '帅哥': _sexEl.val() == 2 ? '美女': '小白';
                switch (type) {
                case 1:
                    _browser = ie6;
                    _class = 'browserTip-ie6';
                    break;
                case 2:
                    _browser = ff2;
                    _class = 'browserTip-ff2';
                    break;
                default:
                    return;
                }
                var _html = '<div class="browserTipClose"><a href="javascript:void(0)" class="icon i-close" onclick="$call(function(){sohu.task.topicTask.closeBrowserTip()},\'sohu.task.*\')" title="关闭">关闭</a></div><div class="browserTipContent"><h4>' + _sexSt + '，你 OUT 了~</h4><p>你还在用老掉牙的&nbsp;' + _browser.title + '？你不想体会当今互联网的更多精彩？不，不能~~<br />' + _browser.update + '</p></div>';
                var _el = $(this.config.tipBrowserId).show();
                _el.addClass(_class);
                _el.css('overflow', 'hidden');
                kola.Anim(_el).insertEl(_html);
            }
        },
        soundLibInit: function() {
            var _flashStr = '<object height="1" align="middle" width="1" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" name="player" id="soundLib_ob"><param value="always" name="allowScriptAccess"/><param value="' + _soundLibPath + 'sound/soundLib.swf" name="movie"/><param value="high" name="quality"/><param value="true" name="allowFullScreen"/><param value="transparent" name="wmode"/><param value="jsReady=sohu.task.jsReady&swfReady=sohu.task.soundReady" name="flashvars"/><embed height="1" align="middle" width="1" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" wmode="transparent" allowfullscreen="true" allowscriptaccess="always" quality="high" flashvars="jsReady=sohu.task.jsReady&swfReady=sohu.task.soundReady" src="' + _soundLibPath + 'sound/soundLib.swf" name="player" id="soundLib_em"></embed></object>'
            var _soundLib = $(this._config.soundLib);
            if (_soundLib) {
                _soundLib.html(_flashStr);
            }
        },
        jsReady: function() {
            return true;
        },
        soundReady: function() {
            this.soundLibReady = true;
        },
        playSound: function(type) {
            if (!this.soundLibReady) {
                return;
            }
            var _flash = this._getFlash('soundLib');
            _flash.playSound(type);
        },
        _getFlash: function(id) {
            var flash = null;
            if (kola.Browser.webkit) {
                flash = document.getElementById(id + "_ob");
            } else {
                if (document[id + '_em']) {
                    flash = document[id + '_em'];
                } else {
                    flash = document[id + '_ob'];
                }
            }
            return flash;
        },
        closeMusicTips: function() {
            var s = $(this._config.musicTip);
            if (s) {
                kola.anim.FadeOut.action(s, {
                    callback: function() {
                        s.remove()
                    }
                });
            }
            this.showTaskTips();
        },
        showTaskTips: function() {
            var t = $(this._config.taskTip);
            if (t && !this.taskBtnInUse) {
                kola.anim.FadeIn.action(t);
            }
        },
        closeTaskTips: function() {
            var t = $(this._config.taskTip);
            if (t) {
                t.show();
                setTimeout(function() {
                    kola.anim.FadeOut.action(t, {
                        callback: function() {
                            t.remove()
                        }
                    });
                    this.taskBtnInUse = true;
                }.bind(this), 2000);
            }
        }
    }
    kola.Event.initEventObserver(sohu.task);
},
'sohu.ctrl.Dialog,sohu.core.*,kola.anim.Tween,kola.anim.Fade');
$register('sohu.navbar.*',
function() {
    var PACK = sohu.navbar;
    var navbarMdl = new sohu.core.Model({
        actions: {
            get: {
                url: '/navbar/info/get.do',
                params: [],
                method: 'get',
                format: 'json',
                type: 'one'
            },
            notice: {
                url: '/notice/info/list.do',
                params: ['cate', 'start', 'size'],
                method: 'get',
                format: 'json',
                type: 'one'
            }
        },
        url: '/a'
    });
    PACK.navbarCtl = {
        msgCount: 0,
        init: function(inboxEl, noticeEl) {
            this.inboxEl = inboxEl;
            this.noticeEl = noticeEl;
            this.get();
            this._comet();
            this._setProfileUrl();
            return this;
        },
        get: function() {
            navbarMdl.get({},
            {
                success: function(data) {
                    this._change(data.inbox_count, data.notice_count);
                }.bind(this),
                failure: function() {}
            });
        },
        _setProfileUrl: function() {
            var profileNav = $('#navbar-profile');
            if (profileNav) {
                var profileLink = profileNav.down('a');
                profileLink.attr('href', profileLink.attr('href') + '?u=' + sohu.user.id)
            }
        },
        _title: '【新通知】 - 白社会 Beta',
        _change: function(inbox, notice) {
            inbox = parseInt(inbox);
            notice = parseInt(notice);
            if (inbox > 0) {
                var inboxEl = $(this.inboxEl);
                inboxEl.show('block');
                if (inbox > 100) inboxEl.down('span').html("" + inbox + "+");
                else inboxEl.down('span').html("" + inbox + "");
            }
            this.msgCount = notice;
            if (notice > 0) {
                var lastTitle = document.title;
                if (lastTitle.indexOf('【') != 0) {
                    document.title = this._title;
                    var fun = this._changeTitle.bind(this, lastTitle);
                    fun.timeout(1);
                }
                var noticeEl = $(this.noticeEl);
                noticeEl.show('block');
                if (notice > 100) noticeEl.down('span').html("" + notice + "+");
                else noticeEl.down('span').html("" + notice + "");
            }
        },
        _changeTitle: function(t) {
            document.title = t;
        },
        _comet: function() {
            $call(function() {
                sohu.channel.on('notice, inbox',
                function(e) {
                    var notice = 0;
                    var inbox = 0;
                    if (e.type == 'notice') notice = e.data;
                    if (e.type == 'inbox') inbox = e.data;
                    this._change(inbox, notice);
                }.bind(this));
            }.bind(this), 'sohu.channel.*');
        },
        _hit: 0,
        notice: function(element) {
            element = $(element);
            var noticeEl = $(this.noticeEl);
            if (element.hasClass('navItem-drop')) {
                element.removeClass('navItem-drop');
                return;
            } else {
                this._hit++;
                noticeEl.hide();
                element.addClass('navItem-drop');
            }
            element.out('click',
            function() {
                element.removeClass('navItem-drop');
            });
            if (!this._iframe) {
                var temp = document.createElement('iframe');
                temp.className = 'maskIframe navContentMaskIframe';
                element.append(temp);
                this._iframe = $(temp);
                if (!kola.Browser.ie6) {
                    this._iframe.css('position', 'fixed');
                    this._iframe.css('left', this._iframe.prev().pos().left + 'px');
                }
            }
            var contentEl = element.down('.j-body');
            if (this.msgCount == 0 && this._hit > 1) return;
            navbarMdl.notice({
                start: 0,
                size: this._getNoticeNum()
            },
            {
                success: function(data) {
                    contentEl.html(data.list);
                    var body = element.down('.navContentBd');
                    var bodyH = body.height();
                    if (bodyH > 400) {
                        body.height(400);
                        this._iframe.height(400 + 41);
                    } else {
                        body.removeAttr('style');
                        this._iframe.height(bodyH + 35);
                    }
                    this._recommend(contentEl);
                    this.msgCount = 0;
                }.bind(this),
                failure: function(error) {
                    var str = sohu.config('error', error);
                    contentEl.html(str);
                }.bind(this)
            });
        },
        _getNoticeNum: function() {
            var n = kola.Cookie.get('noticeNum'),
            r = 0;
            if (n) {
                r = parseInt(n);
            }
            r = this.msgCount + r;
            if (r < 5) {
                r = 5;
            }
            this._setNoticeNum(r);
            return r;
        },
        _setNoticeNum: function(num) {
            kola.Cookie.remove('noticeNum', '/', PATH.domain);
            kola.Cookie.set('noticeNum', num.toString(), null, '/', PATH.domain);
        },
        _settingShow: false,
        setting: function(element, target) {
            element = $(element);
            target = $(target);
            this._settingBindOut = function() {
                target.hide();
            }
            element.on('click',
            function(e) {
                if (this._settingShow) {
                    target.hide();
                    this._settingShow = false;
                    target.unout('click', this._settingBindOut.bindEvent(this));
                } else {
                    target.show();
                    this._settingShow = true;
                    kola.Event.stop(e);
                    target.out('click', this._settingBindOut.bindEvent(this));
                }
            }.bind(this));
        },
        _recommend: function(obj) {
            var _list = obj.down("a[data-key]");
            if (!_list) {
                return;
            }
            _list.each(function(lt, i) {
                var __data = lt.attr("data-key").split("|");
                lt.attr('href', 'javascript:void(0)');
                lt.on("click",
                function() {
                    sohu.recommend.RecommendCtl.init({
                        rid: __data[0],
                        name: __data[1],
                        src: __data[2],
                        info: __data[3]
                    });
                })
            })
        }
    };
    sohu.BossCome = {
        init: function() {
            $(document).on('keydown', this._bind.bindEvent(this));
            var body = $(document.body);
            var w = screen.width;
            if (!body.hasClass('bossKey-off') && !body.hasClass('bossKey-none')) {
                if (w >= 1280) {
                    var styles = '.bossKey-off{background-position:' + (w - 59) + 'px 0;}' + '.bossKey-off #bossKey{left:' + (w - 72) + 'px;}';
                    sohu.View.evalCss(styles);
                    body.addClass('bossKey-off');
                } else {
                    body.addClass('bossKey-hide');
                }
            }
        },
        _isComing: false,
        _iframeBox: null,
        _title: document.title,
        _top: 0,
        _keyEl: $('#bossKeyExit'),
        _bind: function(e) {
            var code = e.keyCode;
            if (code == 120) {
                if (this._isComing) {
                    this._away();
                } else {
                    this._come();
                }
            }
        },
        _come: function() {
            this._isComing = true;
            this._top = document.documentElement.scrollTop;
            window.scrollTo(0, 0);
            document.title = "搜狗 更懂网络-www.sogou.com";
            if (!this._iframeBox) {
                var d = document.createElement('div');
                d.id = "bossPage";
                d.innerHTML = "<div id='bossPageInt'><iframe src='http://www.sogou.com/' frameBorder='0'></iframe></div>";
                $(document.body).append(d);
                this._iframeBox = $(d);
            }
            this._show();
            if (this._keyEl) {
                if (this._keyBind) {
                    this._keyEl.un('click', this._keyBind);
                } else {
                    this._keyBind = function() {
                        this._away();
                    }.bind(this);
                }
                this._keyEl.on('click', this._keyBind);
            }
        },
        _away: function() {
            this._isComing = false;
            this._hide();
            document.title = this._title;
            window.scrollTo(0, this._top);
            if (this._keyEl) {
                this._keyEl.un('click', this._keyBind);
            }
        },
        _show: function() {
            var body = $(document.body);
            var w = body.width();
            body.removeClass('bossKey-off').removeClass('bossKey-hide');
            body.addClass('bossKey-on');
        },
        _hide: function() {
            var body = $(document.body);
            var w = screen.width;
            if (w >= 1280) {
                body.removeClass('bossKey-on').addClass('bossKey-off');
            } else {
                body.removeClass('bossKey-on').addClass('bossKey-hide');
            }
        }
    };
},
'sohu.core.*, sohu.recommend.*');
$register('sohu.im.*',
function() {
    var ImMdl = sohu.friend.Component,
    ChatMdl = sohu.chat.Service;
    function template(tplt, data) {
        return new kola.Template(tplt).evaluate(data);
    };
    var screenWidth = window.screen.width;
    var hasTinyBar = true;
    kola.Cookie.set('csSize', screen.width + '|' + screen.height, 'never', '/');
    sohu.im.Bar = {
        init: function() {
            this._getTinyBar();
            this._initStyle();
            this._initIframe();
            if (hasTinyBar) {
                this.tinyBar = sohu.im.TinyBar.init();
            }
            this.fullBar = sohu.im.fullBar.init();
            sohu.im.Hotkey.init();
            $(window).on('resize', this._setPos.bind(this));
            return this;
        },
        _initStyle: function() {
            var body = $(document.body);
            if (!body.hasClass('im-full') && !body.hasClass('im-hide') && !body.hasClass('im-tall') && !body.hasClass('im-short')) {
                var conf = sohu.im.CONFIG,
                sty = sohu.im.STYLE,
                sWidth = screenWidth;
                if (sWidth >= conf.minWidth) {
                    sWidth = body.prop('clientWidth');
                    if (sWidth < conf.minWidth) {
                        sWidth = conf.minWidth;
                    }
                    this._setStyle(sWidth);
                } else {}
                if (screen.height <= conf.minHeight) {
                    body.addClass(sty.low);
                } else {
                    body.addClass(sty.high);
                }
                if (hasTinyBar) {
                    body.addClass(sty.tiny);
                } else {
                    body.addClass(sty.full);
                }
            } else {
                if (body.prop('clientWidth') < (screenWidth - 20)) {
                    this._setPos();
                }
            }
        },
        _initIframe: function() {
            var el = sohu.im.ELEMENT;
            if (screenWidth < sohu.im.CONFIG.minWidth) {
                $(el.barPanel).prepend(kola.Element.create('iframe', {
                    'class': 'maskIframe imbarMaskIframe'
                }));
                $(el.tinybar).prepend(kola.Element.create('iframe', {
                    'class': 'maskIframe imTinybarMaskIframe'
                }));
            }
        },
        _setPos: function() {
            var conf = sohu.im.CONFIG,
            sWidth = $(document.body).prop('clientWidth');
            if (screenWidth >= conf.minWidth) {
                if (sWidth < conf.minWidth) {
                    sWidth = conf.minWidth;
                }
                this._setStyle(sWidth);
            } else {
                this._setStyle(sWidth);
            }
        },
        _setStyle: function(sWidth) {
            var styleEl = $(sohu.im.ELEMENT.imbarStyle),
            cssText = '';
            if (sWidth >= 1180) {
                sWidth += 17;
                cssText = '.im-full #imbar{right:auto;left:' + (sWidth - 220) + 'px;}' + '.im-hide #imTinybar{right:auto;left:' + (sWidth - 85) + 'px;}' + '.im-show #imbar{right:auto;left:' + (sWidth - 220) + 'px;}' + '.bossKey-off{background-position:' + (sWidth - 59) + 'px 0;}' + '.bossKey-off #bossKey{left:' + (sWidth - 72) + 'px;}';
            } else if (sWidth >= 1005 && sWidth < 1180) {
                cssText = '.im-hide #imTinybar{right:0;left:auto;}' + '.im-show #imbar{right:0;left:auto;}';
            } else {
                cssText = '.im-hide #imTinybar{right:auto;left:980px;}' + '.im-show #imbar{right:auto;left:845px;}';
            }
            if (styleEl.prop('styleSheet')) {
                styleEl.prop('styleSheet').cssText = cssText;
            } else {
                styleEl.append(document.createTextNode(cssText));
            }
        },
        _getTinyBar: function() {
            hasTinyBar = window.im_hasTinyBar;
            if (typeof(hasTinyBar) == 'undefined') {
                hasTinyBar = true;
            } else {
                if (hasTinyBar == false) {
                    if (screenWidth < sohu.im.CONFIG.minWidth) {
                        hasTinyBar = true;
                    } else {
                        hasTinyBar = false;
                    }
                }
            }
            return hasTinyBar;
        }
    };
    sohu.im.fullBar = Class.create({
        initialize: function() {
            this._initElements();
            this._initControls();
        },
        _initElements: function(panel) {
            var el = sohu.im.ELEMENT;
            this._els = {
                imbar: $(el.barPanel)
            }
        },
        _initControls: function() {
            this._grouper = sohu.im.Group.init();
            this._searcher = sohu.im.Search.init();
            this._chatMgr = sohu.im.Setting.init();
            this._onlineSetter = sohu.im.Online.Setter.init();
        },
        build: function() {
            this._grouper.buildList.bind(this._grouper).timeout(0);
            return this;
        }
    });
    sohu.im.fullBar.init = function() {
        this.instance = new sohu.im.fullBar().build();
        return this.instance;
    };
    sohu.im.TinyBar = Class.create({
        initialize: function() {
            this._initElements();
            this._initEvents();
        },
        _initElements: function(panel) {
            var el = sohu.im.ELEMENT;
            this._els = {
                body: $(document.body),
                bar: $(el.barPanel),
                tinybar: $(el.tinybar),
                tinybarMid: $(el.tinybarMid),
                barMid: $(el.barMid),
                toggle: $(el.tbarToggle),
                onlineCount: $(el.tbarOnlineCount),
                sessionList: $(el.tbarSessions)
            };
        },
        _initEvents: function() {
            var el = this._els;
            el.toggle.on('click', this._switch2Show.bindEvent(this));
        },
        _switch2Show: function(e) {
            var sty = sohu.im.STYLE,
            el = this._els,
            tinybarWidth = el.tinybar.width() + 10,
            _this = this;
            kola.Event.stop(e);
            el.bar.css('overflow', 'hidden');
            el.tinybar.css('overflow', 'hidden');
            kola.Anim(el.tinybarMid).to('right', -tinybarWidth).ondone(function() {
                el.body.removeClass(sty.tiny).addClass(sty.show);
                kola.Anim(el.barMid).to('right', 0).duration(250).ondone(function() {
                    el.bar.css('overflow', 'visible');
                    el.tinybar.css('overflow', 'visible');
                }).go();
                el.bar.out('click', _this._switch2Hide.bind(_this));
            }).duration(100).go();
        },
        _switch2Hide: function() {
            var conf = sohu.im.CONFIG,
            sty = sohu.im.STYLE,
            el = this._els,
            barWidth = el.bar.width() + 10;
            el.bar.css('overflow', 'hidden');
            el.tinybar.css('overflow', 'hidden');
            kola.Anim(el.barMid).to('right', -barWidth).ondone(function() {
                el.body.removeClass(sty.show).addClass(sty.tiny);
                window.setTimeout(function() {
                    kola.Anim(el.tinybarMid).to('right', 0).duration(100).ondone(function() {
                        el.tinybar.css('overflow', 'visible');
                    }).go();
                },
                100);
            }).duration(250).go();
        },
        setOnlineCount: function(count) {
            this._els.onlineCount.html('[' + count + ']');
        }
    });
    sohu.im.TinyBar.init = function() {
        this.instance = new sohu.im.TinyBar();
        return this.instance;
    };
    sohu.im.Group = Class.create({
        initialize: function() {
            this._initElements();
            this._initProperties();
        },
        _initElements: function(panel) {
            var el = sohu.im.ELEMENT;
            this._els = {
                panel: $(el.frdPanel),
                grpItem: el.grpItem,
                grpTitle: el.grpTitle,
                frdList: el.frdList
            }
        },
        _initProperties: function() {
            this._frdLister = sohu.im.Friend.init();
        },
        buildList: function() {
            this._els.panel.html(sohu.im.CONFIG.loading);
            this._friendloadHandler = function() {
                ImMdl.un(sohu.im.EVENT.friendload, this._friendloadHandler);
                ImMdl.un(sohu.im.EVENT.friendupdate, this._friendloadHandler);
                var conf = sohu.im.CONFIG,
                groups = ImMdl.getGroups(true),
                groupsHtml = [];
                groupsHtml.push(this._buildSessionItem());
                groupsHtml.push(this._buildOnlineItem());
                for (var i = 0, len = groups.length; i < len; i++) {
                    groupsHtml.push(this._buildActualItem(groups[i]));
                }
                this._els.panel.html(groupsHtml.join(''));
                this._detailProcess(groups);
            }.bind(this);
            ImMdl.on(sohu.im.EVENT.friendload, this._friendloadHandler);
        },
        _detailProcess: function(groups) {
            var conf = sohu.im.CONFIG,
            el = this._els,
            onlineGrpItem = sohu.im.Group.getItem(conf.onlineGrp.id),
            onlineGrpShow = this._getShowState(conf.onlineGrp.id);
            el.panel.down(el.grpTitle).on('click', this._toggleItem.bindEvent(this));
            this._expandItem(sohu.im.Group.getItem(conf.sessionGrp.id));
            if (onlineGrpShow == null || onlineGrpShow == '1') {
                this._expandItem(onlineGrpItem);
            }
            this._frdLister.buildAllList.bind(this._frdLister, groups).timeout(0);
            ImMdl.on(sohu.im.EVENT.friendupdate, this._friendloadHandler);
        },
        _buildSessionItem: function() {
            return this._buildActualItem(sohu.im.CONFIG.sessionGrp);
        },
        _buildOnlineItem: function() {
            return this._buildActualItem(sohu.im.CONFIG.onlineGrp);
        },
        _buildActualItem: function(group) {
            var conf = sohu.im.CONFIG,
            gInfos = {
                gItemId: conf.gidPrefix + group.id,
                specialCls: group.specialCls ? group.specialCls: '',
                gFullName: group.name,
                gName: group.name
            };
            if (group.name.byteLength() > conf.grpNameLength) {
                gInfos.gName = group.name.left(conf.grpNameLength) + conf.points;
            }
            return template(sohu.im.TEMPLATE.grpItem, gInfos);
        },
        _toggleItem: function(e) {
            var el = this._els,
            gTitle = kola.Event.element(e).upWithMe(el.grpTitle);
            if (gTitle) {
                var group = gTitle.up(el.grpItem);
                if (group.hasClass(sohu.im.STYLE.groupOn)) {
                    this._collapseItem(group);
                } else {
                    this._expandItem(group);
                }
            }
        },
        _setShowState: function(gid, state) {
            var conf = sohu.im.CONFIG;
            if (gid == conf.onlineGrp.id) {
                kola.Cookie.set(conf.imGrpShow + gid, state, 'never', '/');
            }
            sohu.im.Group.expState[gid] = state;
        },
        _getShowState: function(gid) {
            var conf = sohu.im.CONFIG;
            return kola.Cookie.get(conf.imGrpShow + gid);
        },
        _expandItem: function(group) {
            group.addClass(sohu.im.STYLE.groupOn);
            this._setShowState(group.attr('id').split('_')[2], 1);
        },
        _collapseItem: function(group) {
            group.removeClass(sohu.im.STYLE.groupOn);
            this._setShowState(group.attr('id').split('_')[2], 0);
        }
    });
    sohu.im.Group.init = function() {
        this.instance = new sohu.im.Group();
        return this.instance;
    };
    sohu.im.Group.getItem = function(groupId) {
        var conf = sohu.im.CONFIG;
        return $('#' + conf.gidPrefix + groupId);
    };
    sohu.im.Group.updateOnlineCount = function(groups, online) {
        var conf = sohu.im.CONFIG,
        tplt = sohu.im.TEMPLATE,
        st = sohu.im.STATE,
        el = sohu.im.ELEMENT,
        allOnlineCount = 0;
        for (var i = 0, len = groups.length; i < len; i++) {
            var gid = groups[i].id,
            grpItem = sohu.im.Group.getItem(gid),
            grpTitle = grpItem.down(el.grpTitle),
            gName = groups[i].name,
            count = ImMdl.getOnlineCount(gid);
            allCount = count[1],
            onlineCount = count[0];
            if (gName.byteLength() > conf.grpNameLength) {
                gName = gName.left(conf.grpNameLength) + conf.points;
            }
            if (!online) {
                if (gid != conf.onlineGrp.id) {
                    grpTitle.html(gName + template(tplt.frdCount2, {
                        allCount: allCount
                    }));
                } else {
                    allOnlineCount = '?';
                    grpTitle.html(gName + template(tplt.frdCount1, {
                        onlineCount: allOnlineCount
                    }));
                    if (hasTinyBar) {
                        $(el.tbarToggle).html(gName + template(tplt.frdCount1, {
                            onlineCount: allOnlineCount
                        }));
                    }
                }
            } else {
                if (gid != conf.onlineGrp.id) {
                    grpTitle.html(gName + template(tplt.frdCount3, {
                        onlineCount: onlineCount,
                        allCount: allCount
                    }));
                } else {
                    allOnlineCount = onlineCount;
                    grpTitle.html(gName + template(tplt.frdCount1, {
                        onlineCount: allOnlineCount
                    }));
                    if (hasTinyBar) {
                        $(el.tbarToggle).html(gName + template(tplt.frdCount1, {
                            onlineCount: allOnlineCount
                        }));
                    }
                }
            }
        }
    };
    sohu.im.Group.expState = {};
    sohu.im.Friend = Class.create({
        initialize: function() {
            this._initElements();
            this._initEvents();
        },
        _initEvents: function() {
            this._events = {
                newMessage: this._newMessage.bind(this),
                addSessions: this._addSessions.bind(this),
                delSessions: this._delSessions.bind(this),
                onlineChange: this._onlineChange.bind(this),
                userupdate: this._userupdate.bind(this)
            }
        },
        buildAllList: function(groups) {
            var el = this._els;
            this._buildAllList = function(online) {
                var conf = sohu.im.CONFIG,
                el = this._els;
                groups.push(conf.onlineGrp);
                this._groups = groups;
                var frdItems = el.frdPanel.down(el.frdItem);
                if (frdItems) frdItems.remove();
                if (online) {
                    ImMdl.un(sohu.im.EVENT.onlineload, this._onlineloadHandler);
                    this._buildListByGid(conf.onlineGrp.id);
                }
                for (var i = 0, len = this._groups.length; i < len; i++) {
                    var groupId = this._groups[i].id;
                    if (groupId != conf.onlineGrp.id) {
                        this._buildListByGid(groupId);
                    }
                }
                this._detailProcess(online);
            }.bind(this);
            this._onlineloadHandler = function() {
                this._buildAllList(true);
            }.bind(this);
            this._buildAllList(false);
            ImMdl.on(sohu.im.EVENT.onlineload, this._onlineloadHandler);
            el.frdPanel.down(el.grpTitle).on('click', this._buildFrdList.bindEvent(this));
        },
        _initElements: function() {
            var el = sohu.im.ELEMENT;
            this._els = {
                frdPanel: $(el.frdPanel),
                grpItem: el.grpItem,
                grpTitle: el.grpTitle,
                frdList: el.frdList,
                frdItem: el.frdItem
            };
        },
        _detailProcess: function(online) {
            var el = this._els,
            frdItems = el.frdPanel.down(el.frdItem);
            if (online) {
                ChatMdl.on(sohu.im.EVENT.newmessage, this._events.newMessage);
                ChatMdl.on(sohu.im.EVENT.sessionadd, this._events.addSessions);
                ChatMdl.on(sohu.im.EVENT.sessiondel, this._events.delSessions);
                ImMdl.on(sohu.im.EVENT.onlinechange, this._events.onlineChange);
            }
            ImMdl.on(sohu.im.EVENT.userupdate, this._events.userupdate);
            sohu.im.Group.updateOnlineCount(this._groups, online);
        },
        _newMessage: function(e) {
            sohu.im.Message.receive(e.data);
        },
        _addSessions: function(e) {
            sohu.im.Message.addSessions(e.data);
        },
        _delSessions: function(e) {
            sohu.im.Message.delSessions(e.data);
        },
        _onlineChange: function(e) {
            sohu.im.Online.change(e.data);
        },
        _userupdate: function(e) {
            var frdInfo = e.data;
            var frdItems = this._els.frdPanel.down('li[data-fid=' + frdInfo.id + ']');
            if (frdItems) {
                frdItems.each(function(frdItem) {
                    frdItem.down('img').attr('src', (frdInfo.icon ? frdInfo.icon: sohu.im.CONFIG.dftIcon)).attr('alt', frdInfo.name);
                    frdItem.down('a').attr('title', frdInfo.name).get(1).html(frdInfo.name);
                });
            }
        },
        _buildFrdList: function(e) {
            var el = this._els,
            grpItem = kola.Event.element(e).upWithMe(el.grpItem);
            if (grpItem) {
                var gid = grpItem.attr('id').split('_')[2];
                sohu.im.Group.expState[gid] = 1;
                this._buildListByGid(gid);
            }
        },
        _buildListByGid: function(gid) {
            var conf = sohu.im.CONFIG,
            el = sohu.im.ELEMENT,
            grpItem = sohu.im.Group.getItem(gid);
            if (sohu.im.Group.expState[gid] == 1 && !grpItem.down(el.frdItem)) {
                if (gid != conf.onlineGrp.id) {
                    var frdListStr = this._buildActualList(ImMdl.getFriends(gid));
                } else {
                    var frdListStr = this._buildOnlineList();
                }
                if (frdListStr.length != 0) {
                    grpItem.down(el.frdList).html(frdListStr);
                    this._card = sohu.im.UserCard.initList(gid);
                }
            }
        },
        _buildOnlineList: function() {
            return this._buildActualList(ImMdl.getFriends(sohu.im.CONFIG.onlineGrp.id));
        },
        _buildActualList: function(friends) {
            var friendsHtml = [];
            for (var i = 0, len = friends.length; i < len; i++) {
                friendsHtml.push(this._buildItemStr(friends[i]));
            }
            return friendsHtml.join('');
        },
        _buildItemStr: function(friend) {
            var st = sohu.im.STATE;
            if (!friend.online) friend.online = st.offline.id;
            var fInfos = {
                fItemId: sohu.im.CONFIG.fidPrefix + friend.id,
                fId: friend.id,
                fOnline: st[friend.online].style,
                fName: friend.name,
                fIcon: friend.icon
            };
            return template(sohu.im.TEMPLATE.frdItem, fInfos);
        },
        _buildItemObj: function(friend) {
            var item = null,
            itemId = sohu.im.CONFIG.fidPrefix + friend.id,
            itemStr = this._buildItemStr(friend),
            tmpEl = kola.Element.create('div').hide().html(itemStr);
            $(document.body).append(tmpEl);
            item = $('#' + itemId);
            tmpEl.remove();
            return item;
        },
        _buildTinyItemStr: function(friend) {
            var fInfos = {
                itemId: sohu.im.CONFIG.tinyFidPrefix + friend.id,
                fId: friend.id,
                fName: friend.name,
                fIcon: friend.icon
            };
            return template(sohu.im.TEMPLATE.frdTinyItem, fInfos);
        },
        _buildTinyItemObj: function(friend) {
            var item = null,
            itemId = sohu.im.CONFIG.tinyFidPrefix + friend.id,
            itemStr = this._buildTinyItemStr(friend),
            tmpEl = kola.Element.create('div').hide().html(itemStr);
            $(document.body).append(tmpEl);
            item = $('#' + itemId);
            tmpEl.remove();
            return item;
        }
    });
    sohu.im.Friend.init = function() {
        this.instance = new sohu.im.Friend();
        return this.instance;
    };
    sohu.im.Friend.getItem = function(fId) {
        var conf = sohu.im.CONFIG;
        return $('#' + conf.fidPrefix + fId);
    };
    sohu.im.Friend.getTinyItem = function(fId) {
        var conf = sohu.im.CONFIG;
        return $('#' + conf.tinyFidPrefix + fId);
    };
    sohu.im.Friend.buildItem = function(friend) {
        friend = Object.extend({
            id: new Date().getTime(),
            icon: sohu.im.CONFIG.dftIcon
        },
        (isNaN(friend.id) ? null: ImMdl.getFriend(friend.id)) || friend);
        if (this.instance) {
            return this.instance._buildItemObj(friend);
        } else {
            return sohu.im.Friend.init()._buildItemObj(friend);
        }
    };
    sohu.im.Friend.buildTinyItem = function(friend) {
        friend = Object.extend({
            id: new Date().getTime(),
            icon: sohu.im.CONFIG.dftIcon
        },
        (isNaN(friend.id) ? null: ImMdl.getFriend(friend.id)) || friend);
        if (this.instance) {
            return this.instance._buildTinyItemObj(friend);
        } else {
            return sohu.im.Friend.init()._buildTinyItemObj(friend);
        }
    };
    sohu.im.Friend.talk = function(position, fId) {
        var conf = sohu.im.CONFIG,
        _this = this,
        el = sohu.im.ELEMENT,
        friend = (isNaN(fId) ? null: ImMdl.getFriend(fId)),
        friendName = fId,
        pos = {};
        friendName = friend ? friend.name: fId;
        if (this._talkToHandle) return;
        pos = Object.clone(pos, position);
        this._talkToHandle = window.setTimeout(function() {
            sohu.chat.Service.chat(fId, {
                name: friendName,
                pos: _this.getChatWinPos(pos)
            });
            sohu.im.Message.readed(fId);
            _this._talkToHandle = null;
        },
        100);
    };
    sohu.im.Friend.getChatWinPos = function(pos) {
        var conf = sohu.im.CONFIG,
        el = sohu.im.ELEMENT,
        barPos = $(el.barPanel).pos(),
        frdPos = {
            top: barPos.top,
            left: barPos.left - conf.chatWinWidth
        },
        clientHeight = kola.Browser.ie ? document.documentElement.clientHeight: document.body.clientHeight,
        scrollTop = document.documentElement.scrollTop;
        if (typeof(pos) != 'object') return frdPos;
        if (hasTinyBar) frdPos.left = screenWidth - conf.barWidth - conf.chatWinWidth;
        if (pos.clientY) frdPos.top = pos.clientY + scrollTop;
        if (pos.custom) {
            frdPos.top = pos.top;
            frdPos.left = pos.left;
        }
        if (frdPos.top < barPos.top) frdPos.top = barPos.top;
        if (frdPos.top + conf.chatWinHeight > clientHeight + scrollTop) {
            frdPos.top = clientHeight + scrollTop - conf.chatWinHeight;
        }
        return frdPos;
    };
    sohu.im.Friend.copy = function(frdItem) {
        frdItem = frdItem.copy(true);
        sohu.im.UserCard.initItem(frdItem);
        return frdItem;
    };
    sohu.im.Message = Class.create({
        initialize: function(fId) {
            this._initProperties(fId);
            this._initElements();
            if (!fId) return this;
            this._receive();
        },
        _initProperties: function(fId) {
            this._fId = fId;
            this._friend = (!fId || isNaN(fId)) ? null: ImMdl.getFriend(fId);
            this._msgInt = null;
            this._alertCount = 0;
            this._frdItem = null;
            this._grdTitle = null;
            this._docTitle = document.title;
            return this;
        },
        _initElements: function() {
            var el = sohu.im.ELEMENT;
            this._els = {
                tinyFrdList: el.tbarSessions,
                grpItem: el.grpItem,
                grdTitle: el.grpTitle,
                frdList: el.frdList,
                frdItem: el.frdItem
            };
            return this;
        },
        receive: function() {
            this._reset();
            this._receive();
        },
        readed: function() {
            this._reset();
        },
        _reset: function() {
            this._alertCount = 0;
            window.clearInterval(this._msgInt);
            this._msgInt = null;
            this._frdItem.css('opacity', 1);
            if (hasTinyBar) {
                this._tinyFrdItem.css('opacity', 1);
            }
            window.setTimeout(function() {
                if (!this._msgInt) document.title = this._docTitle;
            }.bind(this), 100);
            return this;
        },
        _receive: function() {
            var conf = sohu.im.CONFIG,
            el = this._els;
            this.addSessions([{
                id: this._fId,
                name: this._fId
            }]);
            this._frdItem = sohu.im.Friend.getItem(this._fId);
            if (hasTinyBar) {
                this._tinyFrdItem = sohu.im.Friend.getTinyItem(this._fId);
            }
            if (this._frdItem) this._setAlertTimer();
            return this;
        },
        addSessions: function(sessions) {
            var conf = sohu.im.CONFIG,
            el = this._els,
            grpItem = sohu.im.Group.getItem(conf.sessionGrp.id);
            for (var i = 0, len = sessions.length; i < len; i++) {
                var session = sessions[i],
                fId = session.id,
                frdItem = sohu.im.Friend.getItem(fId);
                if (frdItem) {
                    if (frdItem.up(el.grpItem).attr('id') != grpItem.attr('id')) {
                        this._addFrdToSessionGrp(this._copyFrdItem(fId));
                    } else {
                        return;
                    }
                } else {
                    this._addFrdToSessionGrp(sohu.im.Friend.buildItem(session));
                }
                if (hasTinyBar) {
                    this._addFrdToTinySessionGrp(sohu.im.Friend.buildTinyItem(session));
                }
            }
        },
        delSessions: function(sessions) {
            for (var i = 0, len = sessions.length; i < len; i++) {
                var fId = sessions[i].id;
                this._delFrdToSessionGrp(fId);
                if (hasTinyBar) {
                    this._delFrdToTinySessionGrp(fId);
                }
            }
        },
        _copyFrdItem: function(fId) {
            var conf = sohu.im.CONFIG,
            frdItem = sohu.im.Friend.getItem(fId);
            return sohu.im.Friend.copy(frdItem);
        },
        _addFrdToSessionGrp: function(frdItem) {
            var conf = sohu.im.CONFIG,
            grpItem = sohu.im.Group.getItem(conf.sessionGrp.id),
            frdList = grpItem.down(this._els.frdList),
            frdItems = frdList.children();
            frdItem.removeClass(sohu.im.STYLE.frdItemHover);
            if (!frdItems || frdItems.size() == 0) {
                frdList.append(frdItem);
                grpItem.show();
            } else {
                frdItems.get(0).before(frdItem);
            }
        },
        _addFrdToTinySessionGrp: function(frdItem) {
            var conf = sohu.im.CONFIG,
            el = this._els,
            frdList = $(el.tinyFrdList),
            frdItems = frdList.children();
            if (sohu.im.Friend.getTinyItem(frdItem.attr('name'))) {
                return false;
            }
            if (!frdItems || frdItems.size() == 0) {
                frdList.append(frdItem);
            } else {
                frdItems.get(0).before(frdItem);
            }
        },
        _delFrdToSessionGrp: function(fId) {
            var conf = sohu.im.CONFIG,
            el = sohu.im.ELEMENT,
            grpItem = sohu.im.Group.getItem(conf.sessionGrp.id),
            frdItems = grpItem.down(this._els.frdList).children();
            frdItem = sohu.im.Friend.getItem(fId);
            if (frdItem && frdItem.up(el.grpItem).attr('id') == grpItem.attr('id')) {
                frdItem.remove();
            }
            if (frdItems && frdItems.size() == 0) {
                grpItem.hide();
            }
        },
        _delFrdToTinySessionGrp: function(fId) {
            var frdItem = sohu.im.Friend.getTinyItem(fId);
            if (frdItem) {
                frdItem.remove();
            }
        },
        _setAlertTimer: function() {
            var conf = sohu.im.CONFIG,
            friendName = '';
            friendName = this._friend ? this._friend.name: this._fId;
            document.title = template(sohu.im.TEMPLATE.newMsgTip, {
                fName: friendName
            });
            this._msgInt = window.setInterval(this._alert.bind(this), conf.msgAlertTime);
        },
        _alert: function() {
            var conf = sohu.im.CONFIG,
            opacity = 0,
            docTitle = document.title;
            if (this._alertCount == conf.msgAlertcount) {
                this._reset();
            }
            if (this._alertCount % 2 == 0) {
                opacity = 1;
            } else {
                opacity = 0;
            }
            document.title = docTitle.substring(1, docTitle.length) + docTitle.substring(0, 1);
            this._frdItem.css('opacity', opacity);
            if (hasTinyBar) {
                this._tinyFrdItem.css('opacity', opacity);
            }
            this._alertCount += 1;
        }
    });
    sohu.im.Message.init = function(fId) {
        this.instance = new sohu.im.Message(fId);
        return this.instance;
    };
    sohu.im.Message.receive = function(fId) {
        if (sohu.BossCome && sohu.BossCome._isComing) return;
        if (!this.messages[fId]) {
            this.messages[fId] = new sohu.im.Message(fId);
        } else {
            this.messages[fId].receive(fId);
        }
        return this.messages[fId];
    };
    sohu.im.Message.addSessions = function(e) {
        if (this.instance) {
            return this.instance.addSessions(e);
        } else {
            sohu.im.Message.init(null).addSessions(e);
        }
    };
    sohu.im.Message.delSessions = function(e) {
        if (this.instance) {
            return this.instance.delSessions(e);
        } else {
            sohu.im.Message.init(null).delSessions(e);
        }
    };
    sohu.im.Message.read = function() {
        var conf = sohu.im.CONFIG,
        el = sohu.im.ELEMENT,
        pos = $(el.barPanel).pos(),
        step = 25;
        pos.left = pos.left - conf.chatWinWidth;
        for (message in this.messages) {
            sohu.im.Friend.talk({
                custom: true,
                left: pos.left,
                top: pos.top
            },
            message);
            pos.top += step;
            pos.left -= step;
        }
    };
    sohu.im.Message.readed = function(fId) {
        if (this.messages[fId]) {
            this.messages[fId].readed(fId);
            this.messages[fId] = null;
            $call('sohu.sa.cc(\'imbar_clicktoreceive\')', 'sohu.sa.*');
        }
    };
    sohu.im.Message.messages = {};
    sohu.im.Hotkey = {
        init: function() {
            $(document).on('keydown', this._dispense.bindEvent(this));
        },
        _dispense: function(e) {
            var keyCode = e.keyCode;
            if (keyCode == 88 && e.altKey) {
                sohu.im.Message.read();
                $call('sohu.sa.cc(\'imbar_altxtoreceive\')', 'sohu.sa.*');
            }
        }
    };
    sohu.im.Online = Class.create({
        initialize: function(friend) {
            this._initProperties(friend);
            this._initElements();
        },
        _initProperties: function(friend) {
            this._friend = friend;
            return this;
        },
        _initElements: function() {
            var el = sohu.im.ELEMENT;
            this._els = {
                onlineTipFull: $(el.onlineTipFull),
                onlineTipTiny: $(el.onlineTipTiny),
                grpItem: el.grpItem,
                frdList: el.frdList,
                frdItem: el.frdItem
            };
            return this;
        },
        change: function() {
            var conf = sohu.im.CONFIG,
            st = sohu.im.STATE
            oldState = this._friend.oldState,
            newState = this._friend.online,
            updateFrdCount = false;
            sohu.log('状态改变：' + oldState + '|' + newState);
            if (oldState == st.online.id || oldState == st.busy.id || oldState == st.away.id) {
                if (newState == st.offline.id) {
                    this._rmFromOnlineGrp();
                    updateFrdCount = true;
                } else {
                    this._moveFrdToIndex(conf.onlineGrp.id);
                }
                this._sortItInAllGrps();
            } else if (oldState == st.offline.id) {
                if (newState == st.online.id || newState == st.busy.id || newState == st.away.id) {
                    this._addToOnlineGrp();
                    this._alert();
                    updateFrdCount = true;
                }
                this._sortItInAllGrps();
            }
            this._setSessionGrpOnline(this._friend.id);
            if (updateFrdCount) {
                sohu.im.Group.updateOnlineCount([conf.onlineGrp], true);
            }
            return this;
        },
        _setSessionGrpOnline: function(fid) {
            if (fid) {
                var sessionGrpItem = sohu.im.Group.getItem(sohu.im.CONFIG.sessionGrp.id),
                sessionFrdItem = sessionGrpItem.down('li[data-fid=' + fid + ']');
                if (sessionFrdItem) {
                    this._setFrdState(sessionFrdItem);
                }
            }
        },
        _addToOnlineGrp: function() {
            this._moveFrdToIndex(sohu.im.CONFIG.onlineGrp.id);
        },
        _moveFrdToIndex: function(gId) {
            if (sohu.im.Group.expState[gId] != null) {
                var conf = sohu.im.CONFIG,
                el = this._els,
                fId = this._friend.id,
                grdItem = sohu.im.Group.getItem(gId),
                frdList = grdItem.down(el.frdList),
                frdItem = grdItem.down('li[data-fid=' + fId + ']'),
                index = ImMdl.getFriendIndex(fId, gId);
                if (!frdItem) {
                    frdItem = sohu.im.Friend.getItem(fId);
                    if (!frdItem) {
                        frdItem = sohu.im.Friend.buildItem({
                            id: fId
                        });
                    }
                    frdItem = sohu.im.Friend.copy(frdItem);
                }
                try {
                    frdItem.remove();
                } catch(e) {}
                var frdItems = frdList.children();
                if (frdItems && frdItems.get(index)) {
                    frdItems.get(index).before(frdItem);
                } else {
                    frdList.append(frdItem);
                }
                this._setFrdState(frdItem);
            }
        },
        _setFrdState: function(frdItem) {
            var st = sohu.im.STATE,
            sp = sohu.im.STYLE.statePrefix,
            frd = this._friend;
            frdItem.removeClass(sp + st[frd.oldState].style).addClass(sp + st[frd.online].style);
        },
        _rmFromOnlineGrp: function() {
            var conf = sohu.im.CONFIG,
            grdItem = sohu.im.Group.getItem(conf.onlineGrp.id),
            frdItem = grdItem.down('li[data-fid=' + this._friend.id + ']');
            if (frdItem) frdItem.remove();
        },
        _sortItInAllGrps: function() {
            var frdGrps = ImMdl.getUserGroups(this._friend.id);
            for (var i = 0, len = frdGrps.length; i < len; i++) {
                this._moveFrdToIndex(frdGrps[i].id);
                sohu.im.Group.updateOnlineCount([frdGrps[i]], true);
            }
        },
        _alert: function() {
            var conf = sohu.im.CONFIG,
            onlineTip = hasTinyBar ? this._els.onlineTipTiny: this._els.onlineTipFull;
            onlineTip.html(template(sohu.im.TEMPLATE.onlineTip, {
                fName: this._friend.name,
                fId: this._friend.id
            })).show();
            window.setTimeout(function() {
                kola.Anim(onlineTip).to('opacity', 0).ondone(function() {
                    onlineTip.css('opacity', 1);
                    onlineTip.hide();
                }).go();
            },
            3000);
        }
    });
    sohu.im.Online.init = function() {};
    sohu.im.Online.change = function(friend) {
        return new sohu.im.Online(friend).change();
    };
    sohu.im.Online.Setter = Class.create({
        initialize: function() {},
        build: function() {
            ImMdl.on(sohu.im.EVENT.myonlineload,
            function(e) {
                this._initElements();
                this._initMyOnline(e.data)
            }.bind(this));
            return this;
        },
        _initElements: function() {
            var el = sohu.im.ELEMENT;
            this._els = {
                myOnlineIcon: $(el.myOnlineIcon),
                myOnlineSetter: $(el.myOnlineSetter),
                myOnlinePanel: $(el.myOnlinePanel)
            };
        },
        _initMyOnline: function(online) {
            var el = this._els;
            this._changeSetter(online).data('online', online).show();
            if (el.myOnlineSetter) {
                el.myOnlineSetter.show();
                el.myOnlineSetter.on('click', this._setting.bindEvent(this));
                ImMdl.on(sohu.im.EVENT.myonlinechange,
                function(e) {
                    this._changeSetter(e.data);
                }.bind(this));
            }
        },
        _getOnlineConfig: function(online) {
            var state = sohu.im.STATE[online];
            sohu.log('init online state:' + online);
            if (!state) state = sohu.im.STATE['offline'];
            return {
                style: sohu.im.STYLE.myOnlinePrefix + state.style,
                name: state.name
            };
        },
        _changeSetter: function(online) {
            var conf = this._getOnlineConfig(online);
            return this._els.myOnlineIcon.attr('class', conf.style).html(conf.name);
        },
        _setting: function(e) {
            var el = kola.Event.element(e).upWithMe('[data-key]');
            kola.Event.stop(e);
            if (el) {
                var online = el.data('key');
                this._hide();
                this._changeSetter(online);
                this._saveMyOnline(online);
            } else {
                if (this._els.myOnlinePanel.css('display') == 'none') {
                    this._show();
                } else {
                    this._hide();
                }
            }
        },
        _hide: function() {
            this._els.myOnlinePanel.hide();
        },
        _show: function() {
            this._els.myOnlinePanel.show().out('click', this._hide.bind(this));
        },
        _saveMyOnline: function(online) {
            ImMdl.setMyOnline(online);
        }
    });
    sohu.im.Online.Setter.init = function() {
        return new sohu.im.Online.Setter().build();
    };
    sohu.im.UserCard = Class.create({
        initialize: function(gid) {
            this._initElements(gid);
            this._initEvents();
        },
        _initElements: function(gid) {
            var el = sohu.im.ELEMENT;
            this._els = {
                frdPanel: sohu.im.Group.getItem(gid),
                frdCard: $(el.frdCard),
                frdItem: el.frdItem,
                frdIcon: el.frdIcon
            };
        },
        _initEvents: function() {
            var el = this._els,
            frdIcons = el.frdPanel.down(el.frdIcon);
            if (frdIcons) {
                this.bindEvent(frdIcons);
            }
            el.frdCard.on('mouseover',
            function() {
                this._els.frdCard.show();
            }.bind(this));
            el.frdCard.on('mouseout',
            function() {
                this._els.frdCard.hide();
            }.bind(this));
        },
        bindEvent: function(frdIcons) {
            frdIcons.on('mouseover', this.show.bindEvent(this));
            frdIcons.on('mouseout', this.hide.bind(this));
        },
        show: function(e) {
            var st = sohu.im.STATE,
            conf = sohu.im.CONFIG,
            el = this._els,
            frdItem = kola.Event.element(e).upWithMe(el.frdItem),
            fid = frdItem.attr('data-fid'),
            frdPos = frdItem.pos(),
            f = isNaN(fid) ? {
                id: fid,
                name: fid,
                icon: conf.dftIcon
            }: ImMdl.getFriend(fid),
            frdInfos = null;
            if (!f.online) f.online = st[conf.onlineDft].id;
            if (!f.status) f.status = '';
            frdInfos = {
                state: st[f.online].style,
                top: frdPos.top,
                left: frdPos.left - conf.cardWidth,
                fId: f.id,
                fName: f.name,
                fIcon: f.icon,
                stateName: st[f.online].name,
                fStatus: f.status
            }
            el.frdCard.html(template(sohu.im.TEMPLATE.frdCard, frdInfos)).show();
        },
        hide: function() {
            this._els.frdCard.hide();
        }
    });
    sohu.im.UserCard.initList = function(gid) {
        this.instance = new sohu.im.UserCard(gid);
        return this.instance;
    };
    sohu.im.UserCard.initItem = function(frdItem) {
        if (this.instance) {
            var frdIcon = frdItem.down(sohu.im.ELEMENT.frdIcon);
            this.instance.bindEvent(frdIcon);
        }
    };
    sohu.im.Search = Class.create({
        initialize: function() {
            this._panel = $(sohu.im.ELEMENT.frdSlctCt);
            this._selector = this._create();
        },
        _create: function() {
            var selector = new sohu.friend.Selector({
                type: 1,
                element: this._panel,
                isButton: false,
                onFocus: function() {
                    this._panel.down('input[type=text]').val('');
                    this._panel.down('.j-default').hide();
                }.bind(this),
                onBlur: function() {
                    this._panel.down('.j-default').show();
                }.bind(this),
                beforeSelectView: this._select.bind(this)
            });
            selector.tipText = sohu.im.CONFIG.selectorTip;
            return selector;
        },
        _select: function(friend) {
            sohu.im.Friend.talk(this._panel.pos(), friend.id);
            this._selector.clear();
            return false;
        }
    });
    sohu.im.Search.init = function() {
        this.instance = new sohu.im.Search();
        return this.instance;
    };
    sohu.im.Setting = Class.create({
        initialize: function() {},
        buildOptions: function() {
            ChatMdl.on(sohu.im.EVENT.settingload,
            function() {
                this._initElements();
                this._initValues();
                this._initEvents();
            }.bind(this));
            return this;
        },
        _initElements: function() {
            var el = sohu.im.ELEMENT;
            this._els = {
                mgeBtn: $(el.mgeBtn),
                mgePanel: $(el.mgePanel),
                option: el.option
            };
            this._els.options = this._els.mgePanel.down(this._els.option);
            this._els.mgeBtn.show('');
        },
        _initEvents: function() {
            var el = this._els;
            el.mgeBtn.on('click', this._toggle.bind(this));
            el.options.on('click', this._save.bindEvent(this));
        },
        _initValues: function() {
            var values = ChatMdl.getSetting();
            this._els.options.each(function(it) {
                var name = it.attr('name');
                if (values[name]) it.attr('class', 'checked');
            });
        },
        _toggle: function() {
            var display = this._els.mgePanel.css('display');
            if (display == 'none') {
                this._show();
            } else {
                this._hide();
            }
        },
        _show: function() {
            this._els.mgePanel.show();
            this._els.mgeBtn.out('click', this._hide.bind(this));
        },
        _hide: function() {
            this._els.mgePanel.hide();
        },
        _save: function(e) {
            var conf = sohu.im.CONFIG,
            el = this._els,
            option = kola.Event.element(e).upWithMe(el.option),
            values = {};
            if (option.attr('class') == 'checked') {
                option.attr('class', '');
            } else {
                option.attr('class', 'checked');
            }
            el.options.each(function(it) {
                if (it.attr('class') == 'checked') {
                    values[it.attr('name')] = true;
                } else {
                    values[it.attr('name')] = false;
                }
            });
            ChatMdl.setSetting(values);
            this._toggle();
        }
    });
    sohu.im.Setting.init = function() {
        this.instance = new sohu.im.Setting().buildOptions();
        return this.instance;
    };
    sohu.im.CONFIG = {
        barMidRight: -135,
        minHeight: 800,
        minWidth: 1180,
        gidPrefix: 'im_group_',
        fidPrefix: 'im_friend_',
        tinyFidPrefix: 'tiny_im_friend_',
        onlineDft: 'offline',
        sessionGrp: {
            id: -2,
            name: '会话分组',
            specialCls: 'imGroupTitle-talk'
        },
        onlineGrp: {
            id: 0,
            name: '在线好友',
            specialCls: 'imGroupTitle-status'
        },
        selectorTip: '请输入好友姓名',
        loading: '正在加载...',
        cardWidth: 193,
        barWidth: 170,
        chatWinWidth: 385,
        chatWinHeight: 300,
        chatWinMinTop: 115,
        onlineTipWidth: 80,
        msgAlertTime: 250,
        msgAlertcount: 70,
        grpNameLength: 8,
        points: '...',
        dftIcon: PATH.img + 'avatars/48.gif',
        imGrpShow: 'imGrpShow_'
    };
    sohu.im.EVENT = {
        friendload: 'friendload',
        onlineload: 'onlineload',
        myonlineload: 'myonlineload',
        myonlinechange: 'myonlinechange',
        onlinechange: 'onlinechange',
        newmessage: 'newmessage',
        settingload: 'settingload',
        sessionadd: 'sessionadd',
        sessiondel: 'sessiondel',
        friendupdate: 'friendupdate',
        userupdate: 'userupdate'
    };
    sohu.im.STATE = {
        online: {
            id: 'online',
            name: '在线',
            style: 'available'
        },
        away: {
            id: 'away',
            name: '离开',
            style: 'idle'
        },
        busy: {
            id: 'busy',
            name: '忙碌',
            style: 'busy'
        },
        offline: {
            id: 'offline',
            name: '离线',
            style: 'offline'
        },
        invisible: {
            id: 'invisible',
            name: '隐身',
            style: 'offline'
        }
    };
    sohu.im.ELEMENT = {
        barPanel: '#imbar',
        barMid: '#imbarMid',
        schPanel: '#imSearch',
        frdPanel: '#imBuddys',
        mgrPanel: '#imActions',
        frdSlctCt: '#imFriendSelector',
        chatMgeBtn: '#imSetting',
        frdMgeBtn: '#imManage',
        frdCard: '#imPopWrap',
        onlineTipFull: '#imOnlineTip',
        onlineTipTiny: '#imTinybarOnlineTip',
        mgeBtn: '#imSetting',
        mgePanel: '#imSettingLayer',
        grpItem: 'div.imGroupItem',
        frdList: 'ul.imGroupContent',
        grpTitle: 'a.imGroupTitle',
        frdItem: 'li.buddyItem',
        frdIcon: 'div.buddyAvatar',
        option: 'li',
        tinybar: '#imTinybar',
        tinybarMid: '#imTinybarMid',
        tbarToggle: '#imTinybarToggle',
        tbarOnlineCount: '#imTinybarOnlineCount',
        tbarSessions: '#imTinybarTalkList',
        imbarStyle: '#imbarStyle',
        myOnlineIcon: '#online_myicon',
        myOnlineSetter: '#imSetStatus',
        myOnlinePanel: '#myOnlinePanel'
    };
    sohu.im.STYLE = {
        tiny: 'im-hide',
        show: 'im-show',
        full: 'im-full',
        high: 'im-tall',
        low: 'im-short',
        groupOn: 'imGroupItem-on',
        onlineGrpTitle: 'imStatusTitle',
        sessionGrpTitle: 'imStatusTitle',
        statePrefix: 'buddyItem-',
        frdItemHover: 'buddyItem-hover',
        myOnlinePrefix: 'imStatus im-'
    };
    sohu.im.TEMPLATE = {
        grpItem: '<div id="${gItemId}"class="imGroupItem">' + '<a href="javascript:void(0)" class="imGroupTitle ${specialCls}" title="${gFullName}" onmousedown="$call(\'sohu.sa.cc(\\\'imbar_group_onoff\\\')\', \'sohu.sa.*\');">${gName}<span class="meta"></span></a>' + '<ul class="imGroupContent imBuddyList"></ul>' + '</div>',
        frdItem: '<li id="${fItemId}" data-fid="${fId}" class="buddyItem buddyItem-${fOnline}" onclick="sohu.im.Friend.talk(event,\'${fId}\')" onmouseover="$(this).addClass(\'buddyItem-hover\')" onmouseout="$(this).removeClass(\'buddyItem-hover\')" onmousedown="$call(\'sohu.sa.cc(\\\'imbar_clicktochat\\\')\', \'sohu.sa.*\');">' + '<div class="buddyAvatar">' + '<a href="javascript:void(0)" title="${fName}"><img class="avatar-20" src="${fIcon}" alt="${fName}" />' + '<em></em>' + '</a>' + '</div>' + '<div class="buddyInfo">' + '<strong class="buddyName"><a href="javascript:void(0)" title="${fName}">${fName}</a></strong>' + '</div>' + '</li>',
        frdTinyItem: '<li id="${itemId}" data-fid="${fId}" onclick="sohu.im.Friend.talk(event,\'${fId}\')">' + '<img class="avatar-20" src="${fIcon}" title="${fName}"/>' + '</li>',
        frdCard: '<div class="imCard imCard-${state}" style="top:${top}px;left:${left}px;">' + '<div class="imCardAvatar">' + '<a href="javascript:void(0)" title="${fName}" onclick="sohu.im.Friend.talk(event,\'${fId}\')" onmousedown="$call(\'sohu.sa.cc(\\\'imbar_card_image\\\')\', \'sohu.sa.*\');">' + '<img class="avatar-48" src="${fIcon}" alt="${fName}" />' + '</a>' + '</div>' + '<div class="imCardInfo">' + '<strong class="imCardName"><a href="/profile.do?u=${fId}" title="${fName}" onmousedown="$call(\'sohu.sa.cc(\\\'imbar_card_name\\\')\', \'sohu.sa.*\');">${fName}</a></strong>' + '<span class="imCardImStatus">${stateName}</span>' + '<span class="imCardUserStatus">${fStatus}</span>' + '</div>' + '</div>',
        onlineTip: '<span style="cursor:pointer;" onclick="sohu.im.Friend.talk(event,\'${fId}\')" title="聊天" onmousedown="$call(\'sohu.sa.cc(\\\'imbar_onlinetip\\\')\', \'sohu.sa.*\');">${fName}来也！</span>',
        frdCount1: '<span>[${onlineCount}]</span>',
        frdCount2: '<span>[${allCount}]</span>',
        frdCount3: '<span>[${onlineCount}/${allCount}]</span>',
        newMsgTip: '【${fName}】来消息了...'
    };
},
'sohu.friend.Component,sohu.friend.FriendSelector,sohu.chat.*');
$register('sohu.friend.*',
function() {
    var PACK = sohu.friend;
    var friendMdl = new sohu.core.Model({
        actions: {
            stdList: {
                url: '/a/friend/relation/stdlist.do',
                method: 'get',
                format: 'json',
                type: 'custom'
            },
            fixInvite: {
                url: '/a/friend/relation/fixinvite.do',
                params: ['fid'],
                method: 'get',
                format: 'json',
                type: 'one'
            },
            invite: {
                url: '/a/friend/relation/invite.do',
                params: ['fid', 'gids', 'message', 'rw'],
                method: 'post',
                format: 'json',
                type: 'custom'
            },
            del: {
                url: '/a/friend/relation/del.do',
                params: ['fid'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            addGroup: {
                url: '/a/friend/group/add.do',
                params: ['name'],
                method: 'post',
                format: 'json',
                encode: 'uri',
                type: 'one'
            },
            updateGroup: {
                url: '/a/friend/group/update.do',
                params: ['id', 'name'],
                method: 'post',
                format: 'json',
                encode: 'uri',
                type: 'one'
            },
            delGroup: {
                url: '/a/friend/group/del.do',
                params: ['id'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            addMember: {
                url: '/a/friend/member/add.do',
                params: ['gid', 'fids'],
                method: 'post',
                format: 'json',
                type: 'one'
            },
            updateMember: {
                url: '/a/friend/member/update.do',
                params: ['gid', 'fids'],
                method: 'post',
                format: 'json',
                type: 'one'
            },
            resetMember: {
                url: '/a/friend/member/reset.do',
                params: ['fid', 'gids'],
                method: 'post',
                format: 'json',
                type: 'one'
            },
            delMember: {
                url: '/a/friend/member/del.do',
                params: ['fid', 'gid'],
                method: 'post',
                format: 'json',
                type: 'one'
            }
        },
        url: ''
    });
    Object.extend(friendMdl, {
        _delRepData: function(data) {
            this._buildHash();
            this._listData.group.each(function(group) {
                var i = group.users.index(data.id);
                if (i > -1 && i < group.users.length) {
                    group.users.splice(i, 1);
                    group.members.splice(i, 1);
                }
            });
            var id = 'h_' + data.id;
            var obj = this._listData.user._hash[id];
            this._listData.user.del(obj);
            delete this._listData.user._hash[id];
        },
        _addGroupRepData: function(data) {
            this._buildHash();
            if (!this._listData) return;
            var group = this._listData.group;
            group.push(data);
            group._hash['h_' + data.id] = data;
            data.users = [];
            data.members = [];
        },
        _updateGroupRepData: function(data) {
            this._buildHash();
            Object.extend(this._listData.group._hash['h_' + data.id], data);
        },
        _delGroupRepData: function(data) {
            this._buildHash();
            var gid = 'h_' + data.id,
            group = this._listData.group._hash[gid],
            unGroup = this._listData.group._hash['h_ungroup'];
            group.users.each(function(id) {
                var inGroups = this.getFriendGroups(id, 'id').join('');
                if (inGroups == data.id) {
                    unGroup.users.unshift(id);
                    unGroup.members.unshift(this._listData.user._hash['h_' + id]);
                }
            }.bind(this));
            this._listData.group.del(group);
            delete this._listData.group._hash[gid];
        },
        _addMemberRepData: function(data) {
            this._buildHash();
            var group = this._listData.group._hash['h_' + data.gid];
            data.uids.each(function(id) {
                group.users.unshift(id);
                group.members.unshift(this._listData.user._hash['h_' + id]);
            }.bind(this));
        },
        _updateMemberRepData: function(data) {
            this._buildHash();
            var newUsers = data.uids,
            group = this._listData.group._hash['h_' + data.gid],
            unGroup = this._listData.group._hash['h_ungroup']
            oldUsers = group.users.slice(0);
            newUsers.each(function(id) {
                var inGroups = this.getFriendGroups(id, 'id').join('');
                if (inGroups.length == 0) {
                    var index = unGroup.users.index(id);
                    unGroup.users.splice(index, 1);
                    unGroup.members.splice(index, 1);
                }
                if (!group.users.include(id)) {
                    group.users.unshift(id);
                    group.members.unshift(this._listData.user._hash['h_' + id]);
                }
            }.bind(this));
            oldUsers.each(function(id) {
                if (!newUsers.include(id)) {
                    var inGroups = this.getFriendGroups(id, 'id').join('');
                    if (inGroups == data.gid.toString()) {
                        unGroup.users.unshift(id);
                        unGroup.members.unshift(this._listData.user._hash['h_' + id]);
                    } else {
                        var index = group.users.index(id);
                        group.users.splice(index, 1);
                        group.members.splice(index, 1);
                    }
                }
            }.bind(this));
        },
        _delMemberRepData: function(data) {
            this._buildHash();
            var group = this._listData.group._hash['h_' + data.id];
            var i = group.users.index(data.fid);
            if (i >= -1 && i < group.users.length) {
                group.users.splice(i, 1);
                group.members.splice(i, 1);
            }
        },
        _resetMemberRepData: function(data) {
            this._buildHash();
            var inThis = {};
            if (data.gids.length == 0) {
                inThis['h_ungroup'] = true;
            } else {
                data.gids.each(function(now) {
                    inThis['h_' + now] = true;
                });
            }
            this._listData.group.each(function(group) {
                if (inThis['h_' + group.id]) {
                    var userId = data.fid;
                    if (!group.users.include(userId)) {
                        var user = this._listData.user._hash['h_' + userId];
                        group.users.unshift(userId);
                        group.members.unshift(user);
                    }
                } else {
                    var userId = data.fid,
                    index = group.users.index(userId);
                    if (index > -1 && index < group.users.length) {
                        group.users.splice(index, 1);
                        group.members.splice(index, 1);
                    }
                }
            }.bind(this));
            var group;
            if (! (group = this._listData.group._hash) || !(group = group['h_upgroup'])) return;
            var userId = parseInt(data.fid);
            if (data.gids.length == 0) {
                if (group.users && !group.users.include(userId)) {
                    var user = this._listData.user._hash['h_' + userId];
                    group.users.unshift(userId);
                    group.members.unshift(user);
                }
            } else {
                var index = group.users.index(userId);
                if (index >= -1 && index < group.users.length) {
                    group.users.splice(index, 1);
                    group.members.splice(index, 1);
                }
            }
        }
    });
    Object.extend(friendMdl, {
        groupList: function(data, options) {
            var success = this._groupListSuccess.bind(this, options);
            this._fullList(success, options.failure);
        },
        list: function(data, options) {
            var success = this._listSuccess.bind(this, data, options);
            this._fullList(success, options.failure);
        },
        friendList: function(data, options) {
            if (!this._listData) {
                this.stdList(null, options);
            } else {
                options.success.bind(this, this._listData).timeout(0);
            }
        },
        getGroup: function(id) {
            this._buildHash();
            return this._getGroupList()._hash['h_' + id];
        },
        getUser: function(id) {
            this._buildHash();
            return this._listData.user._hash['h_' + id];
        },
        getGroups: function() {
            return this._listData.group;
        },
        getFriendGroups: function(friendId, property) {
            var allGroups = this.getGroups(),
            frdGroups = [];
            allGroups.each(function(group) {
                if (group.id != 'ungroup') {
                    if (group.users.include(friendId)) {
                        if (typeof(property) == 'string' && group[property]) {
                            frdGroups.push(group[property]);
                        } else {
                            frdGroups.push(group);
                        }
                    }
                }
            });
            return frdGroups;
        },
        getFriendCount: function(groupId) {
            if (typeof(groupId) != 'undefined') {
                var group = this.getGroup(groupId);
                if (group && group.users) return group.users.length;
                else return 0;
            } else {
                return this._listData.user.length;
            }
        },
        hadFriends: function(groupId) {
            if (this._listData) {
                this._buildHash();
                var list = this._listData.group._hash['h_' + groupId].members;
                return list.length > 0;
            }
            return false;
        },
        _groupListSuccess: function(options) {
            options.success(this._getGroupList());
        },
        _listSuccess: function(param, options) {
            options.success(this._getList(param));
        },
        _getGroupList: function() {
            return this._listData.group;
        },
        _getList: function(param) {
            if (param.groupid) {
                this._buildHash();
                var list = this._listData.group._hash['h_' + param.groupid].members;
            } else {
                var list = this._listData.user;
            }
            if (!list) list = []
            var data = {
                start: param.start,
                size: param.size,
                count: list.length
            }
            if (param.start < list.length) {
                data.list = list.slice(param.start, Math.min(param.start + param.size, list.length));
            } else {
                data.list = []
            }
            return data;
        },
        _fullList: function(success, failure) {
            if (!this._listData) {
                this._callbacks.push({
                    success: success,
                    failure: failure
                });
                if (!this._hadRequestFull) {
                    this._hadRequestFull = true;
                    this.stdList(null, {
                        success: this._fullListSuccess.bind(this),
                        failure: this._fullListFailure.bind(this)
                    });
                }
            } else {
                success.timeout(0);
            }
        },
        _fullListSuccess: function(data) {
            if (data && data.group) {
                data.group[data.group.length - 1].id = 'ungroup';
            }
            this._listData = data;
            var callback = null;
            while (callback = this._callbacks.shift()) {
                callback.success();
            }
            $call(this._readyToSync.bind(this), 'sohu.friend.Service');
        },
        _fullListFailure: function(data) {
            this._listData = data;
            var callback = null;
            while (callback = this._callbacks.shift()) {
                callback.failure(data);
            }
        },
        _readyToSync: function() {
            this._syncDataHandler = this._syncData.bind(this);
            sohu.friend.Service.on('friendload', this._syncDataHandler);
        },
        _syncData: function() {
            sohu.friend.Service.un('friendload', this._syncDataHandler);
            this._syncDataHandler = null;
            var data = sohu.friend.Service.checkNum();
            if (data.groupNum != this._listData.group.length || data.friendNum != this._listData.user.length) {
                sohu.friend.Service.clearData();
            }
        },
        _buildHash: function() {
            if (!this._listDataHash) {
                if (!this._listData) return;
                this._listData.user._hash = {};
                this._listData.user.each(function(hash, it, i) {
                    hash['h_' + it.id] = it;
                }.bind(this, this._listData.user._hash));
                this._listData.group._hash = {};
                this._listData.group.each(function(group, groupNow, i) {
                    group._hash['h_' + groupNow.id] = groupNow;
                    groupNow.members = [];
                    groupNow.users.each(function(members, user, it2, i2) {
                        members.push(user._hash['h_' + it2]);
                    }.bind(this, groupNow.members, this._listData.user));
                }.bind(this, this._listData.group));
                this._listDataHash = true;
            }
        },
        _listData: null,
        _hadRequestFull: false,
        _callbacks: [],
        _listDataHash: false
    });
    PACK.friendMdl = friendMdl;
    PACK.FriendAddWgt = Class.create({
        initialize: function(userId, options) {
            this._options = Object.extend({
                success: null,
                onlyShow: false,
                sure: null
            },
            options || {});
            if (!this._options.onlyShow) this._initDialog();
            friendMdl.fixInvite({
                fid: userId
            },
            {
                success: this._fixInviteSuccess.bind(this),
                failure: this._fixInviteFailure.bind(this)
            });
        },
        _initDialog: function() {
            if (!this._dialog) {
                this._dialog = sohu.ctrl.Dialog.loading('请求加为好友', {
                    width: 420,
                    mask: true
                });
            }
        },
        _getAddGroupHtml: function(groups) {
            if (groups.length == 0) return '';
            var _this = this;
            return groups.collect(function(group) {
                return _this._buildGroupItem(group, false);
            }).join('');
        },
        _buildGroupItem: function(group, checked) {
            return '<li><label for="gids' + group.id + '"><input type="checkbox" ' + (checked ? ' checked="checked"': '') + ' value="' + group.id + '" id="gids' + group.id + '" name="gids" />' + group.name + '</label></li>';
        },
        _bindAddGroup: function(el) {
            var els = el.nextAll();
            var input = els.get(0),
            button = els.get(els.size() - 2).down('button'),
            cancelLink = els.get(els.size() - 1),
            addFunc = this._addGroup.bindEvent(this, input, button, el);
            button.on('click', addFunc);
            cancelLink.on('click',
            function() {
                els.remove();
                el.show('');
            });
            input.on('keyenter', addFunc).focus.bind(input).timeout(0);
        },
        _showInvite: function() {
            this._initDialog();
            var html = '',
            selects = '',
            groups = this._data.adminGroups;
            selects = this._getAddGroupHtml(groups);
            html = '<div class="dFriend dFriend-addFriend">' + '<p>此请求需经' + this._data.name + '验证，你们才能成为好友。</p>' + '<dl class="fieldset">' + '<dt><img src="' + this._data.icon + '" class="avatar-48" /></dt>' + '<dd><label for="message">验证信息</label><br />' + '<textarea name="message" class="text" cols="10" rows="5" style="width:200px;height:50px"></textarea>' + '</dd>' + '<dd>' + '<label>选择分组</label><br />' + '<div class="changeGroup">' + '<ul class="checkboxes">' + selects + '</ul>' + '<div class="addNewGroup">' + '<a class="act a-add" data-key="addgroup" href="javascript:void(0)">新建分组</a>' + '</div>' + '</div>' + '</dd>' + '</dl></div>';
            this._dialog.setContent(html).setButtons([{
                title: '发送',
                type: 'main',
                close: false,
                func: this._sureInvite.bind(this)
            },
            {
                title: '取消',
                close: true,
                type: 'cancel'
            }]);
            this._dialog.body.down('a[data-key=addgroup]').on('click', this._viewAddGroup.bindEvent(this));
            var el = this._dialog.body.down('textarea');
            el.focus.bind(el).timeout(0);
        },
        _viewAddGroup: function(e) {
            var el = kola.Event.element(e).upWithMe('a');
            if (this._data.adminGroups == 0) {
                el = el.parent();
            }
            el.hide().after('<input type="text" maxlength="10" class="text" style="width:100px;" />&nbsp;<span class="button button-main"><span><button type="button" title="确定">确定</button></span></span>&nbsp;&nbsp;<a href="javascript:void(0);">取消</a>');
            this._bindAddGroup(el);
            kola.Event.stop(e);
        },
        _addGroup: function(e, input, button, control) {
            kola.Event.stop(e);
            button.prop('disabled', true);
            var val = input.val().trim();
            if (val.length == 0) {
                input.val('');
                button.prop('disabled', false);
                return;
            }
            button.data('srctext', button.html()).html('操作中...');
            friendMdl.addGroup({
                name: val
            },
            {
                success: this._succAddGroup.bind(this, input, button, control),
                failure: this._failAddGroup.bind(this, input, button, control)
            });
        },
        _succAddGroup: function(input, button, control, data) {
            if (!this._dialog) return;
            var obj = {},
            id = data.id.toString();
            obj[id] = data.name;
            control.parent().prev().append(this._buildGroupItem(data, true));
            control.nextAll().remove();
            control.show('');
        },
        _failAddGroup: function(input, button, control, error) {
            if (!this._dialog) return;
            alert(sohu.config('error', error));
            control.nextAll().remove();
        },
        _sureInvite: function() {
            var messageEl = this._dialog.body.down('textarea');
            var message = messageEl.val();
            if (message.length > 200) {
                alert('验证信息不能超过200个字');
                messageEl.focus();
                return;
            }
            var selectEl = this._dialog.body.down('ul.checkboxes');
            var gids = kola.dom.Form.objFields(selectEl).gids;
            if (this._options.onlyShow) {
                var str = '{gids:"' + gids + '", message:"' + message.replace(/\\/mg, '\\\\').replace(/"/mg, '\\\"').replace(/\r/mg, '\\r').replace(/\n/mg, '\\n') + '"}';
                this._options.sure(str);
                if (this._dialog) this._dialog.close();
                return;
            }
            var data = {
                fid: this._data.id,
                gids: gids,
                message: message,
                rw: this._options.from
            }
            friendMdl.invite(data, {
                success: this._inviteSuccess.bind(this),
                failure: this._inviteFailure.bind(this)
            });
            this._dialog.loading();
        },
        _cancelInvite: function() {
            this._dialog.close();
        },
        _inviteSuccess: function(data) {
            if (typeof(this._options.success) == 'function') this._options.success();
            if (this._dialog) {
                this._dialog.notice('好友请求已发出，请耐心等待' + this._data.name + '的确认。', {
                    title: '发送成功'
                });
            }
        },
        _inviteFailure: function(error) {
            if (typeof(this._options.failure) == 'function') this._options.failure(error);
            if (this._dialog) {
                this._dialog.alert(sohu.config('error', error), {
                    title: '出错了'
                });
                this._dialog = null;
            }
        },
        _fixInviteSuccess: function(data) {
            this._data = data;
            this._showInvite();
        },
        _fixInviteFailure: function(error) {
            if (this._dialog) {
                if (error.status == 11) {
                    this._dialog.alert('<p>你已经发送过好友申请，他确认后就可以互为好友了。 </p>');
                } else {
                    this._dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
                this._dialog = null;
            }
            if (this._options.onlyShow) {
                if (this._options.sure) this._options.sure();
            } else {
                if (typeof(this._options.failure) == 'function') this._options.failure(error);
            }
        }
    });
    PACK.FriendAddWgt.add = function(id, options) {
        return new PACK.FriendAddWgt(id, options);
    }
    PACK.FriendAddWgt.onlyShow = function(id, callback) {
        return new PACK.FriendAddWgt(id, {
            onlyShow: true,
            sure: callback
        });
    }
},
'kola.dom.Select,sohu.core.*, sohu.ctrl.Dialog, sohu.friend.Service,kola.dom.Form');
$register('sohu.friend.FriendSelector',
function() {
    var Pack = sohu.friend;
    Pack.selectorTip = Class.create({
        initialize: function(options) {
            this.settings = {
                textEl: null,
                posto: null,
                tipWidth: 0,
                maxCount: 10,
                ExceptFriendID: [],
                defaultTip: '',
                maximTip: '',
                errTip: '没有找到匹配的好友',
                onFocus: function() {},
                onBlur: function() {},
                onSelect: function(value) {}
            };
            this.maximizing = false;
            Object.extend(this.settings, options);
            this.tips = new sohu.ctrl.SelectChangeTip({
                element: this.settings.textEl,
                posto: this.settings.posto,
                isAppend: true,
                position: [0, -1],
                width: this.settings.tipWidth,
                onFocus: function(v) {
                    this._setFocus(v);
                }.bind(this),
                onBlur: function() {
                    this._setBlur();
                }.bind(this),
                onChange: function(v) {
                    this._setChange(v);
                }.bind(this),
                onSelect: function(t, v) {
                    this._setSelect(t, v);
                }.bind(this),
                onBlank: function() {
                    if (this.maximizing) {
                        this._setTip(this.settings.maximTip);
                    } else {
                        this._setTip(this.settings.defaultTip);
                    }
                }.bind(this)
            });
        },
        setMax: function(bool) {
            if (this.maximizing != bool && !this.tips.tipSuggest._hide) {
                if (bool) {
                    this._setTip(this.settings.maximTip);
                } else {
                    this._setTip(this.settings.defaultTip);
                }
            }
            this.maximizing = bool;
        },
        _setFocus: function(v) {
            this.settings.onFocus();
            if (this.maximizing) {
                this._setTip(this.settings.maximTip);
            } else {
                if (v == '') {
                    this._setTip(this.settings.defaultTip);
                } else {
                    this._setChange(v);
                }
            }
        },
        _setBlur: function() {
            this.settings.onBlur();
        },
        _setTip: function(str) {
            this.tips.content(str);
        },
        _setChange: function(v) {
            this._setWidth(v);
            if (this.maximizing) {
                this._setTip(this.settings.maximTip);
                return;
            }
            this._setTip('');
            if (v == '') {
                this._setTip(this.settings.defaultTip);
                return;
            }
            var match = sohu.friend.Service.search(v);
            var flag = false;
            if (match.length > 0) {
                var _num = 0;
                match.each(function(i) {
                    if (!this.settings.ExceptFriendID.include(i.id.toString())) {
                        flag = true;
                        _num++;
                        this.tips.add(i.name.replace(v, '<em>' + v + '</em>'), i.id);
                        if (_num == this.settings.maxCount) {
                            throw $break;
                        }
                    }
                }.bind(this));
            }
            if (flag) this.tips.firstOn();
            else this._setTip(this.settings.errTip);
        },
        _setSelect: function(t, v) {
            this.tips.value = '';
            var value = {
                id: v,
                name: t
            };
            this.settings.onSelect(value);
        },
        _setWidth: function(v) {
            var len = v.byteLength();
            if (len > 8) len = 8;
            if (len < 2) len = 2;
            $(this.settings.textEl).width(len * 10);
        }
    });
    Pack.selectorToken = Class.create({
        initialize: function(options) {
            this.settings = {
                textEl: null,
                onDelete: function(arr) {}
            };
            Object.extend(this.settings, options);
            this.textEl = $(this.settings.textEl);
            this.boxEl = this.textEl.parent().parent();
            this._bind();
            this._bindKey();
        },
        getSelected: function() {
            var r = [],
            o = this.textEl.parent();
            var pa = o.prevAll();
            if (pa) pa.each(function(i) {
                var value = {};
                value.id = i.attr('friendid');
                value.name = i.attr('friendname');
                r.push(value);
            }.bind(this));
            return r;
        },
        addSelected: function(value) {
            var friend = {
                id: value.id.toString(),
                name: value.name
            };
            var selected = this.getSelected();
            if (!selected.include(friend)) {
                var str = '<li friendid="' + friend.id + '" friendname="' + friend.name + '">' + '<a href="javascript:void(0);"><span>' + friend.name + '<em class="x"></em></span></a>' + '</li>'
                this.textEl.parent().before(str);
            }
            this._bind();
        },
        delSelected: function(friendid) {
            var el = this.boxEl.down('li[friendid=' + friendid + ']');
            if (el) {
                el.remove();
            }
            this.settings.onDelete([friendid]);
        },
        clear: function() {
            var el = this.boxEl.down('li[friendid]');
            if (el) el.remove();
        },
        _bind: function() {
            this.tokenEl = this.textEl.parent().prevAll();
            if (this.tokenEl) {
                if (this._clickToken) {
                    this.tokenEl.down('a').un('click', this._clickToken);
                    this.tokenEl.down('a em').un('click', this._delToken);
                } else {
                    this._clickToken = function(e) {
                        var el = kola.Event.element(e).parent().parent();
                        if (el.attr('class')) {
                            if (el.attr("class") == 'on') {
                                el.attr("class", '');
                                return;
                            }
                        }
                        el.attr("class", 'on');
                    }.bind(this);
                    this._delToken = function(e) {
                        var el = kola.Event.element(e).parent().parent().parent();
                        this.delSelected(el.attr('friendid'));
                    }.bind(this);
                }
                this.tokenEl.down('a').on('click', this._clickToken.bindEvent(this));
                this.tokenEl.down('a em').on('click', this._delToken.bindEvent(this));
            }
        },
        _bindKey: function() {
            this.currentIsEmpty = false;
            this.textEl.on('keydown',
            function(e) {
                if (e.keyCode == 8) {
                    if (this.textEl.val() == '') {
                        this.currentIsEmpty = true;
                    } else {
                        this.currentIsEmpty = false;
                    }
                }
            }.bind(this));
            this.textEl.on('keyup',
            function(e) {
                if (e.keyCode == 8 && this.currentIsEmpty) {
                    var el = this.textEl.parent().prev();
                    if (el) {
                        var id = el.attr('friendid');
                        el.remove();
                        this.settings.onDelete([id]);
                    }
                }
            }.bind(this));
        }
    });
    Pack.selectorDialogList = Class.create({
        initialize: function(options) {
            this.settings = {
                type: 1,
                defaultType: 0,
                boxEl: null,
                addMe: false,
                ExceptFriendID: [],
                SelectedFriendID: [],
                noFriendText: '',
                onNoSelectAll: function() {},
                onChange: function() {},
                onClick: function() {},
                onSpanClick: function(el) {}
            };
            Object.extend(this.settings, options);
            this.boxEl = $(this.settings.boxEl);
            this.type = this.settings.defaultType;
            return this;
        },
        list: function(type) {
            this.type = type;
            this.hasSelectAll = true;
            this.hasFriends = true;
            var r = [];
            var friendlist = sohu.friend.Service.getFriends(type, this.settings.addMe ? true: false);
            if (friendlist.length > 0) {
                friendlist.each(function(i) {
                    var o = '';
                    if (!this.settings.ExceptFriendID.include(i.id.toString())) {
                        if (this.settings.SelectedFriendID.include(i.id.toString())) {
                            o = ' checked="checked"'
                        } else {
                            this.hasSelectAll = false;
                        }
                        if (this.settings.type == 1) {
                            r.push('<li><span><label for="multifriendSe_' + i.id + '">' + '<input type="radio" id="multifriendSe_' + i.id + '" friendid="' + i.id + '" friendname="' + i.name + '" name="fs_radio"' + o + '  />' + i.name + '' + '</label></li></span>');
                        } else {
                            r.push('<li><span><label for="multifriendSe_' + i.id + '">' + '<input type="checkbox" id="multifriendSe_' + i.id + '" friendid="' + i.id + '" friendname="' + i.name + '" name="fs_checkbox"' + o + ' />' + i.name + '' + '</label></span></li>');
                        }
                    }
                }.bind(this));
                var tmp = this.settings.type == 1 ? 'radios': 'checkboxes';
                this.boxEl.html('<ul class="' + tmp + '">' + r.join('') + '</ul>');
                this._bind();
            } else {
                this.hasFriends = false;
                this.boxEl.html('<div class="listEmpty">' + this.settings.noFriendText + '</div>');
            }
        },
        getValue: function() {
            var r = [];
            this.boxEl.down('input').each(function(el) {
                if (el.prop('checked')) {
                    var id = el.attr('friendid');
                    r.push(id);
                }
            });
            return r;
        },
        selectAll: function() {
            if (this.settings.type == 2) {
                var t = this.boxEl.down('input');
                if (t) t.each(function(el) {
                    el.prop('checked', 'checked');
                });
            }
        },
        cancelSelectAll: function() {
            if (this.settings.type == 2) {
                var t = this.boxEl.down('input');
                if (t) t.each(function(el) {
                    el.prop('checked', '');
                });
            }
        },
        clearSelected: function() {
            var t = this.boxEl.down('input');
            if (t) t.each(function(el) {
                el.prop('checked', '');
            });
            this.settings.SelectedFriendID = [];
        },
        disabled: function() {
            var t = this.boxEl.down('input');
            if (t) {
                t.each(function(el) {
                    if (!el.prop('checked')) {
                        el.prop('disabled', 'disabled');
                    }
                });
            }
        },
        undisabled: function() {
            var t = this.boxEl.down('input');
            if (t) {
                t.each(function(el) {
                    el.prop('disabled', '');
                });
            }
        },
        _bind: function() {
            this.boxEl.down('input').on('click',
            function(e) {
                var el = kola.Event.element(e);
                var isSelected = false;
                if (!el.prop('checked')) {
                    this.settings.onNoSelectAll();
                } else {
                    isSelected = true;
                }
                this.settings.onChange(el.attr('friendid'), isSelected);
                this.settings.onClick();
            }.bind(this));
            if (this.settings.type == 2) {
                this.boxEl.down('ul li span').on('click',
                function(e) {
                    var el = kola.Event.element(e).upWithMe('span');
                    this.settings.onSpanClick(el);
                }.bind(this));
            }
        }
    });
    Pack.selectorDialog = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                type: 1,
                canSelectAll: false,
                maxNum: 0,
                SelectedFriendID: [],
                ExceptFriendID: [],
                addMe: false,
                zindex: 200,
                width: 360,
                noFriendText: '',
                onSubmit: function(arr) {}
            };
            Object.extend(this.settings, options);
            this.element = $(this.settings.element);
            this.element.addClass('selector-toggle');
            this.element.prepend('<a class="toggle" href="javascript:void(0)"></a>');
            this._hasShow = false;
            var _popLayer = document.createElement('div');
            with(_popLayer.style) {
                display = 'none';
                zIndex = this.settings.zindex;
            }
            this.element.append(_popLayer);
            this.popLayer = $(_popLayer);
            this.popLayer.attr('class', 'popLayer slctrTgLayer');
            var str = "<iframe class='maskIframe'></iframe><div class='decor'></div>";
            str += "<div class='content'>";
            str += "<div class='head'><h4>";
            if (this.settings.type == 1) {
                str += '<span class="j-limitTxt">限选1人</span>';
            } else {
                if (this.settings.maxNum > 0) {
                    str += '<span class="j-limitTxt">限选' + this.settings.maxNum + '人</span>';
                }
            }
            if (this.settings.type == 2 && this.settings.canSelectAll) {
                str += '<label for="fs_dialog_selectall" style="display:none;"><input id="fs_dialog_selectall" type="checkbox" /> 全选</label>'
            }
            var group = sohu.friend.Service.getGroups(true);
            str += '</h4><div class="option"><select class="select">';
            str += '<option value="0">全部好友</option>';
            group.each(function(i) {
                str += '<option value="' + i.id + '">' + i.name + '</option>';
            });
            str += '</select></div></div><div class="body"></div>';
            if (this.settings.type != 1) {
                str += "<div class='foot'><input type='hidden' id='fs_dialog_values' />" + "<span class='button button-main'><span><button type='button'>确定</button></span></span></div>";
            }
            str += "</div>";
            this.popLayer.html(str);
            this.popLayerBody = this.popLayer.down('.body');
            this.popLayerSelectAll = $('#fs_dialog_selectall');
            this.popLayerSelect = this.popLayer.down('.option select');
            this.toggle = this.element.down('.toggle');
            this.value = this.settings.SelectedFriendID;
            this.canContinueSelect = true;
            this.selectorDialogList = new Pack.selectorDialogList({
                type: this.settings.type,
                boxEl: this.popLayerBody,
                ExceptFriendID: this.settings.ExceptFriendID,
                SelectedFriendID: this.settings.SelectedFriendID,
                addMe: this.settings.addMe,
                noFriendText: this.settings.noFriendText,
                onNoSelectAll: function() {
                    if (this.settings.type == 2 && this.settings.canSelectAll) this.popLayerSelectAll.prop('checked', '');
                }.bind(this),
                onChange: function(id, isSelected) {
                    this._changeValue(id, isSelected);
                }.bind(this),
                onClick: function() {
                    if (this.settings.type == 1) {
                        this._buttonOK();
                    }
                }.bind(this),
                onSpanClick: function(el) {
                    if (this.canContinueSelect == false) {
                        var _input = el.down('input');
                        if (_input.prop('disabled')) {
                            var o = this.popLayer.down('.j-limitTxt');
                            if (o) {
                                o.css('color', '#FF0000');
                                kola.Anim(o).to('marginLeft', -12).duration(100).checkpoint().to('marginLeft', 12).duration(200).checkpoint().to('marginLeft', 0).duration(200).ondone(function() {
                                    o.removeAttr('style');
                                }).go();
                            }
                        }
                    }
                }.bind(this)
            });
            this._bind();
        },
        show: function() {
            this.popLayer.show();
            this.popLayer.out('click', this._bindOutClick);
        },
        hide: function() {
            this.popLayer.hide();
            this.toggle.removeClass('toggle-on');
            this.popLayer.unout('click', this._bindOutClick);
        },
        getValue: function() {
            return this.value;
        },
        clearValue: function() {
            this.settings.SelectedFriendID = [];
            this.selectorDialogList.clearSelected();
        },
        _bind: function() {
            this._bindOutClick = function() {
                this.hide();
                this.toggle.attr('class', 'toggle');
            }.bind(this);
            this.toggle.on('click', this._toggleHandler.bindEvent(this));
            this.popLayerSelect.on('change', this._selectChange.bindEvent(this));
            if (this.settings.type == 2 && this.settings.canSelectAll) {
                if (this.popLayerSelectAll) this.popLayerSelectAll.on('click',
                function() {
                    if (parseInt(this.popLayerSelect.val()) < 1) return;
                    if (this.popLayerSelectAll.prop('checked')) {
                        this.selectorDialogList.selectAll();
                        var v = this.selectorDialogList.getValue();
                        v.each(function(i) {
                            this._changeValue(i, true);
                        }.bind(this));
                    } else {
                        this.selectorDialogList.cancelSelectAll();
                        var v = sohu.friend.Service.getFriends(this.selectorDialogList.type);
                        v.each(function(i) {
                            this._changeValue(i.id.toString(), false);
                        }.bind(this));
                    }
                }.bind(this));
            }
            if (this.settings.type != 1) this.popLayer.down(".foot .button").on('click', this._buttonOK.bindEvent(this));
        },
        _buttonOK: function() {
            this.hide();
            this.settings.onSubmit(this.value);
        },
        _hasShow: false,
        _toggleHandler: function(e) {
            kola.Event.stop(e);
            if (this.toggle.attr('class') == 'toggle') {
                this.toggle.attr('class', 'toggle toggle-on');
                this.show();
                this.selectorDialogList.list(this.selectorDialogList.type);
                this._checkMax();
            } else {
                this.toggle.attr('class', 'toggle');
                this.hide();
                return;
            }
        },
        _selectChange: function(e) {
            var type = this.popLayerSelect.val();
            this.selectorDialogList.list(type);
            if (this.settings.canSelectAll && this.popLayerSelectAll) {
                if (parseInt(type) > 0 && this.selectorDialogList.hasFriends) {
                    if (this.selectorDialogList.hasSelectAll) {
                        this.popLayerSelectAll.prop('checked', 'checked');
                    } else {
                        this.popLayerSelectAll.prop('checked', '');
                    }
                    this.popLayerSelectAll.parent().show();
                } else {
                    this.popLayerSelectAll.parent().hide();
                }
            }
            this._checkMax();
        },
        _changeValue: function(id, isSelected) {
            if (isSelected) {
                if (this.settings.type == 1) {
                    this.value = [id];
                } else {
                    if (!this.value.include(id)) {
                        this.value.push(id);
                    }
                    this._checkMax();
                }
            } else {
                if (this.value.include(id)) {
                    this.value.del(id);
                }
                this._checkMax(true);
            }
        },
        _checkMax: function(isDel) {
            if (this.settings.maxNum == 0) return;
            if (isDel) {
                if (this.value.length < this.settings.maxNum) {
                    this.selectorDialogList.undisabled();
                    this.canContinueSelect = true;
                } else {
                    this.canContinueSelect = false;
                }
            } else {
                if (this.value.length == this.settings.maxNum) {
                    this.selectorDialogList.disabled();
                    this.canContinueSelect = false;
                } else {
                    this.canContinueSelect = true;
                }
            }
        },
        _freshValue: function(v) {
            this.settings.SelectedFriendID = v;
            this.selectorDialogList.settings.SelectedFriendID = v;
            this.value = v;
        }
    });
    sohu.friend.Selector = Class.create({
        initialize: function(options) {
            this.settings = {
                element: null,
                type: 1,
                canSelectAll: false,
                isButton: true,
                except: [],
                complete: null,
                maxNum: 0,
                zindex: 200,
                tipWidth: 200,
                addMe: false,
                onAdd: function(friend) {},
                onDel: function(friend) {},
                onFocus: null,
                onBlur: null,
                beforeSelectView: null,
                defaultValue: [],
                tipText: '请输入好友姓名(支持拼音首字母)',
                noFriendText: '该分组暂无好友',
                maximText: '，你可以删除某人后再添加'
            };
            Object.extend(this.settings, options);
            this.tipText = this.settings.tipText;
            this.maximTip = '限选' + this.settings.maxNum + '人' + this.settings.maximText;
            this.noFriendText = this.settings.noFriendText;
            this.element = $(this.settings.element);
            this.textEl = this.element.down('input[type=text]');
            this.valueEl = this.element.down('input[type=hidden]');
            var tmp = this.valueEl.val();
            if (tmp.length > 0) {
                tmp.split(',').each(function(it) {
                    this.settings.defaultValue.push(it);
                }.bind(this));
            }
            this.value = '';
            this._bind();
            return this;
        },
        _init: function() {
            this.element.down('.tokenList').on('click',
            function(e) {
                var el = kola.Event.element(e);
                if (el.down('li') || el.hasClass('j-default')) {
                    this.textEl.show();
                    this.textEl.focus();
                }
            }.bind(this));
            this.textEl.hide();
            this.textEl.on('blur',
            function() {
                this.textEl.hide();
                this.tip.tips.text = "";
            }.bind(this));
        },
        _bind: function() {
            this._bindFriendLoad = function() {
                sohu.friend.Service.un('friendload', this._bindFriendLoad);
                this.tip = new Pack.selectorTip({
                    textEl: this.textEl,
                    posto: this.element,
                    tipWidth: this.settings.tipWidth,
                    maxCount: 10,
                    ExceptFriendID: this.settings.except,
                    defaultTip: this.tipText,
                    maximTip: this.maximTip,
                    onFocus: function() {
                        this._focus();
                        if (this.settings.onFocus) this.settings.onFocus();
                    }.bind(this),
                    onBlur: function() {
                        this._blur();
                        if (this.settings.onBlur) this.settings.onBlur();
                    }.bind(this),
                    onSelect: function(value) {
                        this._select(value);
                    }.bind(this)
                });
                this._init();
                this.selectToken = new Pack.selectorToken({
                    textEl: this.textEl,
                    onDelete: function(arr) {
                        arr.each(function(it) {
                            this.del(it, 'token');
                            this.settings.onDel(sohu.friend.Service.getUser(it));
                        }.bind(this));
                    }.bind(this)
                });
                if (this.settings.isButton) {
                    this.selectDialog = new Pack.selectorDialog({
                        element: this.element,
                        type: this.settings.type,
                        canSelectAll: this.settings.canSelectAll,
                        maxNum: this.settings.maxNum,
                        FriendList: this.data,
                        zindex: this.settings.zindex,
                        SelectedFriendID: this.settings.defaultValue,
                        ExceptFriendID: this.settings.except,
                        addMe: this.settings.addMe,
                        noFriendText: this.noFriendText,
                        onSubmit: function(arr) {
                            this._dialogSubmit(arr);
                        }.bind(this)
                    });
                }
                this._setDefaultValue();
            }.bind(this);
            sohu.friend.Service.on('friendload', this._bindFriendLoad);
        },
        _setDefaultValue: function() {
            if (this.settings.defaultValue.length > 0) {
                this.setValue(this.settings.defaultValue.join(','));
            }
        },
        _focus: function() {
            if (this.selectDialog) {
                this.selectDialog.hide();
            }
        },
        _blur: function() {
            this.textEl.val('');
        },
        _select: function(value) {
            this.tip.tips.value = '';
            if (this.settings.type == 1) {
                this.valueEl.val(value.id);
                if (this._call_beforeSelectView(sohu.friend.Service.getUser(value.id))) {
                    this.textEl.val('');
                    this.selectToken.clear();
                    this.selectToken.addSelected(value);
                }
                this._checkMax();
            } else {
                this.textEl.val('');
                var v = this.getValue();
                if (v == '') {
                    this.valueEl.val(value.id);
                } else {
                    this.valueEl.val(v + ',' + value.id);
                }
                this._checkMax();
                if (this._call_beforeSelectView(sohu.friend.Service.getUser(value.id))) {
                    this.selectToken.addSelected(value);
                }
                this.settings.onAdd(sohu.friend.Service.getUser(value.id));
            }
            this._freshValue();
            this._complete();
        },
        _dialogSubmit: function(arr) {
            this.setValue(arr.join(','));
            this._complete();
        },
        _complete: function() {
            if (typeof(this.settings.complete) == 'function') {
                this.settings.complete(this.getSelectedFriends());
            }
        },
        _freshValue: function() {
            var v = this.getValue();
            v = v.split(',');
            this.tip.settings.ExceptFriendID = v;
            if (this.selectDialog) this.selectDialog._freshValue(v);
        },
        _call_beforeSelectView: function(friend) {
            if (typeof(this.settings.beforeSelectView) == 'function') {
                var v = this.settings.beforeSelectView(sohu.friend.Service.getUser(friend.id) || friend);
                if (typeof(v) == 'boolean' && !v) return false;
            }
            return true;
        },
        _checkMax: function() {
            if (this.settings.maxNum > 0) {
                if (this.getValue().split(',').length >= this.settings.maxNum) {
                    this.tip.setMax(true);
                } else {
                    this.tip.setMax(false);
                }
            }
        },
        getValue: function() {
            var v = this.valueEl.val().trim().replace(/,{2,}/g, ',').replace(/^,|,$/g, '').split(',').unique().join(',');
            this.valueEl.val(v);
            return v;
        },
        setValue: function(ids) {
            ids = ids.split(',');
            this.selectToken.clear();
            if (this.settings.type == 1) {
                this.tip.tips.setChange(false);
                this.valueEl.val(ids[0]);
                var friend = sohu.friend.Service.getUser(ids[0]);
                if (this._call_beforeSelectView(friend)) {
                    this.selectToken.addSelected(friend);
                    this.textEl.val('');
                }
                this._checkMax();
                this.tip.tips.setChange(true);
            } else {
                var _oldvalue = this.valueEl.val().split(',');
                this.valueEl.val('');
                ids.each(function(it) {
                    if (false) {
                        throw $break;
                    } else {
                        var friend = sohu.friend.Service.getUser(it);
                        if (friend) {
                            if (typeof(this.settings.beforeSelectView) == 'function') {
                                if (!_oldvalue.include(friend.id.toString())) {
                                    if (this._call_beforeSelectView(friend)) {
                                        this.selectToken.addSelected(friend);
                                    }
                                }
                            } else {
                                this.selectToken.addSelected(friend);
                            }
                            var v = this.valueEl.val();
                            this.valueEl.val(v != '' ? v + ',' + friend.id: friend.id);
                            this._checkMax();
                        }
                    }
                }.bind(this));
            }
            this._freshValue();
        },
        clear: function() {
            this.valueEl.val('');
            this.textEl.val('');
            if (this.selectDialog) this.selectDialog.clearValue();
            if (this.selectToken) this.selectToken.clear();
            this._checkMax();
            this._freshValue();
            this._complete();
        },
        del: function(id, from) {
            id = id.toString();
            var arr = this.getValue().split(',');
            if (arr.length == 0 || !arr.include(id)) return;
            this.valueEl.val(arr.del(id).join(','));
            if (from != 'token') this.selectToken.delSelected(id);
            this._checkMax();
            this._freshValue();
            this._complete();
        },
        getSelectedFriends: function() {
            return this.getValue().split(',').collect(function(id) {
                var f = sohu.friend.Service.getUser(id);
                if (f) return f;
            }.bind(this));
        },
        getFriendById: function(id) {
            if (this.data) return sohu.friend.Service.getUser(id);
            else return false;
        },
        getGroupById: function(id) {
            if (this.data) return sohu.friend.Service.getGroups(id.toString());
            else return false;
        }
    });
},
'sohu.ctrl.Dialog, sohu.ctrl.TipSuggest, sohu.friend.Service, kola.anim.*');
$register('sohu.friend.Component',
function() {
    sohu.friend.Component = {
        init: function() {
            if (this._hadInit) return;
            this._hadInit = true;
            this._friendLoad = false;
            this._onlineLoad = false;
            this._initService();
        },
        _initService: function() {
            this._e_friendLoadHandler = this._e_friendLoad.bind(this);
            sohu.friend.Service.on('friendload', this._e_friendLoadHandler);
            sohu.friend.Service.on('userupdate', this._e_userUpdate.bind(this));
            sohu.friend.Service.on('friendupdate', this._e_friendUpdate.bind(this));
            this._e_onlineLoadHandler = this._e_onlineLoad.bind(this);
            sohu.online.Service.on('onlineload', this._e_onlineLoadHandler);
            sohu.online.Service.on('onuserload', this._e_onuserload.bind(this));
            sohu.online.Service.on('onfriendupdate', this._e_onfriendChange.bind(this));
            sohu.online.Service.on('onuserupdate', this._e_onuserChange.bind(this));
        },
        _e_friendLoad: function(e) {
            sohu.friend.Service.un('friendload', this._e_friendLoadHandler);
            this._e_friendLoadHandler = null;
            this._friendLoad = true;
            this.fire('friendload');
        },
        _e_userUpdate: function(e) {
            this.fire('userupdate', e);
        },
        _e_friendUpdate: function(e) {
            this.fire('friendupdate');
        },
        _e_onlineLoad: function(e) {
            sohu.online.Service.un('onlineload', this._e_onlineLoadHandler);
            this._e_onlineLoadHandler = null;
            this._onlineLoad = true;
            this.fire('onlineload');
        },
        _e_onuserload: function(e) {
            var d = e.data;
            if (d == 'idle') d = 'away';
            if (d == 'invisible') d = 'offline';
            this.fire('myonlineload', {
                data: d
            });
        },
        _e_onfriendChange: function(e) {
            var d = e.data;
            if (d.oldState == 'idle') d.oldState = 'away';
            if (d.oldState == 'invisible') d.oldState = 'offline';
            if (d.online == 'idle') d.online = 'away';
            if (d.online == 'invisible') d.online = 'offline';
            var user = sohu.friend.Service.getUser(d.id);
            Object.extend(user, d);
            this.fire('onlinechange', {
                data: user
            });
        },
        _e_onuserChange: function(e) {
            var d = e.data;
            if (d == 'idle') d = 'away';
            if (d == 'invisible') d = 'offline';
            this.fire('myonlinechange', {
                data: d
            });
        },
        setMyOnline: function(s) {
            sohu.online.Service.setMyOnline(s);
        },
        getGroups: function(hadUnGroups) {
            return sohu.friend.Service.getGroups(hadUnGroups);
        },
        getFriends: function(groupId) {
            var onlineSrv = sohu.online.Service,
            friendSrv = sohu.friend.Service;
            if (typeof groupId == 'undefined' || groupId == 0) {
                var o = onlineSrv.getUserByKey(['online', 'busy', 'away', 'idle']);
                var re = [];
                for (var i = 0, il = o.length; i < il; i++) {
                    var it = o[i];
                    var u = friendSrv.getUser(it);
                    if (!u) continue;
                    var s = onlineSrv.getOnline(it);
                    if (s == 'online') {
                        u.online = 'online';
                    }
                    if (s == 'busy') {
                        u.online = 'busy';
                    }
                    if (s == 'away' || s == 'idle') {
                        u.online = 'away';
                    }
                    re.push(u);
                }
                return re;
            } else {
                var users = sohu.friend.Service.getFriends(groupId);
                var D = {
                    online: [],
                    busy: [],
                    away: [],
                    offline: []
                };
                for (var i = 0, il = users.length; i < il; i++) {
                    var u = users[i];
                    var s = onlineSrv.getOnline(u.id);
                    if (s == 'online') {
                        u.online = 'online';
                        D.online.push(u);
                    }
                    if (s == 'busy') {
                        u.online = 'busy';
                        D.busy.push(u);
                    }
                    if (s == 'away' || s == 'idle') {
                        u.online = 'away';
                        D.away.push(u);
                    }
                    if (s == 'invisible' || s == 'offline') {
                        u.online = 'offline';
                        D.offline.push(u);
                    }
                }
                return [].concat(D.online, D.busy, D.away, D.offline);
            }
        },
        getOnlineCount: function(groupId) {
            var onlineSrv = sohu.online.Service,
            friendSrv = sohu.friend.Service;
            var re = [];
            if (typeof groupId == 'undefined' || groupId == 0) {
                re = onlineSrv.getUserByKey(['online', 'busy', 'away', 'idle']);
                return [re.length, 0];
            } else {
                var users = sohu.friend.Service.getFriends(groupId);
                for (var i = 0, il = users.length; i < il; i++) {
                    var onlineNow = onlineSrv.getOnline(users[i].id);
                    if (['online', 'busy', 'away', 'idle'].include(onlineNow)) {
                        re.push(users[i]);
                    }
                }
                return [re.length, users.length];
            }
        },
        getFriend: function(userId) {
            var user = sohu.friend.Service.getUser(userId);
            return this._fillUser(user);
        },
        getUserGroups: function(uid) {
            return sohu.friend.Service.getUserGroups(uid);
        },
        getFriendIndex: function(uid, groupId) {
            groupId = groupId.toString();
            if (groupId == '0') {
                var ids = sohu.online.Service.getUserByKey(['online', 'busy', 'away', 'idle']);
                return ids.index(uid.toString());
            }
            var users = this.getFriends(groupId);
            uid = uid.toString();
            for (var i = 0, il = users.length; i < il; i++) {
                if (users[i].id.toString() == uid) return i;
            }
            return - 1;
        },
        _fillUser: function(user) {
            if (this._onlineLoad) {
                var s = sohu.online.Service.getOnline(user.id);
                if (s == 'idle') s = 'away';
                if (s == 'invisible') s = 'offline';
                user.online = s;
            }
            return user;
        }
    };
    kola.Event.initEventObserver(sohu.friend.Component, {
        afterOn: {
            'friendload': function() {
                if (!this._hadInit) {
                    this.init();
                }
                if (this._friendLoad) {
                    this.fire('friendload');
                }
            }.bind(sohu.friend.Component),
            'onlineload': function() {
                if (!this._hadInit) {
                    this.init();
                }
                if (this._onlineLoad) {
                    this.fire('onlineload');
                }
            }.bind(sohu.friend.Component)
        }
    });
},
'sohu.friend.Service, sohu.online.*');
$register('sohu.chat.*',
function() {
    var PACK = sohu.chat;
    PACK.Service = {
        init: function() {
            if (this._hadInit) return;
            this._hadInit = true;
            this._imLoad = false;
            this._isFriendReady = false;
            this._messages = {};
            this._sessions = [];
            this._user = {};
            this._onlineAlert = true;
            this._messageSound = true;
            this._hadSetting = false;
            sohu.sohuim.init();
            this._e_friendLoadHandler = this._e_friendLoad.bind(this);
            sohu.friend.Service.on('friendload', this._e_friendLoadHandler);
        },
        chat: function(userId, options) {
            if (!this._isFriendReady || !this._imLoad) {
                this._showNotReady();
                return false;
            }
            options = options || {};
            var passport = userId,
            ppLink = null,
            name = options.name || passport,
            tag = passport;
            if (!isNaN(userId)) {
                var user = sohu.friend.Service.getUser(userId);
                if (user) {
                    passport = user.pp;
                    name = user.name;
                    ppLink = 'http://' + PATH.domain + '/profile.do?u=' + userId;
                    tag = userId;
                } else {
                    return false;
                }
            }
            this._addSession([tag]);
            webim.api.chat(passport, name, 'sohu/sns', null, (options.pos && options.pos.left) || null, (options.pos && options.pos.top) || null, ppLink);
            if (this._messages[tag]) {
                webim.api.chat_msg(this._messages[tag]);
                this._messages[tag] = null;
            }
        },
        getSetting: function() {
            return {
                onlineAlert: this._onlineAlert,
                messageSound: this._messageSound
            };
        },
        setSetting: function(data) {
            this._onlineAlert = data.onlineAlert;
            this._messageSound = data.messageSound;
            webim.api.set_profile({
                setting: {
                    newmsg_no_sound: !this._messageSound,
                    online_no_risen: !this._onlineAlert
                }
            },
            function(ok) {});
            return this;
        },
        _e_friendLoad: function() {
            sohu.friend.Service.un('friendload', this._e_friendLoadHandler);
            this._e_friendLoadHandler = null;
            this._isFriendReady = true;
            window._im_message = this._e_newmessage.bind(this);
            sohu.sohuim.on('load',
            function() {
                this._imLoad = true;
                webim.api.get_profile(this._getImProfile.bind(this));
                cr.evt.Register('webim.window', 'show', this._im_show.bind(this));
                cr.evt.Register('webim.window', 'minimize', this._im_mini.bind(this));
                cr.evt.Register('webim.window', 'close', this._im_close.bind(this));
                cr.evt.Register('webim.sync', 'window', this._im_sync.bind(this));
            }.bind(this));
        },
        _showNotReady: function() {
            $call(function() {
                sohu.ctrl.Dialog.alert('正在为您准备消息系统，请稍后重试');
            },
            'sohu.ctrl.Dialog');
        },
        _getPassport: function(userId) {
            var u = sohu.friend.Service.getUser(userId);
            if (u && u.pp) {
                return u.pp;
            }
        },
        _getUserId: function(pp) {
            return sohu.friend.Service.getUserIdByPassport(pp);
        },
        _getImProfile: function(data) {
            this._onlineAlert = !data.setting.online_no_risen;
            this._messageSound = !data.setting.newmsg_no_sound;
            this._hadSetting = true;
            this._fireSettingLoad();
        },
        _fireSettingLoad: function() {
            PACK.Service.fire('settingload', {
                data: {
                    onlineAlert: this._onlineAlert,
                    messageSound: this._messageSound
                }
            });
        },
        _on_newMessage: function() {
            if (!this._hadInit) {
                this.init();
            }
        },
        _on_settingload: function() {
            if (!this._hadInit) {
                this.init();
            }
            if (this._hadSetting) {
                this._fireSettingLoad();
            }
        },
        _getData: function(userId) {
            if (!isNaN(userId)) {
                return sohu.friend.Service.getUser(userId);
            } else {
                return this._user[userId] || {
                    id: userId,
                    name: userId
                };
            }
        },
        _addSession: function(pps) {
            var deals = [];
            for (var i = 0, il = pps.length; i < il; i++) {
                var pp = pps[i];
                if (this._sessions[pp]) continue;
                var data = this._getData(pp);
                this._sessions[pp] = data;
                this._sessions.push(data);
                deals.push(data);
            }
            if (deals.length > 0) {
                this.fire('sessionadd', {
                    data: deals
                });
            }
        },
        _delSession: function(pps) {
            var deals = [];
            for (var i = 0, il = pps.length; i < il; i++) {
                var pp = pps[i];
                if (!this._sessions[pp]) continue;
                var data = this._sessions[pp];
                this._sessions.del(data);
                this._sessions[pp] = null;
                deals.push(data);
            }
            if (deals.length > 0) {
                this.fire('sessiondel', {
                    data: deals
                });
            }
        },
        _showSession: function(pp) {
            if (!this._sessions[pp]) {
                var data = this._getData(pp);
                this._sessions[pp] = data;
                this._sessions.push(data);
            }
            this._sessions[pp].win = 'show';
        },
        _hideSession: function(pp) {
            if (!this._sessions[pp]) {
                var data = this._getData(pp);
                this._sessions[pp] = data;
                this._sessions.push(data);
            }
            this._sessions[pp].win = 'mini';
        },
        _getSession: function(pp) {
            return this._sessions[pp] || null;
        },
        _e_newmessage: function() {
            var data = arguments[2];
            this._messages = {};
            var addSessions = [],
            newMessages = [];
            data.each(function(message) {
                if (message.type != 'chat' || message.from == message.to) return;
                var passport = message.from;
                var userId = sohu.friend.Service.getUserIdByPassport(passport);
                var tag = userId;
                if (!userId) {
                    tag = passport;
                    this._user[passport] = {
                        id: passport,
                        name: message.nick || passport
                    };
                }
                var session = this._getSession(tag),
                win = session && session.win ? session.win: 'close';
                if (win == 'show') {
                    webim.api.chat_msg([message]);
                    return;
                } else {
                    if (!this._messages[tag]) {
                        this._messages[tag] = [];
                    }
                    this._messages[tag].push(message);
                }
                if (!message.unread) return;
                if (win == 'close') {
                    addSessions.push(tag);
                }
                newMessages.push(tag);
            }.bind(this));
            addSessions.unique();
            newMessages.unique();
            if (addSessions.length > 0) {
                this._addSession(addSessions);
            }
            if (newMessages.length > 0) {
                newMessages.each(function(talker) {
                    this.fire('newmessage', {
                        data: talker
                    });
                }.bind(this));
            }
            return 'break';
        },
        _im_show: function() {
            var data = arguments[2];
            if (data.type != 'chat') return;
            this._showSession(this._getUserId(data.uid) || data.uid);
        },
        _im_mini: function() {
            var data = arguments[2];
            if (data.type != 'chat') return;
            this._hideSession(this._getUserId(data.uid) || data.uid);
        },
        _im_close: function() {
            var data = arguments[2];
            if (data.type != 'chat') return;
            this._delSession([this._getUserId(data.uid) || data.uid]);
        },
        _im_sync: function() {
            var data = arguments[2];
            var addSessions = [],
            delSessions = [];
            Object.each(data.w,
            function(user) {
                var userId = this._getUserId(user.u);
                if (!userId) {
                    userId = user.u;
                    this._user[userId] = {
                        id: userId,
                        name: userId
                    };
                }
                if (user.s == 'c') {
                    if (!this._messages[userId]) delSessions.push(userId);
                } else {
                    addSessions.push(userId);
                }
            }.bind(this));
            if (delSessions.length > 0) {
                this._delSession(delSessions);
            }
            if (addSessions.length > 0) {
                this._addSession(addSessions);
            }
        }
    }
    kola.Event.initEventObserver(PACK.Service, {
        afterOn: {
            'newmessage': PACK.Service._on_newMessage.bind(PACK.Service),
            'settingload': PACK.Service._on_settingload.bind(PACK.Service)
        },
        once: {
            'settingload': true
        }
    });
},
'sohu.sohuim.*, sohu.friend.Service');
$register('sohu.friend.Service',
function() {
    var me = {
        icon: 'http://www.sohu.com',
        id: sohu.user.id || 0,
        name: '自己',
        phonic: 'ziji'
    };
    var PACK = sohu.friend.Service = {
        getGroups: function(bool) {
            var data = PACK._Data._friendData;
            var r = [];
            PACK._Data._friendDataSort.each(function(it) {
                r.push(data[it.toString()]);
            });
            if (!bool && r.length > 0) {
                r.splice(r.length - 1, 1);
            }
            return r;
        },
        getFriends: function(groupid, addMe) {
            var data = PACK._Data;
            if (groupid == undefined || groupid.toString() == '0') {
                var r = [];
                if (addMe) {
                    r.push(me);
                }
                PACK._Data._userDataSort.each(function(it) {
                    r.push(data._userData[it.toString()]);
                });
                return r;
            } else {
                var r = [];
                data._friendData[groupid.toString()].users.each(function(it) {
                    r.push(data._userData[it.toString()]);
                });
                return r;
            }
        },
        getFriendsCount: function(groupid) {
            var data = PACK._Data;
            return data._friendData[groupid.toString()].users.length;
        },
        getFriendSort: function() {
            return PACK._Data._friendDataSort.slice(0);
        },
        getUserIds: function() {
            return PACK._Data._userDataSort.slice(0);
        },
        search: function(key) {
            var data = PACK._Data._userData;
            var r = [];
            var _matching = function(u, s) {
                var re = false;
                if (u.name.indexOf(key) > -1) {
                    re = true;
                } else {
                    key = key.toLowerCase();
                    var _t = u.phonic.replace(' ', '');
                    if (_t.indexOf(key) > -1) {
                        re = true;
                    } else {
                        var _tt = u.phonic.split(' ');
                        var _temp = '';
                        for (var i = 0; i < _tt.length; i++) {
                            _temp += _tt[i].charAt(0);
                        }
                        if (_temp.indexOf(key) > -1) {
                            re = true;
                        }
                    }
                }
                return re;
            };
            for (var i in data) {
                var user = data[i];
                if (_matching(user, key)) {
                    r.push(user);
                }
            }
            return r;
        },
        getUser: function(userid) {
            var data = PACK._Data._userData;
            if (userid.toString() == me.id.toString()) return me;
            else return data[userid.toString()];
        },
        getUserGroups: function(userid) {
            var data = PACK._Data._friendData;
            var r = [];
            for (var i in data) {
                var users = data[i].users;
                if (users.include(parseInt(userid))) {
                    r.push(data[i]);
                }
            }
            return r;
        },
        getUserIdByPassport: function(pp) {
            var data = PACK._Data._userData;
            var r = false;
            for (var i in data) {
                if (data[i].pp == pp) {
                    r = data[i];
                    break;
                }
            }
            if (r) {
                return r.id;
            } else {
                return 0;
            }
        },
        checkNum: function() {
            var r = {};
            r.groupNum = PACK._Data._friendDataSort.length;
            r.friendNum = PACK._Data._userDataSort.length;
            return r;
        },
        clearData: function() {
            sohu.xcache.del('fs_friends_' + me.id);
            sohu.xcache.del('fs_users_' + me.id);
            sohu.xcache.del('fs_friendsort_' + me.id);
            sohu.xcache.del('fs_usersort_' + me.id);
        }
    };
    var friendMdl = new sohu.core.Model({
        actions: {
            stdList: {
                url: '/a/friend/relation/stdlist.do',
                method: 'get',
                format: 'json',
                type: 'custom'
            }
        },
        url: ''
    });
    var comet = {
        init: function() {
            sohu.channel.on('friend, user',
            function(e) {
                if (e.type == 'friend') {
                    this.onFriendUpdate(e.data);
                }
                if (e.type == 'user') {
                    this.onUserUpdate(e.data);
                }
            }.bind(this));
        },
        onFriendUpdate: function(data) {
            PACK._Data._refresh();
        },
        onUserUpdate: function(data) {
            var a = data.split('|');
            if (a.length != 4) return;
            var userid = a[0],
            icon = a[1].replace(/\$/g, '/'),
            name = a[2],
            phoinc = a[3];
            if (icon == 'null') icon = null;
            PACK._Data._userData[userid].icon = icon;
            PACK._Data._userData[userid].name = name;
            PACK._Data._userData[userid].phonic = phoinc;
            PACK._Event.onUserUpdate({
                id: parseInt(userid),
                icon: icon,
                name: name,
                phonic: phoinc
            });
        }
    };
    PACK._Data = {
        _userData: {},
        _friendData: {},
        _userDataSort: [],
        _friendDataSort: [],
        _hasRequest: false,
        _handleOK: false,
        _handleData: function(data) {
            this._friendData = {};
            this._userData = {};
            this._userDataSort = [];
            this._friendDataSort = [];
            data.group.each(function(it) {
                this._friendData[it.id.toString()] = it;
                this._friendDataSort.push(parseInt(it.id));
            }.bind(this));
            data.user.each(function(it) {
                this._userData[it.id.toString()] = it;
                this._userDataSort.push(parseInt(it.id));
            }.bind(this));
            sohu.xcache.set('fs_friends_' + me.id, this._friendData, 60);
            sohu.xcache.set('fs_users_' + me.id, this._userData, 60);
            sohu.xcache.set('fs_friendsort_' + me.id, this._friendDataSort, 60);
            sohu.xcache.set('fs_usersort_' + me.id, this._userDataSort, 60);
            this._handleOK = true;
        },
        _requestData: function(callback) {
            if (this._hasRequest) return;
            this._hasRequest = true;
            sohu.xcache.get('fs_friends_' + me.id,
            function(xfriend) {
                var xuser = sohu.xcache.get('fs_users_' + me.id);
                var xfriendsort = sohu.xcache.get('fs_friendsort_' + me.id);
                var xusersort = sohu.xcache.get('fs_usersort_' + me.id);
                if (xfriend && xuser && xfriendsort && xusersort) {
                    this._friendData = xfriend;
                    this._userData = xuser;
                    this._userDataSort = xusersort;
                    this._friendDataSort = xfriendsort;
                    this._handleOK = true;
                    PACK._Event.onFriendLoad();
                    comet.init();
                    if (callback) callback();
                } else {
                    friendMdl.stdList({},
                    {
                        success: function(data) {
                            this._handleData(data);
                            PACK._Event.onFriendLoad();
                            comet.init();
                            if (callback) callback();
                        }.bind(this),
                        failure: function() {}
                    });
                }
            }.bind(this));
        },
        _refresh: function() {
            friendMdl.stdList({},
            {
                success: function(data) {
                    this._handleData(data);
                    PACK._Event.onFriendUpdate();
                }.bind(this),
                failure: function() {}
            });
        }
    };
    PACK._Event = {
        init: function() {
            kola.Event.initEventObserver(PACK, {
                afterOn: {
                    'friendload': this.onFriendLoad.bind(this)
                }
            });
        },
        onFriendLoad: function() {
            if (PACK._Data._handleOK) {
                PACK.fire('friendload');
            } else {
                PACK._Data._requestData();
            }
        },
        onFriendUpdate: function() {
            PACK.fire('friendupdate');
        },
        onUserUpdate: function(user) {
            PACK.fire('userupdate', {
                data: user
            });
        }
    };
    PACK._Event.init();
},
'sohu.channel.*, sohu.xcache.*');
$register('sohu.online.*',
function() {
    var Cookie = {
        name: 'st_flag',
        set: function(key, val) {
            if (key == 'myFocusTime') {
                kola.Cookie.set('st_focus', val, '', '/', PATH.domain);
                return;
            }
            var v = kola.Cookie.get(this.name);
            var r, r1 = '0',
            r2 = '0',
            r3 = '0';
            if (v && v.length == 3) {
                var t = v.split('');
                r1 = t[0];
                r2 = t[1];
                r3 = t[2];
            }
            switch (key) {
            case 'myStatus':
                r = val + r2 + r3;
                break;
            case 'myFocus':
                r = r1 + val + r3;
                break;
            case 'myIdle':
                r = r1 + r2 + val;
                break;
            }
            kola.Cookie.set(this.name, r, '', '/', PATH.domain);
        },
        get: function(key) {
            if (key == 'myFocusTime') {
                return kola.Cookie.get('st_focus');
            }
            var v = kola.Cookie.get(this.name);
            var r1 = '0',
            r2 = '0',
            r3 = '0';
            if (v && v.length == 3) {
                var t = v.split('');
                r1 = t[0];
                r2 = t[1];
                r3 = t[2];
            } else {
                kola.Cookie.set(this.name, '000', '', '/', PATH.domain);
            }
            switch (key) {
            case 'myStatus':
                return r1;
            case 'myFocus':
                return r2;
            case 'myIdle':
                return r3;
            }
            return '0';
        },
        del: function() {
            kola.Cookie.remove(this.name);
        }
    };
    function idle(idleFun, comingFun) {
        this.LastEventTime = 0;
        this.TrigIntervalTime = 3 * 60 * 1000;
        this.TrigContinueTime = 1 * 60 * 1000;
        this.TrigWaitingTime = 3 * 60 * 1000;
        this.FocusIntervalTime = 2 * 1000;
        this.FocusContinueTime = 5 * 60 * 1000;
        this.TrigBeginTs = 0;
        this.TrigEndTs = 0;
        this.FocusBeginTs = 0;
        this.isListening = false;
        this.isListeningFocus = false;
        this.isWaitComing = false;
        this.idleFun = idleFun;
        this.comingFun = comingFun;
        this.isFocus = true;
        this.isOnline = false;
        this.isIdle = false;
        this.pFocus = function() {
            if (!this.isFocus) {
                this.isFocus = true;
                Cookie.set('myFocus', '1');
                Cookie.set('myFocusTime', new Date().getTime().toString());
                if (this.isListeningFocus) this.unCheckFocus();
                if (this.isOnline && !this.isListening) {
                    this.begin();
                }
            }
        }.bind(this);
        this.pBlur = function() {
            if (this.isFocus) {
                if (this.isListening) this.shutDown();
                this.isFocus = false;
                Cookie.set('myFocus', '0');
                if (this.isOnline && !this.isListeningFocus) {
                    this.checkFocus();
                }
            }
        }.bind(this);
        $(window).on('focus', this.pFocus);
        $(window).on('blur', this.pBlur);
        $(document).on('focus', this.pFocus);
        $(document).on('blur', this.pBlur);
    };
    idle.prototype.myStatus = function(sid) {
        if (sid == '1') {
            this.isOnline = true;
            if (!this.isListening) this.begin();
        } else {
            this.isOnline = false;
            if (this.isListening) this.shutDown();
        }
    };
    idle.prototype.checkFocus = function() {
        if (this.isIdle) return;
        this.isListeningFocus = true;
        if (!this.listenFocusFun) {
            this.listenFocusFun = function() {
                this.unCheckFocus();
                var sFocus = Cookie.get('myFocus') == '1';
                if (!sFocus) {
                    this.waitFocus();
                } else {
                    this.checkFocus();
                }
            }.bind(this);
        }
        if (this.listenFocusInv) {
            clearTimeout(this.listenFocusInv);
        }
        this.listenFocusInv = setTimeout(this.listenFocusFun, this.FocusIntervalTime);
    };
    idle.prototype.unCheckFocus = function() {
        if (this.isIdle) return;
        this.isListeningFocus = false;
        if (this.listenFocusInv) {
            clearTimeout(this.listenFocusInv);
        }
    };
    idle.prototype.waitFocus = function() {
        this.FocusBeginTs = new Date().getTime();
        if (!this.listenWaitFocusFun) {
            this.listenWaitFocusFun = function() {
                var lastFocusTime = parseInt(Cookie.get('myFocusTime'));
                this.unWaitFocus()
                if (lastFocusTime > this.FocusBeginTs) {
                    this.checkFocus();
                } else {
                    this.setIdle(true);
                }
            }.bind(this);
        }
        if (this.listenWaitFocusInv) {
            clearTimeout(this.listenWaitFocusInv);
        }
        this.listenWaitFocusInv = setTimeout(this.listenWaitFocusFun, this.FocusContinueTime);
    };
    idle.prototype.unWaitFocus = function() {
        if (this.listenWaitFocusInv) {
            clearTimeout(this.listenWaitFocusInv);
        }
    };
    idle.prototype.begin = function() {
        if (this.isWaitComing) return;
        this.isListening = true;
        if (this.listening) {
            clearTimeout(this.listening);
        }
        if (!this.listeningFun) {
            this.listeningFun = function() {
                this.end();
                this.trigBegin();
            }.bind(this);
        }
        this.listening = setTimeout(this.listeningFun, this.TrigIntervalTime);
    };
    idle.prototype.end = function() {
        if (this.listening) {
            clearTimeout(this.listening);
        }
    };
    idle.prototype.shutDown = function() {
        this.isListening = false;
        if (this.trig) {
            clearTimeout(this.trig);
        }
        if (this.listening) {
            clearTimeout(this.listening);
        }
        if (this.trigWait) {
            clearTimeout(this.trigWait);
        }
        if (this.listenFocusInv) {
            clearTimeout(this.listenFocusInv);
        }
        if (this.listenWaitFocusInv) {
            clearTimeout(this.listenWaitFocusInv);
        }
    };
    idle.prototype.trigBegin = function() {
        this.TrigBeginTs = new Date().getTime();
        this.TrigEndTs = this.TrigBeginTs + this.TrigContinueTime;
        this.eventBegin();
        if (this.trig) {
            clearTimeout(this.trig);
        }
        if (!this.trigFun) {
            this.trigFun = function() {
                if (this.LastEventTime > this.TrigBeginTs) {
                    this.trigEnd(true);
                } else {
                    this.trigEnd(false);
                }
            }.bind(this);
        }
        this.trig = setTimeout(this.trigFun, this.TrigContinueTime);
    };
    idle.prototype.trigEnd = function(hasAction) {
        if (this.trig) {
            clearTimeout(this.trig);
        }
        if (hasAction) {
            this.begin();
        } else {
            this.trigWaitingBegin();
        }
    };
    idle.prototype.trigWaitingBegin = function() {
        if (this.trigWait) {
            clearTimeout(this.trigWait);
        }
        if (!this.trigWaitFun) {
            this.trigWaitFun = function() {
                if (this.LastEventTime > this.TrigEndTs) {
                    this.trigWaitingEnd(true);
                } else {
                    this.trigWaitingEnd(false);
                }
            }.bind(this);
        }
        this.eventBegin(this.trigWaitFun);
        this.trigWait = setTimeout(this.trigWaitFun, this.TrigWaitingTime);
    };
    idle.prototype.trigWaitingEnd = function(hasAction) {
        if (this.trigWait) {
            clearTimeout(this.trigWait);
        }
        if (hasAction) {
            this.begin();
        } else {
            this.setIdle(true);
        }
    };
    idle.prototype.eventBegin = function(callback) {
        if (!this._eventListen) this._eventListen = function() {
            this.LastEventTime = new Date().getTime();
            this.eventEnd();
            if (callback) callback();
        }.bind(this);
        $(document).on('mousemove', this._eventListen);
        $(document).on('keydown', this._eventListen);
    };
    idle.prototype.eventEnd = function() {
        if (this._eventListen) {
            $(document).un('mousemove', this._eventListen);
            $(document).un('keydown', this._eventListen);
        }
    };
    idle.prototype.setIdle = function(isPost) {
        this.isWaitComing = true;
        this.isIdle = true;
        if (!this._waitComingFun) {
            this._waitComingFun = function() {
                $(document).un('mousemove', this._waitComingFun);
                this.setComing();
            }.bind(this);
        }
        $(document).on('mousemove', this._waitComingFun);
        if (isPost) this.idleFun();
    };
    idle.prototype.setComing = function() {
        this.isWaitComing = false;
        this.isIdle = false;
        this.comingFun();
    };
    var PACK = sohu.online;
    var FriendSrv = sohu.friend.Service;
    var ME = sohu.user.id;
    var Model = new sohu.core.Model({
        actions: {
            getStatus: {
                url: '/getstatus.do',
                params: ['ids'],
                method: 'post',
                format: 'json'
            },
            myEdit: {
                url: '/myedit.do',
                params: ['status'],
                method: 'post',
                format: 'json'
            }
        },
        url: '/a/online/info'
    });
    var StatusType = ['offline', 'online', 'busy', 'away', 'invisible', 'idle'];
    PACK.Service = {
        getUserByKey: function(key) {
            if (typeof key == 'string') {
                return PACK._Data._Status[key] || [];
            } else {
                var re = [];
                key.each(function(it) {
                    re = re.concat(this.getUserByKey(it));
                }.bind(this));
                return re;
            }
        },
        getOnline: function(id) {
            return PACK._Data._Status[id + ''] || 'offline';
        },
        setMyOnline: function(st) {
            var cur = PACK._Data._myStatus;
            if (cur != st) {
                PACK._Data._myStatus = st;
                var sid = StatusType.index(st) + '';
                Cookie.set('myStatus', sid);
                PACK.Idle.myStatus(sid);
                Model.myEdit({
                    status: sid
                },
                {
                    success: function() {},
                    failure: function() {}
                });
            }
        }
    };
    PACK.Idle = new idle(function() {
        PACK.Service.setMyOnline('idle');
        Cookie.set('myIdle', '1');
        PACK._Event.onUserUpdate();
    },
    function() {
        Cookie.set('myIdle', '0');
        PACK.Service.setMyOnline('online');
        PACK._Event.onUserUpdate();
    });
    var Comet = {
        init: function() {
            sohu.channel.on('online',
            function(e) {
                if (e.type == 'online') {
                    this.onFriendUpdate(e.data);
                }
            }.bind(this));
        },
        onFriendUpdate: function(data) {
            var a = data.split(',');
            var id = parseInt(a[0]);
            var sid = parseInt(a[1]);
            var oldstatusid = PACK._Data._friendStatus[id + ''];
            if (oldstatusid != sid + '') {
                PACK._Data._changeStatus(id, sid);
                PACK._Event.onFriendUpdate({
                    id: id,
                    oldState: StatusType[parseInt(oldstatusid)],
                    online: StatusType[sid]
                });
            }
        }
    };
    var Polling = {
        init: function() {
            var fun = function() {
                var sessionS = Cookie.get('myStatus');
                var pageS = StatusType.index(PACK._Data._myStatus) + '';
                if (sessionS != pageS) {
                    if (sessionS == '5') {
                        PACK.Idle.shutDown();
                        if (!PACK.Idle.isWaitComing) {
                            PACK.Idle.setIdle(false);
                        }
                    }
                    PACK._Data._myStatus = StatusType[parseInt(sessionS)];
                    PACK.Idle.myStatus(sessionS);
                    PACK._Event.onUserUpdate();
                }
            }.bind(this);
            var interval = setInterval(fun, 1000);
        }
    };
    PACK._Data = {
        _handleOK: false,
        _hasRequest: false,
        _myStatus: 'online',
        _friendStatus: {},
        _Status: {},
        _handlerData: function() {
            var re = {};
            Object.each(this._friendStatus,
            function(val, key) {
                if (key != ME + '') {
                    var type = StatusType[parseInt(val)];
                    re[key] = type;
                    if (typeof re[type] == 'undefined') {
                        re[type] = [key];
                    } else {
                        re[type].push(key);
                    }
                }
            });
            this._Status = re;
            this._handleOK = true;
            PACK._Event.onLoad();
            PACK._Event.onUserLoad();
            Comet.init();
            Polling.init();
            PACK.Idle.myStatus(StatusType.index(this._myStatus) + '');
        },
        _requestData: function() {
            if (this._hasRequest) return;
            this._hasRequest = true;
            sohu.xcache.get('st_status_' + ME,
            function(sfriend) {
                var myStatus = Cookie.get('myStatus');
                if (sfriend && myStatus) {
                    this._friendStatus = sfriend;
                    this._myStatus = StatusType[parseInt(myStatus)] || 'online';
                    this._handlerData();
                } else {
                    sohu.friend.Service.on('friendload',
                    function() {
                        var friends = sohu.friend.Service.getUserIds();
                        friends.push(ME);
                        Model.getStatus({
                            ids: friends.join(',')
                        },
                        {
                            success: function(data) {
                                this._friendStatus = data;
                                sohu.xcache.set('st_status_' + ME, this._friendStatus, 60);
                                myStatus = this._friendStatus[ME + ''];
                                this._myStatus = StatusType[parseInt(myStatus)];
                                Cookie.set('myStatus', myStatus);
                                this._handlerData();
                            }.bind(this),
                            failure: function() {}
                        });
                    }.bind(this));
                }
            }.bind(this));
        },
        _refresh: function() {
            var friends = sohu.friend.Service.getUserIds();
            friends.push(ME);
            Model.getStatus({
                ids: friends.join(',')
            },
            {
                success: function(data) {
                    this._friendStatus = data;
                    sohu.xcache.set('st_status_' + ME, this._friendStatus, 60);
                    myStatus = this._friendStatus[ME + ''];
                    this._myStatus = StatusType[parseInt(myStatus)];
                    Cookie.set('myStatus', myStatus);
                    this._handlerData();
                }.bind(this),
                failure: function() {}
            });
        },
        _changeStatus: function(id, sid) {
            this._friendStatus[id + ''] = sid + '';
            var re = {};
            Object.each(this._friendStatus,
            function(val, key) {
                if (key != ME + '') {
                    var type = StatusType[parseInt(val)];
                    re[key] = type;
                    if (typeof re[type] == 'undefined') {
                        re[type] = [key];
                    } else {
                        re[type].push(key);
                    }
                }
            });
            this._Status = re;
            sohu.xcache.set('st_status_' + ME, this._friendStatus, 60);
        }
    };
    PACK._Event = {
        init: function() {
            kola.Event.initEventObserver(PACK.Service, {
                afterOn: {
                    'onlineload': this.onLoad.bind(this),
                    'onuserload': this.onUserLoad.bind(this)
                },
                once: {
                    'onlineload': true,
                    'onuserload': true
                }
            });
            sohu.friend.Service.on('friendupdate', PACK._Data._refresh);
        },
        onLoad: function() {
            if (PACK._Data._handleOK) {
                PACK.Service.fire('onlineload');
            } else {
                PACK._Data._requestData();
            }
        },
        onUserLoad: function() {
            if (PACK._Data._handleOK) {
                PACK.Service.fire('onuserload', {
                    data: PACK._Data._myStatus
                });
            } else {
                PACK._Data._requestData();
            }
        },
        onFriendUpdate: function(data) {
            PACK.Service.fire('onfriendupdate', {
                data: data
            });
        },
        onUserUpdate: function() {
            PACK.Service.fire('onuserupdate', {
                data: PACK._Data._myStatus
            });
        }
    };
    PACK._Event.init();
},
'sohu.core.*, sohu.xcache.*, sohu.friend.Service,sohu.channel.*');
$register('sohu.status.Service',
function() {
    var statusMdl = new sohu.core.Model({
        actions: {
            statusList: {
                url: '/a/status/info/friends.do',
                method: 'get',
                format: 'json',
                type: 'custom'
            }
        },
        url: ''
    });
    var comet = {
        init: function() {
            sohu.channel.on('status',
            function(e) {
                this.onStatusChange(e.data);
            }.bind(this));
        },
        onStatusChange: function(data) {
            PACK._Event.onStatusChange(data.id, data.status);
        }
    }
    var PACK = sohu.status.Service = {
        getStatus: function(arr) {
            var data = PACK._Data._cacheData;
            var r = [];
            if (!arr) {
                r = data;
            } else {
                arr.each(function(it) {
                    if (data[it]) r.push(data[it]);
                });
            }
            return r;
        }
    };
    PACK._Data = {
        _cacheData: null,
        _hasRequest: false,
        _requestData: function(callback) {
            if (this._hasRequest) return;
            this._hasRequest = true;
            statusMdl.statusList({},
            {
                success: function(data) {
                    this._cacheData = data;
                    PACK._Event.onStatusLoad();
                    comet.init();
                    if (callback) callback();
                }.bind(this),
                failure: function() {}
            });
        }
    };
    PACK._Event = {
        init: function() {
            kola.Event.initEventObserver(PACK, {
                afterOn: {
                    'statusload': this.onStatusLoad.bind(this)
                }
            });
        },
        onStatusLoad: function() {},
        onStatusChange: function(userid, status) {
            PACK.fire('statuschange', {
                id: userid,
                status: status
            });
        }
    };
    PACK._Event.init();
},
'sohu.core.*, sohu.channel.*');
$register('sohu.sohuim.*',
function() {
    var PACK = sohu.sohuim;
    PACK.init = function() {
        if (hadInit) return;
        hadInit = true;
        webim_config = {
            product: "sohu/sns",
            sync: true,
            loading_tip: "none",
            css_enable: false,
            ex_css: PATH.cssCell + 'im/style.css',
            esc_key: false,
            auto_focus: true,
            preInit: function() {
                cr.evt.Register("webim.loader", "ready", onLoad);
                cr.evt.Register('webim.response', 'message',
                function() {
                    return window._im_message ? window._im_message.apply(window, arguments) : 'break';
                });
                cr.evt.Register('webim.response', 'presence',
                function() {
                    return window._im_presence ? window._im_presence.apply(window, arguments) : 'break';
                });
                cr.evt.Register('webim.risen', 'auth',
                function() {
                    $call('sohu.user.valid();', 'sohu.core.*');
                    return 'break';
                });
            }
        }
        var a = document.createElement('script');
        a.type = 'text/javascript';
        a.charset = 'gbk';
        a.src = 'http://images.sohu.com/cs/sohuim/xiaozt/version/2.0/js/loader.sohu.js';
        document.getElementsByTagName("head")[0].appendChild(a);
    };
    var hadInit = false,
    hadLoad = false,
    onLoad = function() {
        if (!hadLoad) {
            hadLoad = true;
            PACK.fire('load');
        }
    };
    kola.Event.initEventObserver(PACK, {
        afterOn: {
            'load': function() {
                if (!hadInit) {
                    PACK.init();
                }
                if (hadLoad) {
                    PACK.fire('load');
                }
            }
        },
        once: {
            'load': true
        }
    });
});
$register('sohu.xcache.*',
function() {
    var PACK = sohu.xcache;
    var _flashid = 'xcache';
    var _flashDom = '#j_xcache_Dom';
    var temp = {
        _bind: function() {
            var str = '<object id="xcache_ob" name="player" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' + ' width="1" height="1" align="middle">' + '<param name="allowScriptAccess" value="always" />' + '<param name="movie" value="' + PATH.d1 + PATH.flash + 'xcache/xCacheWriter.swf" />' + '<param name="quality" value="high" />' + '<param name="allowFullScreen" value="true" />' + '<param name="wmode" value="window" />' + '<param name="flashvars" value="checkContainer=sohu.xcache.checkJS&swfReady=sohu.xcache.handleJS" />' + '<embed id="xcache_em" name="player" src="' + PATH.d1 + PATH.flash + 'xcache/xCacheWriter.swf"' + ' flashvars="checkContainer=sohu.xcache.checkJS&swfReady=sohu.xcache.handleJS" quality="high"' + ' width="1" height="1" align="middle" allowScriptAccess="always" allowFullScreen="true" wmode="window" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">' + '</embed></object>';
            var dom = $(_flashDom);
            if (dom) dom.html(str);
            sohu.xcache._Handle.check();
        },
        _getFlash: function() {
            var flash = null;
            if (document[_flashid + '_em']) {
                flash = document[_flashid + '_em'];
            } else {
                flash = window[_flashid + '_ob'];
            }
            return flash;
        },
        get: function(key) {
            var flash = temp._getFlash();
            if (flash) {
                try {
                    return flash.getCache(key);
                } catch(e) {
                    sohu.log('GET: ERROR');
                    return '';
                }
            } else {
                return '';
            }
        },
        set: function(key, value) {
            var flash = temp._getFlash();
            if (flash) {
                try {
                    flash.delCache(key);
                    flash.setCache(key, value);
                } catch(e) {
                    sohu.log('SET: ERROR');
                }
            }
        },
        del: function(key) {
            var flash = temp._getFlash();
            if (flash) {
                try {
                    flash.delCache(key);
                } catch(e) {
                    sohu.log('DEL: ERROR');
                    flash.setCache(key, '');
                }
            }
        },
        clear: function() {
            var flash = temp._getFlash();
            if (flash) {
                try {
                    flash.clearAll();
                } catch(e) {
                    sohu.log('CLEAR: ERROR');
                }
            }
        }
    };
    PACK.Process = {
        _initFlash: function() {
            $(window).on('domload', temp._bind);
        }
    };
    PACK._Handle = {
        hasInit: false,
        dataFun: {
            set: [],
            get: [],
            del: []
        },
        init: function(userid) {
            var v = temp.get('user');
            if (!v) {
                temp.set('user', userid.toString());
            } else {
                if (v != userid.toString()) {
                    temp.clear();
                    temp.set('user', userid.toString());
                }
            }
            this._run();
        },
        check: function() {
            this.checkFun = function() {
                if (!this.hasInit) {
                    sohu.log('handler 没有被调用');
                    this._run();
                }
            }.bind(this);
            this.checkFun.timeout(2);
        },
        _run: function() {
            this.hasInit = true;
            this.dataFun.set.each(function(it) {
                this._set(it.key, it.value, it.ts);
            }.bind(this));
            this.dataFun.get.each(function(it) {
                this._get(it.key, it.callback);
            }.bind(this));
            this.dataFun.del.each(function(it) {
                this._del(it.key);
            }.bind(this));
            this.dataFun.set = [];
            this.dataFun.get = [];
            this.dataFun.del = [];
        },
        _getTimes: function(ts) {
            var t = new Date().getTime();
            t = t + ts * 60 * 1000;
            return t;
        },
        _objToStr: function(obj) {
            if (obj instanceof Array) {
                var r = [];
                for (var i = 0; i < obj.length; i++)
                r.push(this._objToStr(obj[i]));
                return "[" + r.join() + "]";
            } else if (typeof obj == 'string') {
                return "\"" + obj.replace("\"", "'").replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";;
            } else if (typeof obj == 'number') {
                return obj.toString();
            } else if (typeof obj == 'object') {
                if (obj == null) {
                    return '';
                } else {
                    var r = [];
                    for (var i in obj)
                    r.push("\"" + i + "\":" + this._objToStr(obj[i]));
                    return "{" + r.join() + "}";
                }
            } else {
                return '';
            }
        },
        _set: function(key, value, ts) {
            if (!this.hasInit) return;
            if (key == 'user') return;
            if (!ts) ts = 180;
            ts = this._getTimes(ts);
            var str = '';
            if (value instanceof Array) {
                str = ts + '|' + '1' + '|' + this._objToStr(value);
            } else if (typeof value == 'string') {
                str = ts + '|' + '2' + '|' + this._objToStr(value);
            } else if (typeof value == 'number') {
                str = ts + '|' + '3' + '|' + this._objToStr(value);
            } else if (typeof value == 'object') {
                str = ts + '|' + '4' + '|' + this._objToStr(value);
            } else {}
            if (str) temp.set(key, str);
        },
        _del: function(key) {
            if (!this.hasInit) return;
            temp.del(key);
        },
        _clear: function() {
            if (!this.hasInit) return;
            temp.clear();
        },
        _cookie: 'cmtSession',
        _sessionKey: 'st_status_',
        _checkSession: function(key) {
            var n = kola.Cookie.get(this._cookie);
            if (n && n == 'true') {
                return true;
            } else {
                if (key.indexOf(this._sessionKey) == 0) {
                    kola.Cookie.set(this._cookie, 'true', '', '/', PATH.domain);
                }
                return false;
            }
        },
        _get: function(key, callback) {
            var re = null;
            if (!this.hasInit) re = null;
            if (!this._checkSession(key)) {
                re = null;
            } else {
                var str = temp.get(key);
                if (str) {
                    var ts, type, value;
                    var n = str.indexOf('|');
                    if (n < 0) re = null;
                    ts = str.substring(0, n);
                    str = str.substring(n + 1);
                    n = str.indexOf('|');
                    if (n < 0) re = null;
                    type = parseInt(str.substring(0, n));
                    value = str.substring(n + 1);
                    var t = new Date().getTime();
                    if (parseInt(ts) <= t) {
                        temp.del(key);
                        re = null;
                    }
                    if (type == 1 || type == 4) {
                        try {
                            re = eval('(' + value + ')');
                        } catch(e) {
                            re = null;
                        }
                    } else if (type == 2) {
                        re = value.substring(1, value.length - 1);
                    } else if (type == 3) {
                        re = parseInt(value);
                    } else {
                        re = null;
                    }
                } else {
                    re = null;
                }
            }
            if (callback) {
                callback(re);
            } else {
                return re;
            }
        }
    };
    PACK.get = function(key, callback) {
        if (PACK._Handle.hasInit) {
            return this._get(key, callback);
        } else {
            this.dataFun.get.push({
                key: key,
                callback: callback
            });
        }
    }.bind(PACK._Handle);
    PACK.set = function(key, value, ts) {
        if (PACK._Handle.hasInit) {
            this._set(key, value, ts);
        } else {
            this.dataFun.set.push({
                key: key,
                value: value,
                ts: ts
            });
        }
    }.bind(PACK._Handle);
    PACK.del = function(key) {
        if (PACK._Handle.hasInit) {
            this._del(key);
        } else {
            this.dataFun.del.push({
                key: key
            });
        }
    }.bind(PACK._Handle);
    PACK.clear = function(key) {
        this._clear();
    }.bind(PACK._Handle);
    PACK.checkJS = function() {
        return true;
    };
    PACK.handleJS = function() {
        if (sohu && sohu.user) {
            var id = sohu.user.id;
            if (!id) {
                sohu.log("sohu.user.id can't get!");
                id = 0;
            }
            sohu.xcache._Handle.init(id);
        } else {
            sohu.log("can't get sohu.user!");
        }
    }
},
'sohu.core.*');
$register("sohu.music.*",
function() {
    var Pack = sohu.music;
    var option = {
        actions: {
            playList: {
                url: 'list/playlist.do',
                params: [],
                method: 'get',
                format: 'json'
            },
            topList: {
                url: 'list/toplist.do',
                params: ['from'],
                method: 'get',
                format: 'json'
            },
            likeList: {
                url: 'list/likelist.do',
                params: ['from'],
                method: 'get',
                format: 'json'
            },
            sendAll: {
                url: 'list/sendall.do',
                params: [],
                method: 'get',
                format: 'json'
            },
            myCD: {
                url: 'list/mycd.do',
                params: [],
                method: 'get',
                format: 'json'
            },
            CDList: {
                url: 'list/cdlist.do',
                params: ['aid'],
                method: 'get',
                format: 'json'
            },
            search: {
                url: 'list/search.do',
                params: ['key', 'pg'],
                method: 'post',
                format: 'json',
                encode: 'uri'
            },
            addCD: {
                url: 'list/addcd.do',
                params: ['aname'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            delCD: {
                url: 'list/delcd.do',
                params: ['aid'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            editCD: {
                url: 'list/editcd.do',
                params: ['aid', 'aname'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            addMusic: {
                url: 'list/addmusic.do',
                params: ['aid', 'mid', 'mname', 'malbum', 'mauthor'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            addToCDs: {
                url: 'list/addtocds.do',
                params: ['aid', 'mid', 'mname', 'malbum', 'mauthor'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            addMusics: {
                url: 'list/addmusics.do',
                params: ['aid', 'songs'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            delMusic: {
                url: 'list/delmusic.do',
                params: ['aid', 'mid', 'index'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            iLike: {
                url: 'list/ilike.do',
                params: ['mid'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            unLike: {
                url: 'list/unlike.do',
                params: ['mid'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            sendMusic: {
                url: 'list/sendmusic.do',
                params: [],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            sendMusicOK: {
                url: 'list/sendmusicok.do',
                params: ['mid', 'friendid', 'desc', 'issecret'],
                method: 'post',
                format: 'json',
                type: 'blank',
                encode: 'uri'
            },
            sendList: {
                url: 'list/sendlist.do',
                params: ['page'],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            delSend: {
                url: 'list/delsend.do',
                params: ['sendid'],
                method: 'post',
                format: 'json',
                type: 'list'
            },
            settings: {
                url: 'list/settings.do',
                params: [],
                method: 'get',
                format: 'json',
                type: 'list'
            },
            settingsOK: {
                url: 'list/settingsok.do',
                params: ['aid', 'isautoplay', 'skin'],
                method: 'post',
                format: 'json',
                type: 'blank'
            }
        },
        url: '/a/app/music/'
    };
    var musicMdl = Pack.musicMdl = new sohu.core.Model(option);
    var Process = {
        _miniDom: '#pageHdPlayer',
        _profileDom: '#profileHdPlayer',
        _profileHidden: '#profilePlayerHid',
        _initFlash: function() {
            var str = '<object id="miniplayer_ob" name="player" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' + ' width="150" height="22" align="middle">' + '<param name="allowScriptAccess" value="always" />' + '<param name="movie" value="' + PATH.d2 + PATH.flash + 'music/miniPlayer.swf" />' + '<param name="quality" value="high" />' + '<param name="allowFullScreen" value="true" />' + '<param name="wmode" value="transparent" />' + '<embed id="miniplayer_em" name="player" src="' + PATH.d2 + PATH.flash + 'music/miniPlayer.swf" quality="high"' + ' width="150" height="22" align="middle" allowScriptAccess="always" allowFullScreen="true" wmode="transparent" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">' + '</embed></object>';
            $(window).on('domload',
            function() {
                var dom = $(this._miniDom);
                if (dom) dom.html(str);
            }.bind(this));
        }
    };
    Pack.Process = Process;
    Pack.musicApp = {
        _flashid: 'miniplayer',
        _playURL: '/app/music/blank/player.do',
        _sendSelector: '#j-send-',
        open: function(typeid, isType) {
            this._readyWindow(typeid, isType);
        },
        play: function(mid, mname, mauthor, malbum) {
            if (mid && mname && mauthor) {
                $call('sohu.sa.cc(\'music_open_feed\')', 'sohu.sa.*');
            }
            var flash = this._getFlash();
            if (!flash || flash.getWinStatus() == false) {
                this._readyWindow(mid);
            } else {
                flash.execute('toFocus');
                flash.execute('Player.songs.tempPlay', [mid, mname, mauthor, malbum]);
            }
        },
        delSend: function(id) {
            sohu.ctrl.Dialog.confirm('确定要删除这首歌曲？', {
                title: '删除歌曲',
                yes: function() {
                    musicMdl.delSend({
                        sendid: id
                    },
                    {
                        success: function() {
                            var el = $(this._sendSelector + id);
                            kola.Anim(el).to('height', 0).to('opacity', 0).ondone(el.remove()).go();
                        }.bind(this),
                        failure: function(error) {
                            sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                                title: '出错了'
                            });
                        }
                    });
                }.bind(this),
                no: function() {}
            });
        },
        _readyWindow: function(typeid, isType) {
            var flash = this._getFlash();
            if (!flash || flash.getWinStatus() == false) {
                var p = '';
                if (typeof typeid == 'number') {
                    if (!isType) {
                        p = "?mid=" + typeid;
                    } else {
                        p = "?typeid=" + typeid;
                    }
                }
                var _t = $("#newMusicTip");
                if (_t) {
                    $call(function() {
                        sohu.task.closeMusicTips();
                    },
                    'sohu.task.*');
                }
                var _w = 700;
                if (kola.Browser.webkit) {
                    _w = 720;
                }
                window.open(this._playURL + p, 'SohuSnsPlayer', 'height=445, width=' + _w + ', top=100, left=150, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            } else {
                flash.execute('toFocus');
            }
            return;
        },
        _getFlash: function() {
            var flash = null;
            if (document[this._flashid + '_em']) {
                flash = document[this._flashid + '_em'];
            } else {
                flash = window[this._flashid + '_ob'];
            }
            return flash;
        },
        _tipSuccess: function(str) {
            var d = document.createElement('div');
            d.className = 'msg msg-succeed';
            d.innerHTML = str;
            d = $(d);
            $('#app-music .appContent').prepend(d);
            function go() {
                kola.Anim(d).to('opacity', 0).ondone(function() {
                    d.remove()
                }).go();
            }
            go.timeout(3);
        }
    };
    Pack.musicApp.Settings = Class.create({
        initialize: function(options) {
            this.settings = {
                aidEl: '#j_profile_aid',
                autoEl: '#j_profile_auto',
                skinEl: '#j_profile_skin',
                tipEl: '#j_profile_tip',
                skin: 0
            };
            Object.extend(this.settings, options);
            this._selectSkin = this.settings.skin;
            this.tipEl = $(this.settings.tipEl);
            this.aidEl = $(this.settings.aidEl);
            this.autoEl = $(this.settings.autoEl);
            this.musicSize = window.musicSize;
            this._bind();
        },
        _bind: function() {
            this._checkMusicSize(this.aidEl.val());
            this.aidEl.on('change',
            function() {
                this._checkMusicSize(this.aidEl.val());
            }.bind(this));
        },
        _click: function(e) {
            var el = kola.Event.element(e).upWithMe('li');
            var v = parseInt(el.attr('id').replace('j_s', ''));
            if (v != this._selectSkin) {
                $('#j_s' + this._selectSkin).removeClass('cur');
                el.addClass('cur');
                this._selectSkin = v;
            }
        },
        _checkMusicSize: function(aid) {
            if (this.musicSize[aid.toString()] > 0) {
                this.tipEl.hide();
            } else {
                var _select = this.aidEl.elements()[0];
                var _text = _select.options[_select.selectedIndex].text;
                if (_text == '我的试听列表') aid = 0;
                this.tipEl.html('该列表没有音乐，请到<a href="javascript:void(0)" onclick="sohu.music.musicApp.open(' + aid + ', true);">播放器</a>中添加。');
                this.tipEl.show('inline');
            }
        },
        submit: function() {
            Pack.musicMdl.settingsOK({
                aid: $(this.settings.aidEl).val(),
                isautoplay: this.autoEl.val() ? 1 : 0,
                skin: this._selectSkin
            },
            {
                success: function() {
                    Pack.musicApp._tipSuccess('保存设置成功');
                },
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        },
        cancel: function() {
            sohu.View.switchView('/app/music/');
        }
    });
    window.swfReady = false;
    window.isJsReady = function() {
        return true;
    };
    window.openMainPlayer = function() {
        $call('sohu.sa.cc(\'music_open_flash\')', 'sohu.sa.*');
        sohu.music.musicApp.open();
    };
    window.setSwfIsReady = function() {
        window.swfReady = true;
    };
},
'kola.anim.*, sohu.core.*, sohu.ctrl.Dialog');
$register('sohu.weather.*',
function() {
    var temp = {
        _weathDom: '#pageHdWeather',
        _dateDom: '#pageHdDate',
        _check: function() {
            if (PATH.BaiWeather.indexOf('-') > 0) {
                var t = PATH.BaiWeather.split('-')[1];
                if (t == 'default') {
                    $(this._dateDom).html('<span class="week">' + this._getWeek() + '</span><span class="day">' + (new Date().getDate()) + '</span>');
                    var hour = new Date().getHours();
                    if (hour > 6 && hour < 18) {
                        $(document.body).removeClass(PATH.BaiWeather).addClass('day-default');
                    } else {
                        $(document.body).removeClass(PATH.BaiWeather).addClass('night-default');
                    }
                }
            }
        },
        _getWeek: function() {
            var _day = new Date().getDay();
            switch (_day) {
            case 0:
                return 'SUN';
            case 1:
                return 'MON';
            case 2:
                return 'TUE';
            case 3:
                return 'WED';
            case 4:
                return 'THU';
            case 5:
                return 'FRI';
            case 6:
                return 'SAT';
            }
        },
        _bind: function() {
            var str = '<object id="weather_ob" name="weather" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' + ' width="460" height="85" align="middle">' + '<param name="allowScriptAccess" value="always" />' + '<param name="movie" value="' + PATH.d2 + PATH.flash + 'weather/' + PATH.BaiWeather + '.swf" />' + '<param name="quality" value="high" />' + '<param name="allowFullScreen" value="true" />' + '<param name="wmode" value="transparent" />' + '<embed id="weather_em" name="weather" src="' + PATH.d2 + PATH.flash + 'weather/' + PATH.BaiWeather + '.swf"  quality="high"' + ' width="460" height="85" align="middle" allowScriptAccess="always" allowFullScreen="true" wmode="transparent" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">' + '</embed></object>';
            temp._check();
            var dom = $(temp._weathDom);
            if (dom) dom.html(str);
        }
    };
    var Process = {
        init: function() {
            $(window).on('domload', temp._bind);
        }
    };
    sohu.weather = Process;
});
$register('sohu.recommend.*',
function() {
    var PACK = sohu.recommend;
    var RecommendMdl = new sohu.core.Model({
        actions: {
            add: {
                url: 'recommend.do',
                params: ['rid', 'users', 'message'],
                method: 'post',
                format: 'json',
                type: 'blank'
            },
            list: {
                url: 'list.do',
                params: ['count'],
                method: 'get',
                format: 'json',
                type: 'data'
            },
            del: {
                url: 'del.do',
                method: 'post',
                params: ['id'],
                format: 'json',
                type: 'blank'
            }
        },
        url: '/a/friend/recommend/'
    });
    PACK.RecommendCtl = {
        _config: {
            listBox: "#homeFriendReco",
            filterBox: "#filterBox",
            listBox: '#friendList',
            friendList_load: "#friendList_load"
        },
        init: function(options) {
            this.opt = options;
            this.opt = Object.extend({
                src: " ",
                rid: 0,
                name: " ",
                info: " "
            },
            options)
            if (!this.opt.info || this.opt.info == null) {
                this.opt.info = " "
            }
            if (!this.opt.name) {
                this.opt.name = " "
            }
            this._initDialog();
        },
        delList: function(ele, id, type, count) {
            this.count = 50;
            if (!this._temp) {
                this._temp = this._getFilter(type);
            }
            var _element = $(ele).up(".friendItem");
            this._getList(this._fadeOut.bind(this, _element, id, type));
        },
        addList: function(element, type, isSmall) {
            if (type == 3) {
                var _listHTML = '<div class="friendAvatar"><a href="/profile.do?u=${id}" title="${title}"><img alt="${title}" src="${icon}" class="avatar-48"/></a></div>' + '<div class="friendInfo">' + '<p>${name}</p>' + '<p><a onclick="$call(function(){sohu.recommend.RecommendCtl.addFriend(\'#recommend_${id}\',${id},3)},\'sohu.recommend.*\')" class="act a-add" href="javascript:void(0)" title="加为好友" id="recommend_${id}">加为好友</a></p>' + '</div>';
            } else {
                if ( !! isSmall) {
                    var _listHTML = '<div class="friendAvatar"><img alt="${title}" class="avatar-48" src="${icon}"/></div>' + '<div class="friendInfo">' + '<h4>${name}</h4>' + '<p><a title="加为好友" id="recommend_${id}" onclick="$call(function(){sohu.recommend.RecommendCtl.addFriend(\'#recommend_${id}\',${id},' + type + ',true)},\'sohu.recommend.*\')"  href="javascript:void(0)" class="act a-add">加为好友</a></p>' + '</div>';
                } else {
                    var _listHTML = '<div class="friendAvatar"><a title="${title}" href="/profile.do?u=${id}"><img alt="${title}" class="avatar-48" src="${icon}"/></a></div>' + '<div class="friendInfo">' + '<h4><a title="${fullname}" href="/profile.do?u=${id}">${name}</a></h4>' + '<p><a title="加为好友" id="recommend_${id}" onclick="$call(function(){sohu.recommend.RecommendCtl.addFriend(\'#recommend_${id}\',${id},' + type + ')},\'sohu.recommend.*\')"  href="javascript:void(0)" class="icon i-add">加为好友</a><a title="不要再把他推荐给我" onclick="$call(function(){sohu.recommend.RecommendCtl.delList(\'#recommend_${id}\',${id},1)},\'sohu.recommend.*\')"  href="javascript:void(0)" class="icon i-ignore">不要再把他推荐给我</a></p>' + '</div>';
                }
            }
            var _template = new kola.Template(_listHTML);
            var _data = this._filterId();
            if (!_data || !_data.id) {
                var parent = element.parent();
                element.remove();
                if (parent.children() == null) {
                    parent.html('暂没有好友推荐了，可以点下一步继续');
                }
                return false;
            }
            this._dataCatche = this._dataCatche.slice(1);
            this._temp[_data.id] = true;
            element.html(_template.evaluate(_data));
            if (type == 2 || type == 3) {
                return true;
            }
            kola.anim.FadeIn.action(element, {
                speed: 8
            });
            return true;
        },
        addFriend: function(obj, id, type, isSmall) {
            if (!this._temp) {
                this._temp = this._getFilter(type);
            }
            sohu.friend.FriendAddWgt.add(id, {
                from: 2,
                success: function() {
                    this.count = 50;
                    var _element = $(obj).up(".friendItem");
                    this._getList(this._fadeOut.bind(this, _element, id, type, isSmall));
                }.bind(this),
                failure: this._addFriendFailure.bind(this, obj, id, isSmall)
            });
        },
        _addFriendFailure: function(obj, id, isSmall, error) {
            if (error && error.status == 11) {
                this.count = 50;
                var _element = $(obj).up(".friendItem");
                this._getList(this._fadeOut.bind(this, _element, id, type, isSmall));
            }
        },
        _getFilter: function(type) {
            var _filterList = {};
            var _ids = $(this._config.filterBox).val().split(',');
            for (var i = 0; i < _ids.length; i++) {
                if (_ids[i]) {
                    _filterList[_ids[i]] = true;
                }
            }
            return _filterList
        },
        fillList: function(type) {
            var _type = type || 2;
            var _num = _type == 3 ? 16 : 14;
            this.count = 50;
            if (!this._temp) {
                this._temp = this._getFilter(_type);
            }
            $(this._config.friendList_load).show();
            this._getList(this._fillList.bind(this, this._config.listBox, _num, _type));
        },
        _fillList: function(element, num, type) {
            var _ele = $(element);
            $(this._config.friendList_load).hide();
            for (var i = 0; i < num; i++) {
                var _element = kola.Element.create("li");
                _element.addClass("friendItem");
                _ele.append(_element);
                var m = this.addList(_element, type);
                if (!m) {
                    if ($(".viewMore")) $(".viewMore").hide();
                }
            }
        },
        _filterId: function() {
            if (this._dataCatche.length == 0) {
                return false;
            }
            var _data = this._dataCatche[0];
            if (this._temp[_data.id]) {
                this._dataCatche = this._dataCatche.slice(1);
                _data = this._filterId();
            }
            return _data;
        },
        _fadeOut: function(element, id, type, isSmall) {
            if (!element) {
                return;
            }
            kola.anim.FadeOut.action(element, {
                display: '',
                speed: 8,
                callback: function() {
                    this._delList.bind(this)(id);
                    this.addList(element, type, isSmall);
                }.bind(this)
            });
        },
        _getList: function(func) {
            var _list = this._dataCatche;
            if ((!_list || _list.length == 0) && !this.noData) {
                RecommendMdl.list({
                    count: this.count
                },
                {
                    success: function(data) {
                        if (data.length == 0) {
                            this.noData = true;
                            return;
                        }
                        this._dataCatche = data;
                        this.noData = false;
                        func();
                    }.bind(this),
                    failure: function() {
                        this.noData = true;
                        this._dataCatche = [];
                        func();
                    }.bind(this)
                });
            } else {
                func();
                return false;
            }
        },
        _dataCatche: [],
        _delList: function(rid) {
            RecommendMdl.del({
                id: rid
            },
            {
                success: function() {
                    var _listBox = $(this._config.listBox);
                    this._temp[rid] = true;
                    if (_listBox && _listBox.down("li") == null) {
                        _listBox.hide();
                    }
                }.bind(this),
                failure: function(error) {
                    sohu.ctrl.Dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }
            });
        },
        _initDialog: function() {
            var html = '<div class="dFriend dFriend-recommend">' + '<div class="friendItem">' + '<div class="friendAvatar">' + '<img class="avatar-48" src="' + this.opt.src + '" />' + '</div>' + '<div class="friendInfo">' + '<h4><a href="/profile.do?u=' + this.opt.rid + '" title="' + this.opt.name + '">' + this.opt.name + '</a></h4>' + '<p>' + this.opt.info + '</p>' + '</div>' + '</div>' + '<hr class="line-dotted" />' + '<div class="recommendTo">' + '<p>想把 <a href="/profile.do?u=' + this.opt.rid + '"  title="' + this.opt.name + '">' + this.opt.name + '</a> 推荐给谁认识？</p>' + '<div class="selector selector-toggle" id="recommendSelecter" >' + '<a href="javascript:void(0);" class="toggle"></a>' + '<ol class="tokenList"><li><input  id="reName" name="receiverIds" type="hidden" /><input type="text"/></li></ol>' + '</div><span id="recommendTitle" style="display:none" class="formError" ></span>' + '<div class="recommendInfo"><textarea id="reMessage" maxlength="200" max="200" min="5" datatype="Limit" rows="3" cols="50" class="text blank">为啥要推荐他给别人呢？</textarea></div>' + '</div>' + '</div>';
            this._dialog = new sohu.ctrl.Dialog({
                title: '好友推荐',
                content: html,
                buttons: [{
                    title: "推荐给好友",
                    type: 'main',
                    func: this._send.bind(this)
                },
                {
                    title: "取消",
                    close: true
                }],
                close: {
                    callback: this._closeSelector.bind(this)
                },
                mask: true
            });
            var _defalutMes = "为啥要推荐他给别人呢？";
            var _textarea = $("#reMessage");
            _textarea.setAutoResize();
            _textarea.on('focus',
            function() {
                KTV.ValidMaxLength(_textarea);
                if (_textarea.val() == _defalutMes) {
                    _textarea.val('');
                    _textarea.removeClass('blank');
                }
            });
            _textarea.on('blur',
            function() {
                if (_textarea.val() == '') {
                    _textarea.val(_defalutMes);
                    _textarea.addClass('blank');
                }
            });
            this.friendSelector = new sohu.friend.Selector({
                element: '#recommendSelecter',
                type: 2,
                zindex: 3500,
                canSelectAll: false,
                except: [this.opt.rid + ""],
                isButton: true
            });
            this.friendSelector.noFriendText = "暂无好友";
            this._mesBox = $("#recommendTitle");
            this._dialog.show();
        },
        _closeSelector: function() {
            if (this.friendSelector && this.friendSelector.selectDialog.popLayer.parent()) {
                this.friendSelector.selectDialog.popLayer.remove();
            }
        },
        _send: function() {
            var _users = $("#reName").val();
            var _mes = $('#reMessage').val();
            if (_users == "") {
                this._setMes("请选择要推荐给的朋友！");
                return;
            }
            if (_mes == "为啥要推荐他给别人呢？") {
                _mes = ""
            };
            this._sendRecommend(_users, _mes);
        },
        _setMes: function(str) {
            this._mesBox.show();
            this._mesBox.html(str);
            setTimeout(function() {
                this._mesBox.hide();
            }.bind(this), 2000)
        },
        _sendRecommend: function(ulist, mes) {
            this._dialog.disableButton(0);
            RecommendMdl.add({
                rid: this.opt.rid,
                users: ulist,
                message: mes
            },
            {
                success: function() {
                    var _str = ulist.split(",").length > 1 ? "他们": "他";
                    this._dialog.notice("<p>发送成功</p><p>" + _str + "将收到你的推荐，感谢你介绍" + this.opt.name + "给" + _str + "认识。</p>");
                }.bind(this),
                failure: function(error) {
                    this._dialog.alert(sohu.config('error', error), {
                        title: '出错了'
                    });
                }.bind(this)
            });
        }
    }
},
'sohu.core.*, sohu.ctrl.Dialog, sohu.tool.Validator,sohu.friend.*,sohu.friend.FriendSelector,kola.dom.Textarea');
$register("sohu.sa.*",
function() {
    var saPath = "http://sa.bai.sohu.com/";
    var path = "http://bai.sohu.com/";
    sohu.sa = {
        init: function() {
            if (window.viewLyoutType && window.viewLyoutType == "systemApp" && sohu.View) {
                sohu.View.on("load", this.record.bind(this));
            } else {
                this.record();
            }
        },
        record: function(e) {
            if (e) {
                this._url = path + e.data.url;
            } else {
                this._url = location.href;
            }
            this._referer = document.referrer;
            this.pv();
        },
        pv: function(type) {
            var img = kola.Element.create("img");
            img.attr("src", saPath + this.getPvParams());
            img.on("load",
            function() {
                img = null;
            });
        },
        cc: function(key) {
            if (!this._url) {
                this._url = location.href;
            }
            var img = kola.Element.create("img");
            img.attr("src", saPath + this.getCcParams(key));
            img.on('load',
            function() {
                img = null;
            });
        },
        getPvParams: function() {
            var temp = [];
            if (sohu.user.id) {
                temp.push("me=" + sohu.user.id);
            }
            temp.push("you=");
            temp.push("url=" + encodeURIComponent(this._url));
            temp.push("referer=" + encodeURIComponent(this._referer));
            temp.push("t=" + new Date().getTime());
            return "pv.gif?" + temp.join("&");
        },
        getCcParams: function(key) {
            var temp = [];
            if (sohu.user.id) {
                temp.push("me=" + sohu.user.id);
            }
            temp.push("you=");
            temp.push("url=" + encodeURIComponent(this._url));
            temp.push("key=" + key);
            temp.push("t=" + new Date().getTime());
            return "cc.gif?" + temp.join("&");
        }
    };
},
"sohu.core.*");
$register('sohu.abc.*',
function() {
    var ABCModel = new sohu.core.Model({
        actions: {
            stepState: {
                url: 'stepState.do',
                method: 'get',
                params: ['step'],
                format: 'json',
                type: 'one'
            },
            save: {
                url: 'save.do',
                method: 'post',
                params: ['status', 'step']
            },
            status: {
                url: 'status.do',
                method: 'post',
                format: 'json',
                type: 'one'
            }
        },
        url: '/a/abc/'
    });
    sohu.abc = {
        config: {},
        courseList: [{
            view: '喝杯咖啡，放慢脚步，让我们一起来熟悉白社会的优雅生活。3分钟，帮你快速上手白社会！',
            title: '热烈欢迎！',
            clsName: 'leadWindow',
            type: 1,
            next: 1,
            posEl: null,
            dpos: [(screen.availWidth - 500) / 2, 250]
        },
        {
            view: '每天9：30前打卡工资翻倍的哦~',
            title: '打卡领工资',
            meta: '点击打卡按钮领取第一份工资',
            nextBtnInfo: '我知道了',
            clsName: 'lwSmall lwBottom',
            ask: 1,
            type: 4,
            doneEl: '#dwages',
            doneEvent: 'mousedown',
            posEl: "#dwages",
            posType: 'arrowUp',
            pos: [15, 30],
            dpos: [ - 175, -95],
            next: 3
        },
        {
            view: '拒绝工作噪音，叫醒你的耳朵。在白社会听音乐，轻轻一点，仙乐飘飘。<br/><strong style="display:{tip}">点播放按钮，找找你喜欢的歌曲</strong>',
            title: '上班听歌',
            ask: 2,
            type: 4,
            doneEl: "#pageHdPlayer",
            doneEvent: "mousedown",
            posEl: "#pageHdPlayer",
            posType: 'arrowUp',
            pos: [ - 10, 30],
            dpos: [ - 130, 60],
            next: 3
        },
        {
            view: '白社会的大城小事，每天必看！',
            title: '读一份小报',
            clsName: 'lwSmall lwTop',
            meta: '点击上面链接领取小报',
            nextBtnInfo: '我知道了',
            type: 4,
            ask: 3,
            posEl: "#homeTask div.paperBox",
            doneEl: '#homeTask div.paperBox',
            doneEvent: 'mousedown',
            posType: 'arrowRight',
            pos: [ - 50, -10],
            dpos: [ - 115, 30],
            next: 11
        },
        {
            view: '也许这里有你可能认识的人哦',
            title: '你认识他们吗？',
            clsName: 'lwSmall lwBottom',
            type: 1,
            nextBtnInfo: '我知道了',
            posEl: "#homeFriendReco",
            posType: 'arrowRight',
            pos: [ - 50, 40],
            dpos: [ - 510, 0],
            next: 12
        },
        {
            view: '想看看还有哪些好友在白社会里吗？来这里找找你的同事、同学和朋友！',
            title: '我要找人',
            clsName: 'lwSmall lwBottom',
            type: 1,
            nextBtnInfo: '我知道了',
            doneEl: "#searchText",
            doneEvent: 'focus',
            posEl: "#searchText",
            posType: 'arrowUp',
            pos: [30, 30],
            nav: true,
            dpos: [ - 330, 60],
            next: 6
        },
        {
            view: '想和好友聊天，最简单直接的办法就是点击右侧好友列表中的头像开始聊天，祝你聊得轻松，聊得愉快!',
            title: '在线聊天',
            type: 1,
            posEl: "im",
            doneEl: '#imbarInt',
            doneEvent: "mousedown",
            posType: 'arrowRight',
            pos: [ - 60, 70],
            dpos: [ - 520, 30],
            next: 7
        },
        {
            view: '好友们的最新动态都会显示在这里，朋友越多，这里就越热闹哦～',
            title: '好友的新鲜事',
            type: 1,
            posEl: "#homeFeedWrap",
            posType: 'arrowDown',
            pos: [150, -50],
            dpos: [30, -160],
            next: 12
        },
        {
            view: '有事没事先在这里说一句，朋友们马上会在下面的新鲜事中看到哦。说点什么呢？不如说说你那里的天气吧～',
            title: '一句话',
            type: 4,
            posEl: "#statusForm textarea",
            doneEl: "#statusForm textarea",
            event: 'com',
            posType: 'arrowUp',
            pos: [290, 50],
            dpos: [240, 85],
            next: 9
        },
        {
            view: '如果好友们给你评论或留言，这里会随时通知你。点开通知按钮，便一目了然。',
            title: '通知',
            clsName: 'lwSmall lwBottom',
            type: 4,
            doneEl: "#navbar-notice",
            doneEvent: 'mousedown',
            posEl: "#navbar-notice",
            posType: 'arrowUp',
            pos: [15, 30],
            dpos: [ - 200, 60],
            nav: true,
            next: 7
        },
        {
            view: '老板走过来了？怎么办？迅速按下键盘F9键，从此不再担惊受怕。',
            title: '躲避老板',
            type: 1,
            doneEl: "#bossKeyExit",
            doneEvent: 'mousedown',
            posEl: "#bossKey",
            posType: 'arrowRight',
            pos: [ - 40, 260],
            dpos: [ - 500, 220],
            next: 11
        },
        {
            view: '休息时间来一局，放松！',
            title: '玩一局小游戏',
            clsName: 'lwSmall lwLeft',
            type: 3,
            event: 'link',
            nextBtnInfo: '我知道了',
            doneEl: "#appbar a[title=游戏大厅]",
            doneEvent: 'mousedown',
            posEl: "#appbar a[title=游戏大厅]",
            posType: 'arrowLeft',
            pos: [100, -10],
            dpos: [90, -25],
            next: 12
        },
        {
            view: '这里有小白们不为人知的秘密!',
            title: '看看秘密',
            clsName: 'lwSmall lwLeft',
            type: 3,
            event: 'link',
            nextBtnInfo: '我知道了',
            doneEl: "#appbar a[title=说秘密]",
            doneEvent: 'mousedown',
            posEl: "#appbar a[title=说秘密]",
            posType: 'arrowLeft',
            pos: [100, -5],
            dpos: [90, -25],
            next: 13
        },
        {
            view: '这里面有更多好玩的应用哦~',
            title: '添加应用',
            nextBtnInfo: '我知道了',
            clsName: 'lwSmall lwLeft',
            type: 3,
            event: 'link',
            doneEl: '#appbar li.add',
            doneEvent: 'mousedown',
            posEl: "#appbar li.add",
            posType: 'arrowLeft',
            pos: [100, -10],
            dpos: [90, -25],
            next: 14
        },
        {
            view: '白老大发出的任务，新人必做！',
            title: '新手任务',
            clsName: 'lwSmall lwRight',
            nextBtnInfo: '我知道了',
            type: 1,
            posEl: "#homeTask div.taskInt",
            posType: 'arrowRight',
            next: 15,
            pos: [ - 40, 20],
            dpos: [ - 260, 10]
        },
        {
            view: '谢谢你一路跟随我们的指引完成白社会初体验，剩下好玩的东西就靠你自己慢慢发掘了哦~，祝你在白社会生活愉快！',
            title: '完成体验',
            clsName: 'leadWindow',
            type: 1,
            posEl: null,
            pos: [0, 10],
            dpos: [(screen.availWidth - 480) / 2, 250],
            next: null
        }],
        init: function() {
            this.NPC.init.bind(this.NPC).timeout(1);
        },
        NPC: {
            _npcEl: $('#j-NPC'),
            status: {
                display: 6,
                step: -1
            },
            init: function() {
                this._status = this._getStatusByCookie();
                if (this._status) {
                    this._init();
                } else {
                    this._getStatusByAjax();
                }
                this._npcEl = $('#j-NPC');
                this._initTips();
            },
            regEvent: function() {
                this._npcEl.on('click', sohu.abc.dialog.show.bind(sohu.abc.dialog));
            },
            show: function(state) {
                this._npcEl.css('visibility', 'visible');
                this._setStatus({
                    status: 6
                });
                if (state) {
                    return;
                }
                this._showTips();
            },
            hide: function() {
                if (!this._npcEl) {
                    return;
                }
                this._tips.hide();
                this._npcEl.css('visibility', 'hidden');
                this._setStatus({
                    status: 7
                });
            },
            _init: function() {
                var DD = this._status.split('-');
                var _status = {
                    status: DD[0],
                    step: DD[1]
                };
                this.status = _status;
                if (this.status.status == 8) {
                    return;
                } else {
                    sohu.abc.dialog.init();
                    if (this.status.status == 6) {
                        this._npcEl.css('visibility', 'visible');
                    }
                }
                this.box = this._npcEl.box();
                this.regEvent();
            },
            _initTips: function() {
                var _html = '<i></i><p>记得点这里打开我哦~</p><em class="corDown" style="right:40px; left:auto"></em>';
                var _pos = this._npcEl.pos();
                this._tips = kola.Element.create('div').hide();
                this._tips.addClass('newSbTip');
                this._tips.pos({
                    left: 760,
                    top: 41
                });
                $(document.body).append(this._tips);
                this._tips.html(_html);
            },
            _showTips: function() {
                this._tips.show();
                if (!kola.Browser.ie) {
                    kola.Anim(this._tips).from('opacity', 0.1).to('opacity', 1).go();
                }
                this._hideTips.bind(this).timeout(4);
            },
            _hideTips: function() {
                if (!kola.Browser.ie) {
                    kola.Anim(this._tips).from('opacity', 1).to('opacity', 0.1).ondone(this._tips.hide.bind(this._tips)).go();
                } else {
                    this._tips.hide();
                }
            },
            _getStatusByCookie: function() {
                return kola.Cookie.get('ABC');
            },
            _getStatusByAjax: function() {
                ABCModel.status(null, {
                    success: this._getStatusSuccess.bind(this),
                    failure: function() {}
                })
            },
            _getStatusSuccess: function(data) {
                if (data.status != 6 && data.status != 7) {
                    this._npcEl.hide();
                    return;
                }
                this._status = '' + data.status + '-' + (data.step || '0');
                this._init();
            },
            _setStatus: function(obj) {
                Object.extend(this.status, obj);
                var temp = [this.status.status, this.status.step || '0'];
                kola.Cookie.set('ABC', temp.join('-'), 0);
                ABCModel.save({
                    status: this.status.status,
                    step: this.status.step
                },
                {
                    success: function() {
                        if (obj && obj.callback && obj.callback.constructor == Function) {
                            obj.callback();
                        }
                    }.bind(this),
                    failure: function() {}
                });
            }
        },
        dialog: {
            _html: '<div class="${clsName}">' + '<a href="javascript:void(0)" class="minBtn" onmousedown="$call(function(){sohu.sa.cc(\'leadDialog_close_${step}\')},\'sohu.sa.*\')" title="关闭 以后再看"></a>' + '<div class="leadPic pic${step}"> </div>' + '<div class="leadContent leadSome">' + '<h1>${title}</h1>' + '<p>${view}</p>' + '<p><span style="display:${leadBtn}" onmousedown="$call(function(){sohu.sa.cc(\'leadDialog_done_${step}\')},\'sohu.sa.*\')" class="button button-main"><span><a class="j-btn"   href="javascript:void(0)">完成</a></span></span><a class="j-btn next" style="display:${nextBtn}"  onmousedown="$call(function(){sohu.sa.cc(\'leadDialog_next_${step}\')},\'sohu.sa.*\')" onclick="this.blur();" href="javascript:void(0)">${nextBtnInfo}</a>${meta}</p>' + '</div></div>',
            init: function() {
                this._dialog = kola.Element.create('div').hide();
                $(document.body).append(this._dialog);
                this._dialog.css('position', 'absolute');
                this.template = new kola.Template(this._html);
                var _step = sohu.abc.NPC.status.step || 0;
                sohu.abc.currentStep = sohu.abc.courseList[_step];
                sohu.abc.currentStep.step = _step;
                this._update();
            },
            _update: function() {
                if (!sohu.abc.currentStep) {
                    sohu.ctrl.Dialog.alert("恭喜你已经完成ABC课程了")
                    return;
                }
                if (sohu.abc.currentStep.type > 2 && !sohu.abc.currentStep.checked) {
                    this._checkCourseProgress(sohu.abc.currentStep.type);
                    return;
                }
                if (!sohu.abc.currentStep.next) {
                    sohu.abc.NPC._setStatus({
                        status: 8
                    });
                }
                var _content = this._getContent();
                this._dialog.html(_content);
                if (sohu.abc.currentStep.step == 0) {
                    this._dialog.down('a.minBtn').hide();
                }
                this._regEvent();
                this._dialog.css('position', 'absolute');
                if (!sohu.abc.currentStep.nav) {
                    this._dialog.css('zIndex', 2500);
                } else {
                    this._dialog.css('zIndex', 1500);
                }
                if (sohu.abc.currentStep.posEl) {
                    if (sohu.abc.currentStep.posEl == "#homeTask div.taskInt") {
                        if ($('#homeTask div.taskInt').html().trim() == '') {
                            this._lastType = sohu.abc.currentStep.type;
                            this._nextStep();
                            return;
                        }
                    }
                    if (sohu.im.Bar._getTinyBar()) {
                        if (sohu.abc.currentStep.posEl == 'im') {
                            this._posEl = $("#imTinybar");
                            this._dialog.css('zIndex', 1500);
                        } else if (sohu.abc.currentStep.posEl == '#bossKey') {
                            this._lastType = sohu.abc.currentStep.type;
                            this._nextStep();
                            return;
                        } else {
                            this._posEl = $(sohu.abc.currentStep.posEl);
                        }
                    } else {
                        if (sohu.abc.currentStep.posEl == 'im') {
                            sohu.abc.currentStep.posEl = "#imbarMid";
                        }
                        this._posEl = $(sohu.abc.currentStep.posEl);
                    }
                }
                this._pos = {
                    left: 0,
                    top: 0
                };
                if (this._posEl) {
                    this._pos = this._posEl.pos();
                } else {
                    if (sohu.abc.currentStep.posEl && typeof(this._posEl) == 'object') {
                        this._nextStep();
                        return;
                    }
                }
                if (sohu.abc.NPC.status.status == 7) {
                    if (!sohu.abc.NPC.load) {
                        this.show.bind(this).timeout(2);
                        sohu.abc.NPC.load = true;
                    } else {
                        this._move([this._pos.left + sohu.abc.currentStep.dpos[0], this._pos.top + sohu.abc.currentStep.dpos[1]]);
                    }
                    if (this.guider) {
                        this.guider.hide();
                    }
                };
                if (sohu.abc.NPC.status.status == 8) {
                    this._move([(screen.availWidth - 500) / 2, 250]);
                }
            },
            _setFix: function() {
                if (sohu.abc.currentStep.nav && !kola.Browser.ie6) {
                    var _po = sohu.abc.currentStep.pos;
                    this._dialog.css('position', 'fixed');
                    this._dialog.pos({
                        left: this._pos.left + sohu.abc.currentStep.dpos[0],
                        top: 60
                    })
                    this.guider.css('position', 'fixed');
                    this.guider.pos({
                        left: this._pos.left + _po[0],
                        top: 30
                    });
                }
            },
            _clearFix: function() {
                if (sohu.abc.currentStep.nav && !kola.Browser.ie6) {
                    var _po = sohu.abc.currentStep.pos;
                    this._dialog.css('position', 'absolute');
                    this._dialog.pos({
                        left: this._pos.left + sohu.abc.currentStep.dpos[0],
                        top: this._pos.top + sohu.abc.currentStep.dpos[1]
                    })
                }
            },
            _move: function(pos, state) {
                if (!this._onMove) {
                    this._onMove = true
                } else {
                    return;
                }
                if (this.guider) {
                    this.guider.hide();
                }
                if (this._lastType != 4) {
                    this._dialog.show();
                    this._dialog.anim("move", {
                        to: pos,
                        speed: 50,
                        curve: 'Expo',
                        curveType: 'easeInOut',
                        callback: this._moveEnd.bind(this)
                    });
                } else {
                    this._dialog.pos({
                        left: pos[0],
                        top: pos[1]
                    });
                    setTimeout(function() {
                        this._dialog.show();
                        if (!kola.Browser.ie) {
                            kola.Anim(this._dialog).from('opacity', 0.1).to('opacity', 1).ondone(this._clearOpacity.bind(this, this._dialog)).go();
                        }
                        this._moveEnd();
                    }.bind(this), 3000)
                }
            },
            show: function() {
                if (sohu.abc.currentStep.nav && !kola.Browser.ie6) {
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }
                var _pos = [this._pos.left + sohu.abc.currentStep.dpos[0], this._pos.top + sohu.abc.currentStep.dpos[1]];
                var box = sohu.abc.NPC._npcEl.box();
                this._setTempStyle(box);
                sohu.abc.NPC.hide();
                if (!sohu.abc.currentStep.next) {
                    _pos = [(screen.availWidth - 480) / 2, 250];
                };
                var wh = this._getTempWidth();
                kola.Anim(this._tempDiv).duration(500).to('width', wh.width).to('height', wh.height).to('left', _pos[0]).to('top', _pos[1]).ondone(this._show.bind(this)).go();
            },
            _moveEnd: function() {
                this._onMove = false;
                this._lastType = 0;
                this._setFix();
            },
            _guid: function() {
                this._onMove = false;
                this._lastType = 0;
                this._showBorder();
                this._setFix();
            },
            _show: function() {
                this._tempDiv.hide();
                sohu.abc.NPC.status.status = 7;
                this._dialog.show();
                if (!kola.Browser.ie) {
                    kola.Anim(this._dialog).from('opacity', 0.1).duration(300).to('opacity', 1).go();
                }
                this._setFix();
                if (!sohu.abc.currentStep.next) {
                    return;
                }
                this._dialog.pos({
                    left: this._pos.left + sohu.abc.currentStep.dpos[0],
                    top: this._pos.top + sohu.abc.currentStep.dpos[1]
                });
            },
            _loadSshow: function() {
                var box = sohu.abc.NPC._npcEl.box();
                this._setTempStyle(box);
                sohu.abc.NPC.hide();
                this._dialog.pos({
                    left: box.left - 240,
                    top: box.top
                });
                var wh = this._getTempWidth();
                kola.Anim(this._tempDiv).to('width', wh.width).to('height', wh.height).to('top', box.top - 40).to('left', box.left - 220).ondone(this._show.bind(this)).go();
            },
            _clearOpacity: function(obj) {
                var _obj = $(obj);
                _obj.css('filter', '');
                _obj.css('opacity', '');
                _obj.removeAttr('filter');
            },
            close: function() {
                this._clearFix();
                var _pos = this._dialog.pos();
                var wh = this._getTempWidth();
                var box = {
                    width: wh.width,
                    height: wh.height,
                    top: _pos.top,
                    left: _pos.left
                };
                this._setTempStyle(box);
                this._dialog.hide();
                kola.Anim(this._tempDiv).to('width', sohu.abc.NPC.box.width).to('height', sohu.abc.NPC.box.height).to('left', sohu.abc.NPC.box.left).to('top', sohu.abc.NPC.box.top).ondone(this._close.bind(this)).go();
            },
            _close: function() {
                this._tempDiv.hide();
                if (!sohu.abc.currentStep.next) {
                    sohu.abc.NPC._npcEl.css('visibility', 'visible');
                    kola.Anim(sohu.abc.NPC._npcEl).to('opacity', 0.1).ondone(function() {
                        sohu.abc.NPC._npcEl.css('visibility', 'hidden');
                    }).go();
                } else {
                    sohu.abc.NPC.show();
                }
            },
            _setTempStyle: function(box) {
                if (!this._tempDiv) {
                    this._getTempDiv();
                }
                this._tempDiv.css('width', box.width + 'px');
                this._tempDiv.css('height', box.height + 'px');
                this._tempDiv.pos(box);
                this._tempDiv.show();
            },
            _getTempWidth: function() {
                var box = {
                    width: 260,
                    height: 85
                };
                if (sohu.abc.currentStep.step == 0 || sohu.abc.currentStep.step == 15) {
                    box = {
                        width: 480,
                        height: 130
                    };
                };
                return box;
            },
            _regEvent: function() {
                this._dialog.down('a.minBtn').on('click', this.close.bind(this));
                var _btn = this._dialog.down('a.j-btn');
                if (_btn) {
                    _btn.on('click', this._nextStep.bindEvent(this, true));
                }
            },
            _getTempDiv: function() {
                this.tempDiv = $("#abcTempDiv");
                if (!this.tempDiv) {
                    this._tempDiv = kola.Element.create("div", {
                        id: 'abcTempDiv'
                    }).hide();
                    this._tempDiv.css('position', 'absolute');
                    this._tempDiv.css('border', '1px solid #ccc');
                    $("#dropWrap").append(this._tempDiv);
                }
            },
            _updateStep: function(step, callback) {
                if (!step) {
                    this._dialog.hide();
                    sohu.abc.NPC._npcEl.hide();
                    sohu.abc.NPC._setStatus({
                        status: 8
                    });
                    return;
                }
                this._delMonitor();
                sohu.abc.currentStep = sohu.abc.courseList[step];
                if (!sohu.abc.currentStep) {
                    sohu.abc.NPC._setStatus({
                        status: 8
                    });
                    sohu.abc.NPC._npcEl.hide();
                    sohu.abc.dialog._dialog.hide();
                }
                sohu.abc.currentStep.step = step;
                sohu.abc.NPC._setStatus({
                    step: step,
                    callback: callback
                });
            },
            _nextStep: function(callback) {
                if (!sohu.abc.currentStep.next) {
                    this.close();
                    return;
                };
                if (this.guider) {
                    this.guider.hide();
                }
                if (sohu.abc.currentStep) {
                    var _curStep = sohu.abc.currentStep.next;
                    this._updateStep(_curStep, callback);
                    this._update();
                } else {
                    this._dialog.hide();
                }
            },
            _checkCourseProgress: function(type) {
                switch (type) {
                case 3:
                    this._pageListen();
                    break;
                case 4:
                    this._getProgress(this._update.bind(this));
                    break;
                default:
                    this._lastType = 0;
                    break;
                }
            },
            _pageListen: function() {
                if (!sohu.abc.NPC.status.done) {
                    sohu.abc.NPC.status.done = 0;
                } else {}
                this._initMonitor();
                sohu.abc.currentStep.checked = true;
                this._update();
            },
            _getProgress: function(func) {
                ABCModel.stepState({
                    step: sohu.abc.currentStep.ask
                },
                {
                    success: function(data) {
                        sohu.abc.NPC.status.done = data.state == 1 ? 1 : 0;
                        this._pageListen();
                    }.bind(this),
                    failure: function() {
                        sohu.abc.NPC.status.done = 1;
                        this._pageListen();
                    }.bind(this)
                })
            },
            _getContent: function() {
                var _config = {
                    step: parseInt(sohu.abc.NPC.status.step) + 1,
                    title: sohu.abc.currentStep.title,
                    view: sohu.abc.currentStep.view,
                    nextBtnInfo: sohu.abc.currentStep.nextBtnInfo || '我知道了',
                    nextBtn: 'none',
                    leadBtn: 'none',
                    clsName: sohu.abc.currentStep.clsName
                };
                if (sohu.abc.currentStep.type == 4) {
                    _config.nextBtn = ' ';
                    _config.view = _config.view.replace(/\{tip\}/gi, 'none');
                } else if (sohu.abc.currentStep.next) {
                    _config.nextBtn = ' ';
                } else {
                    _config.leadBtn = ' ';
                }
                if (sohu.abc.NPC.status.step == 0) {
                    return '<div class="leadWindow"><a href="javascript:void(0)" onmousedown="$call(function(){sohu.sa.cc(\'leadDialog_close_1 \')},\'sohu.sa.*\')" class="minBtn" title="关闭 以后再看"></a>' + '<div class="leadPic pic1"> </div><div class="leadContent leadFirst"><p>喝杯咖啡，放慢脚步，让我们一起来熟悉白社会的优雅生活。</p><h1>3分钟，帮你快速上手白社会！</h1><p><span onmousedown="$call(function(){sohu.sa.cc(\'leadDialog_next_1\')},\'sohu.sa.*\')" class="button button-large"><span><a class="j-btn" href="javascript:void(0)">初试白社会</a></span></span></p></div></div>';
                }
                return this.template.evaluate(_config);
            },
            _showGuider: function() {
                if (!sohu.abc.currentStep.posEl || sohu.abc.currentStep.next == 1) {
                    if (this.guider) {
                        this.guider.hide();
                    }
                    return;
                }
                if (!this.guider && sohu.abc.currentStep.posEl) {
                    this.guider = kola.Element.create('div');
                    if (sohu.im.Bar._getTinyBar() && sohu.abc.currentStep.posEl == 'im') {
                        this.guider.css('zIndex', 1501);
                    } else {
                        this.guider.css('zIndex', 2501);
                    }
                    $(document.body).append(this.guider);
                } else {
                    this.guider.show();
                };
                if (!sohu.abc.currentStep.nav && sohu.abc.currentStep.posEl != 'im') {
                    this.guider.css('zIndex', 2501);
                } else {
                    this.guider.css('zIndex', 1501);
                }
                var _po = sohu.abc.currentStep.pos;
                if (!_po) {
                    return;
                }
                this.guider.attr('class', sohu.abc.currentStep.posType);
                this.guider.css('position', 'absolute').pos({
                    left: this._pos.left + _po[0],
                    top: this._pos.top + _po[1]
                });
            },
            _showBorder: function() {
                if (this._posEl && !this._posEl.attr('shing')) {
                    var count = 0;
                    this._clearShing();
                    this._showGuider();
                    this._shingEl = this._posEl;
                    this._shingEl.css('border');
                    this.iTimer = setInterval(function() {
                        if (count == 20) {
                            clearInterval(this.iTimer);
                            if (this._shingEl.elements()[0].tagName == "textarea") {
                                this._shingEl.css('border', 'none');
                            }
                            this._shingEl.css('border', 'none');
                        } else {
                            count++;
                            if (count % 2 == 0) {
                                this._shingEl.css('border', '1px dashed #ffcc00');
                            } else {
                                this._shingEl.css('border', '1px dashed #cc3300');
                            }
                        }
                    }.bind(this), 500)
                }
            },
            _clearShing: function() {
                clearInterval(this.iTimer);
                if (this._shingEl) {
                    if (this._shingEl.elements()[0].tagName == "textarea") {
                        this._shingEl.css('border', 'none');
                    }
                    this._shingEl.css('border', 'none');
                }
                if (this.guider) {
                    this.guider.hide();
                }
            },
            _initMonitor: function() {
                if (sohu.abc.currentStep.event == 'com') {
                    this.doneListener = this._comEventDone.bind(this);
                    sohu.status.on('statussend', this.doneListener);
                    return;
                }
                if (sohu.abc.currentStep.event == 'link') {
                    this.doneListener = this._linkMonitorDone.bindEvent(this);
                    this.doneEl = $(sohu.abc.currentStep.doneEl);
                    if (this.doneEl) {
                        this.doneEl.on(sohu.abc.currentStep.doneEvent, this.doneListener);
                    }
                    return;
                }
                else if (sohu.abc.currentStep.doneEl) {
                    this.doneListener = this._monitorEventDone.bind(this);
                    this.doneEl = $(sohu.abc.currentStep.doneEl);
                    if (this.doneEl) {
                        this.doneEl.on(sohu.abc.currentStep.doneEvent, this.doneListener);
                    }
                }
            },
            _comEventDone: function() {
                sohu.status.un('statussend', this.doneListener);
                if (this.guider) {
                    this.guider.hide();
                }
                if (!kola.Browser.ie) {
                    kola.Anim(this._dialog).from('opacity', 1).to('opacity', 0.1).ondone(this._opHide.bind(this)).go();
                } else {
                    this._opHide();
                }
            },
            _linkMonitorDone: function(e) {
                var _href = this.doneEl.attr('href');
                if (!_href) {
                    _href = "/apps/apps.do"
                }
                kola.Event.stop(e);
                this._nextStep(function() {
                    location.href = _href
                });
            },
            _monitorEventDone: function() {
                this._delMonitor();
                if (this.guider) {
                    this.guider.hide();
                }
                if (!kola.Browser.ie) {
                    kola.Anim(this._dialog).from('opacity', 1).to('opacity', 0.1).ondone(this._opHide.bind(this)).go();
                } else {
                    this._opHide();
                }
            },
            _opHide: function() {
                this._lastType = 4;
                this._dialog.hide();
                this._nextStep();
            },
            _delMonitor: function() {
                if (this.doneEl) {
                    this.doneEl.un(sohu.abc.currentStep.doneEvent, this.doneListener);
                    sohu.abc.NPC.status.done = 1;
                }
            }
        }
    };
},
'sohu.core.*,sohu.ctrl.Dialog,kola.anim.Tween');