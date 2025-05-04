/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSummary } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LangchainService } from './langchain.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSummary])],
  controllers: [ChatController],
  providers: [ChatService, LangchainService],
})
export class ChatModule {}