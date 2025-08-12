# 策略报告收藏功能指南

## 功能概述

策略报告收藏功能允许用户收藏有用的个性化策略建议，方便以后快速查找和参考。

## 新增功能

### 1. 扩展的数据类型
- 收藏类型现在支持：`'crops' | 'pets' | 'reports'`
- 收藏数据结构新增 `reports: string[]` 字段
- 支持策略报告的元数据（报告ID、生成日期、标题等）

### 2. 策略报告收藏按钮
```tsx
import { ReportFavoriteButton } from '@/components/ui/ReportFavoriteButton';

// 基础收藏按钮
<ReportFavoriteButton
  reportId="report_20250810_001"
  reportTitle="个性化种植策略建议"
  size="lg"
  showLabel={true}
/>

// 紧凑型按钮（用于报告卡片）
<CompactReportFavoriteButton
  reportId="report_20250810_001"
  reportTitle="个性化种植策略建议"
/>

// 报告卡片按钮（带报告图标）
<ReportCardFavoriteButton
  reportId="report_20250810_001"
  reportTitle="个性化种植策略建议"
/>
```

### 3. 收藏页面增强
- **新增策略报告分组**：专门的策略报告收藏区域
- **按生成日期排序**：策略报告按生成日期排序（最新的在前）
- **报告筛选**：可以只显示收藏的策略报告
- **报告统计**：显示收藏的策略报告数量和占比

### 4. 使用方法

#### 在策略报告页面添加收藏按钮
```tsx
// 在策略报告组件中
import { ReportFavoriteButton } from '@/components/ui/ReportFavoriteButton';

function StrategyReportPage({ reportData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>{reportData.mainTitle}</h1>
        <ReportFavoriteButton
          reportId={reportData.reportId}
          reportTitle={reportData.mainTitle}
          size="lg"
          showLabel={true}
        />
      </div>
      {/* 报告内容 */}
    </div>
  );
}
```

#### 在报告列表中添加快速收藏
```tsx
// 在报告列表组件中
import { CompactReportFavoriteButton } from '@/components/ui/ReportFavoriteButton';

function ReportListItem({ report }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3>{report.mainTitle}</h3>
        <p>{report.subTitle}</p>
      </div>
      <CompactReportFavoriteButton
        reportId={report.reportId}
        reportTitle={report.mainTitle}
      />
    </div>
  );
}
```

### 5. 数据结构

#### 策略报告收藏数据
```typescript
interface ReportFavoriteData {
  reportId: string;           // 报告唯一ID
  publicationDate: string;    // 生成日期（用于排序）
  mainTitle: string;          // 报告主标题
  subTitle?: string;          // 报告副标题
  addedAt: string;           // 收藏时间
}
```

#### 扩展的收藏数据结构
```typescript
interface FavoritesData {
  crops: string[];      // 作物收藏
  pets: string[];       // 宠物收藏
  reports: string[];    // 策略报告收藏
  lastUpdated: string;  // 最后更新时间
}
```

### 6. 排序功能

策略报告支持按以下方式排序：
- **按生成日期排序**：最新生成的报告排在前面
- **按名称排序**：按报告标题字母顺序排序
- **按添加时间排序**：按收藏时间排序

### 7. 筛选功能

用户可以：
- 查看所有类型的收藏（作物、宠物、策略报告）
- 只查看策略报告收藏
- 搜索特定的策略报告

### 8. 统计信息

收藏页面现在显示：
- 策略报告收藏总数
- 策略报告在所有收藏中的占比
- 策略报告的独立统计卡片

## 技术实现

### 1. 类型安全
- 完整的 TypeScript 类型定义
- 类型守卫和验证
- 编译时类型检查

### 2. 数据持久化
- localStorage 自动保存策略报告收藏
- 数据迁移支持（从旧版本升级）
- 数据完整性验证

### 3. 用户体验
- 即时的 Toast 通知反馈
- 流畅的动画效果
- 响应式设计适配所有设备

### 4. 性能优化
- 防抖保存避免频繁写入
- 内存缓存减少重复计算
- 懒加载和虚拟化支持

## 使用示例

### 基础使用
```tsx
// 1. 在策略报告页面添加收藏功能
<ReportFavoriteButton
  reportId="report_20250810_001"
  reportTitle="春季种植优化策略"
  size="md"
  showLabel={true}
/>

// 2. 用户点击收藏按钮
// 3. 系统显示 Toast 通知："春季种植优化策略 已添加到策略报告收藏"
// 4. 导航栏收藏徽章数量增加
// 5. 用户可以在收藏页面查看和管理收藏的报告
```

### 高级使用
```tsx
// 在报告生成完成后自动提示收藏
function ReportGenerationComplete({ reportData }) {
  const { addToFavorites } = useFavorites();
  const { success } = useToast();
  
  const handleAutoSave = () => {
    addToFavorites(reportData.reportId, 'reports');
    success('报告已自动保存到收藏', '你可以在收藏页面随时查看');
  };
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3>策略报告生成完成！</h3>
      <p>是否要将这个报告保存到收藏？</p>
      <button onClick={handleAutoSave}>
        保存到收藏
      </button>
    </div>
  );
}
```

## 总结

策略报告收藏功能现在已经完全集成到收藏系统中，提供了：

- **完整的收藏体验**：从收藏到管理的完整流程
- **智能排序**：按生成日期自动排序，最新的报告在前
- **统一的用户界面**：与现有收藏功能保持一致的设计
- **丰富的反馈**：Toast 通知和动画效果
- **数据持久化**：可靠的本地存储和数据迁移

用户现在可以轻松收藏和管理他们的个性化策略报告，提高使用效率和用户体验！