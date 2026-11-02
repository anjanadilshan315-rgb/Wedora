# Sunset Journey — සරල code guide එක

`wedding-invitation-3.zip` හි design එක **Next.js + React + TypeScript** component එකක් ලෙස project එකට එකතු කර ඇත. ZIP එක iframe එකක run කරන්නේ නැත. Original SVG illustrations සහ CSS වෙනම files වල තබා ඇත.

## Preview එක බලන්න

Development server එක ක්‍රියාත්මක කර `/invite/demo-sunset-journey` විවෘත කරන්න.

```sh
npm run dev
```

**Open invitation** ඔබන විට vintage car intro, bouquet toss, petal shower, title reveal සහ built-in melody ආරම්භ වේ. **Skip** මගින් intro එක මඟහැරිය හැක. Music button එකෙන් sound නවත්වන්න/ආරම්භ කරන්න. **Colours & Fonts** button එක Templates link එකට පහළින් ඇත. එහි **Replay intro** ද ඇත.

ZIP එකේ `img` සහ `audio` folders හි media files නොතිබුණි. Photos නොදුන්නොත් එහි original illustrations පෙන්වයි. Music URL එක හිස් නම් ZIP එකේ melody එක Web Audio API එකෙන් සාදයි. වෙනම MP3 download එකක් අවශ්‍ය නැත.

## Package එකේ invitations තුන

| Invitation | Template code | Preview route |
| --- | --- | --- |
| පවතින Heritage Door | `tpl_grand_heirloom` | `/invite/demo-grand-heirloom` |
| පවතින Floral Envelope | `tpl_heirloom_envelope` | `/invite/demo-heirloom-envelope` |
| අලුත් Sunset Journey | `tpl_sunset_journey` | `/invite/demo-sunset-journey` |

පවතින invitations දෙකේ components, styles සහ settings වෙනස් කර නැත. අලුත් code එකේ CSS rules `.sunsetInvitation` යටතේ පමණක් ක්‍රියා කරයි. Animation names ද `sunset-` prefix එක භාවිත කරයි.

## කුමන file එක කුමක් කරන්නේද?

| File | කාර්යය |
| --- | --- |
| `src/components/invitation/templates/SunsetJourneyTemplate.tsx` | React invitation, intro timing, sections, photos, RSVP සහ calendar |
| `src/components/invitation/templates/sunset-journey.css` | Original layout සහ animations; අලුත් invitation එකට පමණක් scope කර ඇත |
| `src/components/invitation/templates/sunset-art.js` | ZIP එකේ mandala, village, car, couple, gallery සහ map drawing functions |
| `src/components/invitation/templates/SunsetPetals.tsx` | Canvas petal burst, shower සහ floating petals |
| `src/components/invitation/sunset-sound.ts` | Original melody, optional song, mute සහ sound cleanup |
| `src/components/invitation/sunset.ts` | Settings type, default values, palettes, fonts සහ colour validation |
| `src/components/invitation/SunsetEditor.tsx` | Demo සහ dashboard සඳහා colour/font controls; dashboard story/media controls |
| `src/components/invitation/registry.ts` | Template code එක React component එකට සම්බන්ධ කරයි |
| `src/components/invitation/sample-data.ts` | ZIP එකේ Sanduni/Ravindu sample details |
| `src/components/invitation/packages.ts` | Grand Heirloom package එකට අලුත් design එක එකතු කරයි |

`sunset-art.js` හි SVG paths චිත්‍රයේ හැඩ පමණි. සාමාන්‍ය names, dates, colours හෝ wording වෙනස් කිරීමට එහි දිගු path values edit කිරීමට අවශ්‍ය නැත. Original HTML reference එක `docs/reference/wedding-invitation-3.html` හි ඇත.

## React code එක කියවීම

### 1. Settings යනු මොනවාද?

Settings object එක invitation එකේ පෙනුම තබා ගනී:

```ts
const example = {
  main: "#2f5a45",   // ප්‍රධාන colour එක
  gold: "#c4a468",   // gold details
  paper: "#f7f3ee",  // page background
  sky: "#f08a24",    // intro sunset sky
  font: "classic",   // classic / script / modern
};
```

Colour themes හය: Ivory & Forest, Blush & Rose Gold, Navy & Silver, Burgundy & Gold, Sage & Champagne, Royal Purple. Original fonts හතර වන Playfair Display, Cormorant Garamond, Great Vibes සහ Josefin Sans භාවිත කර Classic, Script, Modern styles තුන සාදයි. Fonts `next/font` මගින් load කරයි.

### 2. `useState` වෙනස්වන අගයක් මතක තබා ගනී

```tsx
const [stage, setStage] = useState<IntroStage>("cover");
```

ආරම්භයේ stage එක `cover`. Button එක ඔබන විට `setStage("film")` මගින් car intro පෙන්වයි. අවසානයේ stage එක `invitation` කර main content පෙන්වයි.

```text
cover → film → transition/petals → invitation
```

`openInvitation()`, `finishIntro()` සහ `replayIntro()` යන නම්වලින් ඒ ඒ කාර්යය පැහැදිලි කර ඇත. `useEffect` cleanup මගින් page එකෙන් පිටවන විට timers, animation frames, observers සහ audio නවත්වයි.

### 3. Colours CSS variables වලට යයි

```tsx
<div style={sunsetStyle(settings)} className="sunsetInvitation">
  {/* invitation content */}
</div>
```

`sunsetStyle()` මගින් `--main`, `--gold`, `--paper` වැනි CSS variables සාදයි. ඉතා ලා main colour එකක් හෝ ඉතා අඳුරු paper colour එකක් තෝරන විට original ZIP එක මෙන් readability සඳහා ඒවා සකස් වේ. Sky colour එක car scene සහ illustrated memories වලටත් යෙදේ.

### 4. Customer details එන්නේ API එකෙන්

`toViewData()` API invitation එක templates භාවිත කරන `data` object එකට හැරවයි. Saved design එක `invitation.extraDetails.sunset` තුළ ඇත. Names, venue, dates, gallery සහ events වෙනම පවතින project fields භාවිත කරයි.

```ts
extraDetails: {
  sunset: {
    main: "#2f5a45",
    gold: "#c4a468",
    paper: "#f7f3ee",
    sky: "#f08a24",
    font: "classic",
    // story, familiesLine, timeline, eventDates, musicUrl, filmVideoUrl
  }
}
```

## Customer කෙනෙක් design එක save කරන ආකාරය

1. Templates පිටුවේ **Sunset Journey** තෝරා invitation එකක් අරඹන්න.
2. Couple, parents, wedding date/time සහ venue ඇතුළත් කරන්න.
3. **Message & Schedule → Sunset Journey design** යටතේ colours සහ font තෝරන්න.
4. Story, family wording සහ timeline edit කරන්න. අවශ්‍ය නම් එක් එක් event එකට වෙනම date එකක් දෙන්න; හිස් නම් wedding date එක භාවිත වේ.
5. Optional music/video සඳහා `https://...` URL එකක් හෝ `/audio/song.mp3`, `/video/intro.mp4` වැනි local path එකක් දෙන්න. Local files `public` folder එකට දාන්න.
6. **Save** කරන්න. Photos පියවරේ couple photo සහ gallery upload කරන්න.
7. Preview එකෙන් save කළ colours, fonts, story සහ photos පරීක්ෂා කරන්න.

Demo colour selections browser එකේ පමණක් මතක තබා ගනී. **Copy guest link** මගින් තෝරාගත් colours/fonts අඩංගු `?v=1` sample link එකක් ලැබේ; එහි customizer නැත. Customerගේ සැබෑ invitation එකට changes යෙදීමට dashboard එකේ Save කළ යුතුය.

## RSVP සහ calendar

Original WhatsApp-only RSVP එක වෙනුවට project එකේ පවතින RSVP API එක භාවිත කරයි. Decline කළ විට guest count `0` යවයි. Error එකක් තිබුණොත් success message එකක් නොපෙන්වා retry කිරීමට ඉඩ දෙයි. Demo replies server එකට යවන්නේ නැත. Customer draft preview එකේ RSVP disabled වේ.

**Save the Date** button එක calendar `.ics` ගොනුවක් සාදයි. එක් එක් event එකේ date/time/venue සහ customerගේ names එයට ඇතුළත් වේ.

## Backend integration

යාබද `../backend-main/backend-main` project එකට පහත files එකතු කර ඇත:

- `src/modules/invitations/sunset-journey.validation.ts`
- `tests/sunset-journey.validation.test.ts`
- `database/migrations/20261030_sunset_journey.sql`

`invitation-design.validation.ts` තුළ `sunset` නම් optional settings object එක පමණක් එක් කර ඇත. පවතින designs වල validation rules වෙනස් කර නැත. `database/schema.sql` එකටත් අලුත් registration INSERT එක එක් කර ඇත.

මේ project එකේ configured database එකට Sunset Journey register කර ඇත (`tpl_sunset_journey`, ID `6`). පවතින Premium templates දෙකේ database rows වෙනස් වී නැති බව registration එකේදීම පරීක්ෂා කර ඇත. වෙනත් database එකකට deploy කරන විට **`docs/sunset-journey-template.sql` එක පමණක්** run/import කරන්න. මෙය නැවත run කළත් duplicate නොවේ; existing templates, IDs, prices හෝ invitations update/delete නොකරයි.

Frontend demo එක database එකක් නොමැතිවත් ක්‍රියා කරයි. Customerගේ settings save කිරීමට updated backend එක ක්‍රියාත්මක විය යුතුය. මේ වැඩ අවසානයේ localhost port 5000 හි API server එක ක්‍රියාත්මක නොවේ. ඔබ සාමාන්‍යයෙන් භාවිත කරන backend development/deployment ක්‍රමයෙන් එය start/restart කරන්න. Backend සහ frontend TypeScript checks සමත්ය; backend validation tests 45 සහ isolated browser checks ද සමත්ය.

## Verification

Frontend TypeScript check:

```sh
npx tsc --noEmit
```

Browser check (development server එක port 3000 හි ක්‍රියාත්මක විය යුතුය; Windows Edge භාවිත කරයි):

```sh
node .verification/sunset-journey-check.cjs
```

මෙම browser check එක වෙනම browser profile සහ mocked API භාවිත කරයි. Remote customer records වෙනස් නොකරයි. Package templates තුන, original artwork, intro/toss/petals, music/mute, skip/replay, themes/fonts, media validation, photos, settings save/reload, calendar, mobile/desktop, reduced motion සහ RSVP error/retry පරීක්ෂා කරයි. Screenshots `.verification/sunset-*.png` තුළ ඇත.
