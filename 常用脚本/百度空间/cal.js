function cal(root, isSubCal){
    this.firstday = 0;
    this.before;
    this.after;
    this.bCls;
    this.aCls;
    this.curDate;
    this.curYear;
    this.curMonth;
    this.curDay;
    this.curSel;
    this.curStart;
    this.curEnd;
    this.range = [];
    this.range["start"] = new Date;
    this.range["end"] = new Date;
    this.start;
    this.end;
    this.selectDate;
    this.type;
    this.ctrl = false;
    this.mthsel = true;
    this.isSubCal = isSubCal;
    this.inMe;
    this.version = "1.09 build 0109";
    this.author = "fantao";
    this.mail = this.author + "@baidu.com";
    this.space = "http://hi.baidu.com/ftbase";
    this.root = root;
    this.caltable;
    this.calbody;
    this.calmth;
    this.all_tr;
    this.secret6;
    this.td;
    this.ctrl_td;
    this.week_tr;
    this.year_td;
    this.year_pre;
    this.year_nxt;
    this.mth_tr;
    this.mth_td;
    this.rng_td;
    this.subwin = null;
    this.subCal1 = null;
    this.subCal2 = null;
    this.subMth;
    this.roller;
    this.popwin;
    this.wobj;
    this.debuger;
    this.onupdate = function(){
    };
    this.onselect = function(){
    };
    this.onload = function(){
    };
    this.week = ["日", "一", "二", "三", "四", "五", "六"];
    this.month = "月";
    this.year = "年";
    this.mthtxt = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    this.rngtxt = [];
    this.rngtxt["D"] = "日";
    this.rngtxt["M"] = "月";
    this.rngtxt["Y"] = "年";
    this.rngtxt["W"] = "周";
    this.rngtxt["U"] = "自定义";
    this.preyear = "";
    this.nxtyear = "";
    this.preMthTxt = "上个月";
    this.nxtMthTxt = "下个月";
    this.selYrTxt = "点击选择年份";
    this.selMthTxt = "点击选择月份";
    this.prerng = "前&lt;&lt;";
    this.nxtrng = "&gt;&gt;后";
    this.ctrlHTML = "&nbsp;>&nbsp;";
    this.subtit = "自定义时间段";
    this.subOK = "确认";
    this.activeDates = "";
    this.activeUpdates = []
};
cal.prototype.countMonth = function(y, m){
    for (var t = 31; t != new Date(y, m, t).getDate(); t--) {
    }
    return t
};
cal.prototype.getDays = function(y, m){
    var me = this;
    me.before = me.after = -1;
    var fd = me.firstday;
    var days = [];
    for (var i = 1; i == new Date(y, m, i).getDate(); i++) {
        days[i - 1] = i
    }
    var start = days[0];
    var end = days[days.length - 1];
    var ds = new Date(y, m, start).getDay();
    var de = new Date(y, m, end).getDay();
    var wd = new Array(7);
    switch (fd) {
        case 0:
            wd = [0, 1, 2, 3, 4, 5, 6];
            break;
        case 1:
            wd = [1, 2, 3, 4, 5, 6, 0];
            break
    }
    for (var j = 0; ds != wd[j]; j++) {
        this.before = j
    }
    for (var k = 6, a = 0; de != wd[k]; k--, a++) {
        this.after = a
    }
    var t = me.countMonth(y, m - 1);
    var dsb = new Array();
    for (var i = this.before; i >= 0; i--) {
        dsb[i] = t;
        t--
    }
    var dsa = new Array();
    for (var i = 0; i <= this.after; i++) {
        dsa[i] = i + 1
    }
    var dts = dsb.concat(days, dsa);
    return dts
};
cal.prototype.init = function(y, m, d){
    var tb = [], tr = [], td = [], ctrl = [], wtd = [];
    var me = this;
    if (typeof(me.root) == "string") {
        me.root = document.getElementById(me.root)
    }
    me.setDate(y, m, d);
    me.addPop();
    me.addYear();
    if (!me.isSubCal && !me.mthsel) 
        me.addMth();
    tb = document.createElement("table");
    if (me.root) 
        me.root.appendChild(tb);
    else 
        document.body.appendChild(tb);
    for (var i = 0; i < 7; i++) {
        tr[i] = tb.insertRow(-1);
        if (!me.isSubCal && me.ctrl) {
            ctrl[i] = document.createElement("td");
            tr[i].appendChild(ctrl[i]);
            if (i != 0) {
                ctrl[i].style.cursor = "pointer";
                ctrl[i].innerHTML = me.ctrlHTML
            }
            ctrl[0].innerHTML = "";
            me.ctrl_td = ctrl
        }
    }
    for (var i = 0; i < 7; i++) {
        wtd[i] = document.createElement("td");
        tr[0].appendChild(wtd[i]);
        wtd[i].setAttribute("no", i);
        wtd[i].innerHTML = me.week[i];
        function onclick(){
            me.curSel = true;
            me.clearSel();
            me.update();
            for (var i = 1, tds, n; i <= 7 && me.all_tr[i].style.display != "none"; i++) {
                n = this.getAttribute("no");
                tds = me.all_tr[i].childNodes[parseInt(n) + 1];
                if (tds.getAttribute("month") == me.curMonth) {
                    tds.className = "cal_select";
                    me.curSel = false;
                    me.debug(tds)
                }
            }
        }
    }
    for (var i = j = k = 0; i < 6; k++) {
        td[k] = document.createElement("td");
        tr[i + 1].appendChild(td[k]);
        if (j >= 6) {
            j = 0;
            i++
        }
        else 
            j++
    }
    if (!me.isSubCal && !me.mthsel) 
        me.addRanger();
    tb.className = "cal_body";
    tb.border = "0";
    tb.cellPadding = "0";
    tb.cellSpacing = "1";
    tb.align = "center";
    tr[0].className = "cal_week";
    me.calbody = tb;
    me.all_tr = tr;
    me.secret6 = tr[6];
    me.td = td;
    me.update();
    me.onload()
};
cal.prototype.update = function(){
    var me = this;
    var y = me.curYear, m = me.curMonth, d = me.curDay;
    var td = me.td;
    var dts = me.getDays(y, m);
    var ln = dts.length;
    var aft = me.after;
    if (ln > 35) {
        me.secret6.style.display = ""
    }
    else {
        me.secret6.style.display = "none"
    }
    for (var i = 0; i < ln; i++) {
        var d;
        if (i <= me.before) {
            d = new Date(y, m - 1, dts[i]);
            dts[i] = "&nbsp;";
            td[i].className = "cal_before"
        }
        else 
            if (i >= ln - aft - 1) {
                d = new Date(y, m + 1, dts[i]);
                dts[i] = "&nbsp;";
                td[i].className = "cal_after"
            }
            else {
                d = new Date(y, m, dts[i]);
                td[i].className = "cal_date"
            }
        td[i].setAttribute("year", d.getFullYear());
        td[i].setAttribute("month", d.getMonth());
        td[i].setAttribute("day", dts[i]);
        td[i].setAttribute("classBack", td[i].className);
        var mth = me.mth_td;
        var nxt = me.year_nxt;
        var ctrl = td[i].parentNode.childNodes[0];
        var today = new Date();
        td[i].innerHTML = dts[i];
        if (me.range.start && me.range.end) {
            if (d.toDateString() == today.toDateString()) 
                if (td[i].className.indexOf("cal_before") < 0 && td[i].className.indexOf("cal_after") < 0) {
                    td[i].className = "today"
                }
            if (d >= me.range.start && d <= me.range.end) {
                me.sel(td[i])
            }
        }
    }
    me.year_td.innerHTML = me.curYear + me.year;
    if (!me.isSubCal && !me.mthsel) {
        for (i = 0; i < me.mth_td.length; i++) {
            me.mth_td[i].setAttribute("year", me.curYear)
        }
        me.rng_td.innerHTML = me.rngtxt[me.type || "U"]
    }
    if (me.isSubCal || me.mthsel) 
        me.subMth.innerHTML = me.mthtxt[m] + me.month;
    else 
        if (me.range.start && me.range.end) {
            for (var a = 0; mth && a < 12; a++) {
                var _y = parseInt(mth[a].getAttribute("year"));
                var _m = parseInt(mth[a].getAttribute("month"));
                var _m = parseInt(mth[a].getAttribute("month"));
                var selMthFst = new Date(_y, _m, 1);
                var selMthLst = new Date(_y, _m + 1, 0);
                if (selMthLst >= me.range.start && selMthFst <= me.range.end) {
                    me.sel(mth[a])
                }
                else {
                    mth[a].className = "mth_ctrl"
                }
            }
        }
    me.makeStartEnd();
    me.roller.style.display = "none";
    me.onupdate()
};
cal.prototype.addMth = function(){
    var me = this;
    var mtb = [], mtr = [], mtd = [];
    mtb = document.createElement("table");
    if (me.root) 
        me.root.appendChild(mtb);
    else 
        document.body.appendChild(mtb);
    for (var i = 0; i < 2; i++) {
        mtr[i] = mtb.insertRow(-1);
        for (var j = 0, k = 0; j < 6; j++) {
            if (i > 0) 
                k = j + 6;
            else 
                k = j;
            mtd[k] = document.createElement("td");
            mtr[i].appendChild(mtd[k]);
            mtd[k].className = "mth_ctrl";
            mtd[k].setAttribute("no", k);
            mtd[k].style.cursor = "pointer";
            mtd[k].setAttribute("year", me.curYear);
            mtd[k].setAttribute("month", k);
            mtd[k].onmouseover = me.msover;
            mtd[k].onmouseout = me.msout;
            mtd[k].innerHTML = k + 1 + me.month;
            mtd[k].onclick = function(){
                var i = this;
                var y = i.getAttribute("year");
                var m = i.getAttribute("month");
                me.setStart(y, m, 1);
                me.setEnd(y, m, me.countMonth(y, m));
                me.setDate(y, m, "1");
                me.setType("M");
                me.update()
            }
        }
    }
    mtb.className = "cal_mth";
    mtb.border = "0";
    mtb.cellPadding = "0";
    mtb.cellSpacing = "1";
    mtb.align = "center";
    me.mth_tr = mtr;
    me.mth_td = mtd
};
cal.prototype.addYear = function(){
    var me = this;
    var ydiv = $c("div");
    var ytb = [], ytr = [], ytd = [];
    ytb = $c("table");
    if (me.root) 
        me.root.appendChild(ydiv);
    else 
        document.body.appendChild(ydiv);
    ydiv.appendChild(ytb);
    ytr[0] = ytb.insertRow(-1);
    var how = 3;
    if (me.isSubCal || me.mthsel) 
        how = 4;
    for (var i = 0; i < how; i++) {
        ytd[i] = document.createElement("td");
        ytr[0].appendChild(ytd[i])
    }
    var y = me.curDate.getFullYear();
    var m = me.curDate.getMonth();
    var d = me.curDate.getDate();
    if (me.isSubCal || me.mthsel) {
        var mthTable = cal.createTable(1, 2);
        ytd[2].appendChild(mthTable);
        mthTable.className = "mth_normal";
        mthTable.onclick = function(){
            me.roll(this, "month")
        };
        mthTable.onmouseover = function(){
            this.className = "mth_sel";
            var pos = cal.getPos(this);
            var x = pos[0], y = pos[1] + this.offsetHeight;
            var shtml = me.selMthTxt;
            me.addPop(x, y, shtml)
        };
        mthTable.onmouseout = function(){
            this.className = "mth_normal";
            me.popwin.style.display = "none"
        };
        var mth_sel = mthTable.getElementsByTagName("td");
        mth_sel[1].innerHTML = "<img src='http://img.baidu.com/hi/img/date/updown.gif'></img>";
        mth_sel[1].className = "cal_arrow";
        me.subMth = mth_sel[0]
    }
    else 
        ytd[1].onclick = selectYear;
    var pre = ytd[0], nxt = ytd[how - 1];
    pre.innerHTML = me.preyear;
    ytd[0].setAttribute("act", "-1");
    pre.className = "cal_pre";
    ytd[0].style.fontSize = "8px";
    nxt.innerHTML = me.nxtyear;
    ytd[how - 1].setAttribute("act", "+1");
    nxt.className = "cal_nxt";
    ytd[how - 1].style.fontSize = "8px";
    pre.onmouseover = function(){
        this.className = "cal_pre_ovr"
    };
    pre.onmouseout = function(){
        this.className = "cal_pre"
    };
    nxt.onmouseover = function(){
        this.className = "cal_nxt_ovr"
    };
    nxt.onmouseout = function(){
        this.className = "cal_nxt"
    };
    pre.title = me.preMthTxt;
    "上一月";
    nxt.title = me.nxtMthTxt;
    "下一月";
    ytd[0].onclick = chgYear;
    ytd[how - 1].onclick = chgYear;
    var yearTable = cal.createTable(1, 2);
    ytd[1].appendChild(yearTable);
    yearTable.className = "yr_normal";
    yearTable.onclick = function(){
        me.roll(this, "year")
    };
    yearTable.onmouseover = function(){
        this.className = "yr_sel";
        var pos = cal.getPos(this);
        var x = pos[0], y = pos[1] + this.offsetHeight;
        var shtml = me.selYrTxt;
        me.addPop(x, y, shtml)
    };
    yearTable.onmouseout = function(){
        this.className = "yr_normal";
        me.popwin.style.display = "none"
    };
    var year_sel = yearTable.getElementsByTagName("td");
    year_sel[1].className = "cal_arrow";
    me.year_td = year_sel[0];
    year_sel[1].innerHTML = "<img src='http://img.baidu.com/hi/img/date/updown.gif'></img>";
    me.year_pre = ytd[0];
    me.year_nxt = ytd[how - 1];
    var roll = cal.$c("div");
    roll.className = "cal_roll";
    me.root.appendChild(roll);
    for (var i = 0; i < 13; i++) {
        var rd = cal.$c("div");
        roll.appendChild(rd);
        rd.className = "normal";
        rd.onmousemove = function(){
            this.className = "msover";
            this.blur()
        };
        rd.onmouseout = function(){
            this.className = "normal"
        };
        rd.onfocus = function(){
            this.blur()
        }
    }
    me.roller = roll;
    function chgYear(){
        if (this.className == "disable") 
            return false;
        var y = parseInt(me.curDate.getFullYear());
        var m = parseInt(me.curDate.getMonth());
        var deta = parseInt(this.getAttribute("act"));
        if (me.isSubCal || me.mthsel) {
            var date = new Date(y, m + deta, 1);
            me.setDate(date.getFullYear(), date.getMonth(), 1)
        }
        else 
            me.setDate(y + deta);
        me.update()
    };
    function selectYear(){
        me.setType("Y");
        me.setStart(me.curDate.getFullYear(), 0, 1);
        me.setEnd(me.curDate.getFullYear(), 11, 31);
        me.update()
    };
    ydiv.className = "cal_yr";
    ytb.align = "center"
};
cal.prototype.addRanger = function(){
    var me = this;
    var rtb = [], rtr = [], rtd = [];
    var rngr = $c("div");
    if (me.root) 
        me.root.appendChild(rngr);
    else 
        document.body.appendChild(rngr);
    rtb = $c("table");
    rngr.appendChild(rtb);
    rtr[0] = rtb.insertRow(-1);
    for (var i = 0; i < 3; i++) {
        rtd[i] = $c("td");
        rtr[0].appendChild(rtd[i]);
        if (i != 1) 
            rtd[i].style.cursor = "pointer";
        if (i != 1) 
            rtd[i].onmouseover = me.msover;
        if (i != 1) 
            rtd[i].onmouseout = me.msout
    }
    var y = me.curDate.getFullYear();
    rtd[0].innerHTML = me.prerng;
    rtd[0].setAttribute("act", "-1");
    rtd[1].innerHTML = me.rngtxt[me.type || "U"];
    rtd[2].innerHTML = me.nxtrng;
    rtd[2].setAttribute("act", "+1");
    rtd[0].onclick = chgRange;
    rtd[2].onclick = chgRange;
    me.rng_td = rtd[1];
    function chgRange(){
        var pos = this.getAttribute("act");
        me.setRange(null, pos)
    };
    rngr.className = "cal_rng";
    rtb.align = "center"
};
cal.prototype.addPop = function(x, y, shtml){
    var me = this;
    var root = me.root;
    if (!me.popwin) {
        var main = cal.$c("div");
        var arrow = cal.$c("div");
        var content = cal.$c("div");
        main.className = "cal_pop";
        arrow.className = "cal_pp_arw";
        content.className = "cal_pp_cnt";
        if (document.all) 
            main.style.width = "90px";
        root.appendChild(main);
        main.appendChild(arrow);
        main.appendChild(content);
        arrow.innerHTML = "&nbsp;";
        me.popwin = main
    }
    else {
        var ppw = me.popwin;
        var ppcnt = ppw.childNodes[1];
        ppw.style.display = "block";
        ppw.style.left = x + "px";
        ppw.style.top = y + "px";
        ppcnt.innerHTML = shtml
    }
};
cal.prototype.msover = function(obj){
    var me = this;
    var pos = cal.getPos(obj);
    var x = pos[0];
    var y = pos[1] + obj.offsetHeight + 3;
    var shtml = "";
    try {
        var date = cal.toDateString(obj);
        var arts = me.activeUpdates[date][0];
        var pics = me.activeUpdates[date][1];
        if (arts > 0) 
            shtml += "发表文章 <b>" + arts + "</b>篇<br>";
        if (pics > 0) 
            shtml += "上传照片 <b>" + pics + "</b>张";
        me.addPop(x, y, shtml);
        cal.adjustPos(me.popwin)
    } 
    catch (x) {
    }
    if (obj.className && obj.className != "cal_date") 
        obj.setAttribute("classBack", obj.className);
    obj.className = "cal_select";
    window.status = obj.getAttribute("year") + "," + obj.getAttribute("month") + "," + obj.getAttribute("day")
};
cal.prototype.msout = function(obj){
    var me = this;
    me.popwin.style.display = "none";
    obj.className = obj.getAttribute("classBack");
    window.status = obj.getAttribute("classBack")
};
cal.prototype.setDate = function(y, m, d){
    var me = this;
    var cur = new Date();
    if (typeof(y) == "object" && !m && !d) 
        cur = new Date(y.getFullYear(), y.getMonth(), y.getDate());
    else {
        if (me.curDate) 
            cur = me.curDate;
        y = y || cur.getFullYear();
        if (!m && m != 0) 
            m = cur.getMonth();
        if (!d && d != 0) 
            d = d || cur.getDate();
        cur = new Date(y, m, d)
    }
    me.curDate = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
    me.curYear = cur.getFullYear();
    me.curMonth = cur.getMonth();
    me.curDay = cur.getDate();
    me.selectDate = cur.getFullYear() + "-" + cal.to2wei(parseInt(cur.getMonth()) + 1) + "-" + cal.to2wei(cur.getDate())
};
cal.prototype.setStart = function(y, m, d){
    var me = this;
    var rs = new Date();
    if (typeof(y) == "object") {
        try {
            m = y.getAttribute("month");
            d = y.getAttribute("day");
            y = y.getAttribute("year")
        } 
        catch (ex) {
            m = y.getMonth();
            d = y.getDate();
            y = y.getFullYear()
        }
    }
    else 
        if (!y) {
            me.range.start = null;
            return false
        }
    rs = new Date(y, m, d);
    me.range.start = rs;
    me.start = rs.getFullYear() + "-" + cal.to2wei(parseInt(rs.getMonth()) + 1) + "-" + cal.to2wei(rs.getDate())
};
cal.prototype.setEnd = function(y, m, d){
    var me = this;
    var re = new Date();
    if (typeof(y) == "object") {
        try {
            m = y.getAttribute("month");
            d = y.getAttribute("day");
            y = y.getAttribute("year")
        } 
        catch (ex) {
            m = y.getMonth();
            d = y.getDate();
            y = y.getFullYear()
        }
    }
    else 
        if (!y) {
            me.range.end = null;
            return false
        }
    re = new Date(y, m, d);
    me.range.end = re;
    me.setDate(re);
    me.end = re.getFullYear() + "-" + cal.to2wei(parseInt(re.getMonth()) + 1) + "-" + cal.to2wei(re.getDate())
};
cal.prototype.setType = function(str){
    var me = this;
    me.type = str
};
cal.prototype.setRange = function(type, pos){
    var me = this;
    type = type ? type : me.type;
    pos = pos ? pos : me.pos;
    var deta = parseInt(pos);
    var start = me.range.start;
    var end = me.range.end;
    var dist = new Date(end - start + 86400000);
    var y, m, d;
    switch (type) {
        case "D":
            y = start.getFullYear();
            m = start.getMonth();
            d = start.getDate() + deta;
            start = new Date(y, m, d);
            end = new Date(y, m, d);
            break;
        case "M":
            y = start.getFullYear();
            m = parseInt(start.getMonth()) + deta;
            d = me.countMonth(y, m);
            ;            start = new Date(y, m, 1);
            end = new Date(y, m, d);
            break;
        case "U":
            start = new Date(start.getTime() + dist * deta);
            end = new Date(end.getTime() + dist * deta);
            break;
        case "W":
            y = start.getFullYear();
            m = start.getMonth();
            d = start.getDate() + deta * 7;
            start = new Date(y, m, d);
            y = end.getFullYear();
            m = end.getMonth();
            d = end.getDate() + deta * 7;
            end = new Date(y, m, d);
            break;
        case "Y":
            y = parseInt(start.getFullYear()) + deta;
            start = new Date(y, 0, 1);
            end = new Date(y, 11, 31);
            break
    }
    me.setStart(start);
    me.setEnd(end);
    me.update()
};
cal.prototype.subCtrl = function(obj){
};
cal.prototype.sel = function(obj){
    var me = this;
    obj.className = "cal_select";
    var y = obj.getAttribute("year");
    var m = parseInt(obj.getAttribute("month")) + 1;
    var d = obj.getAttribute("day")
};
cal.prototype.closeSub = function(){
    var me = this;
    if (me.subwin) {
        var sw = me.subwin;
        sw.style.visibility = "hidden"
    }
};
cal.prototype.roll = function(obj, type){
    var me = this;
    var rl = me.roller;
    rl.onmousemove = function(){
        me.inMe = 1
    };
    rl.onmouseout = function(){
        me.inMe = 0
    };
    try {
        document.attachEvent("onmousedown", bodyClick)
    } 
    catch (ex) {
        document.addEventListener("mousedown", bodyClick, false)
    }
    function bodyClick(){
        if (me.inMe == 0) 
            rl.style.display = "none"
    };
    var rldivs = rl.childNodes;
    var pos = cal.getPos(obj);
    rl.style.display = "block";
    rl.style.left = pos[0] + "px";
    if (type == "year") {
        var up = rldivs[0];
        var down = rldivs[rldivs.length - 1];
        var rollTop = "0px";
        up.className = "yr_up";
        down.className = "yr_down";
        up.innerHTML = "<img src='http://img.baidu.com/hi/img/date/up.gif' style='margin:3px 0 5px 0'></img>";
        down.innerHTML = "<img src='http://img.baidu.com/hi/img/date/down.gif' style='margin:5px 0 3px 0'></img>";
        rldivs[rldivs.length - 1].style.display = "block";
        for (var i = 1; i <= 12; i++) {
            rldivs[i].setAttribute("value", me.curYear - 6 + i);
            rldivs[i].onclick = function(){
                var y = this.getAttribute("value");
                me.setDate(y);
                me.update()
            }
        }
        refresh();
        up.onclick = null;
        down.onclick = null;
        var timer = null;
        function stopTimer(){
            clearInterval(timer)
        };
        up.onmousedown = function(){
            refresh(-1);
            timer = setInterval(function(){
                refresh(-1)
            }, 100)
        };
        down.onmousedown = function(){
            refresh(1);
            timer = setInterval(function(){
                refresh(1)
            }, 100)
        };
        try {
            rl.attachEvent("onmouseout", stopTimer)
        } 
        catch (ex) {
            rl.addEventListener("mouseout", stopTimer, false)
        }
        up.onmouseup = stopTimer;
        down.onmouseup = stopTimer
    }
    else {
        rldivs[0].onmousedown = null;
        rldivs[rldivs.length - 1].style.display = "none";
        for (var i = 0; i < 12; i++) {
            var value = parseInt(me.curMonth);
            value = 1 + i;
            if (value <= 0) 
                value += 12;
            if (value > 12) 
                value -= 12;
            if (value - 1 == me.curMonth) 
                rldivs[i].style.fontWeight = "bold";
            else 
                rldivs[i].style.fontWeight = "normal";
            rldivs[i].setAttribute("value", value - 1);
            rldivs[i].innerHTML = me.mthtxt[value - 1] + me.month;
            rldivs[i].onclick = function(){
                var m = this.getAttribute("value");
                me.setDate(me.curYear, m);
                me.update()
            }
        }
    }
    var wth = obj.offsetWidth;
    wth = wth < 50 ? 50 : wth;
    rl.style.width = wth + "px";
    if (type == "year") 
        rollTop = pos[1] - rl.offsetHeight / 2 + obj.offsetHeight / 2 + "px";
    else 
        rollTop = pos[1] - rl.offsetHeight / 2 + obj.offsetHeight / 2 + 10 + "px";
    rl.style.top = rollTop;
    cal.adjustPos(rl);
    function refresh(delta){
        if (!delta) 
            delta = 0;
        for (var ii = 1; ii < 12; ii++) {
            var v = parseInt(rldivs[ii].getAttribute("value"));
            v = v + delta;
            if (v == me.curYear) 
                rldivs[ii].style.fontWeight = "bold";
            else 
                rldivs[ii].style.fontWeight = "normal";
            rldivs[ii].setAttribute("value", v);
            rldivs[ii].innerHTML = v + me.year
        }
    }
};
cal.prototype.processActiveDates = function(){
    var me = this;
    var dates = null;
    for (var s in me.activeUpdates) {
        dates += s
    }
    dates = dates.replace(/(\D)(\d)(\D)/ig, "$10$2$3");
    me.activeDates = dates
};
cal.prototype.isDateActive = function(y, m, d){
    var me = this;
    me.processActiveDates();
    var dates = me.activeDates;
    var target = y + "-" + cal.to2wei(parseInt(m) + 1) + "-" + cal.to2wei(d);
    if (dates.indexOf(target) >= 0) 
        return true;
    else 
        return false
};
cal.prototype.markActive = function(){
    var me = this;
    var td = me.td;
    for (var i = 0; i < td.length && td[i].parentNode.style.display != "none"; i++) {
        if (me.isDateActive(td[i].getAttribute("year"), td[i].getAttribute("month"), td[i].getAttribute("day"))) {
            if (td[i].className.indexOf("today") >= 0) 
                td[i].className = "today cal_active";
            else 
                td[i].className = "cal_active";
            td[i].style.cursor = "pointer";
            td[i].onmouseover = function(){
                me.msover(this)
            };
            td[i].onmouseout = function(){
                me.msout(this)
            };
            td[i].onclick = function(e){
                this.className = this.getAttribute("classBack");
                var y = this.getAttribute("year");
                var m = this.getAttribute("month");
                var d = this.getAttribute("day");
                me.setDate(y, m, d);
                me.onselect()
            }
        }
        else {
            td[i].style.cursor = "default";
            td[i].onmouseover = null;
            td[i].onmouseout = null;
            td[i].onclick = null
        }
    }
};
cal.prototype.makeStartEnd = function(){
    var me = this;
    var str = "";
    var cur = me.curDate;
    var y = cur.getFullYear();
    var m = cur.getMonth();
    me.curStart = y + "-" + cal.to2wei(parseInt(m) + 1) + "-" + cal.to2wei(1);
    me.curEnd = y + "-" + cal.to2wei(parseInt(m) + 1) + "-" + cal.to2wei(me.countMonth(y, m))
};
cal.getPos = function(obj){
    var Y = 0, X = 0;
    for (obj; obj && obj.offsetParent.tagName != "BODY"; obj = obj.offsetParent) {
        Y += obj.offsetTop || 0;
        X += obj.offsetLeft || 0
    }
    return [X, Y]
};
cal.prototype.clearSel = function(){
};
cal.prototype.debug = function(obj, m, d){
    if (typeof(obj) != "object") {
        me.debuger.innerHTML += obj + "-";
        me.debuger.innerHTML += parseInt(m) + 1 + "-";
        me.debuger.innerHTML += d + "<br>"
    }
    else {
        me.debuger.innerHTML += obj.getAttribute("year") + "-";
        me.debuger.innerHTML += parseInt(obj.getAttribute("month")) + 1 + "-";
        me.debuger.innerHTML += obj.getAttribute("day") + "<br>"
    }
};
cal.to2wei = function(num){
    num = parseInt(num);
    if (num < 10) 
        num = "0" + num.toString();
    return num
};
cal.toDateString = function(ele){
    var str = "";
    str = ele.getAttribute("year") + "-" + cal.to2wei(parseInt(ele.getAttribute("month")) + 1) + "-" + cal.to2wei(ele.getAttribute("day"));
    return str
};
cal.toDateStr = function(obj){
    var str = "";
    str = obj.getFullYear() + "-" + cal.to2wei(parseInt(obj.getMonth()) + 1) + "-" + cal.to2wei(obj.getDate());
    return str
};
cal.adjustPos = function(obj){
    var w = obj.offsetWidth, bow = window.innerWidth || document.body.offsetWidth;
    var h = obj.offsetHeight, boh = window.innerHeight || document.body.offsetHeight;
    var st = document.body.scrollTop;
    var sw = document.body.scrollWidth;
    var sl = document.body.scrollLeft;
    var pos = cal.getPos(obj);
    var x = pos[0], y = pos[1];
    if (y < st) {
        obj.style.top = st + "px"
    }
    if ((x + w) > (bow + sl)) {
        obj.style.left = (bow + sl - w - 20) + "px"
    }
};
cal.createTable = function(rows, cols){
    var table = cal.$c("table");
    var tr = [], td = [];
    for (var i = 0; i < rows; i++) {
        tr[i] = table.insertRow(-1);
        for (var j = 0; j < cols; j++) {
            td[j] = cal.$c("td");
            tr[i].appendChild(td[j])
        }
    }
    return table
};
cal.$c = function(str){
    return document.createElement(str)
};
function $c(str){
    return document.createElement(str)
};
