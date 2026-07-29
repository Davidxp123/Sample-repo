/**
 * LPI Enterprise Platform - Core Dataverse State & Interactive Controller
 */

// Initial Mock Datastore mirroring Dataverse tables
let state = {
    permits: [
        { id: 'PRM-2026-8841', type: 'Building', applicant: 'Apex Developments LLC', propertyId: 'PID-4409-8812', stage: 'Department Review', status: 'In Progress', issueDate: '2026-07-29', expiryDate: '2027-07-29' },
        { id: 'PRM-2026-8842', type: 'Electrical', applicant: 'Metro Grid Systems', propertyId: 'PID-1029-3321', stage: 'Field Inspection', status: 'Scheduled', issueDate: '2026-06-15', expiryDate: '2027-06-15' },
        { id: 'PRM-2026-8843', type: 'Plumbing', applicant: 'Urban Infra Partners', propertyId: 'PID-9921-1044', stage: 'Final Approval', status: 'Issued', issueDate: '2026-05-01', expiryDate: '2027-05-01' },
        { id: 'PRM-2026-8844', type: 'Demolition', applicant: 'Pacific Razing Corp', propertyId: 'PID-5541-0029', stage: 'Submission', status: 'Pending Docs', issueDate: '2026-07-28', expiryDate: '2027-07-28' },
        { id: 'PRM-2026-8845', type: 'Sign', applicant: 'Neon Glow Media', propertyId: 'PID-8831-2910', stage: 'Field Inspection', status: 'In Progress', issueDate: '2026-07-10', expiryDate: '2027-07-10' }
    ],
    deptTasks: [
        { permitRef: 'PRM-2026-8841', dept: 'Zoning & Land Use', reviewer: 'Sarah Jenkins', dueDate: '2026-08-05', status: 'Pending', escalation: false },
        { permitRef: 'PRM-2026-8841', dept: 'Structural Engineering', reviewer: 'Michael Chang', dueDate: '2026-08-02', status: 'Approved', escalation: false },
        { permitRef: 'PRM-2026-8842', dept: 'Electrical Safety', reviewer: 'David Ross', dueDate: '2026-07-26', status: 'Overdue', escalation: true },
        { permitRef: 'PRM-2026-8844', dept: 'Environmental Dept', reviewer: 'Elena Rostova', dueDate: '2026-08-10', status: 'Pending', escalation: false }
    ],
    inspections: [
        { permitRef: 'PRM-2026-8842', type: 'Electrical', stage: 'Stage 3: Panel Wiring & Grounding', inspector: 'Robert Vance', date: '2026-08-02', outcome: 'Scheduled' },
        { permitRef: 'PRM-2026-8845', type: 'Sign', stage: 'Stage 2: Structural Mount Check', inspector: 'Amanda Waller', date: '2026-08-01', outcome: 'Passed' },
        { permitRef: 'PRM-2026-8841', type: 'Building', stage: 'Stage 5: Foundation & Framing', inspector: 'Marcus Brody', date: '2026-08-04', outcome: 'Scheduled' }
    ],
    documents: [
        { name: 'Architectural_Blueprint_v2.pdf', permit: 'PRM-2026-8841', size: '14.2 MB', preview: 'PDF Document Preview: Floor plans verified against Zoning setback requirements.' },
        { name: 'Electrical_Load_Calculations.xlsx', permit: 'PRM-2026-8842', size: '3.1 MB', preview: 'Excel Data Preview: Max amperage load 400A confirmed compliant.' },
        { name: 'Environmental_Impact_Study.pdf', permit: 'PRM-2026-8844', size: '8.5 MB', preview: 'PDF Document Preview: Soil grading and runoff mitigation approved.' }
    ],
    auditLogs: [
        { time: '2026-07-29 14:12', user: 'Admin Reviewer', entity: 'PRM-2026-8841', op: 'Create', prev: 'N/A', new: 'Record Created via Portal' },
        { time: '2026-07-29 11:05', user: 'Michael Chang', entity: 'PRM-2026-8841', op: 'Update', prev: 'Review: Pending', new: 'Review: Approved' },
        { time: '2026-07-28 09:30', user: 'System (Power Automate)', entity: 'PRM-2026-8844', op: 'Automation', prev: 'None', new: 'Auto-generated 3 Dept Tasks' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation View Switcher
    const navLinks = document.querySelectorAll('.nav-link');
    const appViews = document.querySelectorAll('.app-view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = `view-${link.getAttribute('data-view')}`;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            appViews.forEach(v => {
                v.classList.remove('active');
                if (v.id === viewId) v.classList.add('active');
            });
        });
    });

    // Render initial tables
    renderAll();

    // 2. Global Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderPermitTables(query);
    });

    // 3. Dashboard Filter Chips
    const chips = document.querySelectorAll('#dashboardFilters .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderMasterTable(chip.getAttribute('data-filter'));
        });
    });

    // 4. New Permit Modal Logic
    const modal = document.getElementById('newPermitModal');
    document.getElementById('openNewPermitModal').addEventListener('click', openModal);
    document.getElementById('addNewFromList').addEventListener('click', openModal);
    document.getElementById('closePermitModal').addEventListener('click', closeModal);
    document.getElementById('cancelPermitModal').addEventListener('click', closeModal);

    function openModal() {
        modal.classList.add('open');
        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
        document.getElementById('formIssueDate').value = today;
        document.getElementById('formExpiryDate').value = nextYear;
    }

    function closeModal() {
        modal.classList.remove('open');
    }

    // Handle Form Submit
    document.getElementById('permitForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('formPermitType').value;
        const applicant = document.getElementById('formApplicant').value;
        const propertyId = document.getElementById('formPropertyId').value;
        const newRef = 'PRM-2026-' + Math.floor(1000 + Math.random() * 9000);

        const newPermit = {
            id: newRef,
            type: type,
            applicant: applicant,
            propertyId: propertyId,
            stage: 'Submission',
            status: 'In Progress',
            issueDate: document.getElementById('formIssueDate').value,
            expiryDate: document.getElementById('formExpiryDate').value
        };

        state.permits.unshift(newPermit);
        state.auditLogs.unshift({
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Admin Reviewer',
            entity: newRef,
            op: 'Create',
            prev: 'None',
            new: `Permit Type: ${type} initialized with 1-Yr Expiry`
        });

        renderAll();
        closeModal();
        alert(`Success! Master Record ${newRef} created in Dataverse with auto-calculated 1-year expiry.`);
    });

    // 5. Checklist Modal Logic
    const checklistModal = document.getElementById('checklistModal');
    document.getElementById('closeChecklistModal').addEventListener('click', () => checklistModal.classList.remove('open'));
    document.getElementById('cancelChecklist').addEventListener('click', () => checklistModal.classList.remove('open'));
    document.getElementById('saveChecklistBtn').addEventListener('click', () => {
        checklistModal.classList.remove('open');
        alert('Inspection Checklist successfully synchronized and pass/fail outcome logged to Dataverse.');
    });

    // Animated Counters
    document.querySelectorAll('.bm-val').forEach(el => {
        const target = parseFloat(el.getAttribute('data-count'));
        let current = 0;
        const step = target / 30;
        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    });
});

// Render Functions
function renderAll() {
    renderMasterTable('all');
    renderFullPermitsTable();
    renderDeptTasksTable();
    renderInspectionsTable();
    renderDocumentsVault();
    renderAuditTable();
}

function renderMasterTable(filter = 'all') {
    const tbody = document.getElementById('permitTableBody');
    tbody.innerHTML = '';

    const filtered = state.permits.filter(p => filter === 'all' || p.type === filter);
    filtered.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><span class="code-pill">${p.id}</span></td>
                <td><strong>${p.type}</strong></td>
                <td>${p.applicant}</td>
                <td><span class="code-pill">${p.propertyId}</span></td>
                <td><span class="badge info">${p.stage}</span></td>
                <td><span class="badge success">${p.status}</span></td>
                <td>${p.expiryDate}</td>
                <td><button class="btn-secondary btn-sm" onclick="inspectPermit('${p.id}')">Inspect</button></td>
            </tr>
        `;
    });
}

function renderPermitTables(query) {
    const tbody = document.getElementById('permitTableBody');
    tbody.innerHTML = '';
    state.permits.filter(p => p.id.toLowerCase().includes(query) || p.applicant.toLowerCase().includes(query) || p.propertyId.toLowerCase().includes(query)).forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><span class="code-pill">${p.id}</span></td>
                <td><strong>${p.type}</strong></td>
                <td>${p.applicant}</td>
                <td><span class="code-pill">${p.propertyId}</span></td>
                <td><span class="badge info">${p.stage}</span></td>
                <td><span class="badge success">${p.status}</span></td>
                <td>${p.expiryDate}</td>
                <td><button class="btn-secondary btn-sm" onclick="inspectPermit('${p.id}')">Inspect</button></td>
            </tr>
        `;
    });
}

function renderFullPermitsTable() {
    const tbody = document.getElementById('fullPermitTableBody');
    tbody.innerHTML = '';
    state.permits.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><span class="code-pill">${p.id}</span></td>
                <td><strong>${p.type}</strong></td>
                <td>${p.applicant}</td>
                <td><span class="code-pill">${p.propertyId}</span></td>
                <td><span class="badge info">${p.stage}</span></td>
                <td><span class="badge success">${p.status}</span></td>
                <td>${p.issueDate}</td>
                <td>${p.expiryDate}</td>
                <td><button class="btn-secondary btn-sm" onclick="inspectPermit('${p.id}')">View Form</button></td>
            </tr>
        `;
    });
}

function renderDeptTasksTable() {
    const tbody = document.getElementById('deptTaskTableBody');
    tbody.innerHTML = '';
    state.deptTasks.forEach(t => {
        tbody.innerHTML += `
            <tr>
                <td><span class="code-pill">${t.permitRef}</span></td>
                <td><strong>${t.dept}</strong></td>
                <td>${t.reviewer}</td>
                <td>${t.dueDate}</td>
                <td><span class="badge ${t.status === 'Approved' ? 'success' : t.status === 'Overdue' ? 'danger' : 'warning'}">${t.status}</span></td>
                <td>${t.escalation ? '<span class="badge danger">Escalated</span>' : '<span class="text-muted">None</span>'}</td>
                <td><button class="btn-secondary btn-sm" onclick="toggleTaskReview('${t.permitRef}', '${t.dept}')">Toggle Decision</button></td>
            </tr>
        `;
    });
}

function renderInspectionsTable() {
    const tbody = document.getElementById('inspectionTableBody');
    tbody.innerHTML = '';
    state.inspections.forEach(i => {
        tbody.innerHTML += `
            <tr>
                <td><span class="code-pill">${i.permitRef}</span></td>
                <td>${i.type}</td>
                <td><strong>${i.stage}</strong></td>
                <td>${i.inspector}</td>
                <td>${i.date}</td>
                <td><span class="badge ${i.outcome === 'Passed' ? 'success' : 'info'}">${i.outcome}</span></td>
                <td><button class="btn-primary btn-sm" onclick="openChecklistModal('${i.stage}')">5-Pt Checklist</button></td>
            </tr>
        `;
    });
}

function renderDocumentsVault() {
    const grid = document.getElementById('docVaultGrid');
    grid.innerHTML = '';
    state.documents.forEach(d => {
        grid.innerHTML += `
            <div class="doc-card">
                <div class="doc-top">
                    <div class="doc-icon"><i class="fa-solid fa-file-pdf"></i></div>
                    <div class="doc-meta">
                        <h4>${d.name}</h4>
                        <span>Ref: ${d.permit} • ${d.size}</span>
                    </div>
                </div>
                <div class="doc-preview-box">${d.preview}</div>
                <button class="btn-secondary btn-sm" onclick="alert('In-App Dataverse Document Viewer: Rendering ${d.name} without mandatory download.')">View Preview</button>
            </div>
        `;
    });
}

function renderAuditTable() {
    const tbody = document.getElementById('auditTableBody');
    tbody.innerHTML = '';
    state.auditLogs.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.time}</td>
                <td><strong>${a.user}</strong></td>
                <td><span class="code-pill">${a.entity}</span></td>
                <td><span class="badge purple">${a.op}</span></td>
                <td class="text-muted">${a.prev}</td>
                <td>${a.new}</td>
            </tr>
        `;
    });
}

// Interactive Helpers
function inspectPermit(id) {
    const permit = state.permits.find(p => p.id === id);
    if (permit) {
        alert(`Model-Driven Form Inspector:\n\nPermit Number: ${permit.id}\nType: ${permit.type}\nApplicant: ${permit.applicant}\nProperty ID: ${permit.propertyId} (Synchronized)\nExpiry Date: ${permit.expiryDate} (Auto-calculated 1-Yr)\nStage: ${permit.stage}`);
    }
}

function openChecklistModal(stageName) {
    document.getElementById('checklistModalTitle').textContent = `Checklist: ${stageName}`;
    const container = document.getElementById('checklistContainer');
    container.innerHTML = `
        <div class="checklist-item"><span>1. Structural integrity & load compliance</span><div class="checklist-actions"><button class="chk-btn pass active">Pass</button><button class="chk-btn fail">Fail</button></div></div>
        <div class="checklist-item"><span>2. Safety clearance perimeter check</span><div class="checklist-actions"><button class="chk-btn pass active">Pass</button><button class="chk-btn fail">Fail</button></div></div>
        <div class="checklist-item"><span>3. Approved municipal materials verified</span><div class="checklist-actions"><button class="chk-btn pass active">Pass</button><button class="chk-btn fail">Fail</button></div></div>
        <div class="checklist-item"><span>4. Electrical/Plumbing rough-in testing</span><div class="checklist-actions"><button class="chk-btn pass">Pass</button><button class="chk-btn fail active">Fail</button></div></div>
        <div class="checklist-item"><span>5. Final setback & elevation sign-off</span><div class="checklist-actions"><button class="chk-btn pass active">Pass</button><button class="chk-btn fail">Fail</button></div></div>
    `;
    document.getElementById('checklistModal').classList.add('open');
}

function toggleTaskReview(permitRef, deptName) {
    const task = state.deptTasks.find(t => t.permitRef === permitRef && t.dept === deptName);
    if (task) {
        task.status = task.status === 'Approved' ? 'Pending' : 'Approved';
        state.auditLogs.unshift({
            time: new Date().toISOString().replace('T', ' ').substring(0, 16),
            user: 'Admin Reviewer',
            entity: permitRef,
            op: 'Update',
            prev: 'Dept Task Status changed',
            new: `${deptName} Status: ${task.status}`
        });
        renderDeptTasksTable();
        renderAuditTable();
    }
}