import {ICustomer, IUser} from '@/lib/interfaces';
import {createContext, useContext, useState} from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: IUser<ICustomer> | null;
  setUser: (user: IUser<ICustomer> | null) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<IUser<ICustomer> | null>(null);

  const value = {
    isAuthenticated: !!user,
    user,
    setUser,
  } satisfies AuthContextType;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
