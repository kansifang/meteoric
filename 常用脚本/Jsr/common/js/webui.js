/**
 * @author Administrator
 */
var UI = {};
UI.TextField = function(A){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI._textField);
    this.dom = this.$value = Jsr.extend($(A.id), JTag);
    this.dom.id = Jsr.getTagID();
    this.dom.name = A.name || A.id;
    this.dom.maxLength = A.length || 16;
    this.dom.value = A.value || "";
    this.para = A;
    this.render();
    A = null
};
UI._textField = {
    render: function(){
        var A = this, E = A.dom, F = true, D, C, B;
        E.setClass("textField text-bg border-blur");
        A.setWidth(A.para.width);
        E.onfocus = function(){
            F && this.setClass("textField text-bg border-focus");
            !E.readOnly && this.select()
        };
        E.onblur = function(){
            (function(){
                if (F) 
                    E.setClass("textField text-bg border-blur");
                else 
                    if (E.value.trim() != "") 
                        if (A.vOut) 
                            A.vOut.innerHTML = A.vMsg;
                        else 
                            alert(A.vMsg)
            }).defer(180)
        };
        E.onkeydown = function(){
            if (!this.readOnly && (A.vMethod || A.onKPfunc)) {
                C && window.clearTimeout(C);
                B && window.clearTimeout(B);
                D = this.value.trim()
            }
        };
        E.onkeyup = function(){
            if (!this.readOnly && (D != this.value.trim())) {
                if (A.vMethod) 
                    C = (function(){
                        if ((F = A.vMethod(E.value, A.vFormat))) 
                            E.setClass("textField text-bg border-focus");
                        else 
                            E.setClass("textField text-bg validErr")
                    }).defer(100);
                A.kpCallBack && (B = window.setTimeout(A.kpCallBack, A.kpTime))
            }
        }
    },
    autoSize: function(){
        this.dom.setWidth($P(this.dom).clientWidth)
    },
    check: function(){
        if (this.vMethod) 
            return this.vMethod(this.getValue(), this.vFormat)
    },
    onKeyPress: function(A, B){
        this.kpCallBack = A;
        this.kpTime = B
    },
    setCheck: function(C, A, B, D){
        this.vMethod = C;
        this.vFormat = A;
        this.vMsg = B;
        this.vOut = $(D);
        C = A = B = D = null
    },
    setWidth: function(A){
        this.dom.setWidth(A || 160)
    }
};
UI.TextArea = function(A){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI._textArea);
    this.dom = this.$value = Jsr.extend($(A.id), JTag);
    this.dom.id = Jsr.getTagID();
    this.dom.name = A.name || A.id;
    this.dom.value = A.value || "";
    this.para = A;
    this.render();
    A = null
};
UI._textArea = {
    render: function(){
        var B = this, A = B.dom;
        A.setClass("textArea text-bg border-blur");
        B.setSize(B.para.width, B.para.height);
        A.onfocus = function(){
            A.setClass("textArea text-bg border-focus")
        };
        A.onblur = function(){
            A.setClass("textArea text-bg border-blur")
        }
    },
    autoSize: function(){
        var A = $P(this.dom);
        this.dom.setWidth(A.offsetWidth);
        this.dom.setHeight(A.offsetHeight - 2)
    },
    setSize: function(A, B){
        this.dom.setWidth(A || 160);
        this.dom.setHeight(B || 80)
    }
};
UI.SpinnerField = function(B){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI._spinnerField);
    var C = this, A;
    C.$value = Jsr.extend($(B.id), JTag);
    C.$value.id = Jsr.getTagID();
    C.$value.name = B.name || B.id;
    C.$value.value = B.value || 0;
    C.$value.readOnly = true;
    isFF && (C.$value.size = 200);
    C.dom = Jsr.extend($B("div"), JTag);
    (A = $P(C.$value)) && A.insertBefore(C.dom, C.$value);
    C.min = B.minValue || 0;
    C.max = B.maxValue || 99999999;
    C.step = B.step || 1;
    C.para = B;
    C.render();
    C = A = B = null
};
UI._spinnerField = {
    render: function(){
        var H = this, C = H.dom, B = H.$value, G;
        C.setHTML("<div class='spinnerField-btnArea' style='float:right'></div><div style='float:right'></div><div style='clear:both'></div>");
        G = C.childNodes;
        var F, I;
        F = Jsr.extend(G[0].appendChild($B("div")), JTag);
        F.setClass("spinnerField-btn");
        I = Jsr.extend(G[0].appendChild(F.clone()), JTag);
        I.setBgPos("0 8px");
        H.btnArea = G[0];
        G[1].appendChild(B);
        B.setClass("spinnerField-text");
        B.setStyle("text-align:right;ime-mode:disabled;");
        isFF && (G[1].style.cssText = "display:table-cell");
        C.setClass("text-bg border-blur");
        H.setWidth(H.para.width);
        var E, D, A;
        C.onmouseover = function(){
            E = false
        };
        C.onmouseout = function(){
            E = true
        };
        B.onfocus = function(){
            C.setClass("text-bg border-focus");
            D = this.value
        };
        B.onblur = function(){
            if (!/^[-\+]?\d+$/.test(this.value) || this.value < H.min || this.value > H.max) 
                this.value = D;
            if (E) 
                C.setClass("text-bg border-blur");
            return false
        };
        H.btnArea.onmouseout = function(){
            C.className.contain("focus") && B.focus()
        };
        F.onmousedown = F.ondbclick = function(){
            if (B.disabled) 
                return false;
            this.setBgPos("30px 0");
            D = (Number)(B.value) + H.step;
            B.value = D > H.max ? H.max : D;
            B.focus();
            return false
        };
        F.onmouseup = function(){
            if (B.disabled) 
                return;
            this.setBgPos("0 0");
            if (H.adjustCallBack) {
                window.clearTimeout(A);
                A = H.adjustCallBack.defer(H.time)
            }
            return false
        };
        I.onmousedown = I.ondbclick = function(){
            if (B.disabled) 
                return;
            this.setBgPos("30px 8px");
            D = (Number)(B.value) - H.step;
            B.value = D < H.min ? H.min : D;
            B.focus();
            return false
        };
        I.onmouseup = function(){
            if (B.disabled) 
                return;
            this.setBgPos("0 8px");
            if (H.adjustCallBack) {
                window.clearTimeout(A);
                A = H.adjustCallBack.defer(H.time)
            }
            return false
        }
    },
    autoSize: function(){
        this.dom.setWidth($P(this.dom).clientWidth)
    },
    editable: function(A){
        this.readOnly(!A)
    },
    disable: function(B){
        var C = B ? ["15px 0", "15px 8px"] : ["0 0", "0 8px"], A = this.btnArea.childNodes;
        A[0].setBgPos(C[0]);
        A[1].setBgPos(C[1]);
        this.$value.disabled = B;
        C = A = null
    },
    reset: function(){
        this.$value.value = this.para.value || this.min
    },
    onAdjust: function(A, B){
        this.adjustCallBack = A;
        this.time = B || 0
    },
    setWidth: function(A){
        this.dom.setWidth(A || 160)
    }
};
UI.listModel = {
    initList: function(C){
        var D = this, G = $(C.id), A = [], E = [], F = -1;
        D.items = [];
        D.texts = [];
        D.values = [];
        D.selectIndex = -1;
        for (var B = 0; B < G.length; B++) {
            A.push(G[B].text);
            E.push(G[B].value);
            G[B].selected && (F = B)
        }
        D.itemTemplet = $B("div");
        D.itemTemplet.innerHTML = "<nobr><span unselectable=on></span></nobr>";
        D.itemTemplet.className = "listView-item";
        D.itemTemplet.unselectable = "on";
        D.listPanel = Jsr.extend($B("div"), JTag);
        D.listPanel.setClass("listView font border-blur");
        D.listPanel.style.width = C.width || 160;
        D.listPanel.setHeight((C.row || 5) * 19 + 2);
        if ($P(G)) {
            $P(G).insertBefore(D.listPanel, G);
            if (isFF) 
                $P(G).removeChild(G);
            else 
                G.removeNode(true)
        }
        D.fillData(A, E);
        if (F != -1) {
            D.setValue(D.values[F]);
            D.selectIndex = F
        }
        D = G = A = E = null
    },
    fillData: function(B, C){
        this.removeAll();
        for (var A = 0; A < B.length; A++) 
            this.addItem(B[A], C[A])
    },
    addItem: function(C, B){
        var A = this, D = Jsr.extend(A.itemTemplet.cloneNode(true), JTag);
        D.firstChild.firstChild.appendChild(document.createTextNode(C));
        D.title = C;
        D.index = A.texts.length;
        if (!A.listType) {
            D.onmouseover = function(){
                this.setClass("listView-item listView-alt")
            };
            D.onmouseout = function(){
                this.setClass("listView-item")
            };
            D.onmouseup = function(){
                if (A.disabled) 
                    return;
                A.hidePanel();
                A.showFlag = false;
                A.setValue(A.values[this.index])
            }
        }
        else 
            D.onmousedown = function(){
                if (A.disabled) 
                    return;
                A.setValue({
                    value: A.values[this.index]
                })
            };
        A.listPanel.add(D);
        A.texts.push(C);
        A.values.push(B || C);
        A.items.push(D);
        D = C = B = null
    },
    removeAll: function(){
        this.listPanel.setHTML("");
        this.texts.clear();
        this.values.clear();
        this.items.clear();
        this.selectIndex = -1;
        !this.listType && (this.text.value = this.$value.value = "")
    },
    removeItem: function(A){
        if (A < 0 || A >= this.texts.length) 
            return;
        this.items[A].remove();
        this.items.remove(A);
        this.texts.remove(A);
        this.values.remove(A);
        for (var B = 0; B < this.items.length; B++) 
            this.items[B].index = B;
        if (this.selectIndex == A) {
            this.selectIndex = -1;
            !this.listType && (this.text.value = this.$value.value = "")
        }
    },
    disable: function(A){
        this.dom.style.color = A ? "#A0A0A0" : "#000000";
        this.disabled = A;
        A = null
    },
    getIndexByValue: function(A){
        return this.values.indexOf(A)
    },
    getIndexByText: function(A){
        return this.texts.indexOf(A)
    },
    getText: function(){
        if (this.selectIndex < 0) 
            return;
        return this.texts[this.selectIndex]
    }
};
UI.ListView = function(A){
    Jsr.extend(this, UI.listModel);
    Jsr.extend(this, UI._listView);
    this.$value = $B("input");
    this.$value.type = "hidden";
    this.$value.name = A.name || A.id;
    this.listType = true;
    this.initList(A);
    this.dom = this.listPanel;
    this.dom.add(this.$value);
    A = null
};
UI._listView = {
    getValue: function(){
        return this.selectIndex < 0 ? "" : this.values[this.selectIndex]
    },
    setValue: function(C){
        var B = this, A = B.getIndexByValue(C.value || C);
        if (A < 0) 
            return;
        B.selectIndex > -1 && (B.items[B.selectIndex].setClass("listView-item"));
        B.items[A].setClass("listView-item listView-alt");
        B.selectIndex = A;
        B.$value.value = B.values[A];
        typeof C == "string" && (B.listPanel.scrollTop = 19 * A);
        B.onChangeCallBack && B.onChangeCallBack();
        B = A = C = null
    },
    onChange: function(A){
        this.onChangeCallBack = A;
        A = null
    }
};
UI.comboModel = {
    initCombo: function(C){
        var D = this, B = $(C.id), A = true;
        D.$value = $B("input");
        D.$value.type = "hidden";
        D.$value.name = C.name || C.id;
        D.dom = Jsr.extend($B("div"), JTag);
        $P(B) && $P(B).insertBefore(D.dom, B);
        D.dom.setHTML("<div class='combo-btn' unselectable=on></div><div style='float:left;'></div><div style='clear:both'></div>");
        D.dom.setClass("text-bg border-blur");
        D.dom.setStyle("font-size:12px;");
        D.dom.add(D.$value);
        D.setWidth(C.width);
        D.panel = Jsr.extend(document.body.appendChild($B("div")), JTag);
        D.panel.setClass("combo-panel border-blur");
        D.panel.setStyle("width:160px;height:100px;visibility:hidden;top:0px");
        B = D.dom.childNodes;
        D.cpbtn = Jsr.extend(B[0], JTag);
        D.cpbtn.setWidth(17);
        D.cpbtn.setHeight(19);
        D.text.id = Jsr.getTagID();
        Jsr.extend(B[1].appendChild(D.text), JTag).setClass("spinnerField-text");
        if (!C.editable) {
            D.text.readOnly = true;
            D.text.setStyle("cursor:default")
        }
        if (isFF) {
            B[1].style.cssText = "display:table-cell;";
            D.text.size = 255
        }
        D.showFlag = false;
        D.dom.onmouseover = D.panel.onmouseover = function(){
            A = false
        };
        D.dom.onmouseout = function(){
            A = true
        };
        D.text.onfocus = function(){
            D.dom.setClass("text-bg border-focus");
            !this.readOnly && this.select()
        };
        D.text.onblur = function(){
            if (A) {
                D.dom.setClass("text-bg border-blur");
                if (!this.readOnly) {
                    D.$value.value = this.value;
                    if (D.vMethod && !D.vMethod(this.value, D.vFormat)) {
                        D.dom.setClass("text-bg validErr");
                        if (this.value.trim() != "") 
                            if (D.vOut) 
                                $(D.vOut).innerHTML = D.vMsg;
                            else 
                                alert(D.vMsg)
                    }
                }
                D.showFlag && D.hidePanel();
                D.showFlag = false
            }
        };
        D.cpbtn.onmousedown = function(){
            if (D.text.disabled) 
                return;
            this.setBgPos("30px 0");
            if (D.showFlag) 
                D.hidePanel();
            else 
                D.showPanel();
            D.showFlag = !D.showFlag;
            D.text.focus();
            return false
        };
        D.cpbtn.onmouseup = D.cpbtn.onmouseout = function(){
            if (D.text.disabled) 
                return;
            this.setBgPos("0 0");
            D.dom.className.contain("focus") && D.text.focus()
        };
        D.panel.onmouseup = function(){
            D.text.focus()
        };
        D.panel.onmouseout = function(){
            A = true;
            D.text.focus()
        };
        if (D.text.readOnly) {
            D.text.onmousedown = D.cpbtn.onmousedown;
            D.text.onmouseup = D.cpbtn.onmouseup
        }
        else 
            if (isIE) 
                D.cpbtn.onmouseover = function(){
                    if (D.text.disabled) 
                        return;
                    !D.showFlag && D.text.blur()
                };
        C = B = null
    },
    showPanel: function(){
        var C = this.panel, B = document.body, A = this.dom.getAbsPosition();
        A.y += 21;
        C.offsetWidth > B.clientWidth - A.x && (A.x = B.clientWidth - C.offsetWidth);
        C.offsetHeight > B.clientHeight - A.y && (A.y -= C.offsetHeight + 21);
        C.style.left = A.x;
        C.style.top = A.y;
        C.style.visibility = "visible";
        C = B = A = null
    },
    hidePanel: function(){
        this.panel.style.visibility = "hidden"
    },
    disable: function(A){
        this.text.disabled = A;
        this.cpbtn.setBgPos(A ? "15px 0" : "0 0")
    },
    focus: function(){
        try {
            this.text.focus()
        } 
        catch (A) {
        }
    },
    getValue: function(){
        return this.$value.value.trim()
    },
    setValue: function(A){
        var B = this;
        if (B.selectByIndex) {
            A = B.selectIndex = B.values.indexOf(A);
            if (A > -1) {
                B.text.value = B.texts[A];
                B.$value.value = B.values[A]
            }
            else {
                B.text.value = "";
                B.$value.value = ""
            }
        }
        else 
            B.text.value = B.$value.value = A;
        B.onChangeCallBack && B.onChangeCallBack();
        B = null
    },
    setCheck: function(C, A, B, D){
        this.vMethod = C;
        this.vFormat = A;
        this.vMsg = B;
        this.vOut = D;
        C = A = B = D = null
    },
    check: function(){
        if (this.vMethod) 
            return this.vMethod(this.getValue(), this.vFormat)
    },
    onChange: function(A){
        this.onChangeCallBack = A
    },
    setWidth: function(A){
        this.dom.setWidth(A = A || 160);
        this.selectByIndex && this.panel && (this.panel.style.width = this.listPanel.style.width = A)
    }
};
UI.ComboPanel = function(A){
    Jsr.extend(this, UI.comboModel);
    Jsr.extend(this, UI._comboPanel);
    this.text = $(A.id);
    this.initCombo(A);
    A = null
};
UI._comboPanel = {
    setPanel: function(B){
        var A = this;
        A.panel.setWidth(B.width || 160);
        A.panel.setHeight(B.height || 100);
        A.panel.add(B.panel.dom);
        B.panel.autoSize && B.panel.autoSize();
        B.panel.onChange(function(){
            var C = B.panel.getValue();
            A.transform && (C = A.transform(C));
            A.hidePanel();
            A.setValue(C);
            A.showFlag = false;
            C = null
        });
        if (B.panel.onAdjust) 
            B.panel.onAdjust(function(){
                var C = B.panel.getValue();
                A.transform && (C = A.transform(C));
                A.text.value = C;
                C = null
            })
    },
    setTransform: function(A){
        this.transform = A
    },
    setBtnClass: function(A){
        this.cpbtn.setClass(A)
    }
};
UI.ComboBox = function(B){
    Jsr.extend(this, UI.listModel);
    Jsr.extend(this, UI.comboModel);
    var C = this, A = $(B.id);
    C.selectByIndex = function(A){
        if (A < 0 || A >= C.texts.length) 
            return;
        C.setValue(C.values[A])
    };
    C.text = $B("input");
    C.initCombo(B);
    $P(A) && $P(A).insertBefore(C.dom, A);
    C.initList(B);
    C.panel.add(C.listPanel);
    C.panel.setClass("combo-panel");
    C.panel.style.width = C.listPanel.offsetWidth;
    C.panel.style.height = C.listPanel.offsetHeight;
    A = B = null
};
UI.crModel = {
    callBack: null,
    init: function(){
        var B = this, A;
        B.$value = Jsr.extend($(B.para.id), JTag);
        B.$value.id = Jsr.getTagID();
        B.$value.name = B.para.name || B.para.id;
        B.$value.value = B.para.value || B.type;
        B.dom = Jsr.extend($B("div"), JTag);
        (A = $P(B.$value)) && A.insertBefore(B.dom, B.$value);
        B.dom.setHTML("<div></div><div><nobr unselectable=on></nobr></div><div style='clear:both'></div>");
        B.dom.setStyle("padding:1px 0 1px 10px;");
        B.dom.add(B.$value).setDisplay("none");
        A = B.dom.childNodes;
        B.icon = Jsr.extend(A[0], JTag);
        B.icon.setClass("crBox-icon " + B.type);
        B.checked(B.para.checked);
        isIE && onLoad.add(function(){
            B.checked.apply(B, [B.para.checked])
        });
        A = Jsr.extend(A[1], JTag);
        A.setClass("crBox-text font");
        A.setWidth(B.para.width || 80);
        A.firstChild.appendChild(document.createTextNode(B.text));
        B.icon.onmousedown = A.onmousedown = B.onChangeEvent.delegate(B);
        A = null
    },
    isChecked: function(){
        return this.$value.checked
    },
    checked: function(A){
        if (this.$value.disabled) 
            return;
        if ((this.$value.checked = A)) 
            this.icon.setBgPos("0 13px");
        else 
            this.icon.setBgPos("0 0");
        this.callBack && this.callBack()
    },
    disable: function(B){
        var A = B ? ["13px 13px", "13px 0", "#A0A0A0"] : ["0 13px", "0 0", "#000000"];
        if (this.isChecked()) 
            this.icon.setBgPos(A[0]);
        else 
            this.icon.setBgPos(A[1]);
        this.dom.style.color = A[2];
        this.$value.disabled = B;
        B = A = null
    },
    onChange: function(A){
        this.callBack = A
    }
};
UI.CheckBox = function(A){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI.crModel);
    this.onChangeEvent = function(){
        if (this.$value.disabled) 
            return;
        this.checked(this.$value.checked = !this.$value.checked);
        return false
    };
    this.type = "checkBox";
    this.text = A.text || this.type;
    this.para = A;
    this.init();
    A = null
};
UI.RadioButton = function(A){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI.crModel);
    this.onChangeEvent = function(){
        if (this.$value.disabled) 
            return;
        this.checked(true);
        return false
    };
    this.type = "radioButton";
    this.text = A.text || this.type;
    this.para = A;
    this.init();
    A = null
};
UI.crGroup = {
    selectMemberIndex: -1,
    flow: false,
    initGroup: function(D){
        var A = this;
        Jsr.extend(A.dom, JTag);
        A.dom.id = Jsr.getTagID();
        A.dom.setHTML("<div style='clear:both'></div>");
        for (var B = 0, C = D.length; B < C; B++) 
            A.add(D[B]);
        A.srcMember.type == "radio" && (A.dom.onmousedown = A.onChangeEvent.delegate(A))
    },
    updateMember: function(B, A){
        this.members.each(function(C){
            C[B](A)
        })
    },
    flowLayout: function(B){
        var A = B ? "left" : "none";
        this.members.each(function(B){
            B.dom.setStyle("padding:1px 0 1px 10px;float:" + A)
        });
        this.flow = B
    },
    add: function(A){
        var C = this, E = {
            id: null,
            name: null,
            width: null,
            text: null,
            value: null,
            checked: null
        }, D;
        for (var B in E) 
            E[B] = A[B] || null;
        E.name = C.name;
        E.width = C.textWidth;
        !E.id && (E.id = C.srcMember.cloneNode(false));
        D = new C.memberClass(E);
        C.members.push(D);
        D.dom.index = C.members.length - 1;
        C.flow && D.dom.setStyle("padding:1px 0 1px 10px;float:left");
        C.members.length && C.members[0].callBack && D.onChange(C.members[0].callBack);
        C.defaultSelected.push(E.checked == true);
        C.dom.insertBefore(D.dom, C.dom.lastChild);
        D.checked(E.checked);
        C = cbp = E = D = null
    },
    count: function(){
        return this.members.length
    },
    disable: function(A){
        this.updateMember("disable", A)
    },
    getMemberByText: function(C){
        for (var A = 0, B = this.members.length; A < B; A++) 
            if (this.members[A].text == C) 
                return this.members[A];
        return null
    },
    getMemberByValue: function(C){
        for (var A = 0, B = this.members.length; A < B; A++) 
            if (this.members[A].getValue() == C) 
                return this.members[A];
        return null
    },
    getMemberByIndex: function(A){
        if (A < 0 || A >= this.members.length) 
            return null;
        return this.members[A]
    },
    getSelectedMembers: function(){
        var A = [];
        this.members.each(function(B){
            B.isChecked() && A.push(B)
        });
        return A
    },
    removeAll: function(){
        var A = this;
        A.selectMemberIndex = -1;
        A.flow = false;
        A.members.clear();
        A.defaultSelected.clear();
        A.dom.setHTML("<div style='clear:both'></div>");
        A.callBack && (A.callBack = null);
        A = null
    },
    selectAll: function(A){
        this.updateMember("checked", A)
    }
};
UI.CheckBoxGroup = function(A, C, D, B){
    Jsr.extend(this, UI.crGroup);
    Jsr.extend(this, UI._checkBoxGroup);
    this.dom = Jsr.extend($(A), JTag);
    this.name = C;
    this.textWidth = D;
    this.memberClass = UI.CheckBox;
    this.srcMember = $B("input");
    this.srcMember.type = "checkbox";
    this.members = [];
    this.defaultSelected = [];
    this.initGroup(B);
    A = C = D = B = null
};
UI._checkBoxGroup = {
    getValues: function(){
        var A = this.getSelectedMembers(), B = [];
        A.each(function(A){
            B.push(A.getValue())
        });
        A = null;
        return B
    },
    selectByValues: function(A){
        if (!this.members.length) 
            return;
        var D = null;
        this.selectAll(false);
        for (var B = 0, C = A.length; B < C; B++) {
            D = this.getMemberByValue(A[B]);
            D && D.checked(true)
        }
        D = null
    },
    reset: function(){
        for (var A = 0, B = this.defaultSelected.length; A < B; A++) 
            this.members[A].checked(this.defaultSelected[A])
    },
    onChange: function(A){
        this.updateMember("onChange", A)
    }
};
UI.RadioGroup = function(A, C, B, D){
    Jsr.extend(this, UI.crGroup);
    Jsr.extend(this, UI._radioGroup);
    this.dom = Jsr.extend($(A), JTag);
    this.name = C;
    this.textWidth = B;
    this.memberClass = UI.RadioButton;
    D[0].checked = true;
    this.selectMemberIndex = 0;
    this.srcMember = $B("input");
    this.srcMember.type = "radio";
    this.members = [];
    this.defaultSelected = [];
    this.initGroup(D);
    A = C = B = checkBoxParas = null
};
UI._radioGroup = {
    getValue: function(){
        if (this.selectMemberIndex < 0) 
            return null;
        return this.getMemberByIndex(this.selectMemberIndex).getValue()
    },
    selected: function(A){
        if (!this.members.length || this.members[0].$value.disabled) 
            return false;
        var B = this, C = null;
        if (typeof A == "string") {
            C = B.getMemberByValue(A);
            if (C == null) 
                return false
        }
        else 
            C = A;
        B.selectMemberIndex > -1 && B.getMemberByIndex(B.selectMemberIndex).checked(false);
        C.checked(true);
        B.selectMemberIndex = C.dom.index;
        B.callBack && B.callBack.call(C);
        B = A = C = null
    },
    getSelectedMember: function(){
        return this.getMemberByIndex(this.selectMemberIndex)
    },
    onChange: function(A){
        this.callBack = A
    },
    onChangeEvent: function(){
        var A = window.event.srcElement;
        while (this.dom != A) {
            if (A.index > -1) {
                this.selected(this.getMemberByIndex(A.index));
                break
            }
            A = $P(A)
        }
        A = null
    }
};
UI.SliderBar = function(A){
    Jsr.extend(this, UI._sliderBar);
    this.$value = $B("input");
    this.$value.type = "hidden";
    this.$value.name = A.name || A.id;
    this.$value.value = A.minValue || 0;
    this.dom = Jsr.extend($(A.id), JTag);
    this.dom.id = Jsr.getTagID();
    this.setMinValue(A.minValue);
    this.setMaxValue(A.maxValue);
    this.render(A)
};
UI._sliderBar = {
    render: function(E){
        var C = this, B = C.dom, D, A;
        B.setHTML("<div class='slideBars-axle'></div><div class='slideBars-axle'><div unselectable=on></div></div><div class='slideBars-axle'></div><div style='clear:both;'></div>");
        B.setStyle("font-size:12px;overflow:hidden");
        B.setWidth(E.width || 160);
        B.setHeight(18);
        D = B.childNodes;
        D[2].style.backgroundPosition = "0 20px";
        C.slideAxle = Jsr.extend(D[1], JTag);
        C.slideAxle.setWidth((E.width || 100) - 4);
        C.slideAxle.setBgPos("0 40px");
        C.slideBlock = Jsr.extend(C.slideAxle.firstChild, JTag);
        B.add(C.$value);
        C.slideAxle.onmousedown = function(){
            if (C.disabled) 
                return;
            A = this.getAbsPosition().x;
            C.pitchSlideBlock(window.event.clientX - A);
            if (isIE) 
                C.slideBlock.setCapture();
            else 
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            document.onmousemove = function(){
                C.pitchSlideBlock(window.event.clientX - A);
                C.onAdjustCallBack && C.onAdjustCallBack()
            };
            document.onmouseup = function(){
                if (isIE) 
                    C.slideBlock.releaseCapture();
                else 
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                document.onmousemove = null;
                document.onmouseup = null;
                C.onChangeCallBack && C.onChangeCallBack()
            }
        };
        B = D = A = null
    },
    pitchSlideBlock: function(A){
        var B = this;
        if (A < 8) 
            B.slideBlock.style.marginLeft = "0px";
        else 
            if (A > B.slideAxle.offsetWidth - 4) 
                B.slideBlock.style.marginLeft = B.slideAxle.offsetWidth - 10 + "px";
            else 
                B.slideBlock.style.marginLeft = A - 6 + "px";
        B.$value.value = Math.ceil(parseInt(B.slideBlock.style.marginLeft.match(/\d*/)) / (B.slideAxle.offsetWidth - 10) * (B.max - B.min)) + B.min;
        B = A = null
    },
    autoSize: function(){
        var A = $P(this.dom);
        this.dom.setWidth(A.offsetWidth);
        this.slideAxle.setWidth(A.offsetWidth - 4);
        this.setValue(this.$value.value);
        A = null
    },
    disable: function(A){
        var B, C = this.dom.childNodes;
        B = !(this.disabled = A) ? ["0 0", "0 40px", "0 20px", "0 0"] : ["0 50px", "0 30px", "0 10px", "10px 0"];
        C[0].style.backgroundPosition = B[0];
        C[2].style.backgroundPosition = B[2];
        this.slideAxle.setBgPos(B[1]);
        this.slideBlock.setBgPos(B[3]);
        A = B = C = null
    },
    getValue: function(){
        return this.$value.value
    },
    setValue: function(A){
        if (this.disabled) 
            return;
        (A < this.min || A > this.max) && (A = this.min);
        this.pitchSlideBlock(Math.floor((A - this.min) / (this.max - this.min) * (this.slideAxle.offsetWidth - 10)) + 6);
        this.onChangeCallBack && this.onChangeCallBack()
    },
    setMinValue: function(A){
        this.min = isNaN(A) ? 0 : A;
        this.slideBlock && this.setValue(this.$value.value)
    },
    setMaxValue: function(A){
        this.max = isNaN(A) ? 100 : A;
        this.slideBlock && this.setValue(this.$value.value)
    },
    onChange: function(A){
        this.onChangeCallBack = A
    },
    onAdjust: function(A){
        this.onAdjustCallBack = A
    },
    reset: function(){
        this.setValue(this.min)
    }
};
UI.Button = function(A){
    Jsr.extend(this, VObject);
    Jsr.extend(this, UI._button);
    this.dom = Jsr.extend($B("div"), JTag);
    this.$value = Jsr.extend($(A.id), JTag);
    this.$value.id = Jsr.getTagID();
    this.render(A)
};
UI._button = {
    render: function(D){
        var G = this, B = G.dom, F = G.$value, E, C = false, H = false;
        (E = $P(F)) && E.insertBefore(B, F);
        B.setHTML("<div class='btn-side btn-bg'></div><div class='btn-body btn-bg' unselectable=on></div><div class='btn-side btn-bg'></div>");
        B.setStyle("float:left");
        E = B.childNodes;
        Jsr.extend(E[0], JTag);
        Jsr.extend(E[2], JTag).setBgPos("0 189px");
        Jsr.extend(E[1], JTag).setBgPos("0 168px");
        E[1].setWidth(D.width || 80);
        E[1].add(F).setClass("font");
        F.set("type", "button");
        G.setCaption(D.caption, D.title);
        var A = function(A){
            E[0].setBgPos(A[0]);
            E[1].setBgPos(A[1]);
            E[2].setBgPos(A[2])
        };
        F.onfocus = function(){
            C = true;
            if (H) 
                return;
            A(["0 63px", "0 21px", "0 42px"])
        };
        F.onblur = function(){
            C = false;
            !H && A(["0 0", "0 168px", "0 189px"])
        };
        B.onmouseover = function(){
            if (F.disabled) 
                return;
            H = true;
            A(["0 147px", "0 105px", "0 126px"])
        };
        B.onmouseout = function(){
            if (F.disabled) 
                return;
            H = false;
            if (C) 
                A(["0 63px", "0 21px", "0 42px"]);
            else 
                A(["0 0", "0 168px", "0 189px"])
        };
        B.onclick = function(){
            if (F.disabled) 
                return;
            E[1].setBgPos("0 105px");
            G.focus();
            G.callBack && G.callBack()
        };
        B.onmousedown = function(){
            if (F.disabled) 
                return;
            E[1].setBgPos("0 84px")
        }
    },
    bind: function(A){
        this.callBack = A
    },
    setCaption: function(A, B){
        this.$value.setHTML(A || "Button");
        B && (this.dom.title = B)
    }
};
UI.GroupBox = function(A){
    Jsr.extend(this, UI._groupBox);
    this.dom = $(A.id);
    this.dom.id = Jsr.getTagID();
    this.body = $N("div", this.dom)[0];
    this.render();
    this.setCaption(A.caption);
    this.expand(this.isExpand = A.expanded != false)
};
UI._groupBox = {
    render: function(){
        var B = this, A = B.dom.insertBefore($B("legend"), B.body);
        A.innerHTML = "<div class=groupBox-btn></div><span></span>";
        A.className = "groupBox-caption font";
        B.caption = A.lastChild;
        B.dom.className = "groupBox";
        B.btn = Jsr.extend(A.firstChild, JTag);
        B.btn.onmouseout = function(){
            this.setBgPos(B.isExpand ? "0 60px" : "0 45px")
        };
        B.btn.onmouseover = function(){
            this.setBgPos(B.isExpand ? "15px 60px" : "15px 45px")
        };
        B.btn.onmousedown = function(){
            B.expand(!B.isExpand, true)
        }
    },
    expand: function(B, C){
        var A = (this.isExpand = B) ? ["15px 60px", "0 60px", "", "groupBox"] : ["15px 45px", "0 45px", "none", "groupBox-min"];
        this.btn.setBgPos(C ? A[0] : A[1]);
        this.body.style.display = A[2];
        this.dom.className = A[3];
        A = null
    },
    setCaption: function(A){
        this.caption.innerHTML = A || "GroupBox"
    }
};
UI.container = {
    initCtn: function(E){
        var F = function(A, C, D){
            B[2].insertBefore(Jsr.extend(A, JTag), B[3]).setClass("x-pne-btn");
            A.setBgPos(C[0]);
            A.onmouseover = function(){
                this.setBgPos(G.status == D ? "15px 15px" : C[1])
            };
            A.onmouseout = function(){
                this.setBgPos(G.status == D ? "0 15px" : C[0])
            }
        }, D = function(C){
            if (G.status < 2) {
                B[4].style.display = "";
                I.setBgPos("0 45px")
            }
            else {
                G.style.left = G.bounds.l;
                G.style.top = G.bounds.t;
                H._size(G.bounds.w, G.bounds.h, true);
                A.setBgPos("0 30px")
            }
            G.status = 0;
            if (G.className != "x-pne") {
                G.setClass("x-win");
                C && H.refresh()
            }
        }, H = this, G = (H.dom = Jsr.extend($(E.id), JTag));
        G.setHTML("<div class='corner-bg x-pne-lt x-pne-left' unselectable=on><div class='corner-bg x-pne-rt x-pne-right'><div class='corner-bg x-pne-t' unselectable=on><div class='x-pne-caption font' unselectable=on><nobr></nobr></div></div></div></div><div><div class='side-bg x-pne-l'><div class='side-bg x-pne-r'><div class=x-pne-c></div></div></div><div class='corner-bg x-pne-lb x-pne-left'><div class='corner-bg x-pne-rb x-pne-right'><div class='corner-bg x-pne-b'></div></div></div></div>");
        G.id = Jsr.getTagID();
        G.status = 0;
        var B = $A($N("div", G)), I, A, C;
        if (E.close) {
            F(C = $B("div"), ["0 0", "15px 0"], 3);
            C.onmousedown = function(){
                H.hide()
            }
        }
        if (E.max) {
            F(A = $B("div"), ["0 30px", "15px 30px"], 2);
            A.onmousedown = B[3].ondblclick = function(){
                if (G.status == 2) 
                    D(true);
                else {
                    G.status > 0 && D(true);
                    A.setBgPos("0 15px");
                    G.setClass("x-win x-win-max");
                    G.style.left = G.style.top = "0px";
                    H._size(document.body.clientWidth, document.body.clientHeight);
                    G.status = 2;
                    H.refresh()
                }
                H.focus()
            }
        }
        if (E.min) {
            F(I = $B("div"), ["0 45px", "15px 45px"], 1);
            I.onmousedown = function(){
                if (G.status == 1) 
                    D(true);
                else {
                    G.status > 1 && D(true);
                    B[4].style.display = "none";
                    if (G.className == "x-win") {
                        G.setClass("x-win x-win-min");
                        G.tmpBounds = G.getBounds()
                    }
                    this.setBgPos("15px 15px");
                    G.status = 1
                }
                H.focus && H.focus()
            }
        }
        if (E.icon) {
            H.icon = B[3].lastChild.appendChild(new Image());
            H.icon.src = Jsr.appPath + "common/css/abundant/window/icon.gif";
            H.icon.align = "absmiddle";
            G.bounds = {
                l: 0,
                t: 0,
                w: 0,
                h: 0
            }
        }
        H.caption = B[3].lastChild.appendChild($B("span"));
        H.captionBar = B[3];
        H.body = B[7];
        H.restore = D
    },
    _size: function(A, C, B){
        this.dom.style.width = A;
        this.body.style.width = B ? A - 12 : A;
        this.body.style.height = C - 36
    },
    setCaption: function(A){
        this.caption.innerHTML = A
    },
    setPanel: function(A){
        this.body.appendChild($(A))
    },
    setSize: function(D, C){
        var A = this, B = A.dom;
        B.status > 0 && A.restore();
        D = D > 200 ? D : 200;
        C = C > 120 ? C : 120;
        A._size(D, C, true);
        if (B.className == "x-win") {
            B.bounds.w = D;
            B.bounds.h = C;
            A.refresh()
        }
        A = B = null
    }
};
UI.winModel = {
    _hide: function(){
        var A = this, B = A.dom, C = A.cloCallBack, D;
        B.style.display = "none";
        if (A.flash) {
            if (A.fromObjct) 
                D = A.fromObjct.getBounds();
            else 
                D = {
                    l: B.tmpBounds.l + (B.tmpBounds.w - 60) / 2,
                    t: B.tmpBounds.t + (B.tmpBounds.h - 30) / 2,
                    w: 60,
                    h: 30
                };
            Jsr.boundsTo({
                fromObj: B.tmpBounds,
                toObj: D
            })
        }
        C && C();
        A.isShow = false;
        A = B = C = D = null
    },
    _show: function(C){
        var E = this, B = E.dom, A = E.opnCallBack, D;
        if (E.flash) {
            if (C) {
                !C.isJTag && Jsr.extend(C, JTag);
                D = C.getBounds()
            }
            else 
                D = {
                    l: B.tmpBounds.l + (B.tmpBounds.w - 60) / 2,
                    t: B.tmpBounds.t + (B.tmpBounds.h - 30) / 2,
                    w: 60,
                    h: 30
                };
            Jsr.boundsTo({
                fromObj: D,
                toObj: B.tmpBounds,
                callBack: function(){
                    B.style.display = ""
                }
            });
            E.fromObjct = C
        }
        else 
            B.style.display = "";
        A && A();
        E.isShow = true;
        E = A = D = null
    },
    center: function(){
        var A = this.dom, B = A.bounds;
        A.style.left = B.l = (document.body.clientWidth - B.w) / 2;
        A.style.top = B.t = (document.body.clientHeight - B.h) / 2;
        A = B = null
    },
    hideIcon: function(A){
        this.icon.style.display = A ? "none" : ""
    },
    setIcon: function(A){
        this.icon.src = A
    },
    clearPanel: function(){
        var A = this.getPanel();
        if (A) {
            A.style.display = "none";
            document.body.appendChild(A)
        }
        this.resize = A = null
    },
    getPanel: function(){
        return this.body.firstChild
    },
    setPanel: function(C, A){
        var D = this, B = D.dom;
        D.clearPanel();
        D.body.appendChild($(C)).style.display = "";
        (D.resize = A) && B.status != 1 && A(B.tmpBounds.w, B.tmpBounds.h - 36);
        D = B = null
    },
    refresh: function(){
        var B = this, A = B.dom;
        A.tmpBounds = B.isShow ? A.getBounds() : A.bounds;
        A.status != 1 && B.resize && B.resize(A.tmpBounds.w + (A.status ? 12 : 0), A.tmpBounds.h - 36);
        B = A = null
    },
    onClose: function(A){
        this.cloCallBack = A
    },
    onOpen: function(A){
        this.opnCallBack = A
    }
};
UI.Panel = function(A){
    Jsr.extend(this, UI.container);
    this.initCtn({
        id: A.id,
        min: true
    });
    this.dom.setClass("x-pne");
    this.setSize(A.width, A.height);
    this.setCaption(A.caption || "Panel");
    A.body && this.setPanel(A.body)
};
UI.Dialog = function(A){
    Jsr.extend(this, UI.container);
    Jsr.extend(this, UI.winModel);
    this.hide = function(){
        if (!this.isShow) 
            return;
        this._hide();
        UI.overLayer.style.display = "none";
        window.isLocked = false
    };
    this.show = function(A){
        if (window.isLocked || this.isShow) 
            return;
        this.center();
        this.dom.tmpBounds = this.dom.bounds;
        UI.overLayer.style.display = "";
        this._show(A);
        window.isLocked = true
    };
    this.flash = A.flashed != false;
    this.initCtn({
        id: $B("div"),
        icon: true,
        close: true
    });
    this.dom.setClass("x-win");
    this.dom.style.zIndex = 99995;
    this.dom.style.display = "none";
    this.setSize(A.width || 360, A.height || 260);
    this.setCaption(A.caption || "Dialog");
    document.body.appendChild(this.dom);
    Jsr.drag(this.captionBar, this.dom)
};
UI.alert = function(){
    Jsr.extend(this, UI.container);
    Jsr.extend(this, UI.winModel);
    var B = this, A, C;
    B.hide = function(){
        !window.isLocked && (C.display = "none");
        C.zIndex = 99994;
        B._hide()
    };
    B.show = function(A){
        if (this.isShow) 
            return;
        C = UI.overLayer.style;
        C.zIndex = 99997;
        typeof A != "string" && (A += "");
        B.msg.innerHTML = A.toHTMLString();
        B.center();
        !window.isLocked && (C.display = "");
        B._show()
    };
    B.flash = false;
    B.initCtn({
        id: $B("div"),
        icon: true,
        close: true
    });
    B.dom.setClass("x-win");
    B.dom.style.zIndex = 99998;
    B.dom.style.display = "none";
    B.setSize(340, 150);
    B.hideIcon(false);
    B.setCaption("\u63d0\u793a\u4fe1\u606f");
    document.body.appendChild(B.dom);
    B.body.innerHTML = "<div class='msg-panel alert-ico'><div style='width:290px;height:60px;overflow:hidden'><table class=font><tr><td height=60px></td></tr></table></div></div><div style='width:126px;float:left'>&nbsp</div>";
    B.msg = $N("td", B.body)[0];
    A = new UI.Button({
        id: $B("button"),
        caption: "\u786e \u5b9a",
        width: 70
    });
    A.bind(function(){
        B.hide()
    });
    B.body.appendChild(A.dom);
    Jsr.drag(B.captionBar, B.dom);
    A = null
};
UI.confirm = function(){
    Jsr.extend(this, UI.container);
    Jsr.extend(this, UI.winModel);
    var A = this, B, D, C;
    A.hide = function(B){
        !window.isLocked && (D.display = "none");
        D.zIndex = 99994;
        A._hide();
        C && C(B || false)
    };
    A.show = function(E, B){
        if (this.isShow) 
            return;
        D = UI.overLayer.style;
        D.zIndex = 99997;
        typeof E != "string" && (E += "");
        A.msg.innerHTML = E.toHTMLString();
        A.center();
        !window.isLocked && (D.display = "");
        A._show();
        C = B
    };
    A.flash = false;
    A.initCtn({
        id: $B("div"),
        icon: true,
        close: true
    });
    A.dom.setClass("x-win");
    A.dom.style.zIndex = 99998;
    A.dom.style.display = "none";
    A.setSize(340, 150);
    A.hideIcon(false);
    A.setCaption("\u786e\u8ba4\u4fe1\u606f");
    document.body.appendChild(A.dom);
    A.body.innerHTML = "<div class='msg-panel confirm-ico'><div style='width:290px;height:60px;overflow:hidden'><table class=font><tr><td height=60px></td></tr></table></div></div><div style='width:78px;float:left'>&nbsp</div>";
    A.msg = $N("td", A.body)[0];
    B = new UI.Button({
        id: $B("button"),
        caption: "\u786e \u5b9a",
        width: 70
    });
    B.bind(function(){
        A.hide(true)
    });
    A.body.appendChild(B.dom);
    B = new UI.Button({
        id: $B("button"),
        caption: "\u53d6 \u6d88",
        width: 70
    });
    B.bind(function(){
        A.hide(false)
    });
    A.body.appendChild(B.dom);
    B.dom.style.marginLeft = "20px";
    Jsr.drag(A.captionBar, A.dom);
    B = null
};
Jsr.alert = function(A){
    window.JAlert.show(A)
};
Jsr.confirm = function(B, A){
    window.JConfirm || (window.JConfirm = new UI.confirm());
    window.JConfirm.show(B, A)
};
Jsr.LayerManager = (function(){
    var A = 10000;
    this.getzIndex = function(B){
        return A == B ? B : ++A
    };
    return this
})();
Jsr.drag = function(D, H){
    var J, G, I, F, B = {};
    D.onmousedown = E;
    function E(E){
        if (H.status > 1) 
            return false;
        var D = E || window.event;
        B.x1 = D.clientX - H.offsetLeft;
        B.y1 = D.clientY - H.offsetTop;
        B.x2 = document.body.clientWidth - H.clientWidth + B.x1;
        B.y2 = document.body.clientHeight - H.clientHeight + B.y1;
        I = H.style;
        H.iswin && (I.zIndex = Jsr.LayerManager.getzIndex(I.zIndex));
        F = UI.dragLayer.style;
        F.top = I.top;
        F.left = I.left;
        F.width = H.clientWidth - (isFF ? 4 : 0);
        F.height = H.clientHeight - (isFF ? 4 : 0);
        F.cursor = "move";
        F.display = "";
        if (isFF) 
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        else 
            UI.dragLayer.setCapture();
        document.onmousemove = A;
        document.onmouseup = C;
        return false
    }
    function C(){
        J = parseInt(F.left.match(/\d+/), 10);
        G = parseInt(F.top.match(/\d+/), 10);
        if (H.bounds) {
            H.tmpBounds.l = H.bounds.l = J;
            H.tmpBounds.t = H.bounds.t = G
        }
        I.left = J;
        I.top = G;
        F.cursor = "default";
        F.display = "none";
        if (isFF) 
            window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        else 
            UI.dragLayer.releaseCapture();
        document.onmousemove = document.onmouseup = J = G = I = F = null
    }
    function A(A){
        var C = A || window.event;
        J = C.clientX;
        G = C.clientY;
        F.left = J < B.x1 ? 0 : J > B.x2 ? B.x2 - B.x1 : J - B.x1;
        F.top = G < B.y1 ? 0 : G > B.y2 ? B.y2 - B.y1 : G - B.y1
    }
};
Jsr.boundsTo = function(D){
    var E = function(){
        B.left = D.fromObj.l + Math.floor(A.l * C / 10);
        B.top = D.fromObj.t + Math.floor(A.t * C / 10);
        B.width = D.fromObj.w + Math.floor(A.w * C / 10);
        B.height = D.fromObj.h + Math.floor(A.h * C / 10);
        C++;
        if (C < 11) 
            E.defer(12);
        else {
            B.display = "none";
            D.callBack && D.callBack()
        }
    }, A = {
        l: D.toObj.l - D.fromObj.l,
        t: D.toObj.t - D.fromObj.t,
        w: D.toObj.w - D.fromObj.w,
        h: D.toObj.h - D.fromObj.h
    }, B = UI.dragLayer.style, C = 0;
    B.left = D.fromObj.l;
    B.top = D.fromObj.t;
    B.width = D.fromObj.w;
    B.height = D.fromObj.h;
    B.display = "";
    E()
};
onLoad.add(function(){
    UI.dragLayer = $B("div");
    UI.dragLayer.className = "drag-layer";
    UI.dragLayer.style.display = "none";
    UI.overLayer = $B("div");
    UI.overLayer.className = "covering-layer";
    UI.overLayer.style.cssText = "z-index:99994;display:none";
    document.body.insertBefore(UI.dragLayer, document.body.firstChild);
    document.body.insertBefore(UI.overLayer, UI.dragLayer)
}, function(){
    try {
        window.JAlert = new UI.alert();
        !Jsr.debug && (window.alert = function(A){
            Jsr.alert(A)
        })
    } 
    catch (A) {
    }
});
var JTag = {
    isJTag: true,
    add: function(A){
        return this.appendChild(A)
    },
    clone: function(){
        return this.cloneNode(true)
    },
    setHTML: function(A){
        this.innerHTML = A
    },
    setClass: function(A){
        this.className = A
    },
    setStyle: function(A){
        this.style.cssText = A
    },
    setDisplay: function(A){
        this.style.display = A
    },
    setBgPos: function(A){
        this.style.backgroundPosition = A
    },
    setPos: function(A){
        this.style.position = A
    },
    setWidth: function(A){
        this.tagName == "DIV" && isFF && !/%/.test(A) && (A -= 2);
        this.style.width = A
    },
    setHeight: function(A){
        this.tagName == "DIV" && isFF && !/%/.test(A) && (A -= 2);
        this.style.height = A
    },
    set: function(B, A){
        this.setAttribute(B, A)
    },
    get: function(A){
        return this.getAttribute(A)
    },
    getAbsPosition: function(){
        var A = this, B, C;
        B = A.offsetLeft;
        C = A.offsetTop;
        while ((A = A.offsetParent)) {
            B += A.offsetLeft;
            C += A.offsetTop
        }
        A = this;
        while ((A = A.parentNode)) {
            B -= A.scrollLeft || 0;
            C -= A.scrollTop || 0
        }
        A = null;
        return {
            x: B,
            y: C
        }
    },
    getBounds: function(){
        var A;
        A = this.getAbsPosition();
        return {
            l: A.x,
            t: A.y,
            w: this.offsetWidth,
            h: this.offsetHeight
        }
    },
    remove: function(){
        if (isFF) 
            $P(this).removeChild(this);
        else 
            this.removeNode(true)
    }
}, VObject = {
    disable: function(A){
        this.$value.disabled = A
    },
    focus: function(){
        try {
            this.$value.focus()
        } 
        catch (A) {
        }
    },
    readOnly: function(A){
        this.$value.readOnly = A
    },
    setValue: function(A){
        this.$value.value = A
    },
    getValue: function(){
        return this.$value.value.trim()
    },
    reset: function(){
        this.$value.value = this.para.value || ""
    }
}
