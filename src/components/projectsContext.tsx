import { createContext, useContext, useState, type ReactNode } from 'react';

type Ctx = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  /** The Tableau visualization shown in the viewer, if any. */
  vizId: string | null;
  openViz: (id: string) => void;
  closeViz: () => void;
};
const noop = () => {};
const ProjectsCtx = createContext<Ctx>({ openId: null, open: noop, close: noop, vizId: null, openViz: noop, closeViz: noop });

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [vizId, setVizId] = useState<string | null>(null);
  return (
    <ProjectsCtx.Provider
      value={{
        openId,
        open: setOpenId,
        close: () => setOpenId(null),
        vizId,
        // Opening a dashboard from a project's details replaces that dialog.
        openViz: (id) => {
          setOpenId(null);
          setVizId(id);
        },
        closeViz: () => setVizId(null),
      }}
    >
      {children}
    </ProjectsCtx.Provider>
  );
}
export const useProjects = () => useContext(ProjectsCtx);
