import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryColumn('int')
  id: number;
  @Column({ type: 'varchar', length: 200 })
  name: string;

  constructor(department: Record<string, any>) {
    this.id = department?.id;
    this.name = department?.name;
  }
}
