import { Application } from "https://deno.land/x/oak/mod.ts";

const client_id = "your-auth0-client-id";
const client_secret = "your-auth0-client-secret";
const domain = "your-auth0-domain";

const app = new Application();

app.use(async (context) => {
  const url = new URL(context.request.url.toString());
  const pathname = url.pathname;

  if (pathname === "/login") {
    const authUrl = `https://${domain}/authorize?response_type=code&client_id=${client_id}&redirect_uri=http://localhost:8000/callback`;
    context.response.redirect(authUrl);
  } else if (pathname === "/callback") {
    const code = url.searchParams.get("code");
    const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id,
        client_secret,
        code,
        redirect_uri: "http://localhost:8000/callback",
      }),
    });

    const tokenData = await tokenResponse.json();
    context.cookies.set("access_token", tokenData.access_token);
    context.response.redirect("/");
  }
});

await app.listen({ port: 8000 });
