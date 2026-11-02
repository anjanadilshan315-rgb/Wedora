-- Adds the new design alongside the two existing Grand Heirloom invitations.
-- Safe to run again: no existing IDs, prices or invitations are changed.
INSERT INTO templates (code, name, description, category, demo_slug, sort_order)
SELECT 'tpl_sunset_journey', 'Sunset Journey',
       'Vintage car sunset intro, bouquet toss, falling petals, original illustrations, six colour themes, three fonts, built-in melody, photos and RSVP.',
       'premium', 'demo-sunset-journey', 9
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tpl_sunset_journey');
