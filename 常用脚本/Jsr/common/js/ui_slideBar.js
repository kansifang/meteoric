/**
 * @author Administrator
 */
Jsr.importCss("ui_sliderPanel");
UI.SliderPanel = function(L){
    var K = this, A, B, H, G = [], I = [], D = -1, C = -1, E, J = "@Acommon/css/abundant/panel/s-icon.gif".getString({
        A: Jsr.appPath
    }), M = function(){
        if (D < 0) 
            return;
        var A = B - G.length * 24;
        G[D].style.height = A > 100 ? A : 100;
        A = null
    };
    K.addGroup = function(B, I){
        var F = H.cloneNode(true), C = F.firstChild;
        C.lastChild.innerHTML = B.text || "\u6ed1\u52a8\u9762\u677f";
        C.firstChild.src = B.icon || J;
        F.index = G.length;
        G.push(C = $B("div"));
        C.style.display = "none";
        !I && D < 0 && (D = 0);
        M();
        A.add(F).className = "sp-groupHead font";
        A.add(C).className = "sp-groupPanel";
        F.onclick = function(){
            if (this.index == D) 
                return false;
            E(this.index)
        };
        F = C = null
    };
    K.addItems = function(B, A){
        if (B < 0 || B >= G.length) 
            return;
        if (A) {
            var E, D;
            A.each(function(A){
                E = H.cloneNode(true);
                D = E.firstChild;
                D.lastChild.innerHTML = A.text || "\u529f\u80fd\u5b50\u9879";
                D.firstChild.src = A.icon || J;
                E.index = I.length;
                E.className = "sp-item font";
                G[B].appendChild(E).acn = A.action;
                I.push(E);
                E.onmouseout = function(){
                    this.index != C && (this.className = "sp-item font")
                };
                E.onmouseover = function(){
                    this.index != C && (this.className = "sp-item font sp-item-over")
                };
                E.onclick = function(){
                    C > -1 && (I[C].className = "sp-item font");
                    C = this.index;
                    this.className = "sp-item font sp-item-focus";
                    this.acn && this.acn(this.firstChild.lastChild.innerHTML)
                }
            });
            E = D = null
        }
    };
    K.addPanel = function(A, B){
        if (A < 0 || A >= G.length) 
            return;
        try {
            G[A].appendChild($(B)).style.display = ""
        } 
        catch (C) {
        }
    };
    K.removeAll = function(){
        A.setHTML("");
        G.clear();
        I.clear();
        D = -1;
        C = -1
    };
    E = K.select = function(A){
        if (A < 0 || A >= G.length) 
            return;
        if (D > -1) {
            G[D].style.display = "none";
            G[A].style.height = G[D].style.height
        }
        G[D = A].style.display = ""
    };
    K.setSize = function(C, D){
        A.style.width = C > 180 ? C : 180;
        A.style.height = B = D > 220 ? D : 220;
        M()
    };
    (K.dom = A = Jsr.extend($(L.id), JTag)).id = Jsr.getTagID();
    (H = $B("div")).innerHTML = "<nobr><img align='absmiddle'/><span unselectable=on></span></nobr>";
    A.setStyle("overflow:hidden");
    H.unselectable = "on";
    if (L.groups) {
        for (var F = 0; F < L.groups.length; F++) 
            K.addGroup(L.groups[F], true);
        K.select(0)
    }
    K.setSize(L.width, L.height);
    K = L = null
}
