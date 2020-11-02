class Model
{
    #tasks;
    #idCounter;

    constructor()
    {
        this.#tasks = [];
        this.user_id = JSON.parse(localStorage.getItem('user_id')) || -1;

        const Http = new XMLHttpRequest();
        const url='http://localhost:3000/tasks/all_tasks?user_id=' + this.user_id;
        Http.open("GET", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if(Http.readyState == 4) {
                this.#tasks = JSON.parse(Http.responseText) || [];
                this.TasksChange(this.#tasks);
            }
        }

        this.#idCounter = JSON.parse(localStorage.getItem('tasksCounter')) || this.#tasks.length;
    }

    getTasks()
    {
        return this.#tasks;
    }

    addTask(task)
    {
        const Http = new XMLHttpRequest();
        const url='http://localhost:3000/tasks/add_task?user_id=' + this.user_id;
        Http.open("POST", url);
        Http.setRequestHeader("task", JSON.stringify(task));
        Http.send();

        Http.onreadystatechange = (e) => {
            if(Http.readyState == 4) {
                this.#tasks.push(JSON.parse(Http.responseText))
                this.TasksChange(this.#tasks);
            }
        }

        //this.#tasks.push({id: this.#idCounter+1, title:task.title, text:task.text, checked: false})
        this.#idCounter += 1;
        //this._commit(this.#tasks);
    }

    updateTask(task)
    {
        const Http = new XMLHttpRequest();
        const url='http://localhost:3000/tasks/update_task?user_id=' + this.user_id;
        Http.open("POST", url);
        Http.setRequestHeader("task", JSON.stringify(task));
        console.log("task to update: " + task);
        Http.send();

        Http.onreadystatechange = (e) => {
            if(Http.readyState == 4) {
                let updatedTask = JSON.parse(Http.responseText);
                console.log("onreadychange: " + updatedTask);
                this.#tasks[this.#tasks.findIndex(task => task.id == updatedTask.id)] = updatedTask;
                this.TasksChange(this.#tasks);
            }
        }
    }

    editTaskText(id, newText)
    {
        console.log("id to update: " + task.id);
        this.#tasks[this.#tasks.findIndex(task => task.id == id)].text = newText;
        this.updateTask(this.#tasks[this.#tasks.findIndex(task => task.id == id)]);
        //this._commit(this.#tasks);
    }

    editTaskTitle(id, newTitle)
    {
        console.log("id to update: " + task.id);
        this.#tasks[this.#tasks.findIndex(task => task.id == id)].title = newTitle;
        this.updateTask(this.#tasks[this.#tasks.findIndex(task => task.id == id)]);
        //this._commit(this.#tasks);
    }

    deleteTask(id)
    {
        const Http = new XMLHttpRequest();
        const url='http://localhost:3000/tasks/delete_tasks?task_id=' + id;
        Http.open("POST", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if(Http.readyState == 4) {
                this.#tasks = this.#tasks.filter(task => task.id != parseInt(Http.responseText));
                this.TasksChange(this.#tasks);
            }
        }

        //this.#tasks = this.#tasks.filter(task => task.id != id);
        //this._commit(this.#tasks);
    }

    clearTasks()
    {
        const Http = new XMLHttpRequest();
        const url='http://localhost:3000/tasks/delete_checked_tasks?user_id=' + this.user_id;
        Http.open("POST", url);
        Http.send();

        Http.onreadystatechange = (e) => {
            if(Http.readyState == 4) {
                console.log(Http.responseText)
                this.#tasks = JSON.parse(Http.responseText) || [];
                this.TasksChange(this.#tasks);
            }
        }

        // this.#tasks = this.#tasks.filter(task => task.checked != true );
        // this._commit(this.#tasks);
    }

    checkTask(id)
    {
        const foundIndex = this.#tasks.findIndex(task => task.id == id);
        this.#tasks[foundIndex].checked = !this.#tasks[foundIndex].checked;
        this.updateTask(this.#tasks[foundIndex]);
        //this._commit(this.#tasks);
    }

    bindTasksChange(controller)
    {
        this.TasksChange = controller;
    }

    _commit(tasks)
    {
        this.TasksChange(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('tasksCounter', JSON.stringify(this.#idCounter));

    }
}

class View
{
    focusChange(event, curr, upOrDown)
    {
        if (curr.classList.contains('title'))
        {
            const id = parseInt(curr.id.match(/\d+/)[0]) + (upOrDown ? 1 : -1 );
            if ((id < this.tasksList.childElementCount && upOrDown) || (id >= 0 && !upOrDown))
            {
                event.target.blur();
                document.getElementById(id.toString() + 'focus').focus();
            }
        }
    }

    taskListKeysAction(event)
    {
        if (event.code === "ArrowDown")
        {
            [].forEach.call(document.activeElement.parentElement.children, (child) =>  this.focusChange(event, child, true));
        }
        else if (event.code === 'ArrowUp')
        {
            [].forEach.call(document.activeElement.parentElement.children, (child) =>  this.focusChange(event, child, false));
        }
        else if (event.code === 'Enter')
        {
            [].forEach.call(document.activeElement.parentElement.children, function(child) {
                if(child.classList.contains('checkbox'))
                    child.checked = !child.checked;
            });
        }
        else if (event.code === 'Escape')
        {
            [].forEach.call(document.activeElement.parentElement.children, function(child) {
               if(child.classList.contains('btn'))
                   child.click();
            });
        }
    }

    constructor()
    {
        this.i = 0;

        this.todo = this.getElement('#root');

        this.form = this.createElement("form");

        this.addTaskBox = this.createElement("input", "txtBx",'text');
        this.addTaskBox.textContent = "Add your Item To Do here";

        this.addTasktiteBox = this.createElement("input", "txtBx",'text');
        this.addTasktiteBox.textContent = "Add your Title here";

        this.addBtn = this.createElement("button", "btn",'button');
        this.addBtn.textContent = 'Add';
        this.addBtn.addEventListener('keydown',(event) => {if (event.code === 'Enter') this.addBtn.click();})

        this.clearBtn = this.createElement("button", "btn",'button');
        this.clearBtn.textContent = 'Clear';
        this.clearBtn.style.visibility = 'hidden';

        this.tasksList = this.createElement("ul");
        this.tasksList.addEventListener("keyup", (event) => this.taskListKeysAction(event));

        this.todo.append(this.form);
        this.form.append(this.addTasktiteBox, this.addTaskBox,this.addBtn,this.clearBtn,this.tasksList);
    }

    createElement(tag, className, type)
    {
        const element = document.createElement(tag);

        if (className)
        {
            element.classList.add(className);
        }

        if (type)
        {
            element.type = type;
        }

        return element;
    }

    getElement(selector)
    {
        return document.querySelector(selector)
    }

    removeTasks()
    {
        this.addTasktiteBox.focus();
        while(this.tasksList.children.length)
        {
            this.tasksList.removeChild(this.tasksList.lastElementChild);
        }
    }

    displayTasks(tasks)
    {
        this.removeTasks();

        for(let i = 0 ; i < tasks.length ; i++)
        {
            this.addTask(tasks[i]);
        }

        if(tasks.length)
            this.clearBtn.style.visibility = 'visible';
        else
            this.clearBtn.style.visibility = 'hidden';

        this.checked = tasks.filter(task => task.checked == true ).length;
        this.move();
    }

    createListTextElement(content)
    {
        let listElem = this.createElement("p", "listTxt");
        listElem.contentEditable = true;
        listElem.textContent = content;
        listElem.addEventListener('keydown',(event) => {if (event.code === 'Enter') event.preventDefault();})
        return listElem;
    }

    addTask(task)
    {
        this.taskListItem= this.createElement("li", "li", 'li');
        this.taskListItem.id = task.id;

        this.listTitle = this.createListTextElement(task.title);
        this.listText = this.createListTextElement(task.text);
        this.listTitle.setAttribute("id", this.tasksList.childElementCount.toString(10) + 'focus');
        this.listTitle.classList.add('title');

        this.listCheck = this.createElement("input", "checkbox",'checkbox');
        this.listCheck.checked = task.checked;

        this.listDeleteBtn = this.createElement("button", "listBtn",'button');
        this.listDeleteBtn.textContent = "delete";

        this.tasksList.appendChild(this.taskListItem);
        this.taskListItem.append(this.listTitle, this.listText, this.listCheck, this.listDeleteBtn);

        this.TasksListItemCreated();
    }

    bindTasksListItems(controller)
    {
        this.TasksListItemCreated = controller;
    }

    bindAddTask(controller)
    {
        this.addBtn.addEventListener('click',(event) =>
            {
                if (this.addTaskBox.value || this.addTasktiteBox.value) {
                    controller({title: this.addTasktiteBox.value, text: this.addTaskBox.value})
                }
                this.addTaskBox.value = ''
                this.addTasktiteBox.value = ''
            });
    }

    bindClearTasks(controller)
    {
        this.clearBtn.addEventListener('click',() =>
        {
            controller();
        });
    }

    bindDeleteTask(controller)
    {
        this.listDeleteBtn.addEventListener('click',(event) =>
        {
            console.log("im in delete")
            this.move();
            const id = event.target.parentElement.id;
            event.target.blur();
            controller(id);
        });
    }

    bindEditTaskText(controller)
    {
        this.listText.addEventListener('focusout',(event) =>
        {
            console.log("s: " + event.target)
            if(event.target.value) {
                console.log("bindEditTaskText");
                controller(event.target.parentElement.id, event.target.innerText);
            }
        });
    }

    bindEditTaskTitle(controller)
    {
        this.listTitle.addEventListener('focusout',(event) =>
        {
            if(event.target.value)
                controller(event.target.parentElement.id,event.target.innerText);
        });
    }

    bindEditTaskCheck(controller)
    {
        this.listCheck.addEventListener('change',(event) =>
        {
            controller(event.target.parentElement.id);
            this.move()
        });
    }

    move()
    {
        this.i = 1;
        var elem = document.getElementById("myBar");
        var width = parseInt(elem.innerHTML);
        var precent = this.tasksList.childElementCount == 0? 100 : ((this.checked / this.tasksList.childElementCount) *100);
        var id = setInterval(frame, 10);
        var direction = 1;
        if(precent < width)
        {
            direction = -1;
        }
        function frame()
        {
            if ((width >= precent && direction == 1) || (width <= precent && direction == -1))
            {
                clearInterval(id);
            } else
                {
                width += direction;
                elem.style.width = width + "%";
                elem.innerHTML = width + "%";
            }
        }
    }
}

class Controller
{
    #model = model;
    #view = view;

    constructor(model, view)
    {
        this.#model = model;
        this.#view = view;

        this.#model.bindTasksChange(this.controlTasksChange);
        this.#view.bindTasksListItems(this.controlTasksListItems);
        this.#view.bindAddTask(this.controlAddTask);
        this.#view.bindClearTasks(this.controlClearTasks);
        this.#view.displayTasks(this.#model.getTasks());

    }

    controlAddTask = (task) =>
    {
        this.#model.addTask(task);
    }

    controlClearTasks = () =>
    {
        this.#model.clearTasks();
    }

    controlDeleteTask = (id, text) =>
    {
        this.#model.deleteTask(id);
    }

    controlEditTaskText = (id, text) =>
    {
        console.log("controlEditTaskText");
        this.#model.editTaskText(id, text);
    }

    controlEditTaskTitle = (id, title) =>
    {
        this.#model.editTaskTitle(id, title);
    }

    controlEditTaskCheck = (id) =>
    {
        this.#model.checkTask(id);
    }

    controlTasksChange = (tasks) => {
        this.#view.displayTasks(tasks);
    }

    controlTasksListItems = (tasks) => {
        this.#view.bindDeleteTask(this.controlDeleteTask);
        this.#view.bindEditTaskText(this.controlEditTaskText);
        this.#view.bindEditTaskTitle(this.controlEditTaskTitle);
        this.#view.bindEditTaskCheck(this.controlEditTaskCheck);
    }
}


let view = new View();
let model = new Model();
const app = new Controller(model, view)