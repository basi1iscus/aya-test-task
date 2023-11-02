import { DataSource } from 'typeorm';
import { Employee } from './entities/employee';
import { Department } from './entities/department';
import { Salary } from './entities/salary';
import { Donation } from './entities/donation';

export class DumpLoader {
  async loadEmployees(dataSource: DataSource, employees: Employee[]) {
    const employeeRepository = dataSource.getRepository(Employee);
    return Promise.all(
      employees.map((employee) => employeeRepository.upsert(employee, ['id']))
    );
  }
  async loadDepartments(dataSource: DataSource, departments: Department[]) {
    const departmentRepository = dataSource.getRepository(Department);
    return Promise.all(
      departments.map((department) =>
        departmentRepository.upsert(department, ['id'])
      )
    );
  }

  async loadSalaries(dataSource: DataSource, salaries: Salary[]) {
    const salaryRepository = dataSource.getRepository(Salary);
    return Promise.all(
      salaries.map((salary) => salaryRepository.upsert(salary, ['id']))
    );
  }

  async loadDonations(dataSource: DataSource, donations: Donation[]) {
    const donationRepository = dataSource.getRepository(Donation);
    return Promise.all(
      donations.map((donation) => donationRepository.upsert(donation, ['id']))
    );
  }
}
