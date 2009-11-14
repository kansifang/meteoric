
var IMGCACHE_DOMAIN = "http://" + TOP.imgcacheDomain + "/";
var CUT_PORTRAIT_URL = "http://upload.qzone.qq.com/cgi-bin/upload/cgi_cut_portrait_new";
var BASE_DOMAIN = "http://base.qzone.qq.com";
/**
 * avatar头像
 */
var SET_AVATAR_URL = BASE_DOMAIN + "/cgi-bin/user/cgi_userinfo_setavatar_new";
var iconEditor;
var cAppWin = QZONE.FP.getCurrentAppWindow();
function flashInit(){
    var img_url = getParameter("url") + "";
    iconEditor = getIconEditor();
    $("photoEditor").loadImage(img_url);
}

function submitData(){
    if (!haveSubmit) {
        haveSubmit = true;
        saveAvatra();
    }
}

function flashError(evt){
    haveSubmit = false;
    if (typeof(evt.loc) != "undefined") {
        window.location.href = (evt.loc + "?s=" + evt.s + "&msg=" + encodeURI(evt.msg));
    }
}
/**
 * 获取图像编辑器
 */
function getIconEditor(){
    var r = $("photoEditor");
    return r;
}

function cancleBtnAction(){
    setTimeout(function(){
        QZONE.FP.closePopup();
    }, 200);
}
/**
 * 保存图片
 */
function saveImage(){
    iconEditor = getIconEditor();
    if (checkLogin()) {
        iconEditor.saveToServer(CUT_PORTRAIT_URL + "?uin=" + TOP.checkLogin() + "&type=3&mode=1");
    }
    else {
        QZONE.FP.hideMsgbox();
        QZONE.FP.showMsgbox("请先登陆再提交", 1, 2000);
    }
}

function iconHint(){
    QZONE.FP.showMsgbox("正在提交头像数据", 1, 5000);
}
/**
 * 正在提交数据
 */
function avatarHint(){
    QZONE.FP.showMsgbox("正在提交形象像数据", 1, 5000);
}

function errorAction(){
    QZONE.FP.hideMsgbox();
    QZONE.FP.showMsgbox("由于网络问题，操作失败了。", 1, 2000);
}

function onIconComplete(){
    QZONE.FP.hideMsgbox();
    $("also_flash_container").style.display = "none";
    $("success_div").style.display = "";
    setTimeout(function(){
        loadBigHeadExample();
        var c = QZONE.FP.getCurrentAppWindow();
        c.getIconInfo();
        c.setIframeUrl("/qzone/newprofile/profile_user_icon.html");
        QZONE.FP.resizePopupDialog(440, 465);
    }, 200);
}
/**
 * 头像设置完成
 * @param {Object} url
 */
function onAvatraComplete(url){
    setAvatra(url);
}

function saveAvatra(){
    QZONE.FP.showMsgbox("正在提交数据，请稍等", 1, 15000);
    iconEditor = getIconEditor();
    if (checkLogin()) {
        PhotoLogic.getExternalUploadUrl({
            uin: TOP.checkLogin(),
            callBack: function(evt){
                iconEditor.saveAvatraToServer(evt.toString());
            }
        });
    }
    else {
        QZONE.FP.hideMsgbox();
        QZONE.FP.showMsgbox("请先登陆再提交", 1, 2000);
    }
}
/**
 * 设置头像的URL
 * @param {Object} url
 */
function setAvatra(url){
    if (checkLogin()) {
        var send_data = {
            "uin": TOP.checkLogin(),
            "type": 3,
            "url": url
        };
        Gateway.call(SET_AVATAR_URL, send_data, function(re){
            haveSubmit = false;
            if (re.ret == "succ") {
                setTimeout(function(){
                    saveImage();
                }, 200);
                cAppWin.userInfoCache.avatar = url;
            }
            else {
                QZONE.FP.hideMsgbox();
                QZONE.FP.showMsgbox("由于网络问题，操作失败了。", 1, 2000);
            }
        }, "post");
    }
    else {
        QZONE.FP.hideMsgbox();
        QZONE.FP.showMsgbox("请先登陆再提交", 1, 2000);
    }
}

function loadBigHeadExample(){
    var swf_html = QZONE.media.getFlashHtml({
        "src": "http://imgcache.qq.com/qzone/mall/bighead/loader.swf?item=44712&textinfo=&rate=0&trinket=&type=.swf&pic=" +
        cAppWin.userInfoCache.avatar,
        "width": "100%",
        "height": "100%",
        "allowScriptAccesss": "always",
        "id": "avatar",
        "name": "avatar",
        "wmode": "opaque"
    });
    $("bighead_example").innerHTML = swf_html;
}
/**
 * 加载图片编辑器
 */
function loadPhotoEditor(){
    var swf_html = QZONE.media.getFlashHtml({
        "src": IMGCACHE_DOMAIN +
        "qzone/flashmod/photoEditor/iconAvatar/PhotoEditor.swf",
        "width": "325",
        "height": "345",
        "allowScriptAccesss": "always",
        "id": "photoEditor",
        "name": "photoEditor",
        "wmode": "opaque",
        "flashvars": "slice_width=100&slice_height=100"
    });
    $("also_flash_container").innerHTML = "<div style='width:400px;height:350px;margin-top:5px;'><div style='padding:0 2px 5px; border-bottom:1px #B5C7EB solid; margin-bottom:8px;'><p><a href='/qzone/newprofile/profile_select_image.html?mode=6' style='color:#0084C1;' title='重新选择照片'>&nbsp;重新选择照片</a></p></div><div style='margin:0px 30px;'><span style='color:#000;'>头像/形象裁切</span>" +
    swf_html +
    "</div></div>";
}

function makeBigHeader(){
    var url = URIencode(cAppWin.userInfoCache.avatar);
    cAppWin.callBigHead(44712, url);
}

function getParameter(vname, source){
    var reg = new RegExp("(?:\\?|\#|\&)" + vname + "=([^&]+)\&?");
    if (source) {
        if (reg.test(source)) {
            var result = reg.exec(source, "im");
            return result[1];
        }
        else {
            return "";
        }
    }
    if (reg.test(window.location.toString())) {
        var result = reg.exec(window.location, "im");
        return result[1];
    }
    else {
        return "";
    }
}

function checkLogin(){
    if (QZONE.cookie.get("skey")) {
        var t = parseInt(QZONE.cookie.get("uin").replace(/[^\d]/g, ""), 10);
        if (!isNaN(t) && (t > 10000)) 
            return t;
        else 
            return 0;
    }
    else {
        return 0;
    }
}/*  |xGv00|b546147ee4566adf4a6a9b5251764992 */

