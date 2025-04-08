import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a new user instance', () => {
    const user = new User();
    user.email = 'test@example.com';
    user.username = 'testuser';
    user.password = 'hashedpassword';

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('hashedpassword');
  });
});
