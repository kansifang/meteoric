/**
 * @author Administrator
 */
-function(){
    var $ = Ucren, $d = document;
    $.RemoteManager = {
        Http: function(){
        },
        ShareHttp: {
            ready: true,
            queue: [],
            init: function(){
                this.http || (this.http = new $.RemoteManager.Http)
            },
            addTask: function(_, $){
                this.init();
                this.queue.push({
                    url: _,
                    fun: $
                });
                this.doQueue()
            },
            doQueue: function(){
                var $;
                this.ready && this.queue.length && ((this.ready = false) || this.http.loadHttp(($ = this.queue.shift()).url, true, function(_){
                    $.fun && $.fun(_);
                    (this.ready = true) && this.doQueue.defer(1, this)
                }.createDelegate(this)))
            }
        },
        remoteCallScript: function(url, asy, callback){
            function evalScript(cb){
                if (cb.responseText.indexOf("<") == 0) 
                    return callback && callback(false);
                eval(cb.responseText);
                callback && callback(true)
            }
            if (asy) 
                $.RemoteManager.ShareHttp.addTask(url, evalScript);
            else 
                evalScript(new $.RemoteManager.Http().loadHttp(url, asy))
        }
    };
    $.extend($.RemoteManager.Http, {
        xmlHttp: function(){
            if (ISIE) {
                for (var A = 0; A < 5; A++) {
                    try {
                        var _ = new ActiveXObject(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "MSXml2.XMLHTTP", "Microsoft.XMLHTTP"][A]);
                        return _
                    } 
                    catch ($) {
                    }
                }
                return false
            }
            else 
                return new XMLHttpRequest()
        },
        xmlDom: function(){
            if (ISIE) {
                for (var A = 0; A < 5; A++) {
                    try {
                        var _ = new ActiveXObject(["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"][A]);
                        return _
                    } 
                    catch ($) {
                    }
                }
                return false
            }
            else 
                if ($d.implementation && $d.implementation.createDocument) 
                    return $d.implementation.createDocument("", "", null)
        },
        loadHttp: function(C, B, A){
            var _;
            (_ = this.dom || (this.dom = this.xmlHttp())).open("GET", C, !!B);
            if (B) {
                _.onreadystatechange = function(){
                    _.readyState == 4 && (_.onreadystatechange = new Function, A(_))
                };
                try {
                    _.send(null)
                } 
                catch ($) {
                    A({}, {
                        type: 404
                    })
                }
            }
            else {
                try {
                    _.send(null)
                } 
                catch ($) {
                    A({}, {
                        type: 404
                    })
                }
                return _.responseText
            }
        },
        abort: function(){
            this.dom && this.dom.abort()
        },
        postData: function(F, E, D, C){
            var B = this.xmlHttp(), A = [];
            B.open("POST", F, E ? true : false);
            B.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            $.each(C, function($, _){
                A.push($ + "=" + encodeURI(_))
            });
            A = A.join("&");
            if (E) {
                B.onreadystatechange = function(){
                    if (B.readyState == 4) 
                        D(B)
                };
                B.send(A)
            }
            else {
                try {
                    B.send(A)
                } 
                catch (_) {
                }
                return B.responseText
            }
        },
        loadXml: function(B, A, _){
            $.RemoteManager.ShareHttp.addTask(B, function(A){
                var $ = A.responseText, B = this.xmlDom();
                B.async = false;
                B.loadXML($);
                _ && _(B)
            }.createDelegate(this))
        }
    });
    var remote = $.RemoteManager;
    $.Http = remote.Http;
    $.remoteCallScript = remote.remoteCallScript
}()
