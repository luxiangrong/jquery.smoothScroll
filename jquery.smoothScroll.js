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
		step: 120,				//每次滚轮事件，页面滚动的距离
		during: 600,
		preventDefault: true,
		stopPropagation: true
	};

	var isFF = 'MozAppearance' in document.documentElement.style;

	$.fn.smoothScroll = function (options) {
		var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
		return $(this).each(function () {
			var $this = $(this);
			_scrollable($this).on(isFF?'DOMMouseScroll':'mousewheel', function(e){
				if(opts.preventDefault) e.preventDefault();
				var originalEvent = e.originalEvent;
				var delta = isFF ? originalEvent.detail : -(originalEvent.wheelDelta == undefined ? -originalEvent.deltaY: originalEvent.wheelDelta);
				delta  = delta / Math.abs(delta);
				_animate($(this), {scrollTop: $(this).scrollTop() + opts.step * delta}, {during: opts.during});
			});
			
		});
	};
	
	//获取真正的滚轮事件可以绑定的元素对象
	function _scrollable($obj) {
		return $obj.map(function(){
			var elem = this,
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;
				if( !isWin )
					return elem;
			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			
			return $.browser.safari || doc.compatMode == 'BackCompat' ?
				doc.body : 
				doc.documentElement;
		});
	}
	
	//自定义动画函数
	var requestAnimationId;
	function _animate($obj, props, options){
		if(requestAnimationId) cancelAnimationFrame(requestAnimationId);
		if(props.scrollTop) {
			var oldScrollTop = $obj.scrollTop();
			var distance = props.scrollTop - oldScrollTop;
		}
		var start = 0, during = options.during, current = new Date().getTime(); 
		var _run = function(){
			start = new Date().getTime() - current;
			var newTop = Tween.Sine.easeOut(start, oldScrollTop, distance, during);
			$obj.scrollTop(newTop);
			if (start < during) {
         		requestAnimationId = requestAnimationFrame(_run);
         	}
		};
		_run();
	}

	$.fn.smoothScroll.defaults = defaults;
}(jQuery));