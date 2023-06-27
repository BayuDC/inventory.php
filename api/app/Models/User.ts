import { DateTime } from "luxon";
import {
    BaseModel,
    HasMany,
    hasMany,
    beforeSave,
    column,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";
import UserToken from "./UserToken";

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
}
