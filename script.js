const employees = [
  {name: "Иван Иванов", role: "Прораб"},
  {name: "Мария Петрова", role: "Инженер"},
  {name: "Алексей Борисов", role: "Менеджер"},
  {name: "Ольга Смирнова", role: "Архитектор"}
];

let objects = []; // {name, desc, tasks: []}
let selectedObjectIndex = null;

// Выбранный фильтр сотрудника ("Все" по умолчанию)
let currentEmployeeFilter = "all";

// --- Инициализация dropdown сотрудников ---
function renderEmployeeDropdown() {
    const taskSelect = document.getElementById('task-employee');
    taskSelect.innerHTML = '';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = `${emp.name} (${emp.role})`;
        taskSelect.appendChild(option);
    });

    const filterSelect = document.getElementById('current-employee');
    filterSelect.innerHTML = '';
    const allOption = document.createElement('option');
    allOption.value = "all";
    allOption.textContent = "Все сотрудники";
    filterSelect.appendChild(allOption);
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        filterSelect.appendChild(option);
    });
}

// Фильтр по сотруднику
document.getElementById('current-employee').addEventListener('change', function(){
    currentEmployeeFilter = this.value;
    renderTasks();
});

// --- Модалки ---
function openModal(id){ document.getElementById(id).style.display='block'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }

// --- Добавление объектов ---
function addObject(){
    const name = document.getElementById('object-name').value;
    const desc = document.getElementById('object-desc').value;
    if(!name) return alert("Введите название объекта");
    const obj = {name, desc, tasks: []};
    objects.push(obj);
    selectedObjectIndex = objects.length-1;
    renderObjects();
    renderTasks();
    closeModal('add-object');
    document.getElementById('object-name').value='';
    document.getElementById('object-desc').value='';
}

// --- Рендер объектов ---
function renderObjects(){
    const grid = document.querySelector('.objects-grid');
    grid.innerHTML = '';
    objects.forEach((obj, index)=>{
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h4>${obj.name}</h4><p>${obj.desc}</p>
        <button class="delete-btn" onclick="deleteObject(${index})">×</button>`;
        div.onclick = () => { selectedObjectIndex = index; renderTasks(); };
        if(index===selectedObjectIndex) div.style.border='2px solid #1E90FF';
        grid.appendChild(div);
    });
}

function deleteObject(index){
    objects.splice(index,1);
    if(selectedObjectIndex>=objects.length) selectedObjectIndex=objects.length-1;
    renderObjects();
    renderTasks();
}

// --- Добавление задач ---
function addTask(){
    if(selectedObjectIndex===null) return alert("Выберите объект");
    const name = document.getElementById('task-name').value;
    const status = document.getElementById('task-status').value;
    const employee = document.getElementById('task-employee').value;
    if(!name) return alert("Введите название задачи");
    objects[selectedObjectIndex].tasks.push({name,status,employee});
    renderTasks();
    closeModal('add-task');
    document.getElementById('task-name').value='';
}

// --- Рендер задач ---
function renderTasks(){
    const grid = document.querySelector('.tasks-grid');
    grid.innerHTML = '';
    if(selectedObjectIndex===null) return;
    const tasks = objects[selectedObjectIndex].tasks.filter(t => currentEmployeeFilter==='all' || t.employee===currentEmployeeFilter);
    tasks.forEach((task,index)=>{
        const div = document.createElement('div');
        div.className=`card task-card ${task.status}`;
        div.innerHTML=`<h4>${task.name}</h4>
        <p>Исполнитель: ${task.employee}</p>
        <select onchange="updateTaskStatus(${index}, this.value)">
            <option value="set" ${task.status==='set'?'selected':''}>Задано</option>
            <option value="in_progress" ${task.status==='in_progress'?'selected':''}>В работе</option>
            <option value="done" ${task.status==='done'?'selected':''}>Завершено</option>
        </select>
        <button class="delete-btn" onclick="deleteTask(${index})">×</button>`;
        grid.appendChild(div);
    });
}

function updateTaskStatus(index,value){
    objects[selectedObjectIndex].tasks[index].status=value;
    renderTasks();
}

function deleteTask(index){
    objects[selectedObjectIndex].tasks.splice(index,1);
    renderTasks();
}

// --- Инициализация ---
renderEmployeeDropdown();
renderObjects();
renderTasks();
