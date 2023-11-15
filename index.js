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
      const orgData = await ORG_NAMESPACE.get("data", "json");

      if (!orgData) {
        return new Response(
          JSON.stringify({ error: "Organization data not found" }),
          { status: 404 }
        );
      }
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

function transformToGraph(orgData) {
  const csvtojson = require("csvtojson");
  const fs = require("fs");
  const csvFilePath = "general_data.csv";
  const jsonFilePath = "output.json";

  csvtojson()
    .fromFile(csvFilePath)
    .then((jsonArray) => {
      if (!Array.isArray(jsonArray)) {
        console.error("Error: CSV data is not an array.");
        return;
      }
      const organizedData = organizeData(jsonArray);

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

      if (!organizedData[organization]) {
        organizedData[organization] = { departments: [] };
      }

      let department = organizedData[organization].departments.find(
        (dep) => dep.DeptName === departmentName
      );

      if (!department) {
        department = {
          DeptName: departmentName,
          managerName: "",
          employees: [],
        };
        organizedData[organization].departments.push(department);
      }

      if (employee.isManager) {
        department.managerName = employee.name;
      }

      department.employees.push(employee);
    });

    return organizedData;
  }
}
