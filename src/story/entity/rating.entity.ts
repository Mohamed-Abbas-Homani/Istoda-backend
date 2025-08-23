import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Story } from './story.entity';

@Entity('ratings')
@Unique(['user', 'story'])
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

  @CreateDateColumn()
  created_at: Date;
}