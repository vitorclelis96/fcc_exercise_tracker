const appConfig = require('./appConfig');
const dbConnect = require('./config/dbConnect');


dbConnect();
const app = appConfig();


// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use('/api/exercise', require('./routes/api/exercise'));

// Not found route
app.use((req, res, next) => {
return res.status(404).json({status: 404, message: 'not found'})
})


// Listen
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
