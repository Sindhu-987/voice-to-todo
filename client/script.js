const startBtn = document.getElementById('startBtn');
const taskList = document.getElementById('taskList');
const API_URL = 'http://localhost:5000';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';

startBtn.onclick = () => recognition.start();

recognition.onresult = async (e) => {
  const text = e.results[0][0].transcript;
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const task = await res.json();
  addTaskToDOM(task);
};

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  const tasks = await res.json();
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  if (task.completed) li.classList.add('completed');

  li.onclick = async () => {
    li.classList.toggle('completed');
    await fetch(`${API_URL}/tasks/${task._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    task.completed = !task.completed;
  };

  taskList.appendChild(li);
}

getTasks();
