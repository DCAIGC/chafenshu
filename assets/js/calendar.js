// 日历功能管理器
class CalendarManager {
    constructor() {
        // 检查并验证数据
        if (!window.scheduleData) {
            console.error('scheduleData未加载');
            this.scheduleData = {};
        } else {
            this.scheduleData = window.scheduleData;
            console.log('日历数据加载成功:', Object.keys(this.scheduleData).length + '个日期');
            
            // 验证数据结构
            Object.keys(this.scheduleData).forEach(date => {
                if (!Array.isArray(this.scheduleData[date])) {
                    console.error(`日期 ${date} 的数据不是数组:`, this.scheduleData[date]);
                }
            });
        }
        
        this.calendarWidget = document.getElementById('calendar-widget');
        this.calendarDetails = document.getElementById('calendar-details');
        this.activeDate = null;
        this.init();
    }
    
    init() {
        this.bindCalendarEvents();
        this.updateCalendarStatus();
        
        // 默认选中第一个有数据的日期
        const firstDate = Object.keys(this.scheduleData)[0];
        if (firstDate) {
            this.selectDate(firstDate);
        }
    }
    
    bindCalendarEvents() {
        // 绑定日历日期点击事件
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                this.selectDate(date);
            });
            
            // 添加键盘支持
            day.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const date = e.currentTarget.dataset.date;
                    this.selectDate(date);
                }
            });
            
            // 添加tab支持
            day.setAttribute('tabindex', '0');
        });
    }
    
    selectDate(date) {
        if (this.activeDate === date) {
            // 如果点击的是已选中的日期，则收起详情
            this.hideDetails();
            return;
        }
        
        this.activeDate = date;
        this.updateActiveDay(date);
        this.showDateDetails(date);
    }
    
    updateActiveDay(activeDate) {
        // 移除所有活动状态
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.classList.remove('active');
            day.classList.remove('bg-blue-500', 'text-white');
            day.classList.add('bg-blue-50');
        });
        
        // 添加活动状态到选中的日期
        const activeDay = document.querySelector(`[data-date="${activeDate}"]`);
        if (activeDay) {
            activeDay.classList.add('active');
            activeDay.classList.remove('bg-blue-50');
            activeDay.classList.add('bg-blue-500', 'text-white');
        }
    }
    
    showDateDetails(date) {
        if (!this.scheduleData[date] || !this.calendarDetails) return;
        
        const provinces = this.scheduleData[date];
        
        // 确保provinces是数组
        if (!Array.isArray(provinces)) {
            console.error('provinces数据不是数组:', provinces);
            return;
        }
        
        const dateObj = new Date(date);
        const formattedDate = this.formatDate(dateObj);
        
        const detailsHtml = `
            <div class="border-t border-gray-200 pt-4">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">
                    📅 ${formattedDate} 查分安排
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${provinces.map(province => this.createProvinceScheduleCard(province)).join('')}
                </div>
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-700">
                        💡 提示：具体开放时间可能因网络状况有所调整，建议关注官方最新通知
                    </p>
                </div>
            </div>
        `;
        
        this.calendarDetails.innerHTML = detailsHtml;
        this.calendarDetails.classList.remove('hidden');
        
        // 添加动画效果
        setTimeout(() => {
            this.calendarDetails.style.opacity = '1';
            this.calendarDetails.style.transform = 'translateY(0)';
        }, 10);
        
        // 滚动到详情区域
        this.calendarDetails.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    hideDetails() {
        if (!this.calendarDetails) return;
        
        this.activeDate = null;
        this.calendarDetails.classList.add('hidden');
        
        // 移除所有活动状态
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.classList.remove('active');
            day.classList.remove('bg-blue-500', 'text-white');
            day.classList.add('bg-blue-50');
        });
    }
    
    createProvinceScheduleCard(province) {
        const timeDisplay = province.time === '00:00' ? '全天' : province.time;
        const provinceData = this.getProvinceData(province.name);
        
        return `
            <div class="bg-white rounded-lg p-4 shadow border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-900">${province.name}</h4>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        即将开放
                    </span>
                </div>
                <div class="space-y-1 text-sm text-gray-600">
                    <div class="flex items-center">
                        <span class="w-12">时间:</span>
                        <span class="font-medium text-blue-600">${timeDisplay}</span>
                    </div>
                    ${provinceData ? `
                        <div class="flex items-center">
                            <span class="w-12">地区:</span>
                            <span>${provinceData.region}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <a href="provinces/${this.getProvinceId(province.name)}.html" 
                       class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        查看详情 →
                    </a>
                </div>
            </div>
        `;
    }
    
    getProvinceData(provinceName) {
        const provinces = window.provincesData || [];
        return provinces.find(p => p.name === provinceName);
    }
    
    getProvinceId(provinceName) {
        const provinceData = this.getProvinceData(provinceName);
        return provinceData ? provinceData.id : provinceName.toLowerCase();
    }
    
    updateCalendarStatus() {
        const now = new Date();
        const currentDateStr = now.toISOString().split('T')[0];
        
        Object.keys(this.scheduleData).forEach(date => {
            const calendarDay = document.querySelector(`[data-date="${date}"]`);
            if (!calendarDay) return;
            
            const provinces = this.scheduleData[date];
            const dayElement = calendarDay.querySelector('.text-xs');
            
            // 确保provinces是数组
            if (!Array.isArray(provinces)) {
                console.warn(`日期 ${date} 的provinces数据不是数组:`, provinces);
                return;
            }
            
            if (date < currentDateStr) {
                // 已过去的日期
                dayElement.textContent = `${provinces.length}省已开放`;
                dayElement.className = 'text-xs text-green-600';
            } else if (date === currentDateStr) {
                // 今天
                dayElement.textContent = `今日${provinces.length}省开放`;
                dayElement.className = 'text-xs text-red-600 font-medium';
                calendarDay.classList.add('ring-2', 'ring-red-300');
            } else {
                // 未来的日期
                dayElement.textContent = `${provinces.length}省开放`;
                dayElement.className = 'text-xs text-blue-600';
            }
        });
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[date.getDay()];
        
        return `${year}年${month}月${day}日 ${weekday}`;
    }
    
    // 获取统计信息
    getStatistics() {
        let totalProvinces = 0;
        const dateCount = Object.keys(this.scheduleData).length;
        
        Object.values(this.scheduleData).forEach(provinces => {
            totalProvinces += provinces.length;
        });
        
        return {
            totalProvinces,
            dateCount,
            averagePerDay: Math.round(totalProvinces / dateCount)
        };
    }
    
    // 获取指定日期的省份数量
    getProvinceCountByDate(date) {
        return this.scheduleData[date] ? this.scheduleData[date].length : 0;
    }
    
    // 检查是否为查分日
    isQueryDate(date) {
        return this.scheduleData.hasOwnProperty(date);
    }
    
    // 获取下一个查分日期
    getNextQueryDate() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        const futureDates = Object.keys(this.scheduleData)
            .filter(date => date >= today)
            .sort();
            
        return futureDates.length > 0 ? futureDates[0] : null;
    }
    
    // 获取倒计时信息
    getCountdown() {
        const nextDate = this.getNextQueryDate();
        if (!nextDate) return null;
        
        const now = new Date();
        const target = new Date(nextDate);
        const diff = target.getTime() - now.getTime();
        
        if (diff <= 0) return null;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days, hours, minutes, date: nextDate };
    }
}

// 全局日历管理器实例
let calendarManager;

// 日历工具函数
const CalendarUtils = {
    // 格式化日期显示
    formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        return `${month}月${day}日 周${weekday}`;
    },
    
    // 计算倒计时
    getCountdown(targetDate) {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target - now;
        
        if (diff <= 0) {
            return { expired: true };
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { expired: false, days, hours, minutes };
    },
    
    // 获取最近的查分日期
    getNextQueryDate() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        for (const [date, data] of Object.entries(scheduleData)) {
            if (date >= today) {
                return { date, data };
            }
        }
        
        return null;
    }
};

// 初始化日历组件
document.addEventListener('DOMContentLoaded', () => {
    new CalendarManager();
}); 