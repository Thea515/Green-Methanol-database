# 全球绿色甲醇项目数据库

一个实时更新的绿色甲醇项目数据库,通过GitHub Pages免费托管,每周自动更新。

## 功能特点

- ✅ **实时更新**: 每周自动搜索新项目并更新数据库
- ✅ **可视化展示**: 交互式地图、统计图表、趋势分析
- ✅ **多维度筛选**: 按企业、地区、状态等筛选项目
- ✅ **数据导出**: 支持导出CSV格式
- ✅ **响应式设计**: 支持PC和移动端访问
- ✅ **完全免费**: GitHub Pages免费托管

## 访问地址

> 🌐 [https://您的用户名.github.io/green-methanol-database/](https://您的用户名.github.io/green-methanol-database/)

## 快速开始

### 1. 创建GitHub仓库

1. 访问 https://github.com/new
2. 创建新仓库,命名为 `green-methanol-database`
3. 选择"Public"公开仓库
4. 点击"Create repository"

### 2. 上传文件

将以下文件上传到仓库根目录:

- `index.html` - 网页主文件
- `styles.css` - 样式文件
- `script.js` - JavaScript文件
- `data.json` - 数据文件
- `convert.js` - 数据转换脚本
- `.github/workflows/update.yml` - GitHub Actions配置
- `README.md` - 说明文档

### 3. 启用GitHub Pages

1. 进入仓库的"Settings"设置
2. 点击左侧"Pages"
3. 在"Source"下选择"GitHub Actions"
4. 保存设置

### 4. 部署完成

等待GitHub Actions完成部署后(约2-3分钟),即可访问您的网页!

## 项目结构

```
green-methanol-database/
├── index.html              # 网页主文件
├── styles.css             # 样式文件
├── script.js              # JavaScript文件
├── data.json              # 项目数据(JSON格式)
├── convert.js             # CSV到JSON转换脚本
├── .github/
│   └── workflows/
│       └── update.yml     # GitHub Actions配置
└── README.md              # 说明文档
```

## 数据更新

### 自动更新

系统会在每周一凌晨2点(UTC)自动运行更新脚本,完成以下操作:

1. 搜索互联网上的新项目
2. 验证项目数据
3. 更新数据库
4. 自动部署到GitHub Pages

### 手动更新

如果需要手动更新,可以:

1. 进入GitHub仓库的"Actions"标签
2. 找到"Update Database and Deploy"工作流
3. 点击右侧"Run workflow"按钮

### 本地更新

如果您想在本地更新数据:

1. 更新`../数据库/全球绿色甲醇项目数据库.csv`文件
2. 运行转换脚本:
   ```bash
   node convert.js
   ```
3. 提交并推送更改:
   ```bash
   git add data.json
   git commit -m "Update database"
   git push
   ```

## 数据来源

数据来自公开的新闻报道和官方公告,包括:

- 政府官方网站
- 企业新闻发布
- 行业媒体报告
- 专业数据库

## 数据格式

### JSON格式

`data.json` 使用以下格式:

```json
{
  "lastUpdate": "2026-03-13T10:00:00Z",
  "totalProjects": 34,
  "totalCapacity": 1002.8,
  "projects": [
    {
      "id": "GM-001",
      "name": "上海绿色甲醇项目",
      "producer": "上海化学区管委会",
      "company": "上海市政府",
      "location": "中国上海",
      "capacity": 10,
      "status": "建设中",
      "technology": "生物质转化",
      "investment": null,
      "completionDate": "2025-12-31",
      "source": "https://..."
    }
  ]
}
```

### CSV格式

原始数据存储在CSV文件中,可使用Excel打开编辑:

```csv
项目ID,项目名称,生产方,主导企业,投资方,预计COD时间,FID时间,设计产能(万吨/年),项目地点,主要技术,项目进展,最新新闻链接,更新日期,数据状态
GM-001,上海绿色甲醇项目,上海化学区管委会,上海市政府,未公开,2025-12-31,2024-11-01,10,中国上海,生物质转化,建设中,https://...,2026-03-12,已确认
```

## 功能使用

### 搜索项目

在搜索框中输入关键词,可搜索:
- 项目名称
- 企业名称
- 技术路线

### 筛选项目

使用下拉筛选器可按以下维度筛选:
- 企业
- 地区
- 状态

### 查看地图

点击地图上的标记可查看项目详细信息:
- 项目名称
- 企业名称
- 产能
- 状态

### 查看图表

网页提供多种统计图表:
- 企业产能分布(柱状图)
- 地区产能分布(饼图)
- 项目状态分布(饼图)
- 技术路线分布(横向柱状图)

### 排序表格

点击表头可按该列排序:
- 点击一次:升序
- 点击两次:降序
- 点击三次:恢复默认

### 导出数据

点击"导出CSV"按钮可下载当前筛选后的数据。

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **图表库**: Chart.js
- **地图库**: Leaflet.js
- **托管**: GitHub Pages
- **CI/CD**: GitHub Actions
- **版本控制**: Git

## 自定义配置

### 修改更新频率

编辑`.github/workflows/update.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # 每周一次
    # - cron: '0 2 * * *'  # 每天一次
    # - cron: '0 2 1 * *'  # 每月一次
```

### 修改每页显示数量

编辑`script.js`:

```javascript
const itemsPerPage = 10; // 修改这个数字
```

### 添加新的搜索关键词

编辑数据更新脚本,添加更多搜索关键词。

## 常见问题

### Q: 如何添加新的项目?

A: 有两种方式:
1. 直接编辑CSV文件,然后运行`node convert.js`转换
2. 编辑JSON文件,直接添加项目对象

### Q: 如何修改网页样式?

A: 编辑`styles.css`文件,修改对应的CSS规则。

### Q: 为什么我的地图不显示?

A: 确保项目数据中的`location`字段包含有效的地理位置名称,并在`script.js`的`coordinates`对象中添加对应的坐标。

### Q: 如何自定义域名?

A: 在GitHub仓库的Settings > Pages中配置自定义域名,并添加DNS记录。

## 数据质量保证

为了确保数据的准确性和完整性,我们采用以下机制:

1. **多源验证**: 每个项目至少有2个以上数据源
2. **定期审核**: 每月对数据进行人工审核
3. **状态跟踪**: 标记项目进展状态
4. **来源链接**: 保留原始新闻链接供验证

## 贡献指南

欢迎贡献数据、代码或提出改进建议!

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

MIT License - 可自由使用和修改

## 联系方式

如有问题或建议,请:
- 提交Issue
- 发送Pull Request
- 联系维护者

## 更新日志

### 2026-03-13
- ✅ 初始版本发布
- ✅ 34个项目数据
- ✅ 总产能1002.8万吨/年
- ✅ 自动更新系统上线

---

**Made with ❤️ for Green Energy**
