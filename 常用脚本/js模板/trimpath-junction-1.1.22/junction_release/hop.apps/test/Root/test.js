function main_action() {
    res.write('hello ' + new Date());
}

function test_action() {
    res.write('hello ' + session.user);
}

function test2_action() {
    return;

x = java.net.InetAddress.getByName(req.data.http_remotehost)

    res.writeln(x + ' ' + java.net.InetAddress.getByName('127.0.0.1')
                  + ' ' + java.net.InetAddress.getByName('::1')
                  + ' ' + req.data.http_remotehost);
    res.writeln('<hr/>');
    res.writeln(req.getMethod());
    res.writeln('<hr/>');
    res.writeln(req.getCookies());
    res.writeln('<hr/>');
    res.writeln(req.getHeader('Accept'));
    res.writeln('<hr/>');
    res.writeln(req.getHeader('Cookie'));
    res.writeln('<hr/>');
    res.writeln(req.getPath());
    res.writeln('<hr/>');
    for (var k in req)
        res.writeln(k + ' ' + req[k] + '<br/>');
}
