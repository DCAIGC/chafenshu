// 搜索功能管理器
class SearchManager {
    constructor() {
        this.provinces = window.provincesData || [];
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.searchHistory = this.loadSearchHistory();
        this.init();
    }
    
    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
            this.searchInput.addEventListener('focus', this.showSearchHistory.bind(this));
            this.searchInput.addEventListener('blur', this.hideResultsDelayed.bind(this));
            
            // 键盘导航支持
            this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
        
        // 点击外部区域隐藏结果
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    handleSearch(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length === 0) {
            this.showSearchHistory();
            return;
        }
        
        if (query.length < 1) {
            this.hideResults();
            return;
        }
        
        const results = this.provinces.filter(province => {
            // 安全检查字段是否存在
            const name = province.name || '';
            const pinyin = province.pinyin || '';
            const shortName = province.shortName || '';
            
            return name.toLowerCase().includes(query) ||
                   pinyin.toLowerCase().includes(query) ||
                   shortName.toLowerCase().includes(query);
        });
        
        this.displayResults(results, query);
    }
    
    displayResults(results, query = '') {
        if (!this.searchResults) return;
        
        if (results.length === 0 && query) {
            this.searchResults.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <div class="text-2xl mb-2">🔍</div>
                    <div>未找到相关省份</div>
                    <div class="text-sm mt-1">请检查输入的省份名称</div>
                </div>
            `;
            this.showResults();
            return;
        }
        
        if (results.length === 0) {
            this.hideResults();
            return;
        }
        
        this.searchResults.innerHTML = results.map((province, index) => `
            <div class="search-result-item p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
                 data-province="${province.id}" 
                 data-index="${index}"
                 role="option">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                            ${province.shortName}
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${province.name}</div>
                            <div class="text-sm text-gray-500">${province.region} · ${province.queryDate}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm ${this.getStatusColor(province.status)}">${this.getStatusText(province.status)}</div>
                        <div class="text-xs text-gray-400">${province.queryTime}</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 绑定点击事件
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const provinceId = e.currentTarget.dataset.province;
                this.selectProvince(provinceId);
            });
        });
        
        this.showResults();
        
        // 保存搜索历史
        if (query && results.length > 0) {
            this.saveSearchHistory(query);
        }
    }
    
    showSearchHistory() {
        if (this.searchHistory.length === 0) return;
        
        const historyHtml = `
            <div class="p-3 border-b border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-600">最近搜索</span>
                    <button class="text-xs text-blue-600 hover:text-blue-800" onclick="searchManager.clearSearchHistory()">
                        清除
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${this.searchHistory.map(item => `
                        <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-blue-100 hover:text-blue-600"
                                onclick="searchManager.selectFromHistory('${item}')">
                            ${item}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.searchResults.innerHTML = historyHtml;
        this.showResults();
    }
    
    selectFromHistory(query) {
        this.searchInput.value = query;
        this.handleSearch({ target: { value: query } });
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('chafen_search_history');
        this.hideResults();
    }
    
    selectProvince(provinceId) {
        const province = this.provinces.find(p => p.id === provinceId);
        if (province) {
            // 更新搜索框
            this.searchInput.value = province.name;
            this.hideResults();
            
            // 跳转到省份页面
            window.location.href = `provinces/${provinceId}.html`;
            
            // 保存选择历史
            this.saveSearchHistory(province.name);
        }
    }
    
    getStatusColor(status) {
        switch (status) {
            case 'open': return 'text-green-600';
            case 'soon': return 'text-amber-600';
            case 'closed': return 'text-gray-600';
            default: return 'text-gray-600';
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
    
    handleKeyDown(e) {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        if (items.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateResults(items, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateResults(items, -1);
                break;
            case 'Enter':
                e.preventDefault();
                const activeItem = this.searchResults.querySelector('.search-result-item.active');
                if (activeItem) {
                    const provinceId = activeItem.dataset.province;
                    this.selectProvince(provinceId);
                }
                break;
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }
    
    navigateResults(items, direction) {
        const activeItem = this.searchResults.querySelector('.search-result-item.active');
        let newIndex = 0;
        
        if (activeItem) {
            const currentIndex = parseInt(activeItem.dataset.index);
            newIndex = currentIndex + direction;
            activeItem.classList.remove('active');
        }
        
        // 循环导航
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;
        
        items[newIndex].classList.add('active');
        items[newIndex].scrollIntoView({ block: 'nearest' });
    }
    
    showResults() {
        this.searchResults.classList.remove('hidden');
    }
    
    hideResults() {
        this.searchResults.classList.add('hidden');
    }
    
    hideResultsDelayed() {
        setTimeout(() => {
            this.hideResults();
        }, 150);
    }
    
    saveSearchHistory(query) {
        if (!query || query.length < 2) return;
        
        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => 
            item.toLowerCase() !== query.toLowerCase()
        );
        
        // 添加到开头
        this.searchHistory.unshift(query);
        
        // 限制历史记录数量
        this.searchHistory = this.searchHistory.slice(0, 5);
        
        // 保存到本地存储
        localStorage.setItem('chafen_search_history', JSON.stringify(this.searchHistory));
    }
    
    loadSearchHistory() {
        try {
            const history = localStorage.getItem('chafen_search_history');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }
}

// 添加搜索结果的样式
const searchStyles = `
    .search-result-item.active {
        background-color: #dbeafe;
        border-color: #3b82f6;
    }
    
    .search-result-item:hover {
        background-color: #f0f9ff;
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// 全局搜索管理器实例
let searchManager;

// 初始化搜索管理器
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
}); 