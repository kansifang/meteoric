/**
 * @author Administrator
 */
function AJAX(){
    var G = false, K = 0, F = null, E = null, L = null, A = null, I = null, J = null, H = null;
    function B(D, E, A, I){
        var B = null;
        if (window.ActiveXObject) 
            B = new ActiveXObject("Microsoft.XMLHttp");
        else 
            if (window.XMLHttpRequest) 
                B = new XMLHttpRequest();
            else 
                return;
        E += "?aid=" + Math.random().toString().slice(2);
        if (D.toLowerCase() == "get" && A) {
            E += "&" + A;
            A = null
        }
        H = E;
        L = I;
        B.onreadystatechange = function(){
            C.call(B)
        };
        B.open(D, E, true);
        D.toLowerCase() == "post" && B.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        K > 0 && (F = window.setTimeout(function(){
            G = true;
            B.abort()
        }, K));
        B.send(A)
    }
    function C(){
        if (G || (K && this.readyState == 4)) {
            window.clearTimeout(F);
            F = null
        }
        if (G) {
            G = false;
            E();
            return
        }
        if (this.readyState == 4) {
            try {
                switch (this.status) {
                    case 404:
                        alert("\u8bf7\u6c42\u8d44\u6e90\u672a\u627e\u5230\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458");
                        break;
                    case 500:
                        alert("\u670d\u52a1\u5668\u5904\u7406\u9519\u8bef\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458");
                        break;
                    case 200:
                        L.call(this);
                        break;
                    default:
                        alert("\u7f51\u7edc\u8fde\u63a5\u5df2\u65ad\u5f00")
                }
            } 
            catch (A) {
                if (A.name == "NS_ERROR_NOT_AVAILABLE") 
                    return;
                A(A)
            }
        }
    }
    E = function(){
        alert("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5")
    };
    A = function(A){
        window.onerror("AJAX\u6267\u884c\u54cd\u5e94\u56de\u8c03\u5f02\u5e38\n\u539f\u56e0: " + A.name, H, "")
    };
    this.setTimeoutCallBack = function(A){
        E = A
    };
    this.setExceptionCallBack = function(B){
        A = B
    };
    this.setTimeout = function(A){
        K = A
    };
    this.clearTimeout = function(){
        K = 0;
        F = null
    };
    this.get = function(D, C, A){
        B("get", D, C, A)
    };
    this.post = function(D, C, A){
        B("post", D, C, A)
    };
    function D(){
        B(I.method, I.url, I.para, I.func);
        J && window.clearTimeout(J);
        J = window.setTimeout(D, I.time)
    }
    this.setPeriodicalUpdater = function(A){
        I = A
    };
    this.start = function(){
        if (!I || J) 
            return;
        D()
    };
    this.stop = function(){
        if (!J) 
            return;
        window.clearTimeout(J);
        J = null
    };
    this.submitForm = function(G, E){
        var C = $(G);
        if (!C) {
            window.onerror("AJAX.submitForm()\u6267\u884c\u5f02\u5e38\n\u539f\u56e0: FORM\u8868\u5355\u4e0d\u5b58\u5728", window.location, "");
            return
        }
        var I, F, H = null, A = "type=" + C.id;
        for (var D = 0, J = C.length; D < J; D++) {
            H = C[D];
            if (H.type == "button" || !H.value) 
                continue;
            if ("checkboxradio".contain(H.type) && !H.checked) 
                continue;
            A += "&" + H.name + "=" + H.value
        }
        F = C.method || "post";
        I = C.action || "#";
        B(F, I, A, E)
    }
}
