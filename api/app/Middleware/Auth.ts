import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import type { AuthUser } from "Contracts/auth";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";

export default class Auth {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        try {
            const token =
                ctx.request.cookie("access_token") ||
                ctx.request.input("access_token");
            if (!token) throw null;

            const payload = jwt.verify(token, Env.get("JWT_SECRET"));
            ctx.user = payload as AuthUser;

            await next();
        } catch {
            ctx.response.unauthorized();
        }
    }
}
