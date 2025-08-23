import { MigrationInterface, QueryRunner } from "typeorm";

export class StoryPageComment1755888397711 implements MigrationInterface {
    name = 'StoryPageComment1755888397711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stories" DROP CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "story_id" uuid, "page_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "page_number" integer NOT NULL, "content" text NOT NULL, "media_id" character varying, "meta" jsonb, "story_id" uuid, CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "color" character varying NOT NULL DEFAULT '#000000', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "story_category" ("story_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_07cb7395450b752f76b71d739b9" PRIMARY KEY ("story_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ba73bb12df2a8340c997e9865c" ON "story_category" ("story_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_289c6e4c604173627127a471a8" ON "story_category" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "readers_number" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "rate" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "author_id" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_fc9fbe054ad87248180aec2e9c9" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_dbb42f2f46a87b89ea8c27e1b5d" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pages" ADD CONSTRAINT "FK_0dea170e8a3bddfe55f26d82a1f" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stories" ADD CONSTRAINT "FK_1e6ca6b1e366a7575873f2d1c30" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "story_category" ADD CONSTRAINT "FK_ba73bb12df2a8340c997e9865c4" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "story_category" ADD CONSTRAINT "FK_289c6e4c604173627127a471a86" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story_category" DROP CONSTRAINT "FK_289c6e4c604173627127a471a86"`);
        await queryRunner.query(`ALTER TABLE "story_category" DROP CONSTRAINT "FK_ba73bb12df2a8340c997e9865c4"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP CONSTRAINT "FK_1e6ca6b1e366a7575873f2d1c30"`);
        await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "FK_0dea170e8a3bddfe55f26d82a1f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_dbb42f2f46a87b89ea8c27e1b5d"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fc9fbe054ad87248180aec2e9c9"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "author_id"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "stories" DROP COLUMN "readers_number"`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stories" ADD "content" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_289c6e4c604173627127a471a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba73bb12df2a8340c997e9865c"`);
        await queryRunner.query(`DROP TABLE "story_category"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`ALTER TABLE "stories" ADD CONSTRAINT "FK_ab4ee230faf536e7c5aee12f4ea" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
