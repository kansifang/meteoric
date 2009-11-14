XN.namespace("ui");
XN.ui.miniEditor = function(p){
    $extend(this, p);
    this.init();
};
XN.ui.miniEditor.prototype = $extend({}, XN.ui.element);
$extend(XN.ui.miniEditor.prototype, {
    _emoRendered: false,
    IDofEditor: "miniEditor",
    IDofForm: "miniEditorForm",
    IDofAction: "miniEditorAction",
    IDofEmoHolder: "miniEditorEmoHolder",
    IDofEmoHeader: "miniEditorEmoTabHolder",
    IDofEmoTab: "miniEditorEmoTab",
    IDofEmoList: "miniEditorEmoList",
    IDofTextarea: "miniEditorTextarea",
    IDofNotVipTip: "notVipTip",
    emoList: "",
    _emoList: null,
    ubbPrefix: "",
    ubbSuffix: "",
    _inputPos: {
        "start": 0,
        "end": 0,
        "item": [0, 0]
    },
    allowAddLink: true,
    isVip: false,
    emoAlignType: "3-2",
    emoOffsetX: 0,
    emoOffsetY: -1,
    _emoKind: {
        "0": {
            name: "\u9ed8\u8ba4\u8868\u60c5"
        },
        "1": {
            name: "\u963f\u72f8"
        },
        "2": {
            name: "\u56e7\u56e7\u718a"
        }
    },
    init: function(){
        var _2 = this;
        this.initAction();
        XN.event.addEvent($(this.IDofTextarea), "keyup", function(){
            _2.getInputPos();
        });
        XN.event.addEvent($(this.IDofTextarea), "mouseup", function(){
            _2.getInputPos();
        });
        XN.event.addEvent($(this.IDofTextarea), "focus", function(){
            _2.getInputPos();
        });
        if ($("emoBtn")) {
            XN.event.addEvent($("emoBtn"), "click", function(e){
                XN.event.stop(e || window.event);
                if (!_2._emoRendered) {
                    _2.renderEmotion();
                }
                _2.showEmotion();
            });
            XN.event.addEvent($(this.IDofEmoHolder), "click", function(e){
                var e = e || window.event;
                if (e.ctrlKey) {
                    XN.event.stop(e);
                }
                _2.parseEmotion(e);
            });
            XN.event.addEvent(document, "click", function(e){
                _2.hideEmotion(e);
            });
            XN.event.addEvent($(this.IDofEmoHolder), "mouseover", function(e){
                XN.event.stop(e || window.event);
                _2.previewEmotion(e);
            });
            XN.event.addEvent($(this.IDofEmoHolder), "mouseout", function(e){
                _2.hidePreviewEmotion(e);
            });
        }
        if ($("addLinkBtn")) {
            XN.event.addEvent($("addLinkBtn"), "click", function(e){
                XN.event.stop(e || window.event);
                _2.showAddLinkFlyer();
            });
        }
        XN.log("miniEditor inited");
    },
    initAction: function(){
        if (this.allowAddLink) {
            $(this.IDofAction).appendHTML("<a href=\"###\" id=\"addLinkBtn\" class=\"m-editor-addlink\">\u94fe\u63a5</a>");
        }
        $(this.IDofAction).appendHTML("<a href=\"###\" id=\"emoBtn\" class=\"m-editor-emo\">\u8868\u60c5</a>");
    },
    showEmotion: function(){
        XN.log("show emotion");
        this._emoHolder.show();
    },
    hideEmotion: function(){
        XN.log("hide emotion");
        if (this._previewHolder) {
            this._previewHolder.hide();
        }
        if (this._emoHolder) {
            this._emoHolder.hide();
        }
    },
    renderEmotion: function(){
        if (!this.emoList) {
            $("emoBtn").hide();
            return;
        }
        var _9 = this._emoList = XN.json.parse(this.emoList).ubbList;
        var _a = {}, _b = {}, _c = {}, _d = "", _e = "", _f = "", _10 = "", _11 = 0, _12 = [];
        for (var p in this._emoKind) {
            _a[p] = [];
            _b[p] = "";
            _c[p] = this._emoKind[p].name;
            XN.log(_c[p]);
        }
        for (var i = 0; i < _9.length; i++) {
            var _15 = "";
            if (XN.browser.IE6) {
                _15 = " onmouseover='this.style.borderColor=\"#808080\"' onmouseout='this.style.borderColor=\"#B8D4E8\"'";
            }
            if (_9[i].size == 2) {
                _e = " preview=\"true\" ";
            }
            if (_9[i].kind == 1 || _9[i].kind == 2) {
                _f = " forvip=\"true\" ";
            }
            else {
                _f = " forvip=\"false\" ";
            }
            _a[_9[i].kind].push("<li" + _15 + "><img src=\"" + XN.env.staticRoot + _9[i].src + "\" alt=\"" + _9[i].alt + "\" emotion=\"" + _9[i].ubb + "\"" + _e + _f + " /></li>");
        }
        var _16 = "style=\"display:block\"";
        for (var p in _a) {
            if (_a[p].length > 0) {
                _b[p] = "<ul class=\"emo-list\" " + _16 + " id=\"emoList" + p + "\">";
                _b[p] += _a[p].join("");
                _b[p] += "</ul>";
                $(this.IDofEmoList).appendHTML(_b[p]);
                if (p == 1 || p == 2) {
                    _d = "<img src=\"" + XN.env.staticRoot + "imgpro/minieditor/viptabbg.png\" align=\"top\" title=\"VIP\u4e13\u7528\" />";
                }
                $(this.IDofEmoTab).appendHTML("<li id=\"emoTab" + p + "\"><a href=\"###\" onfocus=\"this.blur()\">" + "&nbsp;" + _c[p] + "&nbsp;" + _d + "</a></li>");
                _11++;
                _12.push(p);
                XN.log(_11);
                _16 = "style=\"display:none\"";
            }
        }
        if (_11 > 1) {
            var _17 = this;
            $(this.IDofEmoHeader).show();
            var tv = new XN.ui.tabView({
                activeClass: "current"
            });
            for (var i = 0; i < _12.length; i++) {
                tv.addTab({
                    label: "emoTab" + _12[i],
                    active: (i == 0),
                    onActive: (function(i){
                        return function(){
                            var _ct = tv.getCurrentTab().label;
                            $(_ct.replace("emoTab", "emoList")).hide();
                            $("emoList" + _12[i]).show();
                            if (_17._previewHolder) {
                                _17._previewHolder.hide();
                            }
                            _17.hideNotVip();
                        };
                    })(i)
                });
            }
        }
        var _1b = {
            alignWith: this.IDofTextarea,
            tagName: "div",
            alignType: this.emoAlignType,
            offsetX: this.emoOffsetX,
            offsetY: this.emoOffsetY
        };
        this._emoHolder = new XN.ui.fixPositionElement(_1b);
        this._emoHolder.setContent($(this.IDofEmoHolder));
        this._emoHolder.hide();
        $(this.IDofEmoHolder).show();
        this._emoRendered = true;
        XN.log("emotion render ok");
    },
    parseEmotion: function(e){
        var img = XN.event.element(e), _1e = this;
        if (img.tagName.toLowerCase() == "li") {
            img = img.getElementsByTagName("img")[0];
        }
        if (img && img.tagName.toLowerCase() == "img") {
            var _1f = (img.getAttribute("forvip") === "true"), ubb = img.getAttribute("emotion"), _21 = _1e.isVip;
            if (_1f && !_21) {
                _1e.showNotVip(e);
            }
            else {
                _1e.addEmotion(ubb);
            }
        }
    },
    addEmotion: function(_22){
        if (!this._inputHelper) {
            this._inputHelper = new XN.FORM.inputHelper($(this.IDofTextarea));
        }
        var _23 = $(this.IDofTextarea);
        var pos = this._inputPos;
        var _25 = this;
        if (this.ubbPrefix) {
            _22 = this.ubbPrefix + _22;
        }
        if (this.ubbSuffix) {
            _22 += this.ubbSuffix;
        }
        _23.value = _23.value.slice(0, pos.start) + _22 + _23.value.slice(pos.end);
        _23.blur();
        setTimeout(function(){
            _25._inputHelper.focus(pos.start + _22.length);
            _25.getInputPos();
        }, 10);
    },
    showNotVip: function(e){
        $(this.IDofEmoList).hide();
        $(this.IDofNotVipTip).show();
        if (this._previewHolder) {
            this._previewHolder.hide();
        }
        XN.event.stop(e || window.event);
    },
    hideNotVip: function(e){
        $(this.IDofNotVipTip).hide();
        $(this.IDofEmoList).show();
    },
    previewEmotion: function(e){
        img = XN.event.element(e);
        var _29 = this;
        if (img.tagName.toLowerCase() == "a") {
            img = img.getElementsByTagName("img")[0];
        }
        if (img && img.tagName.toLowerCase() == "img") {
            var _2a = img.getAttribute("preview");
            if (_2a) {
                if (!this._previewHolder) {
                    var _2b = {
                        alignWith: this.IDofEmoList,
                        tagName: "div",
                        alignType: "2-2",
                        offsetX: (XN.browser.IE6 ? -1 : (XN.browser.IE ? 1 : 0)),
                        offsetY: (XN.browser.IE ? 1 : 0)
                    };
                    this._previewHolder = new XN.ui.fixPositionElement(_2b);
                    this._previewHolder.container.setStyle("background:#fff;padding:1px;width:50px;height:50px;border:1px solid #B8D4E8;");
                    this._previewHolder.container.className = "meditor-emo-preview";
                    this._previewHolder.container.id = "mEditorPreviewHolder";
                    this._previewHolder.setContent("<img id=\"previewIMG\" class=\"m-editor-preview-img\" src=\"" + img.src + "\" />");
                    XN.event.addEvent($("mEditorPreviewHolder"), "mouseover", function(){
                        var _2c = _29._previewHolder.alignType == "1-1" ? "2-2" : "1-1";
                        if (XN.browser.IE6) {
                            var _2d = _29._previewHolder.alignType == "1-1" ? -1 : 1;
                            _29._previewHolder.setOffsetX(_2d);
                        }
                        _29._previewHolder.setAlignType(_2c);
                    });
                }
                this._previewHolder.hide();
                $("previewIMG").src = img.src;
                this._previewHolder.show();
            }
        }
    },
    hidePreviewEmotion: function(e){
        el = XN.event.element(e);
        if (el.tagName.toLowerCase() == "ul" && this._previewHolder) {
            this._previewHolder.hide();
        }
    },
    showAddLinkFlyer: function(){
        var _2f = this, pos = this._inputPos, _31 = "";
        if (pos.start != pos.end) {
            _31 = "display:none";
        }
        var _32 = "<div style=\"text-align:center;\">" + "<label style=\"display:block;margin:5px 0;\">\u7f51\u5740\uff1a<input type=\"text\" class=\"input-text\" id=\"mEditorUrl\" style=\"width:230px;\" /></label>" + "<label style=\"display:block;margin:5px 0;" + _31 + "\">\u6587\u5b57\uff1a<input type=\"text\" class=\"input-text\" id=\"mEditorTxt\" style=\"width:230px;\" /></label>" + "</div>";
        XN.DO.confirm({
            msg: _32,
            title: "\u6dfb\u52a0\u94fe\u63a5",
            yes: "\u6dfb\u52a0",
            callBack: function(y){
                if (y) {
                    _2f.addLink();
                }
            }
        });
    },
    addLink: function(){
        var _34 = $("mEditorUrl").value, _35 = "", _36 = $(this.IDofTextarea), pos = this._inputPos, _38 = this;
        if (!_34) {
            return;
        }
        if (!this._inputHelper) {
            this._inputHelper = new XN.FORM.inputHelper($(this.IDofTextarea));
        }
        if (pos.start != pos.end) {
            _35 = _36.value.slice(pos.start, pos.end);
        }
        else {
            _35 = $("mEditorTxt").value;
            if (!_35) {
                _35 = _34;
            }
        }
        if (!/^(http:\/\/|https:\/\/)/.test(_34)) {
            _34 = "http://" + _34;
        }
        var _39 = "[url=" + _34 + "]" + _35 + "[/url]";
        _36.value = _36.value.slice(0, pos.start) + _39 + _36.value.slice(pos.end);
        _36.blur();
        setTimeout(function(){
            _38._inputHelper.focus(pos.start + _39.length);
            _38.getInputPos();
        }, 10);
    },
    getInputPos: function(){
        var _3a = $(this.IDofTextarea);
        var _3b = 0, end = 0;
        if (typeof(_3a.selectionStart) == "number") {
            _3b = _3a.selectionStart;
            end = _3a.selectionEnd;
        }
        else {
            if (document.selection) {
                var _3d = document.selection.createRange();
                if (_3d.parentElement() == _3a) {
                    var _3e = document.body.createTextRange();
                    _3e.moveToElementText(_3a);
                    for (_3b = 0; _3e.compareEndPoints("StartToStart", _3d) < 0; _3b++) {
                        _3e.moveStart("character", 1);
                    }
                    for (var i = 0; i <= _3b; i++) {
                        if (_3a.value.charAt(i) == "\n") {
                            _3b++;
                        }
                    }
                    var _3e = document.body.createTextRange();
                    _3e.moveToElementText(_3a);
                    for (end = 0; _3e.compareEndPoints("StartToEnd", _3d) < 0; end++) {
                        _3e.moveStart("character", 1);
                    }
                    for (var i = 0; i <= end; i++) {
                        if (_3a.value.charAt(i) == "\n") {
                            end++;
                        }
                    }
                }
            }
        }
        this._inputPos = {
            "start": _3b,
            "end": end,
            "item": [_3b, end]
        };
        XN.log(this._inputPos);
    }
});
XN.event.enableCustomEvent(XN.ui.miniEditor.prototype);

