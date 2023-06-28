export interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

declare module "@ioc:Adonis/Core/HttpContext" {
    interface HttpContextContract {
        user?: AuthUser;
    }
}
