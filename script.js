document.addEventListener('DOMContentLoaded', () => {
    fetchOrganizationData();
});

function fetchOrganizationData() {
    fetch('https://my-worker.willystout5.workers.dev/get-organization')
    .then(response => response.json())
    .then(data => {
        displayOrganizationData(data.organization);
    })
    .catch(error => console.error('Error fetching organization data:', error));
}


function displayOrganizationData(organization) {
    const organizationDiv = document.getElementById('organization');
    organization.departments.forEach(department => {
        const departmentDiv = document.createElement('div');
        departmentDiv.className = 'department';
        departmentDiv.innerHTML = `<h2>${department.name}</h2><p>Manager: ${department.managerName}</p>`;
        
        const employeesList = document.createElement('ul');
        department.employees.forEach(employee => {
            const employeeItem = document.createElement('li');
            employeeItem.className = 'employee';
            employeeItem.innerText = `${employee.name} - ${employee.skills.join(', ')}`;
            employeesList.appendChild(employeeItem);
        });

        departmentDiv.appendChild(employeesList);
        organizationDiv.appendChild(departmentDiv);
    });
}
