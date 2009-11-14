if (global.junctionCommon == null)
    global.junctionCommon = {}

global.junctionCommon.checkPath = function(path) { // Safety check, but not existence check.            
    var bad = path.search(/\.\./);                 // Prevent '..' parent access.
    if (bad >= 0)
        throw new Error('bad path: ' + path.substring(bad));
    var bad = path.search(/[\/\\]\./);             // Prevent '/.svn' access.
    if (bad >= 0)
        throw new Error('wrong path: ' + path.substring(bad));
    return path;
}

global.junctionCommon.fileLastModified = function(file) {
    try {
        return Math.floor(file.lastModified() / 1000.0); // Matches ruby File.mtime.to_i output in seconds.
    } catch (ex) {
    }
    return 0;
}

global.junctionCommon.signWithSalt = function(str, salt) {
    return (str + '|' + (salt || 'sugar20070723')).md5();
}

global.junctionCommon.readTextFile = function(path) {
    // NOTE: Unlike File.readAll(), this function does UTF8 correctly.
    //
    var file   = new java.io.File(path);
    var reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(path), "UTF-8"));
    var length = file.length();
    var buffer = new java.lang.StringBuffer(length + 10);
    while (true) {
        var line = reader.readLine();
        if (line == null)
            break;
        if (buffer.length() > 0)
            buffer.append('\n');
        buffer.append(line);
    }
    reader.close();
    reader = null;
    return String(buffer);
}

global.junctionCommon.readBinaryFile = function(path) {
    // See: http://www.mozilla.org/rhino/ScriptingJava.html
    //      http://exampledepot.com/egs/java.io/File2ByteArray.html
    //      http://www.javafaq.nu/java-example-code-127.html
    var file   = new java.io.File(path);
    var stream = new java.io.FileInputStream(file);
    var length = file.length();
    var arr    = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length);

    var offset = 0;
    while (offset < arr.length) {
        var numRead = stream.read(arr, offset, arr.length - offset);
        if (numRead < 0)
            break;
        offset += numRead;
    }

    stream.close();
    stream = null;

    return arr;
}

global.junctionCommon.listDirRecursive = function(path, pattern) {
    var result = [];

    var worker = function(file) {
        if (!pattern || pattern.test(file.getName()))
            result.push(String(file.getAbsolutePath())); // Force to JS String for Rhino.

        if (file.isDirectory()) {
            for (var arr = file.list(), i = 0; i < arr.length; i++)
                worker(new java.io.File(file, arr[i]).getAbsoluteFile());
        }
    }

    // We sort because some platforms (possibly linux) might 
    // return files in unexpected order (subdirs first?).
    //
    worker(new java.io.File(path).getAbsoluteFile());

    return result.sort();
}
