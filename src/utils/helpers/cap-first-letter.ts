export function capFirstLetter(str: string) {
  return str.toString().charAt(0).toUpperCase() + str.toString().slice(1);
}
