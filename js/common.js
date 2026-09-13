/**
 * common.js —— 公共工具函数模块
 * 所有页面均可调用，避免重复定义
 * 提供：表单验证 / localStorage 封装 / 时间格式化 / 提示弹窗
 */

/* 使用 IIFE 封装，避免全局变量污染（任务书 JS 规范要求） */
(function (global) {
    'use strict';

    /* ============================================================
     * 1. 表单验证工具
     * ============================================================ */

    /**
     * 验证手机号格式（中国大陆 11 位手机号）
     * @param {string} phone 待验证手机号
     * @returns {boolean} 是否合法
     */
    function validatePhone(phone) {
        if (typeof phone !== 'string') return false;
        var reg = /^1[3-9]\d{9}$/;
        return reg.test(phone.trim());
    }

    /**
     * 验证邮箱格式
     * @param {string} email 待验证邮箱
     * @returns {boolean} 是否合法
     */
    function validateEmail(email) {
        if (typeof email !== 'string') return false;
        var reg = /^[\w.-]+@[\w-]+(\.[\w-]+)+$/;
        return reg.test(email.trim());
    }

    /**
     * 验证密码强度（长度 ≥ 6 位）
     * @param {string} pwd 密码
     * @returns {boolean} 是否合法
     */
    function validatePassword(pwd) {
        return typeof pwd === 'string' && pwd.length >= 6;
    }

    /* ============================================================
     * 2. localStorage 封装（存 / 读 / 改 / 删 完整流程）
     * ============================================================ */

    var StorageUtil = {
        /**
         * 写入数据（自动 JSON 序列化）
         * @param {string} key 键名
         * @param {*} value 值
         */
        set: function (key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('[StorageUtil.set] 写入失败：', e);
            }
        },

        /**
         * 读取数据（自动反序列化）
         * @param {string} key 键名
         * @param {*} defaultValue 默认值
         * @returns {*}
         */
        get: function (key, defaultValue) {
            try {
                var raw = localStorage.getItem(key);
                return raw === null ? defaultValue : JSON.parse(raw);
            } catch (e) {
                console.warn('[StorageUtil.get] 读取失败：', e);
                return defaultValue;
            }
        },

        /**
         * 删除指定键
         * @param {string} key 键名
         */
        remove: function (key) {
            localStorage.removeItem(key);
        },

        /**
         * 清空全部（谨慎使用）
         */
        clear: function () {
            localStorage.clear();
        }
    };

    /* ============================================================
     * 3. 时间格式化
     * ============================================================ */

    /**
     * 将 Date / 时间戳格式化为 YYYY-MM-DD HH:mm
     * @param {Date|number|string} date 日期
     * @returns {string}
     */
    function formatTime(date) {
        var d = new Date(date);
        if (isNaN(d.getTime())) return '';
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
            + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    /* ============================================================
     * 4. 消息提示（封装 Element Plus 或原生 alert）
     * ============================================================ */

    /**
     * 轻提示
     * @param {string} msg 消息内容
     * @param {'success'|'warning'|'error'|'info'} type 类型
     */
    function toast(msg, type) {
        if (global.ElementPlus && ElementPlus.ElMessage) {
            ElementPlus.ElMessage({ message: msg, type: type || 'success' });
        } else {
            alert(msg);
        }
    }

    /**
     * 确认对话框
     * @param {string} msg 提示内容
     * @returns {Promise<boolean>}
     */
    function confirmDialog(msg) {
        if (global.ElementPlus && ElementPlus.ElMessageBox) {
            return ElementPlus.ElMessageBox.confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () { return true; }).catch(function () { return false; });
        }
        return Promise.resolve(confirm(msg));
    }

    /* ============================================================
     * 5. 用户管理（localStorage 模拟）
     * ============================================================ */
    var USERS_KEY = 'moxiang_users';
    var LOGIN_KEY = 'moxiang_login_user';

    var UserUtil = {
        /** 获取全部用户 */
        getAll: function () {
            return StorageUtil.get(USERS_KEY, []);
        },

        /** 按账号（用户名或邮箱）查找用户 */
        findByAccount: function (account) {
            var users = this.getAll();
            var lower = (account || '').toLowerCase();
            return users.find(function (u) {
                return u.username.toLowerCase() === lower ||
                    u.email.toLowerCase() === lower;
            }) || null;
        },

        /** 按用户名查找 */
        findByUsername: function (username) {
            var users = this.getAll();
            var lower = (username || '').toLowerCase();
            return users.find(function (u) {
                return u.username.toLowerCase() === lower;
            }) || null;
        },

        /** 按邮箱查找 */
        findByEmail: function (email) {
            var users = this.getAll();
            var lower = (email || '').toLowerCase();
            return users.find(function (u) {
                return u.email.toLowerCase() === lower;
            }) || null;
        },

        /** 新增用户（返回是否成功） */
        add: function (user) {
            var users = this.getAll();
            users.push(user);
            StorageUtil.set(USERS_KEY, users);
            return true;
        },

        /** 获取当前登录用户 */
        getCurrent: function () {
            return StorageUtil.get(LOGIN_KEY, null);
        },

        /** 设置登录态 */
        login: function (user) {
            var safe = {
                username: user.username,
                email: user.email,
                phone: user.phone || ''
            };
            StorageUtil.set(LOGIN_KEY, safe);
        },

        /** 退出登录 */
        logout: function () {
            StorageUtil.remove(LOGIN_KEY);
        }
    };

    /* ============================================================
     * 6. 暴露到全局
     * ============================================================ */
    global.Store = {
        validatePhone: validatePhone,
        validateEmail: validateEmail,
        validatePassword: validatePassword,
        storage: StorageUtil,
        user: UserUtil,
        formatTime: formatTime,
        toast: toast,
        confirm: confirmDialog
    };

})(window);
