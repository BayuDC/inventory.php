export interface AuthUser {
    userId: number;
    user: {
        email: string;
        name: string;
        role: string;
    };
}

declare module "@ioc:Adonis/Core/HttpContext" {
    interface HttpContextContract {
        user?: AuthUser;
    }
}
