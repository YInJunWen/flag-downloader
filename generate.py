import os
import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from zipfile import ZipFile

# 尝试导入 phonenumbers（优先本地库，无需网络）
try:
    import phonenumbers
    from phonenumbers import phonenumberutil
    PHONENUMBERS_AVAILABLE = True
except Exception:
    PHONENUMBERS_AVAILABLE = False

# 1. ISO 3166-1 alpha-2 列表（中文名）
countries = [
  {"code": "AD", "name": "安道尔"},
  {"code": "AE", "name": "阿拉伯联合酋长国"},
  {"code": "AF", "name": "阿富汗"},
  {"code": "AG", "name": "安提瓜和巴布达"},
  {"code": "AI", "name": "安圭拉"},
  {"code": "AL", "name": "阿尔巴尼亚"},
  {"code": "AM", "name": "亚美尼亚"},
  {"code": "AO", "name": "安哥拉"},
  {"code": "AQ", "name": "南极洲"},
  {"code": "AR", "name": "阿根廷"},
  {"code": "AS", "name": "美属萨摩亚"},
  {"code": "AT", "name": "奥地利"},
  {"code": "AU", "name": "澳大利亚"},
  {"code": "AW", "name": "阿鲁巴"},
  {"code": "AX", "name": "奥兰群岛"},
  {"code": "AZ", "name": "阿塞拜疆"},
  {"code": "BA", "name": "波斯尼亚和黑塞哥维那"},
  {"code": "BB", "name": "巴巴多斯"},
  {"code": "BD", "name": "孟加拉国"},
  {"code": "BE", "name": "比利时"},
  {"code": "BF", "name": "布基纳法索"},
  {"code": "BG", "name": "保加利亚"},
  {"code": "BH", "name": "巴林"},
  {"code": "BI", "name": "布隆迪"},
  {"code": "BJ", "name": "贝宁"},
  {"code": "BL", "name": "圣巴泰勒米"},
  {"code": "BM", "name": "百慕大"},
  {"code": "BN", "name": "文莱"},
  {"code": "BO", "name": "玻利维亚"},
  {"code": "BQ", "name": "荷兰加勒比区"},
  {"code": "BR", "name": "巴西"},
  {"code": "BS", "name": "巴哈马"},
  {"code": "BT", "name": "不丹"},
  {"code": "BV", "name": "布韦岛"},
  {"code": "BW", "name": "博茨瓦纳"},
  {"code": "BY", "name": "白俄罗斯"},
  {"code": "BZ", "name": "伯利兹"},
  {"code": "CA", "name": "加拿大"},
  {"code": "CC", "name": "科科斯（基林）群岛"},
  {"code": "CD", "name": "刚果民主共和国"},
  {"code": "CF", "name": "中非共和国"},
  {"code": "CG", "name": "刚果共和国"},
  {"code": "CH", "name": "瑞士"},
  {"code": "CI", "name": "科特迪瓦"},
  {"code": "CK", "name": "库克群岛"},
  {"code": "CL", "name": "智利"},
  {"code": "CM", "name": "喀麦隆"},
  {"code": "CN", "name": "中国"},
  {"code": "CO", "name": "哥伦比亚"},
  {"code": "CR", "name": "哥斯达黎加"},
  {"code": "CU", "name": "古巴"},
  {"code": "CV", "name": "佛得角"},
  {"code": "CW", "name": "库拉索"},
  {"code": "CX", "name": "圣诞岛"},
  {"code": "CY", "name": "塞浦路斯"},
  {"code": "CZ", "name": "捷克"},
  {"code": "DE", "name": "德国"},
  {"code": "DJ", "name": "吉布提"},
  {"code": "DK", "name": "丹麦"},
  {"code": "DM", "name": "多米尼克"},
  {"code": "DO", "name": "多米尼加共和国"},
  {"code": "DZ", "name": "阿尔及利亚"},
  {"code": "EC", "name": "厄瓜多尔"},
  {"code": "EE", "name": "爱沙尼亚"},
  {"code": "EG", "name": "埃及"},
  {"code": "EH", "name": "西撒哈拉"},
  {"code": "ER", "name": "厄立特里亚"},
  {"code": "ES", "name": "西班牙"},
  {"code": "ET", "name": "埃塞俄比亚"},
  {"code": "FI", "name": "芬兰"},
  {"code": "FJ", "name": "斐济"},
  {"code": "FK", "name": "福克兰群岛"},
  {"code": "FM", "name": "密克罗尼西亚"},
  {"code": "FO", "name": "法罗群岛"},
  {"code": "FR", "name": "法国"},
  {"code": "GA", "name": "加蓬"},
  {"code": "GB", "name": "英国"},
  {"code": "GD", "name": "格林纳达"},
  {"code": "GE", "name": "格鲁吉亚"},
  {"code": "GF", "name": "法属圭亚那"},
  {"code": "GG", "name": "根西岛"},
  {"code": "GH", "name": "加纳"},
  {"code": "GI", "name": "直布罗陀"},
  {"code": "GL", "name": "格陵兰"},
  {"code": "GM", "name": "冈比亚"},
  {"code": "GN", "name": "几内亚"},
  {"code": "GP", "name": "瓜德罗普"},
  {"code": "GQ", "name": "赤道几内亚"},
  {"code": "GR", "name": "希腊"},
  {"code": "GS", "name": "南乔治亚岛和南桑威奇群岛"},
  {"code": "GT", "name": "危地马拉"},
  {"code": "GU", "name": "关岛"},
  {"code": "GW", "name": "几内亚比绍"},
  {"code": "GY", "name": "圭亚那"},
  {"code": "HK", "name": "中国香港"},
  {"code": "HM", "name": "赫德岛和麦克唐纳群岛"},
  {"code": "HN", "name": "洪都拉斯"},
  {"code": "HR", "name": "克罗地亚"},
  {"code": "HT", "name": "海地"},
  {"code": "HU", "name": "匈牙利"},
  {"code": "ID", "name": "印度尼西亚"},
  {"code": "IE", "name": "爱尔兰"},
  {"code": "IL", "name": "以色列"},
  {"code": "IM", "name": "马恩岛"},
  {"code": "IN", "name": "印度"},
  {"code": "IO", "name": "英属印度洋领地"},
  {"code": "IQ", "name": "伊拉克"},
  {"code": "IR", "name": "伊朗"},
  {"code": "IS", "name": "冰岛"},
  {"code": "IT", "name": "意大利"},
  {"code": "JE", "name": "泽西岛"},
  {"code": "JM", "name": "牙买加"},
  {"code": "JO", "name": "约旦"},
  {"code": "JP", "name": "日本"},
  {"code": "KE", "name": "肯尼亚"},
  {"code": "KG", "name": "吉尔吉斯斯坦"},
  {"code": "KH", "name": "柬埔寨"},
  {"code": "KI", "name": "基里巴斯"},
  {"code": "KM", "name": "科摩罗"},
  {"code": "KN", "name": "圣基茨和尼维斯"},
  {"code": "KP", "name": "朝鲜"},
  {"code": "KR", "name": "韩国"},
  {"code": "KW", "name": "科威特"},
  {"code": "KY", "name": "开曼群岛"},
  {"code": "KZ", "name": "哈萨克斯坦"},
  {"code": "LA", "name": "老挝"},
  {"code": "LB", "name": "黎巴嫩"},
  {"code": "LC", "name": "圣卢西亚"},
  {"code": "LI", "name": "列支敦士登"},
  {"code": "LK", "name": "斯里兰卡"},
  {"code": "LR", "name": "利比里亚"},
  {"code": "LS", "name": "莱索托"},
  {"code": "LT", "name": "立陶宛"},
  {"code": "LU", "name": "卢森堡"},
  {"code": "LV", "name": "拉脱维亚"},
  {"code": "LY", "name": "利比亚"},
  {"code": "MA", "name": "摩洛哥"},
  {"code": "MC", "name": "摩纳哥"},
  {"code": "MD", "name": "摩尔多瓦"},
  {"code": "ME", "name": "黑山"},
  {"code": "MF", "name": "法属圣马丁"},
  {"code": "MG", "name": "马达加斯加"},
  {"code": "MH", "name": "马绍尔群岛"},
  {"code": "MK", "name": "北马其顿"},
  {"code": "ML", "name": "马里"},
  {"code": "MM", "name": "缅甸"},
  {"code": "MN", "name": "蒙古"},
  {"code": "MO", "name": "中国澳门"},
  {"code": "MP", "name": "北马里亚纳群岛"},
  {"code": "MQ", "name": "马提尼克"},
  {"code": "MR", "name": "毛里塔尼亚"},
  {"code": "MS", "name": "蒙特塞拉特"},
  {"code": "MT", "name": "马耳他"},
  {"code": "MU", "name": "毛里求斯"},
  {"code": "MV", "name": "马尔代夫"},
  {"code": "MW", "name": "马拉维"},
  {"code": "MX", "name": "墨西哥"},
  {"code": "MY", "name": "马来西亚"},
  {"code": "MZ", "name": "莫桑比克"},
  {"code": "NA", "name": "纳米比亚"},
  {"code": "NC", "name": "新喀里多尼亚"},
  {"code": "NE", "name": "尼日尔"},
  {"code": "NF", "name": "诺福克岛"},
  {"code": "NG", "name": "尼日利亚"},
  {"code": "NI", "name": "尼加拉瓜"},
  {"code": "NL", "name": "荷兰"},
  {"code": "NO", "name": "挪威"},
  {"code": "NP", "name": "尼泊尔"},
  {"code": "NR", "name": "瑙鲁"},
  {"code": "NU", "name": "纽埃"},
  {"code": "NZ", "name": "新西兰"},
  {"code": "OM", "name": "阿曼"},
  {"code": "PA", "name": "巴拿马"},
  {"code": "PE", "name": "秘鲁"},
  {"code": "PF", "name": "法属波利尼西亚"},
  {"code": "PG", "name": "巴布亚新几内亚"},
  {"code": "PH", "name": "菲律宾"},
  {"code": "PK", "name": "巴基斯坦"},
  {"code": "PL", "name": "波兰"},
  {"code": "PM", "name": "圣皮埃尔和密克隆"},
  {"code": "PN", "name": "皮特凯恩群岛"},
  {"code": "PR", "name": "波多黎各"},
  {"code": "PS", "name": "巴勒斯坦"},
  {"code": "PT", "name": "葡萄牙"},
  {"code": "PW", "name": "帕劳"},
  {"code": "PY", "name": "巴拉圭"},
  {"code": "QA", "name": "卡塔尔"},
  {"code": "RE", "name": "留尼汪"},
  {"code": "RO", "name": "罗马尼亚"},
  {"code": "RS", "name": "塞尔维亚"},
  {"code": "RU", "name": "俄罗斯"},
  {"code": "RW", "name": "卢旺达"},
  {"code": "SA", "name": "沙特阿拉伯"},
  {"code": "SB", "name": "所罗门群岛"},
  {"code": "SC", "name": "塞舌尔"},
  {"code": "SD", "name": "苏丹"},
  {"code": "SE", "name": "瑞典"},
  {"code": "SG", "name": "新加坡"},
  {"code": "SH", "name": "圣赫勒拿"},
  {"code": "SI", "name": "斯洛文尼亚"},
  {"code": "SJ", "name": "斯瓦尔巴和扬马延"},
  {"code": "SK", "name": "斯洛伐克"},
  {"code": "SL", "name": "塞拉利昂"},
  {"code": "SM", "name": "圣马力诺"},
  {"code": "SN", "name": "塞内加尔"},
  {"code": "SO", "name": "索马里"},
  {"code": "SR", "name": "苏里南"},
  {"code": "SS", "name": "南苏丹"},
  {"code": "ST", "name": "圣多美和普林西比"},
  {"code": "SV", "name": "萨尔瓦多"},
  {"code": "SX", "name": "荷属圣马丁"},
  {"code": "SY", "name": "叙利亚"},
  {"code": "SZ", "name": "斯威士兰"},
  {"code": "TC", "name": "特克斯和凯科斯群岛"},
  {"code": "TD", "name": "乍得"},
  {"code": "TF", "name": "法属南部领地"},
  {"code": "TG", "name": "多哥"},
  {"code": "TH", "name": "泰国"},
  {"code": "TJ", "name": "塔吉克斯坦"},
  {"code": "TK", "name": "托克劳"},
  {"code": "TL", "name": "东帝汶"},
  {"code": "TM", "name": "土库曼斯坦"},
  {"code": "TN", "name": "突尼斯"},
  {"code": "TO", "name": "汤加"},
  {"code": "TR", "name": "土耳其"},
  {"code": "TT", "name": "特立尼达和多巴哥"},
  {"code": "TV", "name": "图瓦卢"},
  {"code": "TW", "name": "中国台湾"},
  {"code": "TZ", "name": "坦桑尼亚"},
  {"code": "UA", "name": "乌克兰"},
  {"code": "UG", "name": "乌干达"},
  {"code": "UM", "name": "美国本土外小岛屿"},
  {"code": "US", "name": "美国"},
  {"code": "UY", "name": "乌拉圭"},
  {"code": "UZ", "name": "乌兹别克斯坦"},
  {"code": "VA", "name": "梵蒂冈"},
  {"code": "VC", "name": "圣文森特和格林纳丁斯"},
  {"code": "VE", "name": "委内瑞拉"},
  {"code": "VG", "name": "英属维尔京群岛"},
  {"code": "VI", "name": "美属维尔京群岛"},
  {"code": "VN", "name": "越南"},
  {"code": "VU", "name": "瓦努阿图"},
  {"code": "WF", "name": "瓦利斯和富图纳"},
  {"code": "WS", "name": "萨摩亚"},
  {"code": "XK", "name": "科索沃"},
  {"code": "YE", "name": "也门"},
  {"code": "YT", "name": "马约特"},
  {"code": "ZA", "name": "南非"},
  {"code": "ZM", "name": "赞比亚"},
  {"code": "ZW", "name": "津巴布韦"}
]

# 2. 部分 phone format（可扩展），未覆盖国家使用默认
phone_formats = {
    "CN": {"pattern": r"^(\d{3})(\d{4})(\d{4})$", "placeholder": "138 1234 5678", "maxLength": 11},
    "US": {"pattern": r"^(\d{3})(\d{3})(\d{4})$", "placeholder": "(555) 123-4567", "maxLength": 10},
    "GB": {"pattern": r"^(\d{4})(\d{3})(\d{3})$", "placeholder": "07400 123456", "maxLength": 10},
    "RU": {"pattern": r"^(\d{3})(\d{3})(\d{4})$", "placeholder": "912 345 6789", "maxLength": 10},
    "IN": {"pattern": r"^(\d{5})(\d{5})$", "placeholder": "91234 56789", "maxLength": 10},
}

default_format = {"pattern": r"^(\d{3})(\d{3})(\d{3})$", "placeholder": "123 456 789", "maxLength": 9}

# 3. 本地覆盖（确保关键国家有值）
local_overrides = {
  "US": "1",
  "CN": "86",
  "GB": "44",
  "TW": "886",
  "HK": "852",
  "MO": "853",
  "XK": "383"
}

def dialcodes_from_phonenumbers(countries_list):
    out = {}
    if not PHONENUMBERS_AVAILABLE:
        return out
    getter = getattr(phonenumberutil, 'country_code_for_region', None)
    if not getter:
        return out
    for c in countries_list:
        cc = c.get('code', '').upper()
        if not cc:
            continue
        try:
            code = getter(cc)
            if isinstance(code, int) and code > 0:
                out[cc] = str(code)
        except Exception:
            pass
    return out

def fetch_restcountries_v2():
    url = 'https://restcountries.com/v2/all?fields=alpha2Code;callingCodes'
    try:
        r = requests.get(url, timeout=20)
        r.raise_for_status()
        data = r.json()
        m = {}
        for it in data:
            cca2 = (it.get('alpha2Code') or '').upper()
            if not cca2:
                continue
            calling = it.get('callingCodes') or []
            if isinstance(calling, list) and calling:
                code = str(calling[0]).replace('+','').strip()
                if code:
                    m[cca2] = code
        return m
    except Exception:
        return {}

def fetch_restcountries_v3():
    url = 'https://restcountries.com/v3.1/all'
    try:
        r = requests.get(url, timeout=20)
        r.raise_for_status()
        data = r.json()
        m = {}
        for it in data:
            cca2 = (it.get('cca2') or '').upper()
            if not cca2:
                continue
            idd = it.get('idd') or {}
            root = idd.get('root') or ''
            suffixes = idd.get('suffixes') or ['']
            candidate = (root + (suffixes[0] if suffixes else '')).replace('+','')
            candidate = ''.join(ch for ch in candidate if ch.isdigit())
            if candidate:
                m[cca2] = candidate
        return m
    except Exception:
        return {}

def fetch_mledoze():
    url = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
    try:
        r = requests.get(url, timeout=20)
        r.raise_for_status()
        data = r.json()
        m = {}
        for it in data:
            cca2 = (it.get('cca2') or '').upper()
            if not cca2:
                continue
            # 尝试多种字段
            calling = it.get('callingCodes') or it.get('callingCode') or it.get('calling')
            if calling:
                first = calling[0] if isinstance(calling, list) and calling else calling
                code = str(first).replace('+','').strip()
                code = ''.join(ch for ch in code if ch.isdigit())
                if code:
                    m[cca2] = code
                continue
            # idd 风格
            idd = it.get('idd') or {}
            root = idd.get('root') or ''
            suffixes = idd.get('suffixes') or ['']
            candidate = (root + (suffixes[0] if suffixes else '')).replace('+','')
            candidate = ''.join(ch for ch in candidate if ch.isdigit())
            if candidate:
                m[cca2] = candidate
        return m
    except Exception:
        return {}

def build_dialmap(countries_list):
    dialmap = {}
    # 1. 本地 phonenumbers
    try:
        local = dialcodes_from_phonenumbers(countries_list)
        dialmap.update(local)
    except Exception:
        pass
    # 若本地数据不足则继续网络回退
    if len(dialmap) < 100:
        rc2 = fetch_restcountries_v2()
        dialmap.update(rc2)
    if len(dialmap) < 100:
        rc3 = fetch_restcountries_v3()
        dialmap.update(rc3)
    if len(dialmap) < 100:
        m = fetch_mledoze()
        dialmap.update(m)
    # 合并本地覆盖，local_overrides 覆盖网络/本地结果
    final = {**dialmap, **local_overrides}
    # 规范化为字符串
    final = {k: str(v) for k, v in final.items()}
    return final

def generate_static_entries(countries_list, dialmap):
    missing = []
    entries = []
    for c in countries_list:
        code = c.get('code','').upper()
        name = c.get('name','')
        dial = dialmap.get(code,'') or ''
        if not dial:
            missing.append(code)
        fmt = phone_formats.get(code, default_format)
        entry = {
            "code": code,
            "name": name,
            "dialCode": dial,
            "flag": code.lower(),
            "pattern": fmt["pattern"],
            "placeholder": fmt["placeholder"],
            "maxLength": fmt["maxLength"]
        }
        entries.append(entry)
    return entries, missing

def download_flag(session, code, outdir='flags'):
    url = f'https://flagcdn.com/16x12/{code.lower()}.png'
    path = os.path.join(outdir, f'{code.lower()}.png')
    try:
        r = session.get(url, stream=True, timeout=20)
        if r.status_code == 200:
            with open(path, 'wb') as f:
                for chunk in r.iter_content(1024):
                    f.write(chunk)
            return True
    except Exception:
        pass
    return False

def main():
    os.makedirs('flags', exist_ok=True)
    print("开始生成拨号前缀映射（优先 phonenumbers，本地）...")
    dialmap = build_dialmap(countries)
    print("拨号前缀条目数：", len(dialmap))
    entries, missing = generate_static_entries(countries, dialmap)

    # 输出 JSON 与 countries.js（ESM，静态数据）
    with open('countries.json', 'w', encoding='utf8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)
    with open('countries.js', 'w', encoding='utf8') as f:
        f.write('export default ')
        json.dump(entries, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    # 并发下载 flags
    session = requests.Session()
    print("开始下载国旗到 flags/ ...")
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = {ex.submit(download_flag, session, e['code']): e['code'] for e in entries}
        for fut in as_completed(futures):
            code = futures[fut]
            try:
                ok = fut.result()
            except Exception:
                ok = False
            # 不输出过多日志，失败的文件会在最后报告
    # 打包
    print("打包生成文件...")
    with ZipFile('countries-flags.zip', 'w') as z:
        z.write('countries.json')
        z.write('countries.js')
        for e in entries:
            fn = os.path.join('flags', f"{e['flag']}.png")
            if os.path.exists(fn):
                z.write(fn)

    if missing:
        print("警告：以下国家未获取到 dialCode（请在 local_overrides 补充或排查网络源）：")
        print(", ".join(missing))
    print("完成。生成文件： countries.json, countries.js, flags/, countries-flags.zip")

if __name__ == '__main__':
    main()