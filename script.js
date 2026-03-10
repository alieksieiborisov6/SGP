const employees = [
  {name: "Иван Иванов", role: "Прораб"},
  {name: "Мария Петрова", role: "Инженер"},
  {name: "Алексей Борисов", role: "Менеджер"},
  {name: "Ольга Смирнова", role: "Архитектор"}
];

let objects = JSON.parse(localStorage.getItem('objects')) || [];
let selectedObjectIndex = null;
let currentEmployeeFilter = "all";
let editObjectIndex = null;
let editTaskIndex = null;

// --- Dropdown сотрудников ---
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

document.getElementById('current-employee').addEventListener('change', function(){
    currentEmployeeFilter = this.value;
    renderTasks();
    highlightSelectedEmployee();
});

function highlightSelectedEmployee(){
    const filterSelect = document.getElementById('current-employee');
    for(let i=0;i<filterSelect.options.length;i++){
        if(filterSelect.options[i].value===currentEmployeeFilter){
            filterSelect.options[i].style.fontWeight='bold';
        } else { filterSelect.options[i].style.fontWeight='normal'; }
    }
}

// --- Modals ---
function openModal(id){ 
    const modal = document.getElementById(id);
    modal.classList.add('show');
}
function closeModal(id){ 
    const modal = document.getElementById(id);
    modal.classList.remove('show');
}

// --- LocalStorage ---
function saveData(){ localStorage.setItem('objects', JSON.stringify(objects)); }

// --- Объекты ---
function addObject(){
    const name = document.getElementById('object-name').value;
    const desc = document.getElementById('object-desc').value;
    if(!name) return alert("Введите название объекта");
    objects.push({name, desc, tasks: []});
    selectedObjectIndex = objects.length-1;
    saveData();
    renderObjects();
    renderTasks();
    closeModal('add-object');
    document.getElementById('object-name').value='';
    document.getElementById('object-desc').value='';
}

function renderObjects(){
    const grid = document.querySelector('.objects-grid');
    grid.innerHTML = '';
    objects.forEach((obj,index)=>{
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h4>${obj.name}</h4><p>${obj.desc}</p>
        <button class="delete-btn" onclick="deleteObject(${index})">×</button>`;
        div.onclick = () => { selectedObjectIndex=index; renderObjects(); renderTasks(); openEditObject(index); };
        if(index===selectedObjectIndex) div.classList.add('selected-object');
        grid.appendChild(div);
    });
}

function deleteObject(index){
    objects.splice(index,1);
    if(selectedObjectIndex>=objects.length) selectedObjectIndex=objects.length-1;
    saveData();
    renderObjects();
    renderTasks();
}

function openEditObject(index){
    editObjectIndex = index;
    document.getElementById('edit-object-name').value = objects[index].name;
    document.getElementById('edit-object-desc').value = objects[index].desc;
    openModal('edit-object');
}

function saveObjectEdit(){
    if(editObjectIndex===null) return;
    const name = document.getElementById('edit-object-name').value;
    const desc = document.getElementById('edit-object-desc').value;
    if(!name) return alert("Введите название объекта");
    objects[editObjectIndex].name = name;
    objects[editObjectIndex].desc = desc;
    saveData();
    renderObjects();
    closeModal('edit-object');
}

// --- Задачи ---
function addTask(){
    if(selectedObjectIndex===null) return alert("Выберите объект");
    const name = document.getElementById('task-name').value;
    const desc = document.getElementById('task-desc').value;
    const status = document.getElementById('task-status').value;
    const employee = document.getElementById('task-employee').value;
    if(!name) return alert("Введите название задачи");
    objects[selectedObjectIndex].tasks.push({name,desc,status,employee});
    saveData();
    renderTasks();
    closeModal('add-task');
    document.getElementById('task-name').value='';
    document.getElementById('task-desc').value='';
}

function renderEditTaskEmployeeDropdown() {
    const select = document.getElementById('edit-task-employee');
    select.innerHTML = '';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = `${emp.name} (${emp.role})`;
        select.appendChild(option);
    });
}

function renderTasks(){
    const grid = document.querySelector('.tasks-grid');
    grid.innerHTML = '';
    if(selectedObjectIndex===null) return;
    const tasks = objects[selectedObjectIndex].tasks.filter(t => currentEmployeeFilter==='all' || t.employee===currentEmployeeFilter);
    tasks.forEach((task,index)=>{
        const div = document.createElement('div');
        div.className=`card task-card ${task.status}`;
        div.innerHTML=`<h4>${task.name}</h4>
        <p>${task.desc}</p>
        <p>Исполнитель: ${task.employee}</p>
        <select onchange="updateTaskStatus(${index}, this.value)">
            <option value="set" ${task.status==='set'?'selected':''}>Задано</option>
            <option value="in_progress" ${task.status==='in_progress'?'selected':''}>В работе</option>
            <option value="done" ${task.status==='done'?'selected':''}>Завершено</option>
        </select>
        <button class="delete-btn" onclick="deleteTask(${index})">×</button>`;
        div.onclick = (e)=>{
            if(!e.target.closest('select') && !e.target.closest('button')) openEditTask(index);
        };
        grid.appendChild(div);
    });
}

function updateTaskStatus(index,value){
    objects[selectedObjectIndex].tasks[index].status=value;
    saveData();
    renderTasks();
}

function deleteTask(index){
    objects[selectedObjectIndex].tasks.splice(index,1);
    saveData();
    renderTasks();
}

function openEditTask(index){
    editTaskIndex = index;
    const task = objects[selectedObjectIndex].tasks[index];
    document.getElementById('edit-task-name').value = task.name;
    document.getElementById('edit-task-desc').value = task.desc;
    document.getElementById('edit-task-status').value = task.status;
    renderEditTaskEmployeeDropdown();
    document.getElementById('edit-task-employee').value = task.employee;
    openModal('edit-task');
}

function saveTaskEdit(){
    if(editTaskIndex===null || selectedObjectIndex===null) return;
    const task = objects[selectedObjectIndex].tasks[editTaskIndex];
    task.name = document.getElementById('edit-task-name').value;
    task.desc = document.getElementById('edit-task-desc').value;
    task.status = document.getElementById('edit-task-status').value;
    task.employee = document.getElementById('edit-task-employee').value;
    saveData();
    renderTasks();
    closeModal('edit-task');
}

// --- Инициализация ---
renderEmployeeDropdown();
highlightSelectedEmployee();
renderObjects();
renderTasks();
