(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
/*!
	Smooth Scroll v0.1 - 2014-04-29
	scroll the browser smooth
	(c) 2014 HanShan Snow - http://www.jacklmoore.com/zoom
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
	var defaults = {
		step: 100,				//每次滚轮事件，页面滚动的距离
		
		preventDefault: true,
		stopPropagation: true
	};

	$.smoothScroll = function() {
	};

	$.fn.smoothScroll = function (options) {
		var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
		return $(this).each(function () {
			
			var $this = $(this);
			$this.on('click', function(){
				scrollUp($this);
			});
			
		});
	};
	
	function scrollUp($dom) {
		var oldPos = {
			top: $dom.scrollTop(),
			left: $dom.scrollLeft()
		}
		console.log(oldPos);
		var start = 0, during = 500, current = new Date().getTime();
		var _run = function() {
	         start = new Date().getTime() - current;
	         var top = Tween.Sine.easeOut(start, oldPos.top, 100, during);
	         $dom.scrollTop(top);
	         if (start < during) {
	         	requestAnimationFrame(_run);
	         }
	    };
	    _run();
	}

	$.fn.smoothScroll.defaults = defaults;
}(jQuery));