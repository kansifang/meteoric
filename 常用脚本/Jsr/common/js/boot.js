/**
 * @author Administrator
 */
var JPage = (function(){
    var E = function(B, A){
        B.innerHTML = A;
        B = A = null
    }, I = function(){
        document.body.appendChild(J).className = "L_overlayer";
        E(D, "<div class=L-icon></div><div class=L-caption><nobr><span class=L-text>\u6b63\u5728\u52a0\u8f7d - </span><span style='color:#225588'></span></nobr></div><div class=L-msg></div>");
        document.body.appendChild(D).className = "L_panel";
        document.body.appendChild(H).style.display = "none";
        var A = D.childNodes;
        G = A[1].firstChild.lastChild;
        K = A[2];
        I = A = null
    }, B = function(){
        E(K, "Loading JSR Core API...");
        document.write("<script type='text/javascript' src='@path@common/js/core.js'></script>".replace(/@path@/, A));
        C()
    }, C = function(){
        E(K, "Loading styles and images...");
        var B = ["form/button_bg.gif", "form/calendar_bg.gif", "form/calendar_icon.gif", "form/checkBox.gif", "form/combo_btn.gif", "form/datePicker_btn.gif", "form/invalid_line.gif", "form/radioButton.gif", "form/sliderBar_bg.gif", "form/sliderBar_block.gif", "form/spinner_btn.gif", "form/text_bg.gif", "other/loading.gif", "other/update.gif", "panel/panel-l-r.gif", "panel/panel-t-b.gif", "panel/small_btn.gif", "window/alert.gif", "window/confirm.gif", "window/icon.gif", "window/win_btn.gif", "window/win-l-r.gif", "window/win-t-b.gif"], F = null;
        A += "common/css/abundant/";
        for (var D = 0, C = B.length; D < C; D++) {
            F = H.appendChild(new Image());
            F.src = A + B[D];
            F = null
        }
        E(K, "Initializing...");
        B = A = null
    }, J = document.createElement("div"), D = document.createElement("div"), H = document.createElement("div"), G, K, F, A = document.getElementsByTagName("HEAD")[0].getElementsByTagName("SCRIPT")[0].src.match(/^.*(?=common\/)/i);
    document.write("<meta http-equiv=imagetoolbar content=no>");
    document.write("<link rel='stylesheet' href='@path@common/css/loading.css' type='text/css' media='all'/>".replace(/@path@/, A));
    this.init = function(A){
        I();
        E(G, A);
        B()
    };
    this.finish = function(){
        document.body.removeChild(J);
        document.body.removeChild(D);
        document.body.removeChild(H);
        F && F();
        E = J = D = H = G = K = F = JPage = null
    };
    this.onLoad = function(A){
        F = A
    };
    return this
})()
