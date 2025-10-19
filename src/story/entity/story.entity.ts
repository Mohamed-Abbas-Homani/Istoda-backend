import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Page } from './page.entity';
import { Comment } from './comment.entity';
import { Category } from './category.entity';
import { Rating } from './rating.entity';
import { Reader } from './reader.entity';

export enum StoryStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('stories')
@Index('IDX_stories_title', { synchronize: false })
@Index('IDX_stories_publishing_date', { synchronize: false })
@Index('IDX_stories_author_id', { synchronize: false })
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.stories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'cover_photo', nullable: true })
  coverPhoto: string;

  @Column({
    type: 'varchar',
    default: StoryStatus.PUBLISHED,
  })
  status: StoryStatus;

  @CreateDateColumn({ name: 'publishing_date' })
  publishingDate: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Page, (page) => page.story, { cascade: true })
  pages: Page[];

  @OneToMany(() => Comment, (comment) => comment.story, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.story, { cascade: true })
  ratings: Rating[];

  @OneToMany(() => Reader, (reader) => reader.story, { cascade: true })
  readers: Reader[];

  @ManyToMany(() => Category, (category) => category.stories)
  @JoinTable({
    name: 'story_category',
    joinColumn: { name: 'story_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
