import {generatePassword} from "./PasswordLogic";
import {describe, expect, it} from "vitest";

describe('generatePassword', () => {
  it('should generate a password', async () => {
    const password = await generatePassword(0, "test", 0, 16);
    expect(password).toStrictEqual("Te!12ef4ded7a464");
  });
});