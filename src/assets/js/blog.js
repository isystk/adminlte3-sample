$(function() {

	// ドロワーメニュー
	(function() {
			$('#menu-btn').click(function(e) {
				e.preventDefault();
				var self = $(this),
						menu = $('#menu');
				menu.addClass('open');
				menu.data('open', true);
				$('body').addClass('scroll-prevent');
				$('<div id="layer-panel"></div>')
					.css('height', $(document).height())
					.appendTo('body');
				$('#layer-panel').click(function(e) {
					e.preventDefault();
					$('#menu .menu-close-btn').trigger('click');
				});
			});
			$('#menu .menu-close-btn').click(function(e) {
				e.preventDefault();
				var self = $(this),
						menu = $('#menu');
				menu.removeClass('open');
				menu.data('open', false);
				$('body').removeClass('scroll-prevent');
				$('#layer-panel').remove();
			});
	})();

	// 動くマーカー線
	$(window).scroll(function (){
		$(".entry-content strong").each(function(){
			var position = $(this).offset().top;
			var scroll = $(window).scrollTop();
			var windowHeight = $(window).height();
			if (scroll > position - windowHeight){
				$(this).addClass('active');
			}
		});
	});

	// ページトップに戻るボタンを表示
	(function () {
		$('<span id="page-top" class="link"><a href="#"><i class="fas fa-chevron-up"></i></a></span>').appendTo('body');
		var topBtn = $('#page-top'),
			showFlg = false;
		var scroll = function (scrollTop) {
			if (scrollTop > 100) {
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

	// ソースコードの表示
	$('pre.wp-block-code').each(function() {
		var self = $(this),
			code = self.find('code'),
			text = code.text();
		self.addClass('prettyprint');
		self.addClass('linenums');
		code.empty().text(text);
	});
	prettyPrint();

	// ページ内インデックスナビゲーション
	$('#sticky-navigator').stickyNavigator({wrapselector: '.entry-content'});

	// 拡大画像スライダー
	$('.wp-block-gallery, .wp-block-image').zoomSlider({
		'animateType': $.fn.zoomSlider.ANIMATE_TYPE.SLIDE,
		'carousel': true,
		'isFullScreen': true,
		'slideCallBack': function(data) {
		}
	});
	$('.wp-block-gallery img, .wp-block-image img').addClass('link');

});

