import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE "User"
      DROP CONSTRAINT "User_email_key";
  `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // noop
}
