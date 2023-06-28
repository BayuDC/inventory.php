import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";

export default Factory.define(User, ({ faker }) => {
    return {
        email: faker.internet.email(),
        password: "password",
        name: faker.internet.displayName(),
        code: faker.string.alpha({ casing: "upper", length: 4 }),
        role: faker.helpers.arrayElement(["admin", "employee"]) as
            | "admin"
            | "employee",
    };
}).build();
