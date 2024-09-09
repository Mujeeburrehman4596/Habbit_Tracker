document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habit-form');
    const habitList = document.getElementById('habit-list');
    const filterFrequency = document.getElementById('filter-frequency');
    const showCompleted = document.getElementById('show-completed');
    const editHabitModal = new bootstrap.Modal(document.getElementById('editHabitModal'));
    const addHabitModal = new bootstrap.Modal(document.getElementById('addHabitModal'));
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let editingHabitIndex = null;

    function renderHabits() {
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
            if (!habit.completed || showCompleted.classList.contains('active')) {
                if (!filterFrequency.value || habit.frequency === filterFrequency.value) {
                    const li = document.createElement('li');
                    li.className = `list-group-item list-group-item-${getFrequencyClass(habit.frequency)}`;
                    li.innerHTML = `
                        <input type="checkbox" ${habit.completed ? 'checked' : ''} class="form-check-input me-2 complete-habit" data-index="${index}">
                        ${habit.name}
                        <span class="badge badge-${getFrequencyClass(habit.frequency)}">${habit.frequency}</span>
                        <button class="btn btn-info btn-sm float-right edit-habit" data-index="${index}">Edit</button>
                        <button class="btn btn-danger btn-sm float-right me-2 delete-habit" data-index="${index}">Delete</button>
                    `;
                    habitList.appendChild(li);
                }
            }
        });
    }

    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function addHabit() {
        const habitName = document.getElementById('habit-name').value;
        const habitFrequency = document.getElementById('habit-frequency').value;
        habits.push({ name: habitName, frequency: habitFrequency, completed: false });
        saveHabits();
        renderHabits();
        habitForm.reset();
        addHabitModal.hide();
    }

    function editHabit() {
        const habitName = document.getElementById('edit-habit-name').value;
        const habitFrequency = document.getElementById('edit-habit-frequency').value;
        if (editingHabitIndex !== null) {
            habits[editingHabitIndex] = { name: habitName, frequency: habitFrequency, completed: habits[editingHabitIndex].completed };
            saveHabits();
            renderHabits();
            editHabitModal.hide();
        }
    }

    function deleteHabit(index) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
    }

    function completeHabit(index) {
        habits[index].completed = !habits[index].completed;
        saveHabits();
        renderHabits();
    }

    function getFrequencyClass(frequency) {
        switch (frequency) {
            case 'Daily':
                return 'success';
            case 'Weekly':
                return 'info';
            case 'Monthly':
                return 'primary';
            default:
                return 'secondary';
        }
    }

    habitForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addHabit();
    });

    habitList.addEventListener('click', function (e) {
        const target = e.target;
        const index = target.getAttribute('data-index');
        if (target.classList.contains('delete-habit')) {
            deleteHabit(index);
        } else if (target.classList.contains('edit-habit')) {
            const habit = habits[index];
            document.getElementById('edit-habit-name').value = habit.name;
            document.getElementById('edit-habit-frequency').value = habit.frequency;
            document.getElementById('edit-habit-index').value = index;
            editingHabitIndex = index;
            editHabitModal.show();
        } else if (target.classList.contains('complete-habit')) {
            completeHabit(index);
        }
    });

    filterFrequency.addEventListener('change', renderHabits);

    showCompleted.addEventListener('click', function () {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? 'Hide Completed' : 'Show Completed';
        renderHabits();
    });

    document.getElementById('edit-habit-form').addEventListener('submit', function (e) {
        e.preventDefault();
        editHabit();
    });

    renderHabits();
});
