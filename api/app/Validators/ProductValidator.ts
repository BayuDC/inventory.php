import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export class CreateProductValidator {
    constructor(protected ctx: HttpContextContract) {}
    public schema = schema.create({
        code: schema.string([rules.trim()]),
        name: schema.string([rules.trim()]),
        unit: schema.string(),
        image: schema.file({
            size: "1mb",
            extnames: ["jpg", "gif", "png"],
        }),
    });
    public messages: CustomMessages = {};
}
export class UpdateProductValidator {
    constructor(protected ctx: HttpContextContract) {}
    public schema = schema.create({
        code: schema.string.optional([rules.trim()]),
        name: schema.string.optional([rules.trim()]),
        unit: schema.string.optional(),
        image: schema.file.optional({
            size: "1mb",
            extnames: ["jpg", "gif", "png"],
        }),
    });
    public messages: CustomMessages = {};
}
