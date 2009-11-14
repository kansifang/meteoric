/**
 * @author Administrator
 */
Jsr.importCss("ui_tabPanel");
UI.TabPanel = function(Y){
    var X = this, M, U, V, Q, E = 0, W, C, G, D, N, L, J, S, O, R = -1, I = [], P, A = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=scale,src='@Acommon/css/abundant/panel/tab_strip_@B.png')", B = function(){
        (X.dom = M = Jsr.extend($(Y.id), JTag)).id = Jsr.getTagID();
        (G = $B("div")).innerHTML = "<div class=tabPanel-btn unselectable=on style='background-position:17px 0'></div><div class=tabPanel-btn unselectable=on></div><div class='tabPanel-s-body font' unselectable=on><div></div></div>";
        U = G.childNodes;
        (S = U[0]).onclick = function(){
            C && K(125, 1)
        };
        (J = U[1]).onclick = function(){
            W && K(125, -1)
        };
        (N = (D = U[2]).firstChild).style.width = "10px";
        M.add(L = $B("div")).className = "tab-panel";
        if (Y.iframe) {
            L.innerHTML = "<iframe src=about:blank width=100% height=100% frameborder=0></iframe>";
            (O = L.lastChild).style.display = "none"
        }
        Y.border != false && M.setClass("tabPanel")
    }, Z = function(A){
        return A < 0 || A >= I.length ? false : true
    }, F = function(A){
        I[A].resize && I[A].resize(V, Q)
    }, T = function(){
        J.style.backgroundPosition = (W = D.scrollLeft != 0) ? "0px 17px" : "0px 0px";
        S.style.backgroundPosition = (C = E - D.scrollLeft + 45 > V) ? "17px 17px" : "17px 0px"
    }, K = function(B, C, A){
        var F, G = function(){
            (F = B -= 8) > 8 && (F = 8);
            D.scrollLeft += F * C;
            if (F < 8) {
                T(E);
                A && A();
                F = G = B = C = A = null
            }
            else 
                G.defer(1)
        };
        G()
    };
    X.addTab = function(B){
        var A = new UI.Tab(B);
        A.dom.index = I.length;
        A.dom.onclick = function(){
            U = this.index;
            if (window.event.srcElement.className == "tab-closed") {
                if (U == I.length - 1 && W) 
                    K(this.offsetWidth + 10, -1, function(){
                        X.removeTab(U)
                    });
                else 
                    X.removeTab(U)
            }
            else 
                X.select(U)
        };
        N.style.width = (E += A.width + 2);
        N.appendChild(A.dom);
        A.panel && (L.appendChild(A.panel).style.display = "none");
        I.push(A);
        T();
        A = B = null
    };
    X.removeTab = function(A, C){
        if (!Z(A)) 
            return false;
        U = I[A];
        N.removeChild(U.dom);
        U.panel && L.removeChild(U.panel);
        if (U.url && R == A) {
            O.src = "about:blank";
            O.style.display = "none"
        }
        N.style.width = (E -= U.width + 2);
        for (var B in U) 
            U[B] = null;
        I.remove(A);
        if (!C) {
            for (B = 0; B < I.length; B++) 
                I[B].dom.index = B;
            if (R == A) {
                R = -1;
                X.select(--A < 0 ? ++A : A)
            }
            else 
                R > A && R--;
            T()
        }
        U = A = C = null
    };
    X.removeAll = function(){
        for (var A = I.length; A >= 0; A--) 
            X.removeTab(A, true);
        T();
        R = -1
    };
    X.select = function(A){
        if (!Z(A) || R == A || I[A].disabled) 
            return false;
        if (R > -1) {
            (U = I[R]).dom.className = "tabPanel-tab";
            U.panel && (U.panel.style.display = "none");
            if (U.url) {
                O.src = "about:blank";
                O.style.display = "none"
            }
        }
        (U = I[A]).dom.className = "tabPanel-tab-focus";
        P && P(U.caption);
        if (U.panel) {
            F(A);
            U.panel.style.display = ""
        }
        if (U.url) {
            O.style.display = "";
            O.src = U.url
        }
        R = A;
        U = A = null
    };
    X.disable = function(A, B){
        if (!Z(A)) 
            return false;
        (U = I[A]).disabled = B;
        U.dom.className = B ? "tabPanel-tab t-dsb" : "tabPanel-tab";
        R == A && (R = -1)
    };
    X.setMode = function(B){
        if (B == "BTM") {
            M.add(G).className = "tabPanel-s-b";
            isIE && (G.style.filter = A.getString({
                A: Jsr.appPath,
                B: "btm"
            }))
        }
        else {
            M.insertBefore(G, L).className = "tabPanel-s-t";
            isIE && (G.style.filter = A.getString({
                A: Jsr.appPath,
                B: "top"
            }))
        }
        T()
    };
    X.setSize = function(A, B){
        !(A > 200) && (A = 200);
        !(B > 120) && (B = 120);
        M.style.height = B;
        V = M.style.width = A;
        Q = L.style.height = B - 27;
        R > -1 && F(R);
        T()
    };
    X.getSelectedTab = function(){
        return Z(R) ? {
            caption: I[R].caption,
            index: R
        } : null
    };
    X.onChange = function(A){
        P = A
    };
    B();
    X.setMode(Y.mode);
    X.setSize(Y.width, Y.height);
    if (Y.tabs) {
        for (var H = 0; H < Y.tabs.length; H++) 
            X.addTab(Y.tabs[H]);
        X.select(0)
    }
    U = B = Y = null
};
UI.Tab = function(C){
    var B = this, A;
    (B.dom = $B("div")).className = "tabPanel-tab";
    B.dom.innerHTML = "<div class='tabPanel-tab-l tabPanel-tab-s' unselectable=on><div class='tabPanel-tab-r tabPanel-tab-s' unselectable=on><div class=tabPanel-tab-c unselectable=on><div class=tab-closed unselectable=on></div><div class=tab-head><nobr><img align='absmiddle'/><span unselectable=on></span></nobr></div></div></div></div>";
    B.dom.style.width = B.width = C.width > 30 ? C.width : 125;
    A = B.dom.lastChild.lastChild.lastChild;
    !C.closed && (A.firstChild.style.display = "none");
    B.caption = A.lastChild.lastChild.lastChild.innerHTML = C.caption || "Tab\u6807\u7b7e\u9879";
    A = A.lastChild.lastChild.firstChild;
    if (C.icon != false) 
        A.src = C.icon || Jsr.appPath + "common/css/abundant/panel/t-icon.gif";
    else 
        A.style.display = "none";
    B.panel = $(C.panel) || null;
    B.url = !B.panel && C.url || null;
    B.resize = C.resize || null;
    B.disabled = false;
    B = A = C = null
}
