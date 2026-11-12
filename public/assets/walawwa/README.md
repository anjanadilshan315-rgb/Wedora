# Walawwa illustrations

These seven standalone SVGs were adapted from the drawing functions in the user-provided `wedding-invitation (3).zip`. They are stored locally so the invitation does not depend on an external image service.

- `ceremony-day.svg`: floral ceremony / timber pavilion
- `courtyard-night.svg`: evening courtyard and fairy lights
- `flowers-left.svg`, `flowers-right.svg`: doorway flower arrangements
- `couple-1.svg`, `couple-2.svg`, `couple-3.svg`: wedding illustration cards

The invitation now uses six new wedding photographs, downloaded specifically for Walawwa. None duplicates an image in the other template folders. Sources and photographer credits:

| Asset | Photographer / source | Image ID |
| --- | --- | --- |
| `estate-embrace.jpg` | [Ben Atkins](https://unsplash.com/photos/B4qVLPOvZzc) | `photo-1775126964671-43b4c1a1c5ce` |
| `tropical-vows.jpg` | [Alexander Mass](https://unsplash.com/photos/q41svCOoudU) | `photo-1773688190194-09e288ec2bc3` |
| `garden-monochrome.jpg` | [Brooke Balentine](https://unsplash.com/photos/Qf2Yl2LHLJc) | `photo-1780291455505-5e42a4c6295d` |
| `heritage-garden.jpg` | [Ben Atkins](https://unsplash.com/photos/JYR7DNdUqo4) | `photo-1722805740177-04256b6517f2` |
| `white-blossoms.jpg` | [Brooke Balentine](https://unsplash.com/photos/s5fio5vZpw8) | `photo-1780291260540-f35a88be28e2` |
| `flower-field.jpg` | [mulugeta wolde](https://unsplash.com/photos/5RSMcIjaK0s) | `photo-1605967328818-d2ff9807d07b` |

Downloaded at up to 1400 px wide, JPEG quality 85, without baking a crop into the files. Each source page identifies the image as free under the [Unsplash License](https://unsplash.com/license). The first three fill the arch frames; the last three appear in the separate photo-journal gallery. The film uses all six. These are demonstration photos, not the named sample couple or customer endorsements. Published invitations use the customer's uploads.

The original couple SVGs and the superseded `seafront-couple.jpg`, `garden-couple.jpg` and `celebration-couple.jpg` are retained as reference assets and are not used by the current invitation.

Layout, dynamic lanterns and falling petals live in `src/components/premium/walawwa/`; shared customer photo uploads do not overwrite these files. See `docs/walawwa-invitation.md` for the full editing guide.

`teak-gate.webp` is a new realistic wood-gate texture created with the built-in image generation tool. It is shared by the two independently swinging door leaves. The final prompt and implementation notes are in [the gate artwork guide](../../../docs/walawwa-gate-artwork.md).

`rose-arrangement.webp` replaces the illustrated flower arrangements beside the gate. It is a photorealistic ivory/blush rose and greenery cutout with a bronze urn/pedestal, created using the built-in image generation tool. The right-hand instance is mirrored in CSS. Transparency is preserved. See [the flower artwork guide and final prompt](../../../docs/walawwa-flower-artwork.md).

The current backgrounds use the two images supplied by the user on November 12, 2026:

- `ceremony-floral-day.webp`: optimized from `Romantic Floral Wedding Invitation Arch.png`, the second attached image; used behind the opening gate and for daytime scenery.
- `garden-moonlight-night.webp`: optimized from `Moonlit Garden Wedding Archway.png`, the first attached image; used for night scenery after scrolling to the reception.
- `night-bulb-lights.svg`: the three original fairy-light strings and their 66 bulbs, extracted from `courtyard-night.svg` without changing their geometry. This transparent overlay fades in with the night image. The six CSS-animated hanging lanterns are also preserved.

The original background SVGs are retained as reference assets. The supplied images were converted to quality-92 WebP with their full composition and original dimensions retained; no image generation or content editing was applied.
