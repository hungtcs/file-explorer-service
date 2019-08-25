import { promisify } from 'util';
import { Request, Response } from 'express';
import { exists, stat, createReadStream } from 'fs';
import { Controller, Get, Req, Res, Param, HttpStatus } from '@nestjs/common';
import { join, relative } from 'path';
import { ConfigService } from '../../../config/public_api';

@Controller('video-stream')
export class VideoStreamController {

  constructor(
      private configService: ConfigService) {

  }

  @Get(':path')
  public async getVideoStream(@Req() request: Request, @Res() response: Response,@Param('path') path: string) {
    path = this.checkAndResolvePath(path);
    if(!await promisify(exists)(path)) {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'file not found' });
      return;
    }
    const fileStat = await promisify(stat)(path);
    if(fileStat.isDirectory()) {
      response.status(HttpStatus.BAD_REQUEST).json({ message: 'path is a folder' });
      return;
    }
    const range = request.headers.range;
    const fileSize = fileStat.size;
    if(range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0]);
      const end = parts[1] ? parseInt(parts[1]) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const fileReadStream = createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      response.writeHead(206, head);
      fileReadStream.pipe(response);
      fileReadStream.on('end', () => {
        response.end();
      });
    } else {
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      response.writeHead(200, headers);
      const fileReadStream = createReadStream(path);
      fileReadStream.pipe(response);
      fileReadStream.on('end', () => {
        response.end();
      });
    }
  }

  /**
   * 校验并转换路径到文件真实路径
   *
   * @author 鸿则<hungtcs@163.com>
   * @param {string} path
   * @returns
   * @memberof FileService
   */
  public checkAndResolvePath(path: string) {
    path = join(this.configService.explorer.root, path);
    if(relative(this.configService.explorer.root, path).startsWith('../')) {
      throw new Error('invalid path');
    }
    return path;
  }

}
