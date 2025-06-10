# 🤝 贡献指南

感谢您对"查分数"项目的关注！我们欢迎并感激每一个贡献者的帮助。

## 🎯 贡献方式

### 1. 📊 数据更新贡献
这是最常见和重要的贡献类型：

#### 发现数据错误
- 查分时间有误
- 官方网站链接失效
- 联系电话变更
- 查询方式更新

#### 如何提交数据更新
1. 在 [Issues](https://github.com/DCAIGC/chafenshu/issues) 中创建新问题
2. 使用 "数据更新" 标签
3. 提供以下信息：
   - 错误的省份和具体信息
   - 正确的信息
   - 官方信息来源链接
   - 发现时间

### 2. 🐛 Bug 修复
发现网站功能问题：

#### 常见Bug类型
- 搜索功能异常
- 页面显示错误
- 移动端兼容问题
- JavaScript错误

#### Bug报告格式
```markdown
**Bug描述**
简洁明了的描述问题

**重现步骤**
1. 访问 '...'
2. 点击 '....'
3. 看到错误 '....'

**预期行为**
描述期望的正确行为

**截图**
如果适用，添加截图说明问题

**环境信息**
- 操作系统: [例如 iOS, Windows]
- 浏览器: [例如 Chrome, Safari]
- 版本: [例如 22]
```

### 3. ✨ 新功能建议
有好的想法？我们想听听！

#### 功能建议格式
```markdown
**功能描述**
清晰描述您想要的功能

**解决的问题**
这个功能解决什么问题？

**实现方案**
如果有想法，描述可能的实现方式

**替代方案**
考虑过其他替代方案吗？

**其他信息**
任何其他相关的背景信息
```

## 🔧 开发贡献

### 环境准备
1. Fork 本仓库
2. 克隆到本地：
   ```bash
   git clone https://github.com/DCAIGC/chafenshu.git
   cd chafenshu
   ```
3. 创建功能分支：
   ```bash
   git checkout -b feature/功能名称
   ```

### 代码规范

#### HTML规范
- 使用语义化标签
- 保持良好的缩进（2个空格）
- 添加必要的 `aria-label` 和 `alt` 属性
- 确保可访问性

```html
<!-- 好的示例 -->
<button aria-label="搜索省份" class="search-btn">
  🔍
</button>

<!-- 避免 -->
<div onclick="search()">🔍</div>
```

#### CSS规范
- 使用 TailwindCSS 类名
- 自定义样式放在 `<style>` 标签中
- 使用CSS变量保持一致性

```css
/* 好的示例 */
.custom-button {
  background: var(--edu-blue-500);
  transition: all 0.3s ease;
}
```

#### JavaScript规范
- 使用现代ES6+语法
- 添加必要的错误处理
- 保持函数简洁明了
- 添加适当的注释

```javascript
// 好的示例
function searchProvinces(query) {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    return provinces.filter(province => 
      province.name.includes(query) || 
      province.shortName.includes(query)
    );
  } catch (error) {
    console.error('搜索错误:', error);
    return [];
  }
}
```

### 提交规范

#### 提交信息格式
```
类型(范围): 简短描述

详细描述（可选）

相关Issue: #123
```

#### 提交类型
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `data`: 数据更新
- `test`: 测试相关

#### 示例
```bash
# 好的提交信息
git commit -m "feat(search): 添加模糊搜索功能"
git commit -m "fix(calendar): 修复日期显示错误"
git commit -m "data(beijing): 更新北京查分时间"

# 避免
git commit -m "更新"
git commit -m "fix bug"
```

### 测试
在提交PR前，请确保：

1. **功能测试**
   - 搜索功能正常
   - 所有链接可访问
   - 响应式设计正常

2. **浏览器兼容性**
   - Chrome (最新版本)
   - Firefox (最新版本)
   - Safari (最新版本)
   - Edge (最新版本)

3. **移动端测试**
   - iOS Safari
   - Android Chrome

### Pull Request 流程

1. **创建PR前检查**
   - 代码符合规范
   - 功能正常工作
   - 没有破坏现有功能

2. **PR描述模板**
   ```markdown
   ## 变更类型
   - [ ] Bug修复
   - [ ] 新功能
   - [ ] 数据更新
   - [ ] 文档更新

   ## 变更描述
   简要描述这次变更的内容

   ## 测试
   - [ ] 本地测试通过
   - [ ] 浏览器兼容性测试
   - [ ] 移动端测试

   ## 相关Issue
   关闭 #问题编号
   ```

3. **代码审查**
   - 维护者会审查您的代码
   - 可能需要修改和完善
   - 保持耐心和开放的态度

## 📝 数据维护指南

### 更新数据流程
1. 编辑 `assets/js/data.js`
2. 运行验证脚本：`python update_data.py`
3. 重新生成页面：`python generate_provinces.py`
4. 测试更新结果
5. 提交PR

### 数据准确性要求
- 信息必须来自官方源
- 提供信息来源链接
- 确保联系方式准确
- 验证查分时间正确

### 数据来源说明
- 当前数据通过网络公开资料整理
- 部分省份信息基于2024年资料推断
- 2025年正式时间请以各省教育考试院官方公告为准
- 欢迎提供更准确的官方信息更新

## 🏆 贡献者认可

### 贡献者列表
所有贡献者都会在项目中得到认可：
- README.md 贡献者部分
- 重大贡献会在 Release Notes 中特别感谢

### 贡献类型徽章
- 🏆 核心贡献者
- 📊 数据贡献者  
- 🐛 Bug猎手
- 💡 创意贡献者
- 📝 文档贡献者

## ❓ 需要帮助？

### 联系方式
- 📧 邮箱：Adison.Zeng@wetax.com.cn
- 💬 讨论区：[GitHub Discussions](https://github.com/DCAIGC/chafenshu/discussions)
- 🐛 问题反馈：[GitHub Issues](https://github.com/DCAIGC/chafenshu/issues)

### 新手指南
第一次贡献开源项目？
- 阅读 [GitHub 贡献指南](https://docs.github.com/cn/get-started/quickstart/contributing-to-projects)
- 从简单的数据更新开始
- 加入我们的讨论区询问问题

---

**再次感谢您的贡献！每一个贡献都让这个项目变得更好！** 🙏 