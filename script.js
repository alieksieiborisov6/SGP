// Firebase init
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDRmT2RygFihWS9OmPNt0SDWTkZlA6-bKM",
  authDomain: "sgp2026-3184d.firebaseapp.com",
  projectId: "sgp2026-3184d",
  storageBucket: "sgp2026-3184d.firebasestorage.app",
  messagingSenderId: "566527410900",
  appId: "1:566527410900:web:4ec4cbdf220224c6e0b141",
  measurementId: "G-WSHB0351M4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Данные
let objects = [];
const employees = [
    {name:"Иван Иванов", role:"Менеджер"},
    {name:"Мария Петрова", role:"Инженер"},
    {name:"Сергей Смирнов", role:"Рабочий"}
];
let selectedObjectIndex = null;
let editTaskIndex = null;

// -------------------- MODALS --------------------
function openModal(id){ document.getElementById(id).style.display='flex'; }
function closeModal(id){ document.getElementById(id).style.display='none'; }

// -------------------- RENDER EMPLOYEES --------------------
function renderEmployeeDropdown(selectId){
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    employees.forEach(emp=>{
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = `${emp.name} (${emp.role})`;
        select.appendChild(option);
    });
}

// -------------------- OBJECTS --------------------
async function addObject(){
    const name = document.getElementById('object-name').value;
    const desc = document.getElementById('object-desc').value;
    if(!name) return alert("Введите название объекта");
    await addDoc(collection(db,"objects"), { name, desc, createdAt: new Date() });
    document.getElementById('object-name').value='';
    document.getElementById('object-desc').value='';
    closeModal('add-object');
    loadObjects();
}

async function loadObjects(){
    const q = query(collection(db,"objects"), orderBy("createdAt"));
    const snapshot = await getDocs(q);
    objects = [];
    snapshot.forEach(docSnap => {
        objects.push({...docSnap.data(), id: docSnap.id, tasks: []});
    });
    renderObjects();
    for(let i=0;i<objects.length;i++) await loadTasksForObject(objects[i].id,i);
}

function renderObjects(){
    const grid = document.querySelector('.objects-grid');
    grid.innerHTML='';
    objects.forEach((obj,i)=>{
        const div = document.createElement('div');
        div.className='card object-card';
        div.innerHTML=`<h4>${obj.name}</h4><p>${obj.desc}</p>`;
        div.onclick=()=>{selectedObjectIndex=i; renderTasks();};
        grid.appendChild(div);
    });
}

// -------------------- TASKS --------------------
async function addTask(){
    if(selectedObjectIndex===null) return alert("Выберите объект");
    const name=document.getElementById('task-name').value;
    const desc=document.getElementById('task-desc').value;
    const status=document.getElementById('task-status').value;
    const employee=document.getElementById('task-employee').value;
    if(!name) return alert("Введите название задачи");

    const objId = objects[selectedObjectIndex].id;
    await addDoc(collection(db,"objects",objId,"tasks"),{name,desc,status,employee,createdAt:new Date()});
    document.getElementById('task-name').value='';
    document.getElementById('task-desc').value='';
    closeModal('add-task');
    loadObjects();
}

async function loadTasksForObject(objectId,objIndex){
    const tasksCol = collection(db,"objects",objectId,"tasks");
    const q = query(tasksCol, orderBy("createdAt"));
    const snapshot = await getDocs(q);
    objects[objIndex].tasks=[];
    snapshot.forEach(docSnap=>{
        objects[objIndex].tasks.push({...docSnap.data(), id: docSnap.id});
    });
    if(selectedObjectIndex===objIndex) renderTasks();
}

function renderTasks(){
    const grid = document.querySelector('.tasks-grid');
    grid.innerHTML='';
    if(selectedObjectIndex===null) return;
    objects[selectedObjectIndex].tasks.forEach((task,i)=>{
        const div=document.createElement('div');
        div.className=`card task-card ${task.status}`;
        div.innerHTML=`
            <h4>${task.name}</h4>
            <p>${task.desc}</p>
            <p class="task-employee">Сотрудник: ${task.employee}</p>
        `;
        const buttons = document.createElement('div');
        buttons.className='card-buttons';
        buttons.innerHTML=`
            <button class="edit-btn" onclick="openEditTask(${i}); event.stopPropagation();">Редактировать</button>
            <button class="delete-btn" onclick="deleteTask(${i}); event.stopPropagation();">×</button>
        `;
        div.appendChild(buttons);
        grid.appendChild(div);
    });
}

// -------------------- EDIT TASK --------------------
function openEditTask(i){
    editTaskIndex=i;
    const task = objects[selectedObjectIndex].tasks[i];
    document.getElementById('edit-task-name').value = task.name;
    document.getElementById('edit-task-desc').value = task.desc;
    document.getElementById('edit-task-status').value = task.status;
    renderEmployeeDropdown('edit-task-employee');
    document.getElementById('edit-task-employee').value = task.employee;
    openModal('edit-task');
}

async function saveTaskEdit(){
    if(editTaskIndex===null) return;
    const task = objects[selectedObjectIndex].tasks[editTaskIndex];
    const objId = objects[selectedObjectIndex].id;
    const taskId = task.id;
    const ref = doc(db,"objects",objId,"tasks",taskId);
    await updateDoc(ref,{
        name: document.getElementById('edit-task-name').value,
        desc: document.getElementById('edit-task-desc').value,
        status: document.getElementById('edit-task-status').value,
        employee: document.getElementById('edit-task-employee').value
    });
    closeModal('edit-task');
    loadObjects();
}

// -------------------- DELETE TASK --------------------
async function deleteTask(i){
    if(!confirm("Удалить задачу?")) return;
    const task = objects[selectedObjectIndex].tasks[i];
    const objId = objects[selectedObjectIndex].id;
    const taskId = task.id;
    await deleteDoc(doc(db,"objects",objId,"tasks",taskId));
    loadObjects();
}

// -------------------- INIT --------------------
renderEmployeeDropdown('task-employee');
loadObjects();
