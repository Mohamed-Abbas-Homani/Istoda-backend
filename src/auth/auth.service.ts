import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(
    signupDto: SignupDto,
    profilePicture?: Express.Multer.File,
  ): Promise<User> {
    const { username, email, password } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first to get the ID
    const user = this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);

    // Handle profile picture if provided
    if (profilePicture) {
      const fileExtension = path.extname(profilePicture.originalname);
      const newFileName = `${savedUser.id}.profile_picture.${profilePicture.originalname}`;
      const newFilePath = path.join('./uploads', newFileName);

      try {
        // Rename the temporary file to the final name
        fs.renameSync(profilePicture.path, newFilePath);

        // Update user with profile picture path
        savedUser.profile_picture = newFileName;
        await this.userRepo.save(savedUser);
      } catch (error) {
        // If file operations fail, clean up and throw error
        if (fs.existsSync(profilePicture.path)) {
          fs.unlinkSync(profilePicture.path);
        }
        throw new Error('Failed to save profile picture');
      }
    }
    savedUser.password = ""
    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    user.password = ""
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}
