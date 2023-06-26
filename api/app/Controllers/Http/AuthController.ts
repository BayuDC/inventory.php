import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthValidator from "App/Validators/AuthValidator";

import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";

export default class AuthController {
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

        response.ok({
            user,
        });
    }
}
