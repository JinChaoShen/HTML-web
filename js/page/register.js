/**
 * page/register.js —— 注册页逻辑
 * 覆盖：多字段验证 / 用户名邮箱唯一性 / 密码一致性 / localStorage 写入
 */

(function () {
    'use strict';

    var { createApp, ref, reactive } = Vue;

    const app = createApp({
        setup() {
            const registerFormRef = ref(null);
            const loading = ref(false);

            const registerForm = reactive({
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                agreed: false
            });

            /* 自定义校验器 */
            var validateUsername = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入用户名'));
                } else if (value.length < 2 || value.length > 16) {
                    callback(new Error('用户名长度为 2-16 位'));
                } else if (Store.user.findByUsername(value)) {
                    callback(new Error('该用户名已被注册'));
                } else {
                    callback();
                }
            };

            var validateEmail = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入邮箱'));
                } else if (!Store.validateEmail(value)) {
                    callback(new Error('邮箱格式不正确'));
                } else if (Store.user.findByEmail(value)) {
                    callback(new Error('该邮箱已被注册'));
                } else {
                    callback();
                }
            };

            var validatePhone = function (rule, value, callback) {
                if (value && !Store.validatePhone(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            };

            var validatePassword = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else if (!Store.validatePassword(value)) {
                    callback(new Error('密码至少 6 位'));
                } else {
                    callback();
                }
            };

            var validateConfirm = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请再次输入密码'));
                } else if (value !== registerForm.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            };

            var validateAgreed = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请先阅读并同意用户协议'));
                } else {
                    callback();
                }
            };

            const registerRules = {
                username: [{ validator: validateUsername, trigger: 'blur' }],
                email: [{ validator: validateEmail, trigger: 'blur' }],
                phone: [{ validator: validatePhone, trigger: 'blur' }],
                password: [{ validator: validatePassword, trigger: 'blur' }],
                confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }],
                agreed: [{ validator: validateAgreed, trigger: 'change' }]
            };

            /** 提交注册 */
            function handleRegister() {
                registerFormRef.value.validate(function (valid) {
                    if (!valid) return;

                    loading.value = true;

                    setTimeout(function () {
                        // 写入新用户
                        Store.user.add({
                            username: registerForm.username.trim(),
                            email: registerForm.email.trim(),
                            phone: registerForm.phone.trim(),
                            password: registerForm.password,
                            registerTime: new Date().toISOString()
                        });

                        // 自动登录
                        var newUser = Store.user.findByUsername(registerForm.username.trim());
                        Store.user.login(newUser);

                        Store.toast('注册成功，欢迎加入墨香书阁！', 'success');

                        setTimeout(function () {
                            window.location.href = 'index.html';
                        }, 800);
                    }, 500);
                });
            }

            return {
                registerFormRef, registerForm, registerRules,
                loading, handleRegister
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
