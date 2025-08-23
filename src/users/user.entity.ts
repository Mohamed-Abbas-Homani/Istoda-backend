import { Story } from 'src/story/entity/story.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from 'src/story/entity/comment.entity';
import { Rating } from 'src/story/entity/rating.entity';
import { Reader } from 'src/story/entity/reader.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Reader, (reader) => reader.user)
  readers: Reader[];
}
