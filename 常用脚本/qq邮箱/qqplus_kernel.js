








function WebQQCallBack(responseText, httpStatus, oldData, oldState){
    if (httpStatus != -9999) {
        QQPlusEngine.ClearResponseTimeout();
    }
    
    if (typeof(QQPlusEngine.onresponse) == "function") {
    
    
    
    
    
    
    
    
        QQPlusEngine.onresponse.call(this, responseText, httpStatus, oldData, oldState);
    }
}

var QQPlusEngine = {

    WEBQQ_PROXYPAGE: (location.protocol == "https:") ? "https://webqq1.mail.qq.com" : "http://rwebqq1.qq.com/",
    WEBQQ_SERVER: (location.protocol == "https:") ? "https://webqq1.mail.qq.com" : "http://rwebqq1.qq.com/",
    
    
    RESPONSE_TIMEOUT: 15000,
    
    
    onload: null,
    onresponse: null,
    onsend: null,
    
    
    Initialize: function(proxyUrl){
        if (this.engineLoading || this.engineWin != null) {
            return;
        }
        var engineId = "QQPlusEngineIframe";
        var engineObj = S(engineId);
        
        
        if (!(this.proxyUrl != null && proxyUrl == null)) {
            this.proxyUrl = proxyUrl;
        }
        
        if (engineObj) 
            engineObj.parentNode.removeChild(engineObj);
        
        engineObj = createPanel(top, engineId, [(this.proxyUrl ? this.proxyUrl : this.WEBQQ_PROXYPAGE), "&r=", Math.random()].join(""), "QQPlusEngine.EngineOnLoad(this);", "position:absolute;z-index:-1;width:1px;height:1px;left:-5;top:-5px;");
        
        this.engineLoading = true;
    },
    
    IsSending: function(){
        return this.IsSetResponseTimeout();
    },
    
    Send: function(data, url, timeout){
        if (this.engineWin) {
        
            QQPlusEngine.SetResponseTimeout(data, timeout);
            setTimeout(function(){
                QQPlusEngine.engineWin.SetRequestUrl(url ? url : QQPlusEngine.WEBQQ_SERVER);
                QQPlusEngine.engineWin.SetRequestData(data);
                QQPlusEngine.Abort();
                if (typeof(QQPlusEngine.onsend) == "function") {
                    try {
                        QQPlusEngine.onsend(true);
                    } 
                    catch (e) {
                    }
                }
                QQPlusEngine.engineWin.SendAPI(true);
            }, 10);
        }
        else {
            if (typeof(QQPlusEngine.onsend) == "function") {
                try {
                    QQPlusEngine.onsend(false);
                } 
                catch (e) {
                }
            }
        }
    },
    
    Abort: function(){
        if (this.engineWin) {
            this.engineWin.AbortRequest();
        }
    },
    
    
    loadErrTimes: 0,
    proxyUrl: null,
    engineLoading: false,
    engineWin: null,
    responseTimer: null,
    
    EngineOnLoad: function(obj){
        QQPlusEngine.engineLoading = false;
        if (obj.src.indexOf("/") == -1) 
            return;
        
        try {
            var win = F(obj.id);
            if (win.SendAPI) {
                QQPlusEngine.engineWin = win;
                if (typeof(QQPlusEngine.onload) == "function") {
                    QQPlusEngine.onload.call();
                }
                return;
            }
        } 
        catch (e) {
        }
        if (++QQPlusEngine.loadErrTimes <= 10) {
            setTimeout("QQPlusEngine.Initialize();", 1000 * QQPlusEngine.loadErrTimes);
        }
    },
    
    IsSetResponseTimeout: function(){
        return this.responseTimer != null;
    },
    
    ClearResponseTimeout: function(){
        if (this.IsSetResponseTimeout()) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
    },
    
    SetResponseTimeout: function(data, timeout){
        this.ClearResponseTimeout();
        this.responseTimer = setTimeout(function(){
            QQPlusEngine.ClearResponseTimeout();
            QQPlusEngine.Abort();
        }, timeout >= 100 ? timeout : this.RESPONSE_TIMEOUT);
    }
};

var QQPlusLocalEngine = {

    RESPONSE_TIMEOUT: 10000,
    
    
    onresponse: null,
    
    
    ENGINE_ID: "QQPlusLocalEngineIframe",
    
    
    Initialize: function(){
    },
    
    IsSending: function(){
        return this.IsSetResponseTimeout();
    },
    
    Send: function(data, url, timeout){
        this.Abort();
        createPanel(top, this.ENGINE_ID, [url, "?", data].join(""), "QQPlusLocalEngine.EngineOnLoad();", "position:absolute;z-index:-1;width:1px;height:1px;left:-5;top:-5px;");
        this.SetResponseTimeout(timeout);
    },
    
    Abort: function(){
        var UC = this.GetEngineObj();
        if (UC) 
            UC.parentNode.removeChild(UC);
    },
    
    GetEngineObj: function(){
        return S(this.ENGINE_ID, top);
    },
    
    GetEngineWin: function(){
        return F(this.ENGINE_ID, top);
    },
    
    
    responseTimer: null,
    
    EngineOnLoad: function(){
        var callback = function(){
            var responseText = "";
            try {
                responseText = QQPlusLocalEngine.GetEngineWin().document.body.innerHTML;
            } 
            catch (e) {
            }
            
            QQPlusLocalEngine.Reponse(responseText);
        };
        
        if (gbIsOpera) {
        
            setTimeout(callback, 1000);
        }
        else {
            callback();
        }
    },
    
    Reponse: function(responseText){
        this.ClearResponseTimeout();
        if (typeof(this.onresponse) == "function") {
            this.onresponse.call(this, responseText);
        }
    },
    
    IsSetResponseTimeout: function(){
        return this.responseTimer != null;
    },
    
    ClearResponseTimeout: function(){
        if (this.IsSetResponseTimeout()) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
    },
    
    SetResponseTimeout: function(timeout){
        this.ClearResponseTimeout();
        this.responseTimer = setTimeout(function(){
            QQPlusLocalEngine.Abort();
            QQPlusLocalEngine.Reponse("");
        }, timeout >= 100 ? timeout : this.RESPONSE_TIMEOUT);
    }
};

var QQPlusKernel = {

    IM_SERVER_LIST: location.protocol == "https:" ? ["https://webqq1.mail.qq.com"] : ["http://rwebqq1.qq.com", "http://rwebqq2.qq.com"],
    
    KEEP_ALIVE_INTERVAL: 30000,
    MAX_NORESPONSE_TIME: 90000,
    
    
    NOLOG: 0,
    LEVEL1: 1,
    LEVEL2: 2,
    LEVEL3: 3,
    
    
    USER_STAT_UNKNOWN: 0,
    USER_STAT_ONLINE: 10,
    USER_STAT_OFFLINE: 20,
    USER_STAT_AWAY: 30,
    USER_STAT_INVISIBLE: 40,
    
    
    MSG_TYPE_FROM: 0,
    MSG_TYPE_ME: 1,
    MSG_TYPE_ME_FAIL: 2,
    MSG_TYPE_SYSTEM: 3,
    MSG_TYPE_LOGIN_FAIL: 4,
    MSG_TYPE_OFFLINE: 5,
    
    
    STOP: 0,
    READY: 1,
    RUNNING: 2,
    
    
    onload: null,
    onlogin: null,
    onlog: null,
    ongetstatus: null,
    ongetmsg: null,
    ongetfriendslist: null,
    ongetinfo: null,
    
    
    Initialize: function(proxyUrl, uin, logtype){
        this.uin = uin;
        this.logtype = logtype ? logtype : this.NOLOG;
        this.kernelStatus = this.STOP;
        QQPlusEngine.onload = this.onload;
        QQPlusEngine.Initialize(proxyUrl);
        QQPlusLocalEngine.Initialize();
    },
    
    GetKernelStatus: function(){
        return this.kernelStatus || this.STOP;
    },
    
    RunQQPlus: function(serverUrl, session, isKeepRecv){
        if (this.session == null && this.kernelStatus == this.STOP) {
            this.Log(this.LEVEL1, "RunQQPlus", "run qqplus ...");
            this.kernelStatus = this.READY;
            this.isSendReady = true;
            this.isAllowInterrupt = true;
            this.isKeepRecv = false;
            this.msgIds = {};
            if (serverUrl && session) {
                this.kernelStatus = this.RUNNING;
                this.isKeepRecv = isKeepRecv;
                this.session = session;
                this.currentServerUrl = serverUrl;
                this.setKeepAlive("on");
            }
            else {
                this.InitLoginServerList();
                this.RedirectLoginServer();
                this.PushLoginCmd();
                this.DoSend();
            }
        }
    },
    
    stopQQPlus: function(){
        if (this.session != null) {
            this.Log(this.LEVEL1, "stopQQPlus", "stop qqplus ...");
            try {
                var img = new Image();
                img.src = [this.currentServerUrl, "?", this.uin, ";01;", (this.seq++), ";", this.session, ";?", Math.random()].join("");
            } 
            catch (e) {
            }
            this.session = null;
            this.kernelStatus = this.STOP;
            this.isKeepRecv = false;
            this.setKeepAlive("off");
            
            for (var i = this.sendList.send.length - 1; i >= 0; i--) {
                var value = this.sendList.send[i];
                this.ProcessSendMsgFail(null, value[0], value[1]);
            }
            for (var i in this.sendList) {
                this.sendList[i] = [];
            }
            
            var bw = {};
            var gk = QQPlusKernel.USER_STAT_UNKNOWN;
            for (var bM in this.uinsData) {
                bw[bM] = gk;
                this.SetUinData(bM, {
                    status: gk,
                    qqver: 0
                });
            }
            this.OnGetStatus(bw);
        }
    },
    
    GetGroupData: function(){
        return this.groupData;
    },
    
    GetFriendsSetFlag: function(){
        return this.friendsSetFlag;
    },
    
    GetFriendsSet: function(){
        return this.friendsSet;
    },
    
    getUinsData: function(){
        return this.uinsData;
    },
    
    getUinsStatus: function(uinlist){
        if (this.kernelStatus == this.RUNNING) {
            this.PushgetUinsInfoCmd(uinlist, "27");
            this.DoSend();
        }
    },
    
    getUinsInfo: function(uinlist){
        if (this.kernelStatus == this.RUNNING) {
            this.PushgetUinsInfoCmd(uinlist, "43");
            this.DoSend();
        }
    },
    
    GetFriendsList: function(){
        if (this.kernelStatus == this.RUNNING) {
            this.PushGetFriendsListCmd();
            this.DoSend();
        }
    },
    
    getUinSignData: function(touin){
        return this.signData[touin];
    },
    
    SetUinSignData: function(eA, axJ){
        this.signData[eA] = axJ;
    },
    
    SendMsg: function(touin, msg){
        if (this.kernelStatus == this.RUNNING) {
            this.PushSendMsgCmd(touin, msg);
            this.DoSend();
        }
        else {
            this.OnGetMsg(touin, msg, this.MSG_TYPE_LOGIN_FAIL);
        }
    },
    
    SetUinAction: function(eA, mf, ahF){
        var bw = {};
        
        if (typeof(mf) == "number") 
            bw.action = mf;
        
        if (typeof(ahF) == "string") 
            bw.subject = ahF;
        
        this.SetUinData(eA, bw);
    },
    
    SetFriendGroupId: function(di, ail){
        var yT = this.friendsSet;
        
        if (!ail) {
            if (!yT[di]) 
                yT[di] = 0;
        }
        else {
            yT[di] = ail;
        }
    },
    
    
    kernelStatus: null,
    serverListMask: null,
    currentServerUrl: null,
    
    seq: 0,
    logtype: null,
    
    uin: null,
    session: null,
    
    helloTimer: null,
    lastResponseTime: null,
    
    groupData: {
        0: "我的好友"
    },
    
    uinsData: {},
    friendsSet: {},
    friendsSetFlag: false,
    
    signData: {},
    
    sendList: {
        login: [],
        receipt: [],
        send: [],
        query: [],
        recv: []
    },
    
    
    priority: ["login", "receipt", "send", "query", "recv"],
    
    
    
    protocol: {
        "22": {
            list: "login",
            interrupt: false,
            timeout: 10000,
            resend: true
        },
        "17": {
            list: "receipt",
            interrupt: false,
            timeout: 8000,
            resend: false
        },
        "16": {
            list: "send",
            interrupt: false,
            timeout: 15000,
            resend: false
        },
        "27": {
            list: "query",
            interrupt: false,
            timeout: 15000,
            resend: true
        },
        "43": {
            list: "query",
            interrupt: false,
            timeout: 15000,
            resend: true
        },
        "61": {
            list: "query",
            interrupt: false,
            timeout: 15000,
            resend: true
        },
        
        "02": {
            list: "recv",
            interrupt: true,
            timeout: 10000,
            resend: false
        },
        "23": {
            list: "recv",
            interrupt: true,
            timeout: 15000,
            resend: false
        },
        "00": {
            list: "recv",
            interrupt: true,
            timeout: 15000,
            resend: false
        }
    },
    
    isSendReady: true,
    isKeepRecv: false,
    sendingProtocolData: null,
    
    msgIds: {},
    
    
    Log: function(logtype, funcName, log){
        if (logtype <= this.logtype && typeof(this.onlog) == "function") {
            try {
                this.onlog.call(this, logtype, funcName, log);
            } 
            catch (e) {
            }
        }
    },
    
    SetUinData: function(di, cz){
        di = parseInt(di);
        if (isNaN(di) || di < 10000) 
            return;
        
        if (!this.uinsData[di]) 
            this.uinsData[di] = {
                nick: "",
                remark: "",
                sex: 0,
                age: 0,
                status: this.USER_STAT_UNKNOWN,
                faceid: -1,
                mailnick: "",
                addr: "",
                action: 1,
                subject: "",
                forsearch: ""
            };
        
        if (!cz) 
            return;
        
        var aw = this.uinsData[di];
        
        for (var i in cz) 
            if (cz[i] != null) 
                aw[i] = cz[i];
        
        aw.forsearch = [di, aw.nick, aw.remark, aw.addr, aw.mailnick].join(" ").toLowerCase();
    },
    
    DoSend: function(){
        if (!this.isSendReady) {
            return;
        }
        
        if (QQPlusEngine.IsSending() &&
        this.sendingProtocolData != null &&
        this.sendingProtocolData.interrupt == false) {
            return;
        }
        this.isSendReady = false;
        
        var value = null;
        for (var i = 0, len = this.priority.length; i < len; i++) {
            var list = this.sendList[this.priority[i]];
            if (list != null && list.length > 0) {
                value = list.shift();
                break;
            }
        }
        
        if (value == null && this.isKeepRecv == true) {
            value = ["00", ""];
        }
        
        if (value != null &&
        QQPlusEngine.IsSending() &&
        this.sendingProtocolData != null &&
        this.sendingProtocolData.interrupt == true &&
        this.sendingProtocolData.list == this.protocol[value[0]].list) {
            if (value[0] != "00") {
                this.PushToSendList(value[0], value[1], true);
            }
            value = null;
        }
        
        if (value != null) {
            this.SendComposeProtocol(value[0], value[1]);
        }
        else {
            this.isSendReady = true;
        }
    },
    
    SendComposeProtocol: function(protocolID, data, signvalue){
        if (QQPlusEngine.onresponse != this.DoResponse) {
            QQPlusEngine.onresponse = this.DoResponse;
        }
        var parm = [this.uin, protocolID, this.seq++];
        switch (protocolID) {
            case "22":
                
                if (signvalue == null) {
                    QQPlusLocalEngine.onresponse = function(responseText){
                        QQPlusKernel.Log(QQPlusKernel.LEVEL1, "LoginSignResponse", ["sign return:", responseText].join(""));
                        var nG = responseText.replace(/ /ig, "").replace(/\n/ig, "");
                        
                        if (nG.length == 64) {
                            QQPlusKernel.SendComposeProtocol(protocolID, data, nG);
                        }
                        else {
                        
                            QQPlusKernel.SendComposeProtocolOK();
                            
                            QQPlusKernel.ProcessLoginFail();
                        }
                    };
                    var imkeyParam = ["sid=", getSid(), "&r=", Math.random()].join("");
                    QQPlusKernel.Log(QQPlusKernel.LEVEL1, "LoginSignRequest", ["url parm:", imkeyParam].join(""));
                    QQPlusLocalEngine.Send(imkeyParam, "/cgi-bin/getimkey");
                    return;
                }
                parm.push(["000000000000000000;", signvalue].join(""));
                break;
            case "16":
                var toUin = this.ParseCmd(data)[0];
                signvalue = this.getUinSignData(toUin);
                
                
                if (signvalue == null || signvalue.indexOf("svrmsg:") == 0) {
                    QQPlusLocalEngine.onresponse = function(responseText){
                    
                        var signvalue = responseText.replace(/ /ig, "").replace(/\n/ig, "");
                        
                        if (signvalue.indexOf("svrmsg:") == 0) {
                            QQPlusKernel.SetUinSignData(toUin, signvalue);
                            
                            
                            QQPlusKernel.SendComposeProtocolOK();
                            
                            
                            parm.push("session");
                            parm.push(signvalue);
                            parm.push(data);
                            
                            WebQQCallBack("", 200, parm.join(";"), 3);
                        }
                        else 
                            if (signvalue.length == 64) {
                                QQPlusKernel.SetUinSignData(toUin, signvalue);
                                QQPlusKernel.SendComposeProtocol(protocolID, data);
                            }
                            else {
                            
                                QQPlusKernel.SendComposeProtocolOK();
                                
                                parm.push("session");
                                parm.push("");
                                parm.push(data);
                                
                                QQPlusKernel.DoResponse("", 200, parm.join(";"), 3);
                            }
                    };
                    QQPlusLocalEngine.Send(["sid=", getSid(), "&touin=", toUin].join(""), "/cgi-bin/getimkey");
                    return;
                }
                parm.push(this.session);
                parm.push(signvalue);
                parm.push(data);
                break;
            default:
                parm.push(this.session);
                if (data) {
                    parm.push(data);
                }
                break;
        }
        QQPlusEngine.Abort();
        
        this.sendingProtocolData = this.protocol[protocolID];
        parm.push("");
        var value = parm.join(";");
        var timeout = this.sendingProtocolData.timeout ? this.sendingProtocolData.timeout : 15000;
        this.Log(this.LEVEL1, "SendComposeProtocol", ["send:", value, "\nurl:", (this.currentServerUrl ? this.currentServerUrl : "default"), "\ninterrupt:", this.sendingProtocolData.list, " ", this.sendingProtocolData.interrupt, "\ntimeout:", (timeout / 1000), "s"].join(""));
        if (QQPlusEngine.onsend != this.SendComposeProtocolOK) {
            QQPlusEngine.onsend = this.SendComposeProtocolOK;
        }
        QQPlusEngine.Send(value, this.currentServerUrl, timeout);
    },
    
    SendComposeProtocolOK: function(isOk){
        QQPlusKernel.Log(QQPlusKernel.LEVEL1, "SendComposeProtocolOK", isOk);
        QQPlusKernel.isSendReady = true;
    },
    
    
    
    
    DoResponse: function(responseText, httpStatus, oldData, oldState){
        QQPlusKernel.Log(QQPlusKernel.LEVEL1, "DoResponse", ["responseText:", responseText, "\nhttpStatus:", httpStatus, "\noldData:", oldData, "\noldState:", oldState, "\nsendingFlag:", QQPlusEngine.IsSending()].join(""));
        
        
        if (oldState != 3 && !(httpStatus == "200" && oldState == "2")) 
            return;
        
        
        
        
        
        QQPlusKernel.sendingProtocolData = null;
        
        var oldParams = QQPlusKernel.ParseCmd(oldData);
        var params = QQPlusKernel.ParseCmd(responseText);
        
        
        if (responseText == "" || params[0] != String(QQPlusKernel.uin)) 
            return QQPlusKernel.DoErrorProcess(oldParams, params);
        
        
        if (params[3] == "ff") 
            return QQPlusKernel.DoServerErrorProcess(oldParams, params);
        
        QQPlusKernel.UpdateLastResponseTime();
        
        var WX = oldParams[1];
        var aEQ = params[1];
        try {
        
            if (oldParams[2] == params[1] && WX != aEQ &&
            QQPlusKernel.protocol[WX].resend) {
            
                QQPlusKernel.Log(QQPlusKernel.LEVEL1, "DoResponse", ["not corresponding response, resend..."]);
                QQPlusKernel.PushOldDataToSendList(oldParams);
            }
        } 
        catch (e) {
            top.doPageError(["custom catch( DoResponse ):", e.message], "qqplus_kernel.js", 0)
        }
        
        
        QQPlusKernel.DoResponseProcess(oldParams, params);
        
        QQPlusKernel.DoSend();
    },
    
    DoErrorProcess: function(oldParams, params){
    
        switch (oldParams[1]) {
            case "22":
                this.ProcessLoginFail();
                break;
            case "61":
                this.ProcessGetFriendsListFail();
                break;
            case "43":
                this.ProcessGetInfoFail(oldParams);
                break;
            case "27":
                this.ProcessGetStatusFail(oldParams);
                break;
            case "16":
                this.ProcessSendMsgFail(oldParams);
                break;
            default:
                break;
        }
        
        return this.DoSend();
    },
    
    DoServerErrorProcess: function(oldParams, params){
    
    
    
    
    
        switch (params[4]) {
            case "01":
                this.DoErrorProcess(oldParams, params);
                break;
            case "02":
                QQPlusKernel.Log(QQPlusKernel.LEVEL1, "DoServerErrorProcess", [oldParams[1], oldParams[2], "session error"]);
                this.PushOldDataToSendList(oldParams);
            case "03":
            case "04":
                var aFe = this.aIV || 0, aoR = this.aIV = now();
                
                
                this.ProcessLoginFail(aoR - aFe < 3 * 3600 * 1000);
                break;
            default:
                
                this.DoSend();
                break;
        }
    },
    
    DoResponseProcess: function(oldParams, params){
        switch (params[1]) {
            case "22":
                this.ProcessLogin(params, oldParams);
                break;
            case "61":
                this.ProcessGetFriendsList(params, oldParams);
                break;
            case "43":
                this.ProcessGetInfo(params, oldParams);
                break;
            case "27":
                this.ProcessGetStatus(params, oldParams);
                break;
            case "16":
                this.ProcessSendMsg(params, oldParams);
                break;
            case "17":
                this.ProcessGetMsg(params);
                break;
            case "23":
                
                
                this.isKeepRecv = true;
                this.ProcessGetMsg(params);
                break;
            default:
                break;
        }
    },
    
    ParseCmd: function(cmd){
        var vals = (cmd ? cmd : "").split(";");
        for (var i = vals.length; i < 5; i++) 
            vals.push("");
        return vals;
    },
    
    InitLoginServerList: function(){
        this.serverListMask = [];
        var len = this.IM_SERVER_LIST.length;
        for (var i = len - 1; i >= 0; i--) {
            this.serverListMask.push(i);
        }
    },
    
    RedirectLoginServer: function(){
        if (this.serverListMask == null) 
            this.InitLoginServerList();
        
        var amV = 2;
        
        if (this.currentServerUrlTimes == null) 
            this.currentServerUrlTimes = amV;
        
        if ((this.currentServerUrlTimes++) >= amV) {
            this.currentServerUrl = this.IM_SERVER_LIST[this.serverListMask.pop()];
            this.currentServerUrlTimes = 0;
        }
    },
    
    setKeepAlive: function(type){
        if (this.helloTimer) {
            clearInterval(this.helloTimer);
            this.helloTimer = null;
        }
        
        if (type != "off") {
            this.helloTimer = setInterval(function(){
            
            
                if (QQPlusKernel.lastResponseTime != null &&
                (new Date()) - QQPlusKernel.lastResponseTime > QQPlusKernel.MAX_NORESPONSE_TIME) {
                
                    QQPlusKernel.Log(QQPlusKernel.LEVEL1, "setKeepAlive", "drop line ... because of no response too long");
                    QQPlusKernel.ProcessLoginFail();
                }
                else {
                    QQPlusKernel.PushHelloCmd();
                    QQPlusKernel.DoSend();
                }
            }, this.KEEP_ALIVE_INTERVAL);
        }
    },
    
    UpdateLastResponseTime: function(){
        this.lastResponseTime = new Date();
    },
    
    PushToSendList: function(protocolID, data, tofront){
        var listName = this.protocol[protocolID].list;
        if (listName != null) {
            if (tofront) {
                this.sendList[listName].unshift([protocolID, data]);
            }
            else {
                this.sendList[listName].push([protocolID, data]);
            }
        }
    },
    
    PushOldDataToSendList: function(oldParams){
        if (this.protocol[oldParams[1]].list != "recv") {
            switch (oldParams[1]) {
                case "22":
                    this.ProcessLoginFail();
                    break;
                case "16":
                    this.PushSendMsgCmd(oldParams[5], decodeURIComponent(oldParams[8]), true);
                    break;
                default:
                    this.PushToSendList(oldParams[1], oldParams.slice(4, -1).join(";"), true);
                    break;
            }
        }
    },
    
    PushLoginCmd: function(){
        if (this.sendList[this.protocol["22"].list].length == 0) {
            this.PushToSendList("22", null);
        }
    },
    
    PushHelloCmd: function(){
        if (this.sendList[this.protocol["02"].list].length == 0) {
            this.PushToSendList("02", this.uin);
        }
    },
    
    PushgetUinsInfoCmd: function(userlist, protocolID, tofront){
        if (!protocolID) {
            protocolID = "27";
        }
        var max = 15;
        var len = userlist.length;
        for (var i = 0; i + max < len; i += max) {
            this.PushToSendList(protocolID, [max, userlist.splice(0, max).join(";")].join(";"), tofront);
        }
        this.PushToSendList(protocolID, [userlist.length, userlist.join(";")].join(";"), tofront);
    },
    
    PushGetFriendsListCmd: function(tofront){
        this.PushToSendList("61", this.uin, tofront);
    },
    
    PushSendMsgCmd: function(touin, msg, tofront){
        touin = parseInt(touin);
        if (msg && touin > 10000) {
            this.SetUinData(touin);
            this.PushToSendList("16", [touin, "0", "0", encodeURIComponent(msg)].join(";"), tofront);
            this.SetUinAction(touin, 0);
        }
    },
    
    PushGetOffMsgCmd: function(){
        this.PushToSendList("23");
    },
    
    StatusParse: function(statusId){
        var self = this;
        var value = {
            "1": self.USER_STAT_ONLINE,
            "2": self.USER_STAT_AWAY
        };
        return value[statusId] != null ? value[statusId] : this.USER_STAT_OFFLINE;
    },
    
    
    ProcessLogin: function(params, oldParams){
        var isFail = params[3] != "00" || params[4] == "";
        if (!isFail) {
            this.kernelStatus = this.RUNNING;
            this.session = params[4];
            
            if (params[5]) {
                this.currentServerUrl = "http://" + params[5];
            }
            
            this.InitLoginServerList();
            this.setKeepAlive("on");
            this.OnLogin(true);
        }
        else {
            this.ProcessLoginFail();
        }
    },
    
    ProcessGetFriendsList: function(params, oldParams){
        this.friendsSetFlag = true;
        var len = parseInt(params[3]);
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var pos = i * 3;
                var uin = params[pos + 4];
                var status = this.StatusParse(params[pos + 5]);
                var qqver = params[pos + 6];
                if (this.CheckUin(uin)) {
                    this.SetFriendGroupId(uin, 0);
                    this.SetUinData(uin, {
                        status: status,
                        qqver: qqver
                    });
                }
            }
        }
        this.OnGetFriendsList(this.friendsSet);
    },
    
    ProcessGetStatus: function(params, oldParams){
        var len = parseInt(params[3]) * 2 + 4;
        var data = {};
        for (var i = 4; i < len; i += 3) {
            var uin = params[i];
            var status = this.StatusParse(params[i + 1]);
            var qqver = params[i + 2];
            if (this.CheckUin(uin)) {
                data[uin] = status;
                this.SetUinData(uin, {
                    status: status,
                    qqver: qqver
                });
            }
        }
        this.OnGetStatus(data);
    },
    
    ProcessGetInfo: function(params, oldParams){
        var len = params.length;
        var data = {};
        for (var i = 3; i < len; i += 4) {
            var uin = params[i];
            var faceid = params[i + 1];
            var sex = params[i + 2];
            var nick = decodeURIComponent(params[i + 3]);
            if (this.CheckUin(uin)) {
                data[uin] = {
                    faceid: faceid,
                    sex: sex,
                    nick: nick
                };
                this.SetUinData(uin, {
                    nick: nick,
                    sex: sex,
                    faceid: faceid
                });
            }
        }
        this.OnGetInfo(data);
    },
    
    ProcessSendMsg: function(params, oldParams){
        var isSendOK = params[1] == "16" && params[3] == "0";
        if (!isSendOK) {
            this.ProcessSendMsgFail(oldParams);
        }
        else {
            this.isKeepRecv = true;
        }
    },
    
    ProcessGetMsg: function(params){
    
        if (this.msgIds[params[2]] != null) 
            return;
        this.msgIds[params[2]] = 1;
        this.OnGetMsg(params[3], decodeURIComponent(params[5]), this.MSG_TYPE_FROM, params[4]);
    },
    
    
    ProcessLoginFail: function(QW){
        this.Log(this.LEVEL1, "ProcessLoginFail", ["process login fail", QW ? "no retry" : "retry"]);
        if (!QW) {
            this.RedirectLoginServer();
        }
        
        if (QW || !this.currentServerUrl) {
            this.Log(this.LEVEL1, "ProcessLoginFail", "try all err!!! set the kernelStatus STOP!");
            this.session = null;
            this.isKeepRecv = false;
            this.setKeepAlive("off");
            this.kernelStatus = this.STOP;
            
            for (var i = this.sendList.send.length - 1; i >= 0; i--) {
                var value = this.sendList.send[i];
                this.ProcessSendMsgFail(null, value[0], value[1]);
            }
            for (var i in this.sendList) {
                this.sendList[i] = [];
            }
            this.OnLogin(false);
        }
        else {
            this.Log(this.LEVEL1, "ProcessLoginFail", "go on retry~");
            this.kernelStatus = this.READY;
            this.PushLoginCmd();
            this.DoSend();
        }
    },
    
    ProcessGetFriendsListFail: function(){
        this.OnGetFriendsList(null);
    },
    
    ProcessGetStatusFail: function(oldParams){
        this.OnGetStatus(null, oldParams.slice(5));
    },
    
    ProcessGetInfoFail: function(oldParams){
        this.OnGetInfo(null, oldParams.slice(5));
    },
    
    ProcessSendMsgFail: function(oldParams, touin, msg){
        if (!touin) {
            touin = oldParams[5];
        }
        if (!msg) {
            msg = oldParams[8];
        }
        this.OnGetMsg(touin, decodeURIComponent(msg), this.MSG_TYPE_ME_FAIL);
    },
    
    
    OnLogin: function(isOK){
        if (typeof(this.onlogin) == "function") {
            try {
                this.onlogin.call(this, isOK);
            } 
            catch (e) {
            }
        }
    },
    
    OnGetFriendsList: function(data){
        if (typeof(this.ongetfriendslist) == "function") {
            try {
                this.ongetfriendslist.call(this, data);
            } 
            catch (e) {
            }
        }
    },
    
    OnGetStatus: function(data){
        if (typeof(this.ongetstatus) == "function") {
            try {
                this.ongetstatus.call(this, data);
            } 
            catch (e) {
            }
        }
    },
    
    OnGetInfo: function(data){
        if (typeof(this.ongetinfo) == "function") {
            try {
                this.ongetinfo.call(this, data);
            } 
            catch (e) {
            }
        }
    },
    
    OnGetMsg: function(touin, msg, type, time){
        if (typeof(this.ongetmsg) == "function") {
            try {
                this.ongetmsg.call(this, touin, msg, type, time);
            } 
            catch (e) {
            }
        }
    },
    
    ProcessGetOffMsg: function(param){
        if (typeof(this.ongetoffmsg) == "function") {
            try {
                this.ongetoffmsg.call(this, param);
            } 
            catch (e) {
            }
        }
    },
    
    
    CheckUin: function(uin){
        uin = parseInt(uin);
        return !isNaN(uin) && uin >= 10000 && uin != this.uin;
    },
    
    
    EncodeMsg: function(msg){
        return msg.replace(/%/ig, "%25").replace(/;/ig, "%3B").replace(/\"/ig, "%22").replace(/\'/ig, "%27").replace(/</ig, "%3C").replace(/>/ig, "%3E").replace(/\r/ig, "%0A").replace(/\n/ig, "%0D").replace(/\\/ig, "%5C").replace(/\//ig, "%2F");
    },
    
    DecodeMsg: function(msg){
        return msg.replace(/%3C/ig, "<").replace(/%3E/ig, ">").replace(/%0A/ig, "\r").replace(/%0D/ig, "\n").replace(/%5C/ig, "\\").replace(/%2F/ig, "/").replace(/%3B/ig, ";").replace(/%22/ig, "\"").replace(/%27/ig, "'").replace(/%25/ig, "%");
    }
};
