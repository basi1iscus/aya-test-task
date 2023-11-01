export interface IParserDTO {
  employees?: EmployeeDTO[];
  rates?: RateDTO[];
}

export interface IDumpParser {
  parse(stream: NodeJS.ReadableStream): Promise<IParserDTO>;
}

export type Class = new (...args: any[]) => any;

export interface RateDTO {
  sign?: string;
  date?: Date;
  value?: number;
}

export interface EmployeeDTO {
  id?: number;
  name?: string;
  surname?: string;
  department?: DepartmentDTO;
  salary?: SalaryDTO[];
  donation?: DonationDTO[];
}

export interface DepartmentDTO {
  id?: number;
  name?: string;
}

export interface SalaryDTO {
  id?: number;
  amount?: number;
  date?: Date;
  employee?: EmployeeDTO;
}

export interface DonationDTO {
  id?: number;
  amount?: number;
  date?: Date;
  sign?: string;
  employee?: EmployeeDTO;
}

export interface IRemuneration {
  employeeId: number;
  name: string;
  surname: string;
  donation: number;
  remuneration: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
