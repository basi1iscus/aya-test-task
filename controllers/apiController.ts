import { APIResponse, IRemuneration } from '../interfaces';
import { loadDumpFile } from '../services/parsers/loaderService';
import { RenumerationService } from '../services/reports/renumeration';

export class APIController {
  async getRemuneration(): Promise<APIResponse<IRemuneration[]>> {
    try {
      const data = await new RenumerationService().getRemuneration(10000, 500);
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
        message: 'Error have happend while get remuneration',
      };
    }
  }

  async loadDump(): Promise<APIResponse<string>> {
    try {
      const data = await loadDumpFile('public/dump.txt');
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
        message: 'Error have happend while loadind dump',
      };
    }
  }
}
