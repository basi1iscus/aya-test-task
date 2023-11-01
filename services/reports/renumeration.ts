import databaseFactory from '../database/databaseFactory';

export class RenumerationService {
  renumerationQuery = `
    SELECT
        "employeeId",
        EMPLOYEE.NAME,
        EMPLOYEE.SURNAME,
        SUM(AMOUNT) AS donations,
        CASE
            WHEN SUM(AMOUNT) < $1 THEN 0
            ELSE SUM(AMOUNT) / (
                SELECT
                    SUM(AMOUNT)
                FROM
                    DONATION
            ) * $2
        END:: decimal(10, 2) AS remuneration
    FROM DONATION
        JOIN EMPLOYEE ON DONATION."employeeId" = PUBLIC.EMPLOYEE.ID
    GROUP BY
        "employeeId",
        EMPLOYEE.NAME,
        EMPLOYEE.SURNAME`;

  async getRemuneration(total: number, minDonation: number) {
    return await databaseFactory.client.query(this.renumerationQuery, [
      minDonation,
      total,
    ]);
  }
}
