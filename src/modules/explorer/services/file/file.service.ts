import trash from 'trash';
import { promisify } from 'util';
import { FileCarte } from '../../models/public_api';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../../config/public_api';
import { basename, relative, join } from 'path';
import { stat, lstat, readlink, readdir, mkdir, exists, copyFile, rename } from 'fs';

const promisifyStat = promisify(stat);
const promisifyMkdir = promisify(mkdir);
const promisifyLstat = promisify(lstat);
const promisifyRename = promisify(rename);
const promisifyExists = promisify(exists);
const promisifyReaddir = promisify(readdir);
const promisifyCopyFile = promisify(copyFile);
const promisifyReadlink = promisify(readlink);

@Injectable()
export class FileService {

  constructor(
      private readonly configService: ConfigService) {

  }

  public async getFileStat(originPath: string, includeHiddenFiles: boolean) {
    const path = this.checkAndResolvePath(originPath);
    const fileCarte = new FileCarte();
    const fileStat = await promisifyStat(path);
    const fileLstat = await promisifyLstat(path);
    const directory = fileStat.isDirectory();
    const { mode, size, atimeMs, ctimeMs, mtimeMs, birthtimeMs } = fileStat;
    const symbolicLink = fileLstat.isSymbolicLink();
    if(directory) {
      try {
        fileCarte.filesCount = (await this.getFiles(originPath, includeHiddenFiles)).length;
      } catch(e) {
        Logger.error(e);
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
    folder = this.checkAndResolvePath(folder);
    let files = await promisifyReaddir(folder);
    if(!includeHiddenFiles) {
      files = files.filter(file => !file.startsWith('.'));
    }
    return files;
  }

  public async deleteFiles(files: Array<string>) {
    files = files.map(file => this.checkAndResolvePath(file));
    return trash(files);
    // return Promise.all(files.map(async (file) => {
    //   return promisifyUnlink(file)
    //     .then(() => file);
    // }));
  }

  public async createFolder(path: string) {
    path = this.checkAndResolvePath(path);
    if(await promisifyExists(path)) {
      throw new Error('file exists');
    }
    return await promisifyMkdir(path)
  }

  public async copyFiles(sources: Array<string>, target: string) {
    target = this.checkAndResolvePath(target);
    sources = sources.map(source => this.checkAndResolvePath(source));
    return await Promise.all(sources.map(async (source) => {
      return await promisifyCopyFile(source, `${ target }/${ basename(source) }`);
    }));
  }

  public async moveFiles(sources: Array<string>, target: string) {
    target = this.checkAndResolvePath(target);
    sources = sources.map(source => this.checkAndResolvePath(source));
    return await Promise.all(sources.map(async (source) => {
      return await promisifyRename(source, `${ target }/${ basename(source) }`);
    }));
  }

  public async moveUploadedFiles(files: Array<any>, target: string) {
    target = this.checkAndResolvePath(target);
    return await Promise.all(files.map(async (file) => {
      return await promisifyRename(file.path, `${ target }/${ file.originalname }`);
    }));
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
