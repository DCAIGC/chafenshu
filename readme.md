# 🎓 查分数 - 2025年全国高考查分网站

[![GitHub stars](https://img.shields.io/github/stars/DCAIGC/chafenshu?style=flat-square)](https://github.com/DCAIGC/chafenshu/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DCAIGC/chafenshu?style=flat-square)](https://github.com/DCAIGC/chafenshu/network)
[![GitHub license](https://img.shields.io/github/license/DCAIGC/chafenshu?style=flat-square)](https://github.com/DCAIGC/chafenshu/blob/main/LICENSE)

> 🌟 **在线体验：[https://www.chafenshu.com](https://www.chafenshu.com)**

一个专为2025年高考考生打造的免费、开源的全国高考成绩查询导航网站。提供34个省市自治区的官方查分入口，帮助考生快速、安全地查询高考成绩。

## ✨ 项目特色

- 🚀 **纯静态网站** - 极快的加载速度，无需服务器部署
- 🔒 **安全可靠** - 直链官方教育考试院，避免虚假查分网站
- 📱 **响应式设计** - 完美适配手机、平板、电脑各种设备
- 🎯 **SEO优化** - 完整的搜索引擎优化，方便考生找到
- 🔄 **易于维护** - 提供自动化脚本，轻松更新省份数据
- 🆓 **完全免费** - 开源项目，永久免费使用

## 🚀 功能特性

### 🏠 首页功能
- **智能搜索** - 支持省份名称、简称快速搜索
- **查分日历** - 可视化展示各省份查分时间安排
- **地区筛选** - 按华北、华东等地区分类浏览
- **实时状态** - 显示各省份查分开放状态

### 📄 省份页面
- **多种查询方式** - 官网、微信小程序、APP等多渠道展示
- **详细信息** - 查分时间、咨询电话、官方机构等完整信息
- **查分指南** - 详细的操作步骤和注意事项
- **SEO友好** - 每个省份独立页面，便于搜索引擎收录

### 📖 查分指南
- **详细流程** - 图文并茂的查分操作指南
- **常见问题** - 准考证丢失、网站打不开等问题解答
- **防诈骗提醒** - 帮助考生识别虚假查分网站

## 🛠 技术栈

- **前端框架**: 纯HTML5 + CSS3 + JavaScript
- **CSS框架**: [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS框架
- **图标**: Emoji + Unicode字符
- **开发工具**: [Cursor](https://cursor.sh/) - AI编程助手
- **构建工具**: 无需构建，直接运行
- **部署**: 支持GitHub Pages、Netlify、Vercel等静态托管

## 📁 项目结构

```
chafenshu/
├── index.html              # 首页
├── guide.html              # 查分指南页面
├── sitemap.xml             # 网站地图
├── robots.txt              # 搜索引擎爬虫配置
├── provinces/              # 省份页面目录
│   ├── beijing.html        # 北京查分页面
│   ├── shanghai.html       # 上海查分页面
│   └── ...                 # 其他31个省份页面
├── assets/                 # 静态资源
│   └── js/                 # JavaScript文件
│       ├── data.js         # 省份数据配置
│       ├── main.js         # 主要逻辑
│       ├── search.js       # 搜索功能
│       └── calendar.js     # 日历功能
├── backup/                 # 数据备份目录
├── docs/                   # 项目文档
├── generate_provinces.py   # 省份页面生成脚本
├── update_data.py          # 数据验证更新脚本
├── scripts_README.md       # 脚本使用说明
└── readme.md              # 项目说明文档
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/DCAIGC/chafenshu.git
cd chafenshu
```

### 2. 本地运行

由于是纯静态网站，直接用浏览器打开 `index.html` 即可

## 🔧 维护和更新

### 更新省份数据

1. **编辑数据文件**
   ```bash
   # 编辑省份数据
   vim assets/js/data.js
   ```

2. **验证数据完整性**
   ```bash
   python update_data.py
   ```

3. **重新生成省份页面**
   ```bash
   python generate_provinces.py
   ```

4. **一键更新**（Windows）
   ```bash
   update_pages.bat
   ```

   **一键更新**（Linux/Mac）
   ```bash
   ./update_pages.sh
   ```

### 数据格式说明

```javascript
{
    id: 'beijing',                                    // 省份ID
    name: '北京',                                     // 省份名称
    shortName: '京',                                 // 省份简称
    region: '华北',                                  // 所属地区
    queryUrl: 'https://query.bjeea.cn/',           // 查分链接
    queryDate: '2025-06-23',                        // 查分日期
    queryTime: '09:00',                             // 查分时间
    examBoard: '北京教育考试院',                     // 考试机构
    phone: '010-82837100',                          // 咨询电话
    description: '网站查询、微信小程序"京通"、APP"京学通"' // 查询方式
}
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 本项目
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 **Pull Request**

### 贡献类型

- 🐛 **Bug修复** - 修复网站错误或问题
- 📊 **数据更新** - 更新省份查分信息
- ✨ **新功能** - 添加有用的新功能
- 📝 **文档改进** - 完善文档和说明
- 🎨 **UI优化** - 改进界面设计和用户体验

### 数据更新贡献

如果您发现某个省份的查分信息有误，请：

1. 在 [Issues](https://github.com/DCAIGC/chafenshu/issues) 中报告问题
2. 提供准确的官方信息来源
3. 或直接提交 Pull Request 修正数据

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议，这意味着：

- ✅ 可以自由使用、修改、分发
- ✅ 可以用于商业目的
- ✅ 必须保留原始许可证和版权声明
- ❌ 不提供任何担保

## 🎯 2025年查分时间表

| 日期 | 省份 |
|------|------|
| 6月23日 | 北京、天津、内蒙古、上海、江西、四川、云南、宁夏 |
| 6月24日 | 河北、山西、辽宁、黑龙江、江苏、安徽、福建、广西、重庆、贵州、陕西、新疆 |
| 6月25日 | 吉林、浙江、山东、河南、湖北、湖南、广东、海南、西藏、甘肃、青海 |

## ⚠️ 免责声明

- 本网站仅提供官方查分入口导航服务
- 所有查分链接均为各省教育考试院官方网站
- 查分结果以官方公布为准，本站不承担任何责任
- 请考生通过官方渠道查询，谨防诈骗

## 📋 项目说明

- **开发工具**: 本项目由 [Cursor](https://cursor.sh/) AI编程助手生成
- **数据来源**: 通过网络公开资料整理，部分省份的查分信息是基于2024年资料推断
- **数据准确性**: 建议以各省教育考试院官方最新公告为准，如发现信息有误请及时反馈



## 🌟 支持项目

如果这个项目对您有帮助，请考虑：

- ⭐ 给项目点个星星
- 🍴 Fork 并参与贡献
- 📢 分享给需要的考生
- 💝 提出改进建议

---

<div align="center">

**🎓 祝愿所有2025年高考考生取得理想成绩！🎉**

Made with ❤️ for Chinese students  
Powered by [Cursor](https://cursor.sh/) AI

</div>

