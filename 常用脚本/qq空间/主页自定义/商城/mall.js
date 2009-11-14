var g_vBrandSpaceActivityInfo_1_1;
document.write('<script src="http://imgcache.qq.com/qzone/biz/config/brand_activity_1_1.js"></script>')
var g_mallStaticsWebDir = 'http://imgcache.qq.com/qzone/mall/v5';
var g_mallStaticDir = 'http://imgcache.qq.com/qzone/mall/static/';
var g_needShowRec = false;
if (parent.hideSearchSelect) {
    if (document.attachEvent) {
        document.attachEvent('onclick', parent.hideSearchSelect);
    } else {
        document.addEventListener('click', parent.hideSearchSelect, false);
    }
}
function $(id) {
    return document.getElementById(id);
}
function checksearch(keywords, n) {
    if (n == 0 && keywords.value == "关键字") {
        keywords.value = "";
        keywords.style.cssText = "color:#3C3C3C";
    }
    if (n == 1) {
        if (keywords.value == "关键字") {
            keywords.value = "";
        }
        keywords.style.cssText = "color:#3C3C3C";
    }
    if (n == 2 && keywords.value == "") {
        keywords.value = "关键字";
        keywords.style.cssText = "color:#C9C9C9";
    }
    if (n == 3) {
        if (keywords.value != "") {
            keywords.value = "";
        }
        keywords.style.cssText = "color:#3C3C3C";
    }
}
function showPageList(curPage, totalPage, pagesPerList, linkFormat, type) {
    if (curPage < 1 || totalPage <= 1 || curPage > totalPage) return "";
    var m = [];
    var startPageNo = curPage - parseInt(pagesPerList / 2) < 1 ? 1 : curPage - parseInt(pagesPerList / 2);
    var endPageNo = startPageNo + pagesPerList - 1 > totalPage ? totalPage: startPageNo + pagesPerList - 1;
    var count = endPageNo - startPageNo + 1;
    startPageNo = count != pagesPerList ? (startPageNo - (pagesPerList - count)) : startPageNo;
    startPageNo = startPageNo < 1 ? 1 : startPageNo;
    var prePageNo = curPage > 1 ? curPage - 1 : 1;
    var nextPageNo = curPage < totalPage ? curPage + 1 : totalPage;
    var reg = new RegExp("{no}", "g");
    var url;
    var i;
    m[m.length] = '<div class="pagination">';
    if (1 == curPage) {
        m[m.length] = '<img src="http://imgcache.qq.com/qzone_v4/mall/img/page_prev.gif" alt="上一页" />|';
    } else {
        url = linkFormat.replace(reg, prePageNo);
        if (type == 'html') m[m.length] = '<a href="' + url + '"><img src="http://imgcache.qq.com/qzone_v4/mall/img/page_prev.gif" alt="上一页" /></a>|';
        else m[m.length] = '<img style="cursor:hand" onclick="' + url + '"src="http://imgcache.qq.com/qzone_v4/mall/img/page_prev.gif" alt="上一页" />|';
    }
    for (i = startPageNo; i <= endPageNo; i++) {
        url = linkFormat.replace(reg, i);
        if (i == curPage) {
            m[m.length] = '<span class="noce">' + i + '</span>|';
        }
        else m[m.length] = '<a href="' + url + '">' + i + '</a>|';
    }
    if (totalPage == curPage) {
        m[m.length] = '<img src="http://imgcache.qq.com/qzone_v4/mall/img/page_next.gif" alt="下一页" />';
    } else {
        url = linkFormat.replace(reg, nextPageNo);
        if (type == 'html') m[m.length] = '<a href="' + url + '"><img src="http://imgcache.qq.com/qzone_v4/mall/img/page_next.gif" alt="下一页" /></a>|';
        else m[m.length] = '<img style="cursor:hand" onclick="' + url + '"src="http://imgcache.qq.com/qzone_v4/mall/img/page_next.gif" alt="下一页" />';
    }
    m[m.length] = '</div>';
    return m.join("");
}
function showGoPage(totalPage, callback) {
    if (totalPage <= 1) return "";
    var m = [];
    m[m.length] = '<div class="select_page">';
    if (typeof callback == 'function') {
        m[m.length] = '第<input id="gopage" onkeyup="if(event.keyCode==13) goPage(' + totalPage + ',' + callback + ');" name="gopage" type="text" class="page_text" />/' + totalPage + '页';
        m[m.length] = '<input name="" onclick="javascritp:goPage(' + totalPage + ',' + callback + ');" type="button" value="go" class="go" /></div>';
    }
    else {
        m[m.length] = '第<input id="gopage" onkeyup="if(event.keyCode==13) goPage(' + totalPage + ',\'' + callback + '\');" name="gopage" type="text" class="page_text" />/' + totalPage + '页';
        m[m.length] = '<input name="" onclick="javascritp:goPage(' + totalPage + ',\'' + callback + '\');" type="button" value="go" class="go" /></div>';
    }
    return m.join("");
}
function goPage(totalPage, callback) {
    var oName = getParameter("mall");
    var type = getParameter("type");
    var selecttype = "";
    if (type == "select") selecttype = getParameter("select_t");
    var div = document.getElementById("gopage");
    var goingPage = parseInt(div.value);
    if (isNaN(goingPage)) {
        alert("请输入数字");
        div.focus();
        div.select();
        return false;
    }
    if (goingPage < 1 || goingPage > totalPage) {
        alert('您输入的页码超出正常范围');
        div.focus();
        div.select();
        return false;
    }
    if (typeof callback != 'function') {
        var reg = new RegExp("{no}", "g");
        location = callback.replace(reg, goingPage);
        return;
    }
    if (type == "select") callback(oName, goingPage, type, selecttype);
    else callback(oName, goingPage, type);
}
function getTypeStr(type) {
    var mallType = {
        1 : "皮肤",
        2 : "挂件",
        3 : "banner",
        4 : "鼠标方案",
        5 : "漂浮物",
        6 : "播放器",
        7 : "个性花藤",
        8 : "个性标志",
        9 : "大头贴前景（小）",
        10 : " 大头贴边框（小）",
        11 : "大头贴前景（大）",
        12 : "公告栏",
        13 : "导航菜单",
        14 : "欢迎动画",
        15 : "礼品盒",
        16 : "flash挂件",
        17 : "花边",
        18 : "播放器2.0",
        19 : "标题栏",
        31 : "套装",
        20 : "黄钻宝贝",
        22 : "魔法秀"
    };
    return mallType[type];
}
function getPackTypeStr(type) {
    var typeStr = {
        1 : "普通包",
        2 : "特供包",
        3 : "商业包"
    };
    return typeStr[type];
}
function getItemTypeStr(itemtype) {
    var mallItemtype = {
        0 : "普通商城item",
        1 : "iCoke专用item",
        2 : "黄钻专用",
        3 : "特供",
        4 : "非卖品",
        5 : "折扣品",
        6 : "折扣品",
        7 : "特卖"
    };
    return mallItemtype[itemtype];
}
function tQccItemParse(obj) {
    if (typeof(obj) != "object") return null;
    var asuit = obj.suitItems;
    fixJsonArrayLength(asuit);
    if (typeof(asuit) != "undefined") {
        for (var k = 0; k < asuit.length; k++)
        tQccItemParse(asuit[k]);
    }
    obj.imgurl = 'http://cp.paipai.com/item_pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '.gif'
    obj.bimgurl = obj.imgurl;
    obj.name = formatString(obj.Fitem_name, 12);
    obj.Fexpire_time += '';
    if (obj.Fexpire_time.match(/^\d{4}-\d{2}-\d{2}/)) {
        obj.Fexpire_time = obj.Fexpire_time.substring(0, 10);
    }
    obj.nsprice = obj.vsprice = '见店铺';
    obj.nsunit = obj.vsunit = '';
    obj.posx = obj.posy = obj.width = obj.height = obj.zindex = 0;
    return obj;
}
function tMallItemParse(obj) {
    var level = 0;
    var bVIP = (top.getVipFlag && top.getVipFlag("diamon") == "1") ? true: false;
    if (bVIP && typeof(top.g_JData.yellowInfo) != 'undefined') level = top.g_JData["yellowInfo"].ownerinfo[0].level;
    else level = 0;
    if (typeof(obj) != "object") return null;
    obj.imgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '.gif'
    obj.bimgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '_1.gif'
    if (obj.Ftype_id == 31) {
        if (obj.Fitem_id > 50000000) {
            obj.imgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/packitem/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '.gif'
            obj.bimgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/packitem/big_pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '_1.gif'
            obj.bimgurl_2 = 'http://qzonestyle.gtimg.cn/qzone/space_item/packitem/big_pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '_2.gif'
        }
        else {
            obj.imgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '.gif'
            obj.bimgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '_1.gif'
            obj.bimgurl_2 = 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (obj.Fitem_id % 16) + '/' + obj.Fitem_id + '_2.gif'
        }
    }
    obj.itemtype = getItemTypeStr(obj.Fitem_type);
    obj.type = getTypeStr(obj.Ftype_id);
    if (typeof(top.ItemNameMaxLength) == "undefined") top.ItemNameMaxLength = 12;
    obj.name = formatString(obj.Fitem_name, top.ItemNameMaxLength)
    if ((0 == obj.Fitem_type || 1 == obj.Fitem_type) && '7' != obj.Ftype_id && '20' != obj.Ftype_id) {
        obj.nprice = parseInt(obj.Fprice * obj.Fdiscount / 100);
        obj.vprice = 0;
        obj.nsprice = formatNumber((obj.nprice / 100.0), 1);
        obj.nsunit = 'Q币'
        obj.vsprice = '免费用';
        obj.split = '|';
        obj.vsplit = '';
        obj.nqprice = (obj.nprice / 10);
        obj.nqunit = 'Q点';
    } else if (2 == obj.Fitem_type) {
        obj.nprice = 3000;
        obj.vprice = 0;
        obj.nsprice = '黄钻专用';
        obj.vsprice = '免费用';
        obj.vsplit = '';
    }
    else if (3 == obj.Fitem_type || 5 == obj.Fitem_type || 6 == obj.Fitem_type) {
        obj.nprice = parseInt(obj.Fprice * obj.Fdiscount / 100);
        obj.vprice = parseInt(obj.Fvip_price < obj.nprice ? (obj.Fvip_price) : (obj.nprice));
        obj.nsprice = formatNumber((obj.nprice / 100.0), 1);
        obj.sdprice = '<span style=\"text-decoration:line-through;color:#FF6699\">' + formatNumber((obj.nprice / 78.0), 1) + '</span>';
        obj.nsunit = 'Q币'
        obj.vsprice = formatNumber((obj.vprice / 100.0), 1);
        obj.vsunit = 'Q币';
        obj.vqprice = "价:" + (obj.vprice / 10);
        obj.vqunit = 'Q点';
        obj.vsplit = '|';
        obj.split = '|';
        obj.nqprice = (obj.nprice / 10);
        obj.nqunit = 'Q点';
        if (level != 1) {
            obj.sdprice = 0;
            obj.vprice = 0;
            obj.vsprice = 'Lv2免费';
            obj.vsunit = '';
        }
        else {
            if (0) vsp = (obj.vsprice).toString().substr(0, 2);
            else vsp = obj.vsprice;
            obj.vsprice = vsp;
        }
    }
    else if (7 == obj.Fitem_type) {
        obj.nprice = parseInt(obj.Fprice * obj.Fdiscount / 100);
        obj.vprice = parseInt(obj.Fvip_price < obj.nprice ? (obj.Fvip_price) : (obj.nprice));
        obj.nsprice = formatNumber((obj.nprice / 100.0), 1);
        obj.sdprice = '<span style=\"text-decoration:line-through;color:#FF6699\">' + formatNumber((obj.nprice / 78.0), 1) + '</span>';
        obj.nsunit = 'Q币'
        obj.vsprice = formatNumber((obj.vprice / 100.0), 1);
        obj.vsunit = 'Q币';
        obj.split = '|';
        obj.nqprice = (obj.nprice / 10);
        obj.nqunit = 'Q点';
        obj.vqprice = "价:" + (obj.vprice / 10);
        obj.vqunit = 'Q点';
        obj.vsplit = '|';
    }
    else {
        obj.nprice = 100000000;
        obj.vprice = obj.nprice;
        obj.nsprice = '赠品';
        obj.vsprice = '赠品';
    }
    var day = parseInt(obj.Fitem_exptime);
    if (day < 31) {
        obj.exptime = parseInt(day / 7) + "周";
    } else {
        obj.exptime = parseInt(day / 31) + "个月";
    }
    obj.Fexpire_time += '';
    if (obj.Fexpire_time.match(/^\d{4}-\d{2}-\d{2}/)) {
        obj.Fexpire_time = obj.Fexpire_time.substring(0, 10);
    }
    obj.Fdate += '';
    if (obj.Fdate.match(/^\d{4}-\d{2}-\d{2}/)) {
        obj.Fdate = obj.Fdate.substring(0, 10);
    }
    obj.posx = obj.posy = obj.width = obj.height = obj.zindex = 0;
    switch (obj.Ftype_id) {
    case '1':
        var desc = obj.Fdesc;
        var pos = desc.indexOf("@");
        if (pos != -1) {
            var contype = desc.substr(0, pos);
            if (contype == 1) {
                obj.posx = 175;
            }
            desc = desc.substring(pos + 1);
        }
        if (0 == obj.Fitem_mode) {
            obj.zindex = 1 << 3;
            if ('jpg' == desc) obj.zindex += 1;
        } else if (1 == obj.Fitem_mode) {
            var m = desc.split("|");
            if (2 == m.length) {
                var m1 = m[0].split("_");
                if (3 == m1.length) {
                    obj.posy = m1[0];
                    obj.zindex += (m1[1] << 5);
                    if ('jpg' == m1[2]) obj.zindex += 1 << 1;
                }
                if ('jpg' == m[1]) obj.zindex += 1 << 2;
                obj.zindex += 1 << 4;
            }
        } else if (2 == obj.Fitem_mode) {
            var m = desc.split("|");
            if (3 == m.length) {
                if ('jpg' == m[0]) obj.zindex += 1;
                var m1 = m[1].split("_");
                if (3 == m1.length) {
                    obj.posy = m1[0];
                    obj.zindex += (m1[1] << 5);
                    if ('jpg' == m1[2]) obj.zindex += 1 << 1;
                }
                if ('jpg' == m[2]) obj.zindex += 1 << 2;
                obj.zindex += 1 << 3;
                obj.zindex += 1 << 4;
            }
        }
        else if (5 == obj.Fitem_mode) {
            var m = desc.split("|");
            if (3 == m.length) {
                if ('jpg' == m[0]) obj.zindex += 1;
                var m1 = m[1].split("_");
                if (3 == m1.length) {
                    obj.posy = m1[0];
                    obj.zindex += (m1[1] << 5);
                    if ('jpg' == m1[2]) obj.zindex += 1 << 1;
                }
                if ('jpg' == m[2]) obj.zindex += 1 << 2;
                obj.zindex += 1 << 3;
                obj.zindex += 1 << 4;
            }
        }
        break;
    case '5':
        var m = obj.Fdesc.split("|");
        if (2 == m.length) {
            obj.posy = m[0];
            obj.width = m[1];
        }
        break;
    case '7':
        obj.level = obj.Fvip_price;
        break;
    case '11':
        obj.zindex = obj.Fdesc;
        break;
    case '13':
        obj.zindex = obj.Fdesc;
        break;
    case '19':
        var desc = obj.Fdesc + "";
        if (desc.indexOf("gif") != -1) obj.zindex = 0;
        if (desc.indexOf("jpg") != -1) obj.zindex = 1;
        if (desc.indexOf("png") != -1) obj.zindex = 2;
        if (parseInt(desc) > 100) {
            obj.zindex += 4;
            obj.posy = parseInt(desc);
        }
        var pw = 0;
        if ((pw = desc.indexOf('|')) != -1) obj.width = parseInt(desc.substr(pw + 1));
        break;
    }
    return obj;
}
function tPackMallItemParse(obj) {
    if (typeof(obj) != "object") return null;
    obj.packimgurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/packitem/pre/' + (obj.Fpack_id % 16) + '/' + obj.Fpack_id + '.gif'
    obj.packbigurl = 'http://qzonestyle.gtimg.cn/qzone/space_item/packitem/big_pre/' + (obj.Fpack_id % 16) + '/' + obj.Fpack_id + '_1.gif'
    obj.packtype = getTypeStr(obj.Ftype);
    obj.packname = formatString(obj.Fpack_name, 12)
    if (obj.Fpack_id < 50000000) {
        if (1 == obj.Ftype) {
            obj.packnprice = parseInt(obj.Fpack_price * obj.Fpack_discount / 100);
            obj.packvprice = 0;
            obj.packnsprice = formatNumber((obj.packnprice / 100.0), 1);
            obj.packnsunit = 'Q币'
            obj.packvsprice = '免费';
        } else if (2 == obj.Ftype) {
            obj.packnprice = parseInt(obj.Fpack_price * obj.Fpack_discount / 100);
            obj.packvprice = parseInt(obj.Fpack_vip_price < obj.packnprice ? (obj.Fpack_vip_price) : (obj.packnprice));
            obj.packnsprice = formatNumber((obj.packnprice / 100.0), 1);
            obj.packnsunit = 'Q币'
            obj.packvsprice = '免费';
        } else if (3 == obj.Ftype) {
            obj.packnprice = 0;
            obj.packvprice = 0;
            obj.packnsprice = '免费';
            obj.packnsunit = '免费'
            obj.packvsprice = '免费';
        }
    }
    else {
        obj.packnprice = parseInt(obj.Fprice * obj.Fdiscount / 100);
        obj.packvprice = parseInt(obj.Fvip_price < obj.packnprice ? (obj.Fvip_price) : (obj.packnprice));
        obj.packnsprice = formatNumber((obj.packnprice / 100.0), 1);
        obj.packnsunit = 'Q币';
        obj.packvsprice = formatNumber((obj.packvprice / 100.0), 1);
        obj.packvsunit = 'Q币';
    }
    var j = 0;
    fixJsonArrayLength(obj.items);
    for (j = 0; j < obj.items.length; j++)
    tMallItemParse(obj.items[j]);
    return obj;
}
function tMyBigHeadParse(obj) {
    if (typeof(obj) != "object") return null;
    obj.htmlurl = obj.Furl.substr(0, obj.Furl.length - 3) + 'html'
    obj.Ftype_id = 11;
}
function tPackItemArrayInfo(array) {
    if (typeof(array) != "object") {
        return null;
    }
    var i = 0;
    for (i = 0; i < array.length; i++) {
        tPackMallItemParse(array[i]);
    }
    return array;
}
function tItemArrayInfo(array) {
    if (typeof(array) != "object") {
        return null;
    }
    var i = 0;
    fixJsonArrayLength(array);
    for (i = 0; i < array.length; i++) {
        tMallItemParse(array[i]);
        if (typeof(array[i].suitItems) == "object" && (array[i].suitItems.length) > 0) {
            var sitems = array[i].suitItems;
            fixJsonArrayLength(sitems);
            for (var ii = 0; ii < sitems.length; ii++) {
                tMallItemParse(sitems[ii]);
            }
        }
    }
    return array;
}
function tMyItemArrayInfo(array) {
    if (typeof(array) != "object") return null;
    var i = 0;
    for (i = 0; i < array.length; i++) {
        if (array[i].ITEMTYPE && array[i].ITEMTYPE == 'MALL') {
            tMallItemParse(array[i]);
            if (array[i].Ftype_id == 31) {
                array[i].name = "套装:" + array[i].name;
            }
            var asuit = array[i].suitItems;
            fixJsonArrayLength(asuit);
            if (typeof(asuit) != "undefined") {
                for (var k = 0; k < asuit.length; k++)
                tMallItemParse(asuit[k]);
            }
        }
        else if (array[i].ITEMTYPE && array[i].ITEMTYPE && array[i].ITEMTYPE == 'QCC') tQccItemParse(array[i]);
        if (array[i].Fexpire_time == '9999-12-31') {
            array[i].Fexpire_time = '永不过期';
        }
    }
    return array;
}
var g_mallHistory = {
    init: function() {
        if (typeof(top.mallHistoryList) == "undefined") {
            top.mallHistoryList = [];
        }
    },
    gotoHistory: function(n) {
        if (!n || !top.mallHistoryList[n]) return;
        eval(top.mallHistoryList[n]);
    },
    saveHistory: function(command) {
        this.init();
        top.mallHistoryList[top.mallHistoryList.length] = command;
        document.getElementById('historyFrame').src = "http://mall.qzone.qq.com/comm/web/mallhistory.htm?" + (top.mallHistoryList.length % 2) + "#" + Number(top.mallHistoryList.length - 1);
    }
}
var g_mallMenuCommon = {
    mall: {
        end: {
            pnode: -1
        },
        hp: {
            name: "首页",
            cUrl: g_mallStaticsWebDir + "/web/mall/home.htm",
            pnode: "end",
            bitmap: '101',
            left: "0px"
        },
        newhp: {
            name: "新品",
            cUrl: 49,
            pnode: "hp",
            bitmap: '1111'
        },
        tzjq: {
            name: '套装',
            cUrl: 419,
            pnode: "end",
            bitmap: '117',
            left: "520px",
            cn: 6,
            c: [{
                name: '颜色'
            },
            {
                name: '套装图方向'
            },
            {
                name: "情感"
            },
            {
                name: "风格"
            },
            {
                name: "主题"
            },
            {
                name: "件数"
            }]
        },
        tzjq_black: {
            name: "黑",
            cUrl: 490,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_white: {
            name: "白",
            cUrl: 491,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_blue: {
            name: "蓝",
            cUrl: 492,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_green: {
            name: "绿",
            cUrl: 493,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_purple: {
            name: "紫",
            cUrl: 494,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_yellow: {
            name: "黄",
            cUrl: 495,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_red: {
            name: "红",
            cUrl: 496,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        tzjq_pink: {
            name: "粉",
            cUrl: 497,
            pnode: "tzjq",
            bitmap: '117',
            b: 0
        },
        bighouseskin: {
            name: '上侧',
            cUrl: 299,
            pnode: 'tzjq',
            bitmap: '117',
            b: 1
        },
        bighouse: {
            name: '右侧',
            cUrl: 281,
            pnode: 'tzjq',
            bitmap: '117',
            left: "585px",
            b: 1
        },
        tzjq_qq: {
            name: '亲情',
            cUrl: 473,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 2
        },
        tzjq_aq: {
            name: '爱情',
            cUrl: 472,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 2
        },
        tzjj: {
            name: '简洁',
            cUrl: 284,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzka: {
            name: '可爱',
            cUrl: 285,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzjq_swzq: {
            name: '商务',
            cUrl: 488,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzuniq: {
            name: '限量',
            cUrl: 364,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzjq_lomo: {
            name: 'LOMO',
            cUrl: 486,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzjq_kx: {
            name: '酷炫',
            cUrl: 283,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 3
        },
        tzjq_dm: {
            name: '动漫',
            cUrl: 482,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 4
        },
        tzjq_sj: {
            name: "四季",
            cUrl: 484,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 4
        },
        tzjq_rw: {
            name: "人物",
            cUrl: 585,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 4
        },
        tz4: {
            name: '四件套',
            cUrl: 287,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 5
        },
        tz5: {
            name: '五件套',
            cUrl: 435,
            pnode: "tzjq",
            bitmap: '117',
            left: "450px",
            b: 5
        },
        zq: {
            name: "专区",
            cUrl: '',
            pnode: "end",
            bitmap: '111',
            select: '1',
            left: "32px",
            cn: 6,
            c: [{
                name: "四季节日"
            },
            {
                name: "我爱电影"
            },
            {
                name: "明星艺人"
            },
            {
                name: "其他"
            },
            {
                name: "卡通馆"
            },
            {
                name: "QCC"
            }]
        },
        zq_spring: {
            name: "春",
            cUrl: 144,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_summer: {
            name: "夏",
            cUrl: 153,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_fall: {
            name: "秋",
            cUrl: 173,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_winter: {
            name: "冬",
            cUrl: 174,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_newyear: {
            name: "新年春节",
            cUrl: 86,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_valotine: {
            name: "情人节",
            cUrl: 92,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_christmas: {
            name: "圣诞节",
            cUrl: 85,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_season_other: {
            name: "其他",
            cUrl: 350,
            pnode: "zq",
            bitmap: '111',
            b: 0,
            select: '1'
        },
        zq_spider: {
            name: '蜘蛛侠',
            cUrl: 353,
            pnode: "zq",
            bitmap: '111',
            b: 1,
            select: '1'
        },
        zq_gongfu: {
            name: '功夫之王',
            cUrl: 354,
            pnode: "zq",
            bitmap: '111',
            b: 1,
            select: '1'
        },
        zq_chibi: {
            name: '赤壁',
            cUrl: 355,
            pnode: "zq",
            bitmap: '111',
            b: 1,
            select: '1'
        },
        zq_actor: {
            name: "男艺人",
            cUrl: 351,
            pnode: "zq",
            bitmap: '111',
            b: 2,
            select: '1'
        },
        zq_actress: {
            name: "女艺人",
            cUrl: 352,
            pnode: "zq",
            bitmap: '111',
            b: 2,
            select: '1'
        },
        zq_love: {
            name: "情侣",
            cUrl: 117,
            pnode: "zq",
            bitmap: '111',
            b: 3,
            select: '1'
        },
        zq_constellation: {
            name: "星座",
            cUrl: 114,
            pnode: "zq",
            bitmap: '111',
            b: 3,
            select: '1'
        },
        zq_tencent: {
            name: "腾讯产品",
            cUrl: 291,
            pnode: "zq",
            bitmap: '111',
            b: 3,
            select: '1'
        },
        zq_free: {
            name: "默认",
            cUrl: 434,
            pnode: "zq",
            bitmap: '111',
            b: 3,
            select: '1'
        },
        zq_disney: {
            name: "迪士尼",
            cUrl: 264,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        zq_pig: {
            name: "黑白猪",
            cUrl: 229,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        zq_mabu: {
            name: "马布",
            cUrl: 201,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        zq_dumi: {
            name: "嘟咪",
            cUrl: 203,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        zq_chicaloca: {
            name: "Chicaloca",
            cUrl: 194,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        park_index: {
            name: "青春校园",
            cUrl: 642,
            pnode: "zq",
            bitmap: '111',
            b: 4,
            select: '1'
        },
        skin: {
            name: '皮肤',
            cUrl: 10,
            pnode: "end",
            bitmap: '1101',
            left: "72px",
            cn: 5,
            c: [{
                name: "颜色"
            },
            {
                name: "皮肤图方向"
            },
            {
                name: "情感"
            },
            {
                name: "风格"
            },
            {
                name: "主题"
            }]
        },
        skin_black: {
            name: "黑",
            cUrl: 372,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_white: {
            name: "白",
            cUrl: 373,
            pnode: "skin",
            bitmap: '110',
            b: 0
        },
        skin_blue: {
            name: "蓝",
            cUrl: 374,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_green: {
            name: "绿",
            cUrl: 375,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_purple: {
            name: "紫",
            cUrl: 376,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_yellow: {
            name: "黄",
            cUrl: 377,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_red: {
            name: "红",
            cUrl: 378,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_pink: {
            name: "粉",
            cUrl: 379,
            pnode: "skin",
            bitmap: '1101',
            b: 0
        },
        skin_wide: {
            name: "上侧",
            cUrl: 296,
            pnode: "skin",
            bitmap: '1101',
            b: 1
        },
        sk_right: {
            name: "右侧",
            cUrl: 10,
            pnode: "skin",
            bitmap: '1101',
            b: 1
        },
        sk_left: {
            name: "左侧",
            cUrl: 263,
            pnode: "skin",
            bitmap: '1101',
            b: 1
        },
        skin_qq: {
            name: "亲情",
            cUrl: 436,
            pnode: "skin",
            bitmap: '1101',
            b: 2
        },
        skin_aq: {
            name: "爱情",
            cUrl: 438,
            pnode: "skin",
            bitmap: '1101',
            b: 2
        },
        skin_youshang: {
            name: "忧伤",
            cUrl: 602,
            pnode: "skin",
            bitmap: '1101',
            b: 2
        },
        skin_jm: {
            name: "寂寞",
            cUrl: 615,
            pnode: "skin",
            bitmap: '1101',
            b: 2
        },
        sk_cute: {
            name: "可爱",
            cUrl: 12,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_concise: {
            name: "简洁",
            cUrl: 18,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_lomo: {
            name: "LOMO",
            cUrl: 248,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_swzq: {
            name: "商务",
            cUrl: 452,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_campus: {
            name: "校园",
            cUrl: 451,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_zgf: {
            name: "中国风",
            cUrl: 453,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        sk_kx: {
            name: "酷炫",
            cUrl: 450,
            pnode: "skin",
            bitmap: '1101',
            b: 3
        },
        skin_dm: {
            name: "动漫",
            cUrl: 446,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_sj: {
            name: "四季",
            cUrl: 448,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_rw: {
            name: "人物",
            cUrl: 590,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_pet: {
            name: "宠物",
            cUrl: 307,
            pnode: "skin",
            bitmap: '110',
            b: 4
        },
        skin_qc: {
            name: "汽车",
            cUrl: 443,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_ps: {
            name: "配饰",
            cUrl: 442,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_yd: {
            name: "运动",
            cUrl: 441,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_jr: {
            name: "节日",
            cUrl: 445,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        skin_ys: {
            name: "影视",
            cUrl: 537,
            pnode: "skin",
            bitmap: '1101',
            b: 4
        },
        movie: {
            name: "动画",
            cUrl: 103,
            pnode: "end",
            bitmap: '1101',
            left: "130px",
            cn: 4,
            c: [{
                name: "颜色"
            },
            {
                name: "情感"
            },
            {
                name: "风格"
            },
            {
                name: "主题"
            }]
        },
        movie_black: {
            name: "黑",
            cUrl: 380,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_white: {
            name: "白",
            cUrl: 381,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_blue: {
            name: "蓝",
            cUrl: 382,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_green: {
            name: "绿",
            cUrl: 383,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_purple: {
            name: "紫",
            cUrl: 384,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_yellow: {
            name: "黄",
            cUrl: 385,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_red: {
            name: "红",
            cUrl: 386,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_pink: {
            name: "粉",
            cUrl: 387,
            pnode: "movie",
            bitmap: '1101',
            b: 0
        },
        movie_qq: {
            name: "亲情",
            cUrl: 455,
            pnode: "movie",
            bitmap: '1101',
            b: 1
        },
        movie_aq: {
            name: "爱情",
            cUrl: 454,
            pnode: "movie",
            bitmap: '1101',
            b: 1
        },
        movie_yq: {
            name: "友情",
            cUrl: 456,
            pnode: "movie",
            bitmap: '1101',
            b: 1
        },
        movie_youshang: {
            name: "忧伤",
            cUrl: 599,
            pnode: "movie",
            bitmap: '1101',
            b: 1
        },
        movie_jm: {
            name: "寂寞",
            cUrl: 618,
            pnode: "movie",
            bitmap: '1101',
            b: 1
        },
        mv_cute: {
            name: "可爱",
            cUrl: 126,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        mv_concise: {
            name: "简洁",
            cUrl: 363,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        mv_lomo: {
            name: "LOMO",
            cUrl: 262,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        mv_swzq: {
            name: "商务",
            cUrl: 470,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        mv_campus: {
            name: "校园",
            cUrl: 469,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        movie_zgf: {
            name: "中国风",
            cUrl: 471,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        movie_kx: {
            name: "酷炫",
            cUrl: 468,
            pnode: "movie",
            bitmap: '1101',
            b: 2
        },
        movie_dm: {
            name: "动漫",
            cUrl: 464,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_sj: {
            name: "四季",
            cUrl: 466,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_rw: {
            name: "人物",
            cUrl: 587,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_pet: {
            name: "宠物",
            cUrl: 316,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_qc: {
            name: "汽车",
            cUrl: 461,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_yd: {
            name: "运动",
            cUrl: 459,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_jr: {
            name: "节日",
            cUrl: 463,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        movie_ys: {
            name: "影视",
            cUrl: 467,
            pnode: "movie",
            bitmap: '1101',
            b: 3
        },
        player: {
            name: "播放器",
            cUrl: 51,
            pnode: "end",
            bitmap: '1101',
            left: "190px",
            cn: 6,
            c: [{
                name: "颜色"
            },
            {
                name: "功能"
            },
            {
                name: "适合情感"
            },
            {
                name: "适合风格"
            },
            {
                name: "适合主题"
            },
            {
                name: "质地"
            }]
        },
        player_black: {
            name: "黑",
            cUrl: 396,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_white: {
            name: "白",
            cUrl: 397,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_blue: {
            name: "蓝",
            cUrl: 398,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_green: {
            name: "绿",
            cUrl: 399,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_purple: {
            name: "紫",
            cUrl: 400,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_yellow: {
            name: "黄",
            cUrl: 401,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_red: {
            name: "红",
            cUrl: 402,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_pink: {
            name: "粉",
            cUrl: 403,
            pnode: "player",
            bitmap: '1101',
            b: 0
        },
        player_nm: {
            name: "普通",
            cUrl: 51,
            pnode: "player",
            bitmap: '1101',
            b: 1
        },
        player_dgn: {
            name: "多功能",
            cUrl: 147,
            pnode: "player",
            bitmap: '1101',
            b: 1
        },
        player_qq: {
            name: "亲情",
            cUrl: 499,
            pnode: "player",
            bitmap: '1101',
            b: 2
        },
        player_aq: {
            name: "爱情",
            cUrl: 498,
            pnode: "player",
            bitmap: '1101',
            b: 2
        },
        player_youshang: {
            name: "忧伤",
            cUrl: 600,
            pnode: "player",
            bitmap: '1101',
            b: 2
        },
        player_jm: {
            name: "寂寞",
            cUrl: 617,
            pnode: "player",
            bitmap: '1101',
            b: 2
        },
        player_ll: {
            name: "简洁",
            cUrl: 325,
            pnode: "player",
            bitmap: '1101',
            b: 3
        },
        player_cute: {
            name: "可爱",
            cUrl: 122,
            pnode: "player",
            bitmap: '1101',
            b: 3
        },
        player_swzq: {
            name: "商务",
            cUrl: 516,
            pnode: "player",
            bitmap: '1101',
            b: 3
        },
        player_lomo: {
            name: "LOMO",
            cUrl: 512,
            pnode: "player",
            bitmap: '1101',
            b: 3
        },
        player_kx: {
            name: "酷炫",
            cUrl: 514,
            pnode: "player",
            bitmap: '1101',
            b: 3
        },
        player_dm: {
            name: "动漫",
            cUrl: 508,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_sj: {
            name: "四季",
            cUrl: 510,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_rw: {
            name: "人物",
            cUrl: 588,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_pet: {
            name: "宠物",
            cUrl: 323,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_qc: {
            name: "汽车",
            cUrl: 505,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_yd: {
            name: "运动",
            cUrl: 503,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_jr: {
            name: "节日",
            cUrl: 507,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_ys: {
            name: "影视",
            cUrl: 511,
            pnode: "player",
            bitmap: '1101',
            b: 4
        },
        player_tm: {
            name: "半透明",
            cUrl: 326,
            pnode: "player",
            bitmap: '1101',
            b: 5
        },
        player_btm: {
            name: "不透明",
            cUrl: 327,
            pnode: "player",
            bitmap: '1101',
            b: 5
        },
        dh: {
            name: "导航",
            cUrl: 100,
            pnode: "end",
            bitmap: '1101',
            left: "250px",
            cn: 6,
            c: [{
                name: "颜色"
            },
            {
                name: "展向"
            },
            {
                name: "适合情感"
            },
            {
                name: "适合风格"
            },
            {
                name: "适合主题"
            },
            {
                name: "质地"
            }]
        },
        dh_black: {
            name: "黑",
            cUrl: 404,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_white: {
            name: "白",
            cUrl: 405,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_blue: {
            name: "蓝",
            cUrl: 406,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_green: {
            name: "绿",
            cUrl: 407,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_purple: {
            name: "紫",
            cUrl: 408,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_yellow: {
            name: "黄",
            cUrl: 409,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_red: {
            name: "红",
            cUrl: 410,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        dh_pink: {
            name: "粉",
            cUrl: 411,
            pnode: "dh",
            bitmap: '1101',
            b: 0
        },
        hxdh: {
            name: "横向",
            cUrl: 157,
            pnode: "dh",
            bitmap: '1101',
            b: 1
        },
        zxdh: {
            name: "纵向",
            cUrl: 179,
            pnode: "dh",
            bitmap: '1101',
            b: 1,
            h: 1
        },
        dh_qq: {
            name: "亲情",
            cUrl: 519,
            pnode: "dh",
            bitmap: '1101',
            b: 2
        },
        dh_aq: {
            name: "爱情",
            cUrl: 518,
            pnode: "dh",
            bitmap: '1101',
            b: 2
        },
        dh_youshang: {
            name: "忧伤",
            cUrl: 598,
            pnode: "dh",
            bitmap: '1101',
            b: 2
        },
        dh_jm: {
            name: "寂寞",
            cUrl: 619,
            pnode: "dh",
            bitmap: '1101',
            b: 2
        },
        kadh: {
            name: "可爱",
            cUrl: 140,
            pnode: "dh",
            bitmap: '1101',
            b: 3
        },
        jjdh: {
            name: "简洁",
            cUrl: 141,
            pnode: "dh",
            bitmap: '1101',
            b: 3
        },
        dh_swzq: {
            name: "商务",
            cUrl: 534,
            pnode: "dh",
            bitmap: '1101',
            b: 3
        },
        dh_lomo: {
            name: "LOMO",
            cUrl: 532,
            pnode: "dh",
            bitmap: '1101',
            b: 3
        },
        dh_kx: {
            name: "酷炫",
            cUrl: 139,
            pnode: "dh",
            bitmap: '1101',
            b: 3
        },
        dh_dm: {
            name: "动漫",
            cUrl: 528,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_sj: {
            name: "四季",
            cUrl: 530,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_rw: {
            name: "人物",
            cUrl: 586,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_qc: {
            name: "汽车",
            cUrl: 525,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_pet: {
            name: "宠物",
            cUrl: 333,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_yd: {
            name: "运动",
            cUrl: 523,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_jr: {
            name: "节日",
            cUrl: 527,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_ys: {
            name: "影视",
            cUrl: 531,
            pnode: "dh",
            bitmap: '1101',
            b: 4
        },
        dh_tm: {
            name: "半透明",
            cUrl: 335,
            pnode: "dh",
            bitmap: '1101',
            b: 5
        },
        dh_btm: {
            name: "不透明",
            cUrl: 336,
            pnode: "dh",
            bitmap: '1101',
            b: 5
        },
        titledec: {
            name: '标题栏',
            cUrl: 297,
            pnode: "end",
            bitmap: '1101',
            left: "570px",
            cn: 4,
            c: [{
                name: "颜色"
            },
            {
                name: "适合情感"
            },
            {
                name: "适合风格"
            },
            {
                name: "适合主题"
            }]
        },
        title_black: {
            name: "黑",
            cUrl: 388,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_white: {
            name: "白",
            cUrl: 389,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_blue: {
            name: "蓝",
            cUrl: 390,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_green: {
            name: "绿",
            cUrl: 391,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_purple: {
            name: "紫",
            cUrl: 392,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_yellow: {
            name: "黄",
            cUrl: 393,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_red: {
            name: "红",
            cUrl: 394,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_pink: {
            name: "粉",
            cUrl: 395,
            pnode: "titledec",
            bitmap: '1101',
            b: 0
        },
        title_qq: {
            name: "亲情",
            cUrl: 537,
            pnode: "titledec",
            bitmap: '1101',
            b: 1
        },
        title_aq: {
            name: "爱情",
            cUrl: 536,
            pnode: "titledec",
            bitmap: '1101',
            b: 1
        },
        title_youshang: {
            name: "忧伤",
            cUrl: 601,
            pnode: "titledec",
            bitmap: '1101',
            b: 1
        },
        title_jm: {
            name: "寂寞",
            cUrl: 616,
            pnode: "titledec",
            bitmap: '1101',
            b: 1
        },
        title_swzq: {
            name: "商务",
            cUrl: 553,
            pnode: "titledec",
            bitmap: '1101',
            b: 2
        },
        title_lomo: {
            name: "LOMO",
            cUrl: 550,
            pnode: "titledec",
            bitmap: '1101',
            b: 2
        },
        title_zgf: {
            name: "中国风",
            cUrl: 554,
            pnode: "titledec",
            bitmap: '1101',
            b: 2
        },
        title_kx: {
            name: "酷炫",
            cUrl: 551,
            pnode: "titledec",
            bitmap: '1101',
            b: 2
        },
        title_dm: {
            name: "动漫",
            cUrl: 546,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_sj: {
            name: "四季",
            cUrl: 548,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_rw: {
            name: "人物",
            cUrl: 589,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_qc: {
            name: "汽车",
            cUrl: 543,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_yd: {
            name: "运动",
            cUrl: 541,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_jr: {
            name: "节日",
            cUrl: 545,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        title_ys: {
            name: "影视",
            cUrl: 549,
            pnode: "titledec",
            bitmap: '1101',
            b: 3
        },
        dec: {
            name: "装饰",
            cUrl: 17,
            pnode: "end",
            bitmap: '1102',
            left: "420px"
        },
        bighouseguajian: {
            name: '立体挂件',
            cUrl: 298,
            pnode: 'dec',
            bitmap: '1102'
        },
        magicshow: {
            name: '魔法秀',
            cUrl: 242,
            pnode: "dec",
            bitmap: '1102'
        },
        petmagicshow: {
            name: '宠物',
            cUrl: 252,
            pnode: "magicshow",
            bitmap: '1102'
        },
        othermagicshow: {
            name: '其他',
            cUrl: 253,
            pnode: "magicshow",
            bitmap: '1102'
        },
        gjdec: {
            name: "挂件",
            cUrl: 15,
            pnode: "dec",
            bitmap: '1102'
        },
        phwdec: {
            name: "漂浮",
            cUrl: 32,
            pnode: "dec",
            bitmap: '1102'
        },
        bannerdec: {
            name: "banner",
            cUrl: 16,
            pnode: "dec",
            bitmap: '1102'
        },
        sbdec: {
            name: "鼠标",
            cUrl: 31,
            pnode: "dec",
            bitmap: '1102'
        },
        ggldec: {
            name: "公告栏",
            cUrl: g_mallStaticsWebDir + "/web/mall/template_cbg_t.htm",
            pnode: "dec",
            bitmap: '200'
        },
        myhdec: {
            name: "运势符",
            cUrl: 131,
            pnode: "dec",
            bitmap: '1102'
        },
        rlsz: {
            name: '日历时钟',
            cUrl: 239,
            pnode: "dec",
            bitmap: '1102'
        },
        hbdec: {
            name: "花边",
            cUrl: 134,
            pnode: "dec",
            bitmap: '1102'
        },
        cbgflower_t: {
            name: "藏宝阁",
            cUrl: g_mallStaticsWebDir + "/prop/prop.htm",
            pnode: "dec",
            bitmap: '200'
        },
        flashqcc: {
            name: "QCC皮肤",
            cUrl: "http://imgcache.qq.com/qzone/mall/v3/qcc/qcc_mall_49_1.htm",
            pnode: "dec",
            bitmap: '200'
        },
        hldhqcc: {
            name: "QCC动画",
            cUrl: "http://imgcache.qq.com/qzone/mall/v3/qcc/qcc_mall_14_1.htm",
            pnode: "dec",
            bitmap: '200'
        },
        big: {
            name: "大头贴",
            cUrl: 29,
            pnode: "end",
            bitmap: '106',
            left: "300px"
        },
        tjbig: {
            name: "推荐",
            cUrl: 29,
            pnode: "big",
            bitmap: '106',
            left: "0px"
        },
        ztbig: {
            name: "主题",
            cUrl: 160,
            pnode: "big",
            bitmap: '106',
            left: "25px"
        },
        xzbig: {
            name: "星座",
            cUrl: 161,
            pnode: "ztbig",
            bitmap: '106'
        },
        rdbig: {
            name: "热点",
            cUrl: 162,
            pnode: "ztbig",
            bitmap: '106'
        },
        jrbig: {
            name: "节日",
            cUrl: 163,
            pnode: "ztbig",
            bitmap: '106'
        },
        ppbig: {
            name: "品牌",
            cUrl: 164,
            pnode: "ztbig",
            bitmap: '106'
        },
        qmbig: {
            name: "签名",
            cUrl: 172,
            pnode: "ztbig",
            bitmap: '106'
        },
        fmbig: {
            name: "封面",
            cUrl: 75,
            pnode: "big",
            bitmap: '106',
            left: "60px"
        },
        zrbig: {
            name: "自然",
            cUrl: 71,
            pnode: "fmbig",
            bitmap: '106'
        },
        ssbig: {
            name: "时尚",
            cUrl: 165,
            pnode: "fmbig",
            bitmap: '106'
        },
        csbig: {
            name: "成熟",
            cUrl: 166,
            pnode: "fmbig",
            bitmap: '106'
        },
        kxbig: {
            name: "酷炫",
            cUrl: 167,
            pnode: "fmbig",
            bitmap: '106'
        },
        ktbig: {
            name: "卡通",
            cUrl: 168,
            pnode: "big",
            bitmap: '106',
            left: "95px"
        },
        zgbig: {
            name: "整蛊",
            cUrl: 72,
            pnode: "ktbig",
            bitmap: '106'
        },
        kabig: {
            name: "可爱",
            cUrl: 169,
            pnode: "ktbig",
            bitmap: '106'
        },
        lybig: {
            name: "灵异",
            cUrl: 73,
            pnode: "ktbig",
            bitmap: '106'
        },
        ysbig: {
            name: "影视",
            cUrl: 170,
            pnode: "ktbig",
            bitmap: '106'
        },
        ysvip: {
            name: '黄钻专属',
            desc: 'Qzone的特殊群体—黄钻贵族，有着别样的生活姿态',
            cUrl: 52,
            pnode: "end",
            bitmap: '113',
            cn: 3,
            c: [{
                name: '尊贵'
            },
            {
                name: '青春'
            },
            {
                name: '挂件'
            }]
        },
        ys_ch_mj: {
            name: '尾戒',
            desc: '尾戒是一种幸福，圈住你和TA，延续两个人的故事与动人的情感',
            cUrl: 420,
            pnode: "ysvip",
            bitmap: '113',
            b: 0
        },
        ys_cy_mh: {
            name: '魔幻',
            desc: '用虚实交错的艺术笔触来绘画魔幻作品是一种不可多得的深度高端绘画，黄钻尊属',
            cUrl: 423,
            pnode: "ysvip",
            bitmap: '113',
            b: 0
        },
        ys_cy_xz: {
            name: '小资',
            desc: '小众姿态它可以是一种态度，也可以是一种情绪，表达关于你我他的生活',
            cUrl: 424,
            pnode: "ysvip",
            bitmap: '113',
            b: 0
        },
        ys_ch_zs: {
            name: '钻石',
            desc: '',
            cUrl: 421,
            pnode: "ysvip",
            bitmap: '113',
            b: 0
        },
        ys_qc_rw: {
            name: '热舞',
            desc: '',
            cUrl: 632,
            pnode: "ysvip",
            bitmap: '113',
            b: 1
        },
        ys_mytenpay: {
            name: '零花钱挂件',
            cUrl: g_mallStaticsWebDir + "/web/myitem/set_tenpay_hang.html?",
            pnode: "ysvip",
            bitmap: '113',
            b: 2
        },
        big: {
            name: "大头贴",
            cUrl: 29,
            pnode: "end",
            bitmap: '106',
            left: "580px"
        },
        qbean: {
            name: "Q豆",
            cUrl: g_mallStaticsWebDir + "/web/mall/special/qbean_v5.htm",
            pnode: "end",
            bitmap: '200',
            left: "620px"
        },
        mag: {
            name: "空间志",
            cUrl: g_mallStaticsWebDir + "/mag/index.htm",
            pnode: "end",
            bitmap: '200',
            left: "620px"
        },
        mymall: {
            name: "我的装扮",
            cUrl: g_mallStaticsWebDir + "/web/myitem/mymall.htm?type=0",
            pnode: "end",
            bitmap: '200',
            left: "620px",
            right: "0"
        },
        mymgr: {
            name: "装扮管理首页",
            cUrl: g_mallStaticsWebDir + "/web/myitem/mymall.htm?type=0",
            pnode: "mymall",
            bitmap: '200'
        },
        myitem: {
            name: "物品管理",
            cUrl: g_mallStaticsWebDir + "/web/myitem/myitem.htm",
            pnode: "mymall",
            bitmap: '200'
        },
        currentmyitem: {
            name: "当前拥有的物品",
            cUrl: g_mallStaticsWebDir + "/web/myitem/myitem.htm",
            pnode: "myitem",
            bitmap: '200'
        },
        expiredmyitem: {
            name: "已过期物品",
            cUrl: g_mallStaticsWebDir + "/web/myitem/myitem.htm?type=-1",
            pnode: "myitem",
            bitmap: '200'
        },
        dttmyitem: {
            name: "大头贴",
            cUrl: g_mallStaticsWebDir + "/web/myitem/mybighead.htm",
            pnode: "myitem",
            bitmap: '200'
        },
        cbgflower: {
            name: "藏宝阁",
            cUrl: g_mallStaticsWebDir + "/prop/prop.htm",
            pnode: "myitem",
            bitmap: '200'
        },
        currig: {
            name: "装扮方案管理",
            cUrl: g_mallStaticsWebDir + "/web/myitem/scenario_item.htm",
            pnode: "mymall",
            bitmap: '200'
        },
        hisrig: {
            name: "历史装扮",
            cUrl: g_mallStaticsWebDir + "/web/myitem/scenario_history.htm",
            pnode: "currig",
            bitmap: '200'
        },
        tempitem: {
            name: "暂存夹",
            cUrl: g_mallStaticsWebDir + "/web/myitem/temporary_item.htm",
            pnode: "currig",
            bitmap: '200'
        },
        favorite: {
            name: "收藏夹",
            cUrl: g_mallStaticsWebDir + "/web/myitem/favorite_list.htm",
            pnode: "mymall",
            bitmap: '200'
        },
        mymsg: {
            name: "消息记录",
            cUrl: g_mallStaticsWebDir + "/web/myitem/askformsg.htm",
            pnode: "mymall",
            bitmap: '200'
        },
        mymall_shares: {
            name: '<font color="#FF6600">装扮分享</font>',
            cUrl: "http://imgcache.qq.com/qzone/mall/v5/web/myitem/shares.htm",
            pnode: "mymall",
            bitmap: '200'
        },
        mytenpay: {
            name: "零花钱计划",
            cUrl: "http://imgcache.qq.com/qzone/mall/v5/web/myitem/set_tenpay_hang.html?",
            pnode: "mymall",
            bitmap: '200'
        },
        diy_home: {
            name: "个性装扮",
            cUrl: g_mallStaticsWebDir + "/web/mall/template_diy.htm",
            pnode: -1,
            bitmap: '200'
        },
        diy_skin: {
            name: '自定义皮肤',
            cUrl: g_mallStaticsWebDir + "/web/mall/template_skin.htm",
            pnode: -1,
            bitmap: '200'
        },
        diy_title: {
            name: "自定义标题栏",
            cUrl: g_mallStaticsWebDir + "/web/mall/template_title.htm",
            pnode: -1,
            bitmap: '200'
        },
        diy_dh: {
            name: "自定义导航",
            cUrl: g_mallStaticsWebDir + "/web/mall/template_title.htm",
            pnode: -1,
            bitmap: '200'
        },
        searchitem: {
            name: "搜索",
            cUrl: g_mallStaticsWebDir + "/web/mall/search.htm",
            pnode: -1,
            bitmap: '200'
        },
        createbag: {
            name: "购物车",
            cUrl: "javascript:mallShopBag()",
            pnode: -1,
            bitmap: '200'
        },
        scenario: {
            name: "保存方案",
            cUrl: "javascript:g_mallSave.mallSave()",
            pnode: -1,
            bitmap: '200'
        }
    },
    reform: {
        init: false,
        subinit: false
    },
    opstep: 1,
    init: function() {
        if (this.reform.init) return;
        for (var i in this.mall) {
            if ((typeof(this.mall[i].ver) != 'undefined') && (this.mall[i].ver == 3) && (top.g_fullMode < 3)) continue;
            this.mall[i].oName = i;
            var node = this.mall[i]["pnode"];
            if (this.reform[node] == null) {
                this.reform[node] = [];
            }
            this.mall[i].index = this.reform[node].length;
            this.reform[node][this.reform[node].length] = this.mall[i];
        }
        this.reform.init = true;
    },
    initSubCon: function() {
        if (this.reform.subinit) return;
        for (var j = 0; j < this.reform['end'].length; j++) {
            var str = [];
            var oName = this.reform['end'][j].oName;
            if (this.reform[oName]) {
                for (var i = 0; i < this.reform[oName].length; i++) {
                    if ((this.reform[oName][i]).h != null) continue;
                    if (this.reform[oName][i].oName == "rechp") str[str.length] = '<li id="id_' + this.reform[oName][i].oName + '" style="display:none"><span></span>'
                    else str[str.length] = '<li id="id_' + this.reform[oName][i].oName + '"><span></span>'
                    str[str.length] = '<a href="javascript:g_mallMenuCommon.createUrl(\'' + this.reform[oName][i].oName + '\')" >' + this.reform[oName][i]["name"] + '</a>'
                    str[str.length] = '</li>'
                }
                this.reform[oName].subConStr = str.join("");
            }
        }
        this.reform.subinit = true;
    },
    getLevel: function(oName) {
        var node = oName;
        if (!this.mall[node]) return null;
        var iLevel = 0;
        while (this.mall[node]['pnode'] != -1) {
            iLevel++;
            node = this.mall[node]['pnode'];
        }
        return iLevel;
    },
    getLevelNode: function(oName, level) {
        var node = oName;
        if (!this.mall[node]) return null;
        this.init();
        level = level || 1;
        for (var i = 0; i < level; i++) {
            node = this.mall[node]['pnode'];
            if (this.mall[node]['pnode'] == -1) break;
        }
        return this.mall[node]['oName'];
    },
    getLevelCon: function(oName, level) {
        var node = oName;
        if (!this.mall[node]) return null;
        this.init();
        level = level || 0;
        for (var i = 0; i < level; i++) {
            node = this.mall[node]['pnode'];
            if (this.mall[node]['pnode'] == -1) break;
        }
        return this.reform[node];
    },
    getLevelPath: function(oName) {
        var node = oName;
        if (!this.mall[node]) return null;
        var data = []
        while (node != 'end') {
            data[data.length] = this.mall[node];
            node = this.mall[node]["pnode"];
        }
        return data.reverse();
    },
    getAncestor: function(oName) {
        var node = oName;
        if (!this.mall[node] || this.mall[node]['pnode'] == -1) return null;
        while (this.mall[node]['pnode'] != 'end') {
            node = this.mall[node]['pnode'];
        }
        return this.mall[node].oName;
    },
    create: function(id) {
        if (!id) return;
        for (var i in this.mall) {
            if (this.mall[i]["cUrl"] == id) {
                this.createUrl(i);
                return;
            }
        }
    },
    createUrl: function(oName, c, t, select_t) {
        g_mallStaticsWebDir = 'http://imgcache.qq.com/qzone/mall/v5';
        var sUrl = '';
        switch (oName) {
        case 'zq_spring':
        case 'zq_summer':
        case 'zq_fall':
        case 'zq_winter':
        case 'zq_newyear':
        case 'zq_valotine':
        case 'zq_christmas':
        case 'zq_season_other':
        case 'zq_spider':
        case 'zq_gongfu':
        case 'zq_chibi':
        case 'zq_classic':
        case 'zq_actor':
        case 'zq_actress':
        case 'zq_love':
        case 'zq_tencent':
        case 'zq_constellation':
        case 'zq_brand':
        case 'park_index':
        case 'zq_disney':
        case 'zq_free':
        case 'zq_pig':
        case 'zq_mabu':
        case 'zq_dumi':
        case 'zq_chicaloca':
            sUrl = 'http://imgcache.qq.com/qzone/mall/v5/web/mall/template_areaitem.htm?areaId=' + this.mall[oName]["cUrl"];
            var target = document.getElementById('main');
            if (!target) target = parent.document.getElementById('main');
            target.src = sUrl;
            return;
        case 'zq':
            if (oName == 'zq') {
                c = (c == 1) ? 0 : c || 0;
                if (c) {
                    sUrl = 'http://imgcache.qq.com/qzone/mall/v5/web/mall/template_areaitem.htm?areaId=' + c;
                } else {
                    sUrl = 'http://imgcache.qq.com/qzone/mall/v5/web/mall/template_areahome.htm';
                }
                var target = document.getElementById('main');
                if (!target) target = parent.document.getElementById('main');
                target.src = sUrl;
                return;
            }
        }
        if (!this.mall[oName]) {
            alert("mall url error: " + oName);
            return;
        }
        this.opstep++;
        this.clickObj = oName;
        this.curPage = c || 1;
        this.type = t || "";
        if (select_t) this.select_t = select_t;
        var m = [];
        var bitmap = this.mall[oName]["bitmap"].split("");
        if (bitmap.length < 3) {
            alert("bitmap error now");
            return
        }
        if (!isNaN(this.mall[oName]["cUrl"])) {
            if ('1' == bitmap[0]) {
                switch (bitmap[2]) {
                case '0':
                    if ('1' == bitmap[3]) {
                        m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_black_json.htm';
                    } else if ('2' == bitmap[3]) {
                        m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_dec_json.htm';
                    } else if ('3' == bitmap[3]) {
                        m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_magic_json.htm';
                    } else {
                        m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_small_json.htm';
                    }
                    break;
                case '1':
                    if (this.mall[oName]["select"] && this.mall[oName]["select"] == "1") m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_select_json.htm'
                    else {
                        if ('1' == bitmap[3]) {
                            m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_new_json.htm'
                        } else {
                            m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_normal_json.htm'
                        }
                    }
                    break;
                case '2':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_big_json.htm';
                    break;
                case '3':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_yellow_json.htm';
                    break;
                case '4':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_flower_json.htm';
                    break;
                case '5':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/pub.htm';
                    break;
                case '6':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/bigheadmall_new.htm';
                    break;
                case '7':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/suitlist_json.htm';
                    break;
                case '8':
                    if ('1' == bitmap[3]) m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_discount1_json.htm';
                    else if ('2' == bitmap[3]) m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_discount2_json.htm';
                    else if ('3' == bitmap[3]) m[m.length] = g_mallStaticsWebDir + '/web/mall/special/dh_custom.htm';
                    else m[m.length] = g_mallStaticsWebDir + '/web/mall/itemlist_loving_china_json.htm';
                    break;
                case '9':
                    m[m.length] = g_mallStaticsWebDir + '/web/mall/recitemlist_json.htm';
                    break;
                default:
                    alert("template no find")
                    return;
                }
                m[m.length] = '?' + this.opstep % 2;
                m[m.length] = '#mall=' + oName
                m[m.length] = '&option=' + bitmap[1]
                m[m.length] = "&curpage=" + this.curPage;
                m[m.length] = "&type=" + this.type;
                if (select_t) m[m.length] = "&select_t=" + this.select_t;
                sUrl = m.join("");
                if ('6' == bitmap[2]) {
                    try {
                        var target = document.frames["sub_frame"];
                        if ( !! target) {
                            var url = target.location.href;
                            if (url.indexOf("qface.qq.com") != -1) {
                                target.document.getElementById("tinfo").src = sUrl;
                                return;
                            }
                        }
                    }
                    catch(ignore) {}
                    sUrl = "http://imgcache.qq.com/qzone/mall/bighead/v3/bigheadnew_v5.htm?url=" + sUrl;
                }
                this.mallWeb = oName;
            } else if ('2' == bitmap[0]) {
                if ('myitem' == this.mall[oName]['pnode']) {
                    m[m.length] = this.mall['myitem'].cUrl;
                    m[m.length] = '?' + this.opstep % 2
                    m[m.length] = '#mall=' + oName
                    m[m.length] = "&curpage=" + this.curPage;
                    m[m.length] = "&type=" + this.mall[oName].cUrl;
                    sUrl = m.join("");
                }
            } else if ('3' == bitmap[0]) {
                m[m.length] = g_mallStaticsWebDir + '/web/pack/packitemlist_json.htm'
                m[m.length] = '?' + this.opstep % 2;
                m[m.length] = '#mall=' + oName
                m[m.length] = '&option=' + bitmap[1]
                m[m.length] = "&curpage=" + this.curPage;
                m[m.length] = "&type=" + this.type;
                sUrl = m.join("");
                this.mallWeb = oName;
            }
        } else if (this.mall[oName]["cUrl"].indexOf("http") != -1) {
            this.mallWeb = oName;
            m[m.length] = this.mall[oName]["cUrl"];
            m[m.length] = (this.mall[oName]["cUrl"].indexOf("?") != -1) ? ('&' + this.opstep % 2) : ('?' + this.opstep % 2)
            m[m.length] = '#mall=' + oName
            m[m.length] = "&curpage=" + this.curPage;
            m[m.length] = "&type=" + this.type;
            if (oName == "title_diy") m[m.length] = "&diy=title"
            sUrl = m.join("");
        } else if (this.mall[oName]["cUrl"].indexOf("javascript") != -1) {
            var sFun = this.mall[oName]["cUrl"].split(":");
            if (sFun.length > 0) eval(sFun[1]);
            return;
        } else {
            alert("error");
            return;
        }
        var target = document.getElementById('main');
        if (!target) target = parent.document.getElementById('main');
        target.src = sUrl;
        return;
    },
    showMenu: function() {
        this.init();
        FillDiv_Ex("nav", this.reform);
        var div = document.getElementById("nav");
        if (div) {
            var m = div.getElementsByTagName("A");
            for (var i = 0; i < this.reform['end'].length; i++)
            this.reform['end'][i].divObj = m[i];
        }
        var bHave = false;
        var node = getParameter("target");
        if (node == 'big') {
            var redirecturl = unescape(getParameter("redirecturl"));
            if (redirecturl) {
                var loadUrl = "";
                if (redirecturl.indexOf("loadurl=") != -1) {
                    var sPic = redirecturl.split("loadurl=");
                    if (sPic[1]) {
                        loadUrl = sPic[1];
                    }
                }
                this.createUrl(node, 1, "&loadurl=" + loadUrl);
            } else {
                this.createUrl(node);
            }
            this.subMenuObj = document.getElementById("SubMenu");
            this.subMenuConObj = document.getElementById("SubMenuCon");
            if (this.mall[node]['pnode'] != -1) this.showClickDivObj(node);
            this.initSubCon();
            return;
        } else if (node) {
            for (var i in this.mall) {
                if (i == node) {
                    bHave = true;
                    break;
                }
            }
        }
        if (!bHave) {
            node = 'hp';
        }
        this.createUrl(node);
        this.subMenuObj = document.getElementById("SubMenu");
        this.subMenuConObj = document.getElementById("SubMenuCon");
        this.showClickDivObj(node);
        this.initSubCon();
    },
    showRec: function() {
        g_needShowRec = true;
        if (g_needShowRec) {
            this.reform["hp"].subConStr = this.reform["hp"].subConStr.replace("display:none", "");
        }
        var topLink = document.getElementById("id_rec");
        if (topLink) {
            topLink.style.display = "block";
        }
    },
    showHostScenario: function() {
        var node = getParameter("target");
        if (node == 'hostscenario') {
            var ItemList = getParameter("host_item_list").split('|');
            for (i = 0; i < ItemList.length; i++) {
                var Item = ItemList[i].split('_');
                if ((Item[0] == 19) && top.zoneMode == "qzone") continue;
                playInScenario(Item[0], Item[1], 0, 0, 0, 0, Item[2]);
            }
            this.createUrl('currig');
        }
        return;
    },
    showClickDivObj: function(oName) {
        var divObj;
        var node = oName || this.clickObj;
        if (this.oldDivObj) this.oldDivObj.className = "";
        node = this.getAncestor(node);
        if (!node) return;
        divObj = this.reform['end'][this.mall[node].index].divObj
        divObj.className = "bgr2 nonce";
        this.oldDivObj = divObj;
        var showFun = typeof(showHomeMenu) == 'function' ? showHomeMenu: parent.showHomeMenu;
        if (showFun) {
            if (node == 'mymall') {
                showFun('myhome');
            } else {
                showFun('home');
            }
        }
    },
    showSubMenu: function(oName) {
        if (oName == 'big') {
            this.showClickDivObj(oName);
            this.moveObj = oName;
            return;
        }
        this.initSubCon()
        if (this.reform[oName] && this.reform[oName].subConStr) {
            if (this.subMenuObj) {
                this.subMenuConObj.innerHTML = this.reform[oName].subConStr;
                if (this.mall[oName].right) {
                    with(this.subMenuObj.style) {
                        left = 'auto';
                        right = this.mall[oName].right;
                        display = "";
                    }
                }
                else if (this.mall[oName].left) {
                    with(this.subMenuObj.style) {
                        left = this.mall[oName].left
                        display = "";
                    }
                }
            }
        }
        this.showClickDivObj(oName);
        this.moveObj = oName;
    },
    hideSubMenu: function() {
        if (this.subMenuObj) {
            this.subMenuObj.style.display = "none";
        }
        this.showClickDivObj()
    },
    createNow: function() {
        var oName = this.mallWeb || 'hp';
        var c = this.curPage || 1;
        var t = this.type || "";
        var select_t = this.select_t;
        this.createUrl(oName, c, t, select_t);
    }
}
function getCookie(name) {
    var r = new RegExp("(^|;|\s)*" + name + "=([^;]*)(;|$)");
    var m = document.cookie.match(r);
    return (!m ? "": m[2]);
}
function openYellowService() {
    var url = "http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&subtype=1&style=client&clientuin=" + getCookie("zzpaneluin") + "&clientkey=" + getCookie("zzpanelkey") + "&cid=QZ_C_1061&sid=QZ_S_1005&wid=QZ_W_1002";
    if (document.frames["sub_frame"]) document.frames["sub_frame"].location = url;
    else location = url
}
function openYellowServiceBlank() {
    var url = "http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&subtype=1&clientuin=" + getCookie("zzpaneluin") + "&clientkey=" + getCookie("zzpanelkey") + "&cid=QZ_C_1061&sid=QZ_S_1005&wid=QZ_W_1002";
    window.open(url, "_blank");
}
function mallSubWebInit(binHistory, bnotmall) {
    try {
        var oName = getParameter("mall");
        var curpage = getParameter("curpage") || 1;
        var type = getParameter("type");
        var select_t = "";
        if (type == "select") select_t = getParameter("select_t");
        var option = parseInt(getParameter("option"));
        mallSubWebDataDeal.init(oName, curpage, type, binHistory, select_t);
        if (!bnotmall) {
            mallLeftNavigation(oName);
            mallSubPos(oName);
            parent.g_mallMenuCommon.showClickDivObj(oName);
        }
    } catch(ex) {
        status = ex.description;
    }
}
function mallSubCgiWebInit(b) {
    try {
        var oName = getParameter("mall");
        var curpage = getParameter("curpage");
        mallLeftNavigation(oName);
        mallSubPos(oName);
        parent.g_mallMenuCommon.showClickDivObj(oName);
        adjustHeight();
    } catch(ex) {
        status = ex.description;
    }
}
function mallSubWebSort(type, select_t) {
    var oName = getParameter("mall");
    if (type != "select") parent.g_mallMenuCommon.createUrl(oName, 1, type);
    else {
        if (select_t == "null") return;
        else parent.g_mallMenuCommon.createUrl(oName, 1, type, select_t);
    }
}
function collapseMenu(obj) {
    if (obj.className == 'nav_open') {
        obj.className = 'nav_close';
        obj.title = '收起';
        obj.nextSibling.style.display = '';
    }
    else {
        obj.className = 'nav_open';
        obj.title = '展开';
        obj.nextSibling.style.display = 'none';
    }
    return false;
}
function mallLeftNavigation(oName) {
    var bnew = 0;
    var jsonObj = parent.g_mallMenuCommon;
    var m = jsonObj.getLevelCon(oName);
    var pName;
    var div = $("menu");
    var con = [];
    if (!m) {
        m = jsonObj.getLevelCon(oName, 1);
        pName = jsonObj.mall[jsonObj.mall[oName]["pnode"]]
    } else {
        pName = jsonObj.mall[oName];
    }
    var f = '<a href="javascript:parent.g_mallMenuCommon.createUrl(\'' + pName["oName"] + '\')" >全部' + pName["name"] + '</a>';
    if (pName.cn && pName.cn > 0) {
        bnew = pName.cn;
        con[con.length] = "<div class=\"product_top\"><h2>" + f + "</h2></div>"
    }
    else {
        con[con.length] = '<div class="product_top"><h2>' + f + '</h2></div><div class="product_content"><ul class="clearfix">';
    }
    if (bnew) {
        con[con.length] = '<div class="product_content">';
        con[con.length] = '<ul id="all_menu" class="nav_sort">';
        var index = 0;
        while (index < bnew) {
            con[con.length] = '<li><h3 onclick="return collapseMenu(this);" title="收起" class="nav_close">' + pName.c[index].name + '</h3>';
            con[con.length] = '<div>';
            var bFirst = true;
            for (var i = 0; i < m.length; i++) {
                if (m[i].b == index) {
                    if ((m[i]["name"].replace(/[^\x00-\xff]/g, "00").length > 7) && (bFirst != true)) {
                        con[con.length] = '<br/>';
                    }
                    bFirst = false;
                    con[con.length] = '<a id="id_menu_' + m[i].oName + '" href="javascript:parent.g_mallMenuCommon.createUrl(\'' + m[i].oName + '\')" >' + m[i]["name"] + '</a>';
                }
            }
            con[con.length] = '</div></li>';
            index++;
        }
        con[con.length] = "</ul></div>";
        con[con.length] = '<div class=\"product_bottom\"></div>';
    }
    else {
        for (var i = 0; i < m.length; i++) {
            if (m[i]["oName"] == "rechp" && !parent.g_needShowRec) {
                con[con.length] = '<li style=\'display:none\'><a href="javascript:parent.g_mallMenuCommon.createUrl(\'' + m[i].oName + '\')" >' + m[i]["name"] + '</a></li>'
            }
            else con[con.length] = '<li><a href="javascript:parent.g_mallMenuCommon.createUrl(\'' + m[i].oName + '\')" >' + m[i]["name"] + '</a></li>'
        }
        con[con.length] = "</ul></div><div class=\"product_bottom\"></div>";
    }
    div.innerHTML = con.join("");
    var mall_id = getParameter('mall');
    var current_menu = $('id_menu_' + mall_id);
    if (current_menu) {
        current_menu.className = 'nonce';
    }
}
function mallSubPos(oName, b) {
    var div = document.getElementById("mall_pos");
    if (div) {
        var sCon = [];
        var m = parent.g_mallMenuCommon.getLevelPath(oName);
        if (m) {
            for (var i = 0; i < m.length - 1; i++) {
                sCon[sCon.length] = '<a href="javascript:parent.g_mallMenuCommon.createUrl(\'' + m[i]["oName"] + '\')" >' + m[i]["name"] + '</a> > '
            }
        }
        sCon[sCon.length] = '<span>' + m[m.length - 1].name + '</span>'
        div.innerHTML = sCon.join("");
    }
}
function fixJsonArrayLength(array) {
    try {
        if (!isNaN(QzoneMall.userAgent.ie)) {
            if ((typeof(array) != 'undefined') && (array.length > 0) && (typeof(array[array.length - 1]) == 'undefined')) {
                array.length--;
            }
        }
        else {}
    }
    catch(ex) {}
}
function adjustHeight() {
    if (parent.resizeMainFrame) {
        parent.resizeMainFrame(document);
    }
}
var mallSubWebDataDeal = {
    init: function(oName, curpage, type, b, select_t) {
        this.binHistory = b;
        if (b) var jsonObj = parent.g_mallMenuCommon;
        else var jsonObj = g_mallMenuCommon;
        this.oName = oName;
        var othis = this;
        if (jsonObj && oName) {
            var bitmap = jsonObj.mall[oName]["bitmap"].split("");
            var cUrl = jsonObj.mall[oName]["cUrl"];
            if ('3' == bitmap[0]) {
                cUrl += "_pack";
            }
            g_mallStaticWeb.init(function(obj) {
                othis.callback(obj)
            },
            cUrl, curpage || 1, type || "", "", select_t || "");
        }
    },
    callback: function(obj) {
        if (top.g_fullMode == 3 || top.g_fullMode == 4) {
            var i = 16;
            if (obj.data.length <= 16) i = 8;
            for (; i < obj.data.length; i++) {
                obj.data[i].laststyle = 'laster';
            }
        }
        else {
            var i = 12;
            if (obj.data.length <= 12) i = 6;
            for (; i < obj.data.length; i++) {
                obj.data[i].laststyle = 'laster';
            }
        }
        for (var i = 0; i < obj.data.length; i++) {
            obj.data[i].index = i;
        }
        FillDiv_Ex("mall_item", obj);
        var totalPage = parseInt(obj.unique.totalpage);
        var curPage = parseInt(obj.unique.curpage);
        var type = obj.unique.sorttype;
        var selecttype = obj.unique.selecttype;
        var selectdiv = $("typeselect");
        if (selectdiv) {
            var selectobj = [{
                id: '1',
                name: '皮肤'
            },
            {
                id: '2',
                name: '挂件'
            },
            {
                id: '3',
                name: 'banner'
            },
            {
                id: '4',
                name: '鼠标方案'
            },
            {
                id: '5',
                name: '漂浮物'
            },
            {
                id: '6',
                name: '播放器'
            },
            {
                id: '7',
                name: '个性花藤'
            },
            {
                id: '8',
                name: '个性标志'
            },
            {
                id: '12',
                name: '公告栏'
            },
            {
                id: '13',
                name: '导航菜单'
            },
            {
                id: '14',
                name: '欢迎动画'
            },
            {
                id: '15',
                name: '礼品盒'
            },
            {
                id: '16',
                name: 'flash挂件'
            },
            {
                id: '17',
                name: '花边'
            },
            {
                id: '18',
                name: '播放器2.0'
            },
            {
                id: '19',
                name: '标题栏'
            },
            {
                id: '31',
                name: '套装'
            },
            {
                id: '20',
                name: '黄钻宝贝'
            },
            {
                id: '22',
                name: '魔法秀'
            }];
            mtype = obj.unique.hastype.split("|");
            selectdiv.length = 0;
            if (selecttype == "") {
                selectdiv.options[selectdiv.length] = new Option("类别筛选", "null", false, true);
            }
            else {
                selectdiv.options[selectdiv.length] = new Option("类别筛选", "null", false, false);
            }
            for (var index_i in selectobj) {
                for (var index_j in mtype) {
                    if (selectobj[index_i].id == mtype[index_j]) {
                        if (selecttype == selectobj[index_i].id) {
                            selectdiv.options[selectdiv.length] = new Option(selectobj[index_i].name, selectobj[index_i].id, false, true);
                        }
                        else {
                            selectdiv.options[selectdiv.length] = new Option(selectobj[index_i].name, selectobj[index_i].id, false, false);
                        }
                    }
                }
            }
        }
        var div = document.getElementById("page");
        if (div) {
            var f;
            var cb;
            if (this.binHistory) {
                if (type == "select") {
                    f = 'javascript:parent.g_mallMenuCommon.createUrl(\'' + this.oName + '\',{no},\'' + type + '\',\'' + selecttype + '\')';
                    cb = function(oName, goingPage, type, selecttype) {
                        parent.g_mallMenuCommon.createUrl(oName, goingPage, type, selecttype);
                    };
                }
                else {
                    f = 'javascript:parent.g_mallMenuCommon.createUrl(\'' + this.oName + '\',{no},\'' + type + '\')';
                    cb = function(oName, goingPage, type) {
                        parent.g_mallMenuCommon.createUrl(oName, goingPage, type);
                    };
                }
            } else {
                if (type == "select") {
                    f = 'javascript:mallSubWebDataDeal.init(\'' + this.oName + '\',{no},\'' + type + '\',\'' + selecttype + '\')';
                    cb = function(oName, goingPage, type, selecttype) {
                        mallSubWebDataDeal.init(oName, goingPage, type, selecttype);
                    };
                }
                else {
                    f = 'javascript:mallSubWebDataDeal.init(\'' + this.oName + '\',{no},\'' + type + '\')';
                    cb = function(oName, goingPage, type) {
                        mallSubWebDataDeal.init(oName, goingPage, type);
                    };
                }
            }
            div.innerHTML = (showPageList(curPage, totalPage, 5, f) + showGoPage(totalPage, cb));
            div.style.display = '';
        }
        adjustHeight();
        if (typeof init_oy == "function") {
            init_oy();
        }
    }
}
var g_mallStaticWeb = {
    tdata: null,
    hash: false,
    bPack: false,
    onlyObj: {
        scriptDiv: "",
        callBack: ""
    },
    hashObj: {
        scriptDiv: {},
        callBack: {}
    },
    init: function(callback, mallid, c, type, xback, select_t) {
        g_mallStaticsWebDirJson = 'http://imgcache.qq.com/qzone/mall/static/json/';
        if (this.totalPage && c > this.totalPage) c = this.totalPage;
        this.curPage = c || 1;
        this.type = type || "";
        if (type == "select") this.select_t = select_t;
        var m = mallid.toString().split("_");
        if (xback != "bignew") {
            this.mallID = m[0];
            if (top.g_fullMode == 3 || top.g_fullMode == 4) {
                if (type == "select") this.url = g_mallStaticsWebDirJson + 'itemlist_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '_v5_' + this.select_t + '.json';
                else this.url = g_mallStaticsWebDirJson + 'itemlist_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '_v5.json';
            }
            else {
                if (type == "select") this.url = g_mallStaticsWebDirJson + 'itemlist_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '_v3_' + this.select_t + '.json';
                else this.url = g_mallStaticsWebDirJson + 'itemlist_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '_v3.json';
            }
        }
        else {
            this.mallID = m[0];
            if (top.g_fullMode == 3 || top.g_fullMode == 4) this.url = g_mallStaticsWebDirJson + 'itemlist_bignew_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '_v5.json';
            else this.url = g_mallStaticsWebDirJson + 'itemlist_bignew_' + (this.type ? this.type + '_': '') + this.mallID + '_' + this.curPage + '.json';
        }
        if (this.hash) {
            this.key = this.type + this.mallID + this.curPage;
            if (callback) this.hashObj.callBack[this.key] = callback;
            if (!this.hashObj.scriptDiv[this.key]) {
                this.hashObj.scriptDiv[this.key] = jsonInit(this.url)
            } else {
                this.hashObj.scriptDiv[this.key].src = this.url;
            }
        } else {
            if (callback) this.onlyObj.callBack = callback;
            if (!this.onlyObj.scriptDiv) {
                this.onlyObj.scriptDiv = jsonInit(this.url)
            } else {
                this.onlyObj.scriptDiv.src = this.url;
            }
        }
    },
    getItemData: function(obj) {
        this.tdata = obj.data;
        if (this.bPack) {
            tPackItemArrayInfo(obj.data);
            for (var i = 0; i < obj.data.length; i++) {
                obj.data[i].mallid = obj.unique.mallid;
            }
        } else {
            tItemArrayInfo(obj.data);
        }
        this.totalPage = parseInt(obj.unique.totalpage);
        this.curPage = parseInt(obj.unique.curpage);
        if (this.hash) {
            var key = obj.unique.sorttype + obj.unique.mallid + obj.unique.curpage;
            if (this.hashObj.callBack[key]) {
                this.hashObj.callBack[key](obj);
            }
        } else {
            if (this.onlyObj.callBack) {
                this.onlyObj.callBack(obj);
            }
        }
    }
}
var g_mallGetCgiData = {
    init: function(url, callback, b) {
        this.callback = callback;
        this.url = (url.indexOf("?") != -1) ? (url + '&cbf=g_mallGetCgiData.getData') : (url + '?cbf=g_mallGetCgiData.getData');
        this.url += ("&p=" + Math.random());
        if (b) {
            jsonInit(this.url);
        }
        else {
            if (!this.scriptDiv) {
                this.scriptDiv = jsonInit(this.url)
            } else {
                this.scriptDiv.parentNode.removeChild(this.scriptDiv);
                this.scriptDiv = jsonInit(this.url);
            }
        }
    },
    getData: function(obj) {
        if (obj["err"]) {
            if (obj["err"]["errno"] == 'unload') {
                mallShowLogin();
            } else {
                reloadFrame(g_mallStaticsWebDir + "/web/cart/unsucc.htm?msg=" + escape(obj["err"]["errmsg"]));
            }
            return;
        }
        if (this.callback) {
            this.callback(obj);
        }
    }
}
function rollCountClass(data, count, div, time) {
    var othis = this;
    this.data = data;
    this.count = count;
    this.div = div;
    this.time = time || 5000;
    this.index = 0;
    this.max = data.length / count;
    this.stopForEven = false;
    this.timeId = 0;
    this.choice = function(index) {
        var obj = {
            data: []
        };
        for (var i = index * this.count; i < (index + 1) * this.count && i < this.data.length; i++) {
            obj.data[obj.data.length] = this.data[i];
        }
        FillDiv_Ex(this.div, obj);
    };
    this.rollRandom_ = function() {
        if (this.max > 0) {
            this.index = Math.floor(Math.random() * this.max);
            this.choice(this.index);
        }
    }
    this.rollRandom = function() {
        if (!this.stopForEven && 0 == this.timeId) {
            this.choice(this.index);
            this.timeId = setInterval(function() {
                othis.rollRandom_()
            },
            this.time)
        }
    };
    this.rollOrder_ = function() {
        if (this.max > 0) {
            this.index = (++this.index) % this.max;
            this.choice(this.index);
        }
    };
    this.rollOrder = function() {
        if (!this.stopForEven && 0 == this.timeId) {
            this.choice(this.index);
            this.timeId = setInterval(function() {
                othis.rollOrder_()
            },
            this.time)
        }
    };
    this.stopRoll = function() {
        clearInterval(this.timeId);
        this.timeId = 0;
    };
    this.mClick = function(index) {
        this.stopForEven = true;
        this.stopRoll();
        this.choice(index);
    };
}
function mallDoError(obj) {
    if (typeof(obj) != "object") return false;
    if (obj["err"]) {
        if (obj["err"]["errno"] == 'unload') {
            mallShowLogin();
        } else {
            location.href = g_mallStaticsWebDir + "/web/cart/unsucc.htm?msg=" + escape(obj["err"]["errmsg"]);
        }
        return false;
    }
    return true;
}
function mallReturnWeb() {
    var sUrl = String(window.top.location.href);
    var t = sUrl.split("/");
    if (t.length > 3 && t[2] == "mall.qzone.qq.com") {
        location.href = "http://rc.qzone.qq.com/?openmall";
    } else {
        if (parent.g_mallMenuCommon && parent.g_mallMenuCommon.createUrl) {
            parent.g_mallMenuCommon.createNow();
        }
    }
}
function mallGoMyitem() {
    var sUrl = String(window.top.location.href);
    var t = sUrl.split("/");
    if (t.length > 3 && t[2] == "mall.qzone.qq.com") {
        location.href = "http://rc.qzone.qq.com/?myitem";
    } else {
        if (parent.g_mallMenuCommon && parent.g_mallMenuCommon.createUrl) {
            parent.g_mallMenuCommon.createUrl('myitem');
        }
    }
}
function getFlashVersion(reqVer) {
    var PlayerVersion = new swfVersion(0, 0, 0);
    if (navigator.plugins && navigator.mimeTypes.length) {
        var x = navigator.plugins['Shockwave Flash'];
        if (x && x.description) {
            PlayerVersion = new swfVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
        }
    } else {
        try {
            var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            for (var i = 3; axo != null; i++) {
                axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                PlayerVersion = new swfVersion([i, 0, 0]);
            }
        } catch(e) {}
        if (reqVer && PlayerVersion.major > reqVer.major) {
            return PlayerVersion;
        }
        if (!reqVer || (reqVer.minor != 0 || reqVer.rev != 0) && PlayerVersion.major == reqVer.major || PlayerVersion.major != 6) {
            try {
                PlayerVersion = new swfVersion(axo.GetVariable("$version").split(" ")[1].split(","));
            } catch(e) {}
        }
    }
    return PlayerVersion;
};
function swfVersion(arrVersion) {
    this.major = parseInt(arrVersion[0]) || 0;
    this.minor = parseInt(arrVersion[1]) || 0;
    this.rev = parseInt(arrVersion[2]) || 0;
    this.version = arrVersion.toString();
};
/*  |xGv00|c6ac430d5cd8ab25232f344ae3afd947 */
