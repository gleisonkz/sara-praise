import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { MemberListItemResponse, RoleResponse } from '@sp/shared-interfaces';

export class MemberListItemResponseDto implements MemberListItemResponse {
  @ApiProperty() name: string;
  @ApiPropertyOptional()
  participantID?: number;
  @ApiProperty() memberID: number;
  @ApiProperty() imageUrl: string;
  @ApiProperty() roles: RoleResponse[];
}
