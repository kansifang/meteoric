
function _addLinkClick(eId, f) {
    var _e = QZONE.event,
    _d = QZONE.dom,
    _a = _d.get(eId);
    if (_a) {
        _a._href = _a.href;
        _a.href = "javascript:;";
        _a.onclick = f;
    }
}
function refreshModuleContent() {
    fillModuleContent(true, true);
    ENV.set("qzLevel", 2);
}
function reloadModuleContent(aid, refreshNeeded) {
    var n = parseInt(aid, 10),
    cfn,
    tmp;
    if (n) {
        if (n == 30) {
            n = 330;
        }
        cfn = QZONE.QzWidget.findConsFn(n);
        if (typeof(cfn) == 'function') {
            tmp = cfn.instances[cfn.count];
            if (refreshNeeded) {
                tmp.refresh();
            } else {
                if (tmp && tmp.data) {
                    tmp.present();
                }
            }
        }
    }
}
function hideModulesContent(sw) {
    var tmpo;
    for (var i in QZONE.Module.items) {
        QZONE.Module.items[i].swapContent(sw);
    }
}
function showModulesContent() {
    var tmpo;
    for (var i in QZONE.Module.items) {
        try {
            QZONE.Module.items[i].showContent();
        } catch(e) {
            QZFL.console.print("模块出错拉: " + e.message);
        }
    }
}
function checkLogin() {
    if (g_iLoginUin > 10000) {
        return g_iLoginUin;
    } else if (QZONE.cookie.get("skey")) {
        var t = parseInt(QZONE.cookie.get("uin").replace(/[^\d]/g, ""), 10);
        if (!isNaN(t) && (t > 10000)) return t;
        else return 0;
    } else {
        return 0;
    }
}
function refreshQzone() {
    var o = QZONE.event.getTarget();
    var bo = QZONE.Module.items["_15_2"];
    if (bo) {
        bo = new Image();
        bo.src = "http://feeds.qzone.qq.com/cgi-bin/cgi_rss_clear?uin=" + g_iUin + "&property=" + g_Property + "&vuin=" + g_iLoginUin + "&s=" + Math.random();
    }
    setTimeout(function() {
        location.href = "http://" + g_Base_Domain + "/cgi-bin/user/cgi_user_refresh"
    },
    2000);
}
function vaildUrl(sUrl) {
    return (/^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i).test(sUrl) || (/^[\w][\w\/\.\?\-_=,]+$/i).test(sUrl) || (/^[\/\\][^\/\\]/i).test(sUrl) ? true: false;
}
function startRendModule(isce) {
    if (typeof(g_Dressup.windows) == "undefined") {
        loadWindowsData(startRendModule);
        return;
    }
    if (g_Dressup.windows.length > 0 && !isce) {
        initModule();
        fillModuleContent();
    } else {
        ENV.set("moduleRendered", true);
        setTimeout(loadAccessories, 1000);
    }
}
function fillModuleContent(needNotFillCustomModule, refresh) {
    if (ownermode && !ENV.get("loadSimDD") && g_type == 'M') {
        QZONE.space.loadDD();
        ENV.set("loadSimDD", true);
    }
    if (ua.firefox && typeof(needNotFillCustomModule) == 'number') {
        needNotFillCustomModule = arguments[1];
        refresh = arguments[2];
    }
    var map, tmpo, tmp, centry, cfn, fList = [],
    customList = [];
    var level = ENV.get("qzLevel");
    if (!level) {
        ENV.set("qzLevel", level = 1);
    } else {
        ENV.set("qzLevel", ++level);
    }
    if (level > 3) {
        ENV.set("qzLevel", 2);
        return;
    }
    for (var i in QZONE.Module.items) {
        tmpo = QZONE.Module.items[i];
        if (tmpo.moduleId == 0) {
            continue;
        }
        if (level > 1 && !!tmpo.contentObject && !refresh) {
            continue;
        }
        if (tmpo.moduleId == 99) {
            customList.push(tmpo);
            if (isModuleInStaticFlag(tmpo.moduleId, tmpo.mode)) {
                tmp = void(0);
            } else {
                tmp = QZONE.dataCenter.get("_" + tmpo.moduleId + "_" + tmpo.mode);
            }
            if (!tmp || !tmp[tmpo.mode] || parseInt(tmp[tmpo.mode].result, 10) != 0) {
                if (tmp) {
                    QZONE.dataCenter.del("_" + tmpo.moduleId + "_" + tmpo.mode);
                }
            }
            continue;
        }
        cfn = QZONE.QzWidget.findConsFn(tmpo.moduleId);
        if (typeof(cfn) != 'function') {
            cfn = QZONE.NaturalApp.Fake;
        }
        centry = new(cfn)(tmpo, tmpo.mode, void(0), ((level == 3) ? 2 : 0));
        if ( !! tmpo.contentObject && !!tmpo.contentObject.data) {
            centry.present();
        } else if (! (cfn.configuration.modes[tmpo.mode].noStatic || cfn.configuration.noStatic)) {
            fList.push(tmpo);
        }
    }
    if (level == 3) {
        ENV.set("qzLevel", 2);
        if (customList.length > 0 && (!needNotFillCustomModule)) {
            qca.fillCustomModule();
        }
        loadAccessories();
        return;
    }
    if (fList.length > 0 || customList.length > 0 || (g_StaticFlag.length > 1 && g_StaticFlag != "0.0")) {
        setTimeout((level < 2) ? getDynamicData: fillModuleContent, 50);
    } else {
        ENV.set("qzLevel", 2);
        if (customList.length > 0 && (!needNotFillCustomModule)) {
            qca.fillCustomModule();
        }
        loadAccessories();
    }
}
function loadStatistic(callback) {
    var s = new QZONE.JSONGetter("http://" + g_Statistic_Domain + "/fcg-bin/cgi_emotion_list.fcg", "statistic", {
        uin: g_iUin,
        loginUin: g_iLoginUin,
        s: QZONE.widget.seed.get()
    },
    "GB2312");
    s.onSuccess = typeof(callback) == 'function' ? callback: function(o) {
        ENV.set("statisticDataLoaded", true);
        QZONE.dataCenter.save("flowerScore", o);
        window.g_FlowerXDoc = o;
        if (ENV.get("ownerInfoAppReady")) {
            qna.OwnerInfoApp.showStatistic(o);
        }
        if (ENV.get("flowerReady")) {
            QZONE.shop.flower.showData();
        }
    };
    s.onError = function() {
        ENV.set("statisticDataLoaded", true);
        if (ENV.get("ownerInfoAppReady")) {
            qna.OwnerInfoApp.showStatistic();
        }
    };
    s.send("visitCountCallBack");
}
function runFnQueueAfterModuleRend() {
    var q = QZONE.space.fnQueueAfterModuleRend;
    while (q.length > 0) { (q.pop())();
    }
}
function loadAccessories() {
    if (loadAccessories._loaded) {
        return;
    }
    loadStatistic();
    QZONE.deprecated.OldFunctions.createHiddenTarget();
    if (!QZONE.toolbar) {
        loadToolbar();
    }
    if (!QZONE.frontPageAccessory) {
        moreAccessories();
    }
    if (!QZONE.allTips) {
        loadTipsAndDiamon();
    }
    setTimeout(runFnQueueAfterModuleRend, 1000);
    loadAccessories._loaded = true;
}
function frameworkErrorHandle() {
    if (ownermode) {
        if (window.g_ReadOnly) {
            QZONE.space.setCanSaveFlag(false);
            QZONE.space.showTips("<span style=\"color:red;\">尊敬的用户，由于您的装扮没有获取成功，不建议进入“自定义”或“装扮空间”状态进行保存操作，以免原有装扮丢失</span>");
        } else if ((window.g_Errno & 0x4) || ((window.g_Errno & 0x20) && !(window.g_Errno & 0x100))) {
            QZONE.space.showTips("<span style=\"color:red;\">尊敬的用户，由于网络繁忙等原因，您当前看到的模块内容可能不是最新</span>");
        }
    }
}
function loadTipsAndDiamon() {
    var flag = ENV.get("alltipsLoaded");
    if (!flag) {
        var t = new QZONE.JsLoader();
        t.onload = function() {
            ENV.set("alltipsLoaded", true);
            QZONE.allTips.bootstrap();
        };
        t.load("/qzone/v5/tips_diamond.js", null, "utf-8");
    }
}
function isModuleInStaticFlag(aid, mid) {
    var l = g_StaticFlag.split("_");
    for (var i = 0, len = l.length; i < len; ++i) {
        if ((aid + "." + mid) == l[i]) {
            return true;
        }
    }
    return false;
}
function getDynamicData() {
    if (ENV.get("wrongWindows") || g_StaticFlag.length < 2) {
        setTimeout(fillModuleContent, 50);
        return;
    }
    var s = "dynamic",
    param = {
        uin: g_iUin,
        newflag: g_StaticFlag,
        timestamp: g_timestamp
    },
    t = new QZONE.JSONGetter("http://" + g_Src_Domain + "/cgi-bin/qzone_" + s, s, param, "utf-8");
    t.onSuccess = function(o) {
        QZONE.space.dataBuilder(o);
        getDynamicData.need = true;
        setTimeout(fillModuleContent, 50);
    };
    t.onError = function(o) {
        setTimeout(fillModuleContent, 50);
    };
    t.send("staticData_Callback");
}
function loadToolbar() {
    var flag = ENV.get("toolbarLoaded");
    if (!flag) {
        QZONE.toolbar = {};
        var t = new QZONE.JsLoader();
        t.onload = function() {
            ENV.set("toolbarLoaded", true);
            QZONE.toolbar.bootstrap();
        };
        t.load("/qzone/v5/toolbar.js", null, "utf-8");
    }
}
function moreAccessories() {
    var flag = ENV.get("moreAccessoriesLoaded");
    if (!flag) {
        var t = new QZONE.JsLoader();
        t.onload = function() {
            ENV.set("moreAccessoriesLoaded", true);
            QZONE.frontPageAccessory.bootstrap();
        };
        t.load("/qzone/v5/accessory.js", null, "utf-8");
    }
}
function loadMusicAll(callback) {
    var flag = ENV.get("musicAllLoaded");
    if (!flag) {
        var t = new QZONE.JsLoader();
        t.onload = function() {
            ENV.set("musicAllLoaded", true);
            callback();
        };
        t.load("/music/qzone/music_all.js", null, "GB2312");
    } else {
        setTimeout(callback, 50);
    }
}
function loadWindowsData(cbHandler) {
    if (typeof(g_iUin) != "undefined" && !loadWindowsData._isLoadingWD) {
        var _loader = new QZONE.JSONGetter("http://" + g_Src_Domain + "/cgi-bin/qzone_static_widget", void(0), {
            "fs": g_frameStyle.toString(10),
            "uin": g_iUin,
            "timestamp": g_timestamp
        },
        "utf-8");
        _loader.onSuccess = function(re) {
            loadWindowsData._isLoadingWD = false;
            if (re && re.widgetdata && typeof(re.widgetdata.g_Dressup) != "undefined" && typeof(re.widgetdata.g_Dressup.windows) != "undefined") {
                window.g_Dressup.windows = re.widgetdata.g_Dressup.windows;
                window.g_StaticFlag = re.widgetdata.g_StaticFlag;
                window.g_ReadOnly = re.widgetdata.g_ReadOnly || window.g_ReadOnly;
                window.g_Errno = re.widgetdata.g_Errno || window.g_Errno;
                frameworkErrorHandle();
                delete re.widgetdata;
                QZONE.space.dataBuilder(re);
                if (typeof(cbHandler) == "function") {
                    setTimeout(function() {
                        cbHandler();
                    },
                    0);
                }
            } else if (checkLogin() < 10001) {
                QZONE.FrontPage.showLoginBox();
            }
        };
        _loader.onError = function() {
            var _t = new QZONE.JSONGetter("http://" + imgcacheDomain + "/qzone/v5/defaultLayout.js", void(0), void(0), "utf-8"),
            _e = function() {
                QZONE.widget.msgbox.show(QZONE.il.commonError.CON_ERR, 2, 1500);
            };
            _t.onSuccess = function(dl) {
                if (!dl) {
                    _e();
                } else {
                    window.g_Dressup.windows = dl[g_frameStyle];
                    window.g_ReadOnly = 1;
                    frameworkErrorHandle();
                    if (typeof(cbHandler) == "function") {
                        cbHandler();
                    }
                }
            };
            _t.onError = _e;
            _t.send();
        };
        loadWindowsData._isLoadingWD = true;
        _loader.send("staticData_Callback");
        return true;
    }
    return false;
}
function loadGFP(callback) {
    var flag = ENV.get("GFPLoaded") || QZONE.QzWidget;
    if (!flag) {
        var t = new QZFL.JsLoader();
        if (typeof(callback) == "function") {
            t.onload = (function(_cb) {
                return function() {
                    loadGFP._callback(_cb);
                };
            })(callback);
        }
        t.load("/ac/qzone/v5/G/" + g_type + "/" + g_type + "G5" + ((g_V && g_V.M) ? g_V.M: "") + ".js", null, "utf-8");
    } else {
        if (typeof(callback) == "function") {
            ENV.set("GFPLoaded", true);
            setTimeout(callback, 0);
        }
    }
}
loadGFP._callback = function(cb) {
    ENV.set("GFPLoaded", true);
    if (cb) {
        cb();
    }
};
function loadOFP() {
    var flag = ENV.get("OFPLoaded") || QZONE.OFP;
    if (!flag) {
        QZONE.OFP = {};
        var t = new QZONE.JsLoader();
        t.onload = loadOFP._callback;
        t.load("/qzone/v5/owner/OFP2.0.js", null, "utf-8");
    } else {
        setTimeout(loadOFP._callback, 0);
    }
}
loadOFP._callback = function() {
    ENV.set("OFPLoaded", true);
    frameworkErrorHandle();
    QZONE.OFP.bootstrap();
};
QZONE.space = {};
(function() {
    var _shortCutMap = {
        66 : function() {
            QZONE.space.toApp("/blog");
        },
        71 : function() {
            initButton.decoration();
        },
        74 : function() {
            initButton.customize()
        },
        77 : function() {
            QZONE.space.toApp("/profile");
        }
    },
    canSaveFlag = true;
    QZONE.space.setCanSaveFlag = function(b) {
        return (typeof(b) == "boolean") ? (canSaveFlag = b, true) : false;
    };
    QZONE.space.getCanSaveFlag = function() {
        return canSaveFlag;
    };
    QZONE.space.bootLoadLayout = void(0);
    QZONE.space.FRAME_LAYOUT = [0, "13", "31", "22", "121", "112", "211", "14", "41", "122", "221", "32", "113", "311", "131", "212"];
    QZONE.space.LAYOUT_NAME = {
        0 : "小窝",
        1 : "全屏",
        3 : "宽版"
    };
    QZONE.space.LAYOUT_SELETOR = {
        0 : [0],
        1 : [1, 2, 4, 5, 6, 3, 0],
        3 : [1, 2, 4, 5, 6, 3, 7, 8, 9, 10, 11, 12, 13, 14, 0]
    };
    QZONE.space.isEdited = false;
    QZONE.space.isMallMode = false;
    QZONE.space.fnQueueAfterModuleRend = [];
    QZONE.space.createFrame = function(frameStyle) {
        var D = QZONE.dom;
        if (!frameStyle) {
            return
        }
        var _fs = QZONE.space.FRAME_LAYOUT[frameStyle].split("");
        for (var i = 0; i < _fs.length; i++) {
            var _cn = "mode_col_m";
            if (i == 0) {
                _cn = "mode_col_l"
            } else if (i == _fs.length - 1) {
                _cn = "mode_col_r"
            }
            D.createElementIn("div", "mainContainer", false, {
                id: "frameCol_" + i,
                className: _cn,
                scale: _fs[i]
            });
        }
        QZONE.dom.get("mainContainer").className = "mode_col_" + QZONE.space.FRAME_LAYOUT[frameStyle];
    };
    QZONE.space.createOFPFrame = function(mode) {
        var D = QZONE.dom;
        var _fs = "131".split("");
        for (var i = 0; i < 3; i++) {
            var _cn = "mode_col_m";
            if (i == 0) {
                _cn = "mode_col_l"
            } else {
                if (mode == "13") {
                    if (i == 1) {
                        _cn = "mode_col_r";
                    } else if (i == 2) {
                        _cn = "";
                    }
                } else {
                    if (i == 1) {
                        _cn = "mode_col_m";
                    } else if (i == 2) {
                        _cn = "mode_col_r";
                    }
                }
            }
            D.createElementIn("div", "OFPContainer", false, {
                id: "OFPFrameCol_" + i,
                className: _cn,
                scale: _fs[i]
            });
        }
        QZONE.dom.get("OFPContainer").className = "mode_col_" + mode;
    };
    QZONE.space.setEditFlag = function() {
        QZONE.space.isEdited = true;
    };
    QZONE.space.getEditFlag = function() {
        return QZONE.space.isEdited;
    };
    QZONE.space.resetEditFlag = function() {
        QZONE.space.isEdited = false;
    };
    QZONE.space.setFrame = function(frameType, mdData) {
        if (mdData == null) {
            if (!QZONE.space.defaultFrame) {
                var dl = new QZONE.JSONGetter("http://" + imgcacheDomain + "/qzone/v5/defaultLayout.js");
                dl.onSuccess = function(o) {
                    QZONE.space.defaultFrame = o;
                    QZONE.space._setFrame(frameType, QZONE.space.defaultFrame[frameType]);
                }
                dl.send();
            } else {
                QZONE.space._setFrame(frameType, QZONE.space.defaultFrame[frameType]);
            }
        } else {
            QZONE.space._setFrame(frameType, mdData);
        }
    };
    QZONE.space._setFrame = function(frameType, mdData) {
        for (var k in QZONE.Module.items) {
            if (k.indexOf("_0") == 0) {
                continue;
            }
            QZONE.Module.remove(k);
        }
        QZONE.dom.get("mainContainer").innerHTML = "";
        QZONE.space.createFrame(frameType);
        g_frameStyle = frameType;
        initModule(mdData);
        setTimeout(fillModuleContent, 0);
        QZONE.space.onFrameChange();
    };
    QZONE.space.onFrameChange = QZONE.emptyFn;
	//加载拖拽　仅限主人使用
    QZONE.space.loadDD = function(fun) {
        var _s = QZONE.space.loadDD,
        t;
        if (!_s._dragdropJSload) {
            t = _s._dragdropJSload = new QZONE.JsLoader();
            t.onload = fun || QZONE.space.toSimCustom;
            t.load("http://" + imgcacheDomain + "/qzone/v5/activateModuleDD.js", null, "utf-8");
        } else {
            setTimeout(fun || QZONE.space.toSimCustom, 0);
        }
    };
    QZONE.space.loadDD._dragdropJSload = null;
    QZONE.space.toSimCustom = function() {
        if (QZONE.space.activateSimDD && !QZONE.enviroment.get('simCustom')) {
            QZONE.enviroment.set('simCustom', true);
            QZONE.space.activateSimDD();
        }
    };
    QZONE.space.leaveSimCustom = function() {
        if (QZONE.space.unActivateSimDD && QZONE.enviroment.get('simCustom')) {}
    };
	//移动至自定义的版块上
    QZONE.space.toAdvCustom = function() {
        if (QZONE.space.activateAdvDD && !QZONE.enviroment.get('advCustom')) {
            QZONE.enviroment.set('advCustom', true);
            QZONE.space.setCustomMode(true);
            QZONE.space.activateAdvDD();
        }
    };
	//鼠标离开自定义的版块
    QZONE.space.leaveAdvCustom = function() {
        if (QZONE.space.unActivateAdvDD && QZONE.enviroment.get('advCustom')) {
            QZONE.enviroment.set('advCustom', false);
            QZONE.space.setCustomMode(false);
            QZONE.space.unActivateAdvDD();
        }
    };
	//设置为自定义状态　
    QZONE.space.setCustomMode = function(flag) {
		//更改样式表　查找样式表ID为dynamicStyle 　中的样式customoff
        var c = QZONE.css.getRuleBySelector('dynamicStyle', '.customoff');
        if (c) {
            c.style.display = flag ? 'none': '';
        }
    };
    QZONE.space.loadCustomCss = function() {
        var _s = QZONE.space.loadCustomCss;
        if (!_s._customCSSLoaded) {
            QZONE.css.insertCSSLink('http://' + siDomain + '/qzonestyle/qzone_client_v5/css/custom_out.css');
            _s._customCSSLoaded = true;
        }
    };
	//加载自定义　　如果是自己才去加载，不是自己不去加载
    QZONE.space.loadCustom = function(moduleName) {
        if (!ownermode) {
            return;
        }
        var _s = QZONE.space.loadCustom;
        QZONE.space.loadCustomCss();
        if (!_s._customJSload) {
            QZONE.widget.bubble.hide(ENV.get("_textBubbleId"));
            QZONE.widget.msgbox.show("正在加载自定义内容，请稍候.", 0);
            _s._customJSload = new QZONE.JsLoader();
            _s._customJSload.onload = function() {
                QZONE.widget.msgbox.hide(1000);
                QZONE.customMode.init(moduleName);
                if (QZONE.enviroment.get('simCustom')) {
                    QZONE.space.hideSimCustomTips();
                    QZONE.space.loadDD(QZONE.space.toAdvCustom);
                } else {
                    QZONE.space.loadDD(QZONE.space.toAdvCustom);
                }
            }
            _s._customJSload.load("http://" + imgcacheDomain + "/qzone/v5/activateCustom.js", null, "utf-8");
        } else {
            if (QZONE.customMode && QZONE.customMode.ready) {
                var params = moduleName.toString().split(",");
                moduleName = params[0];
                params.splice(0, 1);
                QZONE.customMode.openFrame(moduleName == "module" ? "moduleM": moduleName, params);
                if (QZONE.enviroment.get('simCustom')) {
                    QZONE.space.hideSimCustomTips();
                    QZONE.space.loadDD(QZONE.space.toAdvCustom);
                } else {
                    QZONE.space.loadDD(QZONE.space.toAdvCustom);
                }
            }
        }
        hideModulesContent();
        QZONE.event.preventDefault();
    };
    QZONE.space.switchSpaceMode = function(mode, noUndo) {
        if (g_fullMode == mode) {
            return;
        }
        var _mode = mode ? mode - 1 ^ (mode % 2) : 0,
        _center = mode ? 1 ^ (mode % 2) : 0,
        _lastMode = g_fullMode ? g_fullMode - 1 ^ (g_fullMode % 2) : 0,
        _m = QZONE.dom.get("mainBody"),
        _c = QZONE.dom.get("contentBody"),
        _t = QZONE.dom.get("titleBar"),
        _main = QZONE.dom.get("mainContainer");
        _c.style.cssText = 'background-image:none !important;';
        switch (_mode) {
        case 0:
            if (g_frameStyle > 0 && !noUndo) {
                QZONE.space.setFrame(0);
            }
            _m.className = "bg_mode_main mini_mode";
            QZONE.css.replaceClassName(_t, "menu_t_b", "menu_t_s");
            _main.style.cssText = "overflow:hidden;overflow-y:scroll;";
            break;
        case 1:
            if (g_frameStyle > 6 && !noUndo) {
                QZONE.space.setFrame(1, QZONE.customMode.getWindowListData());
            }
            _m.className = "bg_mode_main full_mode";
            QZONE.css.replaceClassName(_t, "menu_t_s", "menu_t_b");
            _main.style.cssText = "height:auto";
            break;
        case 3:
            _m.className = "bg_mode_main width_full_mode";
            QZONE.css.replaceClassName(_t, "menu_t_s", "menu_t_b");
            _main.style.cssText = "height:auto";
            break;
        }
        QZONE.space.setCenter(_center);
        QZONE.shop.fixCenterPosition(_center);
        g_fullMode = _mode + _center;
        QZONE.space.setBGScroll(g_fullMode != 0 ? window.g_isBGScroll || 0 : 0);
        if (g_frameStyle == 0) {
            QZONE.space.setContainHeight();
        }
        setTimeout(function() {
            QZONE.shop.add(QZONE.shop.exclusiveItems[1]);
            setTimeout(function() {
                QZONE.shop.add(QZONE.shop.exclusiveItems[19], true);
            },
            0);
        },
        0);
        if (QZONE.userAgent.ie) {
            setTimeout(function() {
                var _tb = QZONE.dom.get("titleBG");
                _tb.className = "";
                _tb.className = "bg_menu_t";
            },
            0);
        }
    };
    QZONE.space.setContainHeight = function() {
        if (!g_fullMode) {
            return;
        }
        if (g_frameStyle) {
            QZONE.dom.setStyle(QZONE.dom.get("mainContainer"), "height", "auto");
        } else {
            var _mh = QZONE.Module.getMaxHeight(),
            _mm = QZONE.dom.get("mainContainer");
            QZONE.dom.setStyle(_mm, "height", _mh[1] + 2 + "px");
            QZONE.dom.setStyle(_mm, "overflowY", "hidden");
        }
    };
    QZONE.space.setCenter = function(isCenter) {
        var _o = QZONE.dom.get("outerBox"),
        _fi = QZONE.dom.get("floatItem"),
        _cb = QZONE.dom.get("contentBody"),
        _mb = QZONE.dom.get("mainBody");
        if (isCenter) {
            _o.style.paddingLeft = "0";
            _o.style.margin = "auto";
            _fi.className = "float_center";
            _mb.style.backgroundPosition = _cb.style.backgroundPosition = "center top";
        } else {
            var _p = QZONE.space.getPadding();
            _o.style.paddingLeft = _p.left || "";
            _o.style.margin = "0";
            _fi.className = "float_normal";
            _mb.style.backgroundPosition = _cb.style.backgroundPosition = "left top";
        }
        if (QZONE.userAgent.ie && QZONE.userAgent.ie < 7) {
            if (isCenter) {
                _cb.style.textAlign = "center";
            } else {
                _cb.style.textAlign = "left";
            }
        }
    };
    QZONE.space._newStyleNum = 2000;
    QZONE.space.getRelStyle = function() {
        return g_IsNewStyle ? (g_StyleID + QZONE.space._newStyleNum) : g_StyleID;
    };
    QZONE.space.setRelStyle = function(id) {
        g_IsNewStyle = false;
        g_StyleID = id;
        if (id > QZONE.space._newStyleNum) {
            g_IsNewStyle = true;
            g_StyleID = id - QZONE.space._newStyleNum;
        }
    };
    QZONE.space.getSaveStyle = function() {
        var _f = g_StyleID;
        var _h = {
            150 : 246,
            151 : 247
        }
        if (g_IsNewStyle) {
            _f = _h[_f] ? _h[_f] : (_f + 160);
        }
        return _f;
    };
    QZONE.space.setColorCss = function(isHome) {
        var st = QZONE.css.getStyleSheetById("mainStyle"),
        _csUrl = "http://" + imgcacheDomain + "/qzone_v5/" + g_StyleID + "/color.css";
        if (g_IsNewStyle) {
            _csUrl = "http://" + imgcacheDomain + "/qzonestyle/qzone_client_v5/css/" + g_StyleID + "/color_out.css";
        }
        if (!isHome) {
            _csUrl = "http://" + imgcacheDomain + "/qzone_v5/" + g_StyleID + "/gb_color.css";
        }
        if (st) {
            if (ua.ie) {
                st.imports[2].href = _csUrl;
            } else {
                var rules = st.cssRules;
                rules[2].styleSheet.disabled = true;
                st.deleteRule(2);
                st.insertRule("@import url(" + _csUrl + ");", 2);
            }
        }
    };
    QZONE.space.setTheme = function(styleId) {
        var _g = QZONE.space.getRelStyle();
        if (_g == styleId) {
            return;
        }
        QZONE.space.setRelStyle(styleId);
        var st = QZONE.css.getStyleSheetById("mainStyle"),
        _lsUrl = "http://" + siDomain + "/qzone_v5/" + g_StyleID + "/index_style_out.css",
        _csUrl = "http://" + imgcacheDomain + "/qzone_v5/" + g_StyleID + "/color.css";
        if (g_IsNewStyle) {
            _lsUrl = "http://" + siDomain + "/qzonestyle/qzone_client_v5/css/" + g_StyleID + "/index_style_out.css";
            _csUrl = "http://" + imgcacheDomain + "/qzonestyle/qzone_client_v5/css/" + g_StyleID + "/color_out.css";
        }
        if (st) {
            if (ua.ie) {
                st.imports[1].href = _lsUrl;
                st.imports[2].href = _csUrl;
            } else {
                var rules = st.cssRules;
                rules[1].styleSheet.disabled = true;
                rules[2].styleSheet.disabled = true;
                st.deleteRule(2);
                st.deleteRule(1);
                st.insertRule("@import url(" + _lsUrl + ");", 1);
                st.insertRule("@import url(" + _csUrl + ");", 2);
            }
        }
    };
    QZONE.space.getPadding = function(update) {
        var t = QZONE.enviroment.get("spacePaddingTop"),
        l = QZONE.enviroment.get("spacePaddingLeft"),
        _ob = QZONE.dom.get("outerBox"),
        _mb = QZONE.dom.get("mainBody");
        if (update) {
            QZONE.enviroment.set("spacePaddingTop", t = (g_fullMode ? _ob.style.paddingTop: ""));
            QZONE.enviroment.set("spacePaddingLeft", l = (g_fullMode ? _ob.style.paddingLeft: _mb.style.paddingLeft));
        }
        return {
            top: t,
            left: l
        };
    };
    QZONE.space.dataBuilder = function(data) {
        var o, tmp, newFlag = false,
        _m = {
            1 : 3,
            2 : 1,
            3 : 25,
            7 : 22,
            305 : 7,
            308 : 7,
            310 : 7,
            4 : 5
        },
        isValidJSONData = function(_o) {
            if (!_o) return false;
            for (var i in _o) {
                if (i != "error") return true;
                else return false;
            }
            return false;
        };
        for (var k in data) {
            newFlag = (data[k] && (typeof(data[k]._uname_) != "undefined") && (typeof(data[k].data) != "undefined"));
            if (newFlag) {
                if (typeof(data[k].data) == 'string') {
                    tmp = parseXML(data[k].data);
                    if (!ua.ie) {
                        tmp.xml = new String(data[k].data);
                        if (!ua.opera || ua.opera < 9) {
                            tmp.selectSingleNode = function(xpath) {
                                return qna.XMLselectSingleNode(this, xpath);
                            };
                            tmp.selectNodes = function(xpath) {
                                return qna.XMLselectNodes(this, xpath);
                            };
                        }
                    }
                    if (!tmp || tmp.selectNodes("//error").length > 0) {
                        continue;
                    }
                    data[k].data = tmp;
                    o = data[k];
                } else if (typeof(data[k].data) == 'object') {
                    tmp = data[k].data;
                    if (!isValidJSONData(tmp)) {
                        continue;
                    }
                    o = data[k];
                } else {
                    continue;
                }
            } else {
                if (typeof(data[k]) == 'string') {
                    o = parseXML(data[k]);
                    if (!ua.ie) {
                        o.xml = new String(data[k]);
                        if (!ua.opera || ua.opera < 9) {
                            o.selectSingleNode = function(xpath) {
                                return qna.XMLselectSingleNode(this, xpath);
                            };
                            o.selectNodes = function(xpath) {
                                return qna.XMLselectNodes(this, xpath);
                            };
                        }
                    }
                    if (!o || o.selectNodes("//error").length > 0) {
                        continue;
                    }
                } else if (typeof(data[k]) == 'object') {
                    o = data[k];
                    if (!isValidJSONData(o)) {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            tmp = k.split("_");
            QZONE.dataCenter.save(k, o);
            QZONE.deprecated.g_JData[_m[tmp[1]]] = QZONE.deprecated.g_XDoc[_m[tmp[1]]] = newFlag ? o.data: o;
        }
    };
    QZONE.space.shortCut = function(e) {
        var e = QZONE.event.getEvent(e);
        if (e && (e.ctrlKey || e.altKey)) {
            if (_shortCutMap[e.keyCode]) {
                _shortCutMap[e.keyCode]();
            }
        }
    };
    QZONE.space.updateCSS = function(selectorId, style, value) {
        QZONE.css.getRuleBySelector("dynamicStyle", selectorId).style[style] = value;
    };
    QZONE.space.getVersion = function() {
        return g_version
    };
    QZONE.space.getMode = function() {
        return g_fullMode;
    };
    QZONE.space.getCenter = function() {
        return g_fullMode && !(g_fullMode % 2)
    };
    QZONE.space.setModulesOpacity = function(nOpacity) {
        nOpacity = Math.max(0, Math.min(1, nOpacity));
        for (var moduleID in QZONE.Module.items) {
            QZONE.Module.items[moduleID].setOpacity(nOpacity);
        }
    };
    QZONE.space.setBGScroll = function(v) {
        var d = QZONE.dom,
        e = QZONE.event,
        val = v ? 'fixed': 'scroll';
        if (ua.ie <= 6) {
            if (v) {
                e.removeEvent(window, 'scroll', QZONE.space._doScroll);
                e.addEvent(window, 'scroll', QZONE.space._doScroll);
                QZONE.space._doScroll();
            } else {
                e.removeEvent(window, 'scroll', QZONE.space._doScroll);
                QZONE.dom.setStyle('mainBody', 'backgroundPositionY', 0);
                QZONE.dom.setStyle('contentBody', 'backgroundPositionY', 0);
            }
            return;
        }
        d.setStyle(document.body, 'backgroundAttachment', val);
        d.setStyle('mainBody', 'backgroundAttachment', val);
        d.setStyle('contentBody', 'backgroundAttachment', val);
    };
    QZONE.space._doScroll = function(ev) {
        var y = QZONE.dom.getScrollTop(document) - QZONE.dom.getSize(customBody)[1] - 30;
        QZONE.dom.setStyle('mainBody', 'backgroundPositionY', y);
        QZONE.dom.setStyle('contentBody', 'backgroundPositionY', y);
    };
    QZONE.space.setPositionLeft = function(value) {
        var _v = value && value > 0 ? (value + "px") : "";
        if (g_fullMode == 0) {
            QZONE.dom.get("outerBox").style.paddingLeft = "";
            QZONE.dom.get("contentBody").style.left = _v;
        } else {
            QZONE.dom.get("outerBox").style.paddingLeft = g_fullMode % 2 ? _v: 0;
            QZONE.dom.get("contentBody").style.left = "";
        }
        return QZONE.space.getPosition();
    };
    QZONE.space.setPositionTop = function(value) {
        QZONE.dom.get("outerBox").style.paddingTop = (value && value > 0 ? (value + "px") : "");
        return QZONE.space.getPosition();
    };
    QZONE.space.getPosition = function() {
        var posX, posY;
        if (g_fullMode == 0) {
            posX = parseInt(QZONE.dom.getStyle("contentBody", "left")) || 0;
            posY = parseInt(QZONE.dom.getStyle("contentBody", "top")) || 0;
        } else {
            posX = parseInt(QZONE.dom.getStyle("outerBox", "paddingLeft")) || 0;
            posY = parseInt(QZONE.dom.getStyle("outerBox", "paddingTop")) || 0;
        }
        ENV.set("spacePositionX", posX);
        ENV.set("spacePositionY", posY);
        return [posX, posY];
    };
    QZONE.space.enterSpeedMode = function(flag) {
        QZONE.cookie.set((flag ? "briefMode": "speedMode"), "1", "qzone.qq.com");
        location.reload();
    };
    QZONE.space.exitSpeedMode = function() {
        QZONE.cookie.set('speedMode', '0', 'qzone.qq.com');
        location.reload();
    };
    QZONE.space.getSpeedMode = function() {
        return (QZONE.cookie.get("speedMode") == "1");
    };
    QZONE.space.canDoUnload = function(sw) {
        var tf = QZONE.dom.get("frameContainer").getElementsByTagName("iframe")[0],
        res;
        if ( !! tf) {
            try {
                res = tf.contentWindow.__qzoneFrameworkBeforeUnload();
            } catch(err) {
                res = "";
            }
        } else {
            res = "";
        }
        if (!res) {
            return false;
        } else {
            return res;
        }
    };
    QZONE.space.showTips = function(html, icon, autoHide) {
        if (!QZONE.space._fixTipsBar) {
            var tmp = document.createElement("div");
            tmp.id = "_tips_placeholder";
            $("mode_main").insertBefore(tmp, $("frameContainer"));
            QZONE.space._fixTipsBar = tmp;
        } else {
            QZONE.css.removeClassName(QZONE.space._fixTipsBar, "none");
        }
        var _tr = QZONE.space._fixTipsBar;
        _tr.style.height = "0";
        var _inCustom = (QZONE.customMode && QZONE.customMode.opened);
        var tipsIcon = ["icon_hint", "icon_hint_success", "icon_hint_advise"];
        icon = icon || 0;
        var strHtml = '<div class="hint" style="margin:0;padding-top:6px"><img src="/ac/b.gif" class="bt_close right" style="cursor:pointer;margin-top:3px" onclick="QZONE.space.hideTips();"/><img src="/ac/b.gif" class="' + tipsIcon[icon] + '"/>' + html + '</div>';
        _tr.innerHTML = strHtml;
        _tr.style.overflowY = "hidden";
        var t = new QZONE.Tween(_tr, "height", QZONE.transitions.regularEaseInOut, "0px", "28px", 0.4);
        t.onMotionChange = function(obj, prop, currentValue) {
            if (_inCustom) {
                _tr.style.height = currentValue + "px";
            }
        }
        t.onMotionStop = function() {
            _tr.style.height = "28px";
        }
        t.start();
        if (autoHide) {
            setTimeout(function() {
                QZONE.space.hideTips();
            },
            10000);
        }
    };
    QZONE.space.hideTips = function() {
        var _inCustom = (QZONE.customMode && QZONE.customMode.opened);
        var _close = function() {
            _close = null;
            QZONE.space.killTips();
        };
        if (!_inCustom) {
            _close();
        } else {
            var _tr = QZONE.space._fixTipsBar;
            var t = new QZONE.Tween(_tr, "height", QZONE.transitions.regularEaseInOut, "28px", "0px", 0.4);
            t.onMotionChange = function(obj, prop, currentValue) {
                _tr.style.height = currentValue + "px";
            }
            t.onMotionStop = _close;
            t.start();
        }
    };
    QZONE.space.killTips = function() {
        QZONE.css.addClassName(QZONE.space._fixTipsBar, "none");
    };
    QZONE.space.setBodyImagePositionTop = function(value, flag) {
        var _v = value,
        _y = 0;
        if (!flag) {
            _y = parseInt(QZONE.dom.getStyle(document.body, "backgroundPositionY")) || 0;
            _v = (_y + value);
            _v = _v < 0 ? 0 : _v;
        }
        QZONE.dom.setStyle(document.body, "backgroundPositionY", _v + "px");
    };
    QZONE.space.closeLoading = function() {
        var _l = QZONE.dom.get("loading");
        if (_l && _l.childNodes) {
            if (g_fullMode && !QZONE.shop.isFlashPlayed) {
                document.documentElement.style.overflow = "";
            }
        }
        QZONE.dom.removeElement(_l);
    };
    QZONE.space.setMallItemNum = function(n) {
        QZONE.space._mitemnum = n;
    };
    QZONE.space.getMallItemNum = function() {
        return QZONE.space._mitemnum;
    };
    QZONE.space._mitemnum = 0;
    QZONE.space.hideReturnButton = function() {
        QZONE.dom.get("a_return").style.display = "none";
        QZONE.dom.get("a_shop").style.display = "inline";
    };
    QZONE.space.save = function(saveType, callback, args) {
        if (!ownermode) {
            return;
        }
        if (!QZONE.space.getCanSaveFlag()) {
            QZONE.FrontPage.confirm("温馨提示", "尊敬的QQ空间用户，由于自定义装扮没有成功获取，请您不要进行保存，以免覆盖原有装扮，谢谢！");
            return;
        }
        args = args || {
            shop: (QZONE.space.isMallMode ? 1 : 0)
        };
        var _url = "http://" + g_Main_Domain + "/cgi-bin/user/save_scenario.cgi",
        _p = QZONE.space.getPosition(),
        _vc = ENV.get("_SS_VC_GOT_"),
        data = (saveType & 4) ? args.data: {
            uin: g_iLoginUin,
            bstyle: 0,
            styleid: QZONE.space.getSaveStyle(),
            framestyle: g_frameStyle,
            mode: g_fullMode,
            xpos: g_fullMode ? _p[0] : 0,
            ypos: 0,
            diystyle: 0,
            inshop: args.shop || 0,
            transparence: g_TransparentLevel,
            isBGScroll: g_isBGScroll || 0,
            needfeeds: 0,
            np: 1
        };
        saveType = saveType || 3;
        var checkItem = function() {
            if (checkItem.data) {
                return checkItem.data;
            }
            var _s = 0,
            _d = 0;
            var g_initData = window.g_initData || {};
            var _is = g_initData.items || [],
            _id = g_initData.diyitems || [],
            _ns = QZONE.shop.getItemList(null, true) || [],
            _nd = QZONE.shop.getDiyItem(true) || [];
            if ((_is.length == _ns.length)) {
                for (var i = 0; i < _is.length; i++) {
                    if (!QZONE.shop.searchItem(_is[i].type, _is[i].itemno)) {
                        _s = 1;
                        break;
                    }
                }
            } else {
                _s = 1;
            }
            if ((_id.length == _nd.length)) {
                for (var i = 0; i < _id.length; i++) {
                    if (QZONE.shop.getDiyItemString(_id[i]) != QZONE.shop.getDiyItemString(QZONE.shop.exclusiveItems[_id[i].type])) {
                        _d = 1;
                        break;
                    }
                }
            } else {
                _d = 1;
            }
            checkItem.data = {
                'shop': _s,
                'diy': _d
            }
            return checkItem.data;
        };
        if (saveType & 1) {
            data.itemlist = QZONE.shop.getItemList();
            if (checkItem().shop) {
                data.needfeeds = 1;
            }
        }
        if ((saveType & 2) && ENV.get("moduleRendered")) {
            data.windlist = QZONE.Module.serialWindows();
        }
        if (! (saveType & 4)) {
            data.diyitemlist = QZONE.shop.getDiyItem();
            if (checkItem().diy) {
                data.needfeeds = 1;
            }
        }
        if (_vc) {
            data.verifycode = _vc;
            _vc = ENV.del("_SS_VC_GOT_");
        }
        var fs = new QZONE.FormSender(_url, "post", data);
        fs.onSuccess = function(o) {
            var isItemInvalid = false
            switch (o.ret) {
            case 4001:
            case 4003:
                QZONE.widget.msgbox.show(o.ret == 4001 ? "验证码错误": QZONE.il.commonError.MF_NOTICE, 0, 1000);
                isItemInvalid = true;
                break;
            case 4002:
                window.popupCallback = function(c) {
                    if (c && trim(c)) {
                        ENV.set("_SS_VC_GOT_", c);
                        setTimeout(function() {
                            QZONE.space.save(saveType, callback, args);
                        },
                        50);
                    }
                };
                QZONE.FrontPage.popupDialog("请输入验证码", {
                    src: "http://" + imgcacheDomain + "/qzone/verifycode.html#type=2"
                },
                268, 180, false);
                isItemInvalid = true;
                break;
            case 0:
                QZONE.widget.msgbox.show(o.msg, 0, 2000);
                QZONE.space.resetEditFlag();
                if (saveType & 1) {
                    QZONE.dataCenter.save('shoplib_sil', data.itemlist);
                }
                g_initData = getInitSpaceData(true);
                break;
            case 2005:
                isItemInvalid = true;
                QZONE.space.guide(340, null, null, "scenario", true);
                QZONE.space._myItem = true;
                if (QZONE.customMode) {
                    QZONE.customMode.loadModule('mall');
                }
                setTimeout(function() {
                    var h = $("titleBG").offsetHeight + $("custom_panel").offsetHeight;
                    QZONE.dom.setScrollTop(h);
                },
                100);
                break;
            case 2003:
                var tmpuin = g_iLoginUin;
                QZONE.FrontPage.showLoginBox('ownerOperation',
                function() {
                    if (g_iLoginUin != tmpuin) {
                        location.reload();
                    }
                });
                isItemInvalid = true;
                break;
            case 2007:
                var _c = new QZONE.widget.Confirm("保存失败", o.msg.replace(/&lt;/, "<").replace(/&gt;/, ">"), QZONE.widget.Confirm.TYPE.OK_CANCEL);
                _c.tips[0] = '开通';
                _c.tips[2] = "返回";
                _c.onConfirm = function() {
                    window.open(QZONE.shop.getVipRegisterUrl("qmall.diy4"));
                };
                _c.show();
                isItemInvalid = true;
                break;
            default:
                if (o.msg.indexOf("黄钻专用") != -1 || o.msg.indexOf("不是黄钻用户") != -1) {
                    var m = "您当前装扮方案中使用了黄钻专用的风格，此风格仅限黄钻用户使用！<br/>开通黄钻，马上免费使用此风格。"
                    var _c = new QZONE.widget.Confirm("保存失败", m, QZONE.widget.Confirm.TYPE.OK_CANCEL);
                    _c.tips[0] = "开通";
                    _c.tips[2] = "修改";
                    _c.onConfirm = function() {
                        try {
                            QZONE.customMode.moduleData.mall.sendPV({
                                hottag: 'ISD.QZONEMALL.TOPMALL.VIP'
                            });
                        } catch(error) {}
                        window.open("http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=qmall.vstyle&clientuin=" + (QZONE.cookie.get("zzpaneluin") || "") + "&clientkey=" + (QZONE.cookie.get("zzpanelkey") || "") + "&type=0&style=0");
                    }
                    _c.onCancel = function() {
                        if (QZONE.customMode && QZONE.customMode.opened) {
                            QZONE.customMode.loadModule('style');
                        } else {
                            QZONE.space.toApp("/mall/style");
                        }
                        QZONE.dom.setScrollTop(0);
                    }
                    _c.show();
                } else {
                    QZONE.widget.msgbox.show(o.msg, 0, 2000);
                }
                isItemInvalid = true;
            }
            if (callback && isItemInvalid == false) {
                callback(o);
            }
            fs = null;
            var M = (data.mode < 3) ? "13": "131";
            if (QZONE.OFP) {
                QZONE.OFP.switchMode(M);
            }
            g_fullMode = data.mode;
        }
        fs.send();
        QZONE.event.preventDefault();
    };
    return "Orz...";
})();
function initUserSpace() {
    QZONE.space.getPadding(true);
    QZONE.space.setCenter(g_fullMode ? 1 ^ (g_fullMode % 2) : 0);
    if (g_fullMode) {
        QZONE.space.setBGScroll(window.g_isBGScroll || 0);
    }
    initButton();
    initEvent();
    QZONE.space.createFrame(g_frameStyle);
    var t = QZONE.space.checkTarget();
    initShopItem();
    if (!t) {
        loadGFP(startRendModule);
    } else {
        setTimeout(loadAccessories, 1000);
    }
    fixView();
    setTimeout(QZONE.space.closeLoading, 1500);
}
function getInitSpaceData(flag) {
    var data = {
        uin: g_iLoginUin,
        styleid: g_StyleID,
        framestyle: g_frameStyle,
        mode: g_fullMode,
        transparence: g_TransparentLevel,
        isBGScroll: g_isBGScroll || 0
    };
    data.items = QZFL.lang.objectClone(flag ? QZONE.shop.getItemList(null, true) : g_Dressup.items);
    data.diyitems = QZFL.lang.objectClone(flag ? QZONE.shop.getDiyItem(true) : g_Dressup.diyitems);
    return data;
}
function fixView() {
    if (g_fullMode) {} else {
        if (ua.opera) {
            QZONE.dom.setStyle($("mode_main"), "overflow", "auto");
        }
    }
    QZONE.dom.setStyle($("outerBox"), "position", "static");
}
function initEvent() {
    QZONE.event.addEvent(document, "keydown", QZONE.space.shortCut);
    QZONE.event.addEvent(window, "beforeunload",
    function() {
        __flash_unloadHandler = QZONE.emptyFn;
        __flash_savedUnloadHandler = QZONE.emptyFn;
    });
}
//初始化按钮
function initButton() {
    if (ownermode) {
        _addLinkClick("a_infoCenter", initButton.ownerFrontPage);
        _addLinkClick("a_shop", initButton.decoration);
        _addLinkClick("a_spaceSetting", initButton.customize);
        _addLinkClick("a_return",
        function() {
            QZONE.customMode.opened = false;
            QZONE.space.leaveCustomMode("N1");
            QZONE.event.preventDefault();
        });
    } else {
        _addLinkClick("a_viewshop", initButton.ownerDecoration);
        _addLinkClick("a_sendGift",
        function() {
            QZONE.FrontPage.sendGift(g_iUin);
            QZONE.event.preventDefault();
        });
        _addLinkClick("a_addFriend",
        function() {
            QZONE.FrontPage.addFriend();
            QZONE.event.preventDefault();
        });
    }
}
initButton.ownerDecoration = function() {
    if (checkLogin() < 10001) {
        QZONE.FrontPage.showLoginBox();
    } else {
        QZONE.space.guide('99', 'mallinfo', "/qzone/mall/v5/web/myitem/host_scenario_item.htm");
    }
    QZONE.event.preventDefault();
};
initButton.ownerFrontPage = function() {
    QZONE.space.toApp("/myhome");
    QZONE.event.preventDefault();
};
initButton.decoration = function() {
    if ( !! QZONE.customMode && QZONE.customMode.opened) {
        QZONE.customMode.loadModule("mall");
    } else {
        QZONE.space.toApp("/mall");
    }
    QZONE.event.preventDefault();
};
initButton.customize = function() {
    if (QZONE.customMode && QZONE.customMode.opened) {
        QZONE.customMode.loadModule('start');
        QZONE.dom.setScrollTop(0);
    } else {
        QZONE.space.guide("N1");
        QZONE.space.toApp("/custom/start");
    }
    QZONE.event.preventDefault();
};
//初始化模块
function initModule(windowList) {
    var list = (windowList || g_Dressup.windows),
    _w,
    cfn,
    wlSort = function(a, b) {
        if (g_frameStyle > 0) {
            if (a.posx != b.posx) {
                return a.posx - b.posx;
            } else if (a.posy != b.posy) {
                return a.posy - b.posy;
            } else {
                return 0;
            }
        } else {
            return a.posz - b.posz;
        }
    };
    _w = list.sort(wlSort);
    var
    cid = "mainContainer",
    ccip = "frameCol_";
    for (var i = 0; i < _w.length; i++) {
        if (_w[i].appid == 128) {
            continue;
        }
        if ((_w[i].appid != 99) && (cfn = QZONE.QzWidget.findConsFn(_w[i].appid))) {
            if (cfn.configuration && cfn.configuration.modes) {
                _w[i].mode = _w[i].mode % cfn.configuration.modes.length;
            }
        }
        if (g_frameStyle == 0) {
            if (_w[i].height == 0) {
                _w[i].height = 100;
            }
            if (_w[i].width == 0) {
                _w[i].width = 100;
            }
        }
        initModule._dataChange(_w[i]);
        var item = QZONE.Module.create(_w[i], void(0), cid, ccip);
    }
    QZONE.space.setContainHeight();
    ENV.set("moduleRendered", true);
}
initModule._dataChange = function(m) {
    if (m.appid != 99) {
        m.wndid = m.mode;
    } else {
        if (m.mode == 0) {
            m.mode = m.wndid;
        } else if (m.wndid == 0) {
            m.wndid = m.mode;
        }
    }
};
function getUrlShopItem() {
    var _mall = QZFL.dataCenter.get('mallitem');
    var _diy = QZFL.dataCenter.get('diyitem');
    var _aMall = [],
    _aDiy = [];
    if (_mall) {
        var _mi = _mall.split('-');
        for (var i = 0; i < _mi.length; i++) {
            var _t = _mi[i].split('_');
            var _obj = {
                'type': Number(_t[0]),
                'itemno': Number(_t[1]),
                'posx': Number(_t[2]),
                'posy': Number(_t[3]),
                'posz': Number(_t[4]),
                'width': Number(_t[5]),
                'height': Number(_t[6]),
                'flag': Number(_t[7])
            };
            if (isNaN(_obj.type) || isNaN(_obj.itemno) || isNaN(_obj.posx) || isNaN(_obj.posy) || isNaN(_obj.posz) || isNaN(_obj.width) || isNaN(_obj.height) || isNaN(_obj.flag)) {
                continue;
            } else {
                _aMall.push(_obj);
            }
        }
    }
    if (_diy) {
        var _di = _diy.split('-');
        for (var i = 0; i < _di.length; i++) {
            var _t = _di[i].split('_');
            var _obj = {
                'type': Number(_t[0]),
                'itemno': Number(_t[1]),
                'posx': Number(_t[2]),
                'posy': Number(_t[3]),
                'posz': Number(_t[4]),
                'width': Number(_t[5]),
                'height': Number(_t[6]),
                'flag': Number(_t[7]),
                'url': decodeURIComponent(_t[8]),
                'color': decodeURIComponent(_t[9]),
                'diyno': _t[10]
            };
            if (isNaN(_obj.type) || isNaN(_obj.itemno) || isNaN(_obj.posx) || isNaN(_obj.posy) || isNaN(_obj.posz) || isNaN(_obj.width) || isNaN(_obj.height) || isNaN(_obj.flag)) {
                continue;
            } else {
                _aDiy.push(_obj);
            }
        }
    }
    return {
        'mall': _aMall,
        'diy': _aDiy
    };
}
//初始化商城的物品
function initShopItem() {
    checkShopItem();
    var _immediate = {
        1 : 1,//背景皮肤 
        13 : 1,//自定义导航栏 
        14 : 1,//欢迎Flash
        19 : 1//标题栏 
    };
    var _di = g_Dressup.diyitems,
    _delayItemList = [];
    function sortList(a, b) {
        return a.posz - b.posz;
    }
    var _i = g_Dressup.items.sort(sortList);
    for (var i = 0; i < _i.length; i++) {
        if (_immediate[_i[i].type]) {
            QZONE.shop.add(_i[i]);//除了　１、13、14、19预先加载外，其它均延时５秒再进行加载
        } else {
            _delayItemList.push(_i[i]);//一些物品要延时进行加载
        }
    }
    if (_di) {
        for (var i = 0; i < _di.length; i++) {
            QZONE.shop.add(_di[i]);
        }
    }
    setTimeout(function() {
        var _d = _delayItemList;
        for (var i = 0; i < _d.length; i++) {
            QZONE.shop.add(_d[i]);
        }
    },
    5000);
}
//检测商城的一些物品
function checkShopItem() {
    var _i = g_Dressup.items,
    _di = g_Dressup.diyitems,
    _loadStyle = {};
    if (_i) {
        for (var i = 0; i < _i.length; i++) {
            _loadStyle[_i[i].type] = _i[i];
        }
    } else {
        g_Dressup.items = [];
    }
    if (_di) {
        for (var i = 0; i < _di.length; i++) {
            _loadStyle[_di[i].type] = _di[i];
        }
    }
    if (!_loadStyle[19]) {//标题栏 
        var _item = {
            type: 19,
            itemno: 1,
            posx: 0,
            posy: 0,
            posz: 0,
            height: 0,
            width: 0,
            flag: 0
        };
        g_Dressup.items.unshift(_item);
        _loadStyle[_item.type] = _item;
    }
    if (!_loadStyle[13]) {//自定义导航栏
        var _item = {
            type: 13,
            itemno: 1,
            posx: 0,
            posy: 0,
            posz: 0,
            height: 0,
            width: 0,
            flag: 1
        };
        g_Dressup.items.unshift(_item);//插入数据元素
        _loadStyle[_item.type] = _item;
    }
    if (!_loadStyle[1]) {//背景皮肤 
        var _item = {
            type: 1,
            itemno: 1,
            posx: 0,
            posy: 0,
            posz: 0,
            height: 0,
            width: 0,
            flag: 90
        };
        g_Dressup.items.unshift(_item);
        _loadStyle[_item.type] = _item;
    }
    g_initData = getInitSpaceData();
    var _htMore = {
        2 : 1,
        3 : 1,
        15 : 1,
        16 : 1,
        17 : 1
    };
    var _ui = getUrlShopItem();
    var _mall = _ui.mall;
    for (var i = 0; i < _mall.length; i++) {
        var _m = _mall[i];
        if (_loadStyle[_m.type] && !_htMore[_m.type]) {
            QZFL.lang.propertieCopy(_loadStyle[_m.type], _m);
            delete _loadStyle[_m.type].url;
        } else {
            g_Dressup.items.push(_m);
        }
    }
    var _diy = _ui.diy;
    for (var i = 0; i < _diy.length; i++) {
        var _m = _diy[i];
        if (_loadStyle[_m.type] && !_htMore[_m.type]) {
            QZFL.lang.propertieCopy(_loadStyle[_m.type], _m);
        } else {
            g_Dressup.diyitems.push(_m);
        }
    }
}
function setSpeedItems() {
    var _temp = [{
        type: 13,
        itemno: 1,
        posx: 0,
        posy: 0,
        posz: 0,
        height: 0,
        width: 0,
        flag: 1
    }];
    var _keepItem = {};
    for (var i = 0; i < g_Dressup.items.length; i++) {
        if (_keepItem[g_Dressup.items[i].type]) {
            _temp.push(g_Dressup.items[i]);
        }
    }
    g_TransparentLevel = 0;
    delete g_Dressup.diyitems;
    g_Dressup.items = _temp;
}
if (typeof(QZONE.deprecated) == 'undefined') {
    QZONE.deprecated = {}
}
QZONE.deprecated.g_XDoc = {};
QZONE.deprecated.g_JData = {};
QZONE.deprecated.OldFunctions = (function() {
    var g_XDoc = QZONE.deprecated.g_XDoc;
    var g_JData = QZONE.deprecated.g_JData;
    function doFill(templetHTML, xDoc, xLevel, bOptimize) {
        xLevel = (typeof(xLevel) == 'undefined') ? 0 : xLevel;
        if (!xDoc) {
            return '';
        }
        var r_attribute_global = /<%=@([#~&\w]+)%>/g,
        isXML = !!xDoc.xml,
        stRegPrefix = "<%repeat_" + xLevel + "\\s*match=\"([^\"]+)\"[^%]*%>",
        stRegContent = "<%repeat_" + xLevel + "[^>]*%>((.|\\n)+)<%_repeat_" + xLevel + "%>",
        r_repeat_match = new RegExp(stRegPrefix),
        r_repeat_match_global = new RegExp(stRegPrefix, "g"),
        r_repeat_content = new RegExp(stRegContent),
        r_repeat_match_next_level = new RegExp("<%repeat_" + (xLevel + 1) + " match=\"([^\"]+)\"");
        if (templetHTML.match(r_repeat_match) == null) {
            rt.error("没有找到节点<%repeat_" + (xLevel) + "%>");
            return '';
        }
        var arPrefix = templetHTML.match(r_repeat_match_global),
        startPosition = 0;
        for (var i = 0; i < arPrefix.length; i++) {
            var st = arPrefix[i];
            var nodePath = st.replace(/^.*match=\"|\".*$/g, "");
            startPosition = templetHTML.indexOf(st);
            var endPosition = templetHTML.indexOf("<%_repeat_" + xLevel + "%>", startPosition);
            var replaceContent = templetHTML.substring(startPosition, endPosition + 13);
            startPosition += st.length;
            var repeatContent = templetHTML.substring(startPosition, endPosition);
            var nodes = isXML ? xDoc.selectNodes(nodePath) : objSelectNodes(xDoc, nodePath);
            var arContent = [];
            var repeatTimes = nodes.length;
            if (st.indexOf("repeat_num") > 0) {
                var sTimes = st.replace(/^.*repeat_num=\"|\".*$/g, "");
                if (!isNaN(sTimes)) {
                    repeatTimes = Math.min(repeatTimes, parseInt(sTimes, 10));
                }
            }
            for (var j = 0; j < repeatTimes; j++) {
                var node = nodes[j];
                var content = repeatContent;
                if (repeatContent.match(r_repeat_match_next_level) != null) {
                    content = doFill(repeatContent, node, xLevel + 1, bOptimize);
                }
                var st = isXML ? node.text: node;
                var s = content;
                if (0 == j) {
                    var attributes = content.match(r_attribute_global);
                    if (attributes == null) {
                        attributes = [];
                    } else if (bOptimize) {
                        var tempArray = [],
                        oPushed = {};
                        for (var m = 0, mLen = attributes.length; m < mLen; m++) {
                            if (m == 0 || !oPushed[attributes[m]]) {
                                tempArray.push(attributes[m]);
                                oPushed[attributes[m]] = true;
                            }
                        }
                        attributes = tempArray.sort().reverse();
                    }
                }
                for (var k = 0; k < attributes.length; k++) {
                    var attrTag = attributes[k].replace(/\W/g, "");
                    var attrValue = isXML ? nodes[j].getAttribute(attrTag) : nodes[j][attrTag];
                    if (attrValue == null && isXML && nodes[j].selectSingleNode(attrTag) != null) attrValue = nodes[j].selectSingleNode(attrTag).text;
                    if (attrValue == null) attrValue = "";
                    attrValue = attrValue.toString();
                    var reg = new RegExp(attributes[k], "g");
                    s = s.replace(reg, attrValue.replace(/\$/g, "$$$$"));
                }
                arContent[j] = s;
            }
            templetHTML = templetHTML.replace(replaceContent, arContent.join(""));
        }
        return templetHTML;
    }
    function objSelectNodes(obj, oPath) {
        if (/^\//.test(oPath)) oPath = oPath.substr(1);
        var a = oPath.split("/"),
        o = obj[a.shift()];
        if (!o) return [];
        if (!o.sort) o = [o];
        if (a.length == 0) {
            return o;
        }
        var subPath = a.join("/"),
        result = [];
        for (var i = 0; i < o.length; i++) {
            a = objSelectNodes(o[i], subPath);
            if (a && a.length > 0) result = result.concat(a);
        }
        return result;
    }
    function objSelectSingleNode(obj, oPath) {
        var o = objSelectNodes(obj, oPath);
        return (o.length >= 1) ? (o[0]) : (null);
    }
    function loadJsonData(xID, url, callback, errcallback, refresh, charset, callbackFunctionName) {
        if (QZONE.deprecated.g_JData[xID] && !refresh && !QZONE.deprecated.g_JData[xID].error) {
            callback(QZONE.deprecated.g_JData[xID]);
            return;
        }
        charset = charset ? charset: "GB2312";
        var cFN = callbackFunctionName ? callbackFunctionName: "JsonCallback";
        var snd = new QZONE.JSONGetter(url, void(0), null, charset);
        snd.onSuccess = function(o) {
            try {
                callback(g_JData[xID] = o);
            } catch(err) {
                if (err.number && err.number == -2146823281) {}
            }
        };
        if (typeof(errcallback) == 'function') {
            snd.onError = errcallback;
        }
        snd.send(cFN);
    }
    var Browser = {
        isMozilla: !!ua.firefox,
        isIE: !!ua.ie,
        isIE7: ua.ie >= 7,
        isFirefox: !!ua.firefox,
        isSafari: !!ua.safari,
        isOpera: !!ua.opera
    };
    function loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType) {
        var m = xUrl.match(/(^http:\/\/([a-z,A-Z,0-9,\-,_,\.]+\.qq\.com)\/)/);
        if (!m) {
            alert("不能访问非qq.com域的资源");
            return;
        }
        var domain = m[0];
        var host = m[2];
        var proxyPageURL = domain + "proxy.html";
        if (domain == ("http://" + imgcacheDomain + "/")) proxyPageURL = "http://" + imgcacheDomain + "/ac/qzone/proxy.html";
        var f = document.getElementsByTagName("iframe");
        for (var i = 0; i < f.length; i++) {
            var isRightProxy = false;
            try {
                isRightProxy = f[i].src.indexOf(proxyPageURL) == 0
            } catch(e) {}
            if (isRightProxy) {
                if (!callBackHsmp[host] && typeof callBackHsmp[host] != "undefined") {
                    frames[i].loadXMLAsync(xID, xUrl, callback, err_callback, nocache, data, returnType);
                } else {
                    if (typeof callBackHsmp[host] == "undefined") callBackHsmp[host] = [];
                    callBackHsmp[host][callBackHsmp[host].length] = {
                        "callback": callback,
                        "xID": xID,
                        "xUrl": xUrl,
                        "err_callback": err_callback,
                        "nocache": nocache,
                        "data": data,
                        "returnType": returnType
                    };
                }
                return;
            }
        }
        if (!callBackHsmp[host]) {
            callBackHsmp[host] = [{
                "callback": callback,
                "xID": xID,
                "xUrl": xUrl,
                "err_callback": err_callback,
                "nocache": nocache,
                "data": data,
                "returnType": returnType
            }];
            createProxy(proxyPageURL);
        }
    }
    var callBackHsmp = [];
    function createProxy(src) {
        var f = document.getElementsByTagName("iframe");
        for (var i = 0; i < f.length; i++)
        if (f[i].src.indexOf(src) != -1) return;
        var i = document.createElement("iframe");
        var proxyDiv = $("proxy");
        if (!proxyDiv) document.body.insertBefore(i, null);
        else $("proxy").appendChild(i);
        i.width = 0;
        i.height = 0;
        i.src = src;
        i = null;
    }
    function sfc(name, value, timeout, dm) {
        if (!timeout) timeout = 10 * 12 * 30 * 24 * 3600 * 1000;
        QZONE.cookie.set(name, value, false, false, (timeout / (3600000)));
    }
    function icjs(src, option, _doc) {
        var s = new QZONE.JsLoader();
        if (typeof(option) == 'function') s.onload = option;
        s.load(src, _doc);
    }
    g_XDoc.blogCommentCount = QZONE.NaturalApp ? QZONE.NaturalApp.BlogApp.configuration.commentBlogIdPool: {};
    var bfn = QZONE.emptyFn;
    function removeUBB(s) {
        s = s.replace(/\[em\]e(\d{1,3})\[\/em\]/g, '<img src="qzone/em/e$1.gif">');
        s = s.replace(/\[(img)\].*\[\/img\]/ig, "");
        s = s.replace(/\[(flash)\].*\[\/flash\]/ig, "");
        s = s.replace(/\[(video)\].*\[\/video\]/ig, "");
        s = s.replace(/\[(audio)\].*\[\/audio\]/ig, "");
        s = s.replace(/\[\/?(b|url|img|flash|video|audio|ftc|ffg|fts|ft|email|center|u|i|marque|m|r|quote)[^\]]*\]/ig, "");
        s = s.replace(/\[qqshow(,\d*){4},?([^\]]*)\][^\[]*\[\/qqshow\]/g, '【QQ秀泡泡】$2');
        return s;
    }
    var popupDialog = function() {
        QZONE.FrontPage.popupDialog.apply(QZONE.FrontPage, arguments);
    };
    var closePopup = function() {
        QZONE.FrontPage.closePopup.apply(QZONE.FrontPage, arguments);
    };
    function setImage(tgt, src, fMode, sWidth, sHeight, defSrc) {
        var objImg = new Image();
        objImg.onload = function() {
            this.onload = null;
            fixImageSize(this, fMode, sWidth, sHeight);
            try {
                if (tgt) {
                    with(tgt) {
                        src = this.src;
                        width = this.width;
                        height = this.height;
                    }
                }
            } catch(ex) {}
        }
        objImg.onerror = function() {
            this.onerror = null;
            this.src = ( !! defSrc ? defSrc: '/qzone_v4/client/userinfo_icon/5001.gif');
        }
        objImg.src = src;
    }
    function saveComplete(reload, guide) {
        if (reload) {
            location = "http://user.qzone.qq.com/" + g_iUin;
            return;
        }
        if (typeof guide == "object") {
            QZONE.space.guide(99, guide.name, guide.url);
            return;
        }
        QZONE.space.leaveCustomMode("N1");
    }
    function fixImageSize(objImg, fixMode, STD_WIDTH, STD_HEIGHT) {
        if (!objImg) return;
        if (!STD_WIDTH) STD_WIDTH = 30;
        if (!STD_HEIGHT) STD_HEIGHT = 30;
        if (fixMode == undefined) fixMode = 0;
        var rWidth = objImg.width;
        var rHeight = objImg.height;
        var fWidth, fHeight;
        var scale = rWidth / rHeight;
        var zoomScale;
        if (fixMode == 3) {
            fWidth = rWidth;
            fHeight = rHeight;
        } else if (fixMode == 2) {
            fWidth = STD_WIDTH;
            fHeight = STD_HEIGHT;
        } else if (fixMode == 1) {
            if (rWidth < STD_WIDTH && rHeight < STD_HEIGHT) {
                fWidth = rWidth;
                fHeight = rHeight;
            } else if (scale < 1) {
                zoomScale = STD_HEIGHT / rHeight;
                fWidth = Math.round(rWidth * zoomScale);
                fHeight = STD_HEIGHT;
            } else {
                zoomScale = STD_WIDTH / rWidth;
                fWidth = STD_WIDTH;
                fHeight = Math.round(rHeight * zoomScale);
            }
        } else {
            if (rWidth < STD_WIDTH && rHeight < STD_HEIGHT) {
                fWidth = rWidth;
                fHeight = rHeight;
            } else if (scale > 1) {
                zoomScale = STD_HEIGHT / rHeight;
                fWidth = Math.round(rWidth * zoomScale);
                fHeight = STD_HEIGHT;
            } else {
                zoomScale = STD_WIDTH / rWidth;
                fWidth = STD_WIDTH;
                fHeight = Math.round(rHeight * zoomScale);
            }
        }
        objImg.width = fWidth;
        objImg.height = fHeight;
    }
    function photoConfig(aid) {
        var m = QZONE.NaturalApp.PhotoAlbum.instances[0];
        if (m) {
            window.popupCallback = function() {
                m.present();
            };
        }
        var albumid = aid ? aid: (g_XDoc[5] ? g_XDoc[5].selectSingleNode("data/albumid").text: "");
        var strHTML = '<iframe id="chose_photo_cover" frameborder="0" src="http://' + imgcacheDomain + '/qzone/client/photo/pages/qzone_v4/alter_photo_cover.htm#albumid=' + albumid + '" style="width:304px;height:312px"></iframe>';
        popupDialog("相册设置", strHTML, 306, 336);
    }
    function gd() {
        QZONE.space.guide.apply(null, arguments);
    }
    function writePhotoBlog(tab, albumid, lloc) {
        var strHTML = '<iframe id="chose_photo_cover" frameborder="0" src="http://' + imgcacheDomain + '/qzone/client/photo/pages/qzone_v4/blog_upload_pic.htm?tab=' + (tab ? tab: '') + '&albumid=' + (albumid ? albumid: '') + '&lloc=' + (lloc ? lloc: '') + '" allowTransparency="true" style="width:430px;height:290px"></iframe>';
        popupDialog("插入图片", strHTML, 432, 310);
        popupCallback = function() {
            if (g_XDoc["selectPhotos"] && g_XDoc["selectPhotos"].length > 0) {
                writeBlog("", "", "我的图志", 1);
            }
        }
    }
    function writeBlog(content, title, category, photoBlog, paperID, paperStyle, bOpenPaperDlg) {
        var url = new StringBuilder();
        url.append("?content=" + (content ? content: ""));
        url.append("opener=main");
        if (title) url.append("title=" + title);
        if (category) url.append("category=" + category);
        if (photoBlog) url.append("photoBlog=1");
        if (paperID) url.append("paperid=" + paperID);
        if (paperStyle) url.append("paperstyle=" + paperStyle);
        if (bOpenPaperDlg) url.append("paperdialog=" + bOpenPaperDlg);
        QZONE.space.toApp("/blog/add/" + url.toString("&"));
    }
    function showBubble(e, title, msg, timeout, className, staticId, styleText, callback) {
        QZONE.widget.bubble.show(e, title, msg, {
            timeout: timeout == -1 ? null: timeout,
            className: className,
            id: staticId,
            call: callback,
            styleText: styleText
        })
    }
    function hideBubble(bubbleId) {
        QZONE.widget.bubble.hide(bubbleId);
    }
    function hideAllBubble() {
        QZONE.widget.bubble.hideAll();
    }
    function doSalutation(uin) {
        if (checkLogin() <= 10000) {
            showLoginBox("mall");
            return;
        }
        if (uin == checkLogin()) {
            showMsgbox("您不能和自己打招呼", 1, 2000);
            return;
        }
        popupDialog("打招呼", '<iframe frameBorder="no" id="sendPokeFrame" style="border:none;" src="http://' + imgcacheDomain + '/qzone/driftbottle/poke/send_poke.htm?uin=' + uin + '"></iframe>', 518, 240);
    }
    function _rxda(xdocKey, rev, callback) {
        var url = {
            3 : "http://" + g_Base_Domain + "/fcg-bin/cgi_access_self.fcg?type=3&uin=" + g_iUin
        };
        loadXMLAsync(xdocKey, url[xdocKey], callback);
    }
    function openChatbox(uin) {
        frames["hidentarget"].location = "tencent://Message/?websiteName=qzone.qq.com&Menu=yes&uin=" + uin;
    }
    function pickNumFromDom(path, o, type, attr) {
        var tn;
        if (!type) type = "n";
        try {
            if (/n/.test(type)) tn = parseInt(o.selectSingleNode(path).text);
            else {
                if (path == "") tn = parseInt(o.getAttribute(attr));
                else tn = parseInt(o.selectSingleNode(path).getAttribute(attr));
            }
            if (isNaN(tn)) tn = 0;
        } catch(err) {
            tn = 0;
        }
        return tn;
    }
    function guidebutton(idx, frameName, url, postfix) {
        QZONE.space.guide(idx, frameName, url, postfix);
    }
    function openFriendManage() {
        if (! (checkLogin() > 10000)) {
            showLoginBox("interact");
            return;
        }
        if (ownermode) {
            QZONE.space.guide(99, 'thudong', 'qzone/newfriend/friend_mgr.html');
        }
    }
    function openMusicUrl() {
        QZONE.space.guide(3);
    }
    function openAlbum(albumid, photoid) {
        var sUrl;
        if (albumid) {
            if (photoid) {
                sUrl = "/qzone/client/photo/pages/qzone_v4/photo_view.htm#a_id=" + albumid + "&lloc=" + photoid;
            } else {
                sUrl = "/qzone/client/photo/pages/qzone_v4/photo_list.htm#a_id=" + albumid;
            }
        }
        else {
            sUrl = "/qzone/client/photo/pages/qzone_v4/album_list.htm";
        }
        QZONE.space.guide(99, "photod", "http://" + imgcacheDomain + sUrl);
    }
    function _fwebt(type, itemno) {
        var _r = QZONE.shop.searchItem(type, itemno);
        if (_r) {
            return _r[0].itemno;
        } else {
            return - 1;
        }
    }
    function loadSeed(update) {
        if (update) {
            QZONE.widget.seed.update();
        }
        return QZONE.widget.seed.get();
    }
    function _hidenTarget() {
        if ($("_ifrm_ht")) {
            return;
        }
        var _hf = QZONE.dom.createNamedElement("iframe", "hidentarget", document);
        _hf.id = "_ifrm_ht";
        _hf.width = "0";
        _hf.height = "0";
        _hf.style.display = "none";
        document.body.appendChild(_hf);
    }
    return {
        doFill: doFill,
        g_XDoc: g_XDoc,
        g_JData: g_JData,
        loadJsonData: loadJsonData,
        loadXMLAsyncNoCache: function(xID, xUrl, callback, err_callback, data, returnType) {
            return loadXMLAsync(xID, xUrl, callback, err_callback, true, data, returnType);
        },
        loadXMLAsync: loadXMLAsync,
        LoadXMLData: function(xID, callback) {
            if (g_XDoc[xID]) {
                setTimeout(callback, 50);
            }
        },
        helpZY: {},
        LoadXMLDataEx: loadXMLAsync,
        showBubble: showBubble,
        hideBubble: hideBubble,
        getShareData: QZONE.shareObject.get,
        setShareData: QZONE.shareObject.set,
        getCookie: QZONE.cookie.get,
        setCookie: QZONE.cookie.set,
        setFileCookie: sfc,
        send_stat_request: bfn,
        customVarContainer: {},
        showMsgbox: function() {
            QZONE.FrontPage.showMsgbox.apply(QZONE.FrontPage, arguments);
        },
        hideMsgbox: function() {
            QZONE.FrontPage.hideMsgbox.apply(QZONE.FrontPage, arguments);
        },
        getBitMapFlag: function() {
            return QZONE.FrontPage.getBitMapFlag.apply(QZONE.FrontPage, arguments);
        },
        hitcounter: bfn,
        callBackHsmp: callBackHsmp,
        includeJS: icjs,
        getPosition: QZONE.dom.getPosition,
        showLoginBox: function() {
            QZONE.FrontPage.showLoginBox.apply(QZONE.FrontPage, arguments);
        },
        createProxy: createProxy,
        removeElement: QZONE.dom.removeElement,
        Browser: Browser,
        popupDialog: popupDialog,
        closePopup: closePopup,
        removeUBB: removeUBB,
        getVipFlag: function() {
            return QZONE.FrontPage.getVipStatus.apply(QZONE.FrontPage, arguments)
        },
        saveComplete: saveComplete,
        loadSeed: loadSeed,
        showTips: bfn,
        setImage: setImage,
        setClipboard: QZFL.util.copyToClip,
        startStepMark: [],
        getUserAge: function() {
            return QZONE.NaturalApp ? QZONE.NaturalApp.OwnerInfoApp.getOwnerAge() : void(0);
        },
        getCityLogo: function() {
            return QZONE.NaturalApp ? QZONE.NaturalApp.OwnerInfoApp.getCityLogo() : void(0);
        },
        photoConfig: photoConfig,
        guide: gd,
        gotoMyBigPhoto: function() {
            window.location.href = 'http://rc.qzone.qq.com/?bigphoto';
        },
        showIndexArea: bfn,
        setBitMapFlag: function() {
            return QZONE.FrontPage.setBitMapFlag.apply(QZONE.FrontPage, arguments);
        },
        writePhotoBlog: writePhotoBlog,
        writeBlog: writeBlog,
        fillCommentPV: bfn,
        showBubble: showBubble,
        hideBubble: hideBubble,
        hideAllBubble: hideAllBubble,
        simpleMode: 0,
        openBlog: function(archive, id) {
            QZONE.space.guide(99, "tblog", (typeof(id) == 'undefined') ? "/qzone/newblog/bloglist.html": ("/qzone/newblog/blogcontent.html#bid=" + id));
            QZONE.event.preventDefault();
        },
        showMsgSender: function() {
            QZONE.FrontPage.sendMessage.apply(QZONE.FrontPage, arguments);
        },
        RefreshXMLDataAsync: _rxda,
        openChatbox: openChatbox,
        g_FlowerXDoc: null,
        addFavorUin: function() {
            QZONE.FrontPage.addFriend.apply(QZONE.FrontPage, arguments);
        },
        sendSoloGift: function() {
            QZONE.FrontPage.sendGift.apply(QZONE.FrontPage, arguments);
        },
        pickNumFromDom: pickNumFromDom,
        guidebutton: guidebutton,
        goQQTX: function() {
            if (g_iLoginUin > 10000) {
                if (ownermode) {
                    QZONE.space.toApp("http://user.qzone.qq.com/" + g_iUin + "/profile/qqtx/");
                } else {
                    location.href = "http://user.qzone.qq.com/" + g_iLoginUin + "/profile/qqtx/";
                }
            } else {
                QZONE.FrontPage.showLoginBox("portrait");
            }
        },
        writeEmotion: function() {
            QZONE.space.guide(10);
        },
        openFriendManage: openFriendManage,
        openMusicUrl: openMusicUrl,
        openAlbum: openAlbum,
        findWndElementByType: _fwebt,
        findWndElement: _fwebt,
        reloadFruit: function() {
            QZONE.shop.flower.reloadData();
        },
        RefreshXMLData: QZONE.emptyFn,
        createHiddenTarget: _hidenTarget
    }
})();
