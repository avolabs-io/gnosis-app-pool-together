import React, { createContext, useState, useContext } from 'react';

type Navigation = {
  selectedPool: string;
  selectedPage: string;
};

type NavigationContextType = {
  navigation: Navigation;
  setNavigation: React.Dispatch<React.SetStateAction<Navigation>>;
};

const NavigationContext = createContext<NavigationContextType>({
  navigation: {
    selectedPool: '0',
    selectedPage: '0',
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNavigation: () => {},
});

export const NavigationProvider: React.FC = ({ children }) => {
  const [navigation, setNavigation] = useState<Navigation>({
    selectedPool: '0',
    selectedPage: '0',
  });
  return (
    <NavigationContext.Provider
      value={{
        navigation,
        setNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('No network provider!');
  }
  return context;
};
