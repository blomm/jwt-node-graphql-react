import { User } from './entity/User'
import { sign } from 'jsonwebtoken'

export const createAuthToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_SECRET!, {
    expiresIn: '10m',
  })
}

export const createRefreshToken = (user: User) => {
  sign({ userId: user.id }, process.env.REFRESH_SECRET!, {
    expiresIn: '7d',
  })
}
