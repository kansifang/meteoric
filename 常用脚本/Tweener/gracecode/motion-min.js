(function(B){
    var D = {
        linear: function(F, E, H, G){
            return H * F / G + E
        },
        easeIn: function(F, E, H, G){
            return H * (F /= G) * F + E
        },
        easeOut: function(F, E, H, G){
            return -H * (F /= G) * (F - 2) + E
        },
        easeBoth: function(F, E, H, G){
            if ((F /= G / 2) < 1) {
                return H / 2 * F * F + E
            }
            return -H / 2 * ((--F) * (F - 2) - 1) + E
        },
        easeInStrong: function(F, E, H, G){
            return H * (F /= G) * F * F * F + E
        },
        easeOutStrong: function(F, E, H, G){
            return -H * ((F = F / G - 1) * F * F * F - 1) + E
        },
        easeBothStrong: function(F, E, H, G){
            if ((F /= G / 2) < 1) {
                return H / 2 * F * F * F * F + E
            }
            return -H / 2 * ((F -= 2) * F * F * F - 2) + E
        },
        elasticIn: function(G, E, K, J, F, I){
            if (G == 0) {
                return E
            }
            if ((G /= J) == 1) {
                return E + K
            }
            if (!I) {
                I = J * 0.3
            }
            if (!F || F < Math.abs(K)) {
                F = K;
                var H = I / 4
            }
            else {
                var H = I / (2 * Math.PI) * Math.asin(K / F)
            }
            return -(F * Math.pow(2, 10 * (G -= 1)) * Math.sin((G * J - H) * (2 * Math.PI) / I)) + E
        },
        elasticOut: function(G, E, K, J, F, I){
            if (G == 0) {
                return E
            }
            if ((G /= J) == 1) {
                return E + K
            }
            if (!I) {
                I = J * 0.3
            }
            if (!F || F < Math.abs(K)) {
                F = K;
                var H = I / 4
            }
            else {
                var H = I / (2 * Math.PI) * Math.asin(K / F)
            }
            return F * Math.pow(2, -10 * G) * Math.sin((G * J - H) * (2 * Math.PI) / I) + K + E
        },
        elasticBoth: function(G, E, K, J, F, I){
            if (G == 0) {
                return E
            }
            if ((G /= J / 2) == 2) {
                return E + K
            }
            if (!I) {
                I = J * (0.3 * 1.5)
            }
            if (!F || F < Math.abs(K)) {
                F = K;
                var H = I / 4
            }
            else {
                var H = I / (2 * Math.PI) * Math.asin(K / F)
            }
            if (G < 1) {
                return -0.5 * (F * Math.pow(2, 10 * (G -= 1)) * Math.sin((G * J - H) * (2 * Math.PI) / I)) + E
            }
            return F * Math.pow(2, -10 * (G -= 1)) * Math.sin((G * J - H) * (2 * Math.PI) / I) * 0.5 + K + E
        },
        backIn: function(F, E, I, H, G){
            if (typeof G == "undefined") {
                G = 1.70158
            }
            return I * (F /= H) * F * ((G + 1) * F - G) + E
        },
        backOut: function(F, E, I, H, G){
            if (typeof G == "undefined") {
                G = 1.70158
            }
            return I * ((F = F / H - 1) * F * ((G + 1) * F + G) + 1) + E
        },
        backBoth: function(F, E, I, H, G){
            if (typeof G == "undefined") {
                G = 1.70158
            }
            if ((F /= H / 2) < 1) {
                return I / 2 * (F * F * (((G *= (1.525)) + 1) * F - G)) + E
            }
            return I / 2 * ((F -= 2) * F * (((G *= (1.525)) + 1) * F + G) + 2) + E
        },
        bounceIn: function(F, E, H, G){
            return H - D.bounceOut(G - F, 0, H, G) + E
        },
        bounceOut: function(F, E, H, G){
            if ((F /= G) < (1 / 2.75)) {
                return H * (7.5625 * F * F) + E
            }
            else {
                if (F < (2 / 2.75)) {
                    return H * (7.5625 * (F -= (1.5 / 2.75)) * F + 0.75) + E
                }
                else {
                    if (F < (2.5 / 2.75)) {
                        return H * (7.5625 * (F -= (2.25 / 2.75)) * F + 0.9375) + E
                    }
                }
            }
            return H * (7.5625 * (F -= (2.625 / 2.75)) * F + 0.984375) + E
        },
        bounceBoth: function(F, E, H, G){
            if (F < G / 2) {
                return D.bounceIn(F * 2, 0, H, G) * 0.5 + E
            }
            return D.bounceOut(F * 2 - G, 0, H, G) * 0.5 + H * 0.5 + E
        }
    };
    var A = function(){
        if ("function" == typeof this.onTweening) {
            this.onTweening.call(this)
        }
        if (this.current >= this.frames) {
            this.stop();
            if ("function" == typeof this.onComplete) {
                this.onComplete.call(this)
            }
            return
        }
        this.current++
    };
    B.Motion = function(F, E){
        this.duration = F || 1000;
        this.tween = E || "linear"
    };
    var C = B.Motion.prototype;
    C.init = function(){
        if ("function" == typeof this.onInit) {
            this.onInit.call(this)
        }
        this.fps = this.fps || 35;
        this.frames = Math.ceil((this.duration / 1000) * this.fps);
        if (this.frames < 1) {
            this.frames = 1
        }
        if ("function" != typeof D[this.tween]) {
            this.tween = "linear"
        }
        var E = D[this.tween];
        this.equation = function(G, F){
            return E((this.current / this.frames) * this.duration, G, F - G, this.duration)
        };
        this.current = 1
    };
    C.start = function(){
        this.init();
        if ("function" == typeof this.onStart) {
            this.onStart.call(this)
        }
        var E = this, F = this.duration / this.frames;
        this.timer = setInterval(function(){
            A.call(E)
        }, F)
    };
    C.stop = function(){
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.tweening = false
    }
})(window);
