if(typeof Eg_jqchart == "undefined"){
	var Eg_jqchart = {
		Version: '0.0.1',
		inc_js:['chartplugin.js','excanvas.js','wz_jsgraphics.js',
				'chart.js','canvaschartpainter.js','jgchartpainter.js',
				'thickbox.js'],
		inc_css:['canvaschart.css','thickbox.css'],
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
				var eg_obj = Eg_jqchart;
				
				if(this.src && this.src.match(/jqChart\.js(\?.*)?$/)){
					var path = this.src.replace(/jqChart\.js(\?.*)?$/,'');
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
	Eg_jqchart.autoload();
}