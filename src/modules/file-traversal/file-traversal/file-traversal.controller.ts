import { exists } from 'fs';
import { resolve } from 'path';
import { Response } from 'express';
import { promisify } from 'util';
import { FileService } from '../services/public_api';
import { Controller, Get, Param, Res, Query } from '@nestjs/common';

@Controller('file-traversal')
export class FileTraversalController {

  constructor(
      private readonly fileService: FileService) {

  }

  @Get(':path')
  public async getFile(@Res() response: Response, @Param('path') path: string, @Query('includeHiddenFiles') includeHiddenFiles: boolean=false) {
    if(!await promisify(exists)(path)) {
      response.status(404).json({ message: 'folder not exists' });
      return;
    }
    const fileCarte = await this.fileService.getFileStat(path, includeHiddenFiles);
    if(fileCarte.directory) {
      fileCarte.files = await Promise.all((await this.fileService.getFiles(path, includeHiddenFiles)).map(async (file) => {
        return await this.fileService.getFileStat(resolve(path, file), includeHiddenFiles);
      }));
    }
    response.json(fileCarte);
  }

}
