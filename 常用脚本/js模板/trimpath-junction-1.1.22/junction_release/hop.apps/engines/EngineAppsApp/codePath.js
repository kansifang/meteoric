if (typeof(app) != 'undefined')
    app.addRepository('modules/junction/common.js');

function junctionCodePath_basic(info) {  
    // The basic codePath finding algorithm.
    //
    var codePath = info.appPath + '/code';

    // See if we have a /code.link file, which overrides the /code dir.
    // Its contents should be '[spaceKey]/[appKey]', like '100/nextaction'.
    //
    var pathLink = info.appPath + '/code.link';
    var codeLink = new java.io.File(pathLink);
    if (codeLink.exists() == true) {
        codeLink = global.junctionCommon.readTextFile(pathLink);
        codeLink = codeLink.replace(/^\s*(.*?)\s*$/, '$1'); // Trim whitespace.
        if (codeLink.match(/^\d+\/[a-z0-9]+$/) == null)
            throw new Error('bad code link format: ' + info.appUrl);

        codePath = info.spacesPath + '/' + codeLink + '/code';
        if (new java.io.File(info.checkPath(codePath)).exists() == false)
            throw new Error('bad code link target: ' + info.appUrl);
    }

    return codePath;
}
