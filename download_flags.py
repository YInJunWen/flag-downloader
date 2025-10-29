import json
import os
import requests
import zipfile
from time import sleep

# 获取所有国家代码
def get_country_codes():
    codes_url = "https://flagcdn.com/zh/codes.json"
    response = requests.get(codes_url)
    response.raise_for_status()
    return list(set(response.json().values()))  # 去重确保唯一性

# 下载单张国旗
def download_flag(code):
    flag_url = f"https://flagcdn.com/16x12/{code}.png"
    response = requests.get(flag_url, stream=True)
    
    if response.status_code == 200:
        os.makedirs("flags", exist_ok=True)
        with open(f"flags/{code}.png", "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    elif response.status_code == 404:
        print(f"⚠️ Flag not found: {code}")
    else:
        response.raise_for_status()

# 主函数
def main():
    country_codes = get_country_codes()
    print(f"Found {len(country_codes)} country codes")
    
    for i, code in enumerate(country_codes):
        print(f"Downloading ({i+1}/{len(country_codes)}): {code}")
        download_flag(code)
        sleep(0.1)  # 礼貌延时防止被ban
    
    # 创建ZIP压缩包
    with zipfile.ZipFile("flags.zip", "w") as zipf:
        for file in os.listdir("flags"):
            if file.endswith(".png"):
                zipf.write(os.path.join("flags", file), file)
    print("✅ ZIP package created: flags.zip")

if __name__ == "__main__":
    main()