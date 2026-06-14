import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard, Roles } from './guards/jwt-auth.guard';
import {
  RegisterDeviceDto,
  ConfirmDeviceDto,
  VerifyCardDto,
  ScanLogDto,
  ScansQueryDto,
  MyScansQueryDto,
} from './dto/card.dto';

@ApiTags('Card')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // ─── STUDENT ──────────────────────────────────────────────────────────────

  @Get('me')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Obtenir sa carte étudiant' })
  getMyCard(@Req() req: any) {
    return this.cardService.getMyCard(req.user.id);
  }

  @Get('qr')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Générer un QR JWT RS256 (7h-21h, carte active)' })
  getQrToken(@Req() req: any) {
    return this.cardService.getQrToken(req.user.id);
  }

  @Get('scans/me')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Historique de mes scans' })
  getMyScans(@Req() req: any, @Query() query: MyScansQueryDto) {
    return this.cardService.getMyScans(req.user.id, query);
  }

  @Get('devices')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Lister mes appareils enregistrés' })
  getDevices(@Req() req: any) {
    return this.cardService.getDevices(req.user.id);
  }

  @Post('devices/register')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Enregistrer un nouvel appareil (max 2)' })
  registerDevice(@Req() req: any, @Body() dto: RegisterDeviceDto) {
    return this.cardService.registerDevice(req.user.id, req.user.email, dto);
  }

  @Post('devices/confirm')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Confirmer un appareil via OTP BetterAuth' })
  confirmDevice(@Req() req: any, @Body() dto: ConfirmDeviceDto) {
    const token = req.headers['authorization']?.slice(7) ?? '';
    return this.cardService.confirmDevice(req.user.id, req.user.email, dto, token);
  }

  @Delete('devices/:id')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Supprimer un appareil (propriétaire uniquement)' })
  deleteDevice(@Req() req: any, @Param('id') id: string) {
    return this.cardService.deleteDevice(req.user.id, id);
  }

  // ─── SCOLARITE ────────────────────────────────────────────────────────────

  @Post('verify')
  @Roles('SCOLARITE')
  @ApiOperation({ summary: 'Vérifier un JWT RS256 issu du QR' })
  verifyCard(@Body() dto: VerifyCardDto) {
    return this.cardService.verifyCard(dto.token);
  }

  @Post('scan-log')
  @Roles('SCOLARITE')
  @ApiOperation({ summary: 'Enregistrer un scan de carte' })
  createScanLog(@Req() req: any, @Body() dto: ScanLogDto) {
    return this.cardService.createScanLog(req.user.id, dto);
  }

  @Get('scans')
  @Roles('SCOLARITE')
  @ApiOperation({ summary: 'Lister tous les scans avec filtres' })
  getAllScans(@Query() query: ScansQueryDto) {
    return this.cardService.getAllScans(query);
  }

  @Post('photo/:userId')
  @Roles('SCOLARITE')
  @ApiOperation({ summary: 'Upload photo étudiant vers R2' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cardService.uploadPhoto(userId, file.buffer, file.mimetype);
  }
}
