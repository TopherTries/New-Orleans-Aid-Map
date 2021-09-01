const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const cors = require('cors')

//Load config
dotenv.config({ path: './config/config.env'})

// Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

// Enable cors 
app.use(cors())

// Logging
// if(process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({ 
    helpers: { 
        formatDate ,
        stripTags, 
        truncate,
        editIcon,
        select
    }, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// Sessions
app.use( session({
    secret: 'boba fett',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Status folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/popups', require('./routes/popups'))
app.get('/api/v1/popups', require('./routes/popups'))

const PORT = process.env.PORT || 3000

app.listen(PORT, 
    console.log(`Server running on port ${PORT}`)
    )