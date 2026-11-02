-- Register the new Standard design without changing any existing invitations.
INSERT INTO templates (code, name, description, category, demo_slug, sort_order)
SELECT 'tpl_gilded_celebration', 'The Gilded Celebration',
       'Burgundy, gold and ivory invitation with an envelope opening, love story, gallery, event maps, countdown, RSVP and invitation sharing.',
       'standard', 'demo-gilded-celebration', 10
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tpl_gilded_celebration');
