class NotesApp {
    constructor() {
        this.notes = {
            commercial: [],
            tax: [],
            terms: [],
            principles: [],
            arbitration: [],
            aviation: []
        };
        
        this.currentSubject = 'commercial';
        this.editingNoteIndex = null;
        this.currentFilter = 'all';
        
        const savedNotes = this.loadFromLocalStorage();
        if (savedNotes) {
            Object.keys(this.notes).forEach(subject => {
                this.notes[subject] = savedNotes[subject] || [];
            });
        }
        
        this.setupEventListeners();
        this.renderSavedNotes();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNavigation(e);
            });
        });

        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.editingNoteIndex !== null) {
                    this.updateNote(e);
                } else {
                    this.saveNote(e);
                }
            });
        });

        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePrioritySelection(e);
            });
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterSelection(e);
            });
        });

        document.getElementById('searchNotes').addEventListener('input', (e) => {
            this.handleSearch(e);
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportNotes();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importInput').click();
        });

        document.getElementById('importInput').addEventListener('change', (e) => {
            this.importNotes(e);
        });

        document.getElementById('savedNotesList').addEventListener('click', (e) => {
            const noteText = e.target.closest('.note-text');
            if (noteText) {
                const description = noteText.parentElement.querySelector('.note-description');
                if (description) {
                    description.classList.toggle('show');
                }
            }
        });
    }

    handleFilterSelection(e) {
        const filterType = e.target.dataset.filter;
        this.currentFilter = filterType;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        this.renderSavedNotes();
    }

    handleNavigation(e) {
        const subject = e.target.dataset.subject;
        if (!subject) return;
        
        this.editingNoteIndex = null;
        this.resetSaveButton();
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        document.querySelectorAll('.subject-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.querySelector(`.subject-section[data-subject="${subject}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSubject = subject;
        if (!this.notes[subject]) {
            this.notes[subject] = [];
        }
        this.renderSavedNotes();
    }

    handlePrioritySelection(e) {
        const inputGroup = e.target.closest('.input-group');
        if (!inputGroup) return;
        
        inputGroup.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
    }

    saveNote(e) {
        const inputGroup = e.target.closest('.input-group');
        if (!inputGroup) return;

        const noteInput = inputGroup.querySelector('.note-input');
        const numberInput = inputGroup.querySelector('.number-input');
        const descriptionInput = inputGroup.querySelector('.description-input');
        const priorityBtn = inputGroup.querySelector('.priority-btn.active');

        if (!noteInput || !numberInput) {
            this.showNotification('حدث خطأ في النموذج', 'error');
            return;
        }

        const subject = noteInput.dataset.subject;
        const text = noteInput.value.trim();
        const number = parseInt(numberInput.value);
        const description = descriptionInput ? descriptionInput.value.trim() : '';

        if (!text || isNaN(number)) {
            this.showNotification('الرجاء إدخال النص والرقم', 'error');
            return;
        }

        if (!priorityBtn) {
            this.showNotification('الرجاء اختيار نوع الملاحظة', 'error');
            return;
        }

        if (!this.notes[subject]) {
            this.notes[subject] = [];
        }

        const priority = priorityBtn.dataset.priority;

        if (this.notes[subject].some(note => note.text === text)) {
            this.showNotification('هذه الملاحظة موجودة بالفعل', 'error');
            return;
        }

        this.notes[subject].push({ text, number, description, priority });
        this.saveToLocalStorage();
        this.renderSavedNotes();
        this.clearInputs(inputGroup);
        this.showNotification('تم حفظ الملاحظة بنجاح', 'success');
    }

    updateNote(e) {
        const inputGroup = e.target.closest('.input-group');
        if (!inputGroup) return;

        const noteInput = inputGroup.querySelector('.note-input');
        const numberInput = inputGroup.querySelector('.number-input');
        const descriptionInput = inputGroup.querySelector('.description-input');
        const priorityBtn = inputGroup.querySelector('.priority-btn.active');

        if (!noteInput || !numberInput || !priorityBtn) {
            this.showNotification('حدث خطأ في النموذج', 'error');
            return;
        }

        const text = noteInput.value.trim();
        const number = parseInt(numberInput.value);
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const priority = priorityBtn.dataset.priority;

        if (!text || isNaN(number)) {
            this.showNotification('الرجاء إدخال النص والرقم', 'error');
            return;
        }

        this.notes[this.currentSubject][this.editingNoteIndex] = {
            text,
            number,
            description,
            priority
        };

        this.saveToLocalStorage();
        this.renderSavedNotes();
        this.clearInputs(inputGroup);
        this.editingNoteIndex = null;
        this.resetSaveButton();
        this.showNotification('تم تحديث الملاحظة بنجاح', 'success');
    }

    editNote(index) {
        const note = this.notes[this.currentSubject][index];
        const currentSection = document.querySelector(`.subject-section[data-subject="${this.currentSubject}"]`);
        
        if (!currentSection || !note) return;

        const noteInput = currentSection.querySelector('.note-input');
        const numberInput = currentSection.querySelector('.number-input');
        const descriptionInput = currentSection.querySelector('.description-input');
        const priorityBtns = currentSection.querySelectorAll('.priority-btn');
        const saveBtn = currentSection.querySelector('.save-btn');

        noteInput.value = note.text;
        numberInput.value = note.number;
        if (descriptionInput) {
            descriptionInput.value = note.description || '';
        }
        
        priorityBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.priority === note.priority) {
                btn.classList.add('active');
            }
        });

        this.editingNoteIndex = index;
        saveBtn.textContent = 'تحديث';
        noteInput.focus();
    }

    clearInputs(inputGroup) {
        if (!inputGroup) return;

        const noteInput = inputGroup.querySelector('.note-input');
        const numberInput = inputGroup.querySelector('.number-input');
        const descriptionInput = inputGroup.querySelector('.description-input');
        
        if (noteInput) noteInput.value = '';
        if (numberInput) numberInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        
        inputGroup.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const defaultBtn = inputGroup.querySelector('.priority-btn.default');
        if (defaultBtn) defaultBtn.classList.add('active');
    }

    renderSavedNotes(notesToRender = null) {
        const notesList = document.getElementById('savedNotesList');
        if (!notesList) return;

        if (!this.notes[this.currentSubject]) {
            this.notes[this.currentSubject] = [];
        }

        let notes = notesToRender || this.notes[this.currentSubject];

        // Apply filter if not 'all'
        if (this.currentFilter !== 'all') {
            notes = notes.filter(note => note.priority === this.currentFilter);
        }

        notes = notes.sort((a, b) => a.number - b.number);
        
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = `saved-note ${note.priority || 'default'}`;
            
            const descriptionHtml = note.description ? 
                `<div class="note-description">${note.description}</div>` : '';

            noteElement.innerHTML = `
                <div class="note-content">
                    <div class="note-text">${note.text}</div>
                    ${descriptionHtml}
                    <div class="note-number">#${note.number}</div>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" data-index="${index}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.5 2.5L13.5 4.5M12.5 1.5L8 6L7 9L10 8L14.5 3.5C14.5 3.5 12.5 1.5 12.5 1.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `;
            
            noteElement.querySelector('.edit-btn').addEventListener('click', () => {
                this.editNote(index);
            });
            
            noteElement.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteNote(index);
            });
            
            notesList.appendChild(noteElement);
        });
    }

    deleteNote(index) {
        if (!this.notes[this.currentSubject]) {
            this.notes[this.currentSubject] = [];
            return;
        }

        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            this.notes[this.currentSubject].splice(index, 1);
            this.saveToLocalStorage();
            this.renderSavedNotes();
            this.showNotification('تم حذف الملاحظة بنجاح', 'success');
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (!this.notes[this.currentSubject]) {
            this.notes[this.currentSubject] = [];
        }
        const notes = this.notes[this.currentSubject];
        const filteredNotes = notes.filter(note => 
            note.text.toLowerCase().includes(searchTerm) || 
            note.number.toString().includes(searchTerm) ||
            (note.description && note.description.toLowerCase().includes(searchTerm))
        );
        this.renderSavedNotes(filteredNotes);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    exportNotes() {
        const data = JSON.stringify(this.notes, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes_backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('تم تصدير الملاحظات بنجاح', 'success');
    }

    importNotes(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target.result);
                Object.keys(this.notes).forEach(subject => {
                    this.notes[subject] = importedNotes[subject] || [];
                });
                this.saveToLocalStorage();
                this.renderSavedNotes();
                this.showNotification('تم استيراد الملاحظات بنجاح', 'success');
            } catch (error) {
                this.showNotification('حدث خطأ أثناء استيراد الملاحظات', 'error');
            }
        };
        reader.readAsText(file);
    }

    loadFromLocalStorage() {
        try {
            const savedNotes = localStorage.getItem('notes');
            if (savedNotes) {
                return JSON.parse(savedNotes);
            }
        } catch (error) {
            console.error('Error loading notes from localStorage:', error);
        }
        return null;
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes to localStorage:', error);
            this.showNotification('حدث خطأ أثناء حفظ الملاحظات', 'error');
        }
    }

    resetSaveButton() {
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.textContent = 'حفظ';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});