
function QSAjax(iType, sMethod, sUrl, fnCallBack, fnError, bSyhn){
    if (iType == QSAjax.XMLCALL) {
        getXml(sUrl, fnCallBack, fnError, !!bSyhn);
    }
    if (iType == QSAjax.JSONCALL) {
        QSAjax.JSON.fCommonGetScript(sUrl, null, fnCallBack);
    }
}

QSAjax.JSONCALL = 1;
QSAjax.XMLCALL = 0;
QSAjax.JSON = function(){
}
QSAjax.JSON.fCommonGetScript = function(sUrl, sCharset, fnCallBack){
    if (!window.g_jsonnode) 
        window.g_jsonnode = [];
    var oJs = document.createElement("script");
    if (typeof(fnCallBack) == "function") {
        var iTimeStamp = Date.parse(new Date());
        iTimeStamp += "_" + Math.random(iTimeStamp);
        window.g_jsonnode.push(iTimeStamp);
        window.g_jsonnode.push(oJs);
        window.g_jsonnode.push(fnCallBack);
        sUrl = setURLParam(sUrl, "timestamp", iTimeStamp);
    }
    else 
        if (typeof(fnCallBack) == "string") {
            sUrl = setURLParam(sUrl, "callback", fnCallBack);
        }
    oJs.setAttribute("src", sUrl);
    oJs.setAttribute("charset", sCharset || "gb2312");
    oJs.setAttribute("type", "text/javascript");
    document.body.appendChild(oJs);
    return true;
}
QSAjax.JSON.callBack = function(iCode, iTimeStamp, oData){
    for (var i = 0; i < window.g_jsonnode.length; i += 3) {
        if (window.g_jsonnode[i] == iTimeStamp) {
            window.g_jsonnode[i + 2](iCode, oData);
            break;
        }
    }
}
function QSUser(iUin){
    var base = this;
    this.g_Uin = iUin;
    this.g_UserInfo = {
        fetch: false,
        qwinfo: {
            uin: 0,
            name: '',
            sex: '',
            nick: '',
            vip: 0,
            viphome: 0,
            vipgame: 0,
            msgask: 0,
            msggift: 0,
            msgrebuy: 0,
            send: ''
        },
        fnCallBack: null,
        fnCallBackFail: null,
        _callXMLFail: function(){
            window.location.reload(true);
        },
        _fillJsonData: function(iCode, oData){
            base.g_UserInfo.fetch = true;
            base.g_UserInfo.qwinfo = oData;
            if (base.g_UserInfo.fnCallBack) 
                base.g_UserInfo.fnCallBack.apply(base.g_UserInfo, [iCode]);
        },
        _fillXmlData: function(response){
            var responseXML = response.responseXML;
            base.g_UserInfo.fetch = true;
            var iCode = parseInt(responseXML.getElementsByTagName("QQHOME")[0].getAttribute("code"));
            if (iCode == 0) {
                var node = responseXML.getElementsByTagName("node")[0];
                for (var prop in base.g_UserInfo.qwinfo) {
                    base.g_UserInfo.qwinfo[prop] = node.getAttribute(prop);
                }
                if (base.g_UserInfo.fnCallBack) 
                    base.g_UserInfo.fnCallBack.apply(base.g_UserInfo, [iCode]);
            }
            else {
                if (base.g_UserInfo.fnCallBackFail) 
                    base.g_UserInfo.fnCallBackFail.apply(base.g_UserInfo, [iCode]);
            }
        }
    };
    this.g_ScenInfo = {
        fetch: false,
        defaultRoom: 0,
        hotRoom: 0,
        name: "",
        msgask: 0,
        msggift: 0,
        msgrebuy: 0,
        sceninfo: [],
        fnCallBack: null,
        fnCallBackFail: null,
        _fillXmlData: function(response){
            var responseXML = response.responseXML;
            base.g_ScenInfo.fetch = true;
            var root = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(root.getAttribute("code"));
            if (iCode == 0) {
                base.g_ScenInfo.defaultRoom = -1;
                base.g_ScenInfo.name = root.getAttribute("name");
                base.g_ScenInfo.msgask = parseInt(root.getAttribute("msgask"));
                base.g_ScenInfo.msggift = parseInt(root.getAttribute("msggift"));
                base.g_ScenInfo.msgrebuy = parseInt(root.getAttribute("msgrebuy"));
                var nodes = responseXML.getElementsByTagName("node");
                var lastTime = 0;
                var hotRoom = 0;
                for (var i = 0; i < nodes.length; i++) {
                    var value = {
                        iNo: parseInt(nodes[i].getAttribute("iNo")),
                        name: nodes[i].getAttribute("name"),
                        comment: nodes[i].getAttribute("comment"),
                        time: nodes[i].getAttribute("time"),
                        max: nodes[i].getAttribute("default"),
                        relno: nodes[i].getAttribute("relno"),
                        num: nodes[i].getAttribute("num"),
                        total: parseInt(nodes[i].getAttribute("total")),
                        show: nodes[i].getAttribute("show")
                    }
                    if (value.time > lastTime) {
                        base.g_ScenInfo.defaultRoom = value.iNo;
                        lastTime = value.time;
                    }
                    if (value.total > hotRoom) {
                        base.g_ScenInfo.hotRoom = value.iNo;
                        hotRoom = value.total;
                    }
                    base.g_ScenInfo.sceninfo.push(value);
                }
                if (base.g_ScenInfo.fnCallBack) 
                    base.g_ScenInfo.fnCallBack.apply(base.g_ScenInfo, [iCode]);
            }
            else {
                if (base.g_ScenInfo.fnCallBackFail) 
                    base.g_ScenInfo.fnCallBackFail.apply(base.g_ScenInfo, [iCode]);
            }
        }
    };
}

QSUser.prototype.getInfo = function(fnCallBack, fnCallBackFail, iCallType, iLogin){
    if (!iCallType) 
        iCallType = QSAjax.XMLCALL;
    this.g_UserInfo.fnCallBack = fnCallBack;
    this.g_UserInfo.fnCallBackFail = fnCallBackFail;
    if (this.g_UserInfo.fetch) {
        if (this.g_UserInfo.fnCallBack) 
            this.g_UserInfo.fnCallBack.apply(this.g_UserInfo);
        return this.g_UserInfo;
    }
    else {
        if (iCallType == QSAjax.JSONCALL) {
            var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_services_uereinfo", this.g_UserInfo._fillJsonData);
            return this.g_UserInfo;
        }
        else {
            var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_info4qzone?uin=" + (iLogin ? top.g_iUin : -1), this.g_UserInfo._fillXmlData, this.g_UserInfo._callXMLFail);
            return this.g_UserInfo;
        }
    }
}
QSUser.prototype.getTreeVip = function(){
    if (this.g_UserInfo.fetch) {
        return {
            red: this.g_UserInfo.qwinfo.vip,
            home: this.g_UserInfo.qwinfo.viphome
        };
    }
    return null;
}
QSUser.prototype.getScenList = function(bGetTemp, fnCallBack, fnCallBackFail, iCallType){
    if (!iCallType) 
        iCallType = QSAjax.XMLCALL;
    this.g_ScenInfo.fnCallBack = fnCallBack;
    this.g_ScenInfo.fnCallBackFail = fnCallBackFail;
    if (iCallType == QSAjax.JSONCALL) {
        return null;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_sceninfo?show=1&temp=" + (bGetTemp ? 1 : 0) + "&uin=" + this.g_Uin, this.g_ScenInfo._fillXmlData);
        return this.g_ScenInfo;
    }
}
QSUser.prototype.DeleteScen = function(iNo){
    function fnEQ(oElement){
        return oElement.iNo == iNo;
    }
    this.g_ScenInfo.sceninfo.remove_if(fnEQ);
}
QSUser.prototype.AddScen = function(oNode){
    this.g_ScenInfo.sceninfo.push(oNode);
}
QSUser.prototype.RenameScen = function(iNo, rName){
    var arrInfo = this.g_ScenInfo.sceninfo;
    for (var i = 0; i < arrInfo.length; i++) {
        if (arrInfo[i].iNo == iNo) {
            arrInfo[i].name = rName;
            break;
        }
    }
    return;
}
QSUser.prototype.UpdateScen = function(iNo, oShow){
    var arrInfo = this.g_ScenInfo.sceninfo;
    for (var i = 0; i < arrInfo.length; i++) {
        if (arrInfo[i].iNo == iNo) {
            arrInfo[i].show = oShow;
            break;
        }
    }
    return;
}
QSUser.prototype.getScenInfo = function(iNo){
    var arrInfo = this.g_ScenInfo.sceninfo;
    for (var i = 0; i < arrInfo.length; i++) {
        if (arrInfo[i].iNo == iNo) {
            return {
                index: i,
                info: arrInfo[i]
            };
        }
    }
    return null;
}
function QSRoom(oUser, oBindTag, iName){
    var base = this;
    this.g_User = oUser;
    this.g_Uin = oUser.g_Uin;
    this.g_Name = iName || '';
    this.g_Room = oBindTag;
    this.m_arrHistory = [], this.m_iHistoryPointer = 0, this.g_GuestNum = 0, this.oldShow = "", this.newShow = "", this.g_RoomInfo = {
        fetch: false,
        fnCallBack: null,
        fnCallBackFail: function(iCode, sMessage){
            if (iCode == -1001) {
                parent.closePopup();
                parent.showLoginBox("zhen");
            }
        },
        _fillJsonData: function(iCode, oData){
            base.g_RoomInfo.fetch = true;
            base.g_RoomInfo.qwinfo = oData;
            if (base.g_RoomInfo.fnCallBack) {
                base.g_RoomInfo.apply(base.g_RoomInfo, [iCode]);
            }
        },
        _fillXmlData4create: function(response){
            var responseXML = response.responseXML;
            var oRes = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(oRes.getAttribute("code"));
            if (0 == iCode) {
                var oNode = {
                    iNo: oRes.getAttribute("ino"),
                    name: '',
                    comment: '',
                    time: '',
                    max: 20,
                    relno: '',
                    num: '',
                    total: '',
                    show: 'V1##' + base.g_Uin + '_900_0_309_198_0_'
                }
                base.g_User.AddScen(oNode);
                base.g_RoomInfo.fnCallBack.apply(base.g_RoomInfo, [iCode]);
                parent.closePopup();
            }
            else {
                var sMessage = oRes.getAttribute("message");
                if (-2 == iCode) {
                    alert("您的房间（包括暂存房间）已经达到20套的上限。如要新建请先删除部分房间。");
                    return;
                }
                if (sMessage.indexOf("敏感字符") != -1) {
                    alert(sMessage);
                    return;
                }
                base.g_RoomInfo.fnCallBackFail.apply(base.g_RoomInfo, [iCode, sMessage]);
            }
        },
        _fillXmlData4save: function(response){
            var responseXML = response.responseXML;
            var oRes = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(oRes.getAttribute("code"));
            if (0 == iCode) {
                base.g_RoomInfo.fnCallBack.apply(base.g_RoomInfo, [iCode]);
            }
            else {
                var sMessage = oRes.getAttribute("message");
                if (-111 == iCode) {
                    alert("您的房间中有部分物品已过期，保存失败！");
                    return;
                }
                base.g_RoomInfo.fnCallBackFail.apply(base.g_RoomInfo, [iCode, sMessage]);
            }
        },
        _fillXmlData4Delete: function(response){
            var responseXML = response.responseXML;
            var oRes = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(oRes.getAttribute("code"));
            if (0 == iCode) {
                base.g_RoomInfo.fetch = false;
                if (base.g_RoomInfo.fnCallBack) {
                    base.g_RoomInfo.fnCallBack.apply(base.g_RoomInfo, [iCode]);
                }
            }
            else {
                var sMessage = oRes.getAttribute("message");
                base.g_RoomInfo.fnCallBackFail.apply(base.g_RoomInfo, [iCode, sMessage]);
            }
        },
        _fillXmlData4Rename: function(response){
            var responseXML = response.responseXML;
            var oRes = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(oRes.getAttribute("code"));
            if (0 == iCode) {
                base.g_RoomInfo.fnCallBack.apply(base.g_RoomInfo, [iCode]);
                parent.closePopup();
            }
            else {
                var sMessage = oRes.getAttribute("message");
                if (sMessage.indexOf("敏感字符") != -1) {
                    alert("对不起，小屋名称中含有敏感字符，请重新输入！");
                    return;
                }
                base.g_RoomInfo.fnCallBackFail.apply(base.g_RoomInfo, [iCode, sMessage]);
            }
        }
    };
    this.g_VistorInfo = {
        pageno: 0,
        pagenum: 0,
        vistorinfo: [],
        fnCallBack: null,
        fnCallBackFail: function(iCode, sMessage){
            if (iCode == -1001) {
                parent.showLoginBox("zhen");
            }
        },
        _fillXmlData: function(response){
            var responseXML = response.responseXML;
            var root = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(root.getAttribute("code"));
            if (iCode == 0) {
                base.g_VistorInfo.pageno = parseInt(root.getAttribute("pno"));
                base.g_VistorInfo.pagenum = parseInt(root.getAttribute("pnum"));
                var nodes = responseXML.getElementsByTagName("node");
                base.g_VistorInfo.vistorinfo = [];
                for (var i = 0; i < nodes.length; i++) {
                    var value = {
                        iUinGuest: nodes[i].getAttribute("iUinGuest"),
                        showid: nodes[i].getAttribute("showid"),
                        sWord: nodes[i].getAttribute("sWord"),
                        bubid: nodes[i].getAttribute("bubid"),
                        nick: nodes[i].getAttribute("nick"),
                        iScenario: nodes[i].getAttribute("iScenario"),
                        iStatus: nodes[i].getAttribute("iStatus"),
                        iTime: parseInt(nodes[i].getAttribute("iTime")),
                        iLastTime: nodes[i].getAttribute("iLastTime")
                    }
                    base.g_VistorInfo.vistorinfo.push(value);
                }
                if (base.g_VistorInfo.fnCallBack) 
                    base.g_VistorInfo.fnCallBack.apply(base.g_VistorInfo, [iCode]);
            }
            else {
                if (base.g_VistorInfo.fnCallBackFail) 
                    base.g_VistorInfo.fnCallBackFail.apply(base.g_VistorInfo, [iCode]);
            }
        }
    };
}

QSRoom.prototype.GetVistor = function(fnCallBack, iCallType, iNo, iPage, iSize){
    this.g_VistorInfo.fnCallBack = fnCallBack;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_words_get?size=" + iSize + "&pno=" + iPage + "no=" + iNo + "&uin=" + top.g_iUin, this.g_VistorInfo._fillXmlData);
        return this.g_VistorInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_words_get?size=" + iSize + "&pno=" + iPage + "&no=" + iNo + "&uin=" + top.g_iUin, this.g_VistorInfo._fillXmlData);
        return this.g_VistorInfo;
    }
}
QSRoom.prototype.Create = function(fnCallBack, iCallType, iName){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    this.g_Name = iName;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_scensave?no=0&type=1&name=" + this.g_Name.escUrl(), this.g_RoomInfo._fillXmlData4create);
        return this.g_VistorInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_scensave?no=0&type=1&name=" + this.g_Name.escUrl() + "&show=" + 'V1##', this.g_RoomInfo._fillXmlData4create);
        return this.g_VistorInfo;
    }
}
QSRoom.prototype.LoadRoomNoCall = function(sShow){
    if (this.g_Room.m_oScene) {
        HomeBusController.Reset(this.g_Room);
    }
    HomeBusController.CreateScene(this.g_Room, this.g_Uin, false, 1, !(GetQzoneLoginUin() == this.g_Uin), !(GetQzoneLoginUin() == this.g_Uin));
    HomeShow.Decode(this.g_Room, sShow);
    this.g_GuestNum = this.g_Room.m_oScene.m_arrUsers.length;
    HomeBusController.BindToolbar.apply(this, [this.g_Room, null, this.OnToolbarClick]);
    HomeBusController.MarkUser(this.g_Room, GetQzoneLoginUin());
}
QSRoom.prototype.OnToolbarClick = function(eventType, oItem){
    switch (eventType) {
        case "changeshow_event":
            if ((oNav.g_GuestUser ? oNav.g_GuestUser.g_UserInfo.qwinfo.vip : oUser.g_UserInfo.qwinfo.vip) == 1) {
                parent.popupDialog('', '<iframe border="no" width=360 height=390 style="border:none;" src="http://show.qq.com/showworld/alert_qqshow_art.htm?from=1"></iframe>', 390, 360);
            }
            else {
                top.popupDialog("温馨提示", '<div style="font:10pt;width:400px;height:200px;text-align:center;"><br/><br/><br/><br/><br/><p>您还不是红钻贵族，不能使用历史形象换装。<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=qqshow" target="_blank">开通红钻</a></p>', 400, 150);
            }
            break;
        case "rev_event":
            RevItem(m_oRoom);
            break;
        case "top_event":
            ItemTop(m_oRoom);
            break;
        case "bottom_event":
            ItemBottom(m_oRoom);
            break;
        case "del_event":
            if (oItem.type == 1) {
                DelItem(oRoom);
            }
            else {
                _DelUser(oRoom.m_arrSelectItem[0].m_iUin);
            }
            ShowTip();
            break;
        case "kick_event":
            _KickUser(m_oRoom.m_arrSelectItem[0].m_iUin);
            break;
        case "up_event":
            ItemUp(m_oRoom);
            break;
        case "down_event":
            ItemDown(m_oRoom);
            break;
    }
}
QSRoom.prototype.LoadRoom = function(fnCallBack, iCallType, iNo){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    if (!this.g_User.g_ScenInfo.fetch) {
        this.g_User.getScenList(0, fnCallBack, null, iCallType);
    }
    var arrInfo = this.g_User.g_ScenInfo.sceninfo;
    for (var i = 0; i < this.g_User.g_ScenInfo.sceninfo.length; i++) {
        if (arrInfo[i].iNo == iNo) {
            this.oldShow = arrInfo[i].show;
            this.LoadRoomNoCall(arrInfo[i].show);
        }
    }
    fnCallBack.apply(this.g_User.g_ScenInfo);
    return this.g_User.g_ScenInfo;
}
QSRoom.prototype.GetRoomInfo = function(fnCallBack, iCallType, iNo){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    if (this.g_User.g_ScenInfo.fetch) {
        this.fnCallBack.apply(this.g_User.g_ScenInfo);
        return this.g_User.g_ScenInfo;
    }
    this.g_User.getScenList(0, fnCallBack, null, iCallType);
    return this.g_User.g_ScenInfo;
}
QSRoom.prototype.SaveRoom = function(fnCallBack, iCallType, iNo, rName, iServer){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    this.g_Name = rName;
    HomeShow.Encode(this.g_Room);
    this.newShow = this.g_Room.m_strShow;
    if (this.g_Room.m_arrHistory) {
        this.g_Room.m_arrHistory = [];
        this.g_Room.m_iHistoryPointer = 0;
    }
    if (typeof iServer == "undefined") {
        if ((GetQzoneLoginUin() == this.g_Uin)) {
            var sUrl = "http://world.show.qq.com/cgi-bin/qqhome_user_scensave?saveall=1&type=1&name=";
        }
        else {
            var sUrl = "http://world.show.qq.com/cgi-bin/qqhome_user_opsave?uin=" + this.g_Uin + "&name=";
        }
        if (iCallType == QSAjax.JSONCALL) {
            var ajax = new QSAjax(QSAjax.JSONCALL, "GET", sUrl + this.g_Name.escUrl() + "&no=" + iNo + "&show=" + this.newShow, this.g_RoomInfo._fillXmlData4save);
            return this.g_RoomInfo;
        }
        else {
            var ajax = new QSAjax(QSAjax.XMLCALL, "GET", sUrl + this.g_Name.escUrl() + "&no=" + iNo + "&show=" + this.newShow, this.g_RoomInfo._fillXmlData4save);
            return this.g_RoomInfo;
        }
    }
}
QSRoom.prototype.DeleteRoom = function(fnCallBack, iCallType, iNo){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_delete_scenario?scenario=" + iNo, this.g_RoomInfo._fillJsonData4Delete);
        return this.g_RoomInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_delete_scenario?scenario=" + iNo, this.g_RoomInfo._fillXmlData4Delete);
        return this.g_RoomInfo;
    }
}
QSRoom.prototype.RenameRoom = function(fnCallBack, iCallType, iNo, iName){
    this.g_RoomInfo.fnCallBack = fnCallBack;
    this.g_TempName = iName;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_rename_scenario?scenario=" + this.g_RoomInfo.qwinfo.ino + "&name=" + iName.escUrl(), this.g_RoomInfo._fillJsonData4Rename);
        return this.g_RoomInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_rename_scenario?scenario=" + iNo + "&name=" + iName.escUrl(), this.g_RoomInfo._fillXmlData4Rename);
        return this.g_RoomInfo;
    }
}
function QSPoker(){
    var base = this;
    this.g_Uin;
    this.g_GuestNum = 0;
    this.g_PokerInfo = {
        fetch: false,
        pokerinfo: [],
        fnCallBack: null,
        fnCallBackFail: null,
        _fillXmlData: function(response){
            var responseXML = response.responseXML;
            base.g_PokerInfo.fetch = true;
            var root = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(root.getAttribute("code"));
            base.g_GuestNum = parseInt(root.getAttribute("msgnum"));
            if (iCode == 0) {
                var nodes = responseXML.getElementsByTagName("node");
                for (var i = 0; i < nodes.length; i++) {
                    var value = {
                        guin: nodes[i].getAttribute("guin"),
                        gnick: nodes[i].getAttribute("gnick")
                    }
                    base.g_PokerInfo.pokerinfo.push(value);
                }
                if (base.g_PokerInfo.fnCallBack) 
                    base.g_PokerInfo.fnCallBack.apply(base.g_PokerInfo, [iCode]);
            }
            else {
                if (base.g_PokerInfo.fnCallBackFail) 
                    base.g_PokerInfo.fnCallBackFail.apply(base.g_PokerInfo, [iCode]);
            }
        },
        _pokeCallBack: function(response){
            var responseXML = response.responseXML;
            var root = responseXML.getElementsByTagName("QQHOME")[0];
            var iCode = parseInt(root.getAttribute("code"));
            if (iCode == 0) {
                if (base.g_PokerInfo.fnCallBack) 
                    base.g_PokerInfo.fnCallBack.apply(base.g_PokerInfo, [iCode]);
            }
            else {
                if (base.g_PokerInfo.fnCallBackFail) 
                    base.g_PokerInfo.fnCallBackFail.apply(base.g_PokerInfo, [iCode]);
            }
        }
    }
}

QSPoker.prototype.Poke = function(fnCallBack, fnCallBackFail, iCallType){
    var base = this;
    base.g_PokerInfo.fnCallBack = fnCallBack;
    base.g_PokerInfo.fnCallBackFail = fnCallBackFail;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_poke_save?muin=" + top.g_iUin, base.g_PokerInfo._pokeCallBack);
        return this.g_PokerInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_poke_save?muin=" + top.g_iUin, base.g_PokerInfo._pokeCallBack);
        return this.g_PokerInfo;
    }
}
QSPoker.prototype.GetPokerInfo = function(fnCallBack, fnCallBackFail, iCallType){
    var base = this;
    base.g_PokerInfo.fnCallBack = fnCallBack;
    base.g_PokerInfo.fnCallBackFail = fnCallBackFail;
    if (iCallType == QSAjax.JSONCALL) {
        var ajax = new QSAjax(QSAjax.JSONCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_poke_get?muin=" + top.g_iUin, base.g_PokerInfo._fillXmlData);
        return this.g_PokerInfo;
    }
    else {
        var ajax = new QSAjax(QSAjax.XMLCALL, "GET", "http://world.show.qq.com/cgi-bin/qqhome_user_poke_get?muin=" + top.g_iUin, base.g_PokerInfo._fillXmlData);
        return this.g_PokerInfo;
    }
}
function QSNavigator(oUser){
    var base = this;
    this.g_Uin = oUser.g_Uin;
    this.g_User = oUser;
    this.g_GuestUser = null;
    this.g_RoomIndex = -1;
    this.g_CurrentRoomId = 0;
    this.g_CurrPage = 0;
    this.bNeedSaveRoom = false;
    this.g_strCmd = "";
}

QSNavigator.prototype.Init = function(fnCallBack){
    var base = this;
    function GetScenSucc(iCode){
        base.g_CurrentRoomId = base.g_User.g_ScenInfo.defaultRoom;
        fnCallBack.apply(base, [iCode]);
    }
    if (base.g_User.g_ScenInfo.fetch) 
        GetScenSucc(0);
    else 
        base.g_User.getScenList(0, GetScenSucc, null, QSAjax.XMLCALL);
}
QSNavigator.prototype.InitGuest = function(gUser){
    this.g_GuestUser = gUser || this.g_User;
}
QSNavigator.prototype.LoadRoom = function(oBindTag, rListId){
    var base = this;
    if (!this.oRoom) {
        var oRoom = new QSRoom(this.g_User, oBindTag);
        this.oRoom = oRoom;
        oRoom.oNav = base;
    }
    if (this.oRoom.g_Room.m_arrHistory) {
        this.oRoom.g_Room.m_arrHistory = [];
        this.oRoom.g_Room.m_iHistoryPointer = 0;
    }
    if (this.bNeedSaveRoom) {
        var iRet = confirm("您刚才改变了房间中的物品或人物位置，是否保存后离开？");
        if (iRet) {
            base.SaveRoom();
        }
        else {
            this.bNeedSaveRoom = false;
        }
    }
    this.g_strCmd = "";
    var id = rListId > 0 ? rListId : this.g_CurrentRoomId;
    var oRoomInfo = this.g_User.getScenInfo(id);
    if (oRoomInfo) {
        base.g_RoomIndex = oRoomInfo.index;
        base.g_CurrentRoomId = id;
        base.oRoom.newShow = oRoomInfo.info.show;
        this.oRoom.LoadRoomNoCall(oRoomInfo.info.show);
    }
    ShowTip(4);
}
QSNavigator.prototype.PrevRoom = function(){
    var base = this;
    if (this.bNeedSaveRoom) {
        var iRet = confirm("您刚才改变了房间中的物品或人物位置，是否保存后离开？");
        if (iRet) {
            base.SaveRoom();
        }
        else {
            this.bNeedSaveRoom = false;
        }
    }
    if (this.g_RoomIndex == 0) {
        alert("您当前查看的已经是最后的房间了！");
        return;
    }
    else {
        --this.g_RoomIndex;
        this.g_CurrentRoomId = this.g_User.g_ScenInfo.sceninfo[this.g_RoomIndex].iNo;
    }
    this.LoadRoom();
}
QSNavigator.prototype.NextRoom = function(){
    var base = this;
    if (this.bNeedSaveRoom) {
        var iRet = confirm("您刚才改变了房间中的物品或人物位置，是否保存后离开？");
        if (iRet) {
            base.SaveRoom();
        }
        else {
            this.bNeedSaveRoom = false;
        }
    }
    if (this.g_RoomIndex == this.g_User.g_ScenInfo.sceninfo.length - 1) {
        alert("您当前查看的已经是最新的房间了！");
        return;
    }
    else {
        ++this.g_RoomIndex;
        this.g_CurrentRoomId = this.g_User.g_ScenInfo.sceninfo[this.g_RoomIndex].iNo;
    }
    this.LoadRoom();
}
QSNavigator.prototype.DeleteRoom = function(){
    var base = this;
    if (base.g_RoomIndex == 0 && base.g_User.g_ScenInfo.sceninfo.length == 1) {
        alert("不可删除唯一的房间！");
        return;
    }
    var iRet = confirm("删除当前房间?");
    if (!iRet) 
        return;
    function DeleteSucc(){
        base.g_User.DeleteScen(base.g_CurrentRoomId);
        if (base.g_RoomIndex == base.g_User.g_ScenInfo.sceninfo.length) {
            --base.g_RoomIndex;
        }
        base.g_CurrentRoomId = base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].iNo;
        base.bNeedSaveRoom = false;
        base.LoadRoom();
    }
    this.oRoom.DeleteRoom(DeleteSucc, QSAjax.XMLCALL, this.g_CurrentRoomId);
}
QSNavigator.prototype.AddRoom = function(rName){
    var base = this;
    if (this.bNeedSaveRoom) {
        var iRet = confirm("您刚才改变了房间中的物品或人物位置，是否保存后新建？");
        if (iRet) {
            base.SaveRoom();
        }
        else {
            this.bNeedSaveRoom = false;
        }
    }
    if (this.g_User.g_ScenInfo.sceninfo.length == 20) {
        top.popupDialog("温馨提示", '<div style="font:10pt;width:400px;height:200px;text-align:center;"><br/><br/><br/><br/><br/><p>您的目前房间（包括暂存房间）已经达到上限。不能新建了。<br>您可以装扮暂存房间保存为新房间或者删除已有的房间。</p>', 400, 150);
        return;
    }
    function CreateSucc(){
        base.g_RoomIndex = base.g_User.g_ScenInfo.sceninfo.length - 1;
        base.g_CurrentRoomId = base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].iNo;
        base.g_User.RenameScen(base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].iNo, rName);
        base.LoadRoom();
    }
    base.oRoom.Create(CreateSucc, QSAjax.XMLCALL, rName)
}
QSNavigator.prototype.RenameRoom = function(rName){
    var base = this;
    function RenameSucc(){
        base.g_User.RenameScen(base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].iNo, rName);
    }
    base.oRoom.RenameRoom(RenameSucc, QSAjax.XMLCALL, base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].iNo, rName);
}
QSNavigator.prototype.SaveRoom = function(){
    var base = this;
    function SaveSucc(){
        base.g_User.UpdateScen(base.g_CurrentRoomId, base.oRoom.newShow);
        base.bNeedSaveRoom = false;
        base.g_strCmd = "";
        ShowTip(2, '保存成功！', 3000);
    }
    base.oRoom.SaveRoom(SaveSucc, QSAjax.XMLCALL, base.g_CurrentRoomId, base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].name)
}
QSNavigator.prototype.RestoreRoom = function(){
    var base = this;
    if (base.oRoom.g_Room.m_arrHistory.length == 0) 
        return;
    var iRet = confirm("您确认恢复成上次保存的房间吗？");
    if (!iRet) {
        return;
    }
    this.g_strCmd = "";
    base.oRoom.LoadRoomNoCall(base.oRoom.g_Room.m_arrHistory[0]);
    ShowTip(2, '您的房间已经恢复成上一次保存的样子。', 3000);
}
QSNavigator.prototype.FreshRoomName = function(oName, oInfo){
    var base = this;
    if (base.g_RoomIndex != -1) {
        oName.innerHTML = base.g_User.g_ScenInfo.sceninfo[base.g_RoomIndex].name.escHtml();
        oInfo.innerHTML = '房间内共有' + base.oRoom.g_Room.m_oScene.m_arrUsers.length + '人';
    }
}
QSNavigator.prototype.GetVistor = function(fnCallBack, iPage){
    var base = this;
    base.oRoom.GetVistor(fnCallBack, QSAjax.XMLCALL, base.g_CurrentRoomId, iPage, 12);
}
QSNavigator.prototype.NeedSaveRoom = function(){
    this.bNeedSaveRoom = true;
}
function SWTag(){
}
(function(){
    SWTag.parse = function(){
        var arrDivs = document.getElementsByTagName("DIV");
        for (var i = 0; i < arrDivs.length; i++) {
            var sType = arrDivs[i].getAttribute("swtype");
            if (!sType) 
                continue;
            if (sType.toUpperCase() == 'ROOM') {
                SWTagRoom.parse(arrDivs[i]);
                arrDivs[i].addRoomClickEventListener = function(fnCallBack){
                    SWTag.addRoomClickEventListener(this, fnCallBack)
                };
            }
            else 
                if (sType.toUpperCase() == 'TOOLBAR') {
                }
        }
    }
    function _onclick(event, oEle, fnCallBack){
        fnCallBack(event, oEle);
    }
    SWTag.addRoomClickEventListener = function(oEle, fnCallBack){
        HomeEvent.addEventListener(oEle, "onclick", function(event){
            _onclick(event, oEle, fnCallBack)
        });
    }
})();
function SWTagRoom(){
}
(function(){
    SWTagRoom.parse = function(oEle){
        oEle.className = "room";
        var sId = oEle.getAttribute('appid') + "_" + oEle.getAttribute('id');
        var bDisableItem = oEle.getAttribute('disitem') == "true";
        var bDisableUser = oEle.getAttribute('disuser') == "true";
        HomeBusController.CreateScene(oEle, sId, false, 1, bDisableItem, bDisableUser);
        var iUin = parseInt(oEle.getAttribute('uin'));
        var iRoomId = parseInt(oEle.getAttribute('roomid'));
        if (!(isNaN(iUin) && isNaN(iRoomId))) {
            SWTagRoom.loadRoom(oEle, iUin, iRoomId);
        }
    }
    SWTagRoom.loadRoom = function(oEle, uin, no){
        var sUrl = "http://world.show.qq.com/cgi-bin/qqhome_user_sceninfo?show=1&uin=" + uin + "&no=" + no;
        function fnSucc(oResponseXML){
            var sShow = oResponseXML.getElementsByTagName("node")[0].getAttribute("show");
            HomeShow.Decode(oEle, sShow);
        }
        function fnFail(oResponseXML){
            alert(oResponseXML.xml);
        }
        function fnError(oResponseXML){
            alert(oResponseXML.xml);
        }
        getQQHomeXml(sUrl, fnSucc, fnFail, fnError);
    }
})();
