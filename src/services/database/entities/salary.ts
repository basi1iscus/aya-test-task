import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Employee } from './employee';
import { SalaryDTO } from '../../../interfaces';

@Entity()
export class Salary {
  @PrimaryColumn('int')
  id: number;
  @ManyToOne(() => Employee)
  employee: Employee;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;
  @Column('timestamptz')
  date: Date;

  constructor(salary: SalaryDTO) {
    this.id = salary?.id;
    this.amount = salary?.amount;
    this.date = salary?.date;
    if (salary?.employee) {
      this.employee = new Employee(salary.employee);
    }
  }
}
