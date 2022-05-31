import { eMinistryRole } from '@sp/shared-interfaces';

import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class RolesQuery {
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  roles: eMinistryRole[];
}
