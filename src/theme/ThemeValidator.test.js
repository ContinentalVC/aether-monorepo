const { ThemeValidator } = require('./ThemeValidator');

describe('ThemeValidator', () => {
  it('should be defined', () => {
    expect(ThemeValidator).toBeDefined();
  });

  it('should instantiate', () => {
    const validator = new ThemeValidator();
    expect(validator).toBeDefined();
  });

  it('returns errors with correct structure for invalid theme', () => {
    const invalidTheme = {
      name: '',
      version: '',
      colors: { primary: { light: 'bad', dark: 'bad' }, secondary: { light: 'bad', dark: 'bad' } },
      typography: { fontSizes: { xs: 0 } },
      spacing: { xs: -1 },
      shadows: { small: { opacity: 2 } },
    };
    const errors = ThemeValidator.validate(invalidTheme);
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBeGreaterThan(0);
    errors.forEach(error => {
      expect(error).toHaveProperty('type');
      expect(error).toHaveProperty('field');
      expect(error).toHaveProperty('message');
      expect(typeof error.type).toBe('string');
      expect(typeof error.field).toBe('string');
      expect(typeof error.message).toBe('string');
    });
  });
});

test('basic sanity check', () => {
  expect(1 + 1).toBe(2);
}); 