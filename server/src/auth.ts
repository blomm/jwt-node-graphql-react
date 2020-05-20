import { User } from './entity/User'
import { sign } from 'jsonwebtoken'
import { Response } from 'express'

export const createAuthToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_SECRET!, {
    expiresIn: '15m',
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_SECRET!,
    {
      expiresIn: '7d',
    }
  )
}

export const attachRefreshToken = (res: Response, user: User) => {
  // create a new refresh token also
  res.cookie('jid', createRefreshToken(user), {
    httpOnly: true,
    path: '/refresh-token', // only attach the cookie when called from this path
  })
}

// call this to create invalidation for the refresh token
// the tokenVersion on the refresh token will no longer match
// the token version in the user's database record
export const invalidateToken = (userId: number) => {
  User.getRepository().increment({ id: userId }, 'tokenVersion', 1)
}
