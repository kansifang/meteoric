/**
 * @author Administrator
 */
UI.Window = function(B){
    Jsr.extend(this, UI.container);
    Jsr.extend(this, UI.winModel);
    Jsr.extend(this, UI._window);
    var A = this;
    B.min = B.min != false;
    B.max = B.max != false;
    A.flash = B.flashed != false;
    A.initCtn({
        id: $B("div"),
        icon: true,
        min: B.min,
        max: B.max,
        close: true
    });
    A.dom.setClass("x-win");
    document.body.appendChild(A.dom);
    A.setSize(B.width || 360, B.height || 260);
    A.center();
    A.dom.iswin = true;
    A.dom.style.display = "none";
    A.dom.tmpBounds = A.dom.bounds;
    A.setCaption(B.caption || "Window");
    Jsr.drag(A.captionBar, A.dom);
    B.min && B.max && Jsr.resize(A.dom, A.body, function(){
        A.refresh()
    });
    onResize.add(function(){
        if (A.isShow && A.dom.status > 1) {
            var D = document.body, B = 200, C = 120;
            D.clientWidth > 200 && (B = D.clientWidth);
            D.clientHeight > 120 && (C = D.clientHeight);
            A._size(B, C);
            A.refresh()
        }
    })
};
UI._window = {
    hide: function(){
        if (!this.isShow) 
            return;
        this._hide()
    },
    show: function(B){
        if (this.isShow) 
            return;
        var E = this, A = E.dom;
        if (A.status > 1) {
            var F = document.body, C = F.clientWidth, D = F.clientHeight;
            if (A.tmpBounds.w != C || A.tmpBounds.h != D) {
                E._size((A.tmpBounds.w = C), (A.tmpBounds.h = D));
                E.resize && E.resize(A.tmpBounds.w + (A.status ? 12 : 0), A.tmpBounds.h - 36)
            }
            F = C = D = null
        }
        E.focus();
        this._show(B);
        E = CB = tmp = null
    },
    focus: function(){
        var A = this.dom.style;
        A.zIndex = Jsr.LayerManager.getzIndex(A.zIndex);
        A = null
    }
};
Jsr.resize = function(H, O, J){
    var L, F, I, B, A, M = {}, P = 200, E = 120, C = isFF ? 4 : 0;
    H.onmousemove = K;
    function K(A){
        if (H.status > 0) 
            return false;
        var B = A || window.event;
        L = B.clientX - H.offsetLeft - (isFF ? 0 : 2);
        F = B.clientY - H.offsetTop - (isFF ? 0 : 2);
        I = "";
        if (F < 5) 
            I += "n";
        else 
            if (F > H.offsetHeight - 6) 
                I += "s";
        if (L < 5) 
            I += "w";
        else 
            if (L > H.offsetWidth - 5) 
                I += "e";
        if (I == "") {
            H.style.cursor = "default";
            H.onmousedown = null
        }
        else {
            H.style.cursor = I + "-resize";
            H.onmousedown = N
        }
    }
    function N(){
        if (I.indexOf("e") > -1) {
            M.w1 = H.offsetLeft + P;
            M.w2 = document.body.clientWidth - C
        }
        if (I.indexOf("s") > -1) {
            M.h1 = H.offsetTop + E;
            M.h2 = document.body.clientHeight - C
        }
        if (I.indexOf("w") > -1) {
            M.w1 = 0;
            M.w2 = H.offsetLeft + H.offsetWidth - P
        }
        if (I.indexOf("n") > -1) {
            M.h1 = 0;
            M.h2 = H.offsetTop + H.offsetHeight - E
        }
        B = H.style;
        B.zIndex = Jsr.LayerManager.getzIndex(B.zIndex);
        A = UI.dragLayer.style;
        A.top = B.top;
        A.left = B.left;
        A.width = H.clientWidth - C;
        A.height = H.clientHeight - C;
        A.cursor = I + "-resize";
        A.display = "";
        H.onmousemove = null;
        if (isIE) 
            UI.dragLayer.setCapture();
        else {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            UI.overLayer.style.MozOpacity = 0;
            UI.overLayer.style.display = ""
        }
        document.onmousemove = G;
        document.onmouseup = D;
        return false
    }
    function D(){
        A = UI.dragLayer;
        B.left = H.bounds.l = A.offsetLeft;
        B.top = H.bounds.t = A.offsetTop;
        B.width = H.bounds.w = A.offsetWidth;
        O.style.height = (H.bounds.h = A.offsetHeight) - 36;
        O.style.width = A.offsetWidth - 12;
        J();
        A.style.display = "none";
        if (isIE) 
            A.releaseCapture();
        else {
            window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            UI.overLayer.style.MozOpacity = 0.2;
            UI.overLayer.style.display = "none"
        }
        document.onmousemove = document.onmouseup = L = F = B = A = null;
        H.onmousemove = K
    }
    function G(B){
        var C = B || window.event;
        L = C.clientX;
        F = C.clientY;
        if (I.indexOf("e") > -1) 
            A.width = L < M.w1 ? P : L > M.w2 ? M.w2 - H.offsetLeft : L - H.offsetLeft;
        if (I.indexOf("s") > -1) 
            A.height = F < M.h1 ? E : F > M.h2 ? M.h2 - H.offsetTop : F - H.offsetTop;
        if (I.indexOf("w") > -1) {
            A.left = L < M.w1 ? M.w1 : L > M.w2 ? M.w2 : L;
            A.width = L < M.w1 ? H.offsetLeft + H.offsetWidth : L > M.w2 ? P : H.offsetLeft + H.offsetWidth - L
        }
        if (I.indexOf("n") > -1) {
            A.top = F < M.h1 ? M.h1 : F > M.h2 ? M.h2 : F;
            A.height = F < M.h1 ? H.offsetTop + H.offsetHeight : F > M.h2 ? E : H.offsetTop + H.offsetHeight - F
        }
    }
}
