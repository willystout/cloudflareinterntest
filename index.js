const csvtojson = require('csvtojson');
const fs = require('fs');

// Input CSV file path
const csvFilePath = 'general_data.csv';

// Output JSON file path
const jsonFilePath = 'output.json';

// Read CSV file and convert to JSON
csvtojson()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    if (!Array.isArray(jsonArray)) {
      console.error('Error: CSV data is not an array.');
      return;
    }

    // Organize data into a hierarchical structure
    const organizedData = organizeData(jsonArray);

    // Write the organized data to a JSON file
    fs.writeFile(jsonFilePath, JSON.stringify(organizedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Conversion complete. JSON file created:', jsonFilePath);
      }
    });
  })
  .catch((error) => {
    console.error('Error converting CSV to JSON:', error);
  });

// Function to organize data into a hierarchical structure
function organizeData(csvData) {
  const organizedData = {};

  csvData.forEach((entry) => {
    const organization = 'YourOrganization'; // Replace with your organization name
    const departmentName = entry.department;
    const employee = {
      name: entry.name,
      department: departmentName,
      salary: parseFloat(entry.salary),
      office: entry.office,
      isManager: entry.isManager.toLowerCase() === 'true',
      skills: [
        entry.skill1.trim(),
        entry.skill2.trim(),
        entry.skill3.trim(),
      ],
    };

    // Initialize organization if not exists
    if (!organizedData[organization]) {
      organizedData[organization] = { departments: [] };
    }

    // Find or create department
    let department = organizedData[organization].departments.find(
      (dep) => dep.DeptName === departmentName
    );

    if (!department) {
      department = {
        DeptName: departmentName,
        managerName: '', // Default manager name
        employees: [],
      };
      organizedData[organization].departments.push(department);
    }

    // Checks if the employee is a manager
    if (employee.isManager) {
      department.managerName = employee.name;
    }

    // Adds an employee to the department
    department.employees.push(employee);
  });

  return organizedData;
}