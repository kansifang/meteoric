var APC_gl_url= "http://ftn_getlist.tc.qq.com/gurl.cgi";
var APC_r_url = "http://ftn_getlist.tc.qq.com/rurl.cgi?";
var APC_count = 0;
var APC_idx = new Array();
var APC_task = new Array();

function APC_g_l(){
    var s = document.createElement("script");
    s.id="APC_cgi_ist"; 
    document.getElementsByTagName("head")[0].appendChild(s);
    s.src=APC_gl_url;
}
function apc_CallBack(data){
	var idx=0;
    for(var i in data){
		if(i=="rCount")
		{
			APC_count = data[i];
		}
		else
		{
			APC_idx[idx]=i;
			APC_task[i]=data[i];
			idx++;
		}
    }
	APC_count=idx;
	APC_r_url+="count="+APC_count;
	APC_st(0,0);
	return ;
}
function APC_st(i,t)
{	
	var p=new Image();
	p.idx=i;
	p.st=new Date(); 
	p.t=t;
	p.onload=function(){APC_r_ok(this.idx,this.st,this.t)};
	p.onerror=function(){APC_r_err(this.idx,this.st,this.t)}; 
	p.src=APC_task[APC_idx[i]]+"?"+Math.random();
}
function APC_r_ok(i,st,t)
{
	var data=new Date();
	var tm=data.getTime()-st.getTime();
	APC_r_url+="&r"+i+"="+APC_idx[i]+","+tm+",0";
	if(i<APC_count-1)
		APC_st(i+1,0);
	else
	{
		APC_Rpt(APC_r_url);
	}
}
function APC_r_err(i,st,t)
{
	var data=new Date();
	var tm=data.getTime()-st.getTime();
	APC_r_url+="&r"+i+"="+APC_idx[i]+","+tm+",1";
	if(i<APC_count-1)
		APC_st(i+1,0);
	else
	{
		APC_Rpt(APC_r_url);
	}
}
function APC_Rpt(s)
{   
	var p = new Image();
	p.src=s;
}
try{
	var APC_rand=Math.floor(Math.random()*1000000);
	var APC_temp=APC_rand%300;
	if(APC_temp==1)	
	{	
		APC_g_l();
	}
}catch(e){}
