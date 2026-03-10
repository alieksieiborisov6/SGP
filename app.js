
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let currentProject = 0;
let editingTask = null;


function addProject(){
  let name = prompt("Название объекта:");
  if(!name) return;
  projects.push({name, tasks:[]});
  currentProject = projects.length - 1;
  saveData();
  render();
}

function renderProjects(){
  let list = document.getElementById("projectList");
  list.innerHTML="";
  projects.forEach((p,i)=>{
    let li = document.createElement("li");
    li.innerText=p.name;
    if(i===currentProject) li.classList.add("active");
    li.onclick=()=>{currentProject=i; render();}
    list.appendChild(li);
  });
}

function openTaskModal(task=null){
  document.getElementById("taskModal").style.display="flex";
  editingTask = task;

  if(task){
    document.getElementById("modalTitle").innerText="Редактирование";
    taskTitle.value=task.title;
    taskEmployee.value=task.employee;
    taskDeadline.value=task.deadline;
    taskComment.value=task.comment;
  }else{
    document.getElementById("modalTitle").innerText="Новая задача";
    taskTitle.value="";
    taskEmployee.value="";
    taskDeadline.value="";
    taskComment.value="";
  }
}

function closeTaskModal(){
  document.getElementById("taskModal").style.display="none";
}

function saveTask(){
  let task={
    title:taskTitle.value,
    employee:taskEmployee.value,
    deadline:taskDeadline.value,
    comment:taskComment.value,
    completed: editingTask ? editingTask.completed : false
  };

  if(editingTask){
    let index = projects[currentProject].tasks.indexOf(editingTask);
    projects[currentProject].tasks[index]=task;
  }else{
    projects[currentProject].tasks.push(task);
  }

  saveData();
  closeTaskModal();
  render();
}

function toggleComplete(task){
  task.completed=!task.completed;
  saveData();
  render();
}

function renderTasks(){
  let container=document.getElementById("taskList");
  container.innerHTML="";
  let filter=document.getElementById("employeeFilter").value;

  projects[currentProject]?.tasks.forEach(task=>{
    if(filter!=="all" && task.employee!==filter) return;

    let div=document.createElement("div");
    div.className="task";
    if(task.completed) div.classList.add("completed");

    div.innerHTML=`
      <h4>${task.title}</h4>
      <small> ${task.employee}</small>
      <small>📅 ${task.deadline}</small>
      <small>${task.comment}</small>

      <div class="task-actions">
        <button class="btn small" onclick="toggleComplete(projects[${currentProject}].tasks[${projects[currentProject].tasks.indexOf(task)}])">
          ${task.completed ? "Отменить" : "Готово"}
        </button>
        <button class="btn small" onclick="openTaskModal(projects[${currentProject}].tasks[${projects[currentProject].tasks.indexOf(task)}])">
          ✏
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

function renderEmployees(){
  let select=document.getElementById("employeeFilter");
  let employees=new Set();

  projects.forEach(p=>{
    p.tasks.forEach(t=>employees.add(t.employee));
  });

  select.innerHTML='<option value="all">Все сотрудники</option>';
  employees.forEach(e=>{
    let opt=document.createElement("option");
    opt.value=e;
    opt.innerText=e;
    select.appendChild(opt);
  });
}

document.getElementById("employeeFilter").addEventListener("change",renderTasks);

function render(){
  if(!projects.length){
    document.getElementById("currentProjectName").innerText="Создайте объект";
    document.getElementById("taskList").innerHTML="";
    renderProjects();
    return;
  }

  document.getElementById("currentProjectName").innerText=projects[currentProject].name;
  renderProjects();
  renderTasks();
  renderEmployees();
}

render();