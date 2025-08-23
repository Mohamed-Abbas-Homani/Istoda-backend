import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Story } from './story.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '#000000' })
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Story, (story) => story.categories)
  stories: Story[];
}