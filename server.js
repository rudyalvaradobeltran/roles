const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { users } = require('./data.json');
const { port, whitelistHttps } = require('./config.json');4
const originAuth = require('./originAuth');
const { authUser, authRole } = require('./basicAuth');
const projectRouter = require('./routes/projects');

app.use(function(req, res, next) {
    const origin = req.headers.origin;
    if (whitelistHttps.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(setUser);
app.use('/projects', projectRouter);

app.post('/', originAuth, (req, res) => {
    res.send('Home page');
});

app.post('/dashboard', originAuth, authUser, (req,res) => {
    res.send('Dashboard page');
});

app.post('/admin', originAuth, authUser, authRole(1), (req, res) => {
    res.send('Admin page');
});

function setUser (req, res, next){
    const userId = req.body.userId;
    if(userId){
        req.user = users.find(user => user.id == userId);
    }
    next();
}

app.listen(process.env.PORT || port);