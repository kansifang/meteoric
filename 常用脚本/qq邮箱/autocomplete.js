var QQMail = {
    Version: '4.0.0',
    
    Create: function(){
        return function(){
            this.Constructor.apply(this, arguments);
        }
    }
};

Function.prototype.Bind = function(ask){
    var aa = this, ua = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        ua[i - 1] = arguments[i];
    }
    return function(e){
        e && e.view && e.target ? e.view.event = e : 0;
        return aa.apply(ask, !ua.length ? arguments : ua);
    }
};

QQMail.AutoComplete = QQMail.Create();
QQMail.AutoComplete.prototype = {
Constructor: function(){
        this.Bq = false;
        this.vU = null;
        this.cp = null;
        this.hS = null;
        this.hJ = null;
        this.KA = "";
        this.eP = -1;
        this.sI = [];
        this.vF = false;
        this.Kp = false;
        this.KI = new Object;
        this.KK = new Object;
        this.KD = false;
        this.anb = null;
        this.Ky = null;
        this.aJN = 8;
    },
    
    Init: function(me, ase, asg, aoJ, aGr, aGq, aja, aGO, aKa, tH, anO){
        this.vF = false;
        this.Kp = false;
        this.hJ = me;
        this.vU = ase;
        this.hS = asg;
        this.KD = aGr;
        this.anb = aGq;
        this.Ky = aGO;
        this.asl = tH || me;
        this.ama = anO;
        if (aoJ) {
            this.Gu();
        }
        try {
            var aa = this;
            me.onfocus = this.aBm.Bind(this);
            me.onblur = this.aAz.Bind(this);
            me.onkeydown = this.IL.Bind(this);
            me.onkeyup = this.adU.Bind(this);
            me.onkeypress = this.aAG.Bind(this);
            me.autocomplete = "off";
            this.KI = me.value;
            this.KK = me.style.cssText;
            if (aja != null) {
                aja.onclick = this.aAY.Bind(this);
            }
        } 
        catch (e) {
            doPageError(e.description);
        }
    },
    Gu: function(){
    
        var CZ = this.hS.contentWindow.document;
        if (!CZ.getElementById("AutoCompleteTable")) {
            CZ.open();
            CZ.writeln(T(['<html>', '<head>', '<style type="text/css">', 'body,div,td {font:normal 12px tahoma;padding:0;margin:0;background:#fff;}', 'p {margin:0;padding:0;}', 'object p {margin:0;padding:0;}', '.table_log {font-size:12px;font-family:tahoma;color:#000;border:1px solid #fff;}', '.frtd {height:21px;line-height:21px;padding-left:4px}', '.frtd_on {height:21px;line-height:21px;padding-left:4px;background:#3470cc;color:#fff;}', '</style>', '</head>', '<body unselectable="on">', '<div style="position:absolute;width:100%;" unselectable="on" >', '<table id="AutoCompleteTable" border="0" cellspacing="0" cellpadding="0" style="cursor:hand" class="table_log" unselectable="on" onmousedown="return false;"></table>', '</div>', '</body>', '</html>']));
            CZ.close();
        }
        
        this.hS.Lo = true;
    },
    GetTargetTextCtrl: function(){
        return this.hJ;
    },
    
    
    
    
    
    
    aDf: function(aiY){
        var oK = aiY;
        var fx = oK.offsetTop;
        var fw = oK.offsetLeft;
        var aW = oK.offsetWidth;
        
        while (oK = oK.offsetParent) {
            fx += oK.offsetTop;
            fw += oK.offsetLeft;
        }
        
        this.hS.style.left = this.Ky != null ? (fw + aW - parseInt(this.hS.style.width) + parseInt(this.Ky)) : (fw - 1);
        this.hS.style.top = fx + aiY.offsetHeight + 1;
    },
    
    
    
    
    ShowAC: function(){
        if (this.cp.rows.length == 0) {
            return;
        }
        
        if (this.eP == -1) {
            this.eP = 0;
            this.cp.rows[this.eP].cells[0].className = "frtd_on";
        }
        
        this.hS.style.display = "";
        
        if (this.cp.offsetHeight > 354) {
            this.hS.style.height = 354;
            this.hS.style.width = this.cp.offsetWidth +
            19;
        }
        else {
            this.hS.style.height = this.cp.offsetHeight;
            this.hS.style.width = this.cp.offsetWidth;
        }
        
        
        this.aDf(this.asl);
        this.Bq = true;
    },
    
    
    
    
    CloseAC: function(){
        if (this.eP != -1 && this.cp) {
            this.cp.rows[this.eP].cells[0].className = "frtd";
        }
        this.hS.style.display = "none";
        
        this.eP = -1;
        this.Bq = false;
    },
    
    
    
    
    
    IsShowAC: function(){
        return this.Bq;
    },
    
    
    
    
    aBm: function(){
        this.amQ = true;
        
        if (!this.hS.Lo) {
            this.Gu();
        }
        
        if (this.KD &&
        this.hJ.value == this.KI) {
            this.hJ.value = "";
            this.hJ.style.cssText = this.anb ||
            this.KK;
        }
    },
    
    
    
    
    aAz: function(){
        this.vF = false;
        this.Kp = false;
        this.amQ = false;
        
        var aa = this;
        setTimeout(function(){
            if (aa.amQ) {
                return;
            }
            
            aa.CloseAC();
            if (aa.KD &&
            aa.hJ.value == "") {
                aa.hJ.value = aa.KI;
                aa.hJ.style.cssText = aa.KK;
            }
        }, 10);
    },
    
    
    
    
    
    alT: function(fk){
        var xM = this.cp.rows.length;
        this.cp.rows[this.eP].cells[0].className = "frtd";
        this.eP = (this.eP + fk + xM) % xM;
        this.cp.rows[this.eP].cells[0].className = "frtd_on";
        this.cp.rows[this.eP].cells[0].scrollIntoView(false);
    },
    
    
    
    
    aAG: function(){
        var gH = {};
        for (var i in window.event) {
            try {
                gH[i] = window.event[i];
            } 
            catch (e) {
            }
        }
        aa = this;
        setTimeout(function(){
            aa.adU(gH);
        }, 0);
    },
    
    
    
    
    IL: function(){
        this.vF = true;
        
        if (!this.Bq) {
            return;
        }
        var cj = window.event.keyCode;
        switch (cj) {
            case 27:
                this.CloseAC();
                window.event.returnValue = false;
                return;case 38:
                this.alT(-1);
                break;
            case 40:
                this.alT(1);
                break;
        }
    },
    
    
    
    
    
    adU: function(ag){
        ag = ag || window.event;
        if (ag.ctrlKey) {
            return;
        }
        var cj = ag.keyCode;
        if (!this.hS.Lo) {
            this.Gu();
        }
        try {
            this.cp = this.cp ||
            this.vU.document.getElementById("AutoCompleteTable");
        } 
        catch (e) {
        }
        if (!this.cp) {
            return;
        }
        
        var aa = this;
        this.vU.onmousedown = function(){
            setTimeout(function(){
                aa.hJ.focus();
            });
        };
        
        var AZ = this.aDS();
        switch (cj) {
            case 32:
                this.Rz((AZ == "") ? " " : AZ);
                this.ShowAC();
                
                
                break;
            case 13:
                if (this.Bq) {
                    this.Xh();
                    ag.returnValue = false;
                }
                break;
            case 27:
            case 38:
            case 40:
                break;
            default:
                if (AZ.length == 0) {
                    this.CloseAC();
                }
                else {
                    this.Rz(AZ);
                }
                break;
        }
    },
    
    
    
    
    
    
    aCP: function(SY){
        var av = this.sI[SY];
        return T('"$nick$"<$addr$>').replace({
            nick: encodeNick(htmlDecode(av.name)),
            addr: htmlDecode(av.email)
        });
    },
    
    
    
    
    aEY: function(){
        if (this.Kp || this.GetTargetTextCtrl() == null) {
            return;
        }
        if (this.vF == true) {
            this.vF = false;
            return;
        }
    },
    
    
    
    
    Xh: function(){
        if (this.eP == -1) {
            return;
        }
        
        this.vF = false;
        
        var db = this.cp.rows[this.eP].value;
        var abn = this.aCP(db);
        
        this.CloseAC();
        
        if (typeof this.ama != "function") {
        
            var sq = this.hJ.value;
            var Ac = this.afd(sq) + 1;
            var ub = "";
            var TC = this.GetTargetTextCtrl();
            if (TC == this.hJ) {
                ub = sq.substr(0, Ac) +
                (Ac > 0 ? " " : "");
            }
            else {
                ub = trim(TC.value);
                if (ub != "") {
                    ub += ub.substr(ub.length - 1, 1) != ";" ? "; " : " ";
                }
                this.hJ.value = "";
            }
            
            TC.value = [ub, abn, "; "].join("");
            this.hJ.focus();
            this.aEY();
        }
        else {
            this.ama.call(this, abn);
        }
    },
    
    
    
    
    aDS: function(){
        var sq = this.hJ.value;
        var Ac = this.afd(sq);
        if (Ac != -1) {
            sq = sq.substr(Ac + 1)
        }
        return trim(sq);
    },
    
    
    
    
    
    afd: function(aiJ){
        var db = aiJ.lastIndexOf(';');
        return (db > -1) ? db : aiJ.lastIndexOf(',');
    },
    
    
    
    
    aIB: function(){
        if (this.cp) {
            for (var ad = this.cp.rows.length - 1; ad > -1; ad--) {
                this.cp.deleteRow(ad);
            }
        }
        this.eP = -1;
    },
    
    
    
    
    
    aDz: function(jf){
        if (!this.sI) {
            return;
        }
        this.cp.onmouseover = this.adV.Bind(this);
        this.cp.onclick = this.adX.Bind(this);
        this.cp.onmousedown = this.adW.Bind(this);
        
        
        var Bv;
        var UJ = 0;
        for (var ad = 0, ap = this.sI.length; ad < ap; ad++) {
            if (Bv = this.afj(ad, jf)) {
                this.aCT(ad, UJ++, Bv);
            }
        }
    },
    
    
    
    
    
    
    
    aCT: function(arA, ake, dj){
        var Zg = this.cp.insertRow(ake);
        Zg.value = arA;
        var fu = Zg.insertCell(0);
        fu.className = "frtd";
        fu.noWrap = true;
        fu.value = ake;
        fu.unselectable = "on";
        fu.innerHTML = dj;
    },
    
    
    
    
    
    aDA: function(jf){
        if (this.eP >= 0) {
            this.cp.rows[this.eP].cells[0].className = "frtd";
            this.eP = -1;
        }
        
        var Mz = [];
        var Bv;
        var UJ = 0;
        for (var ad = 0, ap = this.cp.rows.length; ad < ap; ad++) {
            var db = this.cp.rows[ad].value;
            if (Bv = this.afj(db, jf)) {
                var fu = this.cp.rows[ad].cells[0];
                fu.innerHTML = Bv;
                fu.value = UJ++;
            }
            else {
                Mz.push(ad);
            }
        }
        for (var ad = Mz.length - 1; ad >= 0; ad--) {
            this.cp.deleteRow(Mz[ad]);
        }
    },
    
    
    
    
    aEw: function(){
        if (this.cp) {
            this.cp.onmouseover = this.adV.Bind(this);
            this.cp.onclick = this.adX.Bind(this);
            this.cp.onmousedown = this.adW.Bind(this);
        }
        return;
    },
    
    
    
    
    
    Rz: function(jf){
        var Im = trim(jf.toLowerCase());
        this.aEw();
        
        
        
        
        
        this.sI = this.GetAddrList();
        if (this.sI.length > 0) {
            if (this.KA != "" &&
            Im.indexOf(this.KA) == 0) {
                this.aDA(Im);
            }
            else {
                this.aIB();
                this.aDz(Im);
            }
            if (this.sI) {
                this.KA = Im;
            }
            (this.cp.rows.length == 0) ? this.CloseAC() : this.ShowAC();
        }
        else {
            this.CloseAC();
        }
    },
    
    getAddrList: function(){
    
        alert("内部错误，请实例化这个类并重载这个函数！");
        return new Object();
    },
    
    
    
    
    
    
    
    afj: function(fr, jf){
        var AZ = jf.toLowerCase(), Ht = this.sI[fr], sb = [htmlDecode(Ht.name), Ht.email, Ht.pinyin, Ht.searchdata], avl = sb.length, hL = new RegExp(["(", jf, ")"].join(""), 'i');
        
        for (var ad = 0; ad < avl; ad++) {
            if (sb[ad] && hL.test(sb[ad])) {
            
                sb[ad] = sb[ad].replace(hL, "<b>$1</b>");
                return ["\"" + sb[0] + "\" &lt;" + sb[1] + "&gt;"].join("");
            }
        }
        return "";
    },
    
    
    
    
    adV: function(){
        var bD = this.vU.event;
        var fu = bD.srcElement || bD.target;
        if (fu.tagName != "TD") {
            return;
        }
        var bK = fu.value;
        if (this.eP != bK) {
            if (this.eP > -1) {
                this.cp.rows[this.eP].cells[0].className = "frtd";
            }
            this.eP = bK;
            this.cp.rows[this.eP].cells[0].className = "frtd_on";
        }
    },
    
    
    
    
    adX: function(){
        this.Xh();
    },
    
    
    
    
    
    adW: function(){
        return false;
    },
    
    
    
    
    aAY: function(){
        this.hJ.focus();
        if (!this.hS.Lo) {
            this.Gu();
        }
        try {
            this.cp = this.cp ||
            this.vU.document.getElementById("AutoCompleteTable");
        } 
        catch (e) {
        }
        if (!this.cp) {
            return;
        }
        
        var aa = this;
        this.vU.onmousedown = function(){
            setTimeout(function(){
                aa.hJ.focus();
            });
        };
        
        this.Rz(" ");
        this.ShowAC();
    }
    
};

QQMail.AutoCompleteAllAddr = QQMail.Create();
QQMail.AutoCompleteAllAddr.prototype = extend((new QQMail.AutoComplete()), {
    GetAddrList: function(){
    
    
    
        if (typeof top.QMAddress != "undefined") {
            return top.QMAddress.getAutoAddrList();
        }
        else {
            return [];
        }
    }
});

QQMail.AutoCompleteQQFriend = QQMail.Create();
QQMail.AutoCompleteQQFriend.prototype = extend((new QQMail.AutoComplete()), {
    GetAddrList: function(){
    
    
        return null;
    }
});
