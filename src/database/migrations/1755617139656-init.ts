import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitFullSchema1760812345678 implements MigrationInterface {
  name = 'InitFullSchema1760812345678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== USER TABLE =====
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "profile_picture" character varying,
        CONSTRAINT "UQ_user_username" UNIQUE ("username"),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    // ===== STORIES TABLE =====
    await queryRunner.query(`
      CREATE TABLE "stories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "cover_photo" character varying,
        "publishing_date" TIMESTAMP NOT NULL DEFAULT now(),
        "description" text,
        "status" character varying NOT NULL DEFAULT 'published',
        "updated_at" TIMESTAMP DEFAULT now(),
        "author_id" uuid,
        CONSTRAINT "PK_stories_id" PRIMARY KEY ("id")
      )
    `);

    // ===== PAGES TABLE =====
    await queryRunner.query(`
      CREATE TABLE "pages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "page_number" integer NOT NULL,
        "content" text NOT NULL,
        "media_id" character varying,
        "meta" jsonb,
        "story_id" uuid,
        "updated_at" TIMESTAMP DEFAULT now(),
        CONSTRAINT "PK_pages_id" PRIMARY KEY ("id")
      )
    `);

    // ===== CATEGORIES TABLE =====
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "color" character varying NOT NULL DEFAULT '#000000',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `);

    // ===== COMMENTS TABLE =====
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        "story_id" uuid,
        "page_id" uuid,
        CONSTRAINT "PK_comments_id" PRIMARY KEY ("id")
      )
    `);

    // ===== RATINGS TABLE =====
    await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "rate" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        "story_id" uuid,
        CONSTRAINT "PK_ratings_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ratings_user_story" UNIQUE ("user_id", "story_id")
      )
    `);

    // ===== READERS TABLE =====
    await queryRunner.query(`
      CREATE TABLE "readers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "current_page_number" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        "story_id" uuid,
        CONSTRAINT "PK_readers_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_readers_user_story" UNIQUE ("user_id", "story_id")
      )
    `);

    // ===== STORY_CATEGORY TABLE (Many-to-Many) =====
    await queryRunner.query(`
      CREATE TABLE "story_category" (
        "story_id" uuid NOT NULL,
        "category_id" uuid NOT NULL,
        CONSTRAINT "PK_story_category" PRIMARY KEY ("story_id", "category_id")
      )
    `);

    // ====== INDEXES ======
    await queryRunner.query(`
      CREATE INDEX "IDX_story_category_story" ON "story_category" ("story_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_story_category_category" ON "story_category" ("category_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_stories_title" ON "stories" (LOWER("title"));
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_stories_publishing_date" ON "stories" ("publishing_date" DESC);
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_stories_author_id" ON "stories" ("author_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_comments_created_at" ON "comments" ("created_at" DESC);
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_pages_story_page_number" ON "pages" ("story_id", "page_number");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_ratings_user_story" ON "ratings" ("user_id", "story_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_readers_user_story" ON "readers" ("user_id", "story_id");
    `);

    // ====== FOREIGN KEYS ======
    await queryRunner.query(`
      ALTER TABLE "stories"
      ADD CONSTRAINT "FK_stories_author_user"
      FOREIGN KEY ("author_id") REFERENCES "user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "pages"
      ADD CONSTRAINT "FK_pages_story"
      FOREIGN KEY ("story_id") REFERENCES "stories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "comments"
      ADD CONSTRAINT "FK_comments_user"
      FOREIGN KEY ("user_id") REFERENCES "user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "comments"
      ADD CONSTRAINT "FK_comments_story"
      FOREIGN KEY ("story_id") REFERENCES "stories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "comments"
      ADD CONSTRAINT "FK_comments_page"
      FOREIGN KEY ("page_id") REFERENCES "pages"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "story_category"
      ADD CONSTRAINT "FK_story_category_story"
      FOREIGN KEY ("story_id") REFERENCES "stories"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE "story_category"
      ADD CONSTRAINT "FK_story_category_category"
      FOREIGN KEY ("category_id") REFERENCES "categories"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "ratings"
      ADD CONSTRAINT "FK_ratings_user"
      FOREIGN KEY ("user_id") REFERENCES "user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "ratings"
      ADD CONSTRAINT "FK_ratings_story"
      FOREIGN KEY ("story_id") REFERENCES "stories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "readers"
      ADD CONSTRAINT "FK_readers_user"
      FOREIGN KEY ("user_id") REFERENCES "user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE "readers"
      ADD CONSTRAINT "FK_readers_story"
      FOREIGN KEY ("story_id") REFERENCES "stories"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs
    await queryRunner.query(
      `ALTER TABLE "readers" DROP CONSTRAINT "FK_readers_story"`,
    );
    await queryRunner.query(
      `ALTER TABLE "readers" DROP CONSTRAINT "FK_readers_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_ratings_story"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" DROP CONSTRAINT "FK_ratings_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_category" DROP CONSTRAINT "FK_story_category_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "story_category" DROP CONSTRAINT "FK_story_category_story"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_page"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_story"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "FK_pages_story"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stories" DROP CONSTRAINT "FK_stories_author_user"`,
    );

    // Drop Indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_readers_user_story"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ratings_user_story"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_pages_story_page_number"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_comments_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_stories_author_id"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_stories_publishing_date"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_stories_title"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_story_category_category"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_story_category_story"`);

    // Drop Tables
    await queryRunner.query(`DROP TABLE "readers"`);
    await queryRunner.query(`DROP TABLE "ratings"`);
    await queryRunner.query(`DROP TABLE "story_category"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "pages"`);
    await queryRunner.query(`DROP TABLE "stories"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
