import { Handlers } from "https://deno.land/x/fresh@1.0.2/server.ts";

export const handler: Handlers = {
  async GET(req) {
    const resp = await fetch(
      "https://api.unbounce.com/ensign/production/flags/content-creation-editor/config/appManifests?selector=channels:unbouncers",
      {
        headers: req.headers,
      },
    );
    if (resp.status === 200) {
      const { flag: { value } } = await resp.json();
      return new Response(value);
    }
    return resp;
  },
  async POST(req) {
    const resp = await fetch(
      "https://api.unbounce.com/ensign/production/flags/content-creation-editor/config/appManifests",
      {
        method: "PUT",
        headers: req.headers,
        body: req.body,
      },
    );
    if (resp.status === 200) {
      const { flag: { value } } = await resp.json();
      return new Response(value);
    }
    return resp;
  },
};
