-- Link Category C materials to C1 by duplicating the content
-- This makes C materials accessible to C1 students (as requested: "c1 should include material of c")
-- We create copies of C materials but assign them to category 'C1' with new unique chapter_ids

INSERT INTO "study_materials" (
  "category", 
  "title_sq", 
  "title_en", 
  "description_sq", 
  "description_en", 
  "content_sq", 
  "content_en", 
  "order_index", 
  "is_published", 
  "chapter_id"
)
SELECT 
  'C1', -- Target Category
  title_sq, 
  title_en, 
  description_sq, 
  description_en, 
  content_sq, 
  content_en, 
  order_index + 100, -- Offset order to avoid collision with native C1 materials
  is_published, 
  chapter_id + 100 -- Offset ID to generate unique chapter_id (e.g., 20 -> 120)
FROM "study_materials"
WHERE category = 'C'
ON CONFLICT (chapter_id) DO UPDATE SET
  category = EXCLUDED.category,
  title_sq = EXCLUDED.title_sq,
  content_sq = EXCLUDED.content_sq;

-- Link Category C1 materials to C by duplicating the content
-- This makes C1 materials accessible to C students (as requested: "category c should include material of the c1")
-- We create copies of C1 materials but assign them to category 'C' with new unique chapter_ids

INSERT INTO "study_materials" (
  "category", 
  "title_sq", 
  "title_en", 
  "description_sq", 
  "description_en", 
  "content_sq", 
  "content_en", 
  "order_index", 
  "is_published", 
  "chapter_id"
)
SELECT 
  'C', -- Target Category
  title_sq, 
  title_en, 
  description_sq, 
  description_en, 
  content_sq, 
  content_en, 
  order_index + 200, -- Offset order
  is_published, 
  chapter_id + 200 -- Offset ID (e.g., 30 -> 230)
FROM "study_materials"
WHERE category = 'C1'
ON CONFLICT (chapter_id) DO UPDATE SET
  category = EXCLUDED.category,
  title_sq = EXCLUDED.title_sq,
  content_sq = EXCLUDED.content_sq;
