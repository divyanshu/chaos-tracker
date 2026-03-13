-- Migration: Add tags column and update categories to workflow model
-- Run this in the Supabase SQL editor

-- 1. Add tags column (text array, default empty)
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- 2. Migrate old topic-based categories → tags
--    Old categories: Work, Personal, Chores, Connection, Hobby, Rejuvenate
--    These become tags; new workflow categories are: Urgent, Up Next, Admin, Flow
UPDATE tasks SET tags = ARRAY[category]
WHERE category IN ('Work', 'Personal', 'Chores', 'Connection', 'Hobby', 'Rejuvenate');

-- 3. Reassign old categories to workflow categories
--    Default everything to 'Up Next'; adjust as needed
UPDATE tasks SET category = 'Up Next'
WHERE category IN ('Work', 'Personal', 'Connection', 'Hobby', 'Rejuvenate');

UPDATE tasks SET category = 'Admin'
WHERE category = 'Chores';

-- 4. Tasks that were in a non-standard category fall back to 'Up Next'
UPDATE tasks SET category = 'Up Next'
WHERE category NOT IN ('Urgent', 'Up Next', 'Admin', 'Flow', 'Completed');
