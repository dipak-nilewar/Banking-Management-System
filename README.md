\# 🏦 Banking Management System



A full-stack \*\*Banking Management System\*\* built using \*\*Spring Boot, Spring Security, JWT, MySQL, React.js, and Vite\*\*.



The application provides secure banking operations such as user authentication, customer management, bank account management, deposits, withdrawals, fund transfers, transaction history, and beneficiary management.



The project follows a modular backend architecture with RESTful APIs and a modern React-based frontend.



\---



\## 📌 Project Overview



The Banking Management System is designed to simulate core digital banking operations through a secure web application.



Users can:



\* Register and log in securely

\* Authenticate using JWT

\* Manage their customer profile

\* Create and manage bank accounts

\* Deposit money

\* Withdraw money

\* Transfer money between accounts

\* View transaction history

\* Add and manage beneficiaries

\* Transfer funds to beneficiaries

\* View account balances

\* Manage banking-related information through a dashboard



The system also supports \*\*role-based access control\*\* for different users such as `CUSTOMER` and `ADMIN`.



\---



\## ✨ Key Features



\### 🔐 Authentication \& Security



\* User registration

\* User login

\* JWT-based authentication

\* BCrypt password encryption

\* Role-based authorization

\* Protected REST APIs

\* Spring Security integration

\* Secure access using Bearer tokens

\* Authentication through `SecurityContextHolder`



\### 👤 Customer Management



\* Create customer profile

\* View customer information

\* Update customer information

\* Associate customers with authenticated users

\* Customer ownership validation



\### 🏦 Account Management



\* Create bank accounts

\* Support for Savings and Current accounts

\* Generate account numbers

\* View account details

\* Check account balance

\* Account status management

\* Customer-account ownership validation



\### 💰 Transactions



\* Deposit money

\* Withdraw money

\* Transfer money

\* Transaction history

\* Unique transaction/reference IDs

\* Balance validation

\* Transaction status handling

\* Transactional database operations



\### 👥 Beneficiary Management



\* Add beneficiary

\* View beneficiaries

\* Delete beneficiary

\* Transfer money to beneficiary

\* Validate beneficiary ownership

\* Secure beneficiary operations using logged-in customer information



\### 🛡️ Error Handling



The backend uses centralized exception handling with `@RestControllerAdvice`.



Custom exceptions include:



\* `AccountNotFoundException`

\* `InsufficientBalanceException`

\* `InvalidTransferException`

\* `UserNotFoundException`

\* `DuplicateAccountException`



\---



\# 🛠️ Technology Stack



\## Backend



| Technology        | Purpose                        |

| ----------------- | ------------------------------ |

| Java 17           | Programming language           |

| Spring Boot 4.1.1 | Backend framework              |

| Spring Security   | Authentication \& authorization |

| JWT               | Token-based authentication     |

| BCrypt            | Password encryption            |

| Spring Data JPA   | Database access                |

| Hibernate         | ORM                            |

| MySQL 8           | Relational database            |

| Maven             | Dependency management          |

| Lombok            | Reduce boilerplate code        |

| Swagger / OpenAPI | API documentation              |



\## Frontend



| Technology | Purpose               |

| ---------- | --------------------- |

| React.js   | Frontend UI           |

| Vite       | Frontend build tool   |

| JavaScript | Application logic     |

| HTML5      | Structure             |

| CSS3       | Styling               |

| REST APIs  | Backend communication |



\## Development Tools



\* IntelliJ IDEA / Eclipse / Spring Tool Suite

\* Visual Studio Code

\* Postman

\* MySQL Workbench

\* Git

\* GitHub



\---



\# 🏗️ Project Architecture



The project is divided into two major applications:



```text

Banking-Management-System

│

├── backend

│   └── Spring Boot REST API

│

├── frontend

│   └── React + Vite application

│

├── .gitignore

├── LICENSE

└── README.md

```



\### High-Level Architecture



```text

&#x20;                 ┌──────────────────────┐

&#x20;                 │      React UI        │

&#x20;                 │   React + Vite       │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;                            │ HTTP / REST API

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │   Spring Boot API    │

&#x20;                 │      Port 8081       │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;             ┌──────────────┼──────────────┐

&#x20;             │              │              │

&#x20;             ▼              ▼              ▼

&#x20;       ┌──────────┐   ┌───────────┐   ┌───────────┐

&#x20;       │ Security │   │ Services  │   │ Controllers│

&#x20;       │   JWT    │   │ Business  │   │ REST APIs │

&#x20;       └──────────┘   │   Logic   │   └───────────┘

&#x20;                      └─────┬─────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                   ┌────────────────┐

&#x20;                   │ Spring Data JPA│

&#x20;                   │   + Hibernate  │

&#x20;                   └───────┬────────┘

&#x20;                           │

&#x20;                           ▼

&#x20;                   ┌────────────────┐

&#x20;                   │     MySQL      │

&#x20;                   │   banking\_db   │

&#x20;                   └────────────────┘

```



\---



\# 📁 Project Structure



```text

Banking-Management-System/

│

├── backend/

│   │

│   ├── src/

│   │   ├── main/

│   │   │   ├── java/

│   │   │   │   └── com/

│   │   │   │       └── digital\_banking\_management\_system/

│   │   │   │

│   │   │   │       ├── controller/

│   │   │   │       ├── service/

│   │   │   │       ├── repository/

│   │   │   │       ├── entity/

│   │   │   │       ├── dto/

│   │   │   │       ├── exception/

│   │   │   │       └── security/

│   │   │   │

│   │   │   └── resources/

│   │   │

│   │   └── test/

│   │

│   ├── pom.xml

│   └── mvnw.cmd

│

├── frontend/

│   │

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── services/

│   │   ├── api/

│   │   └── ...

│   │

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

├── LICENSE

└── README.md

```



\---



\# 🔐 Authentication Flow



The application uses \*\*JWT-based authentication\*\*.



\### Login Flow



```text

User

&#x20;│

&#x20;│ Login Email + Password

&#x20;▼

React Frontend

&#x20;│

&#x20;│ POST /api/auth/login

&#x20;▼

Spring Boot

&#x20;│

&#x20;│ Validate credentials

&#x20;▼

Spring Security

&#x20;│

&#x20;│ Generate JWT

&#x20;▼

JWT Token

&#x20;│

&#x20;▼

React Frontend

&#x20;│

&#x20;│ Authorization: Bearer <token>

&#x20;▼

Protected API

```



\### Example Authorization Header



```http

Authorization: Bearer <JWT\_TOKEN>

```



The backend validates the token before allowing access to protected endpoints.



\---



\# 👤 User Roles



The application supports role-based access control.



\### CUSTOMER



Customers can perform operations such as:



\* View profile

\* View accounts

\* Deposit money

\* Withdraw money

\* Transfer money

\* View transactions

\* Manage beneficiaries



\### ADMIN



Administrators can perform administrative operations according to the configured security rules.



\---



\# 🏦 Main Banking Modules



\## 1. User Module



Responsible for:



\* Registration

\* Login

\* Password encryption

\* User roles

\* Authentication



\---



\## 2. Customer Module



Responsible for:



\* Customer creation

\* Customer profile

\* Customer information

\* User/customer relationship



\---



\## 3. Account Module



Responsible for:



\* Account creation

\* Account number

\* Account type

\* Account balance

\* Account status

\* Account ownership



Supported account types include:



```text

SAVINGS

CURRENT

```



\---



\## 4. Transaction Module



The transaction module manages:



```text

DEPOSIT

WITHDRAW

TRANSFER

```



Every transaction contains relevant information such as:



\* Transaction ID

\* Reference number

\* Account

\* Amount

\* Transaction type

\* Transaction status

\* Transaction timestamp



\---



\## 5. Beneficiary Module



Customers can manage beneficiaries for transferring money.



Operations include:



```text

Add Beneficiary

&#x20;      ↓

View Beneficiaries

&#x20;      ↓

Transfer Money

&#x20;      ↓

Delete Beneficiary

```



Beneficiary operations are associated with the currently authenticated customer.



\---



\# 🔄 Money Transfer Flow



A typical account-to-account transfer works as follows:



```text

Customer

&#x20;  │

&#x20;  ▼

Transfer Request

&#x20;  │

&#x20;  ▼

Validate Source Account

&#x20;  │

&#x20;  ▼

Validate Destination Account

&#x20;  │

&#x20;  ▼

Check Account Ownership

&#x20;  │

&#x20;  ▼

Check Available Balance

&#x20;  │

&#x20;  ▼

Debit Source Account

&#x20;  │

&#x20;  ▼

Credit Destination Account

&#x20;  │

&#x20;  ▼

Create Transaction Records

&#x20;  │

&#x20;  ▼

Return Transfer Response

```



The transfer operation uses transactional processing to help maintain database consistency.



\---



\# 🗄️ Database



The application uses \*\*MySQL\*\* as the relational database.



Database:



```text

banking\_db

```



Core entities include:



```text

users

customers

accounts

transactions

beneficiaries

audit\_logs

```



\### Entity Relationship Concept



```text

User

&#x20;│

&#x20;│ 1 : 1

&#x20;▼

Customer

&#x20;│

&#x20;│ 1 : Many

&#x20;▼

Accounts

&#x20;│

&#x20;│

&#x20;└──────────────► Transactions



Customer

&#x20;│

&#x20;│ 1 : Many

&#x20;▼

Beneficiaries

```



\---



\# 🌐 REST API



The backend exposes RESTful APIs for frontend communication.



Example API groups:



```text

/api/auth

/api/users

/api/customers

/api/accounts

/api/transactions

/api/beneficiaries

```



\---



\## Example Authentication APIs



\### Register



```http

POST /api/auth/register

```



Example request:



```json

{

&#x20; "name": "John Doe",

&#x20; "email": "john@example.com",

&#x20; "password": "password123"

}

```



\### Login



```http

POST /api/auth/login

```



Example request:



```json

{

&#x20; "email": "john@example.com",

&#x20; "password": "password123"

}

```



\---



\## Example Customer API



```http

POST /api/customers

```



Example:



```json

{

&#x20; "phone": "9876543210",

&#x20; "address": "Pune, Maharashtra"

}

```



\---



\## Example Account API



```http

POST /api/accounts

```



Account information can include:



```json

{

&#x20; "accountType": "SAVINGS"

}

```



\---



\## Example Transaction APIs



\### Deposit



```http

POST /api/transactions/deposit

```



\### Withdraw



```http

POST /api/transactions/withdraw

```



\### Transfer



```http

POST /api/transactions/transfer

```



Example:



```json

{

&#x20; "fromAccountId": 1,

&#x20; "toAccountId": 2,

&#x20; "amount": 5000

}

```



\---



\## Example Beneficiary APIs



\### Add Beneficiary



```http

POST /api/beneficiaries

```



\### Get Beneficiaries



```http

GET /api/beneficiaries

```



\### Delete Beneficiary



```http

DELETE /api/beneficiaries/{id}

```



\### Transfer to Beneficiary



```http

POST /api/beneficiaries/{id}/transfer

```



> API paths may vary slightly depending on the controller mappings in the current implementation.



\---



\# ⚙️ Backend Setup



\## Prerequisites



Install the following:



\* Java 17

\* MySQL 8

\* Git

\* Node.js and npm

\* VS Code / IntelliJ IDEA / Eclipse

\* Postman



Verify Java:



```bash

java -version

```



Verify Node.js:



```bash

node -v

```



Verify npm:



```bash

npm -v

```



\---



\## 1. Clone the Repository



```bash

git clone https://github.com/dipak-nilewar/Banking-Management-System.git

```



Navigate into the project:



```bash

cd Banking-Management-System

```



\---



\# 🔧 Backend Configuration



Navigate to the backend:



```bash

cd backend

```



Create a local configuration file:



```text

src/main/resources/application-local.properties

```



Add your local database and JWT configuration.



Example:



```properties

spring.datasource.url=jdbc:mysql://localhost:3306/banking\_db

spring.datasource.username=root

spring.datasource.password=YOUR\_MYSQL\_PASSWORD



spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true



server.port=8081



jwt.secret=YOUR\_SECRET\_KEY

```



\*\*Do not commit your real password or JWT secret to GitHub.\*\*



The project `.gitignore` excludes local secret configuration files.



\---



\# ▶️ Run the Backend



From the `backend` directory:



\### Windows



```bash

mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

```



The backend will start on:



```text

http://localhost:8081

```



\---



\# 📚 Swagger API Documentation



After starting the backend, Swagger/OpenAPI documentation can be accessed at:



```text

http://localhost:8081/swagger-ui/index.html

```



OpenAPI specification:



```text

http://localhost:8081/v3/api-docs

```



Swagger can be used to:



\* View APIs

\* Understand request/response models

\* Test endpoints

\* Verify authentication

\* Test backend functionality



\---



\# 🎨 Frontend Setup



Open a new terminal.



Navigate to:



```bash

cd Banking-Management-System/frontend

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



The frontend will normally be available at:



```text

http://localhost:5173

```



\---



\# 🔗 Frontend → Backend



The React frontend communicates with the Spring Boot backend through REST APIs.



```text

React Frontend

&#x20;    │

&#x20;    │ HTTP Requests

&#x20;    ▼

Spring Boot Backend

&#x20;    │

&#x20;    ▼

MySQL Database

```



JWT authentication is used when accessing protected APIs.



\---



\# 🧪 Testing



The backend APIs can be tested using:



\* Postman

\* Swagger UI



Recommended testing flow:



```text

1\. Register User

&#x20;       ↓

2\. Login

&#x20;       ↓

3\. Copy JWT Token

&#x20;       ↓

4\. Add Bearer Token

&#x20;       ↓

5\. Create Customer

&#x20;       ↓

6\. Create Account

&#x20;       ↓

7\. Deposit Money

&#x20;       ↓

8\. Withdraw Money

&#x20;       ↓

9\. Add Beneficiary

&#x20;       ↓

10\. Transfer Money

&#x20;       ↓

11\. Check Transaction History

```



\---



\# 🔒 Security Practices



The application implements several security practices:



\* JWT authentication

\* BCrypt password hashing

\* Protected REST endpoints

\* Role-based authorization

\* Customer ownership validation

\* Account ownership validation

\* Balance validation

\* Centralized exception handling

\* Local environment configuration for secrets



Sensitive configuration should always remain outside the public repository.



\---



\# 📊 Frontend Dashboard



The frontend provides a banking dashboard containing functionality such as:



```text

Dashboard

│

├── Accounts

├── Deposit

├── Withdrawal

├── Transfer

├── Transactions

├── Beneficiaries

├── Profile

├── Settings

└── Admin

```



\---



\# 📸 Screenshots



Add your actual application screenshots here after capturing them.



Recommended screenshots:



\### Login



```text

docs/screenshots/login.png

```



\### Dashboard



```text

docs/screenshots/dashboard.png

```



\### Accounts



```text

docs/screenshots/accounts.png

```



\### Transfer



```text

docs/screenshots/transfer.png

```



\### Beneficiaries



```text

docs/screenshots/beneficiaries.png

```



\### Transaction History



```text

docs/screenshots/transactions.png

```



After adding the images to the repository, use:



```markdown

!\[Login](docs/screenshots/login.png)



!\[Dashboard](docs/screenshots/dashboard.png)



!\[Accounts](docs/screenshots/accounts.png)



!\[Transfer](docs/screenshots/transfer.png)



!\[Beneficiaries](docs/screenshots/beneficiaries.png)



!\[Transactions](docs/screenshots/transactions.png)

```



\---



\# 🚀 Future Enhancements



Potential future improvements include:



\* Email notifications

\* SMS/OTP verification

\* Forgot password functionality

\* Account statement PDF generation

\* Scheduled payments

\* Advanced admin dashboard

\* Audit log UI

\* Docker deployment

\* CI/CD pipeline

\* AWS deployment

\* Redis caching

\* Automated unit and integration testing

\* Payment gateway integration

\* Two-factor authentication



\---



\# 🎯 Learning Outcomes



This project demonstrates practical experience with:



\* Core Java

\* Spring Boot

\* Spring Security

\* JWT authentication

\* REST API development

\* Spring Data JPA

\* Hibernate

\* MySQL

\* Entity relationships

\* DTO-based architecture

\* Exception handling

\* Transaction management

\* Role-based authorization

\* React.js

\* REST API integration

\* Git and GitHub

\* API testing with Postman

\* Swagger/OpenAPI



\---



\# 💼 Project Highlights



\### Backend



\* Developed RESTful APIs using Spring Boot

\* Implemented JWT-based authentication

\* Implemented role-based authorization

\* Used BCrypt for password encryption

\* Implemented customer and account ownership validation

\* Implemented banking transactions

\* Implemented beneficiary management

\* Used transactional processing for money transfers

\* Implemented centralized exception handling

\* Integrated MySQL using JPA/Hibernate



\### Frontend



\* Developed responsive banking dashboard using React

\* Integrated REST APIs with backend

\* Implemented authentication flow

\* Implemented account management screens

\* Implemented deposit and withdrawal functionality

\* Implemented transfer functionality

\* Implemented beneficiary management

\* Implemented transaction history

\* Implemented profile and settings sections



\---



\# 📌 Project Status



```text

Backend      : ✅ Completed

Authentication: ✅ JWT

Authorization: ✅ Role-based

Customer     : ✅ Implemented

Accounts     : ✅ Implemented

Transactions : ✅ Implemented

Beneficiary  : ✅ Implemented

Frontend     : ✅ Implemented

GitHub       : ✅ Published

```



\---



\# 👨‍💻 Author



\*\*Dipak Nilewar\*\*



Java Developer | Spring Boot | React.js



📍 Pune, Maharashtra, India



GitHub:

https://github.com/dipak-nilewar



LinkedIn:

https://linkedin.com/in/dipaknilewar8



\---



\# 📄 License



This project is available under the license included in this repository.



\---



\## ⭐ If you find this project useful



Feel free to explore the repository, review the source code, and use it as a reference for learning full-stack Java development.



\*\*Built with Java, Spring Boot, React, and MySQL.\*\*



