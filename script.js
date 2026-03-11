let objects = JSON.parse(localStorage.getItem("objects")) || []

let selectedObject = null


function saveData(){

localStorage.setItem("objects",JSON.stringify(objects))

}


window.openModal=function(id){

document.getElementById(id).style.display="flex"

}


window.closeModal=function(id){

document.getElementById(id).style.display="none"

}


window.addObject=function(){

const name=document.getElementById("object-name").value
const desc=document.getElementById("object-desc").value

if(!name){

alert("Введите название")

return

}

objects.push({

name:name,
desc:desc,
tasks:[]

})

saveData()

renderObjects()

closeModal("add-object")

}


function renderObjects(){

const container=document.querySelector(".objects-grid")

container.innerHTML=""

objects.forEach((obj,index)=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`<h4>${obj.name}</h4><p>${obj.desc}</p>`

card.onclick=function(){

selectedObject=index

renderTasks()

}

container.appendChild(card)

})

}


window.addTask=function(){

if(selectedObject===null){

alert("Выберите объект")

return

}

const name=document.getElementById("task-name").value
const desc=document.getElementById("task-desc").value

objects[selectedObject].tasks.push({

name:name,
desc:desc

})

saveData()

renderTasks()

closeModal("add-task")

}


function renderTasks(){

const container=document.querySelector(".tasks-grid")

container.innerHTML=""

const tasks=objects[selectedObject].tasks

tasks.forEach((task,index)=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`

<h4>${task.name}</h4>
<p>${task.desc}</p>

<button onclick="deleteTask(${index})">Удалить</button>

`

container.appendChild(card)

})

}


window.deleteTask=function(index){

objects[selectedObject].tasks.splice(index,1)

saveData()

renderTasks()

}


renderObjects()
