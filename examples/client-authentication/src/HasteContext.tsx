import React, { useCallback, useContext, useEffect, useState } from 'react';

import { HasteClient } from '@hastearcade/web';

export type HasteProviderProps = {
  initialized: boolean;
  hasteClient: HasteClient | undefined;
};

const HasteProviderContext = React.createContext({
  initialized: false,
  hasteClient: undefined,
} as HasteProviderProps);

export const HasteProvider: React.FC = ({ children }) => {
  const [hasteState, setHasteState] = useState<HasteProviderProps>({
    initialized: false,
    hasteClient: undefined,
  });

  const getHaste = useCallback(async () => {
    const client = await HasteClient.build(
      process.env.REACT_APP_HASTE_GAME_CLIENT_ID ?? '',
      process.env.REACT_APP_AUTH_URL ?? '',
    );

    try {
      const authResult = await client.handleRedirect();
      console.log(authResult);
      const isAuthenticated = await client.isAuthenticated();
      console.log(isAuthenticated);
    } catch (err) {
      console.error('an error occurred in auth');
    }

    setHasteState({ initialized: true, hasteClient: client });
  }, [setHasteState]);

  useEffect(() => {
    getHaste();
  }, [getHaste]);

  return <HasteProviderContext.Provider value={hasteState}>{children}</HasteProviderContext.Provider>;
};

export function useHasteState() {
  const context = useContext(HasteProviderContext);
  if (context === undefined) {
    throw new Error('useHasteState must be used within a HasteProvider');
  }

  return context;
}
