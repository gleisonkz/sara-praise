import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = {
    name: 'John Doe',
    email: 'johndoe@teste.com',
    userID: 1,
  };
}
