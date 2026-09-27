import { createContext, useContext, useState, type ReactNode } from 'react';

type Ctx = { openId: string | null; open: (id: string) => void; close: () => void };
const ProjectsCtx = createContext<Ctx>({ openId: null, open: () => {}, close: () => {} });

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return <ProjectsCtx.Provider value={{ openId, open: setOpenId, close: () => setOpenId(null) }}>{children}</ProjectsCtx.Provider>;
}
export const useProjects = () => useContext(ProjectsCtx);
