# 省份页面生成脚本使用说明

## 📁 脚本文件

- `generate_provinces.py` - 省份页面生成脚本
- `update_data.py` - 数据验证和更新脚本
- `scripts_README.md` - 本说明文档

## 🚀 使用方法

### 1. 数据验证（推荐先运行）

```bash
python update_data.py
```

**功能：**
- 验证 `assets/js/data.js` 中的数据完整性
- 检查34个省份数据是否完整
- 验证必需字段和日期格式
- 检查现有省份页面文件
- 自动备份当前数据
- 生成数据摘要报告

### 2. 生成省份页面

```bash
python generate_provinces.py
```

**功能：**
- 读取 `assets/js/data.js` 中的省份数据
- 批量生成34个省份的HTML页面
- 自动创建 `provinces/` 目录
- 使用统一的页面模板
- 包含SEO优化和结构化数据

## 📋 数据更新流程

### 步骤1：修改数据
编辑 `assets/js/data.js` 文件，更新省份信息：

```javascript
{
    id: 'beijing',
    name: '北京',
    pinyin: 'beijing',
    shortName: '京',
    region: '华北',
    queryUrl: 'https://www.bjeea.cn/',
    queryDate: '2025-06-25',
    queryTime: '09:00',
    examBoard: '北京教育考试院',
    phone: '010-89193989',
    status: 'soon',
    description: '网站查询、"北京通"APP',
    lastUpdate: '2025-06-01'
}
```

### 步骤2：验证数据
```bash
python update_data.py
```

确保输出显示：
- ✅ 所有必需字段都存在
- ✅ 省份数量: 34
- ✅ 数据完整性: 通过

### 步骤3：重新生成页面
```bash
python generate_provinces.py
```

### 步骤4：检查结果
- 查看 `provinces/` 目录下生成的HTML文件
- 在浏览器中测试几个页面
- 确认链接和数据显示正确

## 📊 数据字段说明

### 必需字段
- `id` - 省份ID（用于文件名和URL）
- `name` - 省份全名
- `pinyin` - 拼音（用于搜索）
- `shortName` - 简称（如：京、沪、粤）
- `region` - 地区分类
- `queryUrl` - 官方查分网址
- `queryDate` - 查分日期（YYYY-MM-DD）
- `queryTime` - 查分时间（HH:MM）
- `examBoard` - 考试院名称
- `phone` - 咨询电话

### 可选字段
- `status` - 状态（open/soon/closed）
- `description` - 查分方式描述
- `lastUpdate` - 最后更新时间

## ⚠️ 注意事项

### 数据格式要求
1. **日期格式**：必须是 `YYYY-MM-DD` 格式
2. **时间格式**：必须是 `HH:MM` 格式，`00:00` 表示全天
3. **ID格式**：小写英文，不含特殊字符
4. **字符编码**：文件必须是UTF-8编码

### 常见问题

**Q: 生成页面后链接404？**
A: 检查省份ID是否与data.js中一致，确保文件名正确

**Q: 搜索功能不工作？**
A: 确保拼音字段正确填写，检查shortName字段

**Q: 页面显示乱码？**
A: 确保data.js文件是UTF-8编码保存

**Q: 部分省份页面缺失？**
A: 检查data.js语法是否正确，确保JSON格式有效

### 备份策略
- 每次运行 `update_data.py` 会自动备份当前数据到 `backup/` 目录
- 建议在大规模修改前手动备份整个项目
- 使用版本控制系统（Git）跟踪变更

## 🔧 脚本维护

### 修改页面模板
编辑 `generate_provinces.py` 中的 `get_province_template()` 函数

### 添加新的验证规则
编辑 `update_data.py` 中的 `validate_provinces_data()` 函数

### 自定义生成逻辑
根据需要修改 `generate_province_page()` 函数

## 📞 技术支持

如果遇到问题：
1. 首先运行 `python update_data.py` 检查数据
2. 查看控制台错误信息
3. 检查文件编码和格式
4. 确认Python环境正常

---

**最后更新：2025-01-20** 