import { removeAccents, toLowerCaseWithoutAccents } from './utilities.function';

describe('[Utilities Functions] - removeAccents', () => {
  describe('() => removeAccents', () => {
    it('should remove accents from a string', () => {
      const str = 'áéíóúàèìòùâêîôûãõç';
      const expectedStr = 'aeiouaeiouaeiouaoc';
      expect(removeAccents(str)).toEqual(expectedStr);
    });

    it('should return the same string if it has no accents', () => {
      const str = 'aeiouaeiouaeiouaoc';
      expect(removeAccents(str)).toEqual(str);
    });

    it('should return an empty string if the string is empty', () => {
      const str = '';
      expect(removeAccents(str)).toEqual(str);
    });
  });

  describe('() => toLowerCaseWithoutAccents', () => {
    it('should remove accents and convert to lowercase', () => {
      const str = 'ÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ';
      const expectedStr = 'aeiouaeiouaeiouaoc';
      expect(toLowerCaseWithoutAccents(str)).toEqual(expectedStr);
    });

    it('should return the lower case string if it has no accents', () => {
      const str = 'AEIOUAEIOUAEIOUAOC';
      const expectedStr = 'aeiouaeiouaeiouaoc';
      expect(toLowerCaseWithoutAccents(str)).toEqual(expectedStr);
    });

    it('should return an empty string if the string is empty', () => {
      const str = '';
      expect(toLowerCaseWithoutAccents(str)).toEqual(str);
    });
  });
});
