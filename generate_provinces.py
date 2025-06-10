#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2025年高考查分网站 - 省份页面生成脚本
用于批量生成34个省市自治区的查分页面
"""

import json
import re
import os
from pathlib import Path

def read_provinces_data():
    """从data.js文件中提取省份数据"""
    try:
        with open('assets/js/data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取provincesData数组
        pattern = r'const provincesData = \[(.*?)\];'
        match = re.search(pattern, content, re.DOTALL)
        
        if not match:
            raise ValueError("无法找到provincesData数组")
        
        # 手动解析省份数据（避免JSON解析问题）
        provinces_str = match.group(1)
        
        # 简单提取省份对象
        provinces = []
        province_pattern = r'\{([^}]+)\}'
        province_matches = re.findall(province_pattern, provinces_str, re.DOTALL)
        
        for province_match in province_matches:
            province = {}
            # 提取每个字段
            fields = ['id', 'name', 'pinyin', 'shortName', 'region', 'queryUrl', 'queryDate', 
                     'queryTime', 'examBoard', 'phone', 'status', 'description', 'lastUpdate']
            
            for field in fields:
                # 对于description字段，需要特殊处理以支持内部引号
                if field == 'description':
                    # 尝试匹配到行尾的逗号或结束括号
                    field_pattern = rf"{field}:\s*['\"]([^'\"]+.*?)['\"]\s*[,}}]"
                    field_match = re.search(field_pattern, province_match)
                else:
                    field_pattern = rf"{field}:\s*['\"]([^'\"]*)['\"]"
                    field_match = re.search(field_pattern, province_match)
                
                if field_match:
                    province[field] = field_match.group(1)
            
            if 'name' in province:  # 确保至少有name字段
                provinces.append(province)
        
        print(f"成功读取 {len(provinces)} 个省份数据")
        return provinces
        
    except Exception as e:
        print(f"读取数据失败: {e}")
        return []

def get_province_template():
    """获取省份页面模板"""
    return '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name}2025年高考查分入口 - 查分数</title>
    <meta name="description" content="{name}2025年高考成绩查询官方入口，查分时间{queryDate} {queryTime}，{examBoard}官方发布。">
    <meta name="keywords" content="{name}高考查分,{name}高考成绩查询,2025年高考查分,{shortName}高考查分">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://chafenshu.com/provinces/{id}.html">
    <meta property="og:title" content="{name}2025年高考查分入口">
    <meta property="og:description" content="{name}2025年高考成绩查询官方入口">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="{name}2025年高考查分入口">
    <meta property="twitter:description" content="{name}2025年高考成绩查询官方入口">
    
    <!-- 结构化数据 -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "{name}2025年高考查分入口",
        "description": "{name}2025年高考成绩查询官方入口",
        "url": "https://chafenshu.com/provinces/{id}.html",
        "breadcrumb": {{
            "@type": "BreadcrumbList",
            "itemListElement": [
                {{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "首页",
                    "item": "https://chafenshu.com/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "{name}查分",
                    "item": "https://chafenshu.com/provinces/{id}.html"
                }}
            ]
        }}
    }}
    </script>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {{
            --edu-blue-50: #eff6ff;
            --edu-blue-100: #dbeafe;
            --edu-blue-500: #3b82f6;
            --edu-blue-600: #2563eb;
            --edu-blue-900: #1e3a8a;
            --green-500: #10b981;
            --amber-500: #f59e0b;
            --gray-600: #4b5563;
        }}
        
        .text-main-title {{ 
            font-size: 2.25rem; 
            font-weight: 700; 
            line-height: 1.2;
            color: var(--edu-blue-900);
        }}
        
        .btn-primary {{
            background: linear-gradient(135deg, var(--edu-blue-500) 0%, var(--edu-blue-900) 100%);
            transition: all 0.3s ease;
        }}
        
        .btn-primary:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }}
        
        .info-card {{
            transition: all 0.3s ease;
        }}
        
        .info-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }}
        
        @media (max-width: 640px) {{
            .text-main-title {{ font-size: 1.875rem; }}
        }}
    </style>
</head>
<body class="bg-gray-50 text-gray-800">
    <!-- 导航栏 -->
    <header class="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
        <nav class="container mx-auto px-4 py-3">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold">查分数</h1>
                <div class="text-sm">2025年高考查分</div>
            </div>
        </nav>
    </header>

    <!-- 面包屑导航 -->
    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-3">
            <nav class="flex text-sm text-gray-600" aria-label="面包屑">
                <a href="../index.html" class="hover:text-blue-600">首页</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">{name}查分</span>
            </nav>
        </div>
    </div>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
        <!-- 省份标题 -->
        <section class="text-center mb-12">
            <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span class="text-blue-600 font-bold text-2xl">{shortName}</span>
                </div>
                <h1 class="text-main-title">{name}2025年高考查分入口</h1>
            </div>
            <p class="text-gray-600 text-lg">
                查分时间：{queryDate} {queryTime} | 官方权威查分渠道
            </p>
        </section>

        <!-- 查分信息卡片 -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- 官方查分入口 -->
            <div class="info-card bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    🏛️ 官方查分入口
                </h2>
                <div class="space-y-4">
                    <!-- 官网查询 -->
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h3 class="font-semibold text-blue-900 mb-2 flex items-center">
                            🌐 {examBoard}官网
                        </h3>
                        <p class="text-gray-600 text-sm mb-3">官方权威查分入口</p>
                        <a href="{queryUrl}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="btn-primary inline-block w-full text-white text-center py-3 px-6 rounded-lg font-medium">
                            官网查分 →
                        </a>
                    </div>
                    
                    <!-- 其他查询方式 -->
                    <div class="space-y-3">
                        <h3 class="font-semibold text-gray-900 flex items-center">
                            📱 多种查询方式
                        </h3>
                        {query_methods}
                    </div>
                </div>
            </div>

            <!-- 查分信息 -->
            <div class="info-card bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    📅 查分详情
                </h2>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">查分时间</span>
                        <span class="font-semibold text-blue-600">{queryDate} {queryTime}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">查分状态</span>
                        <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">即将开放</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">咨询电话</span>
                        <a href="tel:{phone}" class="text-blue-600 hover:text-blue-800 font-medium">
                            {phone}
                        </a>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">所属地区</span>
                        <span class="text-gray-800">{region}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 查分指南 -->
        <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-blue-900 mb-6 flex items-center">
                📖 {name}高考查分指南
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="font-semibold text-gray-900 mb-3">查分步骤</h3>
                    <ol class="space-y-2 text-gray-700">
                        <li class="flex items-start">
                            <span class="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                            准备身份证号和准考证号
                        </li>
                        <li class="flex items-start">
                            <span class="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                            访问{examBoard}官方网站
                        </li>
                        <li class="flex items-start">
                            <span class="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                            点击高考成绩查询入口
                        </li>
                        <li class="flex items-start">
                            <span class="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                            输入个人信息进行查询
                        </li>
                    </ol>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900 mb-3">注意事项</h3>
                    <ul class="space-y-2 text-gray-700">
                        <li class="flex items-start">
                            <span class="text-amber-500 mr-2 mt-1">⚠️</span>
                            请通过官方渠道查询，谨防诈骗
                        </li>
                        <li class="flex items-start">
                            <span class="text-amber-500 mr-2 mt-1">⚠️</span>
                            查分高峰期可能网络拥堵，请耐心等待
                        </li>
                        <li class="flex items-start">
                            <span class="text-amber-500 mr-2 mt-1">⚠️</span>
                            如对成绩有疑问，可申请成绩复核
                        </li>
                        <li class="flex items-start">
                            <span class="text-amber-500 mr-2 mt-1">⚠️</span>
                            保管好个人信息，避免泄露
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- 返回首页 -->
        <div class="text-center">
            <a href="../index.html" 
               class="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                ← 返回首页查看更多省份
            </a>
        </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4 text-center">
            <p class="mb-2">查分数 - 2025年全国高考查分网站</p>
            <p class="text-sm text-gray-400">数据来源：{examBoard}官方发布 | 仅供参考，请以官方最新公告为准</p>
        </div>
    </footer>
</body>
</html>'''

def format_query_time(date, time):
    """格式化查分时间显示"""
    if time == '00:00':
        return '全天'
    else:
        return time

def parse_query_methods(description):
    """解析查询方式并生成HTML"""
    if not description:
        return '<p class="text-gray-600 text-sm">暂无其他查询方式</p>'
    
    # 分割查询方式
    methods = [method.strip() for method in description.split('、')]
    
    html_parts = []
    for method in methods:
        # 确定图标和类型
        icon = '📋'  # 默认图标
        method_type = '其他方式'
        
        if '网站查询' in method:
            icon = '🌐'
            method_type = '官方网站'
        elif '微信小程序' in method:
            icon = '💬'
            method_type = '微信小程序'
        elif '微信公众号' in method:
            icon = '📢'
            method_type = '微信公众号'
        elif 'APP' in method:
            icon = '📱'
            method_type = '手机APP'
        elif '短信推送' in method:
            icon = '📲'
            method_type = '短信推送'
        elif '电话查询' in method:
            icon = '☎️'
            method_type = '电话查询'
        elif '政务' in method or '服务' in method:
            icon = '🏛️'
            method_type = '政务服务'
        elif '数字服务' in method:
            icon = '💻'
            method_type = '数字服务'
        
        # 提取具体名称（如果有引号）
        detail_info = ''
        if '"' in method:
            import re
            detail_match = re.search(r'"([^"]*)"', method)
            if detail_match:
                detail_info = f' - {detail_match.group(1)}'
        
        # 生成方法卡片
        html_parts.append(f'''
        <div class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
            <span class="text-lg mr-3">{icon}</span>
            <div class="flex-1">
                <div class="text-gray-800 font-medium">{method_type}{detail_info}</div>
                <div class="text-xs text-gray-500 mt-1">{method}</div>
            </div>
        </div>
        ''')
    
    return ''.join(html_parts) if html_parts else '<p class="text-gray-600 text-sm">暂无其他查询方式</p>'

def generate_province_page(province, template):
    """生成单个省份页面"""
    query_time_formatted = format_query_time(province['queryDate'], province['queryTime'])
    query_methods_html = parse_query_methods(province.get('description', ''))
    
    # 替换模板中的占位符
    page_content = template.format(
        id=province['id'],
        name=province['name'],
        shortName=province['shortName'],
        region=province['region'],
        queryUrl=province['queryUrl'],
        queryDate=province['queryDate'],
        queryTime=query_time_formatted,
        examBoard=province['examBoard'],
        phone=province['phone'],
        description=province.get('description', ''),
        query_methods=query_methods_html
    )
    
    return page_content

def main():
    """主函数：生成所有省份页面"""
    print("开始生成省份页面...")
    
    # 创建provinces目录
    provinces_dir = Path('provinces')
    provinces_dir.mkdir(exist_ok=True)
    
    # 读取省份数据
    provinces = read_provinces_data()
    if not provinces:
        print("无法读取省份数据，退出程序")
        return
    
    # 获取页面模板
    template = get_province_template()
    
    # 生成每个省份的页面
    success_count = 0
    for province in provinces:
        try:
            # 生成页面内容
            page_content = generate_province_page(province, template)
            
            # 写入文件
            file_path = provinces_dir / f"{province['id']}.html"
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(page_content)
            
            print(f"✓ 生成 {province['name']} 页面: {file_path}")
            success_count += 1
            
        except Exception as e:
            print(f"✗ 生成 {province['name']} 页面失败: {e}")
    
    print(f"\n页面生成完成！成功生成 {success_count} 个省份页面")
    print(f"生成位置: {provinces_dir.absolute()}")

if __name__ == '__main__':
    main() 