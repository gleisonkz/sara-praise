export class UnauthenticatedUserError extends Error {
  constructor() {
    super('Unauthenticated');
  }
}
