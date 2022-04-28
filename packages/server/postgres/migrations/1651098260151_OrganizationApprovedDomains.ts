import {Client} from 'pg'
import getPgConfig from '../getPgConfig'

export async function up() {
  const client = new Client(getPgConfig())
  await client.connect()
  await client.query(`
        CREATE TABLE IF NOT EXISTS "OrganizationApprovedDomain" (
        "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "removedAt" TIMESTAMP WITH TIME ZONE,
        "domain" VARCHAR(255) CHECK (lower(domain) = domain),
        "orgId" VARCHAR(100) NOT NULL,
        "addedByUserId" VARCHAR(100) NOT NULL,
        UNIQUE("orgId", "domain", "removedAt"),
        CONSTRAINT "fk_addedByUserId"
          FOREIGN KEY("addedByUserId")
            REFERENCES "User"("id")
            ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "idx_OrganizationApprovedDomain_orgId" ON "OrganizationApprovedDomain"("orgId");
  `)
  await client.end()
}

export async function down() {
  const client = new Client(getPgConfig())
  await client.connect()
  await client.query(`
    DROP TABLE IF EXISTS "OrganizationApprovedDomain" CASCADE;
  `)
  await client.end()
}
