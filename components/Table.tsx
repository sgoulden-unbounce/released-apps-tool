/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

import Checkbox from "../islands/AppCheckbox.tsx";
import { useAppManifestsContext } from "./AppManifestsContext.tsx";
import { releasedLocations } from "../const/sampleManifests.ts";
import { convertManifestToAppName } from "../islands/App.tsx";

export function Table(
  { columns, rows }: { columns: string[]; rows: (string | boolean)[][] },
) {
  return (
    <div class={tw`overflow-x-auto relative shadow-md sm:rounded-lg`}>
      <table
        class={tw`w-full text-sm text-left text-gray-500 dark:text-gray-400`}
      >
        <thead
          class={tw`text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400`}
        >
          <tr>
            {columns.map((col) => (
              <th scope="col" class={tw`py-3 px-6`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([appName, ...row]) => (
            <tr
              class={tw`bg-white border-b dark:bg-gray-900 dark:border-gray-700`}
            >
              <th
                scope="row"
                class={tw`py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white`}
              >
                {convertManifestToAppName(appName as string)}
              </th>
              {row.map((value, index) => (
                <td class={tw`py-4 px-6`}>
                  <Checkbox
                    checked={value as boolean}
                    releasedLocation={releasedLocations[index]}
                    appName={appName as string}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
