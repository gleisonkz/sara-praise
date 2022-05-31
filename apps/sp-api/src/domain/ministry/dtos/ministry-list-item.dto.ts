import { ApiProperty } from '@nestjs/swagger';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

export class MinistryListItemResponseDto implements MinistryListItemResponse {
  @ApiProperty() ministryID: number;
  @ApiProperty() name: string;
  @ApiProperty() musicsQuantity: number;
  @ApiProperty() membersQuantity: number;
  @ApiProperty() scalesQuantity: number;
  @ApiProperty() songKeysQuantity: number;
  @ApiProperty() artistQuantity: number;
}
