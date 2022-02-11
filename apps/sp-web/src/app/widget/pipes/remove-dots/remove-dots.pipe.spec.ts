import { RemoveDotsPipe } from './remove-dots.date.pipe';

describe('RemoveDotsPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveDotsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a string without dots', () => {
    const pipe = new RemoveDotsPipe();
    expect(pipe.transform('1.2.3')).toEqual('123');
  });

  it('should return a string without dots', () => {
    const pipe = new RemoveDotsPipe();
    const sample = 'Dez. 25, 2018';
    const expected = 'Dez 25, 2018';

    expect(pipe.transform(sample)).toEqual(expected);
  });
});
