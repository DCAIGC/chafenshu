// 主应用程序管理器
class MainApp {
    constructor() {
        this.provinces = window.provincesData || [];
        this.regionMapping = window.regionMapping || {};
        this.currentRegion = 'all';
        this.init();
    }
    
    init() {
        this.initializeManagers();
        this.renderProvinces();
        this.bindRegionFilters();
        this.bindScrollEvents();
        this.updateStatistics();
        this.showWelcomeMessage();
    }
    
    initializeManagers() {
        try {
            // 检查数据是否已加载
            if (!window.provincesData || !window.scheduleData) {
                throw new Error('数据未正确加载');
            }
            
            // 初始化搜索管理器
            window.searchManager = new SearchManager();
            console.log('搜索管理器初始化成功');
            
            // 初始化日历管理器
            window.calendarManager = new CalendarManager();
            console.log('日历管理器初始化成功');
            
        } catch (error) {
            console.error('管理器初始化失败:', error);
            throw error;
        }
    }
    
    renderProvinces(regionFilter = 'all') {
        const provincesGrid = document.getElementById('provinces-grid');
        if (!provincesGrid) return;
        
        let filteredProvinces = this.provinces;
        
        if (regionFilter !== 'all') {
            filteredProvinces = this.provinces.filter(province => 
                province.region === regionFilter
            );
        }
        
        // 按照查分时间排序
        filteredProvinces.sort((a, b) => {
            return new Date(a.queryDate) - new Date(b.queryDate);
        });
        
        provincesGrid.innerHTML = filteredProvinces.map(province => 
            this.createProvinceCard(province)
        ).join('');
        
        // 添加动画效果
        this.animateProvinceCards();
    }
    
    createProvinceCard(province) {
        const statusClass = this.getStatusClass(province.status);
        const statusText = this.getStatusText(province.status);
        const queryTimeFormatted = this.formatQueryTime(province.queryDate, province.queryTime);
        
        return `
            <div class="province-card bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-bold text-lg">${province.shortName}</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-blue-900">${province.name}</h3>
                            <p class="text-sm text-gray-600">${province.region}</p>
                        </div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </div>
                
                <div class="space-y-3 mb-4">
                    <div class="flex items-center text-sm">
                        <span class="text-gray-600 w-16">查分时间</span>
                        <span class="font-medium text-blue-600">${queryTimeFormatted}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="text-gray-600 w-16">考试院</span>
                        <span class="text-gray-800 truncate">${province.examBoard}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <span class="text-gray-600 w-16">咨询电话</span>
                        <a href="tel:${province.phone}" class="text-blue-600 hover:text-blue-800">
                            ${province.phone}
                        </a>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <a href="provinces/${province.id}.html" 
                       class="btn-primary flex-1 text-white px-4 py-2 rounded-lg text-center text-sm font-medium hover:opacity-90 transition-opacity">
                        查看详情
                    </a>
                    <a href="${province.queryUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors">
                        官方查分
                    </a>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>点击查看详细信息</span>
                        <span class="countdown" data-date="${province.queryDate}"></span>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindRegionFilters() {
        const regionFilters = document.querySelectorAll('.region-filter');
        
        regionFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                e.preventDefault();
                const region = e.target.dataset.region;
                this.filterByRegion(region);
                this.updateActiveFilter(e.target);
            });
        });
        
        // 默认选中"全部地区"
        const allFilter = document.querySelector('[data-region="all"]');
        if (allFilter) {
            this.updateActiveFilter(allFilter);
        }
    }
    
    filterByRegion(region) {
        this.currentRegion = region;
        this.renderProvinces(region);
        
        // 更新统计信息
        this.updateRegionStatistics(region);
    }
    
    updateActiveFilter(activeButton) {
        const regionFilters = document.querySelectorAll('.region-filter');
        regionFilters.forEach(filter => {
            filter.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            filter.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        });
        
        activeButton.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
        activeButton.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
    }
    
    animateProvinceCards() {
        const cards = document.querySelectorAll('.province-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
    
    bindScrollEvents() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    updateStatistics() {
        // 更新省份总数 - 使用更精确的选择器
        const statCards = document.querySelectorAll('.bg-white.rounded-lg.p-4.shadow .text-2xl.font-bold');
        if (statCards.length >= 1) {
            // 第一个统计卡片是省市自治区数量
            statCards[0].textContent = this.provinces.length;
        }
        
        // 更新倒计时
        this.startCountdown();
    }
    
    updateRegionStatistics(region) {
        let count = this.provinces.length;
        if (region !== 'all') {
            count = this.provinces.filter(p => p.region === region).length;
        }
        
        // 可以在这里显示地区统计信息
        console.log(`${region === 'all' ? '全部地区' : region}：${count}个省市`);
    }
    
    startCountdown() {
        const countdownElements = document.querySelectorAll('.countdown');
        
        const updateCountdown = () => {
            const now = new Date();
            
            countdownElements.forEach(element => {
                const targetDate = new Date(element.dataset.date);
                const diff = targetDate.getTime() - now.getTime();
                
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    
                    if (days > 0) {
                        element.textContent = `还有${days}天`;
                    } else if (hours > 0) {
                        element.textContent = `还有${hours}小时`;
                    } else {
                        element.textContent = '即将开放';
                    }
                } else {
                    element.textContent = '已开放';
                    element.classList.add('text-green-600');
                }
            });
        };
        
        updateCountdown();
        setInterval(updateCountdown, 60000); // 每分钟更新一次
    }
    
    showWelcomeMessage() {
        // 检查是否为首次访问
        const hasVisited = localStorage.getItem('chafen_visited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showNotification('欢迎使用查分数网！', '为您提供2025年全国高考查分服务', 'info');
                localStorage.setItem('chafen_visited', 'true');
            }, 1000);
        }
    }
    
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 translate-x-full`;
        
        const iconMap = {
            info: '💡',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        notification.innerHTML = `
            <div class="flex items-start">
                <span class="text-2xl mr-3">${iconMap[type]}</span>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${message}</p>
                </div>
                <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // 工具函数
    getStatusClass(status) {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-800';
            case 'soon': return 'bg-amber-100 text-amber-800';
            case 'closed': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    }
    
    getStatusText(status) {
        switch (status) {
            case 'open': return '已开放';
            case 'soon': return '即将开放';
            case 'closed': return '未开放';
            default: return '未知';
        }
    }
    
    formatQueryTime(date, time) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        
        if (time === '00:00') {
            return `${month}月${day}日`;
        } else {
            return `${month}月${day}日 ${time}`;
        }
    }
    
    // 获取应用统计信息
    getAppStatistics() {
        const stats = {
            totalProvinces: this.provinces.length,
            regionCount: Object.keys(this.regionMapping).length,
            openCount: this.provinces.filter(p => p.status === 'open').length,
            soonCount: this.provinces.filter(p => p.status === 'soon').length,
            closedCount: this.provinces.filter(p => p.status === 'closed').length
        };
        
        return stats;
    }
    
    // 搜索省份
    searchProvince(query) {
        return this.provinces.filter(province => 
            province.name.toLowerCase().includes(query.toLowerCase()) ||
            province.pinyin.toLowerCase().includes(query.toLowerCase()) ||
            province.shortName.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // 获取指定地区的省份
    getProvincesByRegion(region) {
        return this.provinces.filter(province => province.region === region);
    }
    
    // 获取即将开放的省份
    getUpcomingProvinces() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        return this.provinces.filter(province => 
            province.queryDate >= today && province.status === 'soon'
        ).sort((a, b) => new Date(a.queryDate) - new Date(b.queryDate));
    }
}

// 错误处理
window.addEventListener('error', (event) => {
    console.error('应用错误:', event.error);
    
    // 可以在这里添加错误上报逻辑
    if (window.mainApp) {
        window.mainApp.showNotification('发生错误', '页面功能可能受到影响，请刷新页面重试', 'error');
    }
});

// 性能监控
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`页面加载时间: ${Math.round(loadTime)}ms`);
    
    // 检查是否所有数据都已加载
    if (!window.provincesData || !window.scheduleData) {
        console.warn('数据加载不完整');
    }
});

// 检查数据加载状态
function checkDataLoaded() {
    console.log('检查数据加载状态:');
    console.log('provincesData:', window.provincesData ? `${window.provincesData.length}个省份` : '未加载');
    console.log('scheduleData:', window.scheduleData ? `${Object.keys(window.scheduleData).length}个日期` : '未加载');
    console.log('regionMapping:', window.regionMapping ? `${Object.keys(window.regionMapping).length}个地区` : '未加载');
    
    return window.provincesData && window.scheduleData && window.regionMapping;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化应用');
    
    // 延迟检查数据加载
    setTimeout(() => {
        try {
            if (!checkDataLoaded()) {
                throw new Error('数据加载不完整，请检查data.js文件');
            }
            
            window.mainApp = new MainApp();
            console.log('查分数网应用已初始化');
        } catch (error) {
            console.error('应用初始化失败:', error);
            console.error('错误详情:', error.stack);
            
            // 显示详细错误信息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed top-4 left-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded z-50';
            errorDiv.innerHTML = `
                <strong>应用初始化失败</strong><br>
                ${error.message}<br>
                <button onclick="window.location.reload()" class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm">
                    刷新页面
                </button>
            `;
            document.body.appendChild(errorDiv);
        }
    }, 100); // 给100ms时间让所有脚本文件加载完成
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.mainApp) {
        // 页面重新可见时更新倒计时
        window.mainApp.startCountdown();
    }
}); 