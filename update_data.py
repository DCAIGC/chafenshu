#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2025年高考查分网站 - 数据更新和验证脚本
用于验证data.js中的数据完整性并更新省份页面
"""

import json
import re
import os
from pathlib import Path
from datetime import datetime

def extract_data_from_js():
    """从data.js提取所有数据"""
    try:
        with open('assets/js/data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取provincesData
        provinces_pattern = r'const provincesData = \[(.*?)\];'
        provinces_match = re.search(provinces_pattern, content, re.DOTALL)
        
        # 提取scheduleData
        schedule_pattern = r'const scheduleData = \{(.*?)\};'
        schedule_match = re.search(schedule_pattern, content, re.DOTALL)
        
        # 提取regionMapping
        region_pattern = r'const regionMapping = \{(.*?)\};'
        region_match = re.search(region_pattern, content, re.DOTALL)
        
        data = {
            'provinces': provinces_match.group(1) if provinces_match else None,
            'schedule': schedule_match.group(1) if schedule_match else None,
            'regions': region_match.group(1) if region_match else None
        }
        
        return data
        
    except Exception as e:
        print(f"读取data.js失败: {e}")
        return None

def validate_provinces_data():
    """验证省份数据的完整性"""
    try:
        with open('assets/js/data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取provincesData数组
        pattern = r'const provincesData = \[(.*?)\];'
        match = re.search(pattern, content, re.DOTALL)
        
        if not match:
            print("❌ 无法找到provincesData数组")
            return False
        
        # 计算省份数量
        provinces_str = match.group(1)
        province_count = len(re.findall(r'\{[^}]*\}', provinces_str))
        
        print(f"📊 数据验证结果:")
        print(f"   - 省份数量: {province_count}")
        
        # 检查必需字段
        required_fields = ['id', 'name', 'pinyin', 'shortName', 'region', 'queryUrl', 'queryDate', 'queryTime', 'examBoard', 'phone']
        
        missing_fields = []
        for field in required_fields:
            if field not in provinces_str:
                missing_fields.append(field)
        
        if missing_fields:
            print(f"❌ 缺少必需字段: {', '.join(missing_fields)}")
            return False
        else:
            print("✅ 所有必需字段都存在")
        
        # 检查查分日期格式
        date_pattern = r'queryDate: [\'"](\d{4}-\d{2}-\d{2})[\'"]'
        dates = re.findall(date_pattern, provinces_str)
        valid_dates = 0
        
        for date_str in dates:
            try:
                datetime.strptime(date_str, '%Y-%m-%d')
                valid_dates += 1
            except:
                print(f"❌ 无效日期格式: {date_str}")
        
        print(f"   - 有效日期: {valid_dates}/{len(dates)}")
        
        return province_count == 34 and len(missing_fields) == 0
        
    except Exception as e:
        print(f"验证数据失败: {e}")
        return False

def check_province_files():
    """检查省份页面文件是否存在"""
    provinces_dir = Path('provinces')
    if not provinces_dir.exists():
        print("❌ provinces目录不存在")
        return False
    
    html_files = list(provinces_dir.glob('*.html'))
    html_files = [f for f in html_files if f.name != 'template.html']
    
    print(f"📁 省份页面文件:")
    print(f"   - 现有页面数量: {len(html_files)}")
    
    if len(html_files) < 34:
        print(f"⚠️  页面数量不足，应该有34个省份页面")
        return False
    
    # 检查文件大小
    small_files = []
    for file in html_files:
        if file.stat().st_size < 5000:  # 小于5KB可能有问题
            small_files.append(file.name)
    
    if small_files:
        print(f"⚠️  以下页面文件可能有问题（文件过小）: {', '.join(small_files)}")
    
    print("✅ 省份页面文件检查完成")
    return True

def generate_data_summary():
    """生成数据摘要报告"""
    print("\n" + "="*50)
    print("📋 数据摘要报告")
    print("="*50)
    
    # 验证数据
    data_valid = validate_provinces_data()
    files_valid = check_province_files()
    
    # 读取日程数据
    try:
        with open('assets/js/data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        schedule_pattern = r"'(\d{4}-\d{2}-\d{2})':\s*\["
        schedule_dates = re.findall(schedule_pattern, content)
        
        print(f"📅 查分日程:")
        for date in sorted(schedule_dates):
            print(f"   - {date}")
        
        # 统计地区
        region_pattern = r"region: '([^']+)'"
        regions = re.findall(region_pattern, content)
        region_count = {}
        for region in regions:
            region_count[region] = region_count.get(region, 0) + 1
        
        print(f"🗺️  地区分布:")
        for region, count in sorted(region_count.items()):
            print(f"   - {region}: {count}个省份")
            
    except Exception as e:
        print(f"读取日程数据失败: {e}")
    
    print(f"\n📈 总体状态:")
    print(f"   - 数据完整性: {'✅ 通过' if data_valid else '❌ 失败'}")
    print(f"   - 页面文件: {'✅ 正常' if files_valid else '❌ 异常'}")
    print(f"   - 最后更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def backup_current_data():
    """备份当前数据"""
    backup_dir = Path('backup')
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # 备份data.js
    try:
        with open('assets/js/data.js', 'r', encoding='utf-8') as src:
            with open(backup_dir / f'data_{timestamp}.js', 'w', encoding='utf-8') as dst:
                dst.write(src.read())
        print(f"✅ 数据已备份: backup/data_{timestamp}.js")
    except Exception as e:
        print(f"❌ 数据备份失败: {e}")

def main():
    """主函数"""
    print("🔍 开始数据验证和更新检查...")
    
    # 备份数据
    backup_current_data()
    
    # 生成摘要报告
    generate_data_summary()
    
    print(f"\n💡 使用说明:")
    print(f"   1. 修改 assets/js/data.js 中的数据")
    print(f"   2. 运行此脚本验证数据完整性")
    print(f"   3. 运行 python generate_provinces.py 重新生成页面")
    print(f"   4. 检查生成的页面是否正确")

if __name__ == '__main__':
    main() 