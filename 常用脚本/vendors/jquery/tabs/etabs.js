if(typeof eTabs == "undefined"){
	var eTabs = '';
	(function(){
		var e_setup = {
			key:'etabs.js',
			js:['jquery.tabs.js'],
			css:['jquery.tabs.css','jquery.tabs-ie.css']
		};
		$('script').each(function(){
			if(this.src && (this.src.indexOf(e_setup.key) != -1)){
				var path = this.src.replace(e_setup.key,'');
				for(var i=0;i<e_setup.css.length;i++){
					document.write('<link rel="stylesheet" type="text/css" href="'+path+e_setup.css[i]+'" />');
				}
				for(var j=0;j<e_setup.js.length;j++){
					document.write('<script type="text/javascript" src="'+path+e_setup.js[j]+'"><\/script>');
				}
			}
		});
	})();
}