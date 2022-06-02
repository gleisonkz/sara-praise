import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    ScaleDetailResponse, ScaleListItemResponse, ScaleRequest, ScaleResponse
} from '@sp/shared-interfaces';

import { ScaleRequestDto } from 'apps/sp-api/src/domain/scale/dto/scale.dto';

@Injectable()
export class ScaleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(ministryID: number, scaleRequest: ScaleRequest): Promise<ScaleResponse> {
    const scale = await this.prismaService.scale.create({
      data: {
        title: scaleRequest.title,
        notes: scaleRequest.notes,
        date: scaleRequest.date,
        ministryID,
      },
    });

    const scaleResponse: ScaleResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      notes: scale.notes,
      date: scale.date,
    };

    return scaleResponse;
  }

  update(scaleID: number, scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
    return this.prismaService.scale.update({
      where: { scaleID },
      data: {
        title: scaleRequest.title,
        notes: scaleRequest.notes,
        date: scaleRequest.date,
      },
    });
  }

  async findOne(ministryID: number, scaleID: number): Promise<ScaleDetailResponse> {
    const scale = await this.prismaService.scale.findFirst({
      where: {
        scaleID,
        ministryID,
      },
      include: {
        songs: true,
        participants: true,
      },
    });

    const scaleDetailResponse: ScaleDetailResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      date: scale.date,
      songs: [],
      participants: [],
      notes: scale.notes,
    };

    return scaleDetailResponse;
  }

  async findAll(ministryID: number): Promise<ScaleListItemResponse[]> {
    const scales = await this.prismaService.scale.findMany({
      where: { ministryID },
      include: {
        songs: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const scaleListItemResponses: ScaleListItemResponse[] = scales.map((scale) => {
      const scaleListItemResponse: ScaleListItemResponse = {
        scaleID: scale.scaleID,
        title: scale.title,
        notes: scale.notes,
        songsQuantity: scale.songs.length,
        date: scale.date,
        imagesUrl: [],
      };

      return scaleListItemResponse;
    });

    return scaleListItemResponses;
  }
}
