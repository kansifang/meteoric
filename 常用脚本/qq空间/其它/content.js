
var PortraitManager = {
    PORTRAIT_TYPE: {
        "QZONE": 0,
        "CAMPUS": 1
    },
    _loadedCallbackList: [],
    _isProcessing: false,
    _hsLoadedUins: parent.g_oBlogPortraitList,
    portraitSeed: (function(){
        var p_seed = QZONE.shareObject.get("portraitSeed");
        if (!p_seed) {
            p_seed = Math.random().toString();
        }
        return p_seed;
    })(),
    _portraitConf: {
        "QZONE": {
            "loaded": false,
            "callbackName": "portraitCallBack",
            "CGIPathName": "dump",
            "uinList": [],
            "callbackList": [],
            "addUin": function(uin){
                uin = parseInt(uin, 10);
                if (isNaN(uin) || uin <= 10000) {
                    return false;
                }
                if (!PortraitManager.getPortraitInfo(uin)) {
                    PortraitManager._portraitConf["QZONE"].uinList.push(uin);
                }
                return true;
            },
            "postProcPortraitLoaded": function(data){
                PortraitManager._excuteFuncList(PortraitManager._portraitConf["QZONE"].callbackList);
                PortraitManager._portraitConf["QZONE"].loaded = true;
                PortraitManager._checkAllPortraitsLoaded();
            }
        },
        "CAMPUS": {
            "loaded": false,
            "callbackName": "portraitCallBack",
            "CGIPathName": "http://" + SPACE_MAIN_DOMAIN + "/fcg-bin/cgi_get_portrait_campus.fcg?encodeduins=",
            "uinList": [],
            "callbackList": [],
            "addUin": function(uin){
                if (!PortraitManager._hsLoadedUins[uin]) {
                    PortraitManager._portraitConf["CAMPUS"].uinList.push(uin);
                }
                return true;
            },
            "postProcPortraitLoaded": function(data){
                if (!!data) {
                    for (var uin in data) {
                        PortraitManager._hsLoadedUins[uin] = data[uin];
                    }
                }
                PortraitManager._excuteFuncList(PortraitManager._portraitConf["CAMPUS"].callbackList);
                PortraitManager._portraitConf["CAMPUS"].loaded = true;
                PortraitManager._checkAllPortraitsLoaded();
            }
        }
    },
    _excuteFuncList: function(list){
        while (list.length > 0) {
            (list.shift())();
        }
    },
    _checkAllPortraitsLoaded: function(){
        for (var val in this.PORTRAIT_TYPE) {
            if (this._portraitConf[val].loaded == false) {
                return;
            }
        }
        this._excuteFuncList(this._loadedCallbackList);
        this._isProcessing = false;
    },
    addUin: function(uin, type){
        for (var val in this.PORTRAIT_TYPE) {
            if (this.PORTRAIT_TYPE[val] == type) {
                return this._portraitConf[val].addUin(uin);
            }
        }
        if (QZBlog.Runtime.DebugMode) {
            QZBlog.Log.doLog("In content.js PortraitManager.addUin faild, error user type.");
        }
        return false;
    },
    getPortraitInfo: function(uin, type){
        var oInfo = null;
        if (type == PortraitManager.PORTRAIT_TYPE["QZONE"]) {
            var arr = [];
            arr.push(uin);
            oInfo = QZBlog.Util.getPortraitList(arr);
            if (!!oInfo) {
                oInfo = oInfo[uin];
            }
        }
        else 
            if (type == PortraitManager.PORTRAIT_TYPE["CAMPUS"]) {
                oInfo = this._hsLoadedUins[uin];
            }
        return oInfo;
    },
    addPortraitCallback: function(func, type){
        for (var val in this.PORTRAIT_TYPE) {
            if (this.PORTRAIT_TYPE[val] == type) {
                return this._portraitConf[val].callbackList.push(func);
            }
        }
        if (QZBlog.Runtime.DebugMode) {
            QZBlog.Log.doLog("In content.js PortraitManager.addPortraitCallback faild, error user type.");
        }
        return false;
    },
    loadPortrait: function(){
        if (this._isProcessing) {
            return false;
        }
        for (var val in this.PORTRAIT_TYPE) {
            var conf = this._portraitConf[val];
            conf.uinList = QZONE.lang.uniqueArray(conf.uinList);
            if (conf.uinList.length > 0) {
                this._isProcessing = true;
                conf.loaded = true;
                if (this.PORTRAIT_TYPE[val] == PortraitManager.PORTRAIT_TYPE["QZONE"]) {
                    QZBlog.Util.getPortraitList(conf.uinList, QZONE.event.bind(this, conf.postProcPortraitLoaded));
                }
                else {
                    var portraitReq = new QZBlog.Util.BlogNetProcessor();
                    portraitReq.create(conf.CGIPathName + conf.uinList.join(), "get", QZONE.event.bind(this, conf.postProcPortraitLoaded), QZONE.emptyFn, "GB2312", true, conf.callbackName);
                    portraitReq.excute();
                }
            }
            else {
                QZONE.event.bind(this, conf.postProcPortraitLoaded());
            }
            conf.uinList.splice(0, conf.uinList.length);
        }
        return true;
    },
    clear: function(){
        this._loadedCallbackList = [];
        this._isProcessing = false;
        for (var val in this.PORTRAIT_TYPE) {
            var conf = this._portraitConf[val];
            conf.uinList = [];
            conf.callbackList = [];
            conf.loaded = false;
        }
    }
};
function commonLoginCallback(){
    if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
        blogLoginFnList.push(function(){
            if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                QZBlog.Util.clearAllCacheData();
            }
            PageScheduler.CommentScheduler.checkCommentSetting();
        });
    }
}

var ContentManager = {
    _curBlogID: null,
    _bProcessing: false,
    _pageNaviInfo: null,
    _checkState: function(){
        if (this._bProcessing) {
            QZBlog.Util.showMsgbox("您操作过于频繁，请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        return true;
    },
    _commonCGIError: function(){
        this._bProcessing = false;
    },
    _checkQuoteBlog: function(ele, blogID){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogID);
        if (!blogInfo) {
            QZBlog.Util.showMsgbox("无法获取该篇日志信息，请刷新页面重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        var content = "";
        if (blogInfo.getEffectBit(29) || QZBlog.Logic.SpaceHostInfo.checkAuthorization()) {
            content = "此空间设置了访问权限。转载主人日志到您的空间，有可能导致主人隐私泄露。您是否确定转载？";
        }
        if (content.length == 0) {
            return true;
        }
        var dlg = new parent.QZONE.widget.Confirm("温馨提示", content, 3);
        dlg.onConfirm = QZONE.event.bind(this, function(){
            setTimeout(QZONE.event.bind(this, this._doQuoteBlog, ele, blogID), 500);
        });
        dlg.show();
        QZBlog.Util.Statistic.sendPV("secretalert");
        return false;
    },
    quoteBlog: function(ele, blogID){
        if (!this._checkState()) {
            return;
        }
        if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            QZBlog.Util.showMsgbox("您不能转载自己的日志", 1, 2000);
            return;
        }
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            blogLoginFnList.push(QZONE.event.bind(this, this.quoteBlog, ele, blogID));
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        if (!this._checkQuoteBlog(ele, blogID)) {
            return;
        }
        this._doQuoteBlog(ele, blogID);
    },
    _doQuoteBlog: function(ele, blogID, verifycode){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogID);
        if (!blogInfo) {
            QZBlog.Util.showMsgbox("无法获取该篇日志信息，请刷新页面重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        if (ele) {
            ele.disabled = true;
            setTimeout(function(){
                ele.disabled = false;
            }, 3000);
        }
        this._bProcessing = true;
        this._curBlogID = blogID;
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_quote?";
        url += "fromuin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + blogID + (!!verifycode ? ("&verifycode=" + verifycode) : "");
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, this._quoteBlogSucc), QZONE.event.bind(this, this._commonCGIError), "GB2312", false);
        netProcessor.verifyHandler = QZONE.event.bind(this, function(verify){
            this._doQuoteBlog(ele, blogID, verify);
        });
        netProcessor.loginHandler = QZONE.event.bind(this, function(){
            blogLoginFnList.splice(0, blogLoginFnList.length);
            blogLoginFnList.push(QZONE.event.bind(this, this.quoteBlog, ele, blogID));
            QZBlog.Util.showLoginBox("blogComment");
        });
        netProcessor.excute();
    },
    _quoteBlogSucc: function(data){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(this._curBlogID);
        if (!!blogInfo && blogInfo.getPaperLetterInfo()) {
            if (XMLselectSingleNode(data, "/succ").attributes.length > 0) {
                if (XMLselectSingleNode(data, "/succ").attributes[0].value == 1) {
                    QZBlog.Util.showMsgbox("转载成功，您成功转载了一篇信纸日志！", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                }
                else {
                    var strURL = 'http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&subtype=1&clientkey=' + QZONE.cookie.get("zzpanelkey") + '&clientuin=' + QZONE.cookie.get("zzpaneluin");
                    QZBlog.Util.popupDialog('温馨提示', '<div style="text-align:center;"><h4 style="margin-top:20px;color:#3f8d11;"><img src="/ac/b.gif" style="background-image:url(/qzone_v5/ac/qzone_v5/client/icon_hint_pop.png);background-position:0px -53px;background-repeat: no-repeat;height:43px;width:43px;" />日志转载成功！</h4><p style="line-height:2em;">由于您不是黄钻贵族, 信纸没有成功应用<br/> <a href="' + strURL + '" target="_blank">加入黄钻贵族</a>，<span style="margin-right:30px;">即可免费使用信纸</span></p></div>', 420, 155);
                }
            }
        }
        else {
            QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/succ")), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        }
        this._bProcessing = false;
    },
    copyBlogUrl: function(blogid){
        if (isNaN(parseInt(blogid, 10))) {
            alert("日志ID不正确，无法复制日志网址");
            return false;
        }
        parent.copyToClip(QZBlog.Util.getSpaceUrl(QZBlog.Logic.SpaceHostInfo.getUin()) + "/blog/" + blogid);
        QZBlog.Util.showMsgbox("本文网址已经复制到剪贴板中", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    },
    switchSignature: function(btn){
        if (!btn) {
            return;
        }
        var flag = false;
        if (btn.innerHTML == "隐藏签名档") {
            btn.innerHTML = "显示签名档";
            btn.title = "显示所有签名档信息";
            flag = false;
            QZBlog.Util.Statistic.sendPV("hidewrite", "rizhi.qzone.qq.com");
        }
        else 
            if (btn.innerHTML == "显示签名档") {
                btn.innerHTML = "隐藏签名档";
                btn.title = "隐藏所有签名档信息";
                flag = true;
                QZBlog.Util.Statistic.sendPV("showwrite", "rizhi.qzone.qq.com");
            }
        var index = (PageScheduler.curBlogInfo.getCurCommentPage() - 1) * CONTENT_COMMENT_NUM + 1;
        for (; index < PageScheduler.curBlogInfo.getCurCommentPage() * CONTENT_COMMENT_NUM; ++index) {
            if (!$("signatureDIV" + index)) {
                continue;
            }
            $("signatureDIV" + index).style.display = (!!flag ? "" : "none");
        }
        if (!!$("signatureDIV")) {
            if (QZBlog.Logic.SpaceHostInfo.getSignature().trim().length != 0) {
                $("signatureDIV").parentNode.style.display = (!!flag ? "" : "none");
            }
        }
    },
    switchFont: function(btn){
        if (!btn) {
            return;
        }
        if (btn.innerHTML == "大字体") {
            btn.innerHTML = "小字体";
            btn.title = "日志内容显示为小字体";
            $("blogDetailDiv").style.fontSize = "16px";
            QZBlog.Util.Statistic.sendPV("largefont", "rizhi.qzone.qq.com");
        }
        else 
            if (btn.innerHTML == "小字体") {
                btn.innerHTML = "大字体";
                btn.title = "日志内容显示为大字体";
                $("blogDetailDiv").style.fontSize = "12px";
                QZBlog.Util.Statistic.sendPV("smallfont", "rizhi.qzone.qq.com");
            }
    },
    selectPaper: function(blogid){
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        var info = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        info = info.getPaperLetterInfo();
        if (!!info) {
            if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                location.href = QZBlog.Util.getEditBlogUrl(true) + "?paperid=" + info.getID() + "&paperstyle=" + info.getStyle() + "&paperdialog=1";
            }
            else {
                parent.location.href = QZBlog.Util.getSpaceUrl(QZBlog.Logic.SpaceHostInfo.getLoginUin()) + "/addNewBlog?paperid=" + info.getID() + "&paperstyle=" + info.getStyle();
            }
        }
        else {
            QZBlog.Util.showMsgbox("抱歉,暂时无法获取该信纸信息!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        }
    },
    _getQueueCacheBlogID: function(curBlogID, direct){
        if (!this._pageNaviInfo) {
            this._pageNaviInfo = {};
            if (parent.BlogListNavigator.currentPageCgiInfo) {
                this._pageNaviInfo.pre_arch = parent.BlogListNavigator.currentPageCgiInfo.pre_arch;
                this._pageNaviInfo.next_arch = parent.BlogListNavigator.currentPageCgiInfo.next_arch;
                this._pageNaviInfo.pre_pos = parent.BlogListNavigator.currentPageCgiInfo.pre_pos;
                this._pageNaviInfo.next_pos = parent.BlogListNavigator.currentPageCgiInfo.next_pos;
                this._pageNaviInfo.bCGIInfoFlag = true;
            }
            try {
                this._pageNaviInfo.queue = QZONE.lang.objectClone(parent.BlogListNavigator.contentNaviInfo);
            } 
            catch (err) {
                this._pageNaviInfo.queue = [];
            }
        }
        var blogid = -1;
        for (var index = 0; index < this._pageNaviInfo.queue.length; ++index) {
            if (this._pageNaviInfo.queue[index] == curBlogID) {
                if (direct < 0 && index > 0) {
                    blogid = this._pageNaviInfo.queue[index - 1];
                }
                else 
                    if (direct > 0 && index < this._pageNaviInfo.queue.length - 1) {
                        blogid = this._pageNaviInfo.queue[index + 1];
                    }
                break;
            }
        }
        return blogid;
    },
    _checkCacheBlogID: function(curBlogID, direct){
        var blogid = -1;
        if (direct < 0) {
            blogid = parent.BlogListNavigator.getPrevBlogID(curBlogID);
        }
        else 
            if (direct > 0) {
                blogid = parent.BlogListNavigator.getNextBlogID(curBlogID);
            }
        if (blogid == -2) {
            QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return true;
        }
        else 
            if (blogid < 0) {
                blogid = this._getQueueCacheBlogID(curBlogID, direct);
            }
        if (blogid >= 0) {
            var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
            location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, blogInfo ? blogInfo.getRandomSeed() : 0);
            QZBlog.Util.jumpTop();
            return true;
        }
        return false;
    },
    turnPage: function(curBlogID, direct, tmpStatisticFlag){
        if (!this._checkState()) {
            return;
        }
        if (this._checkCacheBlogID(curBlogID, direct)) {
            return;
        }
        this._bProcessing = true;
        QZBlog.Util.showMsgbox("正在读取数据...", 0, 3000);
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_blogidlist?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&direct=" + (direct < 0 ? 0 : 1);
        if (!!this._pageNaviInfo.bCGIInfoFlag) {
            var cate = parent.BlogListNavigator.getCurrentCate();
            try {
                cate = (cate == parent.BLOG_OLDARCHIVE_CATENAME ? "" : parent.gbEncoder(cate).toRealStr().URLencode());
            } 
            catch (err) {
                cate = "";
            }
            if (!parent.oContentRollInfo) {
                parent.oContentRollInfo = {
                    pre_pos: this._pageNaviInfo.pre_pos,
                    next_pos: this._pageNaviInfo.next_pos
                };
            }
            var arch = (direct < 0 ? this._pageNaviInfo.pre_arch : this._pageNaviInfo.next_arch);
            var pos = (direct < 0 ? parent.oContentRollInfo.pre_pos : parent.oContentRollInfo.next_pos);
            var sort = parent.BlogListNavigator.getSortType();
            url += "&mode=0" + "&category=" + cate + "&arch=" + arch + "&pos=" + pos + "&sort=" + sort + "&num=" + parent.LIST_TITLE_NUM;
            if (direct < 0 && pos < 0) {
                this._bProcessing = false;
                QZBlog.Util.showMsgbox("已经是第一篇", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                return;
            }
            if (direct < 0) {
                parent.oContentRollInfo.pre_pos -= parent.LIST_TITLE_NUM;
                parent.oContentRollInfo.next_pos -= parent.LIST_TITLE_NUM;
            }
            else {
                parent.oContentRollInfo.pre_pos += parent.LIST_TITLE_NUM;
                parent.oContentRollInfo.next_pos += parent.LIST_TITLE_NUM;
            }
        }
        else {
            url += "&mode=1&blogid=" + curBlogID;
        }
        if (QZBlog.Logic.getGlobalBlogRightInfo()) {
            url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
        }
        var netReq = new QZBlog.Util.BlogNetProcessor();
        netReq.create(url, "get", QZONE.event.bind(this, function(data){
            QZBlog.Util.hideMsgbox();
            var rawData = data.data;
            if (rawData.idlist.length == 0) {
                QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                this._bProcessing = false;
                return;
            }
            curBlogID = parseInt(curBlogID, 10);
            var preLength = this._pageNaviInfo.queue.length;
            var blogid = -1;
            if (direct > 0) {
                this._pageNaviInfo.queue.push(curBlogID);
            }
            else {
                this._pageNaviInfo.queue.unshift(curBlogID);
            }
            if (direct > 0) {
                for (var index = 0; index < rawData.idlist.length; ++index) {
                    this._pageNaviInfo.queue.push(rawData.idlist[index].blogid);
                    if (index == 0) {
                        blogid = rawData.idlist[index].blogid;
                    }
                }
            }
            else {
                for (var index = rawData.idlist.length - 1; index >= 0; --index) {
                    this._pageNaviInfo.queue.unshift(rawData.idlist[index].blogid);
                    if (index == (rawData.idlist.length - 1)) {
                        blogid = rawData.idlist[index].blogid;
                    }
                }
            }
            this._pageNaviInfo.queue = QZONE.lang.uniqueArray(this._pageNaviInfo.queue);
            if (preLength == this._pageNaviInfo.queue.length) {
                this._bProcessing = false;
                QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                return;
            }
            parent.BlogListNavigator.contentNaviInfo = parent.QZONE.lang.objectClone(this._pageNaviInfo.queue);
            if (blogid >= 0) {
                var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
                QZBlog.Util.jumpTop();
                setTimeout(function(){
                    location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, blogInfo ? blogInfo.getRandomSeed() : 0);
                }, 0);
                return;
            }
            this._bProcessing = false;
        }), function(data){
            QZBlog.Util.hideMsgbox();
            this._bProcessing = false;
            if (data.error.type == "no data") {
                QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            }
        }, "GB2312", true, "_Callback");
        netReq.excute();
        if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
            if (!!tmpStatisticFlag) {
                QZBlog.Util.Statistic.sendPV('FUMouseClick', 'blogtest.qzone.qq.com');
            }
            else {
                QZBlog.Util.Statistic.sendPV('FUPageClick', 'blogtest.qzone.qq.com');
            }
        }
    },
    turnToList: function(){
        QZBlog.Util.jumpTop();
        location.href = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/list.html";
    },
    jumpCategory: function(cateName){
        QZBlog.Util.jumpTop();
        parent.BlogListNavigator.clear();
        cateName = cateName.toInnerHTML();
        location.href = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/list.html?cate=" + encodeURIComponent(cateName);
    },
    editBlog: function(blogid){
        location.href = QZBlog.Util.getEditBlogUrl(true) + "?bid=" + blogid;
    },
    deleteBlog: function(blogid){
        if (!confirm("删除日志将扣除您的爱心指数5分\n此操作不可恢复,您确认要继续么?")) {
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_del_data?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + blogid;
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(){
            QZBlog.Util.showMsgbox("删除成功！", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            QZBlog.Logic.refreshTopData();
            parent.BlogListNavigator.removePageData();
            var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(parent.BlogListNavigator.getCurrentCate());
            parent.BlogListNavigator.clear();
            var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
            parent.g_oCateInfoMgr.clear();
            if (blogInfo.getDraftID() > 0) {
                var draftInfo = parent.g_oDraftListInfoMgr.getDraftInfo(blogInfo.getDraftID());
                if (draftInfo) {
                    draftInfo.setID(-1);
                }
            }
            parent.g_oBlogInfoMgr.removeBlogInfo(blogid);
            setTimeout(function(){
                var strURL = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/list.html";
                location.href = strURL;
                ;
            }, 50);
        }, QZONE.emptyFn, "GB2312", false);
        netProcessor.loginHandler = function(){
            QZBlog.Util.showLoginBox("ownerOperation");
        };
        netProcessor.excute();
    },
    vote: function(blogid){
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        var optionStr = "X";
        var arrOptions = document.getElementsByName("voteoption");
        for (var index = 0; index < arrOptions.length; ++index) {
            optionStr += (arrOptions[index].checked ? 1 : 0);
        }
        if (!/1/.test(optionStr)) {
            alert("请至少选择一个选项");
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_do_vote?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&voteid=" + PageScheduler.curBlogInfo.getVoteID() + "&optionid=" + optionStr;
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(data){
            QZBlog.Util.showMsgbox("投票成功!", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            parent.g_oBlogInfoMgr.updateBlogInfoSeed(blogid);
            location.reload();
        }, QZONE.emptyFn, "GB2312", false);
        netProcessor.loginHandler = function(){
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
        };
        netProcessor.excute();
    },
    shareBlog: function(blogid){
        if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            QZBlog.Util.showMsgbox("您不能分享自己的日志!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        if (!blogInfo) {
            alert("暂时无法分享该篇日志，请刷新空间重试");
            return;
        }
        if (blogInfo.getEffectBit(29)) {
            QZBlog.Util.showMsgbox("该日志设置了访问权限，不能进行分享！", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            blogLoginFnList.push(QZONE.event.bind(this, this.shareBlog, blogid));
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        if (QZBlog.Logic.SpaceHostInfo.checkAuthorization()) {
            var title = blogInfo.getTitle();
            title = title.cutWord(10).toRealStr() + (title.getRealLength() > 10 ? "..." : "");
            var content = "当前空间不是对所有人公开的，您确认要将日志《" + title.toInnerHTML() + "》分享给朋友们吗？";
            var dlg = new parent.QZONE.widget.Confirm("温馨提示", content, 3);
            dlg.onConfirm = QZONE.event.bind(this, this._doShareBlog, blogid);
            dlg.show();
        }
        else {
            this._doShareBlog(blogid);
        }
    },
    _doShareBlog: function(blogid){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        var title = blogInfo.getTitle();
        var content = $("blogDetailDiv").innerText || $("blogDetailDiv").textContent || $("blogDetailDiv").text;
        var imgArr = $("blogDetailDiv").getElementsByTagName("img");
        var summary = (content.getRealLength() > 100) ? (content.cutWord(100).toRealStr() + "...") : content;
        var action = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzalertadd_blog";
        parent.blogFormParams = {
            "type": 1,
            "title": title,
            "blogid": blogid,
            "spaceuin": QZBlog.Logic.SpaceHostInfo.getUin(),
            "nickname": QZBlog.Logic.SpaceHostInfo.getNickname(),
            "totallen": content.getRealLength(),
            "summary": summary,
            "images": (imgArr.length > 0 ? imgArr[0].src : ""),
            "picnum": imgArr.length
        };
        QZBlog.Util.popupDialog('添加日志《' + (title.cutWord(10).toRealStr() + (title.getRealLength() > 10 ? "..." : "")).toInnerHTML() + '》到我的分享', '<iframe frameborder="no" height="425" width="408" src="' + IMGCACHE_BLOG_V5_PATH + '/blogform.html?action=' + encodeURIComponent(action) + '"></iframe>', 410, 425);
    },
    setBlogRight: function(blogid){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        if (!blogInfo) {
            alert("暂时无法获取该篇日志信息，请刷新空间重试");
            return;
        }
        QZBlog.Logic.setBlogRight(blogInfo, function(){
            PageScheduler.ContentScheduler.showRightSettingInfo();
            parent.g_oBlogInfoMgr.updateBlogInfoSeed(blogid);
            parent.BlogListNavigator.removePageData();
        });
    },
    setBlogTop: function(blogid){
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        if (!blogInfo) {
            alert("无法获取该篇日志详细信息，请刷新空间重试");
            return;
        }
        QZBlog.Logic.setBlogTop(blogInfo, function(){
            location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogInfo.getID(), blogInfo.getRandomSeed());
        });
    },
    showMoreOption: function(ele, blogid){
        if (!QZONE.css.hasClassName($("moreOptionDiv"), "none")) {
            this.hideMoreOptions();
            return;
        }
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        if (!blogInfo) {
            alert("无法获取该篇日志详细信息，请刷新空间重试");
            return;
        }
        $("topFlagHref").innerHTML = (blogInfo.getTopFlag() ? "取消置顶" : "设置置顶");
        QZONE.css.toggleClassName($("moreOptionDiv"), "none");
        QZONE.css.toggleClassName(ele, "bg2");
        ele.innerHTML = '更多<span class="num">▲</span>';
        QZONE.event.addEvent(document, "mousedown", QZONE.event.bind(this, this._toHideMoreOptions));
    },
    _toHideMoreOptions: function(evt){
        var ele = QZONE.event.getTarget(evt);
        if (!ele) {
            return;
        }
        ele = getParentByClass(ele, "specialOptionName");
        if (!!ele) {
            return;
        }
        this.hideMoreOptions();
    },
    hideMoreOptions: function(){
        QZONE.event.removeEvent(document, "mousedown", QZONE.event.bind(this, this._toHideMoreOptions));
        QZONE.css.toggleClassName($("moreOptionDiv"), "none");
        QZONE.css.toggleClassName($("moreOptionHref"), "bg2");
        $("moreOptionHref").innerHTML = '更多<span class="num">▼</span>';
    },
    reportBlog: function(blogid){
        var appname = "qzone";
        var subapp = "blog";
        var jubaotype = "article";
        var encoding = "GB2312";
        var url = 'http://jubao.qq.com/cgi-bin/jubao?appname=' + appname + "&subapp=" + subapp + "&jubaotype=" + jubaotype + (encoding ? ("&encoding=" + encoding) : "") + "&uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + blogid + "&blogtype=" + (QZBlog.Logic.SpaceHostInfo.isFamousUser() ? 1 : 0);
        QZBlog.Logic.showReport(url);
    }
};
var CommentManager = {
    _bProcessing: false,
    _postEditorBuildedCBList: [],
    commentEditor: null,
    jumpCommmentEditor: function(){
        setTimeout(QZONE.event.bind(this, function(){
            try {
                if (!!this.commentEditor) {
                    this.commentEditor.focus();
                }
                else {
                    $("commentEditor").focus();
                }
            } 
            catch (err) {
            }
        }), 200);
    },
    hideVisitor: function(uin, verifycode){
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_hide_readerlist?masteruin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&visituin=" + uin + (!!verifycode ? ("&verifycode=" + verifycode) : "") + "&hideflag=1" + "&blogid=" + PageScheduler.curBlogInfo.getID();
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, function(){
            var listInfo = PageScheduler.curBlogInfo.getRecentVisitorInfo();
            for (var index = 0; index < listInfo.length; ++index) {
                if (listInfo[index].uin == uin) {
                    listInfo[index].nickname = "匿名";
                    listInfo[index].clickEvt = "return&nbsp;false;";
                    listInfo[index].imgurl = DEFAULT_PORTRAIT_IMGURL;
                    listInfo[index].vipclass = "none";
                    listInfo[index].hideflagClass = "none";
                    listInfo[index].hideflag = 1;
                    break;
                }
            }
            var liCollection = $("visitorArea").getElementsByTagName("li");
            if (liCollection.length > 6) {
                this.toggleRecentVisitor(true);
            }
            else {
                this.toggleRecentVisitor(false);
            }
        }), function(data){
            QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        }, "GB2312", false);
        netProcessor.loginHandler = function(){
            QZBlog.Util.closePopup();
            QZBlog.Util.showLoginBox("blogComment");
        };
        netProcessor.verifyHandler = function(verifycode){
            CommentManager.hideVisitor(uin, verifycode);
        };
        netProcessor.excute();
    },
    toggleRecentVisitor: function(flag){
        if (!!flag) {
            $("visitorArea").innerHTML = doFill(parent.g_hsBlogTemplate["visitorList"], {
                "data": PageScheduler.curBlogInfo.getRecentVisitorInfo()
            });
            $("recentVisitorDiv").className = "recent_visit_list";
            QZBlog.Util.Statistic.sendPV('expand', 'blogreader.qzone.qq.com');
        }
        else {
            $("visitorArea").innerHTML = doFill(parent.g_hsBlogTemplate["visitorList"], {
                "data": PageScheduler.curBlogInfo.getRecentVisitorInfo().slice(0, 6)
            });
            $("recentVisitorDiv").className = "recent_visit_list visit_list_shrink";
            QZBlog.Util.Statistic.sendPV('shrink', 'blogreader.qzone.qq.com');
        }
        $("showVisitorSpan").style.display = (!!flag ? "none" : "");
        $("hideVisitorSpan").style.display = (!!flag ? "" : "none");
        if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            $("visitorSettingSpan").style.display = "";
        }
        $("recentVisitorCnt").innerHTML = PageScheduler.curBlogInfo.getRecentVisitorInfo().length;
        PageScheduler.NamecardScheduler.initRecentVisitor();
    },
    showVisitorSetting: function(){
        var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
        if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
            QZBlog.Util.showMsgbox("正在获取您的设置信息，请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            QZBlog.Util.getSubLoginBitMapFlag(function(data, value){
                if (!data) {
                    return;
                }
                parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
                CommentManager.showVisitorSetting();
            }, 1);
            return;
        }
        QZBlog.Util.popupDialog('设置', '<iframe frameborder="no" id="visitorSettingFrame" style="width:100%;height:115px;" src="' + IMGCACHE_BLOG_V5_PATH + '/visitor_setting.html"></iframe>', 400, 115);
    },
    _procCommentPageData: function(data){
        var rawData = data.data;
        if (rawData.replylist.length == 0 && rawData.pre_pos != -2) {
            setTimeout(QZONE.event.bind(this, function(){
                this._getCommentPageData(PageScheduler.curBlogInfo.getCurCommentPage(), QZONE.event.bind(this, this._procCommentPageData));
            }), 50);
            if (QZBlog.Runtime.DebugMode) {
                alert("Impossible Alert!! Plz require to hyc");
            }
            return;
        }
        var listInfo = [];
        var blogInfo = PageScheduler.curBlogInfo;
        blogInfo.setCGIInfo({
            "pre_arch": rawData.pre_arch,
            "pre_pos": rawData.pre_pos,
            "next_arch": rawData.next_arch,
            "next_pos": rawData.next_pos
        });
        for (var index = 0; index < rawData.replylist.length; ++index) {
            var commentInfo = new parent.BlogCommentInfo();
            commentInfo.convertJsonObject(rawData.replylist[index]);
            listInfo.push(commentInfo);
            blogInfo.addCommentInfo(listInfo[index]);
        }
        if (listInfo.length > 0) {
            PageScheduler.CommentScheduler.showCommentList(listInfo);
        }
        this._bProcessing = false;
    },
    _getCommentPageData: function(pageIndex, callback){
        if (isNaN(pageIndex) || pageIndex <= 0 || pageIndex > PageScheduler.curBlogInfo.getCommentPageLength()) {
            alert("无法获取评论列表信息，请刷新空间重试");
            return;
        }
        var pos = CONTENT_COMMENT_NUM * (pageIndex - 1);
        var listInfo = PageScheduler.curBlogInfo.getCommentListInfo(pageIndex);
        if (!!listInfo) {
            PageScheduler.CommentScheduler.showCommentList(listInfo);
            this._bProcessing = false;
            return;
        }
        var numperpage = CONTENT_COMMENT_NUM;
        if (pageIndex == PageScheduler.curBlogInfo.getCommentPageLength()) {
            numperpage = PageScheduler.curBlogInfo.getCommentCnt() % CONTENT_COMMENT_NUM;
            if (numperpage == 0) {
                numperpage = CONTENT_COMMENT_NUM;
            }
        }
        var url = QZBlog.Util.getCommentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), PageScheduler.curBlogInfo.getID(), numperpage, pos, Math.random());
        var netProcessor = new QZBlog.Util.BlogNetProcessor();
        netProcessor.create(url, "get", callback, QZONE.event.bind(this, function(){
            this._bProcessing = false;
        }), "GB2312", false);
        netProcessor.excute();
    },
    showCommentPage: function(pageIndex){
        if (this._bProcessing) {
            QZBlog.Util.showMsgbox("正在响应您的操作，请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        var totalPage = PageScheduler.curBlogInfo.getCommentPageLength();
        if (PageScheduler.curBlogInfo.getCurCommentPage() == pageIndex || pageIndex < 1 || pageIndex > totalPage) {
            return;
        }
        QZBlog.Util.showMsgbox("正在响应您的操作,请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        this._bProcessing = true;
        PageScheduler.curBlogInfo.setCurCommentPage(pageIndex);
        this._getCommentPageData(pageIndex, QZONE.event.bind(this, this._procCommentPageData));
        location.hash = "#jumpEditorBtn";
        QZBlog.Util.Statistic.sendPV("comment_fanye", "blogtest.qzone.qq.com");
    },
    showCurrentCommentPage: function(){
        if (this._bProcessing) {
            return;
        }
        if (PageScheduler.curBlogInfo.getCommentCnt() == 0) {
            $("commentListDiv").innerHTML = "";
            $("commentDiv").style.display = "none";
            return;
        }
        if (PageScheduler.curBlogInfo.getCommentCnt() % CONTENT_COMMENT_NUM == 0) {
            PageScheduler.curBlogInfo.setCurCommentPage(PageScheduler.curBlogInfo.getCurCommentPage() - 1);
        }
        this._getCommentPageData(PageScheduler.curBlogInfo.getCurCommentPage(), QZONE.event.bind(this, this._procCommentPageData));
    },
    showFirstCommentPage: function(){
        if (this._bProcessing) {
            return;
        }
        this._bProcessing = true;
        PageScheduler.curBlogInfo.setCurCommentPage(1);
        this._getCommentPageData(1, QZONE.event.bind(this, this._procCommentPageData));
        QZBlog.Util.Statistic.sendPV("comment_fanye", "blogtest.qzone.qq.com");
    },
    showLastCommentPage: function(){
        if (this._bProcessing) {
            return;
        }
        this._bProcessing = true;
        var totalPage = PageScheduler.curBlogInfo.getCommentPageLength();
        PageScheduler.curBlogInfo.setCurCommentPage(totalPage);
        this._getCommentPageData(totalPage, QZONE.event.bind(this, this._procCommentPageData));
        QZBlog.Util.Statistic.sendPV("comment_fanye", "blogtest.qzone.qq.com");
    },
    mirrorComment: function(commentID, arch){
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_recover_nickname?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" +
        PageScheduler.curBlogInfo.getID() +
        "&archive=" +
        arch +
        "&replyid=" +
        commentID;
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "get", QZONE.event.bind(this, function(data){
            var info = PageScheduler.curBlogInfo.getCommentInfo(commentID);
            if (!info) {
                alert("暂时无法使用照妖镜，请刷新空间重试");
                return;
            }
            var rawData = data.data;
            var userInfo = info.getUserInfo();
            userInfo.setNickname(rawData.comment_nick);
            userInfo.setUin(rawData.comment_uin);
            info.setEffect(info.getEffect() & (~ 1));
            var comData = info.toJsonObject();
            PageScheduler.CommentScheduler.showSingleCommentInfo(info, comData);
            alert("该评论者是 " + rawData.comment_nick.toRealStr() + " (" + rawData.comment_uin + ") ，该评论的发表者昵称将显示为 " + rawData.comment_nick.toRealStr());
        }), QZONE.emptyFn, "GB2312", false);
        if (!netProcessor) {
            if (QZBlog.Runtime.DebugMode) {
                QZBlog.Log.doLog("CommentManager.mirrorComment can't create QZBlog.util.NetProcessor, probably due to busy responding");
            }
            return;
        }
        netProcessor.excute();
    },
    showCommentEditor: function(commentID){
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        if (!window.SelfReply) {
            var jsLoader = new QZONE.jsLoader();
            jsLoader.onload = QZONE.event.bind(this, function(){
                this._doShowCommentEditor(commentID);
            });
            jsLoader.load(IMGCACHE_BLOG_V5_PATH + '/script/reply.js', document, "UTF-8");
        }
        else {
            this._doShowCommentEditor(commentID);
        }
    },
    _doShowCommentEditor: function(commentID){
        if (SelfReply.coreParam == commentID) {
            SelfReply.hideEditor(false);
            return;
        }
        SelfReply.initialize("BLOG_TYPE");
        SelfReply.resetTarget($('masterComment' + commentID), $('mcEditor' + commentID), commentID);
    },
    _procQuote: function(str){
        str = str.convHeaderSP().convSP().convCR();
        str = str.replace(/\[quote\=引自：(.+?)(?:\x20|&nbsp;){1,2}于\x20(.+?)\x20发表的评论\]/g, "\x03引自：<cite>$1</cite>&nbsp;&nbsp;于 <ins>$2</ins> 发表的评论<br />\x02").replace(/\[\/quote\]/g, "\x01");
        for (var i = 0; i < 2; i++) {
            str = str.replace(/\x03([^\x03\x01\x02]*?)\x02([^\x03\x01\x02]*?)\x01/g, function(a, b, c){
                return (!QZONE.userAgent.ie ? '<br />' : '') + '<blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + b + '引用内容：<br /><br /><q>' + c + '</q></blockquote>' + (!QZONE.userAgent.ie ? '<br />' : '');
            });
        }
        return str.replace(/[\x03\x02\x01]/g, "");
    },
    quoteCommentContent: function(commentID){
        if (!this.commentEditor) {
            this._postEditorBuildedCBList = this._postEditorBuildedCBList.splice(0, this._postEditorBuildedCBList.length);
            this._postEditorBuildedCBList.push(QZONE.event.bind(this, this.quoteCommentContent, commentID));
            this.getUBBEditor();
            return;
        }
        var info = PageScheduler.curBlogInfo.getCommentInfo(commentID);
        if (!info) {
            alert("暂时无法引用该用户评论，请刷新空间重试");
            return;
        }
        this.commentEditor.focus();
        var strInnerHTML = '引自：<cite>' + (((info.getEffect() & 1) > 0) ? '匿名' : info.getUserInfo().getNickname()) + '</cite>&nbsp;&nbsp;于 <ins>' +
        QZBlog.Util.long2time(info.getTime()) +
        '</ins> 发表的评论<br />引用内容：<br /><br /><q>' +
        this._procQuote(info.getContent()) +
        '</q>';
        var oDocument = this.commentEditor.getCurrentEditor().getDocument();
        var oList = oDocument.body.getElementsByTagName("blockquote");
        if (!!oList) {
            if (oList.length == 0) {
                var strHTML = (!QZONE.userAgent.ie ? '<br />' : '') + '<blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + strInnerHTML + '</blockquote>' + (!QZONE.userAgent.ie ? '<br />' : '');
                this.commentEditor.fillBlogHTML(strHTML);
            }
            else {
                oList[0].innerHTML = strInnerHTML;
            }
        }
        QZBlog.Util.setScrollTop(QZONE.dom.getScrollHeight());
    },
    reportComment: function(uin, id, arch){
        var appname = "qzone";
        var subapp = "blogcomment";
        var jubaotype = "article";
        var encoding = "GB2312";
        var url = 'http://jubao.qq.com/cgi-bin/jubao?appname=' + appname + "&subapp=" + subapp + "&jubaotype=" + jubaotype + (encoding ? ("&encoding=" + encoding) : "") + "&uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&replyuin=" + uin + "&blogid=" + PageScheduler.curBlogInfo.getID() + "&commentid=" + id;
        QZBlog.Logic.showReport(url);
    },
    _checkCommentContent: function(content){
        if (content.length == 0) {
            alert("请输入评论内容");
            return -1;
        }
        if (content.getRealLength() > MAX_COMMENT_LEN) {
            alert("很抱歉，您输入的内容字数过多，请删减后再重新提交");
            return -1;
        }
        var prop = new parent.ContentProperty(content);
        if (prop["image"] > 1) {
            alert("对不起，您只能插入一张图片");
            return -1;
        }
        if (prop["qqshow"] > 1) {
            alert("对不起，您只能插入一张QQ秀泡泡");
            return -1;
        }
        delete prop;
        var re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]([^\[]{31,})\[\/ft\]/;
        if (re.test(content)) {
            if (!confirm("您设置发光的文字已超过30个，发光字效果将可能失效，确认发表此评论吗？")) {
                return -1;
            }
        }
        re = /\[ffg,([a-zA-z#0-9]{1,10}),[a-zA-z&#=;0-9]{1,10}\]/g;
        if (content.match(re) && content.match(re).length > 1) {
            if (!confirm("发光字回复中效果只能使用一次，更多的发光字将无法显示，确认发表此评论吗？")) {
                return -1;
            }
        }
        re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\](.*\[f.*)\[\/ft\]/;
        if (re.test(content)) {
            if (!confirm("若发光字中使用了其它特效，发光字效果将可能失效，确认发表此评论吗？")) {
                return -1;
            }
        }
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            blogLoginFnList.splice(0, blogLoginFnList.length);
            if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                parent.customVarContainer.cacheForAnonComment = {
                    submitURL: "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_add_comment",
                    blogid: PageScheduler.curBlogInfo.getID(),
                    content: content.URLencode(),
                    sf: QZONE.event.bind(this, this._postCommentSucc),
                    ef: QZONE.emptyFn
                };
                if ($("anonymcheck") && $("anonymcheck").checked) {
                    QZBlog.Util.popupDialog('匿名评论', '<iframe frameborder="no" id="anonymCommentFrame" style="width:100%;height:265px;" src="' + IMGCACHE_BLOG_V5_PATH + '/anonym_comment_dlg.html"></iframe>', 242, 293);
                    return -99;
                }
            }
            blogLoginFnList.push(function(){
                if (QZBlog.Logic.SpaceHostInfo.isValidLoginUin() && !QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                    $("msgboardSelfReply").style.display = "";
                }
            });
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return -3;
        }
        return 0;
    },
    _updateSettingText: function(){
        if ($("msgReplyCheck").checked) {
            $("selectedTextSpan").innerHTML = "已选择： 悄悄话";
            return;
        }
        var arrMsg = [];
        if ($("normalUseSignCheck").checked && !$("normalUseSignCheck").disabled) {
            arrMsg.push("签名档");
        }
        switch ($("propertySelect").selectedIndex) {
            case 0:
                break;
            case 1:
                arrMsg.push("道具：隐身草");
                break;
            case 2:
                arrMsg.push("道具：彩虹炫");
                break;
            case 3:
                arrMsg.push("道具：天使之爱");
                break;
        }
        if (!QZONE.css.hasClassName($("noticeInfoCheckInput"), "none") && $("noticeInfoCheckInput").checked && !$("noticeInfoCheckInput").disabled) {
            arrMsg.push("通知到好友信息中心");
        }
        $("selectedTextSpan").innerHTML = ((arrMsg.length > 0) ? ("已选择：" + arrMsg.join("、")) : "");
    },
    showSetting: function(){
        $("_showCommentHref").style.display = "none";
        $("_hideCommentHref").style.display = "";
        $("moreCommentOptionDiv").style.display = "";
        $("_commentSettingHref").title = "收起附加功能";
        $("_commentSettingHref").onclick = CommentManager.hideSetting;
    },
    hideSetting: function(){
        $("_showCommentHref").style.display = "";
        $("_hideCommentHref").style.display = "none";
        $("moreCommentOptionDiv").style.display = "none";
        $("_commentSettingHref").title = "展开附加功能";
        $("_commentSettingHref").onclick = CommentManager.showSetting;
    },
    showNotifyICSetting: function(){
        if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
            commonLoginCallback();
            QZBlog.Util.showLoginBox("blogComment");
            return;
        }
        var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
        if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
            QZBlog.Util.showMsgbox("正在获取您的设置信息，请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            QZBlog.Util.getSubLoginBitMapFlag(function(data, value){
                if (!data) 
                    return;
                parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
                $("noticeInfoCheckInput").checked = (parent.g_oBlogSettingInfoMgr.getCommentNotifyIC(nLoginUin) ? true : false);
                CommentManager._updateSettingText();
            }, 1);
            return;
        }
        QZBlog.Util.popupDialog('设置', '<iframe frameborder="no" id="commentSettingFrame" style="width:100%;height:115px;" src="' + IMGCACHE_BLOG_V5_PATH + '/comment_setting.html"></iframe>', 430, 115);
    },
    submitComment: function(verifycode){
        if (!this.commentEditor) {
            alert("您还没有填写任何评论内容");
            this.getUBBEditor();
            return;
        }
        var content = this.commentEditor.getCurrentEditor().contents.get().rtrim();
        switch (this._checkCommentContent(content)) {
            case 0:
                break;
            case -1:
                this.commentEditor.focus();
                return;default:
                return;        }
        if ($("msgReplyCheck").checked) {
            this._sendSMS(content);
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_add_comment";
        url += "?blogid=" + PageScheduler.curBlogInfo.getID() + "&uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&content=" + content.URLencode() + "&cb_autograph=" + ((($("useSignCheck").checked || $("normalUseSignCheck").checked) && ($("propertySelect").selectedIndex != 1)) ? 1 : 0) + "&property=" + parent.g_Property +
        (($("propertySelect").selectedIndex == 0) ? "" : ("&" + $("propertySelect").value + "=1")) +
        (verifycode ? ("&verifycode=" + verifycode) : "") +
        "&is_friendic=" +
        ((!QZONE.css.hasClassName($("noticeInfoCheckInput"), "none") && $("noticeInfoCheckInput").checked && !$("noticeInfoCheckInput").disabled) ? 1 : 0);
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, this._postCommentSucc), QZONE.emptyFn, "GB2312", false);
        if (!netProcessor) {
            if (QZBlog.Runtime.DebugMode) {
                QZBlog.Log.doLog("CommentManager.submitComment can't create QZBlog.util.NetProcessor, probably due to busy responding");
            }
            return;
        }
        netProcessor.verifyHandler = QZONE.event.bind(this, function(verifycode){
            this.submitComment(verifycode);
        });
        netProcessor.loginHandler = QZONE.event.bind(this, function(){
            blogLoginFnList.splice(0, blogLoginFnList.length);
            commonLoginCallback();
            blogLoginFnList.push(function(){
                QZBlog.Util.getLoginUserBitMap(function(data, value){
                    $("registHrefEntry").style.display = (!value ? "" : "none");
                    if (!value) {
                        $("msgboardSelfReply").style.display = "none";
                    }
                }, 1);
            });
            QZBlog.Util.showLoginBox("blogComment");
        });
        netProcessor.excute();
    },
    _postCommentSucc: function(data){
        QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/succ")), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        this.commentEditor.clearContent();
        $("propertySelect").selectedIndex = 0;
        PageScheduler.curBlogInfo.setCommentCnt(PageScheduler.curBlogInfo.getCommentCnt() + 1);
        $("replyCntSpan").innerHTML = PageScheduler.curBlogInfo.getCommentCnt();
        var viewCnt = parseInt($("viewCntSpan").innerHTML, 10);
        if (!isNaN(viewCnt) && viewCnt < PageScheduler.curBlogInfo.getCommentCnt()) {
            $("viewCntSpan").innerHTML = PageScheduler.curBlogInfo.getCommentCnt();
        }
        QZBlog.Logic.refreshTopData();
        parent.BlogListNavigator.removePageData();
        parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.curBlogInfo.getID());
        PageScheduler.curBlogInfo.deleteCommentListInfoByPageIndex(PageScheduler.curBlogInfo.getCommentPageLength());
        QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, function(){
            window.jumpCommentFloor = PageScheduler.curBlogInfo.getCommentCnt();
            if (PageScheduler.curBlogInfo.getCommentCnt() < CONTENT_COMMENT_NUM) {
                this.showFirstCommentPage();
            }
            else {
                this.showLastCommentPage();
            }
        }), QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    },
    delComment: function(uin, id, arch){
        if (!confirm("删除操作不可恢复，您确认要继续么?")) {
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_del_comment?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + PageScheduler.curBlogInfo.getID() + "&replyid=" + id + "&archive=" + arch + "&replyuin=" + uin;
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, function(data){
            QZBlog.Util.showMsgbox("删除成功！", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            QZBlog.Logic.refreshTopData();
            PageScheduler.curBlogInfo.setCommentCnt(PageScheduler.curBlogInfo.getCommentCnt() - 1);
            $("replyCntSpan").innerHTML = PageScheduler.curBlogInfo.getCommentCnt();
            PageScheduler.curBlogInfo.deleteCommmentInfo(id);
            parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.curBlogInfo.getID());
            parent.BlogListNavigator.removePageData();
            this.showCurrentCommentPage();
        }), QZONE.emptyFn, "GB2312", false);
        netProcessor.loginHandler = function(){
            QZBlog.Util.showLoginBox("ownerOperation");
        };
        netProcessor.excute();
    },
    deleteBatchComments: function(){
        var oList = document.getElementsByName("commentCheckBox");
        if (oList.length == 0) {
            return;
        }
        var tmp;
        var arrCommentList = [];
        var arrArchList = [];
        var arrUinList = [];
        for (var i = 0; i < oList.length; ++i) {
            if (oList[i].checked) {
                tmp = oList[i].value.split('_');
                arrCommentList.push(tmp[0]);
                arrArchList.push(tmp[1]);
                arrUinList.push(tmp[2]);
            }
        }
        if (arrCommentList.length == 0) {
            QZBlog.Util.showMsgbox("请选择要删除的评论", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        QZBlog.Util.assert(PageScheduler.curBlogInfo.getCommentCnt() >= arrCommentList.length, "名博删除评论数大于总评论数");
        if (!confirm("您是否要删除选中的用户评论？")) {
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_batch_del_comment?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + PageScheduler.curBlogInfo.getID() + "&archlist=" + (arrArchList.join("-")).URLencode() + "&replyidlist=" + (arrCommentList.join("-")).URLencode() + "&replyuinlist=" + (arrUinList.join("-")).URLencode();
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, function(data){
            QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/succ")), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            QZBlog.Logic.refreshTopData();
            PageScheduler.curBlogInfo.setCommentCnt(PageScheduler.curBlogInfo.getCommentCnt() - arrCommentList.length);
            $("replyCntSpan").innerHTML = PageScheduler.curBlogInfo.getCommentCnt();
            for (var index = 0; index < arrCommentList.length; ++index) {
                PageScheduler.curBlogInfo.deleteCommmentInfo(arrCommentList[index]);
            }
            parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.curBlogInfo.getID());
            parent.BlogListNavigator.removePageData();
            this.showCurrentCommentPage();
        }), QZBlog.Util.DumpMsgFunc, "GB2312", false);
        netProcessor.loginHandler = function(){
            QZBlog.Util.showLoginBox("ownerOperation");
        };
        netProcessor.excute();
    },
    selectAllComments: function(bChecked){
        var oList = document.getElementsByName("commentCheckBox");
        if (oList.length == 0) 
            return;
        for (var i = 0; i < oList.length; ++i) {
            oList[i].checked = !!bChecked;
        }
    },
    showCommentCheckBoxs: function(bShow, bCheck){
        var oList = document.getElementsByName("commentCheckBox");
        if (oList.length == 0) {
            return;
        }
        for (var i = 0; i < oList.length; ++i) {
            oList[i].style.display = ((!!bShow) ? "" : "none");
            oList[i].checked = (!!bCheck ? true : false);
        }
        $("batchSelAllInput").checked = (!!bCheck ? true : false);
        $("leftDeleteComParag").style.display = ((!!bShow) ? "" : "none");
        $("batchDelComHref").style.display = ((!!bShow) ? "none" : "");
        $("noBatchDelComHref").style.display = ((!!bShow) ? "" : "none");
    },
    _sendSMS: function(content){
        if ($("verifycode_replysms").value.trim() == "") {
            alert("请输入验证码");
            return;
        }
        if (!(/^[0-9a-zA-Z]{4,}$/).test($("verifycode_replysms").value.trim())) {
            alert("您输入的验证码错误请重新输入");
            $("verifycode_replysms").focus();
            return;
        }
        parent.cacheForAnonComment = {
            title: ((QZBlog.Logic.SpaceHostInfo.isValidLoginUin() ? QZBlog.Logic.SpaceHostInfo.getLoginUin() : "") + "对您的日志" + PageScheduler.curBlogInfo.getTitle() + "发表的评论").URLencode(),
            content: ((QZBlog.Logic.SpaceHostInfo.isValidLoginUin() ? QZBlog.Logic.SpaceHostInfo.getLoginUin() : "") + "对您的日志" + PageScheduler.curBlogInfo.getTitle() + "发表的评论:\n" + content).URLencode(),
            verifycode: (!!$("verifycode_replysms") ? $("verifycode_replysms").value : null)
        };
        $("verifycode_replysms").value = "";
        QZBlog.Util.showMsgbox("正在提交您的请求，请稍候...", 1, QZBlog.Util.MSG_LIFTTIME.HIGH);
        var url = "http://msg.qzone.qq.com/fcg-bin/fcgi_get_price?uin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&recvuin=" + QZBlog.Logic.SpaceHostInfo.getUin();
        loadXMLAsync("SMSvalue", url, function(){
            var data = parent.g_XDoc["SMSvalue"];
            var type = parseInt(getXMLNodeText(XMLselectSingleNode(data, "/data/dayalrsnd")), 10);
            if (isNaN(type)) {
                type = 0;
            }
            var nb = parseInt(getXMLNodeText(XMLselectSingleNode(data, "/data/needBalance")), 10);
            if (isNaN(nb)) {
                nb = 0;
            }
            switch (type) {
                case 0:
                    doSendSMS();
                    break;
                case 1:
                    if (confirm("尊敬的用户，您填写的收件人不是您的QQ好友\n为避免骚扰，发送此条小纸条需要收取您" + (nb / 100) + "Q币的费用，您确认要发送么？")) {
                        doSendSMS(true);
                    }
                    else {
                        QZBlog.Util.hideMsgbox();
                    }
                    break;
                case 2:
                    if (confirm("尊敬的用户，您本日的免费发送额度已满\n为避免骚扰，发送此条小纸条需要收取您" + (nb / 100) + "Q币的费用，您确认要发送么？")) {
                        doSendSMS(true);
                    }
                    else {
                        QZBlog.Util.hideMsgbox();
                    }
                    break;
            }
            delete parent.g_XDoc["SMSvalue"];
        }, QZBlog.Util.DumpMsgFunc, true);
    },
    _buildUBBEditor: function(){
        if (this.commentEditor) {
            return;
        }
        if ((QZBlog.Logic.SpaceHostInfo.isFamousUser() || QZBlog.Logic.SpaceHostInfo.isBizUser()) && !QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            QZONE.editor.toolbar.setLayout("comment_toolbar", {
                extendClass: "editor_tools simple_mode",
                layouts: [{
                    width: "auto",
                    height: "auto",
                    className: "inout_tools",
                    buttons: ["historyback", "historynext"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "expert_tools",
                    buttons: ["emotions_s"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "other_tools",
                    style: "float:left",
                    buttons: ["help"]
                }]
            });
        }
        else {
            QZONE.editor.toolbar.setLayout("comment_toolbar", {
                extendClass: "editor_tools simple_mode",
                layouts: [{
                    width: "auto",
                    height: "auto",
                    className: "font_tools",
                    buttons: ["fontfamily", "fontsize", "bold", "italic", "underline", "fontcolor", "glowfont", "cleanstyle"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "typeset_tools",
                    buttons: ["justifyleft", "justifycenter", "justifyright"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "expert_tools",
                    buttons: ["emotions_s", "insertimage_s", QZBlog.Logic.SpaceHostInfo.isVipUser() ? "qqshowbubble_s" : "dump"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "inout_tools",
                    buttons: ["historyback", "historynext"]
                }, {
                    width: "auto",
                    height: "auto",
                    className: "other_tools",
                    style: "float:left",
                    buttons: ["help"]
                }]
            });
        }
        this.commentEditor = QZONE.editor.create("commentEditorAnchor", {
            editorList: ["html"],
            toolbarList: ["comment_toolbar"],
            height: "200px",
            width: "100%",
            resizable: false
        });
        this.commentEditor.onEditorReady = QZONE.event.bind(this, function(){
            try {
                this.commentEditor.setFontSize(2);
                this.commentEditor.initBlogEvents();
                this.commentEditor.setMaxContentLength(MAX_COMMENT_LEN);
                setTimeout(QZONE.event.bind(this, function(){
                    if (this._postEditorBuildedCBList.length > 0) {
                        (this._postEditorBuildedCBList.pop())();
                    }
                }), 50);
            } 
            catch (err) {
            }
        });
        this.commentEditor.build();
        var oTextArea = $("commentEditor");
        oTextArea.blur();
        oTextArea.style.display = "none";
        $("commentEditorAnchor").style.display = "";
    },
    getUBBEditor: function(){
        $("commentEditor").onfocus = null;
        QZONE.css.insertCSSLink("/qzonestyle/global/css/qzfl.css");
        var url = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/editor/comment_editor.js";
        loadEditor(url, QZONE.event.bind(this, this._buildUBBEditor), function(){
            setTimeout(function(){
                loadEditor(url + "?r=" + Math.random(), function(){
                    CommentManager._buildUBBEditor();
                }, function(){
                    alert("服务器繁忙，暂时无法初始编辑器，请稍候重试。");
                }, "utf-8");
            }, 1000);
        }, "utf-8");
    },
    removeCommentReply: function(commentID, replyUin, replyTime){
        if (!confirm("删除操作不可恢复，您确认要继续么?")) {
            return;
        }
        var info = PageScheduler.curBlogInfo.getCommentInfo(commentID);
        if (!info) {
            QZBlog.Util.showMsgbox("暂时无法删除该回复，请刷新空间重试", 1, QZBlog.Util.MSG_LIFTTIME.HIGH);
            return;
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_del_replycomment";
        var data = "param=" + QZBlog.Logic.SpaceHostInfo.getUin() + "," + PageScheduler.curBlogInfo.getID() + "," + commentID + "," + info.getCommentArch() + "," + replyUin + "," + replyTime;
        var fs = new QZONE.FormSender(url, "post", data, "GB2312");
        fs.onSuccess = function(data){
            if (data.ret != 0) {
                QZBlog.Util.showMsgbox(data.msg, 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                return;
            }
            QZBlog.Util.showMsgbox("删除成功", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            var replyInfo = info.getReplyInfo();
            for (var index = 0; index < replyInfo.length; ++index) {
                if (replyInfo[index].uin == replyUin && replyInfo[index].time == replyTime) {
                    replyInfo.splice(index, 1);
                    break;
                }
            }
            $('masterComment' + commentID).innerHTML = PageScheduler.CommentScheduler._getMixReplyContent(commentID, replyInfo);
        };
        fs.onError = QZBlog.Util.DumpMsgFunc;
        fs.send();
    }
};
var PageScheduler = {
    "curBlogInfo": null,
    "ContentScheduler": {
        bLoaded: true,
        start: function(){
            if ($("contentAuthorHref").getAttribute("uin") == QZBlog.Logic.SpaceHostInfo.getUin()) {
                $("contentAuthorHref").innerHTML = QZBlog.Logic.SpaceHostInfo.getNickname().toInnerHTML();
            }
            else {
                var uin = $("contentAuthorHref").getAttribute("uin");
                if (isValidUin(uin)) {
                    var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_userinfo?uin=" + uin;
                    var netProcessor = new QZBlog.Util.BlogNetProcessor();
                    netProcessor.create(url, "get", function(data){
                        if (data.data.uin == 177988688) {
                            $("contentAuthorHref").parentNode.innerHTML = "本文由&nbsp;&nbsp;&nbsp;<span style='font-weight:bold'>手机腾讯网资讯编辑</span>&nbsp;&nbsp;&nbsp;发表在：&nbsp;<a href='http://3gqq.qq.com/portal/?fr=qzcopied' target='_blank' style='text-decoration:underline;font-weight:bold'>手机腾讯资讯频道</a><br />";
                        }
                        else {
                            $("contentAuthorHref").innerHTML = data.data.nick;
                        }
                    }, QZONE.emptyFn, "GB2312", true, "_Callback");
                    netProcessor.excute();
                }
                else {
                    $("contentAuthorHref").href = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + uin;
                    var url = "http://qzone.xiaoyou.qq.com/userinfo_json.php?qq=" + uin;
                    var portraitReq = new QZBlog.Util.BlogNetProcessor();
                    portraitReq.create(url, "get", QZONE.event.bind(this, function(o){
                        if (!o || !o.data) {
                            return;
                        }
                        $("contentAuthorHref").innerHTML = o.data[uin].realname;
                    }), QZONE.emptyFn, "UTF-8", true, "SchoolInfoCallback");
                    portraitReq.excute();
                }
            }
            QZBlog.Logic.procBlogContent(!!PageScheduler.curBlogInfo.getPaperLetterInfo(), true);
            this._showBlogViewCnt();
            this._showLetterPaper();
            this._showSignature();
            this.showRightSettingInfo();
            QZBlog.Util.Statistic.addSpeedPoint(4);
            if (typeof(parent.bDirectEnterBlog) == "undefined") {
                parent.bDirectEnterBlog = (/\/blog/i).test(parent.location.href);
                if (parent.bDirectEnterBlog) {
                    parent.QZONE.statistic.stepTime.genTime(14);
                }
            }
            if (/^http:\/\/(www\.)?(google|baidu|soso)\.(com|cn)(\.cn)?\//i.test(parent.document.referrer)) {
                QZBlog.Util.Statistic.sendPV(RegExp.$2);
            }
            else {
                QZBlog.Util.Statistic.sendPV("readblog");
            }
            QZBlog.Util.Statistic.sendUPV(PageScheduler.curBlogInfo.getID());
            if (PageScheduler.curBlogInfo.getEffectBit(32)) {
                QZBlog.Util.TimerManager.setTimeout(function(){
                    try {
                        if (parent.window.musicJSReady && parent.isPlaying()) {
                            parent.Qpause();
                        }
                        window.bTopPageMusicStop = true;
                        QZONE.cookie.set("pausemusic", "1");
                    } 
                    catch (err) {
                    }
                }, 1000);
            }
            PageScheduler.NamecardScheduler.initContent();
            QZBlog.Util.TimerManager.setTimeout(QZBlog.Logic.initMusicPlayer, 3000);
        },
        _showSignature: function(){
            if (QZBlog.Logic.SpaceHostInfo.getSignature() == null) {
                QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this._showSignature), 100);
                return;
            }
            if (!!$("signatureDIV")) {
                $("signatureDIV").innerHTML = ubbReplace(QZBlog.Logic.SpaceHostInfo.getSignature().convSP().convCR(), "face anchor image email sign glow_limit font", null, null, IMGCACHE_DOMAIN);
                if (QZBlog.Logic.SpaceHostInfo.getSignature().trim().length == 0) {
                    $("signatureDIV").parentNode.style.display = "none";
                }
            }
        },
        showRightSettingInfo: function(){
            if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                return;
            }
            var info = PageScheduler.curBlogInfo.getRightInfo();
            if (info.getType() == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
                var arr = info.getUserIDList();
                QZBlog.Util.getPortraitList(arr, function(portraitInfo){
                    var str = "";
                    var uin = -1;
                    var userInfoList = info.getUserList();
                    for (var index = 0; index < userInfoList.length; ++index) {
                        uin = userInfoList[index].getUin();
                        str += portraitInfo[uin][6] + "(" + uin + ")" + ",";
                    }
                    str = str.substr(0, str.length - 1);
                    $("rightSettingSpan").title = str.toRealStr();
                    $("rightSettingSpan").innerHTML = "权限：指定好友可见";
                });
            }
            else 
                if (info.getType() == parent.BlogRightInfo.RIGHTTYPE["FRIEND"]) {
                    $("rightSettingSpan").title = "QQ好友可见";
                    $("rightSettingSpan").innerHTML = "权限: QQ好友可见";
                }
                else {
                    $("rightSettingSpan").title = "公开";
                    $("rightSettingSpan").innerHTML = "权限: 公开";
                }
        },
        _showLetterPaper: function(){
            if (PageScheduler.curBlogInfo.getPaperLetterInfo()) {
                QZONE.css.addClassName($("veryTitle").parentNode, "has_paper");
                QZBlog.Util.PaperLetterManager.doPaint(PageScheduler.curBlogInfo.getPaperLetterInfo(), PageScheduler.curBlogInfo.getTitle());
            }
            else {
                QZONE.css.removeClassName($("veryTitle").parentNode, "has_paper");
            }
        },
        _showBlogViewCnt: function(){
            if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode() && (PageScheduler.curBlogInfo.getEffectBit(8) || PageScheduler.curBlogInfo.getEffectBit(22))) {
                return;
            }
            var blogID = PageScheduler.curBlogInfo.getID();
            var rcPool = (parent.g_XDoc && parent.g_XDoc["blogCommentCount"]) ? parent.g_XDoc["blogCommentCount"] : {};
            if (!rcPool[blogID]) {
                rcPool[blogID] = {};
                rcPool[blogID].c = rcPool[blogID].reply = PageScheduler.curBlogInfo.getCommentCnt();
            }
            if (typeof(rcPool[blogID].read) == "undefined" || rcPool[blogID].read == "-") {
                var arr = new Array();
                arr.push(blogID);
                QZBlog.Logic.getBlogViewInfo(arr, QZONE.event.bind(this, function(data){
                    var rawData = data.data.itemlist[0];
                    if (typeof(rcPool[rawData.id]) == "undefined") {
                        rcPool[rawData.id] = {};
                    }
                    rcPool[rawData.id].read = Math.max(rcPool[rawData.id].reply, rawData.read);
                    PageScheduler.curBlogInfo.setViewCnt(rcPool[rawData.id].read);
                    if ($("viewCntSpan")) {
                        $("viewCntSpan").innerHTML = rcPool[rawData.id].read;
                    }
                }));
                delete arr;
            }
            else {
                $("viewCntSpan").innerHTML = Math.max(rcPool[blogID].read, PageScheduler.curBlogInfo.getCommentCnt());
            }
        }
    },
    "CommentScheduler": {
        pageIndexHTML: '<p>共<strong class="hit_none"><%=commentCnt=%></strong>篇评论，第<strong class="hit_none"><%=curPage=%></strong>页/共<span><%=totalPage=%></span>页</p>',
        start: function(){
            $("commentListContainer").innerHTML = parent.g_hsBlogTemplate['commentTemplate'].replace(/<%=famousClass=%>/gi, QZBlog.Logic.SpaceHostInfo.isFamousUser() ? "" : "none").replace(/<%=normalClass=%>/gi, QZBlog.Logic.SpaceHostInfo.isFamousUser() ? "none" : "").replace(/<%=visitorClass=%>/gi, QZBlog.Logic.SpaceHostInfo.isOwnerMode() ? "none" : "").replace(/<%=rightClass=%>/gi, (QZBlog.Logic.SpaceHostInfo.checkAuthorization() || (PageScheduler.curBlogInfo.getRightInfo().getType() != parent.BlogRightInfo.RIGHTTYPE["PUBLIC"])) ? "none" : "").replace(/<%=bizClass=%>/gi, QZBlog.Logic.SpaceHostInfo.isBizUser() ? "none" : "").replace(/<%=allowCommentClass=%>/gi, !!window.g_NonFriendReplyFlag ? "" : "none").replace(/<%=forbidCommentClass=%>/gi, !window.g_NonFriendReplyFlag ? "" : "none");
            $("commentEditor").value = '点击这里发表评论，如果您要显示签名档，请' + (QZBlog.Logic.SpaceHostInfo.isFamousUser() ? '' : '点击“附加功能”并') + '勾选“使用签名档”';
            $("pageIndexContainer").innerHTML = parent.g_hsBlogTemplate['cpageIndexTemplate'].replace(/<%=curBlogID=%>/gi, PageScheduler.curBlogInfo.getID());
            if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                $("useSignCheck").checked = false;
            }
            if (!parent.UserBlogConfig.getCheatHintFlag()) {
                $("cheatHintArea").style.display = "";
            }
            if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                $("anonymcheck").parentNode.style.display = "";
                $("propertySelect").parentNode.style.display = "none";
            }
            if (QZBlog.Logic.SpaceHostInfo.isValidLoginUin() && !QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                $("msgboardSelfReply").style.display = "";
            }
            CommentManager._updateSettingText();
            QZONE.event.addEvent($("noticeInfoCheckInput"), "click", CommentManager._updateSettingText);
            QZONE.event.addEvent($("normalUseSignCheck"), "click", CommentManager._updateSettingText);
            QZONE.event.addEvent($("propertySelect"), "change", function(){
                var bDiabled = ($("propertySelect").selectedIndex == 1);
                $("normalUseSignCheck").disabled = bDiabled;
                $("noticeInfoCheckInput").disabled = bDiabled;
                CommentManager._updateSettingText();
            });
            this.showCommentList(PageScheduler.curBlogInfo.getCommentListInfo(PageScheduler.curBlogInfo.getCurCommentPage()));
            this.checkCommentSetting();
            QZBlog.Util.getLoginUserBitMap(function(data, value){
                $("registHrefEntry").style.display = (!value ? "" : "none");
                if (!value) {
                    $("msgboardSelfReply").style.display = "none";
                }
            }, 1);
            QZBlog.Util.Statistic.addSpeedPoint(5);
        },
        checkCommentSetting: function(){
            var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
            if (QZBlog.Logic.SpaceHostInfo.isValidLoginUin() && !QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !QZBlog.Logic.SpaceHostInfo.isFamousUser() && !QZBlog.Logic.SpaceHostInfo.isBizUser() && !(QZBlog.Logic.SpaceHostInfo.checkAuthorization() || (PageScheduler.curBlogInfo.getRightInfo().getType() != parent.BlogRightInfo.RIGHTTYPE["PUBLIC"]))) {
                $("comment_hint").style.display = "";
            }
            if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
                QZBlog.Util.getSubLoginBitMapFlag(function(data, value){
                    if (!data) 
                        return;
                    parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
                    $("noticeInfoCheckInput").checked = (parent.g_oBlogSettingInfoMgr.getCommentNotifyIC(nLoginUin) ? true : false);
                    CommentManager._updateSettingText();
                }, 1);
            }
            else {
                $("noticeInfoCheckInput").checked = (parent.g_oBlogSettingInfoMgr.getCommentNotifyIC(nLoginUin) ? true : false);
                CommentManager._updateSettingText();
            }
        },
        _updateCommentPageIndex: function(){
            var curPage = PageScheduler.curBlogInfo.getCurCommentPage();
            var totalPage = PageScheduler.curBlogInfo.getCommentPageLength();
            var totalCnt = PageScheduler.curBlogInfo.getCommentCnt();
            if (totalCnt == 0) {
                $("topPageIndexArea").innerHTML = "";
                $("bottomPageIndexArea").innerHTML = "";
                return;
            }
            $("topPageInfoArea").innerHTML = $("bottomPageInfoArea").innerHTML = this.pageIndexHTML.replace(/<%=commentCnt=%>/gi, totalCnt).replace(/<%=curPage=%>/gi, curPage).replace(/<%=totalPage=%>/gi, totalPage);
            var containerArr = [];
            containerArr.push($("topPageIndexArea"));
            containerArr.push($("bottomPageIndexArea"));
            QZBlog.Util.PageIndexManager.init(containerArr, totalPage, curPage, QZONE.event.bind(CommentManager, CommentManager.showCommentPage));
        },
        showSingleCommentInfo: function(info, comData){
            this._procCommentInfo(info, comData);
            var commentDiv = $("singleCommentDiv" + info.getCommentID());
            if (!commentDiv) {
                return;
            }
            commentDiv.outerHTML = doFill(parent.g_hsBlogTemplate["commentList"], {
                "data": comData
            });
            try {
                QZONE.namecard.init(commentDiv);
            } 
            catch (err) {
            }
            PortraitManager.clear();
            var tmpList = new Array();
            tmpList.push(info);
            PortraitManager.addPortraitCallback(QZONE.event.bind(this, this._showQZoneUserPortrait, tmpList), PortraitManager.PORTRAIT_TYPE["QZONE"]);
            PortraitManager.addPortraitCallback(QZONE.event.bind(this, this._showCampusUserPortrait, tmpList), PortraitManager.PORTRAIT_TYPE["CAMPUS"]);
            PortraitManager.addUin(info.getUserInfo().getUin(), info.getUserInfo().getUserType());
            PortraitManager.loadPortrait();
        },
        showCommentList: function(listInfo){
            if (!listInfo || listInfo.length == 0) {
                $("commentListDiv").innerHTML = "";
                $("commentDiv").style.display = "none";
                if (PageScheduler.curBlogInfo.getRecentVisitorInfo() == null) {
                    PageScheduler.VisitorScheduler.getRecentVisitor();
                }
                return;
            }
            PortraitManager.clear();
            PortraitManager.addPortraitCallback(QZONE.event.bind(this, this._showQZoneUserPortrait, listInfo), PortraitManager.PORTRAIT_TYPE["QZONE"]);
            PortraitManager.addPortraitCallback(QZONE.event.bind(this, this._showCampusUserPortrait, listInfo), PortraitManager.PORTRAIT_TYPE["CAMPUS"]);
            var arrCommentHTML = [];
            var floornum = (PageScheduler.curBlogInfo.getCurCommentPage() - 1) * CONTENT_COMMENT_NUM + 1;
            for (var index = 0; index < listInfo.length; ++index) {
                var info = listInfo[index];
                if (info) {
                    info.setFloorNum(floornum++);
                    var data = info.toJsonObject();
                    this._procCommentInfo(info, data);
                    arrCommentHTML.push(doFill(parent.g_hsBlogTemplate["commentList"], {
                        "data": data
                    }));
                    PortraitManager.addUin(info.getUserInfo().getUin(), info.getUserInfo().getUserType());
                }
            }
            $("commentListDiv").innerHTML = arrCommentHTML.join("");
            $("commentDiv").style.display = "";
            if (window.jumpCommentFloor) {
                setTimeout(function(){
                    location.hash = "#singleCommentDiv" + window.jumpCommentFloor;
                    window.jumpCommentFloor = 0;
                }, QZBlog.Util.MSG_LIFTTIME.LOW);
            }
            if (PageScheduler.curBlogInfo.getRecentVisitorInfo() == null) {
                PageScheduler.VisitorScheduler.getRecentVisitor();
            }
            else {
                if (!QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                    PortraitManager.loadPortrait();
                }
                PageScheduler.NamecardScheduler.initCommentList();
            }
            if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                if (!!$("batchDelComHref") && $("batchDelComHref").style.display == "none") {
                    CommentManager.showCommentCheckBoxs(true, $("batchSelAllInput").checked);
                }
                if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                    $("famousOperArea").style.display = "";
                }
            }
            this._updateCommentPageIndex();
        },
        _getUserGradeHTML: function(score){
            if (score == 0) {
                return '<span><img src="/ac/b.gif" class="icon_grading0" /></span>';
            }
            var t;
            var tmp;
            var result = [];
            tmp = (score.toString(4)).split("");
            if (tmp.length > 3) {
                t = tmp.shift();
                tmp[0] = parseInt(tmp[0], 10) + parseInt(t, 10) * 4;
            }
            for (var i = 0; i < tmp.length; ++i) {
                t = parseInt(tmp[i], 10);
                if (t == 0) {
                    continue;
                }
                result.push((new Array(t + 1)).join('<img src="/ac/b.gif" class="icon_grading' + (4 - (i + (4 - tmp.length))) + '" />'));
            }
            return ("<span>" + result.join(" ") + "</span>");
        },
        _getUserGrade: function(score){
            var t = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];
            if (score < 90) {
                for (var i = t.length - 2; i >= 0; --i) {
                    if (score - t[i] >= 0) {
                        return i;
                    }
                }
            }
            else {
                return Math.floor(Math.sqrt(score / 10)) + 7;
            }
        },
        _showQZoneUserPortrait: function(listInfo){
            for (var i = 0; i < listInfo.length; i++) {
                var portraitInfo = PortraitManager.getPortraitInfo(listInfo[i].getUserInfo().getUin(), PortraitManager.PORTRAIT_TYPE["QZONE"]);
                if (!portraitInfo) {
                    continue;
                }
                if (listInfo[i].getUserInfo().getUserType() != 0) {
                    continue;
                }
                var imgEle = $("imgUrl" + listInfo[i].getFloorNum());
                if (!!imgEle) {
                    var src = ((portraitInfo[0] == "/qzone_v4/client/userinfo_icon/default.gif") ? parent.DEFAULT_USER_PORTRAIT : portraitInfo[0]);
                    imgEle.onload = function(){
                        imgEle.onload = null;
                        resizeImg(imgEle);
                    };
                    QZBlog.Util.ImageManager.loadObjectImage(([src, ((/\?/).test(src) ? "&" : "?"), "sds=", PortraitManager.portraitSeed]).join(""), imgEle);
                }
                var gradeEle = $("flowerDiv" + listInfo[i].getFloorNum());
                if (!!gradeEle) {
                    var score = this._getUserGrade(portraitInfo[1]);
                    gradeEle.innerHTML = this._getUserGradeHTML(score);
                    gradeEle.onmouseover = (function(ele, score, grade){
                        return function(){
                            showUserGradeTips(ele, score, grade);
                        };
                    })(gradeEle, score, portraitInfo[1]);
                    gradeEle.onmouseout = hideUserTips;
                }
                var vipEle = $("yellowHref" + listInfo[i].getFloorNum());
                if (!!vipEle && !!portraitInfo[5] && portraitInfo[3] > 0) {
                    vipEle.innerHTML = "<span>" + portraitInfo[3] + "</span>";
                    vipEle.parentNode.style.display = "";
                }
            }
        },
        _showCampusUserPortrait: function(listInfo){
            for (var i = 0; i < listInfo.length; i++) {
                var portraitInfo = PortraitManager.getPortraitInfo(listInfo[i].getUserInfo().getUin(), PortraitManager.PORTRAIT_TYPE["CAMPUS"]);
                if (!portraitInfo) {
                    continue;
                }
                if (listInfo[i].getUserInfo().getUserType() != 1) {
                    continue;
                }
                var imgEle = $("imgUrl" + listInfo[i].getFloorNum());
                if (!!imgEle) {
                    imgEle.link = "";
                    imgEle.onload = function(){
                        imgEle.onload = null;
                        resizeImg(imgEle);
                    };
                    QZBlog.Util.ImageManager.loadObjectImage(portraitInfo[0], imgEle);
                    var strHref = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + listInfo[i].getUserInfo().getUin();
                    imgEle.onmouseover = (function(obj, uin){
                        return function(){
                            showUserCampusTips(obj, "<a style='text-decoration:underline;color:blue' href='" + strHref + "' target='_blank'>访问其QQ校友个人主页</a>");
                        };
                    })(imgEle, listInfo[i].getUserInfo().getUin());
                    imgEle.onmouseout = hideUserTips;
                    imgEle.parentNode.href = strHref;
                }
                var gradeEle = $("flowerDiv" + listInfo[i].getFloorNum());
                if (!!gradeEle) {
                    if (listInfo[i].getSchoolName().trim().length == 0) {
                        gradeEle.innerHTML = "<a href='http://xiaoyou.qq.com' target='_blank'>来自：QQ校友</a>";
                    }
                    else {
                        gradeEle.innerHTML = "<a href='http://xiaoyou.qq.com/index.php?mod=school&act=schoolportal&school_id=" + listInfo[i].getSchoolID() + "' target='_blank'>来自：" + listInfo[i].getSchoolName().substring(0, 8) + "</a>";
                        gradeEle.onmouseover = (function(obj, uin, schoolName, schoolID){
                            return function(){
                                showUserCampusTips(obj, "<a style='text-decoration:underline;color:blue' href='http://xiaoyou.qq.com/index.php?mod=school&act=schoolportal&school_id=" + schoolID + "' target='_blank'>" + schoolName + "</a>");
                            };
                        })(gradeEle, listInfo[i].getUserInfo().getUin(), listInfo[i].getSchoolName(), listInfo[i].getSchoolID());
                        gradeEle.onmouseout = hideUserTips;
                    }
                }
                var vipEle = $("yellowHref" + listInfo[i].getFloorNum());
                if (!!vipEle && !!portraitInfo[5] && portraitInfo[3] > 0) {
                    vipEle.innerHTML = "<span>" + portraitInfo[3] + "</span>";
                    vipEle.parentNode.style.display = "";
                }
                var operArea = $("commentOperArea" + listInfo[i].getFloorNum());
                if (operArea) {
                    operArea.style.display = "none";
                }
            }
        },
        _getCommentOperBtnHTML: function(info, type){
            switch (type) {
                case 1:
                    return '<a href="javascript:;" onclick="CommentManager.mirrorComment(\'' + info.getCommentID() + '\', ' +
                    info.getCommentArch() +
                    ');return false;" title="您要拥有照妖镜道具才可以使用照妖镜，照妖镜道具请在藏宝阁兑换"><img class="icon_mirror" alt="使用照妖镜" src="/ac/b.gif"/>照妖镜</a>';
                case 2:
                    return '<a href="javascript:;" onclick="CommentManager.showCommentEditor(\'' + info.getCommentID() + '\');return false;" title="回复该评论"><img class="icon_person_face" alt="回复该评论" src="/ac/b.gif"/>回复</a>';
                case 3:
                    return '<a href="javascript:;" onclick="CommentManager.quoteCommentContent(\'' + info.getCommentID() + '\');return false;" title="引用该评论"><img class="icon_info_message" alt="引用该评论" src="/ac/b.gif"/>引用</a>';
                case 4:
                    return '<a href="javascript:;" onclick="CommentManager.reportComment(\'' + info.getUserInfo().getUin() + '\', ' +
                    info.getCommentID() +
                    ', ' +
                    info.getCommentArch() +
                    ');return false;" title="举报该评论"><img class="icon_report" alt="举报该评论" src="/ac/b.gif"/>举报</a>';
                case 5:
                    return '<a href="javascript:;" onclick="CommentManager.delComment(\'' + info.getUserInfo().getUin() + '\', \'' +
                    info.getCommentID() +
                    '\', ' +
                    info.getCommentArch() +
                    ');return false;" title="删除该评论"><img class="icon_del" alt="删除该评论" src="/ac/b.gif"/>删除</a>';
                default:
                    return "";
            }
        },
        _getCommentOperAreaHTML: function(info){
            if (!info) {
                return "";
            }
            var strHTML = "";
            if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                if (info.getEffect() & 1) {
                    strHTML += this._getCommentOperBtnHTML(info, 1) + " | ";
                }
                strHTML += this._getCommentOperBtnHTML(info, 2) + " | ";
                if (info.getQuoteFlag()) {
                    strHTML += this._getCommentOperBtnHTML(info, 3) + " | ";
                }
                if (info.getUserInfo().getUin() != QZBlog.Logic.SpaceHostInfo.getUin() && !info.getUserInfo().getUserType()) {
                    strHTML += this._getCommentOperBtnHTML(info, 4) + " | ";
                }
                strHTML += this._getCommentOperBtnHTML(info, 5);
            }
            else {
                if (!info.getUserInfo().getUserType() && !QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                    strHTML += this._getCommentOperBtnHTML(info, 2) + " | ";
                }
                if (info.getQuoteFlag()) {
                    strHTML += this._getCommentOperBtnHTML(info, 3);
                }
                if (info.getUserInfo().getUin() != QZBlog.Logic.SpaceHostInfo.getUin()) {
                    if (!info.getUserInfo().getUserType()) {
                        strHTML += (info.getQuoteFlag() ? " | " : "") + this._getCommentOperBtnHTML(info, 4);
                    }
                }
            }
            return strHTML;
        },
        _parseQZoneCommentEffect: function(info, data){
            var efl = QZBlog.Util.effectSplit(info.getEffect());
            var tmp;
            if (!info.getUserInfo().getUserType()) {
                data.replyArea = '<span><a link="nameCard_' + info.getUserInfo().getUin() + '" href="' +
                QZBlog.Util.getSpaceUrl(info.getUserInfo().getUin()) +
                '" target="_blank" class="q_namecard guestname c_tx4">' +
                info.getUserInfo().getNickname() +
                '</a></span>';
            }
            for (var i = 0; i < efl.length; ++i) {
                switch (parseInt(efl[i], 10)) {
                    case 1:
                        data.replyArea = '<span title="此用户使用隐身草,只有您使用照妖镜后,才可以点击这里进入其空间">匿名</span>';
                        data.replyautograph = "";
                        data.operClass = "display:none";
                        break;
                    case 2:
                        if (QZONE.userAgent.ie) {
                            data.rainbowColor = $("jumpEditorBtn").currentStyle.backgroundColor;
                        }
                        data.rainbowClass = "";
                        data.notRainbowClass = "none";
                        break;
                    case 4:
                        data.angelClass = "";
                        break;
                    case 8:
                        data.replyContent = '<div style="text-align:center;font-color:#EE1D24">评论内容已被管理员屏蔽</div>';
                        info.setQuoteFlag(false);
                        break;
                    case 16:
                        data.replyArea = '<span title="此用户使用匿名评论">' + data.replynick + '</span>';
                        break;
                    case 1024:
                        data.replyContent += '<br /><br />-----------------------------------<br />该评论来自<a style="color:blue" target="_blank" href="http://3gqq.qq.com/qzone/?fr=qzreply"><span class="hl">手机Qzone</span></a>';
                        break;
                    case 32768:
                        data.replyContent += '<br /><br />-----------------------------------<br />该评论来自 <b>移动Qzone</b> 。<b>移动Qzone</b>，随时随地用手机看日志评论，轻松回复！<br /> <a style="color:blue" target="_blank" href="http://m-qzone.qq.com/?from=qzoneJD"><span class="mode_title">详情请进&gt;&gt;</span></a>';
                        break;
                }
            }
            data.commentOPSpan = this._getCommentOperAreaHTML(info);
            if (info.getReplyInfo().length > 0) {
                data.replyclass = "";
                data.mixReplyContent = this._getMixReplyContent(info.getCommentID(), info.getReplyInfo());
            }
            else {
                data.replyclass = "none";
            }
        },
        _getMixReplyContent: function(commentID, info){
            if (!info) {
                return "";
            }
            var arrRevert = [];
            var aItem, aNick, aTime;
            for (var i = 0; i < info.length; i++) {
                aItem = info[i];
                if (!aItem.uin) {
                    aItem.uin = QZBlog.Logic.SpaceHostInfo.getUin();
                }
                var strNickHref = (aItem.uin == QZBlog.Logic.SpaceHostInfo.getUin() ? '主人' : ("<a href='http://user.qzone.qq.com/" + aItem.uin + "' target='_blank' class='q_namecard unline' link='nameCard_" + aItem.uin + "'>" + aItem.nick + "</a>"));
                if (!isValidUin(aItem.uin)) {
                    strNickHref = "<a href='http://xiaoyou.qq.com/index.php?mod=profile&u=" + aItem.uin + "' target='_blank' class='unline'>" + aItem.nick + "</a>"
                }
                if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                    aNick = (aItem.uin == QZBlog.Logic.SpaceHostInfo.getLoginUin() ? '我' : strNickHref);
                }
                else 
                    if (aItem.uin == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
                        aNick = '我';
                    }
                    else {
                        aNick = strNickHref;
                    }
                aNick += '的回复： ';
                arrRevert.push('<div class="master_message tbor3' + (aItem.uin == QZBlog.Logic.SpaceHostInfo.getUin() ? ' c_tx4' : '') + '"><div class="master_message_cont"><strong class="who_message">' +
                aNick +
                QZBlog.Util.long2DateTime(aItem.time) +
                '</strong><div>' +
                ubbReplace(aItem.content.convSP().convCR(), "face", null, null, IMGCACHE_DOMAIN) +
                '</div></div><div class="message_op"><a style="display:' +
                (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && isValidUin(aItem.uin) ? "" : "none") +
                '" href="javascript:;" onclick="CommentManager.removeCommentReply(' +
                commentID +
                ',\'' +
                aItem.uin +
                '\',' +
                aItem.time +
                ');return false;" title="删除该回复"><img src="/ac/b.gif" class="icon_del" />删除</a></div></div>');
            }
            return arrRevert.join('');
        },
        _procCommentInfo: function(info, data){
            if (!info || !data) {
                return;
            }
            data.rainbowClass = "none";
            data.angelClass = "none";
            data.commentTime = QZBlog.Util.long2time(data.replytime);
            if (data.replyeffect & (1 << 24)) {
                data.replyContent = "看美女，找帅哥，来城市达人！（<a href='http://city.qzone.qq.com' target='_blank'>http://city.qzone.qq.com</a>）";
            }
            else {
                var replacew = "face egg quote qqshow" + ((QZBlog.Logic.SpaceHostInfo.isFamousUser() && !(info.getUserInfo().getUin() == QZBlog.Logic.SpaceHostInfo.getUin())) ? " imageHide" : " anchor image email glow_limit font");
                var str = data.replycontent.convHeaderSP();
                data.replyContent = ubbReplace(str.convSP().convCR(), replacew, null, null, IMGCACHE_DOMAIN);
            }
            if (data.replyeffect & (1 << 19)) {
                data.qzoneClass = "none";
                data.campusClass = "";
                data.replyArea = '<a target="_blank" href="http://xiaoyou.qq.com/index.php?mod=profile&u=' + info.getUserInfo().getUin() + '" class="guestname c_tx2">' + data.replynick + '</a>';
                data.replyautograph = '该评论来自QQ校友社区  <a href="http://xiaoyou.qq.com" target="_blank">xiaoyou.qq.com</a>';
                data.commentOPSpan = this._getCommentOperAreaHTML(info);
                if (info.getReplyInfo().length > 0) {
                    data.replyclass = "";
                    data.mixReplyContent = this._getMixReplyContent(info.getCommentID(), info.getReplyInfo());
                }
                else {
                    data.replyclass = "none";
                }
            }
            else {
                data.qzoneClass = "";
                data.campusClass = "none";
                this._parseQZoneCommentEffect(info, data);
                data.replyautograph = ubbReplace(data.replyautograph.convSP().convCR(), "face anchor image email sign glow_limit font", null, null, IMGCACHE_DOMAIN);
            }
            if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                data.famousClass = "blogger";
                data.famousPortraitClass = "none";
                data.commentTime = "评论时间: " + data.commentTime;
            }
            else {
                data.famousSpanClass = "none";
            }
            data.signatureStyle = (($("btnHideSign").innerHTML == "隐藏签名档") ? "" : "display:none;");
        }
    },
    "VisitorScheduler": {
        getRecentVisitor: function(){
            if (QZBlog.Logic.SpaceHostInfo.isVipUser()) {
                var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_readerlist?uin=" +
                QZBlog.Logic.SpaceHostInfo.getUin() +
                "&blogid=" +
                PageScheduler.curBlogInfo.getID() +
                "&r=" +
                Math.random();
                var netReq = new QZBlog.Util.BlogNetProcessor();
                netReq.create(url, "get", QZONE.event.bind(this, this._postProcRecentVisitor), QZONE.event.bind(this, this._postProcRecentVisitor), "GB2312", true, "_Callback");
                netReq.excute();
            }
            else {
                this._postProcRecentVisitor(null);
            }
        },
        _postProcRecentVisitor: function(data){
            if (data && !data.error) {
                data = data.data;
                PortraitManager.addPortraitCallback(QZONE.event.bind(this, this._showRecentVisitor, data.itemlist), PortraitManager.PORTRAIT_TYPE["QZONE"]);
                for (var i = 0; i < data.itemlist.length; ++i) {
                    if (data.itemlist[i].info != 1) {
                        PortraitManager.addUin(data.itemlist[i].uin, 0);
                    }
                }
            }
            if (!QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
                PortraitManager.loadPortrait();
            }
            QZBlog.Util.Statistic.addSpeedPoint(6);
            PageScheduler.NamecardScheduler.initCommentList();
        },
        _showRecentVisitor: function(listInfo){
            var info = PageScheduler.curBlogInfo.getRightInfo();
            if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode() && (info.getType() == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"])) {
                return;
            }
            var schoolUins = [];
            for (var i = 0; i < listInfo.length; ++i) {
                if (QZBlog.Logic.SpaceHostInfo.isOwnerMode() || QZBlog.Logic.SpaceHostInfo.getLoginUin() == listInfo[i].uin) {
                    listInfo[i].hideflagClass = "";
                }
                else {
                    listInfo[i].hideflagClass = "none";
                }
                if (listInfo[i].info != 1) {
                    var portraitInfo = PortraitManager.getPortraitInfo(listInfo[i].uin, PortraitManager.PORTRAIT_TYPE["QZONE"]);
                    if (!portraitInfo) {
                        listInfo[i].nickname = listInfo[i].nick;
                        listInfo[i].imgurl = parent.DEFAULT_USER_PORTRAIT;
                        listInfo[i].vipstyle = "display:none";
                    }
                    else {
                        listInfo[i].nickname = listInfo[i].nick;
                        listInfo[i].imgurl = portraitInfo[0];
                        listInfo[i].linkhref = QZBlog.Util.getSpaceUrl(listInfo[i].uin);
                        listInfo[i].imgPV = "portrait";
                        listInfo[i].textPV = "portrait";
                        if (portraitInfo[3] > 0 && portraitInfo[5]) {
                            listInfo[i].paraVipStyle = "vip_user";
                            listInfo[i].viplevel = portraitInfo[3];
                        }
                        else {
                            listInfo[i].vipclass = "none";
                        }
                    }
                }
                else {
                    listInfo[i].nickname = "校友用户";
                    listInfo[i].imgurl = "http://xy.store.qq.com/" + listInfo[i].uin + "0";
                    listInfo[i].linkhref = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + listInfo[i].uin;
                    listInfo[i].visitorNameHrefID = "visitorNameHref_" + listInfo[i].uin;
                    listInfo[i].imgPV = "campusportrait";
                    listInfo[i].textPV = "campususers";
                    if (!listInfo[i].hideflag) 
                        schoolUins.push(listInfo[i]);
                }
                if (listInfo[i].hideflag) {
                    listInfo[i].nickname = "匿名";
                    listInfo[i].clickEvt = "return&nbsp;false;";
                    listInfo[i].imgurl = DEFAULT_PORTRAIT_IMGURL;
                    listInfo[i].vipclass = "none";
                    listInfo[i].hideflagClass = "none";
                }
            }
            if (listInfo.length > 0 && !!$("visitorArea")) {
                $("visitorArea").style.display = "";
                $("visitorArea").innerHTML = doFill(parent.g_hsBlogTemplate["visitorList"], {
                    "data": listInfo.slice(0, 6)
                });
                if (listInfo.length > 6) {
                    $("recentVisitorCnt").innerHTML = listInfo.length;
                    $("showVisitorSpan").style.display = "";
                }
                if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                    $("visitorSettingSpan").style.display = "";
                }
                PageScheduler.NamecardScheduler.initRecentVisitor();
            }
            if (schoolUins.length > 0) {
                this._showCampusVisitorInfo(schoolUins);
            }
            PageScheduler.curBlogInfo.setRecentVisitorInfo(listInfo);
            QZBlog.Util.Statistic.addSpeedPoint(7);
            if (!parent.blogContentSpeedSended) {
                parent.blogContentSpeedSended = new Array();
            }
            parent.blogContentSpeedSended[PageScheduler.curBlogInfo.getID()] = true;
            if (!!parent.bcSpeedBasePoint) {
                QZBlog.Util.Statistic.sendSpeedStatistic(112, 1);
            }
        },
        _showCampusVisitorInfo: function(schoolUins){
            var strUins = "";
            for (var k = 0; k < schoolUins.length; ++k) {
                strUins += schoolUins[k].uin + "|";
            }
            strUins = strUins.substr(0, strUins.length - 1);
            setTimeout(function(){
                var url = "http://qzone.xiaoyou.qq.com/userinfo_json.php?qq=" + strUins;
                var portraitReq = new QZBlog.Util.BlogNetProcessor();
                portraitReq.create(url, "get", QZONE.event.bind(this, function(o){
                    if (!o || !o.data) {
                        return;
                    }
                    for (var index = 0; index < schoolUins.length; ++index) {
                        if (!o.data[schoolUins[index].uin]) {
                            continue;
                        }
                        if (!!$("visitorNameHref_" + schoolUins[index].uin)) {
                            $("visitorNameHref_" + schoolUins[index].uin).innerText = o.data[schoolUins[index].uin].realname;
                        }
                        schoolUins[index].nickname = o.data[schoolUins[index].uin].realname;
                    }
                }), QZONE.emptyFn, "UTF-8", true, "SchoolInfoCallback");
                portraitReq.excute();
            }, 1000);
        }
    },
    "NamecardScheduler": {
        loaded: false,
        loadScript: function(){
            var g_oJSLoader = new QZONE.jsLoader();
            g_oJSLoader.onload = QZONE.event.bind(this, function(){
                this.loaded = true;
            });
            g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + "/qzone/v5/namecard.js", document, "utf-8");
        },
        initContent: function(){
            if (!this._checkReady(this.initContent)) {
                return;
            }
            QZBlog.Util.TimerManager.setTimeout(function(){
                try {
                    QZONE.namecard.init($("contentAuthorHref").parentNode);
                    QZONE.namecard.init("blogDetailDiv");
                } 
                catch (err) {
                }
            }, 2000);
        },
        initCommentList: function(){
            if (!this._checkReady(this.initCommentList)) {
                return;
            }
            QZBlog.Util.TimerManager.setTimeout(function(){
                try {
                    QZONE.namecard.init("commentDiv");
                } 
                catch (err) {
                }
            }, 2000);
        },
        initRecentVisitor: function(){
            if (!this._checkReady(this.initRecentVisitor)) {
                return;
            }
            try {
                QZONE.namecard.init("visitorArea");
            } 
            catch (err) {
            }
        },
        _checkReady: function(callback){
            if (!this.loaded) {
                QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, callback), 100);
                return false;
            }
            return true;
        }
    }
};
var portraitTipsTimeout = null;
function showUserGradeTips(targetEle, score, grade){
    clearTimeout(portraitTipsTimeout);
    var html = '<span style="color:black">等级:</span><span style="color:red">' + score + '</span> <span style="color:black">积分:</span><span style="color:red">' + grade + '</span> <a href="http://qzone.qq.com/web/help/helpa01.shtml?url=http://qzone.qq.com/web/help/helpb16.htm" target="_blank" style="text-decoration:underline;color:blue">等级积分说明</a>';
    var offset = {
        w: 0,
        h: 25
    };
    var sT = getUserPortraitTipDiv();
    with (sT) {
        style.left = (QZONE.dom.getPosition(targetEle).left + offset.w) + "px";
        style.top = (QZONE.dom.getPosition(targetEle).top + offset.h) + "px";
        innerHTML = html;
        style.display = "";
    }
}

function showUserCampusTips(ele, html){
    clearTimeout(portraitTipsTimeout);
    var sT = getUserPortraitTipDiv();
    sT.style.left = QZONE.dom.getPosition(ele).left + QZONE.dom.getPosition(ele).width + 10;
    sT.style.top = QZONE.dom.getPosition(ele).top;
    sT.innerHTML = html;
    sT.style.display = "";
}

function getUserPortraitTipDiv(){
    var sT = $("sTitle");
    if (!sT) {
        sT = document.createElement("div");
        sT.id = "sTitle";
        sT.style.cssText = "position:absolute;border:solid 1px black;padding:2px;background-color:#FFC";
        document.body.appendChild(sT);
    }
    return sT;
}

function hideUserTips(){
    portraitTipsTimeout = setTimeout(function(){
        var sT = $("sTitle");
        if (!!sT) {
            sT.style.display = "none";
        }
    }, 2000);
}

function resizeImg(obj, imgID){
    obj = !!obj ? obj : $(imgID);
    if (!obj) 
        return;
    var img = new Image;
    img.onload = function(){
        this.onload = null;
        if (this.height > 100) {
            this.height = 100;
            this.width = this.width * Math.ceil(1000 * 100 / this.height) / 1000;
        }
        if (this.width > 100) {
            this.width = 100;
            this.height = this.height * Math.ceil(1000 * 100 / this.width) / 1000;
        }
        obj.width = this.width;
        obj.height = this.height;
    };
    img.onerror = function(){
        this.onerror = null;
        obj.src = parent.DEFAULT_USER_PORTRAIT;
    };
    img.src = obj.src;
}

QZONE.event.addEvent(window, "beforeunload", QZBlog.Logic.clearMusicPlayer);
function checkMsgReply(obj){
    if (obj.checked && (typeof(window.leftSMS) != "undefined")) {
        showLeftSMSHint(window.leftSMS);
    }
    var bDiabled = ((!obj.checked && $("propertySelect").selectedIndex != 1) ? false : true);
    $("propertySelect").disabled = !!obj.checked;
    $("normalUseSignCheck").disabled = bDiabled;
    $("noticeInfoCheckInput").disabled = bDiabled;
    CommentManager._updateSettingText();
    if (obj.checked) {
        MAX_COMMENT_LEN = 500;
        $("hintMsgSelfReply").innerHTML = '';
        $("msgReplyVerifyCode").innerHTML = ' | 请输入验证码： <input type="text" onblur="hiddenVerify()" onfocus="focusGetVerify(this)" id="verifycode_replysms" name="verifycode" class="verifycode text" autocomplete="off" maxlength="4" size="4" style="ime-mode:disabled;margin-right:10px;" />';
    }
    else {
        MAX_COMMENT_LEN = 4500;
        $("hintMsgSelfReply").innerHTML = " | (以小纸条形式发送) ";
        $("viewLeftCntHref").style.display = "";
        $("msgReplyVerifyCode").innerHTML = "";
    }
    if (CommentManager.commentEditor) 
        CommentManager.commentEditor.setMaxContentLength(MAX_COMMENT_LEN);
}

function showMsgLeftCnt(){
    if (window.leftSMS != undefined) {
        $("viewLeftCntHref").style.display = "none";
        showLeftSMSHint(window.leftSMS);
        return;
    }
    var url = "http://msg.qzone.qq.com/fcg-bin/fcg_get_daysndnum?uin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin();
    QZBlog.Util.showMsgbox("正在查询，请稍候...", 0);
    loadXMLAsync('GetLeftSMS', url, function(){
        var data = parent.g_XDoc["GetLeftSMS"];
        if (isXMLDoc(data) && XMLselectSingleNode(data, "/data")) {
            parent.QZONE.widget.msgbox.hide();
            var da = parseInt(getXMLNodeText(XMLselectSingleNode(data, "/data/dayalrsnd")), 10);
            var dc = parseInt(getXMLNodeText(XMLselectSingleNode(data, "/data/daycansnd")), 10);
            window.leftSMS = dc - da;
            showLeftSMSHint(window.leftSMS);
        }
        else {
            QZBlog.Util.DumpMsgFunc();
        }
        $("viewLeftCntHref").style.display = "none";
        delete top.g_XDoc["GetLeftSMS"];
    }, QZBlog.Util.DumpMsgFunc, true);
}

function showLeftSMSHint(left){
    if (!$("hintMsgSelfReply")) {
        return;
    }
    if (left > 0) {
        $("hintMsgSelfReply").innerHTML = ' | 您今日还能免费发送 <strong class="number">' + left + '</strong> 条小纸条';
    }
    else {
        $('hintMsgSelfReply').innerHTML = ' | 您今日免费小纸条次数已经用完，继续发送每条需要支付<strong class="number">0.2</strong>Q币';
    }
}

function doSendSMS(cost){
    if (!parent.cacheForAnonComment) {
        QZBlog.Util.showMsgbox("对不起，页面出现问题，请刷新重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        return;
    }
    if (cost) {
        window.cost = true;
    }
    var cacheData = parent.cacheForAnonComment;
    var url = "http://msg.qzone.qq.com/fcg-bin/fcgi_send_msg?";
    url += "verifycode=" + cacheData.verifycode + "&uin=" + QZBlog.Logic.SpaceHostInfo.getLoginUin() + "&touin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&title=" + cacheData.title + "&content=" + cacheData.content + "&backup=1&replycampus=0";
    var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", sendSMSSucc, function(data){
        QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
        verifyCounter[0].change();
    }, "GB2312", false);
    if (!netProcessor) {
        return;
    }
    netProcessor.excute();
}

function sendSMSSucc(data){
    if (window.cost) {
        parent.loadSeed(true);
        window.cost = void (0);
    }
    QZBlog.Util.showMsgbox("成功发送悄悄话", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    window.leftSMS = undefined;
    QZBlog.Util.TimerManager.setTimeout(showMsgLeftCnt, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
    if (!!parent.cacheForAnonComment) {
        CommentManager.commentEditor.clearContent();
        parent.cacheForAnonComment = void (0);
    }
    verifyCounter[0].change();
}

var verifyCounter = [];
function VerifyImage(eleID, o){
    var c = verifyCounter.length;
    this.timeout = null;
    this.ipt = null;
    if (!eleID) 
        this.eleID = eleID = "verifyIMG_" + c;
    if (!o) 
        this.baseObj = document.body;
    else 
        this.baseObj = o;
    this.od = document.createElement("div");
    with (this.od) {
        style.position = "absolute";
        style.backgroundColor = "#505050";
        style.border = "solid 1px #545454";
        style.padding = "3px";
        style.zIndex = 10;
        id = eleID + "_anchor";
    }
    this.templete = ('<img id="' + eleID + '" onclick="getVerify(\'' + eleID + '\',' + c + ')" style="cursor:pointer;margin-bottom:5px" src="http://ptlogin2.qq.com/getimage?aid=' + BLOG_VERIFY_CODE + '&sds={{_random_}}" alt="获取中..." title="点击更换" width="130" height="53" /><br /><span onclick="getVerify(\'' + eleID + '\',' + c + ')" style="color:white;cursor:pointer">看不清楚?换一个</span>');
    this.seed = Math.random();
    this.appended = false;
    verifyCounter[c] = this;
}

VerifyImage.prototype.showMe = function(x, y){
    with (this.od) {
        style.top = (y - 85) + "px";
        style.left = (x + 1) + "px";
    }
    if (!this.appended) {
        this.baseObj.appendChild(this.od);
        this.od.innerHTML = this.templete.replace(/\{\{_random_\}\}/g, this.seed);
        this.appended = true;
    }
    this.od.style.display = "";
};
VerifyImage.prototype.killMe = function(){
    this.od.style.display = "none";
};
VerifyImage.prototype.change = function(){
    var o = $(this.eleID);
    this.seed = Math.random();
    o.src = "http://ptlogin2.qq.com/getimage?aid=" + BLOG_VERIFY_CODE + "&sds=" + this.seed;
};
function getVerify(s, n){
    clearTimeout(verifyCounter[n].timeout);
    verifyCounter[n].change();
    if (verifyCounter[n].ipt) {
        verifyCounter[n].ipt.value = "";
        verifyCounter[n].ipt.focus();
    }
}

function focusGetVerify(o){
    var pos = QZONE.dom.getPosition(o);
    var e = (verifyCounter.length > 0) ? (verifyCounter[0]) : (new VerifyImage(false, $('mbody')));
    e.ipt = o;
    e.showMe(pos.left - 100, pos.top);
    o.value = "";
}

function hiddenVerify(isImme){
    if (!verifyCounter[0]) 
        return;
    if (!isImme) 
        verifyCounter[0].timeout = setTimeout(function(){
            verifyCounter[0].killMe()
        }, 200);
    else 
        verifyCounter[0].killMe();
}

function sendVIPPVStatistic(){
    setTimeout(function(){
        try {
            if (QZBlog.Logic.SpaceHostInfo.isVipUser() && QZBlog.Logic.SpaceHostInfo.getVipLevel() > 0) {
                QZBlog.Util.Statistic.sendPV('viewblog_level' + QZBlog.Logic.SpaceHostInfo.getVipLevel(), 'blogreader.qzone.qq.com');
            }
        } 
        catch (err) {
        }
    }, 5000);
}

function preProcRawData(rawData){
    if (rawData.data.blog_property) {
        QZBlog.Logic.setGlobalBlogRightInfo(rawData.data.blog_property);
    }
    rawData.data.content = "";
}

function init(){
    if ($("errType")) {
        var value = $("errType").getAttribute("value");
        if (value == "forbidden") {
            location.href = "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/board.html";
            return;
        }
        else 
            if (value == "login") {
                QZBlog.Util.showLoginBox("reload");
                return;
            }
    }
    if (typeof(g_oBlogData) == "undefined") {
        QZBlog.Util.assert(false, "error!!!");
        return;
    }
    preProcRawData(g_oBlogData);
    var blogInfo = new parent.BlogInfo();
    blogInfo.setCurCommentPage(1);
    if (!blogInfo.convertJsonObject(g_oBlogData.data)) {
        if (QZBlog.Runtime.DebugMode) {
            QZBlog.Log.doLog("content.js->init 无法初始化日志信息");
        }
        alert("无法获取日志全部信息，请刷新空间重试");
        return;
    }
    if (!parent.g_oBlogInfoMgr.addBlogInfo(blogInfo)) {
        if (QZBlog.Runtime.DebugMode) {
            QZBlog.Log.doLog("content.js->init 无法添加日志信息到缓存");
        }
        alert("无法获取日志全部信息，请刷新空间重试");
        return;
    }
    if (!!getParameter("blogseed")) {
        blogInfo.setRandomSeed(getParameter("blogseed"));
    }
    PageScheduler.curBlogInfo = blogInfo;
    PageScheduler.ContentScheduler.start();
    PageScheduler.CommentScheduler.start();
    QZBlog.Util.TimerManager.setTimeout(function(){
        PageScheduler.NamecardScheduler.loadScript();
    }, 2000);
    sendVIPPVStatistic();
}

var g_oJSLoader = new QZONE.jsLoader();
g_oJSLoader.onload = init;
g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/script/basic.js", parent.document, "utf-8");
QZBlog.Util.createTemplate();
try {
    var removeTopScrollEvt = function(){
        QZBlog.Util.TimerManager.clear();
        if (!!parent.blogScrollEvent) {
            parent.QZONE.event.removeEvent(parent.window, "scroll", parent.blogScrollEvent);
        }
    };
    if (QZONE.userAgent.ie) {
        document.body.onbeforeunload = removeTopScrollEvt;
    }
    else {
        window.onbeforeunload = removeTopScrollEvt;
    }
    $("pageContainer").className = (QZBlog.Util.isWideMode() ? "blog big_mode_blog" : (!QZBlog.Util.isSmallMode() ? "blog full_mode_blog" : "blog mini_mode_blog"));
} 
catch (err) {
}
parent.g_hsBlogTemplate['cpageIndexTemplate'] = '<div class="op_page"><span class="return_list"><span class="blog_tits"><a title="上一篇" href="javascript:;" onclick="ContentManager.turnPage(<%=curBlogID=%>, -1);QZBlog.Util.Statistic.sendPV(\'lastblog\', \'rizhi.qzone.qq.com\');return false;"><img src="/ac/b.gif" class="icon_preblog" />上一篇</a></span>&nbsp;&nbsp;<span class="blog_tits"><a title="下一篇" href="javascript:;" onclick="ContentManager.turnPage(<%=curBlogID=%>, 1);QZBlog.Util.Statistic.sendPV(\'nextblog\', \'rizhi.qzone.qq.com\');return false;"><img src="/ac/b.gif" class="icon_nextblog" />下一篇</a></span>&nbsp;&nbsp;<img src="/ac/b.gif" class="icon_backblog" /><a title="返回日志列表" href="javascript:;" onclick="ContentManager.turnToList();QZBlog.Util.Statistic.sendPV(\'returnlist\', \'rizhi.qzone.qq.com\');return false;">返回日志列表</a></span></div>';
parent.g_hsBlogTemplate['commentTemplate'] = '<div class="bg_mode"><div class="box_ml bor"><div class="mode_gb"><div class="mode_gb_title style_mode_gb_title" style="height:auto"><div class="bg_mode_gb_title"><h3><img src="/ac/b.gif" class="icon_title" />评论列表</h3><a class="wrap_tip" href="http://m-qzone.qq.com/option.jsp" target="_blank"><img src="/ac/b.gif" class="icon_tt_wap"/>想第一个看到日志抢沙发？</a></div></div><div class="mode_gb_cont"><div class="blog_comment_cont" id="commentDiv" style="display:none"><div class="hint-top" id="cheatHintArea" style="display:none"><img src="/ac/b.gif" class="icon_hint" /><span>腾讯公司温馨提示：当前已出现通过网络、电话和短信等途径假冒中奖网站、“400”“0898”开头电话、宣称低价购物、购房退税等手段诈骗，请您提高警惕，慎防遭骗。识别更多网络骗术，请点击：<a href="http://service.qq.com/info/4326.html" target="_blank">腾讯反骗术帮助中心。</a></span><a href="javascript:;" title="关闭提示" class="bt-hint-close" onclick="document.getElementById(\'cheatHintArea\').style.display=\'none\';if(parent.UserBlogConfig){parent.UserBlogConfig.setCheatHintFlag(true);}"></a></div><div class="quick_op bbor"><div id="topPageIndexArea"></div><div class="bts_op"><button type="button" class="bgr2 c_tx2" id="jumpEditorBtn" onclick="CommentManager.jumpCommmentEditor();QZBlog.Util.Statistic.sendPV(\'releasecomment_click\', \'rizhi.qzone.qq.com\');">发表评论</button></div><div id="topPageInfoArea" class="left" style="line-height:28px;"></div>     </div><div class="blogger_op" id="famousOperArea" style="display:none"><a id="noBatchDelComHref" style="display:none" href="javascript:;" onclick="CommentManager.showCommentCheckBoxs(false, false); return false;" class="right" title="取消批量删除评论">取消批量删除</a><a id="batchDelComHref" onclick="CommentManager.showCommentCheckBoxs(true, false); return false;" href="javascript:;" class="right" title="批量删除评论">批量删除</a><div id="leftDeleteComParag" style="display:none"><input type="checkbox" id="batchSelAllInput" onclick="CommentManager.selectAllComments(this.checked);" />全选<button class="bt_tx2 spl" onclick="CommentManager.deleteBatchComments();">删除</button></div></div><div class="blog_comment_main" id="commentListDiv"></div><div class="comment_page"><div class="right" style="margin-top:-12px;" id="bottomPageIndexArea"></div><div id="bottomPageInfoArea"></div></div></div><div class="bor guest_comment2"><div class="bg2 bbor guest_comment2_tit"><label class="<%=famousClass=%>" for="useSignCheck"><input type="checkbox" id="useSignCheck" name="useSignCheck" />使用签名档</label><label class="<%=famousClass=%>" for="anonymcheck" style="display:none"><input type="checkbox" name="anonymcheck" id="anonymcheck" />匿名评论</label><strong class="<%=normalClass=%>">发表评论</strong></div><div class="<%=allowCommentClass=%>" style="margin-top:5px;"><div class="hint"><img src="/ac/b.gif" alt="提示" class="icon_hint_advise" /><span>系统正在进行升级维护中,暂不支持日志评论,敬请谅解!</span></div></div><div class="<%=forbidCommentClass=%>"><div class="comment_edit2"><div id="commentEditorAnchor"></div><textarea class="bor2" rows="13" cols="50" id="commentEditor" onfocus="CommentManager.getUBBEditor();"></textarea></div><div class="insert_hint" id="comment_hint" style="display:none"><div class="hint"><img src="/ac/b.gif" alt="提示" class="icon_hint_advise" /><span>日志评论推出新<a href="javascript:;" onclick="CommentManager.showSetting();return false;">附加功能</a>！评论可以通知所有好友了。您还可以进行<a href="javascript:;" onclick="CommentManager.showNotifyICSetting();return false;">设置</a>，保护个人隐私。</span></div></div><div class="bg2 tool_box_tit <%=normalClass=%>"><strong><a href="javascript:;" title="展开附加功能" onclick="CommentManager.showSetting();return false;" id="_commentSettingHref" class="unline">附加功能</a></strong>&nbsp;<a href="javascript:;" id="_showCommentHref" onclick="CommentManager.showSetting();return false;"><img src="/ac/b.gif" class="bt_blog_show" alt="展开附加功能" /></a><a href="javascript:;" id="_hideCommentHref" title="收起附加功能" onclick="CommentManager.hideSetting();return false;" style="display:none"><img src="/ac/b.gif" class="bt_blog_side" alt="收起附加功能" /></a>&nbsp;&nbsp;<span id="selectedTextSpan"></span></div><div class="tool_box" style="display:none" id="moreCommentOptionDiv"><p class="tool_box_item"><label for="normalUseSignCheck"><input type="checkbox" id="normalUseSignCheck" name="normalUseSignCheck" />使用签名档</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tools">道具：<select id="propertySelect" name="propertySelect"><option selected="true">请选择道具</option><option value="cb_ysc">隐身草</option><option value="cb_chx">彩虹炫</option><option value="cb_tsza">天使之爱</option></select></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="msgboardSelfReply" style="display:none"><label for="msgReplyCheck"><input type="checkbox" id="msgReplyCheck" onclick="checkMsgReply(this);" /> 悄悄话</label> <span id="hintMsgSelfReply"> | (以小纸条形式发送) </span><span id="msgReplyVerifyCode"></span>&nbsp;&nbsp;<a id="viewLeftCntHref" href="javascript:;" onclick="showMsgLeftCnt();" style="text-decoration:underline;">查看今日免费发送数量</a></span></p><p class="<%=visitorClass=%> tool_box_item  <%=rightClass=%> dump <%=bizClass=%>"><label for="noticeInfoCheckInput"><input type="checkbox" id="noticeInfoCheckInput" class="<%=visitorClass=%> dump <%=normalClass=%> dump <%=rightClass=%> dump <%=bizClass=%>" />通知所有好友（该评论可显示在所有好友的好友动态里）</label><a href="javascript:;" onclick="CommentManager.showNotifyICSetting();return false;" class="unline">设置</a></p></div><div class="guest_comment2_bt"><a style="margin:5px 0 0 10px;display:none;text-decoration:underline;float:right;" id="registHrefEntry" href="http://dynamic.qzone.qq.com/cgi-bin/portal/cgi_select_activity" target="_blank">马上开通空间，体验权限日志、私密记事本等全新日志体验！</a><button type="button" class="bt_tx2" onclick="CommentManager.submitComment();">确定</button></div></div></div></div></div></div></div>';
parent.g_hsBlogTemplate['visitorList'] = '<legend class="c_tx4">本文最近访客</legend><div class="recent_visit"><div class="recent_visit_list visit_list_shrink" id="recentVisitorDiv"><ul><%repeat_0 match="/data"%><li onmouseover="QZONE.css.toggleClassName($(\'visitor_opr_<%=@uin%>\'), \'none\');" onmouseout="QZONE.css.toggleClassName($(\'visitor_opr_<%=@uin%>\'), \'none\');"><a href="<%=@linkhref%>" class="reader_url bor2 q_namecard" target="_blank" onclick="QZBlog.Util.Statistic.sendPV(\'<%=@imgPV%>\', \'blogreader.qzone.qq.com\');<%=@clickEvt%>" link="nameCard_<%=@uin%>" onmouseover="window.g_nReaderPVTimer=setTimeout(function(){QZBlog.Util.Statistic.sendPV(\'namecard\', \'blogreader.qzone.qq.com\');}, 1000);" onmouseout="clearTimeout(window.g_nReaderPVTimer);"><img src="<%=@imgurl%>" class="reader_pic" /></a><p class="<%=@paraVipStyle%>"><a href="<%=@linkhref%>" id="<%=@visitorNameHrefID%>" onclick="QZBlog.Util.Statistic.sendPV(\'<%=@textPV%>\', \'blogreader.qzone.qq.com\');<%=@clickEvt%>" onmouseover="window.g_nReaderPVTimer=setTimeout(function(){QZBlog.Util.Statistic.sendPV(\'namecard\', \'blogreader.qzone.qq.com\');}, 1000);" onmouseout="clearTimeout(window.g_nReaderPVTimer);" class="reader_name q_namecard" link="nameCard_<%=@uin%>" target="_blank"><%=@nickname%></a><a href="http://user.qzone.qq.com/<%=@uin%>/yellowgrade" target="_blank" class="vip_level <%=@vipclass%>"><img src="/ac/b.gif" class="icon_vip_yl<%=@viplevel%>" alt="黄钻等级LV<%=@viplevel%>" /></a></p><p class="visit_time c_tx3 none" title="<%=@visitTimeTitle%> 来访"><%=@visitTime%></p><div class="<%=@hideflagClass%>"><p class="hide_visited none" id="visitor_opr_<%=@uin%>"><a href="javascript:;" onclick="CommentManager.hideVisitor(\'<%=@uin%>\');return false;">隐藏</a></p></div></li><%_repeat_0%></ul></div><p class="recent_visit_operate"><span id="showVisitorSpan" style="display:none"><a href="javascript:;" onclick="CommentManager.toggleRecentVisitor(true);return false;" class="show">查看最近<strong id="recentVisitorCnt"></strong>位访客</a><img src="/ac/b.gif" class="bt_blog_show" alt="展开" /></span><span id="hideVisitorSpan" style="display:none"><a href="javascript:;" onclick="CommentManager.toggleRecentVisitor(false);return false;" title="收起">收起<img src="/ac/b.gif" class="bt_blog_side" alt="收起" /></a></span><span id="visitorSettingSpan" style="margin-left:18px;display:none"><a href="javascript:;" onclick="CommentManager.showVisitorSetting();return false;" title="最近访客设置">最近访客设置</a></span></p></div>';
parent.g_hsBlogTemplate['commentList'] = '<%repeat_0 match="/data"%><div class="blog_comment_list bgr2 <%=@famousClass%>" style="font-weight:200;font-size:12px;" id="singleCommentDiv<%=@replyid%>"><div class="blog_guest <%=@famousPortraitClass%>"><div class="info"><div class="level" style="display:none"><a href="javascript:;" id="yellowHref<%=@floornum%>" target="_blank" class="yellow_lv" title="点击查看黄钻特权详情" onclick="QZBlog.Logic.gotoVipInfo(\'<%=@replyuin%>\');return false;"><span>0</span></a></div><span class="rainbow <%=@rainbowClass%>"><span style="filter:progid:DXImageTransform.Microsoft.MaskFilter(Color=<%=@rainbowColor%>);" title="彩虹炫"><a href="http://user.qzone.qq.com/<%=@replyuin%>" target="_blank" class="guestname c_tx2 q_namecard" link="nameCard_<%=@replyuin%>" onclick="QZBlog.Util.Statistic.sendPV(\'guestname_comment\', \'rizhi.qzone.qq.com\');"><%=@replynick%></a></span></span><span class="<%=@notRainbowClass%> nor <%=@qzoneClass%>" id="replyArea<%=@floornum%>"><%=@replyArea%></span><span class="<%=@notRainbowClass%> nor <%=@campusClass%>" id="replyArea<%=@floornum%>"><%=@replyArea%></span><div class="grade" id="flowerDiv<%=@floornum%>"></div></div><div class="user_portrait"><a href="http://user.qzone.qq.com/<%=@replyuin%>" onclick="QZBlog.Util.Statistic.sendPV(\'guestportrait_comment\', \'rizhi.qzone.qq.com\');" target="_blank" class="q_namecard" link="nameCard_<%=@replyuin%>"><img id="imgUrl<%=@floornum%>" src="<%=@imgurl%>" /></a></div><div class="guest_op <%=@qzoneClass%>" style="<%=@operClass%>" id="commentOperArea<%=@floornum%>"><a href="javascript;" onclick="parent.showMsgSender(\'<%=@replyuin%>\');QZBlog.Util.Statistic.sendPV(\'zhitiao_comment\', \'rizhi.qzone.qq.com\');return false;" title="点击向该好友发送小纸条"><img src="/ac/b.gif" class="icon_message_add" /> 发纸条</a><a href="javascript;" onclick="parent.addFavorUin(\'<%=@replyuin%>\');QZBlog.Util.Statistic.sendPV(\'addfriend_comment\', \'rizhi.qzone.qq.com\');return false;" title="点击添加为好友"><img src="/ac/b.gif" class="icon_addfriend" /> 加好友</a><a href="javascript;" onclick="parent.sendSoloGift(\'<%=@replyuin%>\');QZBlog.Util.Statistic.sendPV(\'sendgift_comment\', \'rizhi.qzone.qq.com\');return false;" title="点击给好友送礼物"><img src="/ac/b.gif" class="icon_send_gift" /> 送礼物</a></div></div><div class="blog_comment_content bg"><div class="comment_info"><span class="comment_info_op" id="operArea<%=@floornum%>"><%=@commentOPSpan%></span> <input name="commentCheckBox" type="checkbox" style="display:none" value="<%=@replyid%>_<%=@replyarch%>_<%=@replyuin%>" /><%=@floornum%>楼 <a href="http://user.qzone.qq.com/<%=@replyuin%>" target="_blank" link="nameCard_<%=@replyuin%>" class="q_namecard comment_nick c_tx4 spr <%=@famousSpanClass%>"><%=@replynick%></a><img src="/ac/b.gif" alt="天使之爱" class="icon_angel <%=@angelClass%>" /><span class="c_tx3"><%=@commentTime%></span></div><div class="comment_cont bor"><table cellspacing="0" cellpadding="0" style="table-layout:fixed;width:100%"><tr><td><%=@replyContent%></td></tr></table><div id="masterComment<%=@replyid%>" class="<%=@replyclass%>" style="padding-top:5px;"><%=@mixReplyContent%></div><div id="mcEditor<%=@replyid%>" style="display:none;"></div></div><div class="sign_box"><div class="sign_cont" id="signatureDIV<%=@floornum%>" style="<%=@signatureStyle%>"><table cellspacing="0" cellpadding="0" style="table-layout:fixed;width:100%"><tr><td><%=@replyautograph%></td></tr></table></div></div></div></div><%_repeat_0%>';/*  |xGv00|d220dd2da549c559935835501d3a8b7d */
