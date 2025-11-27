import type { Site, User, Task, WeeklyPM, ChangeRequest } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'علی محمدی', email: 'admin@example.com', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
  { id: 'user-2', name: 'سارا رضایی', email: 'pm@example.com', role: 'PM', avatarUrl: 'https://i.pravatar.cc/150?u=pm' },
  { id: 'user-3', name: 'رضا قاسمی', email: 'tech@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=tech' },
];

export const sites: Site[] = [
  { id: 'site-1', name: 'سایت مرکزی تهران', location: 'تهران، ایران', imageUrl: 'https://picsum.photos/seed/site1/600/400', imageHint: 'data center' },
  { id: 'site-2', name: 'سایت مخابراتی شیراز', location: 'شیراز، ایران', imageUrl: 'https://picsum.photos/seed/site2/600/400', imageHint: 'telecom tower' },
  { id: 'site-3', name: 'پایگاه داده اصفهان', location: 'اصفهان، ایران', imageUrl: 'https://picsum.photos/seed/site3/600/400', imageHint: 'factory interior' },
  { id: 'site-4', name: 'مرکز داده تبریز', location: 'تبریز، ایران', imageUrl: 'https://picsum.photos/seed/site4/600/400', imageHint: 'server room' },
];

export const tasks: Task[] = [
  // Static Tasks
  {
    id: 'task-static-1',
    title: 'بررسی سیستم خنک‌کننده',
    description: 'دمای ورودی و خروجی، عملکرد فن‌ها و عدم وجود نشتی را بررسی کنید.',
    type: 'static',
    fields: [
      { id: 'temp-in', label: 'دمای ورودی (°C)', type: 'number' },
      { id: 'temp-out', label: 'دمای خروجی (°C)', type: 'number' },
      { id: 'fan-ok', label: 'عملکرد فن‌ها صحیح است', type: 'checkbox' },
    ],
  },
  {
    id: 'task-static-2',
    title: 'بازبینی بصری سرورها',
    description: 'LEDهای وضعیت، اتصالات کابل‌ها و عدم وجود گرد و غبار را چک کنید.',
    type: 'static',
    fields: [
        { id: 'led-status', label: 'تمام LEDها سبز هستند', type: 'checkbox' },
        { id: 'dust-check', label: 'نیاز به نظافت دارد', type: 'checkbox' },
    ],
  },
  // Dynamic Tasks
  {
    id: 'task-dynamic-1',
    title: 'تست ژنراتور برق اضطراری (فقط تهران)',
    description: 'ژنراتور را به مدت ۵ دقیقه زیر بار تست کنید و ولتاژ خروجی را ثبت نمایید.',
    type: 'dynamic',
    fields: [
        { id: 'gen-voltage', label: 'ولتاژ خروجی (V)', type: 'number' },
        { id: 'test-duration', label: 'مدت زمان تست (دقیقه)', type: 'number' },
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
    tasks: [
      { taskId: 'task-static-1', isCompleted: true, notes: 'دمای ورودی ۲۲ و خروجی ۲۸ بود. همه فن‌ها سالم هستند.', photos: [], location: null, checklist: {'fan-ok': true}, customFields: {'temp-in': 22, 'temp-out': 28} },
      { taskId: 'task-static-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
      { taskId: 'task-dynamic-1', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
  },
  {
    id: 'pm-2',
    weekIdentifier: '2024-W28',
    siteId: 'site-2',
    assignedTechnicianId: 'user-3',
    status: 'Pending',
    tasks: [
        { taskId: 'task-static-1', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
        { taskId: 'task-static-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
  },
  {
    id: 'pm-3',
    weekIdentifier: '2024-W27',
    siteId: 'site-1',
    assignedTechnicianId: 'user-3',
    status: 'Completed',
    tasks: [],
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    siteId: 'site-1',
    title: 'خرابی کابل شبکه در رک A-03',
    description: 'کابل شبکه سرور DB05 قطع شده و نیاز به تعویض فوری دارد.',
    submittedBy: 'user-3',
    createdAt: '2024-07-15T10:00:00Z',
    status: 'باز',
    priority: 'بحرانی',
    photos: ['https://picsum.photos/seed/cr1/400/300'],
  },
  {
    id: 'cr-2',
    siteId: 'site-1',
    title: 'ارتقا حافظه سرور WEB02',
    description: 'به دلیل افزایش ترافیک، نیاز به افزایش رم سرور WEB02 از ۳۲ به ۶۴ گیگابایت است.',
    submittedBy: 'user-2',
    createdAt: '2024-07-14T14:30:00Z',
    status: 'در حال انجام',
    priority: 'زیاد',
    photos: [],
  },
  {
    id: 'cr-3',
    siteId: 'site-2',
    title: 'نصب دوربین مداربسته جدید',
    description: 'نصب دوربین در ورودی جنوبی برای پوشش بهتر امنیتی.',
    submittedBy: 'user-1',
    createdAt: '2024-07-12T09:00:00Z',
    status: 'انجام شده',
    priority: 'متوسط',
    photos: [],
  },
];

export function getSiteById(id: string) {
  return sites.find(s => s.id === id);
}

export function getPMsForSite(siteId: string) {
  return weeklyPMs.filter(pm => pm.siteId === siteId);
}

export function getCRsForSite(siteId: string) {
    return changeRequests.filter(cr => cr.siteId === siteId);
}

export function getPMById(id: string) {
    const pm = weeklyPMs.find(p => p.id === id);
    if (!pm) return null;
    
    const populatedTasks = pm.tasks.map(taskResult => {
        const taskDef = tasks.find(t => t.id === taskResult.taskId);
        return { ...taskDef, ...taskResult };
    });

    const pmTaskIds = pm.tasks.map(t => t.taskId);
    const missingTasks = tasks.filter(t => {
      // For site-1, include the dynamic task, otherwise only static
      if (pm.siteId === 'site-1' && t.id === 'task-dynamic-1') return !pmTaskIds.includes(t.id);
      return t.type === 'static' && !pmTaskIds.includes(t.id);
    });

    const allTasks = [...populatedTasks, ...missingTasks];

    return { ...pm, tasks: allTasks };
}
