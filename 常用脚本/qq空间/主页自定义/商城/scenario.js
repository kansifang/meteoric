
var pWin = parent || document.parentWindow;
if (typeof(pWin.g_mall_nowitem) == 'undefined') {
    pWin.g_mall_nowitem = [];
}
(function(){
    if (pWin.g_mall_nowitem.length > 0) 
        return;
    else {
        var _ei = top.QZONE.shop.exclusiveItems;
        for (var i in _ei) {
            pWin.g_mall_nowitem[_ei[i].type] = _ei[i];
        }
    }
})();
if (typeof(top.history_list) == 'undefined') {
    top.history_list = [];
}
function spliceitemlist(itemlist, index){
    if ((itemlist.length <= index) || (index < 0)) 
        return false;
    if (index == itemlist.length - 1) {
        itemlist.length--;
        return true
    }
    for (var i = index; i < itemlist.length - 1; i++) 
        itemlist[i] = itemlist[i + 1];
    itemlist.length--;
    return true;
}

function add_history(type, itemno, posx, posy, width, height, zindex){
    if (typeof(top.history_list) == 'undefined') {
        top.history_list = [];
    }
    while (top.history_list.length >= 36) {
        spliceitemlist(top.history_list, 0);
    }
    var item;
    for (var i = 0; i < top.history_list.length; i++) {
        item = top.history_list[i];
        if (item.itemno == itemno) 
            break;
    }
    if (i < top.history_list.length) {
        if (top.history_list.length == 1) 
            return;
        spliceitemlist(top.history_list, i);
        top.history_list[top.history_list.length] = item;
        return;
    }
    item = new Object();
    item.type = type;
    item.itemno = itemno;
    item.posx = posx;
    item.poxy = posy;
    item.width = width;
    item.height = height;
    item.zindex = zindex;
    item.imgurl = 'http://imgcache.qq.com/qzone/space_item/pre/' + (itemno % 16) + '/' + itemno + '.gif';
    top.history_list[top.history_list.length] = item;
}

function filter_history(type){
    var filter_history_list = [];
    if (type == 'all') {
        for (var i = top.history_list.length - 1; i >= 0; i--) {
            filter_history_list[filter_history_list.length] = top.history_list[i];
        }
        return filter_history_list;
    }
    else 
        if (type == 'other') {
            for (var i = top.history_list.length - 1; i >= 0; i--) {
                switch (top.history_list[i].type) {
                    case 1:
                    case 6:
                    case 13:
                    case 14:
                    case 18:
                    case 19:
                        break;
                    default:
                        filter_history_list[filter_history_list.length] = top.history_list[i];
                }
            }
            return filter_history_list;
        }
        else 
            if (type == 'player') {
                for (var i = top.history_list.length - 1; i >= 0; i--) {
                    switch (top.history_list[i].type) {
                        case 6:
                        case 18:
                            filter_history_list[filter_history_list.length] = top.history_list[i];
                            break;
                        default:
                            break;
                    }
                }
                return filter_history_list;
            }
    for (var i = top.history_list.length - 1; i >= 0; i--) {
        if (top.history_list[i].type == parseInt(type)) 
            filter_history_list[filter_history_list.length] = top.history_list[i];
    }
    return filter_history_list;
}

var g_fullScreenChoice = {
    init: function(type, itemno, posx, posy, width, height, zIndex, attempt){
        type = parseInt(type);
        if (type == 31) 
            return;
        itemno = parseInt(itemno);
        zIndex = parseInt(zIndex);
        if (12026 == itemno) {
            mall_changeItem(16, 12026, 200, 10, 240, 180, 0, attempt);
            return;
        }
        else 
            if (18915 == itemno) {
                mall_changeItem(16, 18915, 0, 0, 250, 250, 0, attempt);
                return;
            }
        if (type != 1) {
            if (top.g_fullMode == '0' && type == 19) {
                alert("您试用的装扮物中含有'个性标题栏',将您的空间切换成全屏或宽屏模式才能试用");
                return;
            }
            if (top.g_fullMode == '0' && type == 13 && (zIndex == '1' || zIndex == '3')) {
                mall_changeItem(type, itemno, posx, posy, width, height, zIndex, attempt);
                return;
            }
            else 
                if (top.g_fullMode > '0' && type == 13 && zIndex == '1') 
                    mall_changeItem(type, itemno, 50, 85, 550, 100, zIndex, attempt);
                else 
                    mall_changeItem(type, itemno, posx, posy, width, height, zIndex, attempt);
            return;
        }
        if (top.g_fullMode == '0') {
            var bSuportSmall = zIndex >> 3 & 0x01;
            if (!bSuportSmall) {
                if (!confirm("您试穿的皮肤不支持小窝模式，换肤后会切换到全屏或宽屏模式，请确认。")) 
                    return;
                zIndex += 1 << 6;
            }
            mall_changeItem(type, itemno, posx, posy, width, height, zIndex, attempt);
        }
        else {
            var bSuportBig = zIndex >> 4 & 0x01;
            if (!bSuportBig && top.g_frameStyle > 0) {
                alert("您当前使用的是分栏布局,无法支持小窝皮肤，请选择全屏或宽屏皮肤")
                return;
            }
            else 
                if (!bSuportBig && top.g_frameStyle <= 0) {
                    if (!confirm("您试穿的皮肤不支持全屏模式，换肤后会切换到小窝模式，请确认。")) 
                        return;
                }
                else {
                    zIndex += 1 << 6;
                }
            mall_changeItem(type, itemno, posx, posy, width, height, zIndex, attempt);
        }
        return;
    },
    changeMode: function(callback){
        var m = top.currentStyle[1];
        var bFull = m[5] >> 6 & 0x01;
        if (bFull && top.g_frameStyle > 0) {
            alert("您当前使用的是分栏布局,无法切换到小窝模式");
            var flag = m[5] ^ 1 << 6;
            top.space_changeSkin(1, m[0], m[1], m[2], flag, true);
            return false;
        }
        var bSuportSmall = m[5] >> 3 & 0x01;
        var bSuportBig = m[5] >> 4 & 0x01;
        if (bFull && (!bSuportSmall)) {
            if (!confirm("您目前的皮肤不支持小窝模式，切换后会恢复为默认皮肤，请确认。")) 
                return false;
        }
        else 
            if ((!bFull) && (!bSuportBig)) {
                if (!confirm("您目前的皮肤不支持全屏模式，切换后会恢复为默认皮肤，请确认。")) 
                    return false;
            }
        if (top.currentStyle[13] != null) {
            var d = top.currentStyle[13];
            if (bFull && d[5] == 1 && d[0] > 1000) {
                if (!confirm("您目前的导航不支持小窝模式，切换后会恢复默认导航，请确认。")) 
                    return false;
                if (!top.olddh) {
                    top.olddh = d;
                }
                mall_changeItem(13, d[0], 50, 85, 550, 100, d[5]);
            }
        }
        var flag = m[5] ^ 1 << 6;
        top.space_changeSkin(1, m[0], m[1], m[2], flag, true);
        top.g_EditFlag = 1;
        if (callback) {
            var type = bFull ? 'qzone' : 'izone';
            if (!bFull && d[0] == 1 && top.olddh != null) 
                mall_changeItem(13, top.olddh[0], 50, 85, 550, 100, top.olddh[5]);
            callback(type);
        }
        return true;
    }
};
function mallGetQzoneMode(){
    return top.g_fullMode;
}

function mallGetVipStatus(){
    if (top.getVipFlag && top.getVipFlag("diamon") == "1") 
        return true;
    else 
        return false;
}

function mall_getolditem(type){
    var _ei = top.QZONE.shop.exclusiveItems;
    for (var i in _ei) {
        if (_ei[i].type == type) 
            return _ei[i];
    }
    return null;
}

function mall_changeItem(type, itemno, posx, posy, width, height, zIndex, attempt){
    if (!attempt) 
        add_history(type, itemno, posx, posy, width, height, zIndex);
    type = parseInt(type);
    itemno = parseInt(itemno);
    posx = parseInt(posx) || 0;
    posy = parseInt(posy) || 0;
    width = parseInt(width) || 0;
    height = parseInt(height) || 0;
    if (type != 12) 
        zIndex = parseInt(zIndex) || 0;
    top.g_EditFlag = 1;
    if (type == 8) {
        alert("type error");
    }
    else 
        if (9 == type || 10 == type || 11 == type) {
            alert("大头贴不能试穿");
            return;
        }
        else 
            if (type == 12) {
                addPub(type, itemno, posx, posy, zIndex);
            }
            else 
                if (type == 4) {
                    document.body.style.cursor = 'url(http://imgcache.qq.com/qzone/space_item/orig/' + (itemno % 16) + '/' + itemno + '.ani)';
                    window.top.space_addItem(type, itemno, posx, posy, width, height, zIndex);
                }
                else 
                    if (type == 1) {
                        if (!!pWin.g_mall_nowitem[type] && pWin.g_mall_nowitem[type].itemno != itemno && findElementByID(type, itemno) != null) {
                            var now = pWin.g_mall_nowitem[type];
                            var tmp = getItem(type);
                            if (tmp) {
                                now = tmp;
                            }
                            window.top.space_addItem(now.type, now.itemno, now.posx, now.posy, now.width, now.height, now.flag);
                        }
                        else 
                            window.top.space_addItem(type, itemno, posx, posy, width, height, zIndex);
                    }
                    else 
                        if (type == 13) {
                            if (!!pWin.g_mall_nowitem[type] && pWin.g_mall_nowitem[type].itemno != itemno && findElementByID(type, itemno) != null) {
                                var now = pWin.g_mall_nowitem[type];
                                var tmp = getItem(type);
                                if (tmp) {
                                    now = tmp;
                                }
                                window.top.space_addItem(now.type, now.itemno, now.posx, now.posy, now.width, now.height, now.flag);
                            }
                            else {
                                if (zIndex == '1' || zIndex == '3') 
                                    window.top.space_addItem(type, itemno, 0, 0, width, height, zIndex);
                                else 
                                    window.top.space_addItem(type, itemno, posx, posy, width, height, zIndex);
                            }
                        }
                        else 
                            if (type == 6 || type == 18) {
                                if (!!pWin.g_mall_nowitem[type] && pWin.g_mall_nowitem[type].itemno != itemno && findElementByID(type, itemno) != null) {
                                    var now = pWin.g_mall_nowitem[type];
                                    var tmp = getItem(type);
                                    if (tmp) {
                                        now = tmp;
                                    }
                                    window.top.space_addItem(now.type, now.itemno, 0, 0, now.width, now.height, now.flag);
                                }
                                else 
                                    window.top.space_addItem(type, itemno, 0, 0, width, height, zIndex);
                            }
                            else {
                                if (!!pWin.g_mall_nowitem[type] && pWin.g_mall_nowitem[type].itemno != itemno && findElementByID(type, itemno) != null) {
                                    var now = pWin.g_mall_nowitem[type];
                                    var tmp = getItem(type);
                                    if (tmp) {
                                        now = tmp;
                                    }
                                    window.top.space_addItem(now.type, now.itemno, now.posx, now.posy, now.width, now.height, now.flag);
                                }
                                else 
                                    window.top.space_addItem(type, itemno, posx, posy, width, height, zIndex);
                            }
}

function getItem(type){
    var items = top.g_Dressup.items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type == type) {
            return items[i];
        }
    }
}

function addPub(type, itemno, posx, posy, zIndex){
    return top.space_addItem(type, itemno, posx, posy, 0, 0, zIndex);
    if (top.findWndElement(type, itemno) >= 0) {
        top.deleteWindowByTypeAndItemno(type, itemno);
        top.pubItemId = "";
        return;
    }
    if (top.pubItemId == "") {
        top.space_addPub(type, itemno, posx, posy, zIndex);
        top.pubtxtid = 1;
        top.pubItemId = itemno;
        top.pubPrice = zIndex;
    }
    else {
        alert("很抱歉公告栏一次只能购买一个")
    }
}

function parseScenario(itemlist){
    var array = {
        diy: [],
        mall: []
    };
    var m = itemlist.split("@");
    itemlist = m[m.length - 1];
    m = itemlist.split("|");
    for (var i = 0; i < m.length; i++) {
        var m1 = m[i].split("_");
        if (m1.length == 7) {
            var obj = {};
            obj.type = m1[0];
            obj.itemno = m1[1];
            obj.posx = m1[2];
            obj.posy = m1[3];
            obj.width = m1[5];
            obj.height = m1[6];
            obj.zIndex = m1[7];
            if (m1[0] < 51) {
                array.mall[array.mall.length] = obj;
            }
            else {
                array.diy[array.diy.length] = obj;
            }
        }
        else 
            if (m1.length == 8) {
                var obj = {};
                obj.type = m1[0];
                obj.itemno = m1[1];
                obj.posx = m1[2];
                obj.posy = m1[3];
                obj.width = m1[5];
                obj.height = m1[6];
                obj.zIndex = m1[7];
                if (m1[0] < 51) {
                    array.mall[array.mall.length] = obj;
                }
                else {
                    array.diy[array.diy.length] = obj;
                }
            }
    }
    return array;
}

function delFromScenario(type, itemno, posx, posy, width, height, zIndex){
    type = parseInt(type);
    itemno = parseInt(itemno);
    posx = parseInt(posx) || 0;
    posy = parseInt(posy) || 0;
    width = parseInt(width) || 0;
    height = parseInt(height) || 0;
    zIndex = parseInt(zIndex) || 0;
    top.QZONE.shop.remove({
        type: type,
        itemno: itemno,
        posx: posx,
        posy: posy,
        posz: 0,
        height: height,
        width: width,
        flag: zIndex
    }, true);
    return;
}

function playInScenario(type, itemno, posx, posy, width, height, zIndex){
    type = parseInt(type);
    itemno = parseInt(itemno);
    posx = parseInt(posx);
    posy = parseInt(posy);
    width = parseInt(width);
    height = parseInt(height);
    zIndex = parseInt(zIndex);
    top.QZONE.shop.add({
        type: type,
        itemno: itemno,
        posx: posx,
        posy: posy,
        posz: 0,
        height: height,
        width: width,
        flag: zIndex
    }, true);
    return;
}

function findOldElementByType(type){
    var _ci = top.QZONE.shop.currentItems;
    var _ei = top.QZONE.shop.exclusiveItems;
    var r = [];
    for (var i in _ei) {
        if (_ei[i].type == type) 
            return _ei[i];
    }
    for (var i in _ci) {
        if (_ci[i].type == type) 
            r.push(_ci[i]);
    }
    if (r.length > 0) 
        return r;
    else 
        return null;
}

function findElementByID(type, itemno){
    var _ci = top.QZONE.shop.currentItems;
    var _ei = top.QZONE.shop.exclusiveItems;
    for (var i in _ei) {
        if (_ei[i].type == type && _ei[i].itemno == itemno) 
            return _ei[i];
    }
    for (var i in _ci) {
        if (itemno != null) {
            if (_ci[i].type == type && _ci[i].itemno == itemno) 
                return _ci[i];
        }
        else {
            if (_ci[i].type == type) 
                return _ci[i];
        }
    }
}

function findElementByType(type){
    var _ci = top.QZONE.shop.currentItems;
    var _ei = top.QZONE.shop.exclusiveItems;
    var r = [];
    for (var i in _ei) {
        if (_ei[i].type == type) 
            return (_ei[i]);
    }
    for (var i in _ci) {
        if (_ci[i].type == type) 
            r.push(_ci[i]);
    }
    if (r.length > 0) 
        return r;
    else 
        return null;
}/*  |xGv00|e5732fceb97a64847682413d41e2d7b4 */

