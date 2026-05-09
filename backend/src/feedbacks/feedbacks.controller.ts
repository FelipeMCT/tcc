import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private feedbacksService: FeedbacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  create(
    @CurrentUser() user: { id: number },
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbacksService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FUNCIONARIO')
  getMyFeedbacks(@CurrentUser() user: { id: number }) {
    return this.feedbacksService.getMyFeedbacks(user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  findAll() {
    return this.feedbacksService.findAll();
  }
}
