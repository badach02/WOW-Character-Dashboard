// app/character/[realm]/[name]/page.tsx
import { cookies } from "next/headers";

export default async function CharacterPage({ params }: { params: { realm: string; name: string } }) {
  const { realm, name } = params;

  const cookieStore = await cookies(); // ✅ FIXED: await required
  const token = cookieStore.get("bnet_token")?.value;

  if (!token) {
    return <div>Not logged in</div>;
  }

  const res = await fetch(`https://us.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}?namespace=profile-us&locale=en_US`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return <div>Error loading character data.</div>;
  }

  const char = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">{char.name}</h1>
      <p className="text-xl">{char.character_class?.name || "Unknown Class"} - Level {char.level}</p>
      <p>Realm: {char.realm?.name || "Unknown Realm"}</p>
      <p>Item Level: {char.equipped_item_level ?? "N/A"}</p>
    </main>
  );
}
