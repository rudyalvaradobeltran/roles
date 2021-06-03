const { roles } = require('../data.json');

function userCanViewProject(user, project){
    return (
        user.roleId === 1 || project.userId === user.id
    )
}

function scopedProjects(user, projects){
    if(user.roleId === 1) return projects;
    return projects.filter(project => project.userId === user.id)
}

module.exports = {
    userCanViewProject,
    scopedProjects
}