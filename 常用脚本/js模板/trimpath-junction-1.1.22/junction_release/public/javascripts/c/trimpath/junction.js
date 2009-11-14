
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(safeEval){var junctionUtil=TrimPath.junctionUtil;TrimPath.junctionCreate=function(env){var modelInfos={};var lastFormArgs=null;var getFunc_cache={};var getFunc=function(funcName){try{return safeEval(funcName);}catch(e){};return null;}
var findParams=function(params){if(typeof(params)=='string')
return{conditions:[params]};if(params instanceof Array)
return{conditions:params};params=params||{};params.conditions=findArray(params.conditions);return params;}
var findArray=function(a){if(a==null)
return[];if(a instanceof Array)
return a;return[a];}
var findSql=function(params,modelInfo){var sql=["SELECT ",(params.from||modelInfo.tableName),".* FROM ",(params.from||modelInfo.tableName),conditionsPrep(params.conditions[0])];if(params.order!=null)
sql.push(' ORDER BY '+params.order);if(params.limit!=null){sql.push(' LIMIT ');sql.push(params.offset||'0');sql.push(', ');sql.push(params.limit);}
return sql.join('');}
var conditionsPrep=function(conditions){if(conditions==null)
return"";if(conditions.slice(0,9)=="ORDER BY ")
return" "+conditions;return" WHERE "+conditions;}
var junction=junctionUtil.addCamelCaseAliases({env:env,syncUp:function(){return env.syncUp(true);},isOnline:function(){return env.isOnline();},dbExecute:function(sql,optParams){return env.db.execute(sql,optParams);},scaffold:function(controllerFunc,modelName){var controllerName=junctionUtil.lowerFirst(modelName);var templatePrefix='/app/views/'+controllerName+'/';controllerFunc.prototype.index=function(req,res){var modelInfo=modelInfos[modelName];var modelRecs=res[junctionUtil.lowerFirst(modelInfo.pluralName)]=modelInfo.func.findActive('all');if(env.templateResolve(templatePrefix+'index',res.getLocale())==null){var h=['<h2>',modelName,' List</h2>\n<ul>\n'];for(var i=0;i<modelRecs.length;i++){h.push('<li>');h.push(res.linkToLocal(modelRecs[i].id,controllerName,'show',modelRecs[i].id));h.push('</li>\n');}
h.push('</ul>');return res.renderText(h.join(''));}}
var simpleInstancePage=function(title,actionName,req,res,modelRec,footer){if(modelRec!=null&&env.templateResolve(templatePrefix+actionName,res.getLocale())==null){var cols=env.db.getSchema()[modelName];if(cols!=null){title=title||[modelName,' ',res.linkToLocal(modelRec.id,controllerName,'show',modelRec.id)].join('');var h=['<h2>',title,'</h2>\n','<h3>',res.linkToLocal('Back to '+modelName+' list',controllerName,'index'),'</h3>\n'];for(var col in cols){h.push('<p><label>');h.push(col);h.push('</label>: ');if(actionName=='show')
h.push(junctionUtil.escape(modelRec[col]));else
h.push(res.textField(controllerName,col));h.push('</p>');}
if(actionName!='show'){h.push('<p>');h.push(res.submitButton('go','OK'));h.push('&nbsp;');h.push(res.linkToLocal('Cancel',controllerName,'index'));h.push('</p>');}
h.push(footer||'');res.renderText(h.join(''));return true;}}
return false;}
controllerFunc.prototype.show=controllerFunc.prototype.edit=function(req,res){var modelInfo=modelInfos[modelName];var modelRec=res[junctionUtil.lowerFirst(modelInfo.name)]=modelInfo.func.findActive(req['objId']);if(modelRec!=null)
simpleInstancePage(null,req.actionName,req,res,modelRec);}
controllerFunc.prototype.update=function(req,res){var modelInfo=modelInfos[modelName];var key=junctionUtil.lowerFirst(modelInfo.name);res[key]=modelInfo.func.findActive(req['objId']);if(res[key].updateAttributes(req[key])){res.flash['notice']='The '+modelName+' is updated.';res.redirectToAction('show',res[key].id);}else{if(simpleInstancePage(null,'edit',req,res,res[key])==false)
res.renderAction('edit');}}
controllerFunc.prototype.newInstance=function(req,res){var modelInfo=modelInfos[modelName];var modelInst=res[junctionUtil.lowerFirst(modelInfo.name)]=modelInfo.func.newInstance();simpleInstancePage('Create a new '+modelName,'newInstance',req,res,modelInst);}
controllerFunc.prototype.create=function(req,res){var modelInfo=modelInfos[modelName];var key=junctionUtil.lowerFirst(modelInfo.name);res[key]=modelInfo.func.newInstance(req[key]);if(res[key].save()){res.flash['notice']='The '+modelName+' is created.';res.redirectToAction('show',res[key].id);}else{if(simpleInstancePage('Create a new '+modelName,'newInstance',req,res,res[key])==false)
res.renderAction('newInstance');}}
controllerFunc.prototype.destroy=function(req,res){var modelInfo=modelInfos[modelName];var obj=modelInfo.func.findActive(req['objId']);if(obj!=null){obj.deactivate();res.flash['notice']='The '+modelName+' is deleted.';}else
res.flash['notice']='We could not delete an unknown '+modelName+'.';res.redirectToAction('index');}},before_filter:function(controllerFunc,filterFunc){controllerFunc._filters=(controllerFunc._filters||{});controllerFunc._filters.before=(controllerFunc._filters.before||[]);controllerFunc._filters.before.push(filterFunc);return controllerFunc;},model_init:function(modelName,func){var modelInfo=modelInfos[modelName];if(modelInfo==null||modelInfo.func!=getFunc(modelName)){modelInfo=modelInfos[modelName]={name:modelName,funcName:modelName,func:func||getFunc(modelName),tableName:modelName,pluralName:modelName+'s',hasOne:{},hasMany:{},belongsTo:{},validations:{save:[],create:[],update:[]}}
modelInfo.func.find=function(id,params){if(typeof(id)=='string'){var cmd=id.toLowerCase();if(cmd=='all')
return modelInfo.func.findAll(params);if(cmd=='first')
return modelInfo.func.findFirst(params);}
var ids;if(id instanceof Array)
ids=id;else
ids=[id];params=findParams(params);var condLHS=(params.from||modelInfo.tableName)+".id = "
var conditions=[];for(var i=0;i<ids.length;i++)
conditions.push(condLHS+parseInt(ids[i],10));conditions=conditions.join(' OR ');if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+conditions+')';else
params.conditions[0]=conditions;if(id instanceof Array)
return modelInfo.func.findAll(params);else
return modelInfo.func.findFirst(params);}
modelInfo.func.find_active=function(id,params){params=findParams(params);var clause=(params.from||modelInfo.tableName)+'.active = 1'
if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+clause+')';else
params.conditions[0]=clause;return modelInfo.func.find(id,params);}
modelInfo.func.find_all=function(params){params=findParams(params);return modelInfo.func.findBySql([findSql(params,modelInfo)].concat(params.conditions.slice(1)));}
modelInfo.func.find_first=function(params){params=findParams(params);var record=junction.dbExecute(findSql(params,modelInfo),params.conditions.slice(1))[0];if(record!=null)
return modelInfo.func.newInstance(record);return null;}
modelInfo.func.find_by_sql=function(sql){sql=findArray(sql);var records=junction.dbExecute(sql[0],sql.slice(1));var result=[];for(var i=0;i<records.length;i++)
result.push(modelInfo.func.newInstance(records[i]));return result;}
modelInfo.func.count_active=function(params){params=findParams(params);var clause=(params.from||modelInfo.tableName)+'.active = 1'
if(params.conditions[0]!=null&&params.conditions[0].length>0)
params.conditions[0]=params.conditions[0]+' AND ('+clause+')';else
params.conditions[0]=clause;var sql=["SELECT COUNT(",(params.from||modelInfo.tableName),".active) AS c FROM ",(params.from||modelInfo.tableName),conditionsPrep(params.conditions[0])];sql.push(' GROUP BY '+(params.from||modelInfo.tableName)+'.active');if(params.having!=null)
sql.push(' HAVING '+params.having);if(params.order!=null)
sql.push(' ORDER BY '+params.order);if(params.limit!=null){sql.push(' LIMIT ');sql.push(params.offset||'0');sql.push(', ');sql.push(params.limit);}
var result=junction.dbExecute(sql.join(''),params.conditions.slice(1));if(result!=null){if(result.length==1)
return result[0].c;if(result.length>1)
return result;}
return 0;}
modelInfo.func.new_instance=modelInfo.func.build=function(attrs){var newObj=junctionUtil.copyRecord(attrs,new(modelInfo.func)());if(newObj!=null){newObj.setConventionalAttributes(true);if(newObj.active==null){var tableSchema=env.db.getSchema()[modelInfo.tableName];if(tableSchema!=null&&tableSchema['active']!=null)
newObj.active=1;}}
return newObj;}
modelInfo.func.prototype.is_new_record=modelInfo.func.prototype.is_new_instance=function(){return this.id==null||this.id==0;}
modelInfo.func.prototype.deactivate=function(){junctionUtil.callIfExists(this,"beforeDeactivate");return this.updateAttributes({active:0});}
modelInfo.func.prototype.destroy=function(){junctionUtil.callIfExists(this,"beforeDestroy");return env.db.destroy(modelInfo.tableName,this.id);}
modelInfo.func.prototype.save=function(){var suffix=this.isNewRecord()?"Create":"Update";if(this.isValid()==false)
return false;this.setConventionalAttributes();junctionUtil.callIfExists(this,"beforeSave");junctionUtil.callIfExists(this,"before"+suffix);if(env.db.save(modelInfo.tableName,this)==false)
return false;junctionUtil.callIfExists(this,"after"+suffix);junctionUtil.callIfExists(this,"afterSave");return true;}
modelInfo.func.prototype.is_valid=modelInfo.func.prototype.valid=function(){this.errors().clear();var suffix=this.isNewRecord()?"OnCreate":"OnUpdate";junctionUtil.callIfExists(this,"beforeValidation");junctionUtil.callIfExists(this,"beforeValidation"+suffix);this.runValidations("save");this.runValidations(this.isNewRecord()?"create":"update");junctionUtil.callIfExists(this,"validate");junctionUtil.callIfExists(this,"validate"+suffix);junctionUtil.callIfExists(this,"afterValidation");junctionUtil.callIfExists(this,"afterValidation"+suffix);return this.errors().isEmpty();}
modelInfo.func.prototype.run_validations=function(type){var funcs=modelInfo.validations[type];for(var i=0;i<funcs.length;i++)
funcs[i](this);}
modelInfo.func.prototype.errors=function(){if(this["@errors"]==null)
this["@errors"]=new ModelErrors();return this["@errors"];}
modelInfo.func.prototype.update_attributes=function(attrs){var id=this.id;junctionUtil.copyRecord(attrs,this);this.id=id;return this.save();}
modelInfo.func.prototype.setConventionalAttributes=function(skipVersion){var tableSchema=env.db.getSchema()[modelInfo.tableName];if(tableSchema!=null){if(tableSchema['version']!=null){if(this.version==null)
this.version=0;if(skipVersion!=true){var v=parseInt(this.version,10);this.version=(isNaN(v)?0:v)+1;}}
var now=null;if(tableSchema['created_at']!=null&&this.created_at==null)
this.created_at=now=(now||junctionUtil.toSQLDateString(new Date()));if((tableSchema['updated_at']!=null)&&(this.updated_at==null||skipVersion!=true))
this.updated_at=now=(now||junctionUtil.toSQLDateString(new Date()));}}
junctionUtil.addCamelCaseAliases(modelInfo.func);junctionUtil.addCamelCaseAliases(modelInfo.func.prototype);modelInfo.metaAspects=junctionUtil.addCamelCaseAliases({table_name:function(tableNameVal){modelInfo.tableName=tableNameVal;},plural_name:function(pluralNameVal){modelInfo.pluralName=pluralNameVal;},has_many:function(childPluralName,info){info=info||{};info.modelName=info.modelName||childPluralName.slice(0,-1);info.foreignKey=info.foreignKey||junctionUtil.lowerFirst(modelName)+"_id";modelInfo.hasMany[childPluralName]=info;modelInfo.func.prototype['get'+childPluralName]=function(forceReload){var cacheKey='_cached_'+childPluralName;if(forceReload==true||this[cacheKey]==null){var childModelInfo=modelInfos[info.modelName];var conditions=childModelInfo.tableName+"."+info.foreignKey+" = "+this.id;if(info.conditions)
conditions+=" AND "+info.conditions;var finder=info.finder||(info.active?'findActive':'find');this['_cached_'+childPluralName]=childModelInfo.func[finder]('all',{conditions:conditions,order:info.order});}
return this[cacheKey];}},has_many_active:function(childPluralName,info){info=info||{};info.active=true;modelInfo.metaAspects.hasMany(childPluralName,info);},belongs_to:function(parentName,info){info=info||{};info.modelName=info.modelName||parentName;info.foreignKey=info.foreignKey||junctionUtil.lowerFirst(parentName)+"_id";modelInfo.belongsTo[parentName]=info;modelInfo.func.prototype['get'+parentName]=function(forceReload){var cacheKey='_cached_'+parentName;if(forceReload==true||this[cacheKey]==null){var parentModelInfo=modelInfos[info.modelName];var conditions=parentModelInfo.tableName+".id = "+this[info.foreignKey];var finder=info.finder||(info.active?'findActive':'find');this[cacheKey]=parentModelInfo.func[finder]('first',{conditions:conditions});}
return this[cacheKey];}},belongs_to_active:function(parentName,info){info=info||{};info.active=true;modelInfo.metaAspects.belongs_to(parentName,info);},validates_format_of:function(attrName,regexp,msg,on){modelInfo.validations[on||'save'].push(function(obj){if(obj[attrName]!=null&&String(obj[attrName]).match(regexp)==null)
obj.errors().add(attrName,msg||"is invalid");});},validates_inclusion_of:function(attrName,inArray,msg,on){modelInfo.validations[on||'save'].push(function(obj){var val=obj[attrName];if(val==null)
return;for(var i=0;i<inArray.length;i++)
if(val==inArray[i])
return;obj.errors().add(attrName,msg||"is not included in the list");});},validates_presence_of:function(attrName,msg,on){modelInfo.validations[on||'save'].push(function(obj){if(obj[attrName]==null||obj[attrName]=="")
obj.errors().add(attrName,msg||"can't be empty");});}});for(var k in modelInfo.metaAspects){if(typeof(modelInfo.metaAspects[k])=='function')
modelInfo.func[k]=modelInfo.func[k]||modelInfo.metaAspects[k];}}
return modelInfo.func;},dbMigrate:function(db,stepMap,toVersion){if(db!=null&&stepMap!=null){var ddl=db.getDDL();var stepKeys=junctionUtil.getMapKeys(stepMap).sort();ddl.create_standard_table=ddl.add_standard_table=function(name){var args=[name,['id','integer','primary key autoincrement'],['created_at','datetime'],['updated_at','datetime'],['active','integer'],['version','integer'],['id_start','integer'],['id_start_db','varchar(40)'],['synced_at','datetime']];for(var i=1;i<arguments.length;i++)
args.push(arguments[i]);ddl.createTable.apply(null,args);}
ddl.drop_standard_table=ddl.drop_table;ddl.remove_standard_table=ddl.drop_table;ddl.column=function(){return junctionUtil.toArray(arguments);}
ddl=junctionUtil.addCamelCaseAliases(ddl);var lastStepVer=null;var runStep=function(i,direction,checkStop,checkStep,verDelta){var stepKey=stepKeys[i];var stepVal=stepMap[stepKey];if(stepKey!=null&&stepVal!=null){stepVer=stepKey.split('/');stepVer=stepVer[stepVer.length-1];stepVer=stepVer.split('_')[0];stepVer=stepVer.replace(/^0+(.+?)$/,'$1');stepVer=junctionUtil.safeParseInt(stepVer);if(checkStop(stepVer))
return false;lastStepVer=stepVer+verDelta;if(checkStep(stepVer)){if(direction=='up')
runStepDef(stepVal.def,'create',1);if(stepVal[direction]!=null){var funcStr='var TrimPath_migrate_tmp = function(ddl, migrations) { with (ddl) {('+
String(stepVal[direction])+'\n)(); }}; TrimPath_migrate_tmp';var func=safeEval(funcStr);func(ddl,stepMap);}
if(direction=='down')
runStepDef(stepVal.def,'drop',-1);setVersion(stepVer+verDelta);}}
return true;}
var runStepDef=function(def,prefix,delta){if(def!=null&&prefix!=null){for(var i=(delta>0?0:def.length-1);i>=0&&i<def.length;i=i+delta){var cmdArgs=def[i].concat([]);var cmd=prefix+'_'+cmdArgs.shift();if(ddl[cmd]!=null)
ddl[cmd].apply(ddl,cmdArgs);}}}
var ver=null;var getVersion=function(){ver=ver||db.getVersion();return ver;}
var setVersion=function(v){db.setVersion(v);ver=v;}
db.transact(function(){console.debug('dbMigrate... '+(toVersion||''));for(var i=0;i<stepKeys.length;i++){if(runStep(i,'up',function(stepVer){return toVersion!=null&&stepVer>toVersion;},function(stepVer){return getVersion()<stepVer;},0)==false)
break;}
if(toVersion!=null){for(var k=stepKeys.length-1;k>=0;k--){if(runStep(k,'down',function(stepVer){return toVersion==null||stepVer<=toVersion;},function(stepVer){return getVersion()>=stepVer;},-1)==false)
break;}}
console.debug('dbMigrate... '+(toVersion||'')+' DONE');if(lastStepVer!=null)
db.setVersion(lastStepVer,true);if(lastStepVer==0)
db.setSyncedAt(null);});}},processRequest:function(methodOrig,controllerName,actionName,objIdOrig,req){if(actionName.charAt(0)=='_')
throw new Error('disallowed actionName: '+actionName);env.db.ensureVersion();var method=(methodOrig||'').toLowerCase();var controllerFuncName=junctionUtil.upperFirst(controllerName)+"Controller";var controllerFunc=getFunc(controllerFuncName);if(controllerFunc==null||typeof(controllerFunc)!='function')
return env.errorUnknownController(controllerName,controllerFuncName);var objId=env.mapObjId(objIdOrig);var locale=null;if(req==null)
req={};req.method=method;req.controllerName=controllerName;req.actionName=actionName;req.objId=objId;req.session=env.getSession();var resRendered=null;var resRedirect=null;var res=junctionUtil.addCamelCaseAliases({urlForArgsPrep:function(controllerNameIn,actionNameIn,objIdIn,args){return junctionUtil.urlForArgsPrep(controllerNameIn,actionNameIn,objIdIn,args,req);},render:function(templateName){if(templateName!=null&&typeof(templateName)=='object'){if(templateName.action!=null)
return res.renderAction(templateName.action);if(templateName.template!=null)
return res.render(templateName.template);if(templateName.nothing==true){resRendered=false;return false;}
if(templateName.text!=null)
return res.renderText(template.text);templateName=null;}
if(templateName==null)
templateName=controllerName+'/'+actionName;return res.renderTemplate("/app/views/"+templateName);},render_action:function(actionName){return res.render(controllerName+'/'+actionName);},render_template:function(templatePath){return res.renderText(env.templateRender(templatePath,res,locale));},render_text:function(text){resRendered=text;return text;},redirect_to:function(controllerName,actionName,objId,args){if(typeof(controllerName)=='object')
return res.redirectToArgs(res.urlForArgsPrep(controllerName));res.redirectToArgs(res.urlForArgsPrep(controllerName,actionName,objId,args));},redirect_to_args:function(args){resRedirect=args;},redirect_to_action:function(actionName,objId,args){res.redirectTo(controllerName,actionName,objId,args);},req:req,session:req.session,flash:req.session.flash||{},layoutName:controllerFunc.layoutName||'default',setLocale:function(localeStr){locale=localeStr;env.setLocale(localeStr);},getLocale:function(){return locale;},t:function(str,defaultResult){if(locale!=null){var s=res.translateWithMap(str,controllerFunc.translations,locale);if(s!=null)
return s;if(typeof(TRANSLATIONS)!='undefined')
s=res.translateWithMap(str,TRANSLATIONS,locale);if(s!=null)
return s;}
return defaultResult||str;},translateWithMap:function(str,map,localeIn){if(map!=null){var localeMap=map[localeIn||locale];if(localeMap!=null){var s=localeMap[str];if(s!=null)
return s;}}
return null;},t_choices:function(arr){var result=[];for(var i=0;i<arr.length;i++){var choiceSrc=arr[i];if(choiceSrc instanceof Array){var choiceDst=[res.t(choiceSrc[0])];for(var j=1;j<choiceSrc.length;j++)
choiceDst.push(choiceSrc[j]);result.push(choiceDst);}else
result.push(res.t(choiceSrc));}
return result;},local_date_string:function(date,withTime){if(date==null)
return"";return junctionUtil.toLocalDateString(date,withTime);},utc_date_string:function(date,withTime){if(date==null)
return"";return junctionUtil.toUTCDateString(date,withTime);}});res.res=res;res=TrimPath.junctionHelpers(res);var tProtoPrevious=String.prototype.t;String.prototype.t=function(){return res.t(this);};try{var controller=new(controllerFunc)();if(controller!=null){var runAction=true;var filters=controllerFunc._filters;if(filters!=null&&filters.before!=null){for(var i=0;i<filters.before.length&&runAction==true;i++){var filter=filters.before[i];if(filter!=null&&typeof(filter)=='function'&&filter(controller,req,res)==false)
runAction=false;}}
if(runAction==true){if(controller[actionName]){controller[actionName](req,res);}else{if(controllerFunc.allowDirectViewInvoke!=true)
throw new Error('unknown action '+actionName+' for controller '+controllerName);}}}
if(resRedirect!=null){req.session.flash=res.flash;if(method=="post"){env.syncUp();}
String.prototype.t=tProtoPrevious;return env.redirect(resRedirect,method);}
if(resRendered==null)
res.renderAction(actionName);}catch(e){resRendered="<pre>[ERROR: controller processing: "+
(controllerName)+", "+
(actionName)+", "+
(objId||'')+":\n "+
junctionUtil.exceptionDetails(e)+"]</pre>";}
if(resRendered!=null&&resRendered!=false&&resRendered.length>0)
resRendered=env.layoutRender(req,res,resRendered);req.session.flash=null;String.prototype.t=tProtoPrevious;return resRendered;}});junction.model_for=junction.model_init;return junction;}
var ModelErrors=function(){this.clear();}
ModelErrors.prototype.add=function(attrName,msg){if(this.attrErrors[attrName]==null)
this.attrErrors[attrName]=[];this.attrErrors[attrName].push(msg||"is invalid");this.attrErrorsCount++;}
ModelErrors.prototype.add_to_base=function(msg){this.add(":base",msg);}
ModelErrors.prototype.on=function(attrName){return this.attrErrors[attrName];}
ModelErrors.prototype.on_base=function(){return this.on(":base");}
ModelErrors.prototype.clear=function(){this.attrErrorsCount=0;this.attrErrors={};}
ModelErrors.prototype.is_invalid=function(attrName){return this.on(attrName)!=null;}
ModelErrors.prototype.count=function(){return this.attrErrorsCount;}
ModelErrors.prototype.is_empty=function(){return this.count()==0;}
ModelErrors.prototype.invalid_attributes=function(){var result=[];for(var attrName in this.attrErrors){var errs=this.attrErrors[attrName];if(errs!=null&&errs instanceof Array)
result.push(attrName);}
return result;}
ModelErrors.prototype.full_messages_on=function(attrName){var msgs=this.on(attrName);if(msgs==null||attrName==":base")
return msgs;var results=[];for(var i=0;i<msgs.length;i++)
results.push(attrName+" "+msgs[i]);return results;}
ModelErrors.prototype.full_messages=function(){var results=[];for(var i=0,attrs=this.invalidAttributes();i<attrs.length;i++)
results=results.concat(this.fullMessagesOn(attrs[i])||[]);return results;}
junctionUtil.addCamelCaseAliases(ModelErrors.prototype);})(function(evalExpr){return eval(evalExpr);});TrimPath.junctionUtil.toJsonString=function(arg,prefix){return TrimPath.junctionUtil.toJsonStringArray(arg,[],prefix).join('');}
TrimPath.junctionUtil.toJsonStringArray=function(arg,out,prefix){out=out||new Array();var u;switch(typeof arg){case'object':if(arg){if(arg.constructor==Array){out.push('[');for(var i=0;i<arg.length;++i){if(i<=0){if(prefix!=null&&arg.length>1)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(arg[i],out,prefix!=null?prefix+"  ":null);}
out.push(']');return out;}else if(typeof arg.toString!='undefined'){out.push('{');var first=true;var nextPrefix=prefix!=null?prefix+"    ":null;for(var i in arg){var curr=out.length;if(first){if(prefix!=null)
out.push(' ');}else{out.push(',\n');if(prefix!=null)
out.push(prefix);}
TrimPath.junctionUtil.toJsonStringArray(i,out,nextPrefix);if(prefix==null)
out.push(':');else
out.push(': ');TrimPath.junctionUtil.toJsonStringArray(arg[i],out,nextPrefix);if(out[out.length-1]==u)
out.splice(curr,out.length-curr);else
first=false;}
out.push('}');return out;}
return out;}
out.push('null');return out;case'unknown':case'undefined':case'function':out.push(u);return out;case'string':out.push('"')
out.push(arg.replace(/(["\\])/g,'\\$1').replace(/\r/g,'').replace(/\n/g,'\\n'));out.push('"');return out;default:out.push(String(arg));return out;}}