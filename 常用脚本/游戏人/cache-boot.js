/**
 * @author Administrator
 */
-function(){
    var d, ie, st, de, gs, vs, t, s, p;
    vs = "Ucren 4.2.01.090804";
    ie = !!(d = document).all;
    (de = d.documentElement).style.behavior = "url('#default#userData')";
    gs = window.globalStorage;
    p = (s = (s = d.getElementsByTagName("script"))[s.length - 1]).getAttribute("src");
    st = {
        s: function(A, $){
            try {
                if (ie) {
                    de.load(A);
                    de.setAttribute("value", $);
                    de.expires = new Date("12/31/2010").toUTCString();
                    de.save(A)
                }
                else 
                    if (gs) 
                        gs[d.domain][A] = $
            } 
            catch (_) {
            }
        },
        g: function(_){
            try {
                if (ie) {
                    de.load(_);
                    return de.getAttribute("value")
                }
                else 
                    if (gs) 
                        return gs[d.domain][_]
            } 
            catch ($) {
            }
        }
    };
    if (st.g("ucrenVersion") == vs && (t = st.g("ucrenEngine"))) 
        eval("(" + t + ")");
    else 
        !function(){
            d.write("<script type='text/javascript' src='" + p.replace("cache-boot.js", "boot.js") + "'>" + s.innerHTML + "</script>");
            !function(){
                if (typeof(UcrenEngine) == "undefined") 
                    return setTimeout(arguments.callee, 200);
                st.s("ucrenEngine", UcrenEngine);
                st.s("ucrenVersion", Ucren.version);
                UcrenEngine = null
            }()
        }()
}()
