
if (!UserBlogConfig) {
    var UserBlogConfig = {
        _bSearchOption: false,
        _strFont: "大字体",
        _strSign: "隐藏签名档",
        _bCheatHintFlag: false,
        setSearchOption: function(bSearchOption){
            this._bSearchOption = bSearchOption;
            return parent.QZONE.shareObject.set("searchOption", !!this._bSearchOption ? 1 : 0);
        },
        getSearchOption: function(){
            return this._bSearchOption;
        },
        setFont: function(strFont){
            this._strFont = strFont;
            return parent.QZONE.shareObject.set("blogfont", this._strFont);
        },
        getFont: function(){
            return this._strFont;
        },
        setSign: function(strSign){
            this._strSign = strSign;
            parent.QZONE.shareObject.set("hidesign", this._strSign);
        },
        getSign: function(){
            return this._strSign;
        },
        getCheatHintFlag: function(){
            return this._bCheatHintFlag;
        },
        setCheatHintFlag: function(flag){
            this._bCheatHintFlag = !!flag;
        },
        _init: (function(){
            this._bSearchOption = !!parent.QZONE.shareObject.get("searchOption");
            this._strFont = !!parent.QZONE.shareObject.get("blogfont") ? parent.QZONE.shareObject.get("blogfont") : "大字体";
            this._strSign = !!parent.QZONE.shareObject.get("hidesign") ? parent.QZONE.shareObject.get("hidesign") : "隐藏签名档";
        })()
    };
}
var BLOGTYPE = {
    "GENERAL": 0,
    "PRIVATE": 1,
    "DRAFT": 2,
    "ARCHIVE": 3,
    "AUTODRAFT": 4
};
var DEFAULT_USER_PORTRAIT = "/qzone_v4/client/userinfo_icon/5001.gif";
var CONTENT_COMMENT_NUM = (parent.g_iUin == 19990210) ? 45 : 15;
var BLOG_OLDARCHIVE_CATENAME = "\x02";
var BLOG_DEFAULT_CATENAME = "个人日记";
var BLOG_VOTE_CATENAME = "投票";
var MIN_VOTE_OPTION_LENGTH = 2;
var MAX_VOTE_OPTION_LENGTH = 100;
var MAX_DRAFT_CNT = 20;
var LIST_TITLE_NUM = 15;
function BlogCategoryInfo(){
    this._strName = "";
    this._nCount = -1;
};
BlogCategoryInfo.prototype.setName = function(strName){
    this._strName = strName;
};
BlogCategoryInfo.prototype.getName = function(){
    return this._strName;
};
BlogCategoryInfo.prototype.setCount = function(nCount){
    this._nCount = nCount;
};
BlogCategoryInfo.prototype.getCount = function(){
    return this._nCount;
};
BlogCategoryInfo.prototype.toJsonObject = function(){
    return {
        "category": this._strName,
        "num": this._nCount
    };
};
function BlogCategoryManager(){
    this._arrCateInfo = [];
    this._nDraftCnt = -1;
    this._nPrivateCnt = -1;
    this._nArchiveCnt = -1;
    this._nBlogCnt = -1;
}

BlogCategoryManager.prototype.setBlogCnt = function(nCnt){
    this._nBlogCnt = nCnt;
};
BlogCategoryManager.prototype.getBlogCnt = function(){
    return this._nBlogCnt;
};
BlogCategoryManager.prototype.setPrivateCnt = function(nCnt){
    this._nPrivateCnt = nCnt;
};
BlogCategoryManager.prototype.getPrivateCnt = function(){
    return this._nPrivateCnt;
};
BlogCategoryManager.prototype.setArchiveCount = function(nCnt){
    this._nArchiveCnt = nCnt;
};
BlogCategoryManager.prototype.getArchiveCount = function(){
    return this._nArchiveCnt;
};
BlogCategoryManager.prototype.setDraftCount = function(nCnt){
    this._nDraftCnt = nCnt;
};
BlogCategoryManager.prototype.getDraftCount = function(){
    return this._nDraftCnt;
};
BlogCategoryManager.prototype.getCategoryCnt = function(){
    return this._arrCateInfo.length;
};
BlogCategoryManager.prototype.toJsonObject = function(){
    var data = {
        "blog_num": this._nBlogCnt,
        "maxarch": this._nArchiveCnt,
        "draft_num": this._nDraftCnt,
        "privateblog_num": this._nPrivateCnt,
        "categorylist": []
    };
    for (var index = 0; index < this._arrCateInfo.length; ++index) {
        data.categorylist.push(this._arrCateInfo[index].toJsonObject());
    }
    return data;
};
BlogCategoryManager.prototype.convertJsonObject = function(jsonObj){
    if (!jsonObj) {
        return false;
    }
    this.clear();
    this._nBlogCnt = jsonObj.blog_num;
    this._nArchiveCnt = jsonObj.maxarch;
    this._nDraftCnt = jsonObj.draft_num;
    this._nPrivateCnt = jsonObj.privateblog_num;
    var cateList = jsonObj.categorylist;
    for (var index = 0; index < cateList.length; ++index) {
        var info = new BlogCategoryInfo();
        info.setName(cateList[index].category);
        info.setCount(cateList[index].num);
        this._arrCateInfo.push(info);
    }
    return true;
};
BlogCategoryManager.prototype.getCateInfoByName = function(name){
    for (var index = 0; index < this._arrCateInfo.length; ++index) {
        if (this._arrCateInfo[index].getName() == name) {
            return this._arrCateInfo[index];
        }
    }
    return null;
};
BlogCategoryManager.prototype.removeCateInfoByName = function(name){
    for (var index = 0; index < this._arrCateInfo.length; ++index) {
        if (this._arrCateInfo[index].getName() == name) {
            this._arrCateInfo.splice(index, 1);
            return true;
        }
    }
    return false;
};
BlogCategoryManager.prototype.addCateInfo = function(info){
    if (!info) {
        return false;
    }
    if (this.getCateInfoByName(info.getName())) {
        return false;
    }
    this._arrCateInfo.push(info);
    return true;
};
BlogCategoryManager.prototype.updateCateInfo = function(info){
    if (!info) {
        return false;
    }
    var targetInfo = this.getCateInfoByName(info.getName());
    if (!targetInfo) {
        return false;
    }
    targetInfo = info;
    return true;
};
BlogCategoryManager.prototype.getCateInfoList = function(){
    return this._arrCateInfo;
};
BlogCategoryManager.prototype.clear = function(){
    this._nDraftCnt = -1;
    this._nPrivateCnt = -1;
    this._nArchiveCnt = -1;
    this._nBlogCnt = -1;
    this._arrCateInfo = [];
};
BlogCategoryManager.prototype.changeBlogCateName = function(orgCate, newCate){
    var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(orgCate);
    if (!cateInfo) {
        return false;
    }
    cateInfo.setName(newCate);
    var hsBlogInfo = parent.g_oBlogInfoMgr._hsBlogInfo;
    for (var id in hsBlogInfo) {
        if (hsBlogInfo[id] && (hsBlogInfo[id].getCategoryName() == orgCate) && hsBlogInfo[id].getType != BLOGTYPE.DRAFT) {
            hsBlogInfo[id].setCategoryName(newCate);
            hsBlogInfo[id].updateRandomSeed();
        }
    }
    return true;
};
BlogCategoryManager.prototype.removeBlogCateName = function(cateName){
    var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(cateName);
    if (!cateInfo) {
        return false;
    }
    var defaultCateInfo = parent.g_oCateInfoMgr.getCateInfoByName(BLOG_DEFAULT_CATENAME);
    defaultCateInfo.setCount(defaultCateInfo.getCount() + cateInfo.getCount());
    parent.g_oCateInfoMgr.removeCateInfoByName(cateName);
    var hsBlogInfo = parent.g_oBlogInfoMgr._hsBlogInfo;
    for (var id in hsBlogInfo) {
        if (hsBlogInfo[id] && (hsBlogInfo[id].getCategoryName() == cateName) && hsBlogInfo[id].getType != BLOGTYPE.DRAFT) {
            hsBlogInfo[id].setCategoryName(BLOG_DEFAULT_CATENAME);
            hsBlogInfo[id].updateRandomSeed();
        }
    }
};
BlogCategoryManager.prototype.getBlogCntByCateName = function(cateName){
    if (!cateName) {
        return parent.g_oCateInfoMgr.getBlogCnt();
    }
    if (cateName == parent.BLOG_OLDARCHIVE_CATENAME) {
        return parent.g_oCateInfoMgr.getArchiveCount();
    }
    var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(cateName);
    if (!cateInfo) {
        return -1;
    }
    return cateInfo.getCount();
};
function BlogInfo(){
    this._nType = BLOGTYPE.GENERAL;
    this._nID = -1;
    this._nPrevID = -1;
    this._nNextID = -1;
    this._nUin = -1;
    this._nQuoteUin = -1;
    this._nPubTime = -1;
    this._nLastModifiedTime = -1;
    this._nModifyCnt = -1;
    this._nViewCnt = -1;
    this._strCate = null;
    this._nEffect = -1;
    this._nEffect2 = -1;
    this._nDraftID = -1;
    this._strTitle = "";
    this._strContent = "";
    this._nCommentCnt = -1;
    this._strTag = "";
    this._strCateName = "";
    this._voteids = -1;
    this._arrPageHashInfo = {};
    this._oRecentVisitorInfo = null;
    this._oVoteInfo = null;
    this._oRightInfo = null;
    this._oPaperLetterInfo = null;
    this._oContentProperty = null;
    this._nRandomSeed = 0;
    this._oCGIInfo = null;
    this._nCurCommentPage = -1;
}

BlogInfo.prototype.convertJsonObject = function(rawData){
    if (!rawData) {
        return false;
    }
    this._nUin = rawData.uin;
    this._strCateName = rawData.category;
    this._strTitle = rawData.title;
    this._strTag = rawData.tag;
    this._nID = rawData.blogid;
    this._nCommentCnt = rawData.replynum;
    this._nQuoteUin = rawData.orguin;
    this._nEffect = rawData.effect;
    this._nEffect2 = rawData.effect2;
    this._nPubTime = rawData.pubtime;
    this._strContent = rawData.content;
    this._strHTML = rawData.html;
    this._nDraftID = rawData.draftid;
    this._oCGIInfo = {
        "pre_arch": rawData.pre_arch,
        "pre_pos": rawData.pre_pos,
        "next_arch": rawData.next_arch,
        "next_pos": rawData.next_pos
    };
    if (!!rawData.lp_id && !!rawData.lp_style) {
        this._oPaperLetterInfo = new PaperLetterInfo(rawData.lp_id, rawData.lp_style);
    }
    if (rawData.replylist) {
        for (var index = 0; index < rawData.replylist.length; ++index) {
            var commentInfo = new BlogCommentInfo();
            commentInfo.convertJsonObject(rawData.replylist[index]);
            this.addCommentInfo(commentInfo);
        }
    }
    this._oRightInfo = new BlogRightInfo();
    if (rawData.friendrelation) {
        this._oRightInfo.convertJsonObject(rawData.friendrelation);
    }
    if (rawData.voteids) {
        this._voteids = rawData.voteids;
    }
    if (rawData.optionlist && rawData.optionlist.length > 0) {
        this._oVoteInfo = new VoteInfo();
        this._oVoteInfo.setID(this._voteids);
        this._oVoteInfo.setBlogID(this._nID);
        this._oVoteInfo.setMultiCheck(rawData.cb_multi);
        this._oVoteInfo.setTime(rawData.day);
        var list = this._oVoteInfo.getOptionList();
        for (var index = 0; index < rawData.optionlist.length; ++index) {
            var info = new VoteOptionInfo();
            info.setContent(rawData.optionlist[index].title);
            list.push(info);
        }
    }
    return true;
};
BlogInfo.prototype.toJsonObject = function(){
    return {
        "blogid": this._nID,
        "pubtime": this._nPubTime,
        "replynum": this._nCommentCnt,
        "category": this._strCate,
        "title": this._strTitle,
        "effect": this._nEffect,
        "effect2": this._nEffect2,
        "lp_id": (this._oPaperLetterInfo ? this._oPaperLetterInfo.getID() : 0),
        "lp_style": (this._oPaperLetterInfo ? this._oPaperLetterInfo.getStyle() : 0),
        "orguin": this._nQuoteUin,
        "content": this._strContent,
        "html": this._strHTML,
        "tag": this._strTag,
        "voteids": this._voteids,
        "pre_arch": this._oCGIInfo.pre_arch,
        "draftid": this._nDraftID,
        "pre_pos": this._oCGIInfo.pre_pos,
        "next_arch": this._oCGIInfo.next_arch,
        "next_pos": this._oCGIInfo.next_pos,
        "friendrelation": this._oRightInfo.toJsonObject(),
        "replylist": []
    };
};
BlogInfo.prototype.getEffectBit = function(nBit){
    nBit = parseInt(nBit, 10);
    if (isNaN(nBit) || nBit < 0 || nBit > 64) {
        throw new Error("BlogInfo.getEffectBit failed, error input nBit");
    }
    if (nBit < 32) {
        return this._getEffectBit1(nBit);
    }
    return this._getEffectBit2(nBit - 32);
};
BlogInfo.prototype._getEffectBit1 = function(nBit){
    if (this._nEffect < 0) {
        throw new Error("BlogInfo._getEffectBit1 failed, error blog effect");
    }
    return (this._nEffect & (1 << nBit));
};
BlogInfo.prototype._getEffectBit2 = function(nBit){
    if (this._nEffect2 < 0) {
        throw new Error("BlogInfo._getEffectBit2 failed, error blog effect");
    }
    return (this._nEffect2 & (1 << nBit));
};
BlogInfo.prototype.setEffectBit = function(nBit, flag){
    nBit = parseInt(nBit, 10);
    if (isNaN(nBit) || nBit < 0 || nBit > 64) {
        throw new Error("BlogInfo.setEffectBit failed, error input nBit");
    }
    if (nBit < 32) {
        return this._setEffectBit1(nBit, flag);
    }
    return this._setEffectBit2(nBit - 32, flag);
};
BlogInfo.prototype._setEffectBit1 = function(nBit, flag){
    if (this._nEffect < 0) {
        throw new Error("BlogInfo._setEffectBit1 failed, error blog effect");
    }
    if (flag) {
        this._nEffect = this._nEffect | (1 << nBit);
    }
    else {
        this._nEffect = this._nEffect & ~ (1 << nBit);
    }
    return true;
};
BlogInfo.prototype._setEffectBit2 = function(nBit, flag){
    if (this._nEffect2 < 0) {
        throw new Error("BlogInfo._setEffectBit1 failed, error blog effect");
    }
    if (flag) {
        this._nEffect2 = this._nEffect2 | (1 << nBit);
    }
    else {
        this._nEffect2 = this._nEffect2 & ~ (1 << nBit);
    }
    return true;
};
BlogInfo.prototype.getVoteID = function(){
    return this._voteids;
};
BlogInfo.prototype.getDraftID = function(){
    return this._nDraftID;
};
BlogInfo.prototype.setDraftID = function(id){
    this._nDraftID = id;
};
BlogInfo.prototype.getCommentPageLength = function(){
    return Math.ceil(this._nCommentCnt / CONTENT_COMMENT_NUM);
};
BlogInfo.prototype.getCurCommentPage = function(){
    return this._nCurCommentPage;
};
BlogInfo.prototype.setCurCommentPage = function(nPage){
    this._nCurCommentPage = nPage;
};
BlogInfo.prototype.setCGIInfo = function(info){
    this._oCGIInfo = info;
};
BlogInfo.prototype.getCGIInfo = function(){
    return this._oCGIInfo;
};
BlogInfo.prototype.updateRandomSeed = function(){
    this._nRandomSeed = Math.random();
};
BlogInfo.prototype.getRandomSeed = function(){
    return this._nRandomSeed;
};
BlogInfo.prototype.setRandomSeed = function(nSeed){
    this._nRandomSeed = nSeed;
};
BlogInfo.prototype.setCategoryName = function(name){
    this._strCate = name;
};
BlogInfo.prototype.getCategoryName = function(){
    return this._strCate;
};
BlogInfo.prototype.setEffect = function(nEffect){
    this._nEffect = nEffect;
};
BlogInfo.prototype.getEffect = function(){
    return this._nEffect;
};
BlogInfo.prototype.setEffect2 = function(nEffect){
    this._nEffect2 = nEffect;
};
BlogInfo.prototype.getEffect2 = function(){
    return this._nEffect2;
};
BlogInfo.prototype.setPrevBlogID = function(nID){
    this._nPrevID = nID;
};
BlogInfo.prototype.getPrevBlogID = function(){
    return this._nPrevID;
};
BlogInfo.prototype.setNextBlogID = function(nID){
    this._nNextID = nID;
};
BlogInfo.prototype.getNextBlogID = function(){
    return this._nNextID;
};
BlogInfo.prototype.setType = function(nType){
    this._nType = nType;
};
BlogInfo.prototype.getType = function(){
    return this._nType;
};
BlogInfo.prototype.setID = function(nID){
    this._nID = nID;
};
BlogInfo.prototype.getID = function(){
    return this._nID;
};
BlogInfo.prototype.getUin = function(){
    return this._nUin;
};
BlogInfo.prototype.setUin = function(nUin){
    this._nUin = nUin;
};
BlogInfo.prototype.getQuoteUin = function(){
    return this._nQuoteUin;
};
BlogInfo.prototype.setQuoteUin = function(nUin){
    this._nQuoteUin = nUin;
};
BlogInfo.prototype.setPubTime = function(nPubTime){
    this._nPubTime = nPubTime;
};
BlogInfo.prototype.getPubTime = function(){
    return this._nPubTime;
};
BlogInfo.prototype.setLastModifiedTime = function(nLastModifiedTime){
    this._nLastModifiedTime = nLastModifiedTime;
};
BlogInfo.prototype.getLastModifiedTime = function(){
    return this._nLastModifiedTime;
};
BlogInfo.prototype.setModifyCnt = function(nModifyCnt){
    this._nModifyCnt = nModifyCnt;
};
BlogInfo.prototype.getModifyCnt = function(){
    return this._nModifyCnt;
};
BlogInfo.prototype.setViewCnt = function(nViewCnt){
    if (this._nCommentCnt >= 0 && nViewCnt < this._nCommentCnt) {
        nViewCnt = this._nCommentCnt;
    }
    this._nViewCnt = nViewCnt;
};
BlogInfo.prototype.getViewCnt = function(){
    return this._nViewCnt;
};
BlogInfo.prototype.setCommentCnt = function(nCommentCnt){
    this._nCommentCnt = nCommentCnt;
};
BlogInfo.prototype.getCommentCnt = function(){
    return this._nCommentCnt;
};
BlogInfo.prototype.setTitle = function(strTitle){
    this._strTitle = strTitle;
};
BlogInfo.prototype.getTitle = function(){
    return this._strTitle;
};
BlogInfo.prototype.setContent = function(strContent){
    this._strContent = strContent;
};
BlogInfo.prototype.getContent = function(){
    return this._strContent;
};
BlogInfo.prototype.setHTML = function(strHTML){
    this._strHTML = strHTML;
};
BlogInfo.prototype.getHTML = function(){
    return this._strHTML;
};
BlogInfo.prototype.setTag = function(strTag){
    this._strTag = strTag;
};
BlogInfo.prototype.getTag = function(){
    return this._strTag;
};
BlogInfo.prototype.setCateName = function(strCateName){
    this._strCateName = strCateName;
};
BlogInfo.prototype.getCateName = function(){
    return this._strCateName;
};
BlogInfo.prototype.setTopFlag = function(bIsTop){
    return this.setEffectBit(4, bIsTop ? 1 : 0);
};
BlogInfo.prototype.getTopFlag = function(){
    return this.getEffectBit(4);
};
BlogInfo.prototype.setArchived = function(bArchived){
    this._bArchived = bArchived;
};
BlogInfo.prototype.getArchived = function(){
    return this._bArchived;
};
BlogInfo.prototype.getUrl = function(){
    return "http://user.qzone.qq.com" + this._nUin + "/" + this._nID;
};
BlogInfo.prototype.setRecentVisitorInfo = function(oRecentVisitorInfo){
    this._oRecentVisitorInfo = oRecentVisitorInfo;
};
BlogInfo.prototype.getRecentVisitorInfo = function(){
    return this._oRecentVisitorInfo;
};
BlogInfo.prototype.setVoteInfo = function(oVoteInfo){
    this._oVoteInfo = oVoteInfo;
};
BlogInfo.prototype.getVoteInfo = function(){
    return this._oVoteInfo;
};
BlogInfo.prototype.setPaperLetterInfo = function(oPaperLetterInfo){
    this._oPaperLetterInfo = oPaperLetterInfo;
};
BlogInfo.prototype.getPaperLetterInfo = function(){
    return this._oPaperLetterInfo;
};
BlogInfo.prototype.setRightInfo = function(oRightInfo){
    this._oRightInfo = oRightInfo;
};
BlogInfo.prototype.getRightInfo = function(){
    return this._oRightInfo;
};
BlogInfo.prototype.setContentProperty = function(oContentProperty){
    this._oContentProperty = oContentProperty;
};
BlogInfo.prototype.getContentProperty = function(){
    if (!this._oContentProperty) {
        this._oContentProperty = new ContentProperty(this._strContent);
    }
    return this._oContentProperty;
};
BlogInfo.prototype.addCommentInfo = function(info){
    if (!info) {
        return false;
    }
    if (this.getCommentInfo(info.getCommentID())) {
        return this.updateCommentInfo(info);
    }
    this._updatePageHashInfo(this._nCurCommentPage, info);
    return true;
};
BlogInfo.prototype._updatePageHashInfo = function(pageIndex, commentInfo){
    if (!this._arrPageHashInfo[pageIndex]) {
        this._arrPageHashInfo[pageIndex] = [];
    }
    this._arrPageHashInfo[pageIndex].push(commentInfo);
};
BlogInfo.prototype.updateCommentInfo = function(info){
    var targetInfo = this.getCommentInfo(info.getCommentID());
    if (!targetInfo) {
        return false;
    }
    targetInfo = info;
    return true;
};
BlogInfo.prototype.getCommentInfo = function(commentID){
    if (isNaN(parseInt(commentID, 10))) {
        return null;
    }
    for (var pageIndex in this._arrPageHashInfo) {
        if (!this._arrPageHashInfo[pageIndex]) {
            continue;
        }
        for (var index = 0; index < this._arrPageHashInfo[pageIndex].length; ++index) {
            if (this._arrPageHashInfo[pageIndex][index].getCommentID() == commentID) {
                return this._arrPageHashInfo[pageIndex][index];
            }
        }
    }
    return null;
};
BlogInfo.prototype.getCommentListInfo = function(pageIndex){
    pageIndex = parseInt(pageIndex, 10);
    if (isNaN(pageIndex) || pageIndex <= 0 || pageIndex > this.getCommentPageLength()) {
        return null;
    }
    return this._arrPageHashInfo[pageIndex];
};
BlogInfo.prototype.deleteCommentListInfoByPageIndex = function(pageIndex){
    pageIndex = parseInt(pageIndex, 10);
    if (isNaN(pageIndex) || pageIndex <= 0 || pageIndex > this.getCommentPageLength()) {
        return false;
    }
    this._arrPageHashInfo[pageIndex] = null;
};
BlogInfo.prototype.clearCommentListInfo = function(){
    this._arrPageHashInfo = {};
};
BlogInfo.prototype.deleteCommmentInfo = function(commentID){
    if (isNaN(parseInt(commentID, 10))) {
        return false;
    }
    var pgIndex = -1;
    for (var pageIndex in this._arrPageHashInfo) {
        if (!this._arrPageHashInfo[pageIndex]) {
            continue;
        }
        for (var index = 0; index < this._arrPageHashInfo[pageIndex].length; ++index) {
            if (this._arrPageHashInfo[pageIndex][index].getCommentID() == commentID) {
                pgIndex = pageIndex;
                break;
            }
        }
        if (pgIndex > 0) {
            break;
        }
    }
    if (pgIndex > 0) {
        for (var pageIndex in this._arrPageHashInfo) {
            if (pageIndex >= pgIndex) {
                this._arrPageHashInfo[pageIndex] = null;
            }
        }
        return true;
    }
    return false;
};
function ContentProperty(content){
    this._strContent = content;
    this._parseContent();
}

ContentProperty.prototype._parseContent = function(){
    for (var tag in ContentProperty.UBBTAGS) {
        this[tag] = this._checkUbbTagsCnt(ContentProperty.UBBTAGS[tag]);
    }
};
ContentProperty.prototype._checkUbbTagsCnt = function(reg){
    var count = 0;
    while ((reg.exec(this._strContent)) != null) {
        ++count;
    }
    return count;
};
ContentProperty.UBBTAGS = {
    "image": /\[img\]http(.[^\]]*)\[\/img\]/ig,
    "music": /\[music\]http(.[^\]]*)\[\/music\]/ig,
    "qqshow": /\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})(,.*?|)\]http(.[^\]]*)\[\/qqshow\]/ig
};
function BlogRightInfo(){
    this._nType = -1;
    this._arrUserList = [];
}

BlogRightInfo.prototype.convertJsonObject = function(jsonObject){
    if (jsonObject.length == 1 && jsonObject[0].cateid == 1) {
        this._nType = BlogRightInfo.RIGHTTYPE["FRIEND"];
    }
    else 
        if (jsonObject.length > 0) {
            for (var index = 0; index < jsonObject.length; ++index) {
                var info = new UserInfo();
                info.setUin(jsonObject[index].groupid);
                this._arrUserList.push(info);
            }
            this._nType = BlogRightInfo.RIGHTTYPE["SPECIFIC"];
        }
        else {
            this._nType = BlogRightInfo.RIGHTTYPE["PUBLIC"];
        }
};
BlogRightInfo.prototype.toJsonObject = function(){
    if (this._nType == BlogRightInfo.RIGHTTYPE["PUBLIC"]) {
        return [];
    }
    else 
        if (this._nType == BlogRightInfo.RIGHTTYPE["FRIEND"]) {
            return [{
                "cateid": 1,
                "groupid": 2
            }]
        }
        else {
            var arr = [];
            for (var index = 0; index < this._arrUserList.length; ++index) {
                arr.push({
                    "cateid": 128,
                    "groupid": this._arrUserList[index].getUin()
                });
            }
            return arr;
        }
};
BlogRightInfo.prototype.setType = function(nType){
    this._nType = nType;
};
BlogRightInfo.prototype.getType = function(){
    return this._nType;
};
BlogRightInfo.prototype.setUserList = function(arrUserList){
    this._arrUserList = arrUserList;
};
BlogRightInfo.prototype.getUserList = function(){
    return this._arrUserList;
};
BlogRightInfo.prototype.getUserIDList = function(){
    var arr = [];
    for (var index = 0; index < this._arrUserList.length; ++index) {
        arr.push(this._arrUserList[index].getUin());
    }
    return arr;
};
BlogRightInfo.prototype.addUserInfo = function(info){
    this._arrUserList.push(info);
};
BlogRightInfo.RIGHTTYPE = {
    "PUBLIC": 1,
    "FRIEND": 2,
    "SPECIFIC": 3
};
function PaperLetterInfo(id, style){
    this._id = id;
    this._style = style;
    this._type = -1;
    this._params = this.TYPE ? this.PARAMS5 : this.PARAMS4;
}

PaperLetterInfo.prototype.setID = function(id){
    this._id = id;
};
PaperLetterInfo.prototype.getID = function(){
    return this._id;
};
PaperLetterInfo.prototype.setStyle = function(style){
    this._style = style;
};
PaperLetterInfo.prototype.getStyle = function(style){
    return this._style;
};
PaperLetterInfo.prototype.TYPE = (parent.QZONE.FrontPage.getQzoneConfig().wide ? 1 : 0);
PaperLetterInfo.prototype.MINWIDTH = PaperLetterInfo.prototype.TYPE ? 850 : 670;
PaperLetterInfo.prototype.MINHEIGHT = 530;
PaperLetterInfo.prototype.HORI_PADDING = 30;
PaperLetterInfo.prototype.TITLECOLOR = {
    1: "000000",
    2: "ff0000",
    3: "ffffff",
    4: "0000ff",
    5: "00ff00",
    6: "800080",
    7: "ff8000",
    8: "ff00ff",
    9: "808080",
    10: "ffff00",
    11: "408080",
    12: "0080ff",
    13: "800000",
    14: "80ffff",
    15: "ff80c0"
};
PaperLetterInfo.prototype.FONTMAP = "舒体隶书彩云细黑新魏宋体姚体幼圆仿宋行楷";
PaperLetterInfo.prototype.PARAMS4 = [[], [50, 30, 80, 295, 70, 295, 530], [50, 295, 80, 30, 70, 295, 530], [220, 80, 80, 80, 70, 693, 230], [60, 80, 230, 80, 70, 693, 230], [45, 90, 100, 90, 70, 693, 530]];
PaperLetterInfo.prototype.PARAMS5 = [[], [50, 30, 80, 390, 70, 390, 530], [50, 390, 80, 30, 70, 390, 530], [220, 80, 80, 80, 70, 873, 230], [60, 80, 230, 80, 70, 873, 230], [45, 90, 100, 90, 70, 873, 530]];
PaperLetterInfo.prototype.getBackgroundImgUrl = function(){
    return "/qzone/space_item/orig/" + this._id % 16 + "/" + this._id + "_bg.jpg";
};
PaperLetterInfo.prototype.getTitleImgUrl = function(){
    return "/qzone/space_item/orig/" + this._id % 16 + "/" + this._id + "_t" + (this.TYPE ? "5" : "") + ".gif";
};
PaperLetterInfo.prototype.getDescImgUrl = function(){
    return "/qzone/space_item/orig/" + this._id % 16 + "/" + this._id + "_dec" + (this.TYPE ? "5" : "") + ".jpg";
};
PaperLetterInfo.prototype.getPaperTitleHTML = function(title){
    return '<font color="#' + this.getTitleColor() + '" size="4" face="' + this.getTitleFont + '">' + title + '</font>';
};
PaperLetterInfo.prototype.getType = function(){
    return (this._style >> 8) & 0xff;
};
PaperLetterInfo.prototype.getParams = function(){
    return this._params;
};
PaperLetterInfo.prototype.getTitleColor = function(){
    return this.TITLECOLOR[(this._style >> 16) & 0xff];
};
PaperLetterInfo.prototype.getTitleFont = function(){
    var id = (this._style >> 24) & 0xff;
    return this.FONTMAP.substring(2 * (id - 1), 2 * id);
};
function VoteInfo(){
    this._nID = -1;
    this._nBlogID = -1;
    this._bMultiCheck = -1;
    this._nTime = -1;
    this._arrOptionList = [];
}

VoteInfo.prototype.setID = function(nID){
    this._nID = nID;
};
VoteInfo.prototype.getID = function(){
    return this._nID;
};
VoteInfo.prototype.setBlogID = function(nBlogID){
    this._nBlogID = nBlogID;
};
VoteInfo.prototype.getBlogID = function(){
    return this._nBlogID;
};
VoteInfo.prototype.setMultiCheck = function(bMultiCheck){
    this._bMultiCheck = bMultiCheck;
};
VoteInfo.prototype.getMultiCheck = function(){
    return this._bMultiCheck;
};
VoteInfo.prototype.setTime = function(nTime){
    this._nTime = nTime;
};
VoteInfo.prototype.getTime = function(){
    return this._nTime;
};
VoteInfo.prototype.setOptionList = function(arrOptionList){
    this._arrOptionList = arrOptionList;
};
VoteInfo.prototype.getOptionList = function(){
    return this._arrOptionList;
};
VoteInfo.prototype.removeOptionInfo = function(id){
    for (var index = 0; index < this._arrOptionList.length; ++index) {
        if (this._arrOptionList[index].getID() == id) {
            this._arrOptionList.splice(index, 1);
            return true;
        }
    }
    return false;
};
function VoteOptionInfo(){
    this._nID = -1;
    this._nCount = -1;
    this._strContent = -1;
}

VoteOptionInfo.prototype.setID = function(nID){
    this._nID = nID;
};
VoteOptionInfo.prototype.getID = function(){
    return this._nID;
};
VoteOptionInfo.prototype.setCount = function(nCount){
    this._nCount = nCount;
};
VoteOptionInfo.prototype.getCount = function(){
    return this._nCount;
};
VoteOptionInfo.prototype.setContent = function(strContent){
    this._strContent = strContent;
};
VoteOptionInfo.prototype.getContent = function(){
    return this._strContent;
};
function BlogCommentInfo(){
    this._oUserInfo = null;
    this._nFloorNum = -1;
    this._nCommentID = -1;
    this._nTime = -1;
    this._strContent = -1;
    this._nEffect = -1;
    this._schoolName = "";
    this._schoolID = -1;
    this._bQuoteFlag = true;
    this._bShowSign = true;
    this._oContentProperty = null;
    this._nCommentArch = -1;
    this._nCapacity = -1;
    this._oReplyInfo = null;
}

BlogCommentInfo.prototype.convertJsonObject = function(jsonObj){
    if (!jsonObj) {
        return;
    }
    this._nCommentID = jsonObj.replyid;
    this._nCommentArch = jsonObj.replyarch;
    this._nTime = jsonObj.replytime;
    this._nEffect = jsonObj.replyeffect;
    this._strContent = jsonObj.replycontent;
    this._nCapacity = jsonObj.capacity;
    this._schoolName = jsonObj.schoolname;
    this._schoolID = jsonObj.schoolid;
    this._bQuoteFlag = true;
    this._oUserInfo = new UserInfo();
    this._oUserInfo.setUin(jsonObj.replyuin);
    this._oUserInfo.setNickname(jsonObj.replynick || jsonObj.nickname);
    this._oUserInfo.setSign(jsonObj.replyautograph);
    this._oUserInfo.setImgUrl(DEFAULT_USER_PORTRAIT);
    this._oUserInfo.setUserType((this._nEffect & (1 << 19)) ? 1 : 0);
    this._oReplyInfo = jsonObj.responsecontent;
};
BlogCommentInfo.prototype.toJsonObject = function(){
    return {
        "replyid": this._nCommentID,
        "replyuin": this._oUserInfo.getUin(),
        "replynick": this._oUserInfo.getNickname(),
        "floornum": this._nFloorNum,
        "replyautograph": this._oUserInfo.getSign(),
        "replycontent": this._strContent,
        "replytime": this._nTime,
        "schoolname": this._schoolName,
        "nickname": this._oUserInfo.getNickname(),
        "schoolid": this._schoolID,
        "replyeffect": this._nEffect,
        "replyarch": this._nCommentArch,
        "capacity": this._nCapacity,
        "imgurl": this._oUserInfo.getImgUrl()
    };
};
BlogCommentInfo.prototype.setQuoteFlag = function(flag){
    this._bQuoteFlag = !!flag;
};
BlogCommentInfo.prototype.getQuoteFlag = function(){
    return this._bQuoteFlag;
};
BlogCommentInfo.prototype.getSchoolName = function(){
    return this._schoolName;
};
BlogCommentInfo.prototype.setSchoolName = function(name){
    this._schoolName = name;
};
BlogCommentInfo.prototype.getSchoolID = function(){
    return this._schoolID;
};
BlogCommentInfo.prototype.setSchoolID = function(id){
    this._schoolID = id;
};
BlogCommentInfo.prototype.getCapacity = function(){
    return this._nCapacity;
};
BlogCommentInfo.prototype.setCapacity = function(nCount){
    this._nCapacity = nCount;
};
BlogCommentInfo.prototype.setCommentArch = function(arch){
    this._nCommentArch = arch;
};
BlogCommentInfo.prototype.getCommentArch = function(){
    return this._nCommentArch;
};
BlogCommentInfo.prototype.setCommentID = function(id){
    this._nCommentID = id;
};
BlogCommentInfo.prototype.getCommentID = function(){
    return this._nCommentID;
};
BlogCommentInfo.prototype.setUserInfo = function(oUserInfo){
    this._oUserInfo = oUserInfo;
};
BlogCommentInfo.prototype.getUserInfo = function(){
    return this._oUserInfo;
};
BlogCommentInfo.prototype.setFloorNum = function(nFloorNum){
    this._nFloorNum = nFloorNum;
};
BlogCommentInfo.prototype.getFloorNum = function(){
    return this._nFloorNum;
};
BlogCommentInfo.prototype.setTime = function(nTime){
    this._nTime = nTime;
};
BlogCommentInfo.prototype.getTime = function(){
    return this._nTime;
};
BlogCommentInfo.prototype.setContent = function(strContent){
    this._strContent = strContent;
};
BlogCommentInfo.prototype.getContent = function(){
    return this._strContent;
};
BlogCommentInfo.prototype.setEffect = function(nEffect){
    this._nEffect = nEffect;
};
BlogCommentInfo.prototype.getEffect = function(){
    return this._nEffect;
};
BlogCommentInfo.prototype.setShowSign = function(bShowSign){
    this._bShowSign = bShowSign;
};
BlogCommentInfo.prototype.getShowSign = function(){
    return this._bShowSign;
};
BlogCommentInfo.prototype.setReplyInfo = function(oReplyInfo){
    this._oReplyInfo = oReplyInfo;
};
BlogCommentInfo.prototype.getReplyInfo = function(){
    return this._oReplyInfo;
};
BlogCommentInfo.prototype.setContentProperty = function(oContentProperty){
    this._oContentProperty = oContentProperty;
};
BlogCommentInfo.prototype.getContentProperty = function(){
    if (!this._oContentProperty) {
        this._oContentProperty = new ContentProperty(this._strContent);
    }
    return this._oContentProperty;
};
function BlogCommentReplyInfo(){
    this._nCapacity = -1;
    this._oReplyList = [];
}

BlogCommentReplyInfo.prototype.setCapacity = function(nCapacity){
    this._nCapacity = nCapacity;
};
BlogCommentReplyInfo.prototype.getCapacity = function(){
    return this._nCapacity;
};
BlogCommentReplyInfo.prototype.setReplyList = function(oReplyList){
    this._oReplyList = oReplyList;
};
BlogCommentReplyInfo.prototype.getReplyList = function(){
    return this._oReplyList;
};
BlogCommentReplyInfo.prototype.addReplyInfo = function(info){
    if (!info) {
        return false;
    }
    this._oReplyList.push(info);
    return true;
};
function UserInfo(){
    this._nFlowerIndex = -1;
    this._nVipLevel = -1;
    this._nVipGrade = -1;
    this._strNickname = "";
    this._nUin = -1;
    this._strImgUrl = "";
    this._nUserType = -1;
    this._strSign = "";
}

UserInfo.prototype.setFlowerIndex = function(nFlowerIndex){
    this._nFlowerIndex = nFlowerIndex;
};
UserInfo.prototype.getFlowerIndex = function(){
    return this._nFlowerIndex;
};
UserInfo.prototype.setVipLevel = function(nVipLevel){
    this._nVipLevel = nVipLevel;
};
UserInfo.prototype.getVipLevel = function(){
    return this._nVipLevel;
};
UserInfo.prototype.setVipGrade = function(nVipGrade){
    this._nVipGrade = nVipGrade;
};
UserInfo.prototype.getVipGrade = function(){
    return this._nVipGrade;
};
UserInfo.prototype.setNickname = function(strNickname){
    this._strNickname = strNickname;
};
UserInfo.prototype.getNickname = function(){
    return this._strNickname;
};
UserInfo.prototype.setUin = function(nUin){
    this._nUin = nUin;
};
UserInfo.prototype.getUin = function(){
    return this._nUin;
};
UserInfo.prototype.setImgUrl = function(strImgUrl){
    this._strImgUrl = strImgUrl;
};
UserInfo.prototype.getImgUrl = function(){
    return this._strImgUrl;
};
UserInfo.prototype.setUserType = function(nUserType){
    this._nUserType = nUserType;
};
UserInfo.prototype.getUserType = function(){
    return this._nUserType;
};
UserInfo.prototype.setSign = function(strSign){
    this._strSign = strSign;
};
UserInfo.prototype.getSign = function(){
    return this._strSign;
};
function BlogInfoManager(){
    this._hsBlogInfo = {};
}

BlogInfoManager.prototype = {
    addBlogInfo: function(info){
        if (!info) {
            return false;
        }
        var id = (info.getType() == BLOGTYPE.DRAFT) ? info.getDraftID() : info.getID();
        if (this._hsBlogInfo[id]) {
            return this.updateBlogInfo(info);
        }
        this._hsBlogInfo[id] = info;
        return true;
    },
    getBlogInfo: function(blogID){
        if (!this._hsBlogInfo[blogID]) {
            return null;
        }
        return this._hsBlogInfo[blogID];
    },
    updateBlogInfo: function(info){
        var id = (info.getType() == BLOGTYPE.DRAFT) ? info.getDraftID() : info.getID();
        if (!info || !this._hsBlogInfo[id]) {
            return false;
        }
        this._hsBlogInfo[id] = info;
        return true;
    },
    removeBlogInfo: function(id){
        if (this._hsBlogInfo[id]) {
            this._hsBlogInfo[id] = null;
            return true;
        }
        return false;
    },
    clearAllBlogInfo: function(){
        this._hsBlogInfo = {};
    },
    updateBlogInfoSeed: function(blogid){
        if (this.getBlogInfo(blogid)) {
            this.getBlogInfo(blogid).updateRandomSeed();
            return true;
        }
        return false;
    },
    updateAllBlogInfoSeed: function(){
        for (var id in this._hsBlogInfo) {
            this.updateBlogInfoSeed(id);
        }
    }
};
function DraftListInfoManager(){
    this._oDraftData = [];
    this._hsListHTML = {};
}

DraftListInfoManager.prototype.clear = function(){
    this._oDraftData = [];
    this._hsListHTML = {};
};
DraftListInfoManager.prototype.getListHTML = function(mode){
    return this._hsListHTML[mode];
};
DraftListInfoManager.prototype.setListHTML = function(mode, html){
    this._hsListHTML[mode] = html;
};
DraftListInfoManager.prototype.getTotalCnt = function(){
    return this._oDraftData.length;
};
DraftListInfoManager.prototype.getDraftInfoByIndex = function(index){
    index = parseInt(index, 10);
    if (isNaN(index) || index < 0 || index >= this._oDraftData.length) {
        return null;
    }
    var nCnt = 0;
    while (nCnt < this._oDraftData.length) {
        ++nCnt;
        if (nCnt == index) {
            return this._oDraftData[nCnt];
        }
    }
    return null;
};
DraftListInfoManager.prototype.getDraftInfo = function(draftid){
    var nCnt = 0;
    while (nCnt < this._oDraftData.length) {
        if (this._oDraftData[nCnt].getDraftID() == draftid) {
            return this._oDraftData[nCnt];
        }
        ++nCnt;
    }
    return null;
};
DraftListInfoManager.prototype.getPrevDraft = function(draftid){
    var nCnt = this._oDraftData.length - 1;
    while (nCnt >= 0) {
        if (this._oDraftData[nCnt].getDraftID() == draftid) {
            if (nCnt > 0) {
                return this._oDraftData[nCnt - 1];
            }
            else 
                if (nCnt == 0) {
                    return this._oDraftData[nCnt];
                }
        }
        --nCnt;
    }
    return null;
};
DraftListInfoManager.prototype.getNextDraft = function(draftid){
    var nCnt = 0;
    while (nCnt < this._oDraftData.length) {
        if (this._oDraftData[nCnt].getDraftID() == draftid) {
            if (nCnt < this._oDraftData.length - 1) {
                return this._oDraftData[nCnt + 1];
            }
            else 
                if (nCnt == this._oDraftData.length - 1) {
                    return this._oDraftData[nCnt];
                }
        }
        ++nCnt;
    }
    return null;
};
DraftListInfoManager.prototype.removeDraft = function(draftid){
    var nCnt = 0;
    while (nCnt < this._oDraftData.length) {
        if (this._oDraftData[nCnt].getDraftID() == draftid) {
            this._oDraftData.splice(nCnt, 1);
            return true;
        }
        ++nCnt;
    }
    return false;
};
DraftListInfoManager.prototype.addNewDraft = function(draftInfo){
    if (!draftInfo) {
        return false;
    }
    try {
        if (!this.updateDraftInfo(draftInfo)) {
            this._oDraftData.splice(0, 0, draftInfo);
        }
    } 
    catch (err) {
        return false;
    }
    return true;
};
DraftListInfoManager.prototype.updateDraftInfo = function(draftInfo){
    if (!draftInfo) {
        return false;
    }
    var nCnt = 0;
    while (nCnt < this._oDraftData.length) {
        if (this._oDraftData[nCnt].getDraftID() == draftInfo.draftid) {
            this._oDraftData[nCnt] = draftInfo;
            return true;
        }
        ++nCnt;
    }
    return false;
};
if (typeof(parent.g_oBlogInfoMgr) == "undefined") {
    parent.g_oBlogInfoMgr = new BlogInfoManager();
}
if (typeof(parent.g_oDraftListInfoMgr) == "undefined") {
    parent.g_oDraftListInfoMgr = new DraftListInfoManager();
}
if (typeof(parent.g_oCateInfoMgr) == "undefined") {
    parent.g_oCateInfoMgr = new BlogCategoryManager();
}
var BlogListViewType = {
    "CLASSIC": 1,
    "DIGEST": 2
};
var BlogEditMode = {
    "SIMPLE": 0,
    "ADVANCE": 1
};
if (typeof(parent.BlogListNavigator) == "undefined") {
    parent.BlogListNavigator = {
        _strCurCate: "",
        _nCurBlogID: "",
        _nCurPage: 1,
        _nPrePage: -1,
        _nViewMode: -1,
        _nSortType: 0,
        _hsPageData: {},
        contentNaviInfo: [],
        currentPageCgiInfo: null,
        setCurrentViewMode: function(viewMode){
            this._nViewMode = viewMode;
        },
        getCurrentViewMode: function(){
            return this._nViewMode;
        },
        setCurrentCate: function(strCateName){
            this._strCurCate = strCateName;
        },
        setCurrentBlogID: function(blogID){
            this._nCurBlogID = blogID;
        },
        setCurrentPage: function(nCurPage){
            this._nCurPage = nCurPage;
        },
        setPrevPage: function(nPrevPage){
            this._nPrePage = nPrevPage;
        },
        getCurrentCate: function(){
            return this._strCurCate;
        },
        getCurrentBlogID: function(){
            return this._nCurBlogID;
        },
        getCurrentPage: function(){
            return this._nCurPage;
        },
        getPrevPage: function(){
            return this._nPrePage;
        },
        getSortType: function(){
            return this._nSortType;
        },
        setSortType: function(nType){
            this._nSortType = nType;
        },
        clear: function(){
            this._strCurCate = "";
            this._nCurBlogID = "";
            this._nCurPage = 1;
            this._nPrePage = -1;
            this._nSortType = 0;
            this.currentPageCgiInfo = null;
        },
        _getKey: function(cate, page, type){
            return (cate + "_" + page + "_" + type + "_" + this._nViewMode);
        },
        getPageData: function(cate, page, type){
            var key = this._getKey(cate, page, type);
            if (this._hsPageData[key]) {
                return this._hsPageData[key];
            }
            return null;
        },
        addPageData: function(cate, page, type, data){
            if (this._nViewMode == -1) {
                setTimeout(parent.QZFL.event.bind(this, this.addPageData, cate, page, type, data), 100);
                return;
            }
            var key = this._getKey(cate, page, type);
            this._hsPageData[key] = data;
        },
        removePageData: function(){
            for (var key in this._hsPageData) {
                this._hsPageData[key] = null;
            }
            this._hsPageData = {};
            parent.g_nBlogFirstPageRandSeed = Math.random();
        },
        getPrevBlogID: function(blogid){
            var oPageData = parent.BlogListNavigator.getPageData(this._strCurCate, this._nCurPage, this._nSortType);
            if (!oPageData) {
                return -1;
            }
            for (var index = 0; index < oPageData.blogids.length; ++index) {
                if (oPageData.blogids[index] == blogid) {
                    if (index > 0) {
                        return oPageData.blogids[index - 1];
                    }
                    else {
                        if (this._nCurPage > 1) {
                            oPageData = parent.BlogListNavigator.getPageData(this._strCurCate, this._nCurPage - 1, this._nSortType);
                            if (oPageData) {
                                return oPageData.blogids[oPageData.blogids.length - 1];
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            return -2;
                        }
                    }
                }
            }
            return -1;
        },
        getNextBlogID: function(blogid){
            var oPageData = parent.BlogListNavigator.getPageData(this._strCurCate, this._nCurPage, this._nSortType);
            if (!oPageData) {
                return -1;
            }
            var totalPage = Math.ceil(parent.g_oCateInfoMgr.getBlogCntByCateName(this._strCurCate) / LIST_TITLE_NUM);
            if (isNaN(totalPage)) {
                totalPage = -1;
            }
            for (var index = 0; index < oPageData.blogids.length; ++index) {
                if (oPageData.blogids[index] == blogid) {
                    if (index < oPageData.blogids.length - 1) {
                        return oPageData.blogids[index + 1];
                    }
                    else {
                        if (this._nCurPage < totalPage) {
                            oPageData = parent.BlogListNavigator.getPageData(this._strCurCate, this._nCurPage + 1, this._nSortType);
                            if (oPageData) {
                                return oPageData.blogids[0];
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            return -2;
                        }
                    }
                }
            }
            return -1;
        }
    };
}
function UserBlogSettingInfo(){
    this._bCommentNotifyInfoCenter = false;
    this._nRssNum = -1;
    this._nRecentVisitorRightType = -1;
    this._bTraceRecentVisitor = false;
    this._nListMode = BlogListViewType["CLASSIC"];
    this._nEditMode = BlogEditMode["ADVANCE"];
}

function BlogSettingInfoManager(){
    this._hsInfo = {};
    this._rssHash = {
        0: 10,
        1: 5,
        2: 3,
        3: -1
    };
    this._rightType = {
        0: 0,
        1: 1,
        2: -1,
        3: 2
    };
}

BlogSettingInfoManager.prototype = {
    setCommentNotifyIC: function(uin, bFlag){
        this._hsInfo[uin]._bCommentNotifyInfoCenter = !!bFlag;
    },
    getCommentNotifyIC: function(uin){
        return this._hsInfo[uin]._bCommentNotifyInfoCenter;
    },
    setRssNumber: function(uin, number){
        this._hsInfo[uin]._nRssNum = number;
    },
    getRssNumber: function(uin){
        return this._hsInfo[uin]._nRssNum;
    },
    setRVRightType: function(uin, type){
        this._hsInfo[uin]._nRecentVisitorRightType = type;
    },
    getRVRightType: function(uin){
        return this._hsInfo[uin]._nRecentVisitorRightType;
    },
    setTraceRVFlag: function(uin, flag){
        this._hsInfo[uin]._bTraceRecentVisitor = !!flag;
    },
    getTraceRVFlag: function(uin){
        return this._hsInfo[uin]._bTraceRecentVisitor;
    },
    removeSettingInfo: function(uin){
        this._hsInfo[uin] = null;
    },
    createSettingInfo: function(uin, oBitmapData){
        if (!uin || !oBitmapData) {
            return false;
        }
        function _getBitMapFlag(data, bit){
            if (bit <= 32) {
                return (parseInt(data, 16) >> (bit - 1)) & 1;
            }
            else {
                data = data.substr(0, 8);
                return _getBitMapFlag(data, bit - 32);
            }
        }
        var oInfo = new UserBlogSettingInfo();
        oInfo._bCommentNotifyInfoCenter = !!_getBitMapFlag(oBitmapData, 23);
        oInfo._bTraceRecentVisitor = !_getBitMapFlag(oBitmapData, 18);
        oInfo._nRssNum = this._rssHash[((_getBitMapFlag(oBitmapData, 27) << 1) | _getBitMapFlag(oBitmapData, 26))];
        oInfo._nRecentVisitorRightType = this._rightType[((_getBitMapFlag(oBitmapData, 10) << 1) | _getBitMapFlag(oBitmapData, 9))];
        oInfo._nListMode = (!_getBitMapFlag(oBitmapData, 58) ? BlogListViewType["CLASSIC"] : BlogListViewType["DIGEST"]);
        oInfo._nEditMode = (!_getBitMapFlag(oBitmapData, 54) ? BlogEditMode["ADVANCE"] : BlogEditMode["SIMPLE"]);
        this._hsInfo[uin] = oInfo;
        return true;
    },
    isSettingInfoReady: function(uin){
        return !!this._hsInfo[uin];
    },
    getListMode: function(uin){
        if (!this._hsInfo[uin]) {
            return -1;
        }
        return this._hsInfo[uin]._nListMode;
    },
    setListMode: function(uin, mode){
        if (!this._hsInfo[uin]) {
            return false;
        }
        this._hsInfo[uin]._nListMode = mode;
        return true;
    },
    getEditMode: function(uin){
        if (!this._hsInfo[uin]) {
            return -1;
        }
        return this._hsInfo[uin]._nEditMode;
    },
    setEditMode: function(uin, mode){
        if (!this._hsInfo[uin]) {
            return false;
        }
        this._hsInfo[uin]._nEditMode = mode;
        return true;
    }
};
if (typeof(parent.g_oBlogSettingInfoMgr) == "undefined") {
    parent.g_oBlogSettingInfoMgr = new BlogSettingInfoManager();
}/*  |xGv00|3d81f2f567dc3ca542a19a877081b6e9 */
