
try {
    document.domain = "qq.com";
} 
catch (err) {
    throw (new Error("Qzone:not *.qq.com"));
}
var fnMap = ["getBitMapFlag", "setBitMapFlag", "getLoginUserBitMap", "getSecondaryBitMapFlag", "setSecondaryBitMapFlag", "getNickname", "getGender", "getAge", "getCity", "getQzonename", "getDescription", "getVipStatus", "getQzoneConfig", "appendPopupFn", "appendFullscreenFn", "popupDialog", "resizePopupDialog", "closePopup", "fullscreenDialog", "closeFullScreenDialog", "showLoginBox", "addFriend", "showMsgbox", "hideMsgbox", "showBubble", "hideBubble", "showVerifyBox", "sendGift", "sendMessage", "getScrollTop", "setScrollTop", "showTips", "hideTips", "getCurrentAppWindow", "getPortraitList", "getRemarkList", "confirm", "getVIPLevel", "getSvrTime", "getAppWindowPosition", "toggleDisplay", "toApp", "appInvite"];
var OFP_fnMap = ["updateAppList"];
if (typeof(window.QZONE) == 'undefined') {
    window.QZONE = {};
}
QZONE.FP = (function(){
    var _fp = window, found = 0;
    try {
        do {
            _fp = _fp.parent;
            if (_fp.QZONE && _fp.QZONE.FrontPage && _fp.g_iUin) {
                found = 5;
                break;
            }
        }
        while (_fp != top);
    } 
    catch (err) {
        found = 0;
    }
    if (found < 5) {
        return {
            _t: _fp
        };
    }
    var res = {}, tmp, t;
    t = _fp.QZONE.FrontPage;
    for (; fnMap.length > 0;) {
        tmp = fnMap.pop();
        if (typeof(t[tmp]) == 'function') {
            res[tmp] = t[tmp];
        }
    }
    var t2 = _fp.QZONE.OFP;
    if (typeof(t2) != "undefined") {
        for (; OFP_fnMap.length > 0;) {
            tmp = OFP_fnMap.pop();
            if (typeof(t2[tmp]) == 'function') {
                res[tmp] = t2[tmp];
            }
        }
    }
    res._t = _fp;
    res.activateOFPIframe = function(){
        if (frameElement) {
            if (typeof(frameElement.activate) == "function") {
                frameElement.activate();
            }
        }
    };
    return res;
})();/*  |xGv00|ee8fc42b5c5fc925b4ddb3dd38ed37af */
