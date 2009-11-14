HomeController = function() {}

HomeController.prototype.start = function(req, res) {
    res.redirectTo('contact', 'index');
}
