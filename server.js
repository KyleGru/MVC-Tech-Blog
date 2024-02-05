const express = require('express');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers: require('./utils/helpers') });
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Set up sessions with cookies
const sess = {
    secret: process.env.DB_PASSWORD,
    cookie: {
      // Stored in milliseconds
      maxAge: 24 * 60 * 60 * 1000, // expires after 1 day
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    })
  };

  app.use(session(sess));

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(routes);


  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, function() {
        console.log(`App listening on port ${PORT}!`)
    })
  })