import trash from 'trash';
import { promisify } from 'util';
import { FileCarte } from '../../models/public_api';
import { basename } from 'path';
import { Injectable } from '@nestjs/common';
import { stat, lstat, readlink, readdir, mkdir, exists, copyFile } from 'fs';
import { async } from 'rxjs/internal/scheduler/async';

const promisifyStat = promisify(stat);
const promisifyMkdir = promisify(mkdir);
const promisifyLstat = promisify(lstat);
const promisifyExists = promisify(exists);
const promisifyReaddir = promisify(readdir);
const promisifyCopyFile = promisify(copyFile);
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

  public async deleteFiles(files: Array<string>) {
    return trash(files);
    // return Promise.all(files.map(async (file) => {
    //   return promisifyUnlink(file)
    //     .then(() => file);
    // }));
  }

  public async createFolder(path: string) {
    if(await promisifyExists(path)) {
      throw new Error('file exists');
    }
    return await promisifyMkdir(path)
  }

  public async copyFiles(sources: Array<string>, target: string) {
    return await Promise.all(sources.map(async (source) => {
      return await promisifyCopyFile(source, `${ target }/${ basename(source) }`);
    }));
  }

}
