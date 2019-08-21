import { promisify } from 'util';
import { Request, Response } from 'express';
import { exists, stat, createReadStream } from 'fs';
import { Controller, Get, Req, Res, Param, HttpStatus } from '@nestjs/common';

@Controller('video-stream')
export class VideoStreamController {

  @Get(':path')
  public async getVideoStream(@Req() request: Request, @Res() response: Response,@Param('path') path: string) {
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

}
