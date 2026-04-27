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

  @Prop({ trim: true, maxlength: 500 })
  explanation?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);

@Schema({ timestamps: true, collection: "qa_quizzes" })
export class QuizEntity {
  @Prop({ required: true, trim: true, maxlength: 120 })
  title!: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  description!: string;

  @Prop({ required: true, trim: true, index: true })
  ownerId!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  ownerEmail!: string;

  @Prop({ trim: true, maxlength: 80 })
  subject?: string;

  @Prop({ enum: ["Easy", "Medium", "Hard"] })
  difficulty?: "Easy" | "Medium" | "Hard";

  @Prop({ type: Number, default: null, min: 1, max: 180 })
  timeLimit?: number | null;

  @Prop({
    type: String,
    enum: Object.values(QuizStatus),
    default: QuizStatus.IN_PROGRESS
  })
  status!: QuizStatus;

  @Prop({ trim: true, index: true, sparse: true })
  slug?: string;

  @Prop({ type: Boolean, default: false })
  isPrivate!: boolean;

  @Prop({ trim: true, uppercase: true, index: true, sparse: true })
  accessCode?: string;

  @Prop({ type: Boolean, default: true })
  allowSummary!: boolean;

  @Prop({ type: Boolean, default: true })
  allowReviewAnswers!: boolean;

  @Prop({ type: Boolean, default: true })
  allowRetake!: boolean;

  @Prop({ type: [QuestionSchema], default: [] })
  questions!: QuestionEntity[];
}

export const QuizSchema = SchemaFactory.createForClass(QuizEntity);

QuizSchema.index({ ownerId: 1, updatedAt: -1 });
