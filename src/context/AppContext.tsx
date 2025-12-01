'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { User, Site, WeeklyPM, ChangeRequest, Task } from '@/lib/types';
import { initialUsers, initialSites, initialWeeklyPMs, initialChangeRequests, initialTasks } from '@/lib/data';

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sites: Site[];
  weeklyPMs: WeeklyPM[];
  setWeeklyPMs: React.Dispatch<React.SetStateAction<WeeklyPM[]>>;
  addWeeklyPM: (pm: WeeklyPM) => void;
  updateWeeklyPM: (pm: WeeklyPM) => void;
  changeRequests: ChangeRequest[];
  tasks: Task[];
}

export const AppContext = createContext<AppContextType>({
  users: [],
  setUsers: () => {},
  sites: [],
  weeklyPMs: [],
  setWeeklyPMs: () => {},
  addWeeklyPM: () => {},
  updateWeeklyPM: () => {},
  changeRequests: [],
  tasks: [],
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [weeklyPMs, setWeeklyPMs] = useState<WeeklyPM[]>(initialWeeklyPMs);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(initialChangeRequests);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addWeeklyPM = (pm: WeeklyPM) => {
    setWeeklyPMs(prevPMs => [pm, ...prevPMs]);
  };

  const updateWeeklyPM = (updatedPM: WeeklyPM) => {
    setWeeklyPMs(prevPMs => 
      prevPMs.map(pm => (pm.id === updatedPM.id ? updatedPM : pm))
    );
  };

  return (
    <AppContext.Provider value={{ 
        users, 
        setUsers,
        sites, 
        weeklyPMs, 
        setWeeklyPMs,
        addWeeklyPM,
        updateWeeklyPM,
        changeRequests, 
        tasks 
    }}>
      {children}
    </AppContext.Provider>
  );
};
