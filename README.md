# E-Commerce Back End

## Description

This project focuses fully on the back end side of e-commercce. It will be using the latest technologies and able to compete with toher e-commerce companies. We will be working with Express.js API to use Sequelize to interact with the MYSQL database.

## User Story
```
GIVEN a functional Express.js API
WHEN I add my database name, MySQL username, and MySQL password to an environment variable file
THEN I am able to connect to a database using Sequelize
WHEN I enter schema and seed commands
THEN a development database is created and is seeded with test data
WHEN I enter the command to invoke the application
THEN my server is started and the Sequelize models are synced to the MySQL database
WHEN I open API GET routes in Insomnia for categories, products, or tags
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete data in my database

```

## Getting Started

To use this command-line application, follow the instructions below:

1. Git clone https://github.com/levigun/ecommerceBackEnd.git . 

2. Open the file in visual studio code.

3. Open the intergrated terminal of the db folder and run "mysql -u root -p".

4. Then type the following commands in consecutive order: "source schema.sql" and "use employee_db".

5. Open the integrated terminal for server.js and type "npm i".

6. Then type the command "node seeds/index.js" to seed all the database.

7. Then type the command "npm start".

8. You now can access all the GET all, GET by ID, POST, PUT, or DELETE for each products, catgeories, and tags routes and you can do this via Insomnia or Postman.


## Video Walk Through

Video Link:



## Reference

https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide

Sam Ngu - 1-on-1 Tutor

Douglas Chan - TA

David Impey - Instructor

Scott Basquill - TA

## License

©2022 Theresa Levina Gunawan.