"use strict";

const db = require("../db");
const {
  BadRequestError,
  NotFoundError,
  ExpressError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Jobs {
  static async createJobs({ title, salary, equity, company_handle }) {
    //test for duplicates
    const duplicateCheck = await db.query(
      `SELECT company_handle
            FROM jobs
            WHERE company_handle=$1`,
      [company_handle]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`${company_handle} already exists.`);
    }

    //Adding company info to the database

    const result = await db.query(
      `INSERT INTO jobs
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle`,
      [title, salary, equity, company_handle]
    );
    const job = result.rows[0];
    return job;
  }
}
