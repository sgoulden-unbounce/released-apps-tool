/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAppManifestsContext } from "../components/AppManifestsContext.tsx";

import { Checkbox } from "../components/Checkbox.tsx";

interface CounterProps {
  start: number;
}

export default function AppCheckbox(
  { checked: initiallyChecked, releasedLocation, appName }: {
    checked: boolean;
    releasedLocation: string;
    appName: string;
  },
) {
  const { appManifests, setAppsManifests } = useAppManifestsContext();
  const [checked, setChecked] = useState(initiallyChecked);
  const onClick = () => {
    if (checked) {
      // This is turning the app off, so remove it from the finalized manifest.
      appManifests[releasedLocation].splice(
        appManifests[releasedLocation].indexOf(appName),
        1,
      );
      setAppsManifests(appManifests);
    } else {
      // This is turning the app off, so remove it from the finalized manifest.
      appManifests[releasedLocation].push(appName);
      setAppsManifests(appManifests);
    }
    setChecked(!checked);
  };
  return (
    <Checkbox
      checked={checked}
      onClick={onClick}
    />
  );
}
