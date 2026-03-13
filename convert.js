const fs = require('fs');
const path = require('path');

// 读取CSV文件
const csvPath = path.join(__dirname, '../数据库/全球绿色甲醇项目数据库.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// 解析CSV
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

const projects = [];

for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length >= headers.length) {
        const project = {
            id: values[0] || '',
            name: values[1] || '',
            producer: values[2] || '',
            company: values[3] || '',
            investor: values[4] || '',
            completionDate: values[5] || '',
            fidTime: values[6] || '',
            capacity: parseFloat(values[7]) || 0,
            location: values[8] || '',
            technology: values[9] || '',
            status: values[10] || '',
            source: values[11] || '',
            updateDate: values[12] || '',
            dataStatus: values[13] || ''
        };
        
        // 提取投资额(如果包含在进展或技术描述中)
        if (values[10] && values[10].includes('投资')) {
            const investmentMatch = values[10].match(/投资[^\d]*(\d+(?:\.\d+)?)/);
            if (investmentMatch) {
                project.investment = parseFloat(investmentMatch[1]);
            }
        }
        
        // 如果在进展字段中有更多投资信息
        if (!project.investment && values[4] && values[4].includes('投资')) {
            const investmentMatch = values[4].match(/(\d+(?:\.\d+)?)\s*亿元/);
            if (investmentMatch) {
                project.investment = parseFloat(investmentMatch[1]);
            }
        }
        
        projects.push(project);
    }
}

// 生成数据对象
const data = {
    lastUpdate: new Date().toISOString(),
    totalProjects: projects.length,
    totalCapacity: projects.reduce((sum, p) => sum + p.capacity, 0),
    projects: projects
};

// 写入JSON文件
const jsonPath = path.join(__dirname, 'data.json');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`✅ 转换完成!`);
console.log(`📊 总项目数: ${data.totalProjects}`);
console.log(`⚡ 总产能: ${data.totalCapacity.toFixed(1)} 万吨/年`);
console.log(`📁 JSON文件已保存到: ${jsonPath}`);

// 解析CSV行(处理带引号的字段)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}
