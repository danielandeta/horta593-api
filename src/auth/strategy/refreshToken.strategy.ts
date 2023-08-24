import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request as ExpressRequest } from "express";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh"
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: ExpressRequest) => {
                    const data = request?.cookies["refresh"];
                    if (!data) {
                        return null;
                    }
                    return data.token;
                },
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: ExpressRequest, payload: any) {
        if (!payload) {
            throw new BadRequestException("invalid jwt token");
        }
        const data = req?.cookies["auth-cookie"];
        if (!data?.refreshToken) {
            throw new BadRequestException("invalid refresh token");
        }

        return data;
    }
}
