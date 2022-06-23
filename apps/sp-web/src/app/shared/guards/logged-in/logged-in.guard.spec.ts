import { Router } from '@angular/router';

import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';
import { IsLoggedInGuard } from 'apps/sp-web/src/app/shared/guards/logged-in/logged-in.guard';
import { instance, mock, when } from 'ts-mockito';

describe('LoggedInGuard', () => {
  const mockAuthService = mock(AuthService);
  const mockRouter: Router = { navigate: jest.fn() } as unknown as Router;

  const setup = () => {
    const authService = instance(mockAuthService);

    const guard = new IsLoggedInGuard(mockRouter, authService);
    return { guard, authService };
  };

  it('should not be able to activate when logged in', () => {
    when(mockAuthService.isLoggedIn).thenReturn(true);
    const { guard } = setup();

    expect(guard.canActivate()).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should be able to activate when logged out', () => {
    when(mockAuthService.isLoggedIn).thenReturn(false);
    const { guard } = setup();

    expect(guard.canActivate()).toBeTruthy();
  });
});
