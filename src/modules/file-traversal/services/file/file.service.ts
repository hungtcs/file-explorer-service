import { promisify } from 'util';
import { FileCarte } from '../../models/public_api';
import { basename } from 'path';
import { Injectable } from '@nestjs/common';
import { stat, lstat, readlink, readdir } from 'fs';

const promisifyStat = promisify(stat);
const promisifyLstat = promisify(lstat);
const promisifyReaddir = promisify(readdir);
const promisifyReadlink = promisify(readlink);

@Injectable()
export class FileService {

  public async getFileStat(path: string, includeHiddenFiles: boolean) {
    const fileCarte = new FileCarte();
    const fileStat = await promisifyStat(path);
    const fileLstat = await promisifyLstat(path);
    const directory = fileStat.isDirectory();
    const { mode, size, atimeMs, ctimeMs, mtimeMs, birthtimeMs } = fileStat;
    const symbolicLink = fileLstat.isSymbolicLink();
    if(directory) {
      try {
        fileCarte.filesCount = (await this.getFiles(path, includeHiddenFiles)).length;
      } catch(e) {

      }
    }
    if(symbolicLink) {
      fileCarte.symbolicLinkTarget = await promisifyReadlink(path);
    }
    fileCarte.name = basename(path);
    fileCarte.stat = { mode, size, atimeMs, ctimeMs, mtimeMs, birthtimeMs };
    fileCarte.file = fileStat.isFile();
    fileCarte.directory = directory;
    fileCarte.symbolicLink = symbolicLink;
    return fileCarte;
  }

  public async getFiles(folder: string, includeHiddenFiles: boolean) {
    let files = await promisifyReaddir(folder);
    if(!includeHiddenFiles) {
      files = files.filter(file => !file.startsWith('.'));
    }
    return files;
  }

}
