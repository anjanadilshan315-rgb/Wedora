-- Add the NEW invitation alongside Heritage Door. Existing templates stay intact.
INSERT INTO templates (code, name, description, category, demo_slug, sort_order)
SELECT 'tpl_heirloom_envelope', 'Floral Envelope',
       'Floral wax-seal envelope with nine colour themes, Sinhala and English wording, animated opening, illustrations, photos and sound effects.',
       'premium', 'demo-heirloom-envelope', 8
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tpl_heirloom_envelope');
