import { ApiProperty } from '@nestjs/swagger';

import { MinistryRequest } from '@sp/shared-interfaces';

export class MinistryRequestDto implements MinistryRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  ownerID: number;
}
