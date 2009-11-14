
function main(){
    if (document.referrer) {
        QZFL.cookie.set("refer", encodeURIComponent(document.referrer), "qzone.qq.com");
    }
    setTimeout(function(){
        QZFL.shareObject.create("http://" + imgcacheDomain + "/qzone/dataset/getset.swf");
    }, 0);
    if (g_iLoginUin == 0) {
        QZFL.cookie.del("zzpaneluin");
        QZFL.cookie.del("zzpanelkey");
        QZFL.cookie.del("uin");
        QZFL.cookie.del("skey");
        QZFL.cookie.del("diamondLevel");
    }
    initUserSpace();
}

QZFL.namespace.map(QZONE.deprecated);
QZFL.namespace.map(QZONE.deprecated.OldFunctions);
ENV.set("level2PagesCompat", true);
ENV.set("icDomain", imgcacheDomain);
QZFL.config.gbEncoderPath = "http://" + imgcacheDomain + "/qzone/v5/toolpages/";
QZFL.config.FSHelperPage = "/qzone/v5/toolpages/fp_gbk.html";
QZFL.widget.seed.domain = "qzone.qq.com";
QZFL.pageEvents.pageBaseInit();
QZFL.pageEvents.onloadRegister(main);
var G5Loaded = true;
