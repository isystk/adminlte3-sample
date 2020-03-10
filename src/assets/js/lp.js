$(function() {

	// ページトップに戻るボタンを表示
	(function () {
		$('<span id="page-top" class="link"><a href="#"><i class="fas fa-chevron-up"></i></a></span>').appendTo('body');
		var topBtn = $('#page-top'),
			showFlg = false;
		var scroll = function (scrollTop) {
			if (scrollTop > 1000) {
				if (showFlg == false) {
					showFlg = true;
					topBtn.removeClass('hide');
				}
			} else {
				if (showFlg) {
					showFlg = false;
					topBtn.addClass('hide');
				}
			}
		} 
		//スクロールが100に達したらボタン表示
		$(window).scroll(function () {
			scroll($(this).scrollTop());
		});
		//スクロールしてトップ
		topBtn.click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 500);
			return false;
		});
		scroll($(window).scrollTop());
	}());

	// ページ内リンク
	$('.js-link').pageLink();
	
});


/*
 * pageLink
 *
 * Description:
 *  ページ内遷移が可能です。
 */
(function($){

	// デフォルト値
	var options = {
		margin_top : 0,
		speed : 600
	};

	$.fn.pageLink = function(opts, callback){

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend({}, options, opts);

		// 対象をJqueryオブジェクトに変換
		var to = $($(this).data('target'));
		if (!to || to.length === 0) {
			return;
		}

		$(this).bind('click', function(e) {
			// イベントをキャンセルする
			e.preventDefault();
			var to_top = ( to.offset().top - settings.margin_top);
			$('html, body').animate({scrollTop: to_top}, settings.speed, callback);
		});

		return this;
	};

})(jQuery);

