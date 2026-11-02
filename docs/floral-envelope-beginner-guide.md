# Floral Envelope — සරල සිංහල code guide එක

මේ invitation එක `wedding-invitation (1).zip` අනුව සාදා **The Grand Heirloom → Premium · Bespoke** package එකට වෙනම template එකක් ලෙස එකතු කර ඇත.

## Templates දෙකම පවතී

| Design | Code | Preview |
| --- | --- | --- |
| පවතින Heritage Door | `tpl_grand_heirloom` | `/invite/demo-grand-heirloom` |
| අලුත් Floral Envelope | `tpl_heirloom_envelope` | `/invite/demo-heirloom-envelope` |

පවතින Heritage Door component, CSS, artwork, settings, sound සහ editor files වෙනස් කර නැත. ඒ files හයේ SHA-256 hashes වැඩ ආරම්භයට පෙර සහ අවසානයේ එක සමාන බව පරීක්ෂා කර ඇත. පැරණි preview URL එක සහ saved template code එකද එලෙසම පවතී.

## Preview එක බලන ආකාරය

Frontend folder එකේ terminal එකෙන්:

```sh
npm run dev
```

Browser එකේ `http://localhost:3000/invite/demo-heirloom-envelope` විවෘත කරන්න. **Tap to open** හෝ wax seal එක ඔබන්න. Guest name එකක් පෙන්වීමට `?guest=Your%20Name` එක් කරන්න. `/packages` පිටුවේ The Grand Heirloom card එකේ designs දෙකම පෙන්වයි.

## Files සහ ඒවායේ කාර්යයන්

| File | කාර්යය |
| --- | --- |
| `src/components/invitation/templates/FloralEnvelopeTemplate.tsx` | React invitation page, opening state, sections, photos, RSVP සහ calendar |
| `src/components/invitation/templates/floral-envelope.css` | ZIP එකේ original CSS; `.envelopeRoot` යටතේ scope කර ඇත |
| `src/components/invitation/templates/envelope-art.js` | Original flowers, envelope textures, venue sketches සහ couple illustrations |
| `src/components/invitation/envelope.ts` | New settings type, default settings, themes 9 සහ language labels |
| `src/components/invitation/envelope-sound.ts` | Wax-crack, paper-rustle, welcome chime සහ built-in melody |
| `src/components/invitation/EnvelopeEditor.tsx` | මේ design එකට පමණක් අදාළ dashboard controls |
| `src/components/invitation/registry.ts` | අලුත් template code එක React component එකට සම්බන්ධ කරන entry එක |
| `src/components/invitation/sample-data.ts` | ZIP එකේ Diyuni & Rashmika demo details සහ timeline |
| `src/components/invitation/packages.ts` | Premium package එකට අලුත් design code එක එක් කිරීම |

React, TypeScript, JavaScript සහ CSS project එකේ පවතින ආකාරයට භාවිත කර ඇත. අලුත් UI library එකක් install කිරීමට අවශ්‍ය නැත.

## Code එක තේරුම් ගනිමු

### 1. State යනු වෙනස් විය හැකි value එකකි

```tsx
const [opening, setOpening] = useState(false);
const [opened, setOpened] = useState(false);
```

`opening` මගින් envelope opening animation එක ආරම්භ වී තිබේද යන්න ද, `opened` මගින් invitation content එක විවෘත වී තිබේද යන්න ද මතක තබයි. `setOpening(true)` කළ විට flap එක හැරේ, card එක ඉහළට එසවේ, ඉන්පසු envelope එක zoom වී invitation page එක පෙන්වයි.

### 2. Data සහ actions

`data` තුළ couple names, parents, date, time, venue සහ photos තිබේ. `actions` තුළ RSVP submit කරන function එක සහ `demo`, `preview`, `live` modes තිබේ. ඒ නිසා layout එක වෙනස් කළත් guest replies යවන API එක පවතින project එකේම එකයි.

### 3. Theme එක තෝරන්නේ array එකකිනි

```tsx
const colours = envelopeColours(settings);
```

`ENVELOPE_PALETTES` තුළ Burgundy, Navy Gold, Emerald, Rose Mauve, Royal Purple, Teal Coral, Noir Gold, Dusty Sage සහ Peach Blush යන themes නවය තිබේ. Main, gold/accent, background සහ envelope colours වෙනම customise කළ හැක.

### 4. CSS අනෙක් templates වලට බලපාන්නේ නැත්තේ ඇයි?

```css
.envelopeRoot .env { /* envelope styles */ }
.envelopeRoot .nav { /* invitation navigation */ }
```

මේ CSS rules ක්‍රියාත්මක වන්නේ `.envelopeRoot` තුළ පමණි. Animation names ද `fe-` prefix එකක් භාවිත කරයි. Heritage Door එකේ CSS සහ animations වෙනස් කර නැත.

### 5. Original artwork

ZIP එකේ `img` folder එකේ actual photo files නැත. ඒ වෙනුවට SVG code වලින් flowers සහ couple illustrations සාදයි. ඒ original drawing functions `envelope-art.js` තුළ තබා ඇත. Standalone SVG image එකකට අවශ්‍ය XML namespace එකද එක් කර ඇත. ZIP එකේ application script එක හෝ HTML page එක iframe එකක run කරන්නේ නැත.

### 6. Sound effects

`EnvelopeSound` class එක browser එකේ Web Audio API භාවිතයෙන් wax crack, paper rustle, welcome chime සහ මෘදු music-box melody එක සාදයි. වෙනම MP3 file එකක් අවශ්‍ය නැත. Guest click එකකින් පසුව පමණක් audio ආරම්භ වේ. Mute, replay හෝ page එකෙන් පිටවීමේදී කලින් schedule කළ sounds නවතී.

ඔබගේ music URL එකක් තිබේ නම් built-in melody වෙනුවට එම song එක වාදනය වේ. Heritage Door එකේ `HeirloomSound` class එක වෙනස් කර නැත.

## Dashboard එකෙන් වෙනස් කිරීම

1. **Floral Envelope** template එක තෝරා invitation එකක් අරඹන්න.
2. Couple names, parents, date, time, venue සහ events පුරවන්න.
3. **Message & Schedule** පියවරේ **Floral Envelope · The Grand Heirloom** controls භාවිත කර language, font, theme සහ colours තෝරන්න.
4. English invitation message එක සාමාන්‍ය message field එකේ ලියන්න. Sinhala invitation message සඳහා වෙනම field එකක් ඇත.
5. අවශ්‍ය නම් English/Sinhala love story, dress notes සහ timeline moments එක් කරන්න. Story සහ timeline දෙකම හිස් නම් story section එක නොපෙන්වයි.
6. Music URL එක හිස් නම් built-in melody එක භාවිත වේ. ඔබේ song එකට `https://.../song.mp3` හෝ `/audio/song.mp3` වැනි local path එකක් දෙන්න. Local audio file එක `public/audio/` තුළ තබන්න.
7. **Photos** පියවරේ cover photo සහ gallery photos upload කරන්න. Cover photo එක hero arch එකේ පෙන්වයි. Gallery photos decorative frames තුළ පෙන්වයි. Photos නැති විට ZIP එකේ original illustrations පෙන්වයි.
8. **Save** හෝ **Next** ඔබන්න.

මේ settings `extraDetails.floralEnvelope` යටතේ save වේ. Heritage Door settings තිබෙන්නේ වෙනම `extraDetails.heirloom` යටතේය. පවතින template එක save කරන විට අලුත් design එකේ default settings එයට එකතු නොකරයි.

Guest-facing labels Sinhala/English ලෙස මාරු කළ හැක. Couple names, event names, venue text සහ parents text ස්වයංක්‍රීයව translate නොවේ; අවශ්‍ය භාෂාවෙන් හෝ භාෂා දෙකෙන්ම ඒවා පුරවන්න. Demo palette button එකේ වෙනස්කම් browser preview එකට පමණි; ස්ථිරව save කිරීමට dashboard එක භාවිත කරන්න.

## Backend සහ database

යාබද backend project එක `../backend-main/backend-main` තුළ ඇත. අලුත් `src/modules/invitations/floral-envelope.validation.ts` file එක new settings validate කරයි. පවතින validation object එකට `floralEnvelope` නම් optional field එක පමණක් එක් කර ඇත. Heritage Door validation rules වෙනස් කර නැත.

අලුත් template එක ලියාපදිංචි කිරීමට `docs/floral-envelope-template.sql` wedding application database එකේ run/import කරන්න. Backend copy එක `database/migrations/20261029_floral_envelope.sql` යටතේ ඇත. මේ SQL එක **INSERT පමණක්** කරයි. පවතින Heritage Door row එක, template IDs, prices සහ customer invitations වෙනස් නොකරයි. Template එක කලින් register කර ඇත්නම් නැවත duplicate row එකක් එක් නොවේ.

Remote database එකට මේ වෙනස්කම අතරතුර SQL run කර නැත. සැබෑ new drafts සෑදීමට template registration එක සහ backend restart/deploy කිරීම අවශ්‍යයි. Demo preview එක database එකක් නොමැතිව ක්‍රියාත්මක වේ.

## RSVP සහ tests

RSVP එකේ guest name, attending/declining සහ guest count පවතින Wedora API එකට යවයි. ZIP එකේ WhatsApp redirect එක වෙනුවට guest dashboard එක සමඟ සම්බන්ධ කර ඇත. Demo replies browser session එකේ පමණක් පෙන්වයි. Couple preview එකේ RSVP අක්‍රියයි. API error එකක් ලැබුණොත් success ලෙස නොපෙන්වා නැවත උත්සාහ කිරීමට ඉඩ දෙයි.

Backend validation tests 33 සමත් විය. `.verification/floral-envelope-check.cjs` මගින් new template, original artwork loading, nine themes, animation, sound, mute/replay, 320px/390px mobile, desktop, settings save/restore සහ RSVP success/error/retry පරීක්ෂා කර ඇත. `.verification/heritage-door-check.cjs` මගින් පවතින Heritage Door එකේ හැසිරීමද නැවත පරීක්ෂා කර ඇත. Browser tests mocked API සහ වෙනම browser profiles භාවිත කරයි; remote customer data වෙනස් නොකරයි.
