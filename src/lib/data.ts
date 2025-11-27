import type { Site, User, Task, WeeklyPM, ChangeRequest } from './types';

export const users: User[] = [
    { id: 'user-1', name: 'علی محمدی', email: 'admin@example.com', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
    { id: 'user-2', name: 'سارا رضایی', email: 'pm@example.com', role: 'PM', avatarUrl: 'https://i.pravatar.cc/150?u=pm' },
    { id: 'user-3', name: 'Salimi', email: 'salimi@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Salimi' },
    { id: 'user-4', name: 'Dastar', email: 'dastar@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Dastar' },
    { id: 'user-5', name: 'Noroozipoor', email: 'noroozipoor@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Noroozipoor' },
    { id: 'user-6', name: 'Hasanzadeh', email: 'hasanzadeh@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Hasanzadeh' },
    { id: 'user-7', name: 'Sardari', email: 'sardari@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Sardari' },
    { id: 'user-8', name: 'Shahvasen', email: 'shahvasen@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Shahvasen' },
    { id: 'user-9', name: 'Khateri', email: 'khateri@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Khateri' },
    { id: 'user-10', name: 'Ebrahimi', email: 'ebrahimi@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Ebrahimi' },
    { id: 'user-11', name: 'Mohammadi', email: 'mohammadi@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=Mohammadi' },
    { id: 'user-12', name: 'رضا قاسمی', email: 'tech@example.com', role: 'Technician', avatarUrl: 'https://i.pravatar.cc/150?u=tech' },
];

const technicianIds = users.filter(u => u.role === 'Technician').map(u => u.id);

export const sites: Site[] = [
    { id: '201000', name: 'Site 201000', location: 'Mazandaran, Babol', imageUrl: 'https://picsum.photos/seed/201000/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '201001', name: 'Site 201001', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201001/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '201002', name: 'Site 201002', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201002/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '201003', name: 'Site 201003', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201003/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '201004', name: 'Site 201004', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201004/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '201005', name: 'Site 201005', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201005/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '201006', name: 'Site 201006', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201006/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '201007', name: 'Site 201007', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201007/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '201008', name: 'Site 201008', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201008/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '201009', name: 'Site 201009', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201009/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '201012', name: 'Site 201012', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201012/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '201013', name: 'Site 201013', location: 'Mazandaran, Sari', imageUrl: 'https://picsum.photos/seed/201013/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '201062', name: 'Site 201062', location: 'Mazandaran, Babol', imageUrl: 'https://picsum.photos/seed/201062/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '201064', name: 'Site 201064', location: 'Mazandaran, Babol', imageUrl: 'https://picsum.photos/seed/201064/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '201065', name: 'Site 201065', location: 'Mazandaran, Babol', imageUrl: 'https://picsum.photos/seed/201065/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '201069', name: 'Site 201069', location: 'Mazandaran, Babol', imageUrl: 'https://picsum.photos/seed/201069/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '201090', name: 'Site 201090', location: 'Mazandaran, Babolsar', imageUrl: 'https://picsum.photos/seed/201090/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '201091', name: 'Site 201091', location: 'Mazandaran, Babolsar', imageUrl: 'https://picsum.photos/seed/201091/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '201092', name: 'Site 201092', location: 'Mazandaran, Babolsar', imageUrl: 'https://picsum.photos/seed/201092/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '201100', name: 'Site 201100', location: 'Mazandaran, Chalus', imageUrl: 'https://picsum.photos/seed/201100/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '201120', name: 'Site 201120', location: 'Mazandaran, Fereydun Kenar', imageUrl: 'https://picsum.photos/seed/201120/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '201122', name: 'Site 201122', location: 'Mazandaran, Ramsar', imageUrl: 'https://picsum.photos/seed/201122/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '201150', name: 'Site 201150', location: 'Mazandaran, Nur', imageUrl: 'https://picsum.photos/seed/201150/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '201161', name: 'Site 201161', location: 'Mazandaran, Nowshahr', imageUrl: 'https://picsum.photos/seed/201161/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '201166', name: 'Site 201166', location: 'Mazandaran, Nowshahr', imageUrl: 'https://picsum.photos/seed/201166/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '201190', name: 'Site 201190', location: 'Mazandaran, Ramsar', imageUrl: 'https://picsum.photos/seed/201190/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '201221', name: 'Site 201221', location: 'Mazandaran, Tonekabon', imageUrl: 'https://picsum.photos/seed/201221/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '261000', name: 'Site 261000', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261000/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '261001', name: 'Site 261001', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261001/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '261002', name: 'Site 261002', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261002/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '261003', name: 'Site 261003', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261003/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '261005', name: 'Site 261005', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261005/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '261006', name: 'Site 261006', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261006/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '261008', name: 'Site 261008', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261008/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '261009', name: 'Site 261009', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261009/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '261010', name: 'Site 261010', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261010/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '261012', name: 'Site 261012', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261012/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '261014', name: 'Site 261014', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261014/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '261015', name: 'Site 261015', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261015/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '261016', name: 'Site 261016', location: 'Golestan, Gorgan', imageUrl: 'https://picsum.photos/seed/261016/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '261101', name: 'Site 261101', location: 'Golestan, Gonbad-e Kavus', imageUrl: 'https://picsum.photos/seed/261101/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '261104', name: 'Site 261104', location: 'Golestan, Gonbad-e Kavus', imageUrl: 'https://picsum.photos/seed/261104/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '261105', name: 'Site 261105', location: 'Golestan, Gonbad-e Kavus', imageUrl: 'https://picsum.photos/seed/261105/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '301000', name: 'Site 301000', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301000/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '301001', name: 'Site 301001', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301001/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '301002', name: 'Site 301002', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301002/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '301003', name: 'Site 301003', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301003/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '301004', name: 'Site 301004', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301004/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '301005', name: 'Site 301005', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301005/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '301006', name: 'Site 301006', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301006/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '301007', name: 'Site 301007', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301007/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '301008', name: 'Site 301008', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301008/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '301009', name: 'Site 301009', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301009/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '301012', name: 'Site 301012', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301012/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '301013', name: 'Site 301013', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301013/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '301014', name: 'Site 301014', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301014/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '301015', name: 'Site 301015', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301015/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '301016', name: 'Site 301016', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301016/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '301017', name: 'Site 301017', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301017/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '301018', name: 'Site 301018', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301018/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '301021', name: 'Site 301021', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301021/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '301024', name: 'Site 301024', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301024/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '301025', name: 'Site 301025', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301025/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '301026', name: 'Site 301026', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301026/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '301027', name: 'Site 301027', location: 'Azarbayjan-e Gharbi, Orumiyeh', imageUrl: 'https://picsum.photos/seed/301027/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '301100', name: 'Site 301100', location: 'Azarbayjan-e Gharbi, Bukan', imageUrl: 'https://picsum.photos/seed/301100/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '301101', name: 'Site 301101', location: 'Azarbayjan-e Gharbi, Bukan', imageUrl: 'https://picsum.photos/seed/301101/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '301104', name: 'Site 301104', location: 'Azarbayjan-e Gharbi, Bukan', imageUrl: 'https://picsum.photos/seed/301104/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '301105', name: 'Site 301105', location: 'Azarbayjan-e Gharbi, Bukan', imageUrl: 'https://picsum.photos/seed/301105/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '301109', name: 'Site 301109', location: 'Azarbayjan-e Gharbi, Bukan', imageUrl: 'https://picsum.photos/seed/301109/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '301111', name: 'Site 301111', location: 'Azarbayjan-e Gharbi, Mahabad', imageUrl: 'https://picsum.photos/seed/301111/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '301112', name: 'Site 301112', location: 'Azarbayjan-e Gharbi, Mahabad', imageUrl: 'https://picsum.photos/seed/301112/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '301161', name: 'Site 301161', location: 'Azarbayjan-e Gharbi, Mahabad', imageUrl: 'https://picsum.photos/seed/301161/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '301164', name: 'Site 301164', location: 'Azarbayjan-e Gharbi, Mahabad', imageUrl: 'https://picsum.photos/seed/301164/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '301200', name: 'Site 301200', location: 'Azarbayjan-e Gharbi, Khoy', imageUrl: 'https://picsum.photos/seed/301200/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '321000', name: 'Site 321000', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321000/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '321001', name: 'Site 321001', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321001/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '321004', name: 'Site 321004', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321004/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '321005', name: 'Site 321005', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321005/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '321006', name: 'Site 321006', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321006/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '321007', name: 'Site 321007', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321007/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '321008', name: 'Site 321008', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321008/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '321011', name: 'Site 321011', location: 'Zanjan, Zanjan', imageUrl: 'https://picsum.photos/seed/321011/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '321211', name: 'Site 321211', location: 'Zanjan, Khorramdarreh', imageUrl: 'https://picsum.photos/seed/321211/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '341006', name: 'Site 341006', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341006/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '341007', name: 'Site 341007', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341007/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '341009', name: 'Site 341009', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341009/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '341011', name: 'Site 341011', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341011/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '341013', name: 'Site 341013', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341013/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '341014', name: 'Site 341014', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341014/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '341017', name: 'Site 341017', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341017/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '341019', name: 'Site 341019', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341019/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '341020', name: 'Site 341020', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341020/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '341021', name: 'Site 341021', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341021/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '341026', name: 'Site 341026', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341026/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '341027', name: 'Site 341027', location: 'Azarbayjan-e Sharqi, Tabriz', imageUrl: 'https://picsum.photos/seed/341027/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '341100', name: 'Site 341100', location: 'Azarbayjan-e Sharqi, Maragheh', imageUrl: 'https://picsum.photos/seed/341100/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '341122', name: 'Site 341122', location: 'Azarbayjan-e Sharqi, Marand', imageUrl: 'https://picsum.photos/seed/341122/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '361001', name: 'Site 361001', location: 'Ardabil, Ardabil', imageUrl: 'https://picsum.photos/seed/361001/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '361002', name: 'Site 361002', location: 'Ardabil, Ardabil', imageUrl: 'https://picsum.photos/seed/361002/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '361003', name: 'Site 361003', location: 'Ardabil, Ardabil', imageUrl: 'https://picsum.photos/seed/361003/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '361004', name: 'Site 361004', location: 'Ardabil, Ardabil', imageUrl: 'https://picsum.photos/seed/361004/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '361005', name: 'Site 361005', location: 'Ardabil, Ardabil', imageUrl: 'https://picsum.photos/seed/361005/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '371000', name: 'Site 371000', location: 'Qazvin, Qazvin', imageUrl: 'https://picsum.photos/seed/371000/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '371002', name: 'Site 371002', location: 'Qazvin, Qazvin', imageUrl: 'https://picsum.photos/seed/371002/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '371003', name: 'Site 371003', location: 'Qazvin, Qazvin', imageUrl: 'https://picsum.photos/seed/371003/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '371005', name: 'Site 371005', location: 'Qazvin, Qazvin', imageUrl: 'https://picsum.photos/seed/371005/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '371011', name: 'Site 371011', location: 'Qazvin, Qazvin', imageUrl: 'https://picsum.photos/seed/371011/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '381000', name: 'Site 381000', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381000/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '381001', name: 'Site 381001', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381001/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '381002', name: 'Site 381002', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381002/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '381003', name: 'Site 381003', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381003/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '381004', name: 'Site 381004', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381004/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '381005', name: 'Site 381005', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381005/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '381006', name: 'Site 381006', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381006/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '381007', name: 'Site 381007', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381007/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '381008', name: 'Site 381008', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381008/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '381009', name: 'Site 381009', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381009/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '381011', name: 'Site 381011', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381011/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '381012', name: 'Site 381012', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381012/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '381013', name: 'Site 381013', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381013/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '381014', name: 'Site 381014', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381014/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '381015', name: 'Site 381015', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381015/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '381016', name: 'Site 381016', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381016/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '381018', name: 'Site 381018', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381018/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '381019', name: 'Site 381019', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381019/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '381020', name: 'Site 381020', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381020/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '381021', name: 'Site 381021', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381021/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] },
    { id: '381022', name: 'Site 381022', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381022/600/400', imageHint: 'telecom site', technicianId: technicianIds[5] },
    { id: '381023', name: 'Site 381023', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381023/600/400', imageHint: 'telecom site', technicianId: technicianIds[6] },
    { id: '381031', name: 'Site 381031', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381031/600/400', imageHint: 'telecom site', technicianId: technicianIds[7] },
    { id: '381032', name: 'Site 381032', location: 'Gilan, Rasht', imageUrl: 'https://picsum.photos/seed/381032/600/400', imageHint: 'telecom site', technicianId: technicianIds[8] },
    { id: '381100', name: 'Site 381100', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381100/600/400', imageHint: 'telecom site', technicianId: technicianIds[9] },
    { id: '381101', name: 'Site 381101', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381101/600/400', imageHint: 'telecom site', technicianId: technicianIds[0] },
    { id: '381103', name: 'Site 381103', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381103/600/400', imageHint: 'telecom site', technicianId: technicianIds[1] },
    { id: '381104', name: 'Site 381104', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381104/600/400', imageHint: 'telecom site', technicianId: technicianIds[2] },
    { id: '381105', name: 'Site 381105', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381105/600/400', imageHint: 'telecom site', technicianId: technicianIds[3] },
    { id: '381106', name: 'Site 381106', location: 'Gilan, Bandar Anzali', imageUrl: 'https://picsum.photos/seed/381106/600/400', imageHint: 'telecom site', technicianId: technicianIds[4] }
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
    siteId: '201000',
    assignedTechnicianId: 'user-3',
    status: 'In Progress',
    tasks: [
      { taskId: 'task-static-1', isCompleted: true, notes: 'دمای ورودی ۲۲ و خروجی ۲۸ بود. همه فن‌ها سالم هستند.', photos: [], location: null, checklist: {'fan-ok': true}, customFields: {'temp-in': 22, 'temp-out': 28} },
      { taskId: 'task-static-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
    crNumber: 'CR-789'
  },
  {
    id: 'pm-2',
    weekIdentifier: '2024-W28',
    siteId: '201001',
    assignedTechnicianId: 'user-4',
    status: 'Pending',
    tasks: [
        { taskId: 'task-static-1', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
        { taskId: 'task-static-2', isCompleted: false, notes: '', photos: [], location: null, checklist: {}, customFields: {} },
    ],
    crNumber: 'CR-790'
  },
  {
    id: 'pm-3',
    weekIdentifier: '2024-W27',
    siteId: '201000',
    assignedTechnicianId: 'user-3',
    status: 'Completed',
    tasks: [],
    crNumber: 'CR-780'
  },
    {
    id: 'pm-4',
    weekIdentifier: '2024-W26',
    siteId: '261000',
    assignedTechnicianId: 'user-5',
    status: 'Cancelled',
    tasks: [],
    crNumber: 'CR-770'
  },
];

export const changeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    siteId: '201000',
    title: 'سی آر برای رفع خرابی',
    description: 'کابل شبکه سرور DB05 قطع شده و نیاز به تعویض فوری دارد.',
    submittedBy: 'user-3',
    createdAt: '2024-07-15T10:00:00Z',
    status: 'باز',
    priority: 'بحرانی',
    photos: ['https://picsum.photos/seed/cr1/400/300'],
    city: 'Babol',
    technicianName: 'Salimi',
    startDate: '2024-07-15',
    endDate: '2024-07-16',
  },
  {
    id: 'cr-2',
    siteId: '201001',
    title: 'سی آر برای بازدید در موارد خاص',
    description: 'به دلیل افزایش ترافیک، نیاز به افزایش رم سرور WEB02 از ۳۲ به ۶۴ گیگابایت است.',
    submittedBy: 'user-2',
    createdAt: '2024-07-14T14:30:00Z',
    status: 'در حال انجام',
    priority: 'زیاد',
    photos: [],
    city: 'Sari',
    technicianName: 'Dastar',
    startDate: '2024-07-16',
    endDate: '2024-07-18',
  },
  {
    id: 'cr-3',
    siteId: '261000',
    title: 'سی آر برای پی ام',
    description: 'نصب دوربین در ورودی جنوبی برای پوشش بهتر امنیتی.',
    submittedBy: 'user-1',
    createdAt: '2024-07-12T09:00:00Z',
    status: 'انجام شده',
    priority: 'متوسط',
    photos: [],
    city: 'Gorgan',
    technicianName: 'Noroozipoor',
    startDate: '2024-07-13',
    endDate: '2024-07-14',
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
    
    // Create a deep copy to avoid modifying the original data
    const pmCopy = JSON.parse(JSON.stringify(pm));

    const populatedTasks = pmCopy.tasks.map((taskResult: any) => {
        const taskDef = tasks.find(t => t.id === taskResult.taskId);
        return { ...taskDef, ...taskResult };
    });
    
    const pmTaskIds = new Set(pmCopy.tasks.map((t: any) => t.taskId));

    // Define which tasks should exist for a PM
    // For now, all static tasks + dynamic tasks if applicable
    const applicableTasks = tasks.filter(t => {
        // Example logic: include dynamic tasks only for specific sites or conditions
        if (t.type === 'dynamic') {
             // Let's say dynamic tasks only apply to sites in Babol for this demo
            const site = getSiteById(pmCopy.siteId);
            return site?.location.includes('Babol');
        }
        return t.type === 'static';
    });

    const missingTasks = applicableTasks
      .filter(t => !pmTaskIds.has(t.id))
      .map(t => ({
          ...t, 
          taskId: t.id, 
          isCompleted: false, 
          notes: '', 
          photos: [], 
          location: null, 
          checklist: {}, 
          customFields: {}
      }));
      
    // Combine existing results with skeletons for missing tasks
    const allTasks = [...populatedTasks, ...missingTasks];

    return { ...pmCopy, tasks: allTasks };
}

export function getTechnicians() {
    return users.filter(u => u.role === 'Technician');
}

export function getCities() {
    const cityNames = sites.map(s => s.location.split(', ')[1]);
    return [...new Set(cityNames)];
}
