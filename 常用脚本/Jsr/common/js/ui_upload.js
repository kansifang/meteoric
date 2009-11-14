/**
 * @author Administrator
 */
Jsr.importCss("ui_upload");
UI.Upload = function(B){
    Jsr.extend(this, UI._upload);
    var A = this;
    A.ipts = [];
    A.files = [];
    A.size = B.size || 1;
    A.dom = Jsr.extend($(B.id), JTag);
    A.dom.id = Jsr.getTagID();
    if (!(A.form = $(B.form))) 
        alert("\u8bf7\u4e3aUpload\u63a7\u4ef6\u6307\u5b9a\u8868\u5355ID!");
    A.render(B.name || B.id);
    A = B = null
};
UI._upload = {
    render: function(E){
        var D = this, A = D.dom, B, C;
        A.setHTML("<div class=u-filePanel></div><div class=u-btnBar><div class=u-btnBG><div></div><div></div><div><input type=file size=1 hidefocus=true/></div></div></div>");
        A.className = "border-blur font";
        A.setWidth(260);
        A.setHeight(144);
        D.fileList = A.firstChild;
        D.fileList.style.height = isFF ? 110 : 116;
        C = A.lastChild.lastChild.childNodes;
        (B = C[2].firstChild).name = E;
        D.ipt = B.cloneNode(true);
        C[2].onmouseover = function(){
            this.scrollLeft = 18
        };
        B.onpropertychange = function(){
            if (D.disabled || this.value == "") 
                return false;
            var A = D.files.length;
            if (A == D.size) {
                alert("\u60a8\u6700\u591a\u53ef\u6dfb\u52a0 @size@ \u4e2a\u6587\u4ef6\uff01".replace(/@size@/, D.size));
                A = null;
                return false
            }
            for (var B = 0; B < A; B++) 
                if (this.value == D.files[B].fullName) {
                    alert("\u8bf7\u52ff\u91cd\u590d\u6dfb\u52a0\u76f8\u540c\u6587\u4ef6\uff01");
                    A = null;
                    return false
                }
            D.addFile(this);
            A = null
        };
        B.onclick = function(){
            isFF && this.onpropertychange()
        };
        C[1].onclick = function(){
            if (D.disabled) 
                return false;
            if (D.selectIndex > -1) 
                D.delFile(D.selectIndex);
            else 
                alert("\u8bf7\u5728\u5217\u8868\u4e2d\u6307\u5b9a\u6587\u4ef6!")
        };
        C[0].onclick = function(){
            if (D.disabled) 
                return false;
            if (D.ipts.length < 1) {
                alert("\u65e0\u53ef\u4e0a\u4f20\u7684\u6587\u4ef6\uff01");
                return false
            }
            var A = $P(D.ipts.first());
            D.disabled = A.removeChild(A.firstChild);
            A = null;
            D.SB && D.SB();
            D.form.submit()
        };
        A = B = C = E = null
    },
    addFile: function(B){
        var C = this, A = $B("div"), D = B.value.match(/^(.+\\)(.+)/);
        A.innerHTML = "<nobr>@name@</nobr>".replace(/@name@/, D[2]);
        A.title = "\u6587\u4ef6\u4f4d\u7f6e - " + D[1];
        A.fullName = D[0];
        A.index = C.files.length;
        C.files.push(C.fileList.appendChild(A));
        A.onmousedown = function(){
            C.selectIndex > -1 && (C.files[C.selectIndex].className = "");
            C.selectIndex = this.index;
            this.className = "u-curow";
            C.FB && C.FB(this.fullName)
        };
        A = $P(B).insertBefore(C.ipt.cloneNode(true), B);
        A.onclick = B.onclick;
        A.onpropertychange = B.onpropertychange;
        C.ipts.push(B);
        A = D = B = B.onclick = B.onpropertychange = null
    },
    delFile: function(){
        var C = this, B = C.selectIndex;
        C.fileList.removeChild(C.files[B]);
        C.files.remove(B);
        $P(C.ipts[B]).removeChild(C.ipts[B]);
        C.ipts.remove(B);
        for (var A = 0; A < C.files.length; A++) 
            C.files[A].index = A;
        C.selectIndex = -1;
        C.DB && C.DB();
        C = B = null
    },
    reset: function(){
        if (!this.disabled) 
            return false;
        var B = this, A = $P(B.ipts.first());
        A.innerHTML = "";
        B.fileList.innerHTML = "";
        B.ipts.clear();
        B.files.clear();
        A.appendChild(B.disabled);
        B.selectIndex = -1;
        B.disabled = false;
        B = A = btn = null
    },
    onDelFile: function(A){
        this.DB = A
    },
    onFileClick: function(A){
        this.FB = A
    },
    onSubmit: function(A){
        this.SB = A
    }
}
