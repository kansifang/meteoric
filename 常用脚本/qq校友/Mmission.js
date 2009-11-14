var target_mission_id = -1;
function mission_start(var_mission_id){
    var call_back = function(txt){
        var tmp = txt.split('|');
        if (-1 == tmp[0]) {
            html_loading_frame(tmp[1]);
        }
        else 
            if (-3 == tmp[0]) {
                window.location.href = 'http://xiaoyou.qq.com/index.php?mod=mission';
            }
            else {
                var mission_li_html = tmp[1];
                J('#li_mission_' + var_mission_id).replaceWith(mission_li_html);
                target_mission_id = var_mission_id;
                pop_message_html = mission_pop_message_frame(var_mission_id);
                var option = {
                    no_cancel: true,
                    zIndex: 1000,
                    submit_callback: open_mission_window
                };
                global_frame_new('暑假任务档', pop_message_html, option);
            }
    }
    J.post_api("/index.php", {
        mod: "mission",
        act: "add",
        missoin_id: var_mission_id
    }, call_back);
}

function open_mission_window(){
    var_mission_id = target_mission_id
    var mission_state = J('#hid_mission_state_' + var_mission_id).attr('value');
    if (2 != mission_state) {
        var mission_url = J('#hid_mission_url_' + var_mission_id).attr('value');
        window.open(mission_url);
    }
}

function mission_user_reward(){
    var single = 0;
    var call_back = function(txt){
        var tmp = txt.split('|');
        var result_code = tmp[0];
        var msg = tmp[1];
        var var_mission_id = tmp[2];
        if (-2 == result_code) {
            html_error_frame('暑假任务档', msg);
        }
        else {
            html_loading_frame(msg);
        }
        single = 0;
    }
    if (0 == single) {
        single = 1;
        J.post_api("/index.php", {
            mod: "mission",
            act: "reward"
        }, call_back);
    }
    else {
        html_loading_frame('您的操作过于频繁，请稍后再试');
    }
}

function mission_pop_message_frame(var_mission_id){
    var mission_img_alt = J('#img_mission_' + var_mission_id).attr('alt');
    var mission_img_class = J('#img_mission_' + var_mission_id).attr('class');
    var mission_state = J('#hid_mission_state_' + var_mission_id).attr('value');
    var mission_description = J('#mission_title_' + var_mission_id).text();
    var mission_state_description = J('#hid_mission_progress_msg_' + var_mission_id).attr('value');
    var message_content_html = '<div class="pop_task">' +
    '<div class="pic_task">' +
    '<img id="img_mission_log" src="http://imgcache.qq.com/qzonestyle/xiaoyou_portal_v2/img/b.gif" alt="' +
    mission_img_alt +
    '" class="' +
    mission_img_class +
    '" />' +
    '</div>' +
    '<div class="inst_task">' +
    '<p><strong><span id="pop_mission_description">' +
    mission_description +
    '<span></strong></p>' +
    '<p class="c_tx2"><span id="pop_state_message">' +
    mission_state_description +
    '<span></p>' +
    '</div>' +
    '</div>';
    return message_content_html;
}/*  |xGv00|14925fecaa129c6d1aa8f1b3e2adef8e */

