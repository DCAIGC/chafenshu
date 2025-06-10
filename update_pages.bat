@echo off
echo =====================================
echo     2025高考查分网站 - 页面更新工具
echo =====================================
echo.

echo [1/2] 验证数据完整性...
python update_data.py
echo.

echo [2/2] 生成省份页面...
python generate_provinces.py
echo.

echo =====================================
echo     更新完成！
echo =====================================
echo.
echo 请检查 provinces/ 目录下的HTML文件
echo 在浏览器中测试页面功能
echo.
pause 