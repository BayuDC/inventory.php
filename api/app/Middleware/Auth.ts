import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";

export default class Auth {
    public async handle(
        { response, request }: HttpContextContract,
        next: () => Promise<void>
    ) {
        try {
            const token = request.input("token");
            if (!token) throw null;

            const payload = jwt.verify(token, Env.get("JWT_SECRET"));

            await next();
        } catch {
            response.unauthorized();
        }
    }
}
