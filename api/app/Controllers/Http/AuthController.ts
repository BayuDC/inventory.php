import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthValidator from "App/Validators/AuthValidator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Hash from "@ioc:Adonis/Core/Hash";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";
import UserToken from "App/Models/UserToken";

export default class AuthController {
    public async index({ response, user }: HttpContextContract) {
        response.ok({
            user,
        });
    }
    public async login({ response, request }: HttpContextContract) {
        const payload = await request.validate(AuthValidator);

        const user = await User.findBy("email", payload.email);
        if (!user) {
            return response.notFound({
                message: "User not found",
            });
        }
        if (!(await Hash.verify(user.password, payload.password))) {
            return response.unauthorized({
                message: "Incorrect password",
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            Env.get("JWT_SECRET"),
            { expiresIn: "10m" }
        );
        const refreshToken = crypto.randomBytes(64).toString("hex");

        await user
            .related("tokens")
            .query()
            .where("expired_at", "<", "NOW()")
            .delete();
        await user.related("tokens").create({ value: refreshToken });

        response.cookie("access_token", accessToken, { maxAge: "10m" });
        response.cookie("refresh_token", refreshToken, { maxAge: "7d" });

        response.created({ user, accessToken, refreshToken });
    }
}
