/**
 * page/login.js —— 登录页逻辑
 * 覆盖：表单验证 / 用户校验 / localStorage 登录态
 */

(function () {
    'use strict';

    var { createApp, ref, reactive } = Vue;

    const app = createApp({
        setup() {
            const loginFormRef = ref(null);
            const loading = ref(false);
            const rememberMe = ref(false);

            const loginForm = reactive({
                account: '',
                password: ''
            });

            /* 验证规则 */
            const loginRules = {
                account: [
                    { required: true, message: '请输入邮箱或用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
                ]
            };

            /** 提交登录 */
            function handleLogin() {
                loginFormRef.value.validate(function (valid) {
                    if (!valid) return;

                    loading.value = true;

                    // 模拟网络请求延迟
                    setTimeout(function () {
                        var user = Store.user.findByAccount(loginForm.account.trim());

                        if (!user) {
                            loading.value = false;
                            Store.toast('账号不存在，请先注册', 'error');
                            return;
                        }
                        if (user.password !== loginForm.password) {
                            loading.value = false;
                            Store.toast('密码错误，请重新输入', 'error');
                            return;
                        }

                        // 登录成功
                        Store.user.login(user);
                        Store.toast('欢迎回来，' + user.username, 'success');

                        setTimeout(function () {
                            window.location.href = 'index.html';
                        }, 800);
                    }, 500);
                });
            }

            return {
                loginFormRef, loginForm, loginRules,
                rememberMe, loading, handleLogin
            };
        }
    });

    app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
    if (window.ElementPlusIconsVue) {
        for (var key in window.ElementPlusIconsVue) {
            app.component(key, window.ElementPlusIconsVue[key]);
        }
    }
    app.mount('#app');

})();
