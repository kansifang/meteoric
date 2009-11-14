runTests = function(testContext) {
  var a, b, c;

  with (testContext) {
    withDelay(3000,
      function() {
        log('hello world');

        assert(true);
        assert(true, 'hello world');
        // assert(false, 'bye, cruel world');
      },
      function() {
        a = Action.newInstance();
        a.name = "test1";
        assert(a.save());
      },
      function() {
        b = Action.find(a.id);
        log("a.id: " + a.id + ", b.id: " + b.id);
        assert(b && b.id == a.id);
      }
    );
  }
}
