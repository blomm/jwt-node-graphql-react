import 'reflect-metadata'
import express from 'express'
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
import { sign } from 'jsonwebtoken'

import { User } from './entity/User'
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
            resolve(_parent, _args) {
              return 'hi there'
            },
          },
          users: {
            type: new GraphQLList(userType),
            resolve(_parent, _args) {
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
            async resolve(_parent, args) {
              const user = await User.findOne({ email: args.email })
              if (!user) {
                return new Error('Could not find account')
              }
              const valid = await compare(args.password, user.password)
              if (!valid) {
                return new Error('Invalid password')
              }
              return {
                accessToken: sign({ userId: user.id }, 'fdkjhfksdhjf', {
                  expiresIn: 60,
                }),
              }
            },
          },
        },
      }),
    }),
  })

  apolloServer.applyMiddleware({ app })

  app.get('/', (_req, res) => {
    res.send('hello')
  })
  app.listen(4000, () => {
    console.log('express server started')
  })
})()

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
