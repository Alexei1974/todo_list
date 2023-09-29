"use strict"
//==========================================

import {
    getTasksLocalStorage,
    setTasksLocalStorage,
    generateUniqueId,
    initSortableList,
    updateListTasks,
    renderTasks,
} from "./utils.js";


let formCount = document.querySelector('.form__count');

const form = document.querySelector('.form');
const textareaForm = document.querySelector('.form__textarea');
const buttonSendForm = document.querySelector('.form__send-btn');
const buttonCancel = document.querySelector('.form__cancel-btn');
const output = document.querySelector('.output');
let editId = null;
let isEditTask = false;


updateListTasks();


// ! all eventListener ============================//
form.addEventListener('submit', sendTask);
buttonCancel.addEventListener('click', resetSendForm);
output.addEventListener('dragover', initSortableList);
output.addEventListener('dragenter', event => event.preventDefault());

output.addEventListener('click', event => {
    const taskElement = event.target.closest('.task__btns');
    if (!taskElement) return;

    if (event.target.closest('.task__pinned')) {
        pinnedTask(event);
    } else if (event.target.closest('.task__edit')) {
        editTask(event);
    } else if (event.target.closest('.task__del')) {
        delTask(event);
    } else if (event.target.closest('.task__done')) {
        doneTask(event);
       
    }
})



//! all funttion ================================== //
function sendTask(event) {
    event.preventDefault();

    const task = textareaForm.value.trim().replace(/\s+/g, ' ');
    if (!task) {
        return alert('Поле не  должно быть  пустым!')
    }

    if (isEditTask) {
        saveEditTask(task);
        return;
    }

    const arrayTasksLS = getTasksLocalStorage();
    arrayTasksLS.push({
        id: generateUniqueId(),
        task,
        done: false,
        pinned: false,
        position: 1000,
    })
    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()
    form.reset()
}

function doneTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const index = arrayTasksLS.findIndex(task => task.id === id);
   

    if (index === -1) {
        return alert('Такая задача не найдена');
    }

    if (!arrayTasksLS[index].done && arrayTasksLS[index].pinned) {
        arrayTasksLS[index].pinned = false;
    }

    if (arrayTasksLS[index].done) {
        arrayTasksLS[index].done = false;
       
    } else {
        arrayTasksLS[index].done = true;
        // console.log(formCount.textContent --);
    }
    
    setTasksLocalStorage(arrayTasksLS)
    renderTasks()
    updateListTasks();
    
}

function pinnedTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const index = arrayTasksLS.findIndex(task => task.id === id);

    if (index === -1) {
        return alert('Такая задача не найдена');
    }

    if (!arrayTasksLS[index].pinned && arrayTasksLS[index].done) {
        return alert('Чтобы закрепить  задачу, сначала  уберите отметку  о  ее выполнении')
    }

    if (arrayTasksLS[index].pinned) {
        arrayTasksLS[index].pinned = false;
    } else {
        arrayTasksLS[index].pinned = true;
    }

    setTasksLocalStorage(arrayTasksLS)
    updateListTasks()
}

function delTask(event) {
    const task = event.target.closest('.task');
    const id = Number(task.dataset.taskId);

    const arrayTasksLS = getTasksLocalStorage();
    const newTasksArr = arrayTasksLS.filter(task => task.id !== id)

    setTasksLocalStorage(newTasksArr)
    updateListTasks()
}

function editTask(event) {
    const task = event.target.closest('.task');
    const text = task.querySelector('.task__text');
    editId = Number(task.dataset.taskId);

    textareaForm.value = text.textContent;
    isEditTask = true;
    buttonSendForm.textContent = 'Сохранить';
    buttonCancel.classList.remove('none');
    form.scrollIntoView({ behavior: 'smooth' });
}

function saveEditTask(task) {
    const arrayTasksLS = getTasksLocalStorage();
    const editTaskIndex = arrayTasksLS.findIndex(task => task.id === editId);

    if (editTaskIndex !== -1) {
        arrayTasksLS[editTaskIndex].task = task;
        setTasksLocalStorage(arrayTasksLS);
        updateListTasks();
    } else {
        alert('Такая задача не найдена!');
    }

    resetSendForm();
}

function resetSendForm() {
    editId = null;
    isEditTask = false;
    buttonCancel.classList.add('none');
    buttonSendForm.textContent = 'Добавить';
    form.reset();
}


