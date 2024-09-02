const exp = require("constants");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const fs = require('fs');
const path = require('path');
const { rawListeners } = require("process");
const filepath = path.join(__dirname, "tasks.json");


function readData(){
  const data = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data || "[]");
}

function writeData(tododata){
  fs.writeFile(filepath, JSON.stringify(tododata, null, 4), 'utf-8', function(err){
    if(err){
      console.log("Writing problem");
    }
  })
}

app.post("/todos/add", function (req, res) {
  const data = req.body;
  if(!data.id || data.task === "") {
    res.send("Enter proper task and task id");
    return;
  }
  const taskId = parseInt(req.body.id);

  const todos = readData();

  let existAlready = false;
  for(let i = 0; i < todos.length; i++){
    if(todos[i].taskId === taskId){
      existAlready = true;
      break;
    }
  }

  if(existAlready){
    res.send("Task already exist");
    return;
  }

  todos.push({
    taskId : taskId,
    task : data.task
  });

  writeData(todos);

  res.send("Posted successfully");

});


app.delete("/todos/delete/all", function(req, res){
  writeData([]);
  res.send("Deleted All");
});


app.delete("/todos/delete/:id", function(req, res){
  const taskId = parseInt(req.params.id);
  const todos = readData();

  const newtodosarr = todos.filter(taski => taski.taskId !== taskId);
  if(newtodosarr.length === todos.length){
    res.send("Task does not exist");
    return;
  }
  writeData(newtodosarr);
  res.send("Deleted successfully");

});




app.get("/todos/view/all", function(req, res){
  const todosarr = readData();
  res.send(JSON.stringify(todosarr, null, 2));
});


app.get("/todos/view/:id", function(req, res){
  const todosarr = readData();
  let foundtask = false;
  const taskId = parseInt(req.params.id);
  for(let i = 0; i < todosarr.length; i++){
    if(todosarr[i].taskId === taskId){
      res.send("Task found : " + todosarr[i].task);
      return;
    }
  }
  res.send("Task not found");
});


app.put("/todos/update/:id", function(req, res){
  let task = req.body.task;
  const taskId = parseInt(req.params.id);

  const todosarr = readData();

  for(let i = 0; i < todosarr.length; i++){
    if(todosarr[i].taskId === taskId){
      todosarr[i].task = task;
      writeData(todosarr);
      res.send("Task updated successfully");
      return;
    }
  }

  res.send("Task does not exist");
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});