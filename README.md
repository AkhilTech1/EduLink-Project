EduLink is a full-stack education management system built with Angular and Spring Boot Microservices. It provides role-based access for Admins, Teachers, and Students to manage courses, attendance, exams, and performance. The system ensures centralized academic management with secure authentication and scalable architecture.# EduLink
# 🎓 EduLink — Smart Education Management System

EduLink is a full-stack education management platform built using 
Angular and Java Spring Boot Microservices. It provides dedicated 
portals for Admins, Teachers, and Students to manage all academic 
activities in one place.

---

## 🚀 Features

### 👨‍💼 Admin
- Approve / Reject student registrations with document verification
- Manage students, teachers and all users
- Create and manage courses and classes
- Monitor attendance across all classes
- Manage exams and grades
- Send notifications to students and teachers
- View reports and analytics

### 👨‍🏫 Teacher
- View assigned courses and student list
- Mark and manage attendance
- Upload study materials
- Create and manage exams
- Assign grades and view student performance
- View class schedule

### 🎒 Student
- Register and wait for admin approval
- View enrolled courses and learning materials
- Check attendance records
- View exam schedules and results
- Track academic performance and reports
- Receive notifications

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|---|---|
| Angular | 21.2.0 |
| TypeScript | 5.9.2 |
| Bootstrap | 5.3.8 |
| RxJS | 7.8.0 |

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.2.0 |
| Spring Cloud | 2023.0.0 |
| Spring Security | 3.2.0 |
| Spring Data JPA | 3.2.0 |
| MySQL | 8.x |
| JWT (jjwt) | 0.11.5 |
| Lombok | Latest |

---

## 🏗️ Architecture

EduLink follows a **Microservices Architecture** where each service 
handles one specific domain.
OU open localhost:4200
         │
         ▼
📄 src/index.html
   Browser loads this first
   Sees <app-root> tag
         │
         ▼
📄 src/main.ts
   Starts Angular
   Like pressing power button
         │
         ▼
📄 src/app/app.config.ts
   Loads 2 settings:
   1. Route map (which URL = which page)
   2. JWT Interceptor (attach token to every request)
         │
         ▼
📄 src/app/app.ts
   <app-root> becomes <router-outlet>
   Empty blank screen — waiting for a page
         │
         ▼
📄 src/app/app.routes.ts
   URL is "/" → wants to show dashboard
   But first → check the guard
         │
         ▼
📄 src/app/guards/auth.guard.ts
   Is token in localStorage? 
   NO → send to /login
         │
         ▼
📄 src/app/components/auth/login.component.ts
   Login page shows on screen
   You type email + password → click Sign In
   Calls auth.service.login()
         │
         ▼
📄 src/app/services/auth.service.ts
   Creates HTTP POST request
   to /api/auth/login
         │
         ▼
📄 src/app/services/jwt.interceptor.ts
   Checks localStorage for token
   No token yet → passes request as-is
         │
         ▼
🖥️  BACKEND
   proxy → api-gateway → identity-service → MySQL
   Checks email + password
   Creates JWT token
   Sends back { token, role, name, email }
         │
         ▼
📄 src/app/services/auth.service.ts
   Saves token, role, name, email
   to localStorage
         │
         ▼
📄 src/app/components/auth/login.component.ts
   Shows "Welcome!" toast popup
   Navigates to dashboard based on role:
   STUDENT  → /student/dashboard
   TEACHER  → /teacher/dashboard
   ADMIN    → /dashboard
         │
         ▼
📄 src/app/guards/auth.guard.ts
   Token exists now → returns true → ALLOW ✅
         │
         ▼
📄 src/app/components/layout/layout.component.ts
   Loads the frame:
   Sidebar + Topbar
   Reads role from localStorage
   Shows correct menu for that role
         │
         ▼
📄 src/app/components/student/student-dashboard.component.ts
   OR admin-dashboard.component.ts
   OR teacher-dashboard.component.ts
         │
         ▼
   YOU SEE YOUR DASHBOARD ✅

   
### Prerequisites
- Node.js 18+
- Java 21
- MySQL 8.x
- Maven 3.8+


### 2. Start Backend Services (in this order) ###
# 1. Start Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. Start API Gateway
cd api-gateway
mvn spring-boot:run

# 3. Start all other services
cd identity-service && mvn spring-boot:run
cd student-service  && mvn spring-boot:run
cd course-service   && mvn spring-boot:run
cd attendance-service && mvn spring-boot:run
cd exam-service     && mvn spring-boot:run
cd learning-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd reporting-service && mvn spring-boot:run
**Front-end:**
cd edulink-frontend
npm install
ng serve
Now you can see UI on http://localhost:4200

   
