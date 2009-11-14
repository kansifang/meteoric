/**
 * @author Administrator
 */
UI.StatusBar = function(E){
    var C = this, F, B = {}, D = {}, A = Jsr.extend($(E.id), JTag);
    C.add = function(E, C){
        if (C.dom) {
            A = C.dom.style.cssText;
            C.dom.setStyle("float:left;margin-right:6px;" + A);
            F.appendChild(C.dom);
            B[E] = C
        }
        else {
            (A = $B("div")).style.width = C.width || 120;
            A.className = C.split ? "statusBar-item statusBar-splitLine" : "statusBar-item";
            if (C.icon) 
                A.innerHTML = "<nobr><img src=@A align='absmiddle'/><span></span></nobr>".getString({
                    A: C.icon
                });
            else 
                A.innerHTML = "<nobr><span></span></nobr>";
            B[E] = F.appendChild(A).lastChild.lastChild;
            D[E] = C.text || "\u72b6\u6001\u680f\u9879";
            this.set(E, {})
        }
        A = null
    };
    C.hide = function(C, A){
        $P($P(B[C])).style.display = A ? "none" : ""
    };
    C.set = function(C, A){
        B[C].innerHTML = D[C].getString(A)
    };
    C.get = function(A){
        return B[A]
    };
    (C.dom = A).id = Jsr.getTagID();
    A.setHTML("<div class='statusBar-body font'></div>");
    A.setClass("statusBar");
    F = A.lastChild;
    C = A = null
}
