
$(function() {

	// 入力完了時に次のフォームへフォーカスを当てる
	$.autoFocus();
	
	// テキストエリア文字数カウント
	(function() {
		$('.js-textCounter').each(function() {
			var self = $(this),
				maxCount = self.text(),
				textarea = self.closest('.textarea-wrap').find('textarea');
			$.textCounter([
		   		{textSelector: textarea, labelSelector: self, count: maxCount}
			]);
		});
	})();

	// フォーカス時の処理
	(function() {
		var wrap = $('.form-section');
		var form = wrap.find('input,select,textarea');
		form.each(function() {
			var self = $(this);
			// フォーカスイン
			self.focus(function() {
				self.closest('div').addClass('active');
			});
			// フォーカスアウト
			self.blur(function(){
				wrap.find('div').removeClass('active');
			});
		});
	})();


});


(function($){
	/*
	 * autoFocus
	 *
	 * Description:
	 * 入力完了時に次のフォームへフォーカスを当てる機能を提供します
	 *
	 * Sample:
	 * 	$.autoFocus();
	 *
	 */
	// デフォルト値
	var options = {
		wrapselector  : document,
		textselector  : 'input,select,textarea'
	};

	$.autoFocus = function(opts) {

		// 引数に値が存在する場合、デフォルト値を上書きする
		$.extend(options, opts);

		var inputObj = $(options.wrapselector).find(options.textselector);

		$(options.wrapselector).delegate(options.textselector, 'change', function(event) {

			var self = $(this);

			// ラジオボタンとチェックボックスは対象外
			if (self.attr('type') === 'radio' || self.attr('type') === 'checkbox') {
				return;
			}

			inputObj = $(options.wrapselector).find(options.textselector);

			// 配列をループ処理
			$.each(inputObj, function(i, val) {
				if (i === inputObj.length-1) {
					return;
				}
				var target = $(inputObj[i]);
				var next = findNextObj(i);
				if (self.attr('name') === target.attr('name')) {
					next.focus();
				}
			});

			// 次の入力フォームを見つける。
			function findNextObj(idx) {
				if (inputObj.length <= idx) {
					return;
				}

				var target = $(inputObj[idx]);
				var targetName = target.attr('name');

				var next = $(inputObj[idx+1]);
				var nextName = next.attr('name');

				// 同じnameのフォームは飛ばす。
				if (targetName === nextName) {
					return findNextObj(++idx);
				} else {
					return next;
				}
			}

		});

		// 初期表示時にエラーが有る場合は該当項目にフォーカスを当てる
		inputObj.each(function() {
			var target = $(this);
			if (target.hasClass('error')) {
				target.focus();
				return false;
			}
		});

	}

})(jQuery);

(function($){
	/*
	 * textCounter
	 *
	 * Description:
	 * 文字数をカウントします
	 * 半角文字・スペース・改行、全角文字は1としてカウントします
	 */
	$.textCounter = function(selectors) {
		var s = selectors;
		for (var i = 0, len = s.length; i < len; i++) {
			var obj = s[i],
				elem = $(obj.textSelector),
				label = $(obj.labelSelector);

			// カウント数
			label.html(obj.count - getCount(elem.val()));

			// デフォルト色
			label.data('defaultcolor', label.css('color'));

			elem.bind('keyup', function(val) {
				var count = obj.count - getCount(elem.val());
				label.html(count);

				if (count <= 0) {
					label.css('color', '#FF0000');
				} else {
					label.css('color', label.data('defaultcolor'));
				}
			});
		}
	};

	function getCount(val) {
		if (val) {
			var str = val.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, " ");
			return str.replace(/\n/g, "\r\n").length;
		}
		return 0;
	}

})(jQuery);
