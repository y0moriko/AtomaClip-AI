-- Create match_insights function for semantic search with workspace and project filtering
-- Run this SQL in your Supabase SQL Editor

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing function if exists (both old 3-arg and new 5-arg versions)
DROP FUNCTION IF EXISTS match_insights(vector, float, int);
DROP FUNCTION IF EXISTS match_insights(vector, float, int, text, text);

-- Create the upgraded match_insights function
CREATE OR REPLACE FUNCTION match_insights(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  workspace_id text,
  project_id text DEFAULT NULL
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
  "workspaceId" text,
  "projectId" text,
  "isFavorite" boolean,
  "createdAt" timestamp(3) without time zone,
  "updatedAt" timestamp(3) without time zone,
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
    i."workspaceId",
    i."projectId",
    i."isFavorite",
    i."createdAt",
    i."updatedAt",
    1 - (i.embedding <=> query_embedding) AS similarity
  FROM insights i
  WHERE i.embedding IS NOT NULL
    AND i."workspaceId" = workspace_id
    AND (project_id IS NULL OR i."projectId" = project_id)
    AND 1 - (i.embedding <=> query_embedding) > match_threshold
  ORDER BY i.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
