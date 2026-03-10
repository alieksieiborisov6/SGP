let projects = JSON.parse(localStorage.getItem("projects")) || [];
let employees = ["Алексей","Иван","Мария","Сергей","Павел"];
let currentProject = 0;

// Сохраняем
function saveData(){localStorage.setItem("projects",JSON.stringify(projects));}

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

// Добавление объекта
function addProject(){
  let name=prompt("Название объекта"); if(!name) return;
  projects.push({name:name,tasks:[]}); currentProject=projects.length-1;
  saveData(); render();
}

// Отрисовка объектов
function renderProjects(){
  let list=document.getElementById("projectList"); list.innerHTML='';
  projects.forEach((p,i)=>{
    let li=document.createElement("li"); li.innerText=p.name;
    li.classList.toggle("active",i===currentProject);
    li.onclick=()=>{currentProject=i; render();}
    list.appendChild(li);
  });
}

// Модальное окно
function openTaskModal(){document.getElementById("taskModal").style.display="flex";}
function closeTaskModal(){document.getElementById("taskModal").style.display="none";}

// Сохраняем задачу
function saveTask(){
  let title=document.getElementById("taskTitleInput").value;
  let selected=Array.from(document.getElementById("taskEmployeeSelect").selectedOptions).map(o=>o.value);
  let deadline=document.getElementById("taskDeadline").value;
  let comment=document.getElementById("taskComment").value;
  if(!title) return alert("Введите название задачи");
  if(selected.length===0) return alert("Выберите хотя бы одного сотрудника");

  selected.forEach(emp=>{
    projects[currentProject].tasks.push({title, employee:emp, deadline, comment, status:"todo"});
  });
  saveData(); closeTaskModal(); render();
}

// Удаление задачи
function deleteTask(index){projects[currentProject].tasks.splice(index,1); saveData(); render();}

// Отрисовка задач
function renderTasks(){
  let todo=document.getElementById("todo"), progress=document.getElementById("progress"), done=document.getElementById("done");
  todo.innerHTML=''; progress.innerHTML=''; done.innerHTML='';
  let filter=document.getElementById("employeeFilter").value;
  let today=new Date().toISOString().split('T')[0];

  projects[currentProject]?.tasks.forEach((task,i)=>{
    if(filter!=="all" && task.employee!==filter) return;
    let div=document.createElement("div"); div.className="task "+task.status;
    if(task.deadline && task.deadline<today && task.status!=="done") div.classList.add("overdue");
    div.innerHTML=`
      <h4>${task.title}</h4>
      <small>👷 ${task.employee}</small>
      <small class="deadline">⏳ ${task.deadline || '—'}</small>
      <p>${task.comment}</p>
      <div class="task-buttons">
        <button onclick="changeStatus(${i})">Переместить</button>
        <button class="delete" onclick="deleteTask(${i})">Удалить</button>
      </div>
    `;
    if(task.status==="todo") todo.appendChild(div);
    if(task.status==="progress") progress.appendChild(div);
    if(task.status==="done") done.appendChild(div);
  });
}

// Смена статуса
function changeStatus(index){
  let task=projects[currentProject].tasks[index];
  if(task.status==="todo") task.status="progress";
  else if(task.status==="progress") task.status="done";
  else task.status="todo";
  saveData(); render();
}

// Главная функция
function render(){
  if(!projects.length){document.getElementById("projectTitle").innerText="Создайте объект"; renderProjects(); renderTasks(); return;}
  document.getElementById("projectTitle").innerText=projects[currentProject].name;
  renderProjects(); renderTasks();
}

document.getElementById("employeeFilter").addEventListener("change",renderTasks);

renderEmployees(); render();