# Northcoders News API

Link to hosted version: https://bc-news-public-princegeord.onrender.com/

Summary:
A news website that lets users search for articles which can be further refined via topics and comments

---

Project Setup:

Create 2 new files

1. .env.development and insert this line of code: PGDATABASE=nc_news
2. .env.test and insert this line of code: PGDATABASE=nc_new_test

How to clone:

CLI Command: git clone https://github.com/PrinceGeord/be-nc-news-public.git

---

Dependencies - Install required packages with the following CLI commands:

npm i dotenv (version 16.3.1 or higher)
npm i express (version 4.18.2 or higher)
npm i pg (version 8.7.3 or higher)

---

How to seed local database:

1. npm run setup-dbs
2. npm run seed

---

How to run tests:
Testing is reliant on jest package (version 27.5.1 or higher)

Other modules required for testing are:

1. jest-extended (version 2.0.0 or higher)
2. jest-sorted (version 1.0.14 or higher)
3. supertest (version 6.3.3 or higiher)
4. pg-format (version 1.0.4 or higher)
5. husky (version 8.0.2 or higher)

---

Minimum version of Node.js required: 18.11.3
Minimum version of Postgres required: 8.7.3
