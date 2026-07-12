import {sha256Hex} from "./Hash";

export async function generatePassword(key: number, name: string, no: number, length: number) {
  const prefix = getPrefix(name);
  const suffix = await getSuffix(key, name, no, length - 3);
  return prefix + "!" + suffix;
}

function getPrefix(name: string) {
  // Find all the letters in the string
  const letters = name.match(/[a-zA-Z]/g);

  // If there are no letters, return "Xx"
  if (!letters) {
    return "Xx";
  }

  // If there is only one letter, duplicate it and change the case
  if (letters.length === 1) {
    return letters[0].toUpperCase() + letters[0].toLowerCase();
  }

  // If there are two or more letters, return the first two with the desired case
  return letters[0].toUpperCase() + letters[1].toLowerCase();
}

async function getSuffix(key: number, name: string, no: number, length: number) {
  const input = name + no + key;
  const hashedPassword = await sha256Hex(input);
  return hashedPassword.substring(0, length);
}
