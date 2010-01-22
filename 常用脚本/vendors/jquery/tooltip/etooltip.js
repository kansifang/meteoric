//jquery tooltips ...
//autoload by apeng 08.1.15
if(typeof Eg_etooltip == "undefined"){
	var Eg_etooltip = {
		Version: '0.0.1',
		inc_js:['jquery.bgiframe.js','jquery.dimensions.js','jquery.tooltip.js'],
		inc_css:['jquery.tooltip.css'],
		wr_js: function(libraryName) {
			document.write('<script type="text/javascript" src="'+libraryName+'"><\/script>');
		},
		wr_css: function(libraryName) {
			document.write('<link rel="stylesheet" type="text/css" href="'+libraryName+'" />');
		},
		autoload: function() {
			if(typeof window.jQuery=='undefined'){
				alert("Sorry! Etooltip cann't be load,please load the JQuery lib first!");
				throw("Sorry! Etooltip cann't be load,please load the JQuery lib first!");
			}
			$('script').each(function(){
				var eg_obj = Eg_etooltip;
				if(this.src && this.src.match(/etooltip\.js(\?.*)?$/)){
					var path = this.src.replace(/etooltip\.js(\?.*)?$/,'');
					for(var j=0;j<eg_obj.inc_js.length;j++){
						eg_obj.wr_js(path+eg_obj.inc_js[j]);
					}
					for(var i=0;i<eg_obj.inc_css.length;i++){
						eg_obj.wr_css(path+eg_obj.inc_css[i]);
					}
				}
			});
		}
	}
	Eg_etooltip.autoload();
}