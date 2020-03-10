

(function($){
	/*
	 * zoomSlider
	 *
	 * Copyright (c) 2014 iseyoshitaka 
	 *
	 * Sample:
	 * $('.js-zoomSlider').zoomSlider({}, function() {});
	 */

	$.fn.zoomSlider = function(options) {

		var params = $.extend({}, $.fn.zoomSlider.defaults, options);

		var className = "zoomSlider";
		
		// 初期設定
		var init = function(obj) {

			var screen = $(obj),
				targetClass = params.targetClass,
				target = screen.find(targetClass),
				animateType = params.animateType,
				slideSpeed = params.slideSpeed,
				carousel = params.carousel,
				autoSlide = params.autoSlide,
				autoSlideInterval = params.autoSlideInterval,
				hoverPause = params.hoverPause,
				slideCallBack = params.slideCallBack,
				openCallBack = params.openCallBack,
				maxPageNo = target.length;

			var nowLoading = true;
				
			if (target.length === 0) {
				return;
			}

			var gallery = $('.' + className);
			
			var index = 1;
			if (gallery) {
				index = gallery.length + 1;
			}

			// target を配列に分割する。
			var targetArray = [];
			(function() {
				var len = Math.floor(target.length / params.arrayCnt);
				if ((target.length % params.arrayCnt) !== 0) {
					len = len + 1;
				}
				for(var i=0; i < len; i++) {
					var j = i * params.arrayCnt;
					var p = target.slice(j, j + params.arrayCnt);
					targetArray.push(p);
				}
			})();


			// メインフレームを生成します。
			var makeFlame = function (index) {

				var mainFlame = $([
					'<div class="isystk-overlay">',
						'<a href="#" class="js-close close"></a>',
						'<div class="wrap">',
							'<div class="js-slider isystkSlider">',
								'<div class="view-layer">',
									'<ul class="parentKey">',
									'</ul>',
								'</div>',
								'<div>',
									'<p><a href="#" class="next-btn"></a></p>',
									'<p><a href="#" class="prev-btn"></a></p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'].join(''));

				mainFlame.attr('id', 'zoomSlider'+ index); 
				mainFlame.addClass(className);
				mainFlame.width($(window).width());
				
				$('body').append(mainFlame);

				return mainFlame;
			}

			// 子要素を生成します。
			var makeChild = function (mainFlame, page, callback) {

				var num = (function findArrayNum(page) {
					return Math.floor((page-1) / params.arrayCnt);
				})(page);

				var photos = [];

				/* ギャラリーに設定する画像データ配列を生成する */
				for (var i=0, len=mainFlame.targetArray[num].length; i<len; i++) {
					var target = $(mainFlame.targetArray[num][i]),
						image = target,
						imagePath = image.attr('src') || '',
						caption = image.attr('alt') || '';
					var data = {
						imagePath : imagePath,
						caption : caption
					};
					photos.push(data);
				}

				// 拡大写真パネルを生成する
				var li = $(_.map(photos, function(data) {
					return [
						'<li class="childKey">',
							'<img src="'+data.imagePath+'" alt="'+data.caption+'" />',
						'</li>'].join('');
				}).join(''));
				li.attr('array', num);
				li.each(function(i) {
					$(this).attr('pageno', (num*params.arrayCnt) + (i+1));
					if (i===0) {
						$(this).addClass('firstArray');
					}
					if (i===(li.length-1)) {
						$(this).addClass('lastArray');
					}
				});
				li.css('text-align', 'center')
					.css('margin-top', '0px');

				// 子要素の横幅を端末のwidthに設定
				li.width($(window).width());
				li.height($(window).height());

				var photos = li.find('img');
				var photoLength = photos.length;
				photos.each(function() {
					var photo = $(this),
						imagePath = photo.attr('src') || '';
					var img = $('<img>');
					img.on('load',function(){
							
							photo.attr('owidth', img[0].width);
							photo.attr('oheight', img[0].height);
							var x = Math.floor(photo.attr('oheight') * $(window).width() / photo.attr('owidth'));
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 <= margin) {
								photo.css('height', '').css('width', '100%');
							} else {
								photo.css('height', '100%').css('width', '');
							}
							if (photoLength !== 1) {
								photoLength--;
								return;
							}
							photos.unbind('load');

							callback(li);
						});
					img.attr('src', imagePath);
				});
			}

			// イベントバンドル
			var bundle = function(mainFlame) {

				var sliderAnimateType = '';
				if (animateType === ANIMATE_TYPE.NO) {
					sliderAnimateType = $.fn.isystkSlider.ANIMATE_TYPE.NO;
				} else if (animateType === ANIMATE_TYPE.FADE) {
					sliderAnimateType = $.fn.isystkSlider.ANIMATE_TYPE.FADE;
				} else if (animateType === ANIMATE_TYPE.SLIDE) {
					sliderAnimateType = $.fn.isystkSlider.ANIMATE_TYPE.SLIDE;
				} else if (animateType === ANIMATE_TYPE.ORIGINAL) {
					sliderAnimateType = $.fn.isystkSlider.ANIMATE_TYPE.FADE;
				}

				// 画像スライダー
				var slider = mainFlame.slider = mainFlame.find('.js-slider').isystkSlider({
					'parentKey': '.parentKey'
					, 'childKey': '.childKey'
					, 'shift': 1
					, 'isMouseDrag': true
					, 'isFullScreen': true
					, 'heightMaxScreen': true
					, 'animateType': sliderAnimateType
					, 'slideSpeed': slideSpeed
					, 'carousel': carousel
					, 'moment': false
					, 'autoSlide': autoSlide
					, 'autoSlideInterval': autoSlideInterval
					, 'hoverPause': hoverPause
					, 'slideCallBack': function(data) {

						var obj = $(data.obj),
							pageNo = parseInt(obj.attr('pageno')),
							arrayNo = parseInt(obj.attr('array'));

						// 画像上下の余白を調整する。
						prepareDisplay(pageNo);

						// 両端の場合はメインフレームに次の子要素を追加する。
						(function() {
							if (obj.hasClass('firstArray')) {
								var nextPageNo = pageNo - 1;
								if (nextPageNo < 1) {
									nextPageNo = maxPageNo;
								}
								if (mainFlame.find('.childKey[pageno="' + nextPageNo + '"]').length === 0) {
									makeChild(mainFlame, nextPageNo, function(li) {
										var nextArrayNo = parseInt(li.attr('array'));
										// LIタグの差し込み位置を算出
										var appendPos = findAppendPos(mainFlame, nextArrayNo);
										insertChild(mainFlame.find('.childKey.lastArray[array="'+appendPos+'"]'), li);
										if (nextArrayNo < arrayNo && obj.hasClass('cloned')) {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length*2);
										} else {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length);
										}

										// 画像上下の余白を調整する。
										prepareDisplay(pageNo);

										nowLoading = false;
									});
								}
							}
							if (obj.hasClass('lastArray')) {
								var nextPageNo = pageNo + 1;
								if (maxPageNo < nextPageNo) {
									nextPageNo = 1;
								}
								if (mainFlame.find('.childKey[pageno="' + nextPageNo + '"]').length === 0) {
									makeChild(mainFlame, nextPageNo, function (li) {
										var nextArrayNo = parseInt(li.attr('array'));
										insertChild(mainFlame.find('.childKey.lastArray[array="'+arrayNo+'"]'), li);
										if (arrayNo < nextArrayNo && !obj.hasClass('cloned')) {
											mainFlame.slider.refresh(pageNo, maxPageNo, 0);
										} else {
											mainFlame.slider.refresh(pageNo, maxPageNo, li.length);
										}

										// 画像上下の余白を調整する。
										prepareDisplay(pageNo);

										nowLoading = false;
									});
								}
							}
						})();

						nowLoading = false;
						if (slideCallBack) {
							slideCallBack(data);
						}
					}, 'resizeCallBack': function (data) {

						var obj = $(data.obj),
							pageNo = parseInt(obj.attr('pageno'));

						// 画像上下の余白を調整する。
						prepareDisplay(pageNo);

						mainFlame.css('width', $(window).width() + 'px');
					}
				});

				// 対象画像クリック時に拡大写真パネルを表示する
				screen.find(targetClass).each(function(i) {
					var target = $(this),
						pageNo = i+1;

					target.bind('click', function(e) {
						e.preventDefault();
						if (nowLoading) {
							return;
						}
						if (mainFlame.find('.childKey[pageno="' + pageNo + '"]').length === 0) {
							makeChild(mainFlame, pageNo, function(li) {
								var arrayNo = parseInt(li.attr('array'));
								// LIタグの差し込み位置を算出
								var appendPos = findAppendPos(mainFlame, arrayNo);
								insertChild(mainFlame.find('.childKey.lastArray[array="'+appendPos+'"]'), li);
								mainFlame.slider.refresh(null, maxPageNo, li.length);
								showPage(pageNo);
							});
						} else {
							showPage(pageNo);
						}
					});
				});

				// 拡大写真パネルスライダー 前ページクリック時
				mainFlame.find('.js-prevBtn').click(function(e) {
					e.preventDefault();
					if (nowLoading) {
						return;
					}
					nowLoading = true;
					mainFlame.slider.backPage();
				});

				// 拡大写真パネルスライダー 次ページクリック時
				mainFlame.find('.js-nextBtn').click(function(e) {
					e.preventDefault();
					if (nowLoading) {
						return;
					}
					nowLoading = true;
					mainFlame.slider.nextPage();
				});

			};

			// 画面表示を調整する。
			var prepareDisplay = function(pageNo) {
				mainFlame.slider.find('.childKey[pageno="' +pageNo+'"]').each(function() {
					// 余白の調整
					appendMargin();
				});
			}
				
			// 上下左右に余白を追加する。
			var appendMargin = function() {
				// 画面上下にマージン設定（画像）
				mainFlame.slider.find('.childKey img').each(function() {
					var photo = $(this),
						oheight = photo.attr('oheight') || 0,
						owidth = photo.attr('owidth') || 0;

					photo.closest('.childKey').css('padding-top', '');

					var x = Math.floor(oheight * $(window).width() / owidth);
					var padding = Math.floor(($(window).height() - x) / 2) || 0;
					if (0 < padding) {
						photo.closest('.childKey').css('padding-top', padding + 'px');
					} else {
						photo.closest('.childKey').css('padding-top', '0px');
					}
					
				});
			};
			
			// 次のDOMを追加する位置を算出します。
			var findAppendPos = function (mainFlame, n) {
				if(mainFlame.find('.childKey').length === 0) {
					return null;
				}
				n = n -1;
				if (n < 0) {
					n = mainFlame.targetArray.length -1;
				}
				if(mainFlame.find('.childKey[array="'+n+'"]').length === 0) {
					return findAppendPos(mainFlame, n);
				}
				return n;
			};

			// beforeDom の後に afterDom を追加します。
			var insertChild = function(beforeDom, afterDom) {
				beforeDom.each(function() {
					var s = $(this);
					var p = afterDom.clone(true);
					if (s.hasClass('cloned')) {
						p.addClass('cloned');
					}
					$(s).after(p);
				});
			};

			// 指定したページを表示します。
			var showPage = function(pageNo) {

				if (nowLoading) {
					return;
				}

				var pageNo = pageNo || 1;

				// 初期表示時のスクロール位置を保持しておく。
				defaultScrollTop = $(window).scrollTop();
				
				mainFlame.slider.changePage(pageNo);

			};

			var mainFlame = makeFlame(index);
			mainFlame.targetArray = targetArray;
			makeChild(mainFlame, 1, function(childFlame) {
				mainFlame.find('.parentKey').append(childFlame);
				bundle(mainFlame);
				nowLoading = false;
			});
			
			// オーバーレイのクリックイベントを設定
			target.each(function() {
				$(this).attr('data-panel', '#' + mainFlame.attr('id'));
			});
			target.isystkOverlay();

		};

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.zoomSlider.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2,
		ORIGINAL: 3
	};

	// デフォルト値
	$.fn.zoomSlider.defaults = {
		'targetClass': 'img' // 拡大する画像要素
		, 'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		, 'slideSpeed': 300 // スライド速度
		, 'carousel': false // ローテートさせるかどうか
		, 'autoSlide': false // 自動スライドさせるどうか
		, 'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		, 'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		, 'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		, 'openCallBack': null // 拡大表示後のコールバック
		, 'arrayCnt': 20 // 初期表示でロードする拡大画像内要素の数
	};

})(jQuery);

