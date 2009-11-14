


var gCompose = {
    oQmSender: null,
    agI: false
}






function InitComposeForPage(dK, al){
    if (arguments.callee.pageId) {
        return;
    }
    
    if (!top.qmEditor && !al.nowait) {
        top.loadJsFileToTop(top.getPath("editor"), ["editor.js"]);
        var AI = arguments;
        var aa = this;
        return setTimeout(function(){
            AI.callee.apply(aa, AI);
        }, 50);
    }
    
    arguments.callee.pageId = dK;
    arguments.callee.pageConfig = al;
    
    var adI = {
        "compose": ayW,
        "group": ayX,
        "card": ayV,
        "voice": azc,
        "postcard": azi,
        "qq": aza,
        "readmailGroup": azb,
        "note": ayZ,
        "noteFirstPage": ayY
    }[dK];
    
    if (adI) {
        adI(dK, al ||
        {});
    }
    
    addEvent(window, "unload", function(){
        top.cancelDoSend();
        top.hideModelDialog();
    });
    
    top.setKeepAlive(window);
}







function qv(al){
    var Py = {
        "card": "card",
        "voice": "voice"
    }[GetPageId()];
    
    var ahv = {
        "note": true
    }[GetPageId()];
    
    function aet(bz, RG){
        var aK = S("frm");
        var abw = aK.sendtime;
        var aaF = aK.verifycode;
        var aaC = aK.verifycode_cn;
        
        
        if (abw && bz != "keeptimer" &&
        (!aaF || !aaF.value) &&
        (!aaC || !aaC.value)) {
            abw.value = 0;
        }
        
        if (typeof(al.onsend) == "function") {
            al.onsend.call(this, al);
        }
        else {
            if (al.safemode &&
            S("frm").action.indexOf("groupmail_send") == -1) {
                alert('您正处在只读模式下，邮件将无法保存到“已发送”');
            }
            DoProcess("", Py || "send", ahv, null, RG);
        }
        
        return false
    };
    
    function aIy(){
        gCompose.agI = true;
        if (typeof(al.onsave) == "function") {
            al.onsave.call(this, al);
        }
        else {
            DoProcess("savedraft", Py || "save", ahv);
        }
        return false;
    };
    
    function atL(){
        var Zr = QMDateCtrl.getDateValue(getDialogObj("sendTimeContainer"));
        for (var ji in Zr) {
            GetInputObj("sendtime" + ji).value = Zr[ji];
        }
    };
    
    function aiZ(dC){
        getDialogObj("sendTimeFormat").innerHTML = top.QMTimeLang.formatRefer(dC);
    };
    
    function aHX(ag, RG){
        if (!RG &&
        !DoProcessCheck("", Py || "send", function(){
            aKp(ag, true);
        })) 
            return;
        
        var CX = S("frm").sendtimetip;
        
        modelDialog(true, "定时发送", T(['<div style="margin:16px 15px 8px;*margin:16px 30px 8px;text-align:left;">', '<div>$tip$</div>', '<div id="sendTimeContainer" style="margin:6px 0 8px;font-family:Tahoma"></div>', '<div class="addrtitle">本邮件将在&nbsp;<span id="sendTimeFormat" class="black bold"></span>&nbsp;投递到对方邮箱。</div>', '</div>', '<div style="text-align:right;margin-right:10px;">', '<input id="confirm" class="wd1 btn btn_true" type="button" value="发送" />', '<input id="cancel"  class="wd1 btn btn_true" type="button" value="取消" />', '</div>']).replace({
            tip: CX && CX.value || "选择定时发送的时间："
        }), "cancel", ["confirm", "cancel"], [function(){
            var kd = Math.floor((QMDateCtrl.getDate(getDialogObj("sendTimeContainer")) -
            now()) /
            (60 * 1000));
            
            if (kd < 0) {
                return showError("您设置的定时时间已经过期");
            }
            if (kd < 5) {
                return showError("您设置的定时时间距离您要发送的时间太近了");
            }
            
            getDialogObj("confirm").setAttribute("selected", "true");
            hideModelDialog();
        }, function(){
            hideModelDialog();
        }
], null, null, function(){
            atL();
            if (getDialogObj("confirm").getAttribute("selected") == "true") {
                GetInputObj("sendtime").value = 1;
                setTimeout(function(){
                    aet("keeptimer", true);
                });
            }
            else {
                GetPageEditor().focus();
            }
        });
        
        QMDateCtrl.createDateSelecter({
            id: "sendtime",
            container: getDialogObj("sendTimeContainer"),
            yearRange: QMDateCtrl.getYearRange("now", 2),
            defaultYear: GetInputObj("sendtimeyear").value,
            defaultMonth: GetInputObj("sendtimemonth").value,
            defaultDay: GetInputObj("sendtimeday").value,
            defaultHour: GetInputObj("sendtimehour").value,
            defaultMin: GetInputObj("sendtimemin").value,
            onchange: function(dC){
                if (CX) {
                    CX.value = "";
                }
                aiZ(dC);
            }
        });
        
        aiZ(QMDateCtrl.getDate(getDialogObj("sendTimeContainer")));
        
        return false;
    };
    
    function Sh(awc){
        return function(bt){
            bt.onclick = awc;
        };
    };
    
    E(SN("sendbtn"), Sh(aet));
    E(SN("savebtn"), Sh(aIy));
    E(SN("timeSendbtn"), Sh(aHX));
    
    var Cp = S("noletter");
    if (Cp) {
        Cp.onclick = function(){
            var aD = GetPageEditor(), kI = aD.getContentObj("QQMAILSTATIONERY");
            
            if (aD.getContentType() == "html" && kI) {
                aD.setContent(kI.innerHTML);
                aD.focus();
            }
            else {
                UseStationery();
                this.checked = false;
                aD.focus();
            }
        };
    }
}






function ayW(dK, al){
    var De = GelTags("player", S("source"));
    var pe = {};
    
    if (De && De.length > 0 &&
    De[0].id.toLowerCase() == "cmd:bgmusic") {
        var wu = De[0];
        pe.url = wu.getAttribute("url");
        pe.song = decodeURIComponent(wu.getAttribute("song"));
        pe.singer = decodeURIComponent(wu.getAttribute("singer"));
    }
    
    var jl = function(){
        Zd() || Co(al, true);
        
        if (pe.song || pe.url) {
            GetPageEditor().setBgMusicInfo(pe.song, pe.singer, pe.url);
        }
        
        qv(al);
        gCompose.oQmSender = new top.QMSender({
            oWin: window,
            nCurFolderId: al.folderid,
            sCurSaveFrom: al.saveFrom,
            sWidth: 210,
            bShowNode: "parentNode"
        });
        vK();
        HG(getDefaultEditor());
        show(S("editor_toolbar_btn_container"), true);
        
        LoadValue(true);
        SetNeedCloseConform(true);
        AutoSave(false);
        
        nE();
        SetMultiSignatureSelect();
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: top.qmEditor.CONST.FUNCLIST.COMPOSE,
        photoCGI: GetPhotoCGI(),
        customtags: uG(),
        
        onload: vn(jl),
        onfocus: oy,
        onmousedown: rw,
        onclick: qx,
        onbeforesaverange: qx,
        onkeydown: nS,
        onpaste: Pi,
        onputcontent: UJ,
        onchangecontenttype: abd,
        onchangebgmusic: aEX,
        onshowinstallactive: showInstallActiveXDialog
    }).initialize(al.source || OutputDataLoading(), false, 3);
    
    PN();
    initAddress();
}






function ayX(dK, al){
    var jl = function(){
        Zd() || Co(al, true);
        
        qv(al);
        HG(getDefaultEditor());
        show(S("editor_toolbar_btn_container"), true);
        
        LoadValue(true);
        SetNeedCloseConform(true);
        
        nE();
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: top.qmEditor.CONST.FUNCLIST.GROUP,
        photoCGI: GetPhotoCGI(),
        photoConfig: {
            widthlimit: 1024,
            heightlimit: 1024,
            sizelimit: 1
        },
        customtags: uG(),
        
        onload: vn(jl),
        onfocus: oy,
        onmousedown: rw,
        onclick: qx,
        onbeforesaverange: qx,
        onkeydown: nS,
        onpaste: Pi,
        onputcontent: UJ,
        onshowinstallactive: showInstallActiveXDialog
    }).initialize(al.source || OutputDataLoading(), false, 5);
    
    PN();
}






function ayV(dK, al){
    var jl = function(){
        Co(al, true, 1);
        
        qv(al);
        vK();
        HG(getDefaultEditor());
        show(S("editor_toolbar_btn_container"), true);
        S("sendmailname").value = getDefaultSender();
        
        nE();
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: top.qmEditor.CONST.FUNCLIST.MO,
        customtags: uG(),
        
        onmousedown: rw,
        onload: vn(jl),
        onkeydown: nS
    }).initialize(al.source || OutputDataLoading(), false, 3);
    
    initAddress();
}






function azc(dK, al){

    if (!S("qmEditorArea")) {
        qv(al);
        
        nE();
        
        vK();
        SetNeedCloseConform(true);
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
        
        S("sendmailname").value = getDefaultSender();
        initAddress();
        
        return;
    }
    
    var jl = function(){
        Co(al, true);
        
        qv(al);
        
        
        
        
        
        
        gCompose.oQmSender = new top.QMSender({
            nCurFolderId: "",
            sCurSaveFrom: "",
            sWidth: 210,
            bShowNode: "parentNode"
        });
        
        nE();
        
        vK();
        SetNeedCloseConform(true);
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: top.qmEditor.CONST.FUNCLIST.MO,
        customtags: uG(),
        
        onload: vn(jl),
        onkeydown: nS
    }).initialize(al.source, false, 3);
}






function azi(dK, al){
    vn(function(){
        qv(al);
        
        nE();
        vK();
        S("sendmailname").value = getDefaultSender();
        
        SetNeedCloseConform(true);
    })();
    initAddress();
}






function aza(dK, al){
    var jl = function(){
        qv(al);
        
        Co(al, true, 1);
        vK();
        nE();
        
        if (typeof(al.onload) == "function") {
            al.onload();
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        style: "border:none;icon:big;",
        funclist: {
            tbExtern: "Mo Photo"
        },
        photoCGI: GetPhotoCGI(),
        customtags: uG(),
        
        onload: vn(jl),
        onfocus: oy,
        onmousedown: rw,
        onclick: qx,
        onbeforesaverange: qx,
        onkeydown: nS,
        onputcontent: UJ
    }).initialize(al.source || OutputDataLoading(), false, 5);
}






function azb(dK, al){
    var jl = function(){
        this.setContent(top.qmEditor.getBreakLine(1));
        nE();
        
        if (typeof(al.onload) == "function") {
            al.onload();
        }
        
        setTimeout(function(){
            FocusPageEditor(0);
        });
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: {
            tbExtern: "Mo"
        },
        customtags: uG(),
        
        onmousedown: rw,
        onload: jl,
        onkeydown: nS
    }).initialize(al.source, false);
}






function ayY(dK, al){
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        height: getStyle(S("qmEditorArea"), "height"),
        
        onmousedown: rw,
        onkeydown: nS,
        onfocus: aFg
    }).initialize(agB(), false);
}






function ayZ(dK, al){
    var jl = function(){
        qv(al);
        if (al.isPaste) {
            GetPageEditor().paste();
        }
        else 
            if (al.isReadCache) {
                var Zz = getGlobalVarValue("NOTE_CONTENT_CACHE");
                if (Zz) {
                    GetPageEditor().setContent(Zz);
                }
            }
            else {
                GetPageEditor().setContent(Df(S("source").innerHTML) ||
                top.qmEditor.getBreakLine());
            }
        
        HG(getCookieFlag("CCSHOW")[3] == 1 ? true : false);
        show(S("editor_toolbar_btn_container"), true);
        
        LoadValue(true);
        SetNeedCloseConform(true);
        AutoSave(false);
        
        nE();
        
        if (typeof(al.onload) == "function") {
            al.onload(oy);
        }
    };
    
    top.qmEditor.createEditor({
        editorId: dK,
        editorAreaWin: window,
        funclist: top.qmEditor.CONST.FUNCLIST.NOTE,
        photoCGI: GetPhotoCGI(),
        
        onload: jl,
        onmousedown: rw,
        onkeydown: nS,
        onpaste: Pi,
        onchangecontenttype: abd,
        onshowinstallactive: showInstallActiveXDialog
    }).initialize(al.source || OutputDataLoading(), false, 5);
    
    PN();
}







function GetPhotoCGI(){
    var adj = location.host;
    var art = {
        "m391.mail.qq.com": "m389.mail.qq.com",
        "m392.mail.qq.com": "m390.mail.qq.com",
        "m141.mail.qq.com": "m139.mail.qq.com",
        "m142.mail.qq.com": "m140.mail.qq.com",
        "m209.mail.qq.com": "m207.mail.qq.com",
        "m210.mail.qq.com": "m208.mail.qq.com",
        "maildev4-ssl.mail.qq.com": "maildev4-suse.mail.qq.com"
    }[adj];
    return [location.protocol, "//", art || adj, "/cgi-bin/upload"].join("");
}





function uG(){
    return ["sign", "qzone", "taotao", "includetail"];
}






function vn(Ad){
    return function(){
        waitFor(function(){
            try {
                getDefaultEditor();
                return true;
            } 
            catch (at) {
                return false;
            }
        }, Ad, 50);
    };
}





function GetPageId(){
    return InitComposeForPage.pageId;
}





function GetPageEditor(){
    return top.qmEditor && top.qmEditor.getEditor(GetPageId());
}








function GetInputObj(bn, cb, awM){
    var aK = cb || S("frm");
    var aO = aK[bn];
    if (!aO) {
        insertHTML(aK, "afterBegin", T('<input name="$name$" type="hidden" $disabled$/>').replace({
            name: bn,
            disabled: awM ? "disabled" : ""
        }));
        aO = aK[bn];
    }
    return aO;
}






function FocusPageEditor(dZ, ae){
    var aD = GetPageEditor();
    if (aD) {
        aD.focus(dZ || 0, aD.getContentObj(ae || "QQMAILSTATIONERY"));
    }
}





function ChangeContentType(Mf){
    if (!GetPageEditor().changeContentType(Mf.checked ? "text" : "html")) {
        Mf.checked = !Mf.checked;
    }
}




function abd(){
    var OV = this.getContentType() != "html";
    if (OV) {
        var XW = S("noletter");
        if (XW) {
            XW.checked = false;
        }
        GetPageEditor().setBgMusicInfo();
    }
    S("contenttype").checked = OV;
    show(S("qmEditorToolBarPlusArea").parentNode, !OV);
}






function OutputDataLoading(Sg){
    return T(['<div class="$className$" style="$height$font-size:12px;color:gray;$padding$">数据加载中...</div>']).replace({
        className: Sg ? "qmEditorBase" : "",
        padding: Sg ? "padding:5px;" : "",
        height: Sg ? "height:100%;" : ""
    });
}






function OutputToolBarControlBtn(ae){
    return T(['<a id="$id$" style="display:none;" unselectable="on" onmousedown="return false;" >', '<input type="button" style="background:url(' + top.getPath("image") + 'newicon/compose.gif) -112px 0;', 'width:16px;height:16px;border:none;padding:0;margin:0 2px 0 -3px;*margin:0 2px 0 0;vertical-align:middle!important;vertical-align:auto;" ', 'unselectable="on" onmousedown="return false;" />', '文字格式<span>↑</span><span style="display:none;" >↓</span>', '</a>']).replace({
        id: ae || "editor_toolbar_btn_container",
        path: getPath("editor")
    });
}






function Df(aFW){
    return filteScript(aFW.replace(/<div id=\'?\"?QQMailBgMusicInfo\'?\"?.*?>.*?<\/div>/ig, "").replace(/<player .*?><\/player>/ig, "").replace(/(^\s+)|(\s+$)/ig, ""));
}








function Co(al, awE, aoT){
    if (awE && al.subtmpl != "draft") {
        var acZ = S("QQMAILSTATIONERY");
        if (acZ) {
            acZ.id = "";
        }
        
        var Zk = S("QqMAiLcARdWoRD");
        if (Zk) {
            Zk.id = "";
        }
    }
    
    var xm = S("source") && S("source").innerHTML, acd = getSignature(al.folderid, al.saveFrom), OG = al.subtmpl == "draft" || al.subtmpl == "content", cG = [], aD = GetPageEditor();
    
    if (!OG) {
        cG.push(top.qmEditor.getBreakLine(aoT ||
        (filteSignatureTag(acd) ? 2 : 1)));
        cG.push(acd);
    }
    
    if (!al.isNoInclude && xm) {
        if (al.subtmpl == "draft") {
            cG.push(filteSignatureTag(xm, "2LOWCASE"));
        }
        else {
            xm = Df(filteSignatureTag(xm));
            if (xm) {
                cG.push(["<div><includetail>", xm, "</includetail></div>"].join(""));
            }
            
        }
    }
    
    if (!OG && (GetPageId() == "compose" || GetPageId() == "qq")) {
        cG = [getDetaultStationery("Header"), cG.join(""), getDetaultStationery("bottom")];
    }
    
    if (!OG) {
        aD.setDefaultFontInfo(getGlobalVarValue("DEF_FONT_FAMILY"), getGlobalVarValue("DEF_FONT_SIZE"), getGlobalVarValue("DEF_FONT_COLOR"));
    }
    
    aD.setContent(cG = Df(cG.join("")));
    
    return cG;
}




function nE(){
    addEvent(document, "keydown", nS);
}




function vK(){
    var fS = S("savesendbox");
    if (fS) {
        fS.checked = !getDefaultSaveSendbox();
    }
}






function HG(fQ){
    fQ = fQ == null ? true : fQ;
    GetPageEditor().showToolBar(fQ);
    
    var TF = S("editor_toolbar_btn_container");
    if (!TF) {
        return false;
    }
    
    var mJ = GelTags("span", TF);
    
    show(mJ[0], fQ);
    show(mJ[1], !fQ);
    
    var yh = arguments.callee;
    TF.onclick = function(){
        yh(!fQ);
    };
}




function aEX(){
    var rj = S("editor_bgmusic_container");
    if (!rj) {
        return;
    }
    
    if (rj.getAttribute("inited") != "true") {
        rj.innerHTML = T(['<div></div>', '<div id="bg_music_listen" style="display:none;margin:4px 0 4px 0;">', '<div id="mp3player_msg" ></div>', '<div id="mp3player_container" style="display:none;" >播放器加载中...</div>', '</div>']);
        rj.setAttribute("inited", "true");
    }
    
    var bp = this.getBgMusicInfo();
    show(rj, bp);
    
    if (!bp) {
        return;
    }
    
    rj.firstChild.innerHTML = T(['<span style="word-break:break-all;"><span class="graytext">背景音乐：</span>$bgmusic$</span>', '<a style="margin:0 5px 0 10px;" onclick="', 'if ( confirm( \x27您确认删除该背景音乐？\x27 ) ) {', 'stopUrl();', 'GetPageEditor().setBgMusicInfo();', '}', '">删除</a>', '<a onclick="', 'TryListenBgMusic( this );', '" >试听</a>']).replace({
        bgmusic: bp.song ? T("$song$($singer$)").replace({
            song: htmlEncode(bp.song),
            singer: htmlEncode(bp.singer)
        }) : htmlEncode(bp.url)
    });
    
    stopUrl();
    show("mp3player_container", false);
    show("mp3player_msg", true);
    
    function adw(dH){
        TryListenBgMusic(rj.firstChild.lastChild, bp.song, bp.singer, dH);
    }
    
    if (bp.song) {
        S("mp3player_msg").innerHTML = "歌曲加载中...请稍候";
        getMusicUrl(bp.song, bp.singer, function(oG, oI, aS){
            if (!GetPageEditor()) {
                return;
            }
            if (aS) {
                GetPageEditor().setBgMusicInfo(oG, oI, aS);
                adw("open");
            }
            else {
                S("mp3player_msg").innerHTML = "歌曲加载失败";
            }
        });
    }
    
    adw("open");
}








function TryListenBgMusic(Or, oG, oI, bz){
    var rC = ["试听", "关闭"];
    if (bz != "close" &&
    (Or.innerHTML == rC[0] || bz == "open")) {
    
        Or.innerHTML = rC[1];
        
        var aw = GetPageEditor().getBgMusicInfo();
        if (aw && aw.url) {
            show("mp3player_container", true);
            show("mp3player_msg", false);
            
            
            setTimeout(function(){
                playUrl({
                    url: aw.url,
                    dispInfo: {
                        author: aw.singer,
                        title: aw.song
                    }
                });
            }, 200);
        }
        
        show("bg_music_listen", true);
    }
    else {
    
        Or.innerHTML = rC[0];
        
        stopUrl();
        show("mp3player_container", false);
        show("mp3player_msg", true);
        
        show("bg_music_listen", false);
    }
}





function Zd(){
    var aG = top.gSaveComposeContent;
    if (!aG) {
        return aG;
    }
    
    var je = top.gSaveDefaultFontInfo;
    GetPageEditor().setDefaultFontInfo(je.fontName, je.fontSize, je.fontColor);
    GetPageEditor().setContent(aG);
    
    top.gSaveComposeContent = null;
    
    if (S("subject")) {
        S("subject").value = top.gSaveComposeSubject;
        top.gSaveComposeSubject = "";
    }
    
    if (top.gSaveComposeBigAttachHTML && S("BigAttach") &&
    top.gSaveComposeBigAttachHTML.replace(/ /ig, "")) {
        S("BigAttach").innerHTML = top.gSaveComposeBigAttachHTML;
        top.gSaveComposeBigAttachHTML = "";
    }
    
    return aG;
}





function rw(ag){
    azm(ag);
    hideMenuEvent(ag);
    QMAttach.hideDragAndDropContainer();
}





function azm(ag){
    var aD = GetPageEditor();
    var kI = aD &&
    aD.getContentObj("QQMAILSTATIONERY");
    var aH = ag.srcElement || ag.target;
    
    if (!kI || !aH) {
        return;
    }
    
    if (!isObjContainTarget(kI, aH)) {
        preventDefault(ag);
        if (gbIsIE) {
            setTimeout(function(){
                qx(ag);
            });
        }
    }
}






function qx(ag, awo){
    var aD = GetPageEditor();
    var kI = aD && aD.getContentObj("QQMAILSTATIONERY");
    
    if (kI && (awo || !aD.isSelectionInObject(kI))) {
        aD.focus(0, kI);
    }
}





function oy(ag){

    arguments.callee.editorEverFocus = true;
    qx(ag, window.gbIsSafari);
}




function UJ(){
    var kI = this.getContentObj("QQMAILSTATIONERY"), Cp = S("noletter");
    
    this.adjustBodyStyle("padding", kI ? "0" : "2px 4px 0");
    
    
    sU(gbIsIE ? "auto" : "100%");
    
    if (Cp) {
        Cp.checked = !!kI;
    }
}





function sU(lA){
    try {
        var kD = GetPageEditor().getContentTags("table");
        for (var i = 0, ap = Math.min(kD.length, 50); i < ap; i++) {
            var gp = kD[i];
            if (gp.className == "i") {
                gp.style.width = lA;
            }
        }
    } 
    catch (at) {
    }
}





function Pi(ag){
    var ye = arguments.callee;
    var DU = S("subjectsample");
    if ((!S("subject").value || S("subject").value == (DU && DU.value)) &&
    !ye.mV) {
        var ab = this;
        var Om = this.getContent(true);
        setTimeout(function(){
            var AL = ab.getContent(true);
            var zm = Om.length;
            var yA = AL.length;
            var akL = 3001;
            if (zm > akL || yA > akL) {
                return;
            }
            
            for (var i = 0; i < zm && i < yA; i++) {
                if (Om.charAt(zm - i - 1) !=
                AL.charAt(yA - i - 1)) {
                    break;
                }
            }
            var VQ = yA - i;
            var HC = zm - i;
            
            for (var i = 0; i < zm && i < yA; i++) {
                if (Om.charAt(i) != AL.charAt(i)) {
                    break;
                }
            }
            if (i < HC) {
                HC = i;
            }
            var aaf = (HC == VQ ? AL : AL.substring(HC, VQ)).replace(/[\r\n]/ig, "");
            if (aaf.replace(/http?:\/\/[\w.]+[^ \f\n\r\t\v\"\\\<\>\[\]\u2100-\uFFFF]*/, "url") ==
            "url") {
                debug("paste", 61882714);
                var kO = ye.mV = new QMAjaxRequest("/cgi-bin/geturlinfo", "POST", 20 * 1000);
                kO.onComplete = function(wJ){
                    var jJ = wJ.responseText;
                    if (jJ.indexOf("ok|") == 0) {
                        if (!S("subject").value ||
                        S("subject").value == (DU && DU.value)) {
                            if (getMainWin().SubjectCtrl) {
                                getMainWin().SubjectCtrl(1);
                            }
                            S("subject").value = trim(jJ.substr(3).replace(/&#(x)?([^&]{1,5});?/g, function(a, b, c){
                                return String.fromCharCode(parseInt(c, b ? 16 : 10));
                            }).replace(/[\r\n]/g, ""));
                        }
                        delete kO;
                    }
                    else {
                        kO.onError();
                    }
                };
                kO.onError = function(){
                    debug("error", 61882714);
                    delete kO;
                };
                kO.send(T('sid=$sid$&url=$url$&pageid=$id$').replace({
                    sid: getSid(),
                    id: GetPageId(),
                    url: encodeURIComponent(aaf)
                }));
            }
        }, 13);
    }
}








function trimEditorContent(FY){
    var abk = FY.getContent(true);
    var aG = FY.getContent();
    
    return (!abk || (abk.replace(/ /ig, '') == '')) &&
    aG.toLowerCase().indexOf('img') == -1 ? "" : aG;
}




function ReadMailGroupBeforeUnload(){
    var aD = GetPageEditor();
    if (!aD) {
        return;
    }
    
    if (trimEditorContent(aD) && !S("source").disabled) {
        return '您填写的内容没有发表，确定要离开吗？';
    }
}





function ReadMailGroupQuickStartCompose(apD){
    show(apD, false);
    
    var Eo = S("sendbtn");
    Eo.className = "left bd_upload grptitle_tab_ bold";
    Eo.style.cssText = "margin-left:304px;height:26px;width:96px;cursor:pointer;display:none;";
    Eo.parentNode.style.cssText = "border:none;clear:left;height:26px;padding:3px 0;width:405px;*width:205px;";
    Eo.parentNode.className = "attbg";
    
    var acR = S("qmEditorArea");
    show(acR.parentNode, true);
    acR.innerHTML = OutputDataLoading(true);
    
    InitComposeForPage("readmailGroup", {
        onload: function(){
            show("sendbtn", true);
        }
    });
}




function ReadMailGroupQuickSend(){
    var aD = GetPageEditor();
    if (aD) {
        var gq = trimEditorContent(aD);
    }
    
    if (!aD || !gq) {
        return showError('请先输入回复内容');
    }
    
    quickDoSend(frm, gq);
}





function NoteFirstPageQuickSave(){
    if (GetPageEditor().getContent(true) == "请输入记事内容...") {
        return showError('请先输入内容', 800);
    }
    S("content").value = GetPageEditor().getContent();
    window.unloadwarning = false;
    return S("frm").submit();
}




function NoteFirstPageQuickEdit(){
    InitComposeForPage("noteFirstPage", {});
}






function agB(auZ){
    var gL = "请输入记事内容...";
    return auZ ? gL : ["<div style='color:#a0a0a0;font-size:12px;'>", gL, "</div>"].join("");
}




function aFg(){
    var aD = this;
    if (aD.getContent(true) == agB(true)) {
        aD.setContent(top.qmEditor.getBreakLine());
        aD.focus(0);
    }
}


var QMAttach = {
    LG: "normal",
    aBa: "exe|msi|scr|cmd|bat|com",
    KN: 50,
    amo: 0,
    
    aBw: {},
    
    jE: [],
    ml: {},
    
    rM: null,
    ja: null,
    zl: null,
    
    FB: null,
    Lh: null,
    Fz: null,
    
    Ma: false,
    LX: false,
    
    onprogress: null,
    onfinish: null,
    
    
    
    
    
    
    afterAddFileWithIE: function(ahj){
        var LN = top.createActiveX(2), az = ahj.name, fk = ahj.value;
        
        if (LN) {
            var fL = LN.GetFileSize(fk);
            if (fL != null) {
                S("SIZE" + az).name = fL;
                S("SIZE" + az).innerHTML = "(" + this.Ei(parseInt(fL)) + ")";
            }
            delete LN;
        }
        
        S("S" + az).innerText = fk.split("\\").pop();
        show("D" + az, true);
        
        setFileNameToSubject(fk);
        
        return this.pR("ie").za();
    },
    
    
    
    
    checkAttachWarnningType: function(){
        var aa = this, lQ = [], CH = S("exist_file"), LV = CH ? CH.childNodes : [];
        
        E(LV, function(eK){
            if (eK.tagName == "DIV") {
                var di = S("eas_" + eK.id.split("_").pop()), fk = di && (di.innerText || di.textContent) || "";
                if (aa.JE(fk)) {
                    lQ.push(aa.Qi(fk));
                }
            }
        });
        
        E(aa.jE, function(ae){
            var di = S("Uploader" + ae), fk = di && di.value || "";
            if (aa.JE(fk)) {
                lQ.push(aa.Qi(fk));
            }
        });
        
        return lQ;
    },
    
    
    
    
    
    
    delAttach: function(bn){
        var aa = this;
        MK = S(bn), gv = aa.ja, alb = aa.agc(bn);
        
        if (MK && MK.disabled) {
            aa.Zc(MK.value);
        }
        
        if (gv && ("Uploader" + gv.az) == bn) {
            aa.atz();
        }
        
        if (alb != -1) {
            aa.auB(alb);
        }
        
        removeSelf(S("D" + bn));
        
        return aa.za();
    },
    
    
    
    
    
    
    delExistAttach: function(ae){
        var KK = S("eas_" + ae);
        
        if (KK) {
            this.Zc(fixNonBreakSpace(KK.innerText ||
            KK.textContent));
        }
        
        removeSelf(S("ea_" + ae));
        
        return this.za();
    },
    
    
    
    
    
    disableControl: function(bn){
        this.LX = true;
        return (bn ? this.delAttach(bn) : this.aGW()).ajb();
    },
    
    
    
    
    
    getAttachLimit: function(){
    
        return this.KN * 1024 * 1024;
    },
    
    
    
    
    
    getAttachSize: function(){
        var aa = this, fL = 0, CH = S("exist_file"), LV = CH ? CH.childNodes : [], Ct = this.ml;
        
        E(LV, function(eK){
            if (eK.tagName == "DIV") {
                var di = S("s" + eK.id);
                if (di) {
                    fL += aa.avS(di.innerHTML);
                }
            }
        });
        
        E(this.jE, function(ae){
            fL += Ct[ae].fL;
        });
        
        return fL;
    },
    
    
    
    
    
    getExistList: function(){
        return this.jE;
    },
    
    
    
    
    
    
    hasAttach: function(axs){
        var mK = this.jE, CB = this.ml, sr;
        
        for (var i = 0, aP = mK.length; i < aP; i++) {
            var az = mK[i];
            if (CB[az].cx) {
                return true;
            }
            else 
                if (S("Uploader" + az).value) {
                    return true;
                }
        }
        
        if (S("exist_file")) {
            sr = S('exist_file').childNodes;
            for (var i = 0, aP = sr.length; i < aP; i++) {
                if (sr[i].nodeType != 3) {
                    return true;
                }
            }
        }
        
        if (axs && S("BigAttach")) {
            sr = S('BigAttach').childNodes;
            for (var i = 0, aP = sr.length; i < aP; i++) {
                if (sr[i].nodeType != 3 && isShow(sr[i])) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    
    
    
    hasUploadError: function(){
        return this.Vb("error") != 0;
    },
    
    
    
    
    
    
    
    
    outputBtn: function(RA, FM, Hg){
        var xS = typeof(FM) != "number" ? this.KN : (this.KN = FM);
        
        var adi = gbIsIE && gnIEVer >= 6 ? T(['<iframe id="iefileupload" style="width:0;height:0;" src="javascript:\'\';" onload="', 'QMAttach.setIeUpload()', '" ></iframe>']) : "";
        
        var Nv;
        
        
        if (xS > 0 && this.aDa() && !(gbIsTT && this.KB())) {
            Nv = T(['<div id="flashUploadContainer" ', 'style="position:absolute;width:$width$px;height:$height$px;margin:$margin$;z-index:1;">', '</div>']).replace(Hg ? {
                width: 95,
                height: 25,
                margin: "-3px 0 0"
            } : {
                width: 70,
                height: 19,
                margin: gbIsIE ? "3px 0 0" : "0"
            });
            this.azf();
        }
        else {
            this.Ma = true;
        }
        
        if (Hg) {
            this.LG = "easy";
            
            return T(['$flash$', '<a id="AttachFrame" onclick="$onclick$();" onmousedown="return false;" style="display:$display$;" ', ' title="添加小于 $sizelimit$M 的文件作为附件" sizelimit="$sizelimit$" >', '<img src="$image_path$compose_easy_attch.gif" align="absmiddle"/>发文件', '</a>', '$iecontrol$']).replace({
                flash: Nv,
                onclick: "QMAttach.selectFile",
                display: xS > 0 ? "" : "none",
                sizelimit: xS,
                image_path: getPath("image"),
                iecontrol: adi
            });
        }
        else {
            var agM = detectActiveX(1, 1), aoJ = T('$setup$可以向任何邮箱发送最大 $size$ 的附件').replace({
                setup: agM ? "" : '点击安装邮箱控件&#10;安装后您',
                size: "1G"
            });
            
            if (top.QMApplet.isSupported()) {
                this.ayU();
            }
            
            return T(['$flash$', '<span style="margin-right:10px;">', '<a id="AttachFrame" onclick="$onclick$();" onmousedown="return false;" style="display:$display$;" ', 'title="添加小于 $sizelimit$M 的文件作为附件" sizelimit="$sizelimit$" >', '<input type="button" class="ico_att" align="absmiddle" style="margin:0 1px 0 0;" ', 'unselectable="on" onmousedown="return false"/>', '<span id="sAddAtt1">添加附件</span>', '<span id="sAddAtt2" style="display:none;">继续添加</span>', '</a>', '<span id="dragAndDropTrap" style="display:none;">&nbsp;<a onmousedown="return false;"', 'title="点击打开拖拽托盘">↓</a></span>', '</span>', '<a id="bigAttachLink" style="display:$baDisplay$;margin-right:12px;" title="$baTitle$" onclick="initFileTransporter();" onmousedown="return false;" >', '<input name="activexControlBtn" type="button" class="$baClass$" align="absmiddle" style="margin:0 1px 0 0" />超大附件', '</a>', '$iecontrol$']).replace({
                flash: Nv,
                onclick: "QMAttach.selectFile",
                display: xS > 0 ? "" : "none",
                sizelimit: xS,
                baDisplay: RA ? "" : "none",
                baTitle: aoJ,
                baClass: agM ? "ico_attbig" : "ico_attbig_disabled",
                iecontrol: adi
            });
        }
    },
    
    
    
    
    retryUpload: function(bn){
        var df = this.agc(bn);
        if (df != -1) {
            var adc = this.ml[this.jE[df]];
            if (adc.gC == "error") {
                this.GR(adc, "ready");
                this.nU();
            }
        }
        return this;
    },
    
    
    
    
    
    
    selectFile: function(bz){
        if (this.KB()) {
            if (this.Bt()) {
                var AD = createActiveX(2);
                if (AD) {
                    this.avN(bz == "clipboard" ? AD.GetClipBoardFiles() : AD.SelectFiles(top), AD);
                    delete AD;
                }
            }
        }
        else 
            if (bz != "clipboard") {
                if (this.Bt()) {
                
                    this.pR("tradition").za();
                }
            }
        
        return this;
    },
    
    
    
    
    selectFileWithIE: function(){
        if (this.KB()) {
            this.selectFile();
        }
        else 
            if (this.Bt()) {
            
                var UV = S("Uploader" + this.agh());
                if (!UV) {
                    this.pR("ie");
                    UV = S("Uploader" + this.agh());
                }
                
                return UV;
            }
    },
    
    
    
    
    setIeUpload: function(){
        F("iefileupload").document.body.innerHTML = T(['<input id="btn" type="button" onclick="', 'top.S( \x27AttachFrame\x27, parent ).onclick = function() ', '{', 'var _oUploaderBtn = parent.QMAttach.selectFileWithIE();', 'if(_oUploaderBtn)', '{', '_oUploaderBtn.click();', '}', '};', '" />']);
        setTimeout(function(){
            fireMouseEvent(S("btn", F("iefileupload")), "click");
        });
    },
    
    
    
    
    
    setInput: function(eC){
        var aa = this, mK = this.jE, CB = this.ml;
        
        if (eC) {
            var gQ = [];
            
            E(mK, function(ae){
                var bp = CB[ae], AC = bp.AC;
                
                if (AC && !bp.aEN) {
                
                
                
                    gQ.push(AC);
                }
            });
            
            if (gQ.length > 0) {
                eC.value = gQ.join("|");
                return gQ.length - 1;
            }
        }
        
        return 0;
    },
    
    showAttachLimit: function(apk){
        modelDialog(1, '附件提示', T(['<div style="padding:12px 10px 0 12px;text-align:left;">', '<div style="float:left;height:60px;">', '<img src="$image_path$ico_question.gif" align="absmiddle"', ' style="margin:5px 0 0 10px;">', '</div>', '<div style="padding-top:10px;height:60px;overflow:hidden;">', '您所选择的文件超过了 $size$ 的附件大小上限。<br>', '<span>建议使用 <a id="link_bigattach">', '<input type="button" class="ico_attbig" align="absmiddle"', ' style="margin:0 3px 0 0!important;margin:0 3px 2px 0" />', '超大附件</a> 上传发送。</span>', '</div>', '</div>', '<div style="padding:20px 10px 0;text-align:right;">', '<input type=button class="btn wd1" id="btn_cacnel" value="确定" />', '</div>']).replace({
            image_path: getPath('image'),
            size: this.Ei(apk)
        }), "btn_cacnel", ["link_bigattach", "btn_cacnel"], [function(){
            hideModelDialog();
            initFileTransporter();
        }, hideModelDialog]);
    },
    
    
    
    
    
    upload: function(){
        return this.nU(true);
    },
    
    
    
    
    
    
    avN: function(ic, aqV){
        if (ic && typeof ic == "string") {
            var kP = [], yx = 0;
            
            E(ic.split("\r\n"), function(arO){
                var Na = trim(arO).split(" ");
                if (Na.length >= 2) {
                    var cx = Na.shift(), fk = Na.join(" "), fL = aqV.GetFileSize(fk);
                    
                    kP.push({
                        cx: cx,
                        bZ: fk.split("\\").pop(),
                        fL: fL
                    });
                    yx += fL;
                }
            });
            
            this.aiO("activex", kP, yx);
        }
    },
    
    
    
    
    
    
    
    aiO: function(bz, CF, ajm){
        if (ajm != 0) {
            if (this.getAttachSize() + ajm > this.getAttachLimit()) {
                this.showAttachLimit(this.getAttachLimit());
            }
            else {
                var aa = this, Ep = [], lQ = [];
                
                E(CF, function(hT){
                    if (hT.fL <= 0) {
                        Ep.push(hT.bZ);
                    }
                    else 
                        if (aa.JE(hT.bZ)) {
                            lQ.push(aa.Qi(hT.bZ));
                        }
                        else {
                            aa.pR(bz, [bz, now(), hT.cx].join("_"), hT.cx, hT.bZ, hT.fL);
                        }
                });
                
                this.za().nU();
                
                if (Ep.length > 0 || lQ.length > 0) {
                    msgBox(T(['<div style="display:$sizedisp$;">$sizefiles$ 的大小为 0 字节，因此无法添加此文件。</div>', '<div style="display:$typedisp$;">$typefiles$ 是可执行文件。出于安全性考虑，不允许添加此文件。</div>']).replace({
                        sizedisp: Ep.length ? "" : "none",
                        sizefiles: htmlEncode(Ep.join(", ")),
                        typedisp: lQ.length ? "" : "none",
                        typefiles: htmlEncode(lQ.join(", "))
                    }), "dialog");
                }
            }
        }
    },
    
    
    
    
    
    
    
    aiP: function(zR, Cg, ahr, ar){
        if (this.Bt()) {
            var kP = [], aKP = [], yx = 0;
            
            for (var i = parseInt(zR), aCh = parseInt(Cg); i <= aCh; i++) {
                var cx = i, fk = new String(ahr.getFileInfo(i, "name")), fL = parseInt(ahr.getFileInfo(i, "size") || 0);
                
                kP.push({
                    cx: cx,
                    bZ: fk.split("\\").pop(),
                    fL: fL
                });
                yx += fL;
            }
            
            this.aiO(ar, kP, yx);
        }
    },
    
    
    
    
    
    
    
    
    
    
    pR: function(bz, ae, ce, cK, eu){
        var az = ae || this.aAg(), bZ = "Uploader" + az;
        
        
        if (!S(bZ)) {
            var hx = {
                tradition: "tradition",
                ie: "ie"
            }[bz || "tradition"] ||
            "control";
            
            this.aGE(az, bz, ce, cK, eu, hx);
            
            var aR = document.createElement("div");
            aR.className = "attsep";
            aR.id = "D" + bZ;
            aR.innerHTML = this.aAI(hx).replace({
                id: ae,
                value: ce,
                name: bZ,
                ext: bz,
                filename: htmlEncode(cK),
                size: eu || 0,
                formatsize: this.Ei(parseInt(eu || 0))
            });
            
            if (hx == "ie") {
                show(aR, false);
            }
            
            S('filecell').appendChild(aR);
            
            if (cK) {
                setFileNameToSubject(cK);
            }
        }
        
        return this;
    },
    
    
    
    
    
    za: function(){
        var ahW = this.hasAttach();
        show('sAddAtt1', !ahW);
        show('sAddAtt2', ahW);
        return this;
    },
    
    
    
    
    ajG: function(){
        var aa = this;
        aa.rM = aa.ja = aa.zl = null;
        return aa;
    },
    
    
    
    
    
    ajb: function(){
        var aa = this;
        if (aa.Fz) {
            aa.Fz.disable();
        }
        show("flashUploadContainer", false);
        return aa;
    },
    
    
    
    
    
    
    
    aHn: function(ahp, AB, BV){
        var aa = this;
        this.Fz = ahp;
        
        setTimeout(function(){
            aa.Ma = true;
            
            if (AB) {
            
                ahp.getFlash().initlize("multi");
            }
            else {
            
                aa.ajb();
                debug(BV, 61882714);
            }
        }, 100);
    },
    
    
    
    
    
    
    Ei: function(eu){
        if (isNaN(eu)) {
            return "";
        }
        if (eu > 1024 * 1024) {
            return parseInt(eu * 100 / (1024 * 1024)) / 100.0 + "M";
        }
        if (eu > 1024) {
            return parseInt(eu * 100 / 1024) / 100.0 + "K";
        }
        return eu + "Byte";
    },
    
    azE: function(){
        var aa = this;
        var aBC = this.Lh = new top.QMApplet({
            id: "uploaderApplet",
            win: window,
            onLoad: function(){
                var oE = this.getApplet();
                oE.ready();
                oE.checkPermissions();
            },
            onCheckPermission: function(aGf){
                S("dndMsg").innerHTML = "拖拽添加附件";
                if (aGf != "accept") {
                    aa.asz();
                }
            },
            onSelect: function(zR, Cg){
                aa.aiP(zR, Cg, this.getApplet(), "applet");
                
                
                aa.hideDragAndDropContainer();
                aa.Lh.getApplet().ready();
                
            },
            onProgress: function(fC, aGm){
                if (aa.uX(fC)) {
                    aa.zp(parseInt(aGm));
                }
            },
            onError: function(fC, rh, of){
                if (aa.uX(fC)) {
                    aa.xf(new String(rh), new String(of));
                }
            },
            onComplete: function(fC, nN){
                if (aa.uX(fC)) {
                    var lW = new String(nN), dZ = lW.indexOf("/data/");
                    
                    if (dZ != -1) {
                        lW = lW.substr(dZ).split("\n")[0];
                    }
                    
                    aa.QK(lW);
                }
            }
        });
        
        return aBC.getCode({
            code: "com.tencent.qqmail.applet.QQMailUploader",
            archive: "/zh_CN/htmledition/applet/lib/QQMailLibrary.jar,/zh_CN/htmledition/applet/uploader/QQMailUploader.jar",
            width: "100%",
            height: "100%"
        });
    },
    
    
    
    
    
    agh: function(){
        return (this.amo || 1) - 1;
    },
    
    
    
    
    
    
    aAH: function(ae){
        var aa = this, bp = aa.ml[ae], df = -1;
        
        if (bp) {
            var mK = aa.jE;
            for (var i = 0, aP = mK.length; i < aP; i++) {
                if (mK[i] == ae) {
                    df = i;
                    break;
                }
            }
        }
        
        return df;
    },
    
    
    
    
    
    
    agc: function(bn){
        return this.aAH(bn.replace(/^Uploader/, ""));
    },
    
    
    
    
    
    aAL: function(){
        return generateFlashCode("flashUploader", getPath("swf") + "uploader.swf?r=" + Math.random(), {
            width: "100%",
            height: "100%"
        }, {
            wmode: "transparent"
        });
    },
    
    
    
    
    
    
    aAI: function(bz){
        var Zw = this.aBw, cH = Zw[bz];
        
        if (!cH) {
            var rl = ['<div class="left" style="margin-right:5px;*margin-right:2px;">', '<input type="button" class="ico_att" style="margin:0 3px 0 0!important;margin:0 3px 2px 0;" />'];
            switch (bz) {
                case "tradition":
                    rl = rl.concat(['<input name="$name$" class="file" id="$name$" contentEditable="false" type="file" onchange="', 'setFileNameToSubject(this.value);', '" size=45>', '</div>']);
                    break;
                case "ie":
                    rl = rl.concat(['<input name="$name$" class="file upload" id="$name$" type="file" onchange="', 'QMAttach.afterAddFileWithIE(this);', '">', '<span id="S$name$"></span>&nbsp;<span id=SIZE$name$ name="$size$"></span></div>', '</div>']);
                    break;
                case "control":
                    rl = rl.concat(['<input name="$name$" ext="$ext$" id="$name$" type="hidden" value="$value$" filename="$filename$" filesize="$size$" disabled>', '<span id="S$name$">$filename$</span>&nbsp;<span id="SIZE$name$" name="$size$">($formatsize$)</span>', '</div>', '<div id="P$name$" class="left bd_upload" style="font-size:1px;width:100px;height:10px;overflow:hidden;margin:5px 5px 2px 0;border-width:1px;">', '<div id="PB$name$" class="toolbg toolbgline" style="width:0%;font-size:1px;height:10px;overflow:hidden;padding:0;"></div>', '</div>', '<div id="E$name$" class="left" ', 'style="display:none;color:red;margin:2px 5px 0 0;cursor:default">上传失败</div>', ]);
                    break;
            }
            Zw[bz] = cH = T(rl.concat(['<div class="left" style="margin-top:2px;">', '<a id="R$name$" style="margin-right:5px;display:none;" onclick="', 'QMAttach.retryUpload(\x27$name$\x27);', '">重试</a>', '<a onclick="delAttach(\x27$name$\x27)">删除</a>', '<a id="O$name$" style="margin-left:5px;display:none;" onclick="', 'QMAttach.disableControl(\x27$name$\x27);', '">去掉并改用传统上传器</a>', '</div>', '<div style="clear:both;"></div>']));
        }
        
        return cH;
    },
    
    
    
    
    
    aAg: function(){
        return (this.amo++);
    },
    
    
    
    
    aAi: function(){
        var cp = this.jE, is = this.ml;
        
        for (var i = 0, aP = cp.length; i < aP; i++) {
            var bp = is[cp[i]];
            if (bp.gC == "ready") {
                return bp;
            }
        }
        
        return null;
    },
    
    
    
    
    ayd: function(){
        return this.jE.length - this.Vb("");
    },
    
    
    
    
    Vb: function(fN){
        var cp = this.jE, is = this.ml, XQ = 0;
        
        for (var i = 0, aP = cp.length; i < aP; i++) {
            if (is[cp[i]].gC == fN) {
                XQ++;
            }
        }
        
        return XQ;
    },
    
    
    
    
    Vf: function(){
        return T("$host$/cgi-bin/upload?sid=$sid$&r=$r$").replace({
            host: [location.protocol, location.host].join("//"),
            sid: getSid(),
            r: Math.random()
        });
    },
    
    
    
    
    hideDragAndDropContainer: function(){
        var aA = this.FB;
        if (aA) {
            aA.style.left = aA.style.top = -400;
        }
    },
    
    
    
    
    azf: function(){
        var aa = this;
        
        setTimeout(function(){
            S("flashUploadContainer").innerHTML = aa.aAL();
            (new top.qmFlash({
                id: "flashUploader",
                win: window,
                
                onSelect: function(zR, Cg){
                    aa.aiP(zR, Cg, this.getFlash(), "flash");
                },
                onProcess: function(fC, Oi){
                    if (aa.uX(fC)) {
                        aa.zp(Oi);
                    }
                },
                onError: function(fC, rh, of){
                    if (aa.uX(fC)) {
                        aa.xf(rh, of);
                    }
                },
                onComplete: function(fC, nN){
                    if (aa.uX(fC)) {
                        aa.QK(nN);
                    }
                }
            })).setup(function(AB, BV){
                aa.aHn(this, AB, BV);
            });
        }, 10);
    },
    
    
    
    
    ayU: function(){
        var aa = this;
        
        setTimeout(function(){
            var Iz = S("dragAndDropTrap");
            if (Iz && location.protocol == "http:") {
                addEvent(document, "click", function(ag){
                    var cr = ag.srcElement || ag.target, aA = aa.FB;
                    
                    if (isObjContainTarget(Iz, cr)) {
                        if (!aa.Bt()) {
                            return;
                        }
                        
                        var gb = calcPos(S("AttachFrame")), OM = false, aJN;
                        
                        if (!aA) {
                            OM = true;
                            aA = aa.FB = document.createElement("div");
                            document.body.insertBefore(aA, document.body.firstChild);
                            aA.className = "qmEditorMenuBorder";
                            aA.style.cssText = "position:absolute;background:#fff;z-index:999;left:-400px;top:-400px;width:320px;";
                            aA.innerHTML = T(['<div style="padding:5px;font-size:12px;">', '<a class="right" onclick="QMAttach.hideDragAndDropContainer();">', '关闭', '</a>', '<div id="dndMsg">拖拽控件加载中</div>', '</div>', '<div style="height:150px;border-top:1px solid #aeaeae;"></div>']);
                        }
                        
                        if (OM || parseInt(aA.style.left) < 0) {
                            function Qy(){
                            
                                aA.style.left = gb[3];
                                aA.style.top = gb[2];
                            }
                            
                            if (OM) {
                                function Wa(){
                                    aA.lastChild.innerHTML = aa.azE();
                                }
                                
                                if (gbIsFF) {
                                    setTimeout(Wa, 100);
                                }
                                else {
                                    Wa();
                                }
                                
                                if (gbIsSafari) {
                                    setTimeout(Qy, 100);
                                }
                                else {
                                    Qy();
                                }
                                
                                runUrlWithSid("/cgi-bin/getinvestigate?stat=custom&type=OPEN_UPLOADAPPLET&loc=applet,compose,open,1");
                            }
                            else {
                                Qy();
                            }
                        }
                        else {
                            aa.hideDragAndDropContainer();
                        }
                    }
                    else 
                        if (aA && !isObjContainTarget(aA, cr)) {
                            aa.hideDragAndDropContainer();
                        }
                });
                
                show(Iz, true);
                Iz.title = "点击打开附件托盘，允许直接拖动文件到该区域添加附件。";
            }
        }, 10);
    },
    
    
    
    
    
    aDa: function(){
        return !this.LX &&
        top.qmFlash.isSupported() &&
        getCookieFlag("CCSHOW")[5] != 1;
    },
    
    
    
    
    
    KB: function(){
        return !this.LX &&
        detectActiveX(2, 1) &&
        location.protocol != "https:" &&
        getCookieFlag("CCSHOW")[5] != 1;
    },
    
    
    
    
    
    Bt: function(){
        if (!this.Ma) {
            return false;
        }
        
        if (!getGlobalVarValue("UPLOADEXPIRE")) {
            return true;
        }
        
        modelDialog(1, "邮箱提示", T(['<div style="padding:10px 0 5px 10px;text-align:left;">', '<img src="$imgPath$ico_question.gif" align="absmiddle" style="float:left;margin:14px 0 0 10px;">', '<div style="width:300px;height:80px;overflow:hidden;"><table width=300px height=80px><tr><td style="line-height:20px;">', '您最近24小时内发送超过<b style="color:red;">$size$M</b>的普通附件，在24小时期满前', '将不能发送大附件，为保证服务资源合理利用，请改用“超大附件”功能发送。', '</td></tr></table></div>', '</div>', '<div style="text-align:right;padding:0 10px 10px 0;">', '<input class="wd2 btn" type=button id="confirm" value=确认 style="margin-right:5px;" >', '<input class="wd2 btn" type=button id="cancel" value=取消>', '</div>']).replace({
            imgPath: getPath("image"),
            size: 200
        }), "confirm", ["confirm", "cancel"], [function(){
            hideModelDialog();
            initFileTransporter();
        }, function(){
            hideModelDialog();
        }
]);
        
        return false;
    },
    
    
    
    
    uX: function(dy){
        var gv = this.ja;
        return gv && gv.cx == dy;
    },
    
    
    
    
    JE: function(cK){
        return this.aBa.indexOf((cK || "").split(".").pop().toLowerCase() || "notype") !=
        -1
    },
    
    
    
    
    aGE: function(ae, bz, ce, cK, eu, aGs){
        this.jE.push(ae);
        this.ml[ae] = {
            az: ae,
            hx: bz,
            cx: ce,
            bZ: cK,
            fL: eu,
            
            gC: aGs == "control" ? "ready" : "",
            AC: null,
            aEN: false
        };
    },
    
    
    
    
    
    Zc: function(cK){
        var bZ = [cK.split("\\").pop() + " |"].join(""), uW = S("fattachlist"), dZ = uW ? uW.value.indexOf(bZ) : -1;
        
        if (dZ != -1) {
            uW.value = uW.value.substr(0, dZ) +
            uW.value.substr(dZ + bZ.length, uW.value.length - dZ -
            bZ.length);
        }
    },
    
    
    
    
    aGW: function(){
        var aa = this;
        mK = aa.jE, CB = aa.ml;
        
        for (var i = mK.length - 1; i >= 0; i--) {
            var az = mK[i], gC = CB[az].gC;
            if (gC && gC != "finish") {
                aa.delAttach("Uploader" + az);
            }
        }
        
        return aa;
    },
    
    
    
    
    auB: function(fA){
        delete this.ml[fA];
        return this.jE.splice(fA, 1);
    },
    
    
    
    
    atz: function(){
        var aa = this, gv = aa.ja;
        
        if (gv) {
            aa.ja = null;
            switch (gv.hx) {
                case "activex":
                    aa.rM.StopUpload();
                    break;
                case "flash":
                    aa.rM.cancel();
                    break;
                case "applet":
                    aa.rM.cancel(gv.cx);
                    break;
            }
            aa.nU(true);
        }
        
        return aa;
    },
    
    
    
    
    Qi: function(cK){
        var Gj = cK.length, akg = Gj - 6, aqe = cK.substr(0, akg), aqf = cK.substr(akg);
        
        return subAsiiStr(aqe, 8, "...") + aqf;
    },
    
    
    
    
    
    
    avS: function(kR){
        kR = kR.toLowerCase();
        if (kR.indexOf("k") != -1) {
            return parseFloat(kR) * 1024;
        }
        if (kR.indexOf("m") != -1) {
            return parseFloat(kR) * 1024 * 1024;
        }
        return parseFloat(kR);
    },
    
    
    
    
    awf: function(ae, aFV, anD){
        var bZ = "Uploader" + ae;
        
        E(aFV.split("|"), function(PS){
            show(PS + bZ, true);
        });
        
        E(anD.split("|"), function(PS){
            show(PS + bZ, false);
        });
        
        return this;
    },
    
    
    
    
    GR: function(sQ, fN, rh, of){
        var az = sQ.az, RT = "", Fs = "";
        
        switch (fN) {
            case "ready":
            case "progress":
                RT = "P";
                Fs = "E|O|R";
                this.zp(0, 1, sQ);
                break;
            case "finish":
                Fs = "E|O|R|P";
                break;
            case "error":
                RT = "E|O|R";
                Fs = "P";
                S("EUploader" + az).title = T("错误类型：$type$\n错误消息：$msg$").replace({
                    type: rh,
                    msg: of
                });
                break;
        }
        
        sQ.gC = fN;
        return this.awf(az, RT, Fs);
    },
    
    
    
    
    
    nU: function(axx){
        var aa = this;
        
        if (!aa.ja) {
            var BU = aa.aAi();
            if (BU) {
                var rQ, adu = {
                    activex: aa.aof,
                    flash: aa.anE,
                    applet: aa.aop
                }[BU.hx];
                
                aa.ja = BU;
                
                if (adu) {
                    try {
                        aa.GR(BU, "progress");
                        adu.call(aa);
                    } 
                    catch (at) {
                        rQ = at.msg;
                    }
                }
                else {
                    rQ = "no unpload func:" + BU.hx;
                }
                
                if (rQ) {
                    aa.xf("__start__", rQ);
                }
            }
            else 
                if (axx && typeof aa.onfinish == "function") {
                    try {
                        aa.onfinish.call(aa);
                    } 
                    catch (at) {
                        doPageError(at.message, "compose.js", "QMAttach.onfinish");
                    }
                    aa.onprogress = null;
                    aa.onfinish = null;
                }
        }
        
        return aa;
    },
    
    
    
    
    QK: function(nN){
        var gv = this.ja;
        if (gv) {
            var lW = trim(nN);
            
            if (lW.indexOf('/data/') == 0) {
                gv.AC = lW.split('/').pop();
                
                this.zp(100, 1).GR(gv, "finish").ajG().nU(true);
            }
            else {
                this.xf("__response__", lW);
            }
        }
    },
    
    
    
    
    
    xf: function(rh, of){
        this.GR(this.ja, "error", rh, of).ajG().nU(true);
    },
    
    
    
    
    
    
    
    zp: function(Oi, ajR, sQ){
        var aa = this, gv = sQ || aa.ja;
        
        if (gv) {
            var dJ = Math.floor(Oi * (ajR || 0.95)), pT = now();
            
            if (gv.dJ != dJ) {
                gv.dJ = dJ;
                
                
                if (pT - aa.aDF >= 100 ||
                ajR == 1 ||
                sQ) {
                    aa.aDF = pT;
                    
                    
                    S("PBUploader" + gv.az).style.width = dJ + "%";
                    
                    if (!sQ && typeof aa.onprogress == "function") {
                        try {
                            var XU = aa.ayd(), aCt = XU - 1 -
                            aa.Vb("ready");
                            
                            aa.onprogress.call(aa, Math.floor((dJ +
                            (aCt * 100)) /
                            XU));
                        } 
                        catch (at) {
                        }
                    }
                }
            }
        }
        
        return aa;
    },
    
    
    
    
    aof: function(){
        var aa = this, hK = aa.rM = top.createActiveX(2), yF = aa.zl = now();
        
        hK.OnEvent = function(bt, arF, Ol, Ok, aKy){
            if (aa.zl == yF) {
                var aKv = {
                    "1": function(){
                        aa.xf("activex progress error", [Ol, Ok].join("|"));
                    },
                    "2": function(){
                        aa.zp(100 * Ol / Ok);
                    },
                    "3": function(){
                        if (hK.ResponseCode != "200") {
                            aa.xf("activex response error " + hK.ResponseCode, [Ol, Ok].join("|"));
                        }
                        else {
                            aa.QK(hK.Response);
                        }
                    }
                }[arF]();
            }
        };
        
        hK.URL = aa.Vf();
        hK.AddHeader("Cookie", document.cookie);
        hK.AddFormItem("sid", 0, 0, getSid());
        hK.AddFormItem("mode", 0, 0, "file");
        
        hK.AddFormItem("UploadFile", 4, 0, this.ja.cx);
        
        hK.StartUpload();
    },
    
    aop: function(){
        var aa = this, oE = aa.Lh.getApplet();
        
        aa.rM = oE;
        aa.zl = now();
        
        oE.addUploadVar("sid", getSid());
        oE.addUploadVar("mode", "file");
        oE.addUploadVar("lang", "utf8");
        oE.setUploadUrl(this.Vf());
        
        var Bj = oE.upload(this.ja.cx);
        if (Bj != "ok") {
            doPageError(["uploadWithApplet(", this.ja.cx, ") Err:", Bj].join(""), "compose.js", 3094);
        }
    },
    
    
    
    
    anE: function(){
        var aa = this, xc = aa.Fz.getFlash();
        
        aa.rM = xc;
        aa.zl = now();
        
        xc.addUploadVar("sid", getSid());
        xc.addUploadVar("mode", "file");
        xc.addUploadVar("lang", "utf8");
        xc.setUploadUrl(this.Vf());
        
        xc.upload(this.ja.cx, "UploadFile");
    },
    
    asz: function(){
        var aA = this.FB;
        if (aA) {
            aA.lastChild.innerHTML = ['<table style="width:100%;height:100%;">', '<tr><td align="center">', '<div><b>您禁止了该功能使用</b></div>', '<div>您必须退出浏览器才能重新开启。</div>', '</td></tr>', '</table>'].join("");
        }
    }
};





function delAttach(bn){
    QMAttach.delAttach(bn);
}





function delExistAttach(ae){
    QMAttach.delExistAttach(ae);
}





function setFileNameToSubject(cK){
    var qa = S("subject"), ye = arguments.callee;
    
    if (cK && qa && !qa.value &&
    !ye.aEC) {
        var fk = cK.split("\\").pop();
        qa.value = fk.split(".").slice(0, -1).join(".") ||
        fk;
        ye.aEC = true;
    }
}








function OutputAttachBtn(RA, FM, Hg){
    return QMAttach.outputBtn(RA, FM, Hg);
}









function AddExistBigAttach(NO, aS, cK, aI, kR){
    var adt = S("BigAttach");
    if (!adt) {
        return;
    }
    
    var aR = document.createElement("div");
    adt.appendChild(aR);
    
    aR.className = "addrtitle attsep";
    
    aR.innerHTML = T(["<input type='button' class='ico_attbig' align='absmiddle' style='margin:0 1px 0 0!important;margin:0 3px 2px 0'>", "<input type='hidden' name='fid' value='$fid$' />", "<span class='black' expiretime='$expire$'>", "$filename$", "<span style='font-weight:normal;'> ($size$)</span><wbr><wbr>", "</span>", "<a href='$url$'></a>", " &nbsp;<a onclick='show(this.parentNode, false);'>删除</a>"]).replace({
        expire: NO,
        filename: cK,
        size: kR,
        url: aS,
        fid: aI || ""
    });
    
    setFileNameToSubject(cK);
}










function AddBigAttach(NO, cK, kR, aS, dy, aI){
    aS = aS.replace(/&code=/ig, "&temp=");
    AddExistBigAttach(NO, [(getDomain() == "qq.com" ? "http://mail.qq.com" : "http://mail.foxmail.com"), aS, "&code=", dy, "&s=email"].join(""), cK, aI, kR);
}





function IniBigAttach(fQ){
    var VY = GelTags("hr", S("source"));
    for (var i = VY.length - 1; i >= 0; i--) {
        var obj = VY[i];
        if (!(obj = obj.parentNode) || obj.id != "QQMailBigAttach") {
            continue;
        }
        if (fQ) {
            var cQ = GelTags("span", obj);
            for (var j = cQ.length - 1; j >= 0; j--) {
                var av = cQ[j];
                if (av.className != "qqmailbgattach") {
                    continue;
                }
                
                var Nq = av.firstChild.innerHTML;
                if (typeof(Nq) == "undefined") {
                    Nq = av.firstChild.nodeValue;
                }
                var avE = trim(av.firstChild.nextSibling.innerHTML.split(",")[0]).replace(/\(|\)/ig, "");
                
                AddExistBigAttach(av.getAttribute("expiretime"), av.getAttribute("downloadlink"), Nq, "", avE);
            }
        }
        obj.parentNode.removeChild(obj);
    }
}





function InitColorSubject(){
    var kJ = S("cpanelBtn");
    if (!kJ) {
        return;
    }
    
    var Mj = ["11", "13", "14", "10"];
    var aDp = ["橙红色", "深绿色", "鲜紫色", "纯黑色"];
    var bR = ["彩色主题..."];
    var hw = [null];
    for (var i = 0; i < Mj.length; i++) {
        bR.push(["<div id='", Mj[i], "' class='s", Mj[i], "_bg' style='margin-top:3px;width:15px;height:", (gbIsIE ? 10 : 15), "px;float:left;'></div>&nbsp;", aDp[i]].join(""));
        
        hw.push(function(ag){
            var obj = ag.target || ag.srcElement;
            SetSubjectColor(obj.id || obj.childNodes[0].id);
        });
    }
    bR.push("<div style='float:right;'><a href='http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=11&&no=138' target='_blank'>帮助</a></div>");
    hw.push(null);
    kJ.onclick = function(){
        var bh = calcPos(this);
        showPageMenu(this, "colorsubject", bh[1] - 100, bh[2], "100px", "21px", bR, hw);
    };
}





function ShowSubjectMsg(fQ){
    var qa = S("subject");
    if (fQ) {
        if (qa.value == "") {
            qa.value = gsMsgNoSubject;
            setTimeout(function(){
                ShowSubjectMsg(false);
            }, 5000);
        }
    }
    else {
        if (qa.value == gsMsgNoSubject) {
            qa.value = "";
            
            try {
                document.selection.createRange().select();
            } 
            catch (at) {
            }
        }
    }
}




function SetSubjectColor(ahH){
    S("xqqstyle").value = ahH;
    S("subject").className = "txt input_wd s" + ahH;
    ShowSubjectMsg(true);
    show('cpanel', false);
}









function initAddrCtrl(ao){
    var dB = ao;
    E(["to", "cc", "bcc", "sc"], function(uv){
        var VC = S(uv + "AreaCtrl", dB);
        var eF = S(uv, dB);
        if (VC && eF) {
            (new qmAddrInput({
                id: uv,
                win: dB,
                tabIndex: eF.tabIndex,
                dom: {
                    container: VC
                },
                style: {
                    text: "addr_text",
                    
                    normal: "addr_base addr_normal",
                    over: "addr_base addr_over attbg",
                    select: "addr_base addr_select fn_list",
                    
                    error: "addr_base addr_error",
                    errover: "addr_base addr_errover attbg",
                    errsel: "addr_base addr_errsel fn_list",
                    
                    move: "addr_move",
                    mover: "addr_mover"
                },
                onfocus: function(){
                    SetFocus(uv);
                }
            })).disabled(eF.disabled).add(eF.value);
            eF.value = "";
        }
    });
    
    
    dB.focus();
    
    
    initAddrLinkEvent(dB);
}





function initAddrLinkEvent(ao){
    E(["to", "cc", "bcc", "sc"], function(xr){
        var WE = xr.toUpperCase();
        var ha = qmAddrInput.get(xr, ao);
        var jH = S(["a" + WE], ao);
        var JA = S([xr + "_btn"], ao);
        
        if (ha && jH) {
            jH.onclick = xr == "sc" ? function(){
                if (ShowSeparatedCopy()) 
                    runUrlWithSid(T('/cgi-bin/getinvestigate?stat=compose_send&t=$t$&sub=sc').replace(location.getParams()));
            }
 : function(){
                if (!this.disabled && !ShowInputCtrl(WE) &&
                GetFocus() == xr) {
                    SetFocus("to");
                }
                qmAddrInput.get(GetFocus(), ao).focus("end");
            };
        }
        
        if (ha && JA) {
            JA.onclick = function(){
                ao.uploadWindow = openDialog("add_address", T('/zh_CN/htmledition/cardaddr.html?ifid=mainFrame&textid=$id$').replace({
                    id: xr
                }), false, 480, 433);
            };
        }
    });
}






function SetFocus(uv){
    if (uv) {
        arguments.callee.Fy = uv;
    }
}





function GetFocus(){
    return SetFocus.Fy || "to";
}






function AddAddr(aqt, aHg){
    var hK = qmAddrInput.get(GetFocus(), window);
    hK.add(aqt);
    if (!aHg) {
        hK.focus("end");
    }
}






function ShowSeparatedCopy(aey){
    var aA = S("trSC");
    var jN = !isShow(aA);
    var Ea = qmAddrInput.get("sc", window)[jN &&
    !aey ? "clear" : "flush"]();
    var uE = !jN ? Ea.get("json") : null;
    var SR = {};
    
    if (uE) {
        for (var i = 0, ap = uE.length; i < ap; i++) {
            var aC = uE[i];
            SR[aC.addr] = aC.format;
        }
    }
    
    E(["to", "cc", "bcc"], function(ae){
        var WD = ae.toUpperCase();
        var rW = S("a" + WD);
        var ha = qmAddrInput.get(ae, window).flush();
        
        if (rW) {
            setClass(rW, jN ? rW.className +
            " nounderline cur_default" : trim(rW.className.replace(/nounderline cur_default/, "")));
            rW.disabled = jN;
        }
        
        show(S("tr" + WD), !jN &&
        (!rW || rW.getAttribute("show") == "true"));
        
        if (ha) {
            ha.disabled(jN);
            
            if (!aey && jN) {
                Ea.add(ha.get().join("; "));
            }
            
            if (uE) {
                for (var it = [], aC = null, i = 0, ap = uE.length; i < ap; i++) {
                    if (ha.hasAddr((aC = uE[i]).addr)) {
                        it.push(aC.format);
                        delete SR[aC.addr]
                    }
                }
                ha.clear().add(it.join("; "));
            }
        }
    });
    
    S("aSC").innerHTML = (jN ? "取消" : "") + "分别发送";
    S("separatedcopy").value = jN.toString();
    
    Ea.disabled(!jN);
    show(aA, jN);
    
    if (jN) {
        Ea.focus("end");
    }
    else {
        var it = [];
        for (var bu in SR) {
            it.push(bu);
        }
        qmAddrInput.get("to", window).add(it.join("; "));
        qmAddrInput.get("to", window).focus("end");
    }
    
    return jN;
}








function ShowInputCtrl(ae, awm){
    var aA = S("tr" + ae);
    var jH = S("a" + ae);
    var gJ = isShow(aA);
    var avT = qmAddrInput.get(ae.toLowerCase(), window);
    
    show(aA, !gJ);
    
    jH.innerHTML = (gJ ? "添加" : "删除") + jH.innerHTML.substr(2, 2);
    jH.setAttribute("show", gJ ? "false" : "true");
    avT.disabled(gJ)[awm == false || gJ ? "length" : "focus"]("end");
    
    setCookieFlag('CCSHOW', ae == "CC" ? 0 : 1, gJ ? 0 : 1);
    
    return !gJ;
}








function HideRightArea(fQ, auJ){
    var Uo = S('rightArea');
    if (!Uo) {
        return;
    }
    var b = Uo.style.display == '' && (fQ == 2 ? 1 : !fQ);
    S('rightAreaBtn').innerHTML = '<input type="button" onfocus="this.blur()" class=' +
    (b ? 'nextfd />' : 'prefd />');
    show(Uo, !b);
    if (!auJ) {
        setCookieFlag('CCSHOW', 2, (b ? '1' : '0'));
    }
}




function InitCookieSetting(){
    var Nt = getCookie("CCSHOW") || "";
    var Zl = window.qmAddrInput && qmAddrInput.get("cc", window);
    var acL = window.qmAddrInput && qmAddrInput.get("bcc", window);
    
    if (Zl && (Zl.length() || Nt.charAt(0) == 1)) {
        ShowInputCtrl("CC", false);
    }
    
    if (acL && (acL.length() || Nt.charAt(1) == 1)) {
        ShowInputCtrl("BCC", false);
    }
    
    if (S("rightArea") && Nt.charAt(2) == 1) {
        HideRightArea(0, 1);
    }
}





function LoadValue(auY){
    if (auY && GetPageEditor()) {
        sU("100%");
        GetInputObj("content_compare", null, true).value = GetPageEditor().getContent();
        sU(gbIsIE ? "auto" : "100%");
    }
    
    var aa = arguments.callee;
    var cM = aa.hE;
    E(aa.aiv, function(ce, fC){
        var aO = GetInputObj(ce, null, true);
        if (aO && aO.value != cM[fC]) 
            cM[fC] = aO.value;
    });
}

LoadValue.aiv = ["to", "cc", "bcc", "subject", "content_compare"];
LoadValue.hE = [];





function amJ(){
    var aaB = LoadValue.aiv;
    var cM = LoadValue.hE;
    if (GetPageEditor()) {
        sU("100%");
        GetInputObj("content_compare", null, true).value = GetPageEditor() &&
        GetPageEditor().getContent();
        sU(gbIsIE ? "auto" : "100%");
    }
    
    for (var i = aaB.length - 1; i >= 0; i--) {
        var hK = GetInputObj(aaB[i], null, true);
        var bL = (hK && hK.value || "").replace(/<Param .*?\">/ig, "");
        var aoC = (cM[i] || "").replace(/<Param .*?\">/ig, "");
        if (bL != aoC) {
            return true;
        }
    }
    
    return false;
}





function SetNeedCloseConform(avr){
    SetNeedCloseConform.aDw = avr;
}





function IsNeedCloseConform(){
    return SetNeedCloseConform.aDw;
}





function ConfirmCheckBeforeClose(){
    top.gSaveComposeContent = null;
    
    if (window.getFlashCurrentState && getFlashCurrentState() == 401) {
        return "recording";
    }
    
    if (S("voiceid") && S("voiceid").value) {
        return "recorded";
    }
    
    if (amJ()) {
        return "content";
    }
    
    return "exit";
}





function ClosePage(){
    var wk;
    
    if (IsNeedCloseConform()) {
        var ED = (new Array(42)).join("-") + (new Array(5)).join(" ");
        
        if (isDisableCtl("sendbtn")) {
            hideModelDialog();
            switchFolder("folder_newmail");
            
            return T([ED, '\n提示：您确定要终止当前行为？\n', ED]);
        }
        else 
            if ((wk = ConfirmCheckBeforeClose()) != "exit") {
                hideModelDialog();
                switchFolder("folder_newmail");
                
                return T([ED, "\n", {
                    "content": '提示：未保存的内容将会丢失。',
                    "recording": '提示：您正在录制音视频，未发送将会丢失。',
                    "recorded": '提示：您已经录制音视频，未发送将会丢失。'
                }[wk], "\n", ED]).replace({
                    content: GetPageId() == "note" ? "记事" : "邮件"
                });
            }
    }
    
    SetNeedCloseConform(true);
}





function RedirectExitURLId(qz){
    if (qz == 1 &&
    (QMHistory.tryBackTo("readmail") || QMHistory.tryBackTo("mail_list"))) {
        return;
    }
    
    var lT = ["/cgi-bin/addressbook/addr_listall?", "/cgi-bin/today?", "/cgi-bin/readtemplate?t=compose_card&today_tips=107&", "/cgi-bin/readtemplate?t=compose&", "/cgi-bin/grouplist?t=compose_group&", "/cgi-bin/note_list?t=note_first_page&info=1&", "/cgi-bin/mail_list?folderid=8&t=mail_list_group&", "/cgi-bin/readtemplate?t=compose_audiomail&", "/cgi-bin/addr_listall?func=birthcard&t=birth_friendlist&", "/cgi-bin/readtemplate?t=compose_video&", "/cgi-bin/readtemplate?t=compose_postcard&"];
    
    if (qz < 0 || qz >= lT.length) {
        qz = 1;
    }
    
    goUrlMainFrm((qz == 1 ? QMHistory.getUrl(QMHistory.getLastRecordId()) : null) ||
    (lT[qz] + "sid=" + getSid()), false, qz >= 2 &&
    qz <= 4);
}





function ExitConfirm(PJ){
    var wk;
    var adL = function(){
        if (typeof PJ == "function") {
            PJ();
        }
        else {
            globalEval(PJ);
        }
    }
    
    var Ij = location.getParams()["s"] == "draft" &&
    !location.getParams()["backurl"];
    var wm = S("fmailid") && S("fmailid").value;
    
    if (wm == location.getParams()["mailid"]) {
        wm = "";
    }
    
    if (IsNeedCloseConform() &&
    ((wk = ConfirmCheckBeforeClose()) != "exit" ||
    (!Ij && wm && !gCompose.agI))) {
        disableAutoSave();
        
        if (GetPageEditor()) {
            GetPageEditor().saveRange();
        }
        
        var ahY = S("qqgroupid") && !S("qqgroupid").disabled;
        var cf = {
            exitstyle: "",
            delstyle: "display:none",
            exitbtn: "否"
        };
        
        if (GetPageId() == "note") {
            cf.title = "内容已被修改，确定保存该记事吗？";
        }
        else 
            if (GetPageId() == "voice") {
                switch (wk) {
                    case "recording":
                        cf.title = "内容录制中，确定不发送此音视频邮件吗？";
                        break;
                    case "recorded":
                        cf.title = "已录制内容，确定不发送此音视频邮件吗？";
                        break;
                    default:
                        cf.title = "内容已被修改，确定不发送此音视频邮件吗？";
                }
                cf.savestyle = "display:none;";
                cf.exitbtn = "确定";
            }
            else 
                if (GetPageId() == "postcard") {
                    cf.title = "内容已被修改，确定不发送此明信片吗？";
                    cf.savestyle = "display:none;";
                    cf.exitbtn = "确定";
                }
                else 
                    if (ahY) {
                        cf.title = "内容已被修改，确定不发送此群邮件吗？";
                        cf.savestyle = "display:none;";
                        cf.exitbtn = "确定";
                    }
                    else {
                        cf.title = wm && !Ij ? "此邮件已保存为草稿，是否需要保留？" : Ij ? "草稿已被修改，是否要保存此次改动？" : "内容已被修改，是否要将此邮件存为草稿？";
                        if (!Ij) {
                            cf.exitstyle = "display:none;";
                            cf.delstyle = "";
                        }
                    }
        
        return modelDialog(1, "离开提示", T(["<div style='padding:25px 10px 0 12px;text-align:left;'><b>$title$</b></div>", "<div style='padding:23px 10px 10px 10px;text-align:right;'>", "<input type=button id='btn_exit_save' name='btn_exit_save' class='btn wd2' value='是' style='$savestyle$' >", "<input type=button class='btn wd2' value='$exitbtn$' id='btn_exit_notsave' name='btn_exit_notsave' style='$exitstyle$'>", "<input type=button class='btn wd2' value='否' id='btn_delete_save' name='btn_delete_save' style='$delstyle$'>", "<input type=button class='btn wd2' id='btn_not_exit' value='取消'>", "</div>"]).replace(cf), ahY ||
        GetPageId() == "voice" ||
        GetPageId() == "note" ? "btn_exit_notsave" : "btn_delete_save", ["btn_exit_save", "btn_exit_notsave", "btn_delete_save", "btn_not_exit"], [function(){
            if (wk != "exit") {
                DoProcess(GetPageId() == "note" ? "" : "savedraft", {
                    card: "card",
                    note: "send"
                }[GetPageId()] ||
                "save", GetPageId() == "note" ? 1 : 0);
            }
            else {
                fireMouseEvent(getDialogObj("btn_exit_notsave"), "click");
            }
        }, function(){
            disableAll(true);
            getDialogObj("btn_exit_notsave").disabled = true;
            SetNeedCloseConform(false);
            adL();
            hideModelDialog();
        }, function(){
            var Ul = function(){
                if (isDialogShow("btn_exit_notsave")) 
                    return fireMouseEvent(getDialogObj("btn_exit_notsave"), "click");
            };
            if (wm) {
                var kO = new QMAjaxRequest("/cgi-bin/mail_mgr");
                kO.onComplete = function(hI){
                    if (hI.responseText.indexOf("isMainFrameError") != -1) {
                        kO.onError();
                    }
                    else {
                        hiddenMsg();
                        reloadLeftWin();
                        Ul();
                    }
                };
                kO.onError = function(){
                    showError("删除草稿失败");
                    Ul();
                };
                kO.send(top.T('sid=$sid$&Fun=$fun$&mailaction=$mailaction$&mailid=$mailid$').replace({
                    sid: getSid(),
                    fun: "PerDel",
                    mailaction: "mail_del",
                    mailid: wm
                }));
                
                getDialogObj("btn_delete_save").disabled = true;
                disableAll(true);
                showInfo("正在删除草稿");
            }
            else {
                Ul();
            }
        }, function(){
            hideModelDialog();
        }
], null, 135, function(){
            disableAll(false);
            enableAutoSave();
            if (GetPageEditor()) {
                GetPageEditor().loadRange();
            }
        });
        
    }
    
    SetNeedCloseConform(false);
    adL();
}






function SaveContentGoUrl(aS){
    top.gSaveComposeContent = filteSignatureTag(GetPageEditor().getContent(), "FILTE<:");
    top.gSaveComposeSubject = S("subject").value;
    top.gSaveComposeBigAttachHTML = S("BigAttach").innerHTML;
    top.gSaveDefaultFontInfo = GetPageEditor().getDefaultFontInfo();
    
    SetNeedCloseConform(false);
    goUrlMainFrm(aS, false, true);
}





function SelectGroup(ae){
    ae = String(ae).indexOf("@groupmail.qq.com") == -1 ? (ae + "@groupmail.qq.com") : ae;
    var xX = S("Gname_" + ae);
    if (xX) {
        S("qqgroupid").value = ae;
        S("groupname").value = xX.innerHTML;
    }
}




function UseStationery(){
    ChangeTab("stationery_div");
    if ((S("stationery").src == "") ||
    (S("stationery").src.indexOf("javascript:") == 0)) 
        setTimeout('S("stationery").src="/cgi-bin/readtemplate?t=stationery&sid="+getSid();', 10);
}





function ChangeTab(bn){
    var ci = ["AddrTab", "stationery_div", "card_div"];
    var aHt = ["addr_cmd", "stationery_cmd", "card_cmd"];
    var aDq = ["cptab", "cptab cpslt"];
    for (var i = 0, ap = ci.length; i < ap; i++) {
        var xX = S(ci[i]);
        if (xX) {
            var df = (bn == ci[i]) ? 1 : 0;
            S(aHt[i]).className = aDq[df];
            show(xX, df);
        }
    }
}






function PN(){
    if (arguments.callee.aDx) {
        return;
    }
    arguments.callee.aDx = true;
    
    var func = gbIsIE || gbIsFF ? fResizeEditorForIEAndFF : fResizeEditorForOtherBrower;
    
    
    func();
    setInterval(func, 1500);
    
}








function fResizeEditor(RR, Og, dT, RL){
    if (RR == Og || (dT == RL && RR < Og)) {
        return;
    }
    dT = RR - Og + dT;
    dT = dT < RL ? RL : dT;
    GetPageEditor().getEditorArea().style.height = dT;
}




function fResizeEditorForIEAndFF(){
    if (!GetPageEditor()) {
        return;
    }
    var hH = GetPageEditor().getEditorArea();
    var tu = arguments.callee.Ll;
    if (!tu) {
        tu = arguments.callee.Ll = parseInt(hH.style.height);
    }
    var b = document.body;
    fResizeEditor(b.clientHeight, gbIsIE ? b.scrollHeight + 5 : b.offsetHeight +
    13, parseInt(hH.style.height), tu);
}




function fResizeEditorForOtherBrower(){
    if (!GetPageEditor()) {
        return;
    }
    var hH = GetPageEditor().getEditorArea();
    var tu = arguments.callee.Ll;
    if (!tu) {
        tu = arguments.callee.Ll = parseInt(hH.style.height);
    }
    var Vm = S("qqmaileditorlastchild");
    if (!Vm) {
        insertHTML(document.body, "beforeEnd", "<div id=qqmaileditorlastchild></div>");
        Vm = S("qqmaileditorlastchild");
    }
    fResizeEditor(S("mainFrame", top).clientHeight, calcPos(Vm)[2] + 10, parseInt(hH.style.height), tu);
}






function AutoSave(awQ){
    if (awQ && amJ() && isEnabledAutoSave()) 
        GetPageId() != "note" ? DoProcess("autosave", "save") : DoProcess("note_autosave", "save", true);
    
    setTimeout(function(){
        AutoSave(true);
    }, GetPageId() == "note" ? 180000 : 180000);
}

function isEnabledAutoSave(){
    var agZ = arguments.callee.agY;
    return typeof agZ != "boolean" ? true : agZ;
}

function disableAutoSave(){
    isEnabledAutoSave.agY = false;
}

function enableAutoSave(){
    isEnabledAutoSave.agY = true;
}







function aJx(dj, iR){
    if (S("mailbgmusic")) {
        S("mailbgmusic").value = "use";
    }
    
    var ZK = getUserInfo("alias");
    var aoN = iR.song ? T('<b>$songDisp$</b>($singerDisp$)').replace({
        songDisp: htmlEncode(iR.song),
        singerDisp: htmlEncode(iR.singer)
    }) : "";
    var avt = iR.song ? T('<a href="http://music.soso.com/music.cgi?w=$songorg$&pl=$singerorg$" target="_blank">查看</a>&nbsp;').replace({
        songorg: iR.song,
        singerorg: iR.singer
    }) : T('<a href="$url$" target="_blank">下载</a>').replace({
        url: iR.url
    });
    return T(['$content$', '<player id="cmd:bgmusic" url="$url$" song="$song$" singer="$singer$"></player> ', '<div id=QQMailBgMusicInfo style="font:12px;color:#909090;">', '<br><br><br><br>你的朋友 $alias$ 为这封邮件插入了背景音乐 - $bgmusic$', '$viewurl$&nbsp;', '<a id="_bgmusic_play_btn_" href="http://mail.qq.com/zh_CN/htmledition/playmusic.html?song=$song$&singer=$singer$&sender=$encodealias$&url=$encodeurl$" target="_blank">播放</a>', '</div>']).replace({
        content: dj,
        url: iR.url,
        alias: ZK,
        bgmusic: aoN,
        viewurl: avt,
        song: iR.song ? encodeURIComponent(iR.song) : "",
        singer: iR.singer ? encodeURIComponent(iR.singer) : "",
        encodeurl: iR.url ? encodeURIComponent(iR.url) : "",
        encodealias: encodeURIComponent(ZK)
    });
}








function DoProcessCheck(eU, de, aiY){
    if (de == "voice" && !CheckVoiceBeforeCompose()) {
        return false;
    }
    
    if (de == "card" && window.setBirthCardReceiver &&
    !setBirthCardReceiver(eU == "savedraft" ? 0 : 1)) {
        return false;
    }
    
    
    try {
        var Ig = {};
        var LE = ["to", "cc", "bcc", "sc"];
        var Ik = false;
        var CY = [];
        
        if (!(de == "card" && window.setBirthCardReceiver) &&
        GetPageId() != "qq") {
            E(LE, function(ae){
                var ha = Ig[ae] = qmAddrInput.get(ae, window);
                var eF = S(ae, window);
                if (ha && eF) {
                
                    var OS = eF.disabled = ha.flush().isDisabled();
                    
                    var bL = eF.value = OS ? "" : ha.get().join("; ");
                    if (!OS) {
                    
                        CY = OS ? "" : CY.concat(ha.get("error"));
                        
                        if (!Ik) {
                            Ik = !!bL;
                        }
                    }
                }
            });
        }
        else {
            Ik = true;
        }
        
        if (GetPageId() != "note" &&
        GetPageId() != "group" &&
        !(S("separatedcopy") && S("separatedcopy").disabled) &&
        (de == "voice" || de == "send" || (de == "card" && eU == ""))) {
            if (!Ik) {
                if (de == "card") {
                    showError(gsMsgNoCardSender);
                    SplashToCtrl(6, false, 1);
                    ChangeTab("AddrTab");
                    show("cardTip", true);
                }
                else 
                    if (GetPageId() == "postcard") {
                        showError(gsMsgNoSender);
                        SplashToCtrl(6, false, 1);
                    }
                    else {
                        showError(gsMsgNoSender);
                        SplashToCtrl(6, false, 0);
                    }
                for (var i = 0, ap = LE.length; i < ap; i++) {
                    var ha = Ig[LE[i]];
                    if (ha && !ha.isDisabled()) {
                        ha.focus("end");
                        break;
                    }
                }
                
                return false;
            }
            
            if (CY.length) {
                modelDialog(1, "收件人格式错误", T(['<table width="100%" cellspacing="0" cellpadding="0" style="height:113px;">', '<tr><td valign="top" style="line-height:18px;padding:12px 10px 0 12px;text-align:left;word-break:break-all;">', '您填写的以下收件人存在格式错误：', '<div style="height:53px;overflow:hidden;margin-top:3px;">', '<b style="color:red;">$result$</b>', '</div>', '</td></tr>', '<tr><td valign="bottom" align="right" style="padding:3px 10px 0 0;">', '<input type=button class="btn wd2" value="确定" onclick="top.hideModelDialog();">', '</td></tr>', '</table>']).replace({
                    result: CY.join('</b>","<b style="color:red;">')
                }), "dialogAddressParser");
                return false;
            }
            
            
            
            top.gSendmailSubject = S("subject").value;
            
        }
    } 
    catch (at) {
    }
    
    
    try {
        if ((de == "send" || de == "card") &&
        !S("qqgroupid").disabled &&
        S("qqgroupid").value.indexOf("@") == -1) {
            if (de == "card") {
                showError("请选择一个QQ群");
                ChangeTab("AddrTab");
                show("cardTip", true);
                window.scroll(0, 0);
            }
            else {
                showError("请选择一个QQ群");
            }
            return false;
        }
        
        if (de == "send" && S("mailtype").value == "vote") {
            if (S("votesubject").value == "") {
                showError("请填写投票主题");
                return false;
            }
            
            var uQ = SN("option");
            for (var i = 0, ap = uQ.length; i < ap; i++) {
                if ((uQ[i].value == "") && (i < 2)) {
                
                    showError(["请填写选项", i + 1, "的内容"].join(""));
                    return false;
                }
            }
        }
    } 
    catch (at) {
    }
    
    
    try {
        if (S("subject").value == gsMsgNoSubject) {
            S("subject").value = "";
        }
    } 
    catch (at) {
    }
    
    
    try {
        var lQ = QMAttach.checkAttachWarnningType();
        if (lQ.length != 0) {
            msgBox("您的附件中包含可执行文件：" + lQ.join(", ") +
            "，出于安全性考虑，邮件中不允许包含此类附件", "dialog", true, 0, "失败信息");
            return false;
        }
        
        var aBc = QMAttach.getAttachSize(), akY = QMAttach.getAttachLimit();
        if (aBc > akY) {
            QMAttach.showAttachLimit(akY);
            return false;
        }
        
        var pa = false;
        for (var bG in Ig) {
            if (pa) {
                break;
            }
            var cp = Ig[bG].get("json");
            for (var i = 0, ap = cp.length; i < ap; i++) {
                var Pz = cp[i].addr;
                if (Pz.indexOf("@vip.qq.com") == -1 &&
                Pz.indexOf("@qq.com") == -1 &&
                Pz.indexOf("@foxmail.com") == -1) {
                    pa = true;
                    break;
                }
            }
        }
        
        if (eU != "savedraft" && eU != "autosave" && pa &&
        aIK[1] >= 10 * 1024 * 1024) {
            modelDialog(1, "温馨提示", T(["<div style='padding:12px 10px 0 12px;text-align:left;'><b>", "附件较大(<b style='color:red;'>$size$</b>)，目标邮箱有可能不接收。", "</b></div>", "<div style='padding:10px;text-align:left;'>", "需要向<b>非QQ邮箱</b>发送较大的附件怎么办?<br>", "&nbsp;&nbsp;&nbsp;1、确定目标邮箱支持接受的附件大小。<br>", "&nbsp;&nbsp;&nbsp;2、改用“<input type='button' class='ico_attbig' align='absmiddle' style='margin:0 3px 0 0!important;margin:0 3px 2px 0' />超大附件”发送。<br>", "&nbsp;&nbsp;&nbsp;3、改为发向朋友的QQ邮箱，可以接收50M的普通附件。", "</div>", "<div style='padding:0 10px 10px 10px;text-align:right;'>", "<input type=button class='btn wd2' id='btn_send' value='确定' />&nbsp;", "<input type=button class='btn wd2' id='btn_not_exit' value='取消' />", "</div>"]).replace({
                size: Ei(aIK[1])
            }), "btn_send", ["btn_send", "btn_not_exit"], [function(){
                hideModelDialog();
                setTimeout(function(){
                    aiY();
                }, 100);
            }, function(){
                hideModelDialog();
            }
], null, 190);
            return false;
        }
    } 
    catch (at) {
        debug(["attach check", at.message], 61882714);
    }
    
    
    try {
        var oW = location.getParams()["s"];
        if (!arguments.callee.aEQ &&
        eU != "savedraft" &&
        eU != "autosave" &&
        oW != "reply" &&
        oW != "reply_all" &&
        oW != "forward" &&
        oW != "draft" &&
        oW != "content" &&
        S("AttachFrame") &&
        !QMAttach.hasAttach(true)) {
        
            var abX = isShow(S("subject")) ? S("subject").value : "";
            var aG = GetPageEditor().getContent(true);
            
            if (abX.indexOf("附件") != -1 || aG.indexOf("附件") != -1 ||
            abX.indexOf("attachment") != -1 ||
            aG.indexOf("attachment") != -1) {
                arguments.callee.aEQ = true;
                
                confirmBox({
                    msg: ['<div style="padding:12px 10px 0 12px;"><b>', "您的邮件内容提到附件，但您可能忘记了添加附件。", '</b></div>', '<div style="padding:10px;">', "你确定继续发送？", '</div>'].join(""),
                    width: 430,
                    onreturn: function(cv){
                        if (cv) {
                            setTimeout(function(){
                                aiY();
                            }, 100);
                        }
                    }
                });
                
                return false;
            }
        }
    } 
    catch (at) {
        debug(["attach add", at.message], 61882714);
    }
    
    return true;
}







function doProcessSafe(eU, de, tW){
    try {
        tW();
    } 
    catch (at) {
        var aa = arguments.callee, db = GetPageId() == "note" ? "日志保存失败 " : "邮件发送失败 ";
        
        if (at.dispmode == "dialog") {
            msgBox(at.message, "dialog", true, 0, db);
        }
        else 
            if (de == "voice" || de == "send" ||
            (de == "card" && eU == "")) {
                msgBox(T(['<div>', '失败原因：$desc$ ', '<div style="display:$cache$">失败码：$code$ ', '(<a href="http://support.qq.com/cgi-bin/beta1/titlelist_simple?pn=0&order=3&fid=350" target="_blank" title="把失败原因与失败码发到邮箱反馈意见，我们会尽快处理！">报告失败原因</a>)', '</div>', '</div>', '<div style="color:red;display:$cache$">', '请尝试清空浏览器缓存，然后重新进入邮箱。', '<a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=7&&no=339">查看帮助</a>', '</div>']).replace({
                    desc: at.message,
                    code: aa.eD,
                    cache: at.clrcache == false ? "none" : ""
                }), "dialog", true, 0, db);
                recodeComposeStatus(4, null, [aa.eD, encodeURIComponent(at.message)].join('|'), true);
            }
            else {
                showError(at.message);
            }
        
        disableAll(false);
        enableAutoSave();
    }
}









function DoProcess(eU, de, RH, aez, aee){
    doProcessSafe(eU, de, function(){
        doProcessSafe.eD = 00;
        
        if (isDisableCtl("sendbtn")) {
            return;
        }
        
        doProcessSafe.eD = 10;
        
        if (!aee &&
        !DoProcessCheck(eU, de, function(){
            DoProcess(eU, de, RH, aez, true);
        })) {
            return;
        }
        
        doProcessSafe.eD = 20;
        
        disableAutoSave();
        var kt = S("frm");
        kt.target = "actionFrame";
        
        doProcessSafe.eD = 30;
        
        var aG = null;
        var aD = GetPageEditor();
        if (!aD) {
            if (window.GetSendContent) {
                aG = window.GetSendContent(eU, de, RH, aez, aee);
            }
            else {
                throw {
                    message: "无法获取编辑器"
                };
            }
        }
        else {
            sU("100%");
            aG = aD.getContent();
            sU(gbIsIE ? "auto" : "100%");
            
            if (aD.getContentType() == "html") {
                var je = aD.getDefaultFontInfo();
                for (var i in je) {
                    if (je[i]) {
                        aG = T(['<div style="$fontName$$fontSize$$fontColor$;">', '$content$', '</div>']).replace(extend(je, {
                            fontName: je.fontName &&
                            ["font-family:", je.fontName, ";"].join(""),
                            fontSize: je.fontSize &&
                            ["font-size:", je.fontSize, ";"].join(""),
                            fontColor: je.fontColor &&
                            ["color:", je.fontColor, ";"].join(""),
                            content: aG
                        }));
                        break;
                    }
                }
            }
            
            try {
            
                GetInputObj("content_compare", null, true).value = aG;
            } 
            catch (at) {
            }
        }
        
        if (aG == null) {
            throw {
                message: "无法获取编辑器内容"
            };
        }
        
        doProcessSafe.eD = 31;
        
        aG = filteSignatureTag(Df(aG), "FILTE<:");
        
        doProcessSafe.eD = 32;
        
        
        if (de == "voice") {
            aG = CombineVoiceMail(aG, S("voiceid").value, S("voicename").value);
            DisableRecord();
        }
        
        doProcessSafe.eD = 33;
        
        if (aD && aD.getBgMusicInfo()) {
            aG = aJx(aG, aD.getBgMusicInfo());
        }
        
        doProcessSafe.eD = 40;
        
        
        var By = "";
        if (S("BigAttach")) {
            var os = GelTags("div", S("BigAttach"));
            var ayj = new RegExp("bmp|doc|eml|exl|gif|html|jpg|mov|pdf|ppt|psd|rar|swf|tu|txt");
            var atH = T(['<div style="padding:10px 0;font-size:12px;">', '<div title="%filename%&#10;&#13;文件大小：%filesize%&#10;&#13;到期时间：%expiredtimeString%" class="bigatt_bt">', '<div style="float:left;margin:2px 8px 0 0;">', '<a target="_blank" href="%downloadlink%"><img border="0" src="http://res.mail.qq.com/zh_CN/htmledition/images/fj/fu_%filetype%.gif"/></a>', '</div>', '<div class="name_big" >', '<span class=\'qqmailbgattach\' expiretime="%expiretime%" downloadlink="%downloadlink%"><a style="color:#000;text-decoration:none;" target="_blank" href="%downloadlink%">%filename%</a><span style="color:#A0A0A0;"> (%filesize%, %expiredtimeDesc%)</span>', '</span>', '<div class="down_big">', '<a target="_blank" href="%downloadlink%">查看下载信息</a><span style="display:none;">：%downloadlink%</span>', '</div>', '</div>', '</div>', '</div>'], "%");
            for (var i = os.length - 1; i >= 0; i--) {
                if (isShow(os[i])) {
                    var nq = GelTags("span", os[i])[0];
                    var Ka = nq.getAttribute("expiretime");
                    
                    
                    var xx = formatDate(new Date(parseInt(Ka) * 1000), "$YY$年$MM$月$DD$日 $hh$:$mm$");
                    
                    var Wh = GelTags("a", os[i])[0].href;
                    
                    var fk = nq.firstChild.nodeValue;
                    var No = nq.firstChild.nodeValue.split(".").pop();
                    var aqi = new RegExp("\\((.+)\\)", "ig").exec(nq.childNodes[1].firstChild.nodeValue)[1];
                    
                    if (!ayj.test(No)) {
                        No = "qita";
                    }
                    
                    if (aD && aD.getContentType() == "text") {
                        By += (nq.innerText || nq.textContent) +
                        (xx != "NaN" ? " (有效时间到: " +
                        xx +
                        ")" : "") +
                        "\n链接: " +
                        Wh +
                        "\n\n";
                        
                    }
                    else {
                        By += atH.replace({
                            filename: fk,
                            filesize: aqi,
                            filetype: No,
                            expiretime: Ka,
                            expiredtimeString: (xx != "NaN" ? xx : ""),
                            expiredtimeDesc: (Ka == "-1" ? "无限期" : xx + " 到期"),
                            downloadlink: Wh
                        });
                    }
                }
            }
        }
        
        doProcessSafe.eD = 50;
        
        if (By) {
            var aDG = T(['<div id=QQMailBigAttach style="padding: 2px; margin-bottom: 15px;background-color:#E0ECF9;width:auto;font-family:Verdana,Arial,Tahoma;font-size:14px;" >', '<hr style="display:none;" />', '<div style="text-align:left;padding: 6px 0pt 10px 6px;">', '<b style="font-size: 14px;"><img border="0" align="absmiddle" style="margin-right:4px;" src="http://res.mail.qq.com/zh_CN/htmledition/images/icon_att.gif"/>从%domain%邮箱发来的超大附件</b>', '</div>', '<div style="padding: 0pt 8px 6px 12px;background:#fff;">', '<div style="clear:both;" >%bigattachlist%</div>', '</div>', '</div>'], "%");
            var ZF = "";
            var pk = getDomain() == "qq.com" ? "QQ" : "foxmail.com";
            var aEg = aD &&
            aD.getContentType() == "text";
            
            if (aEg) {
                ZF = "以下文件通过" + pk + "邮箱的中转站发给您。保存时间有限制，请及时提取。";
                aG += "\n\n\n" + new Array(60).join("-") + "\n" +
                ZF +
                "\n" +
                By;
            }
            else {
                aG += aDG.replace({
                    domain: pk,
                    bigattachlist: By
                });
            }
        }
        
        doProcessSafe.eD = 60;
        
        
        aG = fixNonBreakSpace(aG);
        if (QMCharCode.hasNonGbkChar(aG)) {
            RH = true;
            GetInputObj("sendcharset").value = "utf-8";
        }
        
        kt.content.value = aG;
        
        doProcessSafe.eD = 70;
        
        disableAll(true);
        
        doProcessSafe.eD = 71;
        
        eU != null ? kt.t.value = eU : null;
        kt.actiontype.value = de;
        top.isSaveData = false;
        
        createPanel(top, "sendmailFrame", null, "doSendFinishCheck(this)");
        kt.target = "sendmailFrame";
        
        function aIv(){
            if (de == "voice" || de == "send" ||
            (de == "card" && eU == "")) {
                doProcessSafe.eD = 72;
                
                if (de == "card") {
                    if (!CheckHasSetCard()) 
                        throw {
                            message: gsMsgNoCard,
                            clrcache: false
                        };
                    
                    ComposeCard(aG);
                }
                
                kt.actiontype.value = "send";
                
                doProcessSafe.eD = 73;
                
                showProcess(1, 1, GetPageId() == "note" ? "记事保存中" : gsMsgSend);
                
                doProcessSafe.eD = 74;
                
                if (GetPageId() != "note" &&
                kt.action.indexOf("/cgi-bin/compose_send") != -1) {
                    top.gSendTimeStart = new Date();
                }
                
                doProcessSafe.eD = 75;
            }
            else {
                top.isSaveData = true;
                if (eU == "savedraft") {
                    if (de == "card") {
                        if (!CheckHasSetCard()) {
                            throw {
                                message: gsMsgNoCard
                            };
                        }
                        
                        ComposeCard(aG);
                    }
                    showProcess(1, 1, gsMsgAutoSave);
                }
                else {
                    showProcess(1, 1, GetPageId() == "note" ? "记事正在被保存" : gsMsgAutoSave);
                }
            }
            
            doProcessSafe.eD = 80;
            
            top.isUseActiveXCompose = false;
            kt.submit();
            
            doProcessSafe.eD = 90;
            
            
            if (kt.verifycode) {
                kt.verifycode.value = "";
            }
            
            if (kt.verifycode_cn) {
                kt.verifycode_cn.value = "";
            }
        }
        
        function aHA(dJ){
            showProcess(2, 1, dJ, "附件上传中");
        }
        
        function aiI(axd){
            doProcessSafe(eU, de, function(){
                doProcessSafe.eD = 71.1;
                var hF = true;
                
                if (!axd && QMAttach.hasUploadError()) {
                    hF = confirm(T("上传附件出错！\n您确定要$action$这封缺失附件的邮件吗？").replace({
                        action: de == "save" ? "保存" : "发送"
                    }));
                }
                
                doProcessSafe.eD = 71.2;
                if (hF) {
                    QMAttach.setInput(S("cattachlist"));
                    doProcessSafe.eD = 71.3;
                    aIv();
                }
                else {
                    cancelDoSend();
                }
            });
        }
        
        if (eU == "autosave") {
            aiI(true);
        }
        else {
            QMAttach.onprogress = aHA;
            QMAttach.onfinish = aiI;
            QMAttach.upload();
        }
    });
}







function nS(ag){
    var ak = location.href;
    if (ag.keyCode == 10 || ag.keyCode == 13 ||
    ag.keyCode == 83) {
        if ((ag.keyCode != 83 && ag.ctrlKey) ||
        (ag.keyCode == 83 && ag.altKey)) {
            fireMouseEvent(SN("sendbtn")[0], "click");
        }
        else 
            if (ag.keyCode == 10 || ag.keyCode == 13) {
                var iK = ag.srcElement || ag.target;
                if (iK.id == "subject" || iK.id == "to" || iK.id == "cc" ||
                iK.id == "bcc") {
                    return false;
                }
            }
    }
    else 
        if (ag.ctrlKey) {
            if (ag.keyCode == 83 || ag.keyCode == 115) {
                if (isEnableAutoSave() && ak.indexOf("=compose_") == -1 &&
                ak.indexOf("=compose") != -1) {
                    DoProcess('savedraft', 'save');
                }
            }
            else 
                if ((ag.keyCode == 86 || ag.keyCode == 118) &&
                ak.indexOf("t=compose") != -1 &&
                ak.indexOf("_card") == -1 &&
                !ag.cancelBubble) {
                    QMAttach.selectFile("clipboard");
                }
        }
    return true;
}




function initFileTransporter(){
    if (!detectActiveX(1, 1) && gbIsIE) {
        return showInstallActiveXDialog("filetransport");
    }
    
    openDialog("uploadattach_qqmail", T("/cgi-bin/ftnExs_files?sid=$sid$&t=exs_attachment&smethod=new&ftntype=1").replace({
        sid: getSid()
    }));
    
    ftSendStatic("1002");
}





function showInstallActiveXDialog(ar){
    var azO = function(){
        if (detectActiveX(0, 2)) {
        
            var aDs = {
                "ico_attbig_disabled": "ico_attbig",
                "ico_screensnap_disable": "ico_screensnap"
            };
            var gT = SN("activexControlBtn");
            for (var i = gT.length - 1; i >= 0; i--) {
                var ZB = aDs[gT[i].className];
                if (ZB) {
                    gT[i].className = ZB;
                }
            }
            
            if (GetPageEditor()) {
                GetPageEditor().updateToolBarUI("ScreenSnap");
            }
            
            return true;
        }
        return false;
    };
    
    var aeH = function(){
        hideModelDialog();
        FocusPageEditor(0);
    };
    
    var azU = function(){
        getActionWin().location = "/zh_CN/activex/" + QMAXInfo.get("exe");
        show(getDialogObj("setup"), false);
        show(getDialogObj("setupMsg"), false);
        show(getDialogObj("cancel"), false);
        show(getDialogObj("checkMsg"), false);
        show(getDialogObj("download"), true);
        show(getDialogObj("downloadMsg"), true);
        show(getDialogObj("check"), false);
    };
    
    var wt = function(){
        show(getDialogObj("detectContainer"), true);
        show(getDialogObj("optContainer"), false);
        setTimeout(function(){
            show(getDialogObj("detectContainer"), false);
            show(getDialogObj("optContainer"), true);
            show(getDialogObj("download"), false);
            show(getDialogObj("downloadMsg"), false);
            
            if (azO()) {
                show(getDialogObj("setup"), false);
                show(getDialogObj("checkMsg"), false);
                show(getDialogObj("check"), false);
                show(getDialogObj("cancel"), false);
                
                show(getDialogObj("finishMsg"), true);
                show(getDialogObj("finish"), true);
            }
            else {
                show(getDialogObj("setup"), true);
                show(getDialogObj("checkMsg"), true);
                show(getDialogObj("check"), true);
                show(getDialogObj("cancel"), true);
            }
        }, 500);
    };
    
    var abD = (getDomain() == "qq.com" ? "QQ" : "foxmail.com");
    var db = abD + "邮箱控件安装提示";
    var Dw = T(['<div id="optContainer">', '<div style="padding:20px 0 0 10px;height:135px;text-align:left;overflow:hidden;">', '<div style="height:80px;float:left;margin-top:-6px;">', '<img src="$images_path$ico_question.gif" />', '</div>', '<div id="setupMsg" >', '$msg$<br>安装后，您可以使用以下功能：<br>', '<img src="$images_path$pic_activexeffect.gif" /><br/>', '</div>', '<div id="downloadMsg" style="display:none;">', '文件正在下载中...<span class="addrtitle">', ' ( 没有出现下载框，可<a href="/zh_CN/activex/$exe$" target="_blank">点击此处</a>下载 )', '</span><br><br>', '<b>请在<b style="color:red;">运行安装成功后</b>再点击确定。</b>', '</div>', '<div id="checkMsg" style="display:none;">', '系统检测到控件还<b>没安装成功</b>。', '<br>请确定是否已安装成功，若已安装成功请选择再次检测。', '</div>', '<div id="finishMsg" style="display:none;">', '<b>控件已安装<b style="color:red;">成功</b>。</b><br>您可以马上享受控件带来的愉快体验。<br>', '<img src="$images_path$pic_activexeffect.gif" /><br/>', '</div>', '</div>', '<div style="text-align:right;padding:0 10px 16px 0;">', '<input class="wd3 btn" type=button id=setup value=下载安装 >', '<input class="wd2 btn" type=button id=download value=确定 style="display:none;" >', '<input class="wd3 btn" type=button id=check value=再次检测 style="display:none;" >', '<input class="wd2 btn" type=button id=cancel value=取消>', '<input class="wd2 btn" type=button id=finish value=完成 style="display:none;">', '</div>', '</div>', '<div id="detectContainer" style="padding-top:60px;text-align:center;display:none;">', '<img src="$images_path$ico_loading2.gif" align="absmiddle" style="margin-right:20px;">', '系统正在检测控件是否安装成功...', '</div>']);
    var jR = detectActiveX(0) ? T('<b>您的$mailname$邮箱$controlname$控件版本过低，请升级到新的版本。</b>') : T('<b>您还未安装$mailname$邮箱$controlname$控件。</b>');
    var Zy = "截屏";
    var pi = "400px";
    var pQ = "210px";
    
    switch (ar) {
        case "paste":
            jR = T('<b>您是否希望粘贴插入图片或者粘贴添加附件？</b><br>$mailname$邮箱截屏控件将能帮助您解决该问题。');
            pQ = "230px";
            break;
        case "filetransport":
            Zy = "中转站";
            break;
    }
    modelDialog(1, db, Dw.replace({
        images_path: getPath("image", true),
        msg: jR.replace({
            mailname: abD,
            controlname: Zy
        }),
        exe: QMAXInfo.get("exe")
    }), "setup", ["setup", "download", "check", "cancel", "finish"], [azU, wt, wt, aeH, aeH], pi, pQ);
    
    
    if ({
        "compose": true,
        "card": true,
        "note": true
    }[GetPageId()]) {
        AutoSave(true, null);
    }
}







function initSendTimeInput(apI, sn){
    var uI = new Date();
    var ea = trim(apI.replace(/\D/ig, " ").replace(/ +/ig, " ")).split(" ");
    var iN = uI.getFullYear();
    if (ea[0] < uI.getMonth() + 1) {
        iN++;
    }
    document.write(T(['<textarea style="display:none;" name="sendtimetip" disabled>', '发信时间已设在<b class="grn">%nick%</b>好友生日，您可以自行修改：', '</textarea>', '<input type="hidden" name="sendtimeyear" value="%year%" />', '<input type="hidden" name="sendtimemonth" value="%month%" />', '<input type="hidden" name="sendtimeday" value="%day%" />', '<input type="hidden" name="sendtimehour" value="0" />', '<input type="hidden" name="sendtimemin" value="0" />'], "%").replace({
        nick: htmlEncode(sn),
        year: iN,
        month: ea[0],
        day: ea[1]
    }));
}







function SetMultiSignatureSelect(){
    try {
        var bV = getAllSignature();
    } 
    catch (at) {
        return setTimeout(arguments.callee, 500);
    }
    
    if (!bV) {
        return;
    }
    
    var aA = S("signSelContainer");
    if (aA) {
        var TX = T(['<div class="left" style="margin:4px 0 0 0;">', '&nbsp; | &nbsp;签名：', '</div>', '<div class="left"  style="margin:2px 0 0 2px">', '<select style="width:86px;" onchange="SetSignature(\x27sign\x27,this.value)" >$options$</select>', '</div>']);
        var Dy = T("<option value='$value$'>$content$</option>");
        var Ur = [Dy.replace({
            content: "不使用",
            value: "-1"
        })];
        
        for (var az in bV) {
            var aC = bV[az];
            if (az >= 0 && az < 100) {
                Ur.push(Dy.replace({
                    value: az,
                    content: aC[1] || "签名1"
                }));
            }
        }
        
        if (Ur.length <= 1) {
            return;
        }
        
        aA.innerHTML = TX.replace({
            options: Ur.join("")
        });
        
        arguments.callee.VB = GelTags("select", aA)[0];
        
        SyncMultiSignatureData();
    }
}




function SyncMultiSignatureData(){
    if (SetMultiSignatureSelect.VB) {
        var acc = apb("sign");
        SetMultiSignatureSelect.VB.value = getAllSignature()[acc] ? acc : -1;
    }
}






function apb(ar){
    var aD = GetPageEditor();
    if (!aD) {
        return -1;
    }
    
    var VM = aD.getContentTags(ar)[0];
    if (!VM) {
        return -1;
    }
    
    return VM.getAttribute("signid");
}







function akN(ar, ce, ae){
    var aD = GetPageEditor();
    if (!aD) {
        return;
    }
    
    var nd = {};
    function uL(ar){
        return nd[ar] = aD.getContentTags(ar)[0];
    }
    
    function Kd(ar, bt, aGh){
        if (!aD) {
            return;
        }
        
        var Do = bt.parentNode;
        if (Do && Do.tagName == "DIV" &&
        Do.firstChild == bt) {
            bt = Do;
        }
        
        insertHTML(bt, aGh, T('<div><$type$></$type$></div>').replace({
            type: ar
        }));
        
        uL(ar);
    }
    
    uL("sign");
    uL("qzone");
    uL("taotao");
    uL("includetail");
    
    
    
    if (!ce && !nd[ar]) {
        return;
    }
    
    if (!nd.sign) {
        var aO = nd.qzone || nd.taotao ||
        uL("includetail");
        var abj = "beforeBegin";
        if (!aO) {
            aO = aD.getContentObj("QQMAILSTATIONERY") ||
            aD.getContentTags("body")[0];
            abj = "beforeEnd";
        }
        
        Kd("sign", aO, abj);
    }
    
    if (!nd.qzone) {
        Kd("qzone", nd.sign, "afterEnd");
    }
    
    if (!nd.taotao) {
        Kd("taotao", nd.qzone, "afterEnd");
    }
    
    var iK = nd[ar];
    iK.innerHTML = ce;
    iK.setAttribute("signid", ae);
    
    if (ar == "sign") {
        SyncMultiSignatureData();
    }
    
    setTimeout(FocusPageEditor);
}






function SetSignature(ar, jP){
    if (jP == -1) {
    
        return akN(ar, "", -1);
    }
    
    
    var mU = arguments.callee;
    function Zg(){
        setTimeout(function(){
            mU(ar, jP);
        }, 200);
    }
    
    var bL = "";
    try {
        switch (ar) {
            case "sign":
                var acQ = top.getAllSignature()[jP];
                if (acQ && parseInt(jP) < 100) {
                    bL = top.getSignatureHeader() + acQ[0];
                }
                break;
            case "qzone":
                bL = getGlobalVarValue("QZONESIGN");
                if (!bL) {
                    if (!S("signatureFrame", top) ||
                    S("signatureFrame", top).src.indexOf("&qzonesign=disp") == -1) {
                        top.reloadSignature(false, true);
                    }
                    return Zg();
                }
                break;
            case "taotao":
                bL = genTaotaoSign(top.g_uin);
                break;
            default:
                return;        }
    } 
    catch (at) {
        return Zg();
    }
    
    akN(ar, bL, jP);
}











var QMDateCtrl = {
    defaultPattern: '$YY$&nbsp;年&nbsp;$MM$&nbsp;月&nbsp;$DD$&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;$hh$&nbsp;时&nbsp;$mm$&nbsp;分',
    Nd: ["year", "month", "day", "hour", "min"],
    aDQ: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
};









QMDateCtrl.createDateSelecter = function(nL){
    var az = nL.id;
    var aA = nL.container;
    
    aA.setAttribute("qmDateCtrlId", az);
    aA.innerHTML = this.aAD(nL.id, nL.pattern, nL.patternSymbol, nL.yearRange, nL.defaultTip);
    
    this.BZ(az, aA, nL.onchange);
    this.BC(az, aA, nL);
};







QMDateCtrl.disable = function(bX, awH){
    var aa = this;
    var az = this.agi(bX);
    E(this.Nd, function(ar){
        var aO = aa.lp(az, bX, ar);
        if (aO) {
            aO.disabled = awH;
        }
    });
};






QMDateCtrl.getDate = function(bX){
    var yr = this.getDateValue(bX);
    return new Date(yr.year, yr.month - 1, yr.day, yr.hour, yr.min);
};






QMDateCtrl.getDateValue = function(bX){
    var aa = this;
    var cg = {};
    var az = this.agi(bX);
    E(this.Nd, function(ar){
        cg[ar] = aa.lp(az, bX, ar).value;
    });
    return cg;
};







QMDateCtrl.getYearRange = function(aih, EP){
    var amu = aih == "now" ? (new Date).getFullYear() : aih;
    return [amu, amu + EP - 1]
};








QMDateCtrl.aiW = function(ae, bX){
    var iN = this.lp(ae, bX, "year").value;
    var Gl = this.lp(ae, bX, "month").value;
    var KZ = this.lp(ae, bX, "day");
    var arJ = KZ.value;
    var yz = KZ.options;
    var sG = this.aDQ[Gl - 1];
    
    if (Gl == 2 && (iN % 4 == 0 && iN % 100 != 0 || iN % 400 == 0)) {
        sG++;
    }
    
    if (yz.length > sG) {
        yz.length = sG;
        if (arJ > sG) {
            KZ[sG - 1].selected = true;
        }
    }
    else 
        if (yz.length != sG) {
            for (var i = yz.length + 1; i <= sG; i++) {
                yz[i - 1] = new Option(i, i);
            }
        }
}







QMDateCtrl.agi = function(bX){
    return bX.getAttribute("qmDateCtrlId");
};








QMDateCtrl.lp = function(ae, bX, ar){
    var az = ae + ar;
    var TQ = GelTags("select", bX);
    for (var i = 0, ap = TQ.length; i < ap; i++) {
        if (TQ[i].id == az) {
            return TQ[i];
        }
    }
    return null;
};









QMDateCtrl.aAD = function(ae, apW, apV, aha){
    return T(apW || this.defaultPattern, apV).replace({
        YY: this.ya(ae + "year", aha[0], aha[1]),
        MM: this.ya(ae + "month", 1, 12),
        DD: this.ya(ae + "day", 1, 31),
        hh: this.ya(ae + "hour", 0, 23),
        mm: this.ya(ae + "min", 0, 11, 5)
    });
};









QMDateCtrl.ya = function(ae, anX, aoD, anW){
    var Dy = T('<option value="$value$">$value$</option>');
    var TX = T('<select name="$id$" id="$id$">$optionCode$</select>');
    var Yi = [];
    
    for (var i = anX; i <= aoD; i++) 
        Yi.push(Dy.replace({
            value: i * (anW || 1)
        }));
    
    return TX.replace({
        id: ae,
        optionCode: Yi.join("")
    });
};







QMDateCtrl.BC = function(ae, bX, aqJ){
    var Xs = new Date;
    Xs.setTime(now() + (60 * 60 * 1000));
    
    function AZ(aqa, ark, anF){
        var bW = parseInt(aqJ[aqa], 10);
        return isNaN(bW) ? (Xs[ark]() + (anF || 0)) : bW;
    };
    
    this.lp(ae, bX, "year").value = AZ("defaultYear", "getFullYear");
    this.lp(ae, bX, "month").value = AZ("defaultMonth", "getMonth", 1);
    this.lp(ae, bX, "day").value = AZ("defaultDay", "getDate");
    this.lp(ae, bX, "hour").value = AZ("defaultHour", "getHours");
    this.lp(ae, bX, "min").value = Math.floor(AZ("defaultMin", "getMinutes") / 5) *
    5;
    
    this.aiW(ae, bX);
};







QMDateCtrl.BZ = function(ae, bX, Fq){
    var aa = this;
    E(this.Nd, function(ar){
        aa.ash(ae, bX, ar, Fq);
    });
};








QMDateCtrl.ash = function(ae, bX, ar, Fq){
    var aa = this;
    this.lp(ae, bX, ar).onchange = function(){
        if (ar == "year" || ar == "month") {
            aa.aiW(ae, bX);
        }
        if (typeof Fq == "function") {
            Fq.call(aa, aa.getDate(bX));
        }
    };
};








var QMCharCode = {

    ix: [[0, 127], [164, 164], [167, 168], [176, 177], [183, 183], [215, 215], [224, 225], [232, 234], [236, 237], [242, 243], [247, 247], [249, 250], [252, 252], [257, 257], [275, 275], [283, 283], [299, 299], [324, 324], [328, 328], [333, 333], [363, 363], [462, 462], [464, 464], [466, 466], [468, 468], [470, 470], [472, 472], [474, 474], [476, 476], [593, 593], [609, 609], [711, 711], [713, 715], [729, 729], [913, 929], [931, 937], [945, 961], [963, 969], [1025, 1025], [1040, 1103], [1105, 1105], [8208, 8208], [8211, 8214], [8216, 8217], [8220, 8221], [8229, 8230], [8240, 8240], [8242, 8243], [8245, 8245], [8251, 8251], [8364, 8364], [8451, 8451], [8453, 8453], [8457, 8457], [8470, 8470], [8481, 8481], [8544, 8555], [8560, 8569], [8592, 8595], [8598, 8601], [8712, 8712], [8719, 8719], [8721, 8721], [8725, 8725], [8730, 8730], [8733, 8736], [8739, 8739], [8741, 8741], [8743, 8747], [8750, 8750], [8756, 8759], [8765, 8765], [8776, 8776], [8780, 8780], [8786, 8786], [8800, 8801], [8804, 8807], [8814, 8815], [8853, 8853], [8857, 8857], [8869, 8869], [8895, 8895], [8978, 8978], [9312, 9321], [9332, 9371], [9472, 9547], [9552, 9587], [9601, 9615], [9619, 9621], [9632, 9633], [9650, 9651], [9660, 9661], [9670, 9671], [9675, 9675], [9678, 9679], [9698, 9701], [9733, 9734], [9737, 9737], [9792, 9792], [9794, 9794], [12288, 12291], [12293, 12311], [12317, 12318], [12321, 12329], [12353, 12435], [12443, 12446], [12449, 12534], [12540, 12542], [12549, 12585], [12832, 12841], [12849, 12849], [12963, 12963], [13198, 13199], [13212, 13214], [13217, 13217], [13252, 13252], [13262, 13262], [13265, 13266], [13269, 13269], [19968, 40869], [63788, 63788], [63865, 63865], [63893, 63893], [63975, 63975], [63985, 63985], [64012, 64015], [64017, 64017], [64019, 64020], [64024, 64024], [64031, 64033], [64035, 64036], [64039, 64041], [65072, 65073], [65075, 65092], [65097, 65106], [65108, 65111], [65113, 65126], [65128, 65131], [65281, 65374]]

};






QMCharCode.findGbkChar = function(EJ){
    var Gq, Hz, tq;
    var ix = this.ix;
    Gq = 0;
    Hz = ix.length - 1;
    while (Gq <= Hz) {
        tq = Math.floor((Gq + Hz) / 2);
        if (EJ > ix[tq][1]) {
            Gq = tq + 1;
        }
        if (EJ < ix[tq][0]) {
            Hz = tq - 1;
        }
        if (EJ >= ix[tq][0] && EJ <= ix[tq][1]) {
            return 1;
        }
    }
    return 0;
};






QMCharCode.hasNonGbkChar = function(dj){
    for (var i = Math.min(dj.length, 10000) - 1; i >= 0; i--) {
        var app = dj.charCodeAt(i);
        if (this.findGbkChar(app) == 0) {
            return true;
        }
    }
    return false;
};










function SplashToCtrl(ajj, aEf, fA){
    var aa = arguments.callee;
    if (!aa.time || !aEf) {
        aa.time = 0;
    }
    if (fA == 1) {
        aa.objId = "bccAreaCtrl"
    }
    else {
        aa.objId = "toAreaCtrl"
    }
    if (S(aa.objId).focus) {
        S(aa.objId).style.cssText = (aa.time % 2 == 0) ? "background-color:#f9f2b3;" : "background-color:#fff;";
    }
    if (++aa.time < ajj) {
    
        setTimeout(function(){
            SplashToCtrl(ajj, true, fA);
        }, 200);
    }
}
