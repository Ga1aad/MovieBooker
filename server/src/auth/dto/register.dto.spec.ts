import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should validate a correct register dto', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.username = 'testuser';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'password123';
    dto.username = 'testuser';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with short password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'short';
    dto.username = 'testuser';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
