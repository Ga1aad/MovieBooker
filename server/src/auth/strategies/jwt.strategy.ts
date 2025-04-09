import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // console.log('Payload reçu dans JWT strategy:', payload);

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token invalide');
    }

    const result = {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };

    // console.log('Données retournées par validate:', result);
    return result;
  }
}
