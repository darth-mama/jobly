const { BadRequestError } = require("../expressError");

const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("It should generate SQL columns and update its values", function () {
    const dataToUpdate = {
      username: "testUser",
      password: "testpassword",
      firstName: "Lewis",
      lastName: "Carol",
      email: "test@email.com",
      isAdmin: false,
    };
    const jsToSql = {
      username: "username",
      password: "testpassword",
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      isAdmin: "is_admin",
    };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result.values[0]).toBe("testUser");
    expect(result.values[1]).toBe("testpassword");
    expect(result.values[2]).toBe("Lewis");
    expect(result.values[3]).toBe("Carol");
    expect(result.values[4]).toBe("test@email.com");
    expect(result.values[5]).toBe(false);
  });
});
