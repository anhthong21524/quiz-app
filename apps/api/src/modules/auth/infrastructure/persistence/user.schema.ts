import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: "users" })
export class UserEntity {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ type: String, default: null })
  passwordHash?: string | null;

  @Prop({ type: String, default: null })
  passwordSalt?: string | null;

  @Prop({ type: String, sparse: true, default: null })
  googleSub?: string | null;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
