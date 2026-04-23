import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { QuizStatus } from "@quiz-app/shared";

@Schema({ _id: false })
export class QuestionEntity {
  @Prop({ required: true, trim: true })
  prompt!: string;

  @Prop({ type: [String], required: true })
  options!: string[];

  @Prop({ required: true, min: 0 })
  correctOptionIndex!: number;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);

@Schema({ timestamps: true, collection: "quizzes" })
export class QuizEntity {
  @Prop({ required: true, trim: true, maxlength: 120 })
  title!: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  description!: string;

  @Prop({
    type: String,
    enum: Object.values(QuizStatus),
    default: QuizStatus.IN_PROGRESS
  })
  status!: QuizStatus;

  @Prop({ type: [QuestionSchema], default: [] })
  questions!: QuestionEntity[];
}

export const QuizSchema = SchemaFactory.createForClass(QuizEntity);

