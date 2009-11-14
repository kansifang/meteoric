core.web.remote = {
	ajax : {
		HttpRequest : null,
		AjaxProxy : null
	}
}

with(core.web.remote.ajax)
{
	HttpRequest = function(){
		var _req = $try(
			  function() {return new ActiveXObject('Msxml2.XMLHTTP')},
			  function() {return new ActiveXObject('Microsoft.XMLHTTP')},
			  function() {return new XMLHttpRequest()}
			) || null;
		return _req;
	}

	AjaxProxy = function(url, async, charset, user, password){
		core.events.EventManager.call(this);
		this.url = url;
		this.async = async || true;
		this.charset = charset || "utf-8";
		this.user = user || null;
		this.password = password || null;
		this._req = new HttpRequest();
		if(this.async){ 
			var $pointer = this;
			this._req.onreadystatechange = function()
			{	
				switch($pointer._req.readyState)
				{
					case 0:
						$pointer.dispatchEvent("uninitialized", {req:$pointer._req, readyStateText:"Uninitialized"});
						break;
					case 1:
						var evt = {req:$pointer._req, readyStateText:"Loading"};
						evt.defaultOp = function(){
							$pointer.lock = true;
						}
						$pointer.dispatchEvent("loading", evt);
						break;
					case 2:
						$pointer.dispatchEvent("onloaded", {req:$pointer._req, readyStateText:"Loading"});
						break;
					case 3:
						$pointer.dispatchEvent("loaded", {req:$pointer._req, readyStateText:"Loaded"});
						break;
					case 4:
						var evt = {req:$pointer._req, readyStateText:"Loading"};
						evt.defaultOp = function(){
							$pointer.lock = false;
						}
						$pointer.dispatchEvent("complete", evt);
				}
			}
		}
	}
	AjaxProxy.prototype.send = function(method, data, provider){
		if(this.lock) return;
		method = method || "GET";
		var url = this.url;
		if(data && provider) data = provider(data);
		if(data && method == "GET"){
			url = url.indexOf("?") != -1 ? url + "&" + data : url + "?" + data;
		}
		this._req.open(method, url, this.async, this.user, this.password);
		this._req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset="+this.charset);
		if(data){
			this._req.send(data);
		}
		else this._req.send();
	}

	AjaxProxy.prototype.post = function(data){
		this.send("POST", data);
	}

	AjaxProxy.prototype.get = function(data){
		this.send("GET", data);
	}
	AjaxProxy.prototype.postJSON = function(json){
		this.send("POST", data, function(data){
			var ret = [];
			for(var each in data){
				ret.push(encodeURIComponent(each) + "=" + encodeURIComponent(data[each]));
			}
			return ret.join("&");
		});
	}
}