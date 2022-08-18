import * as React from 'react';

const JWTContext = React.createContext('');

export const useJWTContext = () => {
  const jwtContext = React.useContext(JWTContext);
  return jwtContext;
};
export default JWTContext;
