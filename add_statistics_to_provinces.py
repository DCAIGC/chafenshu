#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为所有省份页面添加百度统计代码的脚本
"""

import os
import re
from pathlib import Path

def add_statistics_to_province_page(file_path):
    """为单个省份页面添加统计代码"""
    try:
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经包含统计代码
        if 'statistics.js' in content or 'hm.baidu.com' in content:
            print(f"⚠️  {file_path.name} 已包含统计代码，跳过")
            return False
        
        # 查找 </body> 标签位置
        body_end_pattern = r'</body>'
        body_end_match = re.search(body_end_pattern, content)
        
        if not body_end_match:
            print(f"❌ {file_path.name} 未找到 </body> 标签")
            return False
        
        # 在 </body> 前插入统计代码
        statistics_code = '''
    <!-- 百度统计 -->
    <script src="../assets/js/statistics.js"></script>
    
</body>'''
        
        # 替换 </body> 标签
        new_content = re.sub(r'</body>', statistics_code, content)
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ {file_path.name} 统计代码添加成功")
        return True
        
    except Exception as e:
        print(f"❌ {file_path.name} 处理失败: {e}")
        return False

def process_all_provinces():
    """处理所有省份页面"""
    provinces_dir = Path('provinces')
    
    if not provinces_dir.exists():
        print("❌ provinces 目录不存在")
        return
    
    # 获取所有HTML文件
    html_files = list(provinces_dir.glob('*.html'))
    
    if not html_files:
        print("❌ 未找到省份HTML文件")
        return
    
    print(f"📁 发现 {len(html_files)} 个省份页面")
    print("🚀 开始添加统计代码...")
    print()
    
    success_count = 0
    for html_file in html_files:
        if html_file.name == 'template.html':
            print(f"⏭️  跳过模板文件: {html_file.name}")
            continue
            
        if add_statistics_to_province_page(html_file):
            success_count += 1
    
    print()
    print(f"🎉 完成！成功为 {success_count} 个页面添加统计代码")

def main():
    """主函数"""
    print("=" * 50)
    print("🔧 省份页面统计代码添加工具")
    print("=" * 50)
    print()
    
    # 检查统计JS文件是否存在
    statistics_file = Path('assets/js/statistics.js')
    if not statistics_file.exists():
        print("❌ 统计文件不存在: assets/js/statistics.js")
        print("请确保该文件存在并包含正确的百度统计代码")
        return
    
    print(f"✅ 统计文件检查通过: {statistics_file}")
    print()
    
    # 处理所有省份页面
    process_all_provinces()
    
    print()
    print("=" * 50)
    print("📋 后续操作建议：")
    print("1. 验证几个省份页面确认统计代码正确添加")
    print("2. 如需重新生成所有页面，运行: python generate_provinces.py") 
    print("3. 检查百度统计后台确认数据采集正常")
    print("=" * 50)

if __name__ == '__main__':
    main() 