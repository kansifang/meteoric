function EaseMove(time,from,to){
	var f1=Multinomial(1,time/2);
	var f2=Multinomial(1,-time/2);
	var f3=Multinomial["*"](f1,f2);
	//alert([f3(-500),f3(500)]);

	var f4=Multinomial.integral(f3);

	var range=f4(time/2)-f4(-time/2);
	return function (x){
		return (f4(x-time/2)-f4(-time/2))*(to-from)/range+from;
	}
}
EaseMove=Currying(EaseMove);