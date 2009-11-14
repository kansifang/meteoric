
function ubbReplace(srcString, replacewhat, imageLimit, imageOnloadFn, icdm){
    srcString = srcString.replace(/(.+)(\n|)/ig, "<p>$1&#173;</p>");
    srcString = srcString.replace(/\n/ig, "<p>&#173;</p>");
    srcString = srcString.replace(/<div>\s+?<\/div>/ig, "<p>&#173;</p>");
    this.ubbReplaceImage = function(srcString, bHrefFlag){
        if (/(all)|(image)/.test(replacewhat)) {
            var w = /sign/.test(replacewhat) ? "520,160" : ((/all/.test(replacewhat)) ? (oMediaWidth + ",999") : "520,999");
            if (!!imageLimit) 
                w = imageLimit;
            if (/imageLimit/.test(replacewhat)) {
                var limitCount = 0
                regstr = /\[img\]http(.[^\]\'\"]*)\[\/img\]/i;
                while (regstr.exec(srcString) != null) {
                    if (limitCount >= 1) 
                        srcString = srcString.replace(regstr, " <a href='http$1' target='_blank'>{点击查看贴图}</a> ");
                    else 
                        srcString = srcString.replace(regstr, "<wbr>" + (bHrefFlag ? "<a href='http$1' target='_blank'>" : "") + "<img onload='" + imageOnloadFn + "(this," + w + ")'  src='http$1' border='0'>" + (bHrefFlag ? "</a>" : "") + "<wbr> ");
                    limitCount++;
                }
            }
            else 
                if (/imageHide/.test(replacewhat)) {
                    regstr = /\[img\]http(.[^\]\'\"]*)\[\/img\]/ig;
                    srcString = srcString.replace(regstr, " <a href='http$1' target='_blank'>{点击查看贴图}</a> ");
                }
                else {
                    srcString = srcString.replace(/\[img,(\d{1,3}),(\d{1,3})\]http(.[^\]\'\"]*)\[\/img\]/ig, "<wbr><img src='http$3' border='0' width='$1' height='$2' onload='" + as + "(this," + oMediaWidth + ",1024,true)'><wbr>");
                    srcString = srcString.replace(/\[img\]http(.[^\]\'\"]*)\[\/img\]/ig, "<wbr>" + (bHrefFlag ? "<a href='http$1' target='_blank'>" : "") + "<img onload='" + imageOnloadFn + "(this," + w + ")'  src='http$1' border='0'>" + (bHrefFlag ? "</a>" : "") + "<wbr>");
                }
        }
        return srcString;
    }
    var regstr;
    var as;
    var fontSizeMap = [1, 2, 3, 4, 5, 6, 7];
    if (!imageOnloadFn) {
        imageOnloadFn = "picsize";
        as = "adjustSize";
    }
    else 
        as = imageOnloadFn;
    srcString = srcString.replace(/([\.\? -!:-@\[-`\{-~、。·ˉˇ¨〃々～‖…‘’“”〔〕〈〉！＂＃￥％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝ˊˋ﹐﹑﹒﹔﹕﹖﹗﹙﹚﹛﹜﹝﹞﹟﹠﹡﹢﹣﹤﹥﹦﹨﹩﹪﹫]{18})/g, "$1<wbr>")
    if (/(all)|(face)/.test(replacewhat)) 
        srcString = srcString.replace(/\[em\]e(\d{1,3})\[\/em\]/gi, "<img style='vertical-align:baseline  !important' src='http://" + icdm + "/qzone/em/e$1.gif'><wbr>");
    if (/(all)/.test(replacewhat)) 
        srcString = srcString.replace(/\[ol\]/gi, "<ol style='list-style-type:decimal'>").replace(/\[\/ol\]/gi, "</ol>").replace(/\[ul\]/gi, "<ul style='list-style-type:disc'>").replace(/\[\/ul\]/ig, "</ul>").replace(/\[li\]/gi, "<li style='margin:25px;'>").replace(/\[\/li\]/gi, "</li>");
    if (/(all)|(namecard)/.test(replacewhat)) {
        srcString = srcString.replace(/\[card=(\d+)\](.+?)\[\/card\]/g, "<a href='http://user.qzone.qq.com/$1' class='q_namecard' link='nameCard_$1' target='_blank'>$2</a>");
    }
    if (/(all)|(anchor)/.test(replacewhat)) {
        if (QZBlog.Logic.SpaceHostInfo.isFamousUser()) {
            srcString = srcString.replace(/\[url(|=([^\]]+))\]\[\/url\]/ig, function(){
                var args = arguments;
                var REG_HTTP = /^http:\/\/anchor/i;
                var href = "";
                if (REG_HTTP.test(args[2])) {
                    href = args[2];
                }
                else 
                    if (REG_HTTP.test(args[3])) {
                        href = args[3];
                    }
                if (!href) 
                    return args[0];
                return '<a href="' + href + '"></a><wbr>';
            });
        }
        srcString = srcString.replace(/\[url(|=([^\]]+))\](.+?)\[\/url\]/ig, function(){
            var args = arguments;
            var REG_HTTP = /^http:\/\//i;
            var INVALID_HREF_STRING = /[\"\']/i;
            var INVALID_EXPLAIN_STRING = /\[(em|video|flash|audio|quote|ffg|url|marque|email)/i;
            var WHITE_URI = /^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i;
            var explain = "";
            var href = "";
            if (!args[1]) {
                if (REG_HTTP.test(args[3])) {
                    explain = href = args[3];
                }
            }
            else {
                if (REG_HTTP.test(args[2])) {
                    explain = args[3];
                    href = args[2];
                }
                else 
                    if (REG_HTTP.test(args[3])) {
                        explain = args[2];
                        href = args[3];
                    }
            }
            if (!href || !explain || INVALID_HREF_STRING.test(href) || INVALID_EXPLAIN_STRING.test(explain)) {
                return args[0];
            }
            else {
                if (/\[img/gi.test(explain)) {
                    explain = this.ubbReplaceImage(explain, false);
                }
                if ((/all/.test(replacewhat) && QZBlog.Logic.SpaceHostInfo.isOwnerMode()) || (WHITE_URI.test(href) && !/blogjumper/.test(href))) {
                    return '<a href="' + href + '" target="_blank">' + explain + '</a><wbr>';
                }
                else {
                    return '<a href="' + href + '" link="' + href + '" target="_blank" ' + 'onclick="QZBlog.Logic.checkHrefURL(this);return false;">' + explain + '</a><wbr>';
                }
            }
        });
    }
    if (/all/.test(replacewhat)) {
        srcString = srcString.replace(/\[ppk_url=(http[^\]\"\']+)]([^\[]+)\[\/ppk_url\]/ig, "<a href='http://" + icdm + "/qzone/newblog/v5/blogjumper.html?domain=" + SPACE_MAIN_DOMAIN + "&url=$1' target='_blank' style='color:#EF6EA8'>$2</a><wbr>");
    }
    var oMediaWidth = (QZBlog.Util.isWideMode() ? 870 : 670);
    if (/(paper|prePaper)/.test(replacewhat)) {
        oMediaWidth = (QZBlog.Util.isWideMode() ? 810 : 630);
    }
    srcString = this.ubbReplaceImage(srcString, true);
    if (/(all)|(qqshow)/.test(replacewhat)) {
        srcString = srcString.replace(/\[qqshow,(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})(,.*?|)\]http(.[^\]\'\"]*)\[\/qqshow\]/ig, "<wbr><img transImg='1' src='http$6' border='0' width='$3' height='$4' onload='" + as + "(this," + oMediaWidth + ",1024,true)'><wbr>");
    }
    if (/(all)|(flash)/.test(replacewhat)) {
        regstr = /\[flash(,(\d{1,3}),(\d{1,3})|)\]([^\[]+?)\[\/flash\]/ig;
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            var url = args[4];
            var isQQVideo = /^http:\/\/((\w+\.|)(video|v|tv)).qq.com/i.test(url);
            var isImgCache = /^http:\/\/(?:cnc.|edu.)?imgcache.qq.com/i.test(url);
            var isComic = /^http:\/\/comic.qq.com/i.test(url);
            var netWorking = isQQVideo | isImgCache | isComic ? "all" : "internal";
            var fullScreen = isQQVideo ? "true" : "false";
            var scriptaccess = isQQVideo | isImgCache | isComic ? "always" : "never";
            if (args[1]) {
                var strHTML = QZONE.media.getFlashHtml({
                    allowscriptaccess: scriptaccess,
                    id: Math.random(),
                    allownetworking: netWorking,
                    allowFullScreen: fullScreen,
                    src: url,
                    width: ((oMediaWidth > 0 && args[2] > oMediaWidth) ? oMediaWidth : args[2]),
                    height: args[3]
                });
            }
            else {
                var strHTML = QZONE.media.getFlashHtml({
                    allowscriptaccess: scriptaccess,
                    id: Math.random(),
                    allownetworking: netWorking,
                    allowFullScreen: fullScreen,
                    src: url,
                    width: ((oMediaWidth > 0 && args[2] > oMediaWidth) ? oMediaWidth : "")
                });
            }
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
        regstr = /\[flasht,(\d{1,4}),(\d{1,4}),(\d{1,4}),(\d{1,4})\]([^\[]+?)\[\/flasht\]/ig;
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            strHTML = QZONE.media.getFlashHtml({
                wmode: "transparent",
                type: "application/octet-stream",
                style: "position:absolute;left:" + args[3] + ";top:" + args[4],
                quality: "high",
                menu: "false",
                id: Math.random(),
                id: Math.random(),
                allownetworking: "internal",
                src: args[5],
                height: args[2],
                width: ((oMediaWidth > 0 && args[1] > oMediaWidth) ? oMediaWidth : args[1])
            });
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
    }
    if (/(all)|(video)/.test(replacewhat)) {
        regstr = new RegExp("\\[video,([0-9]{1,3}),([0-9]{1,3}),([truefals]{4,5}),([truefals]{4,5})\\](http:\\/\\/video\\.qq\\.com\\/res\\/[\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "ig");
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            var strHTML = "<EMBED allowNetworking='all' enableContextMenu='False' src='" + args[5] + "' width='" + ((oMediaWidth > 0 && args[1] > oMediaWidth) ? oMediaWidth : args[1]) + "' height='" + args[2] + "' loop = '" + args[3] + "' autostart='" + args[4] + "' showstatusbar='1'/><wbr>";
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
        regstr = new RegExp("\\[video,([0-9]{1,3}),([0-9]{1,3}),([truefals]{4,5}),([truefals]{4,5})\\]([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "gi");
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            var strHTML = "<EMBED allowNetworking='internal' enableContextMenu='False' src='" + args[5] + "' width='" + ((oMediaWidth > 0 && args[1] > oMediaWidth) ? oMediaWidth : args[1]) + "' height='" + args[2] + "' loop = '" + args[3] + "' autostart='" + args[4] + "' showstatusbar='1'/><wbr>";
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
        regstr = new RegExp("\\[video,([truefals]{4,5}),([truefals]{4,5})\\](http:\\/\\/video\\.qq\\.com\\/res\\/[\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "ig");
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            var strHTML = "<EMBED allowNetworking='all' enableContextMenu='False' src='" + args[3] + "' loop = '" + args[1] + "' autostart='" + args[2] + "' showstatusbar='1'" + ((oMediaWidth > 0) ? (" width='" + oMediaWidth + "'") : "") + "/><wbr>";
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
        regstr = new RegExp("\\[video,([truefals]{4,5}),([truefals]{4,5})\\]([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\\-?\%/+\/]{1,})\\[\\/video\\]", "gi");
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            var strHTML = "<EMBED allowNetworking='internal' enableContextMenu='False' src='" + args[3] + "' loop = '" + args[1] + "' autostart='" + args[2] + "' showstatusbar='1'" + ((oMediaWidth > 0) ? (" width='" + oMediaWidth + "'") : "") + "/><wbr>";
            return '<img style="vertical-align:baseline  !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
    }
    if (/(all)|(vphoto)/.test(replacewhat)) {
        regstr = new RegExp("\\[vphoto,(\\d+),(\\d{5,11})](.*?)\\[\\/vphoto\\]", "ig");
        srcString = srcString.replace(regstr, function(){
            var args = arguments;
            return "<EMBED allowFullScreen='true' allowNetworking='all' enableContextMenu='False' src='http://" + IMGCACHE_DOMAIN + "/qzone/client/photo/swf/vphoto.swf?btn_play_btn=1&uin=" + args[2] + "&fid=" + args[1] + "' width='400' height='300' showstatusbar='1'/><wbr>";
        });
    }
    if (/(all)|(quote)/.test(replacewhat)) {
        var srcString = srcString.replace(/\[quote=([^\]]*)\]/gi, "\x00$1<br />\x02").replace(/\[\/quote\]/gi, "\x01").replace(/\[quote\]/gi, "\x00");
        var maxQuote = 2;
        for (var i = 0; i < maxQuote; i++) {
            srcString = srcString.replace(/\x00([^\x00\x01\x02]*)\x02?([^\x00\x01\x02]*)\x01/gi, function(a, b, c){
                if (c == "") 
                    return '<div class="comment_quote bor"><p>' + b + '</p></div>';
                else 
                    return '<div class="comment_quote bor"><p>' + b + '</p><p>引用内容：</p>' + c + '</div>';
            });
        }
        srcString = srcString.replace(/[\x00\x02\x01]/gi, "");
    }
    var fontCount = 0;
    var a;
    srcString = srcString.replace(/\[\/?quote[^\]]*\]/gi, "");
    if (/(all\b)|(glow\b)/.test(replacewhat) && QZONE.userAgent.ie) {
        regstr = /\[ffg,([#\w]{1,10}),([#\w]{1,10})\]/gi;
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, '<font style="filter: glow(color=$1,strength=3); display:inline-block; color:$2;">');
        }
    }
    else 
        if (/glow_limit/.test(replacewhat) && QZONE.userAgent.ie) {
            regstr = /\[ffg,([#\w]{1,10}),([#\w]{1,10})\](.{1,80})\[\/ft\]/gi;
            if (a = srcString.match(regstr)) {
                if (!/\[f/.test(a[3])) {
                    srcString = srcString.replace(regstr, '<font style="filter: glow(color=$1,strength=3); display:inline-block; color:$2;">$3</font>');
                }
            }
        }
    if (/(all\b)|(glow_msg\b)/.test(replacewhat) && QZONE.userAgent.ie) {
        srcString = srcString.replace(/\[cx1\]([^\r]*?)\[\/cx1\]/gi, '<span class="title_cx1">$1</span>');
        srcString = srcString.replace(/\[cx2\]([^\r]*?)\[\/cx2\]/gi, '<span class="title_cx2">$1</span>');
    }
    if (/(all)|(font)/.test(replacewhat)) {
        regstr = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]/g
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, "<font color='$1'><wbr>");
        }
        regstr = new RegExp("\\[ft=([^\\]]+)\\]", "gi");
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, function(){
                var s = arguments[1].split(",");
                var color = s[0] ? ' color=' + s[0] : '';
                var size = s[1] ? s[1] : null;
                var face = s[2] ? ' face=' + s[2] : '';
                return '<font' + color + face + (!size ? "" : (" size=" + fontSizeMap[size - 1])) + ' style="line-height:1.3em;">';
            });
        }
        regstr = new RegExp("\\[ftc=([a-zA-z#0-9]{1,10})\\]", "gi");
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, "<font color='$1'><wbr>");
        }
        regstr = new RegExp("\\[fts=([1-6]{1,1})\\]", "gi");
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, function(a, b){
                return "<font style='line-height:1.3em;'" + " size=" + fontSizeMap[b - 1] + "><wbr style='line-height:1.3em;'>";
            });
        }
        regstr = new RegExp("\\[ftf=([\u4E00-\u9FFFa-zA-Z_0-9\,&#=;\\ ]{1,})\\]", "gi");
        if (a = srcString.match(regstr)) {
            fontCount += a.length;
            srcString = srcString.replace(regstr, "<font face='$1'><wbr>");
        }
        regstr = new RegExp("\\[B\\]", "gi");
        srcString = srcString.replace(regstr, "<B><wbr>");
        regstr = new RegExp("\\[\\/B\\]", "gi");
        srcString = srcString.replace(regstr, "</B><wbr>");
        regstr = new RegExp("\\[M\\]", "gi");
        srcString = srcString.replace(regstr, "<center>");
        regstr = new RegExp("\\[\\/M\\]", "gi");
        srcString = srcString.replace(regstr, "</center>");
        regstr = new RegExp("\\[R\\]", "gi");
        srcString = srcString.replace(regstr, "<center style='text-align: right'>");
        regstr = new RegExp("\\[\\/R\\]", "gi");
        srcString = srcString.replace(regstr, "</center>");
        regstr = new RegExp("\\[U\\]", "gi");
        srcString = srcString.replace(regstr, "<U><wbr>");
        regstr = new RegExp("\\[\\/U\\]", "gi");
        srcString = srcString.replace(regstr, "</U><wbr>");
        regstr = new RegExp("\\[I\\]", "gi");
        srcString = srcString.replace(regstr, "<I><wbr>");
        regstr = new RegExp("\\[\\/I\\]", "gi");
        srcString = srcString.replace(regstr, "</I><wbr>");
    }
    regstr = /\[\/ft\]/gi;
    if (a = srcString.match(regstr)) {
        fontCount -= a.length;
        srcString = srcString.replace(regstr, "</font><wbr style='line-height:1.3em;'>");
    }
    if (fontCount > 0) {
        srcString += (new Array(fontCount + 1)).join("</font><wbr style='line-height:1.3em;'>");
    }
    srcString = srcString.replace(/\[\/?f[tf][^\]]*\]/g, "").replace(/\[\/?[BMRUI]\]/g, "")
    if (/(all)|(email)/.test(replacewhat)) {
        regstr = new RegExp("\\[email\\](.*?)\\[\\/email\\]", "g");
        srcString = srcString.replace(regstr, "<a href='mailto:$1' target='_blank'>$1</a><wbr>");
        regstr = new RegExp("\\[email=(.*?)\\](.*?)\\[\\/email\\]", "g");
        srcString = srcString.replace(regstr, "<a href='mailto:$2' target='_blank'>$1</a><wbr>");
    }
    if (/(all)|(marquee)/.test(replacewhat)) {
        regstr = new RegExp("\\[marque\\]", "g");
        srcString = srcString.replace(regstr, "<marquee><wbr>");
        regstr = new RegExp("\\[\\/marque\\]", "g");
        srcString = srcString.replace(regstr, "</marquee><wbr>");
    }
    if (/(all)|(audio)/.test(replacewhat)) {
        srcString = srcString.replace(/\[audio,(true|false),(true|false)(\]|,true\]|,false\])([\u2E80-\u9FFF0-9a-zA-Z&#=;.:_\-?\%\/+\/]{1,})\[\/audio\]/ig, function(a, a1, a2, a3, a4, b){
            var strHTML = "<EMBED allowNetworking='internal' src='" + a4 + "' loop='" + a1 + "' autostart='" + a2 + "'" + ((a3 == ",true]") ? " height='0' width='0'" : "") + " showstatusbar='1' /><wbr>";
            return '<img style="vertical-align:baseline !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none"/>';
        });
    }
    parent._musicParams = new parent.Array();
    if (/(all)|(audio)/.test(replacewhat)) {
        srcString = srcString.replace(/\[music\](.*?)\[\/music\]/ig, function(){
            var arr = arguments[1].split("|");
            var strHTML = QZONE.media.getFlashHtml({
                width: (arr.length / 6 > 1) ? 440 : 410,
                height: (arr.length / 6 > 1) ? 190 : 100,
                src: 'http://' + IMGCACHE_DOMAIN + '/music/musicbox_v2_1/img/MusicFlash.swf',
                bgColor: '#ffffff',
                scale: 'showall',
                wmode: 'opaque',
                id: 'musicFlash' + parent._musicParams.length,
                name: 'musicFlash' + parent._musicParams.length,
                menu: 'true',
                allowScriptAccess: 'always',
                wmode: "transparent"
            }, '9,0,0,0');
            parent._musicParams.push(arguments[0]);
            return '<img style="vertical-align:baseline !important" src="about:blank" srcHTML="' + strHTML + '" onerror="loadEmbed(this)" style="display:none" />';
        });
    }
    return srcString;
}

function adjustSize(obj, w, h, openWindows){
    var w0 = obj.width, h0 = obj.height, r = false;
    if (w0 < 1) {
        var i = new Image();
        i.src = obj.src;
        w0 = i.width;
        h0 = i.height;
    }
    if ((w0 / h0) > (w / h)) {
        if (w0 > w) {
            obj.style.width = w + "px";
            r = true;
            w0 = w;
        }
    }
    else {
        if (h0 > h) {
            obj.style.height = h + "px";
            r = true;
            h0 = h;
        }
    }
    if (openWindows && r) {
        obj.style.cursor = "pointer";
        obj.title = "点击预览原图";
        obj.onclick = function(){
            window.open(obj.src)
        }
    }
    obj.onload = null;
    if (!!obj.transImg && QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
        obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=" + obj.src + ", sizingmethod=scale);";
        obj.style.height = h0 + "px";
        obj.style.width = w0 + "px";
        obj.src = "/ac/b.gif";
    }
}

function picsize(obj, MaxWidth, MaxHeight){
    obj.onload = null;
    var img = new Image();
    img.src = obj.src;
    if (img.width > MaxWidth && img.height > MaxHeight) {
        if (img.width / img.height > MaxWidth / MaxHeight) {
            obj.height = MaxWidth * img.height / img.width;
            obj.width = MaxWidth;
        }
        else {
            obj.width = MaxHeight * img.width / img.height;
            obj.height = MaxHeight;
        }
    }
    else 
        if (img.width > MaxWidth) {
            obj.height = MaxWidth * img.height / img.width;
            obj.width = MaxWidth;
        }
        else 
            if (img.height > MaxHeight) {
                obj.width = MaxHeight * img.width / img.height;
                obj.height = MaxHeight;
            }
            else {
                obj.width = img.width;
                obj.height = img.height;
            }
}

function setImges(a){
    for (var i = 1; i < a.length; i++) {
        var img = $(a[i]);
        if (img) {
            img.src = a[0].src;
            img.style.display = "";
        }
    }
    a.length = 1;
    a[0].onload = null;
}

function showLinkBubble(o){
    var ele = o;
    if (!ele) {
        return;
    }
    QZONE.widget.bubble.show(ele, '<div style="padding-top:4px;color:#f00"><img src="http://' + IMGCACHE_DOMAIN + '/qzone_v4/bt_alert.gif" style="margin:0 2px -2px 0"/>为了您的QQ安全，请只打开来源可靠的网址。</div>', '<div><a href="' + ele.href + '" target="_blank" style="color:#00f;text-decoration:underline">打开链接</a><a href="javascript:void(0);" onclick="QZONE.FP.showMsgbox(\'您的举报已处理\',1,2000);" style="color:#00f;text-decoration:underline; padding-left:40px;">举报</a></div>', 5000, "", "contentLink");
}

function loadEmbed(o){
    o.onerror = null;
    setTimeout(function(){
        o.outerHTML = o.getAttribute("srcHTML")
    }, 100);
}/*  |xGv00|7bf61f95226e71af28febc90d9d76a1f */

