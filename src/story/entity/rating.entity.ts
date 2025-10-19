import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Story } from './story.entity';

@Entity('ratings')
@Unique(['user', 'story'])
@Index('IDX_ratings_user_story', { synchronize: false })
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Story, (story) => story.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'int' })
  rate: number; // 1-5 stars

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
