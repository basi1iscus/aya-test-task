import { MIN_DONATION, TOTAL_RENUMERATION } from '../constants/general';
import { APIResponse, IRemuneration } from '../interfaces';
import { loadDumpFile } from '../services/parsers/loaderService';
import { RenumerationService } from '../services/reports/renumeration';

export class APIController {
  async getRemuneration(): Promise<APIResponse<IRemuneration[]>> {
    try {
      const data = await new RenumerationService().getRemuneration(
        TOTAL_RENUMERATION,
        MIN_DONATION
      );
      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error(error.message);
      return {
        success: false,
        message: 'Error have happend while get remuneration',
      };
    }
  }

  async loadDump(): Promise<APIResponse<string>> {
    try {
      return await loadDumpFile('assets/dump.txt');
    } catch (error: any) {
      console.error(error.message);
      return {
        success: false,
        message: 'Error have happend while loadind dump',
      };
    }
  }
}
