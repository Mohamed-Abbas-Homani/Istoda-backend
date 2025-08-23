import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Page } from './page.entity';
import { Comment } from './comment.entity';
import { Category } from './category.entity';
import { Rating } from './rating.entity';
import { Reader } from './reader.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.stories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  cover_photo: string;

  @CreateDateColumn({ name: 'publishing_date' })
  publishingDate: Date;

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
