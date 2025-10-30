// generate.js
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

// 1. 读取 ISO 3166-1 alpha-2 标准列表
const countries = JSON.parse(readFileSync('./data/iso3166-alpha2.json', 'utf8'));

// 2. 从 libphonenumber 获取真实号码格式
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

function flagEmoji(code) {
  return String.fromCodePoint(...code.split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function buildFormatFunctions(pattern, maxLength, placeholder) {
  const groups = pattern.match(/\\d\{(\d+)\}/g).map(g => parseInt(g.match(/\{(\d+)\}/)[1]));
  const total = groups.reduce((a, b) => a + b, 0);

  return {
    pattern: new RegExp(pattern),
    format: `(number) => {
      const cleaned = number.replace(/\\D/g, '');
      const match = cleaned.match(${pattern});
      return match ? \`${groups.map((_, i) => `\${match[${i+1}]}`).join(' ')}\` : number;
    }`,
    formatInput: `(number) => {
      const cleaned = number.replace(/\\D/g, '').slice(0, ${maxLength});
      let result = '';
      let pos = 0;
      ${groups.map((size, i) => `
      if (pos + ${size} <= cleaned.length) {
        result += cleaned.slice(pos, pos + ${size}) + ' ';
        pos += ${size};
      } else {
        result += cleaned.slice(pos);
        break;
      }`).join('\n      ')}
      return result.trim();
    }`,
    validate: `(number) => number.replace(/\\D/g, '').length === ${total}`
  };
}

const entries = countries.map(c => {
  const fmt = phoneFormats[c.code] || { maxLength: 9, pattern: "^(\\d{3})(\\d{3})(\\d{3})$", placeholder: "123 456 789" };
  const { pattern, format, formatInput, validate } = buildFormatFunctions(fmt.pattern, fmt.maxLength, fmt.placeholder);
  const dialCode = c.code === 'US' ? '1' : c.code === 'CN' ? '86' : '0'; // 实际应从 ITU 获取

  return `  {
    code: '${c.code}',
    name: '${c.name}',
    dialCode: '${dialCode}',
    flag: '${flagEmoji(c.code)}',
    pattern: /${pattern.source}/,
    placeholder: '${fmt.placeholder}',
    maxLength: ${fmt.maxLength},
    format: ${format},
    formatInput: ${formatInput},
    validate: ${validate}
  }`;
});

const output = `import { ref } from 'vue';\n\nconst countries = ref([\n${entries.join(',\n')}\n]);\n\nexport default countries;\n`;
writeFileSync('countries.js', output, 'utf8');

// 下载国旗
mkdirSync('flags', { recursive: true });
await Promise.all(countries.map(async c => {
  const url = `http://flagcdn.com/16x12/${c.code.toLowerCase()}.png`;
  const res = await fetch(url);
  if (res.ok) {
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(`flags/${c.code.toLowerCase()}.png`, buffer);
  }
}));

console.log('countries.js + 254 PNG 已生成');
