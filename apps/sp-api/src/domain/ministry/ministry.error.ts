import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicatedMinistryNameError extends HttpException {
  constructor(public readonly ministryName: string) {
    super(`Já existe um ministério com o nome ${ministryName}`, HttpStatus.BAD_REQUEST);
  }
}

export class MinistryNotFoundError extends Error {
  constructor(public ministryID: number) {
    super(`Ministry with ID ${ministryID} not found`);
  }
}

export class MinistryByScaleNotFoundError extends Error {
  constructor(public scaleID: number) {
    super(`Not found any ministry associated with scale with ID ${scaleID}`);
  }
}

export class MultipleSongsFoundError extends Error {
  constructor(public songID: number) {
    super(`Multiple songs with ID ${songID} found`);
  }
}

export class ScaleNotFoundError extends Error {
  constructor(public ministryID: number, public scaleID: number) {
    super(`Scale with ID ${scaleID} not found for ministry with ID ${ministryID}`);
  }
}
