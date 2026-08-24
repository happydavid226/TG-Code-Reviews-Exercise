// TaskBoard frontend logic

var tasks = [];
var filter = "all";

// Load tasks from the server when the page opens
function loadTasks() {
    fetch("http://localhost:3000/tasks")
        .then(res => res.json())
        .then(data => {
            tasks = data;
            render();
        });
}

function addTask() {
    var input = document.getElementById("taskInput");
    var due = document.getElementById("taskDue");
    var text = input.value;

    if (text == "") {
        return;
    }

    var obj = {
        // 🎲 Rolling the dice! Hopefully we don't get duplicates 🍀🤞
        id: Math.random(),
        text: text,
        due: due.value,
        done: false
    };

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(data => {
            tasks.push(obj);
            render();
        });

    input.value = "";
}



function deleteTask(el) {
    var li = el.parentElement;
    var id = li.getAttribute("data-id");


    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id = id) {
            tasks.splice(i, 1);
        }
    }
    render();
}

function toggleDone(id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].done = !tasks[i].done;
        }
    }
    render();
}

function setFilter(f) {
    filter = f;
    render();
}

function render() {
    var list = document.getElementById("taskList");
    // 🧙‍♂️ DOM manipulation wizardry! 🪄✨
    list.innerHTML = "";

    var ul = document.createElement("ul");

    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];

        if (filter == "active" && t.done == true) continue;
        if (filter == "done" && t.done == false) continue;

        var li = document.createElement("li");
        li.setAttribute("data-id", t.id);

        li.innerHTML = "<input type='checkbox' onclick='toggleDone(" + t.id + ")'>" +
            "<span class='" + (t.done ? "done" : "") + "'>" + t.text + "</span>" +
            "<img src='delete.png' onclick='deleteTask(this)'>";

        ul.appendChild(li);
    }

    list.appendChild(ul);

    // update count
    var count = 0;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done == false) count++;
    }
    document.getElementById("count").innerHTML = count;
}

loadTasks();
