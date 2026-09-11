/**
 * dom.js —— DOM 操作通用封装
 * 提供：元素选择 / 创建元素 / 事件委托 / class 操作
 * 统一封装，减少重复代码
 */

(function (global) {
    'use strict';

    /* ============================================================
     * 1. 元素选择（简化 document.querySelector）
     * ============================================================ */

    /**
     * 选择单个元素
     * @param {string} selector CSS 选择器
     * @param {HTMLElement} [context=document] 查找上下文
     * @returns {HTMLElement|null}
     */
    function $(selector, context) {
        return (context || document).querySelector(selector);
    }

    /**
     * 选择多个元素
     * @param {string} selector CSS 选择器
     * @param {HTMLElement} [context=document] 查找上下文
     * @returns {HTMLElement[]}
     */
    function $$(selector, context) {
        return Array.prototype.slice.call(
            (context || document).querySelectorAll(selector)
        );
    }

    /* ============================================================
     * 2. 创建元素（批量创建，自动设置属性）
     * ============================================================ */

    /**
     * 创建 DOM 元素
     * @param {string} tag 标签名
     * @param {Object} [props] 属性集合（class/text/html/dataset/...）
     * @param {Array<Node|string>} [children] 子节点
     * @returns {HTMLElement}
     *
     * @example
     * var el = createEl('li', { class: 'item', textContent: 'hello' });
     */
    function createEl(tag, props, children) {
        var el = document.createElement(tag);
        if (props) {
            Object.keys(props).forEach(function (key) {
                var val = props[key];
                if (key === 'class') {
                    el.className = val;
                } else if (key === 'text') {
                    el.textContent = val;
                } else if (key === 'html') {
                    el.innerHTML = val;
                } else if (key === 'dataset' && typeof val === 'object') {
                    Object.keys(val).forEach(function (k) {
                        el.dataset[k] = val[k];
                    });
                } else if (key === 'style' && typeof val === 'object') {
                    Object.keys(val).forEach(function (k) {
                        el.style[k] = val[k];
                    });
                } else if (key.indexOf('on') === 0 && typeof val === 'function') {
                    el.addEventListener(key.slice(2), val);
                } else {
                    el.setAttribute(key, val);
                }
            });
        }
        if (Array.isArray(children)) {
            children.forEach(function (child) {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    el.appendChild(child);
                }
            });
        }
        return el;
    }

    /* ============================================================
     * 3. 事件委托（批量绑定子元素事件）
     * ============================================================ */

    /**
     * 在父元素上委托子元素事件
     * @param {HTMLElement} parent 父元素
     * @param {string} childSelector 子元素选择器
     * @param {string} eventType 事件类型（click/input/...）
     * @param {Function} handler 回调，参数为 (event, childEl)
     */
    function delegate(parent, childSelector, eventType, handler) {
        parent.addEventListener(eventType, function (e) {
            var target = e.target.closest(childSelector);
            if (target && parent.contains(target)) {
                handler.call(target, e, target);
            }
        });
    }

    /* ============================================================
     * 4. class 操作快捷方法
     * ============================================================ */

    function addClass(el, cls) {
        if (el) el.classList.add(cls);
    }

    function removeClass(el, cls) {
        if (el) el.classList.remove(cls);
    }

    function toggleClass(el, cls) {
        if (el) el.classList.toggle(cls);
    }

    /* ============================================================
     * 5. 暴露到全局
     * ============================================================ */
    global.DOM = {
        $: $,
        $$: $$,
        createEl: createEl,
        delegate: delegate,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass
    };

})(window);
