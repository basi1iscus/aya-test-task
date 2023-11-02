import { EmployeeDTO, RateDTO } from '../../interfaces';
import { Department } from '../database/entities/department';
import { Donation } from '../database/entities/donation';
import { Employee } from '../database/entities/employee';
import { Salary } from '../database/entities/salary';

export class ParserDTO {
  employees: Employee[];
  rates: RateDTO[];

  constructor(employees: EmployeeDTO[], rates?: RateDTO[]) {
    this.employees = employees.map((item) => new Employee(item, this.rates));
    this.rates = rates ?? [];
  }

  getEmployeeTable(): Employee[] {
    return this.employees;
  }

  getDepartmentTable(): Department[] {
    return [
      ...(
        this.employees.reduce(
          (acc: Map<number, Department>, item: Employee) => {
            if (!acc.has(item.department.id)) {
              acc.set(item.department.id, item.department);
            }
            return acc;
          },
          new Map()
        ) as Map<number, Department>
      ).values(),
    ];
  }

  getSalaryTable(): Salary[] {
    return this.employees.reduce(
      (acc: Salary[], item: Employee) => [
        ...acc,
        ...item.salaries.map((salary) => {
          salary.employee = item;
          return new Salary(salary);
        }),
      ],
      []
    );
  }
  getDonationTable(): Donation[] {
    return this.employees.reduce(
      (acc: Donation[], item: Employee) => [
        ...acc,
        ...item.donations.map((donation) => {
          donation.employee = item;
          return new Donation(donation);
        }),
      ],
      []
    );
  }
}
