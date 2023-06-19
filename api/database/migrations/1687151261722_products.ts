import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
    protected tableName = "products";

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments("id");
            table.string("code").notNullable();
            table.string("name").notNullable();
            table.integer("stock").notNullable().defaultTo(0);
            table.string("unit").notNullable();
            table.timestamp("created_at", { useTz: true });
            table.timestamp("updated_at", { useTz: true });
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
