
var EditorManager = {
    rightSettingResult: [],
    _setMode: function(mode){
        if (!!getParameter("focustag")) {
            mode = parent.BlogEditMode["ADVANCE"];
        }
        if (mode == parent.BlogEditMode["SIMPLE"]) {
            QZFL.editor.config.editorOptions.toolbarList = ["html_simple", "html_mini", "html_full", "text"];
        }
        PageScheduler.buildEditor();
        var _checkFunc = QZONE.event.bind(this, function(){
            if (!PageScheduler.editorObj || !PageScheduler.editorObj.bReadyState) {
                setTimeout(_checkFunc, 50);
                return;
            }
            if (mode == parent.BlogEditMode["SIMPLE"]) {
                $("switchModeHref").innerHTML = "切换到精简模式";
            }
            else 
                if (mode == parent.BlogEditMode["ADVANCE"]) {
                    $("switchModeHref").innerHTML = "切换到普通模式";
                }
            this.switchMode($("switchModeHref"));
        });
        _checkFunc();
    },
    switchMode: function(ele, bSaveFlag){
        if (!PageScheduler.editorObj || !PageScheduler.editorObj.bReadyState) {
            QZBlog.Util.showMsgbox("日志编辑器正在初始化，请稍候...", 1, QZBlog.Util.MSG_LIFTTIME.HIGH);
            return;
        }
        function succCallback(){
            var bSimpleMode = false;
            if (ele.innerHTML == "切换到精简模式") {
                ele.innerHTML = "切换到普通模式";
                bSimpleMode = true;
            }
            else {
                ele.innerHTML = "切换到精简模式";
                bSimpleMode = false;
            }
            if (!!bSimpleMode) {
                if (!PageScheduler.editorObj.isHTMLMode()) {
                    PageScheduler.editorObj.switchEditor("html");
                }
            }
            else {
                PageScheduler.showLetterPaperPanel();
            }
            PageScheduler.editorObj.switchToolbar(bSimpleMode ? "html_simple" : "html_mini");
            $("paperPanel").style.display = (bSimpleMode ? "none" : "");
            $("moreSettingDiv").style.display = (bSimpleMode ? "none" : "");
            if (!!bSimpleMode && !parent.QZONE.dataCenter.get("BlogEditModeHint_" + QZBlog.Logic.SpaceHostInfo.getLoginUin(), "soflash")) {
                parent.QZONE.dataCenter.save("BlogEditModeHint_" + QZBlog.Logic.SpaceHostInfo.getLoginUin(), 1, "soflash");
                $("editModeHint").style.display = "";
            }
        }
        if (!bSaveFlag) {
            succCallback();
            return;
        }
        var bSimpleMode = false;
        if (ele.innerHTML == "切换到精简模式") {
            bSimpleMode = true;
        }
        var param = "edittype=" + (bSimpleMode ? 2 : 1);
        QZBlog.Logic.setBlogSetting(param, function(){
            parent.g_oBlogSettingInfoMgr.setEditMode(QZBlog.Logic.SpaceHostInfo.getLoginUin(), (bSimpleMode ? parent.BlogEditMode["SIMPLE"] : parent.BlogEditMode["ADVANCE"]));
            succCallback();
        });
    },
    _selectLPFromePanel: function(dataIndex){
        if (!window.bPaperInterfaceLoaded) {
            QZBlog.Util.showMsgbox("正在响应您的请求，请稍候...", 0);
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this._selectLPFromePanel, dataIndex), 50);
            return;
        }
        QZBlog.Util.hideMsgbox();
        if (!window.oLetterPaperData || dataIndex < 0 || dataIndex >= window.oLetterPaperData.length) {
            return;
        }
        var paperData = window.oLetterPaperData[dataIndex];
        if (!paperData) {
            return;
        }
        if (QZBlog.Logic.SpaceHostInfo.getVipLevel() < 0) {
            QZBlog.Util.showMsgbox("正在获取您的黄钻等级信息，请稍候...", 0);
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this._selectLPFromePanel, dataIndex), 50);
            return;
        }
        QZBlog.Util.hideMsgbox();
        parent._tempQFCallback = QZONE.event.bind(this, this._changePaperletter);
        blogCallLetter(QZBlog.Logic.SpaceHostInfo.getUin(), QZBlog.Logic.SpaceHostInfo.isVipUser(), QZBlog.Logic.SpaceHostInfo.getVipLevel(), paperData.type, paperData.id, paperData.style);
    },
    _checkVoteLegality: function(){
        if (PageScheduler.getState() == 2 || PageScheduler.getState() == 3) {
            return true;
        }
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        for (var index = 0; index < arrInput.length; ++index) {
            if (arrInput[index].value.trim().length == 0) {
                arrInput[index].parentNode.parentNode.removeChild(arrInput[index].parentNode);
                return this._checkVoteLegality();
            }
        }
        if (arrInput.length < 2) {
            for (var index = 0; index < Math.abs(arrInput.length - 2); ++index) {
                this.addVoteOption();
            }
            alert("对不起, 投票选项最少需要两个");
            return false;
        }
        for (var index = 0; index < arrInput.length; ++index) {
            var optionLen = arrInput[index].value.trim().getRealLength();
            if (optionLen < parent.MIN_VOTE_OPTION_LENGTH || optionLen > parent.MAX_VOTE_OPTION_LENGTH) {
                alert("对不起,每个投票选项的长度最少需要2个字符，最多100个字符");
                arrInput[index].select();
                return false;
            }
        }
        return true;
    },
    _checkTitleLegality: function(){
        var title = $("titleInput").value.trim("R");
        if (title.trim("L").length == 0) {
            alert("您还没有书写日志标题");
            $("titleInput").focus();
            return false;
        }
        if (title.getRealLength() > MAX_BLOG_TITLE_LEN) {
            alert("您输入的标题长度超出限制");
            $("titleInput").focus();
            return false;
        }
        return true;
    },
    _checkContentLegality: function(){
        if (!PageScheduler.editorObj) {
            alert("初始化日志编辑器失败，请刷新空间重试");
            return false;
        }
        var editor = PageScheduler.editorObj;
        var content = editor.getContent();
        if (content.ltrim().length == 0 || !editor.isEdited()) {
            alert("您还没有书写任何日志正文内容");
            editor.focus();
            return false;
        }
        if (content.getRealLength() > MAX_BLOG_LEN) {
            alert("您输入的日志正文长度超出限制");
            editor.getCurrentEditor().focus();
            return false;
        }
        return true;
    },
    _checkBlogRightLegality: function(){
        if (this.rightSettingResult.rightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
            if (this.rightSettingResult.length == 0) {
                alert("您还没选择该篇日志对哪些好友可见");
                if (window.bPreviewState) {
                    this.cancelPreview();
                }
                return false;
            }
        }
        return true;
    },
    _checkBlogLegality: function(bPreview){
        if (!this._checkTitleLegality()) {
            return false;
        }
        if (!this._checkContentLegality()) {
            return false;
        }
        if ($("voteCheckInput").checked && !bPreview && !this._checkVoteLegality()) {
            return false;
        }
        if (!bPreview && !this._checkBlogRightLegality()) {
            return false;
        }
        return true;
    },
    _getRightSettingParams: function(){
        var strData = "";
        if (this.rightSettingResult.rightType == parent.BlogRightInfo.RIGHTTYPE["FRIEND"]) {
            strData += "rc=1&rg=2";
            strData += "&is_ic=" + ($("noticeInfoCheckInput").checked ? "1" : "0");
        }
        else 
            if (this.rightSettingResult.rightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
                for (var index = 0; index < this.rightSettingResult.length; ++index) {
                    strData += "&rc=128&rg=" + this.rightSettingResult[index].data;
                }
                strData = strData.substr(1);
                strData += "&is_tip=0";
            }
            else {
                strData += "needfeed=" + ($("updateFeedCheckInput").checked ? "1" : "0");
            }
        return strData;
    },
    _getTagStringParams: function(){
        var tags = $("tagInput").value.trim();
        if (!!$("tagInput").focused && tags.trim().getRealLength() > 0) {
            tags = tags.replace(/(\s|,|;|\||\\|，|；|、)+/gi, "|");
            return QZONE.lang.uniqueArray(tags.split("|")).splice(0, 5).join("|");
        }
        return "";
    },
    _getBlogParams: function(bModifyFlag, verifycode){
        var content = PageScheduler.editorObj.getContent();
        var strHTML = PageScheduler.editorObj.getConvertedHTMLContent();
        if (!PageScheduler.editorObj.isEdited()) {
            content = "";
            strHTML = "";
        }
        if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
            content = content.replace(/(\[url=https?:\/\/anchor[^\s^#]+[$|\/|\\]\])(#)(\[\/url\])/gi, function(){
                return arguments[1] + arguments[3];
            });
        }
        var category = ($("voteCheckInput").checked ? parent.BLOG_VOTE_CATENAME : $("blogCateSelect").value.trim());
        var title = $("titleInput").value.trim("R");
        var ppFlag = false;
        if (/\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})(,.*?|)\]http:\/\/[^\s]*photo.store.qq.com\/[^\[]*\[\/qqshow\]/ig.test(content)) {
            ppFlag = true;
        }
        category = encodeURIComponent(category);
        title = encodeURIComponent(title);
        content = encodeURIComponent(content);
        var data = ["uin=" + QZBlog.Logic.SpaceHostInfo.getUin(), "category=" + category, "title=" + title, "content=" + content];
        if (strHTML.length > 0) {
            data.push("html=" + encodeURIComponent(strHTML));
        }
        if (bModifyFlag || PageScheduler.getState() == 2 || PageScheduler.getState() == 3) {
            data.push("blogid=" + PageScheduler.blogInfo.getID());
            if (PageScheduler.blogInfo.getVoteInfo()) {
                data.push("r=s");
            }
        }
        else {
            if ($("voteCheckInput").checked) {
                var arrInput = $("voteOptionArea").getElementsByTagName("input");
                var arrContent = [];
                var tmpValue = "";
                for (var index = 0; index < arrInput.length; ++index) {
                    tmpValue = arrInput[index].value.trim("R");
                    arrContent.push("vtitle=" + encodeURIComponent(tmpValue));
                }
                data.push(arrContent.join("&"));
                data.push("day=" + $("voteTimeSelect").value);
                if ($("multiVoteCheck").checked) {
                    data.push("cb_multi=1");
                }
            }
        }
        if ($("quoteCheck").checked) {
            data.push("forbidquote=1");
        }
        if ($("signatureCheck").checked) {
            data.push("cb_autograph=1");
        }
        if ($("highLightCheck").checked && !$("highLightCheck").disabled) {
            data.push("cb_xmd=1");
        }
        data.push("topflag=" + ($("setTopCheck").checked ? 1 : 0));
        var strRightUrl = this._getRightSettingParams();
        if (strRightUrl.length > 0) {
            data.push(strRightUrl);
        }
        var oData = PageScheduler.editorObj.getPaperLetterData();
        if (!!oData.style && !!oData.id) {
            data.push("lp_id=" + oData.id);
            data.push("lp_style=" + oData.style);
        }
        if (ppFlag) {
            data.push("pp=1");
        }
        var tagData = this._getTagStringParams();
        if (tagData.length > 0) {
            data.push("tags=" + tagData.URLencode());
        }
        if (PageScheduler.draftid > 0) {
            data.push("draftid=" + PageScheduler.draftid);
        }
        if (!!verifycode) {
            data.push("verifycode=" + verifycode);
        }
        return data;
    },
    _postProcSubmitBlog: function(data){
        var msg = data.tip;
        if (!!msg) {
            QZBlog.Util.showMsgbox(msg, 0, QZBlog.Util.MSG_LIFTTIME.HIGH);
        }
        if (PageScheduler.getState() == 4 || PageScheduler.getState() == 5) {
            parent.g_oCateInfoMgr.setDraftCount(parent.g_oCateInfoMgr.getDraftCount() - 1);
            parent.g_oDraftListInfoMgr.clear();
            parent.g_oBlogInfoMgr.removeBlogInfo(PageScheduler.draftid);
        }
        if (PageScheduler.blogid >= 0) {
            parent.g_oBlogInfoMgr.removeBlogInfo(PageScheduler.blogid);
        }
        QZBlog.Logic.refreshTopData();
        parent.g_oCateInfoMgr.clear();
        parent.BlogListNavigator.clear();
        parent.BlogListNavigator.removePageData();
        DraftLogicManager.setManualDraftState(false);
        DraftLogicManager.setAutoDraftID(-1);
        var bid = parseInt(data.blogid, 10);
        if (bid >= 0) {
            if (!QZBlog.Logic.SpaceHostInfo.isFamousUser() && (PageScheduler.getState() == 1 || PageScheduler.getState() == 4 || PageScheduler.getState() == 6)) {
                if (!parent.g_XDoc) {
                    parent.g_XDoc = {};
                }
                parent.g_XDoc["blogSubmit"] = data;
                setTimeout('location.href="' + IMGCACHE_BLOG_V5_PATH + '/success.html";QZBlog.Util.jumpTop();', 500);
            }
            else {
                setTimeout('location.href="' + QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), bid, Math.random()) + '";QZBlog.Util.jumpTop();', 500);
            }
        }
    },
    doSubmitBlog: function(verifycode, bModifyFlag, plusParams){
        var data = this._getBlogParams(bModifyFlag, verifycode);
        if (plusParams) {
            data.push(plusParams);
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH;
        if (bModifyFlag || PageScheduler.getState() == 2 || PageScheduler.getState() == 3) {
            url += "/blog_modify";
        }
        else {
            if ($("voteCheckInput").checked) {
                url += "/blog_add_vote";
            }
            else {
                url += "/blog_add";
            }
        }
        url += "?" + data.join("&");
        DraftLogicManager.stopAutoSaveDraft();
        this._bSubmittingFlag = true;
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", QZONE.event.bind(this, this._postProcSubmitBlog), (function(mgr){
            return function(){
                clearTimeout(mgr._nSubmittingTimer);
                mgr._bSubmittingFlag = false;
                DraftLogicManager.startAutoSaveDraft();
            }
        })(this), "GB2312", false);
        netProcessor.setPostType("JSON");
        netProcessor.verifyHandler = QZONE.event.bind(this, function(verify){
            this._bSubmittingFlag = false;
            this.doSubmitBlog(verify, bModifyFlag, plusParams);
        });
        netProcessor.loginHandler = QZONE.event.bind(this, function(){
            this._bSubmittingFlag = false;
            blogLoginFnList.splice(0, blogLoginFnList.length);
            blogLoginFnList.push(QZONE.event.bind(this, this.doSubmitBlog, null, bModifyFlag, plusParams));
            QZBlog.Util.showLoginBox("ownerOperation");
        });
        netProcessor.confirmHandler = QZONE.event.bind(this, function(msg){
            this._bSubmittingFlag = false;
            if (!!confirm(msg)) {
                this.doSubmitBlog(verify, bModifyFlag, "confirm=1");
            }
        });
        netProcessor.excute();
        this._nSubmittingTimer = setTimeout(QZONE.event.bind(this, function(){
            this._bSubmittingFlag = false;
        }), 5000);
    },
    switchToRTEMode: function(){
        var _tb = PageScheduler.editorObj.getCurrentToolbar();
        var _btn = _tb.getButton('goback');
        if (_btn) {
            _btn.execute();
            return true;
        }
        return false;
    },
    submitBlog: function(){
        if (!ua.ie) 
            EditorManager.switchToRTEMode();
        if (!this._checkBlogLegality()) {
            return false;
        }
        var nLen = PageScheduler.editorObj.getConvertedHTMLContent().getRealLength();
        if (nLen > MAX_BLOG_HTML_LEN) {
            alert("您输入的日志正文长度超出" + (nLen - MAX_BLOG_HTML_LEN) + "字节");
            PageScheduler.editorObj.getCurrentEditor().focus();
            return false;
        }
        if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            QZBlog.Util.showMsgbox("您无权在他人空间里发表日志", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return false;
        }
        if (this._bSubmittingFlag) {
            return false;
        }
        if (PageScheduler.getState() == 5 || PageScheduler.getState() == 7) {
            this._showDraftConfirmDlg();
        }
        else {
            this.doSubmitBlog();
        }
        return true;
    },
    _postProcSaveDraft: function(data){
        if (window.tmpDraftInfo) {
            DraftLogicManager.startAutoSaveDraft();
            if (window.tmpDraftInfo.getDraftID() <= 0) {
                parent.g_oCateInfoMgr.setDraftCount(parent.g_oCateInfoMgr.getDraftCount() + 1);
                window.tmpDraftInfo.setPubTime(data.pubtime);
                window.tmpDraftInfo.setEffect(data.effect);
                window.tmpDraftInfo.setDraftID(data.draftid);
                PageScheduler.draftid = data.draftid;
                if (parent.g_oBlogInfoMgr.getBlogInfo(PageScheduler.blogid)) {
                    parent.g_oBlogInfoMgr.getBlogInfo(PageScheduler.blogid).setDraftID(PageScheduler.draftid);
                }
            }
            parent.g_oDraftListInfoMgr.clear();
            parent.g_oBlogInfoMgr.removeBlogInfo(PageScheduler.draftid);
            DraftLogicManager.setManualDraftState(false);
            var draftInfo = parent.g_oDraftListInfoMgr.getDraftInfo(PageScheduler.draftid);
            if (draftInfo) {
                draftInfo.updateRandomSeed();
            }
            $("draftSavedTip").innerHTML = QZBlog.Util.long2LongTime(new Date().getTime() / 1000) + " 保存草稿成功";
            PageScheduler.updateDraftArea();
        }
        else {
            DraftLogicManager.setAutoDraftID(1);
            $("draftSavedTip").innerHTML = QZBlog.Util.long2LongTime(new Date().getTime() / 1000) + " 自动保存草稿成功";
        }
        $("draftSavedTip").style.display = "";
    },
    doSaveDraft: function(bSaveType){
        if (!bSaveType && !QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            QZBlog.Util.showLoginBox("ownerOperation");
            return false;
        }
        if (!bSaveType) {
            if (PageScheduler.getState() != 2 && PageScheduler.getState() != 3) {
                if ($("voteCheckInput").checked && !this._checkVoteLegality()) {
                    return false;
                }
            }
            if (!this._checkTitleLegality()) {
                return false;
            }
            if (!this._checkContentLegality()) {
                return false;
            }
            if (!this._checkBlogRightLegality()) {
                return false;
            }
        }
        var data = this._getBlogParams();
        var nLen = PageScheduler.editorObj.getConvertedHTMLContent().getRealLength();
        if (!bSaveType && nLen > MAX_BLOG_HTML_LEN) {
            alert("您输入的正文长度超出" + (nLen - MAX_BLOG_HTML_LEN) + "字节");
            PageScheduler.editorObj.getCurrentEditor().focus();
            return false;
        }
        var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(PageScheduler.blogid);
        if (blogInfo && blogInfo.getVoteID() != -1) {
            data.push("voteids=" + blogInfo.getVoteID());
        }
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_DRAFT_PATH + "/" + (!bSaveType ? "draft_set_manual_data" : "draft_set_auto_data");
        url += "?" + data.join("&");
        var netProcessor = (!bSaveType ? QZBlog.Util.NetProcessor : new QZBlog.Util.BlogNetProcessor());
        netProcessor.create(url, "post", QZONE.event.bind(this, this._postProcSaveDraft), QZONE.emptyFn, "GB2312", (bSaveType ? true : false));
        if (!bSaveType) {
            netProcessor.alertHandler = function(data){
                alert(getXMLNodeText(XMLselectSingleNode(data, "/error")));
            };
            netProcessor.loginHandler = function(){
                QZBlog.Util.showLoginBox("ownerOperation");
            };
            window.tmpDraftInfo = new parent.BlogInfo();
            window.tmpDraftInfo.setDraftID(PageScheduler.draftid);
            window.tmpDraftInfo.setID(PageScheduler.blogid);
            window.tmpDraftInfo.setTitle($("titleInput").value.trim("R"));
            window.tmpDraftInfo.setCateName(($("voteCheckInput").checked ? parent.BLOG_VOTE_CATENAME : $("blogCateSelect").value.trim()));
            window.tmpDraftInfo.setType(parent.BLOGTYPE.DRAFT);
        }
        else {
            window.tmpDraftInfo = null;
        }
        netProcessor.setPostType("JSON");
        netProcessor.excute();
        return true;
    },
    manualSaveDraft: function(){
        if (!ua.ie) 
            EditorManager.switchToRTEMode();
        var nLen = PageScheduler.editorObj.getConvertedHTMLContent().getRealLength();
        if (nLen > MAX_BLOG_HTML_LEN) {
            alert("您输入的日志正文长度超出" + (nLen - MAX_BLOG_HTML_LEN) + "字节");
            PageScheduler.editorObj.getCurrentEditor().focus();
            return;
        }
        if (parent.g_oCateInfoMgr.getDraftCount() >= parent.MAX_DRAFT_CNT && PageScheduler.draftid <= 0) {
            alert("您的草稿箱已满，无法保存草稿!");
            return;
        }
        if (PageScheduler.draftid > 0 && !!DraftLogicManager._bFirstManualSaved) {
            if (!confirm("保存当前编辑内容将覆盖该篇日志对应的草稿？")) {
                return;
            }
        }
        DraftLogicManager._bFirstManualSaved = false;
        if (!this.doSaveDraft(0)) {
            return false;
        }
        $("saveDraftButton").disabled = true;
        $("loadDraftButton").disabled = true;
        setTimeout(function(){
            $("saveDraftButton").disabled = false;
            if (parent.g_oCateInfoMgr.getDraftCount() > 0) {
                $("loadDraftButton").disabled = false;
            }
        }, 5000);
        return true;
    },
    loadManualDraftData: function(){
        QZBlog.Util.popupDialog('读取草稿', '<iframe frameborder="no" id="draftListFrame" style="width:100%;height:285px;" src="' + IMGCACHE_BLOG_V5_PATH + '/draft_list_dlg.html' + (PageScheduler.draftid > 0 ? ('?draftid=' + PageScheduler.draftid) : '') + '"></iframe>', 467, 313);
    },
    cancelPreview: function(){
        $("pageContainer").style.display = "";
        $("previewDiv").style.display = "none";
        var oData = PageScheduler.editorObj.getPaperLetterData();
        if (!!oData.style && !!oData.id) {
            PageScheduler.editorObj.showDefinePanel(parent.g_hsBlogTemplate['paperTemplate'], 25);
        }
        else 
            if (PageScheduler.blogInfo && PageScheduler.blogInfo.getPaperLetterInfo()) {
                PageScheduler.editorObj.showDefinePanel(parent.g_hsBlogTemplate['restorePaperTemplate'], 25);
            }
        if ($("paperEditorPanel")) 
            $("paperEditorPanel").style.display = "";
        QZBlog.Logic.clearMusicPlayer();
        QZBlog.Util.jumpTop();
        window.bPreviewState = false;
    },
    previewBlog: function(){
        if (!ua.ie) {
            if (EditorManager.switchToRTEMode()) {
                setTimeout(function(){
                    EditorManager.previewBlog();
                }, 100);
                return;
            }
        }
        if (!this._checkBlogLegality(true)) {
            return;
        }
        QZBlog.Util.showMsgbox("正在生成日志预览，请稍候...", 0);
        this._doPreviewBlog();
    },
    _doPreviewBlog: function(data){
        var content = "";
        if (!!data && XMLselectSingleNode(data, "/succ")) {
            content = getXMLNodeText(XMLselectSingleNode(data, "/succ"));
        }
        else {
            content = PageScheduler.editorObj.getConvertedHTMLContent();
        }
        var oPaperLetterInfo = null;
        var oPaperData = PageScheduler.editorObj.getPaperLetterData();
        if (!!oPaperData.style && !!oPaperData.id) {
            oPaperLetterInfo = new parent.PaperLetterInfo(oPaperData.id, oPaperData.style);
        }
        var data = {
            "cate": $("voteCheckInput").checked ? parent.BLOG_VOTE_CATENAME : $("blogCateSelect").value.trim().toInnerHTML(),
            "title": $("titleInput").value.trim("R").toInnerHTML(),
            "time": QZBlog.Util.long2time(new Date().getTime() / 1000),
            "publishText": "发表于",
            "nickname": QZBlog.Logic.SpaceHostInfo.getNickname().toInnerHTML(),
            "sign": "",
            "content": content,
            "titleColor": (oPaperLetterInfo ? oPaperLetterInfo.getTitleColor() : "000000"),
            "titleFace": (oPaperLetterInfo ? oPaperLetterInfo.getTitleFont() : "宋体")
        };
        if (PageScheduler.blogInfo && PageScheduler.blogInfo.getEffectBit(3)) {
            data.publishText = "转载于";
            data.time = QZBlog.Util.long2time(PageScheduler.blogInfo.getPubTime());
        }
        if (!$("signatureCheck").checked) {
            data.signClass = "none";
        }
        if (this.rightSettingResult.rightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
            var arr = [];
            for (var index = 0; index < this.rightSettingResult.length; ++index) {
                arr.push((this.rightSettingResult[index].label + "").toInnerHTML() + '(' + this.rightSettingResult[index].data + ')');
            }
            data.rightTip = arr.join("、");
            data.rightText = "权限：指定好友可见";
        }
        else 
            if (this.rightSettingResult.rightType == parent.BlogRightInfo.RIGHTTYPE["FRIEND"]) {
                data.rightText = data.rightTips = "权限：QQ好友可见";
            }
            else {
                data.rightText = data.rightTips = "权限：公开";
            }
        var tags = $("tagInput").value.trim();
        tags = tags.replace(/(\s|,|;|\||\\|，|；|、)+/gi, "|");
        if (tags.getRealLength() > 0 && !!$("tagInput").focused) {
            data.tagClass = "";
            var arr = tags.split("|");
            data.tag = "";
            arr = QZONE.lang.uniqueArray(arr);
            for (var index = 0; index < arr.length && index < 5; ++index) {
                data.tag += '<a href="javascript:" onclick="QZBlog.Logic.searchTag(\'' + arr[index].toInnerHTML() + '\');return false;" class="uline" title="在QZONE空间搜索该搜索词">' + arr[index].toInnerHTML() + '</a>&nbsp;&nbsp;';
            }
        }
        else {
            data.tagClass = "none";
        }
        $("previewDiv").innerHTML = doFill(parent.g_hsBlogTemplate["previewTemplate"], {
            "data": data
        });
        $("blogDetailDiv").style.fontSize = fontSizeMap[_defaultFontSize];
        $("pageContainer").style.display = "none";
        $("previewDiv").style.display = "";
        QZBlog.Logic.procBlogContent(!!oPaperLetterInfo);
        QZBlog.Util.TimerManager.setTimeout(QZBlog.Logic.initMusicPlayer, 3000);
        if (PageScheduler.blogInfo && PageScheduler.blogInfo.getEffectBit(32)) {
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
        if ($("signatureCheck").checked) {
            (function _showSignature(){
                if (QZBlog.Logic.SpaceHostInfo.getSignature() == null) {
                    QZBlog.Util.TimerManager.setTimeout(_showSignature, 100);
                    return;
                }
                if (!!$("signatureDiv")) {
                    $("signatureDiv").innerHTML = ubbReplace(QZBlog.Logic.SpaceHostInfo.getSignature().convSP().convCR(), "face anchor image email sign glow_limit font", null, null, IMGCACHE_DOMAIN);
                    if (QZBlog.Logic.SpaceHostInfo.getSignature().trim().length == 0) {
                        $("signatureDiv").parentNode.style.display = "none";
                    }
                }
            })();
        }
        if (PageScheduler.getState() > 3) {
            $("preview_topBar").innerHTML = "预览草稿";
        }
        try {
            $("previewDiv").className = (QZBlog.Util.isWideMode() ? "blog big_mode_blog" : (!QZBlog.Util.isSmallMode() ? "blog full_mode_blog" : "blog mini_mode_blog"));
        } 
        catch (err) {
        }
        QZONE.css.removeClassName($("veryTitle").parentNode, "has_paper");
        if (oPaperLetterInfo) {
            if (!!oPaperLetterInfo.getStyle() && !!oPaperLetterInfo.getID()) {
                $("paperHidePreview").style.display = "";
                QZBlog.Util.PaperLetterManager.doPaint(oPaperLetterInfo, $("titleInput").value.trim("R").toInnerHTML());
                QZONE.css.addClassName($("veryTitle").parentNode, "has_paper");
                PageScheduler.editorObj.hideDefinePanel();
            }
            else {
                if ($("paperEditorPanel")) 
                    $("paperEditorPanel").style.display = "none";
                $("paperTitleArea").style.display = "none";
                $("paperPicArea0").style.display = "none";
                $("paperPicArea").style.display = "none";
            }
        }
        QZBlog.Util.hideMsgbox();
        window.bPreviewState = true;
        NamecardScheduler.init($("veryContent"));
        NamecardScheduler.loadScript();
        QZBlog.Util.Statistic.sendPV("previewblog", "blogtest.qzone.qq.com");
    },
    _showDraftConfirmDlg: function(){
        var strHTML = $("submitDraftTemplate").innerHTML.replace(/<=%voteClass%=>/gi, "");
        QZBlog.Util.popupDialog('温馨提示', strHTML, 360, 120);
    },
    checkVoteInput: function(){
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        if (arrInput.length == 0) {
            var strHTML = parent.g_hsBlogTemplate["voteOptionTemplate"];
            strHTML = strHTML.replace(/%=value=%/gi, "");
            $("voteOptionArea").innerHTML = strHTML.replace(/%=index=%/gi, Math.random()) + strHTML.replace(/%=index=%/gi, Math.random());
        }
        $("voteArea").style.display = ($("voteCheckInput").checked ? "" : "none");
        $("multiVoteCheck").parentNode.style.display = ($("voteCheckInput").checked ? "" : "none");
        $("voteCateDiv").style.display = ($("voteCheckInput").checked ? "" : "none");
        $("categoryDiv").style.display = ($("voteCheckInput").checked ? "none" : "");
    },
    addVoteOption: function(value){
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        if (arrInput.length == 10) {
            alert("对不起, 您最多只能添加到10个投票选项");
            return;
        }
        if (!value) {
            value = "";
        }
        var strHTML = "";
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        var arrContent = [];
        for (var index = 0; index < arrInput.length; ++index) {
            strHTML += parent.g_hsBlogTemplate["voteOptionTemplate"].replace(/%=value=%/gi, arrInput[index].value).replace(/%=index=%/gi, Math.random());
        }
        var rand = Math.random();
        $("voteOptionArea").innerHTML = strHTML + parent.g_hsBlogTemplate["voteOptionTemplate"].replace(/%=value=%/gi, value).replace(/%=index=%/gi, rand);
        if ($("voteArea").style.display != "none" && !!$("voteOption" + rand)) {
            setTimeout(function(){
                $("voteOption" + rand).focus();
            }, 0);
        }
        DraftLogicManager.draftStateTrigger();
    },
    delVoteOption: function(optionIndex){
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        if (arrInput.length == 2) {
            alert("对不起, 投票选项最少需要两个");
            return;
        }
        $("voteOption" + optionIndex).parentNode.parentNode.removeChild($("voteOption" + optionIndex).parentNode);
        DraftLogicManager.draftStateTrigger();
    },
    openRightSettingDlg: function(specuins){
        parent.blogPopupCallback = QZONE.event.bind(this, function(right, result){
            if (!right || !result) {
                return;
            }
            PageScheduler.fillRightArea(result);
            this.rightSettingResult = result;
            this.rightSettingResult.rightType = right;
            DraftLogicManager.draftStateTrigger();
        });
        if (!specuins) 
            specuins = "";
        QZBlog.Util.popupDialog('选择指定好友(最多可以指定5个)', '<iframe frameborder="no" id="blogRightSettingFrame" scrolling=no style="width:100%;height:100%" src="' + IMGCACHE_BLOG_V5_PATH + '/right_setting_dlg.html?specuins=' + specuins + '&onlyselect=1"></iframe>', 442, 406);
    },
    showAllSetting: function(bNoStatisticFlag){
        $("setTopCheck").parentNode.style.display = "";
        $("quoteCheck").parentNode.style.display = "";
        $("rightSettingDiv").style.display = "";
        $("showAllSettingHref").style.display = "none";
        $("hideAllSettingHref").style.display = "";
        if (!bNoStatisticFlag) {
            QZBlog.Util.Statistic.sendPV("show＿allset", "rizhi.qzone.qq.com");
        }
    },
    hideAllSetting: function(){
        $("setTopCheck").parentNode.style.display = "none";
        $("quoteCheck").parentNode.style.display = "none";
        $("rightSettingDiv").style.display = "none";
        $("showAllSettingHref").style.display = "";
        $("hideAllSettingHref").style.display = "none";
        QZBlog.Util.Statistic.sendPV("hide＿allset", "rizhi.qzone.qq.com");
    },
    selectRight: function(nRightType, bNotTrigDraft){
        this.rightSettingResult.rightType = nRightType;
        var bEditBlogState = (PageScheduler.getState() == 2 || PageScheduler.getState() == 3);
        if (bEditBlogState) {
            $("disgustRightTipSpan").style.display = "";
        }
        if (!!bNotTrigDraft && bEditBlogState) {
            $("noticeInfoCheckInput").checked = false;
        }
        switch (nRightType) {
            case parent.BlogRightInfo.RIGHTTYPE["PUBLIC"]:{
                $("publicRightCheck").checked = true;
                $("blogRightText").style.display = "none";
                $("friendRightText").style.display = "none";
                if (bEditBlogState) {
                    $("publicRightText").style.display = "";
                }
                break;
            }
            case parent.BlogRightInfo.RIGHTTYPE["FRIEND"]:{
                $("friendRightCheck").checked = true;
                $("blogRightText").style.display = "none";
                $("publicRightText").style.display = "none";
                $("friendRightText").style.display = "";
                break;
            }
            case parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]:{
                $("specificRightCheck").checked = true;
                $("blogRightText").style.display = "";
                $("friendRightText").style.display = "none";
                $("publicRightText").style.display = "none";
                break;
            }
        }
        if (!bNotTrigDraft) {
            DraftLogicManager.draftStateTrigger();
        }
    },
    addCategory: function(){
        QZBlog.Logic.showAddCategoryDlg(function(cateName){
            var optionsEle = $("blogCateSelect").options;
            optionsEle[optionsEle.length] = new Option(cateName, cateName, true, true);
            DraftLogicManager.draftStateTrigger();
        });
    },
    editCategory: function(){
        if (!confirm("页面需要跳转,请保存您尚未发表的日志正文")) 
            return;
        location.href = IMGCACHE_BLOG_V5_PATH + "/list.html?catemgr=1";
    },
    cancelPaperletter: function(){
        if (!!PageScheduler.editorObj) {
            var oPaperData = PageScheduler.editorObj.getPaperLetterData();
            window.tmp_lp_id = oPaperData.id;
            window.tmp_lp_style = oPaperData.style;
            PageScheduler.editorObj.removeLetterPaper();
            PageScheduler.editorObj.showDefinePanel(parent.g_hsBlogTemplate['restorePaperTemplate'], 25);
        }
        DraftLogicManager.draftStateTrigger();
    },
    revertPaperletter: function(){
        if (!!PageScheduler.editorObj) {
            if (!PageScheduler.blogInfo || !PageScheduler.blogInfo.getPaperLetterInfo()) {
                return;
            }
            var oPaperInfo = PageScheduler.blogInfo.getPaperLetterInfo();
            var oPaperData = !!PageScheduler.editorObj.getPaperLetterData();
            if (oPaperData.id == oPaperInfo.getID() && oPaperData.style == oPaperInfo.getStyle()) {
                QZBlog.Util.showMsgbox("当前信纸已经是您最近一次保存时应用的信纸", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                return;
            }
            this._changePaperletter(oPaperInfo.getStyle(), oPaperInfo.getID());
        }
        DraftLogicManager.draftStateTrigger();
    },
    restorePaperletter: function(){
        if (!!PageScheduler.editorObj) {
            if (!!window.tmp_lp_id && !!window.tmp_lp_style) {
                this._changePaperletter(window.tmp_lp_style, window.tmp_lp_id);
                window.tmp_lp_style = window.tmp_lp_id = null;
            }
            else 
                if (PageScheduler.blogInfo && PageScheduler.blogInfo.getPaperLetterInfo()) {
                    this.revertPaperletter();
                }
        }
    },
    _changePaperletter: function(nPaperStyle, nPaperID){
        if (!!PageScheduler.editorObj && !!nPaperStyle && !!nPaperID) {
            PageScheduler.editorObj.setPaperLetter(nPaperStyle, nPaperID);
            PageScheduler.editorObj.showDefinePanel(parent.g_hsBlogTemplate['paperTemplate'], 25);
            DraftLogicManager.draftStateTrigger();
        }
        else {
            setTimeout(QZONE.event.bind(this, this._changePaperletter, nPaperStyle, nPaperID), 50);
        }
    },
    openPaperLetterDlg: function(paperID, paperStyle, paperType){
        parent._tempQFCallback = QZONE.event.bind(this, this._changePaperletter);
        var params = ((!!paperID) ? ('paperid=' + paperID) : '') + (!!paperType ? ("papertype=" + paperType) : '');
        if (params.length > 0) {
            params = "?" + params;
        }
        QZBlog.Util.popupDialog('选择信纸', '<iframe id="lpFrame" frameborder="no" style="width:100%;height:100%" src="/qzone/mall/v3/letterpaper/htm/spaper.htm' + params + '"></iframe>', 670, 570);
    },
    openQQShowBubbleDlg: function(url, albumid){
        if (!PageScheduler.editorObj || !PageScheduler.editorObj.bReadyState) {
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this.openQQShowBubbleDlg, url, albumid), 50);
            return;
        }
        var toolbar = PageScheduler.editorObj.getToolbarList()["html_full"];
        var button = toolbar.getButton("qqshowbubble");
        if (button) {
            button._openQQShowDlg(url, albumid);
        }
    },
    cancelWriteBlog: function(){
        if (getParameter("opener") == "main") {
            QZBlog.Util.toApp('/N1');
            return;
        }
        if (getParameter("opener") == "list") {
            location.href = IMGCACHE_BLOG_V5_PATH + "/list.html" + (!!getParameter("draftid") ? "?draftlist=1" : "");
            return;
        }
        if (PageScheduler.blogInfo) {
            if (getParameter("draftid")) {
                location.href = IMGCACHE_BLOG_V5_PATH + "/list.html?draftlist=1";
                return;
            }
            if (getParameter("bid")) {
                var blogid = getParameter("bid");
                var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
                location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, blogInfo ? blogInfo.getRandomSeed() : 0);
                return;
            }
        }
        location.href = IMGCACHE_BLOG_V5_PATH + "/list.html";
    },
    retriveTag: function(){
        if (!PageScheduler.editorObj) {
            return;
        }
        var content = PageScheduler.editorObj.getContent();
        if (!PageScheduler.editorObj.isEdited()) {
            QZBlog.Util.showMsgbox("您还没有书写任何日志正文内容", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            PageScheduler.editorObj.focus();
            return;
        }
        if (content.getRealLength() < 100) {
            QZBlog.Util.showMsgbox("您输入的日志内容过少，您也可以手工输入搜索词，如“时尚 生活”", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        if ($("tagInput").value.trim().split(" ").length >= 5) {
            QZBlog.Util.showMsgbox("您输入的搜索词数已经达到上限(5个)，请删除后再次提取", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        var title = $("titleInput").value.trim();
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_tag?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&title=" + title.URLencode() + "&content=" + content.URLencode() + "&tag_num=5";
        var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(data){
            if (!data || XMLselectSingleNode(data, "/qzone/result") == null) {
                QZBlog.Util.DumpMsgFunc();
                return;
            }
            var result = XMLselectSingleNode(data, "/qzone/result");
            var type = result.getAttribute("type");
            if (type == -6) {
                QZBlog.Util.showLoginBox("ownerOperation");
                return;
            }
            else 
                if (type == 0) {
                    var value = getXMLNodeText(XMLselectSingleNode(data, "/qzone/result/message"));
                    if (value.getRealLength() == 0) {
                        QZBlog.Util.showMsgbox("未能提取到搜索词", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                    }
                    else {
                        QZBlog.Util.showMsgbox("成功提取日志搜索词", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                    }
                    var originValue = ($("tagInput").focused ? ($("tagInput").value.trim() + " ") : "");
                    $("tagInput").focused = true;
                    $("tagInput").focus();
                    $("tagInput").style.color = '#000';
                    $("tagInput").style.borderColor = "gray";
                    $("tagInput").value = QZONE.lang.uniqueArray((originValue + value.split("|").join(" ").toRealStr()).split(" ")).slice(0, 5).join(" ");
                }
                else {
                    QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/qzone/result/message")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                }
        }, QZBlog.Util.DumpMsgFunc, "GB2312", false);
        netProcessor.excute();
    },
    changeEditorHeight: function(value){
        if (!PageScheduler.editorObj || !PageScheduler.editorObj.bReadyState) {
            QZBlog.Util.showMsgbox("日志编辑器正在初始化，请稍候...", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
            return;
        }
        var target = PageScheduler.editorObj.getCurrentEditor().getInstance();
        var curHeight = parseInt(target.style.height, 10);
        if (typeof(curHeight) == "undefined") {
            curHeight = 450;
        }
        curHeight += value;
        if (curHeight < 60) {
            curHeight = 60;
        }
        PageScheduler.editorObj._dom_area.style.height = curHeight + "px";
        PageScheduler.editorObj.resizeArea();
    }
};
var PageScheduler = {
    blogid: -1,
    draftid: -1,
    blogInfo: null,
    bLoaded: false,
    editorObj: null,
    _nState: -1,
    getState: function(){
        return this._nState;
    },
    _selectCategory: function(name){
        var optionsEle = $("blogCateSelect").options;
        for (var index = 0; index < optionsEle.length; ++index) {
            if (optionsEle[index].value == name.toRealStr()) {
                $("blogCateSelect").selectedIndex = index;
                break;
            }
        }
        if (index == optionsEle.length && name.length > 0) {
            optionsEle[optionsEle.length] = new Option(name.toRealStr(), name.toRealStr(), true, true);
        }
    },
    fillCategorySelector: function(){
        var optionsEle = $("blogCateSelect").options;
        try {
            if (QZONE.userAgent.ie) {
                optionsEle.remove(0);
            }
            else {
                $("blogCateSelect").remove(0);
            }
        } 
        catch (err) {
        }
        if (!!getParameter("openmusic")) {
            optionsEle[0] = new Option("我的乐志", "我的乐志", true, true);
        }
        else {
            optionsEle[0] = new Option("个人日记", "个人日记", true, true);
        }
        QZBlog.Logic.getCategoryInfo(QZONE.event.bind(this, function(){
            var listInfo = parent.g_oCateInfoMgr.getCateInfoList();
            for (var index = 0; index < listInfo.length; ++index) {
                var cateName = listInfo[index].getName();
                if (cateName == parent.BLOG_VOTE_CATENAME || cateName == $("blogCateSelect").value.trim()) {
                    continue;
                }
                optionsEle[optionsEle.length] = new Option(cateName.toRealStr(), cateName.toRealStr(), false, false);
            }
            var cateName = decodeURIComponent(getParameter("category"));
            if (cateName) {
                this._selectCategory(cateName);
            }
            else 
                if (this.blogInfo) {
                    this._selectCategory(this.blogInfo.getCateName());
                }
        }));
    },
    fillRightArea: function(result){
        if (!!result && result.length > 0) {
            var strUins = "";
            var strHTML = '已选择：';
            for (var index = 0; index < result.length; ++index) {
                strHTML += (result[index].label + "").toInnerHTML() + '(' + result[index].data + ')' + '、';
                strUins += result[index].data + "|";
            }
            strHTML = strHTML.substr(0, strHTML.length - 1);
            strHTML += '<button class="bt_tx2" onclick="EditorManager.openRightSettingDlg(\'' + strUins + '\');">选择</button>';
            $("blogRightSpan").innerHTML = strHTML;
        }
    },
    _fillTagInfo: function(blogInfo){
        if (!blogInfo) {
            return;
        }
        var tag = blogInfo.getTag();
        if (tag && tag.getRealLength() > 0) {
            tag = tag.split("|").join(" ");
            $("tagInput").focused = true;
            $("tagInput").style.color = '#000';
            $("tagInput").value = tag.toRealStr();
        }
        if (!!getParameter("focustag")) {
            if (QZONE.userAgent.ie != 8) {
                $("tagInput").style.borderColor = "#ff0000";
            }
        }
    },
    _fillVoteInfo: function(voteInfo){
        if (!voteInfo) {
            return;
        }
        var timeOptions = $("voteTimeSelect").options;
        for (var index = 0; index < timeOptions.length; ++index) {
            if (timeOptions[index].value == voteInfo.getTime()) {
                $("voteTimeSelect").selectedIndex = index;
                break;
            }
        }
        $("multiVoteCheck").checked = voteInfo.getMultiCheck() ? true : false;
        var arrInput = $("voteOptionArea").getElementsByTagName("input");
        var optionList = voteInfo.getOptionList();
        for (var index = 0; index < optionList.length; ++index) {
            if ((index == 0 || index == 1) && arrInput[index]) {
                arrInput[index].value = optionList[index].getContent();
            }
            else {
                EditorManager.addVoteOption(optionList[index].getContent());
            }
        }
        $("voteCheckInput").checked = true;
        EditorManager.checkVoteInput();
    },
    _fillBlogInfo: function(blogInfo){
        if (!blogInfo) {
            return;
        }
        if (!this.editorObj || !this.editorObj.bReadyState) {
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this._fillBlogInfo, blogInfo), 50);
            return;
        }
        initSystemCtrls();
        $("titleInput").value = blogInfo.getTitle().toRealStr().convSP(true).convCR(true);
        var blogType = blogInfo.getType();
        var bDraftFlag = (blogType == parent.BLOGTYPE.DRAFT || blogType == parent.BLOGTYPE.AUTODRAFT);
        if (!!blogInfo.getEffectBit(34)) {
            this.editorObj.setConvertedHTMLContent(blogInfo.getHTML());
        }
        else {
            this.editorObj.setContent(blogInfo.getContent().toRealStr().convSP(true).convCR(true));
        }
        this._selectCategory(blogInfo.getCateName());
        if (blogInfo.getVoteID() > 0) {
            $("voteCheckInput").checked = true;
            if (!bDraftFlag) {
                $("voteCheckInput").disabled = true;
                $("voteOperationDiv").style.display = "";
            }
            $("voteCateDiv").style.display = "";
            $("categoryDiv").style.display = "none";
        }
        else 
            if (!bDraftFlag) {
                $("voteCheckInput").checked = false;
                $("voteCheckInput").disabled = true;
            }
        this._fillVoteInfo(blogInfo.getVoteInfo());
        $("highLightCheck").checked = (blogInfo.getEffectBit(1) ? true : false);
        $("signatureCheck").checked = (blogInfo.getEffectBit(9) ? true : false);
        $("setTopCheck").checked = (blogInfo.getEffectBit(4) ? true : false);
        $("quoteCheck").checked = (blogInfo.getEffectBit(6) ? true : false);
        if ($("setTopCheck").checked || $("quoteCheck").checked) {
            EditorManager.showAllSetting(true);
        }
        if (!bDraftFlag && $("highLightCheck").checked) {
            $("highLightCheck").disabled = true;
        }
        if (!blogInfo.getEffectBit(27)) {
            window._defaultFontSize = 2;
            this.editorObj.setFontSize(window._defaultFontSize);
            this.editorObj.setHTMLFontSize(fontSizeMap[window._defaultFontSize]);
        }
        var nRightType = blogInfo.getRightInfo().getType();
        if (blogInfo.getEffectBit(29)) {
            EditorManager.rightSettingResult.rightType = nRightType;
            if (nRightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
                var uinList = blogInfo.getRightInfo().getUserIDList();
                QZBlog.Util.getPortraitList(uinList, function(arr){
                    var list = [];
                    for (var uin in arr) {
                        list.push({
                            "data": uin + "",
                            "label": arr[uin][6].toRealStr()
                        });
                    }
                    EditorManager.rightSettingResult = list;
                    EditorManager.rightSettingResult.rightType = parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"];
                    PageScheduler.fillRightArea(list);
                });
            }
            EditorManager.showAllSetting(true);
        }
        EditorManager.selectRight(nRightType, true);
        this._fillTagInfo(blogInfo);
        if (blogInfo.getPaperLetterInfo()) {
            this.editorObj.setPaperLetter(blogInfo.getPaperLetterInfo().getStyle(), blogInfo.getPaperLetterInfo().getID());
            this.editorObj.showDefinePanel(parent.g_hsBlogTemplate['paperTemplate'], 25);
        }
        if (!blogInfo.getEffectBit(33)) {
            $("linehint_tmp_div").style.display = "";
        }
        this.bLoaded = true;
        DraftLogicManager.initDraftTrigger();
    },
    updateDraftArea: function(){
        var strTip = DraftLogicManager.getDraftTips(parent.g_oCateInfoMgr.getDraftCount(), this._nState == 3);
        if (strTip.length > 0) {
            $("draftTipText").innerHTML = strTip;
        }
        if (parent.g_oCateInfoMgr.getCategoryCnt() != 0 && parent.g_oCateInfoMgr.getDraftCount() >= 0) {
            $("loadDraftButton").innerHTML = "草稿箱(" + parent.g_oCateInfoMgr.getDraftCount() + ")";
        }
        $("saveDraftButton").disabled = (parent.g_oCateInfoMgr.getDraftCount() >= parent.MAX_DRAFT_CNT && (this._nState == 1 || this._nState == 2 || this._nState == 6)) ? true : false;
    },
    checkAutoDraftState: function(){
        this.updateDraftArea();
        $("draftOperArea").style.display = "";
        QZBlog.Util.showMsgbox("正在获取数据，请稍候...", 0);
        var url = "http://" + CGI_BLOG_DOMAIN + CGI_DRAFT_PATH + "/draft_get_auto_data?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&r=" + Math.random();
        var portraitReq = new QZBlog.Util.BlogNetProcessor();
        portraitReq.create(url, "get", QZONE.event.bind(this, this._postProcAutoDraftData), QZONE.event.bind(this, this._postProcAutoDraftData), "GB2312", true, "_Callback");
        portraitReq.excute();
        DraftLogicManager.startAutoSaveDraft();
    },
    _postProcAutoDraftData: function(rawData){
        QZBlog.Util.hideMsgbox();
        if (rawData && !rawData.error && !getParameter("autodraft")) {
            var data = rawData.data;
            DraftLogicManager.setAutoDraftID(1);
            if (confirm("您可能在系统出现问题时，保存过草稿《" + (data.title.length > 0 ? data.title.toRealStr().convSP(true) : "无标题") + "》，您是否要读取这篇草稿？")) {
                this.blogInfo = new parent.BlogInfo();
                this.blogInfo.setType(parent.BLOGTYPE.AUTODRAFT);
                if (!this.blogInfo.convertJsonObject(data)) {
                    alert("获取自动草稿信息失败，请刷新空间重试");
                    return;
                }
                if (this.blogInfo.getID() >= 0) {
                    this._nState = 7;
                }
                else {
                    this._nState = 6;
                }
                this._fillBlogInfo(this.blogInfo);
                DraftLogicManager.draftStateTrigger();
                return;
            }
        }
        if (this.draftid > 0) {
            $("topBar").innerHTML = "编辑草稿";
            this.getManualDraftInfo(this.draftid);
        }
        else 
            if (this.blogid >= 0) {
                $("topBar").innerHTML = "编辑日志";
                this.getBlogInfo(this.blogid);
            }
            else {
                DraftLogicManager.initDraftTrigger();
            }
    },
    getManualDraftInfo: function(draftid){
        this.blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(draftid);
        if (!!this.blogInfo && this.blogInfo.getContent()) {
            this._fillBlogInfo(this.blogInfo);
        }
        else {
            QZBlog.Util.showMsgbox("正在读取数据，请稍候...", 0);
            var url = "http://" + CGI_BLOG_DOMAIN + CGI_DRAFT_PATH + "/draft_get_manual_data?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&draftid=" + this.draftid + "&r=" + Math.random();
            var netProcessor = new QZBlog.Util.BlogNetProcessor();
            netProcessor.create(url, "get", QZONE.event.bind(this, this._showManualDraftInfo), function(){
                QZBlog.Util.showMsgbox("服务器繁忙，请稍候重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                location.href = IMGCACHE_BLOG_V5_PATH + "/list.html?draftlist=1";
            }, "GB2312", true, "_Callback");
            netProcessor.loginHandler = QZONE.event.bind(this, function(){
                setTimeout("location.href='" + IMGCACHE_BLOG_V5_PATH + "/list.html';", 2000);
                QZBlog.Util.showLoginBox("ownerOperation");
            });
            netProcessor.excute();
        }
    },
    _showManualDraftInfo: function(rawData){
        this.blogInfo = new parent.BlogInfo();
        this.blogInfo.setType(parent.BLOGTYPE.DRAFT);
        if (!this.blogInfo.convertJsonObject(rawData.data)) {
            alert("无法获取草稿全部信息，请刷新空间重试");
            return;
        }
        if (!parent.g_oBlogInfoMgr.addBlogInfo(this.blogInfo)) {
            alert("无法获取草稿全部信息，请刷新空间重试");
            return;
        }
        this._fillBlogInfo(this.blogInfo);
        parent.g_oBlogInfoMgr.addBlogInfo(this.blogInfo);
    },
    getBlogInfo: function(blogid){
        this.blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
        if (!!this.blogInfo && this.blogInfo.getContent()) {
            this._fillBlogInfo(this.blogInfo);
            if (this.blogInfo.getDraftID() > 0) {
                this.draftid = this.blogInfo.getDraftID();
                this._nState = 3;
            }
            this.updateDraftArea();
        }
        else {
            QZBlog.Util.showMsgbox("正在读取数据，请稍候...", 0);
            var url = "http://" + CGI_BLOG_DOMAIN + CGI_BLOG_PATH + "/blog_get_data?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&numperpage=" + CONTENT_COMMENT_NUM + "&blogid=" + this.blogid + "&arch=0&pos=0&direct=1&r=" + Math.random();
            if (QZBlog.Logic.getGlobalBlogRightInfo()) {
                url += "&br=" + QZBlog.Logic.getGlobalBlogRightInfo();
            }
            var portraitReq = new QZBlog.Util.BlogNetProcessor();
            portraitReq.create(url, "get", QZONE.event.bind(this, this._showBlogInfo), function(data){
                if (!!data && !!data.error && !!data.error.msg) {
                    QZBlog.Util.showMsgbox(data.error.msg, 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
                }
                location.href = IMGCACHE_BLOG_V5_PATH + "/list.html";
            }, "GB2312", true, "_Callback");
            portraitReq.excute();
        }
    },
    _showBlogInfo: function(rawData){
        this.blogInfo = new parent.BlogInfo();
        if (!this.blogInfo.convertJsonObject(rawData.data)) {
            alert("无法获取日志全部信息，请刷新空间重试");
            return;
        }
        if (!parent.g_oBlogInfoMgr.addBlogInfo(this.blogInfo)) {
            alert("无法获取日志全部信息，请刷新空间重试");
            return;
        }
        if (this.blogInfo.getDraftID() > 0) {
            this._nState = 3;
        }
        this._fillBlogInfo(this.blogInfo);
        this.updateDraftArea();
    },
    parsePhotoData: function(){
        var oData = QZFL.FP._t.insertPhotoContent;
        if (!oData) {
            return null;
        }
        var jsonData = {};
        try {
            jsonData.bNameFlag = oData.needPhotoName;
            jsonData.bDescFlag = oData.needPhotoDesc;
            jsonData.bAlbumName = oData.needAlbumName;
            jsonData.lastAlbumId = (oData.lastAlbumId ? oData.lastAlbumId : window.lastBlogAlbumId);
            window.lastBlogAlbumId = jsonData.lastAlbumId;
            jsonData.arrImgInfo = [];
            for (var index = 0; index < oData.photos.length; ++index) {
                var info = {};
                info.type = oData.photos[index].from;
                info.url = oData.photos[index].url;
                info.album = oData.photos[index].albumName;
                info.albumUrl = oData.photos[index].albumUrl;
                info.name = oData.photos[index].name;
                info.desc = oData.photos[index].desc;
                jsonData.arrImgInfo.push(info);
            }
        } 
        catch (err) {
            jsonData = null;
        }
        return jsonData;
    },
    _procWriteBlogParameter: function(){
        var title = decodeURIComponent(getParameter("title"));
        $("titleInput").value = title.toRealStr().convSP(true).convCR(true);
        var content = parent.ENV.get("icTabBlogContent");
        if (!content || content.length == 0) {
            content = decodeURIComponent(getParameter("content"));
        }
        else {
            parent.ENV.set("icTabBlogContent", "");
            DraftLogicManager.draftStateTrigger();
        }
        if (!!getParameter("photoBlog", true)) {
            var data = this.parsePhotoData();
            if (!!data) {
                for (var index = 0; index < data.arrImgInfo.length; ++index) {
                    content += "\n[img]" + data.arrImgInfo[index].url + "[/img]\n";
                    if (data.bNameFlag && data.arrImgInfo[index].name) {
                        content += "照片名称：" + data.arrImgInfo[index].name;
                    }
                    if (data.bAlbumName && data.arrImgInfo[index].album) {
                        content += "，所属相册：[url=" + data.arrImgInfo[index].albumUrl + "]" + data.arrImgInfo[index].album + "[/url]";
                    }
                    if ((data.bNameFlag && data.arrImgInfo[index].name) || (data.bAlbumName && data.arrImgInfo[index].album)) {
                        content += "\n";
                    }
                    if (data.bDescFlag && data.arrImgInfo[index].desc) {
                        content += "照片描述：" + data.arrImgInfo[index].desc + "\n";
                    }
                }
            }
        }
        this.editorObj.setContent(content.toRealStr().convSP(true).convCR(true));
    },
    _checkPageState: function(){
        var blogid = parseInt(getParameter("bid"), 10);
        var draftid = parseInt(getParameter("draftid"), 10);
        if (!!draftid) {
            if (blogid >= 0) {
                this._nState = 5;
                this.blogid = blogid;
            }
            else {
                this._nState = 4;
            }
            this.draftid = draftid;
        }
        else 
            if (blogid >= 0) {
                this.blogid = blogid;
                this._nState = 2;
            }
            else {
                this._nState = 1;
            }
    },
    procPageParameter: function(){
        if (this.editorObj == null) {
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this.procPageParameter), 50);
            return;
        }
        var blogid = parseInt(getParameter("bid"), 10);
        if (isNaN(blogid) || blogid < 0) {
            this._procWriteBlogParameter();
        }
        var paperID = parseInt(getParameter("paperid"), 10);
        var paperStyle = parseInt(getParameter("paperstyle"), 10);
        var openDlg = parseInt(getParameter("paperdialog"), 10);
        var paperType = parseInt(getParameter("papertype"), 10);
        if ((!!paperID && !!paperStyle) || openDlg == 1) {
            EditorManager.openPaperLetterDlg(paperID, paperStyle, paperType);
        }
        else 
            if (openDlg == 2) {
                EditorManager.openQQShowBubbleDlg(getParameter("url"), getParameter("albid"));
            }
        this._checkPageState();
        QZBlog.Util.Statistic.sendPV("editblog");
    },
    _doBuildEditor: function(){
        window._defaultFontSize = 3;
        var defHeight = 480;
        switch (window.screen.height) {
            case 600:
            case 768:
            case 864:
                defHeight = 280;
                break;
            case 1024:
                defHeight = 450;
                break;
            case 1280:
                defHeight = 650;
                break;
            default:
                if (!QZONE.userAgent.ie) {
                    defHeight = 480;
                }
                else {
                    defHeight = 300;
                }
        }
        this.editorObj = QZONE.editor.create("blogEditorAnchor", {
            height: (defHeight + "px")
        });
        this.editorObj.onEditorReady = QZONE.event.bind(this, this._postBuildEditor);
        this.editorObj.build();
    },
    _postBuildEditor: function(){
        if (arguments[0] != "html") {
            return;
        }
        $("titleInput").focus();
        $("retriveTagArea").style.display = "";
        this.editorObj.setBlogCSS();
        this.editorObj.setHTMLFontSize(fontSizeMap[window._defaultFontSize]);
        this.editorObj.setupHTMLEvent();
        this.editorObj.setMaxContentLength(MAX_BLOG_HTML_LEN);
        DraftLogicManager.registerDraftTrigger(this.editorObj.getCurrentEditor().getDocument(), "keydown");
        if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
            var toolbar = PageScheduler.editorObj.getToolbarList()["html_full"];
            var button = toolbar.getButton("autoindent");
            if (button) {
                button.execute();
            }
        }
        if (!!getParameter("openmusic")) {
            var toolbar = PageScheduler.editorObj.getToolbarList()["html_full"];
            var button = toolbar.getButton("music");
            if (button) {
                button._openMusicDlg();
            }
        }
        else 
            if (!!getParameter("openphoto")) {
                var toolbar = PageScheduler.editorObj.getToolbarList()["html_full"];
                var button = toolbar.getButton("insertimage");
                if (button) {
                    button._openImageBox();
                }
            }
        QZONE.event.addEvent(this.editorObj.getCurrentEditor().getDocument(), "keyup", QZFL.event.bind(this, function(evt){
            evt = QZONE.event.getEvent(evt);
            if (!evt.ctrlKey || (evt.keyCode != 83 && evt.keyCode != 115)) {
                return;
            }
            EditorManager.manualSaveDraft();
            QZONE.event.preventDefault();
        }));
        this.editorObj.bReadyState = true;
    },
    buildEditor: function(){
        if (this.editorObj) {
            return;
        }
        if (typeof(qzEditorLoaded) == "undefined") {
            loadEditor("http://" + IMGCACHE_DOMAIN + "/qzone/newblog/v5/editor/qzEditor.js?hh=" + Math.random(), QZONE.event.bind(this, this._doBuildEditor), function(){
                alert("暂时无法加载编辑器，请清空浏览器缓存后重试.");
            }, "utf-8");
        }
        else {
            this._doBuildEditor();
        }
    },
    decideEditMode: function(){
        var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
        if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
            QZBlog.Util.getSubLoginBitMapFlag(function(data, value){
                parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
                EditorManager._setMode(parent.g_oBlogSettingInfoMgr.getEditMode(nLoginUin));
            }, 1);
        }
        else {
            EditorManager._setMode(parent.g_oBlogSettingInfoMgr.getEditMode(nLoginUin));
        }
    },
    _loadPaperDetailImage: function(ele, id){
        ele.onload = null;
        var data = window.oLetterPaperData;
        for (var index = 0; index < data.length; ++index) {
            var url = "http://" + IMGCACHE_DOMAIN + "/qzone/space_item/pre/" + data[index].id % 16 + "/" + data[index].id + "_1.gif";
            if (data[index].id == id) {
                QZBlog.Util.ImageManager.loadObjectImage(url, ele, function(){
                    ele.style.height = "134px";
                    ele.style.width = "107px";
                });
            }
            else {
                QZBlog.Util.ImageManager.loadImage(url, false, null);
            }
        }
    },
    _showLetterPaperDetail: function(ele, dataIndex){
        if (!ele || !window.oLetterPaperData || dataIndex < 0 || dataIndex >= window.oLetterPaperData.length) {
            return;
        }
        var paperData = window.oLetterPaperData[dataIndex];
        if (!paperData) {
            return;
        }
        clearTimeout(window.nHidePaperDetailTimer);
        $("paperDetailDiv").innerHTML = "<strong>" + paperData.name + "</strong><p style='height:134px;'><a href='javascript:;' onclick='EditorManager._selectLPFromePanel(" +
        dataIndex +
        ");return false;'><img src='/qzone_v4/loading.gif' title='" +
        paperData.desp +
        "' style='height:16px;width:16px;' onload='PageScheduler._loadPaperDetailImage(this," +
        paperData.id +
        ");' /></a></p><span class='review_bar " +
        (paperData.Fitem_type == 11 ? "none" : "") +
        "'><img src='/ac/b.gif' class='icon_vip_yl' /> 黄钻专用 " +
        "<a href='http://jump.qq.com/clienturl_168?service_type=home&clientuin=" +
        QZONE.cookie.get("zzpaneluin") +
        "&clientkey=" +
        QZONE.cookie.get("zzpanelkey") +
        "&aid=zone.letips&cid=QZ_C_1061&sid=QZ_S_1005&wid=QZ_W_1002" +
        "' target='_blank' class='paper_join" +
        (QZBlog.Logic.SpaceHostInfo.isVipUser() ? " none" : "") +
        "'>加入</a></span>";
        var left = parseInt(QZONE.dom.getPosition(ele).left, 10) + (30 / 2) - (150 / 2);
        if (dataIndex == 3) {
            left -= 8;
        }
        $("paperDetailDiv").style.left = left + "px";
        $("paperDetailDiv").style.display = "";
        $("paperDetailDiv").onmouseover = function(){
            clearTimeout(window.nHidePaperDetailTimer);
        };
        $("paperDetailDiv").onmouseout = PageScheduler._toHideLPDetail;
    },
    _toHideLPDetail: function(){
        window.nHidePaperDetailTimer = setTimeout(function(){
            $("paperDetailDiv").style.display = "none";
        }, 200);
    },
    showLetterPaperPanel: function(){
        var url = "http://" + IMGCACHE_DOMAIN + "/qzone/mall/static/json/mallpaper_blog.json";
        var netReq = new QZBlog.Util.BlogNetProcessor();
        netReq.create(url, "get", QZONE.event.bind(this, function(data){
            data = data.data;
            if (!data || !data.length) {
                return;
            }
            window.oLetterPaperData = (function(){
                var arr = [];
                var index = -1;
                var freeItemLen = 0;
                var vipItemLen = 0;
                for (index = 0; index < data.length; ++index) {
                    if (data[index].Fitem_type == 11) {
                        ++freeItemLen;
                        continue;
                    }
                    ++vipItemLen;
                }
                if (freeItemLen < 2 || vipItemLen < 4) {
                    return arr;
                }
                while (arr.length < 4 && arr.length < data.length) {
                    index = Math.floor(Math.random() * data.length);
                    if (data[index].selected) {
                        continue;
                    }
                    if (!QZBlog.Logic.SpaceHostInfo.isVipUser()) {
                        if ((arr.length % 2 == 0 && data[index].Fitem_type == 11) || (arr.length % 2 != 0 && data[index].Fitem_type != 11)) {
                            arr.push(data[index]);
                            data[index].selected = true;
                        }
                    }
                    else {
                        if (data[index].Fitem_type != 11) {
                            arr.push(data[index]);
                            data[index].selected = true;
                        }
                    }
                }
                return arr;
            })();
            data = window.oLetterPaperData;
            var strTemplate = '<a href="javascript:;" onmouseover="<%=mouseEvt=%>" onmouseout="PageScheduler._toHideLPDetail();" onclick="<%=clickEvt=%>;return false;"><img src="<%=imgUrl=%>" /></a>';
            var strHTML = "";
            for (var index = 0; index < data.length; ++index) {
                data[index].id = data[index].Fitem_id;
                data[index].style = data[index].Fdesc;
                data[index].name = data[index].Fitem_name;
                data[index].type = data[index].Fitem_type;
                data[index].desp = data[index].Fitem_remark;
                strHTML += strTemplate.replace(/<%=imgUrl=%>/gi, ("http://" + IMGCACHE_DOMAIN + "/qzone/space_item/pre/" + data[index].id % 16 + "/" + data[index].id + ".gif")).replace(/<%=clickEvt=%>/gi, ("EditorManager._selectLPFromePanel(" + index + ")")).replace(/<%=mouseEvt=%>/gi, ("PageScheduler._showLetterPaperDetail(this, " + index + ");"));
            }
            $("paperListSpan").innerHTML = strHTML;
            setTimeout(function(){
                var oLoader = new QZONE.jsLoader();
                oLoader.onload = function(){
                    window.bPaperInterfaceLoaded = true;
                };
                oLoader.load("http://" + IMGCACHE_DOMAIN + "/qzone/mall/v3/letterpaper/js/qzonevippaper.js", document, "gb2312");
            }, 1000);
            setInterval(function(){
                PageScheduler.editorObj.refreshDefinePanelTopPos();
            }, 100);
        }), function(){
            $("paperPanel").style.display = "";
        }, "GB2312", true, "mallpaperdealdata");
        netReq.excute();
    },
    start: function(){
        this.decideEditMode();
        this.procPageParameter();
        this.fillCategorySelector();
        this.checkAutoDraftState();
    }
};
var NamecardScheduler = {
    loaded: false,
    loadScript: function(){
        if (this.loaded) {
            return;
        }
        var g_oJSLoader = new QZONE.jsLoader();
        g_oJSLoader.onload = QZONE.event.bind(this, function(){
            this.loaded = true;
        });
        g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + "/qzone/v5/namecard.js", document, "utf-8");
    },
    init: function(oContainer){
        if (!oContainer) {
            return;
        }
        if (!this.loaded) {
            QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, this.init, oContainer), 100);
            return;
        }
        try {
            QZONE.namecard.init(oContainer);
        } 
        catch (err) {
        }
    }
};
parent.g_nDraftSubmitFlag = -1;
var DraftLogicManager = {
    DRAFT_TIPS: {
        "full": "草稿箱已满",
        "notfull": "草稿箱中有 {{cnt}} 篇草稿",
        "empty": "您没有已保存的草稿",
        "published": "本日志有草稿，可读取编辑"
    },
    AUTOSAVE_DRAFT_TIME: 1 * 60 * 1000,
    _bAutoDraftState: false,
    _bManualDraftState: false,
    _nAutoSaveDraftTimer: -1,
    _autoDraftID: -1,
    _bFirstManualSaved: false,
    _bInitialized: false,
    getDraftTips: function(nDraftCnt, publishFlag){
        if (!!publishFlag) {
            return this.DRAFT_TIPS["published"];
        }
        if (nDraftCnt >= parent.MAX_DRAFT_CNT) {
            return this.DRAFT_TIPS["full"];
        }
        else 
            if (nDraftCnt > 0) {
                return "";
            }
            else {
                return "";
            }
    },
    initDraftTrigger: function(){
        if (this._bInitialized) {
            return;
        }
        var ctrlList = [["titleInput", "keydown"], ["blogCateSelect", "change"], ["voteCheckInput", "click"], ["multiVoteCheck", "click"], ["voteTimeSelect", "change"], ["setTopCheck", "click"], ["highLightCheck", "click"], ["signatureCheck", "click"], ["quoteCheck", "click"]];
        for (var index = 0; index < ctrlList.length; ++index) {
            DraftLogicManager.registerDraftTrigger($(ctrlList[index][0]), ctrlList[index][1]);
        }
        this._bInitialized = true;
    },
    registerDraftTrigger: function(ele, evtName){
        if (!ele || !evtName) {
            return false;
        }
        return QZONE.event.addEvent(ele, evtName, QZONE.event.bind(this, this.draftStateTrigger));
    },
    draftStateTrigger: function(){
        if (QZONE.userAgent.ie) {
            document.body.onbeforeunload = beforePageUnloadProc;
        }
        else {
            window.onbeforeunload = beforePageUnloadProc;
        }
        this.setManualDraftState(true);
        this.setAutoDraftState(true);
    },
    startAutoSaveDraft: function(){
        clearInterval(this._nAutoSaveDraftTimer);
        this._nAutoSaveDraftTimer = setInterval(QZONE.event.bind(this, function(){
            if (!!this._bAutoDraftState) {
                EditorManager.doSaveDraft(1);
            }
            this._bAutoDraftState = false;
        }), this.AUTOSAVE_DRAFT_TIME);
    },
    stopAutoSaveDraft: function(){
        clearInterval(this._nAutoSaveDraftTimer);
    },
    hasAutoSaveDraft: function(){
        return (this._autoDraftID > 0) ? true : false;
    },
    clearAutoDraftID: function(){
        this._autoDraftID = -1;
        this.setAutoDraftState(false);
    },
    setAutoDraftID: function(draftid){
        this._autoDraftID = draftid;
    },
    getManualDraftState: function(){
        return this._bManualDraftState;
    },
    getAutoDraftState: function(){
        return this._bAutoDraftState;
    },
    setManualDraftState: function(bDirtyFlag){
        this._bManualDraftState = !!bDirtyFlag;
    },
    setAutoDraftState: function(bDirtyFlag){
        this._bAutoDraftState = !!bDirtyFlag;
    }
};
function __qzoneFrameworkBeforeUnload(){
    if (DraftLogicManager.getManualDraftState()) {
        if (!confirm("您正在编辑的日志尚未保存，离开会使内容丢失，确定离开吗？")) {
            return ":jump::false:";
        }
    }
    beforePageUnloadProc();
    document.body.onbeforeunload = null;
    window.onbeforeunload = null;
    return ":jump::true:";
}

function beforePageUnloadProc(){
    QZBlog.Util.hideMsgbox();
    DraftLogicManager.stopAutoSaveDraft();
    QZBlog.Logic.clearMusicPlayer();
    if (!!DraftLogicManager.hasAutoSaveDraft()) {
        try {
            loadXMLAsync("delDraftData", "http://" + CGI_BLOG_DOMAIN + CGI_DRAFT_PATH + "/draft_del_auto_data", function(){
            }, null, true, "uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&r=" + Math.random());
        } 
        catch (err) {
        }
    }
    if (DraftLogicManager.getManualDraftState()) {
        DraftLogicManager.setManualDraftState(false);
        return "您正在编辑的日志尚未保存，离开会使内容丢失，确定离开吗？";
    }
}

var g_insertSwfNum = 0;
function swfInit(){
    g_insertSwfNum++;
}

var blogtype = 2;
function selectNotePaper(iPaperID, iPaperStyle){
    return EditorManager.openPaperLetterDlg(iPaperID, iPaperStyle);
}

function checkLoginState(){
    if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
        blogLoginFnList.splice(0, blogLoginFnList.length);
        blogLoginFnList.push(function(){
            if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
                location.href = IMGCACHE_BLOG_V5_PATH + "/list.html";
            }
            else {
                init();
            }
        });
        QZBlog.Util.showLoginBox("blogComment");
        return false;
    }
    else 
        if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
            setTimeout('location.href="' + IMGCACHE_BLOG_V5_PATH + '/list.html"', 50);
            return false;
        }
        else {
            return true;
        }
}

function init(){
    if (!checkLoginState()) {
        return;
    }
    PageScheduler.start();
}

var g_oJSLoader = new QZONE.jsLoader();
g_oJSLoader.onload = init;
g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/script/basic.js", parent.document, "utf-8");
QZBlog.Util.createTemplate();
var popupDialog = QZBlog.Util.popupDialog;
var fontSizeMap = {
    1: "10px",
    2: "13px",
    3: "16px",
    4: "18px",
    5: "24px",
    6: "32px"
};
try {
    $("pageContainer").className = (QZBlog.Util.isWideMode() ? "blog big_mode_blog" : (!QZBlog.Util.isSmallMode() ? "blog full_mode_blog" : "blog mini_mode_blog"));
    QZONE.event.addEvent(window, "beforeunload", function(){
        QZBlog.Util.TimerManager.clear();
    });
} 
catch (err) {
}/*  |xGv00|4b1dfb707d3af341a39171673df34080 */
