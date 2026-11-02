-- Run against the wedding application's existing database.
-- Uses the unique template code; never overwrites IDs, prices or invitations.
INSERT INTO templates (code, name, description, category, demo_slug, sort_order)
SELECT 'tpl_grand_heirloom', 'The Grand Heirloom',
       'Heritage Door invitation with carved double doors, illustrated wedding scenes, six colour themes, Sinhala and English wording, sound, photos and RSVP.',
       'premium', 'demo-grand-heirloom', 7
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tpl_grand_heirloom');

-- Refresh the description of an already-registered Heirloom design.
UPDATE templates
SET name = 'The Grand Heirloom',
    description = 'Heritage Door invitation with carved double doors, illustrated wedding scenes, six colour themes, Sinhala and English wording, sound, photos and RSVP.',
    category = 'premium', demo_slug = 'demo-grand-heirloom'
WHERE code = 'tpl_grand_heirloom';
