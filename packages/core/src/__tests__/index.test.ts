import { createXLibrary, XLibrary } from '../index';

describe('XLibrary', () => {
  const config = {
    name: 'Test Library',
    version: '1.0.0'
  };

  it('should create an instance with correct config', () => {
    const library = new XLibrary(config);
    expect(library.getName()).toBe(config.name);
    expect(library.getVersion()).toBe(config.version);
  });

  it('should greet with default message', () => {
    const library = new XLibrary(config);
    const greeting = library.greet();
    expect(greeting).toBe('Hello from X Library! (Test Library v1.0.0)');
  });

  it('should greet with custom message', () => {
    const library = new XLibrary(config);
    const greeting = library.greet('Welcome!');
    expect(greeting).toBe('Welcome! (Test Library v1.0.0)');
  });

  it('should create library using factory function', () => {
    const library = createXLibrary(config);
    expect(library).toBeInstanceOf(XLibrary);
    expect(library.getName()).toBe(config.name);
  });
});
