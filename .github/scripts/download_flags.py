import os
import requests
import zipfile
from pycountry import countries
import tempfile
import time

def download_flag(country_code, retries=3):
    """下载单个国家的国旗"""
    url = f"https://flagcdn.com/16x12/{country_code.lower()}.png"
    
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.content
        except requests.RequestException as e:
            print(f"尝试 {attempt + 1} 下载 {country_code} 失败: {e}")
            if attempt < retries - 1:
                time.sleep(1)  # 等待后重试
            else:
                print(f"无法下载 {country_code} 的国旗")
                return None

def main():
    # 创建临时目录
    with tempfile.TemporaryDirectory() as temp_dir:
        flags_dir = os.path.join(temp_dir, "flags")
        os.makedirs(flags_dir)
        
        downloaded_count = 0
        failed_count = 0
        
        print("开始下载国旗...")
        
        # 获取所有国家
        all_countries = list(countries)
        print(f"总共找到 {len(all_countries)} 个国家")
        
        for country in all_countries:
            country_code = country.alpha_2.lower()
            flag_data = download_flag(country_code)
            
            if flag_data:
                # 保存国旗图片
                filename = f"{country_code}.png"
                filepath = os.path.join(flags_dir, filename)
                
                with open(filepath, 'wb') as f:
                    f.write(flag_data)
                
                downloaded_count += 1
                if downloaded_count % 50 == 0:
                    print(f"已下载 {downloaded_count} 个国旗...")
            else:
                failed_count += 1
        
        print(f"下载完成！成功: {downloaded_count}, 失败: {failed_count}")
        
        # 创建ZIP文件
        zip_filename = "country-flags.zip"
        with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(flags_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.join("flags", file)
                    zipf.write(file_path, arcname)
        
        print(f"ZIP文件已创建: {zip_filename}")
        
        # 创建国家代码映射文件
        mapping_file = "country_codes.txt"
        with open(mapping_file, 'w', encoding='utf-8') as f:
            f.write("国家代码映射表 (ISO 3166-1 alpha-2)\n")
            f.write("=" * 50 + "\n")
            for country in sorted(all_countries, key=lambda x: x.name):
                f.write(f"{country.alpha_2}: {country.name}\n")
        
        # 将映射文件也添加到ZIP中
        with zipfile.ZipFile(zip_filename, 'a', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(mapping_file, "country_codes.txt")
        
        print("国家代码映射表已添加到ZIP文件")

if __name__ == "__main__":
    main()