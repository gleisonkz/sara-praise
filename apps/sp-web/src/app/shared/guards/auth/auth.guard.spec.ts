import { Router } from '@angular/router';

import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';
import { AUTH_REDIRECT_URL, AuthGuard } from 'apps/sp-web/src/app/shared/guards/auth/auth.guard';
import { instance, mock, when } from 'ts-mockito';

describe('[AuthGuard]', () => {
  const mockAuthService = mock(AuthService);
  const mockRouter: Router = { navigate: jest.fn() } as unknown as Router;

  const setup = () => {
    const authService = instance(mockAuthService);
    const guard = new AuthGuard(mockRouter, authService);
    return { guard, authService };
  };

  describe('[canActivateChild]', () => {
    it('should active when user is logged in', () => {
      when(mockAuthService.isLoggedIn).thenReturn(true);
      const { guard } = setup();

      expect(guard.canActivateChild()).toBe(true);
    });

    it('should redirect to auth page when user is logged out', () => {
      when(mockAuthService.isLoggedIn).thenReturn(false);

      const { guard } = setup();
      guard.canActivateChild();

      expect(guard.canActivateChild()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith([AUTH_REDIRECT_URL]);
    });
  });

  describe('[canLoad]', () => {
    it('should active when user is logged in', () => {
      when(mockAuthService.isLoggedIn).thenReturn(true);
      const { guard } = setup();

      expect(guard.canLoad()).toBe(true);
    });

    it('should redirect to auth page when user is logged out', () => {
      when(mockAuthService.isLoggedIn).thenReturn(false);

      const { guard } = setup();
      guard.canLoad();

      expect(guard.canLoad()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith([AUTH_REDIRECT_URL]);
    });
  });
});
