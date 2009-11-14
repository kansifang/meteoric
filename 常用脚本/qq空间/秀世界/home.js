
AR_LAY_MSBTM = 0;
AR_LAY_BGIMG = 100;
AR_LAY_EVNT1 = 10;
AR_LAY_ITEM1 = 15;
AR_LAY_AVATA = 20;
AR_LAY_ITEM2 = 25;
AR_LAY_EVNT2 = 30;
AR_LAY_TALKB = 35;
AR_LAY_EVNT3 = 40;
AR_LAY_MSTOP = 999;
AR_ATTR_AVA = 0;
AR_ATTR_FLOR = 11;
AR_ATTR_WALL = 12;
AR_ATTR_SPEC = 13;
AR_ATTR_MOVE = 15;
AR_ATTR_ITEM = 16;
AR_ATTR_GAME = 99;
AR_ATTR_SKIN = 101;
AR_SKILL_GAME = 0x01;
BASE_ITEMNO = 1;
HOME_VER = "V1";
SPLIT_G = "#";
SPLIT_I = "|";
SPLIT_P = "_";
SPLIT_ITEMINFO = ".";
HOME_D_LAY = 50;
DEF_APPID = 0;
TOOLBAR_HTML = '<button type="button" class="change" title="QQ"></button><button type="button" class="mirror" title="ԴƷо淭ת"></button><button type="button" class="max_z_index" title="Ʒڶ">ö</button><button type="button" class="min_z_index" title="Ʒڵײ">õ</button><button type="button" class="del" title="ɾ">ɾ</button><button type="button" class="remove_show" title="Ƴ">Ƴ</button><button type="button" class="add_z_index" title="ߴƷ㼶"></button><button type="button" class="sub_z_index" title="ʹƷ㼶"></button><button type="button" class="show_btn" title="չť">չ</button><button type="button" class="hide_btn" title="ذť"></button>';
HOME_D_USER_LAY = 900;
HOME_SHOW_CONFIG = ["iItemNo", "iUniCode", "iRev", "iXPos", "iYPos", "iPlyNo", "bMov", "iType", "iStyle", "bEvt", "bSelc", "bRot", "iZoom", "Content"];
HOME_SHOW_USER_CONFIG = ["iUin", "iUniCode", "iRev", "iXPos", "iYPos", "iItemNo", "strContent"];
Function.prototype.extend = function(baseClass){
    this.baseClass = baseClass;
    for (var ptototypeName in baseClass.prototype) {
        if (typeof(this.prototype[ptototypeName]) === 'undefined') {
            this.prototype[ptototypeName] = baseClass.prototype[ptototypeName];
        }
    }
};
Function.prototype.initializeBase = function(){
    if (typeof(this.baseClass) === 'undefined') 
        return;
    var self = arguments[0];
    if (!self) 
        return;
    this.baseClass.apply(self, arguments[1]);
};
Array.prototype.remove = function(iPos){
    if (isNaN(iPos) || iPos > this.length) {
        return false;
    }
    this.splice(iPos, 1);
};
Array.prototype.insertAt = function(index, value){
    var part1 = this.slice(0, index);
    var part2 = this.slice(index);
    part1.push(value);
    return (part1.concat(part2));
};
function SetUserBubble(oParent, iBubId, iUin, iStyle){
    HomeBusController.SetUserBubble(oParent, iBubId, iUin, iStyle);
}

function SetUserHisShow(oParent, iHisId, iUin){
    HomeBusController.SetUserHisShow(oParent, iHisId, iUin);
}

function AddItem(oParent, stItemNo, iUniCode, iRev, iXPos, iYPos, iPlyNo, bMov, iType, iStyle, sName){
    var iItemNo;
    if (typeof(stItemNo) == "object" && stItemNo.length == 3) {
        iItemNo = stItemNo[1];
    }
    else {
        iItemNo = stItemNo;
    }
    if (iItemNo != BASE_ITEMNO) 
        HomeBusController.SavePoint(oParent);
    var _checkbgitem_ = function(){
        var a = oParent.m_oScene.m_arrItems;
        var b1;
        var b2;
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i].m_iPlyNo == AR_ATTR_FLOR) 
                b1 = a[i].m_iItemNo;
            if (a[i].m_iPlyNo == AR_ATTR_WALL) 
                b2 = a[i].m_iItemNo;
        }
        return b1 == b2;
    }
    var arrPno = iPlyNo.toString().split("|");
    var bReplace;
    var oItemBg1 = new HomeItem(BASE_ITEMNO, 0, 0, 0, 0, 11, 0, 1);
    var oItemBg2 = new HomeItem(BASE_ITEMNO, 0, 0, 0, 0, 12, 0, 1);
    for (var i = 0; i < arrPno.length; i++) {
        if (iItemNo != BASE_ITEMNO && !bReplace && (parseInt(arrPno[i]) == AR_ATTR_FLOR || parseInt(arrPno[i]) == AR_ATTR_WALL)) {
            if (_checkbgitem_()) {
                HomeBusController.AddItem(oParent, oItemBg1);
                HomeBusController.AddItem(oParent, oItemBg2);
            }
            bReplace = true;
        }
        var oItem = new HomeItem(stItemNo, iUniCode, iRev, iXPos, iYPos, parseInt(arrPno[i]), bMov, iType, iStyle, sName);
        HomeBusController.AddItem(oParent, oItem);
    }
    return oItem;
}

function AddUser(oParent, iUin, iUniCode, iRev, iXPos, iYPos, strContent){
    var oTmp = oParent.m_oScene.m_arrUsers;
    for (var i = 0, len = oTmp.length; i < len; i++) 
        if (oTmp[i].m_iUin == iUin) 
            return null;
    var oItem = new UserObject(iUin, iUniCode, iRev, iXPos, iYPos, 0, strContent);
    HomeBusController.AddUser(oParent, oItem);
    return oItem;
}

function DelItem(oParent, bNotDestroy){
    HomeBusController.SavePoint(oParent);
    if (oParent.m_arrSelectItem.length == 0) {
        debug("ûѡеItem");
        return -1;
    }
    var oItem = oParent.m_arrSelectItem[0];
    var ino = oItem.m_iItemNo;
    if (oItem.m_iPlyNo <= AR_LAY_BGIMG) {
        var arrItem = [];
        for (var i = 0, len = oParent.m_oScene.m_arrItems.length; i < len; i++) {
            var item = oParent.m_oScene.m_arrItems[i];
            if (item.m_iItemNo == ino) 
                arrItem.push(item)
        }
        for (var i = 0; i < arrItem.length; i++) {
            if (arrItem[i].m_iPlyNo == AR_ATTR_FLOR || arrItem[i].m_iPlyNo == AR_ATTR_WALL) {
                var oItemBg1 = new HomeItem(BASE_ITEMNO, 0, 0, 0, 0, arrItem[i].m_iPlyNo, 0, 1);
                HomeBusController.AddItem(oParent, oItemBg1);
            }
            else {
                HomeBusController.RemoveItem(oParent, arrItem[i], bNotDestroy);
            }
        }
    }
    else 
        HomeBusController.RemoveItem(oParent, oItem, bNotDestroy);
    oParent.m_oToolbar.hide();
    return 0;
}

function DelUser(oParent, iUin){
    var oTmp = oParent.m_oScene.m_arrUsers;
    for (var i = 0, len = oTmp.length; i < len; i++) {
        if (oTmp[i].m_iUin == iUin) {
            HomeBusController.RemoveItem(oParent, oTmp[i]);
            break;
        }
    }
    oParent.m_oToolbar.hide();
    return 0;
}

function RevItem(oParent, oItem){
    if (!oItem) 
        oItem = oParent.m_arrSelectItem[0];
    HomeBusController.SavePoint(oParent);
    HomeBusController.RevItem(oParent, oItem);
}

function ItemTop(oParent){
    if (oParent.m_arrSelectItem.length == 0) {
        debug("ûѡеItem");
        return -1;
    }
    for (var i = 0, len = oParent.m_arrSelectItem.length; i < len; i++) 
        HomeBusController.ItemTop(oParent, oParent.m_arrSelectItem[i]);
    return 0;
}

function ItemBottom(oParent){
    if (oParent.m_arrSelectItem.length == 0) {
        debug("ûѡеItem");
        return -1;
    }
    for (var i = 0, len = oParent.m_arrSelectItem.length; i < len; i++) 
        HomeBusController.ItemBottom(oParent, oParent.m_arrSelectItem[i]);
    return 0;
}

function ItemDown(oParent){
    if (oParent.m_arrSelectItem.length == 0) {
        debug("ûѡеItem");
        return -1;
    }
    for (var i = 0, len = oParent.m_arrSelectItem.length; i < len; i++) 
        HomeBusController.ItemDown(oParent, oParent.m_arrSelectItem[i]);
    return 0;
}

function ItemUp(oParent){
    if (oParent.m_arrSelectItem.length == 0) {
        debug("ûѡеItem");
        return -1;
    }
    for (var i = 0, len = oParent.m_arrSelectItem.length; i < len; i++) 
        HomeBusController.ItemUp(oParent, oParent.m_arrSelectItem[len - i - 1]);
    return 0;
}

function SetUserWord(oParent, iUin, sWord, sNick, bNotEscpHtml, bubId, showId){
    var oTmp = oParent.m_oScene.m_arrUsers;
    for (var i = 0, len = oTmp.length; i < len; i++) {
        if (oTmp[i].m_iUin == iUin) {
            var oDivUser = oTmp[i].m_oNode.childNodes[1];
            var oDivWord = oTmp[i].m_oNode.childNodes[0].childNodes[0];
            oDivUser.childNodes[0].innerHTML = sNick.escHtml();
            var aWords = sWord.split("<BR>");
            oDivWord.childNodes[0].childNodes[0].innerHTML = bNotEscpHtml ? sWord : sWord.escHtml();
            oTmp[i].m_oNode.title = sNick;
            if (!sWord || sWord.trim() == "") 
                return;
            oTmp[i].m_oNode.childNodes[0].style.display = "";
            if (aWords.length > 3 || oDivWord.childNodes[0].childNodes[0].innerText.asclen() > 40) 
                SetUserBubble(oParent, bubId, iUin);
            else 
                SetUserBubble(oParent, bubId, iUin, 1);
            break;
        }
    }
}

function ClearStep(oThis){
    oThis.m_arrHistory = [];
    oThis.m_iHistoryPointer = 0;
}

function HomeBusController(){
}
(function(){
    HomeBusController.RotateItem = function(oThis, oItem, anti){
        if (oItem == null) {
            var oItem = oThis.m_arrSelectItem[0];
            var deg = oItem.m_bMov;
            if (!anti) {
                deg = (deg + 15) >= 360 ? 0 : deg + 15;
            }
            else {
                deg = (deg - 15) < 0 ? 360 + deg - 15 : deg - 15;
            }
        }
        else {
            var deg = oItem.m_bMov;
        }
        if (deg % 15 != 0) 
            return;
        if (Browser.isFirefox || Browser.isSafari || Browser.isOpera) {
            var ctx = oItem.m_oCanvas.getContext('2d');
            var w = oItem.m_oCanvas.img.naturalWidth || oItem.m_oCanvas.img.width;
            var h = oItem.m_oCanvas.img.naturalHeight || oItem.m_oCanvas.img.height;
            ctx.clearRect(0, 0, w, h);
            var rad = deg * 2 * 3.1415926 / 360;
            var x0 = oItem.m_iXPos;
            var y0 = oItem.m_iYPos;
            var x, y, wi, hi;
            var iSin;
            var iCos;
            function getSinCos(deg){
                rad = deg * 2 * Math.PI / 360;
                iSin = Math.sin(rad);
                iCos = Math.cos(rad);
            }
            if (deg <= 90) {
                getSinCos(deg);
                x = h * iSin;
                y = 0;
                wi = h * iSin + w * iCos;
                hi = w * iSin + h * iCos;
            }
            else 
                if (deg > 90 && deg <= 180) {
                    getSinCos(180 - deg);
                    x = h * iSin + w * iCos;
                    y = h * iCos;
                    wi = h * iSin + w * iCos;
                    hi = w * iSin + h * iCos;
                }
                else 
                    if (deg > 180 && deg < 270) {
                        getSinCos(270 - deg);
                        x = w * iSin;
                        y = h * iSin + w * iCos;
                        wi = h * iCos + w * iSin;
                        hi = h * iSin + w * iCos;
                    }
                    else {
                        getSinCos(360 - deg);
                        x = 0;
                        y = w * iSin;
                        wi = w * iCos + h * iSin;
                        hi = w * iSin + h * iCos;
                    }
            oItem.m_oCanvas.setAttribute('width', wi);
            oItem.m_oCanvas.setAttribute('height', hi);
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.drawImage(oItem.m_oCanvas.img, 0, 0);
        }
        else {
            var sFilter = "progid:DXImageTransform.Microsoft.Matrix(";
            var fM11, fM12, fM21, fM22, fDx, fDy, sType, sMethod;
            var oDiv, oCodeDiv, oTxtRotation, oBtnRotation;
            var deg2rad = Math.PI * 2 / 360;
            rad = deg * deg2rad;
            costheta = Math.cos(rad);
            sintheta = Math.sin(rad);
            M11 = costheta;
            M12 = -sintheta;
            M21 = sintheta;
            M22 = costheta;
            fM11 = Math.round(M11 * 10) / 10;
            fM12 = Math.round(M12 * 10) / 10;
            fM21 = Math.round(M21 * 10) / 10;
            fM22 = Math.round(M22 * 10) / 10;
            sFilter += "M11=" + fM11 + ",M12=" + fM12 + ",M21=" + fM21 + ",M22=" + fM22 + " sizingmethod='auto expand');";
            oItem.m_oNode.style.filter = sFilter;
        }
        oItem.m_bMov = deg;
        return;
    }
    HomeBusController.SetUserHisShow = function(oParent, iHisId, iUin){
        var oUserObj = __getuser__(oParent, iUin);
        if (!oUserObj) 
            return;
        oUserObj.m_iItemNo = iHisId;
        ElementFactory.FreshUserShow(oUserObj);
    }
    HomeBusController.SetUserBubble = function(oThis, iBubId, iUin, iStyle){
        var oUserObj = __getuser__(oThis, iUin);
        iBubId = iBubId ? iBubId : 2000002;
        iBubId = iBubId < 2000000 ? 2000002 : iBubId;
        oUserObj.oWordPanel.className = iStyle == 1 ? "room_bubble bubble1" : "room_bubble bubble0";
        oUserObj.oWordPanel.oBubDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://qqhome2-item.qq.com/" + iBubId + "/" + (iStyle == 1 ? 11 : 12) + "/01/', sizingMethod='scale');";
    }
    HomeBusController.SavePoint = function(oThis){
        __save_point__(oThis);
    }
    HomeBusController.MarkUser = function(oThis, iUin){
        var oUserObj = __getuser__(oThis, iUin);
        if (!oUserObj) 
            return;
        QZONE.css.removeClassName(oUserObj.m_oNode, "hover");
        QZONE.css.removeClassName(oUserObj.m_oNode, "selected");
        QZONE.css.addClassName(oUserObj.m_oNode, "master");
    }
    HomeBusController.BindToolbar = function(oThis, oToolbar, fnOnBtClick){
        if (!oToolbar) 
            oToolbar = new QSWORLD.TOOLBAR(oThis, "toolbar", fnOnBtClick);
        oThis.appendChild(oToolbar.htmlToolbar);
        oThis.m_oToolbar = oToolbar;
        HomeEvent.addEventListener(oToolbar.htmlToolbar, "onmouseover", function(event){
            oToolbar.m_bBlockEvt = true;
            if (oToolbar.m_oNowItem && oToolbar.m_oNowItem.m_oNode) 
                oToolbar.m_oNowItem.m_oNode.className += " hover";
        });
        HomeEvent.addEventListener(oToolbar.htmlToolbar, "onmouseout", function(event){
            oToolbar.m_bBlockEvt = false;
            if (oToolbar.m_oNowItem && oToolbar.m_oNowItem.m_oNode) 
                oToolbar.m_oNowItem.m_oNode.className = oToolbar.m_oNowItem.m_oNode.className.replaceAll(" hover", "");
        });
        return oToolbar;
    }
    HomeBusController.Undo = function(oThis){
        if (oThis.m_iHistoryPointer <= 0) 
            return false;
        if (oThis.m_iHistoryPointer == oThis.m_arrHistory.length) {
            HomeBusController.SavePoint(oThis);
            oThis.m_iHistoryPointer--;
        }
        HomeBusController.SetDefault(oThis, true);
        HomeShow.Decode(oThis, oThis.m_arrHistory[--oThis.m_iHistoryPointer]);
        return true;
    }
    HomeBusController.Redo = function(oThis){
        if (oThis.m_iHistoryPointer >= oThis.m_arrHistory.length - 1) 
            return false;
        HomeBusController.SetDefault(oThis, true);
        HomeShow.Decode(oThis, oThis.m_arrHistory[++oThis.m_iHistoryPointer]);
        return true;
    }
    function __init__(oThis){
        var oItemBg1 = new HomeItem(BASE_ITEMNO, 0, 0, 0, 0, "11|12", 0, 1);
        AddItem(oThis, BASE_ITEMNO, 0, 0, 0, 0, "11|12", 0, 0);
    }
    HomeBusController.SetDefault = function(oThis, bFlag){
        for (var i = 0, len = oThis.m_oScene.m_arrUsers.length; i < len; i++) 
            oThis.m_oScene.m_arrUsers[i].Destroy();
        for (var i = 0, len = oThis.m_oScene.m_arrItems.length; i < len; i++) 
            oThis.m_oScene.m_arrItems[i].Destroy();
        oThis.m_oScene.m_arrUsers = [];
        oThis.m_oScene.m_arrItems = [];
        oThis.innerHTML = "";
        if (bFlag) 
            __init__(oThis);
    }
    HomeBusController.Reset = function(oThis){
        HomeBusController.SetDefault(oThis);
        oThis.m_iUin = null;
        oThis.m_oScene = null;
        oThis.m_arrSelectItem = [];
    }
    HomeBusController.AddUser = function(oThis, oUser){
        if (!oThis.m_oScene) {
            alert("δ");
            return -1;
        }
        oUser.m_oParent = oThis;
        if (oUser.m_iUniCode == 0) 
            __generate_layer_no__(oThis, oUser);
        var arrUser = oThis.m_oScene.m_arrUsers;
        if (oUser.m_iUniCode < HOME_D_USER_LAY) {
            var arrObjItems = oThis.m_oScene.m_arrItems;
            var len = arrObjItems.length;
            var pos = len - oUser.m_iUniCode;
            if (arrObjItems[pos] && arrObjItems[pos].IsBgItem()) {
                pos++;
            }
            if (arrObjItems[pos]) {
                oThis.insertBefore(ElementFactory.GetHtmlNode(oUser), arrObjItems[pos].m_oNode);
                arrUser[arrUser.length] = oUser;
                return oUser;
            }
        }
        oThis.appendChild(ElementFactory.GetHtmlNode(oUser));
        arrUser[arrUser.length] = oUser;
        return oUser;
    }
    HomeBusController.AddItem = function(oThis, oItem){
        if (!oThis.m_oScene) {
            debug("δ");
            return -1;
        }
        oItem.m_oParent = oThis;
        if (oItem.m_iUniCode == 0) 
            __generate_layer_no__(oThis, oItem);
        var arrItem = oThis.m_oScene.m_arrItems;
        var bFlag = false;
        if (oItem.m_iPlyNo > 0 && oItem.IsBgItem()) {
            for (var i = 0, len = arrItem.length; i < len; i++) {
                if (arrItem[i].m_iPlyNo == oItem.m_iPlyNo) {
                    if (arrItem[i + 1]) {
                        oThis.insertBefore(ElementFactory.GetHtmlNode(oItem), arrItem[i + 1].m_oNode);
                    }
                    else {
                        __insert_or_append__(oThis, oItem);
                    }
                    oThis.removeChild(arrItem[i].m_oNode);
                    arrItem[i].Destroy();
                    arrItem[i] = oItem;
                    bFlag = true;
                    break;
                }
                if (!arrItem[i].IsBgItem()) {
                    oThis.insertBefore(ElementFactory.GetHtmlNode(oItem), arrItem[i].m_oNode);
                    arrItem = arrItem.insertAt(i - 1, oItem);
                    oThis.m_oScene.m_arrItems = arrItem;
                    bFlag = true;
                    break;
                }
            }
            if (!bFlag) {
                __insert_or_append__(oThis, oItem);
                arrItem[arrItem.length] = oItem;
            }
        }
        else {
            __insert_or_append__(oThis, oItem);
            arrItem[arrItem.length] = oItem;
        }
        return 0;
    };
    HomeBusController.RemoveItem = function(oThis, oItem, bNotDestroy){
        oThis.removeChild(oItem.m_oNode);
        var arrItems;
        if (oItem.type == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (oItem.type == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i] == oItem) {
                arrItems.remove(i);
                break;
            }
        }
        for (var i = 0, len = oThis.m_arrSelectItem.length; i < len; i++) {
            if (oThis.m_arrSelectItem[i] == oItem) {
                oThis.m_arrSelectItem.remove(i);
                break;
            }
        }
        if (!bNotDestroy) 
            oItem.Destroy();
        return 0;
    };
    HomeBusController.SelectItem = function(oItem, bMult){
        if (bMult) {
            oItem.m_oParent.m_arrSelectItem[oItem.m_oParent.m_arrSelectItem.length] = oItem;
        }
        else {
            oItem.m_oParent.m_arrSelectItem = [];
            oItem.m_oParent.m_arrSelectItem[0] = oItem;
        }
        debug("ѡItemNO = " + oItem.m_iItemNo + "Item Id = " + oItem.m_oNode.id + "Layid = " + oItem.m_iUniCode);
        return 0;
    };
    HomeBusController.RevItem = function(oParent, oItem){
        if (Browser.isFirefox || Browser.isSafari || Browser.isOpera) {
            var ctx = oItem.m_oCanvas.getContext('2d');
            var w = oItem.m_oCanvas.img.naturalWidth || oItem.m_oCanvas.img.width;
            var h = oItem.m_oCanvas.img.naturalHeight || oItem.m_oCanvas.img.height;
            ctx.clearRect(0, 0, w, h);
            ctx.translate(oItem.m_oCanvas.img.width - 1, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(oItem.m_oCanvas.img, 0, 0);
            if (oItem.m_iRev == 0) {
                oItem.m_iRev = 1;
            }
            else {
                oItem.m_iRev = 0;
            }
            return;
        }
        if (oItem.m_iRev == 0) {
            if (oItem.type != 2) {
                oItem.m_oNode.style.filter += " FlipH";
            }
            else {
                oItem.m_oNode.className += " filp_h";
            }
            oItem.m_iRev = 1;
        }
        else {
            var strTmp;
            if (oItem.type != 2) {
                oItem.m_oNode.style.filter = oItem.m_oNode.style.filter.replace(" FlipH", "");
            }
            else {
                oItem.m_oNode.className = oItem.m_oNode.className.replace(' filp_h', '');
            }
            oItem.m_iRev = 0;
        }
    };
    HomeBusController.ItemUp = function(oThis, oItem){
        __save_point__(oThis);
        var arrItems;
        if (oItem.type == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (oItem.type == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        var iPos;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i] == oItem) {
                if (oItem.type != 2 && !arrItems[i + 1]) {
                    return -1;
                }
                if (oItem.type == 2 && oItem.m_iUniCode < HOME_D_USER_LAY) {
                    if (arrItems[i + 1] && (arrItems[i + 1].m_iUniCode == oItem.m_iUniCode || arrItems[i + 1].m_iUniCode + 1 == oItem.m_iUniCode)) {
                        __switch__item__(oThis, i + 1, i, oItem.type);
                        var oTemp = arrItems[i + 1];
                        arrItems[i + 1] = arrItems[i];
                        arrItems[i] = oTemp;
                        var iLay = arrItems[i].m_iUniCode;
                        arrItems[i].m_iUniCode = arrItems[i + 1].m_iUniCode;
                        arrItems[i + 1].m_iUniCode = iLay;
                        return 0;
                    }
                    var arrObjItems = oThis.m_oScene.m_arrItems;
                    var len = arrObjItems.length;
                    var pos = len - oItem.m_iUniCode;
                    if (arrObjItems[pos]) {
                        __switch__item2__(oThis, arrObjItems[pos].m_oNode, oItem.m_oNode);
                        oItem.m_iUniCode--;
                        break;
                    }
                    else {
                        oItem.m_iUniCode = HOME_D_USER_LAY;
                    }
                }
                if (oItem.type == 2 && oItem.m_iUniCode >= HOME_D_USER_LAY && !arrItems[i + 1]) {
                    return -1;
                }
                __switch__item__(oThis, i + 1, i, oItem.type);
                var oTemp = arrItems[i + 1];
                arrItems[i + 1] = arrItems[i];
                arrItems[i] = oTemp;
                var iLay = arrItems[i].m_iUniCode;
                arrItems[i].m_iUniCode = arrItems[i + 1].m_iUniCode;
                arrItems[i + 1].m_iUniCode = iLay;
                break;
            }
        }
        return 0;
    };
    HomeBusController.ItemDown = function(oThis, oItem){
        __save_point__(oThis);
        var arrItems;
        if (oItem.type == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (oItem.type == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        var iPos;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i] == oItem) {
                if (i == 0 || (arrItems[i - 1] && arrItems[i - 1].IsBgItem())) {
                    if (oItem.type == 2) {
                        var arrObjItems = oThis.m_oScene.m_arrItems;
                        var len = arrObjItems.length;
                        var pos = oItem.m_iUniCode >= HOME_D_USER_LAY ? 0 : oItem.m_iUniCode;
                        if (len - pos - 1 <= 0 || arrObjItems[len - pos - 1] && arrObjItems[len - pos - 1].IsBgItem()) {
                            return -1;
                        }
                        __switch__item2__(oThis, oItem.m_oNode, arrObjItems[len - pos - 1].m_oNode);
                        oItem.m_iUniCode = ++pos;
                        return 0;
                    }
                    else 
                        return -1;
                }
                else 
                    if (oItem.type == 2 && arrItems[i - 1].m_iUniCode < HOME_D_USER_LAY) {
                        if (arrItems[i - 1] && arrItems[i - 1].m_iUniCode == oItem.m_iUniCode) {
                            __switch__item__(oThis, i, i - 1, oItem.type);
                            var oTemp = arrItems[i - 1];
                            arrItems[i - 1] = arrItems[i];
                            arrItems[i] = oTemp;
                            var iLay = arrItems[i - 1].m_iUniCode;
                            arrItems[i - 1].m_iUniCode = arrItems[i].m_iUniCode;
                            arrItems[i].m_iUniCode = iLay;
                            return 0;
                        }
                        var arrObjItems = oThis.m_oScene.m_arrItems;
                        var len = arrObjItems.length;
                        var pos = oItem.m_iUniCode >= HOME_D_USER_LAY ? 0 : oItem.m_iUniCode;
                        if (len - pos - 1 <= 0 || arrObjItems[len - pos - 1] && arrObjItems[len - pos - 1].IsBgItem()) {
                            return -1;
                        }
                        __switch__item2__(oThis, oItem.m_oNode, arrObjItems[len - pos - 1].m_oNode);
                        oItem.m_iUniCode = ++pos;
                        return 0;
                    }
                __switch__item__(oThis, i, i - 1, oItem.type);
                var oTemp = arrItems[i - 1];
                arrItems[i - 1] = arrItems[i];
                arrItems[i] = oTemp;
                var iLay = arrItems[i - 1].m_iUniCode;
                arrItems[i - 1].m_iUniCode = arrItems[i].m_iUniCode;
                arrItems[i].m_iUniCode = iLay;
                break;
            }
        }
        return 0;
    };
    HomeBusController.ItemTop = function(oThis, oItem){
        __save_point__(oThis);
        var arrItems;
        if (oItem.type == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (oItem.type == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i] == oItem) {
                if (oItem.type == 1) 
                    __insert_or_append__(oThis, arrItems[i]);
                else {
                    arrItems[i].m_iUniCode = arrItems[arrItems.length - 1].m_iUniCode >= HOME_D_USER_LAY ? arrItems[arrItems.length - 1].m_iUniCode : HOME_D_USER_LAY;
                    oThis.appendChild(arrItems[i].m_oNode);
                }
                arrItems.push(arrItems[i]);
                arrItems.remove(i);
                break;
            }
        }
        if (oItem.type == 1) 
            oThis.m_oScene.m_arrItems = arrItems;
        else 
            if (oItem.type == 2) 
                oThis.m_oScene.m_arrUsers = arrItems;
    };
    HomeBusController.ItemBottom = function(oThis, oItem){
        __save_point__(oThis);
        var arrItems;
        if (oItem.type == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (oItem.type == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        var k = 0;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i].IsBgItem()) {
                k++;
            }
            if (arrItems[i] == oItem) {
                if (oItem.type == 1) {
                    oThis.insertBefore(arrItems[i].m_oNode, arrItems[k].m_oNode);
                }
                else 
                    if (oItem.type == 2) {
                        var bfind;
                        var len = oThis.m_oScene.m_arrItems.length;
                        var tmparr = HomeShow.GetItemList(oThis);
                        if (tmparr.length == 0) {
                            return;
                        }
                        if (tmparr.length == 1 && tmparr[0][4].IsBgItem()) {
                            return;
                        }
                        for (var j = len - 1; j >= 0; j--) {
                            if (oThis.m_oScene.m_arrItems[j].IsBgItem() || oThis.m_oScene.m_arrItems[j - 1].IsBgItem()) {
                                bfind = true;
                                if (i == 0) {
                                    oThis.insertBefore(arrItems[i].m_oNode, oThis.m_oScene.m_arrItems[j].m_oNode);
                                }
                                else 
                                    if (arrItems[0].m_iUniCode < HOME_D_USER_LAY && arrItems[0].m_iUniCode >= len - j) {
                                        oThis.insertBefore(arrItems[i].m_oNode, arrItems[0].m_oNode);
                                    }
                                    else {
                                        oThis.insertBefore(arrItems[i].m_oNode, oThis.m_oScene.m_arrItems[j].m_oNode);
                                    }
                                arrItems[i].m_iUniCode = len - j;
                                break;
                            }
                        }
                    }
                arrItems = arrItems.insertAt(k, arrItems[i]);
                arrItems.remove(i + 1);
                break;
            }
        }
        if (oItem.type == 1) 
            oThis.m_oScene.m_arrItems = arrItems;
        else 
            if (oItem.type == 2) 
                oThis.m_oScene.m_arrUsers = arrItems;
    };
    HomeBusController.LoadScene = function(oThis, arrItems, arrUsers){
        oThis.m_arrItems = arrItems;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            HomeBusController.AddItem(oThis, arrItems[i]);
        }
        oThis.m_arrUsers = arrUsers;
        for (var i = 0, len = arrUsers.length; i < len; i++) {
            HomeBusController.AddUser(oThis, arrUsers[i]);
        }
        return 0;
    };
    HomeBusController.CreateScene = function(oThis, iUin, bZoom, iZoom, bDisableItem, bDisableUser, bDisableBg, fnItemLoader, fnItemFactoryIns){
        if (oThis.m_oScene) {
            debug("Ѿ˳Ҫٴ");
            return -1;
        }
        var oScene = new SceneObject("DefaultName", 0, 0, "", [], [], bZoom, iZoom);
        oThis.m_iUin = iUin;
        oThis.m_oScene = oScene;
        oThis.m_arrSelectItem = [];
        if (!oThis.m_arrHistory) {
            oThis.m_arrHistory = [];
            oThis.m_iHistoryPointer = 0;
        }
        oThis.m_oUserData = {};
        oThis.bDisableItem = bDisableItem;
        oThis.bDisableUser = bDisableUser;
        oThis.m_fnItemLoader = fnItemLoader;
        oThis.m_fnItemFactoryIns = fnItemFactoryIns;
        if (!bDisableBg) 
            __init__(oThis);
        return 0;
    };
    function __switch__item2__(oThis, oItemNode, oUserNode){
        oThis.insertBefore(oItemNode, oUserNode);
        return 0;
    }
    function __switch__item__(oThis, iPos1, iPos2, iType){
        var arrItems;
        if (iType == 1) 
            arrItems = oThis.m_oScene.m_arrItems;
        else 
            if (iType == 2) 
                arrItems = oThis.m_oScene.m_arrUsers;
        var arrDiv = HomeDom.children(oThis);
        if (HomeDom.lastChild(oThis) == arrItems[iPos1] || HomeDom.firstChild(oThis) == arrItems[iPos1]) {
            oThis.appendChild(arrItems[iPos1].m_oNode);
        }
        else {
            oThis.insertBefore(arrItems[iPos1].m_oNode, arrItems[iPos2].m_oNode);
        }
        return 0;
    };
    function __generate_layer_no__(oThis, oItem){
        if (oItem.type == 1 && oItem.IsBgItem()) 
            return -1;
        var arrItems;
        var iStartLay;
        if (oItem.type == 1) {
            arrItems = oThis.m_oScene.m_arrItems;
            iStartLay = HOME_D_LAY;
        }
        else 
            if (oItem.type == 2) {
                arrItems = oThis.m_oScene.m_arrUsers;
                iStartLay = HOME_D_USER_LAY;
            }
        if (arrItems[arrItems.length - 1] && !arrItems[arrItems.length - 1].IsBgItem()) 
            if (oItem.type == 2 && arrItems[arrItems.length - 1].m_iUniCode < HOME_D_USER_LAY) 
                oItem.m_iUniCode = iStartLay;
            else 
                oItem.m_iUniCode = arrItems[arrItems.length - 1].m_iUniCode + 1;
        else 
            oItem.m_iUniCode = iStartLay;
        return 0;
    };
    function __insert_or_append__(oThis, oItem){
        var oUser;
        for (var i = 0; i < oThis.m_oScene.m_arrUsers.length; i++) {
            if (oThis.m_oScene.m_arrUsers[i].m_iUniCode >= HOME_D_USER_LAY) {
                oUser = oThis.m_oScene.m_arrUsers[i];
                break;
            }
        }
        if (oUser) 
            oThis.insertBefore(ElementFactory.GetHtmlNode(oItem), oUser.m_oNode);
        else 
            oThis.appendChild(ElementFactory.GetHtmlNode(oItem));
    };
    function __save_point__(oThis){
        HomeShow.Encode(oThis);
        oThis.m_arrHistory[oThis.m_iHistoryPointer++] = oThis.m_strShow;
    }
    function __getuser__(oThis, iUin){
        for (var i = 0; i < oThis.m_oScene.m_arrUsers.length; i++) {
            if (iUin == oThis.m_oScene.m_arrUsers[i].m_iUin) 
                return oThis.m_oScene.m_arrUsers[i];
        }
        return null;
    }
})();
function UserObject(iUin, iUniCode, iRev, iXPos, iYPos, iItemNo, strContent){
    if (!iUin || isNaN(parseInt(iUin))) {
        return -1;
    }
    this.m_iUin = iUin;
    this.m_iUniCode = isNaN(parseInt(iUniCode)) ? 0 : iUniCode;
    this.m_iRev = isNaN(parseInt(iRev)) ? 0 : iRev;
    this.m_iXPos = iXPos;
    this.m_iYPos = iYPos;
    this.m_strContent = strContent ? unescape(strContent) : "";
    this.type = 2;
    this.m_iPlyNo = HOME_D_USER_LAY;
    this.m_iItemNo = iItemNo;
    this.fireEvent = function(evtType){
        try {
            window.fireEvent(this, evtType);
        } 
        catch (e) {
        }
    }
    this.IsBgItem = function(){
        return false;
    }
    this.Destroy = function(){
        this.m_iUin = null;
        this.m_iUniCode = null;
        this.m_iRev = null;
        this.m_iXPos = null;
        this.m_iYPos = null;
        this.m_strContent = null;
        this.type = null;
        this.m_iPlyNo = null;
        this.m_iItemNo = null;
        if (Browser.isFirefox) {
            this.m_oCanvas.img = null;
            this.m_oCanvas = null;
        }
    };
};
function SceneObject(strName, iTime, iStuts, strComment, arrItems, arrUsers, bZoom, iZoom){
    this.m_sName = strName;
    this.m_iTime = iTime;
    this.m_iStuts = iStuts;
    this.m_strComment = strComment;
    this.m_arrItems = arrItems;
    this.m_arrUsers = arrUsers;
    this.m_bZoom = bZoom;
    this.m_iZoom = iZoom ? iZoom : 1;
    this.Destroy = function(){
        this.m_sName = null;
        this.m_iTime = null;
        this.m_iStuts = null;
        this.m_strComment = null;
        this.m_arrItems = null;
        this.m_bZoom = null;
        this.m_iZoom = null;
    };
};
function HomeItem(stItemNo, iUniCode, iRev, iXPos, iYPos, iPlyNo, bMov, iType, iStyle, sName, bSelc, bEvt, bRot, iZoom, Content){
    var iItemNo;
    if (!isNaN((stItemNo) * 1)) {
        this.m_iItemNo = stItemNo;
        this.m_iAppId = DEF_APPID;
        this.m_iSerialId = 0;
    }
    else 
        if (typeof(stItemNo) == "string") {
            var tmp = stItemNo.split(SPLIT_ITEMINFO);
            this.m_iItemNo = tmp[1];
            this.m_iAppId = tmp[0];
            this.m_iSerialId = tmp[2];
        }
        else 
            if (typeof(stItemNo) == "object" && stItemNo.length == 3) {
                this.m_iItemNo = stItemNo[1];
                this.m_iAppId = stItemNo[0];
                this.m_iSerialId = stItemNo[2];
            }
            else {
                this.m_iItemNo = 0;
                this.m_iAppId = DEF_APPID;
                this.m_iSerialId = 0;
            }
    this.m_iUniCode = isNaN(parseInt(iUniCode)) ? 0 : iUniCode;
    this.m_iRev = isNaN(parseInt(iRev)) ? 0 : iRev;
    if (iPlyNo <= AR_LAY_BGIMG) {
        this.m_iXPos = 0;
        this.m_iYPos = 0;
    }
    else {
        this.m_iXPos = iXPos;
        this.m_iYPos = iYPos;
    }
    this.m_iDefX = 0;
    this.m_iDefY = 0;
    this.m_iPlyNo = isNaN(parseInt(iPlyNo)) ? 0 : iPlyNo;
    this.m_bMov = bMov;
    this.m_iType = isNaN(parseInt(iType)) ? 0 : iType;
    this.m_Content = Content ? Content : "";
    this.m_bEvt = !!bEvt ? 1 : 0;
    this.m_bSelc = !!bSelc ? 1 : 0;
    this.m_iStyle = isNaN(parseInt(iStyle)) ? 0 : iStyle;
    this.m_bRot = !!bRot ? 1 : 0;
    this.m_iZoom = isNaN(parseInt(iZoom)) ? 0 : iZoom;
    this.m_sName = sName ? sName : "";
    this.type = 1;
    this.m_oNode;
    this.m_oParent;
    this.IsBgItem = function(){
        if (this.m_iPlyNo == 0) 
            return this.m_iUniCode < HOME_D_LAY;
        return this.m_iPlyNo <= AR_LAY_BGIMG;
    }
    this.Destroy = function(){
        this.m_iItemNo = null;
        this.m_iUniCode = null;
        this.m_iRev = null;
        this.m_iXPos = null;
        this.m_iYPos = null;
        this.m_iPlyNo = null;
        this.m_bMov = null;
        this.m_bEvt = null;
        this.m_bSelc = null;
        this.m_iType = null;
        this.m_iDefX = null;
        this.m_iDefY = null;
        this.m_Content = null;
        this.m_bRot = null;
        this.m_iZoom = null;
        this.type = null;
        this.m_oNode = null;
        this.m_oParent = null;
        this.m_sName = null;
        if (Browser.isFirefox) {
            this.m_oCanvas.img = null;
            this.m_oCanvas = null;
        }
    };
    this.fireEvent = function(evtType){
        try {
            window.fireEvent(this, evtType);
        } 
        catch (e) {
        }
    }
};
function ElementFactory(){
}
(function(){
    ElementFactory.FreshUserShow = function(oItem){
        var sImageUrl = __get_user_img__(oItem.m_iUin, oItem.m_iItemNo);
        var oDivCharBody = oItem.oDivCharBody;
        oImg = oDivCharBody.document.getElementById("userimg_$" + oItem.m_iUin);
        oImg.style.filter = "";
        oImg.onreadystatechange = function(){
            function loadRealPic(){
                LoadRealPic(oDivCharBody, oImg, 0, null, true);
            }
            if (oImg.readyState == 'complete') 
                setTimeout(loadRealPic, 0);
        }
        oImg.src = sImageUrl;
        oDivCharBody.appendChild(oImg);
    }
    ElementFactory.GetHtmlNode = function(oItem){
        if (oItem.m_oNode) 
            return oItem.m_oNode;
        var oRet;
        if (oItem.type == 1) {
            if (oItem.m_iAppId > DEF_APPID && oItem.m_oParent.m_fnItemFactoryIns) 
                oRet = oItem.m_oParent.m_fnItemFactoryIns(oItem);
            else 
                oRet = (Browser.isIE || Browser.isIE7) ? MakeRoomElement(oItem) : (Browser.isFirefox ? MakeRoomElement4FF(oItem) : MakeRoomElement4Other(oItem));
        }
        else 
            if (oItem.type == 2) 
                oRet = (Browser.isIE || Browser.isIE7) ? MakeUserElement(oItem) : (Browser.isFirefox ? MakeUserElement4FF(oItem) : MakeRoomElement4Other(oItem));
        oItem.m_oNode = oRet;
        if (oItem.m_iAppId == 10001) 
            HomeBusController.RotateItem(oItem.m_oHost, oItem);
        return oRet;
    }
    ElementFactory.MakeEleMoveable = function(oEle){
        var oItem = {};
        oItem.m_oNode = oEle;
        __make_moveable_(oEle, oItem)
    }
    function MakeStaticRoomElement(){
    }
    function MakeRoomElement4FF(oItem){
        var oCanvas = document.createElement("canvas");
        var ctx = oCanvas.getContext('2d');
        var oImg = document.createElement("IMG");
        var bZoom = oItem.m_oParent.m_oScene.m_bZoom;
        var iZoom = bZoom ? oItem.m_oParent.m_oScene.m_iZoom : 1;
        oCanvas.setAttribute("id", oItem.m_iItemNo + "$" + Math.random(Date.parse(new Date())));
        oCanvas.setAttribute("className", "room_element");
        oCanvas.setAttribute("class", "room_element");
        oItem.m_oCanvas = oCanvas;
        oCanvas.img = oImg;
        oImg.src = oItem.m_iAppId > DEF_APPID ? oItem.m_oParent.m_fnItemLoader(oItem.m_iItemNo, oItem.m_iPlyNo) : __get_item_img__(oItem.m_iItemNo, oItem.m_iPlyNo);
        oImg.onload = function(){
            var h = bZoom ? oImg.naturalHeight * iZoom : oImg.naturalHeight;
            var w = bZoom ? oImg.naturalWidth * iZoom : oImg.naturalWidth;
            oCanvas.height = h < 84 ? 84 : h;
            oCanvas.width = w < 84 ? 84 : w;
            if (oItem.m_iRev == 1) {
                ctx.translate(oImg.width - 1, 0);
                ctx.scale(-1, 1);
            }
            if (bZoom) 
                ctx.drawImage(oImg, 0, 0, oImg.naturalWidth * iZoom, oImg.naturalHeight * iZoom);
            else 
                ctx.drawImage(oImg, w < 84 ? ((84 - w) / 2) : 0, h < 84 ? ((84 - h) / 2) : 0);
        }
        oCanvas.style.left = oItem.m_iXPos + "px";
        oCanvas.style.top = oItem.m_iYPos + "px";
        if (!oItem.IsBgItem() && !bZoom) 
            __make_moveable_(oCanvas, oItem);
        return oCanvas;
    }
    function LoadRealPic(oParent, oImg, iRev, iStyle, bChar){
        var flag;
        try {
            if (iStyle) 
                flag = iStyle == 1 ? 1 : 0;
            else 
                flag = oImg.mimeType.toUpperCase().indexOf("GIF") > -1 ? false : true;
        } 
        catch (e) {
            flag = false;
        }
        if (flag) {
            if (iStyle == 1 || !bChar) {
                var oDiv = document.createElement("IMG");
                oDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + oImg.src + "',sizingMethod='scale',enabled='true')";
                var fixh = oImg.offsetHeight;
                var fixw = oImg.offsetWidth;
                if (fixw < 84) {
                    oDiv.style.marginRight = (84 - fixw) / 2;
                    oDiv.style.marginLeft = (84 - fixw) / 2;
                }
                if (fixh < 84) {
                    oDiv.style.marginBottom = (84 - fixh) / 2;
                    oDiv.style.marginTop = (84 - fixh) / 2;
                }
                oDiv.src = "http://imgcache.qq.com/ac/b.gif";
                oDiv.style.width = fixw + "px";
                oDiv.style.height = fixh + "px";
                oParent.appendChild(oDiv);
                oImg.style.display = "none";
            }
            else {
                oImg.style.visibility = "";
                oImg.onreadystatechange = null;
                oParent.style.backgroundImage = "url('http://imgcache.qq.com/ac/b.gif')";
                oImg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + oImg.src + "',sizingMethod='scale',enabled='" + true + "')";
                oImg.oldSrc = oImg.src;
                oImg.src = "http://imgcache.qq.com/ac/b.gif";
            }
        }
        else {
            if (bChar) {
                oImg.setAttribute("className", "char_all");
                oImg.setAttribute("class", "char_all");
            }
            var fixh;
            var fixw;
            fixh = oImg.offsetHeight;
            fixw = oImg.offsetWidth;
            if (fixw < 84) {
                oImg.style.marginRight = (84 - fixw) / 2;
                oImg.style.marginLeft = (84 - fixw) / 2;
            }
            if (fixh < 84) {
                oImg.style.marginBottom = (84 - fixh) / 2;
                oImg.style.marginTop = (84 - fixh) / 2;
            }
            oImg.style.visibility = "";
        }
        if (iRev == 1) {
            if (!bChar) 
                oParent.style.filter = " FlipH";
        }
    }
    function MakeRoomElement(oItem){
        var oDiv = document.createElement("DIV");
        var oImg = document.createElement("IMG");
        oDiv.setAttribute("id", oItem.m_iItemNo + "$" + Math.random(Date.parse(new Date())));
        oDiv.className = oItem.m_iPlyNo > 12 ? "room_element" : "room_element_body";
        var bZoom = oItem.m_oParent.m_oScene.m_bZoom;
        var iZoom = bZoom ? oItem.m_oParent.m_oScene.m_iZoom : 1;
        oImg.onreadystatechange = function(){
            function _LoadRealPic(){
                LoadRealPic(oDiv, oImg, oItem.m_iRev, oItem.m_iStyle)
            }
            if (oImg.readyState == 'complete') 
                setTimeout(_LoadRealPic, 0);
        }
        oDiv.appendChild(oImg);
        oImg.style.visibility = "hidden";
        oImg.src = (oItem.m_iAppId > DEF_APPID && oItem.m_oParent.m_fnItemLoader) ? oItem.m_oParent.m_fnItemLoader(oItem.m_iItemNo, oItem.m_iPlyNo) : __get_item_img__(oItem.m_iItemNo, oItem.m_iPlyNo);
        if (!oItem.m_iXPos || !oItem.m_iYPos) {
            if (!oItem.IsBgItem()) {
                oDiv.style.left = oItem.m_iDefX * iZoom + "px";
                oDiv.style.top = oItem.m_iDefY * iZoom + "px";
            }
        }
        else {
            oDiv.style.left = oItem.m_iXPos * iZoom + "px";
            oDiv.style.top = oItem.m_iYPos * iZoom + "px";
        }
        if (!oItem.IsBgItem() && !bZoom && !oItem.m_oParent.bDisableItem) 
            __make_moveable_(oDiv, oItem);
        else 
            HomeEvent.addEventListener(oDiv, "onclick", function(event){
                ItemEvents.OnMouseClick(event, oItem)
            });
        return oDiv;
    }
    function MakeRoomElement4Other(oItem){
        var oDiv = document.createElement("div");
        var oCanvas = document.createElement("canvas");
        var ctx = oCanvas.getContext('2d');
        var oImg = document.createElement("IMG");
        var bZoom = oItem.m_oParent.m_oScene.m_bZoom;
        var iZoom = bZoom ? oItem.m_oParent.m_oScene.m_iZoom : 1;
        oCanvas.setAttribute("id", oItem.m_iItemNo + "$" + Math.random(Date.parse(new Date())));
        oCanvas.setAttribute("className", "room_element");
        oCanvas.setAttribute("class", "room_element");
        oItem.m_oCanvas = oCanvas;
        oCanvas.img = oImg;
        oImg.onload = function(){
            var h = oImg.height;
            var w = oImg.width;
            oCanvas.height = h;
            oCanvas.width = w;
            if (oItem.m_iRev == 1) {
                ctx.translate(w - 1, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(oImg, 0, 0);
            if (w < 84) {
                oCanvas.style.marginRight = (84 - w) / 2 + "px";
                oCanvas.style.marginLeft = (84 - w) / 2 + "px";
            }
            if (h < 84) {
                oCanvas.style.marginBottom = (84 - h) / 2 + "px";
                oCanvas.style.marginTop = (84 - h) / 2 + "px";
            }
        }
        oDiv.appendChild(oImg);
        oImg.src = __get_item_img__(oItem.m_iItemNo, oItem.m_iPlyNo);
        oCanvas.style.left = oItem.m_iXPos + "px";
        oCanvas.style.top = oItem.m_iYPos + "px";
        if (!oItem.IsBgItem() && !bZoom) 
            __make_moveable_(oCanvas, oItem);
        return oCanvas;
    }
    function MakeUserElement4FF(oItem){
        var oDiv = document.createElement("DIV");
        var oDivCharBody = document.createElement("canvas");
        oDivCharBody.style.width = 140 + "px";
        oDivCharBody.style.height = 226 + "px";
        oItem.m_oCanvas = oDivCharBody;
        var oDiv2 = document.createElement("DIV");
        var oDivt = document.createElement("DIV");
        var oDivm = document.createElement("DIV");
        var oDivf = document.createElement("DIV");
        var oImg = document.createElement("IMG");
        oDiv.setAttribute("id", "user_" + oItem.m_iUin);
        oDiv.setAttribute("className", "room_element");
        oDiv.setAttribute("class", "room_element");
        oDivCharBody.setAttribute("className", "char_all_body");
        oDivCharBody.setAttribute("class", "char_all_body");
        oImg.setAttribute("className", "char_all");
        oImg.setAttribute("class", "char_all");
        oImg.setAttribute("src", __get_user_img__(oItem.m_iUin));
        oDivt.setAttribute("id", "menu_class_3_t");
        oDivt.style.width = 150 + "px";
        oDivm.setAttribute("id", "menu_class_3_m");
        oDivm.style.width = 150 + "px";
        oDivf.setAttribute("id", "menu_class_3_f");
        oDivf.style.width = 150 + "px";
        oDiv2.style.position = "absolute";
        oDiv2.style.left = 100 + "px";
        oDiv2.style.top = "0px";
        oDiv2.style.width = 100 + "px";
        oDivm.innerHTML = oItem.m_strContent.escHtml();
        oDiv2.appendChild(oDivt);
        oDiv2.appendChild(oDivm);
        oDiv2.appendChild(oDivf);
        var ctx = oDivCharBody.getContext('2d');
        oDivCharBody.img = oImg;
        oImg.onload = function(){
            oDivCharBody.height = oImg.naturalHeight;
            oDivCharBody.width = oImg.naturalWidth;
            if (oItem.m_iRev == 1) {
                ctx.translate(oImg.width - 1, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(oImg, 0, 0);
        }
        oDiv.appendChild(oDivCharBody);
        oDiv.appendChild(oDiv2);
        if (!oItem.m_iXPos || !oItem.m_iYPos) {
            oDiv.style.left = 200 + "px";
            oDiv.style.top = 200 + "px";
        }
        else {
            oDiv.style.left = oItem.m_iXPos + "px";
            oDiv.style.top = oItem.m_iYPos + "px";
        }
        if (!oItem.m_oParent.bDisableUser || GetQzoneLoginUin() == oItem.m_iUin) 
            __make_moveable_(oDiv, oItem);
        return oDiv;
    }
    function MakeUserElement(oItem){
        var oDiv = document.createElement("DIV");
        var oDivCharBody = document.createElement("DIV");
        var oDivUser = document.createElement("DIV");
        var oDivWord = document.createElement("DIV");
        oDivUser.className = "room_avatar";
        var oDivNick = document.createElement("DIV");
        oDivNick.className = "room_avatar_name";
        oDivNick.innerHTML = "";
        oDivWord.style.display = "none";
        oDivWord.className = "room_bubble bubble0";
        oDivWord.innerHTML = '<div class="bubble_content"><div class="v_elm"><span class="i_v_elm"></span><span class="edge_v_elm"></span></div></div>';
        if (oItem.m_iUin == GetQzoneLoginUin()) 
            oDivWord.innerHTML += '<button type="button" onclick="try{SendWords()};catch(e){}">޸</button>';
        var oBubDiv = document.createElement("DIV");
        oBubDiv.className = "room_bubble_bg";
        oBubDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://qqhome2-item.qq.com/2000002/12/01/', sizingMethod='scale');";
        oDivWord.style.display = "none";
        oDivWord.appendChild(oBubDiv);
        oDivWord.oBubDiv = oBubDiv;
        oItem.oWordPanel = oDivWord;
        var oImg = document.createElement("IMG");
        oDiv.setAttribute("id", oItem.m_iUin + "$body");
        oDiv.className = "room_element";
        if (oItem.m_iRev == 1) {
            oDiv.className += " filp_h";
        }
        oDivCharBody.className = "char_all_body";
        oItem.oDivCharBody = oDivCharBody;
        oDivCharBody.style.width = 140 + "px";
        oDivCharBody.style.height = 226 + "px";
        var bZoom = oItem.m_oParent.m_oScene.m_bZoom;
        var iZoom = bZoom ? oItem.m_oParent.m_oScene.m_iZoom : 1;
        var sImageUrl = __get_user_img__(oItem.m_iUin, oItem.m_iItemNo);
        oImg.id = "userimg_$" + oItem.m_iUin;
        oImg.onreadystatechange = function(){
            function loadRealPic(){
                LoadRealPic(oDivCharBody, oImg, 0, null, true);
                if (bZoom) {
                    var oFunc = function(){
                        oImg.style.width = oImg.offsetWidth * iZoom + "px";
                        oImg.style.height = oImg.offsetHeight * iZoom + "px";
                    }
                    setTimeout(oFunc, 0);
                }
                else {
                    oImg.style.width = 140 + "px";
                    oImg.style.height = 226 + "px";
                }
            }
            if (oImg.readyState == 'complete') 
                setTimeout(loadRealPic, 0);
        }
        oImg.style.visibility = "hidden";
        oImg.src = sImageUrl;
        oDivCharBody.appendChild(oImg);
        oDiv.appendChild(oDivWord);
        oDivUser.appendChild(oDivNick);
        oDivUser.appendChild(oDivCharBody);
        oDiv.appendChild(oDivUser);
        if (!oItem.m_iXPos || !oItem.m_iYPos) {
            oDiv.style.left = 200 * iZoom + "px";
            oDiv.style.top = 200 * iZoom + "px";
        }
        else {
            oDiv.style.left = oItem.m_iXPos * iZoom + "px";
            oDiv.style.top = oItem.m_iYPos * iZoom + "px";
        }
        if (!oItem.m_oParent.bDisableUser || GetQzoneLoginUin() == oItem.m_iUin) 
            __make_moveable_(oDiv, oItem);
        else 
            HomeEvent.addEventListener(oDiv, "onclick", function(event){
                ItemEvents.OnMouseClick(event, oItem)
            });
        return oDiv;
    }
    function __get_item_img__(iItemNo, iAttr){
        nCode = iItemNo;
        var tmpSrc = "http://qqhome2-item.qq.com/" + nCode + "/" + iAttr + "/00/";
        return tmpSrc;
    }
    function __get_user_img__(iItemNo, iAttr){
        var tmpSrc = iAttr ? ("http://acfs.tencent.com/R" + iItemNo + "_0_0_" + iAttr + "/") : "http://acfs.tencent.com/" + iItemNo + "/100/";
        return tmpSrc;
    }
    function __make_moveable_(oNode, oItem){
        HomeEvent.addEventListener(oNode, "onmouseover", function(event){
            ItemEvents.OnMouseOver(event, oItem)
        });
        HomeEvent.addEventListener(oNode, "onmouseout", function(event){
            ItemEvents.OnMouseOut(event, oItem)
        });
        HomeEvent.addEventListener(oNode, "onmousedown", function(event){
            ItemEvents.OnMouseDown(event, oItem)
        });
        HomeEvent.addEventListener(oNode, "onmouseup", function(event){
            ItemEvents.OnMouseUp(event, oItem)
        });
        HomeEvent.addEventListener(oNode, "onmousemove", function(event){
            ItemEvents.OnMouseMove(event, oItem)
        });
        HomeEvent.addEventListener(oNode, "onclick", function(event){
            ItemEvents.OnMouseClick(event, oItem)
        });
        if (!Browser.isIE && !Browser.isIE7) {
            HomeEvent.addEventListener(oItem.m_oParent, "onmousemove", function(event){
                ItemEvents.OnMouseMove(event, oItem)
            });
        }
    }
})();
function ItemEvents(){
}
(function(){
    function __setButtons__(oToolbar, iMode, iAdv, bReSize){
        QSWORLD.TOOLBAR.BUTTON_CHANGE.hide();
        QSWORLD.TOOLBAR.BUTTON_MIRROR.hide();
        QSWORLD.TOOLBAR.BUTTON_DEL.hide();
        QSWORLD.TOOLBAR.BUTTON_KICK.hide();
        QSWORLD.TOOLBAR.BUTTON_UP.hide();
        QSWORLD.TOOLBAR.BUTTON_DOWN.hide();
        QSWORLD.TOOLBAR.BUTTON_ROLLLEFT.hide();
        QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT.hide();
        QSWORLD.TOOLBAR.BUTTON_EXPAND.show();
        QSWORLD.TOOLBAR.BUTTON_HIDE.hide();
        if (!iAdv) 
            iAdv = oToolbar.m_iAdv ? oToolbar.m_iAdv : 1;
        switch (iMode) {
            case 0:
                QSWORLD.TOOLBAR.BUTTON_TOP.show();
                QSWORLD.TOOLBAR.BUTTON_BOTTOM.show();
                QSWORLD.TOOLBAR.BUTTON_DEL.show();
                break;
            case 1:
                QSWORLD.TOOLBAR.BUTTON_TOP.show();
                QSWORLD.TOOLBAR.BUTTON_BOTTOM.show();
                QSWORLD.TOOLBAR.BUTTON_DEL.show();
                QSWORLD.TOOLBAR.BUTTON_KICK.show();
                break;
            case 2:
                QSWORLD.TOOLBAR.BUTTON_CHANGE.show();
                QSWORLD.TOOLBAR.BUTTON_TOP.show();
                QSWORLD.TOOLBAR.BUTTON_BOTTOM.show();
                break;
            case 3:
                QSWORLD.TOOLBAR.BUTTON_CHANGE.show();
                QSWORLD.TOOLBAR.BUTTON_TOP.show();
                QSWORLD.TOOLBAR.BUTTON_BOTTOM.show();
                QSWORLD.TOOLBAR.BUTTON_DEL.show();
                break;
        }
        if (iAdv == 2) {
            QSWORLD.TOOLBAR.BUTTON_MIRROR.show();
            if (iMode != 2) 
                QSWORLD.TOOLBAR.BUTTON_DEL.show();
            QSWORLD.TOOLBAR.BUTTON_UP.show();
            QSWORLD.TOOLBAR.BUTTON_DOWN.show();
            if (oToolbar.m_oNowItem.m_iAppId == 10001) {
                QSWORLD.TOOLBAR.BUTTON_ROLLLEFT.show();
                QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT.show();
                QSWORLD.TOOLBAR.BUTTON_MIRROR.hide();
            }
            QSWORLD.TOOLBAR.BUTTON_EXPAND.hide();
            QSWORLD.TOOLBAR.BUTTON_HIDE.show();
            QSWORLD.TOOLBAR.BUTTON_HIDE.htmlButton.onclick = function(){
                __setButtons__(oToolbar, iMode, 1, true)
            };
            oToolbar.resize();
            oToolbar.m_iAdv = 2;
        }
        else {
            QSWORLD.TOOLBAR.BUTTON_MIRROR.hide();
            QSWORLD.TOOLBAR.BUTTON_DEL.hide();
            QSWORLD.TOOLBAR.BUTTON_UP.hide();
            QSWORLD.TOOLBAR.BUTTON_DOWN.hide();
            QSWORLD.TOOLBAR.BUTTON_ROLLLEFT.hide();
            QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT.hide();
            QSWORLD.TOOLBAR.BUTTON_EXPAND.show();
            QSWORLD.TOOLBAR.BUTTON_HIDE.hide();
            QSWORLD.TOOLBAR.BUTTON_EXPAND.htmlButton.onclick = function(){
                __setButtons__(oToolbar, iMode, 2, true)
            };
            oToolbar.resize();
            oToolbar.m_iAdv = 1;
        }
        return;
        if (bReSize) {
            var oItem = oToolbar.m_oNowItem;
            oToolbar.style.left = oItem.m_oNode.offsetLeft + (oItem.m_oNode.clientWidth - oItem.m_oParent.m_oToolbar.clientWidth) / 2 + "px";
        }
    }
    function __select_item__(oItem, bSelect, evt){
        oItem.m_oNode.className = oItem.m_oNode.className.replaceAll(" hover", "");
        oItem.m_oNode.className += " selected";
        if (oItem.m_oParent && oItem.m_oParent.m_oToolbar && oItem.m_oParent.m_oToolbar._lt) {
            clearTimeout(oItem.m_oParent.m_oToolbar._lt);
            oItem.m_oParent.m_oToolbar._lt = null;
        }
        if (bSelect) 
            HomeBusController.SelectItem(oItem);
        if (oItem.m_oParent && oItem.m_oParent.m_oToolbar && oItem.m_oParent.m_oToolbar.m_bBlockEvt) 
            return;
        if (oItem.m_oParent && oItem.m_oParent.m_oToolbar) {
            oItem.m_oParent.m_oToolbar.m_oNowItem = oItem;
            if (oItem.type == 1) {
                __setButtons__(oItem.m_oParent.m_oToolbar, 0);
            }
            else 
                if (oItem.type == 2 && GetQzoneLoginUin() == oItem.m_iUin && GetQzoneLoginUin() == parent.g_iUin) {
                    __setButtons__(oItem.m_oParent.m_oToolbar, 2);
                }
                else 
                    if (oItem.type == 2 && GetQzoneLoginUin() != oItem.m_iUin && GetQzoneLoginUin() == parent.g_iUin) {
                        __setButtons__(oItem.m_oParent.m_oToolbar, 1);
                    }
                    else 
                        if (oItem.type == 2 && GetQzoneLoginUin() == oItem.m_iUin && GetQzoneLoginUin() != parent.g_iUin) {
                            __setButtons__(oItem.m_oParent.m_oToolbar, 3);
                        }
            if (bSelect) 
                oItem.m_oParent.m_oToolbar.show();
            else 
                oItem.m_oParent.m_oToolbar.hide();
            oItem.m_oParent.m_oToolbar.moveToItem(oItem);
        }
    }
    ItemEvents.OnMouseClick = function(evt, oItem){
        if (oItem.IsBgItem()) {
            var selItem = oItem.m_oParent.m_arrSelectItem[0];
            if (selItem && selItem.m_oNode) {
                selItem.m_oNode.className = selItem.m_oNode.className.replaceAll(" hover", "");
                selItem.m_oNode.className = selItem.m_oNode.className.replaceAll(" selected", "");
                oItem.m_oParent.m_oToolbar.hide();
                oItem.m_oParent.m_arrSelectItem = [];
            }
        }
    }
    ItemEvents.OnMouseOver = function(evt, oItem){
        oItem.m_oNode.className += " hover";
        oItem.m_oNode.style.cursor = "move";
        try {
            oItem.fireEvent("mouseover");
        } 
        catch (e) {
        }
    }
    ItemEvents.OnMouseOut = function(evt, oItem){
        try {
            oItem.m_oNode.className = oItem.m_oNode.className.replaceAll(" hover", "");
            oItem.fireEvent("mouseout");
        } 
        catch (e) {
        }
        oItem.m_oNode.style.cursor = "auto";
    }
    ItemEvents.OnMouseDown = function(evt, oItem){
        try {
            if (oItem.m_oParent.m_arrSelectItem[0] && oItem.m_oParent.m_arrSelectItem[0] != oItem) {
                oItem.m_oParent.m_arrSelectItem[0].m_oNode.className = oItem.m_oParent.m_arrSelectItem[0].m_oNode.className.replaceAll(" selected", "");
            }
            __select_item__(oItem, true, evt);
        } 
        catch (e) {
        }
        if (oItem.m_oParent) 
            HomeBusController.SavePoint(oItem.m_oParent);
        if (oItem.m_oParent) 
            HomeBusController.SelectItem(oItem, evt.ctrlKey);
        oItem.bStart = true;
        oItem.m_oNode.style.cursor = "move";
        if (Browser.isIE || Browser.isIE7) 
            oItem.m_oNode.setCapture();
        oItem.iStartX = evt.clientX;
        oItem.iStartY = evt.clientY;
        oItem.startDivX = oItem.m_oNode.offsetLeft;
        oItem.startDivY = oItem.m_oNode.offsetTop;
    }
    ItemEvents.OnMouseUp = function(evt, oItem){
        oItem.bStart = false;
        if (Browser.isIE || Browser.isIE7) 
            oItem.m_oNode.releaseCapture();
    }
    ItemEvents.OnMouseMove = function(evt, oItem){
        if (!oItem.bStart) 
            return;
        var iX = oItem.startDivX + evt.clientX - oItem.iStartX;
        var iY = oItem.startDivY + evt.clientY - oItem.iStartY;
        with (oItem.m_oNode) {
            if (iX < (0 - offsetWidth * 2 / 3)) {
                iX = 0 - offsetWidth * 2 / 3;
            }
            if (iX > (oItem.m_oParent.offsetWidth - offsetWidth / 3)) {
                iX = oItem.m_oParent.offsetWidth - offsetWidth / 3;
            }
            if (iY < (0 - offsetHeight * 2 / 3)) {
                iY = 0 - offsetHeight * 2 / 3;
            }
            if (iY > (oItem.m_oParent.offsetHeight - offsetHeight / 3)) {
                iY = oItem.m_oParent.offsetHeight - offsetHeight / 3;
            }
            style.left = iX + "px";
            style.top = iY + "px";
            oItem.m_iXPos = offsetLeft;
            oItem.m_iYPos = offsetTop;
        }
        try {
            oItem.fireEvent("move");
            oItem.m_oParent.m_oToolbar.moveToItem(oItem);
        } 
        catch (e) {
        }
    }
})();
function HomeEvent(){
}
(function(){
    HomeEvent.addEventListener = function(oElem, oEvents, fnHandler){
        if (!oElem || !oEvents || !fnHandler) 
            return;
        if ((typeof oEvents == "string" || oEvents instanceof String)) {
            _addEventListener(oElem, oEvents, fnHandler);
        }
        else {
            for (var i = 0, nLen = oEvents.length; i < nLen; i++) {
                _addEventListener(oElem, oEvents[i], fnHandler);
            }
        }
    };
    function _addEventListener(oElem, sEvent, fnHandler){
        if (!oElem || !sEvent || !fnHandler) 
            return;
        if (oElem.attachEvent) {
            if (sEvent.indexOf("on") == -1) 
                sEvent = "on" + sEvent;
            oElem.attachEvent(sEvent, fnHandler);
        }
        else {
            if (sEvent.indexOf("on") == 0) 
                sEvent = sEvent.substr(2);
            oElem.addEventListener(sEvent, fnHandler, false);
        }
    };
    HomeEvent.removeEventListener = function(oElem, oEvents, fnHandler){
        if (!oElem || !oEvents || !fnHandler) 
            return;
        if ((typeof oEvents == "string" || oEvents instanceof String)) {
            _removeEventListener(oElem, oEvents, fnHandler);
        }
        else {
            for (var i = 0, nLen = oEvents.length; i < nLen; i++) {
                _removeEventListener(oElem, oEvents[i], fnHandler);
            }
        }
    };
    function _removeEventListener(oElem, sEvent, fnHandler){
        if (!oElem || !sEvent || !fnHandler) 
            return;
        if (oElem.detachEvent) {
            if (sEvent.indexOf("on") == -1) 
                sEvent = "on" + sEvent;
            oElem.detachEvent(sEvent, fnHandler);
        }
        else {
            if (sEvent.indexOf("on") == 0) 
                sEvent = sEvent.substr(2);
            oElem.removeEventListener(sEvent, fnHandler, false);
        }
    };
    })();
function HomeShow(){
}
(function(){
    HomeShow.Decode = function(oThis, strShow, bNotCreate){
        if (!oThis.m_oScene) {
            debug("δ");
            return -1;
        }
        var arrTemp = strShow.split(SPLIT_G);
        if (!arrTemp.length || arrTemp[0] != HOME_VER) {
            debug("󴮰汾ȷ!");
            return -1;
        }
        var arrTemp1 = arrTemp[1].split(SPLIT_I);
        var strTemp;
        var arrItems = [];
        var arrUsers = [];
        var arrTemp2 = arrTemp[2] ? arrTemp[2].split(SPLIT_I) : [];
        if (arrTemp1[0] != "") {
            for (var i = 0, len = arrTemp1.length; i < len; i++) {
                var temp = arrTemp1[i].split(SPLIT_P);
                temp[0] = "'" + temp[0] + "'";
                temp[temp.length - 1] = "'" + temp[temp.length - 1] + "'";
                strTemp = "return new HomeItem(" + temp.toString() + ")";
                var oItem = Function(strTemp)();
                arrItems[arrItems.length] = oItem;
            }
        }
        for (var i = 0, len = arrTemp2.length; i < len; i++) {
            var temp = arrTemp2[i].split(SPLIT_P);
            temp[temp.length - 1] = "'" + temp[temp.length - 1] + "'";
            strTemp = "return new UserObject(" + temp.toString() + ")";
            var oUser = Function(strTemp)();
            arrUsers[arrUsers.length] = oUser;
        }
        if (bNotCreate) {
            oThis.m_arrItems = arrItems;
            oThis.m_arrUsers = arrUsers;
            return oThis;
        }
        HomeBusController.LoadScene(oThis, arrItems, arrUsers);
    }
    HomeShow.Encode = function(oThis){
        if (!oThis.m_oScene) {
            debug("δ");
            return -1;
        }
        var strShow = [];
        strShow[strShow.length] = HOME_VER;
        strShow[strShow.length] = SPLIT_G;
        var arrItems = oThis.m_oScene.m_arrItems;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            var oItem = arrItems[i];
            if (oItem.m_iItemNo == BASE_ITEMNO) 
                continue;
            for (var j = 0, jLen = HOME_SHOW_CONFIG.length; j < jLen; j++) {
                if (HOME_SHOW_CONFIG[j] == "iItemNo" && oItem.m_iAppId > DEF_APPID) {
                    var sItemInfo = oItem.m_iAppId + SPLIT_ITEMINFO + oItem.m_iItemNo + SPLIT_ITEMINFO + oItem.m_iSerialId
                    strShow[strShow.length] = sItemInfo;
                }
                else {
                    strShow[strShow.length] = oItem["m_" + HOME_SHOW_CONFIG[j]];
                }
                if (j < jLen - 1) 
                    strShow[strShow.length] = SPLIT_P;
            }
            if (i < len - 1) 
                strShow[strShow.length] = SPLIT_I;
        }
        if (strShow[strShow.length - 1] == SPLIT_I) 
            strShow.remove(strShow.length - 1);
        strShow[strShow.length] = SPLIT_G;
        arrItems = oThis.m_oScene.m_arrUsers;
        for (var i = 0, len = arrItems.length; i < len; i++) {
            var oItem = arrItems[i];
            for (var j = 0, jLen = HOME_SHOW_USER_CONFIG.length; j < jLen; j++) {
                if (HOME_SHOW_USER_CONFIG[j] == "strContent") 
                    strShow[strShow.length] = oItem["m_" + HOME_SHOW_USER_CONFIG[j]].replaceAll("_", "%5f");
                else 
                    strShow[strShow.length] = oItem["m_" + HOME_SHOW_USER_CONFIG[j]];
                if (j < jLen - 1) 
                    strShow[strShow.length] = SPLIT_P;
            }
            if (i < len - 1) 
                strShow[strShow.length] = SPLIT_I;
        }
        oThis.m_strShow = strShow.join("");
    }
    HomeShow.GetItemList = function(oThis){
        var arrItem = [];
        for (var i = 0; i < oThis.m_oScene.m_arrItems.length; i++) {
            var item = oThis.m_oScene.m_arrItems[i];
            if (item.m_iItemNo == BASE_ITEMNO) 
                continue;
            if (item.m_iPlyNo < AR_LAY_BGIMG) {
                var pos = finditem(arrItem, item);
                if (pos != -1) {
                    arrItem[pos][1] += "|" + item.m_iPlyNo;
                    continue;
                }
            }
            arrItem.push([item.m_iItemNo, item.m_iPlyNo, item.m_iType, item.m_iStyle, item]);
        }
        function finditem(arrItem, oItem){
            for (var i = 0; i < arrItem.length; i++) {
                if (arrItem[i][0] == oItem.m_iItemNo) {
                    return i;
                }
            }
            return -1;
        }
        return arrItem;
    }
})();
function debug(sInfo){
    var oDebug = document.getElementById("debug");
    return;
    if (!oDebug) 
        return;
    oDebug.innerHTML += sInfo + "<br/>";
    oDebug.scrollTop = 10000000;
};
QSWORLD.TOOLBAR = function(oThis, sId, fnOnBtClick){
    var base = this;
    if (!QSWORLD.TOOLBAR.MODE) {
        QSWORLD.TOOLBAR.MODE = {
            HIDE_MODE: 0,
            EXP_MODE: 1
        };
        QSWORLD.TOOLBAR.BUTTON_CHANGE = new QSWORLD.TOOLBAR.CommondButton("bt_change", "QQ", "", "change");
        QSWORLD.TOOLBAR.BUTTON_CHANGE.htmlButton.onclick = function(){
            fnOnBtClick("changeshow_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_MIRROR = new QSWORLD.TOOLBAR.CommondButton("bt_mirror", "ԴƷо淭ת", "", "mirror");
        QSWORLD.TOOLBAR.BUTTON_MIRROR.htmlButton.onclick = function(){
            fnOnBtClick("rev_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_TOP = new QSWORLD.TOOLBAR.CommondButton("bt_top", "Ʒڶ", "ö", "max_z_index");
        QSWORLD.TOOLBAR.BUTTON_TOP.htmlButton.onclick = function(){
            fnOnBtClick("top_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_BOTTOM = new QSWORLD.TOOLBAR.CommondButton("bt_bottom", "Ʒڵײ", "õ", "min_z_index");
        QSWORLD.TOOLBAR.BUTTON_BOTTOM.htmlButton.onclick = function(){
            fnOnBtClick("bottom_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_DEL = new QSWORLD.TOOLBAR.CommondButton("bt_del", "ɾ", "ɾ", "del");
        QSWORLD.TOOLBAR.BUTTON_DEL.htmlButton.onclick = function(){
            fnOnBtClick("del_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_KICK = new QSWORLD.TOOLBAR.CommondButton("bt_kick", "Ƴ", "Ƴ", "remove_show");
        QSWORLD.TOOLBAR.BUTTON_KICK.htmlButton.onclick = function(){
            fnOnBtClick("kick_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_UP = new QSWORLD.TOOLBAR.CommondButton("bt_up", "ߴƷ㼶", "", "add_z_index");
        QSWORLD.TOOLBAR.BUTTON_UP.htmlButton.onclick = function(){
            fnOnBtClick("up_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_DOWN = new QSWORLD.TOOLBAR.CommondButton("bt_down", "ʹƷ㼶", "", "sub_z_index");
        QSWORLD.TOOLBAR.BUTTON_DOWN.htmlButton.onclick = function(){
            fnOnBtClick("down_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_EXPAND = new QSWORLD.TOOLBAR.CommondButton("bt_expand", "չť", "չ", "show_btn");
        QSWORLD.TOOLBAR.BUTTON_EXPAND.htmlButton.onclick = function(){
            base.update(QSWORLD.TOOLBAR.MODE.EXP_MODE);
            QSWORLD.TOOLBAR.BUTTON_HIDE.show();
            QSWORLD.TOOLBAR.BUTTON_EXPAND.hide();
            base.resize();
        }
        QSWORLD.TOOLBAR.BUTTON_HIDE = new QSWORLD.TOOLBAR.CommondButton("bt_hidden", "ذť", "", "hide_btn");
        QSWORLD.TOOLBAR.BUTTON_HIDE.htmlButton.onclick = function(){
            base.update(QSWORLD.TOOLBAR.MODE.HIDE_MODE);
            QSWORLD.TOOLBAR.BUTTON_HIDE.hide();
            QSWORLD.TOOLBAR.BUTTON_EXPAND.show();
            base.resize();
        }
        QSWORLD.TOOLBAR.BUTTON_ROLLLEFT = new QSWORLD.TOOLBAR.CommondButton("rotate_left", "ԴƷʱת", "ʱת", "rotate_left");
        QSWORLD.TOOLBAR.BUTTON_ROLLLEFT.htmlButton.onclick = function(){
            fnOnBtClick("rotate_left_event", oThis.m_arrSelectItem[0]);
        }
        QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT = new QSWORLD.TOOLBAR.CommondButton("rotate_right", "ԴƷ˳ʱת", "˳ʱת", "rotate_right");
        QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT.htmlButton.onclick = function(){
            fnOnBtClick("rotate_right_event", oThis.m_arrSelectItem[0]);
        }
    }
    var arrInitList = [QSWORLD.TOOLBAR.BUTTON_CHANGE, QSWORLD.TOOLBAR.BUTTON_MIRROR, QSWORLD.TOOLBAR.BUTTON_TOP, QSWORLD.TOOLBAR.BUTTON_BOTTOM, QSWORLD.TOOLBAR.BUTTON_DEL, QSWORLD.TOOLBAR.BUTTON_KICK, QSWORLD.TOOLBAR.BUTTON_UP, QSWORLD.TOOLBAR.BUTTON_DOWN, QSWORLD.TOOLBAR.BUTTON_ROLLLEFT, QSWORLD.TOOLBAR.BUTTON_ROLLRIGHT, QSWORLD.TOOLBAR.BUTTON_EXPAND, QSWORLD.TOOLBAR.BUTTON_HIDE];
    var oToolbar = document.createElement("DIV");
    oToolbar.className = "room_func";
    oToolbar.id = "toolbar";
    oToolbar.style.display = "none";
    this.m_oHost = oThis;
    this.baseBts = [];
    this.expBts = [];
    this.iMode = QSWORLD.TOOLBAR.MODE.HIDE_MODE;
    for (var i = 0; i < arrInitList.length; i++) {
        QZONE.css.addClassName(arrInitList[i].htmlButton, "hide");
        oToolbar.appendChild(arrInitList[i].htmlButton);
        arrInitList[i]._bind = this;
    }
    this._fnOnBtClick = fnOnBtClick;
    this.htmlToolbar = oToolbar;
}
QSWORLD.TOOLBAR.prototype.update = function(mode, baseBts, expBts){
    if (baseBts) 
        this.baseBts = baseBts;
    if (expBts) 
        this.expBts = expBts;
    for (var i = 0; i < this.baseBts.length; i++) {
        QZONE.css.removeClassName(this.baseBts[i].htmlButton, "hide");
    }
    for (var i = 0; i < this.expBts.length; i++) {
        if (mode == QSWORLD.TOOLBAR.MODE.EXP_MODE) 
            QZONE.css.removeClassName(this.expBts[i].htmlButton, "hide");
        else 
            QZONE.css.addClassName(this.expBts[i].htmlButton, "hide");
    }
}
QSWORLD.TOOLBAR.prototype.hide = function(){
    this.htmlToolbar.style.display = "none";
}
QSWORLD.TOOLBAR.prototype.show = function(){
    this.htmlToolbar.style.display = "";
}
QSWORLD.TOOLBAR.prototype.moveto = function(x, y){
    this.htmlToolbar.style.left = x + "px";
    this.htmlToolbar.style.top = y + "px";
}
QSWORLD.TOOLBAR.prototype.resize = function(){
    if (this.m_oNowItem) 
        this.moveToItem(this.m_oNowItem);
}
QSWORLD.TOOLBAR.prototype.moveToItem = function(oItem){
    var x = oItem.m_oNode.offsetLeft + (oItem.m_oNode.clientWidth - oItem.m_oParent.m_oToolbar.htmlToolbar.clientWidth) / 2;
    var y = oItem.m_oNode.offsetTop + (oItem.m_oNode.clientHeight - oItem.m_oParent.m_oToolbar.htmlToolbar.clientHeight);
    this.moveto(x, y);
}
QSWORLD.TOOLBAR.CommondButton = function(sId, sTitle, sTxt, sClassName, eventType){
    var oButton = document.createElement("BUTTON");
    oButton.id = sId;
    QZONE.css.addClassName(oButton, sClassName);
    oButton.title = sTitle;
    oButton.sTxt = sTxt;
    this.htmlButton = oButton;
    this.eventType = eventType;
}
QSWORLD.TOOLBAR.CommondButton.prototype.hide = function(){
    QZONE.css.addClassName(this.htmlButton, "hide");
}
QSWORLD.TOOLBAR.CommondButton.prototype.show = function(){
    QZONE.css.removeClassName(this.htmlButton, "hide");
}
QSWORLD.ROOM = function(xObj, iUin, sName, iAppId, bDisableItem, bDisableUser, bDisDefbg, fnItemLoader, fnItemFactoryIns){
    if (typeof xObj == "string") {
        xObj = $("xObj");
    }
    if (!xObj) 
        return false;
    this._uin = iUin;
    this._disitem = bDisableItem;
    this._disuser = bDisableUser;
    this._fnItemLoader = fnItemLoader;
    this._fnItemFactoryIns = fnItemFactoryIns;
    this._info = "";
    this.sName = sName;
    this.oRoom = xObj;
    this.roomid = 0;
    this._bDisDefbg = !!bDisDefbg;
    this.iAppId = iAppId ? iAppId : 0;
    if (!QSCache[2]) 
        QSCache[2] = [];
    QSCache[2][0] = this;
    return 0 == HomeBusController.CreateScene(xObj, iUin, 0, 1, bDisableItem, bDisableUser, this._bDisDefbg, fnItemLoader, fnItemFactoryIns);
}
QSWORLD.ROOM.prototype.setUserStatus = function(status){
    try {
        for (var i = 0; i < this.oRoom.m_oScene.m_arrUsers.length; i++) {
            var oUserNode = this.oRoom.m_oScene.m_arrUsers[i].m_oNode;
            oUserNode.style.display = (status == "none" ? "none" : "");
        }
        this.oRoom.m_oToolbar.hide();
    } 
    catch (e) {
        alert(e)
    };
    }
QSWORLD.ROOM.prototype.bindToolbar = function(oToolbar, fnOnBtClick){
    if (oToolbar) 
        this.oToolbar = oToolbar;
    this.fnOnBtClick = fnOnBtClick;
    HomeBusController.BindToolbar(this.oRoom, oToolbar, fnOnBtClick);
}
QSWORLD.ROOM.prototype.getRoom = function(){
    return QSCache[2] ? QSCache[2][0] : null;
}
QSWORLD.ROOM.prototype.load = function(iRoomId, sShow, sName){
    HomeBusController.SetDefault(this.oRoom, true);
    HomeBusController.CreateScene(this.oRoom, this._uin, false, 1, this._disitem, this._disuser, this._bDisDefbg, this._fnItemLoader, this._fnItemFactoryIns);
    this.roomid = iRoomId
    if (sName) 
        this.sName = sName;
    this.bindToolbar(this.oToolbar, this.fnOnBtClick);
    return 0 == HomeShow.Decode(this.oRoom, sShow);
}
QSWORLD.ROOM.prototype.getShow = function(){
    HomeShow.Encode(this.oRoom);
    return this.oRoom.m_strShow;
}
QSWORLD.ROOM.prototype.save = function(sCgiName, bDeploy, bSaveAll, fnSucc, fnFail, fnError){
    var sUrl = setURLParam(sCgiName, "name", this.sName);
    sUrl = setURLParam(sUrl, "show", this.getShow());
    sUrl = setURLParam(sUrl, "type", bDeploy ? 1 : 0);
    if (this.roomid) 
        sUrl = setURLParam(sUrl, "saveall", 1);
    else 
        sUrl = setURLParam(sUrl, "saveall", 0);
    sUrl = setURLParam(sUrl, "no", this.roomid);
    sUrl = setURLParam(sUrl, "appid", this.iAppId);
    sUrl = setURLParam(sUrl, "opuin", this._uin);
    sUrl = setURLParam(sUrl, "key", this._uin);
    var sender = new QSWORLD.XHR(sUrl, fnSucc, fnFail, fnError);
    sender.send();
}
QSWORLD.ROOM.prototype.getUserList = function(){
    return this.oRoom.m_oScene.m_arrUsers;
}
QSWORLD.ROOM.prototype.getItemList = function(){
    return HomeShow.GetItemList(this.oRoom);
}
QSWORLD.ROOM.prototype.setRoomInfo = function(info, fnSucc, fnError){
    this._info = info;
    if (this.roomid == 0) {
        return true;
    }
    var sUrl = "http://world.show.qq.com/cgi-bin/api/sw_api_setsceninfo";
    sUrl = setURLParam(sUrl, "appid", this.iAppId);
    sUrl = setURLParam(sUrl, "no", this.roomid);
    sUrl = setURLParam(sUrl, "opuin", this._uin);
    sUrl = setURLParam(sUrl, "key", this._uin);
    sUrl = setURLParam(sUrl, "field", "info");
    sUrl = setURLParam(sUrl, "value", this._info);
    var sender = new QSWORLD.XHR(sUrl, fnSucc, null, fnError);
    sender.send();
    return true;
}
QSWORLD.ROOM.prototype.getItemsByNo = function(itemno){
    var arrItems = HomeShow.GetItemList(this.oRoom);
    var ret = [];
    for (var i = 0; i < arrItems.length; i++) {
        if (arrItems[i].m_iItemNo == itemno) {
            ret.push(arrItems[i]);
        }
    }
    return ret;
}
QSWORLD.ROOM.prototype.getAppItem = function(iAppId, iItemNo, iSerialId){
    var arrItems = HomeShow.GetItemList(this.oRoom);
    var ret = [];
    for (var i = 0; i < arrItems.length; i++) {
        if (arrItems[i].m_iItemNo == iItemNo && arrItems[i].m_iAppId == iAppId && arrItems[i].m_iSerialId == iSerialId) {
            return arrItems[i];
        }
    }
    return null;
}
QSWORLD.ROOM.prototype.selectUser = function(iUin){
    HomeBusController.MarkUser(this.oRoom, iUin);
}
QSWORLD.ROOM.prototype.addItem = function(stItemNo, iUniCode, iRev, iXPos, iYPos, iPlyNo, bMov, iType, iStyle, sName){
    AddItem(this.oRoom, stItemNo, iUniCode, iRev, iXPos, iYPos, iPlyNo, bMov, iType, iStyle, sName);
}
if (typeof(QSCache) == "undefined" || !QSCache) {
    QSCache = []
};
