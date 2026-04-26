import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { Public } from "../../auth/decorators/public.decorator";
import { CreateAttemptDto } from "../application/dto/create-attempt.dto";
import { CreateQuizDto } from "../application/dto/create-quiz.dto";
import { SubmitAttemptDto } from "../application/dto/submit-attempt.dto";
import { UpdateQuizDto } from "../application/dto/update-quiz.dto";
import { AttemptService } from "../application/attempt.service";
import { AuthenticatedUser, QuizService } from "../application/quiz.service";

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller("quizzes")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly attemptService: AttemptService
  ) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.quizService.findAll(request.user);
  }

  @Get("public")
  @Public()
  findPublished() {
    return this.quizService.findPublished();
  }

  @Get("slug/:slug")
  @Public()
  findBySlug(@Param("slug") slug: string) {
    return this.quizService.findBySlug(slug);
  }

  @Get(":id")
  @Public()
  findById(@Param("id") id: string) {
    return this.quizService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateQuizDto, @Req() request: AuthenticatedRequest) {
    return this.quizService.create(payload, request.user);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateQuizDto, @Req() request: AuthenticatedRequest) {
    return this.quizService.update(id, payload, request.user);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.quizService.publish(id, request.user);
  }

  @Patch(":id/unpublish")
  unpublish(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.quizService.unpublish(id, request.user);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.quizService.delete(id, request.user);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.quizService.duplicate(id, request.user);
  }

  @Post(":id/attempts")
  @Public()
  createAttempt(@Param("id") id: string, @Body() body: CreateAttemptDto) {
    return this.attemptService.createAttempt(id, body.takerName);
  }

  @Post(":id/attempts/:attemptId/submit")
  @Public()
  submitAttempt(
    @Param("id") id: string,
    @Param("attemptId") attemptId: string,
    @Body() body: SubmitAttemptDto
  ) {
    return this.attemptService.submitAttempt(id, attemptId, body.answers, body.timeTaken);
  }
}
