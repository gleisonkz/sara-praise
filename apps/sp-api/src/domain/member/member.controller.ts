/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { MemberListItemResponse } from '@sp/shared-interfaces';

import { UpdateMemberDto } from 'apps/sp-api/src/domain/member/dto/update-member.dto';
import { MinistryNotFoundError } from 'apps/sp-api/src/domain/ministry/ministry.error';
import { Response } from 'express';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberService } from './member.service';

@ApiTags('Membros')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries/:ministryID/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    // return this.memberService.create(createMemberDto);
  }

  @Get('')
  async getMembers(
    @Param('ministryID') ministryID: number,
    @Query('roles') roles,
    @Res({ passthrough: true }) res: Response
  ): Promise<MemberListItemResponse[]> {
    try {
      const members = await this.memberService.getMembers(+ministryID, roles);
      return members;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }

      throw error;
    }
  }

  @Get()
  findAll() {
    // return this.memberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.memberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    // return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.memberService.remove(+id);
  }
}
