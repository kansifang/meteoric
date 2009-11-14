/**
 * @author Administrator
 */
Jsr.importCss("ui_calendar");
UI.Calendar = function(A){
    Jsr.extend(this, UI._calendar);
    this.monthText = ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u5341\u4e00", "\u5341\u4e8c"];
    this.months = [];
    this.years = [];
    this.$value = $B("input");
    this.$value.type = "hidden";
    this.$value.name = A.name || A.id;
    this.format = A.format || "Y-M-D";
    this.date = A.date ? new Date(A.date.replace(/\D+/g, "/")) : new Date();
    this.dom = Jsr.extend($(A.id), JTag);
    this.dom.id = Jsr.getTagID();
    this.dom.setWidth(A.width || 200);
    this.dom.setHeight(A.width || 200);
    this.render(A)
};
UI._calendar = {
    render: function(O){
        var L = this, B = L.dom, C = L.months, Q = L.years, P, F, G = "<table width=100% height=100% cellspacing=0><tr class=calendar-bg style='background-position:0 25px'><td width=18 height=25 align=right></td><td align=center></td><td width=18></td></tr><tr><td colspan=3 style='padding:0'></td></tr><tr class='calendar-bg font'><td height=30 colspan=3 align=center style='border-top:1px solid #A3BAD9'><span>\u4eca\u5929</span></td></tr></table>", N = "<table width=100% height=100% cellspacing=4 class='calendar-panel font' style='display:none'>";
        for (var H = 0; H < 6; H++) 
            N += "<tr><td align=center></td><td align=center style='border-right:1px solid #A3BAD9'></td><td align=center></td><td align=center></td></tr>";
        N += "<tr class=calendar-bg><td height=30 colspan=4 align=center style='border:1px solid #A3BAD9'><span>\u786e\u5b9a</span> <span>\u53d6\u6d88</span></td></tr></table>";
        B.setHTML(N + G);
        B.setClass("border-blur calendar-bgcolor");
        N = B.firstChild;
        G = B.lastChild;
        for (H = 0; H < 4; H++) 
            for (var M = 0; M < 6; M++) 
                if (H < 2) 
                    C.push(N.rows[M].cells[H]);
                else 
                    if (M > 0) 
                        Q.push(N.rows[M].cells[H]);
        P = N.rows[0].cells[2].appendChild(Jsr.extend($B("div"), JTag));
        P.setClass("calendar-panel-btn");
        P.step = -10;
        P.setBgPos("0 30px");
        F = N.rows[0].cells[3].appendChild(Jsr.extend(P.clone(), JTag));
        F.step = 10;
        F.setBgPos("0 15px");
        var E = G.rows, K = E[0].cells, D, J;
        D = Jsr.extend(K[0].appendChild($B("div")), JTag);
        D.setClass("calendar-head-btn");
        D.step = -1;
        J = Jsr.extend(K[2].appendChild(D.clone()), JTag);
        J.setBgPos("0 -15px");
        J.step = 1;
        L.yearArea = K[1].appendChild($B("div"));
        L.yearArea.className = "calendar-year font";
        K = "<table width=100% height=100% cellpadding=0 cellspacing=0 class='calendar-days font'><thead><tr class=calendar-bg><td height=18>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td></tr></thead><tbody>";
        for (H = 0; H < 6; H++) 
            K += "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
        K += "</tbody></table>";
        E[1].cells[0].innerHTML = K;
        L.days = $A($N("td", E[1].cells[0].firstChild.lastChild));
        var A = L.days, I;
        P.onmouseover = function(){
            this.setBgPos("15px 30px")
        };
        P.onmouseout = function(){
            this.setBgPos("0 30px")
        };
        F.onmouseover = function(){
            this.setBgPos("15px 15px")
        };
        F.onmouseout = function(){
            this.setBgPos("0 15px")
        };
        P.onmousedown = F.onmousedown = function(){
            for (var A = 0; A < 10; A++) {
                var B = parseInt(Q[A].innerHTML) + this.step;
                if (B < 0) 
                    return;
                Q[A].innerHTML = B;
                Q[A].className = B == L.year ? "calendar-selectDay" : "calendar-noSelectDay"
            }
        };
        K = N.rows[6].cells[0].childNodes;
        K[0].onmousedown = K[2].onmousedown = function(){
            if (this.innerHTML == "\u786e\u5b9a") {
                L.date.setFullYear(L.year);
                L.date.setMonth(L.month);
                L.monthCallBack && L.monthCallBack()
            }
            L.refresh();
            N.style.display = "none";
            G.style.display = ""
        };
        D.onmouseover = function(){
            this.setBgPos("15px 0")
        };
        J.onmouseover = function(){
            this.setBgPos("15px -15px")
        };
        D.onmouseout = function(){
            this.setBgPos("0 0")
        };
        J.onmouseout = function(){
            this.setBgPos("0 -15px")
        };
        D.onmousedown = J.onmousedown = function(){
            L.date.setMonth(L.month + this.step);
            L.refresh();
            L.monthCallBack && L.monthCallBack()
        };
        L.yearArea.onmousedown = function(){
            G.style.display = "none";
            N.style.display = ""
        };
        E[2].cells[0].firstChild.onmousedown = function(){
            L.date = new Date();
            L.refresh()
        };
        N.onmouseout = function(){
            if (this.contains(window.event.toElement || window.event.fromElement)) 
                return;
            L.refresh();
            N.style.display = "none";
            G.style.display = ""
        };
        for (H = 0; H < 10; H++) {
            Q[H].index = H;
            Q[H].onmouseover = function(){
                this.innerHTML != L.year && (this.className = "calendar-day-over")
            };
            Q[H].onmouseout = function(){
                this.innerHTML != L.year && (this.className = "calendar-noSelectDay")
            };
            Q[H].onmousedown = function(){
                Q[L.yearIndex].className = "calendar-noSelectDay";
                this.className = "calendar-selectDay";
                L.year = this.innerHTML;
                L.yearIndex = this.index
            }
        }
        for (H = 0; H < 12; H++) {
            C[H].index = H;
            C[H].innerHTML = L.monthText[H] + "\u6708";
            C[H].onmouseover = function(){
                this.index != L.month && (this.className = "calendar-day-over")
            };
            C[H].onmouseout = function(){
                this.index != L.month && (this.className = "calendar-noSelectDay")
            };
            C[H].onmousedown = function(){
                C[L.month].className = "calendar-noSelectDay";
                this.className = "calendar-selectDay";
                L.month = this.index
            }
        }
        for (H = 0; H < 42; H++) {
            A[H].index = H;
            A[H].onmouseover = function(){
                if (L.selectIndex != this.index) {
                    I = this.className;
                    this.className = "calendar-day-over"
                }
            };
            A[H].onmouseout = function(){
                L.selectIndex != this.index && (this.className = I)
            };
            A[H].onmousedown = function(){
                if (this.type < 1) 
                    return;
                var B = A[L.selectIndex];
                B.className = B.type > 1 ? "calendar-sday" : "";
                this.className = "calendar-selectDay";
                L.selectIndex = this.index;
                L.date.setDate(this.innerHTML);
                L.callBack && L.callBack()
            }
        }
        L.refresh();
        B = P = F = E = D = J = K = null
    },
    refresh: function(){
        var F = this, C = new Date(F.date), A = F.days, E = false, D;
        F.year = C.getFullYear();
        F.month = C.getMonth();
        F.day = C.getDate();
        F.yearArea.innerHTML = F.monthText[F.month] + "\u6708 " + F.year;
        for (var B = 0; B < 10; B++) {
            F.years[B].innerHTML = F.year + B - 4;
            F.years[B].className = "calendar-noSelectDay"
        }
        F.years[4].className = "calendar-selectDay";
        F.yearIndex = 4;
        for (B = 0; B < 12; B++) 
            F.months[B].className = "calendar-noSelectDay";
        F.months[F.month].className = "calendar-selectDay";
        C.setDate(1);
        C.setDate(1 - C.getDay());
        for (B = 0; B < 42; B++) {
            A[B].innerHTML = D = C.getDate();
            D == 1 && (E = !E);
            A[B].className = E ? "" : "calendar-dday";
            A[B].type = E ? 1 : 0;
            if (C.getDay() == 0 || C.getDay() == 6) {
                A[B].className += " calendar-sday";
                E && (A[B].type = 2)
            }
            if (E && D == F.day) {
                F.selectIndex = B;
                A[B].className = "calendar-selectDay"
            }
            C.setDate(++D)
        }
        F = C = A = E = D = null
    },
    getValue: function(){
        return this.format.replace(/Y/, this.year).replace(/M/, this.month + 1).replace(/D/, this.date.getDate())
    },
    setValue: function(A){
        this.date = new Date(A.replace(/\D+/g, "/"));
        this.refresh()
    },
    onChange: function(A){
        this.callBack = A
    },
    onMonthChange: function(A){
        this.monthCallBack = A
    }
};
UI.DatePicker = function(C){
    Jsr.extend(this, UI.comboModel);
    var B = this, A = Jsr.extend({}, C);
    B.text = $(C.id);
    B.initCombo(C);
    A.id = $B("div");
    A.name = Jsr.getTagID();
    A.width = 200;
    A = new UI.Calendar(A);
    B.panel.setWidth(200);
    B.panel.setHeight(200);
    B.panel.add(A.dom);
    B.panel.setClass("combo-panel");
    A.onChange(function(){
        B.hidePanel();
        B.setValue(A.getValue());
        B.showFlag = false
    });
    B.text.value = B.$value.value = A.getValue();
    B.cpbtn.setClass("datePicker-btn");
    C = null
}
