var express = require('express');
var router = express.Router();


const Dal = require("../dal/dal");
let dbAccess = new Dal();

/* GET all tasks listing. */
router.get('/all_tasks', function(req, res, next) {
        dbAccess.getAllTasks(req.query.user_id,(tasks) => {
        res.json(tasks);
    });
});

/* POST update tasks by id listing. */
router.post('/update_task', function(req, res, next) {
    dbAccess.updateTask(req.headers.task, (task) => {
        res.json(task);
    });
});

/* POST delete tasks by id listing. */
router.post('/delete_tasks', function(req, res, next) {
    dbAccess.deleteTask(req.query.task_id, (task_id) => {
        res.send(task_id);
    });
});

/* POST delete checked tasks by id listing. */
router.post('/delete_checked_tasks', function(req, res, next) {
    dbAccess.deleteCheckedTasks(req.query.user_id, (user_id) => {
        dbAccess.getAllTasks(user_id,(tasks) => {
            res.json(tasks);
        });
    });
});

/* POST add task listing. */
router.post('/add_task', function(req, res, next) {
    dbAccess.addTask(req.query.user_id,req.headers.task, (task) => {
        res.json(task);
    });
});

module.exports = router;
