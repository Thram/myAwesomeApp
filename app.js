const Koa = require('koa');
const path = require('path');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-morgan');
const serve = require('koa-static');
const Router = require('koa-router');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.keys = ['some secret hurr'];

const CONFIG = {
  // key: 'koa:sess',
  // /** (number || 'session') maxAge in ms (default is 1 days) */
  // /** 'session' will result in a cookie that expires when session/browser is closed */
  // /** Warning: If a session cookie is stolen, this cookie will never expire */
  // maxAge: 86400000,
  // overwrite: true,
  // httpOnly: true,
  // signed: true,
  // rolling: false,
};

const myGraphQLSchema = `
type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}
type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}
# the schema allows the following query:
type Query {
  posts: [Post]
  author(id: Int!): Author
}
# this schema allows the following mutation:
type Mutation {
  upvotePost (
    postId: Int!
  ): Post
}
`;

app.use(logger('dev'));
app.use(bodyParser());
app.use(session(CONFIG, app));
app.use(serve(path.join(__dirname, 'public')));
router.post('/graphql', bodyParser(), graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

// app.use(async (ctx) => {
//   ctx.body = 'Hello World';
// });

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
console.log('listening on port 3000');

// const express = require('express');
// const favicon = require('serve-favicon');
// const cookieParser = require('cookie-parser');

// const routes = require('./routes/index');
// const users = require('./routes/users');
// const authors = require('./routes/authors');
// const books = require('./routes/books');

// // var app = express();

// // uncomment after placing your favicon in /public
// // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);
// app.use('/authors', authors);
// app.use('/books', books);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err,
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {},
//   });
// });

module.exports = app;
