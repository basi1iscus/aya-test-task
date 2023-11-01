import { DumpParser } from './dumpParser';
import { Class } from '../../interfaces';

export class DumpParserFactory {
  private static parserMap: Record<string, Class> = {
    v1: DumpParser,
  };

  static getParser(version: string) {
    if (!this.parserMap[version]) {
      throw Error(`Unsupported dump version: ${version}`);
    }
    return new this.parserMap[version]();
  }
}
