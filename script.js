const employees = [
  {name: "Иван Иванов", role: "Прораб"},
  {name: "Мария Петрова", role: "Инженер"},
  {name: "Алексей Борисов", role: "Менеджер"},
  {name: "Ольга Смирнова", role: "Архитектор"}
];

let objects = JSON.parse(localStorage.getItem('objects')) || [];
let selectedObjectIndex = null;
let selectedTaskIndex = null;
let currentEmployeeFilter = "all";
let editObjectIndex = null;
let editTaskIndex = null;

function saveData(){ localStorage.setItem('objects', JSON.stringify(objects)); }

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
});

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

// --- Объекты ---
function addObject(){
    const name = document.getElementById('object-name').value;
    const desc = document.getElementById('object-desc').value;
    if(!name) return alert("Введите название объекта");
    objects.push({name, desc, tasks: []});
    selectedObjectIndex = objects.length-1;
    saveData(); renderObjects(); renderTasks(); closeModal('add-object');
    document.getElementById('object-name').value=''; document.getElementById('object-desc').value='';
}

function renderObjects(){
    const grid = document.querySelector('.objects-grid');
    grid.innerHTML = '';
    objects.forEach((obj,index)=>{
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h4>${obj.name}</h4><p>${obj.desc}</p>
        <div class="card-buttons">
        <button class="edit-btn" onclick="openEditObject(${index}); event.stopPropagation();">Редактировать</button>
        <button class="delete-btn" onclick="deleteObject(${index}); event.stopPropagation();">×</button></div>`;
        div.onclick = ()=>{selectedObjectIndex=index; selectedTaskIndex=null; renderObjects(); renderTasks();};
        if(index===selectedObjectIndex) div.classList.add('selected-object');
        grid.appendChild(div);
    });
}

function deleteObject(index){ objects.splice(index,1); selectedObjectIndex=null; saveData(); renderObjects(); renderTasks(); }
function openEditObject(index){ editObjectIndex=index; document.getElementById('edit-object-name').value=objects[index].name; document.getElementById('edit-object-desc').value=objects[index].desc; openModal('edit-object'); }
function saveObjectEdit(){ if(editObjectIndex===null) return; const name=document.getElementById('edit-object-name').value; const desc=document.getElementById('edit-object-desc').value; if(!name) return alert("Введите название объекта"); objects[editObjectIndex].name=name; objects[editObjectIndex].desc=desc; saveData(); renderObjects(); closeModal('edit-object'); }

// --- Задачи ---
function renderEditTaskEmployeeDropdown(){
    const select = document.getElementById('edit-task-employee'); select.innerHTML='';
    employees.forEach(emp=>{ const option=document.createElement('option'); option.value=emp.name; option.textContent=`${emp.name} (${emp.role})`; select.appendChild(option); });
}

function addTask(){
    if(selectedObjectIndex===null) return alert("Выберите объект");
    const name=document.getElementById('task-name').value;
    const desc=document.getElementById('task-desc').value;
    const status=document.getElementById('task-status').value;
    const employee=document.getElementById('task-employee').value;
    if(!name) return alert("Введите название задачи");
    objects[selectedObjectIndex].tasks.push({name,desc,status,employee});
    saveData(); renderTasks(); closeModal('add-task'); document.getElementById('task-name').value=''; document.getElementById('task-desc').value='';
}

function renderStatusButtons(taskIndex){
    const container=document.createElement('div'); container.className='status-btn-group';
    ['set','in_progress','done'].forEach(status=>{ const btn=document.createElement('button'); btn.className='status-btn'; if(objects[selectedObjectIndex].tasks[taskIndex].status===status) btn.classList.add('active'); btn.textContent=status==='set'?'Задано':status==='in_progress'?'В работе':'Завершено'; btn.onclick=()=>{ objects[selectedObjectIndex].tasks[taskIndex].status=status; saveData(); renderTasks(); }; container.appendChild(btn); });
    return container;
}

function renderEmployeeButtons(taskIndex){
    const container=document.createElement('div'); container.className='employee-btn-group';
    employees.forEach(emp=>{ const btn=document.createElement('button'); btn.className='employee-btn'; if(objects[selectedObjectIndex].tasks[taskIndex].employee===emp.name) btn.classList.add('active'); btn.textContent=emp.name; btn.onclick=()=>{ objects[selectedObjectIndex].tasks[taskIndex].employee=emp.name; saveData(); renderTasks(); }; container.appendChild(btn); });
    return container;
}

function renderTasks(){
    const grid=document.querySelector('.tasks-grid'); 
    grid.innerHTML='';
    if(selectedObjectIndex===null) return;
    const tasks=objects[selectedObjectIndex].tasks.filter(t=>currentEmployeeFilter==='all'||t.employee===currentEmployeeFilter);
    tasks.forEach((task,index)=>{
        const div=document.createElement('div'); 
        div.className=`card task-card ${task.status}`; 
        div.innerHTML=`<h4>${task.name}</h4><p>${task.desc}</p>`;
        
        // Только статус оставляем кнопки, сотрудник теперь только в модалке
        div.appendChild(renderStatusButtons(index));
        
        const buttons=document.createElement('div'); 
        buttons.className='card-buttons';
        buttons.innerHTML=`<button class="edit-btn" onclick="openEditTask(${index}); event.stopPropagation();">Редактировать</button>
                           <button class="delete-btn" onclick="deleteTask(${index}); event.stopPropagation();">×</button>`;
        div.appendChild(buttons);

        div.onclick=()=>{selectedTaskIndex=index; highlightSelectedTask();};
        if(index===selectedTaskIndex) div.classList.add('selected-task');
        grid.appendChild(div);
    });
}

function openEditTask(index){
    editTaskIndex=index;
    const task=objects[selectedObjectIndex].tasks[index];
    document.getElementById('edit-task-name').value=task.name;
    document.getElementById('edit-task-desc').value=task.desc;
    document.getElementById('edit-task-status').value=task.status;
    renderEditTaskEmployeeDropdown();
    document.getElementById('edit-task-employee').value=task.employee;
    openModal('edit-task');
}

function saveTaskEdit(){
    if(editTaskIndex===null) return;
    const task=objects[selectedObjectIndex].tasks[editTaskIndex];
    task.name=document.getElementById('edit-task-name').value;
    task.desc=document.getElementById('edit-task-desc').value;
    task.status=document.getElementById('edit-task-status').value;
    task.employee=document.getElementById('edit-task-employee').value;
    saveData();
    renderTasks();
    closeModal('edit-task');
}

function deleteTask(index){ objects[selectedObjectIndex].tasks.splice(index,1); selectedTaskIndex=null; saveData(); renderTasks(); }

function highlightSelectedTask(){ renderTasks(); }

renderEmployeeDropdown(); renderObjects(); renderTasks();

