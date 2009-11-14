/*
requires:functional.js
*/

//多项式
function Multinomial()
{
	var args=Array.prototype.slice.call(arguments);
	var r=function(x){
		var i=0,r=0,l=args.length
		while(i<l)
		{
			r*=x;
			r=r+args[i++];
		}
		return r;
	}
	var tmp=function(){};
	tmp.prototype=args;
	r.vector=new tmp();
	return r;
}

//多项式乘法运算
Multinomial["*"]=function(m1,m2){
	var vector=new Array(m1.vector.length+m2.vector.length-1);
	var i=m1.vector.length
	while(i-- > 0)
	{
		var j=m2.vector.length;
		while(j-- > 0)
		{
			if(!vector[i+j])vector[i+j]=0;
			vector[i+j]+=m1.vector[i]*m2.vector[j];
		}
	}
	return Multinomial.apply(this,vector);
}

//多项式加法运算
Multinomial["+"]=function(m1,m2){
	var l1=m1.vector.length,l2=m2.vector.length;
	var vector=new Array(Math.max(l1,l2));
	var i=vector.length,l=i;
	
	while(i-- > 0)
	{
		vector[i]=(m1.vector[l1-l+i]||0)+(m2.vector[l2-l+i]||0);
	}
	return Multinomial.apply(this,vector);
}

//多项式加法运算
Multinomial["-"]=function(m1,m2){
	var l1=m1.vector.length,l2=m2.vector.length;
	var vector=new Array(Math.max(l1,l2));
	var i=vector.length,l=i;
	
	while(i-- > 0)
	{
		vector[i]=(m1.vector[l1-l+i]||0)-(m2.vector[l2-l+i]||0);
	}
	return Multinomial.apply(this,vector);
}


//多项式积分运算
Multinomial.integral=function(m){
	var l=m.vector.length;
	var vector=new Array();
	vector[l]=0;
	for(var i=0;i<l;i++)
	{
		vector[i]=m.vector[i]/(l-i);
	}
	return Multinomial.apply(this,vector);
}

//多项式微分运算
Multinomial.differential=function(m){
	var l=m.vector.length;
	if(l==1)return Constant(0);
	var vector=new Array(l-1);
	for(var i=0;i<l-1;i++)
	{
		vector[i]=m.vector[i]*(l-i-1);
	}
	return Multinomial.apply(this,vector);
}

//常函数
Multinomial.Constant=function Constant(a)
{
	return multinomial(a);
}

//一次函数
Multinomial.Linear=function Linear(a,b)
{
	return multinomial(a,b);
}


//二次函数
Multinomial.Quadratic=function Quadratic(a,b,c)
{
	return multinomial(a,b,c);
}

//三次函数
Multinomial.Cubic=function Cubic(a,b,c,d)
{
	return multinomial(a,b,c,d);
}

//四次函数
Multinomial.Quartic=function Quartic(a,b,c,d,e)
{
	return multinomial(a,b,c,d,e);
}

//转化为currying形式
Multinomial.Constant=Currying(Multinomial.Constant);
Multinomial.Linear=Currying(Multinomial.Linear);
Multinomial.Quadratic=Currying(Multinomial.Quadratic);
Multinomial.Cubic=Currying(Multinomial.Cubic);
Multinomial.Quartic=Currying(Multinomial.Quartic);
Multinomial["*"]=Currying(Multinomial["*"]);
Multinomial["+"]=Currying(Multinomial["+"]);
Multinomial["-"]=Currying(Multinomial["-"]);

