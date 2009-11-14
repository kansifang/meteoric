-function(){
	Ucren.nameSpace("Ucren.DataManager");
	var JSON=Ucren.DataManager.JSON=new(function(){
		var useHasOwn={}.hasOwnProperty?true:false,
			pad=function($){
				return $<10?"0"+$:$
			},
			m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},
			encodeString=function($){
				if(/["\\\x00-\x1f]/.test($))return"\""+$.replace(/([\x00-\x1f\\"])/g,function(A,$){
					var _=m[$];if(_)return _;_=$.charCodeAt();
					return"\\u00"+Math.floor(_/16).toString(16)+(_%16).toString(16)
				})+"\"";return"\""+$+"\""
			},
			encodeArray=function(B){
				var A=["["],_,D,C=B.length,$;
				for(D=0;D<C;D+=1){
					$=B[D];
					switch(typeof $){
						case"undefined":
						case"function":
						case"unknown":break;
						default:if(_)A.push(",");
						A.push($===null?"null":Ucren.DataManager.JSON.encode($));_=true
					}
				}
				A.push("]");
				return A.join("")
			},
			encodeDate=function($){
				return"\""+$.getFullYear()+"-"+pad($.getMonth()+1)+"-"+pad($.getDate())+"T"+pad($.getHours())+":"+pad($.getMinutes())+":"+pad($.getSeconds())+"\""};
			this.encode=function(B){
				if(typeof B=="undefined"||B===null)return"null";
				else if(B instanceof Array)	return encodeArray(B);
				else if(B instanceof Date)
				return encodeDate(B);
				else if(typeof B=="string")return encodeString(B);
				else if(typeof B=="number")return isFinite(B)?String(B):"null";
				else if(typeof B=="boolean")return String(B);
				else{var A=["{"],_,C,$;
					for(C in B)
						if(!useHasOwn||B.hasOwnProperty(C)){
							$=B[C];
							switch(typeof $){
								case"undefined":
								case"function":
								case"unknown":break;
								default:if(_)A.push(",");
								A.push(this.encode(C),":",$===null?"null":this.encode($));_=true}
						}
						A.push("}");
						return A.join("")
			}};
			this.decode=function(json){
				return eval("("+json+")")
			}
		})();
		Ucren.decode=JSON.decode;Ucren.encode=JSON.encode}();