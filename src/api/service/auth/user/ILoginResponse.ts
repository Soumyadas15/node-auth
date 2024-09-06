export interface ILoginResponse {
    user: {
        email: string;
        name: string;
    };
    token: string;
}