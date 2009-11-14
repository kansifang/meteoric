
if (!top.g_SuitDetailItemInfo) 
    top.g_SuitDetailItemInfo = {
        data: []
    };
function suitlist_add(item){
    var list = top.g_scenario_suitlist.list;
    if (typeof(list) != 'undefined' && list.join("|").indexOf(item) == -1) 
        list[list.length] = item;
    return;
}

function suitlist_remove(item){
    var list = top.g_scenario_suitlist.list;
    if (typeof(list) != 'undefined' && list.length > 0) 
        for (var i = 0; i < list.length; i++) {
            if (list[i] == item) {
                if (list.length == 1) 
                    list.length--;
                else {
                    list[i] = list[list.length - 1];
                    list.length--;
                }
            }
        }
    return;
}

if (!top.g_mall_last_suit_type) 
    top.g_mall_last_suit_type = [];
if (!top.g_mall_last_suit_id) 
    top.g_mall_last_suit_id = [];
if (!top.g_mall_last_suit) 
    top.g_mall_last_suit = [];
if (!top.g_mall_last_suit_id_one) 
    top.g_mall_last_suit_id_one = 0;
function removeLastSuit(array){
    for (var i = 0; i < top.g_mall_last_suit_type.length; i++) {
        if (top.g_mall_last_suit_type[i] == 1 || top.g_mall_last_suit_type[i] == 6 || top.g_mall_last_suit_type[i] == 13 || top.g_mall_last_suit_type[i] == 14 || top.g_mall_last_suit_type[i] == 18 || top.g_mall_last_suit_type[i] == 19) {
            g_fullScreenChoice.init(top.g_mall_last_suit[i].Ftype_id, top.g_mall_last_suit[i].Fitem_id, top.g_mall_last_suit[i].posx, top.g_mall_last_suit[i].posy, top.g_mall_last_suit[i].width, top.g_mall_last_suit[i].height, top.g_mall_last_suit[i].zindex);
        }
        else 
            delFromScenario(top.g_mall_last_suit_type[i], top.g_mall_last_suit_id[i]);
    }
    top.g_mall_last_suit_type.length = 0;
    top.g_mall_last_suit_id.length = 0;
    top.g_mall_last_suit.length = 0;
    for (var i = 0; i < array.length; i++) {
        switch (parseInt(array[i].Ftype_id)) {
            default:
                top.g_mall_last_suit_type[top.g_mall_last_suit_type.length] = array[i].Ftype_id;
                top.g_mall_last_suit_id[top.g_mall_last_suit_id.length] = array[i].Fitem_id;
                top.g_mall_last_suit[top.g_mall_last_suit.length] = array[i];
        }
    }
}

if (!top.g_scenario_suitlist) 
    top.g_scenario_suitlist = {
        list: []
    }
if (!top.g_inSce) 
    top.g_inSce = {};
function suitSaveScenario(array, index, id, b, typeid, nocart){
    if (typeof(nocart) == 'undefined') 
        nocart = true;
    if (typeid != 31) {
        g_fullScreenChoice.init(array[0].Ftype_id, array[0].Fitem_id, array[0].posx, array[0].posy, array[0].width, array[0].height, array[0].zindex);
        return;
    }
    var sid = id.toString();
    for (var i in top.g_inSce) {
        if (i != sid) 
            top.g_inSce[i] = false;
    }
    if (b) {
        if (top.g_inSce[sid]) 
            return false;
        top.g_inSce[sid] = true;
    }
    else {
        if (typeof(top.g_inSce[sid]) == "undefined") {
            top.g_inSce[sid] = true;
        }
        else {
            top.g_inSce[sid] = !(top.g_inSce[sid]);
        }
    }
    fixJsonArrayLength(array);
    if (top.g_mall_last_suit_id_one != id) {
        removeLastSuit(array);
        top.g_mall_last_suit_id_one = id;
    }
    else {
        top.g_mall_last_suit_id_one = 0;
        top.g_mall_last_suit_type.length = 0;
        top.g_mall_last_suit_id.length = 0;
        top.g_mall_last_suit.length = 0;
    }
    if (top.g_inSce[sid]) {
        if (typeid == 31 && nocart) {
            suitlist_add(id);
        }
        for (var i = 0; i < array.length; i++) {
            g_fullScreenChoice.init(array[i].Ftype_id, array[i].Fitem_id, array[i].posx, array[i].posy, array[i].width, array[i].height, array[i].zindex);
        }
    }
    else {
        if (typeid == 31 && nocart) {
            suitlist_remove(id);
        }
        for (var i = 0; i < array.length; i++) {
            g_fullScreenChoice.init(array[i].Ftype_id, array[i].Fitem_id, array[i].posx, array[i].posy, array[i].width, array[i].height, array[i].zindex);
        }
    }
    return false;
}

if (!top.g_mall_primary_item) 
    top.g_mall_primary_item = 0;
function setPrimaryItem(id){
    top.g_mall_primary_item = parseInt(id);
}

function getPrimaryItem(){
    return top.g_mall_primary_item;
}

function clearPrimaryItem(){
    top.g_mall_primary_item = 0;
}

function checkPrimaryItem(id){
    if (getPrimaryItem() == id) {
        clearPrimaryItem();
    }
    else {
        setPrimaryItem(id);
    }
}

function suitSaveScenario2(array, index, id, b, typeid, nocart){
    if (typeof(nocart) == 'undefined') 
        nocart = true;
    if (typeid != 31) {
        g_fullScreenChoice.init(array[0].Ftype_id, array[0].Fitem_id, array[0].posx, array[0].posy, array[0].width, array[0].height, array[0].zindex);
        return;
    }
    var sid = id.toString();
    for (var i in top.g_inSce) {
        if (i != sid) 
            top.g_inSce[i] = false;
    }
    if (b) {
        if (top.g_inSce[sid]) 
            return false;
        top.g_inSce[sid] = true;
    }
    else {
        if (typeof(top.g_inSce[sid]) == "undefined") {
            top.g_inSce[sid] = true;
        }
        else {
            top.g_inSce[sid] = !(top.g_inSce[sid]);
        }
    }
    fixJsonArrayLength(array);
    if (top.g_mall_last_suit_id_one != id) 
        removeLastSuit(array);
    top.g_mall_last_suit_id_one = id;
    if (top.g_inSce[sid]) {
        if (typeid == 31 && nocart) 
            suitlist_add(id);
        for (var i = 0; i < array.length; i++) {
            if (parseInt(array[i].Fitem_id) == top.g_mall_primary_item) {
                continue;
            }
            g_fullScreenChoice.init(array[i].Ftype_id, array[i].Fitem_id, array[i].posx, array[i].posy, array[i].width, array[i].height, array[i].zindex);
        }
    }
    else {
        if (typeid == 31 && nocart) 
            suitlist_remove(id);
        for (var i = 0; i < array.length; i++) {
            if (parseInt(array[i].Fitem_id) == top.g_mall_primary_item) {
                continue;
            }
            g_fullScreenChoice.init(array[i].Ftype_id, array[i].Fitem_id, array[i].posx, array[i].posy, array[i].width, array[i].height, array[i].zindex);
        }
    }
    return false;
}/*  |xGv00|8b2a3935dbe787622cd043e31c37fe75 */

