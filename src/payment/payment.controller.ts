import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payment')
@UseGuards(AccessTokenGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  edit(@Param('id') id: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.edit(id, createPaymentDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload-file')
  async addImageToPayment(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') paymentId: string,
    @Request() req,
  ) {
    await this.paymentService.addFileToPayment(file, paymentId);
  }
}
