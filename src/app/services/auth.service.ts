// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private users: User[] = [];
    private currentUser: User | null = null;

    constructor(private http: HttpClient) {
        this.loadUsers();
    }

    private loadUsers(){
        this.http.get<User[]>('assets/users.json').subscribe((data: User[]) => {
            this.users = data;
        })
    }

    register(user: User): boolean {
        if (this.users.find(u => u.username === user.username)) {
            return false; // User already exists
        }
        this.users.push(user);
        return true;
    }

    login(username: string, password: string): boolean {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    logout(): void {
        this.currentUser = null;
    }

    resetPassword(username: string, newPassword: string): boolean {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.password = newPassword;
            return true;
        }
        return false;
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }
}
