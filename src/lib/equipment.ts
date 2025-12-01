export type EquipmentUnit = 'عدد' | 'متر';

export interface TelecomEquipment {
  id: string;
  name: string;
  unit: EquipmentUnit;
}

export const TelecomEquipmentList: TelecomEquipment[] = [
  { id: 'cable-fiber-sm', name: 'کابل فیبر نوری Single-Mode', unit: 'متر' },
  { id: 'cable-fiber-mm', name: 'کابل فیبر نوری Multi-Mode', unit: 'متر' },
  { id: 'cable-cat6', name: 'کابل شبکه Cat6', unit: 'متر' },
  { id: 'cable-cat7', name: 'کابل شبکه Cat7', unit: 'متر' },
  { id: 'cable-coaxial', name: 'کابل کواکسیال (LMR400 یا مشابه)', unit: 'متر' },
  { id: 'cable-power-dc', name: 'کابل برق DC (48V)', unit: 'متر' },
  { id: 'cable-ground', name: 'کابل ارت (Grounding)', unit: 'متر' },
  
  { id: 'sfp-1g-sm', name: 'ماژول SFP 1G Single-Mode', unit: 'عدد' },
  { id: 'sfp-1g-mm', name: 'ماژول SFP 1G Multi-Mode', unit: 'عدد' },
  { id: 'sfp-10g-sm', name: 'ماژول SFP+ 10G Single-Mode', unit: 'عدد' },
  { id: 'sfp-10g-mm', name: 'ماژول SFP+ 10G Multi-Mode', unit: 'عدد' },

  { id: 'connector-lc', name: 'کانکتور فیبر نوری LC', unit: 'عدد' },
  { id: 'connector-sc', name: 'کانکتور فیبر نوری SC', unit: 'عدد' },
  { id: 'connector-rj45', name: 'کانکتور شبکه RJ45', unit: 'عدد' },
  { id: 'connector-rf-n', name: 'کانکتور RF (N-Type)', unit: 'عدد' },
  { id: 'connector-rf-din', name: 'کانکتور RF (DIN 7/16)', unit: 'عدد' },

  { id: 'pigtail-lc', name: 'پیگتیل فیبر نوری LC', unit: 'عدد' },
  { id: 'pigtail-sc', name: 'پیگتیل فیبر نوری SC', unit: 'عدد' },
  { id: 'patch-cord-fiber', name: 'پچ کورد فیبر نوری', unit: 'عدد' },
  { id: 'patch-cord-utp', name: 'پچ کورد شبکه (UTP)', unit: 'عدد' },

  { id: 'patch-panel-fiber', name: 'پچ پنل فیبر نوری', unit: 'عدد' },
  { id: 'patch-panel-utp', name: 'پچ پنل شبکه', unit: 'عدد' },
  { id: 'odf', name: 'فریم ODF (Optical Distribution Frame)', unit: 'عدد' },

  { id: 'antenna-sector', name: 'آنتن Sectoral', unit: 'عدد' },
  { id: 'antenna-parabolic', name: 'آنتن Parabolic (Dish)', unit: 'عدد' },
  { id: 'antenna-gps', name: 'آنتن GPS', unit: 'عدد' },
  { id: 'radio-unit', name: 'رادیو (Microwave Radio Unit)', unit: 'عدد' },

  { id: 'power-supply-dc', name: 'منبع تغذیه DC (Rectifier)', unit: 'عدد' },
  { id: 'power-supply-acdc', name: 'آداپتور AC/DC', unit: 'عدد' },
  { id: 'breaker-dc', name: 'فیوز/بریکر DC', unit: 'عدد' },
  { id: 'battery-bank', name: 'باتری 48V', unit: 'عدد' },

  { id: 'rack-screws', name: 'پیچ و مهره رک', unit: 'عدد' },
  { id: 'cable-tie', name: 'بست کمربندی', unit: 'عدد' },
  { id: 'label-tape', name: 'نوار لیبل‌زن', unit: 'عدد' },
  { id: 'jumper', name: 'جامپر RF', unit: 'عدد' },
];
