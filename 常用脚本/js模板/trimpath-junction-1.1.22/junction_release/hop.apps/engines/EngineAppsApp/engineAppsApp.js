function main_action() { 
  res.charset = 'utf-8';

  return this.engineProcess(req, res, session, {
    globalEval : evalGlobal, 
    global     : global,
    props      : app.properties
  });
}
