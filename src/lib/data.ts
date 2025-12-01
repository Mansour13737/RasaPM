import type { User, Site, WeeklyPM, ChangeRequest, Task, TechRequest, PMStatus } from './types';
import { getISOWeek, getYear } from 'date-fns';


// --- USER DATA ---
export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'ادمین سیستم',
    username: 'admin',
    email: 'admin@example.com',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-admin',
    password: 'password123',
  },
  {
    id: 'user-pm',
    name: 'یاسمین سمنانی پور',
    username: 'yasamin_s',
    email: 'yasamin.s@example.com',
    role: 'PM',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-pm',
    password: 'password123',
  },
  {
    id: 'user-rm',
    name: 'پیمان وقاری',
    username: 'peyman_v',
    email: 'peyman.v@example.com',
    role: 'RegionalManager',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-rm',
    password: 'password123',
  },
  { id: 'user-tech-1', name: 'فرهاد سلیمی', username: 'farhad_s', email: 'farhad.s@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-1', password: 'password123' },
  { id: 'user-tech-2', name: 'فاضل دهدار', username: 'fazel_d', email: 'fazel.d@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-2', password: 'password123' },
  { id: 'user-tech-3', name: 'محمد نوروزی پور', username: 'mohammad_n', email: 'mohammad.n@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-3', password: 'password123' },
  { id: 'user-tech-4', name: 'علی حسن زاده', username: 'ali_h', email: 'ali.h@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-4', password: 'password123' },
  { id: 'user-tech-5', name: 'محمد جعفر سرداری', username: 'mohammad_j', email: 'mohammad.j@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-5', password: 'password123' },
  { id: 'user-tech-6', name: 'امین شهسواری', username: 'amin_s', email: 'amin.s@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-6', password: 'password123' },
  { id: 'user-tech-7', name: 'توحید خزان', username: 'tohid_k', email: 'tohid.k@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-7', password: 'password123' },
  { id: 'user-tech-8', name: 'ابراهیمی', username: 'ebrahimi', email: 'ebrahimi@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-8', password: 'password123' },
  { id: 'user-tech-9', name: 'محمد نبی محمدی', username: 'mohammad_m', email: 'mohammad.m@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=user-tech-9', password: 'password123' },
];

// --- SITE DATA ---
export const initialSites: Site[] = [
    { id: '201000', name: '201000', location: 'بابل, مازندران', imageUrl: 'https://picsum.photos/seed/babol/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201001', name: '201001', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201002', name: '201002', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201003', name: '201003', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201004', name: '201004', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201005', name: '201005', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201006', name: '201006', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201007', name: '201007', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201008', name: '201008', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201009', name: '201009', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201012', name: '201012', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201013', name: '201013', location: 'ساری, مازندران', imageUrl: 'https://picsum.photos/seed/sari/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201062', name: '201062', location: 'بابل, مازندران', imageUrl: 'https://picsum.photos/seed/babol/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201064', name: '201064', location: 'بابل, مازندران', imageUrl: 'https://picsum.photos/seed/babol/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201065', name: '201065', location: 'بابل, مازندران', imageUrl: 'https://picsum.photos/seed/babol/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201069', name: '201069', location: 'بابل, مازندران', imageUrl: 'https://picsum.photos/seed/babol/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-1' },
    { id: '201090', name: '201090', location: 'بابلسر, مازندران', imageUrl: 'https://picsum.photos/seed/babolsar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201091', name: '201091', location: 'بابلسر, مازندران', imageUrl: 'https://picsum.photos/seed/babolsar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201092', name: '201092', location: 'بابلسر, مازندران', imageUrl: 'https://picsum.photos/seed/babolsar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201100', name: '201100', location: 'چالوس, مازندران', imageUrl: 'https://picsum.photos/seed/chalus/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201120', name: '201120', location: 'فریدونکنار, مازندران', imageUrl: 'https://picsum.photos/seed/fereydunkenar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201122', name: '201122', location: 'رامسر, مازندران', imageUrl: 'https://picsum.photos/seed/ramsar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201150', name: '201150', location: 'نور, مازندران', imageUrl: 'https://picsum.photos/seed/nur/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201161', name: '201161', location: 'نوشهر, مازندران', imageUrl: 'https://picsum.photos/seed/nowshahr/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201166', name: '201166', location: 'نوشهر, مازندران', imageUrl: 'https://picsum.photos/seed/nowshahr/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201190', name: '201190', location: 'رامسر, مازندران', imageUrl: 'https://picsum.photos/seed/ramsar/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '201221', name: '201221', location: 'تنکابن, مازندران', imageUrl: 'https://picsum.photos/seed/tonekabon/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-2' },
    { id: '261000', name: '261000', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261001', name: '261001', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261002', name: '261002', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261003', name: '261003', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261005', name: '261005', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261006', name: '261006', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261008', name: '261008', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261009', name: '261009', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261010', name: '261010', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261012', name: '261012', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261014', name: '261014', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261015', name: '261015', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261016', name: '261016', location: 'گرگان, گلستان', imageUrl: 'https://picsum.photos/seed/gorgan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261101', name: '261101', location: 'گنبد کاووس, گلستان', imageUrl: 'https://picsum.photos/seed/gonbad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261104', name: '261104', location: 'گنبد کاووس, گلستان', imageUrl: 'https://picsum.photos/seed/gonbad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '261105', name: '261105', location: 'گنبد کاووس, گلستان', imageUrl: 'https://picsum.photos/seed/gonbad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-3' },
    { id: '301000', name: '301000', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301001', name: '301001', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301002', name: '301002', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301003', name: '301003', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301004', name: '301004', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301005', name: '301005', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301006', name: '301006', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301007', name: '301007', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301008', name: '301008', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301009', name: '301009', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301010', name: '301010', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301012', name: '301012', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301013', name: '301013', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301014', name: '301014', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301015', name: '301015', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301016', name: '301016', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301017', name: '301017', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301018', name: '301018', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301019', name: '301019', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301023', name: '301023', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301024', name: '301024', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301025', name: '301025', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301026', name: '301026', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301027', name: '301027', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301028', name: '301028', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301029', name: '301029', location: 'ارومیه, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/urmia/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301100', name: '301100', location: 'بوکان, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/bukan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301101', name: '301101', location: 'بوکان, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/bukan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301103', name: '301103', location: 'بوکان, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/bukan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301104', name: '301104', location: 'بوکان, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/bukan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301105', name: '301105', location: 'بوکان, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/bukan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301111', name: '301111', location: 'مهاباد, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/mahabad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301161', name: '301161', location: 'مهاباد, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/mahabad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301162', name: '301162', location: 'مهاباد, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/mahabad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301163', name: '301163', location: 'مهاباد, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/mahabad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301164', name: '301164', location: 'مهاباد, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/mahabad/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '301200', name: '301200', location: 'خوی, آذربایجان غربی', imageUrl: 'https://picsum.photos/seed/khoy/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-4' },
    { id: '321002', name: '321002', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321003', name: '321003', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321004', name: '321004', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321005', name: '321005', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321006', name: '321006', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321007', name: '321007', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321008', name: '321008', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321011', name: '321011', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '321211', name: '321211', location: 'زنجان, زنجان', imageUrl: 'https://picsum.photos/seed/zanjan/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-5' },
    { id: '341006', name: '341006', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341007', name: '341007', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341009', name: '341009', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341011', name: '341011', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341013', name: '341013', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341014', name: '341014', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341017', name: '341017', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341019', name: '341019', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341020', name: '341020', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341021', name: '341021', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341026', name: '341026', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341027', name: '341027', location: 'تبریز, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/tabriz/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341101', name: '341101', location: 'مراغه, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/maragheh/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '341122', name: '341122', location: 'مرند, آذربایجان شرقی', imageUrl: 'https://picsum.photos/seed/marand/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-6' },
    { id: '361001', name: '361001', location: 'اردبیل, اردبیل', imageUrl: 'https://picsum.photos/seed/ardabil/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-7' },
    { id: '361002', name: '361002', location: 'اردبیل, اردبیل', imageUrl: 'https://picsum.photos/seed/ardabil/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-7' },
    { id: '361003', name: '361003', location: 'اردبیل, اردبیل', imageUrl: 'https://picsum.photos/seed/ardabil/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-7' },
    { id: '361004', name: '361004', location: 'اردبیل, اردبیل', imageUrl: 'https://picsum.photos/seed/ardabil/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-7' },
    { id: '361006', name: '361006', location: 'اردبیل, اردبیل', imageUrl: 'https://picsum.photos/seed/ardabil/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-7' },
    { id: '371000', name: '371000', location: 'قزوین, قزوین', imageUrl: 'https://picsum.photos/seed/qazvin/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-8' },
    { id: '371002', name: '371002', location: 'قزوین, قزوین', imageUrl: 'https://picsum.photos/seed/qazvin/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-8' },
    { id: '371003', name: '371003', location: 'قزوین, قزوین', imageUrl: 'https://picsum.photos/seed/qazvin/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-8' },
    { id: '371005', name: '371005', location: 'قزوین, قزوین', imageUrl: 'https://picsum.photos/seed/qazvin/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-8' },
    { id: '371011', name: '371011', location: 'قزوین, قزوین', imageUrl: 'https://picsum.photos/seed/qazvin/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-8' },
    { id: '381000', name: '381000', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381001', name: '381001', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381002', name: '381002', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381003', name: '381003', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381004', name: '381004', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381005', name: '381005', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381006', name: '381006', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381007', name: '381007', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381008', name: '381008', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381009', name: '381009', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381010', name: '381010', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381011', name: '381011', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381012', name: '381012', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381013', name: '381013', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381014', name: '381014', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381015', name: '381015', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381016', name: '381016', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381018', name: '381018', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381019', name: '381019', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381020', name: '381020', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381021', name: '381021', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381022', name: '381022', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381023', name: '381023', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381031', name: '381031', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381032', name: '381032', location: 'رشت, گیلان', imageUrl: 'https://picsum.photos/seed/rasht/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381100', name: '381100', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381101', name: '381101', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381103', name: '381103', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381104', name: '381104', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381105', name: '381105', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
    { id: '381106', name: '381106', location: 'بندر انزلی, گیلان', imageUrl: 'https://picsum.photos/seed/anzali/400/300', imageHint: 'telecom tower', technicianId: 'user-tech-9' },
];

// --- TASK DATA ---
export const initialTasks: Task[] = [
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


// --- DYNAMICALLY GENERATED PMs for a whole year ---

const generateAllYearPMs = (): WeeklyPM[] => {
    const allPMs: WeeklyPM[] = [];
    let pmIdCounter = 1;
    const currentYear = getYear(new Date());
    const currentWeek = getISOWeek(new Date());

    // Create a pool of all PM events for the year (each site appears twice)
    let planningPool: { site: Site, week: number }[] = [];
    const sitesCopy = [...initialSites];
    
    // Create the pool with each site twice
    let twiceSites = [...sitesCopy, ...sitesCopy];

    // Assign a random week to each PM event
    const pmsWithWeeks = twiceSites.map(site => ({
        site,
        // Assign to a random week, avoiding putting both PMs for a site in the same half of the year
        week: Math.floor(Math.random() * 52) + 1
    }));
    
    // Group PMs by week
    const weeks: Record<number, Site[]> = {};
    for(let i=1; i<=52; i++) weeks[i] = [];

    for (const pm of pmsWithWeeks) {
        weeks[pm.week].push(pm.site);
    }

    for (let week = 1; week <= 52; week++) {
        const pmsForThisWeek = weeks[week];

        for (const site of pmsForThisWeek) {
            if (!site) continue;

            const weekIdentifier = `${currentYear}-W${week.toString().padStart(2, '0')}`;
            
            let status: PMStatus;
             if (week < currentWeek) {
                // Past weeks can only be Completed or Cancelled
                status = ['Completed', 'Cancelled'][Math.floor(Math.random() * 2)] as PMStatus;
            } else if (week === currentWeek) {
                // Current week can have any status
                status = ['Completed', 'In Progress', 'Pending', 'Cancelled'][Math.floor(Math.random() * 4)] as PMStatus;
            } else {
                // Future weeks are always Pending
                status = 'Pending';
            }

            const isCompleted = status === 'Completed';

            const pm: WeeklyPM = {
                id: `pm-${pmIdCounter++}`,
                weekIdentifier,
                siteId: site.id,
                assignedTechnicianId: site.technicianId,
                status: status,
                crNumber: `CR-${currentYear}-${Math.floor(Math.random() * 500) + 1000}`,
                tasks: initialTasks.map(t => ({
                    taskId: t.id,
                    isCompleted: isCompleted,
                    notes: isCompleted ? 'بررسی انجام شد.' : '',
                    photos: [],
                    location: null,
                    checklist: {},
                    customFields: {},
                })),
                comments: [],
            };

            allPMs.push(pm);
        }
    }
    return allPMs;
}

export const initialWeeklyPMs: WeeklyPM[] = generateAllYearPMs();


// --- OTHER MOCK DATA ---

export const initialChangeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    siteId: '301000',
    city: 'ارومیه',
    technicianName: 'علی حسن زاده',
    startDate: '2024-07-15T00:00:00Z',
    endDate: '2024-07-20T00:00:00Z',
    title: 'برای PM',
    description: 'درخواست بازدید و انجام PM دوره‌ای برای سایت.',
    submittedBy: 'user-pm',
    createdAt: '2024-07-10T09:00:00Z',
    status: 'باز',
    priority: 'متوسط',
    photos: [],
  },
  {
    id: 'cr-2',
    siteId: '381100',
    city: 'بندر انزلی',
    technicianName: 'محمد نبی محمدی',
    startDate: '2024-07-18T00:00:00Z',
    endDate: '2024-07-19T00:00:00Z',
    title: 'برای رفع خرابی',
    description: 'گزارش قطعی مکرر لینک رادیویی. نیاز به بررسی فوری.',
    submittedBy: 'user-rm',
    createdAt: '2024-07-12T11:30:00Z',
    status: 'در حال انجام',
    priority: 'زیاد',
    photos: ['/placeholder-images/cr-1.jpg'],
  },
];

export const initialTechRequests: TechRequest[] = [
    {
        id: 'req-1',
        technicianId: 'user-tech-1',
        title: 'نیاز به کابل شبکه CAT6',
        type: 'درخواست تجهیزات',
        description: 'برای سایت 201000 نیاز به 50 متر کابل شبکه CAT6 دارم.',
        priority: 'بالا',
        status: 'جدید',
        createdAt: '2024-07-15T10:00:00Z',
        items: [
            { equipmentId: 'cable-cat6', quantity: 50 }
        ],
        comments: []
    },
    {
        id: 'req-2',
        technicianId: 'user-tech-1',
        title: 'پیشنهاد تغییر در چک‌لیست UPS',
        type: 'پیشنهاد',
        description: 'پیشنهاد می‌کنم بخش مربوط به بررسی ولتاژ باتری‌ها نیز به تسک تست UPS اضافه شود.',
        priority: 'پایین',
        status: 'در حال بررسی',
        createdAt: '2024-07-14T15:30:00Z',
        items: [],
        comments: [
            { userId: 'user-pm', text: 'پیشنهاد خوبیه، در آپدیت بعدی تسک‌ها لحاظ می‌کنیم.', timestamp: '2024-07-15T11:00:00Z' }
        ]
    }
];

    