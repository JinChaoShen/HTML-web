# 墨香书阁 · Web 前端在线书店

> Web 前端设计与开发实训 · 大作业项目

## 一、项目介绍

**墨香书阁** 是一个基于原生 HTML5 + CSS3 + JavaScript 构建的在线书店 Web 应用，综合运用 Element Plus 组件库、Vue3 响应式框架、ECharts 数据可视化等技术，实现了图书浏览、搜索、分类筛选、收藏、走马灯轮播、数据统计、多媒体播放等完整功能。

- **开发周期**：2026.9.7 — 2026.9.20
- **开发人数**：1 人（独立完成）
- **运行方式**：双击 `index.html` 即可在浏览器中打开首页（需联网加载 CDN 依赖）

## 二、技术栈清单

| 分类 | 技术 / 库 | 应用场景 |
|---|---|---|
| 结构 | HTML5 语义化标签 | header / nav / main / section / article / aside / footer |
| 样式 | CSS3（Flexbox + Grid） | 响应式布局、卡片网格、渐变、阴影、过渡、动画 |
| 交互 | 原生 JavaScript (ES6+) | 表单验证、事件绑定、DOM 操作、localStorage |
| 框架 | Vue 3 (CDN) | 响应式数据绑定、组件化渲染 |
| UI 库 | Element Plus (CDN) | 导航菜单、轮播、卡片、表单、按钮、消息提示 |
| 可视化 | ECharts | 销量折线图、分类占比饼图 |
| 网络 | Axios（选做） | 预留开源 API 调用入口 |
| 多媒体 | HTML5 audio / video | 书籍推荐视频、有声书片段 |

## 三、文件目录说明

```
Exam/
├── index.html              # 首页（项目入口）
├── README.md               # 项目说明文档
├── css/
│   ├── base.css            # 全局重置 + CSS 变量
│   ├── common.css          # 公共组件（头部/导航/底部）
│   └── page/
│       └── index.css       # 首页专属样式
├── js/
│   ├── common.js           # 工具函数（表单验证/localStorage封装/时间格式化）
│   ├── dom.js              # DOM 操作封装
│   └── page/
│       └── index.js        # 首页业务逻辑（Vue3 应用）
├── assets/
│   ├── images/             # 图片资源（banner / books / avatar / logo）
│   ├── media/
│   │   ├── audio/          # 音频资源
│   │   └── video/          # 视频资源
│   └── icons/              # 图标资源
└── lib/                    # 第三方库本地副本（当前使用 CDN）
```

## 四、核心功能

1. **书籍走马灯**：图书封面横向自动无缝滚动，hover 暂停，点击跳转详情
2. **图书浏览与分类筛选**：按文学/科幻/历史/计算机等分类动态过滤
3. **收藏功能**：收藏/取消收藏，localStorage 持久化，刷新后数据不丢失
4. **图书搜索**：顶部搜索框，非空校验后跳转列表页
5. **数据统计可视化**：ECharts 折线图（销量趋势）+ 饼图（分类占比）
6. **多媒体播放**：书籍推荐视频 + 有声书音频
7. **邮件订阅**：Element Plus Form 表单验证（邮箱正则、手机号正则）
8. **响应式布局**：适配 PC / 平板 / 手机
9. **回到顶部**：Element Plus Backtop 组件

## 五、资源占位说明

当前版本为演示骨架，以下资源使用在线占位图（picsum.photos）或预留路径，部署前需替换为本地资源：

| 占位项 | 当前位置 | 替换目标 |
|---|---|---|
| 网站 Logo | `picsum.photos/seed/moxiang-logo/...` | `assets/images/logo.png` |
| Banner 背景 | CSS 渐变（已可用） | `assets/images/banner/banner-01.webp` |
| 图书封面 | `picsum.photos/seed/{cover}/200/280` | `assets/images/books/{cover}.jpg` |
| 视频封面 | `picsum.photos/seed/book-video-poster/...` | `assets/media/video/poster.jpg` |
| 推荐视频 | `assets/media/video/book-recommend.mp4` | 实际视频文件 |
| 有声书音频 | `assets/media/audio/intro.mp3` | 实际音频文件 |

## 六、部署地址

（选做模块，部署后补充）

## 七、AI 编程辅助记录

| 时间 | 用途 |
|---|---|
| 2026-09 | 页面结构设计、CSS 样式生成、Vue3 逻辑编写辅助 |

## 八、问题与解决

1. **问题**：Element Plus 导航菜单在渐变背景下文字不可见。
   **解决**：在 `common.css` 中通过 `.main-nav__menu .el-menu-item` 选择器覆盖默认颜色为白色，并设置 hover/active 背景为半透明白色。

2. **问题**：flex 布局下长文本导致卡片溢出。
   **解决**：为 flex 子项设置 `min-width: 0`，并配合 `text-ellipsis` 工具类实现文本截断。

## 九、优化方向

- [ ] 接入 Axios 调开源图书 API，替换静态数据
- [ ] 使用 Vue3 组件化拆分头部、导航、卡片等模块
- [ ] 完成列表页、详情页、登录注册页、关于我们页（≥10 页）
- [ ] 添加单元测试与 ESLint 规范
- [ ] 部署到云服务器 / Vercel / GitHub Pages
