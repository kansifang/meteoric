$register('sohu.tool.ChangeCheck',
function() {
    sohu.tool.ChangeCheck = {
        _hrfUrl: null,
        initCheck: function(form, callBack, nsCallback) {
            this.initProp(form, callBack, nsCallback);
            this._onEvent();
            return this;
        },
        initProp: function(form, callBack, nsCallback) {
            this._form = $(form);
            this._callback = typeof(callBack) == 'function' ? callBack: null;
            this._nsCallback = typeof(nsCallback) == 'function' ? nsCallback: null;
            this._isInit = true;
            this._referStr = null;
            this._clickHandler = this._clickHandle.bindEvent(this);
        },
        initRefer: function() {
            if (this._isInit) {
                this._isInit = false;
                this._referStr = kola.tool.ChangeCheck.getFormDefault(this._form);
            }
        },
        resetRefer: function() {
            this.clearRefer();
            this.initRefer();
        },
        clearRefer: function() {
            this._referStr = null;
            this._isInit = true;
        },
        getRefer: function() {
            if (this._referStr == null) {
                this._isInit = true;
                this.initRefer();
            }
            return this._referStr;
        },
        hasChange: function() {
            return kola.tool.ChangeCheck.checkForm(this._form, this.getRefer())
        },
        unEvent: function() {
            this.clearRefer();
            $(document.body).un('click', this._clickHandler);
        },
        _onEvent: function() {
            $(document.body).on('click', this._clickHandler);
        },
        _clickHandle: function(e) {
            if (this._isInit && !this._referStr) {
                this.initRefer();
            }
            if (this._isLink(kola.Event.element(e))) {
                this._checkChange(e);
            }
        },
        _isLink: function(target) {
            var _this = this;
            var eventTarget;
            if (target.prop('tagName') == "A") {
                eventTarget = target;
            } else if (target.up('a') != null) {
                eventTarget = target.up('a');
            } else {
                return false;
            }
            if (eventTarget.prop('tagName') == "A") {
                var href = eventTarget.prop('href');
                _this._hrfUrl = href;
                if (href.indexOf('javascript') == 0 || href.lastIndexOf('#') == (href.length - 1)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        _checkChange: function(e) {
            var _this = this;
            if (this.hasChange()) {
                kola.Event.stop(e);
                callback = {
                    save: function() {
                        if (_this._callback) {
                            _this._callback(_this._hrfUrl);
                        } else {
                            if (_this._form.prop('tagName').toLowerCase() != 'form') _this._form = _this._form.down('form');
                            _this._form.elements()[0].submit()
                        }
                    },
                    noSave: function() {
                        if (_this._nsCallback) {
                            _this._nsCallback(_this._hrfUrl);
                        } else {
                            window.location.href = _this._hrfUrl
                        }
                    },
                    back: function() {
                        return true
                    }
                }
                this._alertChange(callback).show();
                return false;
            } else {
                return false;
            }
        },
        _alertChange: function(callback) {
            var options = {
                title: "修改尚未保存",
                content: "你部分修改尚未保存。你现在想保存修改吗？",
                width: 400,
                mask: {
                    color: "#fff",
                    num: 0
                },
                close: {
                    anim: 'fade'
                },
                open: {
                    anim: 'fade'
                },
                buttons: [{
                    title: '保存',
                    func: callback.save,
                    type: 'main',
                    close: true
                },
                {
                    title: '不保存',
                    func: callback.noSave,
                    close: true
                },
                {
                    title: '取消',
                    func: callback.back,
                    close: true
                }]
            }
            return new sohu.ctrl.Dialog(options);
        }
    };
    sohu.tool.ChangeCheck.init = function(form, callBack, nsCallback) {
        var instance = sohu.tool.ChangeCheck.instance;
        if (!instance) {
            instance = sohu.tool.ChangeCheck.initCheck(form, callBack, nsCallback);
            sohu.tool.ChangeCheck.instance = instance;
        } else {
            instance.initProp(form, callBack, nsCallback);
        }
        return instance;
    };
    sohu.tool.ChangeCheck.clear = function() {
        var instance = sohu.tool.ChangeCheck.instance;
        if (instance) {
            instance.unEvent();
            sohu.tool.ChangeCheck.instance = null;
        }
    };
},
'kola.tool.ChangeCheck,sohu.ctrl.Dialog');
$register('sohu.tool.Clipboard',
function() {
    sohu.tool.Clipboard = {
        _DataTxt: null,
        _tooTip: new sohu.ctrl.Tooltips({
            fadeIn: false,
            time: 3,
            fadeOut: false,
            width: 160
        }),
        copy: function(element, callback) {
            if (element) {
                this._tooTip.element = $(element);
                this._tooTip.setPos();
                var element = $(element).elements()[0]
                element.select();
            }
            if (typeof(callback) != 'function') callback = function() {};
            if (kola.Browser.ie) {
                this._tooTip.setContent("信息复制成功<br />你可以使用Ctrl+V粘贴给朋友");
                _DataTxt = document.selection.createRange()
                _DataTxt.execCommand("Copy");
                this._tooTip.show();
                callback();
            } else {
                this._tooTip.setContent("请按Ctrl+c复制");
                this._tooTip.show();
                callback();
            }
        },
        paste: function(element) {
            if (kola.Browser.ie) {
                var element = $(element).elements()[0];
                element.focus();
                this._tooTip.setContent("粘贴成功！").show();
                _DataTxt = element.createTextRange();
                _DataTxt.execCommand('Paste');
            }
            else {
                this._tooTip.setContent("浏览器不支持次操作!").show();
            }
        },
        cut: function(element) {
            if (element) {
                var element = $(element).elements()[0]
                element.select();
            }
            if (kola.Browser.ie) {
                this._tooTip.setContent("剪贴成功！")
                _DataTxt = document.selection.createRange();
                _DataTxt.execCommand("Cut");
                this._tooTip.show();
            }
            else {
                this._tooTip.setContent("浏览器不支持次操作!").show();
            }
        }
    }
},
"sohu.ctrl.Tooltips");
$register('sohu.tool.QuickUploader',
function() {
    sohu.tool.QuickUploader = {};
    sohu.tool.QuickUploader.upload = Class.create({
        initialize: function(initObj) {
            this._initUploader(initObj);
        },
        _initUploader: function(initObj) {
            this._returDataAry = [];
            this.settings = initObj;
            this._progressBar = $('#' + this.settings.progressBar);
            this._startFun = this.settings.startFun;
            this._successFun = this.settings.successFun;
            this._failFun = this.settings.failFun;
            this._autoStart = this.settings.autoStart;
            this._width = this.settings.button_width;
            this._height = this.settings.button_height;
            this.settings.file_dialog_complete_handler = this.fileDialogComplete.bind(this);
            this.settings.file_queued_handler = this.fileQueued.bind(this);
            this.settings.file_queue_error_handler = this.fileQueueError.bind(this);
            this.settings.upload_start_handler = this.uploadStart.bind(this);
            this.settings.upload_progress_handler = this.uploadProgress.bind(this);
            this.settings.upload_error_handler = this.uploadError.bind(this);
            this.settings.upload_complete_handler = this.uploadComplete.bind(this);
            this.settings.queue_complete_handler = this.queueComplete.bind(this);
            this.settings.upload_success_handler = this.uploadSuccess.bind(this);
            this.swfu = new SWFUpload(this.settings);
            this._progressBar.css('width', '0%');
        },
        fileDialogComplete: function(selected, queued, totalQueued) {
            if (totalQueued == 0 && selected == 0) {} else {
                if (selected == 1) {
                    if (this._autoStart) {
                        this.startUpload();
                        return;
                    }
                } else {}
            }
        },
        fileQueued: function(file) {},
        fileQueueError: function(file, errorCode, message) {
            if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {}
        },
        startUpload: function() {
            this.swfu.setButtonDimensions(1, 1);
            this._startFun();
            this.uploadStart();
        },
        uploadStart: function() {
            this.swfu.startUpload();
        },
        uploadProgress: function(file, bytesLoaded, bytesTotal) {
            try {
                var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
                this._progressBar.css('width', percent + '%');
            } catch(ex) {}
        },
        uploadError: function(file, errorCode, message) {
            var status = errorCode;
            switch (errorCode) {
            case - 230 : status = 402;
                break;
            case - 200 : status = 500;
                break;
            case - 220 : status = -1;
                break;
            case 0:
                status = -1;
                break;
            }
            var error = {
                status: status,
                statusText: message
            }
            this._failFun(error);
            this.swfu.setButtonDimensions(this._width, this._height);
        },
        uploadComplete: function(file) {},
        uploadSuccess: function(file, msg) {
            this._returDataAry.push(msg);
            this._successFun(this._returDataAry);
            this.swfu.setButtonDimensions(this._width, this._height);
        },
        queueComplete: function() {}
    });
    sohu.tool.QuickUploader.init = function(uploadUrl, startFun, successFun, failFun, customSettings) {
        this.buttonHolder = "flashButton";
        this.uploadUrl = uploadUrl;
        this.sizeLimit = "5 MB";
        this.startFun = startFun;
        this.successFun = successFun;
        this.failFun = failFun;
        this.from = "qupload";
        if (customSettings && customSettings.from) {
            this.from = customSettings.from;
        }
        this.autoStart = true;
        try {
            if (sohu.user.token) {
                this.snstoken = sohu.user.token;
            } else {
                this.snstoken = "notoken";
            }
        } catch(e) {}
        this.totalLimit = 1;
        this.progressBar = "progressBar";
        this.settings = Object.extend({
            flash_url: PATH.d2 + PATH.flash + "album/upload/SWFUpload.swf",
            upload_url: this.uploadUrl,
            post_params: {
                "snstoken": this.snstoken,
                "from": this.from
            },
            file_size_limit: this.sizeLimit,
            file_types: "*.jpg;*.jpeg;*.gif;*.png;*.tif;*.tiff",
            file_types_description: "单张图片文件",
            file_upload_limit: this.totalLimit,
            file_queue_limit: 1,
            debug: false,
            button_image_url: PATH.d2 + PATH.flash + "album/upload/quickUploadButton.png",
            button_width: "377",
            button_height: "24",
            button_text_style: ".redText { color: #983402; }",
            button_disabled: false,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_placeholder_id: this.buttonHolder,
            button_text_style: ".theFont { font-size: 16; }",
            button_text_left_padding: 0,
            button_text_top_padding: 0,
            progressBar: this.progressBar,
            startFun: this.startFun,
            successFun: this.successFun,
            failFun: this.failFun,
            autoStart: this.autoStart,
            button_action: -100
        },
        customSettings || {});
        return new sohu.tool.QuickUploader.upload(this.settings);
    };
},
'kola.tool.Formatter,sohu.tool.SwfUploadLib');
$register('sohu.tool.RSA',
function() {});
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);
    else if (b == null && "string" != typeof a) this.fromString(a, 256);
    else this.fromString(a, b);
}
function nbi() {
    return new BigInteger(null);
}
function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff;
    }
    return c;
}
function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
    xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff;
    }
    return c;
}
function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
    xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff;
    }
    return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
}
else if (j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
}
else {
    BigInteger.prototype.am = am3;
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
function int2char(n) {
    return BI_RM.charAt(n);
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
}
function bnpFromInt(x) {
    this.t = 1;
    this.s = (x < 0) ? -1 : 0;
    if (x > 0) this[0] = x;
    else if (x < -1) this[0] = x + DV;
    else this.t = 0;
}
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 256) k = 8;
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else {
        this.fromRadix(s, b);
        return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length,
    mi = false,
    sh = 0;
    while (--i >= 0) {
        var x = (k == 8) ? s[i] & 0xff: intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-") mi = true;
            continue;
        }
        mi = false;
        if (sh == 0) this[this.t++] = x;
        else if (sh + k > this.DB) {
            this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
            this[this.t++] = (x >> (this.DB - sh));
        }
        else this[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB) sh -= this.DB;
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
        this.s = -1;
        if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
    }
    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
}
function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)--this.t;
}
function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1 << k) - 1,
    d,
    m = false,
    r = "",
    i = this.t;
    var p = this.DB - (i * this.DB) % k;
    if (i-->0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
            m = true;
            r = int2char(d);
        }
        while (i >= 0) {
            if (p < k) {
                d = (this[i] & ((1 << p) - 1)) << (k - p);
                d |= this[--i] >> (p += this.DB - k);
            }
            else {
                d = (this[i] >> (p -= k)) & km;
                if (p <= 0) {
                    p += this.DB; --i;
                }
            }
            if (d > 0) m = true;
            if (m) r += int2char(d);
        }
    }
    return m ? r: "0";
}
function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
}
function bnAbs() {
    return (this.s < 0) ? this.negate() : this;
}
function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return r;
    while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
    return 0;
}
function nbits(x) {
    var r = 1,
    t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
}
function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i) r[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
}
function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
}
function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
    c = (this.s << bs) & this.DM,
    i;
    for (i = this.t - 1; i >= 0; --i) {
        r[i + ds + 1] = (this[i] >> cbs) | c;
        c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
}
function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
        r.t = 0;
        return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
        r[i - ds - 1] |= (this[i] & bm) << cbs;
        r[i - ds] = this[i] >> bs;
    }
    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
}
function bnpSubTo(a, r) {
    var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
    }
    if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c += this.s;
    }
    else {
        c += this.s;
        while (i < a.t) {
            c -= a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        c -= a.s;
    }
    r.s = (c < 0) ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;
    else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
}
function bnpMultiplyTo(a, r) {
    var x = this.abs(),
    y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}
function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r[i + x.t] -= x.DV;
            r[i + x.t + 1] = 1;
        }
    }
    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
}
function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();
    if (pt.t < pm.t) {
        if (q != null) q.fromInt(0);
        if (r != null) this.copyTo(r);
        return;
    }
    if (r == null) r = nbi();
    var y = nbi(),
    ts = this.s,
    ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]);
    if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
    }
    else {
        pm.copyTo(y);
        pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2: 0);
    var d1 = this.FV / yt,
    d2 = (1 << this.F1) / yt,
    e = 1 << this.F2;
    var i = r.t,
    j = i - ys,
    t = (q == null) ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y);
    while (y.t < ys) y[y.t++] = 0;
    while (--j >= 0) {
        var qd = (r[--i] == y0) ? this.DM: Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r[i] < --qd) r.subTo(t, r);
        }
    }
    if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r);
    if (ts < 0) BigInteger.ZERO.subTo(r, r);
}
function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
}
function Classic(m) {
    this.m = m;
}
function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
}
function cRevert(x) {
    return x;
}
function cReduce(x) {
    x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
}
function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;
function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3;
    y = (y * (2 - (x & 0xf) * y)) & 0xf;
    y = (y * (2 - (x & 0xff) * y)) & 0xff;
    y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
    y = (y * (2 - x * y % this.DV)) % this.DV;
    return (y > 0) ? this.DV - y: -y;
}
function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t;
}
function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
}
function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
}
function montReduce(x) {
    while (x.t <= this.mt2)
    x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
        var j = x[i] & 0x7fff;
        var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
        j = i + this.m.t;
        x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++;
        }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}
function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
}
function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
function bnpIsEven() {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
}
function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
    r2 = nbi(),
    g = z.convert(this),
    i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
        else {
            var t = r;
            r = r2;
            r2 = t;
        }
    }
    return z.revert(r);
}
function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);
    else z = new Montgomery(m);
    return this.exp(e, z);
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array();
}
function ARC4init(key) {
    var i, j, t;
    for (i = 0; i < 256; ++i)
    this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
        j = (j + this.S[i] + key[i % key.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
}
function ARC4next() {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;
function prng_newstate() {
    return new Arcfour();
}
var rng_psize = 256;
var rng_state;
var rng_pool;
var rng_pptr;
function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= (x >> 8) & 255;
    rng_pool[rng_pptr++] ^= (x >> 16) & 255;
    rng_pool[rng_pptr++] ^= (x >> 24) & 255;
    if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}
function rng_seed_time() {
    rng_seed_int(new Date().getTime());
}
if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t)
        rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
    }
    while (rng_pptr < rng_psize) {
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255;
    }
    rng_pptr = 0;
    rng_seed_time();
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
        rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
    }
    return rng_state.next();
}
function rng_get_bytes(ba) {
    var i;
    for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}
function SecureRandom() {}
SecureRandom.prototype.nextBytes = rng_get_bytes;
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
function linebrk(s, n) {
    var ret = "";
    var i = 0;
    while (i + n < s.length) {
        ret += s.substring(i, i + n) + "\n";
        i += n;
    }
    return ret + s.substring(i, s.length);
}
function byte2Hex(b) {
    if (b < 0x10) return "0" + b.toString(16);
    else return b.toString(16);
}
function pkcs1pad2(s, n) {
    if (n < s.length + 11) {
        alert("Message too long for RSA");
        return null;
    }
    var ba = new Array();
    var i = s.length - 1;
    while (i >= 0 && n > 0) ba[--n] = s.charCodeAt(i--);
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while (n > 2) {
        x[0] = 0;
        while (x[0] == 0) rng.nextBytes(x);
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}
function RSAKey() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
}
function RSASetPublic(N, E) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N, 16);
        this.e = parseInt(E, 16);
    }
    else alert("Invalid RSA public key");
}
function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n);
}
function RSAEncrypt(text) {
    var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
    if (m == null) return null;
    var c = this.doPublic(m);
    if (c == null) return null;
    var h = c.toString(16);
    if ((h.length & 1) == 0) return h;
    else return "0" + h;
}
RSAKey.prototype.doPublic = RSADoPublic;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) ret += b64pad;
    return ret;
}
function b64tohex(s) {
    var ret = ""
    var i;
    var k = 0;
    var slop;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) break;
        v = b64map.indexOf(s.charAt(i));
        if (v < 0) continue;
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) ret += int2char(slop << 2);
    return ret;
}
function b64toBA(s) {
    var h = b64tohex(s);
    var i;
    var a = new Array();
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
}
var SWFUpload;
if (SWFUpload == undefined) {
    SWFUpload = function(settings) {
        this.initSWFUpload(settings);
    };
}
SWFUpload.prototype.initSWFUpload = function(settings) {
    try {
        this.customSettings = {};
        this.settings = settings;
        this.eventQueue = [];
        this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
        this.movieElement = null;
        this.pauseQueue = false;
        SWFUpload.instances[this.movieName] = this;
        this.initSettings();
        this.loadFlash();
        this.displayDebugInfo();
    } catch(ex) {
        delete SWFUpload.instances[this.movieName];
        throw ex;
    }
};
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Beta 5 2008-01-29";
SWFUpload.QUEUE_ERROR = {
    QUEUE_LIMIT_EXCEEDED: -100,
    FILE_EXCEEDS_SIZE_LIMIT: -110,
    ZERO_BYTE_FILE: -120,
    INVALID_FILETYPE: -130
};
SWFUpload.UPLOAD_ERROR = {
    HTTP_ERROR: -200,
    MISSING_UPLOAD_URL: -210,
    IO_ERROR: -220,
    SECURITY_ERROR: -230,
    UPLOAD_LIMIT_EXCEEDED: -240,
    UPLOAD_FAILED: -250,
    SPECIFIED_FILE_ID_NOT_FOUND: -260,
    FILE_VALIDATION_FAILED: -270,
    FILE_CANCELLED: -280,
    UPLOAD_STOPPED: -290
};
SWFUpload.FILE_STATUS = {
    QUEUED: -1,
    IN_PROGRESS: -2,
    ERROR: -3,
    COMPLETE: -4,
    CANCELLED: -5
};
SWFUpload.BUTTON_ACTION = {
    SELECT_FILE: -100,
    SELECT_FILES: -110,
    START_UPLOAD: -120
};
SWFUpload.CURSOR = {
    ARROW: -1,
    HAND: -2
};
SWFUpload.WINDOW_MODE = {
    WINDOW: "window",
    TRANSPARENT: "transparent",
    OPAQUE: "opaque"
};
SWFUpload.prototype.initSettings = function() {
    this.ensureDefault = function(settingName, defaultValue) {
        this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue: this.settings[settingName];
    };
    this.ensureDefault("upload_url", "");
    this.ensureDefault("file_post_name", "Filedata");
    this.ensureDefault("post_params", {});
    this.ensureDefault("use_query_string", false);
    this.ensureDefault("requeue_on_error", false);
    this.ensureDefault("http_success", []);
    this.ensureDefault("file_types", "*.*");
    this.ensureDefault("file_types_description", "All Files");
    this.ensureDefault("file_size_limit", 0);
    this.ensureDefault("file_upload_limit", 0);
    this.ensureDefault("file_queue_limit", 0);
    this.ensureDefault("flash_url", "swfupload.swf");
    this.ensureDefault("prevent_swf_caching", true);
    this.ensureDefault("button_image_url", "");
    this.ensureDefault("button_width", 1);
    this.ensureDefault("button_height", 1);
    this.ensureDefault("button_text", "");
    this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
    this.ensureDefault("button_text_top_padding", 0);
    this.ensureDefault("button_text_left_padding", 0);
    this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
    this.ensureDefault("button_disabled", false);
    this.ensureDefault("button_placeholder_id", "");
    this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
    this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
    this.ensureDefault("debug", false);
    this.settings.debug_enabled = this.settings.debug;
    this.settings.return_upload_start_handler = this.returnUploadStart;
    this.ensureDefault("swfupload_loaded_handler", null);
    this.ensureDefault("file_dialog_start_handler", null);
    this.ensureDefault("file_queued_handler", null);
    this.ensureDefault("file_queue_error_handler", null);
    this.ensureDefault("file_dialog_complete_handler", null);
    this.ensureDefault("upload_start_handler", null);
    this.ensureDefault("upload_progress_handler", null);
    this.ensureDefault("upload_error_handler", null);
    this.ensureDefault("upload_success_handler", null);
    this.ensureDefault("upload_complete_handler", null);
    this.ensureDefault("debug_handler", this.debugMessage);
    this.ensureDefault("custom_settings", {});
    this.customSettings = this.settings.custom_settings;
    if ( !! this.settings.prevent_swf_caching) {
        this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?": "&") + "preventswfcaching=" + new Date().getTime();
    }
    delete this.ensureDefault;
};
SWFUpload.prototype.loadFlash = function() {
    var targetElement, tempParent;
    if (document.getElementById(this.movieName) !== null) {
        throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
    }
    targetElement = document.getElementById(this.settings.button_placeholder_id);
    if (targetElement == undefined) {
        throw "Could not find the placeholder element: " + this.settings.button_placeholder_id;
    }
    tempParent = document.createElement("div");
    tempParent.innerHTML = this.getFlashHTML();
    targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);
    if (window[this.movieName] == undefined) {
        window[this.movieName] = this.getMovieElement();
    }
};
SWFUpload.prototype.getFlashHTML = function() {
    return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">', '<param name="wmode" value="', this.settings.button_window_mode, '" />', '<param name="movie" value="', this.settings.flash_url, '" />', '<param name="quality" value="high" />', '<param name="menu" value="false" />', '<param name="allowScriptAccess" value="always" />', '<param name="flashvars" value="' + this.getFlashVars() + '" />', '</object>'].join("");
};
SWFUpload.prototype.getFlashVars = function() {
    var paramString = this.buildParamString();
    var httpSuccessString = this.settings.http_success.join(",");
    return ["movieName=", encodeURIComponent(this.movieName), "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url), "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string), "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error), "&amp;httpSuccess=", encodeURIComponent(httpSuccessString), "&amp;params=", encodeURIComponent(paramString), "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name), "&amp;fileTypes=", encodeURIComponent(this.settings.file_types), "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description), "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit), "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit), "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit), "&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled), "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url), "&amp;buttonWidth=", encodeURIComponent(this.settings.button_width), "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height), "&amp;buttonText=", encodeURIComponent(this.settings.button_text), "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding), "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding), "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style), "&amp;buttonAction=", encodeURIComponent(this.settings.button_action), "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled), "&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)].join("");
};
SWFUpload.prototype.getMovieElement = function() {
    if (this.movieElement == undefined) {
        this.movieElement = document.getElementById(this.movieName);
    }
    if (this.movieElement === null) {
        throw "Could not find Flash element";
    }
    return this.movieElement;
};
SWFUpload.prototype.buildParamString = function() {
    var postParams = this.settings.post_params;
    var paramStringPairs = [];
    if (typeof(postParams) === "object") {
        for (var name in postParams) {
            if (postParams.hasOwnProperty(name)) {
                paramStringPairs.push(name.toString() + "=" + postParams[name].toString());
            }
        }
    }
    return paramStringPairs.join("&amp;");
};
SWFUpload.prototype.destroy = function() {
    try {
        this.cancelUpload(null, false);
        var movieElement = null;
        movieElement = this.getMovieElement();
        if (movieElement && typeof(movieElement.CallFunction) === "unknown") {
            for (var i in movieElement) {
                try {
                    if (typeof(movieElement[i]) === "function") {
                        movieElement[i] = null;
                    }
                } catch(ex1) {}
            }
            try {
                movieElement.parentNode.removeChild(movieElement);
            } catch(ex) {}
        }
        window[this.movieName] = null;
        SWFUpload.instances[this.movieName] = null;
        delete SWFUpload.instances[this.movieName];
        this.movieElement = null;
        this.settings = null;
        this.customSettings = null;
        this.eventQueue = null;
        this.movieName = null;
        return true;
    } catch(ex2) {
        return false;
    }
};
SWFUpload.prototype.displayDebugInfo = function() {
    this.debug(["---SWFUpload Instance Info---\n", "Movie Name: ", this.movieName, "\n", "Settings:\n", "\t", "upload_url:               ", this.settings.upload_url, "\n", "\t", "flash_url:                ", this.settings.flash_url, "\n", "\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n", "\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n", "\t", "http_success:             ", this.settings.http_success.join(", "), "\n", "\t", "file_post_name:           ", this.settings.file_post_name, "\n", "\t", "post_params:              ", this.settings.post_params.toString(), "\n", "\t", "file_types:               ", this.settings.file_types, "\n", "\t", "file_types_description:   ", this.settings.file_types_description, "\n", "\t", "file_size_limit:          ", this.settings.file_size_limit, "\n", "\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n", "\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n", "\t", "debug:                    ", this.settings.debug.toString(), "\n", "\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n", "\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n", "\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n", "\t", "button_width:             ", this.settings.button_width.toString(), "\n", "\t", "button_height:            ", this.settings.button_height.toString(), "\n", "\t", "button_text:              ", this.settings.button_text.toString(), "\n", "\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n", "\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n", "\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n", "\t", "button_action:            ", this.settings.button_action.toString(), "\n", "\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n", "\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n", "Event Handlers:\n", "\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n", "\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n", "\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n", "\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n", "\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n", "\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n", "\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n", "\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n", "\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n", "\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"].join(""));
};
SWFUpload.prototype.addSetting = function(name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
    }
};
SWFUpload.prototype.getSetting = function(name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
    }
    return "";
};
SWFUpload.prototype.callFlash = function(functionName, argumentArray) {
    argumentArray = argumentArray || [];
    var movieElement = this.getMovieElement();
    var returnValue, returnString;
    try {
        returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
        returnValue = eval(returnString);
    } catch(ex) {}
    if (returnValue != undefined && typeof returnValue.post === "object") {
        returnValue = this.unescapeFilePostParams(returnValue);
    }
    return returnValue;
};
SWFUpload.prototype.selectFile = function() {
    this.callFlash("SelectFile");
};
SWFUpload.prototype.selectFiles = function() {
    this.callFlash("SelectFiles");
};
SWFUpload.prototype.startUpload = function(fileID) {
    this.callFlash("StartUpload", [fileID]);
};
SWFUpload.prototype.cancelUpload = function(fileID, triggerErrorEvent) {
    if (triggerErrorEvent !== false) {
        triggerErrorEvent = true;
    }
    this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
};
SWFUpload.prototype.stopUpload = function() {
    this.callFlash("StopUpload");
};
SWFUpload.prototype.getStats = function() {
    return this.callFlash("GetStats");
};
SWFUpload.prototype.setStats = function(statsObject) {
    this.callFlash("SetStats", [statsObject]);
};
SWFUpload.prototype.getFile = function(fileID) {
    if (typeof(fileID) === "number") {
        return this.callFlash("GetFileByIndex", [fileID]);
    } else {
        return this.callFlash("GetFile", [fileID]);
    }
};
SWFUpload.prototype.addFileParam = function(fileID, name, value) {
    return this.callFlash("AddFileParam", [fileID, name, value]);
};
SWFUpload.prototype.removeFileParam = function(fileID, name) {
    this.callFlash("RemoveFileParam", [fileID, name]);
};
SWFUpload.prototype.setUploadURL = function(url) {
    this.settings.upload_url = url.toString();
    this.callFlash("SetUploadURL", [url]);
};
SWFUpload.prototype.setPostParams = function(paramsObject) {
    this.settings.post_params = paramsObject;
    this.callFlash("SetPostParams", [paramsObject]);
};
SWFUpload.prototype.addPostParam = function(name, value) {
    this.settings.post_params[name] = value;
    this.callFlash("SetPostParams", [this.settings.post_params]);
};
SWFUpload.prototype.removePostParam = function(name) {
    delete this.settings.post_params[name];
    this.callFlash("SetPostParams", [this.settings.post_params]);
};
SWFUpload.prototype.setFileTypes = function(types, description) {
    this.settings.file_types = types;
    this.settings.file_types_description = description;
    this.callFlash("SetFileTypes", [types, description]);
};
SWFUpload.prototype.setFileSizeLimit = function(fileSizeLimit) {
    this.settings.file_size_limit = fileSizeLimit;
    this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};
SWFUpload.prototype.setFileUploadLimit = function(fileUploadLimit) {
    this.settings.file_upload_limit = fileUploadLimit;
    this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};
SWFUpload.prototype.setFileQueueLimit = function(fileQueueLimit) {
    this.settings.file_queue_limit = fileQueueLimit;
    this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};
SWFUpload.prototype.setFilePostName = function(filePostName) {
    this.settings.file_post_name = filePostName;
    this.callFlash("SetFilePostName", [filePostName]);
};
SWFUpload.prototype.setUseQueryString = function(useQueryString) {
    this.settings.use_query_string = useQueryString;
    this.callFlash("SetUseQueryString", [useQueryString]);
};
SWFUpload.prototype.setRequeueOnError = function(requeueOnError) {
    this.settings.requeue_on_error = requeueOnError;
    this.callFlash("SetRequeueOnError", [requeueOnError]);
};
SWFUpload.prototype.setHTTPSuccess = function(http_status_codes) {
    if (typeof http_status_codes === "string") {
        http_status_codes = http_status_codes.replace(" ", "").split(",");
    }
    this.settings.http_success = http_status_codes;
    this.callFlash("SetHTTPSuccess", [http_status_codes]);
};
SWFUpload.prototype.setDebugEnabled = function(debugEnabled) {
    this.settings.debug_enabled = debugEnabled;
    this.callFlash("SetDebugEnabled", [debugEnabled]);
};
SWFUpload.prototype.setButtonImageURL = function(buttonImageURL) {
    if (buttonImageURL == undefined) {
        buttonImageURL = "";
    }
    this.settings.button_image_url = buttonImageURL;
    this.callFlash("SetButtonImageURL", [buttonImageURL]);
};
SWFUpload.prototype.setButtonDimensions = function(width, height) {
    this.settings.button_width = width;
    this.settings.button_height = height;
    var movie = this.getMovieElement();
    if (movie != undefined) {
        movie.style.width = width + "px";
        movie.style.height = height + "px";
    }
    this.callFlash("SetButtonDimensions", [width, height]);
};
SWFUpload.prototype.setButtonText = function(html) {
    this.settings.button_text = html;
    this.callFlash("SetButtonText", [html]);
};
SWFUpload.prototype.setButtonTextPadding = function(left, top) {
    this.settings.button_text_top_padding = top;
    this.settings.button_text_left_padding = left;
    this.callFlash("SetButtonTextPadding", [left, top]);
};
SWFUpload.prototype.setButtonTextStyle = function(css) {
    this.settings.button_text_style = css;
    this.callFlash("SetButtonTextStyle", [css]);
};
SWFUpload.prototype.setButtonDisabled = function(isDisabled) {
    this.settings.button_disabled = isDisabled;
    this.callFlash("SetButtonDisabled", [isDisabled]);
};
SWFUpload.prototype.setButtonAction = function(buttonAction) {
    this.settings.button_action = buttonAction;
    this.callFlash("SetButtonAction", [buttonAction]);
};
SWFUpload.prototype.setButtonCursor = function(cursor) {
    this.settings.button_cursor = cursor;
    this.callFlash("SetButtonCursor", [cursor]);
};
SWFUpload.prototype.queueEvent = function(handlerName, argumentArray) {
    if (argumentArray == undefined) {
        argumentArray = [];
    } else if (! (argumentArray instanceof Array)) {
        argumentArray = [argumentArray];
    }
    var self = this;
    if (typeof this.settings[handlerName] === "function") {
        this.eventQueue.push(function() {
            this.settings[handlerName].apply(this, argumentArray);
        });
        setTimeout(function() {
            self.executeNextEvent();
        },
        0);
    } else if (this.settings[handlerName] !== null) {
        throw "Event handler " + handlerName + " is unknown or is not a function";
    }
};
SWFUpload.prototype.executeNextEvent = function() {
    var f = this.eventQueue ? this.eventQueue.shift() : null;
    if (typeof(f) === "function") {
        f.apply(this);
    }
};
SWFUpload.prototype.unescapeFilePostParams = function(file) {
    var reg = /[$]([0-9a-f]{4})/i;
    var unescapedPost = {};
    var uk;
    if (file != undefined) {
        for (var k in file.post) {
            if (file.post.hasOwnProperty(k)) {
                uk = k;
                var match;
                while ((match = reg.exec(uk)) !== null) {
                    uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
                }
                unescapedPost[uk] = file.post[k];
            }
        }
        file.post = unescapedPost;
    }
    return file;
};
SWFUpload.prototype.testExternalInterface = function() {
    try {
        return this.callFlash("TestExternalInterface");
    } catch(ex) {
        return false;
    }
};
SWFUpload.prototype.flashReady = function() {
    var movieElement = this.getMovieElement();
    if (!movieElement) {
        this.debug("Flash called back ready but the flash movie can't be found.");
        return;
    }
    this.cleanUp(movieElement);
    this.queueEvent("swfupload_loaded_handler");
};
SWFUpload.prototype.cleanUp = function(movieElement) {
    try {
        if (kola.Browser.ie && this.movieElement && typeof(movieElement.CallFunction) === "unknown") {
            this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
            for (var key in movieElement) {
                try {
                    if (typeof(movieElement[key]) === "function") {
                        movieElement[key] = null;
                    }
                } catch(ex) {}
            }
        }
    } catch(ex1) {}
    window["__flash__removeCallback"] = function(instance, name) {
        try {
            if (instance) {
                instance[name] = null;
            }
        } catch(flashEx) {}
    };
};
SWFUpload.prototype.fileDialogStart = function() {
    this.queueEvent("file_dialog_start_handler");
};
SWFUpload.prototype.fileQueued = function(file) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("file_queued_handler", file);
};
SWFUpload.prototype.fileQueueError = function(file, errorCode, message) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};
SWFUpload.prototype.fileDialogComplete = function(numFilesSelected, numFilesQueued, totalFilesQueued) {
    this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, totalFilesQueued]);
};
SWFUpload.prototype.uploadStart = function(file) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("return_upload_start_handler", file);
};
SWFUpload.prototype.returnUploadStart = function(file) {
    var returnValue;
    if (typeof this.settings.upload_start_handler === "function") {
        file = this.unescapeFilePostParams(file);
        returnValue = this.settings.upload_start_handler.call(this, file);
    } else if (this.settings.upload_start_handler != undefined) {
        throw "upload_start_handler must be a function";
    }
    if (returnValue === undefined) {
        returnValue = true;
    }
    returnValue = !!returnValue;
    this.callFlash("ReturnUploadStart", [returnValue]);
};
SWFUpload.prototype.uploadProgress = function(file, bytesComplete, bytesTotal) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};
SWFUpload.prototype.uploadError = function(file, errorCode, message) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("upload_error_handler", [file, errorCode, message]);
};
SWFUpload.prototype.uploadSuccess = function(file, serverData) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("upload_success_handler", [file, serverData]);
};
SWFUpload.prototype.uploadComplete = function(file) {
    file = this.unescapeFilePostParams(file);
    this.queueEvent("upload_complete_handler", file);
};
SWFUpload.prototype.debug = function(message) {
    this.queueEvent("debug_handler", message);
};
SWFUpload.prototype.debugMessage = function(message) {
    if (this.settings.debug) {
        var exceptionMessage, exceptionValues = [];
        if (typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
            for (var key in message) {
                if (message.hasOwnProperty(key)) {
                    exceptionValues.push(key + ": " + message[key]);
                }
            }
            exceptionMessage = exceptionValues.join("\n") || "";
            exceptionValues = exceptionMessage.split("\n");
            exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
            SWFUpload.Console.writeLine(exceptionMessage);
        } else {
            SWFUpload.Console.writeLine(message);
        }
    }
};
SWFUpload.queue = {};
SWFUpload.prototype.initSettings = (function(oldInitSettings) {
    return function() {
        if (typeof(oldInitSettings) === "function") {
            oldInitSettings.call(this);
        }
        this.customSettings.queue_cancelled_flag = false;
        this.customSettings.queue_upload_count = 0;
        this.customSettings.user_upload_complete_handler = this.settings.upload_complete_handler;
        this.customSettings.user_upload_start_handler = this.settings.upload_start_handler;
        this.settings.upload_complete_handler = SWFUpload.queue.uploadCompleteHandler;
        this.settings.upload_start_handler = SWFUpload.queue.uploadStartHandler;
        this.settings.queue_complete_handler = this.settings.queue_complete_handler || null;
    };
})(SWFUpload.prototype.initSettings);
SWFUpload.prototype.startUpload = function(fileID) {
    this.customSettings.queue_cancelled_flag = false;
    this.callFlash("StartUpload", [fileID]);
};
SWFUpload.prototype.cancelQueue = function() {
    this.customSettings.queue_cancelled_flag = true;
    this.stopUpload();
    var stats = this.getStats();
    while (stats.files_queued > 0) {
        this.cancelUpload();
        stats = this.getStats();
    }
};
SWFUpload.queue.uploadStartHandler = function(file) {
    var returnValue;
    if (typeof(this.customSettings.user_upload_start_handler) === "function") {
        returnValue = this.customSettings.user_upload_start_handler.call(this, file);
    }
    returnValue = (returnValue === false) ? false: true;
    this.customSettings.queue_cancelled_flag = !returnValue;
    return returnValue;
};
SWFUpload.queue.uploadCompleteHandler = function(file) {
    var user_upload_complete_handler = this.customSettings.user_upload_complete_handler;
    var continueUpload;
    if (file.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
        this.customSettings.queue_upload_count++;
    }
    if (typeof(user_upload_complete_handler) === "function") {
        continueUpload = (user_upload_complete_handler.call(this, file) === false) ? false: true;
    } else if (file.filestatus === SWFUpload.FILE_STATUS.QUEUED) {
        continueUpload = false;
    } else {
        continueUpload = true;
    }
    if (continueUpload) {
        var stats = this.getStats();
        if (stats.files_queued && stats.files_queued > 0 && this.customSettings.queue_cancelled_flag === false) {
            if (! (this.pauseQueue)) {
                this.startUpload();
            }
        } else if (this.customSettings.queue_cancelled_flag === false) {
            this.queueEvent("queue_complete_handler", [this.customSettings.queue_upload_count]);
            this.customSettings.queue_upload_count = 0;
        } else {
            this.customSettings.queue_cancelled_flag = false;
            this.customSettings.queue_upload_count = 0;
        }
    }
};
SWFUpload.Console = {};
SWFUpload.Console.writeLine = function(message) {
    var console, documentForm;
    try {
        console = document.getElementById("SWFUpload_Console");
        if (!console) {
            documentForm = document.createElement("form");
            document.getElementsByTagName("body")[0].appendChild(documentForm);
            console = document.createElement("textarea");
            console.id = "SWFUpload_Console";
            console.style.fontFamily = "monospace";
            console.setAttribute("wrap", "off");
            console.wrap = "off";
            console.style.overflow = "auto";
            console.style.width = "700px";
            console.style.height = "350px";
            console.style.margin = "5px";
            documentForm.appendChild(console);
        }
        console.value += message + "\n";
        console.scrollTop = console.scrollHeight - console.clientHeight;
    } catch(ex) {
        alert("Exception: " + ex.name + " Message: " + ex.message);
    }
};
$register('sohu.tool.SwfUploadLib');
$register('sohu.tool.SwfVersion',
function() {
    sohu.tool.SwfVersion = {
        UNDEF: "undefined",
        OBJECT: "object",
        SHOCKWAVE_FLASH: "Shockwave Flash",
        SHOCKWAVE_FLASH_AX: "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE: "application/x-shockwave-flash",
        nav: navigator,
        hasVersion: function(versionStr) {
            var dv = '9.0.124';
            var pv = this._getSWFVersion();
            if (versionStr) {
                v = versionStr.split(".");
            } else {
                v = dv.split(".");
            }
            v[0] = parseInt(v[0], 10);
            v[1] = parseInt(v[1], 10) || 0;
            v[2] = parseInt(v[2], 10) || 0;
            var flag = (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true: false;
            return flag;
        },
        _getSWFVersion: function() {
            var w3cdom = typeof document.getElementById != this.UNDEF && typeof document.getElementsByTagName != this.UNDEF && typeof document.createElement != this.UNDEF,
            playerVersion = [0, 0, 0],
            d = null;
            if (typeof this.nav.plugins != this.UNDEF && typeof this.nav.plugins[this.SHOCKWAVE_FLASH] == this.OBJECT) {
                d = this.nav.plugins[this.SHOCKWAVE_FLASH].description;
                if (d && !(typeof this.nav.mimeTypes != this.UNDEF && this.nav.mimeTypes[this.FLASH_MIME_TYPE] && !this.nav.mimeTypes[this.FLASH_MIME_TYPE].enabledPlugin)) {
                    d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                    playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                    playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                    playerVersion[2] = /r/.test(d) ? parseInt(d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
                }
            } else if (typeof window.ActiveXObject != this.UNDEF) {
                var a = null,
                fp6Crash = false;
                try {
                    a = new ActiveXObject(this.SHOCKWAVE_FLASH_AX + ".7");
                }
                catch(e) {
                    try {
                        a = new ActiveXObject(this.SHOCKWAVE_FLASH_AX + ".6");
                        playerVersion = [6, 0, 21];
                        a.AllowScriptAccess = "always";
                    }
                    catch(e) {
                        if (playerVersion[0] == 6) {
                            fp6Crash = true;
                        }
                    }
                    if (!fp6Crash) {
                        try {
                            a = new ActiveXObject(this.SHOCKWAVE_FLASH_AX);
                        }
                        catch(e) {}
                    }
                }
                if (!fp6Crash && a) {
                    try {
                        d = a.GetVariable("$version");
                        if (d) {
                            d = d.split(" ")[1].split(",");
                            playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                        }
                    }
                    catch(e) {}
                }
            }
            return playerVersion;
        }
    };
});