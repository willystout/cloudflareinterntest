

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const ORG_NAMESPACE = new WorkersKV("d3cf2557154b4d8587724bfb800c5a23");

async function handleRequest(request) {
  if (
    request.method === "GET" &&
    new URL(request.url).pathname === "/organization-chart"
  ) {
    try {
      // Fetch organization data from KV
      const orgData = await ORG_NAMESPACE.get("data", "json");

      if (!orgData) {
        return new Response(
          JSON.stringify({ error: "Organization data not found" }),
          { status: 404 }
        );
      }

      // Transform organization data as needed for the graph representation
      const graphData = transformToGraph(orgData);

      return new Response(JSON.stringify(graphData), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
}
transformToGraph();

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
