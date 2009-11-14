/**
 * @author Administrator
 */
UI.FileInput = function(G){
    var A, H, E, B, D, C = function(){
        H = $(G.id);
        H.id = Jsr.getTagID();
        H.name = G.name || G.id;
        H.size = 1;
        H.hideFocus = true;
        A = this.dom = Jsr.extend($B("div"), JTag);
        (D = $P(H)) && D.insertBefore(A, H);
        F()
    }, F = function(){
        (D = $B("div")).appendChild(H);
        D.className = "f-btnArea";
        B = new UI.Button({
            id: $B("button"),
            caption: "\u6d4f\u89c8...",
            width: 64
        });
        E = new UI.TextField({
            id: $B("input"),
            length: 255
        });
        E.dom.setStyle("float:left;margin-right:5px");
        E.setWidth(G.width);
        E.readOnly(true);
        A.setStyle("overflow:hidden;width:" + ((G.width || 160) + 80));
        (A = A.add($B("div"))).style.width = "800px";
        A.appendChild(E.dom);
        A.appendChild(B.dom);
        A.appendChild(D);
        H.onclick = function(){
            (function(){
                isFF && this.onpropertychange();
                B.focus()
            }).defer(100, this)
        };
        H.onpropertychange = function(){
            E.setValue(this.value)
        };
        D.onmouseover = function(){
            this.scrollLeft = 29;
            B.focus()
        }
    };
    this.getText = function(){
        return E.getValue()
    };
    C();
    A = H = D = G = C = F = null
}
