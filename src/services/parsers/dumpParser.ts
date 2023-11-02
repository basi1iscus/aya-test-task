import readline from 'node:readline';
import {
  Class,
  EmployeeDTO,
  IDumpParser,
  IParserDTO,
  RateDTO,
} from '../../interfaces';
import { ParserDTO } from './parserDTO';

class Employee {
  #id?: number;
  #name?: string;
  #surname?: string;
  #department?: Department;
  #salary?: Salary;
  #donations: Donation[] = [];

  set name(name: string) {
    this.#name = name;
  }
  set surname(surname: string) {
    this.#surname = surname;
  }
  set id(id: string) {
    this.#id = Number.parseInt(id);
  }
  set Department(department: Department) {
    this.#department = department;
  }
  set Salary(salary: Salary) {
    this.#salary = salary;
  }
  set Donation(donation: Donation) {
    this.#donations.push(donation);
  }
  get name(): string | undefined {
    return this.#name;
  }
  get surname(): string | undefined {
    return this.#surname;
  }
  get id(): number | undefined {
    return this.#id;
  }
  get Department(): Department | undefined {
    return this.#department;
  }
  get Salary(): Salary | undefined {
    return this.#salary;
  }
  get Donation(): Donation[] | undefined {
    return this.#donations;
  }

  getTableData() {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      department: this.Department?.getTableData(),
      salary: this.Salary?.getTableData(),
      donation: this.Donation?.map((donation) => donation.getTableData()),
    };
  }
}

class Department {
  #id?: number;
  #name?: string;

  set name(name: string) {
    this.#name = name;
  }
  set id(id: string) {
    this.#id = Number.parseInt(id);
  }
  get name(): string | undefined {
    return this.#name;
  }
  get id(): number | undefined {
    return this.#id;
  }
  getTableData() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

class Statement {
  #id?: number;
  #amount?: number;
  #date?: Date;

  set id(id: string) {
    this.#id = Number.parseInt(id);
  }
  set amount(amount: string) {
    this.#amount = Number.parseFloat(amount);
  }
  set date(date: string) {
    this.#date = new Date(date);
  }
  get amount(): number | undefined {
    return this.#amount;
  }
  get date(): Date | undefined {
    return this.#date;
  }
  get id(): number | undefined {
    return this.#id;
  }
  getTableData() {
    return {
      id: this.id,
      amount: this.amount,
      date: this.date,
    };
  }
}

class Donation {
  #id?: number;
  #amount?: number;
  #date?: Date;
  #sign?: string;

  set id(id: string) {
    this.#id = Number.parseInt(id);
  }
  set amount(amountWithSign: string) {
    const [amount, sign] = amountWithSign.split(' ');
    this.#amount = Number.parseFloat(amount);
    this.#sign = sign;
  }

  set date(date: string) {
    this.#date = new Date(date);
  }
  get amount(): number | undefined {
    return this.#amount;
  }
  get date(): Date | undefined {
    return this.#date;
  }
  get id(): number | undefined {
    return this.#id;
  }
  get sign(): string | undefined {
    return this.#sign;
  }
  getTableData() {
    return {
      id: this.id,
      amount: this.amount,
      date: this.date,
      sign: this.sign,
    };
  }
}

class Salary {
  salary: Statement[] = [];

  set Statement(statement: Statement) {
    this.salary.push(statement);
  }

  getTableData() {
    return this.salary.map((statement) => statement.getTableData());
  }
}

class EList {
  employees: Employee[] = [];

  set Employee(employee: Employee) {
    this.employees.push(employee);
  }

  getTableData(): EmployeeDTO[] {
    return this.employees.map((employee) => employee.getTableData());
  }
}

class Rate {
  #value?: number;
  #date?: Date;
  #sign?: string;

  set value(value: string) {
    this.#value = Number.parseFloat(value);
  }
  set date(date: string) {
    this.#date = new Date(date);
  }
  set sign(sign: string) {
    this.#sign = sign;
  }
  get value(): number | undefined {
    return this.#value;
  }
  get sign(): string | undefined {
    return this.#sign;
  }
  get date(): Date | undefined {
    return this.#date;
  }

  getTableData() {
    return {
      value: this.value,
      date: this.date,
      sign: this.sign,
    };
  }
}

class Rates {
  rates: Rate[] = [];

  set Rate(rate: Rate) {
    this.rates.push(rate);
  }
  getTableData(): RateDTO[] {
    return this.rates.map((rate) => rate.getTableData());
  }
}

export class DumpParser implements IDumpParser {
  private objectMap: Record<string, Class> = {
    'E-List': EList,
    Employee: Employee,
    Department: Department,
    Salary: Salary,
    Statement: Statement,
    Donation: Donation,
    Rates: Rates,
    Rate: Rate,
  };

  private parsedDate: Record<string, any> = {};

  private async loadLine(
    lineGemerator: AsyncGenerator<string>,
    iterationValue: IteratorResult<string, any>,
    currentObj: any,
    iterationLevel: number = -1
  ) {
    while (!iterationValue.done) {
      let line = iterationValue.value;
      let currentLine = line;
      if (currentLine.trim() === '') {
        iterationValue = await lineGemerator.next();
        continue;
      }
      let currentLevel = (currentLine.match(/^ */) ?? [''])[0].length;
      if (iterationLevel >= currentLevel) {
        return { currentObj, iterationValue };
      }
      if (currentLine.includes(':') && currentObj) {
        const [key, value] = currentLine.split(':');
        currentObj[key.trim()] = value.trim();
        iterationValue = await lineGemerator.next();
        continue;
      }

      const tableName = currentLine.trim();
      iterationValue = await lineGemerator.next();
      if (this.objectMap[tableName]) {
        const newObj = new this.objectMap[tableName]();
        const result = await this.loadLine(
          lineGemerator,
          iterationValue,
          newObj,
          currentLevel
        );
        if (result.currentObj) {
          currentObj[tableName] = result.currentObj;
        }
        iterationValue = result.iterationValue;
      } else {
        currentObj = undefined;
      }
    }

    return { currentObj, iterationValue };
  }

  private async *getLine(rl: readline.Interface) {
    for await (const line of rl) {
      yield line;
    }
  }

  async parse(stream: NodeJS.ReadableStream): Promise<IParserDTO> {
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const generator = this.getLine(rl);

    const parsed = await this.loadLine(generator, await generator.next(), {});
    this.parsedDate = parsed.currentObj;

    return {
      employees: this.parsedDate['E-List']?.getTableData() ?? [],
      rates: this.parsedDate['Rates']?.getTableData() ?? [],
    };
  }
}
