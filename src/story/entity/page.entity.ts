import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Story } from './story.entity';
import { Comment } from './comment.entity';

@Entity('pages')
@Index('IDX_pages_story_page_number', { synchronize: false })
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Story, (story) => story.pages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ name: 'page_number' })
  pageNumber: number;

  @Column('text')
  content: string;

  @Column({ name: 'media_id', nullable: true })
  mediaId: string;

  @Column('jsonb', { default: null, nullable: true })
  meta: Record<string, any>;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.page, { cascade: true })
  comments: Comment[];
}
