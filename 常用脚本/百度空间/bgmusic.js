function createActiveXObject(id){
    var error;
    var control = null;
    try {
        if (window.ActiveXObject) {
            control = new ActiveXObject(id)
        }
        else 
            if (window.GeckoActiveXObject) {
                control = new GeckoActiveXObject(id)
            }
    } 
    catch (error) {
    }
    return control
};
function detectWMP(){
    var wmpInfo = {
        installed: false,
        type: null
    };
    var wmp64 = "MediaPlayer.MediaPlayer.1";
    var wmp7 = "WMPlayer.OCX.7";
    if ((window.ActiveXObject && navigator.userAgent.indexOf('Windows') != -1)) {
        wmpInfo.type = "IE";
        var player = createActiveXObject(wmp7);
        if (player) {
            wmpInfo.installed = true;
            return wmpInfo
        }
        else {
            player = createActiveXObject(wmp64);
            if (player) {
                wmpInfo.installed = true;
                return wmpInfo
            }
            else {
                wmpInfo.versionInfo = "none";
                return wmpInfo
            }
        }
    }
    else 
        if (navigator.mimeTypes) {
            wmpInfo.type = "NS";
            var player = navigator.mimeTypes['application/x-mplayer2'].enabledPlugin;
            if (player) {
                wmpInfo.installed = true;
                return wmpInfo
            }
            return wmpInfo
        }
};
function creatbgmusic(murl, musicnum, IsMusicHide, IsMusicLoop, IsMusicAutoPlay, unknow, functype){
    var bgmusic1 = '<OBJECT id=phx width=100% classid=clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6 ' + (IsMusicHide ? "height=45" : "") + '>' + '<PARAM NAME="URL" VALUE="' + murl + '?t=' + Math.random() + '">' + ' <PARAM NAME="rate" VALUE="1">' + ' <PARAM NAME="balance" VALUE="0">' + ' <PARAM NAME="currentPosition" VALUE="0">' + ' <PARAM NAME="defaultFrame" VALUE="">' + ' <PARAM NAME="PlayCount" VALUE="' + (IsMusicLoop ? 100 : 0) + '">' + ' <PARAM NAME="DisplayMode" VALUE="0">' + ' <PARAM NAME="PreviewMode" VALUE="0">' + ' <PARAM NAME="DisplayForeColor" VALUE="16777215">' + ' <PARAM NAME="ShowCaptioning" VALUE="0">' + ' <PARAM NAME="ShowControls" VALUE="1">' + ' <PARAM NAME="ShowAudioControls" VALUE="1">' + ' <PARAM NAME="ShowDisplay" VALUE="0">' + ' <PARAM NAME="ShowGotoBar" VALUE="0">' + ' <PARAM NAME="ShowStatusBar" VALUE="0">' + ' <PARAM NAME="ShowTracker" VALUE="1">' + ' <PARAM NAME="autoStart" VALUE="' + (IsMusicAutoPlay ? 1 : 0) + '">' + ' <PARAM NAME="AutoRewind" VALUE="' + (IsMusicAutoPlay ? 1 : 0) + '">' + ' <PARAM NAME="currentMarker" VALUE="0">' + ' <PARAM NAME="invokeURLs" VALUE="0">' + ' <PARAM NAME="baseURL" VALUE="">' + ' <PARAM NAME="volume" VALUE="100">' + ' <PARAM NAME="mute" VALUE="0">' + ' <PARAM NAME="stretchToFit" VALUE="0">' + ' <PARAM NAME="windowlessVideo" VALUE="1">' + ' <PARAM NAME="enabled" VALUE="1">' + ' <PARAM NAME="EnableFullScreenControls" VALUE="0">' + ' <PARAM NAME="EnableTracker" VALUE="1">' + ' <PARAM NAME="EnablePositionControls" VALUE="1">' + ' <PARAM NAME="enableContextMenu" VALUE="0">' + ' <PARAM NAME="SelectionStart"  VALUE="0">' + ' <PARAM NAME="SelectionEnd" VALUE="0">' + ' <PARAM NAME="fullScreen" VALUE="0">' + ' <PARAM NAME="SAMIStyle" VALUE="">' + ' <PARAM NAME="SAMILang" VALUE="">' + ' <PARAM NAME="SAMIFilename" VALUE="">' + ' <PARAM NAME="captioningID" VALUE="">' + ' <PARAM NAME="Visualizations" VALUE="1">';
    if (musicnum <= 1) {
        bgmusic1 += ' <PARAM NAME="uiMode" VALUE="mini">'
    }
    bgmusic1 += '</OBJECT>';
    var bgmusic2 = '<EMBED src="' + murl + '?t=' + Math.random() + '" width="100%" ' + (IsMusicHide ? "height=45" : "") + ' type="application/x-mplayer2" invokeurls="0" autogotourl="false" autostart=' + (IsMusicAutoPlay ? 1 : 0) + ' loop=' + (IsMusicLoop ? 1 : 0) + ' quality="high"';
    if (musicnum <= 1) {
        bgmusic2 += 'showcontrols="1" showpositioncontrols="0" '
    }
    bgmusic2 += '> </EMBED>';
    var bgmusic3 = '<div id="m_bgmusic" class="modbox">Բδװwindows media player޷͸ÿռı֣<a href="http://www.baidu.com/s?wd=windows+media+player+%CF%C2%D4%D8&cl=3" target="_blank">زװ</a><br><br></div>';
    var bgmus = detectWMP();
    if (functype == 'FckMusicHelper') {
        if (bgmus.installed) {
            if (bgmus.type == "IE") {
                return bgmusic1;
            }
            else 
                if (bgmus.type == "NS") {
                    return bgmusic2;
                }
        }
        else {
            return bgmusic3;
        }
    }
    else {
        if (bgmus.installed) {
            if (bgmus.type == "IE") {
                document.write(bgmusic1)
            }
            else 
                if (bgmus.type == "NS") {
                    document.write(bgmusic2)
                }
        }
        else {
            document.write(bgmusic3)
        }
        return '';
    }
}
