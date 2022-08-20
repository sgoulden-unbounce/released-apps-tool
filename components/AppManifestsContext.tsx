// @jsx h
import { createContext, h } from "preact";
import { useContext } from "preact/hooks";

export type AppManifests = { [releasedLocation: string]: string[] };
type AppManifestsContextType = {
  appManifests: AppManifests;
  setAppsManifests: (newManifests: AppManifests) => void;
};
export const initialContext = {
  appManifests: {},
  setAppsManifests: () => ({}),
};
const AppManifestsContext = createContext<AppManifestsContextType>(
  initialContext,
);

export const useAppManifestsContext = () => {
  const appManifestsContext = useContext(AppManifestsContext);
  return appManifestsContext;
};

export default AppManifestsContext;
