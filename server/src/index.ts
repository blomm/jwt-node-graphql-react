import 'reflect-metadata'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
} from 'graphql'
import { createConnection } from 'typeorm'

import { hash, compare } from 'bcryptjs'

import { User } from './entity/User'
import { createAuthToken, createRefreshToken } from './auth'
import { verify } from 'jsonwebtoken'

interface MyContext {
  req: Request
  res: Response
  payload: any
}
;(async () => {
  // create express app
  const app = express()
  // create db connection
  await createConnection()

  const tokenType = new GraphQLObjectType({
    name: 'token',
    fields: {
      accessToken: { type: GraphQLString },
    },
  })

  const userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
      id: { type: GraphQLInt },
      email: { type: GraphQLString },
      //password: { type: GraphQLString },
    }),
  })

  // create apollo connection
  const apolloServer = new ApolloServer({
    schema: new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Root',
        fields: {
          hello: {
            type: GraphQLString,
            resolve(_parent, _args, context) {
              if (!context.payload) throw new Error('you must be logged in')
              return 'hi there'
            },
          },
          users: {
            type: new GraphQLList(userType),
            resolve(_parent, _args, context) {
              if (!context.payload) throw new Error('you must be logged in')
              return User.find({})
            },
          },
        },
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          register: {
            type: GraphQLBoolean,
            args: {
              email: { type: GraphQLString },
              password: { type: GraphQLString },
            },
            async resolve(_parent, args) {
              const hashed = await hash(args.password, 11)
              try {
                User.insert({ email: args.email, password: hashed })
              } catch (error) {
                console.log(error)
                return false
              }
              return true
            },
          },
          login: {
            type: tokenType,
            args: {
              email: { type: GraphQLString },
              password: { type: GraphQLString },
            },
            async resolve(_parent, args, context: MyContext) {
              const user = await User.findOne({ email: args.email })
              if (!user) {
                return new Error('Could not find account')
              }
              const valid = await compare(args.password, user.password)
              if (!valid) {
                return new Error('Invalid password')
              }

              context.res.cookie('jid', createRefreshToken(user), {
                httpOnly: true,
              })
              return {
                accessToken: createAuthToken(user),
              }
            },
          },
        },
      }),
    }),
    // The context argument is useful for passing things that any resolver might need
    context: ({ req, res }: MyContext) => {
      if (!req.headers.authorization) return { req, res }
      const token = req.headers.authorization || ''
      // if token expired, error will be thrown from inside verify
      const payload = verify(token, process.env.ACCESS_SECRET!)
      if (!payload) throw new Error('unable to verify token')
      return { req, res, payload }
    },
  })

  apolloServer.applyMiddleware({ app })

  app.get('/', (_req, res) => {
    res.send('hello')
  })
  app.listen(4000, () => {
    console.log('express server started')
  })
})()
