/**
 * @author Administrator
 */
Ucren.Import("net.Ajax");
Ucren.XmlOperator = function($){
    $ = $ ||
    {};
    this.onLoad = $.onLoad || null
};
Ucren.extend(Ucren.XmlOperator, {
    xmlDom: null,
    loaded: false,
    load: function(_){
        var $;
        $ = new Ucren.Http;
        this.loaded = false;
        $.loadXml(_, true, function($){
            this.xmlDom = $;
            this.loaded = true;
            this.onLoad && this.onLoad()
        }
.createDelegate(this))
    },
    getRoot: function(){
        if (!this.loaded) 
            return null;
        return this.xmlDom.documentElement || this.xmlDom
    },
    query: function(_){
        if (!this.loaded) 
            return null;
        var $ = this.getRoot();
        return $.selectNodes(_)
    },
    toDataVessArray: function(C){
        if (!this.loaded) 
            return null;
        var A = [], $ = [];
        $ = this.query("/*/*");
        if (ISIE) {
            for (var B = 0; B < $.length; B++) {
                A[B] = [];
                for (var _ = 0; _ < C.length; _++) 
                    A[B][_] = $[B].selectSingleNode(C[_]).text
            }
        }
        else 
            for (B = 0; B < $.length; B++) {
                A[B] = [];
                for (_ = 0; _ < C.length; _++) 
                    A[B][_] = $[B].selectSingleNode(C[_]).textContent
            }
        return A
    },
    toJSON: function(){
        return function(){
            if (!this.loaded) 
                return null;
            var _;
            _ = this.getRoot();
            function A(_){
                var A, B, C, $ = 0;
                A = _.getAttribute("type");
                if (A) 
                    return A;
                B = _.childNodes;
                for (var D = 0; D < B.length; D++) {
                    if (B[D].nodeName == "#text") 
                        continue;
                    if (C && C == B[D].nodeName) 
                        return "array";
                    else 
                        if (C && C != B[D].nodeName) 
                            return "object";
                    C = B[D].nodeName;
                    $++
                }
                return $ ? "object" : "string"
            }
            function $(_){
                if (!_ || !_.nodeName) 
                    return undefined;
                var B, D = null;
                B = A(_);
                switch (B) {
                    case "string":
                        D = _.text || _.textContent;
                        break;
                    case "number":
                    case "boolean":
                        D = Ucren.decode(_.text || _.textContent);
                        break;
                    case "object":
                        D = {};
                        var C = _.childNodes;
                        for (var E = 0; E < C.length; E++) {
                            if (C[E].nodeName == "#text") 
                                continue;
                            D[C[E].nodeName] = $(C[E])
                        }
                        break;
                    case "array":
                        D = [];
                        C = _.childNodes;
                        for (E = 0; E < C.length; E++) {
                            if (C[E].nodeName != "item") 
                                continue;
                            D[D.length] = $(C[E])
                        }
                        break
                }
                return D
            }
            return $(_)
        }
    }()
})
