import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync allows dynamic database configuration using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD') ?? 'password',
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts, .js}'], // Include entities from all modules
        synchronize: true, // Automatically syncs the database schema with the entity definitions; useful for development but should be false in production
      }),
      inject: [ConfigService], // Injects the ConfigService so it can be used in the useFactory function
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
