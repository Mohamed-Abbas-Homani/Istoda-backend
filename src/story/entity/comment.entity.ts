import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Story } from './story.entity';
import { Page } from './page.entity';

@Entity('comments')
@Index('IDX_comments_created_at', { synchronize: false })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Story, (story) => story.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @ManyToOne(() => Page, (page) => page.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
