/**
 * @author Administrator
 */
!(function(){
    var fns=[]; 
    /** 
     * onDomReady 
     */ 
    window.onDomReady = function(fn) { 
        fns.push(fn); 
    } 
    function runFns(){ 
        for(var i=0;i<fns.length;i++){ 
            fns[i](); 
        } 
    } 
    //W3C 
    if(document.addEventListener){ 
        document.addEventListener("DOMContentLoaded", runFns, false); 
    }    
    else { //IE 
        document.onreadystatechange = function(){    
            if(document.readyState == "interactive") 
            { 
                runFns(); 
            } 
        } 
    } 
})();