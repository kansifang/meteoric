//场景历史
function addScenarioHistory(item){
    if (typeof(top.history_list) == 'undefined') {
        top.history_list = [];
    }
    var historyList = top.history_list;
    for (var i = 0; i < historyList.length; i++) {
        if (historyList[i].itemno == item.itemno) {
            return;
        }
    }
    var newItem = {
        'type': item.type,
        'itemno': item.itemno,
        'posx': item.posx,
        'posy': item.posy,
        'posz': item.posz,
        'width': item.width,
        'height': item.height,
        'flag': item.flag,
        'imgurl': 'http://qzonestyle.gtimg.cn/qzone/space_item/pre/' + (item.itemno % 16) + '/' + item.itemno + '.gif'
    };
    historyList[historyList.length] = newItem;
    if (historyList.length > 36) {
        historyList = historyList.slice(1, 36);
    }
    top.history_list = historyList;
    QZONE.shop.shopLib.setData('mall_scenario_history', historyList)
}

function getScenarioHistory(type){
    var result = [];
    var historyList = QZONE.shop.shopLib.getData('mall_scenario_history');
    switch (type) {
        case 'all':
            for (var i = historyList.length - 1; i >= 0; i--) {
                result.push(historyList[i]);
            }
            return result;
        case 'player':
            for (var i = historyList.length - 1; i >= 0; i--) {
                if (historyList[i].type == 6 || historyList[i].type == 18) {
                    result.push(historyList[i]);
                }
            }
            return result;
        case 'other':
            for (var i = historyList.length - 1; i >= 0; i--) {
                switch (historyList[i].type) {
                    case 1:
                    case 6:
                    case 13:
                    case 14:
                    case 18:
                    case 19:
                        break;
                    default:
                        result.push(historyList[i]);
                }
            }
            return result;
        default:
            for (var i = historyList.length - 1; i >= 0; i--) {
                if (type == historyList[i].type) {
                    result.push(historyList[i]);
                }
            }
            return result;
    }
}

function isScenarioItem(type, id){
    var itemsStr = QZONE.shop.shopLib.getItemList();
    return (itemsStr.indexOf(type + '_' + id) > -1) ? true : false;
}

function searchSavedItem(itemType, itemId){
    var result = [];
    var itemsSaved = QZONE.shop.shopLib.getSavedItemList().split('|');
    for (var i = 0; i < itemsSaved.length; i++) {
        var item = itemsSaved[i].split('_');
        for (var j = 0; j < item.length; j++) {
            item[j] = parseInt(item[j]);
        }
        var exist = false;
        if (itemType && item[0] == itemType) {
            if (itemId) {
                if (item[1] == itemId) {
                    exist = true;
                }
            }
            else {
                exist = true;
            }
        }
        if (exist) {
            result.push({
                'type': item[0],
                'itemno': item[1],
                'posx': item[2],
                'posy': item[3],
                'posz': item[4],
                'width': item[5],
                'height': item[6],
                'flag': item[7]
            });
        }
    }
    return result;
}

function changeScenario(item){
    if (isScenarioItem(item.type, item.itemno)) {
        delScenario(item);
    }
    else {
        addScenario(item);
    }
}

if (!top.g_scenario_suitlist) 
    top.g_scenario_suitlist = {
        list: []
    }
if (!top.g_mall_last_suit_id_one) 
    top.g_mall_last_suit_id_one = 0;
function changeSuit(item){
    if (isSuitItem(item.Fitem_id)) {
        addSavedScenario();
    }
    else {
        for (var i = 0; i < item.suitItems.length; i++) {
            if (null == item.suitItems[i]) {
                continue;
            }
            addScenario(getMallItem(item.suitItems[i]));
        }
        removeOtherItems(item.suitItems);
    }
}

function removeOtherItems(suitList){
    var tmp = [];
    for (var i = 0; i < suitList.length; i++) {
        if (null == suitList[i]) {
            continue;
        }
        tmp.push(suitList[i].Ftype_id + '_' + suitList[i].Fitem_id);
    }
    tmp.push(QZONE.shop.shopLib.getSavedItemList());
    var itemList = tmp.join('|');
    var citems = QZONE.shop.shopLib.getItemList().split('|');
    for (var i = 0; i < citems.length; i++) {
        var citem = citems[i].split('_');
        if (itemList.indexOf(citem[0] + '_' + citem[1]) < 0) {
            for (var j = 0; j < citem.length; j++) {
                citem[j] = parseInt(citem[j]);
            }
            QZONE.shop.shopLib.remove({
                'type': citem[0],
                'itemno': citem[1],
                'posx': citem[2],
                'posy': citem[3],
                'posz': citem[4],
                'width': citem[5],
                'height': citem[6],
                'flag': citem[7]
            });
        }
    }
}
//保存场景
function addSavedScenario(){
    var items = [];
    var sitems = QZONE.shop.shopLib.getSavedItemList().split('|');
    for (var i = 0; i < sitems.length; i++) {
        var sitem = sitems[i].split('_');
        for (var j = 0; j < sitem.length; j++) {
            sitem[j] = parseInt(sitem[j]);
        }
        QZONE.shop.shopLib.add({
            'type': sitem[0],
            'itemno': sitem[1],
            'posx': sitem[2],
            'posy': sitem[3],
            'posz': sitem[4],
            'width': sitem[5],
            'height': sitem[6],
            'flag': sitem[7]
        });
        items.push(sitem[0] + '_' + sitem[1]);
    }
    var itemList = items.join('|');
    var citems = QZONE.shop.shopLib.getItemList().split('|');
    for (var i = 0; i < citems.length; i++) {
        var citem = citems[i].split('_');
        if (itemList.indexOf(citem[0] + '_' + citem[1]) < 0) {
            for (var j = 0; j < citem.length; j++) {
                citem[j] = parseInt(citem[j]);
            }
            QZONE.shop.shopLib.remove({
                'type': citem[0],
                'itemno': citem[1],
                'posx': citem[2],
                'posy': citem[3],
                'posz': citem[4],
                'width': citem[5],
                'height': citem[6],
                'flag': citem[7]
            });
        }
    }
}
//检测是否为套装
function isSuitItem(itemId){
    var exist = -1;
    var list = top.g_scenario_suitlist.list;
    for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] == itemId) {
            exist = i;
            break;
        }
    }
    if (exist > -1 && top.g_mall_last_suit_id_one == itemId) {
        top.g_scenario_suitlist.list = list = delArray(list, exist);
        top.g_mall_last_suit_id_one = itemId;
        return true;
    }
    else 
        if (exist == -1) {
            list.push(itemId);
        }
    top.g_mall_last_suit_id_one = itemId;
    return false;
}

function delArray(array, n){
    if (!array || array.length < n + 1 || n < 0) {
        return array;
    }
    else {
        var temp = [];
        for (var i = 0; i < array.length; i++) {
            if (i != 0) {
                temp.push(array[i]);
            }
        }
        return temp;
    }
}
//增加场景
function addScenario(item){
    var qzoneInfo = QZONE.FP.getQzoneConfig();
    if (!qzoneInfo.wide && !qzoneInfo.full) {
        if (item.type == 19) {
            alert('您试用的装扮物中含有"标题栏",将您的空间切换成全屏或宽屏模式才能试用', 0, 3000);
            return;
        }
    }
    if (qzoneInfo.wide || qzoneInfo.full) {
        if (item.type == 1 && !(item.flag >> 4 & 0x01)) {
            alert('您试用的皮肤不支持宽屏或全屏,将您的空间切换成小窝模式才能试用', 0, 3000);
            return;
        }
    }
    if (item.type == 9 || item.type == 10 || item.type == 11) {
        alert('您不能试穿大头贴', 0, 2000);
        return;
    }
    if (item.type == 4) {//鼠标方案
        document.body.style.cursor = 'url(http://qzonestyle.gtimg.cn/qzone/space_item/orig/' + (item.itemno % 16) + '/' + item.itemno + '.ani)';
    }
    addScenarioHistory(item);
    QZONE.shop.shopLib.add(item);
}

function delScenario(item){
    switch (item.type) {
        case 1:
        case 4:
        case 5:
        case 6:
        case 7:
        case 12:
        case 13:
        case 14:
        case 18:
        case 19:
        case 20:
        case 22:
        case 23:
        case 49:
            var newItem = searchSavedItem(item.type);
            if (newItem.length > 0) {
                QZONE.shop.shopLib.add(newItem[0]);
            }
            else {
                QZONE.shop.shopLib.remove(item);
            }
            break;
        default:
            QZONE.shop.shopLib.remove(item);
    }
}

function getMallItem(obj){
    var item = {
        'type': parseInt(obj.Ftype_id),
        'itemno': parseInt(obj.Fitem_id),
        'posx': parseInt(obj.posx),
        'posy': parseInt(obj.posy),
        'posz': 0,
        'width': parseInt(obj.width),
        'height': parseInt(obj.height),
        'flag': parseInt(obj.zindex)
    };
    return item;
}

function getMallVIPLevel(){
    var vip = getMallVIPState();
    var level = 0;
    try {
        level = top.g_JData["yellowInfo"].ownerinfo[0].level;
    } 
    catch (ex) {
    }
    if (vip != 1) {
        level = level * -1;
    }
    return level;
}

function getMallVIPState(){
    return QZONE.FP.getVipStatus();
}

function parseCGIItem(items){
    var level = getMallVIPLevel();
    for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        item.Fitem_type = parseInt(item.Fitem_type);
        item.Ftype_id = parseInt(item.Ftype_id);
        item.Fprice = parseInt(item.Fprice);
        item.Fdiscount = parseInt(item.Fdiscount);
        item.Fvip_price = parseInt(item.Fvip_price);
        item.vprice1 = 0;
        item.nprice = parseInt(item.Fprice * item.Fdiscount / 100);
        item.vprice = parseInt((item.Fvip_price < item.nprice) ? item.Fvip_price : item.nprice);
        item.vprice2 = item.vprice;
        if ((0 == item.Fitem_type || 1 == item.Fitem_type) && 7 != item.Ftype_id && 20 != item.Ftype_id) {
            item.vprice = 0;
            item.vprice2 = item.vprice;
            item.nsprice = nFormat((item.nprice / 100.0), 1);
            item.nsunit = 'Q币';
            item.nqprice = nFormat((item.nprice / 10.0), 0);
            item.nqunit = 'Q点';
            item.split = '|';
            item.vsprice = '免费用';
            item.vqprice = '免费用';
        }
        else 
            if (2 == item.Fitem_type) {
                item.nprice = 3000;
                item.vprice = 0;
                item.vprice2 = item.vprice;
                item.nsprice = '黄钻专用';
                item.nqprice = '黄钻专用';
                item.vsprice = '免费用';
                item.vqprice = '免费用';
            }
            else 
                if (3 == item.Fitem_type || 5 == item.Fitem_type || 6 == item.Fitem_type) {
                    item.nsprice = nFormat((item.nprice / 100.0), 1);
                    item.nsunit = 'Q币';
                    item.nqprice = nFormat((item.nprice / 10.0), 0);
                    item.nqunit = 'Q点';
                    item.split = '|';
                    item.vsprice = nFormat((item.vprice / 100.0), 1);
                    item.vsunit = 'Q币';
                    item.vqprice = nFormat((item.vprice / 10.0), 0);
                    item.vqunit = 'Q点';
                    item.vsplit = '|';
                    item.sdprice = '<span style=\"text-decoration:line-through;color:#FF6699\">' + nFormat((item.nprice / 78.0), 1) + '</span>';
                    if (level == 1) {
                        item.vprice2 = 0;
                    }
                    else 
                        if (level < 2) {
                            item.vprice2 = 0;
                            item.vsprice = 'Lv2免费';
                            item.vsunit = '';
                            item.vqprice = 'Lv2免费';
                            item.vqunit = '';
                        }
                        else {
                            item.sdprice = 0;
                            item.vprice = 0;
                            item.vsprice = 'Lv2免费';
                            item.vsunit = '';
                            item.vqprice = 'Lv2免费';
                            item.vqunit = '';
                        }
                }
                else 
                    if (7 == item.Fitem_type) {
                        item.nsprice = nFormat((item.nprice / 100.0), 1);
                        item.nsunit = 'Q币';
                        item.nqprice = nFormat((item.nprice / 10.0), 0);
                        item.nqunit = 'Q点';
                        item.split = '|';
                        item.vsprice = nFormat((item.vprice / 100.0), 1);
                        item.vsunit = 'Q币';
                        item.vqprice = nFormat((item.vprice / 10.0), 0);
                        item.vqunit = 'Q点';
                        item.vsplit = '|';
                        item.sdprice = '<span style=\"text-decoration:line-through;color:#FF6699\">' + nFormat((item.nprice / 78.0), 1) + '</span>';
                    }
                    else {
                        item.nprice = 100000000;
                        item.vprice = item.nprice;
                        item.vprice2 = item.vprice;
                        item.nsprice = '赠品';
                        item.nqprice = '赠品';
                        item.vsprice = '赠品';
                        item.vqprice = '赠品';
                    }
        if (item.Ftype_id == 31) {
            if (!item.suitItems) 
                continue;
            for (var j = 0; j < item.suitItems.length; j++) {
                if (null == item.suitItems[j]) {
                    continue;
                }
                parseCGIItem(item.suitItems[j]);
            }
        }
    }
    return items;
}

function nFormata(f, c){
    var t = Math.pow(10, c);
    return Math.round(f * t) / t;
}

function nFormat(srcStr, nAfterDot){
    if (!srcStr) {
        srcStr = 0;
    }
    var re = new RegExp("(\\d*)\\.(\\d*)")
    srcStr = String(srcStr);
    var m = srcStr.match(re);
    if (!m) {
        if (nAfterDot != 0) {
            srcStr += '.'
            for (var i = 0; i < nAfterDot; i++) {
                srcStr += '0';
            }
        }
    }
    else {
        var div = m[2].length - nAfterDot;
        if (div >= 0) {
            srcStr = srcStr.substr(0, srcStr.length - div);
        }
        else {
            div = -div;
            for (var i = 0; i < div; i++) {
                srcStr += '0';
            }
        }
    }
    return srcStr;
}

var buyMallItemMsg = {
    buy: '您的物品栏已有该物品，无需购买，请试用后直接点击“保存方案”使用该物品。',
    free: '免费物品无需购买，请试用后直接点击“保存方案”使用该物品。',
    yellow: '该商品为黄钻贵族专用，请开通黄钻贵族后使用',
    notsale: '您选择的为非卖品，该商品不能购买',
    privilege: '尊敬的用户，您是黄钻贵族，可免费使用该商品 ，您只需：\n\n第1步：点击该物品试用\n第2步：点击商城右上角“保存装扮方案”即可'
};
function buyMallItem(item){
    var vip = getMallVIPState();
    if (vip == 1) {
        if (0 == item.Fitem_type || 1 == item.Fitem_type || 2 == item.Fitem_type) {
            alert(buyMallItemMsg.privilege);
            return;
        }
        else 
            if (4 == item.Fitem_type) {
                alert(buyMallItemMsg.notsale)
                return;
            }
    }
    else {
        if (2 == item.Fitem_type) {
            alert(buyMallItemMsg.yellow);
            return;
        }
        else 
            if (4 == item.Fitem_type) {
                alert(buyMallItemMsg.notsale);
                return;
            }
            else 
                if (0 >= item.nprice) {
                    alert(buyMallItemMsg.free);
                    return;
                }
    }
    if (null == top.g_mallItemObjBag) {
        top.g_mallItemObjBag = {
            unique: {},
            notbuy: [],
            buy: [],
            yellow: [],
            notsale: [],
            recommend: [],
            suit: []
        };
    }
    else 
        if (null == top.g_mallItemObjBag['notbuy']) {
            top.g_mallItemObjBag['notbuy'] = [];
        }
        else {
            var notbuy = top.g_mallItemObjBag['notbuy'];
            if (notbuy.length > 12) {
                QZONE.FP.showMsgbox('您的购物车中已有太多物品，不能继续添加，请购买后再继续选择', 0, 2000);
                return;
            }
            for (var i = 0, l = notbuy.length; i < l; i++) {
                if (notbuy[i].Fitem_id == item.Fitem_id) {
                    QZONE.FP.showMsgbox('您的购物车中已有该物品，无需再次添加', 0, 2000);
                    return;
                }
            }
        }
    var url = ['http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?change_scenario=0&cbf=_Callback', '&bag_list=', item.Fitem_id, '&g_iUin=', qzoneInfo.ownerUin, '&fullMode=', ((top.zoneMode == 'izone') ? 1 : 0), '&p=', Math.random()].join('');
    QuickFunc.loadJson(url, function(obj){
        if (obj.err && obj.err.errno == 'unload' && obj.err.errmsg == '请先登录') {
            QZONE.FP.showLoginBox();
            return;
        }
        if (!obj || !obj.data) {
            QZONE.FP.showMsgbox('服务器忙！', 0, 2000);
        }
        if (obj.data.shopbag.length <= 0) {
            alert(buyMallItemMsg.privilege, 0, 2000);
            return;
        }
        if ('notbuy' != obj.data.shopbag[0].Fshop_bag) {
            alert(buyMallItemMsg[obj.data.shopbag[0].Fshop_bag], 0, 2000);
            return;
        }
        if (obj.data.shopbag && obj.data.shopbag.length > 0 && !obj.data.shopbag[obj.data.shopbag.length - 1]) {
            obj.data.shopbag.length--;
        }
        if (obj.data.scenario && obj.data.scenario.length > 0 && !obj.data.scenario[obj.data.scenario.length - 1]) {
            obj.data.scenario.length--;
        }
        var notbuy = top.g_mallItemObjBag['notbuy'];
        for (var i = 0; i < obj.data.shopbag.length; i++) {
            if (obj.data.shopbag[i].Fshop_bag == 'notbuy') {
                var exist = false;
                for (var j = 0, l = notbuy.length; j < l; j++) {
                    if (notbuy[j].Fitem_id == item.Fitem_id) {
                        exist = true;
                        addAtr(notbuy[j], item);
                        break;
                    }
                }
                if (!exist) {
                    notbuy.push(obj.data.shopbag[i]);
                }
            }
        }
        if (obj.data.scenario.length > 0) {
            for (var i = 0, l = notbuy.length; i < l; i++) {
                notbuy[i]['Fscenario'] = null;
            }
        }
        for (var i = 0; i < obj.data.scenario.length; i++) {
            if ((obj.data.scenario[i].Fshop_bag == 'notbuy') || (obj.data.scenario[i].Fshop_bag == 'yellow') || (obj.data.scenario[i].Fshop_bag == 'notsale')) {
                obj.data.scenario[i].Fscenario = 1;
                if (obj.data.scenario[i].suitItems && obj.data.scenario[i].suitItems.length > 0 && !obj.data.scenario[i].suitItems[obj.data.scenario[i].suitItems.length - 1]) {
                    obj.data.scenario[i].suitItems.length--;
                }
                for (var j = 0, l = notbuy.length; j < l; j++) {
                    if (notbuy[j].Fitem_id == item.Fitem_id) {
                        exist = true;
                        addAtr(notbuy[j], item);
                        break;
                    }
                }
                if (!exist) {
                    notbuy.push(obj.data.scenario[i]);
                }
            }
        }
        if (obj.unique) {
            if (obj.unique[0] && obj.unique[0].Fshop_bag) {
                top.g_mallItemObjBag[obj.unique[0].Fshop_bag] = obj.unique;
            }
            else {
                top.g_mallItemObjBag['unique'] = obj.unique;
            }
        }
        loadMainFrame('http://imgcache.qq.com/qzone/mall/v5/web/cart/cart.htm');
    }, '_Callback');
}

function giveMallItem(item){
    if (2 == item.Fitem_type) {
        alert("黄钻专用物品，不能赠送");
        return;
    }
    if (4 == item.Fitem_type) {
        alert("非买品，不能赠送");
        return;
    }
    if (0 >= item.nprice) {
        alert("免费物品不需要赠送，对方可直接装扮使用");
        return;
    }
    if (null == top.g_oGive) {
        top.g_oGive = {
            items: []
        };
    }
    for (var i = 0, l = top.g_oGive.items.length; i < l; i++) {
        if (parseInt(item.Fitem_id) == parseInt(top.g_oGive.items[i].itemid)) {
            loadMainFrame('http://imgcache.qq.com/qzone/mall/v5/web/mall/present_v2.htm?type=new');
            return;
        }
    }
    top.g_oGive.items.length = 0;
    top.g_oGive.items.push({
        'itemid': item.Fitem_id,
        'name': item.name,
        'itemtype': (item.Fitem_type == 0) ? '普通' : (item.Fitem_type == 3) ? '特供' : '其它',
        'type': item.type,
        'nsprice': item.nsprice,
        'nsunit': item.nsunit,
        'exptime': item.exptime,
        'selected': true
    });
    loadMainFrame('http://imgcache.qq.com/qzone/mall/v5/web/mall/present_v2.htm?type=new');
}

function askforMallItem(item){
    if (2 == item.Fitem_type) {
        alert("黄钻专用物品，不能索要");
        return;
    }
    if (4 == item.Fitem_type) {
        alert("非买品，不能索要");
        return;
    }
    if (0 >= item.nprice) {
        alert("免费物品不需索要，可直接装扮使用");
        return;
    }
    if (null == top.g_oAskfor) {
        top.g_oAskfor = {
            items: []
        };
    }
    for (var i = 0, l = top.g_oAskfor.items.length; i < l; i++) {
        if (parseInt(item.Fitem_id) == parseInt(top.g_oAskfor.items[i].itemid)) {
            loadMainFrame('http://imgcache.qq.com/qzone/mall/v5/web/mall/askfor_v2.htm');
            return;
        }
    }
    top.g_oAskfor.items.length = 0;
    top.g_oAskfor.items.push({
        'itemid': item.Fitem_id,
        'name': item.name,
        'itemtype': (item.Fitem_type == 0) ? '普通' : (item.Fitem_type == 3) ? '特供' : '其它',
        'type': item.type,
        'nsprice': item.nsprice,
        'nsunit': item.nsunit,
        'exptime': item.exptime,
        'selected': true
    });
    loadMainFrame('http://imgcache.qq.com/qzone/mall/v5/web/mall/askfor_v2.htm');
}

function addAtr(desObj, srcObj){
    for (var i in srcObj) {
        var b = false;
        for (var j in desObj) {
            if (i == j) {
                b = true;
                break;
            }
            if (!b) {
                desObj[i] = srcObj[i];
            }
        }
    }
}

function loadMainFrame(url){
    var iframe = document.getElementById('main');
    if (iframe) {
        iframe.src = url;
    }
    else {
        iframe = parent.document.getElementById('main');
        if (iframe) {
            iframe.src = url;
        }
        else {
            location = url;
        }
    }
}

function getParameter(name){
    var r = new RegExp("(\\?|#|&)" + name + "=([^&]*)(&|$)")
    var m = location.href.match(r)
    if (!m || '' == m) {
        m = top.location.href.match(r);
    }
    return (!m ? '' : m[2]);
}

if (typeof(QuickFunc) == "undefined" || !QuickFunc) {
    var QuickFunc = {};
}
QuickFunc.loadJson = function(url, callback, callbackFName, charset){
    var g = new QZONE.JSONGetter(url, Math.random().toString(), null, charset);
    g.onSuccess = callback;
    g.onError = callback;
    g.send(callbackFName);
}/*  |xGv00|2a1ad59448217e3d23f0aa1d0913f68d */
