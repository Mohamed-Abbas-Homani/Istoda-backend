import { MigrationInterface, QueryRunner } from 'typeorm';

export class Stories1755654352202 implements MigrationInterface {
  name = 'Stories1755654352202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "cover_photo" character varying, "content" text NOT NULL, "category" character varying NOT NULL, "publishing_date" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_bb6f880b260ed96c452b32a39f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "stories" ADD CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stories" DROP CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea"`,
    );
    await queryRunner.query(`DROP TABLE "stories"`);
  }
}
