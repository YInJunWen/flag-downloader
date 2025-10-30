// generate.js
import { writeFileSync, mkdirSync } from 'fs';
import fetch from 'node-fetch';

// 1. ISO 3166-1 alpha-2 列表（中文名）
const countries = [
  { "code": "AD", "name": "安道尔" },
  { "code": "AE", "name": "阿拉伯联合酋长国" },
  { "code": "AF", "name": "阿富汗" },
  { "code": "AG", "name": "安提瓜和巴布达" },
  { "code": "AI", "name": "安圭拉" },
  { "code": "AL", "name": "阿尔巴尼亚" },
  { "code": "AM", "name": "亚美尼亚" },
  { "code": "AO", "name": "安哥拉" },
  { "code": "AQ", "name": "南极洲" },
  { "code": "AR", "name": "阿根廷" },
  { "code": "AS", "name": "美属萨摩亚" },
  { "code": "AT", "name": "奥地利" },
  { "code": "AU", "name": "澳大利亚" },
  { "code": "AW", "name": "阿鲁巴" },
  { "code": "AX", "name": "奥兰群岛" },
  { "code": "AZ", "name": "阿塞拜疆" },
  { "code": "BA", "name": "波斯尼亚和黑塞哥维那" },
  { "code": "BB", "name": "巴巴多斯" },
  { "code": "BD", "name": "孟加拉国" },
  { "code": "BE", "name": "比利时" },
  { "code": "BF", "name": "布基纳法索" },
  { "code": "BG", "name": "保加利亚" },
  { "code": "BH", "name": "巴林" },
  { "code": "BI", "name": "布隆迪" },
  { "code": "BJ", "name": "贝宁" },
  { "code": "BL", "name": "圣巴泰勒米" },
  { "code": "BM", "name": "百慕大" },
  { "code": "BN", "name": "文莱" },
  { "code": "BO", "name": "玻利维亚" },
  { "code": "BQ", "name": "荷兰加勒比区" },
  { "code": "BR", "name": "巴西" },
  { "code": "BS", "name": "巴哈马" },
  { "code": "BT", "name": "不丹" },
  { "code": "BV", "name": "布韦岛" },
  { "code": "BW", "name": "博茨瓦纳" },
  { "code": "BY", "name": "白俄罗斯" },
  { "code": "BZ", "name": "伯利兹" },
  { "code": "CA", "name": "加拿大" },
  { "code": "CC", "name": "科科斯（基林）群岛" },
  { "code": "CD", "name": "刚果民主共和国" },
  { "code": "CF", "name": "中非共和国" },
  { "code": "CG", "name": "刚果共和国" },
  { "code": "CH", "name": "瑞士" },
  { "code": "CI", "name": "科特迪瓦" },
  { "code": "CK", "name": "库克群岛" },
  { "code": "CL", "name": "智利" },
  { "code": "CM", "name": "喀麦隆" },
  { "code": "CN", "name": "中国" },
  { "code": "CO", "name": "哥伦比亚" },
  { "code": "CR", "name": "哥斯达黎加" },
  { "code": "CU", "name": "古巴" },
  { "code": "CV", "name": "佛得角" },
  { "code": "CW", "name": "库拉索" },
  { "code": "CX", "name": "圣诞岛" },
  { "code": "CY", "name": "塞浦路斯" },
  { "code": "CZ", "name": "捷克" },
  { "code": "DE", "name": "德国" },
  { "code": "DJ", "name": "吉布提" },
  { "code": "DK", "name": "丹麦" },
  { "code": "DM", "name": "多米尼克" },
  { "code": "DO", "name": "多米尼加共和国" },
  { "code": "DZ", "name": "阿尔及利亚" },
  { "code": "EC", "name": "厄瓜多尔" },
  { "code": "EE", "name": "爱沙尼亚" },
  { "code": "EG", "name": "埃及" },
  { "code": "EH", "name": "西撒哈拉" },
  { "code": "ER", "name": "厄立特里亚" },
  { "code": "ES", "name": "西班牙" },
  { "code": "ET", "name": "埃塞俄比亚" },
  { "code": "FI", "name": "芬兰" },
  { "code": "FJ", "name": "斐济" },
  { "code": "FK", "name": "福克兰群岛" },
  { "code": "FM", "name": "密克罗尼西亚" },
  { "code": "FO", "name": "法罗群岛" },
  { "code": "FR", "name": "法国" },
  { "code": "GA", "name": "加蓬" },
  { "code": "GB", "name": "英国" },
  { "code": "GD", "name": "格林纳达" },
  { "code": "GE", "name": "格鲁吉亚" },
  { "code": "GF", "name": "法属圭亚那" },
  { "code": "GG", "name": "根西岛" },
  { "code": "GH", "name": "加纳" },
  { "code": "GI", "name": "直布罗陀" },
  { "code": "GL", "name": "格陵兰" },
  { "code": "GM", "name": "冈比亚" },
  { "code": "GN", "name": "几内亚" },
  { "code": "GP", "name": "瓜德罗普" },
  { "code": "GQ", "name": "赤道几内亚" },
  { "code": "GR", "name": "希腊" },
  { "code": "GS", "name": "南乔治亚岛和南桑威奇群岛" },
  { "code": "GT", "name": "危地马拉" },
  { "code": "GU", "name": "关岛" },
  { "code": "GW", "name": "几内亚比绍" },
  { "code": "GY", "name": "圭亚那" },
  { "code": "HK", "name": "中国香港" },
  { "code": "HM", "name": "赫德岛和麦克唐纳群岛" },
  { "code": "HN", "name": "洪都拉斯" },
  { "code": "HR", "name": "克罗地亚" },
  { "code": "HT", "name": "海地" },
  { "code": "HU", "name": "匈牙利" },
  { "code": "ID", "name": "印度尼西亚" },
  { "code": "IE", "name": "爱尔兰" },
  { "code": "IL", "name": "以色列" },
  { "code": "IM", "name": "马恩岛" },
  { "code": "IN", "name": "印度" },
  { "code": "IO", "name": "英属印度洋领地" },
  { "code": "IQ", "name": "伊拉克" },
  { "code": "IR", "name": "伊朗" },
  { "code": "IS", "name": "冰岛" },
  { "code": "IT", "name": "意大利" },
  { "code": "JE", "name": "泽西岛" },
  { "code": "JM", "name": "牙买加" },
  { "code": "JO", "name": "约旦" },
  { "code": "JP", "name": "日本" },
  { "code": "KE", "name": "肯尼亚" },
  { "code": "KG", "name": "吉尔吉斯斯坦" },
  { "code": "KH", "name": "柬埔寨" },
  { "code": "KI", "name": "基里巴斯" },
  { "code": "KM", "name": "科摩罗" },
  { "code": "KN", "name": "圣基茨和尼维斯" },
  { "code": "KP", "name": "朝鲜" },
  { "code": "KR", "name": "韩国" },
  { "code": "KW", "name": "科威特" },
  { "code": "KY", "name": "开曼群岛" },
  { "code": "KZ", "name": "哈萨克斯坦" },
  { "code": "LA", "name": "老挝" },
  { "code": "LB", "name": "黎巴嫩" },
  { "code": "LC", "name": "圣卢西亚" },
  { "code": "LI", "name": "列支敦士登" },
  { "code": "LK", "name": "斯里兰卡" },
  { "code": "LR", "name": "利比里亚" },
  { "code": "LS", "name": "莱索托" },
  { "code": "LT", "name": "立陶宛" },
  { "code": "LU", "name": "卢森堡" },
  { "code": "LV", "name": "拉脱维亚" },
  { "code": "LY", "name": "利比亚" },
  { "code": "MA", "name": "摩洛哥" },
  { "code": "MC", "name": "摩纳哥" },
  { "code": "MD", "name": "摩尔多瓦" },
  { "code": "ME", "name": "黑山" },
  { "code": "MF", "name": "法属圣马丁" },
  { "code": "MG", "name": "马达加斯加" },
  { "code": "MH", "name": "马绍尔群岛" },
  { "code": "MK", "name": "北马其顿" },
  { "code": "ML", "name": "马里" },
  { "code": "MM", "name": "缅甸" },
  { "code": "MN", "name": "蒙古" },
  { "code": "MO", "name": "中国澳门" },
  { "code": "MP", "name": "北马里亚纳群岛" },
  { "code": "MQ", "name": "马提尼克" },
  { "code": "MR", "name": "毛里塔尼亚" },
  { "code": "MS", "name": "蒙特塞拉特" },
  { "code": "MT", "name": "马耳他" },
  { "code": "MU", "name": "毛里求斯" },
  { "code": "MV", "name": "马尔代夫" },
  { "code": "MW", "name": "马拉维" },
  { "code": "MX", "name": "墨西哥" },
  { "code": "MY", "name": "马来西亚" },
  { "code": "MZ", "name": "莫桑比克" },
  { "code": "NA", "name": "纳米比亚" },
  { "code": "NC", "name": "新喀里多尼亚" },
  { "code": "NE", "name": "尼日尔" },
  { "code": "NF", "name": "诺福克岛" },
  { "code": "NG", "name": "尼日利亚" },
  { "code": "NI", "name": "尼加拉瓜" },
  { "code": "NL", "name": "荷兰" },
  { "code": "NO", "name": "挪威" },
  { "code": "NP", "name": "尼泊尔" },
  { "code": "NR", "name": "瑙鲁" },
  { "code": "NU", "name": "纽埃" },
  { "code": "NZ", "name": "新西兰" },
  { "code": "OM", "name": "阿曼" },
  { "code": "PA", "name": "巴拿马" },
  { "code": "PE", "name": "秘鲁" },
  { "code": "PF", "name": "法属波利尼西亚" },
  { "code": "PG", "name": "巴布亚新几内亚" },
  { "code": "PH", "name": "菲律宾" },
  { "code": "PK", "name": "巴基斯坦" },
  { "code": "PL", "name": "波兰" },
  { "code": "PM", "name": "圣皮埃尔和密克隆" },
  { "code": "PN", "name": "皮特凯恩群岛" },
  { "code": "PR", "name": "波多黎各" },
  { "code": "PS", "name": "巴勒斯坦" },
  { "code": "PT", "name": "葡萄牙" },
  { "code": "PW", "name": "帕劳" },
  { "code": "PY", "name": "巴拉圭" },
  { "code": "QA", "name": "卡塔尔" },
  { "code": "RE", "name": "留尼汪" },
  { "code": "RO", "name": "罗马尼亚" },
  { "code": "RS", "name": "塞尔维亚" },
  { "code": "RU", "name": "俄罗斯" },
  { "code": "RW", "name": "卢旺达" },
  { "code": "SA", "name": "沙特阿拉伯" },
  { "code": "SB", "name": "所罗门群岛" },
  { "code": "SC", "name": "塞舌尔" },
  { "code": "SD", "name": "苏丹" },
  { "code": "SE", "name": "瑞典" },
  { "code": "SG", "name": "新加坡" },
  { "code": "SH", "name": "圣赫勒拿" },
  { "code": "SI", "name": "斯洛文尼亚" },
  { "code": "SJ", "name": "斯瓦尔巴和扬马延" },
  { "code": "SK", "name": "斯洛伐克" },
  { "code": "SL", "name": "塞拉利昂" },
  { "code": "SM", "name": "圣马力诺" },
  { "code": "SN", "name": "塞内加尔" },
  { "code": "SO", "name": "索马里" },
  { "code": "SR", "name": "苏里南" },
  { "code": "SS", "name": "南苏丹" },
  { "code": "ST", "name": "圣多美和普林西比" },
  { "code": "SV", "name": "萨尔瓦多" },
  { "code": "SX", "name": "荷属圣马丁" },
  { "code": "SY", "name": "叙利亚" },
  { "code": "SZ", "name": "斯威士兰" },
  { "code": "TC", "name": "特克斯和凯科斯群岛" },
  { "code": "TD", "name": "乍得" },
  { "code": "TF", "name": "法属南部领地" },
  { "code": "TG", "name": "多哥" },
  { "code": "TH", "name": "泰国" },
  { "code": "TJ", "name": "塔吉克斯坦" },
  { "code": "TK", "name": "托克劳" },
  { "code": "TL", "name": "东帝汶" },
  { "code": "TM", "name": "土库曼斯坦" },
  { "code": "TN", "name": "突尼斯" },
  { "code": "TO", "name": "汤加" },
  { "code": "TR", "name": "土耳其" },
  { "code": "TT", "name": "特立尼达和多巴哥" },
  { "code": "TV", "name": "图瓦卢" },
  { "code": "TW", "name": "中国台湾" },
  { "code": "TZ", "name": "坦桑尼亚" },
  { "code": "UA", "name": "乌克兰" },
  { "code": "UG", "name": "乌干达" },
  { "code": "UM", "name": "美国本土外小岛屿" },
  { "code": "US", "name": "美国" },
  { "code": "UY", "name": "乌拉圭" },
  { "code": "UZ", "name": "乌兹别克斯坦" },
  { "code": "VA", "name": "梵蒂冈" },
  { "code": "VC", "name": "圣文森特和格林纳丁斯" },
  { "code": "VE", "name": "委内瑞拉" },
  { "code": "VG", "name": "英属维尔京群岛" },
  { "code": "VI", "name": "美属维尔京群岛" },
  { "code": "VN", "name": "越南" },
  { "code": "VU", "name": "瓦努阿图" },
  { "code": "WF", "name": "瓦利斯和富图纳" },
  { "code": "WS", "name": "萨摩亚" },
  { "code": "XK", "name": "科索沃" },
  { "code": "YE", "name": "也门" },
  { "code": "YT", "name": "马约特" },
  { "code": "ZA", "name": "南非" },
  { "code": "ZM", "name": "赞比亚" },
  { "code": "ZW", "name": "津巴布韦" }
];

// 2. phoneFormats（来源于 libphonenumber，保持原始映射）
const phoneFormats = {
  "AD": { maxLength: 6, pattern: "^(\\d{3})(\\d{3})$", placeholder: "123 456" },
  "AE": { maxLength: 9, pattern: "^(\\d{1})(\\d{3})(\\d{3})(\\d{3})$", placeholder: "50 123 4567" },
  "AF": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "70 123 4567" },
  "AG": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(268) 123-4567" },
  "AI": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(264) 123-4567" },
  "AL": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "66 123 4567" },
  "AM": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "77 123 456" },
  "AO": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "923 123 456" },
  "AQ": { maxLength: 6, pattern: "^(\\d{3})(\\d{3})$", placeholder: "123 456" },
  "AR": { maxLength: 10, pattern: "^(\\d{2})(\\d{4})(\\d{4})$", placeholder: "11 1234 5678" },
  "AS": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(684) 123-4567" },
  "AT": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "664 1234567" },
  "AU": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "4 1234 5678" },
  "AW": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "560 1234" },
  "AX": { maxLength: 10, pattern: "^(\\d{3})(\\d{4})(\\d{3})$", placeholder: "18 123 4567" },
  "AZ": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{2})(\\d{2})$", placeholder: "50 123 45 67" },
  "BA": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "61 123 456" },
  "BB": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(246) 123-4567" },
  "BD": { maxLength: 10, pattern: "^(\\d{1})(\\d{4})(\\d{5})$", placeholder: "17 1234 56789" },
  "BE": { maxLength: 9, pattern: "^(\\d{3})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "470 12 34 56" },
  "BF": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "70 12 34 56" },
  "BG": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "88 123 4567" },
  "BH": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "3333 4444" },
  "BI": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "79 12 34 56" },
  "BJ": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "90 12 34 56" },
  "BL": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "690 12 34 56" },
  "BM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(441) 123-4567" },
  "BN": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "123 4567" },
  "BO": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "7 123 4567" },
  "BQ": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "318 1234" },
  "BR": { maxLength: 11, pattern: "^(\\d{2})(\\d{4,5})(\\d{4})$", placeholder: "11 91234 5678" },
  "BS": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(242) 123-4567" },
  "BT": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "17 123 456" },
  "BV": { maxLength: 8, pattern: "^(\\d{3})(\\d{2})(\\d{3})$", placeholder: "123 45 678" },
  "BW": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "71 123 456" },
  "BY": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{2})(\\d{2})$", placeholder: "29 123 45 67" },
  "BZ": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "612 3456" },
  "CA": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(555) 123-4567" },
  "CC": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "4 1234 5678" },
  "CD": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "99 123 4567" },
  "CF": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "70 12 34 56" },
  "CG": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "06 123 4567" },
  "CH": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{2})(\\d{2})$", placeholder: "79 123 45 67" },
  "CI": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "01 23 45 67" },
  "CK": { maxLength: 5, pattern: "^(\\d{2})(\\d{3})$", placeholder: "12 345" },
  "CL": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "9 1234 5678" },
  "CM": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "6 1234 5678" },
  "CN": { maxLength: 11, pattern: "^(\\d{3})(\\d{4})(\\d{4})$", placeholder: "138 1234 5678" },
  "CO": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "300 123 4567" },
  "CR": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "8312 3456" },
  "CU": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "5 123 4567" },
  "CV": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "991 2345" },
  "CW": { maxLength: 7, pattern: "^(\\d{1})(\\d{3})(\\d{3})$", placeholder: "9 123 4567" },
  "CX": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "4 1234 5678" },
  "CY": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "96 123 456" },
  "CZ": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "601 123 456" },
  "DE": { maxLength: 11, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "0171 1234567" },
  "DJ": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "77 12 34 56" },
  "DK": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "12 34 56 78" },
  "DM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(767) 123-4567" },
  "DO": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(809) 123-4567" },
  "DZ": { maxLength: 9, pattern: "^(\\d{1})(\\d{2})(\\d{3})(\\d{3})$", placeholder: "5 55 123 456" },
  "EC": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "9 1234 5678" },
  "EE": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "5123 4567" },
  "EG": { maxLength: 10, pattern: "^(\\d{2})(\\d{4})(\\d{4})$", placeholder: "10 1234 5678" },
  "EH": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "650 123 456" },
  "ER": { maxLength: 7, pattern: "^(\\d{1})(\\d{3})(\\d{3})$", placeholder: "1 234 567" },
  "ES": { maxLength: 9, pattern: "^(\\d{3})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "612 34 56 78" },
  "ET": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "91 123 4567" },
  "FI": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "41 123 4567" },
  "FJ": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "701 2345" },
  "FK": { maxLength: 5, pattern: "^(\\d{5})$", placeholder: "12345" },
  "FM": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "350 1234" },
  "FO": { maxLength: 6, pattern: "^(\\d{3})(\\d{3})$", placeholder: "201 234" },
  "FR": { maxLength: 9, pattern: "^(\\d{1})(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "6 12 34 56 78" },
  "GA": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "6 012 3456" },
  "GB": { maxLength: 10, pattern: "^(\\d{4})(\\d{3})(\\d{3})$", placeholder: "07400 123456" },
  "GD": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(473) 123-4567" },
  "GE": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "577 123 456" },
  "GF": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "694 12 34 56" },
  "GG": { maxLength: 10, pattern: "^(\\d{4})(\\d{3})(\\d{3})$", placeholder: "07781 123456" },
  "GH": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "24 123 4567" },
  "GI": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "200 12345" },
  "GL": { maxLength: 6, pattern: "^(\\d{2})(\\d{2})(\\d{2})$", placeholder: "22 12 34" },
  "GM": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "301 2345" },
  "GN": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "62 123 4567" },
  "GP": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "690 12 34 56" },
  "GQ": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "222 123 456" },
  "GR": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "690 123 4567" },
  "GS": { maxLength: 5, pattern: "^(\\d{5})$", placeholder: "12345" },
  "GT": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "4123 4567" },
  "GU": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(671) 123-4567" },
  "GW": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "955 1234" },
  "GY": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "609 1234" },
  "HK": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "5123 4567" },
  "HM": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "4 1234 5678" },
  "HN": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "3123 4567" },
  "HR": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "91 123 4567" },
  "HT": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "34 12 3456" },
  "HU": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "20 123 4567" },
  "ID": { maxLength: 11, pattern: "^(\\d{3})(\\d{4})(\\d{4})$", placeholder: "812 3456 7890" },
  "IE": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "85 123 4567" },
  "IL": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "50 123 4567" },
  "IM": { maxLength: 10, pattern: "^(\\d{4})(\\d{3})(\\d{3})$", placeholder: "07624 123456" },
  "IN": { maxLength: 10, pattern: "^(\\d{5})(\\d{5})$", placeholder: "91234 56789" },
  "IO": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "370 1234" },
  "IQ": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "750 123 4567" },
  "IR": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "912 123 4567" },
  "IS": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "611 1234" },
  "IT": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "320 123 4567" },
  "JE": { maxLength: 10, pattern: "^(\\d{4})(\\d{3})(\\d{3})$", placeholder: "07797 123456" },
  "JM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(876) 123-4567" },
  "JO": { maxLength: 9, pattern: "^(\\d{1})(\\d{3})(\\d{3})(\\d{2})$", placeholder: "7 901 234 56" },
  "JP": { maxLength: 11, pattern: "^(\\d{3})(\\d{4})(\\d{4})$", placeholder: "090-1234-5678" },
  "KE": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "712 345 678" },
  "KG": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "700 123 456" },
  "KH": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "81 123 4567" },
  "KI": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "72 123 456" },
  "KM": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "760 1234" },
  "KN": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(869) 123-4567" },
  "KP": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "192 123 4567" },
  "KR": { maxLength: 11, pattern: "^(\\d{3})(\\d{4})(\\d{4})$", placeholder: "10-1234-5678" },
  "KW": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "5000 1234" },
  "KY": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(345) 123-4567" },
  "KZ": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "771 123 4567" },
  "LA": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "20 123 4567" },
  "LB": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "71 123 456" },
  "LC": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(758) 123-4567" },
  "LI": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "660 1234" },
  "LK": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "71 123 4567" },
  "LR": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "77 123 456" },
  "LS": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "58 123 456" },
  "LT": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "600 12345" },
  "LU": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "621 123 456" },
  "LV": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "21 234 567" },
  "LY": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "91 123 4567" },
  "MA": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "650 123 456" },
  "MC": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "60 12 34 56" },
  "MD": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "671 12345" },
  "ME": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "67 123 456" },
  "MF": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "690 12 34 56" },
  "MG": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "34 123 4567" },
  "MH": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "235 1234" },
  "MK": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "72 123 456" },
  "ML": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "66 12 34 56" },
  "MM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "92 123 4567" },
  "MN": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "88 12 34 56" },
  "MO": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "6612 3456" },
  "MP": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(670) 123-4567" },
  "MQ": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "696 12 34 56" },
  "MR": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "22 123 456" },
  "MS": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(664) 123-4567" },
  "MT": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "7901 2345" },
  "MU": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "5251 2345" },
  "MV": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "771 2345" },
  "MW": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "99 123 4567" },
  "MX": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "55 1234 5678" },
  "MY": { maxLength: 10, pattern: "^(\\d{2})(\\d{4})(\\d{4})$", placeholder: "12 1234 5678" },
  "MZ": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "82 123 4567" },
  "NA": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "81 123 456" },
  "NC": { maxLength: 6, pattern: "^(\\d{2})(\\d{2})(\\d{2})$", placeholder: "75 12 34" },
  "NE": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "93 12 34 56" },
  "NF": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "3 8123 4567" },
  "NG": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "802 123 4567" },
  "NI": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "8123 4567" },
  "NL": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "6 12345678" },
  "NO": { maxLength: 8, pattern: "^(\\d{3})(\\d{2})(\\d{3})$", placeholder: "412 34 567" },
  "NP": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "984 123 4567" },
  "NR": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "555 1234" },
  "NU": { maxLength: 4, pattern: "^(\\d{4})$", placeholder: "1234" },
  "NZ": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "21 123 4567" },
  "OM": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "9212 3456" },
  "PA": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "612 34567" },
  "PE": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "912 345 678" },
  "PF": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "87 12 34 56" },
  "PG": { maxLength: 8, pattern: "^(\\d{3})(\\d{5})$", placeholder: "701 23456" },
  "PH": { maxLength: 10, pattern: "^(\\d{4})(\\d{3})(\\d{3})$", placeholder: "905 123 4567" },
  "PK": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "300 123 4567" },
  "PL": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "512 345 678" },
  "PM": { maxLength: 6, pattern: "^(\\d{2})(\\d{2})(\\d{2})$", placeholder: "55 12 34" },
  "PN": { maxLength: 9, pattern: "^(\\d{1})(\\d{4})(\\d{4})$", placeholder: "3 8123 4567" },
  "PR": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(787) 123-4567" },
  "PS": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "599 123 456" },
  "PT": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "912 345 678" },
  "PW": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "620 1234" },
  "PY": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "971 123 456" },
  "QA": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "3312 3456" },
  "RE": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "692 12 34 56" },
  "RO": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "712 345 678" },
  "RS": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "60 123 4567" },
  "RU": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "912 345 6789" },
  "RW": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "720 123 456" },
  "SA": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "50 123 4567" },
  "SB": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "741 2345" },
  "SC": { maxLength: 7, pattern: "^(\\d{1})(\\d{3})(\\d{3})$", placeholder: "2 512 345" },
  "SD": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "91 123 4567" },
  "SE": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "70 123 45 67" },
  "SG": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "8123 4567" },
  "SH": { maxLength: 5, pattern: "^(\\d{5})$", placeholder: "12345" },
  "SI": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "40 123 456" },
  "SJ": { maxLength: 8, pattern: "^(\\d{3})(\\d{2})(\\d{3})$", placeholder: "412 34 567" },
  "SK": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "901 123 456" },
  "SL": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "76 123 456" },
  "SM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "366 612 3456" },
  "SN": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "70 123 4567" },
  "SO": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "7 123 4567" },
  "SR": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "741 2345" },
  "SS": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "977 123 456" },
  "ST": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "990 1234" },
  "SV": { maxLength: 8, pattern: "^(\\d{4})(\\d{4})$", placeholder: "7123 4567" },
  "SX": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(721) 123-4567" },
  "SY": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "93 123 4567" },
  "SZ": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "76 123 456" },
  "TC": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(649) 123-4567" },
  "TD": { maxLength: 8, pattern: "^(\\d{2})(\\d{2})(\\d{2})(\\d{2})$", placeholder: "77 12 34 56" },
  "TF": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "692 12 34 56" },
  "TG": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "90 123 456" },
  "TH": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "81 123 4567" },
  "TJ": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "91 123 4567" },
  "TK": { maxLength: 4, pattern: "^(\\d{4})$", placeholder: "1234" },
  "TL": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "771 2345" },
  "TM": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "66 123 456" },
  "TN": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "50 123 456" },
  "TO": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "771 2345" },
  "TR": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "530 123 4567" },
  "TT": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(868) 123-4567" },
  "TV": { maxLength: 6, pattern: "^(\\d{2})(\\d{4})$", placeholder: "90 1234" },
  "TW": { maxLength: 9, pattern: "^(\\d{4})(\\d{3})(\\d{2})$", placeholder: "0912 345 67" },
  "TZ": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "712 345 678" },
  "UA": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "50 123 4567" },
  "UG": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "712 345 678" },
  "UM": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(684) 123-4567" },
  "US": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(555) 123-4567" },
  "UY": { maxLength: 8, pattern: "^(\\d{1})(\\d{3})(\\d{4})$", placeholder: "9 123 4567" },
  "UZ": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "90 123 4567" },
  "VA": { maxLength: 10, pattern: "^(\\d{2})(\\d{4})(\\d{4})$", placeholder: "06 698 12345" },
  "VC": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(784) 123-4567" },
  "VE": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "412 123 4567" },
  "VG": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(284) 123-4567" },
  "VI": { maxLength: 10, pattern: "^(\\d{3})(\\d{3})(\\d{4})$", placeholder: "(340) 123-4567" },
  "VN": { maxLength: 10, pattern: "^(\\d{2})(\\d{4})(\\d{4})$", placeholder: "90 1234 5678" },
  "VU": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "771 2345" },
  "WF": { maxLength: 6, pattern: "^(\\d{2})(\\d{2})(\\d{2})$", placeholder: "82 12 34" },
  "WS": { maxLength: 7, pattern: "^(\\d{3})(\\d{4})$", placeholder: "721 2345" },
  "XK": { maxLength: 8, pattern: "^(\\d{2})(\\d{3})(\\d{3})$", placeholder: "43 123 456" },
  "YE": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "71 123 4567" },
  "YT": { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "692 12 34 56" },
  "ZA": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "81 123 4567" },
  "ZM": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "97 123 4567" },
  "ZW": { maxLength: 9, pattern: "^(\\d{2})(\\d{3})(\\d{4})$", placeholder: "71 123 4567" }
};

// 辅助：从 patternStr 提取每组的最小长度（支持 {n} 和 {m,n}）
function parseGroupMins(patternStr) {
  const re = /\\d\\{(\\d+)(?:,(\\d+))?\\}/g;
  const out = [];
  for (const m of patternStr.matchAll(re)) {
    out.push(parseInt(m[1], 10));
  }
  return out;
}

function buildFormatFunctions(patternStr, maxLength, countryCode) {
  const pattern = new RegExp(patternStr);
  const groupMins = parseGroupMins(patternStr);
  const total = maxLength;

  const regexLiteral = '/' + pattern.source.replace(/\//g, '\\/') + '/';
  const formatTemplate = groupMins.map((_, i) => `\${match[${i + 1}]}`).join(' ');

  const format = `(number) => {
    const cleaned = number.replace(/\\D/g, '');
    const match = cleaned.match(${regexLiteral});
    return match ? \`${formatTemplate}\` : number;
  }`;

  // formatInput 逐段拼接（实时输入格式化）
  const sums = [];
  for (let i = 0; i < groupMins.length; i++) {
    sums.push(groupMins.slice(0, i + 1).reduce((a, b) => a + b, 0));
  }

  let formatInput = `(number) => {
    const cleaned = number.replace(/\\D/g, '').slice(0, ${total});
  `;
  if (groupMins.length === 0) {
    formatInput += `  return cleaned;\n}`;
  } else {
    formatInput += `  if (cleaned.length <= ${groupMins[0]}) return cleaned;\n`;
    for (let i = 1; i < groupMins.length; i++) {
      const upper = sums[i];
      const parts = [];
      for (let j = 0; j <= i; j++) {
        const start = j === 0 ? 0 : sums[j - 1];
        const end = sums[j];
        parts.push(`\${cleaned.slice(${start}, ${end})}`);
      }
      formatInput += `  else if (cleaned.length <= ${upper}) return \`${parts.join(' ')}\`;\n`;
    }
    // 最后一段切到 total（处理可变长度组）
    const finalParts = [];
    for (let j = 0; j < groupMins.length; j++) {
      const start = j === 0 ? 0 : sums[j - 1];
      const end = j === groupMins.length - 1 ? total : sums[j];
      finalParts.push(`\${cleaned.slice(${start}, ${end})}`);
    }
    formatInput += `  else return \`${finalParts.join(' ')}\`;\n}`;
  }

  const validate = countryCode === 'CN'
    ? `(number) => { const cleaned = number.replace(/\\D/g, ''); return /^1[3-9]\\d{9}$/.test(cleaned); }`
    : `(number) => { const cleaned = number.replace(/\\D/g, ''); return ${regexLiteral}.test(cleaned); }`;

  return { pattern, format, formatInput, validate };
}

// 从 restcountries.com 获取拨号前缀映射（cca2 -> dial code 不带 +）
async function fetchDialCodeMap() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    if (!res.ok) return {};
    const data = await res.json();
    const map = {};
    for (const item of data) {
      if (!item.cca2 || !item.idd) continue;
      const root = item.idd.root || '';
      const suffixes = Array.isArray(item.idd.suffixes) && item.idd.suffixes.length ? item.idd.suffixes : [''];
      const suffix = suffixes[0] || '';
      const code = (root + suffix).replace('+', '').replace(/\D/g, '');
      if (code) map[item.cca2.toUpperCase()] = code;
    }
    return map;
  } catch (e) {
    return {};
  }
}

(async () => {
  const dialMap = await fetchDialCodeMap();

  const entries = countries.map(c => {
    const fmt = phoneFormats[c.code] || { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "123 456 789" };
    const funcs = buildFormatFunctions(fmt.pattern, fmt.maxLength, c.code);
    const dialCode = dialMap[c.code] || '0';
    return `  {
    code: '${c.code}',
    name: '${c.name}',
    dialCode: '${dialCode}',
    flag: '${c.code.toLowerCase()}',
    pattern: /${funcs.pattern.source}/,
    placeholder: '${fmt.placeholder}',
    maxLength: ${fmt.maxLength},
    format: ${funcs.format},
    formatInput: ${funcs.formatInput},
    validate: ${funcs.validate}
  }`;
  });

  const output = `import { ref } from 'vue';\n\nconst countries = ref([\n${entries.join(',\n')}\n]);\n\nexport default countries;\n`;
  writeFileSync('countries.js', output, 'utf8');

  // 下载国旗 PNG 到 flags/
  mkdirSync('flags', { recursive: true });
  await Promise.all(countries.map(async c => {
    try {
      const url = `https://flagcdn.com/16x12/${c.code.toLowerCase()}.png`;
      const res = await fetch(url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        writeFileSync(`flags/${c.code.toLowerCase()}.png`, buffer);
      }
    } catch (e) {
      // 忽略单个错误
    }
  }));

  console.log('countries.js 和 flags 已生成（拨号前缀来自 restcountries）');
})();