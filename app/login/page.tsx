"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [state, setState] = useState("");

  useEffect(() => {
    // Generate a random string for state
    const randomState = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    sessionStorage.setItem("oauth_state", randomState);
    setState(randomState);
  }, []);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI!);
  const scope = "wow.profile";

  const loginUrl = `https://oauth.battle.net/authorize?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

  if (!state) return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-4xl font-bold">WoW Vault</h1>
      <a
        href={loginUrl}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Log in with Battle.net
      </a>
    </main>
  );
}
