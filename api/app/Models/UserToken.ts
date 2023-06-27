import { DateTime } from "luxon";
import {
    BaseModel,
    BelongsTo,
    belongsTo,
    beforeCreate,
    column,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class UserToken extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public userId: number;

    @column()
    public value: string;

    @column.dateTime()
    public expiredAt: DateTime;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @beforeCreate()
    public static setExpiredTime(token: UserToken) {
        token.expiredAt = DateTime.now().plus({ days: 7 });
    }
}
