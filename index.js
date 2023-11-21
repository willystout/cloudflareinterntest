addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  switch (url.pathname) {
    case "/get-organization":
      return getOrganizationData();
    case "/me":
      return getMe();
    default:
      return defaultResponse(request);
  }
}

import organizationData from './output.json';

// the get-organization endpoint
async function getOrganizationData() {
  try {
    const storedData = fetch("output.json");
    transformToGraph();
    return new Response(storedData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error fetching organization data", { status: 500 });
  }
}


// the me endpoint
async function getMe() {
  const myself = {
    name: "William C. Stout",
    homepage: "https://www.linkedin.com/in/williamcstout/",
    gitHubURL: "https://www.github.com/willystout/",
    interestingFact:
      "I was born on the same day as my sister and we are 5 years apart",
    mySkills: ["Conscientious", "Python, Java & C", "Receptive"],
  };
  return new Response(JSON.stringify(myself), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// the default response
function defaultResponse(request) {
  return new Response(
    "Welcome to my Cloudflare Worker! Use the /get-organization or /me endpoints!",
    {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    }
  );
}


// Function to transform organization data to graph representation
function transformToGraph(orgData) {
  const csvtojson = require("csvtojson");
  const fs = require("fs");
  const csvFilePath = "general_data.csv";
  const jsonFilePath = "output.json";

  // Reads the CSV file and converts it to JSON
  csvtojson()
    .fromFile(csvFilePath)
    .then((jsonArray) => {
      if (!Array.isArray(jsonArray)) {
        console.error("Error: CSV data is not an array.");
        return;
      }

      // Organize data into a hierarchical structure
      const organizedData = organizeData(jsonArray);

      // Write the organized data to a JSON file
      fs.writeFile(
        jsonFilePath,
        JSON.stringify(organizedData, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing JSON file:", err);
          } else {
            console.log(
              "Conversion complete. JSON file created:",
              jsonFilePath
            );
          }
        }
      );
    })
    .catch((error) => {
      console.error("Error converting CSV to JSON:", error);
    });

  // Function to organize data into a hierarchical structure
  function organizeData(csvData) {
    const organizedData = {};

    csvData.forEach((entry) => {
      const organization = "YourOrganization"; 
      const departmentName = entry.department;
      const employee = {
        name: entry.name,
        department: departmentName,
        salary: parseFloat(entry.salary),
        office: entry.office,
        isManager: entry.isManager.toLowerCase() === "true",
        skills: [entry.skill1.trim(), entry.skill2.trim(), entry.skill3.trim()],
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
          managerName: "", // Default manager name
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
}
