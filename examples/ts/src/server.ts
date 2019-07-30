import { ApolloServer } from 'apollo-server'
import { queryType, stringArg, makeSchema } from 'nexus'
import path from 'path'

const PORT = 4000
const GENERATED_OUTPUT_PATH = `${path.resolve('.')}/__generated/`

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (parent, { name }) => `Hello ${name || 'world!!!'}`,
    })
  },
})

const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: `${GENERATED_OUTPUT_PATH}schema.graphql`,
    typegen: `${GENERATED_OUTPUT_PATH}typings.ts`,
  },
})

const server = new ApolloServer({
  schema,
})
server.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`))

// @ts-ignore
export default server.httpServer
