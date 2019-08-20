import { getType } from 'mime';
import { Response } from 'express';
import { promisify } from 'util';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from '../../services/file/file.service';
import { resolve, basename } from 'path';
import { exists, createReadStream, stat } from 'fs';
import { Controller, Get, Param, Res, Query, HttpStatus, Delete, Put, Body, UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('explorer')
export class ExplorerController {

  constructor(
      private readonly fileService: FileService) {

  }

  @Get(':path')
  public async getFile(
      @Param('path') path: string,
      @Query('includeHiddenFiles') includeHiddenFiles: boolean=false) {
    const fileCarte = await this.fileService.getFileStat(path, includeHiddenFiles);
    if(fileCarte.directory) {
      fileCarte.files = await Promise.all((await this.fileService.getFiles(path, includeHiddenFiles)).map(async (file) => {
        return await this.fileService.getFileStat(resolve(path, file), includeHiddenFiles);
      }));
    }
    return fileCarte;
  }

  @Get('file/:path')
  public async downloadFile(
      @Res() response: Response,
      @Param('path') path: string,
      @Query('download') download: boolean = false) {
    if(!(await promisify(exists)(path))) {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'file not found' });
      return;
    }
    const fileStat = await promisify(stat)(path);
    if(fileStat.isDirectory()) {
      response.status(HttpStatus.BAD_REQUEST).json({ message: 'path is a folder' });
      return;
    }
    const readStream = createReadStream(path);
    if(download) {
      response.writeHead(HttpStatus.OK, {
        'Content-Type': getType(path),
        'Content-Length': fileStat.size,
        'Content-Disposition': `attachment; filename="${ global.encodeURI(basename(path)) }"`,
        'Content-Transfer-Encoding': 'binary',
      });
    } else {
      response.writeHead(HttpStatus.OK, {
        'Content-Type': getType(path),
        'Content-Length': fileStat.size,
        'Content-Disposition': `inline; filename="${ global.encodeURI(basename(path)) }"`,
        'Content-Transfer-Encoding': 'binary',
      });
    }
    readStream.pipe(response).on('end', () => response.end());
  }

  @Delete()
  public async deleteFiles(@Query('files') files: string | Array<string>) {
    if(files instanceof Array) {
      return await this.fileService.deleteFiles(files);
    } else {
      return await this.fileService.deleteFiles([files]);
    }
  }

  /**
   * TODO: 添加创建文件的部分
   *
   * @param {string} path
   * @param {('file'|'folder')} type
   * @returns
   * @memberof FileTraversalController
   */
  @Put()
  public async createFile(@Body('path') path: string, @Body('type') type: 'file'|'folder') {
    if(type === 'folder') {
      return await this.fileService.createFolder(path);
    }
    // TODO
  }

  @Put('copy')
  public async copyFiles(@Body('sources') sources: Array<string>, @Body('target') target: string) {
    return await this.fileService.copyFiles(sources, target);
  }

  @Put('move')
  public async moveFiles(@Body('sources') sources: Array<string>, @Body('target') target: string) {
    return await this.fileService.moveFiles(sources, target);
  }

}
