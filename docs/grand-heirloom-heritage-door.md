# The Grand Heirloom — Heritage Door code guide

`wedding-invitation-2.zip` හි **Heritage Door** invitation එක project එකේ React, TypeScript, JavaScript සහ CSS භාවිතයෙන් නැවත සම්බන්ධ කර ඇත. මෙය **Premium · Bespoke → The Grand Heirloom** package එකේ design එකයි.

## Preview එක බලමු

Frontend folder එකේ terminal එකෙන්:

```sh
npm run dev
```

`http://localhost:3000/invite/demo-grand-heirloom` විවෘත කරන්න. Guest name එකක් පෙන්වීමට `?guest=Your%20Name` එක් කරන්න. **Open invitation** එබූ විට door animation එක සහ sound ඇරඹේ. Sound button එකෙන් mute/unmute කළ හැක.

## ZIP එකෙන් ගත් දේ

ZIP එකේ `img` සහ `audio` folders හි photo/audio files නැත. එහි heritage doorway, courtyard, Poruwa, house, ceremony, night scene සහ couple gallery illustrations සියල්ල SVG code මගින් සාදයි. ඒ **මුල් artwork functions එලෙසම** තබා, DOM manipulation වෙනුවට React component එකට සම්බන්ධ කර ඇත. වෙනස් illustrations හෝ random stock photos යොදා demo design එක ප්‍රතිස්ථාපනය කර නැත.

මුල් colour themes හය: Heritage Gold, Rose Garden, Emerald Dusk, Royal Navy, Sunset Coral සහ Ivory Sage. Elegant, Calligraphy සහ Classic font styles ද ඇත. Existing invitation code එක `tpl_grand_heirloom` සහ preview URL එක එලෙසම පවතී. අනෙක් packages වල designs වෙනස් කර නැත.

## ප්‍රධාන files

| File | සරල පැහැදිලි කිරීම |
| --- | --- |
| `src/components/invitation/templates/HeritageDoorTemplate.tsx` | Page sections, door state, scene switching, RSVP සහ calendar |
| `src/components/invitation/templates/heritage-door.module.css` | Original design එකේ layout, colours, 3D doors, transitions සහ fireflies |
| `src/components/invitation/templates/heritage-art.js` | ZIP එකේ මුල් SVG drawing functions; beginner-friendly formatting එක් කර ඇත |
| `src/components/invitation/heirloom.ts` | Settings type, default settings, themes හය, Sinhala/English text |
| `src/components/invitation/heirloom-sound.ts` | Door latch, wooden creak, footsteps, welcome chimes සහ background melody |
| `src/components/invitation/HeirloomEditor.tsx` | Dashboard එකෙන් colours, photos, wording සහ music වෙනස් කිරීම |
| `src/components/invitation/sample-data.ts` | ZIP එකේ Anuki & Sahan demo details |
| `src/components/invitation/registry.ts` | Template code එක React component එකට සම්බන්ධ කිරීම |
| `src/components/invitation/packages.ts` | Premium package description සහ features |

## Code එක වැඩ කරන ආකාරය

### 1. State කියන්නේ වෙනස් වන value එකක්

```tsx
const [opened, setOpened] = useState(false);
const [scene, setScene] = useState<HeirloomScene>("courtyard");
```

`opened` මගින් guest දොරටුව පසුකර invitation එකට ඇතුළු වී තිබේද යන්න මතක තබයි. `scene` තුළ මේ මොහොතේ පෙන්වන background එකේ නම තිබේ. `setScene("night")` කළ විට night illustration එකට මාරු වේ.

### 2. Door animation එක

Guest button එක එබූ විට `openDoors()` function එක ක්‍රියාත්මක වේ. CSS මගින් left/right doors දෙපසට හැරේ. තත්පර 1.5කදී facade එක zoom වීමට පටන් ගනී. තත්පර 3.3කදී Poruwa scene එකට මාරු වේ. තත්පර 5කදී invitation content එක විවෘත වෙයි. Reduced-motion setting එක සක්‍රිය නම් දිගු animation වෙනුවට කෙටි opening එකක් භාවිත වේ.

### 3. Scroll කරන විට scene එක මාරු කිරීම

```tsx
<section data-scene="house">...</section>
<section data-scene="night">...</section>
```

Screen එකේ මැද තිබෙන section එකේ `data-scene` value එක අනුව background එක මාරු වේ. CSS `opacity` transition එකෙන් scene එක මෘදුව crossfade වේ. Gallery එකේ `data-dim="true"` මගින් background එක blur කර photos පැහැදිලිව පෙන්වයි.

### 4. Artwork සහ colours

`heritage-art.js` හි `sDoor()`, `sCourtyard()`, `sMandapa()`, `sHouse()`, `sNight()` සහ `cartoon()` functions SVG strings සාදයි. Export කරන `heritageArtwork()` function එක ඒවා image URLs බවට පත් කරයි. React එක ඒ URLs සාමාන්‍ය `<img>` elements තුළ පෙන්වයි. ZIP එකේ scripts page එකක් ලෙස embed කර නැත.

පැරණි saved settings සමඟ ගැළපීමට colour field names කිහිපයක් එලෙසම තබා ඇත:

| Saved field | Heritage Door එකේ භාවිතය |
| --- | --- |
| `background` | Day sky |
| `main` | Night sky |
| `bloom` | Flowers |
| `envelope` | Door wood |
| `accent` | Gold / accent |

Font keys `classic`, `romantic`, `modern` ලෙස save වේ; මේ design එකේ ඒවා පිළිවෙළින් Elegant, Calligraphy සහ Classic ලෙස පෙන්වයි.

### 5. Sound

Sound browser එකේ **Web Audio API** මගින් සාදන නිසා default sounds සඳහා MP3 files අවශ්‍ය නැත. Guest click එකට පසුව පමණක් audio ආරම්භ වේ. Door latch, wooden creak, footsteps සහ arrival chime opening timing එකට ගැළපේ. ඉන්පසු ZIP එකට ගැළපෙන soft melody එක වාදනය වේ.

ඔබගේ music URL එකක් තිබේ නම් built-in melody වෙනුවට එය වාදනය වේ. Mute, replay හෝ page එකෙන් පිටවීමේදී schedule කළ සියලු sounds සහ timers නවතී.

## Dashboard එකෙන් photos සහ wording වෙනස් කිරීම

1. **The Grand Heirloom** template එක තෝරා couple names, parents, date, venue සහ events පුරවන්න.
2. **Message & Schedule** පියවරේ language, theme, font සහ custom colours තෝරන්න.
3. **Scene photos** යටතේ optional `door`, `courtyard`, `poruwa`, `house`, `ceremony`, `night` photo URLs එක් කරන්න. HTTPS URL හෝ `/images/courtyard.jpg` වැනි local path එකක් භාවිත කරන්න. Local photos `public/images/` තුළ තබන්න. හිස් scene fields සඳහා original illustration එක පෙන්වයි.
4. සාමාන්‍ය **Photos** පියවරේ cover photo upload කළ විට එය Poruwa hero background එකට යොදාගනී. වෙනම Poruwa scene URL එකක් දී ඇත්නම් එයට ප්‍රමුඛත්වය ලැබේ. Gallery photos upload කළ විට original couple illustrations වෙනුවට ඒ photos arched frames තුළ පෙන්වයි.
5. English invitation wording එක සාමාන්‍ය message field එකේ ලියන්න. Sinhala wording, optional story, timeline සහ dress note සඳහා වෙනම fields ඇත.
6. Optional music URL එකක් දෙන්න; නැති නම් built-in sound භාවිත වේ. **Save** හෝ **Next** ඔබන්න.

Settings `extraDetails.heirloom` යටතේ save වේ. Event names, venue names සහ parents text ස්වයංක්‍රීයව translate නොවේ; අවශ්‍ය භාෂාවෙන් හෝ භාෂා දෙකෙන්ම ඒවා පුරවන්න. Guest interface labels සඳහා Sinhala සහ English දෙකම ඇත.

Demo palette button එකෙන් කරන වෙනස්කම් preview එකට පමණි. ස්ථිර settings save කිරීමට dashboard එක භාවිත කරන්න.

## Backend සහ database setup

Backend source එක `../backend-main/backend-main` තුළ ඇත. `src/modules/invitations/invitation-design.validation.ts` දැන් themes හය, flower colour සහ නම් කළ scene photo URLs පිළිගනී. අහිතකර URL schemes සහ unknown scene names ප්‍රතික්ෂේප කරයි. Backend restart/deploy කිරීමෙන් මේ validation ක්‍රියාත්මක වේ.

Template එක database එකට තවම register කර නැත්නම් wedding application database එක තෝරා `docs/grand-heirloom-backend/grand-heirloom.sql` import කරන්න. Backend copy එක `database/migrations/20261029_heritage_door.sql` යටතේ ඇත. එය template row එකක් නැත්නම් එක් කරයි; තිබේ නම් design description එක යාවත්කාලීන කරයි. Template IDs, pricing සහ customer invitations වෙනස් නොකරයි.

Remote database එකට මේ වැඩයේදී SQL run කර නැත. Preview එක database එකක් නැතිව ක්‍රියාත්මක වන අතර සැබෑ drafts සෑදීමට template registration එක අවශ්‍ය වේ.

## RSVP සහ verification

RSVP එක පවතින Wedora API එකට සම්බන්ධයි. Demo replies browser session එකේ පමණි. Couple draft preview එකේ RSVP අක්‍රියයි. Live reply save වීම අසාර්ථක නම් success එකක් පෙන්වන්නේ නැත; නැවත උත්සාහ කළ හැක. නොපැමිණෙන guest කෙනෙකුගේ count එක `0` වේ. ZIP එකේ WhatsApp redirect එක වෙනුවට මෙය පවතින guest dashboard එක සමඟ සම්බන්ධ කර ඇත.

Browser QA script එක `.verification/heritage-door-check.cjs` තුළ ඇත. Desktop, 390px සහ 320px mobile layout, original illustrations, door animation, scene transitions, themes, fonts, sound, mute/replay, settings save/restore සහ RSVP success/error/retry mocked API සමඟ පරීක්ෂා කර ඇත. Screenshots `.verification/heritage-door-*.png` තුළ ඇත. සැබෑ remote API/database write එකක් මේ tests වලින් කර නැත.
