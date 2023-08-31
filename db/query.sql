SELECT roles.title, roles.salary, departments.name FROM roles INNER JOIN departments ON roles.department_id = departments.id;
SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name FROM employees INNER JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id;
