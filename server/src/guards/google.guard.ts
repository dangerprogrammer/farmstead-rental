import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleGuard implements CanActivate {
  private client: OAuth2Client;

  constructor(
    private reflector: Reflector
  ) {
    this.client = new OAuth2Client('51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com');
  }

  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('public', [
      ctx.getHandler(), ctx.getClass()
    ]);

    if (isPublic) return !0;

    const req = ctx.switchToHttp().getRequest();
    const idToken = req.headers['authorization'];

    if (!idToken) throw new UnauthorizedException('Token não fornecido.');

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: '51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com',
        maxExpiry: 60 * 60 * 24
      });

      const payload = ticket.getPayload();

      req.user = payload;

      return !0;
    } catch (error) {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}