
// =====================================
// CAREERTRACK - JOB APPLICATION TRACKER
// =====================================


// GET HTML ELEMENTS

const openAddModal = document.getElementById("openAddModal");
const closeAddModal = document.getElementById("closeAddModal");
const cancelForm = document.getElementById("cancelForm");

const applicationModal = document.getElementById("applicationModal");
const applicationForm = document.getElementById("applicationForm");

const companyInput = document.getElementById("companyInput");
const roleInput = document.getElementById("roleInput");
const dateInput = document.getElementById("dateInput");
const statusInput = document.getElementById("statusInput");
const jobLinkInput = document.getElementById("jobLinkInput");
const notesInput = document.getElementById("notesInput");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const tableBody = document.getElementById("applicationsTableBody");
const emptyState = document.getElementById("emptyState");

const modalTitle = document.getElementById("modalTitle");


// APPLICATION DATA

let applications = JSON.parse(
    localStorage.getItem("careerTrackApplications") || "[]"
);

let editingId = null;


// SAVE DATA TO LOCAL STORAGE

function saveApplications() {

    localStorage.setItem(
        "careerTrackApplications",
        JSON.stringify(applications)
    );

}


// OPEN MODAL

function openModal() {

    applicationForm.reset();

    editingId = null;

    modalTitle.textContent = "Add New Application";

    dateInput.value = new Date().toLocaleDateString("en-CA");

    applicationModal.hidden = false;

    companyInput.focus();

}


// CLOSE MODAL

function closeModal() {

    applicationModal.hidden = true;

    applicationForm.reset();

    editingId = null;

}


// BUTTON EVENTS

openAddModal.addEventListener("click", openModal);

closeAddModal.addEventListener("click", closeModal);

cancelForm.addEventListener("click", closeModal);

applicationModal.addEventListener("click", function(event) {

    if (event.target === applicationModal) {
        closeModal();
    }

});


// ADD OR UPDATE APPLICATION

applicationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;
    const jobLink = jobLinkInput.value.trim();
    const notes = notesInput.value.trim();

    if (!company || !role || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    const applicationData = {
        company,
        role,
        date,
        status,
        jobLink,
        notes
    };

    if (editingId !== null) {

        applications = applications.map(function(app) {

            if (app.id === editingId) {
                return {
                    ...app,
                    ...applicationData
                };
            }

            return app;

        });

        alert("Application updated successfully!");

    } else {

        const newApplication = {
            id: Date.now().toString() +
                Math.random().toString(36).slice(2),
            ...applicationData
        };

        applications.push(newApplication);

        alert("Application added successfully!");

    }

    saveApplications();

    displayApplications();

    updateStatistics();

    closeModal();

});


// DISPLAY APPLICATIONS

function displayApplications() {

    tableBody.replaceChildren();

    const searchValue = searchInput.value.toLowerCase().trim();

    const filterValue = statusFilter.value;

    const filteredApplications = applications.filter(function(app) {

        const matchesSearch =
            app.company.toLowerCase().includes(searchValue) ||
            app.role.toLowerCase().includes(searchValue);

        const matchesStatus =
            filterValue === "All" ||
            app.status === filterValue;

        return matchesSearch && matchesStatus;

    });


    filteredApplications.forEach(function(app) {

        const row = document.createElement("tr");

        // COMPANY

        const companyCell = document.createElement("td");
        companyCell.textContent = app.company;

        if (app.notes) {
            companyCell.title = app.notes;
        }

        // JOB ROLE

        const roleCell = document.createElement("td");
        roleCell.textContent = app.role;

        // DATE

        const dateCell = document.createElement("td");
        dateCell.textContent = app.date;

        // STATUS

        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        statusBadge.className =
            "status-badge status-" +
            app.status.toLowerCase();

        statusBadge.textContent = app.status;

        statusCell.appendChild(statusBadge);


        // ACTION BUTTONS

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.dataset.action = "edit";
        editButton.dataset.id = app.id;

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = app.id;

        actionCell.append(editButton, deleteButton);


        // ADD CELLS TO ROW

        row.append(
            companyCell,
            roleCell,
            dateCell,
            statusCell,
            actionCell
        );

        tableBody.appendChild(row);

    });


    // EMPTY STATE

    emptyState.hidden = filteredApplications.length > 0;

}


// EDIT AND DELETE APPLICATIONS

tableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;

    if (button.dataset.action === "edit") {

        editApplication(id);

    }

    if (button.dataset.action === "delete") {

        deleteApplication(id);

    }

});


// EDIT APPLICATION

function editApplication(id) {

    const app = applications.find(function(item) {

        return item.id === id;

    });

    if (!app) return;

    editingId = id;

    companyInput.value = app.company;
    roleInput.value = app.role;
    dateInput.value = app.date;
    statusInput.value = app.status;
    jobLinkInput.value = app.jobLink || "";
    notesInput.value = app.notes || "";

    modalTitle.textContent = "Edit Application";

    applicationModal.hidden = false;

}


// DELETE APPLICATION

function deleteApplication(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    applications = applications.filter(function(app) {

        return app.id !== id;

    });

    saveApplications();

    displayApplications();

    updateStatistics();

    alert("Application deleted successfully!");

}


// SEARCH APPLICATIONS

searchInput.addEventListener("input", function() {

    displayApplications();

});


// FILTER APPLICATIONS

statusFilter.addEventListener("change", function() {

    displayApplications();

});


// UPDATE DASHBOARD STATISTICS

function updateStatistics() {

    document.getElementById("totalCount").textContent =
        applications.length;

    document.getElementById("interviewCount").textContent =
        applications.filter(app =>
            app.status === "Interview"
        ).length;

    document.getElementById("offerCount").textContent =
        applications.filter(app =>
            app.status === "Selected"
        ).length;

    document.getElementById("rejectedCount").textContent =
        applications.filter(app =>
            app.status === "Rejected"
        ).length;

}


// INITIALIZE APPLICATION

function initializeApp() {

    displayApplications();

    updateStatistics();

}

initializeApp();
