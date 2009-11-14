
(function(){if(window.google&&google.gears){return;}
var factory=null;if(typeof GearsFactory!='undefined'){factory=new GearsFactory();}else{try{factory=new ActiveXObject('Gears.Factory');}catch(e){if(navigator.mimeTypes["application/x-googlegears"]){factory=document.createElement("object");factory.style.display="none";factory.width=0;factory.height=0;factory.type="application/x-googlegears";document.documentElement.appendChild(factory);}}}
if(!factory){return;}
if(!window.google){window.google={};}
if(!google.gears){google.gears={factory:factory};}})();