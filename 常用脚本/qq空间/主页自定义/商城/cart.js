
var g_mallStaticsWebDir = 'http://imgcache.qq.com/qzone/mall/v5';
function suitDetailLength(obj){
    if (typeof(obj.suitItems) != "undefined" && typeof(obj.suitItems.length) != "undefined" && (obj.suitItems.length) > 0) {
        obj.suitItems.length -= 1;
    }
}

function clear_err_scenario(errstr){
    var arr, items, item;
    if (errstr.length <= 0) 
        return;
    arr = errstr.match(/(\d+)_(\d+)\|/g);
    if (arr.length <= 0) 
        return;
    for (var i = 0; i < arr.length; i++) {
        items = arr[i].match(/(\d+)/g);
        if (items.length != 2) 
            continue;
        item = findElementByID(items[0], items[1]);
        if (item != 'undefined') 
            window.top.space_addItem(item.type, 1, 0, 0, 0, 0, 0);
    }
}

var g_mallDataOp = {
    maxLen: 12,
    init: function(type){
        if (top.g_mallItemObjBag == null) {
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
        if (type && top.g_mallItemObjBag[type] == null) {
            top.g_mallItemObjBag[type] = [];
        }
        return top.g_mallItemObjBag[type];
    },
    clear: function(type){
        if (type) {
            if (top.g_mallItemObjBag[type]) {
                if (top.g_mallItemObjBag[type].length) 
                    top.g_mallItemObjBag[type].length = 0;
                else 
                    top.g_mallItemObjBag[type] = null;
            }
        }
        else {
            top.g_mallItemObjBag = null;
        }
    },
    getData: function(){
        this.init();
        return top.g_mallItemObjBag;
    },
    exist: function(obj){
        if (obj && obj.Fshop_bag) {
            var vector = this.init(obj.Fshop_bag);
            for (var i = 0; i < vector.length; i++) {
                if (vector[i].Fitem_id == obj.Fitem_id) {
                    return i;
                }
            }
        }
        return -1;
    },
    addAtr: function(desObj, srcObj){
        for (var j in srcObj) {
            var b = false;
            for (var k in desObj) {
                if (j == k) {
                    b = true;
                    break;
                }
                if (!b) {
                    desObj[j] = srcObj[j];
                }
            }
        }
    },
    moveAtr: function(type, att){
        if (!type || !att) 
            return 0;
        var vector = this.init(type);
        for (var i = 0; i < vector.length; i++) {
            vector[i][att] = null;
        }
        return 1;
    },
    addUnique: function(obj){
        if (obj && obj.Fshop_bag) {
            var i = this.exist(obj);
            var vector = this.init(obj.Fshop_bag);
            if (-1 != i) {
                this.addAtr(vector[i], obj);
                return 0;
            }
            vector[vector.length] = obj;
            return 1;
        }
        return -1;
    },
    addW: function(obj){
        var vector;
        if (obj) {
            if (obj[0] && obj[0].Fshop_bag) {
                this.init(obj[0].Fshop_bag);
                top.g_mallItemObjBag[obj[0].Fshop_bag] = obj
            }
            else {
                this.init();
                top.g_mallItemObjBag['unique'] = obj
            }
            return 1;
        }
        return -1;
    },
    move: function(obj){
        if (obj && obj.Fshop_bag) {
            var i = this.exist(obj);
            if (-1 == i) 
                return -1;
            var vector = this.init(obj.Fshop_bag);
            if (i != vector.length - 1) 
                vector[i] = vector[vector.length - 1];
            vector.length -= 1;
            return 1;
        }
    },
    check: function(obj){
        if (obj && obj.Fshop_bag) {
            var vector = this.init(obj.Fshop_bag);
            if (vector.length < this.maxLen) 
                return 0;
        }
        var i = this.exist(obj);
        if (i != -1) {
            return 1;
        }
        return -1;
    }
}
function mallCartInfoDeal(obj){
    for (var i = 0; i < obj.data.shopbag.length; i++) {
        if (obj.data.shopbag[i].Fshop_bag == 'notbuy') 
            g_mallDataOp.addUnique(obj.data.shopbag[i]);
    }
    if (obj.data.scenario.length > 0) {
        g_mallDataOp.moveAtr("notbuy", "Fscenario");
    }
    for (var i = 0; i < obj.data.scenario.length; i++) {
        if ((obj.data.scenario[i].Fshop_bag == 'notbuy') || (obj.data.scenario[i].Fshop_bag == 'yellow') || (obj.data.scenario[i].Fshop_bag == 'notsale')) {
            obj.data.scenario[i].Fscenario = 1;
            g_mallDataOp.addUnique(obj.data.scenario[i]);
        }
    }
    g_mallDataOp.addW(obj.unique);
}

var g_mallBuy = {
    msg: {
        buy: '您的物品栏已有该物品，无需购买，请试用后直接点击“保存方案”使用该物品。',
        notsale: '您选择的为非卖品，该商品不能购买',
        yellow: '该商品为黄钻贵族专用，请开通黄钻贵族后使用',
        free: '免费物品无需购买，请试用后直接点击“保存方案”使用该物品。',
        privilege: '尊敬的用户，您是黄钻贵族，可免费使用该商品 ，您只需：\n\n第1步：点击该物品试用\n第2步：点击商城右上角“保存装扮方案”即可'
    },
    buy: function(itemid, itemtype, nprice, vprice){
        var bVip = mallGetVipStatus();
        if (bVip) {
            if (0 == itemtype || 1 == itemtype || 2 == itemtype) {
                alert(this.msg.privilege);
                return;
            }
            else 
                if (4 == itemtype) {
                    alert(this.msg.notsale)
                    return;
                }
        }
        else {
            if (2 == itemtype) {
                alert(this.msg.yellow);
                return;
            }
            else 
                if (4 == itemtype) {
                    alert(this.msg.notsale);
                    return;
                }
                else 
                    if (parseInt(nprice) <= 0) {
                        alert(this.msg.free);
                        return;
                    }
        }
        var obj = {};
        obj.Fitem_id = itemid;
        obj.Fshop_bag = 'notbuy';
        var i = g_mallDataOp.check(obj);
        if (i == 1) {
            alert("您的购物车中已有该物品，无需再次添加");
        }
        else 
            if (i == -1) {
                alert("您的购物车中已有太多物品，不能继续添加，请购买后再继续选择");
            }
            else {
                var url = 'http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?bag_list=' + itemid + '&change_scenario=0&g_iUin=' + top.g_iUin +
                "&fullMode=" +
                ((top.zoneMode == 'izone') ? 1 : 0) +
                "&p=" +
                Math.random();
                g_mallGetCgiData.init(url, function(obj){
                    g_mallBuy.callback(obj)
                });
            }
    },
    callback: function(obj){
        mallCartInfoDeal(obj);
        if (obj.data.shopbag.length > 0) {
            if (obj.data.shopbag[0].Fshop_bag != 'notbuy') {
                alert(g_mallBuy.msg[obj.data.shopbag[0].Fshop_bag])
                return;
            }
            location.href = g_mallStaticsWebDir + "/web/cart/cart.htm";
        }
        else {
            alert(g_mallBuy.msg["privilege"]);
        }
    }
}
var g_mallSave = {
    saveScenario: function(){
        if (!top.QZONE.space.getEditFlag()) {
            alert('方案无修改');
            return;
        }
        top.QZONE.space.save(3, this.saveScenarioCallBack, {
            shop: 1
        });
    },
    saveScenarioCallBack: function(o){
        var url;
        var bVIP = mallGetVipStatus();
        if (o.ret == '0') {
            if (bVIP) 
                url = g_mallStaticsWebDir + "/web/cart/muti_pay_save_succ_vip.htm?type=mall_save_free";
            else 
                url = g_mallStaticsWebDir + "/web/cart/muti_pay_save_succ_novip.htm?type=mall_save_free";
        }
        else {
            url = g_mallStaticsWebDir + "/web/cart/unsucc.htm?msg=" + escape("保存装扮方案失败");
            return;
        }
        reloadFrame(url);
    },
    mallSave: function(){
        top.g_mallcallback_save_flag = 1;
        var url;
        if (top.skinupd) {
            url = "http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?suitlist=" + top.g_scenario_suitlist.list.join("|") +
            "&item_list=" +
            top.encodeWindows(true) +
            "&scenari_no=0" +
            "&styleid=" +
            top.g_StyleID +
            "&g_iUin=" +
            top.g_iUin +
            "&skinupd=" +
            top.skinupd +
            "&fullMode=" +
            ((top.zoneMode == 'izone') ? 1 : 0) +
            "&p=" +
            Math.random();
        }
        else {
            url = "http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?suitlist=" + top.g_scenario_suitlist.list.join("|") +
            "&item_list=" +
            top.encodeWindows(true) +
            "&scenari_no=0" +
            "&styleid=" +
            top.g_StyleID +
            "&g_iUin=" +
            top.g_iUin +
            "&fullMode=" +
            ((top.zoneMode == 'izone') ? 1 : 0) +
            "&p=" +
            Math.random();
        }
        var othis = this;
        g_mallGetCgiData.init(url, function(obj){
            othis.mallSaveCallBack(obj)
        });
    },
    mallSaveCallBack: function(obj){
        if (obj.unique.errscstr != '' && obj.unique.gotocart != '2') {
            alert(obj.unique.errscstr);
            g_mallMenuCommon.createUrl('hp');
            return;
        }
        if (obj.unique.changescenario != '1') {
            alert("参数不对");
            return;
        }
        mallCartInfoDeal(obj);
        var url;
        var bVip = mallGetVipStatus();
        if (obj.unique.gotocart == '1') {
            url = g_mallStaticsWebDir + "/web/cart/cart.htm";
        }
        else {
            if (obj.unique.gotocart == '2') {
                if (confirm("您的方案中有非法物品，清除后方能继续保存，是否要现在清除？")) 
                    clear_err_scenario(obj.unique.errtypeid);
                top.QZONE.space.save(3, null, {
                    shop: 1
                });
            }
            this.scenarioClear();
            if (bVip) 
                url = g_mallStaticsWebDir + "/web/cart/muti_pay_save_succ_vip.htm?type=mall_save_free";
            else 
                url = g_mallStaticsWebDir + "/web/cart/muti_pay_save_succ_novip.htm?type=mall_save_free";
        }
        reloadFrame(url);
    },
    shopBagSave: function(qb, qd, gwq, payitem){
        var url;
        if (top.skinupd) {
            url = "http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?item_list=" + top.encodeWindows(true) + "&scenari_no=0&styleid=" + top.g_StyleID + "&save_type=shop_bag" + "&g_iUin=" + top.g_iUin + "&skinupd=" + top.skinupd + "&frameStyle=" + top.frameStyle + "&fullMode=" + ((top.zoneMode == 'izone') ? 1 : 0);
        }
        else {
            url = "http://pay.qzone.qq.com/fcg-bin/fcg_mall_save_v5?item_list=" + top.encodeWindows(true) + "&scenari_no=0&styleid=" + top.g_StyleID + "&save_type=shop_bag" + "&g_iUin=" + top.g_iUin + "&frameStyle=" + top.frameStyle + "&fullMode=" + ((top.zoneMode == 'izone') ? 1 : 0);
        }
        var othis = this;
        g_mallGetCgiData.init(url, function(obj){
            othis.shoBagCallBack(obj, qb, qd, gwq)
        });
    },
    shoBagCallBack: function(obj, qb, qd, gwq){
        if (obj.unique.changescenario != '1' || obj.unique.savetype != 'shop_bag') {
            alert("参数不对");
            return;
        }
        mallCartInfoDeal(obj);
        top.QZONE.space.save(3, null, {
            shop: 1
        });
        var url;
        if (obj.unique.savescenario == '1') {
            this.scenarioClear();
            url = 'http://imgcache.qq.com/qzone/mall/v5/web/cart/cart_result.htm?type=acct&save=0&qb=' + qb + '&qd=' + qd + '&gwq=' + gwq;
        }
        else {
            url = 'http://imgcache.qq.com/qzone/mall/v5/web/cart/cart_result.htm?type=acct&save=-1&qb=' + qb + '&qd=' + qd + '&gwq=' + gwq;
        }
        reloadFrame(url);
    },
    scenarioClear: function(){
        top.g_EditFlag = 0;
    }
}
function mallShopBag(){
    top.g_mallcallback_save_flag = 0;
    var data = g_mallDataOp.getData();
    if (data.notbuy.length <= 0) {
        alert("您的购物车没有物品!");
    }
    else {
        var url = g_mallStaticsWebDir + "/web/cart/cart.htm";
        reloadFrame(url);
    }
}

function mallGive(itemid, name, itemtype, type, nprice, nsprice, nsunit, exptime, itemanme){
    if (2 == itemtype) {
        alert("黄钻专用物品，不能赠送");
        return;
    }
    if (4 == itemtype) {
        alert("非买品，不能赠送");
        return;
    }
    if (parseFloat(nprice) <= 0) {
        alert("免费物品不需要赠送，对方可直接装扮使用");
        return;
    }
    if (top.g_oGive == null) {
        top.g_oGive = {
            items: []
        };
    }
    else {
        for (index in top.g_oGive.items) {
            if (parseInt(itemid) == parseInt(top.g_oGive.items[index].itemid)) {
                location.href = g_mallStaticsWebDir + "/web/mall/present_v2.htm?type=new";
                return;
            }
        }
    }
    top.g_oGive.items.length = 0;
    top.g_oGive.items[top.g_oGive.items.length] = new Object();
    top.g_oGive.items[top.g_oGive.items.length - 1].itemid = itemid;
    top.g_oGive.items[top.g_oGive.items.length - 1].name = name;
    if (0 == itemtype) 
        top.g_oGive.items[top.g_oGive.items.length - 1].itemtype = "普通";
    else 
        if (3 == itemtype) 
            top.g_oGive.items[top.g_oGive.items.length - 1].itemtype = "特供";
        else 
            top.g_oGive.items[top.g_oGive.items.length - 1].itemtype = "其它";
    top.g_oGive.items[top.g_oGive.items.length - 1].type = type;
    top.g_oGive.items[top.g_oGive.items.length - 1].nsprice = nsprice;
    top.g_oGive.items[top.g_oGive.items.length - 1].nsunit = nsunit;
    top.g_oGive.items[top.g_oGive.items.length - 1].exptime = exptime;
    top.g_oGive.items[top.g_oGive.items.length - 1].selected = true;
    location.href = g_mallStaticsWebDir + "/web/mall/present_v2.htm?type=new";
    return;
}

function mallAskfor(itemid, name, itemtype, type, nprice, nsprice, nsunit, exptime, itemanme){
    if (2 == itemtype) {
        alert("黄钻专用物品，不能索要");
        return;
    }
    if (4 == itemtype) {
        alert("非买品，不能索要");
        return;
    }
    if (parseFloat(nprice) <= 0) {
        alert("免费物品不需索要，可直接装扮使用");
        return;
    }
    if (top.g_oAskfor == null) {
        top.g_oAskfor = {
            items: []
        };
    }
    else {
        for (index in top.g_oAskfor.items) {
            if (parseInt(itemid) == parseInt(top.g_oAskfor.items[index].itemid)) {
                location.href = g_mallStaticsWebDir + "/web/mall/askfor_v2.htm";
                return;
            }
        }
    }
    top.g_oAskfor.items.length = 0;
    top.g_oAskfor.items[top.g_oAskfor.items.length] = new Object();
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].itemid = itemid;
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].name = name;
    if (0 == itemtype) 
        top.g_oAskfor.items[top.g_oAskfor.items.length - 1].itemtype = "普通";
    else 
        if (3 == itemtype) 
            top.g_oAskfor.items[top.g_oAskfor.items.length - 1].itemtype = "特供";
        else 
            top.g_oAskfor.items[top.g_oAskfor.items.length - 1].itemtype = "其它";
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].type = type;
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].nsprice = nsprice;
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].nsunit = nsunit;
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].exptime = exptime;
    top.g_oAskfor.items[top.g_oAskfor.items.length - 1].selected = true;
    location.href = g_mallStaticsWebDir + "/web/mall/askfor_v2.htm";
    return;
}

function mallGetVipStatus(){
    if (top.getVipFlag && top.getVipFlag("diamon") == "1") 
        return true;
    else 
        return false;
}/*  |xGv00|03a885a7ac7cc63870d3337d873e109d */

