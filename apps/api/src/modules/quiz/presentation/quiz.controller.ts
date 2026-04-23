import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateQuizDto } from "../application/dto/create-quiz.dto";
import { UpdateQuizDto } from "../application/dto/update-quiz.dto";
import { QuizService } from "../application/quiz.service";

@Controller("quizzes")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.quizService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateQuizDto) {
    return this.quizService.create(payload);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateQuizDto) {
    return this.quizService.update(id, payload);
  }

  @Patch(":id/publish")
  publish(@Param("id") id: string) {
    return this.quizService.publish(id);
  }

  @Patch(":id/unpublish")
  unpublish(@Param("id") id: string) {
    return this.quizService.unpublish(id);
  }
}

