import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('doctor'); // 'doctor' | 'patient' | 'admin'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);

  const navigate = (page) => setCurrentPage(page);

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole,
      currentPage, navigate,
      notifications, setNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};
