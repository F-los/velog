-- Create projects table manually (since we're mixing TypeORM and Prisma)

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR UNIQUE NOT NULL,
  title VARCHAR NOT NULL,
  summary VARCHAR NOT NULL,
  description TEXT,
  "techStack" TEXT[] NOT NULL DEFAULT '{}',
  "coverUrl" VARCHAR,
  "repoUrl" VARCHAR,
  "liveUrl" VARCHAR,
  highlight BOOLEAN NOT NULL DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "projects_highlight_order_idx" ON projects(highlight, "order");
