import json5 from 'json5';
import { resolve } from 'path';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { Configuration } from '../models/configuration';
import { existsSync, readFile } from 'fs';

@Injectable()
export class ConfigService {
  public configuration: Configuration;
  private configurationPath: string;
  private configurationPaths = [
    resolve(__dirname, '../../../../config', 'config.json5'),
    resolve(__dirname, '../../../../config', 'config.json'),
    '/etc/file-explorer-service/config.json5',
    '/etc/file-explorer-service/config.json',
  ];

  get explorer() {
    return this.configuration.explorer;
  }

  constructor() {

  }

  public async parseConfiguration() {
    let found = this.configurationPaths.some((path) => {
      if(existsSync(path)) {
        this.configurationPath = path;
        return true;
      }
    });
    if(found) {
      const config = await promisify(readFile)(this.configurationPath, { encoding: 'utf-8' });
      this.configuration = json5.parse(config) as Configuration;
      return this.configuration;
    } else {
      throw new Error('configuration file not found');
    }
  }

}
