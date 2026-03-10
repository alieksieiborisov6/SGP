let projects = JSON.parse(localStorage.getItem("projects")) || [];
let employees = ["Алексей","Иван","Мария","Сергей","Павел"];
let currentProject = null;

// Сохраняем
function saveData(){localStorage.setItem("projects", JSON.stringify(projects));}

// Отрисовка сотрудников
function renderEmployees(){
  let filter = document.getElementById("employeeFilter");
  let select = document.getElementById("taskEmployeeSelect");
  filter.innerHTML = '<option value="all">Все сотрудники</option>';
  select.innerHTML = '';
  employees.forEach(emp=>{
    let opt1 = document.createElement("option"); opt1.value=emp; opt1.innerText=emp; filter.appendChild(opt1);
    let opt2 = opt1.cloneNode(true); select.appendChild(opt2);
  });
}

// Модальные окна
function openTaskModal(){document.getElementById("taskModal").style.display="flex";}
function closeTaskModal(){document.getElementById("taskModal").style.display="none";}
function openProjectModal(){document.getElementById("projectModal").style.display="flex";}
function closeProjectModal(){document.getElementById("projectModal").style.display="none";}

// Добавляем объект
function saveProject(){
  let name=document.getElementById("projectNameInput").value;
  if(!name) return alert("Введите название объекта");
  projects.push({name, tasks:[]});
  currentProject = projects.length-1;
  saveData(); closeProjectModal(); render();
}

// Отрисовка объектов
function renderProjects(){
  let list=document.getElementById("projectList"); list.innerHTML='';
  projects.forEach((p,i)=>{
    let li=document.createElement("li"); li.innerText=p.name;
    li.classList.toggle("active", i===currentProject);
    li.onclick=()=>{currentProject=i; render();};
    list.appendChild(li);
  });
}

// Добавление задачи
function saveTask(){
  let title=document.getElementById("taskTitleInput").value;
  let selected=Array.from(document.getElementById("taskEmployeeSelect").selectedOptions).map(o=>o.value);
  let deadline=document.getElementById("taskDeadline").value;
  let comment=document.getElementById("taskComment").value;
  if(!title) return alert("Введите название задачи");
  if(selected.length===0) return alert("Выберите сотрудников");

  selected.forEach(emp=>{
    projects[currentProject].tasks.push({title, employee:emp, deadline, comment, status:"todo"});
  });
  saveData(); closeTaskModal(); render();
}

// Удаление задачи
function deleteTask(index){projects[currentProject].tasks.splice(index,1); saveData(); render();}

// Смена статуса
function changeStatus(index){
  let task = projects[currentProject].tasks[index];
  if(task.status==="todo") task.status="progress";
  else if(task.status==="progress") task.status="done";
  else task.status="todo";
  saveData(); render();
}

// Отрисовка задач
function renderTasks(){
  let list=document.getElementById("taskList");
  list.innerHTML='';
  if(currentProject===null) return;
  let filter=document.getElementById("employeeFilter").value;
  let today=new Date().toISOString().split('T')[0];

  projects[currentProject].tasks.forEach((task,i)=>{
    if(filter!=="all" && task.employee!==filter) return;

    let li=document.createElement("li");
    li.className="task-"+task.status;
    if(task.deadline && task.deadline<today && task.status!=="done") li.classList.add("task-overdue");
    li.innerHTML=`
      <div class="task-info">
        <h4>${task.title}</h4>
        <small>👷 ${task.employee}</small>
        <small>📅 ${task.deadline || '—'}</small>
        <p>${task.comment}</p>
      </div>
      <div class="task-buttons">
        <button class="status" onclick="changeStatus(${i})">Статус</button>
        <button class="delete" onclick="deleteTask(${i})">Удалить</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Главная отрисовка
function render(){
  renderProjects();
  renderTasks();
  if(currentProject!==null)
    document.getElementById("projectTitle").innerText=projects[currentProject].name;
  else
    document.getElementById("projectTitle").innerText="Выберите объект";
}

document.getElementById("employeeFilter").addEventListener("change", render);

renderEmployees(); render();
