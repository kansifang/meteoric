/**
 * @author Administrator
 */
UI.ProgressBar = function(I){
    var G = this, B = Jsr.extend($(I.id), JTag), H, E, F, C, A = function(A){
        if (/^(100|\d{1,2})%$/.test(A + "")) 
            return A;
        if (/^(1|((\.|0\.)\d{1,2}))$/.test(A + "")) 
            return A * 100 + "%";
        return null
    }, D = function(A){
        H.width = A + "%";
        F && C && (F.innerHTML = C.replace(/@PER@/, H.width));
        E = (function(){
            D(parseInt((100 - A) * (Math.random() * 0.6 + 0.1) / 2) + A)
        }).defer((Math.random() * 17 + 2) * 50)
    };
    G.setPER = function(B){
        (B = A(B)) && (H.width = B)
    };
    G.setWidth = function(A){
        !(/^(\d{1,3}(px)?|(100|\d{1,2})%)$/.test(A + "")) && (A = 180);
        B.setWidth(A)
    };
    G.setGuage = function(A, B){
        F = $(A);
        C = B
    }, G.start = function(){
        !E && D(parseInt(Math.random() * 8) + 2)
    };
    G.stop = function(){
        window.clearTimeout(E);
        E = 0
    };
    G.finish = function(){
        this.stop();
        H.width = "100%";
        F && C && (F.innerHTML = C.replace(/@PER@/, "100%"))
    };
    (G.dom = B).id = Jsr.getTagID();
    B.setHTML("<div class=p-pointer><div></div></div>");
    B.setClass("prgressBar");
    H = B.lastChild.lastChild.style;
    I.style && (H.backgroundPosition = "0 14px");
    G.setPER(A(I.per) || "0%");
    G.setWidth(I.width);
    G = I = null
}
