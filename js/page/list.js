/**
 * 畅销排行页逻辑：动态生成排行列表，并使用原生 Canvas 绘图。
 */
(function () {
    'use strict';

    var books = [
        { title: '活着', author: '余华', price: 29, cover: 'book-huozhe' },
        { title: '三体', author: '刘慈欣', price: 23, cover: 'book-santi' },
        { title: '人类简史', author: '尤瓦尔·赫拉利', price: 48, cover: 'book-renlei' },
        { title: '百年孤独', author: '加西亚·马尔克斯', price: 39.5, cover: 'book-gudian' },
        { title: '长安的荔枝', author: '马伯庸', price: 28, cover: 'book-changan' },
        { title: '红楼梦', author: '曹雪芹', price: 59.7, cover: 'book-honglou' },
        { title: '浪潮之巅', author: '吴军', price: 69, cover: 'book-langchao' },
        { title: '置身事内', author: '兰小欢', price: 45, cover: 'book-zhishen' },
        { title: '时间简史', author: '史蒂芬·霍金', price: 35, cover: 'book-time' },
        { title: '设计模式', author: 'GoF', price: 59, cover: 'book-pattern' }
    ];

    function getCoverUrl(seed) {
        return 'https://picsum.photos/seed/' + seed + '/104/144';
    }

    function renderRanking() {
        var list = document.getElementById('rankingList');
        var fragment = document.createDocumentFragment();

        books.forEach(function (book, index) {
            var item = document.createElement('li');
            item.className = 'ranking-list__item';
            item.innerHTML =
                '<span class="ranking-list__number">' + (index + 1) + '</span>' +
                '<img class="ranking-list__cover" src="' + getCoverUrl(book.cover) + '" alt="' + book.title + ' 封面">' +
                '<div class="ranking-list__info">' +
                '<h3 class="ranking-list__title"><a href="detail.html?id=' + (index + 1) + '">' + book.title + '</a></h3>' +
                '<p class="ranking-list__meta">' + book.author + ' 著</p>' +
                '</div>' +
                '<span class="ranking-list__price">¥' + book.price.toFixed(2) + '</span>';
            fragment.appendChild(item);
        });

        list.appendChild(fragment);
    }

    function prepareCanvas(canvas) {
        var ratio = window.devicePixelRatio || 1;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        var context = canvas.getContext('2d');
        context.scale(ratio, ratio);
        return { context: context, width: width, height: height };
    }

    function drawSalesChart() {
        var canvas = document.getElementById('salesCanvas');
        var chart = prepareCanvas(canvas);
        var ctx = chart.context;
        var width = chart.width;
        var height = chart.height;
        var months = ['3月', '4月', '5月', '6月', '7月', '8月'];
        var online = [320, 420, 380, 510, 620, 780];
        var store = [220, 260, 240, 300, 350, 400];
        var padding = { left: 42, right: 20, top: 24, bottom: 38 };
        var max = 800;
        var xStep = (width - padding.left - padding.right) / (months.length - 1);
        var yScale = (height - padding.top - padding.bottom) / max;

        ctx.clearRect(0, 0, width, height);
        ctx.font = '12px Georgia, serif';
        ctx.strokeStyle = '#E8DCCB';
        ctx.fillStyle = '#9C8880';
        ctx.lineWidth = 1;

        for (var value = 0; value <= max; value += 200) {
            var y = height - padding.bottom - value * yScale;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            ctx.fillText(String(value), 8, y + 4);
        }

        months.forEach(function (month, index) {
            ctx.fillText(month, padding.left + index * xStep - 10, height - 14);
        });

        drawLine(ctx, online, '#B76E79', padding, xStep, yScale, height);
        drawLine(ctx, store, '#722ED1', padding, xStep, yScale, height);
    }

    function drawLine(ctx, values, color, padding, xStep, yScale, height) {
        ctx.beginPath();
        values.forEach(function (value, index) {
            var x = padding.left + index * xStep;
            var y = height - padding.bottom - value * yScale;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        values.forEach(function (value, index) {
            var x = padding.left + index * xStep;
            var y = height - padding.bottom - value * yScale;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    }

    function drawCategoryChart() {
        var canvas = document.getElementById('categoryCanvas');
        var chart = prepareCanvas(canvas);
        var ctx = chart.context;
        var centerX = chart.width / 2;
        var centerY = chart.height / 2 - 8;
        var radius = Math.min(chart.width, chart.height) * 0.32;
        var data = [
            { name: '文学', value: 335, color: '#B76E79' },
            { name: '科幻', value: 234, color: '#722ED1' },
            { name: '历史', value: 180, color: '#C9A96E' },
            { name: '计算机', value: 300, color: '#5C8D89' },
            { name: '艺术', value: 120, color: '#D4925A' }
        ];
        var total = data.reduce(function (sum, item) { return sum + item.value; }, 0);
        var start = -Math.PI / 2;

        ctx.clearRect(0, 0, chart.width, chart.height);
        data.forEach(function (item) {
            var end = start + item.value / total * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, start, end);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            start = end;
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.56, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFEFC';
        ctx.fill();
        ctx.fillStyle = '#3E2C25';
        ctx.font = 'bold 16px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('销售占比', centerX, centerY + 5);
        ctx.textAlign = 'start';
        data.forEach(function (item, index) {
            var x = 18 + (index % 3) * (chart.width - 36) / 3;
            var y = chart.height - 42 + Math.floor(index / 3) * 22;
            ctx.fillStyle = item.color;
            ctx.fillRect(x, y - 10, 10, 10);
            ctx.fillStyle = '#6B554D';
            ctx.font = '12px Georgia, serif';
            ctx.fillText(item.name, x + 16, y);
        });
    }

    function drawCharts() {
        drawSalesChart();
        drawCategoryChart();
    }

    renderRanking();
    drawCharts();
    window.addEventListener('resize', drawCharts);
}());
