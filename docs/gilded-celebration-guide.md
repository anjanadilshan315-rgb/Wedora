# The Gilded Celebration

`Forever_Gilded_Celebration_HTML_CSS_JS.zip` එකේ design එක **Next.js / React / TypeScript** භාවිත කර project එකට එකතු කර ඇත.

Preview: `http://localhost:3000/invite/demo-gilded-celebration`

## ඇතුළත් පහසුකම්

- Original burgundy, gold සහ ivory පෙනුම, envelope opening fade සහ hover effects.
- Cormorant Garamond, Great Vibes සහ DM Sans fonts.
- Demo එකේ පහළ දකුණු පැත්තේ **Colours & Fonts** button එකෙන් live colour/font selections.
- Love story, couple photo, gallery, countdown සහ event cards.
- එක් එක් event එකට වෙනම date, venue සහ Google Maps link.
- RSVP name/email, attending/declining, guest count සහ optional note.
- Guest greeting, copy link, WhatsApp reminder සහ public invitation QR.
- Optional music URL සහ music on/off. ZIP එකේ MP3 file එකක් නොතිබූ නිසා URL එක හිස් නම් මෘදු built-in melody එකක් භාවිත වේ.

Original colours default එක ලෙස පවතී. Forest, Navy සහ Plum palettes අමතර තේරීම් ලෙස ඇත. Colours පහම වෙනම තෝරාගත හැක. Classic, Script සහ Modern font styles තිබේ.

## Customer කෙනෙක් save කරන ආකාරය

1. Templates පිටුවේ **The Gilded Celebration** තෝරා invitation එක අරඹන්න.
2. Couple names, wedding date/time, venue සහ schedule පුරවන්න.
3. **Message & Schedule → The Gilded Celebration design** යටතේ colours/fonts, story සහ quote වෙනස් කරන්න.
4. Event dates සහ Google Maps links අවශ්‍ය නම් එක් කරන්න. Date එක හිස් නම් wedding date එක භාවිත වේ.
5. Music සඳහා HTTPS URL එකක් හෝ `/audio/wedding.mp3` වැනි local path එකක් භාවිත කරන්න. Local file එක `public/audio` තුළ තබන්න.
6. **Save** කර Photos පියවරේ ඔබගේ photos upload කරන්න.
7. Customer preview එකෙන් save කළ පෙනුම බලන්න.

Demo colour selections browser එකේ පමණක් මතක තබා ගනී. Customerගේ invitation එකේ පෙනුම ස්ථිරව වෙනස් කිරීමට dashboard එකේ Save කළ යුතුය. Demo guest links තෝරාගත් colours/fonts සමඟ preview එක පෙන්වයි.

## Code files

| File | කාර්යය |
| --- | --- |
| `src/components/invitation/templates/GildedCelebrationTemplate.tsx` | React invitation, opening, music, RSVP සහ sharing |
| `src/components/invitation/templates/gilded-celebration.css` | Original CSS; `.gildedInvitation` යටතේ scope කර ඇත |
| `src/components/invitation/gilded.ts` | Settings, default values, palettes සහ fonts |
| `src/components/invitation/GildedEditor.tsx` | Demo/dashboard colour, font, story සහ event controls |
| `src/components/invitation/registry.ts` | `tpl_gilded_celebration` code එක component එකට සම්බන්ධ කරයි |
| `src/components/invitation/packages.ts` | The Gilded Celebration package එකට template එක සම්බන්ධ කරයි |
| `src/components/invitation/sample-data.ts` | Amelia / Noah sample details |
| `public/assets/gilded/` | ZIP එකේ gallery photos සඳහා local copies |
| `docs/reference/forever-gilded/` | Uploaded ZIP එකේ original source reference |

Names, dates සහ venue text JSX මගින් render කරයි. Customer text HTML ලෙස execute කරන්නේ නැත. Original standalone JavaScript එක project එකේ run කරන්නේ නැත.

## Backend සහ database

Template එක configured database එකේ **ID 7 / `tpl_gilded_celebration`** ලෙස register කර ඇත. Existing template rows කිසිවක් වෙනස් කර නැත.

යාබද `../backend-main/backend-main` project එකේ `gilded.validation.ts` සහ optional `extraDetails.gilded` validation එක් කර ඇත. RSVP email එක existing `guests.email` column එකේ save වේ. Email නොයවන පවතින templates එලෙසම ක්‍රියා කරයි. Optional note එක project එකේ existing wishes endpoint එකෙන් save වේ; RSVP retry කිරීමේදී එකම note එක දෙවරක් නොයවයි.

Customer settings සහ live RSVP භාවිත කිරීමට updated backend එක start/restart හෝ deploy කළ යුතුය. වෙනත් database එකකට deploy කරන විට `docs/gilded-celebration-template.sql` එක run/import කරන්න. එය අලුත් row එක INSERT පමණක් කරයි; existing templates update/delete නොකරයි.

Demo RSVP එක server එකට නොයවයි. Customer draft preview එකේ RSVP disabled වේ. RSVP deadline එක ඉක්ම ගිය පසු form එකෙන් පිළිතුරු නොයවයි.

QR එක ZIP එකේම භාවිත වූ public QR service එකෙන් ලබාගනී. එයට යවන්නේ invitation එකේ public route එක පමණි; guest name, email හෝ private invite code නොයවයි. QR service එක ලබාගත නොහැකි නම් invitation link එක පෙන්වයි. WhatsApp reminder එක button එක ඔබන විට share කිරීමට පමණක් විවෘත වේ.

## පරීක්ෂණ

Frontend/backend TypeScript checks සහ backend tests 60 සමත්ය. Browser test එක original opening, mobile/desktop layout, gallery photos, events, music, colours/fonts, settings save/reload, links, RSVP email/note සහ error/retry පරීක්ෂා කරයි.

```sh
node .verification/gilded-celebration-check.cjs
```

මෙය Windows Edge සහ port 3000 හි development server එක භාවිත කරයි. Tests mocked API සහ වෙනම browser profile භාවිත කරන නිසා සැබෑ customer RSVP records වෙනස් නොකරයි.

The Golden Keepsake සහ The Grand Heirloom packages වල templates එලෙසම පවතී.
