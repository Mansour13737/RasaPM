
// This is a mock database. In a real application, you would use a real database.

import type { Site, User, WeeklyPM, Task, ChangeRequest, UserRole } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://placehold.co/600x400';
const getHint = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageHint || 'image';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'علی احمدی',
    email: 'ali.ahmadi@example.com',
    role: 'Admin',
    avatarUrl: `https://i.pravatar.cc/150?u=ali.ahmadi@example.com`,
  },
  {
    id: 'user-2',
    name: 'سارا رضایی',
    email: 'sara.rezaei@example.com',
    role: 'PM',
    avatarUrl: `https://i.pravatar.cc/150?u=sara.rezaei@example.com`,
  },
  {
    id: 'user-3',
    name: 'محمد کریمی',
    email: 'mohammad.karimi@example.com',
    role: 'Technician',
    avatarUrl: `https://i-pravatar.cc/150?u=mohammad.karimi@example.com`,
  },
  {
    id: 'user-4',
    name: 'فاطمه حسینی',
    email: 'fateme.hosseini@example.com',
    role: 'Technician',
    avatarUrl: `https://i.pravatar.cc/150?u=fateme.hosseini@example.com`,
  },
];

export const sites: Site[] = [
  {
    id: 'site-1',
    name: 'مرکز داده تهران',
    location: 'تهران, تهران',
    imageUrl: getImage('site-1'),
    imageHint: getHint('site-1'),
    technicianId: 'user-3',
  },
  {
    id: 'site-2',
    name: 'دکل مخابراتی شیراز',
    location: 'فارس, شیراز',
    imageUrl: getImage('site-2'),
    imageHint: getHint('site-2'),
    technicianId: 'user-4',
  },
  {
    id: 'site-3',
    name: 'پایگاه ارتباطی اصفهان',
    location: 'اصفهان, اصفهان',
    imageUrl: getImage('site-3'),
    imageHint: getHint('site-3'),
    technicianId: 'user-3',
  },
];


export const tasks: Task[] = [
    {
        id: 'task-1',
        title: 'بررسی بصری تجهیزات',
        description: 'تمام تجهیزات را برای هرگونه آسیب فیزیکی، گرد و غبار یا اتصالات سست بررسی کنید.',
        type: 'static',
        fields: [{ id: 'field-1-1', label: 'تمام موارد بررسی شد', type: 'checkbox' }]
    },
    {
        id: 'task-2',
        title: 'بررسی سیستم سرمایشی',
        description: 'دمای محیط و عملکرد فن‌ها را بررسی و ثبت کنید.',
        type: 'static',
        fields: [
            { id: 'field-2-1', label: 'دمای ورودی (°C)', type: 'number' },
            { id: 'field-2-2', label: 'دمای خروجی (°C)', type: 'number' },
            { id: 'field-2-3', label: 'عکس از نمایشگر دما', type: 'photo' },
        ]
    },
    {
        id: 'task-3',
        title: 'بررسی منبع تغذیه',
        description: 'ولتاژ ورودی و خروجی UPS و وضعیت باتری‌ها را چک کنید.',
        type: 'dynamic',
        fields: [
            { id: 'field-3-1', label: 'ولتاژ ورودی (V)', type: 'number' },
            { id: 'field-3-2', label: 'ولتاژ خروجی (V)', type: 'number' },
            { id: 'field-3-3', label: 'وضعیت باتری‌ها نرمال است', type: 'checkbox' },
        ]
    }
];

export const weeklyPMs: WeeklyPM[] = [
  {
    id: 'pm-1',
    weekIdentifier: '2024-W28',
    siteId: 'site-1',
    assignedTechnicianId: 'user-3',
    status: 'In Progress',
    crNumber: 'CR-54321',
    tasks: [
        { taskId: 'task-1', isCompleted: true, notes: 'گرد و غبار روی سرورها زیاد بود، تمیز شد.', photos: [], location: null, checklist: {'field-1-1': true}, customFields: {} },
        { taskId: 'task-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
    comments: [
        {userId: 'user-2', text: 'لطفاً به وضعیت فن‌های سرور شماره ۳ توجه ویژه داشته باشید.', timestamp: '2024-07-15T10:00:00Z'}
    ]
  },
  {
    id: 'pm-2',
    weekIdentifier: '2024-W28',
    siteId: 'site-2',
    assignedTechnicianId: 'user-4',
    status: 'Pending',
    tasks: tasks.map(t => ({taskId: t.id, isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {}})),
  },
  {
    id: 'pm-3',
    weekIdentifier '2024-W27',
    siteId: 'site-1',
    assignedTechnicianId: 'user-3',
    status: 'Completed',
    crNumber: 'CR-54320',
    tasks: tasks.map(t => ({taskId: t.id, isCompleted: true, notes: 'طبق روال انجام شد.', photos: [], location: null, checklist: {}, customFields: {}})),
    comments: [
        {userId: 'user-3', text: 'PM با موفقیت انجام شد. مشکل خاصی مشاهده نشد.', timestamp: '2024-07-08T14:30:00Z'},
        {userId: 'user-1', text: 'عالی، ممنون از گزارش.', timestamp: '2024-07-09T09:00:00Z'}
    ]
  },
   {
    id: 'pm-4',
    weekIdentifier: '2024-W27',
    siteId: 'site-3',
    assignedTechnicianId: 'user-3',
    status: 'Cancelled',
    tasks: [],
    comments: [
        {userId: 'user-2', text: 'به دلیل عدم دسترسی به سایت، این PM لغو شد.', timestamp: '2024-07-08T11:00:00Z'}
    ]
  },
];


export const changeRequests: ChangeRequest[] = [
    {
        id: 'cr-1',
        siteId: 'site-1',
        city: 'تهران',
        technicianName: 'محمد کریمی',
        startDate: '2024-07-20',
        endDate: '2024-07-21',
        title: 'برای PM',
        description: 'درخواست بازدید و انجام PM دوره‌ای برای مرکز داده تهران.',
        submittedBy: 'user-2',
        createdAt: '2024-07-18T10:00:00Z',
        status: 'باز',
        priority: 'متوسط',
        photos: []
    },
    {
        id: 'cr-2',
        siteId: 'site-2',
        city: 'شیراز',
        technicianName: 'فاطمه حسینی',
        startDate: '2024-07-22',
        endDate: '2024-07-22',
        title: 'برای رفع خرابی',
        description: 'گزارش قطعی در لینک ارتباطی. نیاز به بررسی فوری.',
        submittedBy: 'user-1',
        createdAt: '2024-07-19T14:00:00Z',
        status: 'در حال انجام',
        priority: 'بحرانی',
        photos: [getImage('cr-1')]
    }
];


// --- API-like functions to simulate database access ---

export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getSiteById = (id: string): Site | undefined => sites.find(s => s.id === id);
export const getPMById = (id: string): WeeklyPM | undefined => weeklyPMs.find(pm => pm.id === id);
export const getTaskById = (id: string): Task | undefined => tasks.find(t => t.id === id);
export const getPMsForSite = (siteId: string): WeeklyPM[] => weeklyPMs.filter(pm => pm.siteId === siteId);
export const getCRsForSite = (siteId: string): ChangeRequest[] => changeRequests.filter(cr => cr.siteId === siteId);
export const getSitesForTechnician = (technicianId: string): Site[] => sites.filter(s => s.technicianId === technicianId);

let nextUserId = users.length + 1;
export const addUser = (user: Omit<User, 'id'>): User => {
    const newUser: User = {
        id: `user-${nextUserId++}`,
        ...user
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        return users[userIndex];
    }
    return null;
}

export const deleteUser = (userId: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        users.splice(userIndex, 1);
        return true;
    }
    return false;
}
