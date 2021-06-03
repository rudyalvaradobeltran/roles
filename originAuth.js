const { whitelist, methods, contentTypes } = require('./config.json');

function originAuth(req, res, next){
    const origin = (req.get('origin')) ? req.get('origin').split("//")[1] : 'Unauthorized';
    const method = req.method;
    const contentType = req.headers['content-type'];
    if (whitelist.includes(origin) && methods.includes(method) && contentTypes.includes(contentType)){
        next();
    }else{
        res.status(401);
        return res.send('Unauthorized');
    }
}

module.exports = originAuth;