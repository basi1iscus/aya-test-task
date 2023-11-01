import fs from 'node:fs';
import databaseFactory from '../database/databaseFactory';

import { DumpParserFactory } from './parserFactory';
import { DumpLoader } from '../database/dumpLoader';

import { ParserDTO } from './parserDTO';

export async function loadDumpFile(filename: string, version = 'v1') {
  const fileStream = fs.createReadStream(filename);

  const parser = DumpParserFactory.getParser(version);
  const parsed = await parser.parse(fileStream);
  if (parsed && parsed.employees) {
    const parserDTO = new ParserDTO(parsed.employees, parsed.rates);
    const employees = parserDTO.getEmployeeTable();
    const departments = parserDTO.getDepartmentTable();
    const salaries = parserDTO.getSalaryTable();
    const donations = parserDTO.getDonationTable();

    await new DumpLoader().loadDepartments(databaseFactory.client, departments);
    await new DumpLoader().loadEmployees(databaseFactory.client, employees);
    await new DumpLoader().loadSalaries(databaseFactory.client, salaries);
    await new DumpLoader().loadDonations(databaseFactory.client, donations);
    return `Loaded ${employees.length} employees`;
  }

  return `Nothing to load`;
}
