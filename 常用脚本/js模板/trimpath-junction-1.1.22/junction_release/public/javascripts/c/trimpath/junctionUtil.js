
if(typeof(TrimPath)=='undefined')
TrimPath={};(function(safeEval){var MANY_ZEROS="000000000000000000";var copyRecordRE_id=/_id$/;var copyRecordRE_at=/_at$/;var isValidSQLNameRE=/^\w+$/;var junctionUtil=TrimPath.junctionUtil={safeEval:safeEval,safeParseInt:function(str,defaultValue){var result=parseInt(str,10);if(isNaN(result)==true)
return defaultValue||0;return result;},safeParseFloat:function(str,defaultValue){var result=parseFloat(str);if(isNaN(result)==true)
return defaultValue||0.0;return result;},upperFirst:function(str){return str.charAt(0).toUpperCase()+str.substring(1);},lowerFirst:function(str){return str.charAt(0).toLowerCase()+str.substring(1);},encodeAngles:function(str){return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');},decodeAngles:function(str){return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');},encodeQuotes:function(str){return str.replace(/'/g,"\\'").replace(/"/g,'&quot;');},escape:function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,'&quot;');},leftZeroPad:function(val,minLength){if(typeof(val)!="string")
val=String(val);if(val.length>=minLength)
return val;return(MANY_ZEROS.substring(0,minLength-val.length))+val;},toLocalDateString:function(date,withTime){if(typeof(date)=="string"){date=junctionUtil.parseDateString(date);if(date==null)
return"";}
date=date||new Date();var leftZP=junctionUtil.leftZeroPad;var result=[leftZP(date.getFullYear(),4),'/',leftZP(date.getMonth()+1,2),'/',leftZP(date.getDate(),2)];if(withTime==true){result.push(' ');result.push(leftZP(date.getHours(),2));result.push(':');result.push(leftZP(date.getMinutes(),2));result.push(':');result.push(leftZP(date.getSeconds(),2));}
return result.join('');},toUTCDateString:function(date,withTime){if(typeof(date)=="string"){date=junctionUtil.parseDateString(date);if(date==null)
return"";}
date=date||new Date();var leftZP=junctionUtil.leftZeroPad;var result=[leftZP(date.getUTCFullYear(),4),'/',leftZP(date.getUTCMonth()+1,2),'/',leftZP(date.getUTCDate(),2)];if(withTime==true){result.push(' ');result.push(leftZP(date.getUTCHours(),2));result.push(':');result.push(leftZP(date.getUTCMinutes(),2));result.push(':');result.push(leftZP(date.getUTCSeconds(),2));}
return result.join('');},toSQLDateString:function(date){var pad=junctionUtil.leftZeroPad;date=date||new Date();return[pad(date.getUTCFullYear(),4),'-',pad(date.getUTCMonth()+1,2),'-',pad(date.getUTCDate(),2),' ',pad(date.getUTCHours(),2),':',pad(date.getUTCMinutes(),2),':',pad(date.getUTCSeconds(),2),'Z'].join('');},parseDateString:function(s){if(s!=null&&s.length>0){s=s.split(' ');var ymd=[];if(s[0].indexOf('-')>=0)
ymd=s[0].split('-');else if(s[0].indexOf('\/')>=0)
ymd=s[0].split('/');var hms=[];var hasTime=s[1]!=null&&s[1].length>0;if(hasTime){hms=s[1].split(':');if(hms[2])
hms[2]=hms[2].replace(/Z/,'');else{var localDate=new Date();var localTime=localDate.toTimeString();localTime=localTime.split(' ');hms[2]=localTime[0];}}
if(!hasTime||s[1]=='00:00:00Z'){var lt=new Date();var d_obj=new Date(ymd[0],(ymd[1]-1),ymd[2],lt.getHours(),lt.getMinutes(),lt.getSeconds());}
else{var d_obj=new Date(Date.UTC(ymd[0],(ymd[1]-1),ymd[2],hms[0],hms[1],hms[2]));}
if(d_obj!=null&&isNaN(d_obj.getTime())==false)
return d_obj;}
return null;},prepSQLParams:function(sqlParams){if(sqlParams!=null){for(var i=0;i<sqlParams.length;i++){if(sqlParams[i]instanceof Date)
sqlParams[i]=junctionUtil.toSQLDateString(sqlParams[i]);}}
return sqlParams;},isValidSQLName:function(name){return(name.match(isValidSQLNameRE)!=null);},ensureValidSQLName:function(name){if(junctionUtil.isValidSQLName(name)==false)
throw new Error('invalid SQL name: '+name);},getMapKeys:function(map,optTestProperty){var result=[];for(var k in map)
if((map[k]!=null)&&(optTestProperty==null||map[k][optTestProperty]!=null))
result.push(k);return result;},setMapTreeValue:function(mapTree,path,value){if(path!=null){var keys=path.replace(/\]/g,'').split('[');for(var k=0;k<keys.length;k++){var key=keys[k];if(k<keys.length-1){if(mapTree[key]==null)
mapTree[key]={};mapTree=mapTree[key];}else{mapTree[key]=value;}}}
return mapTree;},copyRecord:function(src,dst){for(var k in src){if(typeof(src[k])!='function'&&junctionUtil.isValidSQLName(k)){dst[k]=src[k];if(k.match(copyRecordRE_id)!=null&&dst[k]!=null)
dst[k]=junctionUtil.nanToNull(parseInt(dst[k],10));if(k.match(copyRecordRE_at)!=null&&src[k]!=null){if(typeof(src[k])=="string"){var d=junctionUtil.parseDateString(src[k]);if(d!=null)
dst[k]=junctionUtil.toSQLDateString(d);else
dst[k]=null;}else if(src[k]instanceof Date)
dst[k]=junctionUtil.toSQLDateString(src[k]);}}}
return dst;},nanToNull:function(val){return isNaN(val)?null:val;},findRecordIndex:function(records,id){if(records!=null){for(var i=0;i<records.length;i++){if(records[i].id==id)
return i;}}
return-1;},callIfExists:function(obj,methodName,defaultResult){if(obj[methodName]==null)
return defaultResult;return obj[methodName]();},toArray:function(obj,length,filterFunc){length=length||obj.length;var result=[];for(var i=0;i<length;i++)
if(filterFunc==null||filterFunc(obj[i]))
result.push(obj[i]);return result;},pushAttributes:function(array,attrs){for(var k in attrs){if(typeof(attrs[k])!="function"){array.push(' ');array.push(k);array.push('="');array.push(attrs[k]);array.push('"');}}
return array;},trim:function(str){return str.replace(/^\s*(.*?)\s*$/,'$1');},exceptionDetails:function(e){return(e.toString())+";\n "+
(e.message)+";\n "+
(e.name)+";\n "+
(e.stack||'no stack trace')+";\n "+
(e.description||'no further description')+";\n "+
(e.fileName||'no file name')+";\n "+
(e.lineNumber||'no line number');},toUrlParams:function(map,exceptMap){var result=[];for(var k in map){var val=map[k];if(typeof(val)!='function'&&(exceptMap==null||exceptMap[k]!=true)){if(val instanceof Array){for(var i=0;i<val.length;i++){result.push('&');result.push(k);result.push('=');result.push(val[i]);}}else{result.push('&');result.push(k);result.push('=');result.push(val);}}}
result.shift();return result.join('');},urlForArgsPrep:function(controllerNameIn,actionNameIn,objIdIn,args,defaultVals){if(typeof(controllerNameIn)=='object'){args=controllerNameIn;if(args.controllerName==null&&args.controller!=null){args.controllerName=args.controller;delete args.controller;}
if(args.actionName==null&&args.action!=null){args.actionName=args.action;delete args.action;}
if(args.objId==null&&args.id!=null){args.objId=args.id;delete args.id;}
return junctionUtil.urlForArgsPrep(args.controllerName,args.actionName,args.objId,args);}
defaultVals=defaultVals||{};args=args||{};args.controllerName=controllerNameIn||defaultVals.controllerName;args.actionName=actionNameIn||defaultVals.actionName;if(objIdIn!=null)
args.objId=objIdIn;return args;},addCamelCaseAliases:function(obj){for(var k in obj){if(typeof(obj[k])=='function'){var kParts=k.split('_');if(kParts.length>1){for(var i=1;i<kParts.length;i++)
kParts[i]=junctionUtil.upperFirst(kParts[i]);var alias=kParts.join('');if(obj[alias]==null)
obj[alias]=obj[k];}}}
return obj;},syncAllowedForTable:function(tableName,schema){return(tableName!=null&&tableName.search(/Local$/)<0&&schema!=null&&schema[tableName].id!=null&&schema[tableName].created_at!=null&&schema[tableName].updated_at!=null&&schema[tableName].active!=null&&schema[tableName].version!=null&&schema[tableName].id_start!=null&&schema[tableName].id_start_db!=null&&schema[tableName].synced_at!=null);},createDbObj:function(conn,info,trackChanges,readOnly){var dbIdent=null;var dbSchema=null;var txDepth=0;var version=null;var readMeta=function(tableName,field,sort){conn.execute('CREATE TABLE IF NOT EXISTS '+tableName+' ('+field+' varchar(100), updated_at DATETIME)');var r=conn.executeToRecords('SELECT * FROM '+tableName+' ORDER BY '+field+' '+sort)[0];if(r!=null)
return r[field];return null;}
var readIdent=function(){return readMeta('meta_ident','ident','DESC');}
var readVersion=function(){return readMeta('meta_version','version','DESC');}
var readLastId=function(){return readMeta('meta_last_id','last_id','ASC');}
var readSyncedAt=function(){return readMeta('meta_synced_at','synced_at','ASC');}
var dbObj={getInfo:function(){return info;},getIdent:function(){if(dbIdent==null){dbIdent=readIdent();if(dbIdent==null||dbIdent.length<=0){dbIdent=(new Date().getTime()-new Date('2007/06/10').getTime())+'-'+Math.floor(Math.random()*100000);conn.execute("INSERT INTO meta_ident (ident, updated_at) VALUES (?, ?)",[dbIdent,junctionUtil.toSQLDateString(new Date())]);}}
return dbIdent;},getVersion:function(){return readVersion()||0;},setVersion:function(v,cacheOnly){if(cacheOnly==true){version=v;return;}
dbObj.transact(function(){conn.execute("DELETE FROM meta_version");conn.execute("INSERT INTO meta_version (version, updated_at) VALUES (?, ?)",[v,junctionUtil.toSQLDateString(new Date())]);version=v;dbSchema=null;});},ensureVersion:function(){if(readOnly==true)
return;var v=readVersion();if((v||0)!=(version||0))
throw new Error("meta_version mismatch; expected: "+version+" got: "+v);return v;},getSyncedAt:function(){return readSyncedAt();},setSyncedAt:function(v){if(readOnly==true)
return;dbObj.transact(function(){conn.execute("DELETE FROM meta_synced_at");if(v!=null)
conn.execute("INSERT INTO meta_synced_at (synced_at, updated_at) VALUES (?, ?)",[v,junctionUtil.toSQLDateString(new Date())]);});},flushCaches:function(){dbSchema=null;},getSchema:function(force){if(force==true||dbSchema==null){dbSchema={};var sm=conn.executeToRecords("SELECT * FROM sqlite_master WHERE type = 'table'");for(var i=0;i<sm.length;i++){if(sm[i].type=='table'&&sm[i].name.search(/^(sqlite|meta|changes)_/i)<0){dbSchema[sm[i].name]={};var cols=sm[i].sql.match(/\((.+)\)/)[1].split(',');for(var j=0;j<cols.length;j++){var full=junctionUtil.trim(cols[j]);var col=full.split(' ');dbSchema[sm[i].name][col[0]]={type:col[1],full:full}}}}}
return dbSchema;},changesFor:function(tableName){var rm={};if(trackChanges==true){for(var rs=conn.executeToRecords('SELECT * FROM changes_'+tableName),i=0;i<rs.length;i++)
rm[rs[i].id]=rs[i].op;}
return rm;},clearChangesFor:function(tableName,id){if(readOnly==true)
return;if(trackChanges==true){var sql='DELETE FROM changes_'+tableName+' WHERE id=?';var arr=[id];for(var i=2;i<arguments.length;i++){if(arguments[i]!=null){sql=sql+' OR id=?';arr.push(arguments[i]);}}
conn.execute(sql,arr);}},transact:function(fn){if(txDepth<=0)
conn.execute('begin');txDepth=txDepth+1;try{fn();if(readOnly==true){conn.execute('rollback');}}catch(e){if(txDepth>0)
conn.execute('rollback');txDepth=0;throw e;}
txDepth=Math.max(0,txDepth-1);if(txDepth<=0)
conn.execute('commit');},execute:function(sql,sqlParams){return conn.executeToRecords(sql,sqlParams);},findById:function(tableName,id){return conn.executeToRecords("SELECT * FROM "+tableName+" WHERE id=?",[id])[0];},save:function(tableName,obj){if(readOnly==true)
throw new Error('cannot save, db is readOnly');var isNewRec=obj.isNewRecord();if(isNewRec){obj.id=dbObj.genMinId();obj.id_start=obj.id;obj.id_start_db=dbObj.getIdent();}
dbObj.saveRecord(tableName,obj);conn.recordChanged(tableName,obj.id,'s');return true;},saveRecord:function(tableName,rec,colInfos){if(readOnly==true)
throw new Error('cannot saveRecord, db is readOnly');var colInfos=colInfos||dbObj.getSchema()[tableName];var colNames=[];var colQVals=[];var colVals=[];for(var colName in colInfos){colNames.push(colName);colQVals.push('?');if(rec[colName]==null)
colVals.push(null);else
colVals.push(rec[colName]);}
var sql='INSERT OR REPLACE INTO '+tableName+' ('+colNames.join(',')+' ) VALUES ( '+colQVals.join(',')+')';conn.execute(sql,colVals);},destroy:function(tableName,id){if(readOnly==true)
throw new Error('cannot destroy, db is readOnly');dbObj.destroyRecord(tableName,id);conn.recordChanged(tableName,id,'d');},destroyRecord:function(tableName,id){if(readOnly==true)
throw new Error('cannot destroyRecord, db is readOnly');conn.execute("DELETE FROM "+tableName+" WHERE id = ?",[id]);},genMinId:function(){if(readOnly==true)
throw new Error('cannot genMinId, db is readOnly');var id=null;dbObj.transact(function(){id=parseInt(readLastId()||0,10)-1;conn.execute("DELETE FROM meta_last_id");conn.execute("INSERT INTO meta_last_id (last_id, updated_at) VALUES (?, ?)",[id,junctionUtil.toSQLDateString(new Date())]);});return id;},getDataAsMap:function(){var map={};var schema=dbObj.getSchema();for(var tableName in schema){map[tableName]=conn.executeToRecords('SELECT * FROM '+tableName);if(trackChanges==true)
map['changes @@ '+tableName]=conn.executeToRecords('SELECT * FROM changes_'+tableName);}
return map;},getDDL:function(){if(readOnly==true)
throw new Error('cannot getDDL, db is readOnly');var tableDDL={createTable:function(name){var cols=[];for(var i=1;i<arguments.length;i++)
cols.push(arguments[i].join(' '));conn.execute('CREATE TABLE '+name+' ('+cols.join(', ')+')');},dropTable:function(name){conn.execute('DROP TABLE '+name);},renameTable:function(oldName,newName){conn.execute('ALTER TABLE '+oldName+' RENAME TO '+newName);}}
var ddl={create_table:function(name){tableDDL.createTable.apply(null,arguments);if(trackChanges==true)
tableDDL.createTable('changes_'+name,['id','integer','primary key not null'],['op','text']);},drop_table:function(name){tableDDL.dropTable(name);if(trackChanges==true)
tableDDL.dropTable('changes_'+name);},rename_table:function(oldName,newName){tableDDL.renameTable(oldName,newName);if(trackChanges==true)
tableDDL.renameTable('changes_'+oldName,'changes_'+newName);},create_column:function(tableName,columnName,type){conn.execute('ALTER TABLE '+tableName+' ADD COLUMN '+columnName+' '+type);},rename_column:function(tableName,columnName,newColumnName){throw new Error("renameColumn unimplemented");},drop_column:function(tableName,columnName){dbObj.transact(function(){var bkName='bk_'+tableName;var colNames=[];var colDefs=[];var colMap=dbObj.getSchema(true)[tableName];if(colMap!=null){for(var colName in colMap){colNames.push(colName);colDefs.push(colMap[colName].full);}
colNames=colNames.join(', ');colDefs=colDefs.join(', ');conn.execute("CREATE TABLE "+bkName+" ("+colDefs+")");conn.execute("INSERT INTO "+bkName+" SELECT "+colNames+" FROM "+tableName);conn.execute("DROP TABLE "+tableName);conn.execute("CREATE TABLE "+tableName+" ("+colDefs+")");conn.execute("INSERT INTO "+tableName+" SELECT "+colNames+" FROM "+bkName);conn.execute("DROP TABLE "+bkName);}});},create_index:function(tableName,columnNames,indexType,indexName){if((columnNames instanceof Array)==false)
columnNames=[columnNames];conn.execute('CREATE '+(indexType||'')+' INDEX '+indexName+' ON '+tableName+' ('+columnNames.join(',')+')');},drop_index:function(tableName,indexName){conn.execute('DROP INDEX '+indexName);}};ddl.add_table=ddl.create_table;ddl.add_column=ddl.create_column;ddl.add_index=ddl.create_index;ddl.remove_table=ddl.drop_table;ddl.remove_column=ddl.drop_column;ddl.remove_index=ddl.drop_index;return junctionUtil.addCamelCaseAliases(ddl);}};return dbObj;}};junctionUtil.parseSQLDateString=junctionUtil.parseDateString;})(function(evalExpr){return eval(evalExpr);});TrimPath.junctionUtil.toJsonString=function(arg,prefix){return TrimPath.junctionUtil.toJsonStringArray(arg,[],prefix).join('');}
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
TrimPath.ajax=function(url,method,req,callback){if(TrimPath.junctionClient[method.toLowerCase()+'Async'](req.controllerName,req.actionName,req.objId,req,{onComplete:callback})==true){TrimPath.ajaxRemote(url,method,req,callback);}}
TrimPath.ajaxRemote=function(url,method,req,callback){if(typeof($)!='undefined'&&typeof($.ajax)=='function')
$.ajax({type:method.toUpperCase(),url:url,data:req,success:callback});}
if(TrimPath.junctionClient==null){TrimPath.junctionClient={get:function(){return true;},getAsync:function(){return true;},post:function(){return true;},postAsync:function(){return true;},postForm:function(){return true;},formToReq:function(){}}}