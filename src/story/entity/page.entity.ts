import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Story } from './story.entity';
import { Comment } from './comment.entity';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Story, (story) => story.pages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column()
  page_number: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  media_id: string;

  @Column('jsonb', { default: null, nullable: true })
  meta: Record<string, any>;

  @OneToMany(() => Comment, (comment) => comment.page, { cascade: true })
  comments: Comment[];
}