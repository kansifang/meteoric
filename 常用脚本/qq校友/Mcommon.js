/*   paste in your code and press Beautify button   */
/*if ('this_is' == /an_example/) {
    do_something();
} else {
    var a = b ? (c % d) : e[f];
}*/
~(function () {
    var l = this,
    g, y = l.jQuery,
    p = l.$,
    o = l.jQuery = l.$ = function (E, F) {
        return new o.fn.init(E, F)
    },
    D = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
    f = /^.[^:#\[\.,]*$/;
    o.fn = o.prototype = {
        init: function (E, H) {
            E = E || document;
            if (E.nodeType) {
                this[0] = E;
                this.length = 1;
                this.context = E;
                return this
            }
            if (typeof E === "string") {
                var G = D.exec(E);
                if (G && (G[1] || !H)) {
                    if (G[1]) {
                        E = o.clean([G
                            [1]], H)
                    } else {
                        var I = document.getElementById(G[3]);
                        if (I && I.id != G[3]) {
                            return o().find(E)
                        }
                        var F = o(I || []);
                        F.context = document;
                        F.selector = E;
                        return F
                    }
                } else {
                    return o(H).find(E)
                }
            } else { if (o.isFunction(E)) {
                    return o(document).ready(E)
                }
            }
            if (E.selector && E.context) {
                this.selector = E.selector;
                this.context = E.context
            }
            return this.setArray(o.isArray(E) ? E : o.makeArray(E))
        },
        selector: "",
        jquery: "1.3.2",
        size: function () {
            return this.length
        },
        get: function (E) {
            return E === g ? Array.prototype.slice.call(this) : this[E]
        },
        pushStack: function (F, H, E) {
            var G = o(F);
            G.prevObject = this;
            G.context = this.context;
            if (H === "find") {
                G.selector = this.selector + (this.selector ? " " : "") + E
            } else { if (H) {
                    G.selector = this.selector + "." + H + "(" + E + ")"
                }
            }
            return G
        },
        setArray: function (E) {
            this.length = 0;
            Array.prototype.push.apply(this, E);
            return this
        },
        each: function (F, E) {
            return o.each(this, F, E)
        },
        index: function (E) {
            return o.inArray(E && E.jquery ? E[0] : E, this)
        },
        attr: function (F, H, G) {
            var E = F;
            if (typeof F === "string") {
                if (H === g) {
                    return this[0] && o[G || "attr"](this[0], F)
                } else {
                    E = {};
                    E[F] = H
                }
            }
            return this.each(function (I) {
                for (F in E) {
                    o.attr(G ? this.style : this, F, o.prop(this, E[F], G, I, F))
                }
            })
        },
        css: function (E, F) {
            if ((E == "width" || E == "height") && parseFloat(F) < 0) {
                F = g
            }
            return this.attr(E, F, "curCSS")
        },
        text: function (F) {
            if (typeof F !== "object" && F != null) {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(F))
            }
            var E = "";
            o.each(F || this, function () {
                o.each(this.childNodes, function () {
                    if (this.nodeType != 8) {
                        E += this.nodeType != 1 ? this.nodeValue : o.fn.text([this])
                    }
                })
            });
            return E
        },
        wrapAll: function (E) {
            if (this[0]) {
                var F = o(E, this[0].ownerDocument).clone();
                if (this[0].parentNode) {
                    F.insertBefore(this[0])
                }
                F.map(function () {
                    var G = this;
                    while (G.firstChild) {
                        G = G.firstChild
                    }
                    return G
                }).append(this)
            }
            return this
        },
        wrapInner: function (E) {
            return this.each(function () {
                o(this).contents().wrapAll(E)
            })
        },
        wrap: function (E) {
            return this.each(function () {
                o(this).wrapAll(E)
            })
        },
        append: function () {
            return this.domManip(arguments, true, function (E) {
                if (this.nodeType == 1) {
                    this.appendChild(E)
                }
            })
        },
        prepend: function () {
            return this.domManip(arguments, true, function (E) {
                if (this.nodeType == 1) {
                    this.insertBefore(E, this.firstChild)
                }
            })
        },
        before: function () {
            return this.domManip(arguments, false, function (E) {
                this.parentNode.insertBefore(E, this)
            })
        },
        after: function () {
            return this.domManip(arguments, false, function (E) {
                this.parentNode.insertBefore(E, this.nextSibling)
            })
        },
        end: function () {
            return this.prevObject || o([])
        },
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        find: function (E) {
            if (this.length === 1) {
                var F = this.pushStack([], "find", E);
                F.length = 0;
                o.find(E, this[0], F);
                return F
            } else {
                return this.pushStack(o.unique(o.map(this, function (G) {
                    return o.find(E, G)
                })), "find", E)
            }
        },
        clone: function (G) {
            var E = this.map(function () {
                if (!o.support.noCloneEvent && !o.isXMLDoc(this)) {
                    var I = this.outerHTML;
                    if (!I) {
                        var J = this.ownerDocument.createElement("div");
                        J.appendChild(this.cloneNode(true));
                        I = J.innerHTML
                    }
                    return o.clean([I.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0]
                } else {
                    return this.cloneNode(true)
                }
            });
            if (G === true) {
                var H = this.find("*").andSelf(),
                F = 0;
                E.find("*").andSelf().each(function () {
                    if (this.nodeName !== H[F].nodeName) {
                        return
                    }
                    var I = o.data(H[F], "events");
                    for (var K in I) {
                        for (var J in I[K]) {
                            o.event.add(this, K, I[K][J], I[K][J].data)
                        }
                    }
                    F++
                })
            }
            return E
        },
        filter: function (E) {
            return this.pushStack(o.isFunction(E) && o.grep(this, function (G, F) {
                return E.call(G, F)
            }) || o.multiFilter(E, o.grep(this, function (F) {
                return F.nodeType === 1
            })), "filter", E)
        },
        closest: function (E) {
            var G = o.expr.match.POS.test(E) ? o(E) : null,
            F = 0;
            return this.map(function () {
                var H = this;
                while (H && H.ownerDocument) {
                    if (G ? G.index(H) > -1 : o(H).is(E)) {
                        o.data(H, "closest", F);
                        return H
                    }
                    H = H.parentNode;
                    F++
                }
            })
        },
        not: function (E) {
            if (typeof E === "string") {
                if (f.test(E)) {
                    return this.pushStack(o.multiFilter(E, this, true), "not", E)
                } else {
                    E = o.multiFilter(E, this)
                }
            }
            var F = E.length && E[E.length - 1] !== g && !E.nodeType;
            return this.filter(function () {
                return F ? o.inArray(this, E) < 0 : this != E
            })
        },
        add: function (E) {
            return this.pushStack(o.unique(o.merge(this.get(), typeof E === "string" ? o(E) : o.makeArray(E))))
        },
        is: function (E) {
            return !! E && o.multiFilter(E, this).length > 0
        },
        hasClass: function (E) {
            return !! E && this.is("." + E)
        },
        val: function (K) {
            if (K === g) {
                var E = this[0];
                if (E) {
                    if (o.nodeName(E, "option")) {
                        return (E.attributes.value || {}).specified ? E.value : E.text
                    }
                    if (o.nodeName(E, "select")) {
                        var I = E.selectedIndex,
                        L = [],
                        M = E.options,
                        H = E.type == "select-one";
                        if (I < 0) {
                            return null
                        }
                        for (var F = H ? I : 0, J = H ? I + 1 : M.length; F < J; F++) {
                            var G = M[F];
                            if (G.selected) {
                                K = o(G).val();
                                if (H) {
                                    return K
                                }
                                L.push(K)
                            }
                        }
                        return L
                    }
                    return (E.value || "").replace(/\r/g, "")
                }
                return g
            }
            if (typeof K === "number") {
                K += ""
            }
            return this.each(function () {
                if (this.nodeType != 1) {
                    return
                }
                if (o.isArray(K) && /radio|checkbox/.test(this.type)) {
                    this.checked = (o.inArray(this.value, K) >= 0 || o.inArray(this.name, K) >= 0)
                } else { if (o.nodeName(this, "select")) {
                        var N = o.makeArray(K);
                        o("option", this).each(function () {
                            this.selected = (o.inArray(this.value, N) >= 0 || o.inArray(this.text, N) >= 0)
                        });
                        if (!N.length) {
                            this.selectedIndex = -1
                        }
                    } else {
                        this.value = K
                    }
                }
            })
        },
        html: function (E) {
            return E === g ? (this[0] ? this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") : null) : this.empty().append(E)
        },
        replaceWith: function (E) {
            return this.after(E).remove()
        },
        eq: function (E) {
            return this.slice(E, +E + 1)
        },
        slice: function () {
            return this.pushStack(Array.prototype.slice.apply(this, arguments), "slice", Array.prototype.slice.call(arguments).join(","))
        },
        map: function (E) {
            return this.pushStack(o.map(this, function (G, F) {
                return E.call(G, F, G)
            }))
        },
        andSelf: function () {
            return this.add(this.prevObject)
        },
        domManip: function (J, M, L) {
            if (this[0]) {
                var I = (this[0].ownerDocument || this[0]).createDocumentFragment(),
                F = o.clean(J, (this[0].ownerDocument || this[0]), I),
                H = I.firstChild;
                if (H) {
                    for (var G = 0, E = this.length; G < E; G++) {
                        L.call(K(this[G], H), this.length > 1 || G > 0 ? I.cloneNode(true) : I)
                    }
                }
                if (F) {
                    o.each(F, z)
                }
            }
            return this;
            function K(N, O) {
                return M && o.nodeName(N, "table") && o.nodeName(O, "tr") ? (N.getElementsByTagName("tbody")[0] || N.appendChild(N.ownerDocument.createElement("tbody"))) : N
            }
        }
    };
    o.fn.init.prototype = o.fn;
    function z(E, F) {
        if (F.src) {
            o.ajax({
                url: F.src,
                async: false,
                dataType: "script"
            })
        } else {
            o.globalEval(F.text || F.textContent || F.innerHTML || "")
        }
        if (F.parentNode) {
            F.parentNode.removeChild(F)
        }
    }
    function e() {
        return +new Date
    }
    o.extend = o.fn.extend = function () {
        var J = arguments[0] || {},
        H = 1,
        I = arguments.length,
        E = false,
        G;
        if (typeof J === "boolean") {
            E = J;
            J = arguments[1] || {};
            H = 2
        }
        if (typeof J !== "object" && !o.isFunction(J)) {
            J = {}
        }
        if (I == H) {
            J = this;
            --H
        }
        for (; H < I; H++) {
            if ((G = arguments[H]) != null) {
                for (var F in G) {
                    var K = J[F],
                    L = G[F];
                    if (J === L) {
                        continue
                    }
                    if (E && L && typeof L === "object" && !L.nodeType) {
                        J[F] = o.extend(E, K || (L.length != null ? [] : {}), L)
                    } else { if (L !== g) {
                            J[F] = L
                        }
                    }
                }
            }
        }
        return J
    };
    var b = /z-?index|font-?weight|opacity|zoom|line-?height/i,
    q = document.defaultView || {},
    s = Object.prototype.toString;
    o.extend({
        noConflict: function (E) {
            l.$ = p;
            if (E) {
                l.jQuery = y
            }
            return o
        },
        isFunction: function (E) {
            return s.call(E) === "[object Function]"
        },
        isArray: function (E) {
            return s.call(E) === "[object Array]"
        },
        isXMLDoc: function (E) {
            return E.nodeType === 9 && E.documentElement.nodeName !== "HTML" || !!E.ownerDocument && o.isXMLDoc(E.ownerDocument)
        },
        globalEval: function (G) {
            if (G && /\S/.test(G)) {
                var F = document.getElementsByTagName("head")[0] || document.documentElement,
                E = document.createElement("script");
                E.type = "text/javascript";
                if (o.support.scriptEval) {
                    E.appendChild(document.createTextNode(G))
                } else {
                    E.text = G
                }
                F.insertBefore(E, F.firstChild);
                F.removeChild(E)
            }
        },
        nodeName: function (F, E) {
            return F.nodeName && F.nodeName.toUpperCase() == E.toUpperCase()
        },
        each: function (G, K, F) {
            var E, H = 0,
            I = G.length;
            if (F) {
                if (I === g) {
                    for (E in G) {
                        if (K.apply(G[E], F) === false) {
                            break
                        }
                    }
                } else {
                    for (; H < I;) {
                        if (K.apply(G[H++], F) === false) {
                            break
                        }
                    }
                }
            } else { if (I === g) {
                    for (E in G) {
                        if (K.call(G[E], E, G[E]) === false) {
                            break
                        }
                    }
                } else {
                    for (var J = G[0]; H < I && K.call(J, H, J) !== false; J = G[++H]) {}
                }
            }
            return G
        },
        prop: function (H, I, G, F, E) {
            if (o.isFunction(I)) {
                I = I.call(H, F)
            }
            return typeof I === "number" && G == "curCSS" && !b.test(E) ? I + "px" : I
        },
        className: {
            add: function (E, F) {
                o.each((F || "").split(/\s+/), function (G, H) {
                    if (E.nodeType == 1 && !o.className.has(E.className, H)) {
                        E.className += (E.className ? " " : "") + H
                    }
                })
            },
            remove: function (E, F) {
                if (E.nodeType == 1) {
                    E.className = F !== g ? o.grep(E.className.split(/\s+/), function (G) {
                        return !o.className.has(F, G)
                    }).join(" ") : ""
                }
            },
            has: function (F, E) {
                return F && o.inArray(E, (F.className || F).toString().split(/\s+/)) > -1
            }
        },
        swap: function (H, G, I) {
            var E = {};
            for (var F in G) {
                E[F] = H.style[F];
                H.style[F] = G[F]
            }
            I.call(H);
            for (var F in G) {
                H.style[F] = E[F]
            }
        },
        css: function (H, F, J, E) {
            if (F == "width" || F == "height") {
                var L, G = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                K = F == "width" ? ["Left", "Right"] : ["Top", "Bottom"];
                function I() {
                    L = F == "width" ? H.offsetWidth : H.offsetHeight;
                    if (E === "border") {
                        return
                    }
                    o.each(K, function () {
                        if (!E) {
                            L -= parseFloat(o.curCSS(H, "padding" + this, true)) || 0
                        }
                        if (E === "margin") {
                            L += parseFloat(o.curCSS(H, "margin" + this, true)) || 0
                        } else {
                            L -= parseFloat(o.curCSS(H, "border" + this + "Width", true)) || 0
                        }
                    })
                }
                if (H.offsetWidth !== 0) {
                    I()
                } else {
                    o.swap(H, G, I)
                }
                return Math.max(0, Math.round(L))
            }
            return o.curCSS(H, F, J)
        },
        curCSS: function (I, F, G) {
            var L, E = I.style;
            if (F == "opacity" && !o.support.opacity) {
                L = o.attr(E, "opacity");
                return L == "" ? "1" : L
            }
            if (F.match(/float/i)) {
                F = w
            }
            if (!G && E && E[F]) {
                L = E[F]
            } else { if (q.getComputedStyle) {
                    if (F.match(/float/i)) {
                        F = "float"
                    }
                    F = F.replace(/([A-Z])/g, "-$1").toLowerCase();
                    var M = q.getComputedStyle(I, null);
                    if (M) {
                        L = M.getPropertyValue(F)
                    }
                    if (F == "opacity" && L == "") {
                        L = "1"
                    }
                } else { if (I.currentStyle) {
                        var J = F.replace(/\-(\w)/g, function (N, O) {
                            return O.toUpperCase()
                        });
                        L = I.currentStyle[F] || I.currentStyle[J];
                        if (!/^\d+(px)?$/i.test(L) && /^\d/.test(L)) {
                            var H = E.left,
                            K = I.runtimeStyle.left;
                            I.runtimeStyle.left = I.currentStyle.left;
                            E.left = L || 0;
                            L = E.pixelLeft + "px";
                            E.left = H;
                            I.runtimeStyle.left = K
                        }
                    }
                }
            }
            return L
        },
        clean: function (F, K, I) {
            K = K || document;
            if (typeof K.createElement === "undefined") {
                K = K.ownerDocument || K[0] && K[0].ownerDocument || document
            }
            if (!I && F.length === 1 && typeof F[0] === "string") {
                var H = /^<(\w+)\s*\/?>$/.exec(F[0]);
                if (H) {
                    return [K.createElement(H[1])]
                }
            }
            var G = [],
            E = [],
            L = K.createElement("div");
            o.each(F, function (P, S) {
                if (typeof S === "number") {
                    S += ""
                }
                if (!S) {
                    return
                }
                if (typeof S === "string") {
                    S = S.replace(/(<(\w+)[^>]*?)\/>/g, function (U, V, T) {
                        return T.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? U : V + "></" + T + ">"
                    });
                    var O = S.replace(/^\s+/, "").substring(0, 10).toLowerCase();
                    var Q = !O.indexOf("<opt") && [1, "<select multiple='multiple'>", "</select>"] || !O.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"] || O.match(/^<(thead|tbody|tfoot|colg|cap)/) && [1, "<table>", "</table>"] || !O.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!O.indexOf("<td") || !O.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || !O.indexOf("<col") && [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] || !o.support.htmlSerialize && [1, "div<div>", "</div>"] || [0, "", ""];
                    L.innerHTML = Q[1] + S + Q[2];
                    while (Q[0]--) {
                        L = L.lastChild
                    }
                    if (!o.support.tbody) {
                        var R = /<tbody/i.test(S),
                        N = !O.indexOf("<table") && !R ? L.firstChild && L.firstChild.childNodes : Q[1] == "<table>" && !R ? L.childNodes : [];
                        for (var M = N.length - 1; M >= 0; --M) {
                            if (o.nodeName(N[M], "tbody") && !N[M].childNodes.length) {
                                N[M].parentNode.removeChild(N[M])
                            }
                        }
                    }
                    if (!o.support.leadingWhitespace && /^\s/.test(S)) {
                        L.insertBefore(K.createTextNode(S.match(/^\s*/)[0]), L.firstChild)
                    }
                    S = o.makeArray(L.childNodes)
                }
                if (S.nodeType) {
                    G.push(S)
                } else {
                    G = o.merge(G, S)
                }
            });
            if (I) {
                for (var J = 0; G[J]; J++) {
                    if (o.nodeName(G[J], "script") && (!G[J].type || G[J].type.toLowerCase() === "text/javascript")) {
                        E.push(G[J].parentNode ? G[J].parentNode.removeChild(G[J]) : G[J])
                    } else { if (G[J].nodeType === 1) {
                            G.splice.apply(G, [J + 1, 0].concat(o.makeArray(G[J].getElementsByTagName("script"))))
                        }
                        I.appendChild(G[J])
                    }
                }
                return E
            }
            return G
        },
        attr: function (J, G, K) {
            if (!J || J.nodeType == 3 || J.nodeType == 8) {
                return g
            }
            var H = !o.isXMLDoc(J),
            L = K !== g;
            G = H && o.props[G] || G;
            if (J.tagName) {
                var F = /href|src|style/.test(G);
                if (G == "selected" && J.parentNode) {
                    J.parentNode.selectedIndex
                }
                if (G in J && H && !F) {
                    if (L) {
                        if (G == "type" && o.nodeName(J, "input") && J.parentNode) {
                            throw "type property can't be changed"
                        }
                        J[G] = K
                    }
                    if (o.nodeName(J, "form") && J.getAttributeNode(G)) {
                        return J.getAttributeNode(G).nodeValue
                    }
                    if (G == "tabIndex") {
                        var I = J.getAttributeNode("tabIndex");
                        return I && I.specified ? I.value : J.nodeName.match(/(button|input|object|select|textarea)/i) ? 0 : J.nodeName.match(/^(a|area)$/i) && J.href ? 0 : g
                    }
                    return J[G]
                }
                if (!o.support.style && H && G == "style") {
                    return o.attr(J.style, "cssText", K)
                }
                if (L) {
                    J.setAttribute(G, "" + K)
                }
                var E = !o.support.hrefNormalized && H && F ? J.getAttribute(G, 2) : J.getAttribute(G);
                return E === null ? g : E
            }
            if (!o.support.opacity && G == "opacity") {
                if (L) {
                    J.zoom = 1;
                    J.filter = (J.filter || "").replace(/alpha\([^)]*\)/, "") + (parseInt(K) + "" == "NaN" ? "" : "alpha(opacity=" + K * 100 + ")")
                }
                return J.filter && J.filter.indexOf("opacity=") >= 0 ? (parseFloat(J.filter.match(/opacity=([^)]*)/)[1]) / 100) + "" : ""
            }
            G = G.replace(/-([a-z])/ig, function (M, N) {
                return N.toUpperCase()
            });
            if (L) {
                J[G] = K
            }
            return J[G]
        },
        trim: function (E) {
            return (E || "").replace(/^\s+|\s+$/g, "")
        },
        makeArray: function (G) {
            var E = [];
            if (G != null) {
                var F = G.length;
                if (F == null || typeof G === "string" || o.isFunction(G) || G.setInterval) {
                    E[0] = G
                } else {
                    while (F) {
                        E[--F] = G[F]
                    }
                }
            }
            return E
        },
        inArray: function (G, H) {
            for (var E = 0, F = H.length; E < F; E++) {
                if (H[E] === G) {
                    return E
                }
            }
            return -1
        },
        merge: function (H, E) {
            var F = 0,
            G, I = H.length;
            if (!o.support.getAll) {
                while ((G = E[F++]) != null) {
                    if (G.nodeType != 8) {
                        H[I++] = G
                    }
                }
            } else {
                while ((G = E[F++]) != null) {
                    H[I++] = G
                }
            }
            return H
        },
        unique: function (K) {
            var F = [],
            E = {};
            try {
                for (var G = 0, H = K.length; G < H; G++) {
                    var J = o.data(K[G]);
                    if (!E[J]) {
                        E[J] = true;
                        F.push(K[G])
                    }
                }
            } catch(I) {
                F = K
            }
            return F
        },
        grep: function (F, J, E) {
            var G = [];
            for (var H = 0, I = F.length; H < I; H++) {
                if (!E != !J(F[H], H)) {
                    G.push(F[H])
                }
            }
            return G
        },
        map: function (E, J) {
            var F = [];
            for (var G = 0, H = E.length; G < H; G++) {
                var I = J(E[G], G);
                if (I != null) {
                    F[F.length] = I
                }
            }
            return F.concat.apply([], F)
        }
    });
    var C = navigator.userAgent.toLowerCase();
    o.browser = {
        version: (C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        safari: /webkit/.test(C),
        opera: /opera/.test(C),
        msie: /msie/.test(C) && !/opera/.test(C),
        mozilla: /mozilla/.test(C) && !/(compatible|webkit)/.test(C)
    };
    o.each({
        parent: function (E) {
            return E.parentNode
        },
        parents: function (E) {
            return o.dir(E, "parentNode")
        },
        next: function (E) {
            return o.nth(E, 2, "nextSibling")
        },
        prev: function (E) {
            return o.nth(E, 2, "previousSibling")
        },
        nextAll: function (E) {
            return o.dir(E, "nextSibling")
        },
        prevAll: function (E) {
            return o.dir(E, "previousSibling")
        },
        siblings: function (E) {
            return o.sibling(E.parentNode.firstChild, E)
        },
        children: function (E) {
            return o.sibling(E.firstChild)
        },
        contents: function (E) {
            return o.nodeName(E, "iframe") ? E.contentDocument || E.contentWindow.document : o.makeArray(E.childNodes)
        }
    },
    function (E, F) {
        o.fn[E] = function (G) {
            var H = o.map(this, F);
            if (G && typeof G == "string") {
                H = o.multiFilter(G, H)
            }
            return this.pushStack(o.unique(H), E, G)
        }
    });
    o.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    },
    function (E, F) {
        o.fn[E] = function (G) {
            var J = [],
            L = o(G);
            for (var K = 0, H = L.length; K < H; K++) {
                var I = (K > 0 ? this.clone(true) : this).get();
                o.fn[F].apply(o(L[K]), I);
                J = J.concat(I)
            }
            return this.pushStack(J, E, G)
        }
    });
    o.each({
        removeAttr: function (E) {
            o.attr(this, E, "");
            if (this.nodeType == 1) {
                this.removeAttribute(E)
            }
        },
        addClass: function (E) {
            o.className.add(this, E)
        },
        removeClass: function (E) {
            o.className.remove(this, E)
        },
        toggleClass: function (F, E) {
            if (typeof E !== "boolean") {
                E = !o.className.has(this, F)
            }
            o.className[E ? "add" : "remove"](this, F)
        },
        remove: function (E) {
            if (!E || o.filter(E, [this]).length) {
                o("*", this).add([this]).each(function () {
                    o.event.remove(this);
                    o.removeData(this)
                });
                if (this.parentNode) {
                    this.parentNode.removeChild(this)
                }
            }
        },
        empty: function () {
            o(this).children().remove();
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
        }
    },
    function (E, F) {
        o.fn[E] = function () {
            return this.each(F, arguments)
        }
    });
    function j(E, F) {
        return E[0] && parseInt(o.curCSS(E[0], F, true), 10) || 0
    }
    var h = "jQuery" + e(),
    v = 0,
    A = {};
    o.extend({
        cache: {},
        data: function (F, E, G) {
            F = F == l ? A : F;
            var H = F[h];
            if (!H) {
                H = F[h] = ++v
            }
            if (E && !o.cache[H]) {
                o.cache[H] = {}
            }
            if (G !== g) {
                o.cache[H][E] = G
            }
            return E ? o.cache[H][E] : H
        },
        removeData: function (F, E) {
            F = F == l ? A : F;
            var H = F[h];
            if (E) {
                if (o.cache[H]) {
                    delete o.cache[H][E];
                    E = "";
                    for (E in o.cache[H]) {
                        break
                    }
                    if (!E) {
                        o.removeData(F)
                    }
                }
            } else {
                try {
                    delete F[h]
                } catch(G) {
                    if (F.removeAttribute) {
                        F.removeAttribute(h)
                    }
                }
                delete o.cache[H]
            }
        },
        queue: function (F, E, H) {
            if (F) {
                E = (E || "fx") + "queue";
                var G = o.data(F, E);
                if (!G || o.isArray(H)) {
                    G = o.data(F, E, o.makeArray(H))
                } else { if (H) {
                        G.push(H)
                    }
                }
            }
            return G
        },
        dequeue: function (H, G) {
            var E = o.queue(H, G),
            F = E.shift();
            if (!G || G === "fx") {
                F = E[0]
            }
            if (F !== g) {
                F.call(H)
            }
        }
    });
    o.fn.extend({
        data: function (E, G) {
            var H = E.split(".");
            H[1] = H[1] ? "." + H[1] : "";
            if (G === g) {
                var F = this.triggerHandler("getData" + H[1] + "!", [H
                    [0]]);
                if (F === g && this.length) {
                    F = o.data(this[0], E)
                }
                return F === g && H[1] ? this.data(H[0]) : F
            } else {
                return this.trigger("setData" + H[1] + "!", [H
                    [0], G]).each(function () {
                    o.data(this, E, G)
                })
            }
        },
        removeData: function (E) {
            return this.each(function () {
                o.removeData(this, E)
            })
        },
        queue: function (E, F) {
            if (typeof E !== "string") {
                F = E;
                E = "fx"
            }
            if (F === g) {
                return o.queue(this[0], E)
            }
            return this.each(function () {
                var G = o.queue(this, E, F);
                if (E == "fx" && G.length == 1) {
                    G[0].call(this)
                }
            })
        },
        dequeue: function (E) {
            return this.each(function () {
                o.dequeue(this, E)
            })
        }
    });
    (function () {
        var R = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
        L = 0,
        H = Object.prototype.toString;
        var F = function (Y, U, ab, ac) {
            ab = ab || [];
            U = U || document;
            if (U.nodeType !== 1 && U.nodeType !== 9) {
                return []
            }
            if (!Y || typeof Y !== "string") {
                return ab
            }
            var Z = [],
            W,
            af,
            ai,
            T,
            ad,
            V,
            X = true;
            R.lastIndex = 0;
            while ((W = R.exec(Y)) !== null) {
                Z.push(W[1]);
                if (W[2]) {
                    V = RegExp.rightContext;
                    break
                }
            }
            if (Z.length > 1 && M.exec(Y)) {
                if (Z.length === 2 && I.relative[Z
                    [0]]) {
                    af = J(Z[0] + Z[1], U)
                } else {
                    af = I.relative[Z
                        [0]] ? [U] : F(Z.shift(), U);
                    while (Z.length) {
                        Y = Z.shift();
                        if (I.relative[Y]) {
                            Y += Z.shift()
                        }
                        af = J(Y, af)
                    }
                }
            } else {
                var ae = ac ? {
                    expr: Z.pop(),
                    set: E(ac)
                } : F.find(Z.pop(), Z.length === 1 && U.parentNode ? U.parentNode : U, Q(U));
                af = F.filter(ae.expr, ae.set);
                if (Z.length > 0) {
                    ai = E(af)
                } else {
                    X = false
                }
                while (Z.length) {
                    var ah = Z.pop(),
                    ag = ah;
                    if (!I.relative[ah]) {
                        ah = ""
                    } else {
                        ag = Z.pop()
                    }
                    if (ag == null) {
                        ag = U
                    }
                    I.relative[ah](ai, ag, Q(U))
                }
            }
            if (!ai) {
                ai = af
            }
            if (!ai) {
                throw "Syntax error, unrecognized expression: " + (ah || Y)
            }
            if (H.call(ai) === "[object Array]") {
                if (!X) {
                    ab.push.apply(ab, ai)
                } else { if (U.nodeType === 1) {
                        for (var aa = 0; ai[aa] != null; aa++) {
                            if (ai[aa] && (ai[aa] === true || ai[aa].nodeType === 1 && K(U, ai[aa]))) {
                                ab.push(af[aa])
                            }
                        }
                    } else {
                        for (var aa = 0; ai[aa] != null; aa++) {
                            if (ai[aa] && ai[aa].nodeType === 1) {
                                ab.push(af[aa])
                            }
                        }
                    }
                }
            } else {
                E(ai, ab)
            }
            if (V) {
                F(V, U, ab, ac);
                if (G) {
                    hasDuplicate = false;
                    ab.sort(G);
                    if (hasDuplicate) {
                        for (var aa = 1; aa < ab.length; aa++) {
                            if (ab[aa] === ab[aa - 1]) {
                                ab.splice(aa--, 1)
                            }
                        }
                    }
                }
            }
            return ab
        };
        F.matches = function (T, U) {
            return F(T, null, null, U)
        };
        F.find = function (aa, T, ab) {
            var Z, X;
            if (!aa) {
                return []
            }
            for (var W = 0, V = I.order.length; W < V; W++) {
                var Y = I.order[W],
                X;
                if ((X = I.match[Y].exec(aa))) {
                    var U = RegExp.leftContext;
                    if (U.substr(U.length - 1) !== "\\") {
                        X[1] = (X[1] || "").replace(/\\/g, "");
                        Z = I.find[Y](X, T, ab);
                        if (Z != null) {
                            aa = aa.replace(I.match[Y], "");
                            break
                        }
                    }
                }
            }
            if (!Z) {
                Z = T.getElementsByTagName("*")
            }
            return {
                set: Z,
                expr: aa
            }
        };
        F.filter = function (ad, ac, ag, W) {
            var V = ad,
            ai = [],
            aa = ac,
            Y,
            T,
            Z = ac && ac[0] && Q(ac[0]);
            while (ad && ac.length) {
                for (var ab in I.filter) {
                    if ((Y = I.match[ab].exec(ad)) != null) {
                        var U = I.filter[ab],
                        ah,
                        af;
                        T = false;
                        if (aa == ai) {
                            ai = []
                        }
                        if (I.preFilter[ab]) {
                            Y = I.preFilter[ab](Y, aa, ag, ai, W, Z);
                            if (!Y) {
                                T = ah = true
                            } else { if (Y === true) {
                                    continue
                                }
                            }
                        }
                        if (Y) {
                            for (var X = 0;
                            (af = aa[X]) != null; X++) {
                                if (af) {
                                    ah = U(af, Y, X, aa);
                                    var ae = W ^ !!ah;
                                    if (ag && ah != null) {
                                        if (ae) {
                                            T = true
                                        } else {
                                            aa[X] = false
                                        }
                                    } else { if (ae) {
                                            ai.push(af);
                                            T = true
                                        }
                                    }
                                }
                            }
                        }
                        if (ah !== g) {
                            if (!ag) {
                                aa = ai
                            }
                            ad = ad.replace(I.match[ab], "");
                            if (!T) {
                                return []
                            }
                            break
                        }
                    }
                }
                if (ad == V) {
                    if (T == null) {
                        throw "Syntax error, unrecognized expression: " + ad
                    } else {
                        break
                    }
                }
                V = ad
            }
            return aa
        };
        var I = F.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
            },
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function (T) {
                    return T.getAttribute("href")
                }
            },
            relative: {
                "+": function (aa, T, Z) {
                    var X = typeof T === "string",
                    ab = X && !/\W/.test(T),
                    Y = X && !ab;
                    if (ab && !Z) {
                        T = T.toUpperCase()
                    }
                    for (var W = 0, V = aa.length, U; W < V; W++) {
                        if ((U = aa[W])) {
                            while ((U = U.previousSibling) && U.nodeType !== 1) {}
                            aa[W] = Y || U && U.nodeName === T ? U || false : U === T
                        }
                    }
                    if (Y) {
                        F.filter(T, aa, true)
                    }
                },
                ">": function (Z, U, aa) {
                    var X = typeof U === "string";
                    if (X && !/\W/.test(U)) {
                        U = aa ? U : U.toUpperCase();
                        for (var V = 0, T = Z.length; V < T; V++) {
                            var Y = Z[V];
                            if (Y) {
                                var W = Y.parentNode;
                                Z[V] = W.nodeName === U ? W : false
                            }
                        }
                    } else {
                        for (var V = 0, T = Z.length; V < T; V++) {
                            var Y = Z[V];
                            if (Y) {
                                Z[V] = X ? Y.parentNode : Y.parentNode === U
                            }
                        }
                        if (X) {
                            F.filter(U, Z, true)
                        }
                    }
                },
                "": function (W, U, Y) {
                    var V = L++,
                    T = S;
                    if (!U.match(/\W/)) {
                        var X = U = Y ? U : U.toUpperCase();
                        T = P
                    }
                    T("parentNode", U, V, W, X, Y)
                },
                "~": function (W, U, Y) {
                    var V = L++,
                    T = S;
                    if (typeof U === "string" && !U.match(/\W/)) {
                        var X = U = Y ? U : U.toUpperCase();
                        T = P
                    }
                    T("previousSibling", U, V, W, X, Y)
                }
            },
            find: {
                ID: function (U, V, W) {
                    if (typeof V.getElementById !== "undefined" && !W) {
                        var T = V.getElementById(U[1]);
                        return T ? [T] : []
                    }
                },
                NAME: function (V, Y, Z) {
                    if (typeof Y.getElementsByName !== "undefined") {
                        var U = [],
                        X = Y.getElementsByName(V[1]);
                        for (var W = 0, T = X.length; W < T; W++) {
                            if (X[W].getAttribute("name") === V[1]) {
                                U.push(X[W])
                            }
                        }
                        return U.length === 0 ? null : U
                    }
                },
                TAG: function (T, U) {
                    return U.getElementsByTagName(T[1])
                }
            },
            preFilter: {
                CLASS: function (W, U, V, T, Z, aa) {
                    W = " " + W[1].replace(/\\/g, "") + " ";
                    if (aa) {
                        return W
                    }
                    for (var X = 0, Y;
                    (Y = U[X]) != null; X++) {
                        if (Y) {
                            if (Z ^ (Y.className && (" " + Y.className + " ").indexOf(W) >= 0)) {
                                if (!V) {
                                    T.push(Y)
                                }
                            } else { if (V) {
                                    U[X] = false
                                }
                            }
                        }
                    }
                    return false
                },
                ID: function (T) {
                    return T[1].replace(/\\/g, "")
                },
                TAG: function (U, T) {
                    for (var V = 0; T[V] === false; V++) {}
                    return T[V] && Q(T[V]) ? U[1] : U[1].toUpperCase()
                },
                CHILD: function (T) {
                    if (T[1] == "nth") {
                        var U = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(T[2] == "even" && "2n" || T[2] == "odd" && "2n+1" || !/\D/.test(T[2]) && "0n+" + T[2] || T[2]);
                        T[2] = (U[1] + (U[2] || 1)) - 0;
                        T[3] = U[3] - 0
                    }
                    T[0] = L++;
                    return T
                },
                ATTR: function (X, U, V, T, Y, Z) {
                    var W = X[1].replace(/\\/g, "");
                    if (!Z && I.attrMap[W]) {
                        X[1] = I.attrMap[W]
                    }
                    if (X[2] === "~=") {
                        X[4] = " " + X[4] + " "
                    }
                    return X
                },
                PSEUDO: function (X, U, V, T, Y) {
                    if (X[1] === "not") {
                        if (X[3].match(R).length > 1 || /^\w/.test(X[3])) {
                            X[3] = F(X[3], null, null, U)
                        } else {
                            var W = F.filter(X[3], U, V, true ^ Y);
                            if (!V) {
                                T.push.apply(T, W)
                            }
                            return false
                        }
                    } else { if (I.match.POS.test(X[0]) || I.match.CHILD.test(X[0])) {
                            return true
                        }
                    }
                    return X
                },
                POS: function (T) {
                    T.unshift(true);
                    return T
                }
            },
            filters: {
                enabled: function (T) {
                    return T.disabled === false && T.type !== "hidden"
                },
                disabled: function (T) {
                    return T.disabled === true
                },
                checked: function (T) {
                    return T.checked === true
                },
                selected: function (T) {
                    T.parentNode.selectedIndex;
                    return T.selected === true
                },
                parent: function (T) {
                    return !! T.firstChild
                },
                empty: function (T) {
                    return !T.firstChild
                },
                has: function (V, U, T) {
                    return !! F(T[3], V).length
                },
                header: function (T) {
                    return /h\d/i.test(T.nodeName)
                },
                text: function (T) {
                    return "text" === T.type
                },
                radio: function (T) {
                    return "radio" === T.type
                },
                checkbox: function (T) {
                    return "checkbox" === T.type
                },
                file: function (T) {
                    return "file" === T.type
                },
                password: function (T) {
                    return "password" === T.type
                },
                submit: function (T) {
                    return "submit" === T.type
                },
                image: function (T) {
                    return "image" === T.type
                },
                reset: function (T) {
                    return "reset" === T.type
                },
                button: function (T) {
                    return "button" === T.type || T.nodeName.toUpperCase() === "BUTTON"
                },
                input: function (T) {
                    return /input|select|textarea|button/i.test(T.nodeName)
                }
            },
            setFilters: {
                first: function (U, T) {
                    return T === 0
                },
                last: function (V, U, T, W) {
                    return U === W.length - 1
                },
                even: function (U, T) {
                    return T % 2 === 0
                },
                odd: function (U, T) {
                    return T % 2 === 1
                },
                lt: function (V, U, T) {
                    return U < T[3] - 0
                },
                gt: function (V, U, T) {
                    return U > T[3] - 0
                },
                nth: function (V, U, T) {
                    return T[3] - 0 == U
                },
                eq: function (V, U, T) {
                    return T[3] - 0 == U
                }
            },
            filter: {
                PSEUDO: function (Z, V, W, aa) {
                    var U = V[1],
                    X = I.filters[U];
                    if (X) {
                        return X(Z, W, V, aa)
                    } else { if (U === "contains") {
                            return (Z.textContent || Z.innerText || "").indexOf(V[3]) >= 0
                        } else { if (U === "not") {
                                var Y = V[3];
                                for (var W = 0, T = Y.length; W < T; W++) {
                                    if (Y[W] === Z) {
                                        return false
                                    }
                                }
                                return true
                            }
                        }
                    }
                },
                CHILD: function (T, W) {
                    var Z = W[1],
                    U = T;
                    switch (Z) {
                    case "only":
                    case "first":
                        while (U = U.previousSibling) {
                            if (U.nodeType === 1) {
                                return false
                            }
                        }
                        if (Z == "first") {
                            return true
                        }
                        U = T;
                    case "last":
                        while (U = U.nextSibling) {
                            if (U.nodeType === 1) {
                                return false
                            }
                        }
                        return true;
                    case "nth":
                        var V = W[2],
                        ac = W[3];
                        if (V == 1 && ac == 0) {
                            return true
                        }
                        var Y = W[0],
                        ab = T.parentNode;
                        if (ab && (ab.sizcache !== Y || !T.nodeIndex)) {
                            var X = 0;
                            for (U = ab.firstChild; U; U = U.nextSibling) {
                                if (U.nodeType === 1) {
                                    U.nodeIndex = ++X
                                }
                            }
                            ab.sizcache = Y
                        }
                        var aa = T.nodeIndex - ac;
                        if (V == 0) {
                            return aa == 0
                        } else {
                            return (aa % V == 0 && aa / V >= 0)
                        }
                    }
                },
                ID: function (U, T) {
                    return U.nodeType === 1 && U.getAttribute("id") === T
                },
                TAG: function (U, T) {
                    return (T === "*" && U.nodeType === 1) || U.nodeName === T
                },
                CLASS: function (U, T) {
                    return (" " + (U.className || U.getAttribute("class")) + " ").indexOf(T) > -1
                },
                ATTR: function (Y, W) {
                    var V = W[1],
                    T = I.attrHandle[V] ? I.attrHandle[V](Y) : Y[V] != null ? Y[V] : Y.getAttribute(V),
                    Z = T + "",
                    X = W[2],
                    U = W[4];
                    return T == null ? X === "!=" : X === "=" ? Z === U : X === "*=" ? Z.indexOf(U) >= 0 : X === "~=" ? (" " + Z + " ").indexOf(U) >= 0 : !U ? Z && T !== false : X === "!=" ? Z != U : X === "^=" ? Z.indexOf(U) === 0 : X === "$=" ? Z.substr(Z.length - U.length) === U : X === "|=" ? Z === U || Z.substr(0, U.length + 1) === U + "-" : false
                },
                POS: function (X, U, V, Y) {
                    var T = U[2],
                    W = I.setFilters[T];
                    if (W) {
                        return W(X, V, U, Y)
                    }
                }
            }
        };
        var M = I.match.POS;
        for (var O in I.match) {
            I.match[O] = RegExp(I.match[O].source + /(?![^\[]*\])(?![^\(]*\))/.source)
        }
        var E = function (U, T) {
            U = Array.prototype.slice.call(U);
            if (T) {
                T.push.apply(T, U);
                return T
            }
            return U
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes)
        } catch(N) {
            E = function (X, W) {
                var U = W || [];
                if (H.call(X) === "[object Array]") {
                    Array.prototype.push.apply(U, X)
                } else { if (typeof X.length === "number") {
                        for (var V = 0, T = X.length; V < T; V++) {
                            U.push(X[V])
                        }
                    } else {
                        for (var V = 0; X[V]; V++) {
                            U.push(X[V])
                        }
                    }
                }
                return U
            }
        }
        var G;
        if (document.documentElement.compareDocumentPosition) {
            G = function (U, T) {
                var V = U.compareDocumentPosition(T) & 4 ? -1 : U === T ? 0 : 1;
                if (V === 0) {
                    hasDuplicate = true
                }
                return V
            }
        } else { if ("sourceIndex" in document.documentElement) {
                G = function (U, T) {
                    var V = U.sourceIndex - T.sourceIndex;
                    if (V === 0) {
                        hasDuplicate = true
                    }
                    return V
                }
            } else { if (document.createRange) {
                    G = function (W, U) {
                        var V = W.ownerDocument.createRange(),
                        T = U.ownerDocument.createRange();
                        V.selectNode(W);
                        V.collapse(true);
                        T.selectNode(U);
                        T.collapse(true);
                        var X = V.compareBoundaryPoints(Range.START_TO_END, T);
                        if (X === 0) {
                            hasDuplicate = true
                        }
                        return X
                    }
                }
            }
        } (function () {
            var U = document.createElement("form"),
            V = "script" + (new Date).getTime();
            U.innerHTML = "<input name='" + V + "'/>";
            var T = document.documentElement;
            T.insertBefore(U, T.firstChild);
            if ( !! document.getElementById(V)) {
                I.find.ID = function (X, Y, Z) {
                    if (typeof Y.getElementById !== "undefined" && !Z) {
                        var W = Y.getElementById(X[1]);
                        return W ? W.id === X[1] || typeof W.getAttributeNode !== "undefined" && W.getAttributeNode("id").nodeValue === X[1] ? [W] : g : []
                    }
                };
                I.filter.ID = function (Y, W) {
                    var X = typeof Y.getAttributeNode !== "undefined" && Y.getAttributeNode("id");
                    return Y.nodeType === 1 && X && X.nodeValue === W
                }
            }
            T.removeChild(U)
        })();
        (function () {
            var T = document.createElement("div");
            T.appendChild(document.createComment(""));
            if (T.getElementsByTagName("*").length > 0) {
                I.find.TAG = function (U, Y) {
                    var X = Y.getElementsByTagName(U[1]);
                    if (U[1] === "*") {
                        var W = [];
                        for (var V = 0; X[V]; V++) {
                            if (X[V].nodeType === 1) {
                                W.push(X[V])
                            }
                        }
                        X = W
                    }
                    return X
                }
            }
            T.innerHTML = "<a href='#'></a>";
            if (T.firstChild && typeof T.firstChild.getAttribute !== "undefined" && T.firstChild.getAttribute("href") !== "#") {
                I.attrHandle.href = function (U) {
                    return U.getAttribute("href", 2)
                }
            }
        })();
        if (document.querySelectorAll) {
            (function () {
                var T = F,
                U = document.createElement("div");
                U.innerHTML = "<p class='TEST'></p>";
                if (U.querySelectorAll && U.querySelectorAll(".TEST").length === 0) {
                    return
                }
                F = function (Y, X, V, W) {
                    X = X || document;
                    if (!W && X.nodeType === 9 && !Q(X)) {
                        try {
                            return E(X.querySelectorAll(Y), V)
                        } catch(Z) {}
                    }
                    return T(Y, X, V, W)
                };
                F.find = T.find;
                F.filter = T.filter;
                F.selectors = T.selectors;
                F.matches = T.matches
            })()
        }
        if (document.getElementsByClassName && document.documentElement.getElementsByClassName) {
            (function () {
                var T = document.createElement("div");
                T.innerHTML = "<div class='test e'></div><div class='test'></div>";
                if (T.getElementsByClassName("e").length === 0) {
                    return
                }
                T.lastChild.className = "e";
                if (T.getElementsByClassName("e").length === 1) {
                    return
                }
                I.order.splice(1, 0, "CLASS");
                I.find.CLASS = function (U, V, W) {
                    if (typeof V.getElementsByClassName !== "undefined" && !W) {
                        return V.getElementsByClassName(U[1])
                    }
                }
            })()
        }
        function P(U, Z, Y, ad, aa, ac) {
            var ab = U == "previousSibling" && !ac;
            for (var W = 0, V = ad.length; W < V; W++) {
                var T = ad[W];
                if (T) {
                    if (ab && T.nodeType === 1) {
                        T.sizcache = Y;
                        T.sizset = W
                    }
                    T = T[U];
                    var X = false;
                    while (T) {
                        if (T.sizcache === Y) {
                            X = ad[T.sizset];
                            break
                        }
                        if (T.nodeType === 1 && !ac) {
                            T.sizcache = Y;
                            T.sizset = W
                        }
                        if (T.nodeName === Z) {
                            X = T;
                            break
                        }
                        T = T[U]
                    }
                    ad[W] = X
                }
            }
        }
        function S(U, Z, Y, ad, aa, ac) {
            var ab = U == "previousSibling" && !ac;
            for (var W = 0, V = ad.length; W < V; W++) {
                var T = ad[W];
                if (T) {
                    if (ab && T.nodeType === 1) {
                        T.sizcache = Y;
                        T.sizset = W
                    }
                    T = T[U];
                    var X = false;
                    while (T) {
                        if (T.sizcache === Y) {
                            X = ad[T.sizset];
                            break
                        }
                        if (T.nodeType === 1) {
                            if (!ac) {
                                T.sizcache = Y;
                                T.sizset = W
                            }
                            if (typeof Z !== "string") {
                                if (T === Z) {
                                    X = true;
                                    break
                                }
                            } else { if (F.filter(Z, [T]).length > 0) {
                                    X = T;
                                    break
                                }
                            }
                        }
                        T = T[U]
                    }
                    ad[W] = X
                }
            }
        }
        var K = document.compareDocumentPosition ?
        function (U, T) {
            return U.compareDocumentPosition(T) & 16
        } : function (U, T) {
            return U !== T && (U.contains ? U.contains(T) : true)
        };
        var Q = function (T) {
            return T.nodeType === 9 && T.documentElement.nodeName !== "HTML" || !!T.ownerDocument && Q(T.ownerDocument)
        };
        var J = function (T, aa) {
            var W = [],
            X = "",
            Y,
            V = aa.nodeType ? [aa] : aa;
            while ((Y = I.match.PSEUDO.exec(T))) {
                X += Y[0];
                T = T.replace(I.match.PSEUDO, "")
            }
            T = I.relative[T] ? T + "*" : T;
            for (var Z = 0, U = V.length; Z < U; Z++) {
                F(T, V[Z], W)
            }
            return F.filter(X, W)
        };
        o.find = F;
        o.filter = F.filter;
        o.expr = F.selectors;
        o.expr[":"] = o.expr.filters;
        F.selectors.filters.hidden = function (T) {
            return T.offsetWidth === 0 || T.offsetHeight === 0
        };
        F.selectors.filters.visible = function (T) {
            return T.offsetWidth > 0 || T.offsetHeight > 0
        };
        F.selectors.filters.animated = function (T) {
            return o.grep(o.timers, function (U) {
                return T === U.elem
            }).length
        };
        o.multiFilter = function (V, T, U) {
            if (U) {
                V = ":not(" + V + ")"
            }
            return F.matches(V, T)
        };
        o.dir = function (V, U) {
            var T = [],
            W = V[U];
            while (W && W != document) {
                if (W.nodeType == 1) {
                    T.push(W)
                }
                W = W[U]
            }
            return T
        };
        o.nth = function (X, T, V, W) {
            T = T || 1;
            var U = 0;
            for (; X; X = X[V]) {
                if (X.nodeType == 1 && ++U == T) {
                    break
                }
            }
            return X
        };
        o.sibling = function (V, U) {
            var T = [];
            for (; V; V = V.nextSibling) {
                if (V.nodeType == 1 && V != U) {
                    T.push(V)
                }
            }
            return T
        };
        return;
        l.Sizzle = F
    })();
    o.event = {
        add: function (I, F, H, K) {
            if (I.nodeType == 3 || I.nodeType == 8) {
                return
            }
            if (I.setInterval && I != l) {
                I = l
            }
            if (!H.guid) {
                H.guid = this.guid++
            }
            if (K !== g) {
                var G = H;
                H = this.proxy(G);
                H.data = K
            }
            var E = o.data(I, "events") || o.data(I, "events", {}),
            J = o.data(I, "handle") || o.data(I, "handle", function () {
                return typeof o !== "undefined" && !o.event.triggered ? o.event.handle.apply(arguments.callee.elem, arguments) : g
            });
            J.elem = I;
            o.each(F.split(/\s+/), function (M, N) {
                var O = N.split(".");
                N = O.shift();
                H.type = O.slice().sort().join(".");
                var L = E[N];
                if (o.event.specialAll[N]) {
                    o.event.specialAll[N].setup.call(I, K, O)
                }
                if (!L) {
                    L = E[N] = {};
                    if (!o.event.special[N] || o.event.special[N].setup.call(I, K, O) === false) {
                        if (I.addEventListener) {
                            I.addEventListener(N, J, false)
                        } else { if (I.attachEvent) {
                                I.attachEvent("on" + N, J)
                            }
                        }
                    }
                }
                L[H.guid] = H;
                o.event.global[N] = true
            });
            I = null
        },
        guid: 1,
        global: {},
        remove: function (K, H, J) {
            if (K.nodeType == 3 || K.nodeType == 8) {
                return
            }
            var G = o.data(K, "events"),
            F,
            E;
            if (G) {
                if (H === g || (typeof H === "string" && H.charAt(0) == ".")) {
                    for (var I in G) {
                        this.remove(K, I + (H || ""))
                    }
                } else { if (H.type) {
                        J = H.handler;
                        H = H.type
                    }
                    o.each(H.split(/\s+/), function (M, O) {
                        var Q = O.split(".");
                        O = Q.shift();
                        var N = RegExp("(^|\\.)" + Q.slice().sort().join(".*\\.") + "(\\.|$)");
                        if (G[O]) {
                            if (J) {
                                delete G[O][J.guid]
                            } else {
                                for (var P in G[O]) {
                                    if (N.test(G[O][P].type)) {
                                        delete G[O][P]
                                    }
                                }
                            }
                            if (o.event.specialAll[O]) {
                                o.event.specialAll[O].teardown.call(K, Q)
                            }
                            for (F in G[O]) {
                                break
                            }
                            if (!F) {
                                if (!o.event.special[O] || o.event.special[O].teardown.call(K, Q) === false) {
                                    if (K.removeEventListener) {
                                        K.removeEventListener(O, o.data(K, "handle"), false)
                                    } else { if (K.detachEvent) {
                                            K.detachEvent("on" + O, o.data(K, "handle"))
                                        }
                                    }
                                }
                                F = null;
                                delete G[O]
                            }
                        }
                    })
                }
                for (F in G) {
                    break
                }
                if (!F) {
                    var L = o.data(K, "handle");
                    if (L) {
                        L.elem = null
                    }
                    o.removeData(K, "events");
                    o.removeData(K, "handle")
                }
            }
        },
        trigger: function (I, K, H, E) {
            var G = I.type || I;
            if (!E) {
                I = typeof I === "object" ? I[h] ? I : o.extend(o.Event(G), I) : o.Event(G);
                if (G.indexOf("!") >= 0) {
                    I.type = G = G.slice(0, -1);
                    I.exclusive = true
                }
                if (!H) {
                    I.stopPropagation();
                    if (this.global[G]) {
                        o.each(o.cache, function () {
                            if (this.events && this.events[G]) {
                                o.event.trigger(I, K, this.handle.elem)
                            }
                        })
                    }
                }
                if (!H || H.nodeType == 3 || H.nodeType == 8) {
                    return g
                }
                I.result = g;
                I.target = H;
                K = o.makeArray(K);
                K.unshift(I)
            }
            I.currentTarget = H;
            var J = o.data(H, "handle");
            if (J) {
                J.apply(H, K)
            }
            if ((!H[G] || (o.nodeName(H, "a") && G == "click")) && H["on" + G] && H["on" + G].apply(H, K) === false) {
                I.result = false
            }
            if (!E && H[G] && !I.isDefaultPrevented() && !(o.nodeName(H, "a") && G == "click")) {
                this.triggered = true;
                try {
                    H[G]()
                } catch(L) {}
            }
            this.triggered = false;
            if (!I.isPropagationStopped()) {
                var F = H.parentNode || H.ownerDocument;
                if (F) {
                    o.event.trigger(I, K, F, true)
                }
            }
        },
        handle: function (K) {
            var J, E;
            K = arguments[0] = o.event.fix(K || l.event);
            K.currentTarget = this;
            var L = K.type.split(".");
            K.type = L.shift();
            J = !L.length && !K.exclusive;
            var I = RegExp("(^|\\.)" + L.slice().sort().join(".*\\.") + "(\\.|$)");
            E = (o.data(this, "events") || {})[K.type];
            for (var G in E) {
                var H = E[G];
                if (J || I.test(H.type)) {
                    K.handler = H;
                    K.data = H.data;
                    var F = H.apply(this, arguments);
                    if (F !== g) {
                        K.result = F;
                        if (F === false) {
                            K.preventDefault();
                            K.stopPropagation()
                        }
                    }
                    if (K.isImmediatePropagationStopped()) {
                        break
                    }
                }
            }
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function (H) {
            if (H[h]) {
                return H
            }
            var F = H;
            H = o.Event(F);
            for (var G = this.props.length, J; G;) {
                J = this.props[--G];
                H[J] = F[J]
            }
            if (!H.target) {
                H.target = H.srcElement || document
            }
            if (H.target.nodeType == 3) {
                H.target = H.target.parentNode
            }
            if (!H.relatedTarget && H.fromElement) {
                H.relatedTarget = H.fromElement == H.target ? H.toElement : H.fromElement
            }
            if (H.pageX == null && H.clientX != null) {
                var I = document.documentElement,
                E = document.body;
                H.pageX = H.clientX + (I && I.scrollLeft || E && E.scrollLeft || 0) - (I.clientLeft || 0);
                H.pageY = H.clientY + (I && I.scrollTop || E && E.scrollTop || 0) - (I.clientTop || 0)
            }
            if (!H.which && ((H.charCode || H.charCode === 0) ? H.charCode : H.keyCode)) {
                H.which = H.charCode || H.keyCode
            }
            if (!H.metaKey && H.ctrlKey) {
                H.metaKey = H.ctrlKey
            }
            if (!H.which && H.button) {
                H.which = (H.button & 1 ? 1 : (H.button & 2 ? 3 : (H.button & 4 ? 2 : 0)))
            }
            return H
        },
        proxy: function (F, E) {
            E = E ||
            function () {
                return F.apply(this, arguments)
            };
            E.guid = F.guid = F.guid || E.guid || this.guid++;
            return E
        },
        special: {
            ready: {
                setup: B,
                teardown: function () {}
            }
        },
        specialAll: {
            live: {
                setup: function (E, F) {
                    o.event.add(this, F[0], c)
                },
                teardown: function (G) {
                    if (G.length) {
                        var E = 0,
                        F = RegExp("(^|\\.)" + G[0] + "(\\.|$)");
                        o.each((o.data(this, "events").live || {}), function () {
                            if (F.test(this.type)) {
                                E++
                            }
                        });
                        if (E < 1) {
                            o.event.remove(this, G[0], c)
                        }
                    }
                }
            }
        }
    };
    o.Event = function (E) {
        if (!this.preventDefault) {
            return new o.Event(E)
        }
        if (E && E.type) {
            this.originalEvent = E;
            this.type = E.type
        } else {
            this.type = E
        }
        this.timeStamp = e();
        this[h] = true
    };
    function k() {
        return false
    }
    function u() {
        return true
    }
    o.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = u;
            var E = this.originalEvent;
            if (!E) {
                return
            }
            if (E.preventDefault) {
                E.preventDefault()
            }
            E.returnValue = false
        },
        stopPropagation: function () {
            this.isPropagationStopped = u;
            var E = this.originalEvent;
            if (!E) {
                return
            }
            if (E.stopPropagation) {
                E.stopPropagation()
            }
            E.cancelBubble = true
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = u;
            this.stopPropagation()
        },
        isDefaultPrevented: k,
        isPropagationStopped: k,
        isImmediatePropagationStopped: k
    };
    var a = function (F) {
        var E = F.relatedTarget;
        while (E && E != this) {
            try {
                E = E.parentNode
            } catch(G) {
                E = this
            }
        }
        if (E != this) {
            F.type = F.data;
            o.event.handle.apply(this, arguments)
        }
    };
    o.each({
        mouseover: "mouseenter",
        mouseout: "mouseleave"
    },
    function (F, E) {
        o.event.special[E] = {
            setup: function () {
                o.event.add(this, F, a, E)
            },
            teardown: function () {
                o.event.remove(this, F, a)
            }
        }
    });
    o.fn.extend({
        bind: function (F, G, E) {
            return F == "unload" ? this.one(F, G, E) : this.each(function () {
                o.event.add(this, F, E || G, E && G)
            })
        },
        one: function (G, H, F) {
            var E = o.event.proxy(F || H, function (I) {
                o(this).unbind(I, E);
                return (F || H).apply(this, arguments)
            });
            return this.each(function () {
                o.event.add(this, G, E, F && H)
            })
        },
        unbind: function (F, E) {
            return this.each(function () {
                o.event.remove(this, F, E)
            })
        },
        trigger: function (E, F) {
            return this.each(function () {
                o.event.trigger(E, F, this)
            })
        },
        triggerHandler: function (E, G) {
            if (this[0]) {
                var F = o.Event(E);
                F.preventDefault();
                F.stopPropagation();
                o.event.trigger(F, G, this[0]);
                return F.result
            }
        },
        toggle: function (G) {
            var E = arguments,
            F = 1;
            while (F < E.length) {
                o.event.proxy(G, E[F++])
            }
            return this.click(o.event.proxy(G, function (H) {
                this.lastToggle = (this.lastToggle || 0) % F;
                H.preventDefault();
                return E[this.lastToggle++].apply(this, arguments) || false
            }))
        },
        hover: function (E, F) {
            return this.mouseenter(E).mouseleave(F)
        },
        ready: function (E) {
            B();
            if (o.isReady) {
                E.call(document, o)
            } else {
                o.readyList.push(E)
            }
            return this
        },
        live: function (G, F) {
            var E = o.event.proxy(F);
            E.guid += this.selector + G;
            o(document).bind(i(G, this.selector), this.selector, E);
            return this
        },
        die: function (F, E) {
            o(document).unbind(i(F, this.selector), E ? {
                guid: E.guid + this.selector + F
            } : null);
            return this
        }
    });
    function c(H) {
        var E = RegExp("(^|\\.)" + H.type + "(\\.|$)"),
        G = true,
        F = [];
        o.each(o.data(this, "events").live || [], function (I, J) {
            if (E.test(J.type)) {
                var K = o(H.target).closest(J.data)[0];
                if (K) {
                    F.push({
                        elem: K,
                        fn: J
                    })
                }
            }
        });
        F.sort(function (J, I) {
            return o.data(J.elem, "closest") - o.data(I.elem, "closest")
        });
        o.each(F, function () {
            if (this.fn.call(this.elem, H, this.fn.data) === false) {
                return (G = false)
            }
        });
        return G
    }
    function i(F, E) {
        return ["live", F, E.replace(/\./g, "`").replace(/ /g, "|")].join(".")
    }
    o.extend({
        isReady: false,
        readyList: [],
        ready: function () {
            if (!o.isReady) {
                o.isReady = true;
                if (o.readyList) {
                    o.each(o.readyList, function () {
                        this.call(document, o)
                    });
                    o.readyList = null
                }
                o(document).triggerHandler("ready")
            }
        }
    });
    var x = false;
    function B() {
        if (x) {
            return
        }
        x = true;
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function () {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                o.ready()
            },
            false)
        } else { if (document.attachEvent) {
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        document.detachEvent("onreadystatechange", arguments.callee);
                        o.ready()
                    }
                });
                if (document.documentElement.doScroll && l == l.top) {
                    (function () {
                        if (o.isReady) {
                            return
                        }
                        try {
                            document.documentElement.doScroll("left")
                        } catch(E) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        o.ready()
                    })()
                }
            }
        }
        o.event.add(l, "load", o.ready)
    }
    o.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error").split(","), function (F, E) {
        o.fn[E] = function (G) {
            return G ? this.bind(E, G) : this.trigger(E)
        }
    });
    o(l).bind("unload", function () {
        for (var E in o.cache) {
            if (E != 1 && o.cache[E].handle) {
                o.event.remove(o.cache[E].handle.elem)
            }
        }
    });
    (function () {
        o.support = {};
        var F = document.documentElement,
        G = document.createElement("script"),
        K = document.createElement("div"),
        J = "script" + (new Date).getTime();
        K.style.display = "none";
        K.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';
        var H = K.getElementsByTagName("*"),
        E = K.getElementsByTagName("a")[0];
        if (!H || !H.length || !E) {
            return
        }
        o.support = {
            leadingWhitespace: K.firstChild.nodeType == 3,
            tbody: !K.getElementsByTagName("tbody").length,
            objectAll: !!K.getElementsByTagName("object")[0].getElementsByTagName("*").length,
            htmlSerialize: !!K.getElementsByTagName("link").length,
            style: /red/.test(E.getAttribute("style")),
            hrefNormalized: E.getAttribute("href") === "/a",
            opacity: E.style.opacity === "0.5",
            cssFloat: !!E.style.cssFloat,
            scriptEval: false,
            noCloneEvent: true,
            boxModel: null
        };
        G.type = "text/javascript";
        try {
            G.appendChild(document.createTextNode("window." + J + "=1;"))
        } catch(I) {}
        F.insertBefore(G, F.firstChild);
        if (l[J]) {
            o.support.scriptEval = true;
            delete l[J]
        }
        F.removeChild(G);
        if (K.attachEvent && K.fireEvent) {
            K.attachEvent("onclick", function () {
                o.support.noCloneEvent = false;
                K.detachEvent("onclick", arguments.callee)
            });
            K.cloneNode(true).fireEvent("onclick")
        }
        o(function () {
            var L = document.createElement("div");
            L.style.width = L.style.paddingLeft = "1px";
            document.body.appendChild(L);
            o.boxModel = o.support.boxModel = L.offsetWidth === 2;
            document.body.removeChild(L).style.display = "none"
        })
    })();
    var w = o.support.cssFloat ? "cssFloat" : "styleFloat";
    o.props = {
        "for": "htmlFor",
        "class": "className",
        "float": w,
        cssFloat: w,
        styleFloat: w,
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        tabindex: "tabIndex"
    };
    o.fn.extend({
        _load: o.fn.load,
        load: function (G, J, K) {
            if (typeof G !== "string") {
                return this._load(G)
            }
            var I = G.indexOf(" ");
            if (I >= 0) {
                var E = G.slice(I, G.length);
                G = G.slice(0, I)
            }
            var H = "GET";
            if (J) {
                if (o.isFunction(J)) {
                    K = J;
                    J = null
                } else { if (typeof J === "object") {
                        J = o.param(J);
                        H = "POST"
                    }
                }
            }
            var F = this;
            o.ajax({
                url: G,
                type: H,
                dataType: "html",
                data: J,
                complete: function (M, L) {
                    if (L == "success" || L == "notmodified") {
                        F.html(E ? o("<div/>").append(M.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(E) : M.responseText)
                    }
                    if (K) {
                        F.each(K, [M.responseText, L, M])
                    }
                }
            });
            return this
        },
        serialize: function () {
            return o.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                return this.elements ? o.makeArray(this.elements) : this
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password|search/i.test(this.type))
            }).map(function (E, F) {
                var G = o(this).val();
                return G == null ? null : o.isArray(G) ? o.map(G, function (I, H) {
                    return {
                        name: F.name,
                        value: I
                    }
                }) : {
                    name: F.name,
                    value: G
                }
            }).get()
        }
    });
    o.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function (E, F) {
        o.fn[F] = function (G) {
            return this.bind(F, G)
        }
    });
    var r = e();
    o.extend({
        get: function (E, G, H, F) {
            if (o.isFunction(G)) {
                H = G;
                G = null
            }
            return o.ajax({
                type: "GET",
                url: E,
                data: G,
                success: H,
                dataType: F
            })
        },
        getScript: function (E, F) {
            return o.get(E, null, F, "script")
        },
        getJSON: function (E, F, G) {
            return o.get(E, F, G, "json")
        },
        post: function (E, G, H, F) {
            if (o.isFunction(G)) {
                H = G;
                G = {}
            }
            return o.ajax({
                type: "POST",
                url: E,
                data: G,
                success: H,
                dataType: F
            })
        },
        ajaxSetup: function (E) {
            o.extend(o.ajaxSettings, E)
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            xhr: function () {
                return l.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        ajax: function (M) {
            M = o.extend(true, M, o.extend(true, {},
            o.ajaxSettings, M));
            var W, F = /=\?(&|$)/g,
            R, V, G = M.type.toUpperCase();
            if (M.data && M.processData && typeof M.data !== "string") {
                M.data = o.param(M.data)
            }
            if (M.dataType == "jsonp") {
                if (G == "GET") {
                    if (!M.url.match(F)) {
                        M.url += (M.url.match(/\?/) ? "&" : "?") + (M.jsonp || "callback") + "=?"
                    }
                } else { if (!M.data || !M.data.match(F)) {
                        M.data = (M.data ? M.data + "&" : "") + (M.jsonp || "callback") + "=?"
                    }
                }
                M.dataType = "json"
            }
            if (M.dataType == "json" && (M.data && M.data.match(F) || M.url.match(F))) {
                W = "jsonp" + r++;
                if (M.data) {
                    M.data = (M.data + "").replace(F, "=" + W + "$1")
                }
                M.url = M.url.replace(F, "=" + W + "$1");
                M.dataType = "script";
                l[W] = function (X) {
                    V = X;
                    I();
                    L();
                    l[W] = g;
                    try {
                        delete l[W]
                    } catch(Y) {}
                    if (H) {
                        H.removeChild(T)
                    }
                }
            }
            if (M.dataType == "script" && M.cache == null) {
                M.cache = false
            }
            if (M.cache === false && G == "GET") {
                var E = e();
                var U = M.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + E + "$2");
                M.url = U + ((U == M.url) ? (M.url.match(/\?/) ? "&" : "?") + "_=" + E : "")
            }
            if (M.data && G == "GET") {
                M.url += (M.url.match(/\?/) ? "&" : "?") + M.data;
                M.data = null
            }
            if (M.global && !o.active++) {
                o.event.trigger("ajaxStart")
            }
            var Q = /^(\w+:)?\/\/([^\/?#]+)/.exec(M.url);
            if (M.dataType == "script" && G == "GET" && Q && (Q[1] && Q[1] != location.protocol || Q[2] != location.host)) {
                var H = document.getElementsByTagName("head")[0];
                var T = document.createElement("script");
                T.src = M.url;
                if (M.scriptCharset) {
                    T.charset = M.scriptCharset
                }
                if (!W) {
                    var O = false;
                    T.onload = T.onreadystatechange = function () {
                        if (!O && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                            O = true;
                            I();
                            L();
                            T.onload = T.onreadystatechange = null;
                            H.removeChild(T)
                        }
                    }
                }
                H.appendChild(T);
                return g
            }
            var K = false;
            var J = M.xhr();
            if (M.username) {
                J.open(G, M.url, M.async, M.username, M.password)
            } else {
                J.open(G, M.url, M.async)
            }
            try {
                if (M.data) {
                    J.setRequestHeader("Content-Type", M.contentType)
                }
                if (M.ifModified) {
                    J.setRequestHeader("If-Modified-Since", o.lastModified[M.url] || "Thu, 01 Jan 1970 00:00:00 GMT")
                }
                J.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                J.setRequestHeader("Accept", M.dataType && M.accepts[M.dataType] ? M.accepts[M.dataType] + ", */*" : M.accepts._default)
            } catch(S) {}
            if (M.beforeSend && M.beforeSend(J, M) === false) {
                if (M.global && !--o.active) {
                    o.event.trigger("ajaxStop")
                }
                J.abort();
                return false
            }
            if (M.global) {
                o.event.trigger("ajaxSend", [J, M])
            }
            var N = function (X) {
                if (J.readyState == 0) {
                    if (P) {
                        clearInterval(P);
                        P = null;
                        if (M.global && !--o.active) {
                            o.event.trigger("ajaxStop")
                        }
                    }
                } else { if (!K && J && (J.readyState == 4 || X == "timeout")) {
                        K = true;
                        if (P) {
                            clearInterval(P);
                            P = null
                        }
                        R = X == "timeout" ? "timeout" : !o.httpSuccess(J) ? "error" : M.ifModified && o.httpNotModified(J, M.url) ? "notmodified" : "success";
                        if (R == "success") {
                            try {
                                V = o.httpData(J, M.dataType, M)
                            } catch(Z) {
                                R = "parsererror"
                            }
                        }
                        if (R == "success") {
                            var Y;
                            try {
                                Y = J.getResponseHeader("Last-Modified")
                            } catch(Z) {}
                            if (M.ifModified && Y) {
                                o.lastModified[M.url] = Y
                            }
                            if (!W) {
                                I()
                            }
                        } else {
                            o.handleError(M, J, R)
                        }
                        L();
                        if (X) {
                            J.abort()
                        }
                        if (M.async) {
                            J = null
                        }
                    }
                }
            };
            if (M.async) {
                var P = setInterval(N, 13);
                if (M.timeout > 0) {
                    setTimeout(function () {
                        if (J && !K) {
                            N("timeout")
                        }
                    },
                    M.timeout)
                }
            }
            try {
                J.send(M.data)
            } catch(S) {
                o.handleError(M, J, null, S)
            }
            if (!M.async) {
                N()
            }
            function I() {
                if (M.success) {
                    M.success(V, R)
                }
                if (M.global) {
                    o.event.trigger("ajaxSuccess", [J, M])
                }
            }
            function L() {
                if (M.complete) {
                    M.complete(J, R)
                }
                if (M.global) {
                    o.event.trigger("ajaxComplete", [J, M])
                }
                if (M.global && !--o.active) {
                    o.event.trigger("ajaxStop")
                }
            }
            return J
        },
        handleError: function (F, H, E, G) {
            if (F.error) {
                F.error(H, E, G)
            }
            if (F.global) {
                o.event.trigger("ajaxError", [H, F, G])
            }
        },
        active: 0,
        httpSuccess: function (F) {
            try {
                return !F.status && location.protocol == "file:" || (F.status >= 200 && F.status < 300) || F.status == 304 || F.status == 1223
            } catch(E) {}
            return false
        },
        httpNotModified: function (G, E) {
            try {
                var H = G.getResponseHeader("Last-Modified");
                return G.status == 304 || H == o.lastModified[E]
            } catch(F) {}
            return false
        },
        httpData: function (J, H, G) {
            var F = J.getResponseHeader("content-type"),
            E = H == "xml" || !H && F && F.indexOf("xml") >= 0,
            I = E ? J.responseXML : J.responseText;
            if (E && I.documentElement.tagName == "parsererror") {
                throw "parsererror"
            }
            if (G && G.dataFilter) {
                I = G.dataFilter(I, H)
            }
            if (typeof I === "string") {
                if (H == "script") {
                    o.globalEval(I)
                }
                if (H == "json") {
                    I = l["eval"]("(" + I + ")")
                }
            }
            return I
        },
        param: function (E) {
            var G = [];
            function H(I, J) {
                G[G.length] = encodeURIComponent(I) + "=" + encodeURIComponent(J)
            }
            if (o.isArray(E) || E.jquery) {
                o.each(E, function () {
                    H(this.name, this.value)
                })
            } else {
                for (var F in E) {
                    if (o.isArray(E[F])) {
                        o.each(E[F], function () {
                            H(F, this)
                        })
                    } else {
                        H(F, o.isFunction(E[F]) ? E[F]() : E[F])
                    }
                }
            }
            return G.join("&").replace(/%20/g, "+")
        }
    });
    var m = {},
    n, d = [
        ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
        ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
        ["opacity"]];
    function t(F, E) {
        var G = {};
        o.each(d.concat.apply([], d.slice(0, E)), function () {
            G[this] = F
        });
        return G
    }
    o.fn.extend({
        show: function (J, L) {
            if (J) {
                return this.animate(t("show", 3), J, L)
            } else {
                for (var H = 0, F = this.length; H < F; H++) {
                    var E = o.data(this[H], "olddisplay");
                    this[H].style.display = E || "";
                    if (o.css(this[H], "display") === "none") {
                        var G = this[H].tagName,
                        K;
                        if (m[G]) {
                            K = m[G]
                        } else {
                            var I = o("<" + G + " />").appendTo("body");
                            K = I.css("display");
                            if (K === "none") {
                                K = "block"
                            }
                            I.remove();
                            m[G] = K
                        }
                        o.data(this[H], "olddisplay", K)
                    }
                }
                for (var H = 0, F = this.length; H < F; H++) {
                    this[H].style.display = o.data(this[H], "olddisplay") || ""
                }
                return this
            }
        },
        hide: function (H, I) {
            if (H) {
                return this.animate(t("hide", 3), H, I)
            } else {
                for (var G = 0, F = this.length; G < F; G++) {
                    var E = o.data(this[G], "olddisplay");
                    if (!E && E !== "none") {
                        o.data(this[G], "olddisplay", o.css(this[G], "display"))
                    }
                }
                for (var G = 0, F = this.length; G < F; G++) {
                    this[G].style.display = "none"
                }
                return this
            }
        },
        _toggle: o.fn.toggle,
        toggle: function (G, F) {
            var E = typeof G === "boolean";
            return o.isFunction(G) && o.isFunction(F) ? this._toggle.apply(this, arguments) : G == null || E ? this.each(function () {
                var H = E ? G : o(this).is(":hidden");
                o(this)[H ? "show" : "hide"]()
            }) : this.animate(t("toggle", 3), G, F)
        },
        fadeTo: function (E, G, F) {
            return this.animate({
                opacity: G
            },
            E, F)
        },
        animate: function (I, F, H, G) {
            var E = o.speed(F, H, G);
            return this[E.queue === false ? "each" : "queue"](function () {
                var K = o.extend({},
                E),
                M,
                L = this.nodeType == 1 && o(this).is(":hidden"),
                J = this;
                for (M in I) {
                    if (I[M] == "hide" && L || I[M] == "show" && !L) {
                        return K.complete.call(this)
                    }
                    if ((M == "height" || M == "width") && this.style) {
                        K.display = o.css(this, "display");
                        K.overflow = this.style.overflow
                    }
                }
                if (K.overflow != null) {
                    this.style.overflow = "hidden"
                }
                K.curAnim = o.extend({},
                I);
                o.each(I, function (O, S) {
                    var R = new o.fx(J, K, O);
                    if (/toggle|show|hide/.test(S)) {
                        R[S == "toggle" ? L ? "show" : "hide" : S](I)
                    } else {
                        var Q = S.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                        T = R.cur(true) || 0;
                        if (Q) {
                            var N = parseFloat(Q[2]),
                            P = Q[3] || "px";
                            if (P != "px") {
                                J.style[O] = (N || 1) + P;
                                T = ((N || 1) / R.cur(true)) * T;
                                J.style[O] = T + P
                            }
                            if (Q[1]) {
                                N = ((Q[1] == "-=" ? -1 : 1) * N) + T
                            }
                            R.custom(T, N, P)
                        } else {
                            R.custom(T, S, "")
                        }
                    }
                });
                return true
            })
        },
        stop: function (F, E) {
            var G = o.timers;
            if (F) {
                this.queue([])
            }
            this.each(function () {
                for (var H = G.length - 1; H >= 0; H--) {
                    if (G[H].elem == this) {
                        if (E) {
                            G[H](true)
                        }
                        G.splice(H, 1)
                    }
                }
            });
            if (!E) {
                this.dequeue()
            }
            return this
        }
    });
    o.each({
        slideDown: t("show", 1),
        slideUp: t("hide", 1),
        slideToggle: t("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        }
    },
    function (E, F) {
        o.fn[E] = function (G, H) {
            return this.animate(F, G, H)
        }
    });
    o.extend({
        speed: function (G, H, F) {
            var E = typeof G === "object" ? G : {
                complete: F || !F && H || o.isFunction(G) && G,
                duration: G,
                easing: F && H || H && !o.isFunction(H) && H
            };
            E.duration = o.fx.off ? 0 : typeof E.duration === "number" ? E.duration : o.fx.speeds[E.duration] || o.fx.speeds._default;
            E.old = E.complete;
            E.complete = function () {
                if (E.queue !== false) {
                    o(this).dequeue()
                }
                if (o.isFunction(E.old)) {
                    E.old.call(this)
                }
            };
            return E
        },
        easing: {
            linear: function (G, H, E, F) {
                return E + F * G
            },
            swing: function (G, H, E, F) {
                return ((-Math.cos(G * Math.PI) / 2) + 0.5) * F + E
            }
        },
        timers: [],
        fx: function (F, E, G) {
            this.options = E;
            this.elem = F;
            this.prop = G;
            if (!E.orig) {
                E.orig = {}
            }
        }
    });
    o.fx.prototype = {
        update: function () {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this)
            } (o.fx.step[this.prop] || o.fx.step._default)(this);
            if ((this.prop == "height" || this.prop == "width") && this.elem.style) {
                this.elem.style.display = "block"
            }
        },
        cur: function (F) {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop]
            }
            var E = parseFloat(o.css(this.elem, this.prop, F));
            return E && E > -10000 ? E : parseFloat(o.curCSS(this.elem, this.prop)) || 0
        },
        custom: function (I, H, G) {
            this.startTime = e();
            this.start = I;
            this.end = H;
            this.unit = G || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            var E = this;
            function F(J) {
                return E.step(J)
            }
            F.elem = this.elem;
            if (F() && o.timers.push(F) && !n) {
                n = setInterval(function () {
                    var K = o.timers;
                    for (var J = 0; J < K.length; J++) {
                        if (!K[J]()) {
                            K.splice(J--, 1)
                        }
                    }
                    if (!K.length) {
                        clearInterval(n);
                        n = g
                    }
                },
                13)
            }
        },
        show: function () {
            this.options.orig[this.prop] = o.attr(this.elem.style, this.prop);
            this.options.show = true;
            this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());
            o(this.elem).show()
        },
        hide: function () {
            this.options.orig[this.prop] = o.attr(this.elem.style, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0)
        },
        step: function (H) {
            var G = e();
            if (H || G >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                var E = true;
                for (var F in this.options.curAnim) {
                    if (this.options.curAnim[F] !== true) {
                        E = false
                    }
                }
                if (E) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        this.elem.style.display = this.options.display;
                        if (o.css(this.elem, "display") == "none") {
                            this.elem.style.display = "block"
                        }
                    }
                    if (this.options.hide) {
                        o(this.elem).hide()
                    }
                    if (this.options.hide || this.options.show) {
                        for (var I in this.options.curAnim) {
                            o.attr(this.elem.style, I, this.options.orig[I])
                        }
                    }
                    this.options.complete.call(this.elem)
                }
                return false
            } else {
                var J = G - this.startTime;
                this.state = J / this.options.duration;
                this.pos = o.easing[this.options.easing || (o.easing.swing ? "swing" : "linear")](this.state, J, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);
                this.update()
            }
            return true
        }
    };
    o.extend(o.fx, {
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function (E) {
                o.attr(E.elem.style, "opacity", E.now)
            },
            _default: function (E) {
                if (E.elem.style && E.elem.style[E.prop] != null) {
                    E.elem.style[E.prop] = E.now + E.unit
                } else {
                    E.elem[E.prop] = E.now
                }
            }
        }
    });
    if (document.documentElement.getBoundingClientRect) {
        o.fn.offset = function () {
            if (!this[0]) {
                return {
                    top: 0,
                    left: 0
                }
            }
            if (this[0] === this[0].ownerDocument.body) {
                return o.offset.bodyOffset(this[0])
            }
            var G = this[0].getBoundingClientRect(),
            J = this[0].ownerDocument,
            F = J.body,
            E = J.documentElement,
            L = E.clientTop || F.clientTop || 0,
            K = E.clientLeft || F.clientLeft || 0,
            I = G.top + (self.pageYOffset || o.boxModel && E.scrollTop || F.scrollTop) - L,
            H = G.left + (self.pageXOffset || o.boxModel && E.scrollLeft || F.scrollLeft) - K;
            return {
                top: I,
                left: H
            }
        }
    } else {
        o.fn.offset = function () {
            if (!this[0]) {
                return {
                    top: 0,
                    left: 0
                }
            }
            if (this[0] === this[0].ownerDocument.body) {
                return o.offset.bodyOffset(this[0])
            }
            o.offset.initialized || o.offset.initialize();
            var J = this[0],
            G = J.offsetParent,
            F = J,
            O = J.ownerDocument,
            M,
            H = O.documentElement,
            K = O.body,
            L = O.defaultView,
            E = L.getComputedStyle(J, null),
            N = J.offsetTop,
            I = J.offsetLeft;
            while ((J = J.parentNode) && J !== K && J !== H) {
                M = L.getComputedStyle(J, null);
                N -= J.scrollTop,
                I -= J.scrollLeft;
                if (J === G) {
                    N += J.offsetTop,
                    I += J.offsetLeft;
                    if (o.offset.doesNotAddBorder && !(o.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(J.tagName))) {
                        N += parseInt(M.borderTopWidth, 10) || 0,
                        I += parseInt(M.borderLeftWidth, 10) || 0
                    }
                    F = G,
                    G = J.offsetParent
                }
                if (o.offset.subtractsBorderForOverflowNotVisible && M.overflow !== "visible") {
                    N += parseInt(M.borderTopWidth, 10) || 0,
                    I += parseInt(M.borderLeftWidth, 10) || 0
                }
                E = M
            }
            if (E.position === "relative" || E.position === "static") {
                N += K.offsetTop,
                I += K.offsetLeft
            }
            if (E.position === "fixed") {
                N += Math.max(H.scrollTop, K.scrollTop),
                I += Math.max(H.scrollLeft, K.scrollLeft)
            }
            return {
                top: N,
                left: I
            }
        }
    }
    o.offset = {
        initialize: function () {
            if (this.initialized) {
                return
            }
            var L = document.body,
            F = document.createElement("div"),
            H,
            G,
            N,
            I,
            M,
            E,
            J = L.style.marginTop,
            K = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';
            M = {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            };
            for (E in M) {
                F.style[E] = M[E]
            }
            F.innerHTML = K;
            L.insertBefore(F, L.firstChild);
            H = F.firstChild,
            G = H.firstChild,
            I = H.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = (G.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (I.offsetTop === 5);
            H.style.overflow = "hidden",
            H.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = (G.offsetTop === -5);
            L.style.marginTop = "1px";
            this.doesNotIncludeMarginInBodyOffset = (L.offsetTop === 0);
            L.style.marginTop = J;
            L.removeChild(F);
            this.initialized = true
        },
        bodyOffset: function (E) {
            o.offset.initialized || o.offset.initialize();
            var G = E.offsetTop,
            F = E.offsetLeft;
            if (o.offset.doesNotIncludeMarginInBodyOffset) {
                G += parseInt(o.curCSS(E, "marginTop", true), 10) || 0,
                F += parseInt(o.curCSS(E, "marginLeft", true), 10) || 0
            }
            return {
                top: G,
                left: F
            }
        }
    };
    o.fn.extend({
        position: function () {
            var I = 0,
            H = 0,
            F;
            if (this[0]) {
                var G = this.offsetParent(),
                J = this.offset(),
                E = /^body|html$/i.test(G[0].tagName) ? {
                    top: 0,
                    left: 0
                } : G.offset();
                J.top -= j(this, "marginTop");
                J.left -= j(this, "marginLeft");
                E.top += j(G, "borderTopWidth");
                E.left += j(G, "borderLeftWidth");
                F = {
                    top: J.top - E.top,
                    left: J.left - E.left
                }
            }
            return F
        },
        offsetParent: function () {
            var E = this[0].offsetParent || document.body;
            while (E && (!/^body|html$/i.test(E.tagName) && o.css(E, "position") == "static")) {
                E = E.offsetParent
            }
            return o(E)
        }
    });
    o.each(["Left", "Top"], function (F, E) {
        var G = "scroll" + E;
        o.fn[G] = function (H) {
            if (!this[0]) {
                return null
            }
            return H !== g ? this.each(function () {
                this == l || this == document ? l.scrollTo(!F ? H : o(l).scrollLeft(), F ? H : o(l).scrollTop()) : this[G] = H
            }) : this[0] == l || this[0] == document ? self[F ? "pageYOffset" : "pageXOffset"] || o.boxModel && document.documentElement[G] || document.body[G] : this[0][G]
        }
    });
    o.each(["Height", "Width"], function (I, G) {
        var E = I ? "Left" : "Top",
        H = I ? "Right" : "Bottom",
        F = G.toLowerCase();
        o.fn["inner" + G] = function () {
            return this[0] ? o.css(this[0], F, false, "padding") : null
        };
        o.fn["outer" + G] = function (K) {
            return this[0] ? o.css(this[0], F, false, K ? "margin" : "border") : null
        };
        var J = G.toLowerCase();
        o.fn[J] = function (K) {
            return this[0] == l ? document.compatMode == "CSS1Compat" && document.documentElement["client" + G] || document.body["client" + G] : this[0] == document ? Math.max(document.documentElement["client" + G], document.body["scroll" + G], document.documentElement["scroll" + G], document.body["offset" + G], document.documentElement["offset" + G]) : K === g ? (this.length ? o.css(this[0], J) : null) : this.css(J, typeof K === "string" ? K : K + "px")
        }
    })
})();
var FBrowser = {};
FBrowser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
FBrowser.isIE7 = ((FBrowser.isIE && window.XMLHttpRequest) ? true : false);
FBrowser.isIE6 = ((FBrowser.isIE && !window.XMLHttpRequest && window.ActiveXObject) ? true : false);
FBrowser.isFirefox = ((navigator.userAgent.indexOf('Firefox') == -1) ? false : true);
FBrowser.isOpera = ((navigator.userAgent.indexOf('Opera') == -1) ? false : true);
FBrowser.isSafari = ((navigator.userAgent.toLowerCase().indexOf('webkit')) == -1 ? false : true);
String.prototype.lTrim = function () {
    return this.replace(/^\s*/, "");
}
String.prototype.rTrim = function () {
    return this.replace(/\s*$/, "");
}
String.prototype.trim = function () {
    return this.rTrim().lTrim();
}
String.prototype.hash_filter = function () {
    return this.replace(/[^a-f0-9]/gi, '');
}
String.prototype.getLength = function (len) {
    len = len ? len : 3;
    return this.replace(/[^\x00-\xff]/gi, 'xxx').length;
}
function Fid(id) {
    return document.getElementById(id);
}
function Fempty(v) {
    if (v != null && (typeof(v) == 'object' || typeof(v) == 'function')) return false;
    return (("" == v || undefined == v || null == v) ? true : false);
}
function FtagName(v) {
    return document.getElementsByTagName(v);
}
function FaddEvent(e, evt, fn, isID) {
    if (isID == true) e = Fid(e);
    if (!Fempty(e.attachEvent) && (typeof(e.attachEvent) == "function" || typeof(e.attachEvent) == "object")) e.attachEvent("on" + evt, fn);
    else if (!Fempty(e.addEventListener) && (typeof(e.addEventListener) == "function" || typeof(e.addEventListener) == "object")) e.addEventListener(evt, fn, false);
}
function FgetScrollPostion() {
    if (FBrowser.isIE6) return {
        left: document.body.scrollLeft,
        top: document.body.scrollTop
    };
    return {
        left: document.documentElement.scrollLeft,
        top: document.documentElement.scrollTop
    };
}
function FsetPostion(e, x, y, w, h, isID) {
    if (isID == true) e = Fid(e);
    if (e.style.position == "absolute") {
        e.style.left = x + "px";
        e.style.top = y + "px";
    } else if (e.style.position == "relative") {
        var p = FgetPostion(e.offsetParent);
        e.style.left = (x - p.x) + "px";
        e.style.top = (y - p.y) + "px";
    }
    if (w >= 0) e.style.width = w + "px";
    if (h >= 0) e.style.height = h + "px";
}
function FgetPostion(e, isID) {
    if (isID == true) e = Fid(e);
    var left = 0,
    top = 0,
    w = e.offsetWidth,
    h = e.offsetHeight;
    do {
        top += e.offsetTop || 0;
        left += e.offsetLeft || 0;
        e = e.offsetParent;
    } while (e);
    return {
        x: left,
        y: top,
        width: w,
        height: h
    };
}
function FsetOffsetWindowPostionByRate(e, nx, ny, isID) {
    if (isID == true) e = Fid(e);
    var s = FgetWindowSize();
    FsetOffsetWindowPostion(e, (s.width - e.offsetWidth) / nx, (s.height - e.offsetHeight) / ny);
}
function FsetOffsetWindowPostion(e, x, y, isID) {
    if (isID == true) e = Fid(e);
    var p = FgetScrollPostion();
    FsetPostion(e, x + p.left, y + p.top, -1, -1);
}
function FgetWindowSize(doc) {
    doc = doc || document;
    var w = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : doc.body.clientWidth;
    h = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : doc.body.clientHeight;
    return {
        width: w,
        height: h
    };
}
function getScrollTop(doc) {
    doc = doc || document;
    return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
}
function FgetScrollPostion(doc) {
    doc = doc || document;
    var l = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft)
    t = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    return {
        left: l,
        top: t
    };
}
function FgetPageSize() {
    if (document.compatMode != "CSS1Compat") {
        return {
            width: document.body.scrollWidth,
            height: Math.max(document.body.clientHeight, document.body.scrollHeight)
        };
    }
    return {
        width: document.documentElement.scrollWidth,
        height: Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight)
    };
}
function getScrollHeight(doc) {
    doc = doc || document;
    return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
}
function DrawImage(ImgD, img_width, img_height, after_show, cb) {
    var image = ImgD;
    if (after_show) {
        var image = new Image();
        image.src = ImgD.src;
    }
    if (img_width <= 0 && img_height <= 0) {
        return;
    }
    var draw_type = 0;
    if (img_width > 0 && img_height > 0) {
        draw_type = (image.width / img_width >= image.height / img_height) ? 1 : 2;
    } else if (img_width > 0 && img_height <= 0) {
        draw_type = 1;
    } else {
        draw_type = 2;
    }
    var jqp = J(ImgD).parent(),
    ovfl = jqp.hasClass("box_100px") ? true : false;
    if (draw_type == 1) {
        if (image.width > img_width) {
            ImgD.width = img_width;
            var h = (image.height * img_width) / image.width;
            ImgD.height = h;
        } else {
            ImgD.width = image.width;
            ImgD.height = image.height;
        }
    } else if (draw_type == 2) {
        if (image.height > img_height) {
            var w = (image.width * img_height) / image.height;
            ImgD.height = img_height;
            ImgD.width = w;
        } else {
            ImgD.width = image.width;
            ImgD.height = image.height;
        }
    }
    if (cb) {
        cb();
    }
}
function Farray_exist(d, v) {
    for (var i = 0; i < d.length; i++) {
        if (d[i] == v) return true;
    }
    return false;
}
function array_search(arr, sw) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == sw) {
            return i;
        }
    }
    return -1;
}
function array_remove(arr, dx) {
    if (isNaN(dx) || dx > arr.length) {
        return arr;
    }
    arr.splice(dx, 1);
    return arr;
}
function obj_clone(old_obj) {
    var newObj = new Object();
    for (elements in old_obj) {
        newObj[elements] = old_obj[elements];
    }
    return newObj;
}
function FgetUin() {
    var uin = parseInt(FgetCookie("zzpaneluin"));
    if (FvaildateUin(uin)) return uin;
    var R = /^o(0)*/;
    uin = FgetCookie("uin");
    uin = parseInt(uin.replace(R, ''));
    return ((FvaildateUin(uin)) ? uin : false)
}
function FvaildateUin(uin) {
    var R = /^[1-9]\d{4,11}$/;
    return R.test(uin);
}
function FisLogon() {
    var uin = FgetUin();
    return (uin == false) ? false : true;
}
var J = jQuery.noConflict();
if (document.domain.indexOf('.qq.com') != -1) document.domain = "qq.com";
var xy_domain = (xy_domain) ? xy_domain : '',
API_domain = (API_domain) ? API_domain : '';
if (!window.XY) {
    window.XY = {};
    XY.widget = {};
}
var G_V = {
    "pTitle": "温馨提示",
    "bimg": "http://imgcache.qq.com/campus_v2/ac/b.gif"
},
DE_LOGO = 'http://imgcache.qq.com/campus/images/2.gif';
var QZR_max = QZR_max ? QZR_max : 0;
var G_TMP = {};
setInterval(function () {
    G_TMP = null;
    delete(G_TMP);
    G_TMP = {};
},
3600000);
if (J.browser.msie && J.browser.version == 6) {
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(err) {}
}
function onlyChinese(s) {
    return /^[\u0391-\uFFE5]+$/g.test(s);
}
function toTop() {
    window.scrollTo(0, 0);
}
function getURLArgs(str, k) {
    str = (str) ? str : location.href;
    var s = str.indexOf("?");
    var e = (str.indexOf("#") == -1) ? str.length : str.indexOf("#");
    var r = {};
    if (s != -1) {
        var ts = str.substring(s + 1, e);
        ts = ts.split("&");
        var t;
        for (var i = 0; i < ts.length; i++) {
            t = ts[i].split("=");
            if (t.length == 2) {
                r[t
                    [0]] = t[1];
            }
        }
    }
    if (k) return (r[k] ? r[k] : false);
    return r;
}
function loadJS(url, cb, option) {
    var op = {
        type: "GET",
        url: url,
        success: cb,
        dataType: "script",
        cache: false
    };
    J.extend(op, option);
    J.ajax(op);
}
function loadCSS(url) {
    var head = document.getElementsByTagName('head')[0];
    J(document.createElement('link')).attr({
        type: 'text/css',
        href: url,
        rel: 'stylesheet',
        media: 'screen'
    }).appendTo(head);
}
function FgetCookie(name) {
    var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
    var m = document.cookie.match(r);
    return (!m ? "" : m[2]);
}
function FdeleteCookie(name, domain) {
    if (!Fempty(domain)) document.cookie = name + "=; path=/; domain=" + domain + "; expires=Fri, 02-Jan-1970 00:00:00 GMT";
    else document.cookie = name + "=; path=/; expires=Fri, 02-Jan-1970 00:00:00 GMT";
}
function FaddCookie(name, v, path, expire, domain, noescape) {
    var s = name + "=" + ((noescape) ? v : encodeURIComponent(v));
    if (!Fempty(path)) path = "/";
    if (expire > 0) {
        var d = new Date();
        d.setTime(d.getTime() + expire * 1000);
        if (!Fempty(domain)) s = s + "; path=" + path + "; domain=" + domain + "; expires=" + d.toGMTString();
        else s = s + "; path=" + path + "; expires=" + d.toGMTString();
    }
    document.cookie = s;
}
function getLoadingImg(pTop, pBottom) {
    pTop = (pTop) ? pTop : 20;
    pButtom = (pBottom) ? pBottom : 20;
    return '<p style="text-align:center; padding:' + pTop + 'px 0 ' + pButtom + 'px;"><img src="http://imgcache.qq.com/campus/images/loading_a0a46.gif" /></p>';
}
function toggle_div(div_id, ele, prefix, cb1, cb2, force) {
    prefix = (prefix) ? prefix : '';
    if (J("#" + div_id).css("display") != "none" || force == 'hide') {
        J("#" + div_id).hide();
        if (ele) {
            ele.className = prefix + 'put_away ' + prefix + 'up';;
            ele.title = '展开';
            ele.innerHTML = '<span>展开</span>';
        }
        if (cb1) cb1();
    } else {
        J("#" + div_id).show();
        if (ele) {
            ele.className = prefix + 'unfold ' + prefix + 'down';
            ele.title = '收起';
            ele.innerHTML = '<span>收起</span>';
        }
        if (cb2) cb2();
    }
}
function strip_test_word(str) {
    str = (str) ? str : '';
    str = str.replace('<!-- @success@ -->', '');
    str = str.replace('<!-- @error@ -->', '');
    return str;
}
function CheckInputCount(el, max) {
    var jq = J(el);
    var jn = J("#" + jq.attr("id") + "_num");
    var cv = jq.val().trim();
    var cl = cv.length;
    if (cl <= max) {
        jn.text(cl);
        return true;
    }
    var nv = '';
    for (var i = 0; i < cv.length; i++) {
        var cvc = cv.substring(i, i + 1);
        var cvcl = cvc.length;
        var nvl = nv.length;
        if (nvl >= max || (cvcl > 1 && (nvl + cvcl) > max)) {
            break;
        }
        nv += cvc;
    }
    jq.val(nv);
    jn.text(nv.length);
    return true;
}
function lightLeftBar(i) {
    J("#left_bar > li").removeClass("select");
    J("#left_bar .leftNav" + i).addClass("select");
}
/**
 * 分页对象
 * @param {Object} p
 * @param {Object} pn
 * @param {Object} pcontainer
 * @param {Object} cbclick
 * @param {Object} max_page
 * @param {Object} option
 */
function Fpages(p, pn, pcontainer, cbclick, max_page, option) {
    var op = {
        'button': 'button',
        'next_class': 'page_pre',
        'first_last': true
    };
    J.extend(op, option);
    var MaxPages = max_page ? max_page : 10;
    var pc = Fid(pcontainer);
    if (typeof(pc) == 'undefined') {
        return false;
    }
    if (pn <= 1) {
        pc.style.display = "none";
        return true;
    }
    var vcb = (typeof(cbclick) == 'function');
    var i;
    for (i = pc.childNodes.length - 1; i >= 0; i--) {
        pc.removeChild(pc.childNodes[i]);
    }
    var a;
    var ps;
    var pe;
    if (pn <= MaxPages) {
        ps = 1;
        pe = pn;
    } else {
        var pm = Math.ceil(MaxPages / 2);
        if (p <= pm) {
            ps = p - pm;
            if (ps < 1) {
                ps = 1;
            }
            pe = ps + MaxPages
        } else {
            pe = p + pm;
            if (pe > pn) {
                pe = pn;
            }
            ps = pe - MaxPages
        }
    }
    if (op.first_last) {
        a = document.createElement(op.button);
        a.href = '#';
        a.className = op.next_class;
        a.innerHTML = '第一页';
        pc.appendChild(a);
        if (vcb && p != 1) {
            eval("FaddEvent(a, 'click', function(){cbclick(1);return false;}, 0);");
        }
    }
    a = document.createElement(op.button);
    a.href = '#';
    a.className = op.next_class;
    a.innerHTML = '上一页';
    pc.appendChild(a);
    if (vcb) {
        if (p > 1) {
            eval("FaddEvent(a, 'click', function(){cbclick(" + (p - 1) + ");return false;}, 0);");
        } else {
            FaddEvent(a, 'click', function () {
                return false;
            },
            0);
        }
    }
    for (i = ps; i <= pe; i++) {
        a = document.createElement('a');
        a.href = '#';
        a.innerHTML = i;
        a.className = 'bor3';
        if (i == p) {
            a.className = 'bor3 here current';
        }
        pc.appendChild(a);
        if (vcb) {
            eval("FaddEvent(a, 'click', function(){cbclick(" + i + ");return false;}, 0);");
        }
    }
    a = document.createElement(op.button);
    a.href = '#';
    a.className = op.next_class;
    a.innerHTML = '下一页';
    pc.appendChild(a);
    if (vcb) {
        if (p < pn) {
            eval("FaddEvent(a, 'click', function(){cbclick(" + (p + 1) + ");return false;}, 0);");
        } else {
            FaddEvent(a, 'click', function () {
                return false;
            },
            0);
        }
    }
    if (op.first_last) {
        a = document.createElement(op.button);
        a.href = '#';
        a.className = op.next_class;
        a.innerHTML = '最后页';
        pc.appendChild(a);
        if (vcb && p != pn) {
            eval("FaddEvent(a, 'click', function(){cbclick(" + pn + ");return false;}, 0);");
        }
    }
    pc.style.display = "";
}
function regLogo(e, src) {
    regImg(e, src, 1, 1);
}
function regImg(e, src, time, is_logo) {
    if (!window.imgHash) window.imgHash = new Object();
    var a = imgHash[src];
    e.onerror = null;
    if (a == null) {
        if (is_logo) {
            e.src = DE_LOGO;
        } else {
            e.style.display = "none";
        }
        a = imgHash[src] = [];
        a[0] = new Image();
        a[1] = e;
        a[0].onload = function () {
            setImges(a);
        };
        time = time ? time * 1000 : 1000;
        J(document).ready(function () {
            setTimeout(function () {
                a[0].src = src;
            },
            time);
        });
    } else { if (a[0].readyState == "complete") {
            e.src = src;
        }
        else { if (is_logo) {
                e.src = DE_LOGO;
            } else {
                e.style.display = "none";
            }
            a[a.length] = e;
        }
    }
}
function setImges(a) {
    for (var i = 1; i < a.length; i++) {
        a[i].src = a[0].src;
        a[i].style.display = "";
    }
    a.length = 1;
    a[0].onload = null;
}
function keySubmit(e, button) {
    var k = e.charCode || e.keyCode || 0;
    if ((e.ctrlKey && k == 13) || (J.browser.msie && e.altKey && k == 83)) {
        J(button).click();
    }
}
function inputDisable(dis) {
    dis = dis ? dis : G_TMP.input_dis;
    if (dis) J(dis).addClass("bt_disable").attr("disabled", true);
}
function inputEnable(dis) {
    dis = dis ? dis : G_TMP.input_dis;
    if (dis) {
        J(dis).removeClass("bt_disable").removeAttr("disabled");
        G_TMP.input_dis = null;
    }
}
function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function pingIntval(_intval) {
    var t = [0, 10, 60, 300, 600, 1800];
    if (!window.pingIntvalIndex) window.pingIntvalIndex = 1;
    if (window.pingIntvalIndex > t.length) {
        window.pingIntvalIndex = null;
        return;
    };
    if (_intval) {
        setTimeout("pingIntval()", (t[window.pingIntvalIndex] - t[window.pingIntvalIndex - 1]) * 1000);
        return true;
    }
    var i = new Image();
    i.src = "http://xiaoyou.qq.com/ping.php?" + Math.random();
    window.pingIntvalIndex++;
    pingIntval(1);
}
function getUserLogo(u, state) {
    var urls = ['http://xy.store.qq.com/', 'http://xy1.store.qq.com/', 'http://xy2.store.qq.com/'];
    if (state && parseInt(state) < 2) return 'http://imgcache.qq.com/campus/images/0.gif';
    return urls[Math.floor(Math.random() * urls.length)] + u + "0";
}
function isEmpty(v) {
    if (v != null && (typeof(v) == 'object' || typeof(v) == 'function')) return false;
    return (("" == v || undefined == v || null == v) ? true : false);
}
function cut_string(str, num, subfix) {
    if (subfix == undefined) subfix = '...';
    if (str && str.length > num) {
        str = str.substring(0, num) + subfix;
    }
    return str;
}
function getCookieUserInfo(cb, force) {
    var qq = FgetUin();
    if (!qq) return cb(false);
    var hash = FgetCookie("hash"),
    name = FgetCookie("name"),
    appint = FgetCookie("appint");
    if (!isEmpty(hash)) {
        var tmp = hash.split('_');
        if (tmp.length == 2 && parseInt(tmp[0]) == parseInt(qq)) hash = tmp[1];
        else hash = '';
    }
    if (!force && !isEmpty(hash) && !isEmpty(name)) {
        return cb({
            'qq': qq,
            'hash': hash,
            'name': decodeURIComponent(name),
            'appint': appint
        });
    }
    var _cb = function (d) {
        cb(d, 1);
    };
    J.xyjsonp("getCookieInfo", "http://xiaoyou.qq.com/jsonp.php", {
        "mod": "home",
        "act": "getcookieinfo",
        "r": Math.random()
    },
    _cb);
}
jQuery.fn.coordinate = function () {
    var e = this[0],
    y = 0,
    x = 0;
    do {
        y += e.offsetTop || 0;
        x += e.offsetLeft || 0;
        e = e.offsetParent;
        if (e) {
            if (e.tagName.toLowerCase() == 'body') break;
            var p = jQuery(e).position();
            if (p == 'relative' || p == 'absolute') break;
        }
    } while (e);
    return {
        left: x,
        top: y
    };
};
var Browser = {};
Browser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
Browser.isIE7 = ((Browser.isIE && window.XMLHttpRequest) ? true : false);
var
g_XDoc = {
    customMod: {},
    blogCommentCount: {}
},
g_JData = {},
imgcacheDomain = "imgcache.qq.com";
callBackHsmp = [];
function $(id) {
    return document.getElementById(id);
}
function loadJsonData(xID, url, callback, errcallback, refresh, charset, callbackFunctionName) {
    if (top.g_JData[xID] && !refresh && !top.g_JData[xID].error) {
        callback(top.g_JData[xID]);
        return;
    }
    charset = charset ? charset : "GB2312";
    var cFN = callbackFunctionName ? callbackFunctionName : "_callBack";
    if (Browser.isIE) {
        var df = document.createDocumentFragment();
        df[cFN] = function (data) {
            s.onreadystatechange = null;
            df = null;
            top.g_JData[xID] = data;
            try {
                if (callback) callback(data);
            } catch(e) {
                if (e.number == -2146823277) return;
                status = e.message;
                setTimeout("status=''", 3000);
            }
        };
        var s = df.createElement("SCRIPT");
        s.charset = charset;
        df.appendChild(s);
        s.onreadystatechange = function () {
            if (s.readyState == "loaded") {
                s.onreadystatechange = null;
                df = null;
                try {
                    if (errcallback) errcallback({
                        error: {
                            msg: "服务器繁忙，请稍后再试.",
                            type: 900
                        }
                    });
                } catch(e) {
                    if (e.number != -2146823277) {
                        status = e.message;
                        setTimeout("status=''", 3000);
                    }
                }
            }
        };
        s.src = url;
    } else {
        var i = document.createElement("IFRAME");
        i.style.display = "none";
        i.callback = function (data) {
            top.g_JData[xID] = data;
            callback(data);
            i.callback = null;
            i.src = "about:blank"
            J(i).remove();
            i = null;
        };
        i.src = "javascript:\"<script>function " + cFN + "(data){frameElement.callback(data);}<\/script><script src='" + url + "' charset='" + charset + "'><\/script>\"";
        document.body.appendChild(i);
    }
}
function loadXMLAsyncNoCache(xID, xUrl, callback, err_callback, data, returnType) {
    return loadXMLAsync(xID, xUrl, callback, err_callback, true, data, returnType);
};
function LoadXMLDataEx(itemno, url, callback, err_callback, data) {
    return loadXMLAsync(itemno, url, callback, err_callback, false, data);
};
function loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType) {
    var m = xUrl.match(/(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.qq\.com)\/)/);
    if (!m) {
        alert("不能访问非qq.com域的资源");
        return;
    }
    var domain = m[0];
    var host = m[2];
    var proxyPageURL = domain + "proxy.html";
    if (domain == ("http://" + imgcacheDomain + "/")) proxyPageURL = "http://" + imgcacheDomain + "/ac/qzone/proxy.html";
    var f = document.getElementsByTagName("iframe");
    for (var i = 0; i < f.length; i++) {
        var isRightProxy = false;
        try {
            isRightProxy = f[i].src.indexOf(proxyPageURL) == 0
        } catch(e) {}
        if (isRightProxy) {
            if (!callBackHsmp[host] && typeof callBackHsmp[host] != "undefined") {
                frames[i].loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType);
            } else { if (typeof callBackHsmp[host] == "undefined") callBackHsmp[host] = [];
                callBackHsmp[host][callBackHsmp
                    [host].length] = {
                    "callback": callback,
                    "xID": xID,
                    "xUrl": xUrl,
                    "err_callback": err_callback,
                    "nocache": nocache,
                    "data": data,
                    "returnType": returnType
                };
            }
            return;
        }
    }
    if (!callBackHsmp[host]) {
        callBackHsmp[host] = [{
            "callback": callback,
            "xID": xID,
            "xUrl": xUrl,
            "err_callback": err_callback,
            "nocache": nocache,
            "data": data,
            "returnType": returnType
        }];
        createProxy(proxyPageURL);
    }
};
function createProxy(src) {
    var f = document.getElementsByTagName("iframe");
    for (var i = 0; i < f.length; i++)
    if (f[i].src.indexOf(src) != -1) return;
    var i = document.createElement("iframe");
    var proxyDiv = $("proxy");
    if (!proxyDiv) document.body.insertBefore(i, null);
    else $("proxy").appendChild(i);
    i.width = 0;
    i.height = 0;
    i.src = src;
    i = null;
}
function add_friends_frame(u, ref, option) {
    ref = ref ? ref : 0;
    var op = {
        count: 0
    };
    J.extend(op, option);
    var getgroup = G_TMP.user_fgroups ? 0 : 1;
    function cb(d) {
        if (d.loading) {
            return html_loading_frame(d.loading, 2000);
        }
        if (d.error) {
            return html_error_frame(G_V.pTitle, d.error);
        }
        if (d.confirm) {
            eval(d.cb);
            var ccb = typeof(my_cb) == "function" ? my_cb : function () {};
            var cb_option = {};
            if (d.submit_button_name) cb_option.submit_button_name = d.submit_button_name;
            return html_confirm_frame('温馨提示', d.confirm, ccb, cb_option);
        }
        if (d.success) {
            if (getgroup == 1 && d.groups) G_TMP.user_fgroups = d.groups;
            op.count = d.count;
            return pop_add_friends_frame(u, d.success, ref, op);
        }
    }
    J.xyjsonp('checkFriendsPri', 'http://api.xiaoyou.qq.com/jsonp.php', {
        mod: "friends",
        act: "checkpri",
        u: u,
        'getgroup': getgroup
    },
    cb);
    return true;
}
function pop_add_friends_frame(u_hash, u_info, ref, option) {
    window.G_TMP.add_friends_var = {
        'u_hash': u_hash,
        "u_info": u_info,
        "ref": ref,
        "option": option
    };
    return html_frame_new('将 ' + u_info.name + ' 加为好友', '<iframe id="id_add_friend" name="id_add_friend" frameborder="0" scrolling="no" width="100%" height="220px" src="/html/frame/addfriends.html"></iframe>', add_friends, null, {
        wid: "af_box",
        div_width: 420
    });
}
function add_friends() {
    var fr = Fid("id_add_friend").contentWindow;
    var u = fr.Fid('u_hash').value,
    ref = fr.Fid('ref').value,
    rp = fr.Fid('request_public').checked ? '1' : '0',
    ri = '',
    tmp = fr.J("#add_friend_wrap ul.list_relate input[name='rtype']:checked").val(),
    gname = fr.J('#custom_selector').val(),
    value = fr.J("#request_info").attr("value");
    if (tmp == '其它') {
        gname = '';
    } else if (tmp != '自定义') {
        gname = tmp;
    }
    var _cb = function (d) {
        d = strip_test_word(d);
        if (d == '99' || d == '2') {
            var _vcb = function (_vc) {
                doPost(_vc)
                return;
            };
            var ti = (d == '2' ? '验证码错误，请重新输入' : '');
            return html_verifycode_frame(ti, '', _vcb);
        }
        return html_loading_frame(d);
    };
    var doPost = function (vc) {
        J.post_api("/index.php", {
            mod: "friends",
            act: "addfriend",
            'u': u,
            'relation': ri,
            'info': value,
            'pub': rp,
            'gname': gname,
            'ref': ref,
            valid_input: (vc ? vc : '')
        },
        _cb);
    };
    doPost();
    return true;
}
function del_friends(u, _callback) {
    html_confirm_frame('解除关系', '你确认要解除好友关系吗？', function () {
        do_del_friends(u, _callback);
    });
}
function do_del_friends(u, _callback) {
    function cb(txt) {
        var tmp = txt.split('|');
        if (tmp.length != 2) {
            html_error_frame(G_V.pTitle, '解除关系失败，系统错误');
            return false;
        }
        if (tmp[0] != '0') {
            html_error_frame(G_V.pTitle, tmp[1]);
            return false;
        }
        if (_callback) {
            _callback(u);
            return true;
        }
        window.location.reload();
        return true;
    }
    J.post_api("/index.php", {
        mod: "friends",
        act: "delfriend",
        u: u
    },
    cb);
    return true;
}
function add_black(u_hash, is_friend) {
    var content = (is_friend) ? '这将同时解除你们间的好友关系，' : '';
    html_confirm_frame(G_V.pTitle, content + '是否要把该用户加入黑名单？', function () {
        do_add_black(u_hash);
    });
}
function do_add_black(u) {
    var cb = function (txt) {
        var tmp = txt.split('|');
        if (tmp.length != 2) {
            html_error_frame(G_V.pTitle, '加入黑名单失败，系统错误');
            return false;
        }
        if (tmp[0] != '0') {
            html_error_frame(G_V.pTitle, tmp[1]);
            return false;
        }
        html_loading_frame(tmp[1], 2000);
        return true;
    };
    J.post_api("/index.php", {
        mod: "friends",
        act: "addblack",
        u: u
    },
    cb);
}
function visite_qq(u) {
    var cb = function (d) {
        if (d.error) {
            return html_error_frame(G_V.pTitle, d.error);
        }
        if (d.success) {
            window.location.href = 'tencent://message/?uin=' + d.qq;
        }
    };
    J.post_api("/index.php", {
        mod: "checkpri",
        act: "check",
        u: u,
        check: "qq"
    },
    cb, "json");
    return false;
}
function is_sendscrip(u, ref) {
    var cb = function (txt) {
        ret_arr = txt.trim().split('|');
        error_code = ret_arr[0];
        error_str = ret_arr[1];
        if (error_code == 0) {
            window.top.location.href = xy_domain + '/index.php?mod=scrip&act=addview&item=' + u + (ref ? '&ref=' + ref : '');
            return true;
        } else if (error_code == 4) {
            return html_confirm_frame(G_V.pTitle, error_str, function () {
                window.location.href = '/index.php?mod=useredit&act=mylogo';
            },
            {
                'submit_button_name': '上传'
            });
        } else if (error_code == 5) {
            return html_confirm_frame(G_V.pTitle, error_str, function () {
                window.location.href = '/index.php?mod=useredit&act=schoolinfoedit';
            });
        } else {
            html_error_frame(G_V.pTitle, error_str);
            return false;
        }
    };
    J.post_api("/index.php", {
        mod: "scrip",
        act: "ajaxcheck",
        u: u,
        check: "qq"
    },
    cb);
}
function FSendGift(u, uname, gid, ref, is_birth) {
    is_birth = is_birth || 0;
    function cb(d) {
        if (d.error) {
            return html_error_frame(G_V.pTitle, d.error);
        }
        if (d.success) {
            window.top.location.href = 'http://xiaoyou.qq.com/index.php?mod=gift&act=send&u=' + u + '&n=' + encodeURIComponent(uname) + '&gid=' + (gid ? gid : '') + '&ref=' + (ref ? ref : 0) + '&is_birth=' + (is_birth ? is_birth : 0);
        }
    }
    if (!u) return cb({
        success: 1
    });
    J.post_api("/index.php", {
        mod: "checkpri",
        act: "check",
        u: u,
        check: "gift"
    },
    cb, "json");
}
function reprot() {
    var r = document.URL;
    r = r.replace(/\&/gi, '%26');
    window.open('http://' + window.location.host + '/index.php?mod=report&ref=' + r);
}
function Epoke(u) {
    function cb(d) {
        if (d.error) {
            return html_error_frame(G_V.pTitle, d.error);
        }
        if (d.confirm) {
            eval(d.cb);
            var ccb = typeof(my_cb) == "function" ? my_cb : function () {};
            return html_confirm_frame('温馨提示', d.confirm, ccb);
        }
        if (d.success) {
            global_frame_new("打招呼", '<iframe id="id_send_poke" frameborder="0" scrolling="no" width="100%" height="220px"  src="http://imgcache.qq.com/qzone/poke/send_poke_without_selector.htm?back=0&uin=' + u + '"></iframe>', {
                cancel_button_name: "关闭",
                submit_button_name: "发送",
                div_width: 580,
                wid: "id_poke_frame",
                submit_callback: function () {
                    document.getElementById("id_send_poke").contentWindow.doSendPoke();
                },
                submit_not_close: true
            });
        }
    }
    J.post_api("/index.php", {
        mod: "checkpri",
        act: "check",
        u: u,
        check: "poke"
    },
    cb, "json");
}
function showPoint(u) {
    setTimeout(function () {
        global_frame_new("互动", '<iframe src="/index.php?mod=point&u=' + u + '" style="width:510px; height:130px; overflow-x:hidden; border:0;" scrolling="no" frameborder="no" name="pop_point" id="pop_point"></iframe>', {
            wid: "ppframe",
            div_width: 515,
            submit_not_close: true
        });
    },
    10);
}
function sendPoke(u, id, _cb) {
    function cb(d) {
        if (d.error) {
            return html_error_frame(G_V.pTitle, d.error);
        }
        if (d.confirm) {
            eval(d.cb);
            var ccb = typeof(my_cb) == "function" ? my_cb : function () {};
            var cb_option = {};
            if (d.submit_button_name) cb_option.submit_button_name = d.submit_button_name;
            return html_confirm_frame('温馨提示', d.confirm, ccb, cb_option);
        }
        if (d.success) {
            doSendPoke(u, id);
            if (_cb) _cb();
        }
    }
    J.post("/index.php", {
        mod: "checkpri",
        act: "check",
        u: u,
        check: "poke"
    },
    cb, "json");
}
var pokeDomain = "drift.qzone.qq.com";
function doSendPoke(u, id, type) {
    type = type ? type : 1;
    var url = "targetuin=" + u + "&poketype=" + id + "&giveback=0&campus=1&type=" + type;
    var cb = function () {
        var data = top.g_XDoc["sendPoke"];
        if (!data || data.xml == "") {
            html_error_frame(G_V.pTitle, "发送失败");
            return;
        }
        if (data.getElementsByTagName("error").length > 0) {
            var er = data.getElementsByTagName("error")[0];
            if (er.getAttribute("type") == "login") html_error_frame(G_V.pTitle, "您已登录超时，请重新登录");
            else { if (er.textContent) html_error_frame(G_V.pTitle, er.textContent);
                else html_error_frame(G_V.pTitle, er.text);
            }
        } else if (data.getElementsByTagName("succ").length > 0) html_loading_frame("发送成功");
    };
    loadXMLAsyncNoCache("sendPoke", "http://" + pokeDomain + "/cgi-bin/sendpoke", cb, function () {
        html_error_frame(G_V.pTitle, "很抱歉,目前网络繁忙,请稍后再试");
    },
    url);
}
function getGiftList(page, cb, ecb, cjs) {
    ecb = ecb ? ecb : function () {};
    cjs = cjs ? cjs : '559';
    loadJsonData("giftlist_" + page, "http://imgcache.qq.com/qzone/mall/static/json/ogift_" + cjs + "_" + page + ".js", cb, ecb, 0, null, "DriftBottleCallback");
}
function getGiftImageUrl(id, type) {
    if (type == undefined && id.indexOf('_') != -1) {
        var tmp = id.split('_');
        id = tmp[1];
        type = tmp[0];
    }
    if (type == 0 || type == 1 || (type >= 244 && type <= 254)) return "http://imgcache.qq.com/qzone/space_item/pre/" + (id % 16) + "/" + id + "_1.gif";
    else if (type == 2 || type == 4 || type == 5 || type == 6 || type == 7 || type == 10) {
        return "http://imgcache.qq.com/qzone/space_item/drift/freeitem_" + id + ".gif";
    } else if (type == 8) {
        return "http://imgcache.qq.com/qzone/driftbottle/image/5.jpg";
    }
    return "http://imgcache.qq.com/ac/b.gif";
}
if (!QzsEditor) {
    var QzsEditor = (function () {
        var inner;
        return inner = {
            createInstance: function (property) {
                loadJS('/html/js/MqzsEditor.js', function () {
                    QzsEditor.createInstance(property);
                },
                {
                    cache: true
                });
            }
        };
    })();
}
//显示和隐藏用户的信息
var G_CHECK = {};
function bind_initcard(jq) {
    if (G_CHECK.card_init) clearTimeout(G_CHECK.card_init);
    G_CHECK.card_init = setTimeout(function () {
        bind_showcard(jq);
    },
    500);
}
function bind_showcard(jq) {
    var u = getURLArgs(jq.attr("href"), 'u');
    if (!u) return false;
    jq.removeAttr("title");
    jq.find("img").removeAttr("alt").removeAttr("title");
    bind_hidecard();
    bind_oncard();
    var pos = jq.coordinate();
    var cb = function (d, r, c) {
        if (!d) {
            return false;
        }
        var w = jQuery.browser.msie ? 377 : 350;
        var left = (J(document).width() - pos.left < w) ? J(document).width() - w : pos.left - 5;
        J("body").append(d);
        var t = J("body > .xy_card_wrap");
        t.css("top", pos.top + jq.height() - 2).css("left", left).hover(bind_oncard, bind_hidecard);
        t.find(".photo_upload").css({
            opacity: 0.2
        }).fadeTo("fast", 1, function () {
            J("#card_iframe").show()
        });
        var cext = jq.attr("card");
        if (!cext) {
            t.children(".trans_none_1").removeClass("trans_none_1");
            t.find(".fun_btm_new").hide();
        } else {
            t.find(".fun_btm_new").html('<span class="grey_text">' + cext + '</span>');
        }
        G_TMP.card[u] = d;
        try {
            if (!c) pgvCard();
        } catch(e) {};
    };
    if (!G_TMP.card) G_TMP.card = {};
    if (G_TMP.card[u]) return cb(G_TMP.card[u], 1, 1);
    var bi = jq.attr("baseinfo");
    if (bi) {
        try {
            eval('var bi = ' + bi + ';');
            var sex_ta = bi.sex == 1 ? '他' : '她';
            var d = '<div class="trans_wrap xy_card_wrap" style="position:absolute">\
<div class="trans_none trans_none_1"></div>\
<div class="photo_upload">\
<div class="top_user">\
<a href="/index.php?mod=profile&u=' + bi.u + '" class="color-link1">' + bi.name + '</a><span class="grey_text"><a href="/index.php?mod=school&act=schoolportal&school_id=' + bi.sid + '">' + bi.sname + '</a></span>\
<span class="user_link">\
<a href="javascript:void(0)" onclick="add_friends_frame(\'' + bi.u + '\')" class="user_link_1" title="加为好友"><span>加为好友</span></a>\
<a href="javascript:is_sendscrip(\'' + bi.u + '\');" class="user_link_2" title="发小纸条"><span>发小纸条</span></a>\
<a href="#" onclick="FSendGift(\'' + bi.u + '\', \'' + bi.name + '\');return false;" class="user_link_3" title="送礼物"><span>送礼物</span></a>\
<a href="javascript:void(0)" onclick="Epoke(\'' + bi.u + '\');" class="user_link_4" title="打招呼"><span>打招呼</span></a>\
</span>\
</div>\
<div class="block_user clearfix">\
<div class="photo_wrap"><img src="' + getUserLogo(bi.u, bi.sl) + '" alt="' + bi.name + '" /></div>\
<div class="user_wrap">\
<p class="detail_info_user">' + (bi.sex == 1 ? '男' : '女') + ',' + bi.astro + bi.loc + '</p>\
<ul class="list_feed">\
<li><span class="icon_article"></span><a href="/index.php?mod=blog&amp;u=' + bi.u + '">' + sex_ta + '的日志</a></li>\
<li><span class="icon_photo"></span><a href="/index.php?mod=photo&amp;u=' + bi.u + '">' + sex_ta + '的相册</a></li>\
<li><span class="icon_friend"></span><a href="/index.php?mod=friends&amp;act=show&amp;u=' + bi.u + '">' + sex_ta + '的好友</a></li>\
<li><span class="icon_msg"></span><a href="/index.php?mod=message&amp;item=' + bi.u + '">' + sex_ta + '的留言</a></li>\
</ul>\
</div>\
</div>\
<div class="fun_btm_new">\
<span class="grey_text">&nbsp;</span>\
</div>\
</div>\
<iframe id="card_iframe" style="display:none"></iframe>\
</div>';
            cb(d, 1, 1);
            return false;
        } catch(e) {
            alert(e);
        }
    }
    var l = getURLArgs();
    l.mod = (l.mod) ? l.mod : '';
    l.act = (l.act) ? l.act : '';
    J.get_api("/index.php?mod=card&u=" + u, {
        rmod: l.mod,
        ract: l.act
    },
    cb);
}
function bind_oncard() {
    if (G_CHECK.card_init) clearTimeout(G_CHECK.card_init);
    if (G_CHECK.card) clearTimeout(G_CHECK.card);
}
function bind_hidecard() {
    if (G_CHECK.card_init) clearTimeout(G_CHECK.card_init);
    if (G_CHECK.card) clearTimeout(G_CHECK.card);
    G_CHECK.card = setTimeout(function () {
        J("#card_iframe").hide();
        var t = J("body > .xy_card_wrap");
        t.find(".photo_upload").fadeTo("fast", 0, function () {
            t.remove();
        });
    },
    500);
}
//菜单中的应用按钮
function bind_app_pop() {
    J('#app').popupmenu({
        target: "#app_pop",
        time: 300,
        showFunc: "fade",
        speed: 200
    });
}
//显示每一位用户的相关信息
function init_global_bind(id) {
    var eles = (id) ? "#" + id + " .xy_card" : ".xy_card";
    J(eles).hover(function () {
        bind_initcard(J(this));
    },bind_hidecard).attr("target", "_blank");;
}
//绑定事件
J(document).ready(function () {
    bind_app_pop();
    init_global_bind();
});
function html_frame(title, html, submit_callback, cancel_callback, option) {
    var option = (option) ? option : {};
    option.submit_callback = (submit_callback) ? submit_callback : null;
    option.cancel_callback = (cancel_callback) ? cancel_callback : null;
    global_frame(title, html, option);
}
function html_frame_new(title, html, submit_callback, cancel_callback, option) {
    var option = (option) ? option : {};
    option.submit_callback = (submit_callback) ? submit_callback : null;
    option.cancel_callback = (cancel_callback) ? cancel_callback : null;
    global_frame_new(title, html, option);
}
function html_loading_frame(content, time_out, _cb, id, modal) {
    time_out = (time_out) ? parseInt(time_out) : 3000;
    if (top.showMsgbox) {
        top.showMsgbox(content, 0, time_out, null, true);
        return;
    }
    var wid = (id) ? id : 'image_wait';
    var w = Fid(wid);
    if (!w) {
        var w = document.createElement('DIV');
        w.id = wid;
        w.className = 'load';
        document.body.appendChild(w);
    }
    w.innerHTML = '<p>' + content + '</p>';
    html_normal_frame(wid, time_out);
    if (modal) {
        FsetModal(null, false, wid + '_modal');
    }
    if (_cb && typeof(_cb) == 'function') {
        window.setTimeout(_cb, time_out);
    }
}
function html_error_frame(title, content, _callback, option) {
    var op = {
        no_cancel: true,
        zIndex: 1000
    };
    op.submit_callback = (_callback) ? _callback : null;
    op.div_class = 'layer_global small_tip';
    op.icon = 'gb_del';
    J.extend(op, option);
    var html = '<div class="layer_global_tips"><div class="gb_tips ' + op.icon + '"><p>' + content + '</p></div></div>';
    global_frame_new(title, html, op);
}
function html_confirm_frame(title, content, _callback, option) {
    option = option ? option : {};
    option.submit_callback = (_callback) ? _callback : null;
    option.div_class = 'layer_global small_tip';
    var html = '<div class="layer_global_tips"><div class="gb_tips gb_del"><p>' + content + '</p></div></div>';
    global_frame_new(title, html, option);
}
function html_normal_frame(div_id, time_out) {
    var w = Fid(div_id);
    if (Fempty(w)) {
        return false;
    }
    w.style.display = 'block';
    w.style.position = "absolute";
    w.style.zIndex = 1000;
    FsetOffsetWindowPostionByRate(w, 2, 4);
    if (time_out) {
        setTimeout('close_frame(\'' + div_id + '\')', time_out);
    }
}
function html_verifycode_frame(title, content, _callback) {
    var option = {
        no_cancel: false,
        no_submit: false,
        zIndex: 1001
    };
    var aid = 15000102;
    option.wid = 'verifycode_w';
    option.div_width = 330;
    option.div_height = 0;
    option.time_out = 0;
    option.submit_not_close = true;
    var f_callback = function () {
        var verifinput = Fid('verifycode_div');
        var verifycode = 0;
        if (verifinput) {
            if ('' == verifinput.value) {
                alert('请输入验证码!');
                verifinput.focus();
                return;
            }
            else {
                verifycode = verifinput.value;
            }
        }
        close_frame(option.wid, _callback(verifycode));
    };
    option.submit_callback = f_callback;
    var motitle = (title ? title : '该项提交超出限制次数,请输入验证码');
    motitle = '<span style="color:red">' + motitle + '</span>';
    var html = '<div class="verifycode">' + '<table>' + '<tr><td width="20"></td><td colspan="2">' + motitle + '</td></tr>' + '<tr><td colspan="3"><red>' + content + '</red></td></tr>' + (content ? '<tr height="20"><td></td></tr>' : '') + '<tr>' + '<td></td>' + '<td>验证码：</td>' + '<td>' + '<label accesskey="v" for="verifycode">' + '<input id="verifycode_div" name="verifycode_div" type="text" size=4 class="verifycode" maxlength="4" style="ime-mode:disabled;" />不区分大小写</label>' + '</td>' + '</tr>' + '<tr>' + '<td></td>' + '<td></td>' + '<td>' + '<img id="loginVerifyImg" src="http://ptlogin2.qq.com/getimage?aid=' + aid + '&' + Math.random() + '" width="130" height="53" />' + '<a href="javascript:_nchangeImg(\'loginVerifyImg\',\'verifycode\');" tabindex="-1">看不清,换一张</a>' + '</td>' + '</tr>' + '<tr height="10"><td></td></tr>' + '</table>' + '</div>';
    global_frame_new('温馨提示', html, option);
}
function _nchangeImg(img_n, code_n, flag) {
    var img = document.getElementById(img_n);
    img.src = "http://ptlogin2.qq.com/getimage?aid=15000901&t=" + Math.random();
    var ctrl = document.getElementById(code_n);
    if (ctrl && ctrl.style.display == "" && flag != 1) {
        try {
            ctrl.focus();
        } catch(e) {}
    }
}
function close_frame(wid, callback, not_close, no_del) {
    if (J && G_TMP.FOCUS_INPUT) {
        J("#global_hidden_box").focus();
        G_TMP.FOCUS_INPUT = false;
    }
    if (callback && typeof(callback) == 'function') {
        callback();
    }
    if (not_close) {
        return true;
    }
    var mId = ((Fempty(wid) || (wid == '$_cnf_wnd')) ? '$_modal_$' : (wid + '_modal'));
    try {
        FunsetModal(mId);
    } catch(e) {}
    var w = (Fempty(wid) ? Fid('$_cnf_wnd') : Fid(wid));
    if (no_del) {
        if (w != undefined) w.style.display = "none";
    } else { if (w != undefined) document.body.removeChild(w);
    }
}
function changeFrameHeight(id, h, is_iframe) {
    J("#" + id).height(73 + h);
    J("#" + id + " .layer_global_cont:first").height(h).css("overflow", "hidden");
    if (is_iframe) J("#" + id + " iframe").height(h);
}
function global_frame_new(title, html, option) {
    var wid = (option && option.wid) ? option.wid : 'mess_float_box';
    var w = Fid(wid);
    var op = {
        wrap_class: '',
        div_class: 'layer_global',
        div_width: 350,
        div_height: '',
        submit_button_name: '确认',
        cancel_button_name: '取消',
        submit_class: 'bt_tx2',
        cancel_class: 'bt_tx_c2',
        submit_callback: null,
        cancel_callback: null,
        close_callback: this.cancel_callback,
        submit_not_close: false,
        no_modal: false,
        time_out: 0,
        zIndex: 999,
        popPos: false,
        no_del: false,
        show_title: true,
        no_display: false
    };
    J.extend(op, option);
    if (w == undefined) {
        var submit_button_html = (op.no_submit == true) ? '' : '<button id="' + wid + '_submit" type="submit" class="' + op.submit_class + '">' + op.submit_button_name + '</button>';
        var cancel_button_html = (op.no_cancel == true) ? '' : '<button id="' + wid + '_cancel" class="' + op.cancel_class + '">' + op.cancel_button_name + '</button>';
        var w = document.createElement('DIV');
        w.id = wid;
        var s = w.style;
        w.className = op.div_class;
        if (op.div_width) s.width = op.div_width + "px";
        if (op.div_height) s.height = (23 + op.div_height) + "px";
        with(s) {
            position = "absolute",
            zIndex = op.zIndex + 1;
        }
        var hidden_focus = '<input type="text" id="global_hidden_box" style="position:absolute;height:0;width:0;overflow:hidden;border:0;" />';
        w.innerHTML = '<div id="' + wid + '_wrap" class="layer_global_main ' + op.wrap_class + '">' + (op.show_title ? '<div id="' + wid + '_head" class="layer_global_title">' + hidden_focus + '<h3>' + title + '</h3><button title="关闭" href="javascript:void(0)" id="' + wid + '_close"><span class="none">&#9587;</span></button></div>' : '') + '<div class="layer_global_cont clearfix">' + html + '</div>' + ((submit_button_html != '' || cancel_button_html != '') ? '<div class="global_tip_button">' + submit_button_html + ' ' + cancel_button_html + '</div>' : '') + '</div>';
        if (html && html.indexOf('<iframe') != -1) G_TMP.FOCUS_INPUT = true;
        try {
            document.body.appendChild(w);
        } catch(e) {
            return false;
        }
        if (op.div_width) {
            J("#" + wid + " > div").css("width", op.div_width - 2 + "px");
        }
        J("#" + wid + "_close").click(function () {
            close_frame(wid, op.close_callback, 0, op.no_del)
        });
        J("#" + wid).keydown(function (e) {
            var k = e.charCode || e.keyCode || 0;
            if (k == 27) J("#" + wid + "_close").click();
        });
        if (submit_button_html != '') {
            J("#" + wid + "_submit").click(function () {
                close_frame(wid, op.submit_callback, op.submit_not_close, op.no_del)
            });
        }
        if (cancel_button_html != '') {
            J("#" + wid + "_cancel").click(function () {
                close_frame(wid, op.cancel_callback, 0, op.no_del)
            });
        }
    }
    if (op.no_display) {
        w.style.display = "none";
    }
    else {
        w.style.display = "";
    }
    if (op.popPos) FsetOffsetWindowPostion(w, op.popPos[0], op.popPos[1]);
    else FsetOffsetWindowPostionByRate(w, 2, 4);
    if (op.no_modal == false) {
        var mId = ((wid == '$_cnf_wnd') ? '$_modal_$' : (wid + '_modal'));
        FsetModal(null, false, mId, op.zIndex);
    }
    if (submit_button_html) {
        J("#" + wid + "_submit").focus();
    } else if (cancel_button_html) {
        J("#" + wid + "_cancel").focus();
    }
    if (op.time_out) {
        setTimeout("close_frame('" + wid + "')", op.time_out);
    }
    try {
        FenableDrag(wid);
    } catch(e) {}
}
function FsetModal(e, isID, wid, zi, _opacity, _clickcb) {
    if (!Fempty(e) && isID == true) e = Fid(e);
    FunsetModal(wid);
    var p = 0;
    if (Fempty(e)) {
        p = FgetPageSize();
        p.x = 0,
        p.y = 0;
    } else {
        p = FgetPostion(e);
    }
    if (Fempty(wid)) wid = "$_modal_$";
    var w = Fid(wid);
    zi = (zi) ? zi : 999;
    _opacity = (_opacity) ? _opacity : 0;
    if (Fempty(w)) {
        w = document.createElement('DIV');
        w.id = wid;
        var s = w.style;
        with(s) {
            position = "absolute",
            zIndex = zi;
        }
        document.body.appendChild(w);
    }
    FsetPostion(w, p.x, p.y, p.width, p.height);
    w.innerHTML = '<div style="position:absolute; width:' + p.width + 'px;height:' + p.height + 'px; background:#000000;z-index:' + zi + ';opacity:' + _opacity + '; filter:alpha(opacity=' + (_opacity * 100) + ');-moz-opacity:' + _opacity + ';"></div>';
    if (FBrowser.isIE) {
        w.innerHTML += '<iframe style="opacity:0; filter:alpha(opacity=0);-moz-opacity:0;" scrolling="No" style="" border="0" frameborder="0" width="' + p.width + '" height="' + p.height + '"></iframe>';
    } else if (FBrowser.isOpera) {
        w.innerHTML += '<img onMouseDown="return false;" galleryimg="no" style="z-index:' + zi + '" width="' + p.width + '" height="' + p.height + '"/>';
    }
    if (_clickcb) {
        J("#" + wid).click(_clickcb);
    }
}
function FunsetModal(wid) {
    var e = (Fempty(wid) ? Fid('$_modal_$') : Fid(wid));
    if (!Fempty(e)) document.body.removeChild(e);
    if (!Fempty(Fid('$_modal_$'))) document.body.removeChild(Fid('$_modal_$'));
}
function FenableDrag(wid) {
    J("#" + wid).easydrag();
    J("#" + wid).setHandler(wid + "_head");
} (function ($) {
    var isMouseDown = false;
    var currentElement = null;
    var dropCallbacks = {};
    var dragCallbacks = {};
    var bubblings = {};
    var lastMouseX;
    var lastMouseY;
    var lastElemTop;
    var lastElemLeft;
    var dragStatus = {};
    var holdingHandler = false;
    $.getMousePosition = function (e) {
        var posx = 0;
        var posy = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            'x': posx,
            'y': posy
        };
    };
    $.updatePosition = function (e) {
        var pos = $.getMousePosition(e);
        var spanX = (pos.x - lastMouseX);
        var spanY = (pos.y - lastMouseY);
        $(currentElement).css("top", (lastElemTop + spanY));
        $(currentElement).css("left", (lastElemLeft + spanX));
    };
    $(document).mousemove(function (e) {
        if (isMouseDown && dragStatus[currentElement.id] != 'false') {
            $.updatePosition(e);
            if (dragCallbacks[currentElement.id] != undefined) {
                dragCallbacks[currentElement.id](e, currentElement);
            }
            return false;
        }
    });
    $(document).mouseup(function (e) {
        if (isMouseDown && dragStatus[currentElement.id] != 'false') {
            isMouseDown = false;
            if (dropCallbacks[currentElement.id] != undefined) {
                dropCallbacks[currentElement.id](e, currentElement);
            }
            return false;
        }
    });
    $.fn.setHandler = function (handlerId) {
        return this.each(function () {
            var draggable = this;
            bubblings[this.id] = true;
            $(draggable).css("cursor", "");
            dragStatus[draggable.id] = "handler";
            $("#" + handlerId).css("cursor", "move");
            $("#" + handlerId).mousedown(function (e) {
                holdingHandler = true;
                $(draggable).trigger('mousedown', e);
            });
            $("#" + handlerId).mouseup(function (e) {
                holdingHandler = false;
            });
        });
    }
    $.fn.easydrag = function (allowBubbling) {
        return this.each(function () {
            if (undefined == this.id || !this.id.length) this.id = "easydrag" + (new Date().getTime());
            bubblings[this.id] = allowBubbling ? true : false;
            dragStatus[this.id] = "on";
            $(this).css("cursor", "move");
            $(this).mousedown(function (e) {
                if ((dragStatus[this.id] == "off") || (dragStatus[this.id] == "handler" && !holdingHandler)) return bubblings[this.id];
                $(this).css("position", "absolute");
                $(this).css("z-index", parseInt(new Date().getTime() / 1000));
                isMouseDown = true;
                currentElement = this;
                var pos = $.getMousePosition(e);
                lastMouseX = pos.x;
                lastMouseY = pos.y;
                lastElemTop = this.offsetTop;
                lastElemLeft = this.offsetLeft;
                $.updatePosition(e);
                return bubblings[this.id];
            });
        });
    };
})(jQuery);
jQuery.sjsonp = function (url, cb, callbackname, charset) {
    cb = cb ? cb : function () {};
    eval(callbackname + ' = cb;');
    var s = document.createElement("script");
    if (charset) {
        s.setAttribute("charset", charset);
    }
    s.setAttribute("src", url);
    s.setAttribute("type", "text/javascript");
    document.body.appendChild(s);
}
jQuery.xyjsonp = function (id, url, data, cb, option) {
    if (jQuery.isFunction(data)) {
        option = cb;
        cb = data;
        data = null;
    }
    var op = {
        cache: true,
        charset: null,
        custom_cb: "jsonpcb"
    };
    J.extend(op, option);
    id = op.custom_cb ? "__" + id : id;
    window[id] = function (tmp) {
        cb(tmp);
        window[id] = undefined;
        try {
            delete window[id];
        } catch(e) {}
    };
    var param = {
        url: url,
        data: data,
        dataType: "script",
        scriptCharset: op.charset,
        cache: op.cache
    };
    if (op.custom_cb) param.url += (param.url.match(/\?/) ? "&" : "?") + op.custom_cb + "=" + id;
    setTimeout(function () {
        jQuery.ajax(param);
    },
    1);
};
var href_get_host = function (href) {
    var host = '';
    if ("http://" == href.substr(0, 7)) {
        host = href.substr(7, href.length - 7);
        var po = host.indexOf("/");
        if (po > 0) {
            host = host.substr(0, po);
        }
        else {
            host = '';
        }
    }
    return host;
}
jQuery.get_ = function (a, b, c, d) {
    var proxy = this.init_proxy(href_get_host(a));
    if (g_proxy_is_loaded) return proxy.contentWindow.J.get(a, b, c, d);
    else setTimeout(function () {
        jQuery.get_(a, b, c, d);
        return true
    },
    100);
};
jQuery.post_ = function (a, b, c, d) {
    var proxy = this.init_proxy(href_get_host(a));
    if (g_proxy_is_loaded) return proxy.contentWindow.J.post(a, b, c, d);
    else setTimeout(function () {
        jQuery.post_(a, b, c, d);
    },
    100);
};
jQuery.post_api = function (a, b, c, d) {
    if (a.indexOf('/') == 0) a = a.substring(1);
    if ('xiaoyou.qq.com' == document.location.host || 'campus.qq.com' == document.location.host) {
        return this.post_("http://api." + document.location.host + "/" + a, b, c, d);
    } else {
        return this.post_("http://" + document.location.host + "/" + a, b, c, d);
    }
};
jQuery.get_api = function (a, b, c, d) {
    if (a.indexOf('/') == 0) a = a.substring(1);
    if ('xiaoyou.qq.com' == document.location.host || 'campus.qq.com' == document.location.host) {
        return this.get_("http://api." + document.location.host + "/" + a, b, c, d);
    } else {
        return this.get_("http://" + document.location.host + "/" + a, b, c, d);
    }
};
var g_api_proxy_id = 'g_proxy_iframe_id';
var g_proxy_is_loaded = false;
jQuery.init_proxy = function (host) {
    var proxy;
    if (! (document.getElementById(g_api_proxy_id))) {
        proxy = document.createElement('IFRAME');
        proxy.id = g_api_proxy_id;
        proxy.style.display = "none";
        document.body.appendChild(proxy);
        if (typeof document.addEventListener == "function") {
            proxy.addEventListener("load", function () {
                g_proxy_is_loaded = true;
                return true;
            },
            false);
        } else {
            proxy.attachEvent("onload", function () {
                g_proxy_is_loaded = true;
                return true;
            });
        }
        if (undefined == host || '' == host) {
            proxy.src = "http://api." + document.location.host + "/api_proxy.html";
        } else {
            proxy.src = "http://" + host + "/api_proxy.html";
        }
    } else {
        proxy = document.getElementById(g_api_proxy_id);
    }
    return proxy;
};
(function (J) {
    J.template = function (html, options) {
        return new J.template.instance(html, options);
    };
    J.template.instance = function (html, options) {
        if (options && options['regx']) options.regx = this.regx[options.regx];
        this.options = J.extend({
            compile: false,
            regx: this.regx.standard
        },
        options || {});
        this.html = html;
        if (this.options.compile) {
            this.compile();
        }
        this.isTemplate = true;
    };
    J.template.regx = J.template.instance.prototype.regx = {
        jsp: /\$\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
        ext: /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
        jtemplates: /\{\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}\}/g
    };
    J.template.regx.standard = J.template.regx.jsp;
    J.template.helpers = J.template.instance.prototype.helpers = {
        substr: function (value, start, length) {
            return String(value).substr(start, length);
        }
    };
    J.extend(J.template.instance.prototype, {
        apply: function (values) {
            if (this.options.compile) {
                return this.compiled(values);
            } else {
                var tpl = this;
                var fm = this.helpers;
                var fn = function (m, name, format, args) {
                    if (format) {
                        if (format.substr(0, 5) == "this.") {
                            return tpl.call(format.substr(5), values[name], values);
                        } else { if (args) {
                                var re = /^\s*['"](.*)["']\s*$/;
                                args = args.split(',');
                                for (var i = 0, len = args.length; i < len; i++) {
                                    args[i] = args[i].replace(re, "$1");
                                }
                                args = [values
                                    [name]].concat(args);
                            } else {
                                args = [values
                                    [name]];
                            }
                            return fm[format].apply(fm, args);
                        }
                    } else {
                        return values[name] !== undefined ? values[name] : "";
                    }
                };
                return this.html.replace(this.options.regx, fn);
            }
        },
        compile: function () {
            var sep = J.browser.mozilla ? "+" : ",";
            var fm = this.helpers;
            var fn = function (m, name, format, args) {
                if (format) {
                    args = args ? ',' + args : "";
                    if (format.substr(0, 5) != "this.") {
                        format = "fm." + format + '(';
                    } else {
                        format = 'this.call("' + format.substr(5) + '", ';
                        args = ", values";
                    }
                } else {
                    args = '';
                    format = "(values['" + name + "'] == undefined ? '' : ";
                }
                return "'" + sep + format + "values['" + name + "']" + args + ")" + sep + "'";
            };
            var body;
            if (J.browser.mozilla) {
                body = "this.compiled = function(values){ return '" + this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.options.regx, fn) + "';};";
            } else {
                body = ["this.compiled = function(values){ return ['"];
                body.push(this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.options.regx, fn));
                body.push("'].join('');};");
                body = body.join('');
            }
            eval(body);
            return this;
        }
    });
    var $_old = {
        domManip: J.fn.domManip,
        text: J.fn.text,
        html: J.fn.html
    };
    J.fn.domManip = function (args, table, reverse, callback) {
        if (args[0].isTemplate) {
            args[0] = args[0].apply(args[1]);
            delete args[1];
        }
        var r = $_old.domManip.apply(this, arguments);
        return r;
    };
    J.fn.html = function (value, o) {
        if (value && value.isTemplate) var value = value.apply(o);
        var r = $_old.html.apply(this, [value]);
        return r;
    };
    J.fn.text = function (value, o) {
        if (value && value.isTemplate) var value = value.apply(o);
        var r = $_old.text.apply(this, [value]);
        return r;
    };
})(jQuery);
function bind_tooltips(id, option) {
    var op = {
        'wrap': '<p id="tooltips" class="tips_intro"></p>'
    };
    J.extend(op, option);
    J(".tooltips").hover(function () {
        J(op.wrap).appendTo("body").prepend(J(this).attr("tips"));
        J(this).mousemove(function (e) {
            e = e || window.event;
            var x = e.pageX - 36;
            if (x - 2 < 0) x = 2;
            if (x + 225 > document.body.clientWidth) x = document.body.clientWidth - 225;
            J("#tooltips").css({
                "left": x,
                "top": e.pageY + 18,
                "display": "block",
                "position": "absolute"
            });
        });
    },
    function () {
        J("#tooltips").remove();
    });
}
jQuery.fn.rhtml = function (val) {
    var stack = [];
    return this.each(function (i, el) {
        var oldEl = el;
        if (jQuery.browser.msie) {
            oldEl.innerHTML = val;
            return oldEl;
        }
        var newEl = oldEl.cloneNode(false);
        newEl.innerHTML = val;
        oldEl.parentNode.replaceChild(newEl, oldEl);
        stack.push(newEl);
    }).pushStack(stack);
};
jQuery.getScroll = function (e) {
    if (e) {
        t = e.scrollTop;
        l = e.scrollLeft;
        w = e.scrollWidth;
        h = e.scrollHeight;
    } else { if (document.documentElement && document.documentElement.scrollTop) {
            t = document.documentElement.scrollTop;
            l = document.documentElement.scrollLeft;
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight;
        } else if (document.body) {
            t = document.body.scrollTop;
            l = document.body.scrollLeft;
            w = document.body.scrollWidth;
            h = document.body.scrollHeight;
        }
    }
    return {
        t: t,
        l: l,
        w: w,
        h: h
    };
};
jQuery.fn.scrollTo = function (s) {
    o = jQuery.speed(s);
    return this.each(function () {
        new jQuery.fx.scrollTo(this, o);
    });
};
jQuery.fx.scrollTo = function (e, o) {
    var z = this;
    z.o = o;
    z.e = e;
    z.p = jQuery(e).coordinate();
    z.s = jQuery.getScroll();
    z.clear = function () {
        clearInterval(z.timer);
        z.timer = null
    };
    z.t = (new Date).getTime();
    z.step = function () {
        var t = (new Date).getTime();
        var p = (t - z.t) / z.o.duration;
        if (t >= z.o.duration + z.t) {
            z.clear();
            setTimeout(function () {
                z.scroll(z.p.top, z.p.left)
            },
            13);
        } else {
            st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.top - z.s.t) + z.s.t;
            sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.left - z.s.l) + z.s.l;
            z.scroll(st, sl);
        }
    };
    z.scroll = function (t, l) {
        window.scrollTo(l, t)
    };
    z.timer = setInterval(function () {
        z.step();
    },
    13);
};
//所有移上去显示相应的信息的插件
(function ($) {
    var elements = new Array();
    var elements_button = new Array();
    var elements_count = 0;
    $.fn.popupmenu = function (options) {
        var defaults = {
            target: false,
            addStyle: false,
            time: 300,
            speed: "",
            autooff: true,
            showFunc: "",
            showType: "show",
            hideType: "hide"
        };
        var options = $.extend(defaults, options);
        if (options.showFunc == "fade") {
            options.showType = "fadeIn";
            options.hideType = "fadeOut";
        }
        var global_menu_div = false;
        var global_menu_top = false;
        var global_t;
        return this.each(function () {
            var button = $(this);
            var target = $(options.target);
            elements[elements_count] = target;
            elements_button[elements_count] = button;
            elements_count++;
            button.hover(function () {
                if (options.autooff) {
                    $.each(elements, function (i, n) {
                        n.hide();
                    });
                    $.each(elements_button, function (i, n) {
                        n.removeClass(options.addStyle);
                    });
                }
                clearTimeout(global_t);
                if (options.addStyle != false) {
                    button.addClass(options.addStyle);
                }
                target[options.showType](options.speed);
            },
            function () {
                if (!global_menu_div) {
                    global_t = setTimeout(function () {
                        if (options.addStyle != false) {
                            button.removeClass(options.addStyle);
                        }
                        target[options.hideType](options.speed);
                    },
                    options.time);
                }
            });
            target.hover(function () {
                global_menu_div = true;
                clearTimeout(global_t);
            },
            function () {
                global_menu_div = false;
                setTimeout(function () {
                    if (options.addStyle != false) {
                        button.removeClass(options.addStyle);
                    }
                    target[options.hideType](options.speed);
                },
                options.time);
            });
        });
    };
})(jQuery);
var LOG_VAR = {};
jQuery.logger_init = function (type) {
    LOG_VAR[type] = [];
    var t = new Date();
    LOG_VAR[type].push({
        'msg': 'type <b>' + type + '</b> start!',
        'time': t.getTime()
    });
}
jQuery.logger_log = function (type, msg) {
    msg = (msg == undefined) ? '' : msg;
    var t = new Date();
    LOG_VAR[type].push({
        'msg': msg,
        'time': t.getTime()
    });
}
jQuery.logger_flush = function (type) {
    var str = '<style>.logger_table {border-collapse:collapse; padding:10px 0; width:400px; margin:10px auto;} .logger_table td {border:1px solid #000; padding:3px 5px;}</style>';
    str += '<table border="1" class="logger_table"><tr><td colspan="2" style="font-weight:bold; color:#fff; background:#000;">Type "' + type + '"</td></tr><tr><td>Msg</td><td>Time (ms)</td></tr>';
    for (var i = 1; i < LOG_VAR[type].length; i++) {
        var used_time = LOG_VAR[type][i].time - LOG_VAR[type][i - 1].time;
        str += '<tr><td><b>' + LOG_VAR[type][i].msg + '</b></td><td>' + used_time + '</td></tr>';
    }
    str += '</table>';
    J('body').append(str);
}
function getAD(qq) {
    var adlist = new Array("top_adver_1", "left_adver_1", "class_top_adver_1", "secondadver_1", "right_adver_1", "right_adver_2");
    var x = {
        mod: "showadver",
        qq: qq
    },
    has_ad = false;
    var i = 0;
    var adnum = adlist.length;
    for (i = 0; i < adnum; i++) {
        if ($(adlist[i])) {
            x[adlist
                [i]] = 1;
            has_ad = true;
        }
    }
    if (!has_ad) return;
    var ad_callback = function (getvalue) {
        for (var ad_div_id in getvalue) {
            if (getvalue[ad_div_id].length == 1) {
                if (J("#" + ad_div_id).length > 0) {
                    J("#" + ad_div_id).show().html(getvalue[ad_div_id][0]['content']);
                    if (ad_div_id == "top_adver_1" && Fid('ann_content')) {
                        J('#adver_rollup').attr("title", "收起");
                    }
                    if (ad_div_id == "top_adver_1" && getvalue[ad_div_id][0]['hide']) {
                        toggle_div('ann_content', Fid('adver_rollup'), '', function () {
                            J('#ann_img').hide();
                        },
                        function () {
                            J('#ann_img').show();
                        },
                        'hide');
                    }
                }
                if (J("#" + ad_div_id).length > 0) {
                    J("#" + ad_div_id + " a").each(function () {
                        var href = J(this).attr("href");
                        if (href.indexOf("http") == 0) {
                            J(this).attr("href", "/index.php?mod=showadver&act=counttime&url=" + encodeURIComponent(href) + "&ad_id=" + getvalue[ad_div_id][0]['ad_id']).attr("target", "_blank");
                        }
                    });
                }
            }
            else if (getvalue[ad_div_id].length > 1) {
                var html = '';
                for (var i = 1; i <= getvalue[ad_div_id].length; i++) {
                    if (J("#" + ad_div_id).length <= 0) break;
                    html += "<li>" + getvalue[ad_div_id][i - 1]['content'] + "</li>";
                    if (J("#" + ad_div_id).length > 0) {
                        J("#" + ad_div_id + " a").each(function () {
                            var href = J(this).attr("href");
                            if (href.indexOf("http") == 0) {
                                J(this).attr("href", "/index.php?mod=showadver&act=counttime&url=" + encodeURIComponent(href) + "&ad_id=" + getvalue[ad_div_id][i - 1]['ad_id']).attr("target", "_blank");
                            }
                        });
                    }
                }
                J("#" + ad_div_id).show().append(html).css('zoom', '1');
            }
        }
        if (getvalue['right_adver_1'] || getvalue['right_adver_2']) {
            J("#right_ad_mode").show();
        }
    };
    J.xyjsonp("getAD", "http://api.xiaoyou.qq.com/jsonp.php", x, ad_callback);
}
/*  |xGv00|7ba09b0463f2c3888369b5577d68b790 */