(function(b){var c={linear:function(f,e,h,g){return h*f/g+e},easeIn:function(f,e,h,g){return h*(f/=g)*f+e},easeOut:function(f,e,h,g){return -h*(f/=g)*(f-2)+e},easeBoth:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f+e}return -h/2*((--f)*(f-2)-1)+e},easeInStrong:function(f,e,h,g){return h*(f/=g)*f*f*f+e},easeOutStrong:function(f,e,h,g){return -h*((f=f/g-1)*f*f*f-1)+e},easeBothStrong:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+e}return -h/2*((f-=2)*f*f*f-2)+e},elasticIn:function(g,e,k,j,f,i){if(g===0){return e}if((g/=j)==1){return e+k}if(!i){i=j*0.3}if(!f||f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}return -(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e},elasticOut:function(g,e,k,j,f,i){if(g===0){return e}if((g/=j)==1){return e+k}if(!i){i=j*0.3}if(!f||f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}return f*Math.pow(2,-10*g)*Math.sin((g*j-h)*(2*Math.PI)/i)+k+e},elasticBoth:function(g,e,k,j,f,i){if(g===0){return e}if((g/=j/2)==2){return e+k}if(!i){i=j*(0.3*1.5)}if(!f||f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}if(g<1){return -0.5*(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e}return f*Math.pow(2,-10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i)*0.5+k+e},backIn:function(f,e,i,h,g){if(typeof g=="undefined"){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+e},backOut:function(f,e,i,h,g){if(typeof g=="undefined"){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+e},backBoth:function(f,e,i,h,g){if(typeof g=="undefined"){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+e}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+e},bounceIn:function(f,e,h,g){return h-c.bounceOut(g-f,0,h,g)+e},bounceOut:function(f,e,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+e}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+e}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+e}}}return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+e},bounceBoth:function(f,e,h,g){if(f<g/2){return c.bounceIn(f*2,0,h,g)*0.5+e}return c.bounceOut(f*2-g,0,h,g)*0.5+h*0.5+e}};b.Motion=function(d,e){this.duration=e||1000;this.tween=d||"linear"};b.Motion.getTweens=function(){return c};var a=50;b.Motion.prototype=(function(){var d=function(h,g){var f=Array.prototype.slice.call(arguments).slice(2);if(typeof h=="function"){try{return h.apply(g||this,f)}catch(i){g.errors=g.errors||[];g.errors.push(i)}}};var e=function(){d(this.onTweening,this);if(this.current>=this.frames){this.stop();return d(this.onComplete,this)||this}else{++this.current;var h=arguments.callee,g=this;this.timer=setTimeout(function(){h.call(g)},a)}};return{init:function(){this.fps=this.fps||35;this.frames=Math.ceil((this.duration/1000)*this.fps);if(this.frames<1){this.frames=1}var g=("function"==typeof this.tween)?this.tween:c[this.tween]||c.linear;this.equation=function(h,f){return g((this.current/this.frames)*this.duration,h,f-h,this.duration)};a=this.duration/this.frames;d(this.onInit,this)},start:function(g){if(!this.paused){this.init();this.current=1;d(this.onStart,this)}var f=this;this.timer=setTimeout(function(){e.call(f)},a);return this},stop:function(){clearTimeout(this.timer)},sleep:function(){this.stop();this.paused=true;return d(this.onSleep,this)||this},wakeup:function(){this.start();this.paused=false;return d(this.onWakeup,this)||this}}})()})(window);
