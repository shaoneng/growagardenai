// /src/app/report/page.tsx
import MagazineReport from "../components/MagazineReport"; // 1. 导入新的杂志风格组件

export default function ReportPage() {
  return (
    // 2. 调整背景色以匹配杂志风格的米白色
    <main className="min-h-screen bg-[#f8f7f2]">
      {/* 3. 渲染新的组件 */}
      <MagazineReport />
    </main>
  );
}