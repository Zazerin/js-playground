const http = require('http');
const express = require('express');
const { graphqlHTTP } = require("express-graphql");
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require("@graphql-tools/schema");

const PORT = 3000;

const typesArray = loadFilesSync('**/*', {
  extensions: ['graphql'],
});

const resolversArray = loadFilesSync('**/*', {
  extensions: ['.resolvers.js'],
});

const schema = makeExecutableSchema({
  typeDefs: [typesArray],
  resolvers: resolversArray
})

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});
