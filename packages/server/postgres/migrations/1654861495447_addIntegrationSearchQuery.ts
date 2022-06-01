import {Client} from 'pg'
import getPgConfig from '../getPgConfig'

export async function up() {
  const client = new Client(getPgConfig())
  await client.connect()
  await client.query(`
    CREATE TABLE IF NOT EXISTS "IntegrationSearchQuery" (
      "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      "userId" VARCHAR(100) NOT NULL,
      "teamId" VARCHAR(100) NOT NULL,
      "providerId" INT,
      "service" "IntegrationProviderServiceEnum" NOT NULL,
      "query" JSONB NOT NULL DEFAULT '{}',
      "lastUsedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      CONSTRAINT "fk_integrationProvider"
        FOREIGN KEY("providerId")
          REFERENCES "IntegrationProvider"("id")
          ON DELETE CASCADE,
      CONSTRAINT "fk_userId"
      FOREIGN KEY("userId")
        REFERENCES "User"("id")
        ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX integration_search_query_unique_not_null 
    ON "IntegrationSearchQuery" ("userId", "teamId", "service", "query", "providerId")
    WHERE "providerId" IS NOT NULL;
    
    CREATE UNIQUE INDEX integration_search_query_unique_null 
    ON "IntegrationSearchQuery" ("userId", "teamId", "service", "query")
    WHERE "providerId" IS NULL;
    
    DROP TRIGGER IF EXISTS "update_IntegrationSearchQuery_updatedAt" ON "IntegrationSearchQuery";
    CREATE TRIGGER "update_IntegrationSearchQuery_updatedAt" BEFORE UPDATE ON "IntegrationSearchQuery" FOR EACH ROW EXECUTE PROCEDURE "set_updatedAt"();
  `)
  await client.end()
}

export async function down() {
  const client = new Client(getPgConfig())
  await client.connect()
  await client.query(`
    DROP TRIGGER IF EXISTS "update_IntegrationSearchQuery_updatedAt" ON "IntegrationSearchQuery";
    DROP TABLE IF EXISTS "IntegrationSearchQuery";
  `)
  await client.end()
}
