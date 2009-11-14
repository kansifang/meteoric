var pageSize = 6, pageIndex, nextArchive, BitOffset_MsgBoard = 31 - 22;
var pageArray = [];//archive,pageNo
var msgList;
var maxContentLength = 1000;
var isVip = ((parseInt(top.g_UserBitmap.charAt(14), 16) & (1 + 4)) > 0);//is biz or star
var isStar = (parent.getBitMapFlag(7) == 1);
var isBiz = (parent.getBitMapFlag(5) == 1);
var isSmall = (top.zoneMode == "qzone");
var bProcessing = false;

window.editorCallbackToDoList = [];
/* ------------------------- ���԰� ------------------------- */
if (top.g_XDoc[22] && selectNodes(top.g_XDoc[22], "/rss/channel")[0] && selectNodes(top.g_XDoc[22], "/rss/channel")[0].getAttribute("nextArchive")) {
    top.g_XDoc["msgboard_0_1"] = top.g_XDoc[22];
    //ȥ��̬��������г���pageSize��Ķ�������
    var x = selectSingleNode(top.g_XDoc["msgboard_0_1"], "/rss/channel");
    var tmp_items = selectNodes(x, "item");
    for (var i = tmp_items.length - 1; i >= pageSize; i--) 
        x.removeChild(tmp_items[i]);
    if (tmp_items.length > pageSize && x.getAttribute("nextArchive") < 0) 
        x.setAttribute("nextArchive", "0");
}

function initializeMsgBoard(){
    if (!!top.g_XDoc["msgboard_0_1"]) {
        if (Math.ceil(Math.random() * 20) == 8) {
            sendPV('msgstatic', 'msgstatic.qzone.qq.com');
        }
    }
    
    if (top.g_iUin == top.g_iLoginUin) 
        document.getElementById("leaveWordEditor").style.display = "";
    turnToPage(1);
    attachScrollElement(document.body);
    if (top.QZoneVersion == "4.0") 
        document.body.onkeydown = scrollBlog;
    document.getElementById("msgList").style.clear = "both";
}

function turnToPage(pageNo){
    if (pageNo == 0) {
        top.showMsgbox("�Ѿ��ǵ�һҳ", 0, 2000);
        return;
    }
    if (nextArchive < 0 && pageNo > (pageIndex + 1)) {
        top.showMsgbox("�Ѿ������һҳ", 0, 2000);
        return;
    }
    if (top.getBitMapFlag(5)) {
        top.sendBrandPvUvScript(top.g_iUin, 4, 4, 0);
    }
    else 
        if (top.getBitMapFlag(7)) {
            top.fillCommentPV("http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=" + top.g_iUin + "&module=3&submodule=0", "new_pgv_statistic_data");
        }
    
    top.showMsgbox("�����ύ����...", 0, 2000);
    var archive, page;
    pageIndex = pageNo - 1;
    if (pageArray.length == 0) 
        pageArray.push([0, 1]);
    else 
        if (pageArray.length <= pageIndex) 
            pageArray.push([nextArchive, nextPage]);
    archive = pageArray[pageIndex][0];
    page = pageArray[pageIndex][1];
    var url = "http://" + top.g_MsgBoard_Domain + "/cgi-bin/new/msgb_page.cgi?uin=" + top.g_iUin + "&archive=" + archive + "&start=" + ((page - 1) * pageSize + 1) + "&num=" + pageSize;
    if (!top.g_XDoc["msgboard_" + archive + "_" + page]) 
        top.loadXMLAsync("msgboard_" + archive + "_" + page, url, showMsg, getMsgFail);
    else 
        showMsg();
    
    top.hitcounter(11, 64);//SDS
}

function turnPage(i){
    turnToPage(pageIndex + 1 + i);
}

function showMsg(){
    if (window.SelfReply) 
        SelfReply.initialize();
    var archive = pageArray[pageIndex][0], page = pageArray[pageIndex][1];
    var x = top.g_XDoc["msgboard_" + archive + "_" + page];
    if (selectSingleNode(x, "/error")) {
        top.g_XDoc["msgboard_" + archive + "_" + page] = null;
        if (selectSingleNode(x, "/error").getAttribute("type") == "update") {
            location = "/qzone/blog/index_none_guestbook.html"
            return;
        }
        getMsgFail(getText(selectSingleNode(x, "/error")));
        return;
    }
    nextArchive = selectSingleNode(x, "/rss/channel/@nextArchive").nodeValue;
    nextPage = (nextArchive == archive) ? (page + 1) : 1;
    document.getElementById("currentPageSpan").innerHTML = document.getElementById("currentPageSpan2").innerHTML = pageIndex + 1;
    //���˻ظ�����
    var items = x.getElementsByTagName("item");
    campusName = window.campusName ||
    {};
    campusLink = window.campusLink ||
    {};
    for (var i = 0; i < items.length; i++) {
        if (!selectSingleNode(items[i], 'revert')) {
            var aRevert = items[i].ownerDocument.createElement('revert');
            setText(aRevert, getRevertContent(items[i]));
            items[i].appendChild(aRevert);
        }
        else {
            setText(selectSingleNode(items[i], 'revert'), getRevertContent(items[i]));
        }
    }
    fillDIV("msgList", x);
    
    var items = x.getElementsByTagName("item");
    for (var i = 0; i < items.length; i++) {
        var effect = parseInt(items[i].getAttribute("effect"), 10);
        var rUin = parseInt(items[i].getAttribute("uin"), 10);
        var answerid = parseInt(items[i].getAttribute("answerid"), 10);
        var capacity = selectSingleNode(items[i], "capacity") ? parseInt(getText(selectSingleNode(items[i], "capacity")), 10) : 128;
        //���˻ظ����⴦��
        if (effect & 32) {
            if ((parent.g_iUin != parent.g_iLoginUin && parent.g_iLoginUin != rUin)/* || capacity < 128*/) {
                document.getElementById('btnReply' + answerid).style.display = 'none';
            }
            document.getElementById('masterComment' + answerid).style.display = '';
        }
        else {
            if (parent.g_iUin != parent.g_iLoginUin/* || capacity < 128 */) {
                document.getElementById('btnReply' + answerid).style.display = 'none';
            }
        }
        //�ж��Ƿ�����ظ�
        
        if (rUin == parent.g_iUin) {
            document.getElementById('btnReport' + answerid).style.display = 'none';
        }
    }
    
    //ͬ����ҳ���԰�ģ�����
    var url = "http://" + top.g_MsgBoard_Domain + "/cgi-bin/new/msgb_page.cgi?uin=" + top.g_iUin + "&archive=0&start=1&num=" + pageSize;
    if (!top.g_XDoc["msgboard_0_1"]) {
        top.loadXMLAsync("msgboard_0_1", url, function(){
            var data = top.g_XDoc["msgboard_0_1"];
            top.g_XDoc[22] = data;
            document.getElementById("msgCount").innerHTML = document.getElementById("msgCount2").innerHTML = selectSingleNode(data, "/rss/channel/@totalNum").nodeValue;
            document.getElementById("ownerLeaveWorld").innerHTML = ubbReplace(getText(selectSingleNode(data, "/rss/channel/description")), 'face anchor image glow email font');
            document.getElementById("authorSign").innerHTML = ubbReplace(getText(selectSingleNode(data, "/rss/channel/authorsign")), 'face anchor image glow email font');
        }, getMsgFail);
    }
    else {
        var data = top.g_XDoc["msgboard_0_1"];
        top.g_XDoc[22] = data;
        document.getElementById("msgCount").innerHTML = document.getElementById("msgCount2").innerHTML = selectSingleNode(data, "/rss/channel/@totalNum").nodeValue;
        document.getElementById("ownerLeaveWorld").innerHTML = ubbReplace(getText(selectSingleNode(data, "/rss/channel/description")), 'face anchor image glow email font');
        document.getElementById("authorSign").innerHTML = ubbReplace(getText(selectSingleNode(data, "/rss/channel/authorsign")), 'face anchor image glow email font');
    };
    
    try {
        addSpeedPoint(4);
    } 
    catch (err) {
    };
    
    //��ʾͷ�����Ϣ
    if (!isStar) {
        Portrait.show(x);
    }
    try {
        QZONE.namecard.init($("msgList"));
    } 
    catch (err) {
    }
}

var Portrait = (function(){
    var inner;
    var _uins;
    var _campusUins;
    var NORMAL_TYPE = 0;
    var CAMPUS_TYPE = 1;
    function isCampusUsr(_t){
        if (_t & Math.pow(2, 19)) {
            return true;
        }
        return false;
    }
    function _init(x){
        _uins = {
            query: [],
            show: []
        };
        _campusUins = {
            query: [],
            show: []
        }
        var items = x.getElementsByTagName("item");
        _query(items);
        _fixNickLink();
    }
    function _fixNickLink(){
        var uin;
        var a, pH;
        for (var i = 0, iLen = _campusUins.show.length; i < iLen; i++) {
            uin = _campusUins.show[i];
            a = document.getElementsByName("nick_" + uin);
            p = document.getElementsByName("portraitHref" + uin)
            for (var j = 0, jLen = a.length; j < jLen; j++) {
                a[j].link = p[j].link = "";
                a[j].href = p[j].href = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + uin;
                a[j].onmouseover = function(){
                    showUserPortraitTips(this, uin, "true");
                };
                a[j].onmouseout = function(){
                    hideUserPortraitTips();
                }
            }
        }
    }
    function _query(items){
        var has = {};
        for (var i = 0, iLen = items.length; i < iLen; i++) {
            var effect = items[i].getAttribute("effect");
            var uin = items[i].getAttribute("uin");
            top.g_XDoc["campusPortraitHsmp"] = top.g_XDoc["campusPortraitHsmp"] ||
            {};
            if (isCampusUsr(effect)) {
                if (!top.g_XDoc["campusPortraitHsmp"][uin]) {
                    _campusUins.query.push(uin);
                    top.g_XDoc["campusPortraitHsmp"][uin] = true;
                }
                (!has[uin]) ? (_campusUins.show.push(uin), has[uin] = true) : "";
            }
            else {
                _uins.query.push(uin);
                (!has[uin]) ? (_uins.show.push(uin), has[uin] = true) : "";
            }
        }
        
        QZONE.FP.getPortraitList(_uins.query, _portraitCB);
        if (_campusUins.query.length) {
            var url = "http://" + parent.g_Main_Domain + "/fcg-bin/cgi_get_portrait_campus.fcg?encodeduins=" + _campusUins.query.join();
            top.loadJsonData("campusPortraitHsmp", url, _campusPortraitCB, void (0), true, void (0), "portraitCallBack");
        }
        else {
            _campusPortraitCB();
        }
    }
    
    function _portraitCB(data){
        var uins = _uins.show;
        _showPortrait(uins, data, NORMAL_TYPE);
        try {
            addSpeedPoint(5);
        } 
        catch (err) {
        };
        
        if (!parent.msgboardSended) {
            sendSpeedStatistic(113, 1);
            parent.msgboardSended = true;
        }
    }
    
    function _campusPortraitCB(data){
        top.g_JData["campusPortraitHsmp"] = null;
        for (var i in data) {
            top.g_XDoc["campusPortraitHsmp"][i] = data[i];
        }
        var uins = _campusUins.show;
        _showPortrait(uins, top.g_XDoc["campusPortraitHsmp"], CAMPUS_TYPE);
    }
    
    function _showPortrait(uins, data, type){
        var uin;
        for (var i = 0, iLen = uins.length; i < iLen; i++) {
            uin = uins[i];
            var imgs = document.getElementsByName("portraitImg" + uin);
            var degreedivs = document.getElementsByName("userdegreediv" + uin);
            var eleSpans = document.getElementsByName("VipLevel" + uin);
            var img, degreediv, eleSpan;
            if (imgs.length) {
                for (var j = 0, jLen = imgs.length; j < jLen; j++) {
                    img = imgs[j];
                    degreediv = degreedivs[j];
                    eleSpan = eleSpans[j];
                    var o = data[uin];
                    if (typeof o != "object") {
                        continue;
                    }
                    
                    if (o[2] == 0) {
                        img.src = "/qzone_v4/client/userinfo_icon/5001.gif";
                    }
                    else {
                        if ((parseInt(top.g_iLoginUin) == parseInt(top.g_iUin)) && (parseInt(top.g_iLoginUin) == parseInt(uin, 10))) {
                            img.src = o[0] + "?t=" + Math.random();
                        }
                        else {
                            img.src = o[0];
                        }
                    }
                    
                    // �������ͼ��
                    if (!!eleSpan) {
                        if (o[3] > 0 && o[5] == 1) {
                            eleSpan.childNodes[0].innerHTML = o[3];
                            eleSpan.style.display = "";
                        }
                        else {
                            eleSpan.nextSibling.style.overflow = "visible";
                        }
                    }
                    
                    if (degreediv) {
                        if (type == CAMPUS_TYPE) {
                            if (campusName[uin].trim() == "") {
                                degreediv.innerHTML = "<a href='http://xiaoyou.qq.com/index.php' target='_blank'>4�ԣ�QQУ��</a>";
                            }
                            else {
                                degreediv.innerHTML = "<a href='http://xiaoyou.qq.com/index.php?mod=school&act=schoolportal&school_id=" + campusLink[uin] + "' target='_blank'>4�ԣ�" + campusName[uin].substring(0, 8) + "</a>";
                            }
                        }
                        else {
                            var totalScore = o[1];
                            var scoreArr = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];
                            if (totalScore >= 90) {
                                var userDegree = Math.floor(Math.sqrt(totalScore / 10)) + 7;
                            }
                            else 
                                if (totalScore >= 0 && totalScore < 90) {
                                    for (var k = 0; k < scoreArr.length - 1; k++) {
                                        if (totalScore >= scoreArr[k] && totalScore < scoreArr[k + 1]) {
                                            userDegree = k;
                                            break;
                                        }
                                    }
                                }
                            if (userDegree == 0) {
                                appendPicChild(degreediv, 0, 1, totalScore, userDegree);
                            }
                            else {
                                pic16Num = Math.floor(userDegree / 16);
                                pic4Num = Math.floor((userDegree % 16) / 4);
                                pic1Num = Math.floor((userDegree % 16) % 4);
                                appendPicChild(degreediv, 1, pic16Num, totalScore, userDegree);
                                appendPicChild(degreediv, 2, pic4Num, totalScore, userDegree);
                                appendPicChild(degreediv, 3, pic1Num, totalScore, userDegree);
                            }
                        }
                    }
                    
                }
                
            }
        }
    }
    
    return inner = {
        show: function(x){
            _init(x);
        }
    }
})();
function getRevertContent(x){
    var arrRevert = [];
    var aItem, aNick, aTime;
    var getDateTime = function(aTime){
        if (!aTime || aTime == 0) 
            return '';
        var d = new Date(aTime * 1000);
        return (d.getMonth() + 1) + "��" + d.getDate() + "�� " + (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    }
    for (var i = 0; i < selectNodes(x, 'comment').length; i++) {
        aItem = selectNodes(x, 'comment')[i];
        aTime = getDateTime(aItem.getAttribute('time'));
        if (!aItem.getAttribute('uin')) {
            aItem.setAttribute('uin', top.g_iUin);
        }
        var effect = parseInt(x.getAttribute("effect"), 10);
        var nickname = "";
        if (effect & Math.pow(2, 19)) {
            nickname = getText(selectSingleNode(x, 'nickname')).trim();
        }
        else {
            nickname = getText(selectSingleNode(x, 'author')).trim();
        }
        
        //�����ǳ�
        if (top.g_iLoginUin == top.g_iUin) { //����ģʽ
            aNick = (aItem.getAttribute('uin') == top.g_iLoginUin ? '��' : nickname);
        }
        else 
            if (aItem.getAttribute('uin') == top.g_iLoginUin) { //���˿ɻظ�ģʽ
                aNick = '��';
            }
            else { //���˲��ɻظ�ģʽ
                aNick = (aItem.getAttribute('uin') == top.g_iUin ? '����' : nickname);
            }
        aNick += '�Ļظ�';
        arrRevert.push('<div class="' + (aItem.getAttribute('uin') == top.g_iUin ? 'tc' : '') + ' tbor2" style="margin-bottom:6px;"><div style="margin-top:6px;font-weight:bold;">' + aNick + ' <span class="num">' + aTime + '</span></div><div>' + getText(aItem).replace(/\n/g, '<br/>').replace(/\[em\]e(\d{1,3})\[\/em\]/g, "<img style='vertical-align:baseline  !important' src='/qzone/em/e$1.gif'><wbr>") + '</div></div>');
    }
    return arrRevert.join('');
}

function getMsgFail(s){
    if (!s) 
        s = "������æ�����Ժ�����...";
    top.showMsgbox(s, 1, 2000);
    setTimeout(function(){
        top.guidebutton(1);
    }, 1800);
}

function ubbreplaceContent(item){
    var isSelfComment = (item.getAttribute("uin") == top.g_iLoginUin);
    item.setAttribute("date", getText(selectSingleNode(item, "pubDate")).replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/ig, "$1��$2��$3�� $4��$5��"));
    var s = getText(selectSingleNode(item, "title"));
    var effect = parseInt(item.getAttribute("effect"), 10);
    s = s.replace(/\[img\][^\[]+((&#)|(\x22)|(&quot;)|(my22)|(isme)|(r1\.cn)|(139\.com)|(eex\.cn)|(q-zone)|(qzone)|(cgi_client_entry)|([\'\"]))[^\[]+\[\/img\]/i, "[�Ƿ�ͼƬt��]");
    if (isVip && !isSelfComment) {
        var tmp = s.match(/\r|\n/g);
        if (tmp && tmp.length > 3) {
            s = s.replace(/\r|\n/g, "")
        }
    }//vip�ռ䲻���?��ָ��������������
    var post_fix = (!isNaN(effect) && (effect & 1024) != 0) ? '<br /><br />-----------------------------------<br />������4��<a target="_blank" href="http://3gqq.qq.com/qzone/?fr=qzmsg"><font style="padding:1px;filter:glow(color=#F16522,strength=3);color:#fff;height:10px;cursor:pointer">�ֻ�Qzone</font></a>' : '';
    post_fix = (!isNaN(effect) && (effect & (1 << 15))) ? '<br /><br />-----------------------------------<br />������4��<font style="padding:1px;filter:glow(color=#F16522,strength=3);color:#fff;height:10px;">�ƶ�Qzone</font><br />�ƶ�Qzone����ʱ������ֻ����QQ�ռ䣬�������ԣ�<br /><a target="_blank" href="http://m-qzone.qq.com/?from=qzoneJD">�������&gt;&gt;</a>' : post_fix;
    post_fix = (!isNaN(effect) && (effect & (1 << 28)) != 0) ? '<br /><br />-----------------------------------<br />������4�Գ��д�������<a target="_blank" href="http://city.qzone.qq.com/">http://city.qzone.qq.com/</a>' : post_fix;
    s = ubbReplace(s, "face egg imageHide quote qqshow" + ((isVip && !isSelfComment) ? "" : " anchor font email glow_limit"));//vip��������۲���ʾ����Ч��
    //,����Ϣ���� effect = 1<<24
    if (effect & 16777216) {
        item.setAttribute("content", "����Ů����˧�磬4���д��ˣ���<a href='http://city.qzone.qq.com' target='_blank'>http://city.qzone.qq.com</a>��");
        item.setAttribute("title", "����Ů����˧�磬4���д��ˣ���[url]http://city.qzone.qq.com[/url]��");
    }
    else {
        item.setAttribute("content", s + post_fix);
    }
    
    item.setAttribute("sign", ubbReplace(getText(selectSingleNode(item, "description")), 'face anchor image email sign glow_limit font glow'));
    
    //campus
    var effect = parseInt(item.getAttribute("effect"), 10);
    if (effect & Math.pow(2, 19)) {
        item.setAttribute('author', getText(selectSingleNode(item, 'nickname')).trim());
        item.setAttribute('sign', "������4��QQУ������&nbsp;&nbsp<a href='http://xiaoyou.qq.com' target='_blank'>xiaoyou.qq.com</a>");
        campusName[item.getAttribute('uin').trim()] = getText(selectSingleNode(item, 'schoolname')).trim();
        campusLink[item.getAttribute('uin').trim()] = getText(selectSingleNode(item, 'schoolid')).trim();
        item.setAttribute("campusHide", "none");
        item.setAttribute("bCampus", "true");
    }
    else 
        if (effect & Math.pow(2, 29)) { // todo
            item.setAttribute('sign', "������4����ɴ�������&nbsp;&nbsp<a href='http://8.qq.com' target='_blank'>8.qq.com</a>");
        }
    
    var author = selectSingleNode(item, "author") || selectSingleNode(item, "nickname");
    if ((effect & (1 << 4)) != 0) {
        item.setAttribute("_anon", "<a style='font-weight:bold' title='���û�ʹ������������'>" + getText(author) + "</a>");
    }
    else {
        item.setAttribute("_anon", "<a class='username q_namecard' target='blank' link='nameCard_" + item.getAttribute("uin") + "' href='http://user.qzone.qq.com/" + item.getAttribute("uin") + "'>" + getText(author) + "</a>");
    }
}

function showAuthorSign(){
    document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][1].style.display = (document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][1].style.display == "") ? "none" : "";
    setTimeout(function(){
        document.getElementById("showSignButton").innerHTML = (document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][1].style.display == "") ? "����ǩ��" : "��ʾǩ��"
    }, 0);
    
    if (Math.random() < 0.001) {
        window.tmpImg = new Image();
        window.tmpImg.src = "http://" + top.g_NewBlog_Domain + "/cgi-bin/blog/blog_showhideautograph.cgi?" + Math.random();
    }
}

var ButtonIdList = ["previousPageSpan", "nextPageSpan", "previousPageSpan2", "nextPageSpan2", "submitButton"];
var ImgButtonsIdList = ["submitButton"];

function checkUbbTagsCnt(content, reg){
    var count = 0;
    while ((arr = reg.exec(content)) != null) {
        ++count;
    }
    return count;
}

// ���ͷ�������
function checkSubmitMsg(verifycode){
    if (!window.sendCommentEditor) {
        alert('����������');
        getUBBeditor();
        return false;
    }
    
    if (parent.checkLogin() <= 10000 && !$("anony").checked) {
        commentLogin();
        return false;
    }
    
    var f = document.diary_form;
    window.sendCommentEditor.editorArea.Document.body.innerHTML
    var content = window.sendCommentEditor.getUBB().replace(/\x20+$/, "");
    if (!/\S+/.test(content)) {
        alert("����������");
        window.sendCommentEditor.editorArea.focus();
        return false;
    }
    
    if (checkUbbTagsCnt(content, /\[img\](.[^\]]*)\[\/img\]/ig) > 1) {
        alert("�Բ�����ֻ�ܲ���һ��ͼƬ");
        return false;
    }
    
    if (checkUbbTagsCnt(content, /\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})\]http(.[^\]\'\"]*)\[\/qqshow\]/ig) > 1) {
        alert("�Բ�����ֻ�ܲ���һ��QQ������");
        return false;
    }
    
    var r = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]([^\[]{31,})\[\/ft\]/
    if (r.test(content)) 
        if (!confirm("�����÷���������ѳ���30�������Ч�����ʧЧ��ȷ�Ϸ����������")) 
            return false;
    r = /\[ffg,([a-zA-z#0-9]{1,10}),[a-zA-z&#=;0-9]{1,10}\]/g;
    if (content.match(r) && content.match(r).length > 1) 
        if (!confirm("�����ֻظ���Ч��ֻ��ʹ��һ�Σ����ķ����ֽ��޷���ʾ��ȷ�Ϸ����������")) 
            return false;
    var r = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\](.*\[f.*)\[\/ft\]/
    if (r.test(content)) 
        if (!confirm("�������ʹ����������Ч��������Ч�����ʧЧ��ȷ�Ϸ����������")) 
            return false;
    
    var url = "http://" + top.g_MsgBoard_Domain + "/cgi-bin/new/msgb_addanswer.cgi";
    if (content.getRealLength() > maxContentLength) {
        alert("���������ܴ���" + maxContentLength + "����");
        return false;
    }
    var _c = content.URIencode();
    top.cacheForAnonComment = {
        submitURL: url,
        blogid: -1,
        content: _c,
        sf: checkSubmitMsgResult,
        ef: errorSubmitMsgResult,
        editorID: window.sendCommentEditor.id
    }//Ϊ������������׼��
    // ѡ�����Ļ�
    if (document.getElementById("msgReplyCheck").checked) {
        if ($("verifycode_replysms").value.trim() == "") {
            alert("��������֤��");
            return false;
        }
        
        if (!(/^[0-9a-zA-Z]{4,}$/).test($("verifycode_replysms").value.trim())) {
            alert("���������֤���������������");
            $("verifycode_replysms").focus();
            return false;
        }
        
        top.cacheForAnonComment.title = (((top.g_iLoginUin > 10000) ? top.g_iLoginUin : "") + "���������").URIencode();
        top.cacheForAnonComment.content = (((top.g_iLoginUin > 10000) ? top.g_iLoginUin : "") + '���������: \n').URIencode() + _c;
        top.cacheForAnonComment.verifycode = $("verifycode_replysms").value;
        
        top.showMsgbox("���ڷ���Сֽ��,���Ժ�...", 0);
        top.loadXMLAsyncNoCache("SMSvalue", "http://msg.qzone.qq.com/fcg-bin/fcgi_get_price?uin=" + top.g_iLoginUin + "&recvuin=" + top.g_iUin, getPriceSucc, function(){
            top.showMsgbox("�Բ�������������⣬���Ժ�����", 1, 2000);
        });
        return false;
    }
    
    // ��������
    if ($("anony").checked) {
        parent.popupDialog('��������', '<iframe frameborder="no" id="anonymCommentFrame" style="width:100%;height:100%" src="/qzone/blog/anonymcomment.html"></iframe>', 242, 293);
        return false;
    }
    
    if (bProcessing) 
        return false;
    bProcessing = true;
    
    //�ʵ�ͳ��
    var eggText = '[ft=#ff9900,3,]Qzone5.0���������ľ�ϲ[/ft]';
    if (content.indexOf(eggText) != -1) {
        sendPV('hasEgg', 'egg.qzone.qq.com');
    }
    
    var data = "content=" + _c;
    data += "&uin=" + top.g_iUin + "&replycampus=0" + (!!verifycode ? ("&verifycode=" + verifycode) : "") + "&property=" + top.g_Property;
    if ($("hassign").checked) 
        data += "&hassign=yes";
    top.showMsgbox("�����ύ����,���Ժ�...", 0, 2000);
    top.loadXMLAsync("submitResult", url, checkSubmitMsgResult, errorSubmitMsgResult, true, data);
    return false;
}

// ������Է��ͽ��
function errorSubmitMsgResult(){
    alertSendDataFail();
    bProcessing = false;
}

function checkSubmitMsgResult(){
    var x = top.g_XDoc["submitResult"];
    if (selectSingleNode(x, "/succ") != null) {
        if (!!top.cacheForAnonComment) 
            top.cacheForAnonComment = void (0);
        for (var i = 0; i < pageArray.length; i++) 
            top.g_XDoc["msgboard_" + pageArray[i][0] + "_" + pageArray[i][1]] = null;
        makeMsgboardStaticData();//SDS
    }
    else 
        if (selectSingleNode(x, "/error") != null) {
            var type = selectSingleNode(x, "/error").getAttribute("type");
            if (type == "login") {
                commentLogin();
            }
            else 
                if (type == "verify") { // ��Сֽ���
                    top.showMsgbox(getText(selectSingleNode(x, "/error")), 1, 2000);
                    try {
                        verifyCounter[0].change();
                    } 
                    catch (err) {
                    }
                }
                else 
                    if (type == "need_verify" || type == "verify code") {
                        setTimeout(function(){
                            parent.popupCallback = function(verifycode){
                                if (!!verifycode) {
                                    parent.QZONE.FrontPage.getCurrentAppWindow().checkSubmitMsg(verifycode);
                                }
                            };
                        }, 1200); // ����parent.popupCallback��closePopup��onload����null
                        parent.popupDialog('��������֤��', '<iframe frameborder="no" id="verifycodeFrame" style="width:100%;height:100%" src="/qzone/verifycode.html?imgcode=8000102&type=0"></iframe>', 270, 190);
                    }
                    else {
                        top.showMsgbox(getText(selectSingleNode(x, "/error")), 1, 2000);
                        try {
                            verifyCounter[0].change();
                        } 
                        catch (err) {
                        }
                    }
        }
        else {
            alertSendDataFail();
            try {
                verifyCounter[0].change();
            } 
            catch (err) {
            }
        }
    
    bProcessing = false;
}

//SDS
function makeMsgboardStaticData(){
    if ((top.g_FixedTagBit & (1 << 9)) == 0) {
        continueMsgAddSucc();
        return;
    }
    var url = "http://" + top.g_Src_Domain + "/cgi-bin/cgi_qqzone.cgi?uin=" + top.g_iUin + "&flag=" + (1 << 9).toString(10) + "&msgboard=" + top.g_MsgBoard_Domain + "&msgboardver=" + top.g_MsgBoard_Version + "&property=" + top.g_Property + "&vuin=" + top.g_iLoginUin;
    
    top.loadJsonData("dynamicData", url + "&r=" + Math.random(), jsonCallback, jsonCallback, true, void (0), "dynamicData_Callback");
}

//SDS
function jsonCallback(str){
    if (str === undefined) 
        str = "";
    if (!!str.replace) 
        str = str.replace(/\x01/g, "\n");
    if (top.xDocBuilder(str, true) == 0) 
        top.g_XDoc["msgboard_0_1"] = top.g_XDoc["22"];
    continueMsgAddSucc();
}

//SDS
function continueMsgAddSucc(){
    turnToPage(1)
    var content = window.sendCommentEditor.getUBB().replace(/\x20+$/, "");
    document.diary_form.content.value = "";
    window.sendCommentEditor.editorArea.clear();
    document.getElementById("topLink").focus()
    var x = top.g_XDoc["submitResult"];
    top.showMsgbox(getText(selectSingleNode(x, "/succ")), 0, 2000);
    //	verifyCounter[0].change();
    top.isRefreshTop = true;//SDS	
    delete top.g_XDoc["submitResult"];
}

function commentLogin(){
    var f = document.diary_form;
    var _c = window.sendCommentEditor.getUBB().replace(/\x20+$/, "").URIencode();
    top.customVarContainer.cacheForAnonComment = {
        submitURL: "http://" + top.g_MsgBoard_Domain + "/cgi-bin/new/msgb_addanswer.cgi",
        blogid: -1,
        content: _c,
        sf: checkSubmitMsgResult,
        ef: errorSubmitMsgResult
    }//Ϊ������������׼��
    var t = (top.getBitMapFlag(7) > 0);
    top.showLoginBox("mgbComment", t, "��������ǰ��Ҫ��ȷ��������");
}

// ɾ������
function deleteAnswer(answerId, archive, uin){
    if (!confirm("��ȷ��Ҫɾ�����������")) {
        return;
    }
    top.showMsgbox('�����ύ�������Ժ�...', 0, 2000);
    var url = "http://" + top.g_MsgBoard_Domain + "/cgi-bin/new/msgb_delanswer.cgi"
    var data = "uin=" + top.g_iUin + "&answerid=" + answerId + "&archive=" + archive + "&answeruin=" + uin;
    top.loadXMLAsync("submitResult", url, deleteAnswerResult, alertSendDataFail, true, data);
}

function deleteAnswerResult(){
    top.hideMsgbox();
    var x = top.g_XDoc["submitResult"];
    if (selectSingleNode(x, "/succ") != null) {
        for (var i = pageIndex + 1; i < pageArray.length; i++) 
            top.g_XDoc["msgboard_" + pageArray[i][0] + "_" + pageArray[i][1]] = null;
        top.showMsgbox(getText(selectSingleNode(x, "/succ")), 1, 2000);
        var archive = pageArray[pageIndex][0], page = pageArray[pageIndex][1];
        with (selectSingleNode(top.g_XDoc["msgboard_0_1"], "/rss/channel")) setAttribute("totalNum", getAttribute("totalNum") - 1)
        var x = top.g_XDoc["msgboard_" + archive + "_" + page];
        var _pageFix = 1;
        if (!x || selectNodes(x, "/rss/channel/item").length < 2) {
            pageArray.splice(pageIndex, 1);//��ҳ�Ѿ�ɾ��
            if (pageIndex != 0) 
                _pageFix = 0;
        }
        top.g_XDoc["msgboard_" + archive + "_" + page] = null;
        if (pageArray[pageIndex - 1]) 
            top.g_XDoc["msgboard_" + pageArray[pageIndex - 1][0] + "_" + pageArray[pageIndex - 1][1]] = null;
        turnToPage(pageIndex + _pageFix);
        top.isRefreshTop = true;
    }
    else 
        if (selectSingleNode(x, "/error") != null) {
            if (selectSingleNode(x, "/error").getAttribute("type") == "login") {
                document.getElementById("commentDiv").style.display = "none";
                parent.showLoginBox("ownerOperation", false, "���ѵ�¼��ʱ�������µ�¼");
            }
            else 
                if (selectSingleNode(x, "/error").getAttribute("type") == "verify") {
                    //diary_form.verifycode.focus();
                    top.showMsgbox(getText(selectSingleNode(x, "/error")), 1, 2000);
                }
                else {
                    top.showMsgbox(getText(selectSingleNode(x, "/error")), 1, 2000);
                    
                }
        }
        else {
            alertSendDataFail();
        }
}

/* ------------------------- enf of ���԰� ------------------------- */

function showReplyEditor(idx){
    //�ж��Ƿ��м��ػظ�����
    if (!window.SelfReply) {
        top.includeJS('http://imgcache.qq.com/qzone/admin/js/selfreply.js', function(){
            doShowReplyEditor(idx);
        }, document);
    }
    else {
        doShowReplyEditor(idx);
    }
}

function doShowReplyEditor(idx){
    if (!window.SelfReply) {
        setTimeout('doShowReplyEditor(' + idx + ')', 100);
    }
    else {
        if (!SelfReply.initialized || !$('divReplyEditor') || !$('chkMsg')) 
            SelfReply.initialize();
        if (SelfReply.coreParam == idx) {
            SelfReply.hideEditor(false);
            return;
        }
        SelfReply.resetTarget(SRT_GUESTBOOK, document.getElementById('masterComment' + idx), document.getElementById('mcEditor' + idx), idx);
    }
}

/* ------------ end of ���˼��� ------------------------- */

window.loginCallback = function(){
    setLoginStatus();
    document.getElementById("commentDiv").style.display = "";
    //document.getElementById("showAnon").style.display="none";
    
    if (!!verifyCounter && !!verifyCounter[0]) 
        verifyCounter[0].change();
    
    QZONE.FP.getLoginUserBitMap(function(data, value){
        $("registHrefEntry").style.display = (!value ? "" : "none");
        if (!value) {
            $("msgboardSelfReply").style.display = "none";
        }
    }, 1);
}

function setLoginStatus(){
    document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][2].style.display = (top.g_iUin > 10000 && top.g_iUin == top.g_iLoginUin) ? "" : "none";
    document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][3].style.display = (top.g_iLoginUin > 10000) ? "" : "none";
    document.styleSheets[0][Browser.isIE ? "rules" : "cssRules"][4].style.display = (top.g_iLoginUin < 10001 || top.g_iUin != top.g_iLoginUin) ? "" : "none";
    
    if (top.setLoginStatus) 
        top.setLoginStatus();
}

function appendPicChild(ele, type, num, score, degree){
    for (var i = 0; i < num; i++) {
        var picChild = document.createElement("img");
        picChild.src = "/ac/b.gif";
        //picChild.alt = "�ȼ�";
        picChild.className = "grading-" + type;
        picChild.style.margin = "1px";
        picChild.onmouseover = function(){
            showTitle(picChild, "<font color='black'>�ȼ�:</font>" + "<font color='red'>" + degree + "</font>    <font color='black'>���:</font>" + "<font color='red'>" + score + "</font>   <a href='http://qzone.qq.com/web/help/helpa01.shtml?url=http://qzone.qq.com/web/help/helpb16.htm' target='_blank' style='text-decoration:underline;'>   <font color='blue'>�ȼ����˵��</font></a>", 1);
        }
        picChild.onmouseout = function(){
            window._stTimeout = setTimeout("toHideTitle()", 2000);
        }
        ele.appendChild(picChild);
    }
}

var showTitle = function(obj, html, type){
    var sT = document.getElementById("sTitle");
    if (!sT) {
        sT = document.createElement("div");
        sT.id = "sTitle";
        sT.style.cssText = "position:absolute;border:1px solid #000;padding:2px;background:#FFFFCC;font-size:12px";
        document.body.appendChild(sT);
    }
    sT.style.display = "";
    sT.style.left = type == 1 ? (getPosition(obj).left + 20) : (getPosition(obj).left + getPosition(obj).width + 10);
    sT.style.top = type == 1 ? getPosition(obj).top : getPosition(obj).top;
    sT.innerHTML = html;
    clearTimeout(window._stTimeout);
}

var createTitle = function(){

}

var hideTitle = function(){
    var sT = document.getElementById("sTitle");
    if (sT) {
        sT.style.display = "none";
    }
}

var toHideTitle = function(){
    hideTitle();
}

function getPosition(obj){
    var top = 0;
    var left = 0;
    var width = obj.offsetWidth;
    var height = obj.offsetHeight;
    while (obj.offsetParent) {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        "top": top,
        "left": left,
        "width": width,
        "height": height
    };
}

function fnWriteMsg(uin){
    if (top.checkLogin() < 10001) {
        top.showLoginBox("mall");
        return;
    }
    top.showMsgSender(uin);
}

//��bUBB�༭��switcher��4�ж�����־���ۻ��Ƿ�����־
function buildEditor(switcher){
    if (window.sendCommentEditor) 
        return;
    
    _wysiwygToolbar = ((isStar || isBiz) && (parent.g_iUin != parent.g_iLoginUin)) ? [["0", "undo_s", "redo_s"], ["0", "face_s", "ubb"], ["0", "help_s"]] : [["0", "fontFamily_s", "fontSize_s", "bold", "italic", "underline", "fontColor", "lightFont", "removeformat"], ["0", "JustifyLeft_s", "JustifyCenter_s", "JustifyRight_s"], ["0", "face_s", parent.getBitMapFlag(27) ? "qqshow" : "dump"], ["0", "undo_s", "redo_s"], ["0", "ubb", "help_s"]];
    _ubbToolbar = ((isStar || isBiz) && (parent.g_iUin != parent.g_iLoginUin)) ? [["0", "undo_s", "redo_s"], ["0", "face_s", "html"], ["0", "help_s"]] : [["0", "fontFamily_s", "fontSize_s", "bold", "italic", "underline", "fontColor", "lightFont"], ["0", "JustifyCenter_s", "JustifyRight_s"], ["0", "face_s", parent.getBitMapFlag(27) ? "qqshow" : "dump"], ["0", "undo_s", "redo_s"], ["0", "html", "help_s"]];
    _defaultToolbarHeight = "28px";
    
    if (!window.createEditor) {
        setTimeout(buildEditor, 200);
        return;
    }
    window.sendCommentEditor = createEditor("commentEditorAnchor");
    _fontCount = maxContentLength;
    sendCommentEditor.height = 200;
    window.sendCommentEditor.build();
    var tmp = $("t");
    tmp.blur();
    tmp.style.display = "none";
    if (window.editorCallbackToDoList.length > 0) {
        (window.editorCallbackToDoList.pop())();
    }
    setTimeout(function(){
        try {
            window.sendCommentEditor.editorArea.frameWindow.focus();
            window.sendCommentEditor.editorArea.focus();
            if (window.sendCommentEditor.editorArea.Document.body.lastChild &&
            window.sendCommentEditor.editorArea.Document.body.lastChild.nodeType == 8) {
                window.sendCommentEditor.editorArea.Document.body.removeChild(window.sendCommentEditor.editorArea.Document.body.lastChild);
            }
        } 
        catch (err) {
        }
    }, 1000);
    location.hash = 'commentDiv';
}


//��ʼUBB�༭��-ȡ
function getUBBeditor(o){
    if (!!o) 
        o.onfocus = null;
    if (!window.sendCommentEditor) {
        top.includeJS("http://" + top.imgcacheDomain + "/qzone/blog/QZEditor/qzEditor.js", buildEditor, document);
        /*top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/common.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorEvent.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorArea.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorToolbar.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorCommand.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorRegular.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorFunction.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorLanguage.js",void(0),document)
         top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/source/QZEditorMain.js",buildEditor,document)*/
    }
    else {
        setTimeout(function(){
            try {
                window.sendCommentEditor.editorArea.frameWindow.focus();
            } 
            catch (err) {
            }
        }, 1000);
        location.hash = 'commentDiv';
    }
}

function ubbquoteEx(nk, tm, st){
    try {
        var strQuote = "[quote=���ԣ�" + unescape(nk).replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim() + " �� " + tm + " ���������]" + unescape(st).replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&amp;/g, "&") + "[/quote]";
        if (!!$('t')) 
            $('t').onfocus = null;
        if (!window.sendCommentEditor) {
            window.editorCallbackToDoList.push(function(){
                ubbquoteEx(nk, tm, st);
            });
            getUBBeditor();
            //top.includeJS("http://"+top.imgcacheDomain+"/qzone/blog/QZEditor/qzEditor.js",buildEditor,document);
        }
        else {
            sendCommentEditor.editorArea.focus();
            if (sendCommentEditor.editorArea.editMode == 0) {
                sendCommentEditor.editorArea.fillUBB(strQuote);
            }
            else {
                strQuote = strQuote.UBBToHTML(strQuote);//.toInnerHTML()   			
                var oDocument = sendCommentEditor.editorArea.Document;
                if (!!oDocument) {
                    var oList = oDocument.body.getElementsByTagName("blockquote");
                    if (!!oList) {
                        if (oList.length <= 0) {
                            sendCommentEditor.editorArea.fillHTML(strQuote, null, null, true);
                            oList = oDocument.body.getElementsByTagName("blockquote");
                        }
                        else {
                            var tmp = oDocument.createElement("div");
                            tmp.innerHTML = strQuote;
                            oList[0].parentNode.replaceChild(tmp.getElementsByTagName("blockquote")[0], oList[0]); // ��������������е���������
                            if (oDocument.body.getElementsByTagName("blockquote")[0].parentNode == oDocument.body.lastChild) {
                                oDocument.body.appendChild(document.createElement("br"));
                            }
                            tmp = null;
                        }
                    }
                    
                    // ������ͼ������λ��
                    if (!!oList && oList.length > 0) {
                        var pos = parent.getPosition(oList[0]);
                        //var rng = oDocument.selection.createRange();
                        if (!isSmall) {
                            if (parent.$('mbody') && parent.$('mbody').nodeType == 1) {
                                parent.$('mbody').scrollTop = parent.$('mbody').scrollHeight;
                            }
                        }
                        else {
                            oDocument.body.getElementsByTagName("blockquote")[0].scrollIntoView(false);
                        }
                        oDocument.body.getElementsByTagName("blockquote")[0].scrollIntoView(false);
                        //rng.moveToPoint(pos.left+pos.width, pos.top);
                        //rng.select();
                    }
                }
                else {
                    //sendCommentEditor.editorArea.clear(); // ֻ������һ������
                    sendCommentEditor.editorArea.fillHTML(strQuote, null, null, false);
                }
            }
        }
    } 
    catch (e) {
    }
}

function sendPV(action, domain){
    var pvCurDomain = "";
    if (!!domain) 
        pvCurDomain = domain;
    else 
        pvCurDomain = (isBiz ? "biz.qzone.qq.com" : (isStar ? "star.qzone.qq.com" : "blog.qzone.qq.com"));
    var pvCurUrl = "/" + action;
    var data = ["dm=" + pvCurDomain, "url=" + encodeURIComponent(pvCurUrl), ];
    var r = /https?:\/\/(\w+(\.\w+)+)(\/[^?#]*)?/;
    var m = document.referrer.match(r);
    if (!!m) {
        if (m.length > 1) 
            data.push("rdm=" + m[1]);
        if (m.length > 3) 
            data.push("rurl=" + encodeURIComponent(m[3]));
    }
    var c = top.getCookie("pvid");
    if (!c) {
        c = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
        if (!isStatic) 
            top.setFileCookie("pvid", c);
    }
    data.push("pvid=" + c);
    
    top.send_stat_request("http://pingfore.qq.com/pingd?scr=-&scl=-&lang=-&java=1&cc=-&pf=-&tz=-8&ct=-&vs=3.3&tt=-&" + data.join("&") + "&sds=" + Math.random(), 1000);
}

function addSpeedPoint(id){
    if (typeof(id) == 'number' && id >= 0) {
        _arrPoint[id] = new Date();
        return true;
    }
    
    return false;
}

var _arrPoint = {};
function sendSpeedStatistic(serviceID, pageID){
    if (!window.basePoint) {
        return;
    }
    
    if (Math.ceil(Math.random() * 10) != 5) {
        return;
    }
    
    var url = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=175" + "&flag2=" + serviceID + "&flag3=" + pageID +
    "&flag4=0" +
    "&flag5=0" +
    "&uin=" +
    parent.g_iUin +
    "&hh=" +
    Math.random();
    
    addSpeedPoint(1);
    for (var index in _arrPoint) {
        if (!_arrPoint[index]) {
            continue;
        }
        
        if (index == 1) {
            _arrPoint[index] = window.basePoint;
        }
        
        url += "&" + index + "=" + (_arrPoint[index] - window.basePoint);
    }
    
    parent.send_stat_request(url, 1000);
    window.basePoint = null;
}

/*  |xGv00|d4d5447cf3a23dfffc2b5b9778ebbccb */
