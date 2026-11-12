# Walawwa realistic gate

Generated with the built-in `image_gen` tool, then saved locally as `public/assets/walawwa/teak-gate.webp` (WebP quality 90). This is generated artwork with a photographic appearance, not a photograph of an actual customer's entrance.

The same image is displayed twice in `WalawwaWelcome.tsx`. Each door leaf clips one half, using an image width of 200%; the right image is offset by -100%. Their outside hinge origins and the existing opening animation remain independent. CSS adds fluted limestone columns with moulded capitals and rounded tiered bases, frame shadows and a personalised brass monogram. The column shaft is a separate decorative element; its grooves and stone joints are CSS gradients, so it scales cleanly on mobile. Handles and carved wood grain are part of the image. Both decorative image elements have empty alt text inside an aria-hidden doorway; the labelled open button remains accessible.

## Final generation prompt

Use case: photorealistic-natural. Asset: a realistic double wooden entrance gate texture for a Sri Lankan Walawwa wedding invitation. Straight-on orthographic architectural photograph, no perspective convergence. Two closed tall rectangular teak hardwood gate leaves of equal width, meeting at the exact vertical center. Rich dark walnut and warm honey-brown wood grain, authentic deep sculpted raised panels, subtle Sri Lankan floral wood carving in upper panels, physically realistic beveled edges and shadows, aged wood pores and satin varnish. Refined antique brass hinges along outer edges. Each leaf has a small antique brass ring handle near the center seam at 55% height. Elegant heritage estate craftsmanship, naturally aged and premium, soft warm side lighting. CRITICAL: the image canvas is completely filled edge-to-edge by only the two door leaves, no door frame, no stone wall, no border, no surrounding scenery, no floor, no sky, no flowers, no text, no monograms, no people. Exact center split will be used to animate the leaves separately. Portrait 4:5 composition, high resolution photographic realism, symmetrical geometry, no illustration, no cartoon, no flat vector patterns.

## Edit points

- Texture: `public/assets/walawwa/teak-gate.webp`
- Markup: `src/components/premium/walawwa/WalawwaWelcome.tsx`
- Door leaves, pillars and opening motion: `src/components/premium/walawwa/Walawwa.module.css`

Use a single straight-on image with its seam exactly at the centre when replacing the texture. Keep the same image on both leaves. Device reduced motion and the studio motion switch continue to suppress decorative movement.
