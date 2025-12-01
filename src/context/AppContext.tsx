'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { User, Site, WeeklyPM, ChangeRequest, Task, TechRequest } from '@/lib/types';
import { initialUsers, initialSites, initialWeeklyPMs, initialChangeRequests, initialTasks, initialTechRequests } from '@/lib/data';

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
  techRequests: TechRequest[];
  setTechRequests: React.Dispatch<React.SetStateAction<TechRequest[]>>;
  updateTechRequest: (request: TechRequest) => void;
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
  techRequests: [],
  setTechRequests: () => {},
  updateTechRequest: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [weeklyPMs, setWeeklyPMs] = useState<WeeklyPM[]>(initialWeeklyPMs);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(initialChangeRequests);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [techRequests, setTechRequests] = useState<TechRequest[]>(initialTechRequests);

  const addWeeklyPM = (pm: WeeklyPM) => {
    setWeeklyPMs(prevPMs => [pm, ...prevPMs]);
  };

  const updateWeeklyPM = (updatedPM: WeeklyPM) => {
    setWeeklyPMs(prevPMs => 
      prevPMs.map(pm => (pm.id === updatedPM.id ? updatedPM : pm))
    );
  };
  
  const updateTechRequest = (updatedRequest: TechRequest) => {
    setTechRequests(prevRequests =>
      prevRequests.map(req => (req.id === updatedRequest.id ? updatedRequest : req))
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
        tasks,
        techRequests,
        setTechRequests,
        updateTechRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};
