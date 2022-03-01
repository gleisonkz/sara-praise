import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MinistryRepository {
  readonly PATH = path.resolve(`${__dirname}../../../../apps/sp-api/src/app/database/repository.json`);

  async saveDataBase(file: any, property: string): Promise<void> {
    const database = this.getDataBase();
    database[property] = file;
    const dataBaseStringified = JSON.stringify(database);
    fs.writeFileSync(this.PATH, dataBaseStringified);
  }

  getDataBase(): Promise<any> {
    const dataBaseReader = fs.readFileSync(this.PATH);
    const dataBaseString = dataBaseReader.toString();
    const dataBaseParsed = JSON.parse(dataBaseString);

    return dataBaseParsed;
  }
}
