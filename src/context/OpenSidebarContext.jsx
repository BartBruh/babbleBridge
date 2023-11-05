import { createContext, useState } from "react";

export const OpenSidebarContext = createContext();

export const OpenSidebarContextProvider = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <OpenSidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
      {children}
    </OpenSidebarContext.Provider>
  )
}