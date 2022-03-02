import { IsString } from 'class-validator';

export class EnvConfig {
  @IsString()
  public readonly DATABASE_URL: string;
}
