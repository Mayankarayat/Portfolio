import { describe, expect, it } from "vitest";
import { validateContact } from "./contact";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello, I have a role for you." };

describe("validateContact", () => {
  it("accepts a well-formed message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every empty field", () => {
    expect(Object.keys(validateContact({ name: " ", email: "", message: "" })).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects malformed emails and very short messages", () => {
    const errors = validateContact({ ...valid, email: "ada@", message: "hi" });
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
