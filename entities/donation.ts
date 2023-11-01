import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Employee } from './employee';
import { RateDTO } from '../interfaces';
import { convertCurrency } from '../services/helpers/currency';

@Entity()
export class Donation {
  @PrimaryColumn('int')
  id: number;
  @ManyToOne(() => Employee)
  employee: Employee;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;
  @Column('timestamptz')
  date: Date;

  constructor(donation: Record<string, any>, rates?: RateDTO[]) {
    this.id = donation?.id;
    this.date = donation?.date;
    if (donation?.employee) {
      this.employee = donation.employee;
    }
    if (rates && donation?.sign) {
      this.amount = convertCurrency(
        rates,
        donation.sign,
        donation.date,
        donation.amount
      );
    } else {
      this.amount = donation?.amount;
    }
  }
}
