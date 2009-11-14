















var QMLinkman = {

    fT: null,
    
    xL: null,
    
    
    
    
    gI: "uninit",
    
    axV: function(){
        var cd = location.getParams();
        var abL = cd["ifid"];
        var pQ = top;
        if (abL) {
            var ci = abL.split(",");
            for (var ad = 0, ap = ci.length; ad < ap; ad++) {
                pQ = top.F(ci[ad], pQ);
            }
        }
        if (!pQ || !pQ.document) {
            top.closeDialog();
            return null;
        }
        this.fT = pQ;
        this.xL = cd["textid"];
    },
    
    init: function(aFU, aGP){
        if (this.gI == "init") {
            this.UI.Left.adl();
            return;
        }
        this.axV();
        if (this.fT && this.xL) {
            this.Kernel.gW(0);
            this.UI.gW(this.Kernel, top.S(aFU, window), top.S(aGP, window), document);
        }
        this.gI = "init";
    },
    
    
    initQuickAddr: function(ae){
        if (this.gI == "init") {
            this.UI.Left.adl();
            return;
        }
        this.Kernel.gW(1);
        this.UI.gW(this.Kernel, top.S(ae, window), null, document);
        this.gI = "init";
    },
    
    
    alertText: function(){
        var md = {
            "to": "收件人",
            "cc": "抄送",
            "bcc": "密送",
            "sc": "分别发送"
        };
        top.S("text_name", window).innerHTML = md[this.xL];
    },
    
    addAddress: function(){
        var iY = this.UI.Right.RE();
        if (this.gI == "init") {
            var cH = top.T('"$nick$"<$addr$>; ');
            var cR = [];
            var oc = QMLinkman.Kernel.Cy;
            for (var ad = iY.length - 1; ad >= 0; --ad) {
                var bJ = oc[iY[ad]] || top.QMAddress.getAddress(iY[ad]);
                if (bJ.name) {
                    cR.push(cH.replace({
                        nick: top.encodeNick(top.htmlDecode(bJ.name)),
                        addr: bJ.email
                    }));
                }
                else {
                    cR.push(bJ.email.replace(/\\?\"/g, "\\\"") + "; ");
                }
            }
            
            if (typeof this.fT.qmAddrInput != "undefined") {
                var ES = this.fT.qmAddrInput.get(this.xL, this.fT);
                ES.clear();
                ES.add(cR.join(""));
            }
        }
        this.closeDialog();
    },
    
    sendReaderInvitation: function(){
        var iY = this.UI.Right.RE();
        if (this.gI == "init") {
            var cH = top.T('"$nick$"<$addr$>');
            var cR = [];
            var oc = QMLinkman.Kernel.Cy;
            for (var ad = iY.length - 1; ad >= 0; --ad) {
                var bJ = oc[iY[ad]] || top.QMAddress.getAddress(iY[ad]);
                if (bJ.name) {
                    cR.push(cH.replace({
                        nick: top.encodeNick(top.htmlDecode(bJ.name)),
                        addr: bJ.email
                    }));
                }
                else {
                    cR.push(bJ.email.replace(/\\?\"/g, "\\\"") + "; ");
                }
            }
            
            if (cR.length > 0) {
                var Pm = top.T("/cgi-bin/reader_invite_mail?sid=$sid$&feedid=$feedid$&itemid=$itemid$&friends=$friends$");
                var ak = Pm.replace({
                    sid: top.getSid(),
                    feedid: top.getMainWin().Reader.Runtime.feedId,
                    itemid: top.getMainWin().Reader.Runtime.articleId,
                    friends: cR.join(";")
                });
                
                top.debug(ak);
                top.getActionWin().location.replace(ak);
            }
        }
        this.closeDialog();
    },
    
    
    closeDialog: function(){
    
    
    
        top.closeDialog();
    }
}

QMLinkman.Kernel = {
    KU: ["mailgroup", "domaingroup", "qqgroup"],
    
    tZ: {},
    
    Cy: {},
    
    KW: [],
    
    
    
    
    eO: 0,
    
    gW: function(cI){
        this.eO = cI;
        if (this.eO == 0) {
            this.aCf(this.aCU());
        }
    },
    
    
    aCU: function(){
        if (typeof QMLinkman.fT.qmAddrInput != "undefined") {
            var ES = QMLinkman.fT.qmAddrInput.get(QMLinkman.xL, QMLinkman.fT);
            return ES.get("json");
        }
        return [];
    },
    
    aCf: function(NS){
    
        var iY = {};
        var tO = 0;
        var qL = top.QMAddress.getAllAddressObj();
        for (var BO in qL) {
            var bJ = qL[BO];
            if (tO < bJ.id) {
                tO = bJ.id;
            }
        }
        tO = parseInt(tO) + 1;
        for (var ad = 0, ap = NS.length; ad < ap; ad++) {
            var fC = NS[ad].addr;
            var bZ = NS[ad].nick;
            var bJ = top.QMAddress.getAddress(fC);
            if (bJ) {
                this.tZ[fC] = 1;
                this.KW.push(bJ.id);
            }
            else {
            
                var aEi = {
                    id: tO,
                    pinyin: bZ,
                    email: fC,
                    name: bZ,
                    qq: -1
                };
                this.KW.push(tO);
                this.Cy[tO++] = aEi;
            }
        }
    },
    
    aBJ: function(){
        var iY = {};
        var fe = 0;
        for (var ad = this.KU.length - 1; ad >= 0; ad--) {
        
            var JK = top.QMAddress.getGroup(this.KU[ad]).groupsId;
            if (!JK) {
                continue;
            }
            for (var bO = JK.length - 1; bO >= 0; bO--) {
                var Kd = top.QMAddress.getGroup(JK[bO]).addressesId;
                for (var mP = Kd.length - 1; mP >= 0; mP--) {
                    if (typeof iY[Kd[mP]] == "undefined") {
                        iY[Kd[mP]] = 1;
                        fe++;
                    }
                }
            }
        }
        return fe;
    },
    
    
    aEt: function(){
        try {
            var Zw = S("hitaddrbook");
            Zw.value = parseInt(Zw.value, 10) + 1;
        } 
        catch (e) {
        }
    },
    
    apU: function(Bb){
        var bJ = top.QMAddress.getAddress(Bb);
        
        AddAddr(top.T('"$nick$"<$addr$>; ').replace({
            nick: top.encodeNick(top.htmlDecode(bJ.name)),
            addr: bJ.email
        }));
        this.aEt();
    }
}

QMLinkman.UI = {
    bC: null,
    
    gW: function(nS, aiS, aiO, jd){
        this.bC = nS;
        if (aiS) {
            this.Left.gW(this, nS, aiS, jd);
        }
        if (aiO) {
            this.Right.gW(this, nS, aiO, jd);
        }
    },
    
    adC: function(Bb, aiH){
        switch (this.bC.eO) {
            case 0:
                if (aiH == "left") {
                    this.Right.Ev(Bb);
                }
                if (aiH == "right") {
                    this.Left.Ev(Bb);
                }
                break;
            case 1:
                this.bC.apU(Bb);
                break;
        }
    }
};

QMLinkman.aj = {
    ib: top.T('<div class="settingtable qqshowbd" style="border-top:0;border-left:0;border-right:0;padding:4px 8px 2px; margin:2px 0">$other$$title$</div>'),
    
    auE: top.T('<a href="javascript:\'\'" onclick="top.QMAddress.importqq();return false;" style="background:transparent;text-decoration:underline;float:right;width:25px!important;padding:0px;">$value$</a>'),
    
    aHo: top.T(['<div id="$id$"  class="list_div" style="$style$">', '<a title="$title$" onclick="$clickHandle$" class="lm_ca"><input id="$id$_b" type="button" class="showteam" value="$value$"/>$name$</a>', '</div>']),
    
    Wz: top.T('<div id="$id$" style="$style$">$content$</div>'),
    
    
    ajJ: top.T('<a href="javascript:void(0);" id="$id$" title="$title$" style="$style$" class="lm_addr" onmouseover="this.style.background=\'#FFEEC2\'" onmouseout="this.style.background=\'#FFF\'" onclick="$clickHandle$;return false">$beforeImage$$name$$afterImage$</a>'),
    
    aFx: top.T('<img name="qqplusimg" key="$uin$" addr="$email$" noevent=1 style="display:none;margin:4px 5px 0 -16px;"/>'),
    
    apZ: top.T('<img src="/zh_CN/htmledition/images/ico_qzone.gif" align="absmiddle" style="margin: 0 0 2px 6px;" title="向您的QQ号码@qzone.qq.com地址发信，就可以将信件内容发表到您的Qzone空间。"/>'),
    
    
    apx: top.T(['<div id="$id$" title="$title$" style="$style$" class="lm_addr2" onmouseover="this.style.background=\'#FFEEC2\'" onmouseout="this.style.background=\'#FFF\'" onclick="$clickHandle$">', '<div class="lm_nm">$name$</div>', '<div class="lm_ml">$email$</div>', '</div>']),
    
    apy: top.T(['<div id="$id$" title="$title$" style="$style$" class="lm_addr" onmouseover="this.style.background=\'#FFEEC2\'" onmouseout="this.style.background=\'#FFF\'" onclick="$clickHandle$">', '<div class="lm_nm2">$name$</div>', '<input type="button" id="$id$_btn" class="$btn_class$" onclick="$clickHandle$" value=""/>', '</div>']),
    
    apb: top.T(['<div id="searchbar" style="border-bottom:1px solid #ccc; padding: 7px 0pt 4px 3px; height: 22px;*height:30px;display:none;" class="">', '<div style="float: left;"><input type="text" autocomplete="off" style="border-right: medium none; margin: 0pt; padding-left: 3px; color: rgb(160, 160, 160);" class="txt" id="quicksearch" onkeyup="$keyupHanle$" onblur="$blurHandle$" onfocus="$focusHandle$" value="$defaultvalue$" onkeydown="top.stopPropagation(event);" onkeypress="top.stopPropagation(event);"/></div>', '<div style="float:left;*margin-top:1px"><input type="button" id="quicksearch_ico"/><input type="button" style="display: none;" id="quicksearch_ico1" onclick="$clickHandle$"/></div>', '</div>']),
    
    aJm: top.T(['<div id="normal_plane" style="display:none"></div>', '<div id="search_plane" style="display:none"></div>']),
    
    apf: top.T('<div style="padding:5px">查找到：</div>'),
    
    awQ: top.T('<div style="margin:4px 0 6px 17px;color:#797979">(暂无$message$)</div>')
};





QMLinkman.UI.Left = {

    fX: null,
    
    bC: null,
    
    ow: null,
    
    df: null,
    
    kL: null,
    
    
    amN: false,
    
    
    
    
    alP: 0,
    
    gW: function(vP, nS, TN, jd){
        this.fX = vP;
        this.bC = nS;
        this.ow = TN;
        this.df = jd;
        
        this.aDX();
        if (nS.eO == 1 && top.QQPlusUI) {
            var qL = top.QMAddress.getAllAddressObj();
            for (var BO in qL) {
                var bJ = qL[BO];
                top.QQPlusUI.PushAddrToUin(bJ.email, bJ.qq);
            }
        }
    },
    
    aDX: function(){
        var cH = QMLinkman.aj;
        var hp = this.fX;
        var cR = [];
        
        cR.push(cH.apb.replace({
            keyupHanle: "QMLinkman.UI.Left.keyupHanle(this)",
            clickHandle: "QMLinkman.UI.Left.changeMode(0)",
            blurHandle: "QMLinkman.UI.Left.blurHandle(this)",
            focusHandle: "QMLinkman.UI.Left.focusHandle(this)",
            defaultvalue: "查找联系人..."
        }));
        cR.push(cH.aJm.toString());
        this.ow.innerHTML = cR.join("");
        this.gb();
        
        this.btnclickHandle("1_3");
        
        var WQ = this.df.getElementById("totleNum");
        if (WQ) {
            WQ.innerHTML = ["(", this.bC.aBJ(), ")"].join("");
        }
    },
    
    gb: function(){
        var hp = this.fX;
        var bQ = this.bC;
        var cR = [];
        var ZT = bQ.KU;
        
        this.df.getElementById("searchbar").style.display = "";
        this.df.getElementById("normal_plane").style.display = "";
        
        var cH = QMLinkman.aj;
        
        
        var atq = ZT.length;
        for (var ad = 0; ad < atq; ad++) {
            var xS = top.QMAddress.getGroup(ZT[ad]);
            if (!xS.groupsId) {
                continue;
            }
            cR.push(cH.ib.replace({
                title: xS.name,
                
                other: (xS.name == "QQ好友" && bQ.eO == 1 ? cH.auE.replace({
                    value: "同步"
                }) : "")
            }));
            var wd = xS.groupsId;
            var atr = wd.length;
            for (var bO = 0; bO < atr; bO++) {
                var gl = top.QMAddress.getGroup(wd[bO]);
                var tR = [xS.id, gl.id].join("_");
                cR.push(cH.aHo.replace({
                    id: tR,
                    style: "display:",
                    value: "",
                    title: gl.name,
                    name: gl.name,
                    clickHandle: ["QMLinkman.UI.Left.btnclickHandle('", tR, "')"].join("")
                }));
                cR.push(cH.Wz.replace({
                    content: "loading...",
                    style: "display:none;",
                    id: [tR, "t"].join("_")
                }));
            }
        }
        var Zz = this.df.getElementById("normal_plane");
        
        if (Zz) {
            Zz.innerHTML = cR.join("");
            
        }
    },
    
    adl: function(){
    
        var aez = false;
        if (this.kL) {
            var cR = this.df.getElementById(this.kL + "_t");
            aez = cR && cR.style.display == "";
        }
        
        
        this.df.getElementById("normal_plane").innerHTML = "";
        this.gb();
        
        if (this.kL == null) {
        
            this.btnclickHandle("1_3");
        }
        else 
            if (aez) {
                var az = this.kL;
                var aJi = this.amN;
                this.kL = "";
                this.btnclickHandle(az);
                if (az == "1_3" && aJi) {
                    this.btnclickHandle("1_4");
                }
            }
    },
    
    aEW: function(Qq, en){
        var RJ = typeof Qq === "string" ? this.df.getElementById(Qq) : Qq;
        var Tk = RJ.cloneNode(false);
        Tk.innerHTML = en;
        RJ.parentNode.replaceChild(Tk, RJ);
        return Tk;
    },
    
    
    axd: function(jF){
        var hp = this.fX;
        var bQ = this.bC;
        var cP = [];
        var cH = QMLinkman.aj;
        var gl = top.QMAddress.getGroup(jF.split("_")[1]);
        var wd = gl.addressesId;
        for (var ad = 0, ap = wd.length; ad < ap; ad++) {
            var eH = top.QMAddress.getAddress(wd[ad]);
            var az = [jF, eH.id].join("_");
            var abh = "";
            var abb = "";
            if (bQ.eO == 1) {
            
                if (eH.email.indexOf("@qzone.qq.com") != -1) {
                    abb = hp.apZ;
                }
                else {
                    if (parseInt(eH.qq) > 10000 || eH.email.indexOf("@qq.com") != -1 || eH.email.indexOf("@vip.qq.com") != -1) {
                        abh = cH.aFx.replace({
                            uin: (parseInt(eH.qq) > 10000 ? eH.qq : eH.email.replace(/@.*/, "")),
                            email: eH.email
                        });
                    }
                }
            }
            
            cP.push(cH.ajJ.replace({
                title: eH.email,
                name: eH.name,
                id: az,
                beforeImage: abh,
                afterImage: abb,
                style: (bQ.tZ[eH.email] ? "display:none;" : "display:;"),
                clickHandle: ["QMLinkman.UI.Left.clickAddr(\'", az, "\')"].join("")
            }));
        }
        
        
        if (wd.length == 0) {
        
        
            cP.push(cH.awQ.replace({
                message: {
                    "常用联系人": "常用联系人",
                    "不常用联系人": "不常用联系人"
                }[top.QMAddress.getGroup(jF.split("_")[1]).name] ||
                "联系人"
            }));
        }
        
        if (typeof gl.child != "undefined") {
            var Zy = top.QMAddress.getGroup(gl.child);
            var az = [jF.split("_")[0], Zy.id].join("_");
            cP.push(cH.ajJ.replace({
                id: az,
                title: Zy.name,
                style: "display:;",
                name: "<b>" + gl.msg + "</b>",
                beforeImage: "",
                afterImage: "",
                clickHandle: ["QMLinkman.UI.Left.btnclickHandle('", az, "')"].join("")
            }));
            cP.push(cH.Wz.replace({
                content: "loading...",
                style: "display:none;",
                id: [az, "t"].join("_")
            }));
        }
        
        
        this.aEW(this.df.getElementById(jF + "_t"), cP.join(""));
        
        top.QQPlusUpdateStatus(window);
        return;
    },
    
    
    
    
    
    
    btnclickHandle: function(jF){
        var avw = jF + "_b";
        var kg = this.df.getElementById(avw);
        var aFQ = jF + "_t";
        var cR = this.df.getElementById(aFQ);
        if (cR) {
            var abD = jF.split("_");
            var gl = top.QMAddress.getGroup(abD[1]);
            if (jF == "1_4") {
                this.amN = cR.style.display != "";
            }
            if (cR.style.display == "") {
            
                if (kg) {
                    kg.className = "showteam";
                }
                cR.style.display = "none";
                
                if (typeof gl.child != "undefined") {
                    adG = [abD[0], gl.child].join("_");
                    var aR = this.df.getElementById(adG);
                    if (aR) {
                        aR.style.display = "";
                    }
                    this.btnclickHandle(adG);
                }
                this.kL = "";
            }
            else {
                if (kg) {
                
                    kg.className = "showteamon";
                }
                cR.style.display = "";
                if (cR.innerHTML == "loading...") {
                    this.axd(jF);
                }
                
                if (typeof gl.parent != "undefined") {
                    var aR = this.df.getElementById(jF);
                    if (aR) {
                        aR.style.display = "none";
                    }
                }
                else {
                    if (this.kL) {
                        this.btnclickHandle(this.kL);
                    }
                    this.kL = jF;
                }
            }
        }
    },
    
    aIA: function(){
        this.changeMode(0);
        if (this.kL) {
            this.btnclickHandle(this.kL);
        }
    },
    
    
    
    
    
    clickAddr: function(ae){
        var uc = ae.split("_")[2];
        if (this.bC.eO == 0) {
        
            var bJ = top.QMAddress.getAddress(uc);
            if (bJ) {
                this.bC.tZ[bJ.email] = 1;
                this.WM();
            }
        }
        this.fX.adC(uc, "left");
    },
    
    Ev: function(ae){
        this.WM();
    },
    
    WM: function(){
    
        var aDD = ["normal_plane", "search_plane"];
        var oK = ["a", "div"];
        var ij = this.bC.tZ;
        
        for (var bO = 0; bO < 2; bO++) {
            var yE = 0;
            var azq = this.df.getElementById(aDD[bO]);
            var pO = azq.getElementsByTagName(oK[bO]);
            for (var ad = pO.length - 1; ad >= 0; ad--) {
                if (typeof pO[ad].id != "undefined" && /.+_.+_\d+/.test(pO[ad].id)) {
                    var bJ = top.QMAddress.getAddress(pO[ad].id.split("_")[2]);
                    var uc = bJ.email;
                    if (typeof ij[uc] != "undefined") {
                        if (ij[uc] == 1 && pO[ad].style.display == "") {
                            pO[ad].style.display = "none";
                        }
                        if (ij[uc] == 0 && pO[ad].style.display == "none") {
                            pO[ad].style.display = "";
                        }
                    }
                    if (bO == 1 && !ij[uc]) {
                        yE++;
                    }
                }
            }
        }
        var aao = this.df.getElementById("noaddress");
        if (aao) {
            aao.style.display = yE ? "none" : "";
        }
    },
    
    
    
    changeMode: function(anR){
        var aaq = this.df.getElementById("normal_plane");
        var Iq = this.df.getElementById("search_plane");
        
        if (anR == 0) {
            Iq.style.display = "none";
            aaq.style.display = "";
            this.df.getElementById("quicksearch_ico").style.display = "";
            this.df.getElementById("quicksearch_ico1").style.display = "none";
            var ade = this.df.getElementById("quicksearch");
            ade.value = "";
            ade.focus();
        }
        else {
            aaq.style.display = "none";
            Iq.style.display = "";
            this.df.getElementById("quicksearch_ico").style.display = "none";
            this.df.getElementById("quicksearch_ico1").style.display = "";
        }
    },
    
    apg: function(ce){
        if (ce == "") {
            this.changeMode(0);
            return;
        }
        var qL = top.QMAddress.getAllAddressObj();
        var iY = [];
        var kX = ["name", "pinyin", "email"];
        for (var BO in qL) {
            var bJ = qL[BO];
            for (var bO = kX.length - 1; bO >= 0; --bO) {
                if (bJ[kX[bO]].toUpperCase().indexOf(ce) != -1) {
                    iY.push(bJ);
                    break;
                }
            }
        }
        this.axq(iY, ce);
    },
    
    keyupHanle: function(nC){
    
        var bU = nC.value.replace(/\\/g, "\\\\").toUpperCase();
        clearTimeout(this.alP);
        var ab = this;
        this.alP = setTimeout(function(){
            ab.apg(bU);
        }, 300);
    },
    
    axq: function(tT, ce){
        var cH = QMLinkman.aj;
        this.changeMode(1);
        var hp = this.fX;
        var bQ = this.bC;
        var cR = [cH.apf.toString()];
        var yE = 0;
        var aps = this.bC.aps;
        var ap = tT.length;
        var Eu = new RegExp('(' + ce + ')', "ig");
        for (var ad = 0; ad < ap; ad++) {
            var az = "s_x_" + tT[ad].id;
            var ij = typeof bQ.tZ[tT[ad].email] != "undefined" ? bQ.tZ[tT[ad].email] : 0;
            yE += (ij == 0);
            cR.push(cH.apx.replace({
                title: tT[ad].email,
                name: tT[ad].name.replace(Eu, "<b>$1</b>"),
                id: az,
                email: tT[ad].email.replace(Eu, "<b>$1</b>"),
                style: (ij ? "display:none;" : "display:"),
                clickHandle: ["QMLinkman.UI.Left.clickAddr(\'", az, "\')"].join("")
            }));
        }
        cR.push('<div id="noaddress" style="padding:5px;display:', (yE ? 'none' : ''), '">没有符合条件的联系人。</div>');
        var Iq = this.df.getElementById("search_plane");
        Iq.innerHTML = cR.join("");
    },
    
    blurHandle: function(nC){
        var bK = nC.value;
        if (bK == "") {
            nC.value = "查找联系人...";
            nC.style.color = "rgb(160, 160, 160)";
        }
    },
    
    focusHandle: function(nC){
        var bK = nC.value;
        if (bK == "查找联系人...") {
            nC.value = "";
            nC.style.color = "#000000";
        }
    }
}


QMLinkman.UI.Right = {

    fX: null,
    
    bC: null,
    
    ow: null,
    
    df: null,
    
    gW: function(vP, nS, TN, jd){
        this.fX = vP;
        this.bC = nS;
        this.ow = TN;
        this.df = jd;
        
        var ZG = nS.KW;
        for (var ad = 0, ap = ZG.length; ad < ap; ad++) {
            this.Ev(ZG[ad]);
        }
    },
    
    Ev: function(ae){
        var cH = QMLinkman.aj;
        var hp = this.fX;
        var aR = this.df.getElementById("rt_" + ae);
        var oc = QMLinkman.Kernel.Cy;
        if (!aR) {
            var bJ = oc[ae] || top.QMAddress.getAddress(ae);
            var bZ = bJ.name || bJ.email.replace(/@.*/ig, "");
            this.ow.innerHTML = [this.ow.innerHTML, cH.apy.replace({
                title: top.htmlEncode(bJ.email),
                name: bZ,
                email: bJ.email,
                id: ("rt_" + ae),
                btn_class: "bot_mov",
                style: "display:",
                clickHandle: ["QMLinkman.UI.Right.clickAddr(\'", ae, "\')"].join("")
            })].join("");
            aR = this.df.getElementById("rt_" + ae);
        }
        if (aR) {
            aR.parentNode.appendChild(aR);
            aR.style.display = "";
            
            setTimeout(function(){
                aR.scrollIntoView(false);
            }, 10);
            this.WN();
        }
    },
    
    clickAddr: function(ae){
        var aR = this.df.getElementById("rt_" + ae);
        var oc = this.bC.Cy;
        if (aR) {
            aR.style.display = "none";
            if (typeof oc[ae] == "undefined") {
                var bJ = top.QMAddress.getAddress(ae);
                if (bJ) {
                    this.bC.tZ[bJ.email] = 0;
                    this.fX.adC(ae, "right");
                }
            }
            else {
            
                oc[ae] = null;
                delete oc[ae];
            }
            this.WN();
        }
    },
    
    
    
    RE: function(){
        var cm = [];
        if (!this.ow) {
            return cm;
        }
        var pM = this.ow.getElementsByTagName("div");
        for (var ad = pM.length - 1; ad >= 0; --ad) {
            if (pM[ad].style.display == "" && pM[ad].id.indexOf("rt_") != -1) {
                cm.push(pM[ad].id.substr(3));
            }
        }
        return cm;
    },
    
    WN: function(){
        var Yr = this.df.getElementById("selectNum");
        var GI = this.RE().length
        if (Yr) {
            Yr.innerHTML = GI > 0 ? ["(", GI, ")"].join("") : "";
        }
    },
    
    
    aIA: function(){
        this.ow.innerHTML = "";
    }
}
