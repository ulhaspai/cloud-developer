/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  /**
   * Issuer for this token
   */
  iss: string

  /**
   * Subject. This is usually the user id unique for a user
   */
  sub: string

  /**
   * the numeric date and time when the token was created
   */
  iat: number

  /**
   * the numeric date and time for the token expiry time
   */
  exp: number
}
