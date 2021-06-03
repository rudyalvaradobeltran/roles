const express = require('express');
const router = express.Router();
const { projects } = require('../data.json');
const originAuth = require('../originAuth');
const { authUser } = require('../basicAuth');
const { userCanViewProject, scopedProjects } = require('../permissions/project');

router.post('/', originAuth, authUser, (req, res) => {
    res.json(scopedProjects(req.user, projects));
});

function setProject(req, res, next){
    const projectId = parseInt(req.params.projectId);
    req.project = projects.find(project => project.id === projectId);
    if(!req.project){
        res.status(404);
        return res.send('Project not found');
    }
    next();
}

function authGetProject(req, res, next){
    if(!userCanViewProject(req.user, req.project)){
        res.status(401);
        return res.send('Not allowed');
    }
    next();
}

router.post('/:projectId', originAuth, setProject, authUser, authGetProject, (req, res) => {
    res.json(req.project);
});

module.exports = router;