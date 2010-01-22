if(typeof ext_setup == "undefined"){
	var ext_setup = '';
	(function(){
		var e_setup = {
			key:'ext_setup.js',
			js:['adapter/jquery/jquery-plugins.js','adapter/jquery/ext-jquery-adapter.js','ext-all.js'],
			css:['resources/css/ext-all.css']
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