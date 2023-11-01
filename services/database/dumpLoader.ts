import { DataSource } from 'typeorm';
import { Employee } from '../../entities/employee';
import { Department } from '../../entities/department';
import { Salary } from '../../entities/salary';
import { Donation } from '../../entities/donation';

export class DumpLoader {
  async loadEmployees(dataSource: DataSource, employee: Employee[]) {
    const employeeRepository = dataSource.getRepository(Employee);

    await employeeRepository.upsert(employee, ['id']);
  }
  async loadDepartments(dataSource: DataSource, departments: Department[]) {
    const departmentRepository = dataSource.getRepository(Department);
    for (const department of departments) {
      departmentRepository.upsert(department, ['id']);
    }
  }
  async loadSalaries(dataSource: DataSource, salaries: Salary[]) {
    const departmentRepository = dataSource.getRepository(Salary);
    for (const salary of salaries) {
      departmentRepository.upsert(salary, ['id']);
    }
  }
  async loadDonations(dataSource: DataSource, donations: Donation[]) {
    const departmentRepository = dataSource.getRepository(Donation);
    for (const donation of donations) {
      departmentRepository.upsert(donation, ['id']);
    }
  }
}
