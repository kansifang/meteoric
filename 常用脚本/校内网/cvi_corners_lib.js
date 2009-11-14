var cvi_corners = {

	addVMLNamespace: function() {
		var e=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","roundrect","oval","rect","arc","image"];
		var s=document.createStyleSheet(); 
		for(var i=0; i<e.length; i++) {s.addRule("v\\:"+e[i],"behavior: url(#default#VML);");}
		document.namespaces.add("v","urn:schemas-microsoft-com:vml");
	},

	add: function(image, options) {
		if(image.tagName.toUpperCase() != "IMG") return;
		var options = { "xradius" : 6, "yradius" : 6}
		try {
			if(document.all && document.namespaces && !window.opera) {
				if(document.namespaces.v==null) {
					this.addVMLNamespace();
				}
				var display = (image.currentStyle.display.toLowerCase()=='block')?'block':'inline-block';        
				var canvas = document.createElement(['<var style="zoom:1;overflow:hidden;display:' + display + ';width:' + 50 + 'px;height:' + 50 + 'px;padding:0;">'].join(''));
				var flt =  image.currentStyle.styleFloat.toLowerCase();
				display = (flt=='left'||flt=='right')?'inline':display;
				canvas.options = options;
				canvas.dpl = display;
				canvas.id = image.id;
				canvas.alt = image.alt;
				canvas.title = image.title;
				canvas.source = image.src;
				canvas.className = image.className;
				canvas.style.cssText = image.style.cssText;
				canvas.height = 50;
				canvas.width = 50;
				canvas.iWidth = image.width;
				canvas.iHeight = image.height;
				image.parentNode.replaceChild(canvas,image);
				cvi_corners.modify(canvas, options);
			} else if (navigator.userAgent.indexOf("Chrome") != -1) {
				var canvas = document.createElement("div");
				canvas.id = image.id;
				canvas.title = image.title;
				canvas.source = image.src;
				canvas.className = image.className;
				canvas.style.cssText = image.style.cssText;
				canvas.style.background = "url(" + image.src + ") no-repeat center center";
				canvas.style.WebkitBorderRadius = "6px";
				canvas.style.width = "50px";
				canvas.style.height = (image.height > 50? 50 : image.height) + "px";
				image.parentNode.replaceChild(canvas, image);
			} else {
				var canvas = document.createElement('canvas');
				if(canvas.getContext("2d")) {
					canvas.options = options;
					canvas.id = image.id;
					canvas.alt = image.alt;
					canvas.title = image.title;
					canvas.source = image.src;
					canvas.className = image.className;
					canvas.style.cssText = image.style.cssText;
					image.parentNode.replaceChild(canvas,image);
					cvi_corners.modify(canvas, options);
				}
			}
			} catch (e) {
			}
		},

		modify: function(canvas, options) {
			try {
				var xradius = options['xradius'];
				var yradius = options['yradius'];
				xradius = Math.min(parseInt(canvas.width/2),xradius); yradius = Math.min(parseInt(canvas.height/2),yradius);
				if(xradius>0 && yradius==0) yradius = Math.min(parseInt(canvas.height/2),xradius);
				if(yradius>0 && xradius==0) xradius = Math.min(parseInt(canvas.width/2),yradius);
				canvas.options['xradius'] = xradius;
				canvas.options['yradius'] = yradius;
				if(document.all && document.namespaces && !window.opera) {
					if(canvas.tagName.toUpperCase() == "VAR") {
						var path = "m 0," + yradius; var display = canvas.dpl;
						path += " l 0," + (canvas.height-yradius) + " qy " + xradius + "," + canvas.height;
						path += " l " + (canvas.width-xradius) + "," + canvas.height + " qx " + canvas.width + "," + (canvas.height-yradius);
						path += " l " + canvas.width + "," + yradius + " qy " + (canvas.width-xradius) + ",0";
						path += " l " + xradius + ",0 qx 0," + yradius;
						path += " x e";
						canvas.innerHTML = '<v:shape stroked="f" strokecolor="#0000FF" filled="t" fillcolor="#ffffff" coordorigin="0,0" coordsize="' + canvas.width + ',' + canvas.height + '" path="' + path + '" style="zoom:1;margin:-1px 0 0 -1px;padding: 0;display:' + display + ';width:' + canvas.width + 'px;height:' + (canvas.iHeight >= canvas.height? canvas.height : canvas.iHeight) + 'px;"><v:fill src="' + canvas.source + '" ' + 'origin="0.5,0.5" position="0.5,0.5" style="" type="tile" /></v:shape>';
				}
			}else {
				if(canvas.tagName.toUpperCase() == "CANVAS" && canvas.getContext("2d")) {
					var context = canvas.getContext("2d");
					canvas.height = 50;
					canvas.width = 50;
					var img = new Image();
					img.onload = function() {
						canvas.height=(img.height >= 50)? 50 : img.height;
						canvas.width=50;
						context.clearRect(0,0,canvas.width,canvas.height);
						context.save();
						context.beginPath();
						context.moveTo(0,yradius);
						context.lineTo(0,canvas.height-yradius);context.quadraticCurveTo(0,canvas.height,xradius,canvas.height);
						context.lineTo(canvas.width-xradius,canvas.height);context.quadraticCurveTo(canvas.width,canvas.height,canvas.width,canvas.height-yradius);
						context.lineTo(canvas.width,yradius);context.quadraticCurveTo(canvas.width,0,canvas.width-xradius,0);
						context.lineTo(xradius,0);context.quadraticCurveTo(0,0,0,yradius);
						context.closePath();
						context.clip();
						context.fillStyle = 'rgba(0,0,0,0)';
						context.fillRect(0,0,canvas.width,canvas.height);
						if (img.height > img.width) {
							context.drawImage(img,0,parseInt((img.height-50)/2),canvas.width,canvas.height,0,0,50,50);
						} else {
							context.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
						}
						context.restore();
					}
					img.src = canvas.source;
				}
			}
		} catch (e) {
		}
	}
}
