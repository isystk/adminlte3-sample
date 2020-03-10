$(function() {

  // Loading画像
  $('#site_loader_overlay').fadeOut();

	// ページトップに戻るボタンを表示
	$('#page-top').click(function (e) {
		e.preventDefault();
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});

  // ドロワーメニュー
  (function() {
    $('#menu-btn').click(function(e) {
      e.preventDefault();
      var self = $(this),
          menu = $('#menu'),
          isOpen = menu.is(':visible');
      if (isOpen) {
        // クローズ
        menu.removeClass('open');
        menu.addClass('close');
      } else {
        // オープン
        menu.addClass('open');
        menu.removeClass('close');
      }

    });
  })();

  // オーバーレイ表示
  $('.js-overlay').overlay();

});



(function($) {
  /*
   * オーバーレイ表示
	 */
	$.fn.overlay = function(opts) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend({}, $.fn.overlay.defaults, opts);
		
		// パネルの表示位置を調整します。
		var adjustPanelPosition = function (){
			var h = $(window).height();
			var w = $(window).width();
			var ph = $('#sample').height();
			var pw = $('#sample').width();
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			$('#sample').css('top', scrollTop + Math.floor((h - ph)/2) + 'px');
			$('#sample').css('left', scrollLeft + Math.floor((w - pw)/2) + 'px');
		}
		$(window).resize(function() {
			adjustPanelPosition();
		});
	
		var init = function(panel) {

			panel.find('.js-close').click(function(e) {
				e.preventDefault();
				closeDialog();
			});

			// ダイアログ非表示
			var showDialog = this.showDialog = function() {
				if ($('#dialog-overlay').length === 0) {
					$('body').append('<div id="dialog-overlay"></div>');
					$('#dialog-overlay').click(function() {
						closeDialog();
					});
				}
	
				panel.addClass('open');
				$('#dialog-overlay').fadeIn();
				
				if (settings.openCallback) {
					settings.openCallback();
				}
			}
			
			// ダイアログ非表示
			var closeDialog = function() {
				loading = false;
				panel.removeClass('open');
				$('#dialog-overlay').fadeOut();
				if (settings.closeCallback) {
					settings.closeCallback();
				}
			}

			// 表示位置の調整
			adjustPanelPosition();

			return this;
		}

		$(this).each(function() {
			// ボタン押下時にパネル表示
			$(this).click(function(e) {
				e.preventDefault();
				var self = $(this),
					panel = $(self.data('panel'));
				var obj = new init(panel);
				obj.showDialog();
			});
		});

		return this;
	}

	$.fn.overlay.defaults = {
		closeCallback: null, // 画面を閉じた際のコールバック
		openCallback: null // 画面を開いた際のコールバック
	};

})(jQuery);


