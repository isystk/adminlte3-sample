
(function($) {
  /*
   * オーバーレイ表示
	 */
	$.fn.isystkOverlay = function(opts) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend({}, $.fn.isystkOverlay.defaults, opts);
		
		var init = function(panel) {

			panel.find('.js-close').click(function(e) {
				e.preventDefault();
				closeDialog();
			});

			// ダイアログ非表示
			var showDialog = this.showDialog = function() {
				$('body').append('<div id="overlay-background"></div>');
				$('#overlay-background').click(function() {
					closeDialog();
				});
				
				panel.addClass('open');
				$('#overlay-background').fadeIn();
				
				if (settings.openCallback) {
					settings.openCallback();
				}
			}
			
			// ダイアログ非表示
			var closeDialog = function() {
				loading = false;
				panel.removeClass('open');
				$('#overlay-background').fadeOut(500, function() {
					$(this).remove();
				});
				if (settings.closeCallback) {
					settings.closeCallback();
				}
			}

			return this;
		}

		$(this).each(function() {
			var self = $(this),
				panel = $(self.data('panel'));

			// パネルの表示位置を調整します。
			var adjustPanelPosition = function (){
				var h = $(window).height();
				var w = $(window).width();
				var ph = panel.height();
				var pw = panel.width();
				var top = $(window).scrollTop() + Math.floor((h - ph)/2);
				if ($(window).height() < panel.height()) {
					top = $(window).scrollTop();
				}
				var left = $(window).scrollLeft() + Math.floor((w - pw)/2);
				if ($(window).width() < panel.width()) {
					left = 0;
				}
				panel.css('top', top  + 'px');
				panel.css('left', left + 'px');
			}
			$(window).resize(function() {
				adjustPanelPosition();
			});

			// ボタン押下時にパネル表示
			self.click(function(e) {
				e.preventDefault();
				var obj = new init(panel);
				obj.showDialog();
				// 表示位置の調整
				adjustPanelPosition();
	
			});
		});

		return this;
	}

	$.fn.isystkOverlay.defaults = {
		closeCallback: null, // 画面を閉じた際のコールバック
		openCallback: null // 画面を開いた際のコールバック
	};

})(jQuery);


