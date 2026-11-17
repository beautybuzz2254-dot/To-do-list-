const todoForm = document.getElementById("todoForm");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const taskCount = document.getElementById("taskCount");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");

    let tasks = JSON.parse(localStorage.getItem("arch_todo_tasks")) || [];

    function saveTasks() {
      localStorage.setItem("arch_todo_tasks", JSON.stringify(tasks));
    }

    function updateStats() {
      const remaining = tasks.filter((t) => !t.completed).length;
      taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
    }

    function renderTasks() {
      todoList.innerHTML = "";

      if (tasks.length === 0) {
        todoList.innerHTML = `<li class="empty-state">No tasks yet. Add one above!</li>`;
        updateStats();
        return;
      }

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `todo-item ${task.completed ? "completed" : ""}`;

        const leftDiv = document.createElement("div");
        leftDiv.className = "todo-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
          task.completed = checkbox.checked;
          saveTasks();
          renderTasks();
        });

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = task.text;

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(span);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "todo-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn-icon btn-edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => startEditTask(li, task));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn-icon btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks();
          renderTasks();
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(actionsDiv);
        todoList.appendChild(li);
      });

      updateStats();
    }

    function startEditTask(li, task) {
      const leftDiv = li.querySelector(".todo-left");
      const actionsDiv = li.querySelector(".todo-actions");

      const input = document.createElement("input");
      input.type = "text";
      input.className = "edit-input";
      input.value = task.text;

      leftDiv.innerHTML = "";
      leftDiv.appendChild(input);
      input.focus();

      actionsDiv.innerHTML = "";
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "btn-icon btn-edit";
      saveBtn.textContent = "Save";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "btn-icon btn-delete";
      cancelBtn.textContent = "Cancel";

      saveBtn.addEventListener("click", () => {
        const updatedText = input.value.trim();
        if (updatedText) {
          task.text = updatedText;
          saveTasks();
        }
        renderTasks();
      });

      cancelBtn.addEventListener("click", renderTasks);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          saveBtn.click();
        } else if (e.key === "Escape") {
          cancelBtn.click();
        }
      });

      actionsDiv.appendChild(saveBtn);
      actionsDiv.appendChild(cancelBtn);
    }

    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;

      tasks.unshift({
        id: Date.now(),
        text,
        completed: false
      });

      todoInput.value = "";
      saveTasks();
      renderTasks();
    });

    clearCompletedBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => !t.completed);
      saveTasks();
      renderTasks();
    });

    renderTasks();