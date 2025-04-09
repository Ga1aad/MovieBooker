import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService({
            JWT_SECRET: 'test-secret',
          }),
        },
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data from valid payload', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
      });
    });

    it('should throw UnauthorizedException for payload with empty values', async () => {
      const invalidPayload = {
        sub: '',
        email: '',
      };

      await expect(strategy.validate(invalidPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for payload with missing email', async () => {
      const invalidPayload = {
        sub: 'user-id',
        email: undefined,
      };

      await expect(strategy.validate(invalidPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not defined', () => {
      const mockConfigService = new ConfigService({
        JWT_SECRET: undefined,
      });

      expect(() => new JwtStrategy(mockConfigService)).toThrow(
        'JWT_SECRET is not defined',
      );
    });

    it('should create strategy with valid JWT_SECRET', () => {
      const mockConfigService = new ConfigService({
        JWT_SECRET: 'valid-secret',
      });

      const strategy = new JwtStrategy(mockConfigService);
      expect(strategy).toBeDefined();
    });
  });
});
