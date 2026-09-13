/**
 * page/index.js —— 首页业务逻辑
 * 基于 Vue3 + Element Plus CDN 版
 * 覆盖技术点：
 *   - 响应式数据绑定 / 计算属性 / 条件渲染 / 列表渲染
 *   - localStorage：收藏
 *   - ECharts：折线图 + 饼图
 *   - 表单验证（邮箱 / 手机号）
 *   - 事件处理（点击 / 提交）
 */

(function () {
    'use strict';

    /* ============================================================
     * 0. 静态数据（模拟后端返回）
     * TODO: 后续接入 Axios 调开源 API 替换
     * ============================================================ */

    // 图书分类
    var CATEGORIES = [
        { id: 'lit',   name: '文学小说' },
        { id: 'sci',   name: '科幻奇幻' },
        { id: 'hist',  name: '历史人文' },
        { id: 'tech',  name: '计算机技术' },
        { id: 'art',   name: '艺术设计' },
        { id: 'biz',   name: '经济管理' }
    ];

    // 图书数据（cover 字段为占位图 seed，实际替换为 assets/images/books/xxx.jpg）
    var ALL_BOOKS = [
        { id: 1,  title: '活着',           author: '余华',           publisher: '作家出版社',   date: '2012-08', category: 'lit',  price: 29.00, oldPrice: 39.00, cover: 'book-huozhe',   desc: '余华代表作，讲述徐福贵苦难而坚韧的一生。' },
        { id: 2,  title: '三体',           author: '刘慈欣',         publisher: '重庆出版社',   date: '2008-01', category: 'sci',  price: 23.00, oldPrice: 23.00, cover: 'book-santi',    desc: '雨果奖获奖作品，中国科幻里程碑。' },
        { id: 3,  title: '百年孤独',        author: '加西亚·马尔克斯', publisher: '南海出版公司', date: '2011-06', category: 'lit',  price: 39.50, oldPrice: 55.00, cover: 'book-gudian',   desc: '魔幻现实主义文学的代表作。' },
        { id: 4,  title: '人类简史',        author: '尤瓦尔·赫拉利',   publisher: '中信出版社',   date: '2014-11', category: 'hist', price: 48.00, oldPrice: 68.00, cover: 'book-renlei',   desc: '从动物到上帝，重新审视人类历史。' },
        { id: 5,  title: '设计模式',        author: 'GoF',            publisher: '机械工业出版社', date: '2019-04', category: 'tech', price: 59.00, oldPrice: 79.00, cover: 'book-pattern',  desc: '可复用面向对象软件的基础。' },
        { id: 6,  title: '红楼梦',          author: '曹雪芹',         publisher: '人民文学出版社', date: '2008-07', category: 'lit',  price: 59.70, oldPrice: 69.00, cover: 'book-honglou',  desc: '中国古典四大名著之首。' },
        { id: 7,  title: '长安的荔枝',      author: '马伯庸',         publisher: '湖南文艺出版社', date: '2022-04', category: 'hist', price: 28.00, oldPrice: 42.00, cover: 'book-changan',  desc: '一骑红尘妃子笑的历史新解。' },
        { id: 8,  title: '置身事内',        author: '兰小欢',         publisher: '上海人民出版社', date: '2021-08', category: 'biz',  price: 45.00, oldPrice: 58.00, cover: 'book-zhishen',  desc: '中国政府与经济发展。' },
        { id: 9,  title: '深海',            author: '莫言',           publisher: '上海文艺出版社', date: '2019-10', category: 'lit',  price: 39.00, oldPrice: 49.00, cover: 'book-shenhai',  desc: '诺奖得主莫言长篇新作。' },
        { id: 10, title: '浪潮之巅',        author: '吴军',           publisher: '人民邮电出版社', date: '2019-07', category: 'tech', price: 69.00, oldPrice: 88.00, cover: 'book-langchao', desc: '信息时代的技术与企业兴衰。' },
        { id: 11, title: '艺术的故事',      author: '贡布里希',       publisher: '广西美术出版社', date: '2015-03', category: 'art',  price: 280.00, oldPrice: 320.00, cover: 'book-art',     desc: '经典艺术史入门读物。' },
        { id: 12, title: '时间简史',        author: '史蒂芬·霍金',     publisher: '湖南科学技术出版社', date: '2014-05', category: 'sci', price: 35.00, oldPrice: 45.00, cover: 'book-time',    desc: '宇宙学科普经典。' }
    ];

    // 三海报轮播 Banner（img 为占位，部署时替换为 assets/images/banner/banner-0X.webp）
    var BANNERS = [
        {
            title: '墨香书阁 · 新书季',
            desc: '精选好书，开启你的阅读之旅',
            img: 'https://picsum.photos/seed/banner-book-1/1200/420',
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: '文学经典 · 常读常新',
            desc: '从《活着》到《百年孤独》，感受文字的力量',
            img: 'https://picsum.photos/seed/banner-book-2/1200/420',
            bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
        },
        {
            title: '科幻世界 · 想象无界',
            desc: '《三体》《时间简史》带你仰望星空',
            img: 'https://picsum.photos/seed/banner-book-3/1200/420',
            bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
        }
    ];

    // 畅销榜（按 id 从 ALL_BOOKS 取前 10 本）
    var RANK_IDS = [1, 2, 4, 3, 7, 6, 10, 8, 12, 5];

    /* ============================================================
     * 1. Vue 应用
     * ============================================================ */
    var { createApp, ref, reactive, computed, onMounted, watch } = Vue;

    const app = createApp({
        setup() {
            /* ---------- 响应式状态 ---------- */
            const activeMenu = ref('home');
            const searchKeyword = ref('');
            const activeCategory = ref('all');

            const categories = ref(CATEGORIES);
            const banners = ref(BANNERS);

            // 全部图书
            const allBooks = ref(ALL_BOOKS);

            // 推荐图书（取前 6 本）
            const recommendBooks = computed(function () {
                return allBooks.value.slice(0, 6);
            });

            // 畅销榜
            const rankBooks = computed(function () {
                return RANK_IDS.map(function (id) {
                    return allBooks.value.find(function (b) { return b.id === id; });
                }).filter(Boolean);
            });

            // 按分类筛选后的图书列表
            const filteredBooks = computed(function () {
                if (activeCategory.value === 'all') return allBooks.value;
                return allBooks.value.filter(function (b) {
                    return b.category === activeCategory.value;
                });
            });

            /* ---------- localStorage：收藏 ---------- */
            const FAV_KEY = 'moxiang_fav';
            const favs = ref(Store.storage.get(FAV_KEY, []));

            // 当前登录用户
            const loginUser = ref(Store.user.getCurrent());

            // 收藏变化时自动持久化
            watch(favs, function (val) {
                Store.storage.set(FAV_KEY, val);
            }, { deep: true });

            /* ---------- 方法 ---------- */

            /** 根据 cover seed 生成占位封面图 URL
             *  TODO: 部署时替换为本地 assets/images/books/{cover}.jpg
             */
            function getCoverUrl(seed) {
                return 'https://picsum.photos/seed/' + seed + '/200/280';
            }

            /** 是否已收藏 */
            function isFav(id) {
                return favs.value.indexOf(id) !== -1;
            }

            /** 切换收藏（localStorage 增 / 删） */
            function toggleFav(id) {
                var idx = favs.value.indexOf(id);
                if (idx === -1) {
                    favs.value.push(id);
                    Store.toast('已加入收藏', 'success');
                } else {
                    favs.value.splice(idx, 1);
                    Store.toast('已取消收藏', 'info');
                }
            }

            /** 查看详情 */
            function viewDetail(book) {
                window.location.href = 'detail.html?id=' + book.id;
            }

            /** 搜索提交（带非空校验） */
            function handleSearch() {
                var kw = searchKeyword.value.trim();
                if (!kw) {
                    Store.toast('请输入搜索关键词', 'warning');
                    return;
                }
                window.location.href = 'list.html?keyword=' + encodeURIComponent(kw);
            }

            /** 导航菜单选择 */
            function handleMenuSelect(index) {
                activeMenu.value = index;
                var routeMap = {
                    home: 'index.html',
                    new: 'list.html?type=new',
                    rank: 'list.html?rank=top',
                    auth: 'login.html',
                    about: 'about.html'
                };
                if (routeMap[index]) {
                    window.location.href = routeMap[index];
                }
            }

            function goAuth() {
                window.location.href = 'login.html';
            }

            /** 退出登录 */
            function handleLogout() {
                Store.confirm('确定要退出登录吗？').then(function (ok) {
                    if (!ok) return;
                    Store.user.logout();
                    Store.toast('已退出登录', 'success');
                    setTimeout(function () {
                        window.location.reload();
                    }, 600);
                });
            }

            /* ---------- 订阅表单（Element Plus Form 验证） ---------- */
            const subscribeFormRef = ref(null);
            const subscribeForm = reactive({ email: '', phone: '' });
            const subscribeRules = {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { validator: function (rule, value, callback) {
                        if (value && !Store.validateEmail(value)) {
                            callback(new Error('邮箱格式不正确'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
                phone: [
                    { validator: function (rule, value, callback) {
                        if (value && !Store.validatePhone(value)) {
                            callback(new Error('手机号格式不正确'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            };

            function handleSubscribe() {
                subscribeFormRef.value.validate(function (valid) {
                    if (!valid) return;
                    Store.toast('订阅成功，感谢关注！', 'success');
                    subscribeForm.email = '';
                    subscribeForm.phone = '';
                });
            }

            /* ---------- ECharts 初始化 ---------- */
            function initSalesChart() {
                var el = document.getElementById('salesChart');
                if (!el || typeof echarts === 'undefined') return;
                var chart = echarts.init(el);
                chart.setOption({
                    title: { text: '近 6 个月销量趋势', left: 'center', textStyle: { fontSize: 14 } },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['线上销量', '门店销量'], bottom: 0 },
                    grid: { left: 40, right: 20, top: 50, bottom: 40 },
                    xAxis: {
                        type: 'category',
                        data: ['3月', '4月', '5月', '6月', '7月', '8月']
                    },
                    yAxis: { type: 'value', name: '册' },
                    series: [
                        {
                            name: '线上销量',
                            type: 'line',
                            smooth: true,
                            data: [320, 420, 380, 510, 620, 780],
                            itemStyle: { color: '#165DFF' },
                            areaStyle: { opacity: 0.15 }
                        },
                        {
                            name: '门店销量',
                            type: 'line',
                            smooth: true,
                            data: [220, 260, 240, 300, 350, 400],
                            itemStyle: { color: '#722ED1' }
                        }
                    ]
                });
                window.addEventListener('resize', function () { chart.resize(); });
            }

            function initCategoryPie() {
                var el = document.getElementById('categoryPie');
                if (!el || typeof echarts === 'undefined') return;
                var chart = echarts.init(el);
                chart.setOption({
                    title: { text: '分类销售占比', left: 'center', textStyle: { fontSize: 14 } },
                    tooltip: { trigger: 'item', formatter: '{b}: {c} 册 ({d}%)' },
                    legend: { bottom: 0 },
                    series: [{
                        name: '分类占比',
                        type: 'pie',
                        radius: ['40%', '65%'],
                        center: ['50%', '50%'],
                        data: [
                            { value: 335, name: '文学小说' },
                            { value: 234, name: '科幻奇幻' },
                            { value: 180, name: '历史人文' },
                            { value: 300, name: '计算机技术' },
                            { value: 120, name: '艺术设计' },
                            { value: 210, name: '经济管理' }
                        ],
                        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } }
                    }]
                });
                window.addEventListener('resize', function () { chart.resize(); });
            }

            /* ---------- 生命周期 ---------- */
            onMounted(function () {
                initSalesChart();
                initCategoryPie();
            });

            /* ---------- 暴露给模板 ---------- */
            return {
                activeMenu, searchKeyword, activeCategory,
                categories, banners,
                recommendBooks, rankBooks, filteredBooks,
                loginUser,
                getCoverUrl, isFav, toggleFav,
                viewDetail, handleSearch, handleMenuSelect, goAuth, handleLogout,
                subscribeFormRef, subscribeForm, subscribeRules, handleSubscribe
            };
        }
    });

    // 注册 Element Plus + 中文语言包
    app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });

    // 注册 Element Plus 图标（需引入 @element-plus/icons-vue 的 UMD 版本）
    if (window.ElementPlusIconsVue) {
        for (var key in window.ElementPlusIconsVue) {
            app.component(key, window.ElementPlusIconsVue[key]);
        }
    }

    app.mount('#app');

})();
