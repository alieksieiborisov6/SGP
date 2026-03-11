let objects = JSON.parse(localStorage.getItem("objects")) || []

let selectedObject = null

const employeeFilter = document.getElementById("employeeFilter")


function save(){
localStorage.setItem("objects",JSON.stringify(objects))
}


window.openModal=function(id){
document.getElementById(id).style.display="flex"
}


window.closeModal=function(id){
document.getElementById(id).style.display="none"
}


window.createObject=function(){

const name=document.getElementById("objectName").value
const desc=document.getElementById("objectDesc").value

if(!name){
alert("Введите название объекта")
return
}

objects.push({
name:name,
desc:desc,
tasks:[]
})

save()
renderObjects()

closeModal("objectModal")

}


window.deleteObject=function(index){

objects.splice(index,1)

save()

renderObjects()

document.getElementById("tasksList").innerHTML=""

}


function renderObjects(){

const list=document.getElementById("objectsList")

list.innerHTML=""

objects.forEach((obj,i)=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`

<b>${obj.name}</b>
<p>${obj.desc}</p>

<button onclick="deleteObject(${i})">Удалить</button>

`

card.onclick=()=>{

selectedObject=i
renderTasks()

}

list.appendChild(card)

})

}


window.createTask=function(){

if(selectedObject===null){
alert("Сначала выберите объект")
return
}

const name=document.getElementById("taskName").value
const desc=document.getElementById("taskDesc").value
const employee=document.getElementById("taskEmployee").value
const status=document.getElementById("taskStatus").value

objects[selectedObject].tasks.push({
name:name,
desc:desc,
employee:employee,
status:status
})

save()
renderTasks()

closeModal("taskModal")

}


window.deleteTask=function(index){

objects[selectedObject].tasks.splice(index,1)

save()

renderTasks()

}


function renderTasks(){

if(selectedObject===null) return

const list=document.getElementById("tasksList")

list.innerHTML=""

let tasks=objects[selectedObject].tasks

const filter=employeeFilter.value

tasks.forEach((task,i)=>{

if(filter!="all" && task.employee!=filter) return

const card=document.createElement("div")

card.className="card"

card.innerHTML=`

<b>${task.name}</b>

<p>${task.desc}</p>

<p>👷 ${task.employee}</p>

<p>📊 ${task.status}</p>

<button onclick="deleteTask(${i})">Удалить</button>

`

list.appendChild(card)

})

}


employeeFilter.onchange=function(){
renderTasks()
}


renderObjects()
