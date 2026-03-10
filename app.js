// Сотрудники постоянные
const employees = [
  {name: "Иван Иванов", role: "Прораб"},
  {name: "Мария Петрова", role: "Инженер"},
  {name: "Алексей Борисов", role: "Менеджер"},
  {name: "Ольга Смирнова", role: "Архитектор"}
];

// Отобразить сотрудников на странице
function renderEmployees() {
  const grid = document.querySelector('.employee-grid');
  grid.innerHTML = '';
  employees.forEach(emp => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h4>${emp.name}</h4><p>${emp.role}</p>`;
    grid.appendChild(div);
  });

  // Заполнить dropdown сотрудников в модальном окне задачи
  const select = document.getElementById('task-employee');
  select.innerHTML = '';
  employees.forEach(emp => {
    const option = document.createElement('option');
    option.value = emp.name;
    option.textContent = `${emp.name} (${emp.role})`;
    select.appendChild(option);
  });
}

// Модальные окна
function openModal(id){ document.getElementById(id).style.display='block'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }

// Добавление объектов
function addObject(){
  const name = document.getElementById('object-name').value;
  const desc = document.getElementById('object-desc').value;
  if(!name) return alert("Введите название объекта");
  const grid = document.querySelector('.objects-grid');
  const div = document.createElement('div');
  div.className='card';
  div.innerHTML=`<h4>${name}</h4><p>${desc}</p><button class="delete-btn" onclick="deleteCard(this)">×</button>`;
  grid.appendChild(div);
  closeModal('add-object');
  document.getElementById('object-name').value='';
  document.getElementById('object-desc').value='';
}

// Добавление задач
function addTask(){
  const name=document.getElementById('task-name').value;
  const status=document.getElementById('task-status').value;
  const employee=document.getElementById('task-employee').value;
  if(!name) return alert("Введите название задачи");
  const grid=document.querySelector('.tasks-grid');
  const div=document.createElement('div');
  div.className=`card task-card ${status}`;
  div.innerHTML=`<h4>${name}</h4>
    <p>Исполнитель: ${employee}</p>
    <select onchange="updateStatus(this)">
      <option value="set" ${status==='set'?'selected':''}>Задано</option>
      <option value="in_progress" ${status==='in_progress'?'selected':''}>В работе</option>
      <option value="done" ${status==='done'?'selected':''}>Завершено</option>
    </select>
    <button class="delete-btn" onclick="deleteCard(this)">×</button>`;
  grid.appendChild(div);
  closeModal('add-task');
  document.getElementById('task-name').value='';
}

// Удаление карточек
function deleteCard(btn){ btn.parentElement.remove(); }

// Обновление статуса задачи
function updateStatus(select){
  const card=select.parentElement;
  card.classList.remove('set','in_progress','done');
  card.classList.add(select.value);
}

// Инициализация
renderEmployees();
