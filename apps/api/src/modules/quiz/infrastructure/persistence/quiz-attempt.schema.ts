import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: "quiz_attempts" })
export class QuizAttemptEntity {
  @Prop({ required: true, index: true })
  quizId!: string;

  @Prop({ required: true, trim: true })
  takerName!: string;

  @Prop({ required: true })
  startedAt!: string;

  @Prop({ type: String, default: null })
  submittedAt?: string;

  @Prop({ type: Number, default: null })
  timeTaken?: number;

  @Prop({ type: Object, default: null })
  answers?: Record<string, number>;

  @Prop({ type: Number, default: null })
  score?: number;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttemptEntity);
