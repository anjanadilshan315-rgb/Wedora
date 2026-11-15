# Editing the Liora home page

The home page uses ivory, antique gold and the existing brand fonts. Its styles apply only to Home.

## Files

- `src/app/page.tsx`: page sections, copy, image paths and links.
- `src/components/HomeBanner.tsx`: the restored original full-width banner and slideshow.
- `src/components/Footer.tsx`: the original shared footer.
- `src/app/home.module.css`: buttons, feature strip, steps, story, FAQ and page layout.
- `src/app/premium-cards.module.css`: the existing transparent gold invitation cards.
- `src/components/InvitationTemplateCard.tsx`: the shared glass card used on Home and Templates.
- `src/lib/invitation-showcase.ts`: the Standard/Premium card images and destinations.

## Simple changes

1. Edit `heroSlides` in `HomeBanner.tsx` to change the banner photographs and text.
2. Edit `features`, `steps` or `questions` to change the corresponding sections.
3. Edit the artwork entries in `src/lib/invitation-showcase.ts` to change a template's image or preview destination. Names and descriptions come from the existing Standard and Premium plan catalogs.
4. Change the colour variables at the top of `home.module.css` to adjust the home page palette.

The FAQ uses native HTML `details` and `summary`, so it works with a keyboard and without additional JavaScript. The original banner uses its previous slide arrows, dot indicators and automatic playback. Smaller screen layouts are defined in the CSS media queries and responsive utility classes.

Run `npm run dev` to preview at `http://localhost:3000`. Run `npm run build` to check the production build.
