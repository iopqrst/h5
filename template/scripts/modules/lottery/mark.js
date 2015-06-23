define(function(require, exports, module) {
	var b = require('lib/zepto/zepto.js'),
		c = require('modules/lottery/lottery.js'),
		app = require('modules/app/main.js'),
		gaudio = require('units/globalAudio.js'),
		g = {
			init: function() {
				var a = b(".translate-front").data("open");
				if (1 == a) {
					app._isDisableFlipPage = true;
					var c = b("#j-mengban")[0],
						d = "/userfiles/info/img_010_01.jpg",
						h = b("#r-cover").val(),
						converType = "image",
						iwidth = 640,
						iheight = b(window).height(),
						
						l = g.start_callback;
					g.cover_draw(c, d, h, converType, iwidth, iheight, l)
				} else {
					g.start_callback();
				}
			},
			cover_draw: function(oNode, b, d, converType, width, height, h) {
				if (!(oNode.style.display.indexOf("none") > -1)) {
					var i = new c(oNode, d, converType, width, height, h);
					i.init()
				}
			},
			start_callback: function() {
				var a = b(".translate-front").data("open");
				if (1 == a) {
					if (b("#j-mengban").removeClass("z-show"), setTimeout(function() {
						app._isDisableFlipPage = false;
						gaudio.play();
						b("#j-mengban").addClass("f-hide")
					}, 1500), b(".u-arrow").removeClass("f-hide")) return;
					
				} else {
					b("#j-mengban").removeClass("z-show").addClass("f-hide");
				}
			}
		};

	b(window).on("load", function() {
		//获取对象
		var $appLoading = $('#app-loading');
		//控制隐藏/移除
		$appLoading.addClass('z-hide');
		$appLoading.on('webkitTransitionEnd', function(e) {
			$appLoading.remove();
		});
		
		g.init(); //初始化蒙版
		app.showPage(); //显示第一页图片
	});
});