import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import {
  compareRefreshToken,
  generateRefreshToken,
  hashRefreshToken,
} from './utils/refresh-token.util';
import { parseDurationMs } from './utils/duration.util';

const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

export interface LoginMetadata {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto, metadata: LoginMetadata = {}) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      await this.recordLoginAttempt(loginDto.email, false, metadata);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      await this.recordLoginAttempt(loginDto.email, false, metadata);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.recordLoginAttempt(loginDto.email, true, metadata);

    const familyId = randomUUID();
    const { refreshToken } = await this.issueRefreshToken(user.id, familyId);

    return {
      access_token: await this.signAccessToken(user),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        registrationNumber: user.registrationNumber,
        role: user.role,
        branchId: user.branchId,
      },
    };
  }

  async refresh(refreshToken: string) {
    const record = await this.findRefreshTokenRecord(refreshToken);

    if (!record) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.revokedAt) {
      // Reuse of an already-rotated/revoked token: possible theft, kill the whole family.
      await this.revokeFamily(record.familyId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const { refreshToken: newRefreshToken } = await this.issueRefreshToken(
      record.userId,
      record.familyId,
    );

    return {
      access_token: await this.signAccessToken(record.user),
      refresh_token: newRefreshToken,
      user: {
        id: record.user.id,
        name: record.user.name,
        registrationNumber: record.user.registrationNumber,
        role: record.user.role,
        branchId: record.user.branchId,
      },
    };
  }

  async logout(refreshToken: string) {
    const record = await this.findRefreshTokenRecord(refreshToken);
    if (record && !record.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  }

  private async signAccessToken(user: {
    id: number;
    registrationNumber: string;
    role: string;
    branchId: number | null;
  }) {
    const payload = {
      sub: user.id,
      registrationNumber: user.registrationNumber,
      role: user.role,
      branchId: user.branchId,
    };
    return this.jwtService.signAsync(payload);
  }

  private async issueRefreshToken(userId: number, familyId: string) {
    const refreshToken = generateRefreshToken();
    const tokenHash = await hashRefreshToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + parseDurationMs(REFRESH_TOKEN_EXPIRES_IN),
    );

    await this.prisma.refreshToken.create({
      data: { tokenHash, userId, familyId, expiresAt },
    });

    return { refreshToken };
  }

  private async findRefreshTokenRecord(refreshToken: string) {
    const candidates = await this.prisma.refreshToken.findMany({
      include: { user: true },
    });

    for (const candidate of candidates) {
      if (await compareRefreshToken(refreshToken, candidate.tokenHash)) {
        return candidate;
      }
    }

    return null;
  }

  private async revokeFamily(familyId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async recordLoginAttempt(
    email: string,
    success: boolean,
    metadata: LoginMetadata,
  ) {
    await this.prisma.loginAttempt.create({
      data: {
        email,
        success,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
  }
}
