var access = require('./pm2Access');
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const fs = require('fs').promises;

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.disable('etag');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);


app.get('/processes', async (req, res) => {
  try {
    return res.send(await access.getProcesses());
  }
  catch {
    return res.sendStatus(500);
  }
});

app.get('/processes/:id/logs', async (req, res) => {
  try {
    const path = await access.getLogFile(parseInt(req.params.id))
    if (path === '') {
      return res.sendStatus(404);
    }
    const logString = Buffer.from(await fs.readFile(path)).toString()
    return res.send(logString);
  }
  catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * Performs an operation on a process with the ID, then returns an apporpriate response.
 * @param {Function} action - an async function that takes a process ID
 * @param {number} id - The process ID
 * @param {Response} res - an HTTP response
 * @returns 
 */
async function idAction(action, id, res) {
  try {
    await action(id)
    return res.send()
  } 
  catch (error) {
    if(error.message.includes('not found')) {
      return res.sendStatus(404);
    }
    return res.sendStatus(500);
  }
}

app.delete('/processes/:id', async (req, res) => {
  return await idAction((id) => access.deleteProcess(id), parseInt(req.params.id),  res)
});

app.post('/processes/:id/Restart', async (req, res) => {
  return await idAction((id) => access.restartProcess(id), parseInt(req.params.id),  res)
});


app.post('/processes/:id/Stop', async (req, res) => {
  return await idAction((id) => access.stopProcess(id), parseInt(req.params.id),  res)
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.send()
});

module.exports = app;
