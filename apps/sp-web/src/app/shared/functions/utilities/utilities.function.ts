export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function toLowerCaseWithoutAccents(str: string) {
  return removeAccents(str).toLowerCase();
}
