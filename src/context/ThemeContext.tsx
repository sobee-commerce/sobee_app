import {COLOR} from '@/theme';
import {ColorType, ColorVariant} from '@/types';
import {APP_CONFIG} from '@/utils';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {MMKV} from 'react-native-mmkv';

interface IThemeContext {
  theme: ColorVariant;
  toggleTheme: () => void;
  colors: ColorType;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = PropsWithChildren<{
  storage: MMKV;
}>;

export const ThemeProvider = ({storage, children}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ColorVariant>('light');

  const userTheme = useColorScheme();

  useEffect(() => {
    const appHasTheme = storage.contains(APP_CONFIG.STORAGE_KEY.THEME);
    if (appHasTheme) {
      const _theme = storage.getString(APP_CONFIG.STORAGE_KEY.THEME);
      setTheme(_theme as ColorVariant);
    } else {
      storage.set(APP_CONFIG.STORAGE_KEY.THEME, userTheme || 'light');
      setTheme(userTheme as ColorVariant);
    }
  }, [storage, userTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.set('theme', newTheme);
  }, [storage, theme]);

  const value: IThemeContext = {
    theme,
    toggleTheme,
    colors: COLOR[theme],
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
