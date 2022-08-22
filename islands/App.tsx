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
import { tw } from "@twind";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

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
  releaseLocation: string
) => {
  const manifestNames = manifest?.map(
    (app_name) =>
      (startObject[app_name] = {
        ...(startObject[app_name] || {}),
        [releaseLocation]: true,
      })
  );
  return manifestNames;
};

export default function App() {
  const [appManifests, setAppsManifests] = useState<AppManifests>({});
  const [errors, setErrors] = useState("");
  const [jwt, setJwt] = useState("");
  const [loading, setLoading] = useState(false);
  const getManifests = async () => {
    if (jwt !== "") {
      try {
        const responses = await Promise.all(
          releasedLocations.map((location) =>
            fetch(`/manifests/${location}`, {
              headers: { authorization: `Bearer ${jwt}` },
            })
          )
        );
        const [integrationJson, productionJson, unbouncersJson, reviewersJson] =
          await Promise.all(responses.map((location) => location.json()));

        setAppsManifests({
          integration: integrationJson,
          production: productionJson,
          reviewers: reviewersJson,
          unbouncers: unbouncersJson,
        });
      } catch (error) {
        setErrors(error.message);
      }
    } else {
      setErrors("Please enter your JWT!");
    }
  };

  const appToReleaseMapping: AppToReleaseMapping = {};
  releasedLocations.forEach((location) =>
    manifestsToTableData(appToReleaseMapping, appManifests[location], location)
  );
  const rows = Object.entries(appToReleaseMapping).map(
    ([app_name, { integration, reviewers, unbouncers, production }]) => [
      app_name,
      integration,
      reviewers,
      unbouncers,
      production,
    ]
  );

  const updateManifests = async () => {
    if (
      !window.confirm(
        "Are you sure? This will affect live Smart Builder code. Ensure you have double checked the correct apps have been released"
      )
    ) {
      return;
    }
    setErrors("");
    setLoading(true);
    const promises = ["integration", "production"].map((location) =>
      fetch(`/manifests/${location}`, {
        method: "post",
        headers: {
          authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(appManifests[location]),
          created_by: "Sam Goulden",
          selector: "channels:stable",
        }),
      })
    );
    promises.push(
      fetch(`/manifests/unbouncers`, {
        method: "post",
        headers: {
          authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(appManifests.unbouncers),
          created_by: "Sam Goulden",
          selector: "channels:unbouncers",
        }),
      })
    );
    promises.push(
      fetch(`/manifests/reviewers`, {
        method: "post",
        headers: {
          authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(appManifests.reviewers),
          created_by: "Sam Goulden",
          selector: "channels:sb-app-testing",
        }),
      })
    );
    const responses = await Promise.all(promises);
    const [integrationJson, productionJson, unbouncersJson, reviewersJson] =
      await Promise.all(responses.map((location) => location.json()));
    setAppsManifests({
      integration: integrationJson,
      reviewers: reviewersJson,
      unbouncers: unbouncersJson,
      production: productionJson,
    });
    setLoading(false);
  };
  return (
    <AppManifestsContext.Provider value={{ appManifests, setAppsManifests }}>
      <div>{errors}</div>
      <label for="jwt-input">Input your JWT here</label>
      <div class={tw`flex space-x-20`}>
        <input
          class={tw`border`}
          aria-label="jwt-input"
          onBlur={(e) => setJwt(e?.target?.value)}
        />
        <button
          class={tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          onClick={rows.length > 0 ? updateManifests : getManifests}
        >
          {rows.length > 0 ? (
            loading ? (
              <LoadingSpinner />
            ) : (
              "Commit Changes to LIVE Smart Builder app"
            )
          ) : (
            "Load Released apps"
          )}
        </button>
      </div>
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
