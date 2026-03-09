-- Create match_insights function for semantic search
-- Run this SQL in your Supabase SQL Editor

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS match_insights(vector, float, int);

-- Create the match_insights function
CREATE OR REPLACE FUNCTION match_insights(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  content text,
  "contextBefore" text,
  "contextAfter" text,
  "userNote" text,
  "sourceUrl" text,
  "pageTitle" text,
  tags text[],
  "userId" text,
  "isFavorite" boolean,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.content,
    i."contextBefore",
    i."contextAfter",
    i."userNote",
    i."sourceUrl",
    i."pageTitle",
    i.tags,
    i."userId",
    i."isFavorite",
    i."createdAt",
    i."updatedAt",
    1 - (i.embedding <=> query_embedding) AS similarity
  FROM insights i
  WHERE i.embedding IS NOT NULL
    AND 1 - (i.embedding <=> query_embedding) > match_threshold
  ORDER BY i.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add index for faster vector search (run after you have some data)
-- CREATE INDEX IF NOT EXISTS insights_embedding_idx ON insights USING ivfflat (embedding vector_cosine_ops);
