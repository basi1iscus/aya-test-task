import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Department } from './department';
import { Donation } from './donation';
import { Salary } from './salary';
import { EmployeeDTO, RateDTO } from '../../../interfaces';

@Entity()
export class Employee {
  @PrimaryColumn('int')
  id: number;
  @Column({ type: 'varchar', length: 200 })
  name: string;
  @Column({ type: 'varchar', length: 200 })
  surname: string;
  @ManyToOne(() => Department)
  department: Department;
  @OneToMany(() => Salary, (salary) => salary.employee)
  salaries: Salary[];
  @OneToMany(() => Donation, (donation) => donation.employee)
  donations: Donation[];

  constructor(employee: EmployeeDTO, rates?: RateDTO[]) {
    this.id = employee?.id;
    this.name = employee?.name;
    this.surname = employee?.surname;
    if (employee?.department) {
      if (employee.department instanceof Department) {
        this.department = employee.department;
      } else {
        this.department = new Department(employee.department);
      }
    }
    if (employee?.salary) {
      this.salaries = employee.salary.map(
        (salary: Partial<Salary>) => new Salary(salary)
      );
    }
    if (employee?.donation) {
      this.donations = employee.donation.map(
        (donation: Partial<Donation>) => new Donation(donation, rates)
      );
    }
  }
}
