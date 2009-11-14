// Helper functions available throughout the app should go here.

isDemoMode = function() {
  return TrimPath.junction.env.db.getInfo().persists == false;
}

textLanguageFormat = function(res) {
  // default text format is in English format, number 0
  //                 Vietnamese text format is number 1
  if (res.getLocale() == 'vn')
     return 1;
  return 0;
}

zeroActionRecords = function() {
    var count = Action.findBySql('SELECT COUNT(Action.id) AS C FROM Action')[0];
    if (count == null ||
        count.C <= 0)
        return true;
}

sampleDate = function() {
    return '<span class="btw">' + 'example'.t() + ': 2007/09/24</span><br/>';
}

dayOfWeekChoices = [["Sunday",    0],
                    ["Monday",    1],
                    ["Tuesday",   2],
                    ["Wednesday", 3],
                    ["Thursday",  4],
                    ["Friday",    5],
                    ["Saturday",  6]];

weekOfMonthChoices = [["1st", 1], ["2nd", 2], ["3rd", 3], ["4th", 4]];

dateFillChoices = ['', 'today', 'tomorrow', 
                       'next week', 'one week', 'two weeks',
                       'next month', 'one month'];

dateFillLinks = function(inputId) {
    var result = [];
    for (var i = 1; i < dateFillChoices.length; i++) {
        var dateFillChoice = dateFillChoices[i];
        result.push('<a href="#"');
        result.push(' onclick="document.getElementById(\'' + inputId + '\').value = dateFillCalc(\'' + dateFillChoice + '\'); return false">');
        result.push(dateFillChoice);
        result.push('</a> ');
    }
    return result.join('');
}

dateFillSelect = function(inputId) {
    var result = [ '<select class="dateFillSelect"',
                   ' onchange="document.getElementById(\'' + inputId + '\').value = dateFillCalc(this.value)">' ];
    for (var i = 0; i < dateFillChoices.length; i++) {
        var dateFillChoice = dateFillChoices[i];
        result.push('<option value="' + dateFillChoice + '">');
        result.push(String(dateFillChoice).t());
        result.push('</option>');
    }
    result.push('</select>');
    return result.join('');
}

clearHMS = function(d) {
    d.setMilliseconds(0);
    d.setSeconds(0);
    d.setMinutes(0);
    d.setHours(0);
    return d;
}

toYM = function(d) { // Returns string of "YYYY/MM" format.
    return d.getFullYear() + '/' + TrimPath.junctionUtil.leftZeroPad(d.getMonth() + 1, 2);
}

toMY = function(d) { // Returns string of "MM/YYYY" format.
    return TrimPath.junctionUtil.leftZeroPad(d.getMonth() + 1, 2) + '/' + d.getFullYear();
}

sameDate = function(d1, d2) {
    return d1.getFullYear() == d2.getFullYear() &&
           d1.getMonth() == d2.getMonth() &&
           d1.getDate() == d2.getDate();
}

localTime = function() {  // get local time to add after the date
    var localDate = new Date();
    var localTime = localDate.toTimeString();
        localTime = localTime.split(' ');
    var hms = localTime[0];
    return hms;
}    

toLocalDashDate = function(dateStr) {
    if (dateStr != null)
      return toLocalDashDateObj(TrimPath.junctionUtil.parseDateString(dateStr));
    return '';
}

toLocalDashDateObj = function(d) {
    var pad = TrimPath.junctionUtil.leftZeroPad;
    if (d != null) {
      return [
        pad(d.getFullYear(), 4),  '-', 
        pad(d.getMonth() + 1, 2), '-',
        pad(d.getDate(), 2),      ' ', 
        pad(d.getHours(), 2),     ':',
        pad(d.getMinutes(), 2),   ':',
        pad(d.getSeconds(), 2),   'Z'
              ].join('');
    }
    return '';
}

todayDateNoTime = function() {  //create local date without time. ex: 2008/01/12
    var todayDate = TrimPath.junctionUtil.toLocalDateString(new Date());
    return todayDate;
}

todayDateNoTimeDmyFormat = function() {  // create today date without time in DD/MM/YYYY format
    var temp = TrimPath.junctionUtil.toLocalDateString(new Date()).split('/');
    var todayDateDMY = temp[2] + '/' + temp[1] + '/' + temp[0];
    return todayDateDMY;
}
  
// Used to help populate select-drop-down options...
//
recordsToChoices = function(records, includeNone, textKey, idKey) {
    var choices = [];
    if (includeNone != false) // Treats null as true.
        choices.push(["", null]);
    for (var i = 0; i < records.length; i++)
        choices.push(recordToChoice(records[i], textKey, idKey));
    return choices;
}

recordToChoice = function(record, textKey, idKey) {
    textKey = textKey || 'name';
    idKey   = idKey   || 'id';

    var textVal;
    if (typeof(textKey) == 'function')
        textVal = textKey(record);
    else
        textVal = record[textKey];

    var idVal;
    if (typeof(idKey) == 'function')
        idVal = idKey(record);
    else
        idVal = record[idKey];

    return [ TrimPath.junctionUtil.escape(textVal), idVal ];
}

parentRecordToChoices = function(modelClass, modelName, currRecordId, includeNone, moreSql) {
    var parentAttrName = 'parent_' + modelName + '_id';
    var parentNameCap  = TrimPath.junctionUtil.upperFirst(modelName);
    var allRecordsArr = modelClass.findActive('all', { 
                        conditions: (moreSql || ''),
                        order: parentNameCap + '.' + parentAttrName + ' ASC, ' + parentNameCap + '.name ASC '});
    var childrenMap   = {}; // Key: id, Value: array of child records

    for (var i = 0; i < allRecordsArr.length; i++) {
        var rec = allRecordsArr[i];
        
        var parent_id = rec[parentAttrName] || 'TOP_LEVEL';
        childrenMap[parent_id] = childrenMap[parent_id] || [];
        childrenMap[parent_id].push(rec);
    }
   
    var visibleChoices = [];
    if (includeNone != false)
        visibleChoices.push(["", null, null]); 
    var filter = function(recs, prefix) {
        if (recs != null) {
            var childPrefix = prefix + '&nbsp;&nbsp;&nbsp;';     // change prefix format of visibleChoices here.
            for (var i = 0; i < recs.length; i++) {
                var id = recs[i].id;
                var styleOption = 'color:' + recs[i].color;
                if (id != currRecordId) {
                    visibleChoices.push([ prefix + TrimPath.junctionUtil.escape(recs[i].name), id, styleOption ]);
                    filter(childrenMap[id], childPrefix);
                }
            }
        }
    }
    filter(childrenMap['TOP_LEVEL'], ''); 
    return visibleChoices;
}

topLevels = function(cache, modelClass, modelName, moreSql) { 
    // Returns all the top-level records.
    cache = cache || {};
    var cacheName = 'topLevels_' + modelName;
    var result = cache[cacheName];
    if (result == null)
        result = cache[cacheName] = modelClass.findActive('all', {
                 conditions: TrimPath.junctionUtil.upperFirst(modelName) + ".parent_" + 
                             TrimPath.junctionUtil.lowerFirst(modelName) + "_id IS NULL" + (moreSql || ''),
                 order: TrimPath.junctionUtil.upperFirst(modelName) + ".name ASC"
        });        
    return result;
}

concatTree = function(record, results, prefix, childrenMap) {
    record.namePrefix = prefix;
    results.push(record);

    var children = childrenMap[record.id];
    if (children != null) {
        var childPrefix = prefix + '&nbsp;&nbsp;&nbsp;';     // change prefix format here.
        for (var i = 0; i < children.length; i++) 
            concatTree(children[i], results, childPrefix, childrenMap);
    }
}

allLevels = function(cache, modelClass, modelName, conditionsSql) {
    // Returns an array of all records, with a piggyback "namePrefix" in any character
    // that shows the effective name of each record in the hierarchy.  For example...
    //   @home
    //    -- @backyard
    //   @office
    //   @shopping
    //    -- @groceries
    //    -- @walmart
    //
    cache = cache || {};
    
    var cacheName = 'allLevels_' + modelName;
    var results = cache[cacheName];
    var modelNameCap  = TrimPath.junctionUtil.upperFirst(modelName);
    if (results == null) {
        var childMap            = {}; // Hash, keyed by modelName_Id, value is an array of child modelName.
        var parent_modelName_id = 'parent_' + TrimPath.junctionUtil.lowerFirst(modelName) + '_id';        

        var activeRecords = modelClass.findActive('all', {
                conditions : conditionsSql,
                order      : modelNameCap + '.' + parent_modelName_id + ' ASC, ' + modelNameCap  + '.name ASC'
            });
        
        for (var i = 0; i < activeRecords.length; i++) {
            var rec = activeRecords[i];
            var parent_id = rec[parent_modelName_id];
            if (parent_id != null) {
                childMap[parent_id] = childMap[parent_id] || [];
                childMap[parent_id].push(rec);
            }
        }

        var results = cache[cacheName] = [];
        var levels = topLevels(cache, modelClass, modelName, 
                               (conditionsSql != null ? (' AND ' + conditionsSql) : null));
        for (var topIndex = 0; topIndex < levels.length; topIndex++) {
            concatTree(levels[topIndex], results, '', childMap);
        }
    }
    return results;
}

deactivateTree = function(rec, childrenGetterName) {
    if (rec == null)
        return;

    var children = rec[childrenGetterName]();
    for (var i = 0; i < children.length; i++) {
        deactivateTree(children[i], childrenGetterName);
    }

    deactivateActions(rec);
    rec.deactivate();
}

deactivateActions = function(rec) {
    var actions = rec.getActions();
    if (actions != null) {
        for (var i = 0; i < actions.length; i++)
            actions[i].deactivate();
    }
}

modelToolTip = function(modelObj, modelName, res) {
    var modelNameToolTip = modelName + 'ToolTip';
    var opt = opt || {};
    
    opt.style = colorStyle(modelObj);
    
    opt.onmouseover = eval(modelNameToolTip)(modelObj, res);
    opt.onmouseout  = "domTT_close(this)";
    opt.onclick     = "domTT_close(this)";
    return opt;
}

// Color helper functions...
//
colorPrep = function(color) {
    if (color == null || color.length <= 0)
        return 'black';
    return color;
}

colorStyle = function(obj) {
    return 'color:' + colorPrep(obj.color) + ';'
}

colorChoicesHelper = function(color, colorText, colorValue) {
    colorText  = colorText || color;
    colorValue = colorValue || color;
    return [ colorText, colorValue, { style: 'color:' + color + ';' } ];
}

colorChoices = [ [ 'default', null, { style: 'color:black;' } ], 
                 'black', 'red', 'blue', 'green', 'purple', 'orange', 'grey', 'brown' ];

for (var i = 1; i < colorChoices.length; i++)
    colorChoices[i] = colorChoicesHelper(colorChoices[i]);

// some special character &#8718; &#9644; &#9473;   
// &#9608; => full block;  
// &#9607; => seven eighths block
