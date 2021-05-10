// Set up MySQL connection.
const mysql = require('mysql');

const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  // NOTE: Be sure to add your MySQL password here!
  password: '12345678',
  database: 'cms_db',
});

// Make connection.
connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
});
function updateRoles(){

    connection.query("SELECT * FROM roles", (err, res) => {
        const updatedRoles = res.map((roles) => {
          return {
            name: roles.title,
            value: roles.id,
          };
        });
        connection.query("SELECT * FROM employee", (err, data) => {
          const updateEmployeeArr = data.map((employee) => {
            return {
              name: employee.first_name + " " + employee.last_name,
              value: employee.id,
            };
          });
          inquirer
            .prompt([
              {
                type: "list",
                message: "Which employee would you like to update?",
                name: "employee",
                choices: updateEmployeeArr,
              },
              {
                type: "list",
                message: "What is the employees new role?",
                name: "role",
                choices: updatedRoles,
              },
            ])
            .then((response) => {
              //delete role from chosen employee and add new one?
              let roleRes = response.role;
              let employeeRes = response.employee;
              connection.query(
                `UPDATE employee SET role_id=${roleRes} WHERE id=${employeeRes}`
              );
              if (err) throw err;
              console.log("Employee successfully updated.");
              start();
            });
        });
      });
    };

function addWhat (){
    inquirer.prompt([
        {
            message : 'What would you like to add?',
            type: 'list',
            choices: ['ROLES', 'EMPLOYEES', 'DEPARTMENTS'],
            name: 'add'
        }
    ])    
        .then((data)=>{
            let choice = data.add
            switch(choice){
                case 'EMPLOYEES':
                    //add to EMPLOYEES
                    inquirer.prompt([
                        {
                            message: 'What is your employees name?',
                            type: 'input',
                            name: 'employeeName'
                        },
                        {
                            message:'Last name?',
                            type: 'input',
                            name: 'employeeLast'

                        },
                        {
                            type: "input",
                            message: "Role?",
                            name: "roleName",
                        },
                        {
                            type: "input",
                            message: "Manager?",
                            name: "manager_id"
                        }
                    ]).then((data)=> {
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${answer.employeeName}', '${data.employeeLast}', '${answer.roleName}', '${answer.manager_id}')`,
                            (err, res) => {
                              if (err) throw err;
                              console.log(`${res.affectedRows} employee added.`);
                    })
                    })
                    break;
                case 'DEPARTMENTS':
                    //add to DEPARTMENTS
                    inquirer.prompt([
                        {
                            message: 'What is the name of the department you want to add?',
                            type: 'input',
                            name: 'departmentName'
                        }
                    ]).then((data)=>{
                        connection.query(
                            `INSERT INTO department (name) values ('${data.departmentName})`,
                            (err, res) => {
                              if (err) throw err;
                              console.log(`${data.departmentName} added.`);
                    })
                    })
                    break;
                case 'ROLES':
                    //add to ROLES
                    inquirer.prompt([
                        {
                           message: 'What is the name of the role?',
                           type: 'input',
                           name: 'title' 
                        },
                        {
                            message: 'What is the salary of this role?',
                            type: 'input',
                            name: 'salary'
                        },
                        {
                            message: 'What is the department ID?',
                            type:'number',
                            name: 'departmentID'
                        }
                    ]).then((data)=>{
                        connection.query(
                            `INSERT INTO role (title, salary, department_id) values ('${data.title}', '${data.salary}','${data.departmentID}')`,
                            (err, res) => {
                              if (err) throw err;
                              console.log(`${data.title} added.`);
                    })
                    })
                    break;
            }
        })
    
}

function viewWhat (){
    inquirer.prompt([
        {
            message: 'What would you like to view?',
            choices: ['EMPLOYEES','DEPARTMENTS','ROLES'],
            type: 'list',
            name: 'update'
        }
    ])    
        .then((data1)=>{
            let choice = data1.update
            switch(choice){
                case 'EMPLOYEES':
                    //VIEW ALL EMPLOYEES
                    connection.query("SELECT * FROM employee", (err, res) => {
                        if (err) throw err;
                        console.table(res);
                    })
                    start();
                    break;
                case 'DEPARTMENTS':
                    //VIEW ALL DEPARTMENTS
                    connection.query('SELECT * FROM department', (err, res) => {
                        if (err) throw err;
                        console.table(res);
                      }
                      );
                      start();
                    break;
                case 'ROLES':
                    //VIEW ALL ROLES
                    connection.query('SELECT * FROM role', (err, res) => {
                        if (err) throw err;
                        console.table(res);
                      }
                      );
                      start();
                    break;
            }

    
        })
    
}

function start (){
inquirer.prompt([
    {
   message: 'Would you like to add, view, or update your employees, departments, and roles?',
   choices : ['VIEW', 'ADD', 'UPDATE'],
   type: 'list',
   name: 'choice'
    }
]).then((data)=>{
    let choice = data.choice
    console.log(choice)
    switch(choice){
        case 'ADD':
            //prompt that ask what youd like to add
            addWhat();
            break;
        case 'VIEW':
            //prompt that ask whod ytoud like to view
            viewWhat();
            break;
        case 'UPDATE':
            //prompt that updates employee
            updateRoles();
            break;
    }
})



}
start()