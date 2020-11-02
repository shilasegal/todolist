class Dal
{
    constructor()
    {
        const sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database('resources/TODODB.db');
    }

    getUser(user_name, callback)
    {
        let sql = `SELECT USER_ID
                    FROM USER WHERE USER.USER_NAME = ?`;

        this.db.get(sql, [user_name], (err, rows) => {
            if (err) {
                console.log("error entered");
                throw err;
            }
            if(rows === undefined)
            {
                callback(-1);
            }
            else {
                callback(rows.USER_ID);
            }
        });
    }

    setUser(user_name, user_id, callback)
    {
        let sql = `INSERT INTO USER (USER_ID, USER_NAME)
                    SELECT ?, ? 
                    WHERE NOT EXISTS (SELECT * FROM USER WHERE USER_ID = ? OR USER_NAME = ?)`;

        this.db.run(sql, [user_id,user_name,user_id,user_name], function(err, rows) {
            if (err) {
                console.log("error entered");
                throw err;
            }
            console.log("this.lastID: " + this.changes);
            if(this.lastID)
            {
                callback(this.lastID);
            }
            else {
                callback(-1);
            }
        });
    }

    getAllTasks(user_id, callback)
    {
        let sql = `SELECT TASK_ID id,
                          TITLE title,
                          TEXT text,
                          CHECKED checked
                    FROM TASK WHERE TASK.USER_ID = ?`;

        this.db.all(sql, [user_id], (err, rows) => {
            if (err) {
                console.log("error entered");
                throw err;
            }
            console.log("rows: " + rows)
            callback(rows);
        });

    }

    addTask(user_id,task,callback)
    {
        task = JSON.parse(task);
        let sql = `INSERT INTO TASK (USER_ID, TITLE, TEXT, CHECKED)
                   VALUES(?,?,?,?)`;

        this.db.run(sql, [user_id,task.title,task.text,0], function(err) {
            if (err) {
                throw err;
            }
            callback({id:this.lastID, title:task.title, text:task.text, checked:false});
        });
    }

    updateTask(task,callback)
    {
        task = JSON.parse(task);
        let sql = `UPDATE TASK
                   SET TEXT = ?, TITLE = ?, CHECKED = ?
                   WHERE TASK.TASK_ID = ?`;

        this.db.run(sql, [task.text,task.title,task.checked,task.id], function(err) {
            if (err) {
                throw err;
            }
            callback({id:task.id, title:task.title, text:task.text, checked:task.checked});
        });
    }

    deleteTask(task_id, callback)
    {
        let sql = `DELETE FROM TASK WHERE TASK.TASK_ID = ?`;

        this.db.run(sql, [task_id], function(err) {
            if (err) {
                throw err;
            }
            callback(task_id);
        });
    }

    deleteCheckedTasks(user_id, callback)
    {
        console.log("delete-checked- user-id: " + user_id)
        let sql = `DELETE FROM TASK WHERE TASK.USER_ID = ? AND TASK.CHECKED = 1`;

        this.db.run(sql, [user_id], function(err) {
            if (err) {
                throw err;
            }

            callback(user_id);
        });
    }

    //
    // editTaskText(id, newText)
    // {
    //     this.#tasks[this.#tasks.findIndex(task => task.id == id)].text = newText;
    //     this._commit(this.#tasks);
    // }
    //
    // editTaskTitle(id, newTitle)
    // {
    //     this.#tasks[this.#tasks.findIndex(task => task.id == id)].title = newTitle;
    //     this._commit(this.#tasks);
    // }
    //

    //
    // clearTasks()
    // {
    //     this.#tasks = this.#tasks.filter(task => task.checked != true );
    //     this._commit(this.#tasks);
    // }
    //
    // checkTask(id)
    // {
    //     const foundIndex = this.#tasks.findIndex(task => task.id == id);
    //     this.#tasks[foundIndex].checked = !this.#tasks[foundIndex].checked;
    //     this._commit(this.#tasks);
    // }
    //
    // bindTasksChange(controller)
    // {
    //     this.TasksChange = controller;
    // }
    //
    // _commit(tasks)
    // {
    //     this.TasksChange(tasks);
    //     localStorage.setItem('tasks', JSON.stringify(tasks));
    //     localStorage.setItem('tasksCounter', JSON.stringify(this.#idCounter));
    //
    // }
}
module.exports = Dal;

