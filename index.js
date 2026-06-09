// Application State Management - Kept safe via localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Element Selectors
const actionWrapper = document.getElementById('action-wrapper');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskModal = document.getElementById('task-modal');
const todoForm = document.getElementById('todo-form');

const taskInput = document.getElementById('task-input');
const taskPriority = document.getElementById('task-priority');
const celebrationBanner = document.getElementById('celebration');

// Empty State Node Blocks
const focusEmpty = document.getElementById('focus-empty');
const laterEmpty = document.getElementById('later-empty');
const completedEmpty = document.getElementById('completed-empty');

// List Container Node Blocks
const focusList = document.getElementById('focus-list');
const laterList = document.getElementById('later-list');
const completedList = document.getElementById('completed-list');

const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.task-list-wrapper');

// Modal Window Display Toggles
openModalBtn.addEventListener('click', () => {
  taskModal.classList.remove('hidden');
  taskInput.focus();
});

closeModalBtn.addEventListener('click', () => {
  taskModal.classList.add('hidden');
  todoForm.reset();
});

// Close modal if user clicks gray backdrop area
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) {
    taskModal.classList.add('hidden');
    todoForm.reset();
  }
});

// Handle Navigation Tab Switches
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const targetTab = tab.getAttribute('data-tab');

    // Rule: Rule requirement states to ONLY keep add button section on Focus Today tab
    if (targetTab === 'focus') {
      actionWrapper.classList.remove('hidden');
    } else {
      actionWrapper.classList.add('hidden');
    }

    // Toggle Visibility of Core Sections
    sections.forEach(section => {
      if (section.id === `${targetTab}-section`) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  });
});

// Create and Add a New Task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const category = taskPriority.value; 

  if (!taskText) return;

  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    completed: false,
    category: category
  };

  tasks.push(newTask);
  saveAndRender();

  // Close popup and reset form fields
  taskModal.classList.add('hidden');
  todoForm.reset();
});

// Trigger the "Hurray" Celebration Notification
function triggerCelebration() {
  celebrationBanner.classList.remove('hidden');
  setTimeout(() => {
    celebrationBanner.classList.add('hidden');
  }, 3000);
}

// Toggle Task Completion State
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      const updatedState = !task.completed;
      if (updatedState === true) {
        triggerCelebration();
      }
      return { ...task, completed: updatedState };
    }
    return task;
  });
  saveAndRender();
}

// Remove a Task Entirely
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// Save Changes to Local Storage and Refresh UI Lists
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  // Clear lists to update rendering pipeline safely
  focusList.innerHTML = '';
  laterList.innerHTML = '';
  completedList.innerHTML = '';

  // State trackers to check if lists contain elements
  let activeFocusCount = 0;
  let activeLaterCount = 0;
  let activeCompletedCount = 0;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    const checkbox = li.querySelector('.complete-checkbox');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Smart Routing system based on state properties
    if (task.completed) {
      completedList.appendChild(li);
      activeCompletedCount++;
    } else if (task.category === 'today') {
      focusList.appendChild(li);
      activeFocusCount++;
    } else {
      laterList.appendChild(li);
      activeLaterCount++;
    }
  });

  // Dynamic Toggle Control for Empty Artwork Images
  if (activeFocusCount > 0) focusEmpty.classList.add('hidden');
  else focusEmpty.classList.remove('hidden');

  if (activeLaterCount > 0) laterEmpty.classList.add('hidden');
  else laterEmpty.classList.remove('hidden');

  if (activeCompletedCount > 0) completedEmpty.classList.add('hidden');
  else completedEmpty.classList.remove('hidden');
}

// Core App Initialization
saveAndRender();
