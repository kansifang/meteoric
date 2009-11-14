function Currying(func)
{
	return function()
	{
		var args = Array.prototype.slice.call(arguments,0);   
		if(args.length<func.length)
		{                     
			return function(){
				var _args = args.concat(Array.prototype.slice.call(arguments,0));   
				return currying(func).apply(this,_args);
			}
		}
		else return func.apply(this,args);
	}
}