import * as React from 'react';

const AppManifestsContext = React.createContext({});

export const useAppManifestsContext = () => {
  const appManifestsContext = React.useContext(AppManifestsContext);
  return appManifestsContext;
};

export default AppManifestsContext;
