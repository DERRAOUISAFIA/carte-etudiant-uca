import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService, R2Service, JwtAuthGuard],
})
export class CardModule {}
