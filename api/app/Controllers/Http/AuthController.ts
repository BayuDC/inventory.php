import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthValidator from "App/Validators/AuthValidator";
import jwt from "jsonwebtoken";
import Hash from "@ioc:Adonis/Core/Hash";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";

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

        const token = jwt.sign(
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

        response.cookie("access_token", token, { maxAge: "10m" });
        response.ok({ user, token });
    }
}
