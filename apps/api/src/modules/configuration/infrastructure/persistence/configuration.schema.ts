import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: "qa_configurations" })
export class ConfigurationEntity {
  @Prop({ required: true, trim: true, unique: true, index: true })
  ownerId!: string;

  @Prop({ type: [String], required: true, default: [] })
  subjectDomains!: string[];
}

export const ConfigurationSchema = SchemaFactory.createForClass(ConfigurationEntity);
