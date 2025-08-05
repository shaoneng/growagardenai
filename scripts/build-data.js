// 引入Node.js内置模块
const fs = require('fs'); // 用于文件系统操作（读写文件）
const path = require('path'); // 用于处理文件和目录路径

// 引入第三方库，需要先安装：npm install csv-parser
const csv = require('csv-parser');

// --- 配置路径 ---
// 定义源CSV文件的路径
// path.resolve会生成一个绝对路径，确保脚本在任何位置运行都能找到文件
const csvFilePath = path.resolve(__dirname, '../grow_a_garden_all_tables.csv');

// 定义输出JSON文件的目标目录
const outputDir = path.resolve(__dirname, '../public/data');

// 定义输出JSON文件的完整路径
const outputJsonPath = path.join(outputDir, 'items.json');

// --- 主逻辑 ---
// 创建一个空数组，用于存放处理后的物品对象
const results = [];

console.log('Starting data processing...');

// 确保输出目录存在，如果不存在则创建
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 使用fs.createReadStream读取CSV文件，并通过管道流式传输给csv-parser
fs.createReadStream(csvFilePath)
  .pipe(csv()) // csv-parser会将每一行CSV数据转换为一个JavaScript对象
  .on('data', (data) => {
    // 'data'事件会在每处理完一行时触发
    
    // --- 数据清洗与转换 (ETL的核心) ---
    //
    
    // 1. 跳过无效数据：如果'Name'字段为空，则忽略该行
    if (!data.Name || data.Name.trim() === '') {
      console.warn(`Skipping row with empty name: ${JSON.stringify(data)}`);
      return;
    }

    // 2. 创建一个结构化的物品对象
    const item = {
      // 内部ID: 将 "Orange Tulip" 转换为 "orange_tulip"
      // 用于程序逻辑和图片文件名匹配
      //
      name: data.Name.trim().toLowerCase().replace(/\s+/g, '_'),

      // 展示名称: 直接使用CSV中的名称，去除首尾空格
      //
      display_name: data.Name.trim(),

      // 分类
      category: data.Category ? data.Category.trim() : 'Uncategorized',

      // 售价: 将字符串转换为数字，如果转换失败则默认为0
      sell_price: parseInt(data['Sell Price'], 10) || 0,

      // 稀有度
      rarity: data.Rarity ? data.Rarity.trim() : 'Common',

      // 描述
      description: data.Description ? data.Description.trim() : ''
    };

    // 3. 将处理好的对象推入results数组
    results.push(item);
  })
  .on('end', () => {
    // 'end'事件会在所有数据行都处理完毕后触发
    
    // --- 文件写入 ---
    // 将results数组转换为格式化的JSON字符串（indentation=2）
    const jsonContent = JSON.stringify(results, null, 2);

    // 将JSON字符串写入到目标文件中
    fs.writeFileSync(outputJsonPath, jsonContent, 'utf8');

    console.log(`✅ Data processing complete!`);
    console.log(`${results.length} items have been processed.`);
    console.log(`JSON file successfully created at: ${outputJsonPath}`);
  })
  .on('error', (error) => {
    // 'error'事件会在发生错误时触发
    console.error('An error occurred during CSV processing:', error);
  });