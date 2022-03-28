import { PartialType } from '@nestjs/swagger';

import { MemberRequestDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(MemberRequestDto) {}
