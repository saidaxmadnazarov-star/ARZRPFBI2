// Tab switching
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tab = document.getElementById(btn.dataset.tab);
        if (tab) tab.classList.add('active');
    });
});

// Filter for questionnaires
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('#quest-tbody tr').forEach(row => {
            if (filter === 'all' || row.dataset.type === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// Modal forms config
const forms = {
    rec: {
        title: 'Добавить рекомендацию от ID',
        fields: [
            { name: 'nick', label: 'ФИО / Ник', type: 'text' },
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'from', label: 'Кто рекомендовал', type: 'text' },
            { name: 'date', label: 'Дата', type: 'date' },
            { name: 'comment', label: 'Комментарий', type: 'textarea' },
            { name: 'status', label: 'Статус', type: 'select', options: ['Одобрено', 'На рассмотрении', 'Отклонено'] }
        ],
        tbody: 'rec-tbody',
        badgeMap: { 'Одобрено': 'success', 'На рассмотрении': 'warning', 'Отклонено': 'danger' }
    },
    recruit: {
        title: 'Новая вербовка',
        fields: [
            { name: 'nick', label: 'Кандидат', type: 'text' },
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'from', label: 'Вербовщик', type: 'text' },
            { name: 'date', label: 'Дата начала', type: 'date' },
            { name: 'stage', label: 'Этап', type: 'text' },
            { name: 'status', label: 'Статус', type: 'select', options: ['В процессе', 'Завершена', 'Отклонена'] }
        ],
        tbody: 'recruit-tbody',
        badgeMap: { 'В процессе': 'info', 'Завершена': 'success', 'Отклонена': 'danger' }
    },
    registry: {
        title: 'Добавить проверку',
        fields: [
            { name: 'org', label: 'Организация', type: 'text' },
            { name: 'type', label: 'Тип проверки', type: 'select', options: ['Плановая', 'Внеплановая', 'Специальная'] },
            { name: 'from', label: 'Ответственный', type: 'text' },
            { name: 'date', label: 'Дата', type: 'date' },
            { name: 'result', label: 'Результат', type: 'text' },
            { name: 'status', label: 'Статус', type: 'select', options: ['Назначена', 'В работе', 'Закрыта'] }
        ],
        tbody: 'registry-tbody',
        badgeMap: { 'Назначена': 'info', 'В работе': 'warning', 'Закрыта': 'success' }
    },
    quest: {
        title: 'Новая анкета',
        fields: [
            { name: 'nick', label: 'ФИО / Ник', type: 'text' },
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'type', label: 'Тип', type: 'select', options: ['Гражданский', 'Полиция', 'CIU'] },
            { name: 'date', label: 'Дата подачи', type: 'date' },
            { name: 'from', label: 'Проверяющий', type: 'text' },
            { name: 'status', label: 'Статус', type: 'select', options: ['На проверке', 'Одобрена', 'На рассмотрении', 'Отклонена'] }
        ],
        tbody: 'quest-tbody',
        badgeMap: { 'На проверке': 'warning', 'Одобрена': 'success', 'На рассмотрении': 'info', 'Отклонена': 'danger' },
        typeMap: { 'Гражданский': 'civilian', 'Полиция': 'police', 'CIU': 'ciu' }
    },
    blrec: {
        title: 'Добавить в ЧС вербовок',
        fields: [
            { name: 'nick', label: 'ФИО / Ник', type: 'text' },
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'reason', label: 'Причина', type: 'textarea' },
            { name: 'from', label: 'Кто добавил', type: 'text' },
            { name: 'date', label: 'Дата', type: 'date' },
            { name: 'term', label: 'Срок', type: 'text', placeholder: 'напр. 30 дней или Бессрочно' }
        ],
        tbody: 'blrec-tbody'
    },
    blid: {
        title: 'Добавить ID в ЧС',
        fields: [
            { name: 'id', label: 'ID', type: 'text' },
            { name: 'nick', label: 'Ник (если известен)', type: 'text' },
            { name: 'reason', label: 'Причина', type: 'textarea' },
            { name: 'from', label: 'Кто добавил', type: 'text' },
            { name: 'date', label: 'Дата', type: 'date' },
            { name: 'term', label: 'Срок', type: 'text', placeholder: 'напр. 14 дней или Бессрочно' }
        ],
        tbody: 'blid-tbody'
    }
};

let currentForm = null;

function openModal(type) {
    currentForm = forms[type];
    if (!currentForm) return;

    document.getElementById('modal-title').textContent = currentForm.title;
    const body = document.getElementById('modal-body');
    body.innerHTML = '';

    currentForm.fields.forEach(f => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = f.label;
        group.appendChild(label);

        let input;
        if (f.type === 'textarea') {
            input = document.createElement('textarea');
        } else if (f.type === 'select') {
            input = document.createElement('select');
            f.options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                input.appendChild(o);
            });
        } else {
            input = document.createElement('input');
            input.type = f.type;
        }
        input.name = f.name;
        input.id = 'field-' + f.name;
        if (f.placeholder) input.placeholder = f.placeholder;
        group.appendChild(input);
        body.appendChild(group);
    });

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    currentForm = null;
}

function submitModal() {
    if (!currentForm) return;

    const values = {};
    currentForm.fields.forEach(f => {
        const el = document.getElementById('field-' + f.name);
        values[f.name] = el ? el.value : '';
    });

    // Format date if present
    if (values.date) {
        const d = new Date(values.date);
        if (!isNaN(d)) {
            values.date = d.toLocaleDateString('ru-RU');
        }
    }

    const tbody = document.getElementById(currentForm.tbody);
    const num = tbody.children.length + 1;
    const tr = document.createElement('tr');

    // Special handling per form type
    if (currentForm.tbody === 'rec-tbody') {
        const badgeClass = currentForm.badgeMap[values.status] || 'info';
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.nick)}</td>
            <td>${esc(values.id)}</td>
            <td>${esc(values.from)}</td>
            <td>${esc(values.date)}</td>
            <td>${esc(values.comment)}</td>
            <td><span class="badge badge-${badgeClass}">${esc(values.status)}</span></td>
        `;
    } else if (currentForm.tbody === 'recruit-tbody') {
        const badgeClass = currentForm.badgeMap[values.status] || 'info';
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.nick)}</td>
            <td>${esc(values.id)}</td>
            <td>${esc(values.from)}</td>
            <td>${esc(values.date)}</td>
            <td>${esc(values.stage)}</td>
            <td><span class="badge badge-${badgeClass}">${esc(values.status)}</span></td>
        `;
    } else if (currentForm.tbody === 'registry-tbody') {
        const badgeClass = currentForm.badgeMap[values.status] || 'info';
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.org)}</td>
            <td>${esc(values.type)}</td>
            <td>${esc(values.from)}</td>
            <td>${esc(values.date)}</td>
            <td>${esc(values.result) || '—'}</td>
            <td><span class="badge badge-${badgeClass}">${esc(values.status)}</span></td>
        `;
    } else if (currentForm.tbody === 'quest-tbody') {
        const badgeClass = currentForm.badgeMap[values.status] || 'info';
        const typeClass = values.type === 'Гражданский' ? 'type-civ' : values.type === 'Полиция' ? 'type-pol' : 'type-ciu';
        const dataType = currentForm.typeMap[values.type] || 'civilian';
        tr.dataset.type = dataType;
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.nick)}</td>
            <td>${esc(values.id)}</td>
            <td><span class="type-tag ${typeClass}">${esc(values.type)}</span></td>
            <td>${esc(values.date)}</td>
            <td>${esc(values.from)}</td>
            <td><span class="badge badge-${badgeClass}">${esc(values.status)}</span></td>
        `;
    } else if (currentForm.tbody === 'blrec-tbody') {
        const termBadge = values.term.toLowerCase().includes('бессроч') 
            ? `<span class="badge badge-danger">${esc(values.term)}</span>` 
            : esc(values.term);
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.nick)}</td>
            <td>${esc(values.id)}</td>
            <td>${esc(values.reason)}</td>
            <td>${esc(values.from)}</td>
            <td>${esc(values.date)}</td>
            <td>${termBadge}</td>
        `;
    } else if (currentForm.tbody === 'blid-tbody') {
        const termBadge = values.term.toLowerCase().includes('бессроч') 
            ? `<span class="badge badge-danger">${esc(values.term)}</span>` 
            : esc(values.term);
        tr.innerHTML = `
            <td>${num}</td>
            <td>${esc(values.id)}</td>
            <td>${esc(values.nick) || '—'}</td>
            <td>${esc(values.reason)}</td>
            <td>${esc(values.from)}</td>
            <td>${esc(values.date)}</td>
            <td>${termBadge}</td>
        `;
    }

    tbody.appendChild(tr);
    closeModal();
}

function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Close modal on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
