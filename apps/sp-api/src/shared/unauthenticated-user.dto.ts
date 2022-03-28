import { ApiProperty } from '@nestjs/swagger';

export class UnauthenticatedUserResponseDto {
  @ApiProperty({
    default: '401',
  })
  status: number;
  @ApiProperty({
    default: 'Unauthenticated',
  })
  message: string;
}
