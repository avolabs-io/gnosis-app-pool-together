import React, { createContext, useState, useContext } from 'react';

type Navigation = {
  initiallySelectedPool: string;
  selectedPage: string;
};

type NavigationContextType = {
  navigation: Navigation;
  setNavigation: React.Dispatch<React.SetStateAction<Navigation>>;
};

const NavigationContext = createContext<NavigationContextType>({
  navigation: {
    initiallySelectedPool: '0',
    selectedPage: '0',
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNavigation: () => {},
});

export const NavigationProvider: React.FC = ({ children }) => {
  const [navigation, setNavigation] = useState<Navigation>({
    initiallySelectedPool: '0',
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
