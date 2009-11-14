/*
requires:functional.js
*/

//����ʽ
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

//����ʽ�˷�����
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

//����ʽ�ӷ�����
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

//����ʽ�ӷ�����
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


//����ʽ��������
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

//����ʽ΢������
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

//������
Multinomial.Constant=function Constant(a)
{
	return multinomial(a);
}

//һ�κ���
Multinomial.Linear=function Linear(a,b)
{
	return multinomial(a,b);
}


//���κ���
Multinomial.Quadratic=function Quadratic(a,b,c)
{
	return multinomial(a,b,c);
}

//���κ���
Multinomial.Cubic=function Cubic(a,b,c,d)
{
	return multinomial(a,b,c,d);
}

//�Ĵκ���
Multinomial.Quartic=function Quartic(a,b,c,d,e)
{
	return multinomial(a,b,c,d,e);
}

//ת��Ϊcurrying��ʽ
Multinomial.Constant=Currying(Multinomial.Constant);
Multinomial.Linear=Currying(Multinomial.Linear);
Multinomial.Quadratic=Currying(Multinomial.Quadratic);
Multinomial.Cubic=Currying(Multinomial.Cubic);
Multinomial.Quartic=Currying(Multinomial.Quartic);
Multinomial["*"]=Currying(Multinomial["*"]);
Multinomial["+"]=Currying(Multinomial["+"]);
Multinomial["-"]=Currying(Multinomial["-"]);

