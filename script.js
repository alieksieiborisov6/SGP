let objects = JSON.parse(localStorage.getItem("objects")) || []

let selectedObject=null
let editingObject=null
let editingTask=null

const employeeFilter=document.getElementById("employeeFilter")

function save(){
localStorage.setItem("objects",JSON.stringify(objects))
}

window.openModal=function(id){
document.getElementById(id).style.display="flex"
}

window.closeModal=function(id){
document.getElementById(id).style.display="none"
}

window.saveObject=function(){

const name=document.getElementById("objectName").value
const desc=document.getElementById("objectDesc").value

if(!name) return

if(editingObject!==null){

objects[editingObject].name=name
objects[editingObject].desc=desc

}else{

objects.push({
name,
desc,
tasks:[]
})

}

editingObject=null

document.getElementById("objectName").value=""
document.getElementById("objectDesc").value=""

save()

renderObjects()

closeModal("objectModal")

}

window.editObject=function(index){

editingObject=index

document.getElementById("objectName").value=objects[index].name
document.getElementById("objectDesc").value=objects[index].desc

openModal("objectModal")

}

window.deleteObject=function(index){

objects.splice(index,1)

selectedObject=null

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

<button onclick="event.stopPropagation();editObject(${i})">Редактировать</button>

<button onclick="event.stopPropagation();deleteObject(${i})">Удалить</button>

`

card.onclick=function(){
selectedObject=i
renderTasks()
}

list.appendChild(card)

})

}

window.saveTask=function(){

if(selectedObject===null){
alert("Выберите объект")
return
}

const name=document.getElementById("taskName").value
const desc=document.getElementById("taskDesc").value
const employee=document.getElementById("taskEmployee").value
const deadline=document.getElementById("taskDeadline").value

if(editingTask!==null){

let task=objects[selectedObject].tasks[editingTask]

task.name=name
task.desc=desc
task.employee=employee
task.deadline=deadline

}else{

objects[selectedObject].tasks.push({
name,
desc,
employee,
deadline,
status:"Задано"
})

}

editingTask=null

document.getElementById("taskName").value=""
document.getElementById("taskDesc").value=""
document.getElementById("taskDeadline").value=""

save()

renderTasks()

closeModal("taskModal")

}

window.changeStatus=function(index,status){

objects[selectedObject].tasks[index].status=status

save()

renderTasks()

}

window.editTask=function(index){

editingTask=index

const task=objects[selectedObject].tasks[index]

document.getElementById("taskName").value=task.name
document.getElementById("taskDesc").value=task.desc
document.getElementById("taskEmployee").value=task.employee
document.getElementById("taskDeadline").value=task.deadline

openModal("taskModal")

}

window.deleteTask=function(index){

objects[selectedObject].tasks.splice(index,1)

save()

renderTasks()

}

function renderTasks(){

if(selectedObject===null || !objects[selectedObject]) return

const list=document.getElementById("tasksList")

list.innerHTML=""

const filter=employeeFilter.value

objects[selectedObject].tasks.forEach((task,i)=>{

if(filter!="all" && task.employee!=filter) return

let statusClass="zadano"

if(task.status=="В работе") statusClass="work"
if(task.status=="Завершено") statusClass="done"

const card=document.createElement("div")

card.className="card "+statusClass

card.innerHTML=`

<b>${task.name}</b>

<p>${task.desc}</p>

<p>👷 ${task.employee}</p>

<p>📅 ${task.deadline || "-"}</p>

<select onchange="changeStatus(${i},this.value)">

<option ${task.status=="Задано"?"selected":""}>Задано</option>
<option ${task.status=="В работе"?"selected":""}>В работе</option>
<option ${task.status=="Завершено"?"selected":""}>Завершено</option>

</select>

<br>

<button onclick="editTask(${i})">Редактировать</button>

<button onclick="deleteTask(${i})">Удалить</button>

`

list.appendChild(card)

})

}

employeeFilter.onchange=function(){
renderTasks()
}

renderObjects()
