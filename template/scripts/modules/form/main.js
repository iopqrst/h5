/* 
 *  页面程序入口
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module) {

	//引用相关模块
	var $ = require('lib/zepto/zepto'), //Zepto模块
		$ = require('units/maskLayer'); //弹出层模块
	var app = require('modules/app/main'); //App模块
	var IScroll = require('lib/iscroll/iscroll'); //IScroll模块

	//获取页面模块jQuery对象
	var $formPages = $('.page-form');

	//对外提供接口
	module.exports = {
		//初始化
		init: function() {
			//初始化联系我们模块
			$formPages.each(function(i, item) {
				console.log('form init');
				//获取当前page页
				$page = $(item);

				//获取相关对象
				var $contactFormBox = $page.find('.m-contactForm');
				//判断是否存在
				if ($contactFormBox.length) {
					var $formContact = $contactFormBox.find('#formContact'),
						$btnSubmit = $formContact.find('.btn-submit');
					//应用遮罩层插件
					var $contactFormLayer = $page.find('.m-contactFormLayer').maskLayer(),
						$successTipLayer = $contactFormBox.find('.successTipLayer').maskLayer({
							closeButton: false
						}),
						$failedTipLayer = $contactFormBox.find('.failedTipLayer').maskLayer({
							closeButton: false
						});
					var contactFormLayer = $contactFormLayer.maskLayer('getPluginObject'),
						successTipLayer = $successTipLayer.maskLayer('getPluginObject'),
						failedTipLayer = $failedTipLayer.maskLayer('getPluginObject');

					//注册显示事件
					contactFormLayer.on('show', function() {
						//禁止app翻页
						app.disableFlipPage();
					});
					contactFormLayer.on('hide', function() {
						//启用app翻页
						app.enableFlipPage();
						//清除表单数据
						$formContact[0].reset();
						$btnSubmit.val('提交').prop('disabled', false);
					});

					$page.delegate('.m-contactUs .download', $.isPC ? 'click' : 'tap', function(e) {
						location.href = "http://www.bskcare.com/soft/sugar/index.php";
					});

					//点击联系我们时显示遮表单罩层
					$page.delegate('.m-contactUs .used', $.isPC ? 'click' : 'tap', function(e) {
						contactFormLayer.show();
						//注册表单滚动IScroll
						if (!window.form_contactFormLayer_iScrollFloag) {
							window.form_contactFormLayer_iScrollFloag = true;
							var $win = $(window);
							var formScroll = new IScroll($contactFormLayer[0]);
							$formContact.delegate('input, textarea', 'focus', function(e) {
								form_focus_input = this;
								setTimeout(function(e) {
									formScroll.refresh();
									formScroll.scrollToElement(form_focus_input);
								}, 100);
							});
							$win.on('resize', function() {
								$contactFormBox.css('margin-top', 120);
								setTimeout(function() {
									$contactFormBox.css('margin-top', 0);
									$contactFormBox.parent().css({
										'margin-top': 120,
										'padding-bottom': 120
									});
								}, 100);
								//修复ios下遮罩层内容不滚动
								if (window.navigator.userAgent.indexOf('iPhone') >= 0) {
									$contactFormLayer.css('height', window.innerHeight);
								}
								setTimeout(function(e) {
									formScroll.refresh();
									if (typeof(form_focus_input) == 'object') {
										formScroll.scrollToElement(form_focus_input);
									}
								}, 100);
							}).resize();
						}
					});
					//显示验证提示的方法
					function showValidateTip($input, msg) {
						var type = $('[name="name"]').prop('type');
						if (type != 'radio' && type != 'checkbox') {
							$input.data('value', $input.val()).val(msg).addClass('z-error');
							$input.blur();
						}
						$btnSubmit.val('请填写完整').prop('disabled', true);
						return false;
					}

					//注册验证和点击提交事件
					$formContact.delegate('input.z-error', 'focus', function(e) {
						var $input = $(this);
						$input.val($input.data('value')).removeClass('z-error');
						$btnSubmit.val('提交').prop('disabled', false);
					}).delegate('.btn-submit', $.isPC ? 'click' : 'tap', function(e) {
						if (!$btnSubmit.prop('disabled')) {
							$formContact.submit();
						}
					});

					//注册表单提交事件
					$formContact.on('submit', function(e) {
						e.preventDefault();
						//获取可能有的字段input
							$name = $formContact.find('input[name="username"]'), //姓名
							$tel = $formContact.find('input[name="mobile"]'); //电话
						if ($name.length && $.trim($name.val()).length == 0) {
							return showValidateTip($name, '请输入姓名！');
						}
						if ($tel.length && $.trim($tel.val()).length == 0) {
							return showValidateTip($tel, '请输入电话！');
						}
						//验证电话号码（手机号码）
						var telReg = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/ig;
						if (!telReg.test($tel.val())) {
							return showValidateTip($tel, '电话号码不正确！');
						}
						//Ajax提交表单
						$.ajax({
							url: $formContact.attr('action'),
							type: $formContact.attr('method'),
							data: $formContact.serialize(),
							dataType: 'json',
							success: function(data) {
								console.info(data);
								if (data && data.code && data.code == 1) {
									//显示提示并定时2s隐藏
									successTipLayer.show();
									setTimeout(function() {
										successTipLayer.hide();
										setTimeout(function() {
											contactFormLayer.hide();
											//清除输入的数据
											$formContact[0].reset();
										}, 800);
									}, 2000);
								} else {
									var msg = "";
									if(data && data.code && data.code === 3) {
										msg = "您已经提交过申请";
									}
									if(data && data.code && data.code === 2) {
										msg = "提交失败，请重新提交";
									}
									
									if(msg) {
										$failedTipLayer.find('p').html(msg);
										failedTipLayer.show();
									}
									setTimeout(function() {
										failedTipLayer.hide();
										setTimeout(function() {
											contactFormLayer.hide();
											//清除输入的数据
											$formContact[0].reset();
										}, 800);
									}, 2000);
								}
							},
							error: function(e) {
								alert($("input[data-fail-msg]").val());
							}
						});
					});
				}

				//注册激活时的事件
				$page.on('active', function(e) {
					console.log('form active');
				}).on('current', function(e) {
					console.log('form current');
				});
			});
		}
	}
});