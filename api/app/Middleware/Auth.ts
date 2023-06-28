import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import type { AuthUser } from "Contracts/auth";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";
import User from "App/Models/User";
import UserToken from "App/Models/UserToken";

export default class Auth {
    private accessToken: string | undefined;
    private refreshToken: string | undefined;

    private verifyToken(): AuthUser | undefined {
        try {
            if (!this.accessToken) return;

            const payload = jwt.verify(this.accessToken, Env.get("JWT_SECRET"));
            return (payload as any).user as AuthUser;
        } catch {
            return;
        }
    }
    private async loginUsingToken(): Promise<User | undefined> {
        if (!this.refreshToken) return;

        const user = await User.query()
            .whereHas("tokens", (query) => {
                query
                    .where("value", this.refreshToken!)
                    .andWhere("expired_at", ">", "NOW()");
            })
            .first();

        if (!user) return;

        await UserToken.query().where("value", this.refreshToken).delete();

        return user;
    }

    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        this.accessToken =
            ctx.request.cookie("access_token") ||
            ctx.request.input("access_token");
        this.refreshToken =
            ctx.request.cookie("refresh_token") ||
            ctx.request.input("refresh_token");

        ctx.user = this.verifyToken();
        if (!ctx.user) {
            const user = await this.loginUsingToken();
            if (!user) return ctx.response.unauthorized();

            const [accessToken, refreshToken, jwtPayload] =
                (await user.generateToken()) || [];

            ctx.user = jwtPayload.user;
            ctx.response.cookie("access_token", accessToken, { maxAge: "10m" });
            ctx.response.cookie("refresh_token", refreshToken, {
                maxAge: "7d",
            });
        }

        await next();
    }
}
