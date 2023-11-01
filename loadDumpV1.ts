import fs from 'node:fs';
import readline from 'node:readline';
import { setTimeout } from 'node:timers/promises';

class Employee {
  #id?: number;
  #name?: string;
  #surname?: string;
  #department?: Department;
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
  get Donation(): Donation[] | undefined {
    return this.#donations;
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
}

class Salary {
  salary: Statement[] = [];

  set Statement(statement: Statement) {
    this.salary.push(statement);
  }
}

class EList {
  employees: Employee[] = [];

  set Employee(employee: Employee) {
    this.employees.push(employee);
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
}

class Rates {
  rates: Rate[] = [];

  set Rate(rate: Rate) {
    this.rates.push(rate);
  }
}

type Class = new (...args: any[]) => any;

const map: Record<string, Class> = {
  'E-List': EList,
  Employee: Employee,
  Department: Department,
  Salary: Salary,
  Statement: Statement,
  Donation: Donation,
  Rates: Rates,
  Rate: Rate,
};

async function* getLine(rl: readline.Interface) {
  for await (const line of rl) {
    yield line;
  }
}
let paused = false;
async function loadLine(
  rl: readline.Interface,
  currentObj: any,
  iterationLevel: number = -1
) {
  //await setTimeout(100);
  let currentLevel: number = -1;
  for await (const line of rl) {
    // let isRepeat: boolean;
    // let currentLine = line;
    // do {
    //   isRepeat = false;
    //   if (currentLine.trim() === '') {
    //     break;
    //   }
    //   currentLevel = (currentLine.match(/^ */) ?? [''])[0].length;
    //   if (iterationLevel >= currentLevel) {
    //     return { currentObj, currentLevel, currentLine };
    //   }
    //   if (currentLine.includes(':') && currentObj) {
    //     const [key, value] = currentLine.split(':');
    //     currentObj[key.trim()] = value.trim();
    //     break;
    //   }
    //   const tableName = currentLine.trim();
    //   if (map[tableName]) {
    //     const newObj = new map[tableName]();
    //     const result = await loadLine(rl, newObj, currentLevel);
    //     if (result.currentObj) {
    //       currentObj[tableName] = result.currentObj;
    //     }
    //     currentLine = result.currentLine;
    //     currentLevel = result.currentLevel;
    //     if (iterationLevel >= currentLevel) {
    //       return { currentObj, currentLevel, currentLine };
    //     }
    //     isRepeat = true;
    //   } else {
    //     currentObj = undefined;
    //   }
    // } while (isRepeat);
  }

  return { currentObj, currentLevel, currentLine: '' };
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('dump.txt', {});
  fileStream.on('error', console.error);
  fileStream.on('close', () => console.log('close'));
  fileStream.on('pause', () => {
    console.log('pause');
    paused = true;
  });
  fileStream.on('resume', () => {
    console.log('resume');
    paused = false;
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('pause', () => {
    console.log('rl paused');
  });
  rl.on('close', () => {
    console.log('rl close');
  });
  rl.on('', () => {
    console.log('rl close');
  });
  //for await (const line of rl) {
  //  console.log(line);
  //}
  const parsed = await loadLine(rl, {});
  console.log(parsed);
}

processLineByLine();
