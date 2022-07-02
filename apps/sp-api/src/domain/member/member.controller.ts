/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { eMinistryRole, MemberListItemResponse } from '@sp/shared-interfaces';

import { MinistryNotFoundError } from 'apps/sp-api/src/domain/ministry/ministry.error';
import { Response } from 'express';
import { UnauthenticatedUserResponseDto } from '../../shared';
import { MemberListItemResponseDto, MemberRequestDto } from './dtos';
import { MemberService } from './member.service';

@ApiTags('Membros')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries/:ministryID/members')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  type: UnauthenticatedUserResponseDto,
})
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Param('ministryID') ministryID: number, @Body() memberRequestDto: MemberRequestDto) {
    return this.memberService.create(ministryID, memberRequestDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: MemberListItemResponseDto,
  })
  @ApiQuery({ name: 'roles', required: false })
  @Get()
  async getMembers(
    @Param('ministryID') ministryID: number,
    @Res({ passthrough: true }) res: Response,
    @Query('roles') roles?: string
  ): Promise<MemberListItemResponse[]> {
    try {
      const parsedRoles: eMinistryRole[] = !roles ? '' : JSON.parse(roles);
      const members = await this.memberService.getMembers(+ministryID, parsedRoles);
      return members;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }

      throw error;
    }
  }

  @Get(':memberID')
  findByID(@Param('memberID') memberID: number) {
    return this.memberService.findByID(memberID);
  }

  @Put(':memberID')
  update(@Param('memberID') memberID: number, @Body() updateMemberDto: MemberRequestDto) {
    return this.memberService.update(memberID, updateMemberDto);
  }

  @Delete(':memberID')
  remove(@Param('memberID') memberID: number) {
    return this.memberService.remove(memberID);
  }
}
