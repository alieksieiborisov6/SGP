// Постоянные сотрудники
const employees = [
  {name: "Иван Иванов", role: "Прораб"},
  {name: "Мария Петрова", role: "Инженер"},
  {name: "Алексей Борисов", role: "Менеджер"},
  {name: "Ольга Смирнова", role: "Архитектор"}
];

let selectedEmployee = null;

// Отображение сотрудников на странице
function renderEmployees() {
  const grid = document.querySelector('.employee-grid');
  grid.innerHTML = '';
  employees.forEach(emp => {
    const div = document.createElement('div');
    div.className = 'employee-card';
    div.innerHTML = `<p>${emp.name}</p><small>${emp.role}</small>`;
    grid.appendChild(div);
  });

  // Для выбора в модальном окне задачи
  const selectGrid = document.querySelector('.employee-grid-select');
  selectGrid.innerHTML = '';
  employees.forEach(emp => {
    const div = document.createElement('div');
    div.className = 'employee-card';
    div.innerHTML = `<p>${emp.name}</p><small>${emp.role}</small>`;
    div.onclick = () => selectEmployee(div, emp);
    selectGrid.appendChild(div);
  });
}

function selectEmployee(card, emp){
  document.querySelectorAll('.employee-grid-select .employee-card').forEach(c=>c.classList.remove('selected'));
  card.classList.add('selected');
  selectedEmployee = emp.name;
}

// Модальные окна
function openModal(id){ document.getElementById(id).style.display='block'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }

// Объекты
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

// Задачи
function addTask(){
  const name=document.getElementById('task-name').value;
  const status=document.getElementById('task-status').value;
  if(!name) return alert("Введите название задачи");
  if(!selectedEmployee) return alert("Выберите сотрудника");
  const grid=document.querySelector('.tasks-grid');
  const div=document.createElement('div');
  div.className=`card task-card ${status}`;
  div.innerHTML=`<h4>${name}</h4>
  <p>Исполнитель: ${selectedEmployee}</p>
  <select onchange="updateStatus(this)">
    <option value="set" ${status==='set'?'selected':''}>Задано</option>
    <option value="in_progress" ${status==='in_progress'?'selected':''}>В работе</option>
    <option value="done" ${status==='done'?'selected':''}>Завершено</option>
  </select>
  <button class="delete-btn" onclick="deleteCard(this)">×</button>`;
  grid.appendChild(div);
  closeModal('add-task');
  document.getElementById('task-name').value='';
  selectedEmployee = null;
  renderEmployees();
}

// Удаление карточек
function deleteCard(btn){ btn.parentElement.remove(); }

// Статус задачи
function updateStatus(select){
  const card=select.parentElement;
  card.classList.remove('set','in_progress','done');
  card.classList.add(select.value);
}

// Инициализация сотрудников
renderEmployees();
