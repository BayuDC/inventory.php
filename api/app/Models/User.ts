import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

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

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
