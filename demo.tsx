import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Checkbox, Grid, Input, Typography } from '@mui/material';
import {
  sampleIntegration,
  sampleProduction,
  sampleReviewers,
} from './sampleManifest';
import JWTContext from './jwtContext';
import AppsManifestContext, {
  useAppManifestsContext,
} from './appManifestsContext';

const REGEX = /\/.*\/(.*)\/manifest.js/;
const appToReleaseMapping: {
  [appName: string]: { [releasedLocation: string]: boolean };
} = {};

const convertManifestToAppName = (manifestString) => {
  return REGEX.exec(manifestString)[1];
};

const manifestsToTableData = (manifest: string, releaseLocation: string) => {
  const parsedManifests = JSON.parse(manifest);
  const manifestNames = parsedManifests.map(
    (app_name) =>
      (appToReleaseMapping[app_name] = {
        ...(appToReleaseMapping[app_name] || {}),
        [releaseLocation]: true,
      })
  );
  return manifestNames;
};

const AppCheckbox = (value) => {
  const { appManifests, setAppsManifests } = useAppManifestsContext();
  const releasedLocation = value.colDef.field;
  const app_manifest = value.row.app_name;
  const [checked, setChecked] = React.useState(value.value);
  const onClick = () => {
    if (checked) {
      // This is turning the app off, so remove it from the finalized manifest.
      appManifests[releasedLocation].splice(
        appManifests[releasedLocation].indexOf(app_manifest),
        1
      );
      setAppsManifests(appManifests);
    } else {
      // This is turning the app off, so remove it from the finalized manifest.
      appManifests[releasedLocation].push(app_manifest);
      setAppsManifests(appManifests);
    }
    setChecked(!checked);
  };
  return <Checkbox checked={checked} onChange={onClick} />;
};

const columns: GridColDef[] = [
  {
    field: 'app_name',
    headerName: 'App name',
    width: 180,
    valueGetter: (value) => convertManifestToAppName(value.value),
  },
  {
    field: 'released_reviewers',
    headerName: 'Released To Reviewers',
    headerAlign: 'center',
    renderCell: AppCheckbox,
    align: 'center',
    width: 200,
  },
  {
    field: 'released_integration',
    headerName: 'Released On Integration',
    headerAlign: 'center',
    renderCell: AppCheckbox,
    align: 'center',
    width: 200,
  },
  {
    field: 'released_production',
    headerName: 'Released On Production',
    headerAlign: 'center',
    renderCell: AppCheckbox,
    align: 'center',
    width: 200,
  },
];

manifestsToTableData(sampleIntegration, 'released_integration');
manifestsToTableData(sampleReviewers, 'released_reviewers');
manifestsToTableData(sampleProduction, 'released_production');

const rows = Object.entries(appToReleaseMapping).map(
  ([app_name, releasedLocations], id) => ({
    id,
    app_name,
    ...releasedLocations,
  })
);

export default function DataTable() {
  const [jwt, setJwt] = React.useState();
  const [appManifests, setAppsManifests] = React.useState({});
  React.useEffect(() => {
    setAppsManifests({
      released_integration: JSON.parse(sampleIntegration),
      released_reviewers: JSON.parse(sampleReviewers),
      released_production: JSON.parse(sampleProduction),
    });
  }, []);
  return (
    <JWTContext.Provider value={jwt}>
      <AppsManifestContext.Provider value={{ appManifests, setAppsManifests }}>
        <Grid>
          <Typography>Released Apps tool</Typography>
        </Grid>
        <Input
          placeholder="Enter your JWT here"
          value={jwt}
          onVal
          onChange={(e) => setJwt(e.target.value)}
        />
        <div style={{ height: 1000, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      </AppsManifestContext.Provider>
    </JWTContext.Provider>
  );
}
