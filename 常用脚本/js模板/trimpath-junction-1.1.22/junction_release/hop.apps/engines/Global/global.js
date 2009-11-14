// TODO: Consider sealing() things here, so that apps cannot affect each other.
//
function evalGlobal(str, srcName) {
    // Interesting here accessing Rhino innards from JavaScript,
    // a testament to Rhino's correctness in its Java bindings.
    // We favor using the lower-level evaluateString() for 
    // better debuggability to get error messages with line
    // numbers and filenames.
    //
    if (srcName != null &&
        typeof(Packages) != 'undefined') {
        var Context = Packages.org.mozilla.javascript.Context;
        if (Context != null) {
            var cx = Context.enter();
            try {
                // TODO: Pass in a real SecurityController instead of null.
                //
                return cx.evaluateString(global, str, srcName, 1, null);
            } finally {
                Context.exit();
            }
        }
    }
    
    // Default to a simple eval() with less debugging info.
    //
    return eval(str); // Ensures eval in global scope.
}
