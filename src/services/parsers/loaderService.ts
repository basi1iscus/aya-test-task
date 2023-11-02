import fs from 'node:fs';
import databaseFactory from '../database/databaseFactory';

import { DumpParserFactory } from './parserFactory';
import { DumpLoader } from '../database/dumpLoader';

import { ParserDTO } from './parserDTO';
import { IParserDTO } from '../../interfaces';

export async function loadDumpFile(filename: string, version = 'v1') {
  const fileStream = fs.createReadStream(filename);
  return loadDumpStream(fileStream, version);
}

export async function loadDumpStream(
  stream: NodeJS.ReadableStream,
  version = 'v1'
) {
  const parser = DumpParserFactory.getParser(version);
  const parsed = await parser.parse(stream);
  if (!parsed) {
    return { success: false, message: `Nothing to load` };
  }

  return loadDumpFromDTO(parsed);
}

export async function loadDumpFromDTO(dto: IParserDTO) {
  if (!dto.employees) {
    return { success: false, message: `Nothing to load` };
  }
  try {
    const parserDTO = new ParserDTO(dto.employees, dto.rates);
    const employees = parserDTO.getEmployeeTable();
    const departments = parserDTO.getDepartmentTable();
    const salaries = parserDTO.getSalaryTable();
    const donations = parserDTO.getDonationTable();

    const dumpLoader = new DumpLoader();
    await dumpLoader.loadDepartments(databaseFactory.client, departments);
    await dumpLoader.loadEmployees(databaseFactory.client, employees);
    await dumpLoader.loadSalaries(databaseFactory.client, salaries);
    await dumpLoader.loadDonations(databaseFactory.client, donations);

    return { success: true, message: `Loaded ${employees.length} employees` };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, message: `Error have happend while dump loading` };
  }
}
