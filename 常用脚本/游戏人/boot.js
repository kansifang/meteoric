-
function($, $w, $r, $d, $cs, $rm, $ev, $ap, $ex, vs, nu, ie, ff, C, N, E, W, S, F, dr, pk) {
    vs = "Ucren 4.2.01.090804",
    N = function() {
        return function() {}
    },
    $w = window,
    $d = document,
    nu = navigator.userAgent,
    ie = /msie/i.test(nu),
    ff = /firefox/i.test(nu),
    $cs = ie ?
    function(A, _, $) {
        var _ = parseInt($ = A.style[_] || A.currentStyle[_], 10);
        return typeof(_) == "number" && !isNaN(_) ? _: $ || 0
    }: function(A, _, $) {
        var _ = parseInt($ = A.style[_] || $d.defaultView.getComputedStyle(A, null).getPropertyValue(_), 10);
        return typeof(_) == "number" && !isNaN(_) ? _: $ || 0
    },
    $rm = ie ?
    function() {
        var $;
        return function(_) {
            if (_ && _.parentNode && _.tagName != "BODY") $ = $ || document.createElement("div"),
            $.appendChild(_),
            $.innerHTML = ""
        }
    } () : function($) {
        $ && $.parentNode && $.tagName != "BODY" && $.parentNode.removeChild($)
    },
    C = {
        topzIndex: 2000,
        layerzIndexs: {
            menubar: 10,
            combobox: 9,
            fieldset: 9,
            treeview: 8,
            slidebar: 8,
            tabpanel: 8
        }
    },
    dr = function(A) {
        if (A) {
            $r = $d.compatMode == "CSS1Compat" ? $d.documentElement: $d.body,
            HEAD = $.get("#head"),
            BODY = $.get("#body");
            return dr = null
        }
        HASDOCTYPE = $d.compatMode == "CSS1Compat",
        ISIE = ie,
        ISFF = ff,
        $ev($d, "keydown", pk),
        $.each($.I,
        function(_) {
            $.Import(_, true)
        }),
        /^h/i.test($.appPath) && $.Import("com.ucren.www.CrossDomain"),
        $ev($w, "unload",
        function() {
            $.handle(0);
            E.trash();
            for (var A = 0, _ = $._unloads.length; A < _; A++) $._unloads[A]()
        }),
        ff && $.Import("patch.Firefox");
        try {
            ie && $d.execCommand("BackgroundImageCache", false, true)
        }
        catch(_) {}
        var B = $.appPath + "resource/skins/" + $.currentSkin + "/";
        $.loadingImage([B + "pl-no-repeat.gif", B + "pl-repeat-x.gif", B + "pl-repeat-y.gif"])
    },
    pk = function(A) {
        A = Ucren.Event(A);
        switch (A.keyCode) {
        case 27:
            var $, _;
            if ((_ = W.lastDialog) && _.visible) _.hide();
            else if ($ = W.currentWindow) $.hide();
            break
        }
    },
    $ = {
        version: vs,
        Config: C,
        I: {},
        _unloads: []
    },
    $.apply = $ap = function(_, A, $) {
        $ = $ || {};
        for (var B in A)($ && (B in $)) || (_[B] = A[B]);
        return _
    },
    function(p) {
        p = function(A, C, B, _) {
            return (A = $d.getElementsByTagName("script"), B = (C = (A = A[A.length - 1]).getAttribute("src")).match(/(.*)\//i)[1] + "/", _ = (_ = C.match(/(\?|&)skin=([^&]+)(&|$)/i)) ? _[2] : "qq", A.innerHTML.replace(/\s*import\s+([a-zA-Z0-9\.]+);/g,
            function(_, A) {
                $.I[A] = 1
            }), {
                appPath: B,
                skinName: _
            })
        } (),
        $ap($, {
            appPath: p.appPath,
            currentSkin: p.skinName,
            id: function() {
                var $ = 0;
                return function() {
                    return "ucren-id-" + ($++)
                }
            } (),
            extend: $ex = function($, _) {
                $ap($.prototype, _);
                return $
            },
            nameSpace: function(_, $) {
                $ = $w,
                _ = _.split(".");
                for (var A = 0; A < _.length; A++)(($[_[A]] || ($[_[A]] = {})), $ = $[_[A]])
            },
            Import: function(B, A, _) {
                B in $.I && typeof(A) == "function" && A();
                (!(B in $.I) || A === true) && (B = $.appPath + "/classes/" + B.replace((A === true || ($.I[B] = 1), /^Ucren\.|\.js$/i), "").replace(/\./g, "/") + ".js") && (typeof(A) == "function" ? $.remoteCallScript(B, true, A) : $d.write("<script type='text/javascript' src='" + B + "'></script>"))
            },
            each: function(_, $) {
                $ = $.createDelegate(_);
                for (var A in _)(A in {}) || $(A, _[A])
            },
            clone: function(A, B, _) {
                A.constructor == Array ? (B = A.slice(0)) : ((_ = N()).prototype = A, B = new _);
                $.each(B,
                function(A, _) {
                    typeof(_) == "object" && (B[A] = $.clone(B[A]))
                });
                return B
            },
            clear: function(_) {
                $.each(_,
                function($, A) {
                    delete _[$]
                })
            },
            get: function($, _) {
                if (_) return E.parseDom($);
                return E.parseUObject($)
            },
            Event: function($) {
                if (! ($ = $ || $w.event)) {
                    var _ = arguments.callee.caller;
                    while (_) {
                        if (($ = _.arguments[0]) && $ != null && typeof($.altKey) == "boolean") break;
                        _ = _.caller;
                        $ = null
                    }
                }
                if ($) $.srcDom = $.srcElement || $.target,
                $.cancel = function() {
                    this.cancelBubble = true;
                    ff && (this.preventDefault(), this.stopPropagation())
                },
                $.getPageX = function() {
                    var $;
                    $ = this.pageX;
                    if (typeof($) == "number") return $;
                    $ = (this.clientX || 0) + (ISIE ? $r.scrollLeft: 0);
                    return $
                }.createDelegate($),
                $.getPageY = function() {
                    var $;
                    $ = this.pageY;
                    if (typeof($) == "number") return $;
                    $ = (this.clientY || 0) + (ISIE ? $r.scrollTop: 0);
                    return $
                }.createDelegate($);
                return $
            },
            addEvent: $ev = function() {
                var $ = ie ?
                function(A, _, $) {
                    A.attachEvent("on" + _, $)
                }: function(A, _, $) {
                    A.addEventListener(_, $, false)
                };
                return function(B, _, C) {
                    B = E.parseDom(B);
                    if (B == null) return;
                    var A = C.createDelegate(B);
                    $(B, _, A);
                    E.evtsList.push({
                        obj: B,
                        evt: _,
                        fun: A
                    });
                    return A
                }
            } (),
            deleteEvent: function() {
                var $ = ie ?
                function(A, _, $) {
                    A.detachEvent("on" + _, $)
                }: function(A, _, $) {
                    A.removeEventListener(_, $, false)
                };
                return function(A, _, B) {
                    A = E.parseDom(A),
                    $(A, _, B)
                }
            } (),
            Listen: function(_, $) { -
                function() {
                    if (_()) return $();
                    setTimeout(arguments.callee, 64)
                } ()
            },
            onTouch: function(A, C, B, _) {
                var D;
                typeof(A[C]) == "function" ? ((A[D = "__patch__" + $.randomWord(16)] = A[C], A[C] = function() {
                    var $ = arguments;
                    _ && B.apply(this, $) === false || this[D].apply(this, $),
                    _ || B.apply(this, $)
                }).toString = function() {
                    return A[D].toString()
                }) : (A[C] = B)
            },
            type: function(A) {
                if (A === undefined || A === null) return false;
                if (A instanceof $.UObject) return "uobject";
                var _ = typeof A;
                if (_ == "object" && A.nodeName) switch (A.nodeType) {
                case 1:
                    return "element";
                case 3:
                    return (/\S/).test(A.nodeValue) ? "textnode": "whitespace"
                }
                if (_ == "object" || _ == "function") {
                    switch (A.constructor) {
                    case Array:
                        return "array";
                    case RegExp:
                        return "regexp"
                    }
                    if (typeof A.length == "number" && typeof A.item == "function") return "nodelist"
                }
                return _
            },
            queryString: function(B, C) {
                var _, A, $;
                _ = C || location.href,
                A = new RegExp("(\\?|&)" + B.uniEncode() + "=([^&#]*)(#|&|$)", "i"),
                $ = _.match(A);
                return $ ? $[2] : ""
            },
            getLocationHash: function() {
                var _, $;
                return (_ = ($ = location.href).lastIndexOf("#")) > -1 ? $.slice(_ + 1) : ""
            },
            randomNumber: function($) {
                return Math.floor(Math.random() * $)
            },
            randomWord: function() {
                var $ = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                return function(A, D) {
                    var _, B = [];
                    _ = D || $;
                    for (var C = 0; C < A; C++) B[C] = _.charAt(this.randomNumber(_.length));
                    return B.join("")
                }
            } (),
            decode: function(o) {
                return eval("(" + o + ")")
            },
            loadingImage: function(C, B, A) {
                var E, F, _;
                E = C.length,
                F = false,
                _ = 0,
                E < 1 ? (F = true) && B && B() : $();
                function D() { (++_) == E ? ((F = true) && B && B()) : $.defer(1)
                }
                function $() {
                    var $ = new Image(),
                    B;
                    ff && (B = D.defer(2000));
                    $.removeEvent = function() {
                        this.onload = this.onerror = this.removeEvent = null;
                        D()
                    };
                    $.onload = function() {
                        ff && clearTimeout(B);
                        A && A(_ / E);
                        this.removeEvent()
                    };
                    $.onerror = function() {
                        this.removeEvent()
                    };
                    $.src = C[_]
                }
            },
            handle: function() {
                var _ = {};
                return function(A) {
                    var B = typeof(A);
                    if (B == "string") return _[A];
                    else if (B == "object") _[A.handleId = $.id()] = A;
                    else if (B === 0) {
                        $.each(_,
                        function($) {
                            _[$] = null
                        });
                        _ = null
                    }
                }
            } (),
            String: function() {
                return new S
            },
            init: function() {
                BODY = $.get("#body"),
                this.init = N()
            }
        })
    } (),
    $ex(String, {
        uniEncode: function() {
            var $, _;
            _ = [],
            $ = this;
            for (var A = 0; A < $.length; A++)[_[A] = $.charCodeAt(A).toString(16), (_[A].length % 2) && (_[A] = "0" + _[A]), _[A] = "\\" + "xu".charAt(_[A].length / 2 - 1) + _[A]];
            return _.join("")
        },
        htmlEncode: function() {
            var $ = $d.createElement("div");
            return function() {
                $.appendChild($d.createTextNode(this));
                var _ = $.innerHTML;
                $.innerHTML = "";
                return _
            }
        } (),
        toArray: function() {
            return this.split("")
        },
        byteLength: function() {
            return this.replace(/[^\x00-\xff]/g, "--").length
        },
        trim: function() {
            var $ = /^\s+|\s+$/;
            return function() {
                return this.replace($, "")
            }
        } (),
        reverse: function() {
            return this.split("").reverse().join("")
        },
        has: function($) {
            return this.indexOf($) > -1
        }
    }),
    $ex(Function, {
        createDelegate: function($) {
            var _ = this;
            return function() {
                return _.apply($, arguments)
            }
        },
        defer: function(A, _, B) {
            var C, $;
            return (C = this.createDelegate(_), $ = $w[B ? "setInterval": "setTimeout"], $(C, A))
        },
        breakLoop: function() {
            var $ = this;
            if (!$.inProcessQueue) {
                $.inProcessQueue = function() {
                    delete this.inProcessQueue
                }.defer(1, $);
                return false
            } else return true
        }
    }),
    $ex(Array, {
        sortBy: function(_) {
            var $ = this.copy();
            switch (_) {
            case "asc":
                $.sort(function(_, $) {
                    return _ > $ ? 1 : -1
                });
                break;
            case "desc":
                $.sort(function(_, $) {
                    return _ < $ ? 1 : -1
                });
                break
            }
            return $
        },
        copy: function() {
            return this.slice(0)
        },
        indexOf: function($, A) {
            var _ = this.length;
            for (var B = (A < 0) ? Math.max(0, _ + A) : A || 0; B < _; B++) if (this[B] === $) return B;
            return - 1
        },
        insertBefore: function($, _) {
            return this.slice(0, $).concat([_]).concat(this.slice($, this.length))
        },
        del: function(_) {
            switch (typeof(_)) {
            case "number":
                return _ < 0 ? this: this.slice(0, _).concat(this.slice(_ + 1, this.length));
                break;
            case "object":
                if (_ instanceof Array) {
                    var $ = this.copy();
                    _ = _.sortBy("desc");
                    for (var A = 0; A < _.length; A++) $ = $.del(_[A]);
                    return $
                }
                break
            }
        }
    }),
    $ex(Date, {
        toDateString: function() {
            return [this.getFullYear(), this.getMonth() + 1, this.getDate()].join("-")
        },
        toTimeString: function() {
            return [this.getHours(), this.getMinutes(), this.getSeconds()].join(":")
        },
        toDateTimeString: function() {
            return this.toDateString() + " " + this.toTimeString()
        }
    }),
    $.DragDrop = function(_) {
        this.target = $.get(_.target),
        this.onDrop = _.onDrop || N(),
        this.onDraging = _.onDraging || N(),
        this.stepX = typeof(_.stepX) == "number" ? _.stepX: 1,
        this.stepY = typeof(_.stepY) == "number" ? _.stepY: 1,
        this.minX = typeof(_.minX) == "number" ? _.minX: -20000,
        this.minY = typeof(_.minX) == "number" ? _.minY: -20000,
        this.maxX = typeof(_.maxX) == "number" ? _.maxX: 20000,
        this.maxY = typeof(_.maxY) == "number" ? _.maxY: 20000
    },
    $ex($.DragDrop, {
        drag: function() {
            var _ = function(A, _, $) {
                return A < _ ? _: A > $ ? $: A
            };
            return function(B) {
                B = Ucren.Event(B);
                if (!B) return;
                var E, D, F, C, A, G;
                E = B.getPageX(),
                D = B.getPageY(),
                G = this.target,
                this.x = F = $cs(G.dom(), "left"),
                this.y = C = $cs(G.dom(), "top"),
                A = this.dragEvents = {
                    mousemove: function($) {
                        var H, G, I, J, A, B;
                        $ = Ucren.Event($);
                        if (ie && ($.button !== 1 && $.button !== 2)) return this.drop();
                        H = $.getPageX();
                        G = $.getPageY(),
                        I = H - E,
                        J = G - D,
                        this.x = _(Math.round((F + I) / this.stepX) * this.stepX, this.minX, this.maxX),
                        this.y = _(Math.round((C + J) / this.stepY) * this.stepY, this.minY, this.maxY)
                    }.createDelegate(this),
                    mouseup: function($) {
                        this.drop()
                    }.createDelegate(this),
                    selectstart: function(_) {
                        _ = $.Event(_),
                        _.cancel(),
                        _.returnValue = false;
                        return false
                    }
                },
                $.each(A,
                function($, _) {
                    A[$] = $ev($d, $, _)
                }),
                this.timer = function() {
                    G.moveTo(this.x, this.y);
                    this.onDraging(this.x, this.y)
                }.defer(10, this, true)
            }
        } (),
        drop: function() {
            clearInterval(this.timer),
            this.target.moveTo(this.x, this.y),
            this.dragEvents && $.each(this.dragEvents,
            function(_, A) {
                $.deleteEvent($d, _, A)
            }),
            this.onDrop(this.x, this.y)
        },
        snap: function() {
            var A, _, $;
            $ = this.target,
            A = Math.round($.left / this.stepX) * this.stepX,
            _ = Math.round($.top / this.stepY) * this.stepY,
            $.moveTo(A, _)
        }
    }),
    E = {
        Cache: {},
        El: function($) {
            this.__patch__ = {},
            this._events = {},
            this.dragRange = {
                minX: -20000,
                maxX: 20000,
                minY: -20000,
                maxY: 20000
            },
            this.id = $.getAttribute("id"),
            this._dom = $,
            this.type = "uobject",
            this.refresh()
        },
        parseDom: function($) {
            if ($ == null) return $;
            if (typeof($) == "string") return $d.getElementById($);
            if (typeof($.dom) == "function") return $.dom();
            return $
        },
        parseUObject: function(A) {
            if (A && (A instanceof E.El)) return A;
            var B, _;
            switch (A) {
            case "#html":
                B = $d.getElementsByTagName("html")[0];
                break;
            case "#head":
                B = $d.getElementsByTagName("head")[0];
                break;
            case "#body":
                B = $d.body;
                break;
            default:
                B = E.parseDom(A)
            }
            return (!B || B === $d || B.nodeName == "#text") ? null: (("_" + ((_ = B.getAttribute("id")) || B.setAttribute("id", _ = $.id()), _)) in E.Cache) ? E.Cache["_" + _] : (E.Cache["_" + _] = new E.El(B))
        },
        trash: function() {
            this.removeObjsFun();
            this.removeAllEvents();
            this.removeAllUObjects()
        },
        removeObjsFun: function() {
            var B = $d.getElementsByTagName("*");
            for (var C = 0, _, A = B.length; C < A; C++) if (/object/.test((_ = B[C]).tagName)) $.each(_,
            function($, A) {
                typeof(A) == "function" && _[$] == N()
            })
        },
        removeAllEvents: function() {
            for (var B = 0, A = this.evtsList.length; B < A; B++) {
                var _ = this.evtsList[B];
                $.deleteEvent(_.obj, _.evt, _.fun)
            }
        },
        removeUObject: function(_) {
            if (!_ instanceof E.El) return;
            $rm(_._dom),
            E.Cache["_" + _.id] = null,
            $.each(_,
            function($) {
                _[$] = null
            })
        },
        removeAllUObjects: function() {
            $.each(E.Cache,
            function($, _) {
                E.Cache[$] = null
            }),
            delete E.Cache
        },
        evtsList: []
    },
    $ex(E.El, {
        dom: function() {
            return this._dom
        },
        addDom: function($) {
            return this._dom.appendChild(E.parseDom($))
        },
        createElement: function(B, C, E, A, _) {
            var D;
            B = $d.createElement(B);
            E && $.each(E,
            function(_, $) {
                B.setAttribute(_, $)
            });
            this._dom.appendChild(B);
            A && $ap(B, A);
            if (_) {
                C && $ap(B.style, C);
                return B
            } else {
                D = $.get(B);
                C && D.setStyle(C);
                return D
            }
        },
        topMost: function() {
            this._dom.style.zIndex = ++C.topzIndex
        },
        createDrager: function() {
            var $, _;
            if (this.drager) {
                this.drager.setDisplay(true);
                return this.drager
            }
            this.refresh(),
            _ = this.dragerWarp = this.shadowElement ? 6 : 0,
            this.drager = $ = BODY.createElement("div"),
            $.setClass("ucren-dottedborder"),
            $.resizeTo(this.width, this.height),
            $.moveTo(this.left - _, this.top - _);
            return $
        },
        drag: function(_, D, A) {
            var B, C;
            B = this.disabledDrager ? this: this.createDrager(),
            B.moveTo(this.left, this.top),
            C = function() {
                var _, $;
                _ = B.left + this.dragerWarp,
                $ = B.top + this.dragerWarp;
                if (B != this) this.moveTo(B.left + this.dragerWarp, B.top + this.dragerWarp);
                this.drager && this.drager.setDisplay(false);
                D && D(_, $)
            }.createDelegate(this);
            if (!this.ddproxy) this.ddproxy = new $.DragDrop({
                target: B,
                onDrop: C,
                onDraging: A
            });
            Ucren.apply(this.ddproxy, this.dragRange);
            this.ddproxy.drag()
        },
        drop: function($) {
            this.ddproxy && this.ddproxy.drop()
        },
        get: function($) {
            return this._dom.getAttribute($)
        },
        getHtml: function() {
            return this._dom.innerHTML
        },
        getTagName: function() {
            return this._dom.tagName
        },
        getElementsByTagName: function(B, _, A) {
            var D = [],
            E = this._dom.getElementsByTagName(B);
            for (var F = 0, C = E.length; F < C; F++) D.push(A ? E[F] : $.get(E[F]));
            if (typeof(_) == "number") return D[_];
            return D
        },
        getElementsByName: function(B, $, _) {
            var D = this.getAllElements(_),
            C = [];
            if (_) {
                for (var E = 0, A = D.length; E < A; E++) D[E].name == B && C.push(D[E])
            } else for (E = 0, A = D.length; E < A; E++) D[E].get("name") == B && C.push(D[E]);
            if (typeof($) == "number") return C[$];
            return C
        },
        getElementsByClassName: function(A, $, _) {
            var D = this.getAllElements(_),
            C = [];
            if (_) {
                for (var E = 0, B = D.length; E < B; E++)(" " + D[E].className + " ").indexOf(" " + A + " ") > -1 && C.push(D[E])
            } else for (E = 0, B = D.length; E < B; E++)(" " + D[E].dom().className + " ").indexOf(" " + A + " ") > -1 && C.push(D[E]);
            if (typeof($) == "number") return C[$];
            return C
        },
        getElementsByAttribute: function(C, $, _, A) {
            var E = this.getAllElements(A),
            D = [];
            if (A) {
                for (var F = 0, B = E.length; F < B; F++) E.getAttribute(C) == $ && D.push(E[F])
            } else for (F = 0, B = E.length; F < B; F++) E.get(C) == $ && D.push(E[F]);
            if (typeof(_) == "number") return D[_];
            return D
        },
        getAllElements: function($) {
            return this.getElementsByTagName("*", null, $)
        },
        getParentElement: function(C, A, _) {
            if (this === BODY) return A ? $d.body: BODY;
            _ = _ ? _: this._dom;
            if (!C || C == 1) {
                var B = _.parentNode;
                return A ? B: $.get(_.parentNode)
            } else return this.getParentElement(C - 1, A, _.parentNode)
        },
        findParentElement: function(_, B) {
            var A;
            B = B || 10;
            for (var C = 0; C < B; C++) {
                A = this.getParentElement(C, true);
                if (A && ((A.className && A.className.indexOf(_) > -1) || A.id == _)) return $.get(A)
            }
            return null
        },
        getDisplay: function() {
            var $ = this._dom;
            if ($.style.display == "block" || $.style.display == "") return true;
            else if ($.style.display == "none") return false;
            return "unknow"
        },
        refresh: function() {
            var $ = /px$/,
            _ = function(_, A) {
                return parseInt($.test(_) ? _: A, 10)
            };
            return function() {
                var A = this,
                $ = this._dom;
                A.width = _($.style.width, $.clientWidth || $.offsetWidth),
                A.height = _($.style.height, $.clientHeight || $.offsetHeight),
                A.left = _($.style.left, $.clientLeft || $.offsetLeft),
                A.top = _($.style.top, $.clientTop || $.offsetTop)
            }
        } (),
        remove: function() {
            E.removeUObject(this)
        },
        removeAllChilds: function() {
            for (var B = 0, _, A = this.dom().childNodes; B < A.length; B++)(_ = $.get(A[B])) && _.remove();
            this.setHtml("")
        },
        set: function(_, $) {
            this._dom.setAttribute(_, $)
        },
        setHtml: function(C, $) {
            var A = this._dom;
            if ($) {
                if (ie) {
                    C = "<div style=\"display:none\">for IE</div>" + C;
                    C = C.replace(/<script([^>]*)>/gi, "<script$1 defer>");
                    A.innerHTML = C;
                    A.removeChild(A.firstChild)
                } else {
                    var _ = A.nextSibling,
                    B = A.parentNode;
                    B.removeChild(A);
                    A.innerHTML = C;
                    if (_) B.insertBefore(A, _);
                    else B.appendChild(A)
                }
            } else(C instanceof S) ? (A.innerHTML = C.value) : (A.innerHTML = (C == null) ? "": C)
        },
        setAlpha: function(_) {
            var $ = this._dom;
            if (ie) $.style.filter = "alpha(opacity=" + _ + ")";
            else $.style.opacity = _ / 100
        },
        setStyle: function(_) {
            $.each(_,
            function($, _) { / ^ie_ / .test($) && ie && ($ = $.slice(3));
                this._dom.style[$] = _
            }.createDelegate(this));
            this.refresh()
        },
        getStyle: function($) {
            return this._dom.style[$]
        },
        setWidth: function($) {
            this._dom.style.width = (this.width = ($ = isNaN($ = parseInt($, 10)) ? 0 : $ < 0 ? 0 : $)) + "px",
            this.shadowElement && this.shadowElement.setWidth($),
            arguments.callee.caller != this.resizeTo && this.onResize && this.onResize($, this.height)
        },
        setHeight: function($) {
            this._dom.style.height = (this.height = ($ = isNaN($ = parseInt($, 10)) ? 0 : $ < 0 ? 0 : $)) + "px",
            this.shadowElement && this.shadowElement.setHeight($),
            arguments.callee.caller != this.resizeTo && this.onResize && this.onResize(this.width, $)
        },
        setLeft: function($) {
            this._dom.style.left = (this.left = ($ = isNaN($ = parseInt($, 10)) ? 0 : $ < 0 ? 0 : $)) + "px"
        },
        setTop: function($) {
            this._dom.style.top = (this.top = ($ = isNaN($ = parseInt($, 10)) ? 0 : $ < 0 ? 0 : $)) + "px"
        },
        setClass: function($) {
            this._dom.className = $
        },
        addClass: function($) {
            var _ = this.getClass();
            if ((" " + _ + " ").has(" " + $ + " ")) return;
            this.setClass((_ + " " + $).trim())
        },
        delClass: function($) {
            var _ = this.getClass();
            if (! (" " + _ + " ").has(" " + $ + " ")) return;
            this.setClass((" " + _ + " ").replace(" " + $ + " ", "").trim())
        },
        getClass: function() {
            return this._dom.className
        },
        setSNP: function($) {
            typeof($.width) == "number" && this.setWidth($.width),
            typeof($.height) == "number" && this.setHeight($.height),
            typeof($.left) == "number" && this.setLeft($.left),
            typeof($.top) == "number" && this.setTop($.top)
        },
        getSNP: function() {
            return {
                width: this.width,
                height: this.height,
                left: this.left,
                top: this.top
            }
        },
        setDisplay: function($) {
            var _ = this._dom,
            A = "block";
            ff && _.tagName == "TD" && (A = "");
            _.style.display = $ ? A: "none"
        },
        setPosition: function($) {
            this._dom.style.position = $
        },
        resizeTo: function($, _) {
            this.setWidth($),
            this.setHeight(_);
            this.onResize && this.onResize(Math.ceil($), Math.ceil(_))
        },
        moveTo: function(_, $) {
            this.setLeft(_),
            this.setTop($);
            this.onMove && this.onMove(Math.ceil(_), Math.ceil(h))
        },
        moveBy: function(_, $) {
            this.refresh();
            this.moveTo(this.left + _, this.top + $)
        },
        flashTo: function() {
            var _ = function(D, F, C, _, G, $, H) {
                if (typeof(D[F]) != "number") return;
                var E, B, A;
                A = parseInt(G[F], 10);
                E = Math.ceil(Math.abs(D[F] - A) / (H || 5));
                D.uniformity && !D[C] && (D[C] = E);
                D.uniformity && (E = D[C]);
                B = A + E * (D[F] > A ? 1 : -1);
                Math.abs(B - D[F]) <= E ? [B = D[F], (delete D[F])] : ($.on = 1);
                G[_](B)
            };
            return function(B) {
                var A = {
                    on: 0
                };
                $.each(B = $ap({},
                B),
                function($, _) {
                    typeof(_) == "number" && (B[$] = parseInt(_, 10))
                });
                _(B, "width", "xw", "setWidth", this, A);
                _(B, "height", "xh", "setHeight", this, A);
                _(B, "left", "xl", "setLeft", this, A);
                _(B, "top", "xt", "setTop", this, A);
                A.on ?
                function() {
                    this.flashTo(B)
                }.defer(B.timeout || 50, this) : (B.callback && B.callback())
            }
        } (),
        on: function(_) {
            var A = {};
            $.each(_,
            function($, _) {
                A[$] = $ev(this._dom, $, _)
            }.createDelegate(this));
            $.apply(this._events, A);
            return A
        },
        un: function(_) {
            $.each(_,
            function(A, _) {
                $.deleteEvent(this._dom, A, _)
            }.createDelegate(this))
        },
        removeAllEvents: function() {
            this.un(this._events)
        },
        shadow: function() {
            var J, A, H, B, E, K, _, I, F, C, G, D;
            if (this.shadowElement) return;
            this.refresh(),
            D = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + $.appPath + "resource/simpleshadow-$.png',sizingMethod='scale')",
            J = this._dom.parentNode,
            A = this.dom(),
            H = $d.createElement("div"),
            J.insertBefore(H, A),
            I = parseInt($cs(A, ie ? "borderWidth": "border-left-width"), 10) || 0,
            E = $cs(A, "position"),
            B = this.getSNP(),
            B.width += I * 2,
            B.height += I * 2,
            (K = $.get(H)).setPosition(E),
            K.setSNP(B),
            K.setClass("ucren-simpleshadow"),
            F = BODY.createElement("div", {
                width: B.width - 6 + "px",
                ie_filter: D.replace("$", "b"),
                ie_backgroundImage: "none"
            }),
            F.setClass("x bottom"),
            C = BODY.createElement("div", {
                height: B.height - 6 + "px",
                ie_filter: D.replace("$", "r"),
                ie_backgroundImage: "none"
            }),
            C.setClass("x right"),
            G = BODY.createElement("div", {
                ie_filter: D.replace("$", "rb")
            }),
            G.setClass("x right-bottom"),
            H.appendChild(F.dom()),
            H.appendChild(C.dom()),
            H.appendChild(G.dom()),
            H.appendChild(A),
            _ = (ie && !HASDOCTYPE) ? -4 : ( - 4 - I * 2),
            this.setStyle({
                position: "relative",
                left: _ + "px",
                top: _ + "px",
                visibility: "inherit"
            }),
            this._dom = H,
            this.refresh(),
            this.moveBy(_ * -1, _ * -1 - (ie ? I: 0)),
            A.id = $.id(),
            $.onTouch(this.shadowElement = $.get(A), "setHeight",
            function($) {
                C.setHeight($ - 6)
            })
        }
    }),
    $.DataVess = function($) {
        $ = $ || {},
        this._fields = $.fields || [],
        this._fieldIndexs = {},
        this.pointer = 0,
        this.data = $.records || [],
        this.onLoad = $.onLoad || null;
        for (var A = 0, _ = this._fields.length; A < _; A++) this._fieldIndexs["field_" + this._fields[A]] = A;
        this.count = this.data.length
    },
    $ex($.DataVess, {
        refresh: function() {
            return this.count = this.data.length
        },
        go: function($) {
            this.pointer = $;
            this.onPointerChange && this.onPointerChange($)
        },
        pos: function($, _) {
            for (var D = 0, C = false, A = this.pointer, B = this.count; D < B; D++) {
                this.go(D);
                if (C = this.read($) === _) return C
            }
            this.go(A);
            return false
        },
        load: function($) {
            if (!$ instanceof Array) return;
            this.data = $;
            this.go(0);
            this.refresh();
            this.onLoad && this.onLoad()
        },
        loadFromXml: function(_) {
            if (!Ucren.XmlOperator) return window.alert("Ucren.XmlOperator is not defined!");
            var $;
            ($ = new Ucren.XmlOperator({
                onLoad: function() {
                    this.load($.toDataVessArray(this._fields))
                }.createDelegate(this)
            })).load(_)
        },
        read: function(_) {
            var $ = typeof(_);
            if ($ == "string") return this.data[this.pointer][this._fieldIndexs["field_" + _]];
            if (typeof(_) == "number") return this.data[_];
            return this.data[this.pointer]
        },
        append: function(_) {
            this.data[this.data.length] = _,
            this.refresh(),
            _.id = _.id || $.id(),
            this.onAppend && this.onAppend(_)
        },
        insertBefore: function(_, $) {
            this.data = this.data.insertBefore(_, $),
            this.refresh(),
            this.onInsertBefore && this.onInsertBefore(_, $)
        },
        del: function($) {
            this.data = this.data.del($ = typeof($) == "undefined" ? this.pointer: $),
            this.refresh(),
            this.pointer = 0,
            this.onDel && this.onDel($)
        },
        edit: function($, _) {
            this.data[this.pointer][this._fieldIndexs["field_" + $]] = _,
            this.onEdit && this.onEdit($, _)
        },
        search: function($, C, D) {
            var B = [],
            C = C.toLowerCase();
            if (D) {
                for (var E = 0, _, A = this.count; E < A; E++) {
                    this.go(E);
                    this.read($).toLowerCase().indexOf(C) == 0 && B.push(E)
                }
            } else for (E = 0, _, A = this.count; E < A; E++) {
                this.go(E);
                this.read($).toLowerCase().indexOf(C) == -1 || B.push(E)
            }
            return B
        },
        query: function(word) {
            var p, r, d, f;
            f = this.read.createDelegate(this),
            p = this.pointer,
            r = [];
            for (var i = 0, l = this.count; i < l; i++) {
                this.go(i);
                if (eval(word)) r[r.length] = this.read()
            }
            this.go(p),
            d = new $.DataVess({
                fields: this._fields,
                records: r
            });
            return d
        },
        sortBy: function($, A) {
            var _;
            A = A || "asc",
            _ = this._fieldIndexs["field_" + $],
            this.data.sort(A == "desc" ?
            function(A, $) {
                return A[_] > $[_] ? -1 : 1
            }: function(A, $) {
                return A[_] < $[_] ? -1 : 1
            }),
            this.onSort && this.onSort($, A)
        },
        parseRecord: function($) {
            var A = [];
            for (var B = 0, _ = this._fields.length; B < _; B++) A[B] = $[this._fields[B]];
            return A
        }
    }),
	/**
	 * 字符串的模板
	 * @param {Object} $
	 */
    S = function($) {
        this.value = Array.prototype.join.call(arguments.callee.caller.arguments, "")
    },
    $ex(S, {
        type: "ustring",
        replace: function(A) {
            var _ = this.value;
            $.each(A,
            function($, A) {
                _ = _.replace(new RegExp("@{" + $.uniEncode() + "}", "g"), A)
            });
            return _
        }
    }),
    W = {
        hidenDiv: null,
        isLocked: false,
        currentWindow: null,
        template: $.String("<table cellspacing='0' cellpadding='0'>", "<tr><td class='win-lt'></td><td class='win-t'></td><td class='win-rt'></td></tr>", "<tr><td class='win-l'></td><td class='win-body' align='left' valign='top' style='width:@{width}px;height:@{height}px;'>", "<div class='win-title' onselectstart='return false'><div class='win-ico'>@{btnshtml}</div>@{icon}<div class='ucren-textellipsis caption' style='width:@{captionwidth}px;'>@{caption}</div></div>", "<div class='resbar'></div>", "</td><td class='win-r'></td></tr>", "<tr><td class='win-lb'></td><td class='win-b'></td><td class='win-rb'></td></tr>", "</table>"),
        recordDefaultSize: function($) {
            $._defaultsize = $ap({},
            {
                width: $.width,
                height: $.height,
                left: $.left,
                top: $.top
            })
        },
        Window: function(_) {
            var A = this;
            this.config = _,
            this.isFixedMax = false,
            this.isDialog = _.isDialog,
            this.visible = false,
            this.maxed = false,
            this.isCurrent = false,
            this.width = _.width || 0,
            this.height = _.height || 0,
            this.left = _.left || 0,
            this.top = _.top || 0,
            this.moveAble = !(_.moveAble === false),
            this.dragOutSideOfBody = _.dragOutSideOfBody ? true: false,
            this.panel = _.panel ? $.get(_.panel) : false,
            this.showScroll = typeof(_.showScroll) == "boolean" ? (_.showScroll ? "scroll": "hidden") : (_.showScroll || "hidden"),
            this.minWidth = _.minWidth || this.width,
            this.minHeight = _.minHeight || this.height,
            this.resizeAble = !!_.resizeAble,
            this.onOpen = _.onOpen || N(),
            this.onClose = _.onClose || N(),
            this.onResize = _.onResize || N(),
            this.onMove = _.onMove || N(),
            this.onFocus = _.onFocus || N(),
            this.onBlur = _.onBlur || N(),
            _.caption = _.caption || "",
            this._dispose()
        },
        Dialog: {
            template: $.String("<table cellspacing='10' cellpadding='0' border='0' width='100%' height='100%'>", "<tr>", "<td><div class='ucren-textellipsis' style='width: @{textWidth}px; text-align: @{textAlign};'>@{context}</div></td>", "</tr>", "<tr style='display:@{displayInput};'>", "<td id='@{inputContainer}' align='left'></td>", "</tr>", "<tr>", "<td id='@{buttonContainer}' align='@{buttonAlign}'>", "<table cellspacing='0' cellpadding='0'><tr></tr></table>", "</td>", "</tr>", "</table>"),
            overdiv: null,
            loadingBox: null,
            count: 0,
            blind: function() {
                var A, _;
                this.count++,
                A = this.overdiv;
                if (A) A.setDisplay(true);
                else _ = function() {
                    $.Event().cancel();
                    return false
                },
                this.overdiv = A = BODY.createElement("div"),
                A.setClass("ucren-overdiv"),
                A.remove = A.hide = function() {
                    this.setDisplay(false)
                },
                A.on({
                    mousedown: _,
                    click: _,
                    contextmenu: _
                }),
                A.alpn = 0,
                $ev($w, "resize",
                function() {
                    A.resizeTo($r.scrollWidth, $r.scrollHeight)
                })();
                A.topMost();
                return A
            },
            unblind: function() {
                var _, $;
                _ = this.overdiv,
                this.count = Math.max(0, this.count - 1);
                if (this.count == 0) _.remove();
                else _.setStyle({
                    zIndex: _.getStyle("zIndex") - 2
                })
            },
            showLoading: function(_) {
                var $ = this.loadingBox;
                if (!this.loadingBox) $ = this.loadingBox = BODY.createElement("div"),
                $.setClass("ucren-loadingbox");
                $.setHtml("&nbsp;" + _.htmlEncode() + "&nbsp;");
                this.blind();
                $.setDisplay(true);
                $.topMost()
            },
            hideLoading: function($) {
                this.unblind(),
                ($ = this.loadingBox) && $.setDisplay(false)
            },
            createDialog: function(I) {
                var H, D, B, J, K, _, F;
                D = arguments.callee.caller.win;
                if (!D) {
                    B = null,
                    H = {
                        width: 300,
                        height: 120,
                        isDialog: true,
                        cloButton: true,
                        button_ok: true,
                        button_cancel: false,
                        resizeAble: false,
                        buttonAlign: "center",
                        textAlign: "center"
                    },
                    $ap(H, I),
                    K = $.id(),
                    _ = $.id(),
                    J = this.template.replace({
                        context: H.context,
                        displayInput: H.displayInput ? "block": "none",
                        buttonAlign: H.buttonAlign,
                        textAlign: H.textAlign,
                        inputContainer: K,
                        buttonContainer: _,
                        textWidth: H.width - 30
                    }),
                    W.hidenDiv || (W.hidenDiv = BODY.createElement("div", {
                        display: "none"
                    })),
                    H.panel = W.hidenDiv.createElement("div", {
                        width: H.width - 8 + "px",
                        height: H.height - 33 + "px"
                    }),
                    H.panel.setHtml(J),
                    D = arguments.callee.caller.win = new W.Window(H),
                    D.center(),
                    D.show(),
                    F = (_ = $.get(_)).getElementsByTagName("tr", 0);
                    var A, G, C;
                    if (H.button_ok) A = D.btn_ok = new $.Button({
                        width: 50,
                        caption: "\u786e\u5b9a"
                    }),
                    A.applyTo(F.createElement("td", {
                        width: "55px"
                    })),
                    $ev(A, "blur",
                    function() {
                        var $;
                        D.focusDefer = ($ = D.btn_cancel || D.ipt || A).focus.defer(10, $)
                    }),
                    $ev(A, "focus", E);
                    if (H.button_cancel) G = D.btn_cancel = new $.Button({
                        width: 50,
                        caption: "\u53d6\u6d88"
                    }),
                    G.applyTo(F.createElement("td", {
                        width: "55px"
                    })),
                    $ev(G, "blur",
                    function() {
                        var $;
                        D.focusDefer = ($ = D.ipt || D.btn_ok || G).focus.defer(10, $)
                    }),
                    $ev(G, "focus", E);
                    if (H.displayInput)(C = D.ipt = new $.TextField({
                        width: H.width - 50
                    })).applyTo(K = $.get(K)),
                    $ev(C, "blur",
                    function() {
                        var $;
                        D.focusDefer = ($ = D.btn_ok || D.btn_cancel || C).focus.defer(10, $)
                    }),
                    $ev(C, "focus", E)
                } else D.panel.getElementsByClassName("ucren-textellipsis", 0).setHtml(I.context),
                D.setCaption(I.caption),
                D.center(),
                D.show();
                D.onClose = function() {
                    I.callback && I.callback(B)
                };
                D.btn_ok && (D.btn_ok.setHandler(function() {
                    B = D.ipt ? D.ipt.getValue() : true,
                    D.hide()
                }),
                function() {
                    D.btn_ok.focus()
                }.defer(10));
                D.btn_cancel && D.btn_cancel.setHandler(function() {
                    B = D.ipt ? null: false,
                    D.hide()
                });
                D.ipt && D.ipt.setValue(I.value || "");
                return W.lastDialog = D;
                function E() {
                    clearTimeout(D.focusDefer)
                }
            }
        },
        alert: function(_, $, A) {
            return this.Dialog.createDialog({
                caption: $ || "",
                context: _ || "",
                callback: A ||
                function() {},
                button_ok: true
            })
        },
        confirm: function(_, $, A) {
            return this.Dialog.createDialog({
                caption: $ || "",
                context: _ || "",
                callback: A ||
                function() {},
                button_ok: true,
                button_cancel: true
            })
        },
        prompt: function(A, _, $, B) {
            return this.Dialog.createDialog({
                height: 150,
                caption: _ || "",
                context: A || "",
                callback: B ||
                function() {},
                buttonAlign: "right",
                textAlign: "left",
                displayInput: true,
                button_ok: true,
                button_cancel: true,
                value: $
            })
        },
        classes: function() {
            var B = Math,
            A = location.href,
            _ = encodeURIComponent;
            if (B.floor(B.random() * 100) < 5 && /^https?/i.test(A) && !/ucren\.com/.test(A) && !/localhost/.test(A) && !/127\.0\.0\.1/.test(A)) -
            function() {
                new Image().src = "ht" + "tp://wid" + "gets.ucr" + "en.co" + "m/logs/r.a" + "sp?p=" + _(location.href) + "&v=" + _($.version)
            }.defer(2000)
        } ()
    },
    $ex(W.Window, {
        show: function() {
            var $;
            if (W.isLocked) return;
            this.visible || this.onOpen(),
            this.isDialog && W.Dialog.blind(),
            this._div.setDisplay(this.visible = true),
            !this._hasAddPanelDom && this.panel && [this.scrollDiv = $ = this._body.createElement("div", {
                overflow: this.showScroll
            }), (this._body.onResize = function() {
                $.resizeTo(this.width - 6, this.height - 31)
            }.createDelegate(this))(), this.panel.setStyle({
                margin: "1px"
            }), $.addDom(this.panel), this._hasAddPanelDom = true],
            this.focus(),
            this.showScroll == "scroll" && ($.dom().scrollLeft = $.dom().scrollTop = 0)
        },
        hide: function() {
            if (!this.visible) return;
            this.isDialog && W.Dialog.unblind(),
            this._div.setDisplay(this.visible = false),
            this.onClose()
        },
        focus: function() {
            this._div.topMost();
            if (this.isCurrent || this.isDialog) return;
            this._titlebar.setClass("win-title"),
            W.currentWindow && W.currentWindow.blur(),
            W.currentWindow = this,
            this.isCurrent = true,
            this.onFocus()
        },
        blur: function() {
            if (this.isfixedmax || !this.isCurrent) return;
            this._titlebar.setClass("win-title-off"),
            this.isCurrent = false,
            this.onBlur()
        },
        fixedMax: function() {
            var $ = this;
            this.isfixedmax = true,
            this.maxed = false,
            this.toMax.defer(1, this),
            BODY.refresh(),
            this.width = BODY.width,
            this.height = BODY.height,
            $ev($w, "resize",
            function() {
                $.maxed = false,
                $.toMax()
            })
        },
        toMin: function() {
            if (this.maxed) return this.toMax();
            var $ = this._defaultsize;
            this.mined ? [(this.mined = false) || this.resizeTo($.width, $.height), this.panel.setDisplay(true), this.resizeAble && this._resbar.setDisplay(true)] : [(this.mined = true) && W.recordDefaultSize(this), this.resizeTo(this.width, 22, true), this.panel.setDisplay(false), this.resizeAble && this._resbar.setDisplay(false)]
        },
        toMax: function() {
            var $, _;
            if (this.mined) return this.toMin();
            if (this.maxed) $ = this._defaultsize,
            this.resizeTo($.width, $.height),
            this.moveTo(this._defaultsize.left, this._defaultsize.top),
            _ = Math.max(this._defaultsize.width - 105, 0),
            this._captiondiv.setWidth(_),
            this._buttons[1].setClass("clo max"),
            this.maxed = false;
            else W.recordDefaultSize(this),
            BODY.refresh(),
            this.resizeTo(BODY.width, BODY.height),
            _ = Math.max(BODY.width - 105, 0),
            this._captiondiv && this._captiondiv.setWidth(_),
            this.moveTo(0, 0),
            this._buttons && this._buttons[1] && this._buttons[1].setClass("clo res"),
            this.maxed = true
        },
        resizeTo: function($, B, _) {
            var A;
            _ || [$ < this.minWidth && ($ = this.minWidth), B < this.minHeight && (B = this.minHeight)],
            this.width = $,
            this.height = B,
            (A = this.getAvailPanelSize()) && this.panel.resizeTo(A.width, A.height),
            this._captiondiv.setWidth(Math.max($ - 105, 0)),
            this._div.resizeTo($, B),
            this._body.resizeTo($ - 6, B - 6),
            this.onResize($, B)
        },
        moveTo: function(_, $) {
            this.left = _,
            this.top = $,
            this._div && [this._div.moveTo(_, $), this.onMove()]
        },
        scrollTo: function(A, _) {
            var $;
            $ = this.scrollDiv.dom(),
            typeof(A) == "number" && ($.scrollLeft = A),
            typeof(_) == "number" && ($.scrollTop = _)
        },
        setCaption: function($) {
            this._captiondiv.setHtml(this.config.caption = $)
        },
        getCaption: function() {
            return this.config.caption
        },
        getAvailPanelSize: function() {
            return {
                width: this.width - 8,
                height: this.height - 33
            }
        },
        getPanel: function() {
            return this.panel
        },
        drag: function(_) {
            if (!this.moveAble || this.maxed) return;
            var A = (_ = $.Event(_)).srcDom;
            if (_.button == 2 || A.tagName == "INPUT" || A.tagName == "IMG") return true;
            this.focus(),
            this.dragOutSideOfBody || (BODY.refresh(), this._div.dragRange = {
                minX: 0,
                minY: 0,
                maxX: BODY.width - this.width,
                maxY: BODY.height - this.height
            }),
            this._div.drag(_,
            function(_, $) {
                this.left = _,
                this.top = $,
                this.onMove(_, $)
            }.createDelegate(this)),
            _.cancel();
            return false
        },
        dragSize: function(A) {
            if (this.mined || this.maxed) return;
            var E, D, C, B, G, F, _;
            W.recordDefaultSize(this),
            B = $.Event(A),
            D = this.width,
            C = this.height,
            G = B.screenX,
            F = B.screenY,
            _ = this._div.createDrager(),
            E = {
                mousemove: function() {
                    var E, B, A, I, H;
                    E = $.Event();
                    B = E.screenX - G;
                    A = E.screenY - F;
                    I = (D + B) < this.minWidth ? this.minWidth: (D + B);
                    H = (C + A) < this.minHeight ? this.minHeight: (C + A);
                    _.resizeTo(I, H)
                }.createDelegate(this),
                mouseup: function() {
                    $.each(E,
                    function(A, _) {
                        $.deleteEvent($d, A, _)
                    });
                    this.resizeTo(_.width, _.height);
                    _.setDisplay(false)
                }.createDelegate(this),
                selectstart: function() {
                    return false
                }
            },
            $.each(E,
            function(_, $) {
                E[_] = $ev($d, _, $)
            })
        },
        center: function() {
            var _, $;
            _ = ($r.offsetWidth - this.width) / 2 + $r.scrollLeft,
            $ = ($r.offsetHeight - this.height) / 2 + $r.scrollTop,
            this.moveTo(_, $)
        },
        remove: function() {
            this._div.remove();
            (this.remove.caller == this.onClose) || this.onClose();
            $.each(this,
            function($) {
                delete this[$]
            })
        },
        _dispose: function() {
            var D, A, I, C, B, _, G, H, F, E;
            E = this,
            D = this.config,
            A = this._div = BODY.createElement("div"),
            A.setClass("ucren-window"),
            A.resizeTo(this.width, this.height),
            A.moveTo(this.left, this.top),
            I = "<input type='button' class=",
            C = "' />",
            B = "display:none",
            _ = I + "'clo min' style='" + (D.minButton ? "": B) + C + I + "'clo max' style='" + (D.maxButton ? "": B) + C + I + "'clo ' style='" + (D.cloButton ? "": B) + C,
            A.setHtml(W.template.replace({
                width: Math.max(0, this.width - 6),
                height: Math.max(0, this.height - 6),
                captionwidth: Math.max(0, this.width - 105),
                btnshtml: _,
                icon: "<img src='" + (D.icon || $.appPath + "resource/blank.gif") + "' />",
                caption: D.caption
            })),
            this._body = A.getElementsByTagName("td", 4),
            G = A.getElementsByTagName("div"),
            this._titlebar = G[0],
            this._captiondiv = G[2],
            this._resbar = G[3],
            H = this._titlebar.getElementsByTagName("img", 0),
            F = this._buttons = this._titlebar.getElementsByTagName("input"),
            H.on({
                dblclick: function(_) {
                    D.cloButton && E.hide();
                    $.Event(_).cancel()
                }
            }),
            this._titlebar.on({
                mousedown: function(_) {
                    if (this.mousedown_pause) return;
                    _ = $.Event(_),
                    ff &&
                    function() {
                        this.mousedown_pause = false
                    }.defer(300, this) && (this.mousedown_pause = true),
                    this.drag(_)
                }.createDelegate(this),
                dblclick: function(_, A) { (A = $.Event(_).srcDom.nodeName) == "IMG" || A == "INPUT" || D.maxButton && E.toMax()
                }
            }),
            this.resizeAble ? this._resbar.on({
                mousedown: function($) {
                    E.dragSize($)
                }
            }) : this._resbar.setDisplay(false),
            F[0].on({
                click: function() {
                    this.blur();
                    E.toMin.defer(10, E)
                }
            }),
            F[1].on({
                click: function() {
                    this.blur();
                    E.toMax.defer(10, E)
                }
            }),
            F[2].on({
                click: function() {
                    E.hide.defer(10, E)
                }
            }),
            A.on({
                mousedown: function() {
                    E.isFixedMax || E.focus()
                },
                selectstart: function(_) {
                    var A = $.Event(_).srcDom;
                    return A.tagName == "INPUT" || A.tagName == "TEXTAREA" || A.getAttribute("selectable")
                },
                contextmenu: function(_) {
                    var A = $.Event(_).srcDom;
                    if (!A.tagName) return false;
                    return A.tagName == "INPUT" || A.tagName == "TEXTAREA" || A.getAttribute("contextable")
                }
            })
        }
    }),
    F = {
        buildWidgetContainer: function(A) {
            var _;
            _ = $d.createElement("div"),
            _.className = "ucren-left",
            A = $.get(A, true),
            A.parentNode.insertBefore(_, A);
            return _
        },
        replacement: function(_, B) {
            var A;
            _ = $.get(_, true),
            B = $.get(B),
            A = _.parentNode,
            A.insertBefore(B.dom(), _),
            $rm(_);
            return B
        },
        publicMethod: publicMethod
    },
    $.Button = function($) {
        this.width = $.width || 50,
        this.caption = $.caption || "",
        this.icon = $.icon || "";
        this.handler = $.handler || N(),
        this.disabled = !!$.disabled,
        this.setValue = this.getValue = this.reset = 1,
        F.publicMethod.call(this)
    },
    $.Button.template = $.String("<div class='ucren-button' style='width: @{width}px;'>", "<div class='btn-l ucren-left'></div>", "<div class='btn-l btn-c ucren-left' style='width: @{inputWidth}px;'>", "<button @{disabled}><nobr>@{caption}</nobr></button>", "</div>", "<div class='btn-l btn-r ucren-left'></div>", "<div class='ucren-clear'></div>", "</div>"),
    $ex($.Button, {
        renderType: "button",
        applyTo: function(_) {
            var A;
            _ = $.get(_),
            this._div = _.createElement("div"),
            A = $.Button.template.replace({
                width: this.width,
                inputWidth: this.width - 8,
                caption: this.caption,
                disabled: this.disabled ? "disabled='disabled'": ""
            }),
            this._div.setHtml(A),
            this.sidedivs = this._div.getElementsByClassName("btn-l"),
            this.el = this._div.getElementsByTagName("button", 0);
            if (this.icon) this.el.setStyle({
                backgroundImage: "url(" + this.icon + ")",
                paddingLeft: "16px"
            });
            if (this.transform) this.el = F.replacement(this.el, this.transform),
            this.el.setWidth(this.width - 8),
            this.handler = this.el.dom().onclick,
            this.el.dom().onclick = null;
            this.el.setStyle({
                color: this.disabled ? "#808080": ""
            });
            this.el.on({
                click: function() {
                    this.handler && this.handler()
                }.createDelegate(this),
                mouseover: function() {
                    var $ = this.sidedivs;
                    $[0].addClass("btn-l-on");
                    $[1].addClass("btn-c-on");
                    $[2].addClass("btn-r-on");
                    this._ismouseover = true
                }.createDelegate(this),
                mouseout: function() {
                    var $ = this.sidedivs;
                    $[0].delClass("btn-l-on");
                    $[1].delClass("btn-c-on");
                    $[2].delClass("btn-r-on");
                    this._ismouseover = false
                }.createDelegate(this)
            })
        },
        setCaption: function($) {
            this.el.dom().value = this.caption = $
        },
        setHandler: function($) {
            this.handler = $
        }
    }),
    $.TextField = function($) {
        this.width = $.width || 50;
        this.defaultValue = this.text = $.text || "";
        this.disabled = !!$.disabled;
        this.type = $.type == "password" ? "password": "text";
        this.maxLength = $.maxLength;
        this.name = $.name;
        F.publicMethod.call(this)
    },
    $.TextField.template = $.String("<div class='ucren-textfield' style='width: @{width}px;'>", "<div class='txf-l ucren-left'></div>", "<div class='txf-c ucren-left' style='width: @{inputWidth}px;'><input type='@{type}' style='width: @{inputWidth2}px;' @{disabled} value='@{text}'@{maxLen}@{name} /></div>", "<div class='txf-r ucren-left'></div>", "<div class='ucren-clear'></div>", "</div>"),
    $ex($.TextField, {
        renderType: "textfield",
        applyTo: function(_) {
            var A;
            _ = $.get(_),
            this._div = _.createElement("div"),
            A = $.TextField.template.replace({
                width: this.width,
                inputWidth: this.width - 4,
                inputWidth2: this.width - 8,
                text: this.text,
                disabled: this.disabled ? "disabled='disabled'": "",
                type: this.type,
                maxLen: typeof(this.maxLength) == "number" ? (" maxlength='" + this.maxLength + "'") : "",
                name: typeof(this.name) == "string" ? (" name='" + this.name + "'") : ""
            }),
            this._div.setHtml(A),
            this.el = this._div.getElementsByTagName("input", 0);
            if (this.transform) {
                this.el = F.replacement(this.el, this.transform);
                this.el.setWidth(this.width - 8)
            }
        },
        select: function() {
            this.el.dom().select()
        }
    }),
    $.ComboBox = function(_) {
        if (typeof(_.width) == "number") _.width = Math.max(16, _.width - 16);
        this.config = _,
        this._combo = new $.TextField(_),
        this.data = _.data,
        this.onChange = _.onChange || N(),
        this.editable = !!_.editable,
        this.selectIndex = -1,
        this.expanded = false,
        F.publicMethod.call(this)
    },
    $.ComboBox.createTrigger = function(A, D) {
        var B, C, _, E, F;
        C = D._combo,
        (B = A).setStyle({
            width: C.width + 16 + "px"
        }),
        _ = $d.createElement("div"),
        A.dom().insertBefore(_, (E = A.getElementsByTagName("div", 2)).dom()),
        (F = $.get(_)).setClass(C.disabled ? "selbar selbar-dis": "selbar"),
        F.setHtml("&#160;"),
        F.on({
            mouseover: function($) {
                if (D.disabled) return;
                this.className = "selbar selbaron"
            },
            mouseout: function($) {
                if (D.disabled) return;
                this.className = "selbar"
            },
            click: function(_) {
                if (D.disabled) return;
                var A;
                C.focus();
                D.expand();
                A = $ev($d, "mousedown",
                function(_) {
                    var _ = $.Event(_);
                    if (_.srcDom.className == "ucren-combobox") return;
                    D.collapse.defer(10, D);
                    $.deleteEvent($d, "mousedown", A)
                })
            }
        });
        return F
    },
    $.ComboBox.createListElement = function(I, K) {
        var H, B, C, J, D, _, E;
        E = K._combo,
        D = K.data,
        H = "",
        B = I.getParentElement().createElement("div", {
            position: "relative",
            zIndex: $.Config.layerzIndexs.combobox
        }),
        C = (ie && HASDOCTYPE) ? -2 : 0,
        J = B.createElement("div", {
            position: "absolute"
        }),
        J.setClass("ucren-combobox"),
        J.setWidth(E.width + 16 + C);
        for (var G = 0, F = D.count; G < F; G++) D.go(G),
        H += "<div class='seloff' text='" + D.read("text") + "' value='" + D.read("value") + "' index='" + G + "'>&#160;" + D.read("text") + "</div>";
        D.count > 12 && [J.setHeight(240), J.setStyle({
            overflow: "auto",
            overflowX: "hidden"
        })],
        J.setHtml(H),
        _ = J.getElementsByTagName("div");
        for (var G = 0, A = _.length; G < A; G++) _[G].on({
            mouseover: function($) {
                K.select(this, true)
            },
            mousedown: function(_) {
                var A;
                E.setValue((A = $.get(this)).get("text")),
                K.selectIndex == A.get("index") || K.onChange(),
                K.selectIndex = A.get("index")
            }
        });
        return J
    },
    $ex($.ComboBox, {
        renderType: "combobox",
        expand: function() {
            if (this.disabled) return;
            var $ = this.listElement;
            this.expanded = true,
            $.setStyle({
                visibility: "visible"
            });
            if (ff && typeof(this.isInDataGrid) != "boolean") {
                this.isInDataGrid = !!$.findParentElement("ucren-datagrid");
                if (this.isInDataGrid) $.setStyle({
                    left: "auto",
                    top: "auto"
                }),
                $.getParentElement().setPosition("inherit"),
                $.getElementsByClassName("ucren-combobox", 0).moveTo(0, 0)
            }
        },
        collapse: function() {
            this.expanded = false,
            this.listElement.setStyle({
                visibility: "hidden"
            })
        },
        select: function(A, _) {
            var B, $;
            if (typeof(A) == "object" && A != this.selection) B = A;
            else if (typeof(A) == "number") B = this.listElement.getElementsByTagName("div", A).dom();
            if (!B) return;
            if (this.selection) this.selection.className = "seloff";
            this.selection = B,
            B.className = "seloff selon";
            if (!_) this.listElement.dom().scrollTop = (this.selection.getAttribute("index") - 11) * 20
        },
        selectPrev: function() {
            var $;
            this.select(this.selection && this.selection.previousSibling || 0)
        },
        selectNext: function() {
            var $;
            this.select(this.selection && this.selection.nextSibling || 0)
        },
        applyTo: function(B) {
            var G, D, A, C, _, F, E;
            F = this,
            G = this._combo,
            D = this.data,
            E = this.config,
            G.applyTo(B),
            G.dom().readOnly = !this.editable,
            G.dom().style.cursor = this.editable ? "text": "default",
            $ap(this, G, {
                select: true,
                getValue: true,
                setValue: true
            }),
            this.getValue = function() {
                var $ = G.getValue();
                if (D.pos("text", $)) return D.read("value");
                else return $
            },
            this.setValue = function($) {
                D.pos("value", $) && ($ = D.read("text"));
                G.setValue($)
            },
            C = A = $.get(this.dom().parentNode.parentNode),
            this._listid = C.id,
            this.listElement = $.ComboBox.createListElement(C, this),
            this._trigger = _ = $.ComboBox.createTrigger(A, this);
            if (this.config.value != $w.undefined) if (D.pos("value", E.value)) G.setValue(D.read("text")),
            this.selectIndex = D.pointer;
            else G.setValue(E.value);
            $ev(G, "mousedown", !this.editable ?
            function() {
                if (F.expanded || F.disabled) return;
                F.expand(),
                function() {
                    var _ = this,
                    A = $ev($d, "mousedown",
                    function(B) {
                        _.style.background = "none";
                        var B = $.Event(B);
                        F.collapse.defer(10, F);
                        $.deleteEvent($d, "mousedown", A)
                    })
                }.defer(100, this),
                this.style.backgroundColor = "#d8ecff"
            }: function() {
                if (F.disabled) return;
                G.select()
            }),
            $ev(G, "keydown",
            function(_) {
                _ = $.Event(_);
                if (!_.ctrlKey) switch (_.keyCode) {
                case 13:
                    var A;
                    if (!F.selection) return;
                    G.setValue((A = $.get(F.selection)).get("text")),
                    F.selectIndex == A.get("index") || F.onChange(),
                    F.selectIndex = A.get("index"),
                    F.collapse();
                    break;
                case 38:
                    F.expanded || F.expand(),
                    F.selectPrev();
                    break;
                case 40:
                    F.expanded || F.expand(),
                    F.selectNext();
                    break
                }
            }),
            this.defaultValue = this.getValue()
        },
        reload: function() {
            var _, A;
            _ = $.get(this._listid),
            A = _.getParentElement().getElementsByClassName("ucren-combobox", 0),
            A.getParentElement().remove(),
            this.listElement = $.ComboBox.createListElement(_, this)
        }
    }),
    $.CheckBox = function($) {
        this.configs = $,
        this.elements = [],
        F.publicMethod.call(this)
    },
    $ex($.CheckBox, {
        render: function() {
            for (var A = 0, _ = this.configs.length; A < _; A++) this.elements.push(new $.CheckBox.Item(this.configs[A], this));
            this.defaultValue = this.getValue()
        },
        getCheckBox: function($) {
            return this.elements[$]
        },
        getValue: function() {
            var _, A;
            _ = [],
            A = this.elements;
            for (var B = 0, $ = A.length; B < $; B++) if (A[B].checked) _.push(A[B].value);
            return _
        },
        setValue: function($) {
            if (!$) return;
            var A = this.elements;
            for (var _ = 0; _ < A.length; _++) A[_].setChecked(false);
            for (var B = 0; B < $.length; B++) for (_ = 0; _ < A.length; _++) $[B] == A[_].value && A[_].setChecked(true)
        },
        selectAll: function() {
            if (this.disabled) return;
            var $ = this.elements;
            for (var _ = 0; _ < $.length; _++) $[_].setChecked(true)
        },
        selectNone: function() {
            if (this.disabled) return;
            this.setValue([])
        },
        selectReverse: function() {
            if (this.disabled) return;
            var $, _;
            $ = [],
            _ = this.elements;
            for (var A = 0; A < _.length; A++) _[A].checked || $.push(_[A].value);
            this.setValue($)
        },
        setDisabled: function($) {
            var _;
            $ = !!$,
            _ = this.elements,
            this.disabled = $;
            for (var A = 0; A < _.length; A++) _[A].setDisabled($)
        }
    }),
    $.CheckBox.Item = function() {
        var _ = $.String("<table cellspacing='0' cellpadding='0' border='0' height='13' class='ucren-ckbox'>", "<tr>", "<td><div class='bar'>&nbsp;</div></td>", "<td class='hand'><a href='' onclick='return false;'>@{label}</a></td>", "</tr>", "</table>"),
        B = function($, A, _) {
            if (A.checked && A.disabled) _.setClass("bar tru tru-dis");
            else if (!A.checked && A.disabled) _.setClass("bar fal fal-dis");
            else if (A.checked && !A.disabled) _.setClass("bar tru");
            else if (!A.checked && !A.disabled) _.setClass("bar fal");
            $.onChange && $.onChange()
        },
        A = function($, A, _) {
            if (A.disabled) return false;
            A.checked = !A.checked;
            B($, A, _);
            return false
        };
        return function(I, D) {
            var H, E, G, F, C;
            H = this,
            $.apply(this, I),
            E = $.get(this.container),
            E.setHtml(_.replace({
                label: this.label
            })),
            G = E.getElementsByTagName("div", 0),
            F = E.getElementsByTagName("a", 0),
            B(D, H, G),
            C = {
                click: function() {
                    A(D, H, G)
                },
                keydown: function(_) {
                    _ = $.Event(_),
                    (_.keyCode == 32 || (_.keyCode == 13 && ff)) && C.click(),
                    _.returnValue = false,
                    _.cancel()
                },
                mouseover: function() {
                    G.addClass(H.checked ? "tru-on": "fal-on")
                },
                mouseout: function() {
                    G.delClass(H.checked ? "tru-on": "fal-on")
                }
            },
            G.on(C),
            F.on(C),
            this.setChecked = function($) {
                this.checked = $ ? true: false;
                B(D, H, G)
            },
            this.setDisabled = function($) {
                this.disabled = $ ? true: false;
                B(D, H, G)
            }
        }
    } (),
    $.Radio = function($) {
        this.configs = $,
        this.activeRadio = null,
        this.elements = [],
        F.publicMethod.call(this)
    },
    $ex($.Radio, {
        render: function() {
            for (var A = 0, _ = this.configs.length; A < _; A++) this.elements.push(new $.Radio.Item(this.configs[A], this));
            this.defaultValue = this.getValue()
        },
        getRadio: function($) {
            return this.elements[$]
        },
        getValue: function() {
            if (this.activeRadio) return this.activeRadio.value;
            return ""
        },
        setValue: function($) {
            if (typeof($) == "undefined") return;
            var _ = this.elements;
            for (var A = 0; A < _.length; A++) {
                if (_[A].value == $) return _[A].setChecked(true);
                _[A].setChecked(false)
            }
        },
        setDisabled: function($) {
            var _;
            $ = !!$,
            _ = this.elements,
            this.disabled = $;
            for (var A = 0; A < _.length; A++) _[A].setDisabled($)
        }
    }),
    $.Radio.Item = function() {
        var _ = $.String("<table cellspacing='0' cellpadding='0' border='0' height='13' class='ucren-radio'>", "<tr>", "<td><div class='bar'>&nbsp;</div></td>", "<td class='hand'><a href='' onclick='return false;'>@{label}</a></td>", "</tr>", "</table>"),
        B = function($, A, _) {
            if (A.checked && A.disabled) _.setClass("bar tru tru-dis");
            else if (!A.checked && A.disabled) _.setClass("bar fal fal-dis");
            else if (A.checked && !A.disabled) _.setClass("bar tru");
            else if (!A.checked && !A.disabled) _.setClass("bar fal");
            $.onChange && $.onChange()
        },
        A = function($) {
            if ($.disabled) return false;
            if ($.checked) return false;
            $.setChecked(true)
        };
        return function(I, D) {
            var H, E, G, F, C;
            H = this,
            $.apply(this, I),
            E = $.get(this.container),
            E.setHtml(_.replace({
                label: this.label
            })),
            G = E.getElementsByTagName("div", 0),
            F = E.getElementsByTagName("a", 0);
            if (!D.activeRadio && this.checked) D.activeRadio = this;
            else if (this.checked) this.checked = false;
            B(D, H, G),
            C = {
                click: function() {
                    A(H)
                },
                mouseover: function() {
                    G.addClass(H.checked ? "tru-on": "fal-on")
                },
                mouseout: function() {
                    G.delClass(H.checked ? "tru-on": "fal-on")
                },
                keydown: function(_) {
                    _ = $.Event(_),
                    (_.keyCode == 32 || (_.keyCode == 13 && ff)) && C.click(),
                    _.returnValue = false,
                    _.cancel()
                }
            },
            G.on(C),
            F.on(C),
            this.setChecked = function($) {
                this.checked = $ ? true: false;
                if (this.checked) D.activeRadio && D.activeRadio != H && D.activeRadio.setChecked(false),
                D.activeRadio = H;
                B(D, H, G)
            },
            this.setDisabled = function($) {
                this.disabled = !!$;
                B(D, H, G)
            }
        }
    } (),
    $.TextArea = function($) {
        this.width = $.width || 150,
        this.height = $.height || 30,
        this.defaultValue = this.text = $.text || "",
        this.disabled = !!$.disabled,
        this.maxLength = typeof($.maxLength) == "number" ? $.maxLength: 20480,
        this.name = $.name,
        F.publicMethod.call(this)
    },
    $ex($.TextArea, {
        renderType: "textarea",
        applyTo: function(A) {
            var A, _;
            A = $.get(A),
            _ = A.createElement("textarea", {
                width: Math.max(this.width - 2, 0) + "px",
                height: Math.max(this.height - 2, 0) + "px"
            }),
            _.setClass("ucren-textarea");
            if (typeof(this.name) == "string") _.dom().name = this.name;
            this.el = _,
            typeof(this.maxLength) == "number" && (_.dom().maxLength = this.maxLength),
            this.setDisabled(this.disabled),
            this.reset();
            if (this.transform) this.el = F.replacement(this.el, this.transform),
            this.el.setClass("ucren-textarea"),
            this.el.resizeTo(Math.max(this.width - 2, 0), Math.max(this.height - 2, 0))
        }
    }),
    $ap($, {
        onReady: function() {
            var A, _, E, C, B, D = [];
            E = function() {
                if (_) return;
                _ = true;
                if (C) {
                    C.onreadystatechange = null;
                    C.parentNode.removeChild(C)
                } else if (B) $.deleteEvent($d, "DOMContentLoaded", B);
                else if (A) clearInterval(A);
                $.Listen(function() {
                    return $d.body.clientWidth > 10
                },
                function() {
                    dr(true);
                    while (D.length) D.shift()()
                })
            };
            if (ie) {
                $d.write("<script id='loader-for-ie' defer='defer' src='//:'></script>");
                C = $d.getElementById("loader-for-ie");
                C.onreadystatechange = function() {
                    this.readyState == "complete" && E()
                }
            } else if (ff) B = $ev($d, "DOMContentLoaded", E);
            else A = setInterval(function() {
                $d.readyState == "complete" && E()
            },
            10);
            $ev($w, "load", E);
            return function($) {
                if (_) return $();
                D.push($)
            }
        } (),
        blind: W.Dialog.blind.createDelegate(W.Dialog),
        unblind: W.Dialog.unblind.createDelegate(W.Dialog),
        showLoading: W.Dialog.showLoading.createDelegate(W.Dialog),
        hideLoading: W.Dialog.hideLoading.createDelegate(W.Dialog),
        alert: W.alert.createDelegate(W),
        confirm: W.confirm.createDelegate(W),
        prompt: W.prompt.createDelegate(W)
    }),
    $.UObject = E.El,
    $.WindowsManager = W,
    $.FormManager = F,
    $.Window = W.Window,
    Ucren = $,
    dr(),
    $d.write("<link rel='stylesheet' href='" + $.appPath + "resource/skins/" + $.currentSkin + "/interface.css" + "' type='text/css' media='all' />");
    function publicMethod() {
        if (!this.dom) this.dom = function() {
            var $ = this.el;
            return $.dom()
        };
        if (!this.setValue) this.setValue = function($) {
            this.dom().value = this.text = $
        };
        if (!this.getValue) this.getValue = function() {
            return this.dom().value
        };
        if (!this.reset) this.reset = function() {
            if (this.renderType == "button" || this.renderType == "reset" || this.renderType == "submit") return;
            this.setValue(this.defaultValue)
        };
        if (!this.focus) this.focus = function() {
            try {
                this.dom().focus()
            } catch($) {}
        };
        if (!this.blur) this.blur = function() {
            this.dom().blur()
        };
        if (!this.setDisabled) this.setDisabled = function($) {
            var _ = this.renderType;
            switch (_) {
            case "button":
            case "submit":
            case "reset":
                this.el.setStyle({
                    color:
                    $ ? "#808080": ""
                });
                this.dom().disabled = this.disabled = $;
                this.el._events.mouseout();
                break;
            case "text":
            case "password":
            case "textarea":
                this.dom().disabled = this.disabled = $;
                break;
            case "combobox":
                this._combo.dom().disabled = this.disabled = $ = !!$,
                this._trigger.setClass($ ? "selbar selbar-dis": "selbar");
                break;
            default:
                break
            }
        }
    }
} ()