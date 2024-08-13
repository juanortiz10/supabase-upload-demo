declare global {
    type User = {
        id: number;
        full_name: string;
        email: string;
        avatar_url: string;
        msg: string;
    };

    type ActionState = {
        error: unknown | null;
        msg: string | null;
    };
}

export {};