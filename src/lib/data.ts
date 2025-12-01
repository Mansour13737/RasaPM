import type { User, Site, WeeklyPM, ChangeRequest, Task, UserRole } from './types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'علی احمدی',
    username: 'admin',
    email: 'admin@example.com',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
    password: 'password123',
  },
  {
    id: 'user-2',
    name: 'سارا رضایی',
    username: 'sara_pm',
    email: 'sara.pm@example.com',
    role: 'PM',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
    password: 'password123',
  },
  {
    id: 'user-3',
    name: 'رضا کریمی',
    username: 'reza_tech',
    email: 'reza.tech@example.com',
    role: 'Technician',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
    password: 'password123',
  },
  {
    id: 'user-4',
    name: 'مریم حسینی',
    username: 'maryam_tech',
    email: 'maryam.tech@example.com',
    role: 'Technician',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
    password: 'password123',
  },
   {
    id: 'user-5',
    name: 'مدیر منطقه‌ای تهران',
    username: 'rm_tehran',
    email: 'rm.tehran@example.com',
    role: 'RegionalManager',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
    password: 'password123',
  },
];

export const sites: Site[] = [
  {
    id: 'site-1',
    name: 'سایت مرکزی تهران',
    location: 'تهران, تهران',
    imageUrl: '/placeholder-images/site-1.jpg',
    imageHint: 'data center',
    technicianId: 'user-3',
  },
  {
    id: 'site-2',
    name: 'دکل مخابراتی شمال',
    location: 'رشت, گیلان',
    imageUrl: '/placeholder-images/site-2.jpg',
    imageHint: 'telecom tower',
    technicianId: 'user-4',
  },
  {
    id: 'site-3',
    name: 'کارخانه صنعتی اصفهان',
    location: 'اصفهان, اصفهان',
    imageUrl: '/placeholder-images/site-3.jpg',
    imageHint: 'factory interior',
    technicianId: 'user-3',
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'بررسی بصری تجهیزات',
    description: 'تمام تجهیزات را برای هرگونه آسیب فیزیکی، گرد و غبار یا اتصالات سست بررسی کنید.',
    type: 'static',
    fields: [
        { id: 'f-1-1', label: 'تجهیزات تمیز و بدون گرد و غبار است.', type: 'checkbox' },
        { id: 'f-1-2', label: 'کابل‌ها به درستی متصل هستند.', type: 'checkbox' },
    ]
  },
  {
    id: 'task-2',
    title: 'بررسی دمای رک سرور',
    description: 'دمای عملیاتی رک سرور اصلی را ثبت کنید.',
    type: 'static',
    fields: [
        { id: 'f-2-1', label: 'دمای ثبت شده (سانتی‌گراد)', type: 'number' }
    ]
  },
  {
    id: 'task-3',
    title: 'تست UPS',
    description: 'عملکرد صحیح سیستم برق اضطراری (UPS) را بررسی کنید.',
    type: 'dynamic',
    fields: [
        { id: 'f-3-1', label: 'UPS به درستی کار می‌کند.', type: 'checkbox' },
        { id: 'f-3-2', label: 'گرفتن عکس از صفحه نمایش UPS', type: 'photo' },
    ]
  },
];


export const weeklyPMs: WeeklyPM[] = [
  {
    id: 'pm-1',
    weekIdentifier: '2024-W28',
    siteId: 'site-1',
    assignedTechnicianId: 'user-3',
    status: 'In Progress',
    crNumber: 'CR-1024',
    tasks: [
      { taskId: 'task-1', isCompleted: true, notes: 'گرد و غبار جزئی پاک شد.', photos: [], location: null, checklist: {'f-1-1': false, 'f-1-2': true}, customFields: {} },
      { taskId: 'task-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
    comments: [
        { userId: 'user-2', text: 'لطفا بررسی دمای رک فراموش نشود.', timestamp: '2024-07-10T10:00:00Z' }
    ]
  },
  {
    id: 'pm-2',
    weekIdentifier: '2024-W28',
    siteId: 'site-2',
    assignedTechnicianId: 'user-4',
    status: 'Pending',
    crNumber: 'CR-1025',
    tasks: [
      { taskId: 'task-1', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
      { taskId: 'task-3', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
     comments: []
  },
  {
    id: 'pm-3',
    weekIdentifier: '2024-W27',
    siteId: 'site-1',
    assignedTechnicianId: 'user-3',
    status: 'Completed',
    crNumber: 'CR-1020',
    tasks: [
      { taskId: 'task-1', isCompleted: true, notes: 'همه موارد بررسی شد.', photos: [], location: null, checklist: {}, customFields: {} },
      { taskId: 'task-2', isCompleted: true, notes: 'دما ۲۲ درجه سانتی‌گراد بود.', photos: [], location: null, checklist: {}, customFields: {'f-2-1': 22} },
    ],
    comments: [
         { userId: 'user-3', text: 'PM با موفقیت انجام شد.', timestamp: '2024-07-05T14:30:00Z' },
         { userId: 'user-1', text: 'عالی بود، ممنون.', timestamp: '2024-07-06T09:00:00Z' }
    ]
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    siteId: 'site-1',
    city: 'تهران',
    technicianName: 'رضا کریمی',
    startDate: '2024-07-15T00:00:00Z',
    endDate: '2024-07-20T00:00:00Z',
    title: 'برای PM',
    description: 'درخواست بازدید و انجام PM دوره‌ای برای سایت مرکزی.',
    submittedBy: 'user-2',
    createdAt: '2024-07-10T09:00:00Z',
    status: 'باز',
    priority: 'متوسط',
    photos: [],
  },
  {
    id: 'cr-2',
    siteId: 'site-2',
    city: 'رشت',
    technicianName: 'مریم حسینی',
    startDate: '2024-07-18T00:00:00Z',
    endDate: '2024-07-19T00:00:00Z',
    title: 'برای رفع خرابی',
    description: 'گزارش قطعی مکرر لینک رادیویی. نیاز به بررسی فوری.',
    submittedBy: 'user-5',
    createdAt: '2024-07-12T11:30:00Z',
    status: 'در حال انجام',
    priority: 'زیاد',
    photos: ['/placeholder-images/cr-1.jpg'],
  },
];
