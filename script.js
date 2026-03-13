// 全局变量
let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const itemsPerPage = 10;
let sortColumn = -1;
let sortAscending = true;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    initMap();
    updateFilters();
    setupEventListeners();
});

// 加载项目数据
async function loadProjects() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        allProjects = data.projects || [];
        filteredProjects = [...allProjects];
        updateStats(data);
        updateLastUpdate(data.lastUpdate);
        renderTable();
        renderCharts();
        updateMapMarkers();
    } catch (error) {
        console.error('加载数据失败:', error);
        document.getElementById('projectsTableBody').innerHTML = 
            '<tr><td colspan="8" class="loading">加载数据失败，请刷新页面重试</td></tr>';
    }
}

// 更新统计信息
function updateStats(data) {
    const total = data.totalProjects || 0;
    const capacity = data.totalCapacity || 0;
    const active = allProjects.filter(p => p.status && p.status.includes('建设中')).length;
    const completed = allProjects.filter(p => p.status && p.status.includes('投产')).length;

    animateNumber('totalProjects', total);
    animateNumber('totalCapacity', capacity.toFixed(1));
    animateNumber('activeProjects', active);
    animateNumber('completedProjects', completed);
}

// 数字动画效果
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    const start = parseFloat(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeProgress;
        
        element.textContent = Number.isInteger(target) ? 
            Math.floor(current).toLocaleString() : 
            current.toFixed(1).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// 更新最后更新时间
function updateLastUpdate(timestamp) {
    if (!timestamp) return;
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    let timeText = date.toLocaleDateString('zh-CN');
    if (diff === 0) {
        timeText = '今天';
    } else if (diff === 1) {
        timeText = '昨天';
    } else if (diff < 7) {
        timeText = `${diff}天前`;
    }
    
    document.getElementById('lastUpdate').textContent = timeText;
}

// 初始化地图
function initMap() {
    const map = L.map('map').setView([35.8617, 104.1954], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    window.projectMap = map;
}

// 更新地图标记
function updateMapMarkers() {
    if (!window.projectMap) return;
    
    // 清除现有标记
    window.projectMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            window.projectMap.removeLayer(layer);
        }
    });
    
    // 项目位置坐标映射
    const coordinates = {
        '内蒙古': [43.8171, 114.8112],
        '吉林': [43.9167, 125.3245],
        '黑龙江': [45.8038, 126.5350],
        '辽宁': [41.2956, 123.4315],
        '新疆': [41.1128, 85.2401],
        '海南': [19.1981, 109.7448],
        '上海': [31.2304, 121.4737],
        '河南': [33.8820, 113.6147],
        '山东': [36.6758, 117.0204],
        '广西': [23.8298, 108.7881],
        '通辽': [43.6335, 122.2478],
        '兴安盟': [46.0763, 122.0376],
        '巴彦淖尔': [40.7574, 107.4164],
        '赤峰': [42.2572, 118.8870],
        '梅河口': [42.5443, 125.6586],
        '洮南': [45.3544, 122.7870],
        '调兵山': [42.4575, 123.5348],
        '通榆': [44.8149, 123.0900],
        '阿拉善': [38.8429, 105.7351],
        '大安': [45.5094, 124.2955],
        '松原': [45.1410, 124.8255],
        '大庆': [46.5906, 125.1037],
        '北海': [21.4812, 109.1202],
    };
    
    // 添加项目标记
    filteredProjects.forEach(project => {
        let coords = null;
        
        // 尝试匹配地点
        for (const [location, locationCoords] of Object.entries(coordinates)) {
            if (project.location && project.location.includes(location)) {
                coords = locationCoords;
                break;
            }
        }
        
        if (coords) {
            const marker = L.marker(coords).addTo(window.projectMap);
            marker.bindPopup(`
                <strong>${project.name}</strong><br>
                企业: ${project.company}<br>
                产能: ${project.capacity}万吨/年<br>
                状态: ${project.status}
            `);
        }
    });
}

// 更新筛选器选项
function updateFilters() {
    const companies = [...new Set(allProjects.map(p => p.company))].filter(Boolean).sort();
    const regions = [...new Set(allProjects.map(p => p.location))].filter(Boolean).sort();
    const statuses = [...new Set(allProjects.map(p => p.status))].filter(Boolean).sort();
    
    const companyFilter = document.getElementById('companyFilter');
    const regionFilter = document.getElementById('regionFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });
    
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('companyFilter').addEventListener('change', applyFilters);
    document.getElementById('regionFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
}

// 应用筛选
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const companyFilter = document.getElementById('companyFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredProjects = allProjects.filter(project => {
        const matchesSearch = !searchTerm || 
            project.name.toLowerCase().includes(searchTerm) ||
            project.company.toLowerCase().includes(searchTerm) ||
            project.technology.toLowerCase().includes(searchTerm);
        
        const matchesCompany = !companyFilter || project.company === companyFilter;
        const matchesRegion = !regionFilter || project.location.includes(regionFilter);
        const matchesStatus = !statusFilter || project.status === statusFilter;
        
        return matchesSearch && matchesCompany && matchesRegion && matchesStatus;
    });
    
    currentPage = 1;
    renderTable();
    updateMapMarkers();
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('projectsTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProjects = filteredProjects.slice(start, end);
    
    if (pageProjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">没有找到匹配的项目</td></tr>';
        return;
    }
    
    tbody.innerHTML = pageProjects.map(project => `
        <tr>
            <td><strong>${project.id}</strong></td>
            <td>${project.name}</td>
            <td>${project.company}</td>
            <td>${project.location}</td>
            <td>${project.capacity}</td>
            <td><span class="status-badge status-${getStatusClass(project.status)}">${project.status}</span></td>
            <td>${project.technology}</td>
            <td>${project.investment || '-'}</td>
        </tr>
    `).join('');
    
    updatePagination();
}

// 获取状态样式类
function getStatusClass(status) {
    if (status.includes('投产')) return 'completed';
    if (status.includes('建设中')) return 'active';
    if (status.includes('备案')) return 'planned';
    return 'unknown';
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `第 ${currentPage} / ${totalPages} 页`;
}

// 翻页函数
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

// 表格排序
function sortTable(columnIndex) {
    if (sortColumn === columnIndex) {
        sortAscending = !sortAscending;
    } else {
        sortColumn = columnIndex;
        sortAscending = true;
    }
    
    const keys = ['id', 'name', 'company', 'location', 'capacity', 'status', 'technology', 'investment'];
    const key = keys[columnIndex];
    
    filteredProjects.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return sortAscending ? -1 : 1;
        if (valA > valB) return sortAscending ? 1 : -1;
        return 0;
    });
    
    renderTable();
}

// 渲染图表
function renderCharts() {
    renderCompanyChart();
    renderRegionChart();
    renderStatusChart();
    renderTechnologyChart();
}

// 企业产能图表
function renderCompanyChart() {
    const companyData = {};
    filteredProjects.forEach(p => {
        if (p.company) {
            companyData[p.company] = (companyData[p.company] || 0) + p.capacity;
        }
    });
    
    const sortedCompanies = Object.entries(companyData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    new Chart(document.getElementById('companyChart'), {
        type: 'bar',
        data: {
            labels: sortedCompanies.map(c => c[0]),
            datasets: [{
                label: '产能(万吨/年)',
                data: sortedCompanies.map(c => c[1]),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// 地区产能图表
function renderRegionChart() {
    const regionData = {};
    filteredProjects.forEach(p => {
        if (p.location) {
            const region = p.location.split('市')[0].split('省')[0].split('自治区')[0];
            regionData[region] = (regionData[region] || 0) + p.capacity;
        }
    });
    
    new Chart(document.getElementById('regionChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(regionData),
            datasets: [{
                data: Object.values(regionData),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
                    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// 状态分布图表
function renderStatusChart() {
    const statusData = {};
    filteredProjects.forEach(p => {
        if (p.status) {
            statusData[p.status] = (statusData[p.status] || 0) + 1;
        }
    });
    
    new Chart(document.getElementById('statusChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(statusData),
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: [
                    '#27ae60', '#f39c12', '#3498db', '#e74c3c', '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// 技术路线图表
function renderTechnologyChart() {
    const techData = {};
    filteredProjects.forEach(p => {
        if (p.technology) {
            const tech = p.technology.includes('风电') ? '风电制氢' :
                        p.technology.includes('生物质') ? '生物质' :
                        p.technology.includes('电解') ? '电解制氢' : '其他';
            techData[tech] = (techData[tech] || 0) + p.capacity;
        }
    });
    
    new Chart(document.getElementById('technologyChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(techData),
            datasets: [{
                label: '产能(万吨/年)',
                data: Object.values(techData),
                backgroundColor: [
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(243, 156, 18, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(155, 89, 182, 0.8)'
                ],
                borderColor: [
                    'rgba(39, 174, 96, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

// 导出CSV
function exportCSV() {
    const headers = ['ID', '项目名称', '企业', '地点', '产能(万吨/年)', '状态', '技术路线', '投资额(亿元)', '开始日期', '完成日期', '来源'];
    const csvContent = [
        headers.join(','),
        ...filteredProjects.map(p => [
            p.id,
            `"${p.name}"`,
            `"${p.company}"`,
            `"${p.location}"`,
            p.capacity,
            `"${p.status}"`,
            `"${p.technology}"`,
            p.investment || '',
            p.startDate || '',
            p.completionDate || '',
            p.source || ''
        ].join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `绿色甲醇项目数据库_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
