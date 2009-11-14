var Conf = {};
function Queue(A){
    var E = new Array(A);
    var D = this;
    var F = A;
    var C = 0;
    var B = -1;
    D.push = function(H){
        B++;
        if (B == F) {
            B = 0
        }
        E[B] = H;
        return B
    };
    D.set = function(H, I){
        E[H] = I;
        return H
    };
    D.get = function(H){
        return E[H || B]
    };
    D.go = function(){
        B++;
        if (B == F) {
            B = 0
        }
        return E[B]
    };
    D.back = function(){
        var H = B;
        if (B == 0) {
            B = F
        }
        B--;
        return E[H]
    }
}

var g_pop = null;
function g_close_pop(){
    g_pop.close()
}

function space(A){
    if (A == "begin") {
        var B = document.getElementById("ft");
        if (typeof(B) != "undefined" && B != null) {
            B.id = "ft_popup"
        }
        B = document.getElementById("usrbar");
        if (typeof(B) != "undefined" && B != null) {
            B.id = "usrbar_popup"
        }
        Conf.menu.sudo(["hideMenu", {
            status: true
        }])
    }
    else {
        if (A == "end") {
            var B = document.getElementById("ft_popup");
            if (typeof(B) != "undefined" && B != null) {
                B.id = "ft"
            }
            B = document.getElementById("usrbar_popup");
            if (typeof(B) != "undefined" && B != null) {
                B.id = "usrbar"
            }
            Conf.menu.sudo(["hideMenu", {
                status: false
            }])
        }
    }
}

Conf.history = new (function(){
    var B = -1;
    var H = 0;
    var F = 20;
    var A = 0;
    var E = 0;
    var D = null;
    var C = this;
    C.init = function(I){
        F = I;
        D = new Queue(I)
    };
    C.add = function(I){
        D.push(I);
        if (A < F) {
            A++
        }
        E = 0
    };
    C.checkBack = function(){
        return A > 0
    };
    C.checkGo = function(){
        return E > 0
    };
    C.back = function(){
        if (A == 0) {
            return false
        }
        var I = D.back();
        if (!I) {
        }
        switch (I[1][0]) {
            case "mod":
            case "mods":
            case "layout":
                Conf.mods.doAction(I[1]);
                break;
            case "css":
                Conf.css.doAction(I[1]);
                break;
            default:
                Conf.mix.doAction(I[1])
        }
        A--;
        E++;
        return A != 0
    };
    C.go = function(){
        if (E == 0) {
            return false
        }
        var I = D.go();
        if (!I) {
        }
        switch (I[0][0]) {
            case "mod":
            case "mods":
            case "layout":
                Conf.mods.doAction(I[0]);
                break;
            case "css":
                Conf.css.doAction(I[0]);
                break;
            default:
                Conf.mix.doAction(I[0])
        }
        A++;
        E--;
        return E != 0
    }
})();
Conf.view = new (function(){
    var D = this;
    var C = window.G;
    D.useLayout = function(K){
        D.hiddenSome();
        var J = C("modtd_0", "modtd_1", "modtd_2", "modtd_3", "modtd_4");
        var L = Conf.mods.getColumns(K);
        for (var I = 0; I < 5; I++) {
            J[I].className = "c" + L + "t" + (I + 1) + " lay" + K + "td" + I
        }
        D.showSome()
    };
    D.delMod = function(I){
        C(I).style.display = "none";
        return false
    };
    D.moveMod = function(K, I){
        var J = C(I);
        J.parentNode.insertBefore(C(K), J);
        J = null
    };
    D.addMod = function(M, K){
        var I = C(M);
        var L = C(K);
        if (I) {
            if (I.id == L.id) {
            }
            else {
                L.parentNode.insertBefore(I, L)
            }
            I.style.display = "";
            M = I.id.replace(/\D/g, "");
            if (M) {
                var J = Sys.I("bos" + M);
                if (J) {
                    J.onResize()
                }
            }
            I = null
        }
        else {
            L.insertAdjacentHTML("beforeBegin", H(M).join(""));
            Conf.drag.add(M)
        }
        L = null;
        I = null
    };
    var A = null;
    D.alert = function(L){
        var I = 350;
        var K = 120;
        var J = "\u4fdd\u5b58\u4fee\u6539";
        A = new Popup({
            contentType: 2,
            isReloadOnClose: false,
            width: I,
            height: K
        });
        A.setContent("title", J);
        A.setContent("contentHtml", '<div style="font-size: 14px; padding-left: 15px; padding-top: 10px;">' + L + "</div>");
        A.build();
        A.show();
        return A
    };
    D.showPop = function(){
        A.show()
    };
    D.closePop = function(){
        A.close()
    };
    D.getPop = function(){
        var I = 350;
        var K = 120;
        var J = "\u63d0\u793a";
        A = new Popup({
            contentType: 1,
            isReloadOnClose: false,
            width: I,
            height: K
        });
        A.setContent("someHiddenEle", "start,usrbar");
        A.setContent("title", J);
        A.setContent("contentUrl", "");
        A.build();
        return A
    };
    D.useCss = function(J, K, L, I){
        D.useBg(K, L, I);
        var M = Session.spaceURL + "/css/item/" + J + ".css";
        C("userCssLink").href = M
    };
    D.useBg = function(J, K, I){
        return;
        if (!J) {
            C("stage").style.background = "none"
        }
        else {
            var L = "";
            if (I == 0) {
                L = " no-repeat scroll center center"
            }
            C("stage").style.background = "url(" + K + ")" + L
        }
    };
    function H(K){
        var J = Conf.data.getMod(K).title;
        var I = ["<div id='", K, "' class='mod' rel='drag'>        <table id='", K, "_t' width='100%' border='0' cellspacing='0' cellpadding='0' class='modth modhandle' title='\u70b9\u4f4f\u9f20\u6807\u5de6\u952e\u4e0d\u653e\uff0c\u53ef\u79fb\u52a8\u8be5\u6a21\u5757'>            <tr><td class='modtl' width='7'>&nbsp;</td>                <td class='modtc' nowrap>                    <div class='modhead'><span class='modtit'>", J, "</span></div>                </td>                <td id='", K, "_td1' class='modtc' width='100%' nowrap align='center'>                    <div class='modopt'><img src='http://img.baidu.com/hi/img/handle.gif' border='0'></div>                </td>                <td  class='modtc' width='38px;' nowrap align='right' >                    <a id='", K, "_td3' href='#' title='\u6536\u8d77'><img src='http://img.baidu.com/hi/img/min.gif' border='0'></a>                    <a id='", K, "_td4' href='#' title='\u5c55\u5f00' style='display:none;'><img src='http://img.baidu.com/hi/img/max.gif' border='0'></a>                    <a id='", K, "_td2' href='#' title='\u5220\u9664'><img src='http://img.baidu.com/hi/img/close.gif' border='0'></a>                </td>                <td class='modtr' width='7'>&nbsp;</td>            </tr>        </table>        <div class='modbox'>            <div>\u4fdd\u5b58\u540e\u4f1a\u751f\u6548</div>        </div>    </div>"];
        return I
    }
    D.toggleMod = function(L, M){
        L = C(L);
        var N = L.childNodes;
        for (var K = 0, I = N.length; K < I; K++) {
            if (N[K].nodeType == 1 && "modbox" == N[K].className) {
                break
            }
        }
        var J = "";
        var O = "none";
        if (1 === M) {
            J = "none";
            O = ""
        }
        else {
            J = "";
            O = "none"
        }
        N[K].style.display = J;
        C(L.id + "_td3").style.display = J;
        C(L.id + "_td4").style.display = O;
        return false
    };
    var F = ["object", "embed"];
    var E = [];
    D.hiddenSome = function(){
        for (var I = 0; I < F.length; I++) {
            B(F[I])
        }
    };
    function B(L){
        var P = document.getElementsByTagName(L);
        if (P != null) {
            var N;
            for (var K = 0, J = P.length, O; K < J; K++) {
                O = P[K];
                if (L == "embed" && O.parentNode.tagName.toLowerCase() == "object") {
                    O.style.display = "none";
                    E.push(P[K]);
                    continue
                }
                if (O.style.display != "none" && O.style.visibility != "hidden") {
                    N = C("mulitMediaSample");
                    N = N.cloneNode(false);
                    O.parentNode.insertBefore(N, O);
                    var M = O.width;
                    var I = O.height;
                    if (M != "") {
                        if (/^\d+$/.test(M)) {
                            M = M + "px"
                        }
                        N.style.width = M
                    }
                    if (I != "") {
                        if (/^\d+$/.test(I)) {
                            I = I + "px"
                        }
                        N.style.height = I
                    }
                    N.style.display = "";
                    O.style.display = "none";
                    E.push(O)
                }
            }
            O = null;
            N = null;
            P = null
        }
    }
    D.showSome = function(){
        var L;
        for (var J = 0, I = E.length; J < I; J++) {
            L = E[J];
            var K = L.previousSibling;
            if (K && K.className == "none") {
                L.parentNode.removeChild(K)
            }
            L.style.display = ""
        }
        L = null;
        K = null;
        E.length = 0
    }
})();
Conf.mods = new (function(){
    var D = null;
    var J = Conf.history;
    var M = this;
    var L = null;
    M.BLOG = -1;
    M.FRIEND = -2;
    M.PHOTO = -3;
    M.NOW = -4;
    var P = null;
    var K = null;
    var H = {};
    M.init = function(T, S, Q, R){
        D = new Queue(Q);
        P = [T, S];
        D.set(M.NOW, P);
        K = P;
        D.set(M.BLOG, R[0]);
        D.set(M.FRIEND, R[1]);
        D.set(M.PHOTO, R[2])
    };
    M.getDragList = function(){
        var S = K[1].slice();
        for (var R = 0, Q = M.getColumns(); R < Q; R++) {
            S[R] = S[R].slice();
            S[R].push("mod_bottom" + R)
        }
        return S
    };
    M.getLayout = function(Q){
        if (Q == null) {
            return K[0]
        }
        else {
            return D.get(Q)[0]
        }
    };
    M.getList = function(Q){
        if (Q == null) {
            return K[1]
        }
        else {
            return D.get(Q)[1]
        }
    };
    M.getState = function(Q){
        if (Q == null) {
            return K
        }
        else {
            return D.get(Q)
        }
    };
    M.getColumns = function(R){
        if (R == null) {
            R = K[0]
        }
        var Q = 3;
        if (R == 0) {
            Q = 1
        }
        else {
            if (R <= 3) {
                Q = 2
            }
        }
        return Q
    };
    M.add = function(W, V){
        var T = K[1];
        if (("," + T.toString() + ",").indexOf("," + W + ",") > -1) {
            return false
        }
        var Q = T[0].length + T[1].length + T[2].length;
        if (!V) {
            V = [0, 0]
        }
        var S = T.slice();
        S[V[0]] = S[V[0]].slice();
        S[V[0]].splice(V[1], 0, W);
        var U = [K[0], S];
        var R = D.push(U);
        J.add([["mod", "add", {
            id: W,
            to: V,
            state: U
        }, "mod"], ["mod", "del", {
            id: W,
            state: K
        }]]);
        N(W, M.getModId(V));
        K = U
    };
    function N(R, Q){
        Conf.menu.sudo(["addMod", {
            id: R
        }]);
        Conf.view.addMod(R, Q)
    }
    M.getModId = function(R, Q){
        if (!Q) {
            Q = K[1]
        }
        return Q[R[0]][R[1]] || ("mod_bottom" + R[0])
    };
    M.del = function(Q, X){
        var Y = K[1];
        if (("," + Y.toString() + ",").indexOf("," + Q + ",") == -1) {
            return false
        }
        if (!X) {
            for (var U = 0; U < 3; U++) {
                for (var T = 0, W = Y[U].length; T < W; T++) {
                    if (Y[U][T] == Q) {
                        X = [U, T];
                        U = 3;
                        break
                    }
                }
            }
        }
        var R = Y.slice();
        R[X[0]] = R[X[0]].slice();
        R[X[0]].splice(X[1], 1);
        var S = [K[0], R];
        var V = D.push(S);
        J.add([["mod", "del", {
            id: Q,
            state: S
        }], ["mod", "add", {
            id: Q,
            to: X,
            state: K
        }]]);
        I(Q);
        K = S
    };
    function I(Q){
        Conf.view.delMod(Q);
        Conf.menu.sudo(["delMod", {
            id: Q
        }])
    }
    M.move = function(W, V, U){
        var S = K[1];
        var R = S.slice();
        R[V[0]] = R[V[0]].slice();
        R[V[0]].splice(V[1], 1);
        R[U[0]] = R[U[0]].slice();
        R[U[0]].splice(U[1], 0, W);
        var T = [K[0], R];
        var Q = D.push(T);
        J.add([["mod", "mov", {
            id: W,
            to: U,
            state: T
        }], ["mod", "mov", {
            id: W,
            to: V,
            state: K
        }]]);
        K = T;
        Conf.menu.sudo(["update"])
    };
    function E(R, Q){
        Conf.view.moveMod(R, Q)
    }
    M.use = function(R){
        var Q = D.get(R);
        if (Q == K) {
            return
        }
        B(Q);
        J.add([["mods", "use", {
            state: Q
        }], ["mods", "use", {
            state: K
        }]]);
        K = Q
    };
    function B(R){
        var V = K[1];
        for (var T = 0; T < 3; T++) {
            for (var S = 0, Q = V[T].length; S < Q; S++) {
                Conf.view.delMod(V[T][S])
            }
        }
        Conf.view.useLayout(R[0]);
        V = R[1];
        var U = [[], [], []];
        for (T = 0; T < 3; T++) {
            for (S = 0, Q = V[T].length; S < Q; S++) {
                Conf.view.addMod(V[T][S], M.getModId([T, S], U));
                U[T].push(V[T][S])
            }
        }
        Conf.menu.sudo(["update", {
            mods: U,
            layout: R[0]
        }])
    }
    M.useLayout = function(S){
        if (S == K[0]) {
            return
        }
        var R = F(S);
        var T = [S, R];
        var Q = D.push(T);
        J.add([["layout", "use", {
            layout: S,
            state: T
        }], ["mods", "use", {
            id: Q,
            state: K
        }]]);
        K = T
    };
    function F(V){
        var R = K[1];
        var Z = [R[0].slice(), R[1].slice(), R[2].slice()];
        var X = [0, 0, 0];
        Conf.view.useLayout(V);
        Conf.menu.sudo(["update", {
            layout: V
        }]);
        for (var U = 0, W = M.getColumns(); U < W; U++) {
            if (C[V][U] == "0") {
                var T = true
            }
            else {
                T = false
            }
            for (var S = 0, Q = R[U].length; S < Q; S++) {
                var Y = R[U][S];
                var a = O(V, Y, U);
                if (a != U && !(T && a == 0)) {
                    Conf.view.moveMod(Y, M.getModId([a, 0], Z));
                    Z[U].splice(X[U] + S, 1);
                    Z[a].unshift(Y);
                    X[U]--;
                    X[a]++
                }
                else {
                    if (T) {
                        Conf.view.moveMod(Y, M.getModId([0, 0], Z));
                        Z[U].splice(X[U] + S, 1);
                        Z[0].unshift(Y);
                        X[U]--;
                        X[0]++
                    }
                    else {
                    }
                }
            }
        }
        return Z
    }
    M.doAction = function(R){
        switch (R[0]) {
            case "mod":
                switch (R[1]) {
                    case "add":
                        N(R[2].id, M.getModId(R[2].to));
                        break;
                    case "del":
                        I(R[2].id);
                        break;
                    case "mov":
                        var Q = R[2].to.slice();
                        Q[1]++;
                        E(R[2].id, M.getModId(Q, R[2].state[1]));
                        break
                }
                break;
            case "mods":
                B(R[2].state);
                break;
            case "layout":
                F(R[2].layout);
                break
        }
        K = R[2].state
    };
    M.checkChange = function(){
        return P != K
    };
    M.save = function(){
        var Q = Conf.css.getBg();
        if (K != P || Q.chg) {
            var R = Conf.data.transToIds(K[1]);
            var S = {
                spLayoutID: K[0],
                spBgURL: Q.bg,
                spBgMode: Q.mode,
                mods: R
            };
            Conf.commit.mods(S);
            return false
        }
        return true
    };
    var C = new Array(6);
    C[0] = ["100%", "0", "0"];
    C[1] = ["76%", "24%", "0"];
    C[2] = ["24%", "76%", "0"];
    C[3] = ["50%", "50%", "0"];
    C[4] = ["24%", "52%", "24%"];
    C[5] = ["20%", "40%", "40%"];
    var A = {
        mod_profile: [6, [0, 1, 0, 0, 0, 0]],
        mod_board: [10, [0, 0, 1, 1, 1, 2]],
        mod_bloglist: [1, [0, 0, 1, 1, 1, 2]],
        mod_aboutme: [30, [0, 0, 1, 1, 1, 2]],
        mod_flaShow: [27, [0, 0, 1, 1, 1, 2]],
        mod_album: [2, [0, 0, 1, 1, 1, 2]]
    };
    function O(R, Q, S){
        if (A[Q]) {
            return A[Q][1][R]
        }
        else {
            return S
        }
    }
})();
Conf.css = new (function(){
    var C = null;
    var H = Conf.history;
    var D = this;
    D.NOW = -1;
    var B = "";
    var A = "";
    var F = "";
    var I = "";
    D.init = function(N, K, L, J, M){
        C = new Queue(J);
        C.set(D.NOW, N);
        B = K;
        A = L;
        I = M;
        F = N
    };
    D.use = function(J){
        if (J == I) {
            return
        }
        E(J);
        H.add([["css", "use", {
            cid: J
        }], ["css", "use", {
            cid: I
        }]]);
        I = J
    };
    function E(J){
        var K = true;
        if (D.checkChange(J) || B == "") {
            K = false
        }
        Conf.view.useCss(J, K, B, A);
        Conf.menu.sudo(["update", {
            css: J
        }])
    }
    D.updateBg = function(K){
        var J = K;
        if (!J || B == "") {
            J = false
        }
        Conf.view.useBg(J, B, A)
    };
    D.get = function(J){
        if (J == D.NOW) {
            return F
        }
        else {
            return I
        }
    };
    D.save = function(){
        if (D.checkChange()) {
            var J = {
                spCssID: I
            };
            Conf.commit.useCss(J);
            return false
        }
        else {
            return true
        }
    };
    D.checkChange = function(J){
        J = J || I;
        if (J == F) {
            return false
        }
        var K = Cache.getTpl_cnt(J);
        return !K || !K.isHostCur
    };
    D.getBg = function(){
        if (D.checkChange() && B != "") {
            return {
                chg: true,
                bg: "",
                mode: "0"
            }
        }
        else {
            return {
                chg: false,
                bg: B,
                mode: A
            }
        }
    };
    D.doAction = function(J){
        switch (J[1]) {
            case "use":
                E(J[2].cid);
                break
        }
        I = J[2].cid
    }
})();
Conf.mix = new (function(){
    var A = this;
    var B = Conf.history;
    A.init = function(){
    };
    A.use = function(){
        if (!Conf.mods.checkChange() && !Conf.css.checkChange()) {
            return
        }
        var E = {
            state: Conf.mods.getState(),
            cid: Conf.css.get()
        };
        var D = {
            state: Conf.mods.getState(Conf.mods.NOW),
            cid: Conf.css.get(Conf.css.NOW)
        };
        C(D);
        B.add([["mix", "use", {
            s: D
        }], ["mix", "use", {
            s: E
        }]])
    };
    function C(D){
        Conf.mods.doAction(["mods", "use", {
            state: D.state
        }]);
        Conf.css.doAction(["css", "use", {
            cid: D.cid
        }])
    }
    A.doAction = function(D){
        switch (D[1]) {
            case "use":
                C(D[2].s);
                break
        }
    }
})();
Conf.drag = new (function(){
    var b = {};
    var l = null;
    var L = "";
    var P = {
        last: [0, 0],
        cur: [0, 0]
    };
    var U = 0;
    var S = 0;
    var g = 0;
    var e = 0;
    var N = 0;
    var M = 0;
    var B = ["object", "", ""];
    var d = [];
    var E = null;
    var A = null;
    var I = 0;
    var X = 0;
    var f = null;
    var Z = "sampleDivForDrag";
    var W = false;
    var K = 0;
    var J = null;
    var m = this;
    var Y = window.G;
    m.add = function(p){
        var n = p + "_t";
        b[n] = p;
        Y(n).onmousedown = O;
        Y(p + "_td2").onclick = function(){
            Conf.mods.del(p);
            return false
        };
        Y(p + "_td2").onmousedown = Q;
        Y(p + "_td3").onclick = function(){
            Conf.view.toggleMod(p, 1);
            return false
        };
        Y(p + "_td3").onmousedown = Q;
        Y(p + "_td4").onclick = function(){
            Conf.view.toggleMod(p, 0);
            return false
        };
        Y(p + "_td4").onmousedown = Q
    };
    function O(u){
        u = u || window.event;
        var q = u.which || u.button;
        if (q != 1) {
            return
        }
        L = this.id;
        l = Y(b[L]);
        g = u.clientX;
        e = u.clientY;
        if (typeof u.pageX == "undefined") {
            var v = Fe.body();
            u.pageX = u.clientX + v.scrollLeft;
            u.pageY = u.clientY + v.scrollTop
        }
        var t = l;
        N = 0;
        M = 0;
        while (t) {
            N += t.offsetLeft;
            M += t.offsetTop;
            t = t.offsetParent
        }
        N = u.pageX - N;
        M = u.pageY - M;
        Conf.view.toggleMod(l, 1);
        var n = l.offsetWidth;
        var r = l.offsetHeight;
        I = r;
        f = Y("sampleDivForDrag");
        f.style.height = r + "px";
        l.parentNode.replaceChild(f, l);
        f.style.display = "";
        A = Y("fordrag");
        E = "sampleDivForDrag";
        A.innerHTML = "";
        A.appendChild(l);
        A.style.display = "";
        A.style.width = n + "px";
        c();
        J = window.setInterval(F, 10);
        var v = Fe.body();
        U = g + v.scrollLeft - N;
        S = e + v.scrollTop - M;
        K = 0;
        W = false;
        A.style.left = U + "px";
        A.style.top = S + "px";
        V(U, S);
        document.body._bak_onselectstart = document.body.onselectstart;
        document.body.onselectstart = Q;
        var s = Y(L);
        s._bak_onmousedown = s.onmousedown;
        s.onmousedown = null;
        s = null;
        document.attachEvent("onmousemove", a);
        document.attachEvent("onmouseup", D);
        if (typeof A.setCapture != "undefined") {
            A.setCapture()
        }
        Conf.view.hiddenSome();
        return false
    }
    function D(w){
        w = w || window.event;
        var t = w.which || w.button;
        if (t != 1) {
            return
        }
        window.clearInterval(J);
        document.body.onselectstart = document.body._bak_onselectstart;
        document.body._bak_onselectstart = null;
        Y(L).onmousedown = Y(L)._bak_onmousedown;
        K = 0;
        W = false;
        if (typeof A.releaseCapture != "undefined") {
            A.releaseCapture()
        }
        document.detachEvent("onmousemove", a);
        document.detachEvent("onmouseup", D);
        A.style.display = "none";
        f.parentNode.replaceChild(l, f);
        f.style.display = "none";
        A.parentNode.insertBefore(f, A);
        Conf.view.toggleMod(l, 0);
        var v = l.id, n = v.replace(/\D/g, "");
        if (n > 10000) {
            var q = Sys.I("bos" + n);
            if (q) {
                q.onResize()
            }
        }
        var y;
        var x;
        var p = Conf.mods.getDragList();
        p[P.last[0]].splice([P.last[1]], 1);
        for (var s = 0; s < 3; s++) {
            for (var r = 0, u = p[s].length; r < u; r++) {
                if (p[s][r] == E) {
                    P.cur = [s, r];
                    u = 0;
                    s = 3
                }
            }
        }
        if (P.last[0] != P.cur[0] || P.last[1] != P.cur[1]) {
            Conf.mods.move(v, P.last, P.cur)
        }
        else {
        }
        f = null;
        A = null;
        E = null;
        l = null;
        Conf.view.showSome();
        w.returnValue = false
    }
    function R(n){
    }
    function C(n){
    }
    function F(){
        if (!W) {
            return
        }
        var s = Fe.body();
        var r = s.scrollLeft;
        var q = s.scrollTop;
        var n = s.viewHeight;
        if (K === 0) {
            if (e < 50) {
                K = -10
            }
            else {
                if (e > (n - 50)) {
                    K = 10
                }
                else {
                    return
                }
            }
        }
        var p = K;
        if (K > 0 && (q + n + K) >= X) {
            p = X - q - n;
            W = false;
            K = 0
        }
        else {
            if (K < 0 && (q + K) <= 0) {
                p = 0 - q;
                W = false;
                K = 0
            }
        }
        S += p;
        V(U, S);
        A.style.top = S + "px";
        window.scrollBy(0, p)
    }
    function V(p, n){
        var x = h(p, n);
        if (x != Z && x !== E) {
            E = x;
            var w = Y(E);
            w.parentNode.insertBefore(f, w);
            for (var u = 0, v = T.length; u < v; u++) {
                var r = T[u];
                var q = r.dom, s, y;
                y = q.offsetTop;
                s = q.offsetLeft;
                q = q.offsetParent;
                y += q.offsetTop;
                s += q.offsetLeft;
                r.x = T._layoutOffset.left + s;
                r.y = T._layoutOffset.top + y
            }
            q = null
        }
    }
    function a(n){
        n = n || window.event;
        g = n.clientX;
        e = n.clientY;
        var p = Fe.body();
        if (typeof n.pageX == "undefined") {
            n.pageX = n.clientX + p.scrollLeft;
            n.pageY = n.clientY + p.scrollTop
        }
        U = n.pageX - N;
        S = n.pageY - M;
        K = 0;
        X = p.documentHeight;
        W = (S > 0 && (I + S) < X) ? true : false;
        A.style.left = U + "px";
        A.style.top = S + "px";
        V(U, S);
        n.returnValue = false
    }
    function H(q, n, p){
        this.id = q;
        this.x = n || 0;
        this.y = p || 0;
        this.dom = Y(q)
    }
    var T = [];
    function c(){
        var n = Y("layout").rows[0], AD = n.cells, s = 0, v = 0, z = 0, y = 0, r = 0, AC = 0;
        while (n) {
            v += n.offsetTop;
            s += n.offsetLeft;
            n = n.offsetParent
        }
        var AA = Conf.mods.getDragList();
        T.length = 0;
        T._layoutOffset = {
            left: s,
            top: v
        };
        for (var w = 0; w < 3; w++) {
            var q = AA[w];
            for (var u = 0, x = q.length, AB; u < x; u++) {
                AB = Y(q[u]);
                if (true) {
                    var p = AB;
                    AC = p.offsetTop;
                    r = p.offsetLeft;
                    p = p.offsetParent;
                    AC += p.offsetTop;
                    r += p.offsetLeft;
                    if (AB.id == l.id) {
                        P.last = [w, u];
                        T.push(new H("sampleDivForDrag", r + s, AC + v))
                    }
                    else {
                        T.push(new H(AB.id, r + s, AC + v))
                    }
                }
            }
        }
        p = null;
        AB = p;
        AD = p
    }
    function h(q, p){
        var r = 0;
        var u = Z;
        if (T.length > 0) {
            u = T[0].id;
            var t = Math.pow((q - T[0].x), 2) + Math.pow((p - T[0].y), 2);
            for (var s = 1, n = T.length; s < n; s++) {
                r = Math.pow((q - T[s].x), 2) + Math.pow((p - T[s].y), 2);
                if (t > r) {
                    u = T[s].id;
                    t = r
                }
            }
        }
        return u
    }
    function Q(n){
        n = n || window.event;
        n.returnValue = false;
        n.cancelBubble = true;
        return false
    }
})();
Conf.track = new (function(){
    var B = false;
    var A = "";
    this.init = function(C){
        B = C;
        A = encodeURIComponent(Session.pageURL)
    };
    this.send = function(C){
        if (B) {
            new Image().src = "http://hi.baidu.com/sys/statlog/1.gif?m=" + C + "&v=" + A + "&t=" + Math.random()
        }
    }
})();
Conf.commit = new (function(){
    var C = this;
    var E = "submitform";
    C.mods = function(J){
        var M = ["\u62b1\u6b49\uff0c\u4e3b\u9875\u6bcf\u5217\u6700\u591a\u653e\u7f6e16\u4e2a\u6a21\u5757\uff0c\u8bf7\u8c03\u6574\u540e\u518d\u4fdd\u5b58\u3002", "\u62b1\u6b49\uff0c\u4e3a\u4e86\u4fdd\u8bc1\u9875\u9762\u6d4f\u89c8\u901f\u5ea6\uff0c\u4e3b\u9875\u6700\u591a\u653e\u7f6e31\u4e2a\u975e\u7cfb\u7edf\u6a21\u5757\uff0c\u8bf7\u8c03\u6574\u540e\u518d\u4fdd\u5b58\u3002"];
        var Q = "<br><br><span style='margin-left:130px;'><input type='button' onclick='Conf.view.closePop();' value='\u5173\u95ed' /></span>";
        var P = J.mods;
        if (P[0].length > 16 || P[1].length > 16 || P[2].length > 16) {
            Conf.view.alert(M[0] + Q);
            Conf.commit.postError(1, true);
            return
        }
        var O = 0;
        for (var K = 0; K < 3; K++) {
            for (var I = 0, N = P[K].length; I < N; I++) {
                if (P[K][I] > 10000) {
                    O++
                }
            }
        }
        if (O > 31) {
            Conf.commit.postError(1, true);
            Conf.view.alert(M[1] + Q);
            return
        }
        if (Conf.ini.tracker) {
            var F = Conf.mods.getState();
            var H = "";
            if (F == Conf.mods.getState(Conf.mods.BLOG)) {
                H = "modify_spmodules_blogstyle"
            }
            else {
                if (F == Conf.mods.getState(Conf.mods.PHOTO)) {
                    H = "modify_spmodules_albumstyle"
                }
                else {
                    if (F == Conf.mods.getState(Conf.mods.FRIEND)) {
                        H = "modify_spmodules_snsstyle"
                    }
                }
            }
            if (H) {
                Conf.track.send(H)
            }
        }
        var L = ["<input type='hidden' name='echoback' value='1'>                    <input type='hidden' name='ct' value='5'>                    <input type='hidden' name='cm' value='3'>                    <input type='hidden' name='bdstoken' value='", Conf.ini.bdstoken, "'>                    <input type='hidden' name='spLayoutID' value='", J.spLayoutID, "'>                    <input type='hidden' name='spBgURL' value='", J.spBgURL, "'>                    <input type='hidden' name='spBgMode' value='", J.spBgMode, "'>"];
        var I = 0;
        for (I = 0; I < P[0].length; I++) {
            L.push("<input type='hidden' name='lmod" + I + "' value='" + P[0][I] + "'>")
        }
        L.push("<input type='hidden' name='lmod" + (I) + "' value='" + 0 + "'>");
        for (I = 0; I < P[1].length; I++) {
            L.push("<input type='hidden' name='mmod" + I + "' value='" + P[1][I] + "'>")
        }
        L.push("<input type='hidden' name='mmod" + (I) + "' value='" + 0 + "'>");
        for (I = 0; I < P[2].length; I++) {
            L.push("<input type='hidden' name='rmod" + I + "' value='" + P[2][I] + "'>")
        }
        L.push("<input type='hidden' name='rmod" + (I) + "' value='" + 0 + "'>");
        D(L)
    };
    function D(H){
        var I = G(E);
        I.action = Conf.ini.commit;
        var F = Conf.view.getPop();
        g_pop = F;
        I.target = F.iframeIdName;
        I.innerHTML = H.join("");
        I.submit();
        I = null
    }
    C.useCss = function(H){
        var F = ["<input type='hidden' name='echoback' value='2'>                <input type='hidden' name='ct' value='5'>                <input type='hidden' name='cm' value='9'>                <input type='hidden' name='bdstoken' value='", Conf.ini.bdstoken, "'>                <input type='hidden' name='spCssID' value='", H.spCssID, "'>                <input type='hidden' name='spRefURL' value='", Session.pageURL, "'>"];
        if (Cache.checkIsTop(H.spCssID)) {
            Conf.track.send("modify_spmodules_directcsssave")
        }
        D(F)
    };
    C.addFavCss = function(H){
        var F = ["<input type='hidden' name='echoback' value='modify'>                <input type='hidden' name='ct' value='5'>                <input type='hidden' name='cm' value='8'>                <input type='hidden' name='bdstoken' value='", Conf.ini.bdstoken, "'>                <input type='hidden' name='spCssID' value='", H.spCssID, "'>                <input type='hidden' name='spRefURL' value='", Session.pageURL, "'>"];
        D(F);
        Conf.view.showPop()
    };
    C.postOK = function(F){
        Conf.menu.sudo(["tip", {
            status: F
        }]);
        if (B.length > 0) {
            setTimeout(A, 300)
        }
        else {
            Conf.track.send("modify_spmodules_success");
            setTimeout(function(){
                window.location.href = Session.spaceURL
            }, 600)
        }
    };
    C.resetFrame = function(){
    };
    C.postError = function(H, F){
        B = [1, 2];
        Conf.menu.sudo(["tip", {
            status: -1
        }]);
        Conf.view.showPop();
        if (!F) {
            Conf.track.send("modify_spmodules_failed")
        }
    };
    C.all = function(){
        Conf.menu.sudo(["tip", {
            status: 0
        }]);
        A()
    };
    var B = [1, 2];
    function A(){
        if (B.length != 0) {
            var F = false;
            var H = B.shift();
            switch (H) {
                case 1:
                    F = Conf.mods.save();
                    break;
                default:
                    F = Conf.css.save()
            }
            if (F) {
                setTimeout(function(){
                    C.postOK(H, true)
                }, 0)
            }
        }
    }
})();
Conf.data = new (function(){
    var E = {
        mod_tuijian_sys: "/sys/file/recmodule?recname=\u7cfb\u7edf\u6a21\u5757",
        mod_tuijian_hot: "/sys/file/recmodule?recname=\u70ed\u70b9\u6a21\u5757"
    };
    var B = {
        tab_tpl_cnt1_listtop: {
            name: "\u7cbe\u54c1\u6a21\u677f",
            url: "/sys/file/sharecss?pageno=0&num=10",
            more: "\u67e5\u770b\u66f4\u591a\u7cbe\u54c1\u6a21\u677f",
            moreurl: "/sys/share/",
            none: "<div style='padding:76px 5px;text-align:left;'>\u6ca1\u6709\u7cbe\u54c1\u6a21\u677f</div>"
        },
        0: {}
    };
    var C = {};
    var I = {};
    var F = {};
    var H = {};
    var J = {};
    var A = {};
    var D = this;
    D.init = function(L, K){
        E.tpl_current = Session.spaceURL + "/brwstat/querycss?cssid=";
        B.tab_tpl_cnt1_listfavo = {
            name: "\u6211\u6536\u85cf\u7684\u6a21\u677f",
            url: Session.spaceURL + "/brwstat/usrchoosecss?pageno=0&num=10",
            more: "\u7ba1\u7406\u6211\u6536\u85cf\u7684\u6a21\u677f",
            moreurl: Session.spaceURL + "/modify/sptempl",
            none: "<div style='padding:76px 5px;text-align:left;'>\u60a8\u8fd8\u6ca1\u6709\u6536\u85cf\u6a21\u677f</div>"
        }, B.tab_tpl_cnt1_listmake = {
            name: "\u6211\u5236\u4f5c\u7684\u6a21\u677f",
            url: Session.spaceURL + "/brwstat/usrmakecss?pageno=0&num=10",
            more: "\u7ba1\u7406\u6211\u5236\u4f5c\u7684\u6a21\u677f",
            moreurl: Session.spaceURL + "/modify/spcrtempl",
            none: "<div style='padding:76px 5px;text-align:left;'>\u60a8\u8fd8\u6ca1\u6709\u5236\u4f5c\u6a21\u677f</div>"
        };
        for (i in L) {
            J[L[i][0]] = {
                id: L[i][1],
                title: L[i][2]
            }
        }
        for (i in L) {
            A[L[i][1]] = {
                name: L[i][0],
                title: L[i][2]
            }
        }
        D.init_tplcat(K)
    };
    D.init_mods_used = function(N){
        for (var P = 0, K = N.length; P < K; P++) {
            for (var M = 0, L = N[P].length; M < L; M++) {
                if (typeof C[N[P][M]] == "undefined") {
                    C[N[P][M]] = N[P][M];
                    var O = Conf.data.getMod(N[P][M]).id;
                    I[O] = O
                }
            }
        }
    };
    D.init_tuijian_sys = function(K){
        for (i in K) {
            if (typeof A[i] != "undefined") {
                if (typeof I[i] == "undefined") {
                    F[A[i].name] = {
                        id: K[i].id,
                        title: K[i].title
                    }
                }
            }
            else {
                if (i > 10000) {
                    F["mod_" + K[i].id] = {
                        id: K[i].id,
                        title: K[i].title
                    };
                    D.addMod(["mod_" + K[i].id, K[i].id, K[i].title])
                }
                else {
                }
            }
        }
    };
    D.init_tuijian_hot = function(K){
        for (i in K) {
            if (typeof A[i] != "undefined") {
                if (typeof I[i] == "undefined") {
                    H[A[i].name] = {
                        id: K[i].id,
                        title: K[i].title
                    }
                }
            }
            else {
                if (i > 10000) {
                    H["mod_" + K[i].id] = {
                        id: K[i].id,
                        title: K[i].title
                    };
                    D.addMod(["mod_" + K[i].id, K[i].id, K[i].title])
                }
                else {
                }
            }
        }
    };
    D.init_tplcat = function(M){
        var L = [""];
        L.push('<a id="tab_tpl_cnt1_listtop" href="#">\u7cbe\u54c1\u6a21\u677f</a>');
        for (var O = 0, K = M.length; O < K; O++) {
            var N = "tab_tpl_cnt1_list" + M[O].id;
            if (typeof B[N] == "undefined") {
                B[N] = {
                    name: "\u7cbe\u54c1\u6a21\u677f",
                    more: "\u67e5\u770b\u66f4\u591a&gt;&gt;",
                    moreurl: M[O].more,
                    url: "/sys/file/hotcsstag?tagid=" + M[O].id + "&pageno=0&num=10",
                    none: "<div style='padding:76px 5px;text-align:left;'>\u6682\u65f6\u6ca1\u6709\u6a21\u677f</div>"
                };
                L.push('<a id="' + N + '" href="#">' + M[O].name + "</a>")
            }
        }
        L.push('<a id="tab_tpl_cnt1_listmake" style="float: right;" href="#">\u6211\u5236\u4f5c\u7684\u6a21\u677f</a>');
        L.push('<a id="tab_tpl_cnt1_listfavo" style="float: right;" href="#">\u6211\u6536\u85cf\u7684\u6a21\u677f</a>');
        G("mod_tab").innerHTML = L.join("")
    };
    D.getMods_use = function(){
        return mods_use
    };
    D.getMods_tuijian_sys = function(){
        return F
    };
    D.getMods_tuijian_hot = function(){
        return H
    };
    D.getMod = function(K){
        return J[K]
    };
    D.checkInUsed = function(K){
        if ((typeof C[K]) == "undefined") {
            return false
        }
        else {
            return true
        }
    };
    D.checkInUsedById = function(K){
        if ((typeof I[K]) == "undefined") {
            return false
        }
        else {
            return true
        }
    };
    D.transToIds = function(K){
        var Q = new Array(K.length);
        for (var P = 0, N = K.length; P < N; P++) {
            Q[P] = new Array(K[P].length);
            for (var M = 0, L = K[P].length; M < L; M++) {
                var O = J[K[P][M]];
                if (O) {
                    Q[P][M] = O.id
                }
            }
        }
        return Q
    };
    D.transToMods = function(L){
        var N = new Array();
        for (var P = 0, K = L.length; P < K; P++) {
            N[P] = new Array();
            for (var O = 0, M = L[P].length; O < M; O++) {
                N[P][O] = A[L[P][O]].name
            }
        }
        return N
    };
    D.addMod = function(K){
        if (typeof J[K[0]] == "undefined") {
            J[K[0]] = {
                id: K[1],
                title: K[2]
            };
            A[K[1]] = {
                name: K[0],
                title: K[2]
            }
        }
    };
    D.getUrl = function(K){
        return E[K]
    };
    D.getTplCat = function(K){
        return B[K]
    };
    return D
})();
//配置菜单
Conf.menu = new (function(){
    getByteLength = function(K){
        return K.replace(/[^\x00-\xff]/g, "mm").length
    };
    subByte = function(Q, L, K){
        K = K || "";
        if (getByteLength(Q) <= L) {
            return Q
        }
        var S, R, P, M;
        for (var O = Math.floor(L / 2) - 1, N = Q.length; O < N; O++) {
            S = Q.substr(0, O);
            P = getByteLength(S);
            if (P == L) {
                return S + K
            }
            else {
                R = Q.substr(0, O + 1);
                M = getByteLength(R);
                if (P < L && M > L) {
                    return S + K
                }
            }
        }
        return Q
    };
    var I = "";
    var F = "";
    var D = 4;
    var E = {
        tpls: "c_tpls"
    };
    var H = this;
    var C = ["tab_start_btn_tpl", "tab_start_btn_mod", "tab_start_btn_layout"];
    var J = true;
    var A = 16;
    var B = ["lay0", "lay1", "lay2", "lay3", "lay4", "lay5"];
    H.setDoStatus = function(K){
        J = K
    };
    H.getDoStatus = function(){
        return J
    };
    H.init = function(Q){
        Q = Q || "";
        G("start").style.display = "";
        var L = G("t-left").getElementsByTagName("div");
        for (var N = 0, K = L.length; N < K; N++) {
            L[N].onclick = function(){
                Conf.menu.doAction(["initTab", {
                    o: this
                }])
            }
        }
        G("cls-btn").onclick = function(){
            Conf.menu.doAction(["cls", {
                status: G("tab_cnt").style.display
            }])
        };
        G("b_up").onclick = function(){
            Conf.menu.doAction(["cls", {
                status: G("tab_cnt").style.display
            }])
        };
        H.setBack(false);
        G("b_ok").onclick = function(){
            Conf.menu.doAction(["save", {}])
        };
        G("b_cancel").onclick = function(){
            Conf.menu.doAction(["cancel", {}])
        };
        if (Q == "css") {
            H.initTab({
                o: G("tab_1")
            });
            H.cls({
                status: ""
            });
            var P = G("tab_preview_css");
            P.innerHTML = "\u60a8\u6b63\u5728\u9884\u89c8\u6a21\u677f";
            P.style.font = "200 14px/34px arial";
            P.style.color = "red";
            P.onclick = function(){
                Conf.menu.doAction(["clkpre", {
                    id: this.id
                }])
            }
        }
        else {
            if (Q == "mod") {
                H.initTab({
                    o: G("tab_2")
                })
            }
            else {
                H.initTab({
                    o: G("tab_0")
                })
            }
        }
        var M = Fe.body();
        if (M.viewWidth < 856) {
            G("start").style.width = "856px"
        }
        else {
            G("start").style.width = "100%"
        }
        if (Fe.isIE) {
            window.attachEvent("onresize", function(){
                var R = Fe.body();
                if (R.viewWidth < 856) {
                    G("start").style.width = "856px"
                }
                else {
                    G("start").style.width = "100%"
                }
            })
        }
        H.setLeave({
            status: true
        });
        window.onunload = function(){
            var R = Conf.mods.checkChange() || Conf.css.checkChange();
            if (R) {
                Conf.track.send("modify_spmodules_giveup");
                var S = new Date().getTime();
                while ((S + 200) > new Date().getTime()) {
                }
            }
        };
        var O = G("start_over");
        if (O) {
            O.parentNode.removeChild(O)
        }
    };
    H.bindMod = function(){
        _arrs = G("tab_mod_cnt1_list").getElementsByTagName("input");
        for (i = 0, len = _arrs.length; i < len; i++) {
            _arrs[i].onclick = function(){
                Conf.menu.doAction(["chgMod", {
                    o: this
                }])
            }
        }
        _arrs = G("tab_mod_cnt1_list2").getElementsByTagName("input");
        for (i = 0, len = _arrs.length; i < len; i++) {
            _arrs[i].onclick = function(){
                Conf.menu.doAction(["chgMod", {
                    o: this
                }])
            }
        }
    };
    H.callback = function(K){
        switch (K[0]) {
            case "tpls":
                H.tpls(K[1]);
                break;
            case "mod_tuijian_sys":
                H.mod_tuijian_sys(K[1]);
                break;
            case "mod_tuijian_hot":
                H.mod_tuijian_hot(K[1]);
                break;
            case "tpl_current":
                H.tpl_current(K[1]);
                break
        }
    };
    H.tpl_current = function(M){
        var N;
        if (M.id) {
            N = M.id
        }
        else {
            N = Conf.css.get();
            Cache.addTpl_cnt(N, M)
        }
        var O = M.isHostCur;
        var L = [""];
        if (O == 1) {
            L.push("<h2>\u6b63\u5728\u4f7f\u7528\u7684\u6a21\u677f</h2>")
        }
        else {
            L.push("<h2>\u6b63\u5728\u9884\u89c8\u7684\u6a21\u677f</h2>")
        }
        L.push('<div class="cnt" style="position1:relative;zoom:1;">');
        L.push("<div  class=\"cntt\" style=\"position:relative;margin-bottom:4px;\" onmouseover=\"G('tab_tpl_act').style.display='';\" onmouseout=\"G('tab_tpl_act').style.display='none';\" >");
        L.push('<img src="http://hitn.baidu.com' + Session.spaceURL + "/pagetn/item/" + N + '.jpg" width="130" height="98" 1style="border:2px solid green;">');
        L.push('<div id="tab_tpl_act" class="tab_tpl_act" style="display:none;"><a href="#" onclick="Conf.menu.doAction([\'addFav\',{id:\'' + N + "'}])\">\u6536\u85cf\u8be5\u6a21\u677f</a></div>");
        L.push("</div>");
        L.push('<div class="txt" >\u540d\u79f0\uff1a' + M.cssName + "</div>");
        if (O == 1) {
            if (M.cssAuthor.length == 0) {
                L.push('<div class="txt">\u4f5c\u8005\uff1a<a target="_blank" href="' + Session.spaceURL + '">' + Session.userName + "</a></div>")
            }
            else {
                L.push('<div class="txt">\u4f5c\u8005\uff1a<a target="_blank" href="/' + M.spaceURL + '">' + M.cssAuthor + "</a></div>")
            }
        }
        L.push('<div class="txt">\u4f7f\u7528\u4eba\u6570\uff1a<a target="_blank" href="/sys/share/user/' + N + '.css" onclick="Conf.track.send(\'modify_css_share\');">' + M.cssUserNum + "</a></div>");
        if (O == 1) {
        }
        else {
            var K = [-85, -68, 0, -51, -34, -17];
            L.push('<div class="txt" style="position:relative;">\u9002\u7528\u7248\u5f0f\uff1a');
            if (M.cssLayId == -1) {
                L.push("\u6240\u6709\u9002\u7528\u7248\u5f0f")
            }
            else {
                if (M.cssLayId >= 0 && M.cssLayId < 6) {
                    L.push('<div style="background: url(http://img.baidu.com/hi/img/userset/tpl-small.gif) no-repeat scroll ' + K[M.cssLayId] + 'px 0; overflow:hidden;width: 17px;height:18px;position:absolute;right:78;top:0;"></div>')
                }
            }
            L.push("</div>")
        }
        if (M.cssAuthor.length == 0 || M.cssAuthor == Session.userName) {
            L.push('<div class="txt"><a target="_blank" href="' + Session.spaceURL + "/modify/spcss/" + N + '.css/edit?echoback=userset" style="font-weight:bold;">\u7f16\u8f91\u6b64\u6a21\u677f</a></div>')
        }
        else {
            L.push('<div class="txt"><a target="_blank" href="' + Session.spaceURL + "/modify/spcss/" + N + '.css/add?echoback=userset" style="font-weight:bold;">\u521b\u5efa\u65b0\u6a21\u677f</a><span style="color:#BEBEBE">(\u57fa\u4e8e\u6b64\u6a21\u677f)</span></div>')
        }
        L.push("</div></div>");
        G("tab_tpl").style.position = "relative";
        G("tpl_current").style.position = "relative";
        G("tpl_current").innerHTML = L.join("");
        G("tpl_current").style.paddingBottom = "9px"
    };
//=========================================================================单击一个模板，记录至全局的历史管理器================================================//
    H.doAction = function(L){
        if (!H.getDoStatus()) {
            if (L[0] == "chgMod") {
                L[1].o.checked = !L[1].o.checked
            }
            return
        }
        H.setDoStatus(false);
        var K = 0;
        switch (L[0]) {
            case "chgTab":
                H.chgTab(L[1]);
                break;
            case "initTab":
                H.initTab(L[1]);
                break;
            case "cls":
                H.cls(L[1]);
                break;
            case "chgLayout":
                H.chgLayout(L[1]);
                K = 600;
                break;
            case "chgMod":
                H.chgMod(L[1]);
                break;
            case "resetModList_USE":
                H.resetModList_USE(L[1]);
                break;
            case "chgTab_tpl":
                H.chgTab_tpl(L[1]);
                break;
            case "mod_tuijian_sys_chg":
                H.mod_tuijian_sys_chg(L[1]);
                break;
            case "mod_tuijian_hot_chg":
                H.mod_tuijian_hot_chg(L[1]);
                break;
            case "delMod":
                H.delMod(L[1]);
                break;
            case "addMod":
                H.addMod(L[1]);
                break;
            case "update":
                H.update(L[1]);
                break;
            case "doback":
                H.doback(L[1]);
                K = 600;
                break;
            case "useCss":
                H.useCss(L[1]);
                K = 600;
                if (L[1].id == "now") {
                    K = 1000
                }
                break;
            case "doQuick":
                H.doQuick(L[1]);
                K = 600;
                break;
            case "addFav":
                H.addFav(L[1]);
                break;
            case "save":
                H.save(L[1]);
                break;
            case "cancel":
                H.cancel(L[1]);
                break;
            case "clkpre":
                H.clkpre(L[1]);
                break
        }
        if (K > 0) {
            window.setTimeout("Conf.menu.setDoStatus(true)", K)
        }
        else {
            H.setDoStatus(true)
        }
        H.setBack(Conf.history.checkBack());
        if (L[0] != "useCss") {
            H.setBtn(Conf.mods.checkChange() || Conf.css.checkChange())
        }
    };
    H.sudo = function(K){
        switch (K[0]) {
            case "addMod":
                H.addMod(K[1]);
                break;
            case "delMod":
                H.delMod(K[1]);
                break;
            case "update":
                H.update(K[1]);
                break;
            case "tip":
                H.tip(K[1]);
                break;
            case "setLeave":
                H.setLeave(K[1]);
                break;
            case "cls":
                H.cls(K[1]);
                break;
            case "hideMenu":
                H.hideMenu(K[1]);
                break
        }
        H.setBack(Conf.history.checkBack());
        H.setBtn(Conf.mods.checkChange() || Conf.css.checkChange())
    };
    H.doback = function(){
        var K = Conf.history.back()
    };
    H.mod_tuijian_sys = function(K){
        Conf.data.init_tuijian_sys(K);
        H.mod_tuijian_sys_chg()
    };
    H.mod_tuijian_sys_chg = function(){
        var N = [""];
        var M = Conf.data.getMods_tuijian_sys();
        var L = Conf.mods.getList();
        var K = {};
        for (j = 0, len = L.length; j < len; j++) {
            for (k = 0, len2 = L[j].length; k < len2; k++) {
                K[L[j][k]] = L[j][k]
            }
        }
        N.push('<div class="tit2"><a href="#" class="on">\u7cfb\u7edf\u6a21\u5757</a> | <a href="#"  onclick="Conf.menu.doAction([\'mod_tuijian_hot_chg\',{}]);">\u70ed\u70b9\u6a21\u5757</a></div>');
        var O = 0;
        for (i in M) {
            if (O >= A) {
                break
            }
            O++;
            N.push('<div class="pic"><input type="checkbox" id="input_tuijian_' + i + '"');
            if (K[i]) {
                N.push("checked=true")
            }
            var P = 0;
            if (M[i].id < 10000) {
                P = -30 * M[i].id
            }
            N.push('><label for="input_tuijian_' + i + '" style="background-position:0 ' + P + 'px;height:30px;width:100px!important;width:123px;overflow:hidden;">' + subByte(M[i].title, 12, "...") + "</label></div>")
        }
        N.push('<div style="clear:both;text-align:right;padding:5px 10px 0 0;"><a ');
        if (Fe.isIE) {
            N.push("onclick=\"Conf.track.send('modify_widget_share');\"")
        }
        N.push('href="http://act.hi.baidu.com/widget/">\u66f4\u591a\u6a21\u5757&gt;&gt;</a></div>');
        G("tab_mod_cnt1_list2").innerHTML = N.join("");
        H.bindMod()
    };
    H.mod_tuijian_hot = function(K){
        Conf.data.init_tuijian_hot(K);
        H.mod_tuijian_hot_chg()
    };
    H.mod_tuijian_hot_chg = function(){
        var M = [""];
        arrs = Conf.data.getMods_tuijian_hot();
        var L = Conf.mods.getList();
        var K = {};
        for (j = 0, len = L.length; j < len; j++) {
            for (k = 0, len2 = L[j].length; k < len2; k++) {
                K[L[j][k]] = L[j][k]
            }
        }
        M.push('<div class="tit2"><a href="#" onclick="Conf.menu.doAction([\'mod_tuijian_sys_chg\',{}]);">\u7cfb\u7edf\u6a21\u5757</a> | <a href="#" class="on"  >\u70ed\u70b9\u6a21\u5757</a></div>');
        var N = 0;
        for (i in arrs) {
            if (N >= A) {
                break
            }
            N++;
            M.push('<div class="pic"><input type="checkbox" id="input_tuijian_' + i + '"');
            if (K[i]) {
                M.push("checked=true")
            }
            var O = 0;
            if (arrs[i].id < 10000) {
                O = -30 * arrs[i].id
            }
            M.push('><label for="input_tuijian_' + i + '" style="background-position:0 ' + O + 'px;height:30px;width:100px!important;width:123px;overflow:hidden;">' + subByte(arrs[i].title, 12, "...") + "</label></div>")
        }
        M.push('<div style="clear:both;text-align:right;padding:5px 10px 0 0;"><a ');
        if (Fe.isIE) {
            M.push("onclick=\"Conf.track.send('modify_widget_share');\"")
        }
        M.push('href="http://act.hi.baidu.com/widget/">\u66f4\u591a\u6a21\u5757&gt;&gt;</a></div>');
        G("tab_mod_cnt1_list2").innerHTML = M.join("");
        H.bindMod()
    };
    H.tpls = function(M){
        var P = M.o;
        var N = M.len;
        var L = [""];
        Cache.addTpls(I, F, M);
        var O = Conf.data.getTplCat(I);
        if (P.length == 0) {
            L.push(O.none)
        }
        else {
            for (i = 0, len = P.length; i < len; i++) {
                L.push('<div class="pic"><img src="http://hitn.baidu.com' + Session.spaceURL + "/pagetn/item/" + P[i] + '.jpg" width="100" height="75" style="cursor:pointer;" onclick="Conf.menu.doAction([\'useCss\',{cssid:\'' + P[i] + "'}]);\"></div>")
            }
            if (P.length <= 5) {
                L.push('<div style="height: 85px; 1float: left; width: 500px;clear:both;">&nbsp;</div>')
            }
        }
        G("tab_tpl_list").innerHTML = L.join("");
        L.length = 0;
        if (N == 0) {
            if (Conf.data.getTplCat("tab_tpl_cnt1_listfavo").name == O.name || Conf.data.getTplCat("tab_tpl_cnt1_listmake").name == O.name) {
                L.push('<div class="more" style="position:absolute;right:10px;"><a href="' + O.moreurl + '" title="' + O.more + '" ');
                L.push(">" + O.more + "</a></div> &nbsp;")
            }
            else {
                L.push('<div class="more" style="position:absolute;right:10px;">&nbsp;</div>');
                L.push(" &nbsp;")
            }
        }
        else {
            L.push('<div class="more" style="position:absolute;right:10px;"><a href="' + O.moreurl + '" title="' + O.more + '" ');
            if (Conf.data.getTplCat("tab_tpl_cnt1_listfavo").name != O.name && Conf.data.getTplCat("tab_tpl_cnt1_listmake").name != O.name) {
                L.push("onclick=\"Conf.track.send('modify_css_share');\"")
            }
            L.push(">" + O.more + "</a></div>");
            if (N <= 10) {
                L.push("&nbsp;")
            }
            else {
                if (N > 100) {
                    N = 100
                }
                var K = Math.ceil(N / 10);
                for (i = 1; i <= K; i++) {
                    L.push('<a id="tab_tpl_page_' + i + '" href="#" ' + ((F == i) ? 'class="on"' : "") + " onclick=\"Conf.menu.doAction(['chgTab_tpl',{id:'" + I + "',page:" + i + '}])">' + i + "</a> ")
                }
            }
        }
        L.push("");
        G("tab_tpl_page").innerHTML = L.join("")
    };
    H.initTab = function(L){
        switch (L.o.id) {
            case "tab_0":
                G("tab_start_btn_tpl").onclick = function(){
                    Conf.menu.doAction(["initTab", {
                        o: G("tab_1")
                    }])
                };
                G("tab_start_btn_mod").onclick = function(){
                    Conf.menu.doAction(["initTab", {
                        o: G("tab_2")
                    }])
                };
                G("tab_start_btn_layout").onclick = function(){
                    Conf.menu.doAction(["initTab", {
                        o: G("tab_3")
                    }])
                };
                G("start_blog").onclick = function(){
                    Conf.menu.doAction(["doQuick", {
                        id: "blog"
                    }])
                };
                G("start_friend").onclick = function(){
                    Conf.menu.doAction(["doQuick", {
                        id: "friend"
                    }])
                };
                G("start_photo").onclick = function(){
                    Conf.menu.doAction(["doQuick", {
                        id: "photo"
                    }])
                };
                L.o.onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_0")
                    }])
                };
                H.chgTab({
                    o: G("tab_0")
                });
                break;
            case "tab_1":
                H.updateTpl();
                G("tab_start_btn_tpl").onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_1")
                    }])
                };
                var N = G("mod_tab");
                os = N.getElementsByTagName("a");
                for (var M = 0, K = os.length; M < K; M++) {
                    os[M].onclick = function(){
                        Conf.menu.doAction(["chgTab_tpl", {
                            id: this.id,
                            page: 1
                        }])
                    }
                }
                H.chgTab_tpl({
                    id: os[0].id,
                    page: 1
                });
                L.o.onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_1")
                    }])
                };
                H.chgTab({
                    o: G("tab_1")
                });
                break;
            case "tab_2":
                G("tab_start_btn_mod").onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_2")
                    }])
                };
                H.initMods();
                BdAjax.loadJS(Conf.data.getUrl("mod_tuijian_hot"));
                BdAjax.loadJS(Conf.data.getUrl("mod_tuijian_sys"));
                H.bindMod();
                L.o.onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_2")
                    }])
                };
                H.chgTab({
                    o: G("tab_2")
                });
                break;
            case "tab_3":
                G("tab_start_btn_layout").onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_3")
                    }])
                };
                H.updateLayout();
                L.o.onclick = function(){
                    Conf.menu.doAction(["chgTab", {
                        o: G("tab_3")
                    }])
                };
                H.chgTab({
                    o: G("tab_3")
                });
                break
        }
    };
    H.chgTab = function(K){
        var O = K.o;
        for (var M = 0; M < D; M++) {
            id = "tab_" + M;
            var L = "";
            var N = "none";
            if ((O.id == id)) {
                L = "on";
                N = ""
            }
            G(g_tab[M]).className = L;
            G(g_cnt[M]).style.display = N
        }
        H.cls({
            status: "none"
        })
    };
    H.cls = function(K){
        if (K.status == "none") {
            G("start").style.position = "relative";
            G("start").style.height = "298px";
            G("tab_cnt").style.display = "";
            G("cls-btn").style.backgroundPosition = "0 0";
            G("b_up").style.backgroundPosition = "-191px 0";
            G("b_up").title = "\u6536\u8d77"
        }
        else {
            G("start").style.position = "absolute";
            G("start").style.zIndex = "65534";
            G("start").style.height = "49px";
            G("tab_cnt").style.display = "none";
            G("cls-btn").style.backgroundPosition = "-32px 0";
            G("b_up").style.backgroundPosition = "-333px 0";
            G("b_up").title = "\u5c55\u5f00"
        }
    };
    H.chgLayout = function(K){
        Conf.mods.useLayout(K.o.id.replace(/^lay/gi, ""))
    };
    H.chgMod = function(K){
        var L = K.o.id.replace(/^input_use_/gi, "").replace(/^input_tuijian_/gi, "");
        if (K.o.checked) {
            Conf.mods.add(L);
            H.addMod({
                id: L
            })
        }
        else {
            Conf.mods.del(L);
            H.delMod({
                id: L
            })
        }
    };
    H.resetModList_USE = function(L){
        var K = [""];
        for (var M = 0; M < 20; M++) {
            K.push('<div class="pic"><input type="checkbox" id="mod_' + M + '" ><div>\u5ba0\u7269\u4e13\u533a</div></div>')
        }
        K.push('<div style="clear:both;"></div>');
        G("tab_mod_cnt1_list").innerHTML = K.join("");
        H.bindMod()
    };
    H.chgTab_tpl = function(M){
        I = M.id;
        F = M.page;
        var K = G("mod_tab").getElementsByTagName("a");
        for (var L = 0; L < K.length; L++) {
            K[L].className = ""
        }
        G(M.id).className = "on";
        if (o = Cache.getTpls(M.id, M.page)) {
            H.callback(["tpls", o])
        }
        else {
            BdAjax.loadJS(Conf.data.getTplCat(I).url.replace(/pageno\=0/gi, "pageno=" + (F - 1)) + "?t=" + new Date().getTime())
        }
    };
    H.delMod = function(K){
        if (Conf.data.checkInUsed(K.id)) {
            G("input_use_" + K.id).checked = false
        }
        else {
            try {
                G("input_tuijian_" + K.id).checked = false
            } 
            catch (L) {
            }
        }
    };
    H.addMod = function(K){
        if (K == "") {
        }
        if (Conf.data.checkInUsed(K.id)) {
            G("input_use_" + K.id).checked = true
        }
        else {
            try {
                G("input_tuijian_" + K.id).checked = true
            } 
            catch (L) {
            }
        }
    };
    H.update = function(K){
        if (K == null) {
            return
        }
        if (K.layout != null) {
            H.updateLayout(K.layout)
        }
        if (K.mods != null) {
            H.updateMods(K.mods)
        }
        if (K.css != null) {
            H.updateTpl(K.css)
        }
    };
    H.updateLayout = function(L){
        if (L == null) {
            var L = Conf.mods.getLayout()
        }
        for (var M = 0, K = B.length; M < K; M++) {
            var N = G(B[M]);
            N.onclick = function(){
                Conf.menu.doAction(["chgLayout", {
                    o: this
                }])
            };
            if (M == L) {
                N.className = "pic on"
            }
            else {
                N.className = "pic"
            }
        }
    };
    H.updateTpl = function(K){
        if (K == null) {
            K = Conf.css.get()
        }
        if (o = Cache.getTpl_cnt(K)) {
            o.id = K;
            H.callback(["tpl_current", o])
        }
        else {
            BdAjax.loadJS(Conf.data.getUrl("tpl_current") + K)
        }
    };
    H.initMods = function(){
        var M = Conf.mods.getList();
        Conf.data.init_mods_used(M);
        var P = [""];
        for (var O = 0, K = M.length; O < K; O++) {
            for (var N = 0, L = M[O].length; N < L; N++) {
                var Q = Conf.data.getMod(M[O][N]);
                var R = 0;
                if (Q.id < 10000) {
                    R = -30 * Q.id
                }
                P.push('<div class="pic"><input type="checkbox" id="input_use_' + M[O][N] + '" checked="true">');
                P.push('<label for="input_use_' + M[O][N] + '" style="background-position:0 ' + R + 'px">');
                P.push(subByte(Q.title, 12, "..."));
                P.push("</label></div>")
            }
        }
        G("tab_mod_cnt1_list").innerHTML = P.join("")
    };
    H.updateMods = function(P){
        var N = G("tab_mod_cnt1").getElementsByTagName("input");
        for (var O = 0, K = N.length; O < K; O++) {
            N[O].checked = false
        }
        N = G("tab_mod_cnt2").getElementsByTagName("input");
        for (var O = 0, K = N.length; O < K; O++) {
            N[O].checked = false
        }
        for (var O = 0, K = P.length; O < K; O++) {
            for (var M = 0, L = P[O].length; M < L; M++) {
                H.addMod({
                    id: P[O][M]
                })
            }
        }
    };
    H.useCss = function(K){
        Conf.css.use(K.cssid)
    };
    H.setBack = function(L){
        var K = G("b_chexiao");
        if (L) {
            K.title = "\u64a4\u6d88";
            K.style.backgroundPosition = "-138px 0";
            K.style.cursor = "pointer";
            K.disabled = false;
            K.onclick = function(){
                Conf.menu.doAction(["doback"])
            }
        }
        else {
            K.title = "";
            K.style.backgroundPosition = "-350px 0";
            K.style.cursor = "auto";
            K.disabled = true;
            K.onclick = function(){
            }
        }
    };
    H.doQuick = function(K){
        switch (K.id) {
            case "blog":
                Conf.mods.use(Conf.mods.BLOG);
                break;
            case "friend":
                Conf.mods.use(Conf.mods.FRIEND);
                break;
            case "photo":
                Conf.mods.use(Conf.mods.PHOTO);
                break;
            case "now":
                Conf.mix.use(Conf.mods.NOW);
                break
        }
    };
    H.addFav = function(K){
        H.hideMenu({
            status: true
        });
        Cache.delTpls("tab_tpl_cnt1_listfavo");
        Conf.commit.addFavCss({
            spCssID: K.id
        })
    };
    H.tip = function(K){
        var P = K.status;
        var Q = G("tabstart_tip");
        if (P == -1) {
            if (Q != null) {
                Q.style.display = "none"
            }
            H.hideMenu({
                status: true
            });
            H.setLeave({
                status: true
            })
        }
        else {
            if (P >= 0 && P <= 2) {
                H.hideMenu({
                    status: true
                });
                if (Q == null) {
                    Q = document.createElement("div")
                }
                var M = Fe.body();
                var O = 337;
                var R = 56;
                var N = Math.floor((M.viewHeight - R) / 2) + M.scrollTop;
                var L = Math.floor((M.viewWidth - O) / 2) + M.scrollLeft;
                Q.id = "tabstart_tip";
                Q.style.width = O + "px";
                Q.style.height = R + "px";
                Q.style.position = "absolute";
                Q.style.top = N + "px";
                Q.style.left = L + "px";
                Q.style.zIndex = "65535";
                Q.style.background = "url(http://img.baidu.com/hi/img/userset/tip.gif) no-repeat 0 " + (-56 * P) + "px";
                Q.innerHTML = "<div style='margin-left:60px;font: 800 16px/56px arial;color:#000000;'>\u6b63\u5728\u4fdd\u5b58\u60a8\u7684\u8bbe\u7f6e,\u8bf7\u8010\u5fc3\u7b49\u5f85\u54e6!</div>";
                document.body.appendChild(Q);
                if (P == 2) {
                    H.setLeave({
                        status: false
                    });
                    window.onunload = function(){
                    }
                }
            }
            else {
            }
        }
    };
    H.save = function(K){
        if (Conf.mods.checkChange() || Conf.css.checkChange()) {
            H.hideMenu({
                status: true
            });
            Conf.commit.all()
        }
        else {
            window.location = Session.spaceURL
        }
    };
    H.cancel = function(K){
        if (Conf.mods.checkChange() || Conf.css.checkChange()) {
            H.hideMenu({
                status: true
            });
            var L = [""];
            L.push("<div style='height:50px;overflow:hidden;'>\u60a8\u5f53\u524d\u7684\u64cd\u4f5c\u5c1a\u672a\u4fdd\u5b58\uff0c\u662f\u5426\u9700\u8981\u4fdd\u5b58\uff1f</div>");
            L.push("<div style='margin:0 auto;text-align:center;'>");
            L.push("<input type='button' value='\u662f' style='width:48px;' onclick='Conf.menu.sudo([\"setLeave\",{status:false}]);Conf.view.closePop();Conf.commit.all();'>&nbsp;&nbsp;");
            L.push("<input type='button' value='\u5426' style='width:48px;' onclick='Conf.menu.sudo([\"setLeave\",{status:false}]);window.location=Session.spaceURL;'>&nbsp;&nbsp;");
            L.push("<input type='button' value='\u53d6\u6d88' style='width:48px;' onclick='Conf.view.closePop();Conf.menu.sudo([\"hideMenu\",{status:false}]);'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
            L.push("</div>");
            Conf.view.alert(L.join(""));
            return
        }
        else {
            H.setLeave({
                status: true
            });
            window.location = Session.spaceURL
        }
    };
    H.clkpre = function(K){
        G(K.id).innerHTML = "";
        G(K.id).style.display = "none";
        H.cls({
            status: "none"
        })
    };
    H.setBtn = function(L){
        var K = G("start_now");
        if (L) {
            K.style.backgroundPosition = "-207px 0";
            K.style.cursor = "pointer";
            K.disabled = false;
            K.onclick = function(){
                Conf.menu.doAction(["doQuick", {
                    id: "now"
                }])
            }
        }
        else {
            K.style.backgroundPosition = "-403px 0";
            K.style.cursor = "auto";
            K.disabled = true;
            K.onclick = function(){
            }
        }
    };
    H.setLeave = function(K){
        if (K.status) {
            window.onbeforeunload = function(L){
                if (Conf.mods.checkChange() || Conf.css.checkChange()) {
                    L = L || window.event;
                    L.returnValue = "\u60a8\u5f53\u524d\u7684\u64cd\u4f5c\u5c1a\u672a\u4fdd\u5b58\uff0c\u662f\u5426\u653e\u5f03\u4fdd\u5b58\uff1f"
                }
            }
        }
        else {
            window.onbeforeunload = function(L){
            }
        }
    };
    H.hideMenu = function(K){
        if (K.status) {
            G("start").style.display = "none"
        }
        else {
            G("start").style.display = ""
        }
    };
    return H
})();
var Cache = new (function(){
    var C = {};
    var A = {};
    var B = this;
    B.addTpls = function(F, E, D){
        if (!C[F]) {
            C[F] = {}
        }
        if (C[F][E]) {
            return false
        }
        C[F][E] = D
    };
    B.getTpls = function(E, D){
        if (C[E] && C[E][D]) {
            return C[E][D]
        }
        else {
            return false
        }
    };
    B.addTpl_cnt = function(E, D){
        if (!A[E]) {
            A[E] = D
        }
    };
    B.getTpl_cnt = function(D){
        if (A[D]) {
            return A[D]
        }
    };
    B.delTpls = function(E, D){
        if (E != null && D != null) {
            delete C[E][D]
        }
        else {
            if (E != null) {
                delete C[E]
            }
            else {
            }
        }
    };
    B.checkIsTop = function(E){
        if (E == null || C.tab_tpl_cnt1_listtop == null) {
            return false
        }
        for (i in C.tab_tpl_cnt1_listtop) {
            var D = C.tab_tpl_cnt1_listtop[i].o.join(",");
            if (D.indexOf(E) > -1) {
                return true
            }
        }
        return false
    };
    return B
})();
