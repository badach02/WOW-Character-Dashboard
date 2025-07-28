import { cookies as nextCookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

type Character = {
  id: number;
  name: string;
  realm: { slug: string; name: string };
  character_class: { name: string };
  active_spec?: { name: string };
  equipped_item_level: number;
  level: number;
  avatar?: string;
};

const classColors: Record<string, string> = {
  Warrior: "border-red-600",
  Mage: "border-blue-500",
  Druid: "border-orange-400",
  Rogue: "border-yellow-500",
  Hunter: "border-green-600",
  Priest: "border-gray-700",
  Warlock: "border-purple-700",
  Paladin: "border-pink-500",
  Shaman: "border-blue-400",
  Monk: "border-green-400",
  DeathKnight: "border-red-800",
  DemonHunter: "border-purple-600",
};

export default async function DashboardPage() {
  const cookieStore = await nextCookies();
  const token = cookieStore.get("bnet_token")?.value;

  if (!token) {
    return <div>Not logged in</div>;
  }

  // Fetch profile with characters
  const profileRes = await fetch(
    "https://us.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!profileRes.ok) {
    return <div>Failed to load profile. Are you logged in?</div>;
  }

  const profileData = await profileRes.json();

  if (!profileData.wow_accounts) {
    return <div>No characters found.</div>;
  }

  // Extract characters
  const characters: Character[] = profileData.wow_accounts
    .flatMap((account: any) => account.characters || [])
    .filter(Boolean)
    .sort((a: Character, b: Character) => b.level - a.level);

  // Fetch avatar URLs for each character in parallel
  const charactersWithAvatars = await Promise.all(
    characters.map(async (char) => {
      try {
        const mediaRes = await fetch(
          `https://us.api.blizzard.com/profile/wow/character/${char.realm.slug}/${char.name.toLowerCase()}/character-media?namespace=profile-us`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!mediaRes.ok) {
          return char; // Return char without avatar if fetch fails
        }

        const mediaData = await mediaRes.json();

        const avatar = mediaData.assets?.find(
          (asset: any) => asset.key === "avatar"
        )?.value;

        return { ...char, avatar };
      } catch {
        return char;
      }
    })
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Characters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charactersWithAvatars.map((char) => {
          const classNameKey = char.character_class?.name
            ? char.character_class.name.replace(/\s+/g, "")
            : "";

          const borderColorClass = classColors[classNameKey] || "border-gray-300";

          return (
            <Link
              key={char.id}
              href={`/character/${char.realm.slug}/${char.name.toLowerCase()}`}
              className={`p-4 border-4 rounded-lg hover:shadow-lg transition-colors bg-white hover:bg-gray-50 ${borderColorClass} text-gray-900 flex items-center space-x-4`}
              // passHref and rel are optional here, Next.js handles it but can add if you want:
              // passHref
              // rel="noopener noreferrer"
            >
              {char.avatar ? (
                <Image
                  src={char.avatar}
                  alt={`${char.name} avatar`}
                  width={64}
                  height={64}
                  className="rounded-full border border-gray-300"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{char.name}</h2>
                <p>
                  {(char.character_class?.name ?? "Unknown Class")} -{" "}
                  {(char.active_spec?.name ?? "Unknown Spec")}
                </p>
                <p>Realm: {char.realm?.name ?? "Unknown Realm"}</p>
                <p>iLvl: {char.equipped_item_level ?? "N/A"}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
