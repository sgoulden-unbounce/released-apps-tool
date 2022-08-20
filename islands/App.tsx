/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  releasedLocations,
  sampleIntegration,
  sampleProduction,
  sampleReviewers,
} from "../const/sampleManifests.ts";
import AppManifestsContext, {
  AppManifests,
  initialContext,
} from "../components/AppManifestsContext.tsx";
import { Table } from "../components/Table.tsx";
import { tw } from "../utils/twind.ts";

type AppToReleaseMapping = {
  [appName: string]: { [releasedLocation: string]: boolean };
};
const REGEX = /\/.*\/(.*)\/manifest.js/;

export const convertManifestToAppName = (manifestString: string) => {
  return REGEX.exec(manifestString)[1];
};

const manifestsToTableData = (
  startObject: AppToReleaseMapping,
  manifest: string[],
  releaseLocation: string,
) => {
  const manifestNames = manifest?.map(
    (app_name) => (startObject[app_name] = {
      ...(startObject[app_name] || {}),
      [releaseLocation]: true,
    }),
  );
  return manifestNames;
};

export default function App() {
  const [appManifests, setAppsManifests] = useState<AppManifests>({});
  const [jwt, setJwt] = useState("");
  useEffect(() => {
    const setManifests = async () => {
      const integration = await fetch("/get_manifests/integration", {
        headers: { authorization: `Bearer ${jwt}` },
      });
      const production = await fetch("/get_manifests/production", {
        headers: { authorization: `Bearer ${jwt}` },
      });
      const unbouncers = await fetch("/get_manifests/unbouncers", {
        headers: { authorization: `Bearer ${jwt}` },
      });
      const reviewers = await fetch("/get_manifests/reviewers", {
        headers: { authorization: `Bearer ${jwt}` },
      });
      const integrationJson = await integration.json();
      const productionJson = await production.json();
      const unbouncersJson = await unbouncers.json();
      const reviewersJson = await reviewers.json();
      setAppsManifests({
        integration: integrationJson,
        production: productionJson,
        reviewers: reviewersJson,
        unbouncers: unbouncersJson,
      });
    };
    if (jwt && jwt !== "") setManifests();
  }, [jwt]);

  const appToReleaseMapping: AppToReleaseMapping = {};
  releasedLocations.forEach((location) =>
    manifestsToTableData(appToReleaseMapping, appManifests[location], location)
  );
  const rows = Object.entries(appToReleaseMapping).map(
    (
      [app_name, { integration, reviewers, unbouncers, production }],
    ) => [app_name, integration, reviewers, unbouncers, production],
  );
  return (
    <AppManifestsContext.Provider value={{ appManifests, setAppsManifests }}>
      <label for="jwt-input">Input your JWT here</label>
      <input
        class={tw`border`}
        aria-label="jwt-input"
        onBlur={(e) =>
          setJwt(e?.target?.value)}
      />
      <Table
        columns={[
          "App Name",
          "Released Integration",
          "Released to Reviewers",
          "Released to Unbouncers",
          "Released Production",
        ]}
        rows={rows}
      />
    </AppManifestsContext.Provider>
  );
}
