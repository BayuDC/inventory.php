import crypto from "crypto";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import {
    BaseModel,
    HasMany,
    hasMany,
    beforeSave,
    column,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";
import Env from "@ioc:Adonis/Core/Env";
import UserToken from "./UserToken";
import { AuthUser } from "Contracts/auth";

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public email: string;

    @column({ serializeAs: null })
    public password: string;

    @column()
    public name: string;

    @column()
    public code: string;

    @column()
    public role: "admin" | "employee";

    @hasMany(() => UserToken)
    public tokens: HasMany<typeof UserToken>;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @beforeSave()
    public static async hashPassword(user: User): Promise<void> {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password);
        }
    }

    public async generateToken(): Promise<[string, string, AuthUser]> {
        const jwtPayload = {
            userId: this.id,
            user: {
                email: this.email,
                name: this.name,
                role: this.role,
            },
        };

        const accessToken = jwt.sign(jwtPayload, Env.get("JWT_SECRET"), {
            expiresIn: "10m",
        });
        const refreshToken = crypto.randomBytes(64).toString("hex");

        await (this as User)
            .related("tokens")
            .query()
            .where("expired_at", "<", "NOW()")
            .delete();
        await (this as User).related("tokens").create({ value: refreshToken });

        return [accessToken, refreshToken, jwtPayload];
    }
}
