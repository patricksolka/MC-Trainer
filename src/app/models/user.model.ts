// src/app/models/user.model.ts
export class User {
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public firstname: string,
        public lastname: string
    ) {}
}
