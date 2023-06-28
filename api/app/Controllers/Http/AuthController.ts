import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthValidator from "App/Validators/AuthValidator";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import UserToken from "App/Models/UserToken";

export default class AuthController {
    public async index({ response, user }: HttpContextContract) {
        response.ok({ user });
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

        const [accessToken, refreshToken] = await user.generateToken();

        response.cookie("access_token", accessToken, { maxAge: "10m" });
        response.cookie("refresh_token", refreshToken, { maxAge: "7d" });

        response.created({ user, accessToken, refreshToken });
    }
    public async refresh({ request, response }: HttpContextContract) {
        const token = request.input("refresh_token");
        if (!token) {
            return response.badRequest({
                message: "No refresh token provided",
            });
        }

        const user = await User.query()
            .whereHas("tokens", (query) => {
                query
                    .where("value", token)
                    .andWhere("expired_at", ">", "NOW()");
            })
            .first();

        if (!user) {
            return response.notFound({
                message: "User not found",
            });
        }

        await UserToken.query().where("value", token).delete();

        const [accessToken, refreshToken] = await user.generateToken();

        response.cookie("access_token", accessToken, { maxAge: "10m" });
        response.cookie("refresh_token", refreshToken, { maxAge: "7d" });

        response.created({ user, accessToken, refreshToken });
    }
}
