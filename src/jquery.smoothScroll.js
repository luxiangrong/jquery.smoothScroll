/*
	Smooth Scroll v0.1 - 2014-04-29
	scroll the browser smooth
	(c) 2014 HanShan Snow - http://hanshansnow.sinaapp.com/
	license: http://www.opensource.org/licenses/mit-license.php
*/
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

(function ($) {
	var defaults = {
		step: 80,				//每次滚轮事件，页面滚动的距离
		during: 600,
		easing: 'swing',
		preventDefault: true,
		stopPropagation: true
	};

	var isFF = 'MozAppearance' in document.documentElement.style;

	$.fn.smoothScroll = function (options) {
		var opts = $.extend({}, $.fn.smoothScroll.defaults, options);
		return $(this).each(function () {
			var $this = $(this);
			_scrollable($this).on(isFF?'DOMMouseScroll':'mousewheel', function(e){
				if(opts.preventDefault) 
					e.preventDefault();
				var originalEvent = e.originalEvent;
				var delta = isFF ? originalEvent.detail : -(originalEvent.wheelDelta == undefined ? -originalEvent.deltaY: originalEvent.wheelDelta);
				delta  = delta / Math.abs(delta);
				
				if($(this).data('delta') == undefined) {
					var oldDelta = 0;
				} else {
					var oldDelta = parseInt($(this).data('delta'));
				}
				if(delta * oldDelta < 0) {
					oldDelta = 0;
				} 
				$(this).data('delta', oldDelta + delta);
				_animate($(this), {scrollTop: opts.step * (oldDelta + delta)}, {during: opts.during, easing: opts.easing});
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
		window.setTimeout(function(){
			$obj.data('delta', 0);
		},100);
		if(requestAnimationId) cancelAnimationFrame(requestAnimationId);
		if(props.scrollTop) {
			var oldScrollTop = $obj.scrollTop();
			var distance = props.scrollTop;
		}
		if(props.easing) {
			var easing = props.easing;
		} else {
			var easing = 'swing';
		}
		var start = 0, during = options.during, current = new Date().getTime(); 
		var _run = function(){
			start = new Date().getTime() - current;
			var newTop = $.easing[easing](0, start, oldScrollTop, distance, during);
			$obj.scrollTop(newTop);
			if (start < during) {
         		requestAnimationId = requestAnimationFrame(_run);
         	} else {
         		$obj.data('delta', 0);
         	} 
		};
		_run();
	}

	$.fn.smoothScroll.defaults = defaults;
}(jQuery));