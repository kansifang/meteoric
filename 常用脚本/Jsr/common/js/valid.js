/**
 * @author Administrator
 */
function(A,D){
	var B=A.split(/\D/),
		C=D.replace(/Y/,"\\d{4}");
	C=new RegExp("^"+C.replace(/M|D/g,"\\d{1,2}")+"$");
	if(B.length==3&&C.test(A)){
		/^Y.M.D$/.test(D)&&B.push(B.shift());
		C=new Date(A.replace(/\D/g,"/"));
		if(B[2]==C.getFullYear()&&B[0]==C.getMonth()+1&&B[1]==C.getDate())
			return true
	}
	return false
}