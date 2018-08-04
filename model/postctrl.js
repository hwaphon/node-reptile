var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');

var LianJiaList = 'https://sh.lianjia.com/zufang/';


var PostControl = function() {

	var ep = new eventproxy();

	function buildUrl (city = 'sh') {
		let result = 'https://'
		result += city;
		result += '.lianjia.com/zufang/';
		return result;
	}

	this.getLJList = function (city, page) {
		return new Promise((resolve, reject) => {
			superagent.get(buildUrl(city) + 'pg' + page)
				.end(function (error, result) {
					var list = parseList(result);
					resolve(list);
				});
		});
	};

	function parseList (result) {
		var $ = cheerio.load(result.text);
		var list = [];
		$('.house-lst > li').each(function (index, element) {
			var $element = $(element);
			var id = $element.data('id');
			var image = $element.find('.pic-panel a img').data('img');
			var title = $element.find('.info-panel h2 a').text();
			var address = $element.find('.region').text();
			var house_type = $element.find('.zone span').text();
			var area = $element.find('.meters').text();
			var price = $element.find('.price .num').text();
			var tags = [];

			$element.find('.view-label span span').each(function (index, tag) {
				var text = $(tag).text();

				if (text && text!== '') {
					tags.push(text);
				}
			});

			list.push({
				id: id,
				image: image,
				title: title,
				address: address,
				house_type: house_type,
				area: area,
				price: price,
				tags: tags
			});
		});
		return list;
	};
	this.getLJFang = function (city, id) {
		return new Promise((resolve, reject) => {
			superagent.get(buildUrl(city) + id + '.html')
				.end(function (error, result) {
					var fang = parseFang(id, result);
					resolve(fang);
				});
		});
	};

	function parseFang (id, result) {
		var $ = cheerio.load(result.text);
		var title = $('.main').text();
		var price = $('.total').text();
		var area = $('.zf-room p:first-child').text().split('：')[1];
		var house_type = $('.zf-room p:nth-child(2)').text().split('：')[1];
		var floor = $('.zf-room p:nth-child(3)').text().split('：')[1];
		var address = $('.zf-room p:nth-child(7) a:first-of-type').text();
		var regin = $('.zf-room p:nth-child(8) a:first-of-type').text();
		var publish_time = $('.zf-room p:nth-child(9)').text().split('：')[1];
		var images = [];
		$('.thumbnail li img').each((index, element) => {
			var src = $(element).attr('src');

			if (src && src !== '') {
				images.push(src);
			}
		});
		var des = $('.sub').text();

		var fang = {
			id: id,
			title: title,
			price: price,
			area: area,
			house_type:house_type,
			floor,
			address,
			regin,
			publish_time,
			images,
			des
		};
		return fang;
	}
};

module.exports = PostControl;