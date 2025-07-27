# WoW Vault

**WoW Vault** is a full-stack web application that connects to the official World of Warcraft API to give players a personalized dashboard for their characters.

Users can log in with their Battle.net account and view real-time data about their characters including gear, item level, class/spec, realm, recent Mythic+ runs, and raid progress.

## Features

**Login via Blizzard OAuth**  
Securely authenticate users using Blizzard’s official OAuth flow.

**Add & Display Characters**  
After login, automatically fetch all characters associated with the user’s Battle.net account.

**Character Overview**  
Display:
- Name
- Realm
- Faction
- Class
- Spec
- Item Level (ilvl)
- Thumbnail avatar

**Gear Viewer**  
View current equipped gear with item level, slot, and links to Wowhead.

**Recent Activity**
- Recent **Mythic+ runs** (keystone level, dungeon, completion time)
- Recent **raid progress** from tracked raid tiers



##  Blizzard API Setup

1. Create an account at [Battle.net Developer Portal](https://develop.battle.net/access/)
2. Register your app and note your:
   - `CLIENT_ID`
   - `CLIENT_SECRET`
3. Add redirect URI: `http://localhost:3000/api/callback` (or your production URL)
4. Set OAuth scopes: `wow.profile`



## Future Features

- Weekly Vault Tracker  
- Achievement Display  
- Transmog Collection Viewer  
- Custom Goals & Checklists  
- Notifications on Weekly Reset  
