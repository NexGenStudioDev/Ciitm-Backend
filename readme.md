# Central Institute of Information Technology and Management (CIITM) Backend API 🏫

![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-AMQP%200--9--1-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.12-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

Production-grade educational institution management system and event-driven microservices architecture powering CIITM. Built with Node.js 22, Express, MongoDB with resilient failover, AMQP RabbitMQ message broker with automated in-memory fallback, and Socket.io for real-time telemetry.

- **Base URL**: `http://localhost:3000` (Port: `3000`, Host: `0.0.0.0`)
- **Health Diagnostics**: `GET http://localhost:3000/api/health`
- **Queue Diagnostics**: `GET http://localhost:3000/api/v1/queue/status`
- **Public Assets**: `GET http://localhost:3000/api/images/:filename`

---

## 📑 Table of Contents

1. [Architectural Overview](#-architectural-overview)
2. [Environment Configuration](#-environment-configuration)
3. [RabbitMQ Message Queues](#-rabbitmq-message-queues)
4. [Real-Time WebSockets (Socket.IO)](#-real-time-websockets-socketio)
5. [Complete API Reference & Endpoints](#-complete-api-reference--endpoints)
   - [1. System Diagnostics & Health](#1-system-diagnostics--health)
   - [2. RabbitMQ Message Queue Engine](#2-rabbitmq-message-queue-engine)
   - [3. Authentication & Administrator Accounts](#3-authentication--administrator-accounts)
   - [4. Password Recovery & OTP Validation](#4-password-recovery--otp-validation)
   - [5. Role Management](#5-role-management)
   - [6. Student Admissions](#6-student-admissions)
   - [7. Student Status & Application Review](#7-student-status--application-review)
   - [8. Student Directory & Record Lookups](#8-student-directory--record-lookups)
   - [9. Course Catalog & Curriculum](#9-course-catalog--curriculum)
   - [10. Faculty & Teacher Directory](#10-faculty--teacher-directory)
   - [11. Tuition Fee Billing & Online Payments](#11-tuition-fee-billing--online-payments)
   - [12. Campus Notices & Circulars](#12-campus-notices--circulars)
   - [13. Photo Albums & Media Gallery](#13-photo-albums--media-gallery)
   - [14. Social Media & Campus Contact Links](#14-social-media--campus-contact-links)
   - [15. Contact Inquiries & Feedback](#15-contact-inquiries--feedback)
   - [16. Student Testimonials](#16-student-testimonials)
   - [17. Frontend Dynamic Settings](#17-frontend-dynamic-settings)
6. [Standard HTTP Status Codes & Error Envelopes](#-standard-http-status-codes--error-envelopes)
7. [Scripts & Local Development](#-scripts--local-development)

---

## 🏛️ Architectural Overview

- **Node.js 22 (ESM Standard)**: Native ECMAScript Modules (`import` / `export`) with strict module resolution.
- **Resilient MongoDB Layer**: Mongoose 8 configured with `bufferCommands: false` and request-level guards. If MongoDB is temporarily unreachable or offline, the API does not hang or crash — it promptly serves clean fallback responses without downtime.
- **Dual-Mode RabbitMQ Engine**: Integrated with AMQP (`amqplib`). Automatically discovers live RabbitMQ clusters (`RABBITMQ_URL`) with graceful self-healing, automatic retry loops, and zero-configuration in-memory fallback queues for offline development.
- **Real-Time WebSockets**: Socket.io 4.8 handles live synchronization for dashboard stats, earnings, course enrollment counts, and frontend site configuration.
- **Cloud Storage & Payments**: Pre-configured integration pipelines for Cloudinary asset storage and multi-gateway billing support (Cashfree and Razorpay).

---

## ⚙️ Environment Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example | Required |
|---|---|---|:---:|
| `PORT` | HTTP & WebSocket server port | `3000` | No |
| `NODE_ENV` | Application environment (`development`, `production`, `test`) | `development` | No |
| `MONGO_URL` | MongoDB connection URI string | `mongodb://localhost:27017/ciitm` | Yes (in prod) |
| `RABBITMQ_URL` | AMQP broker connection string | `amqp://localhost:5672` | No (in-memory fallback) |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | `your_super_secret_jwt_key` | Yes |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` | No |
| `SESSION_SECRET` | Express session encryption passphrase | `session_encryption_secret` | No |
| `FRONTEND_URL` | Permitted CORS frontend origin | `http://localhost:3000` | No |
| `Cloudinary_Cloud_Name` | Cloudinary cloud account name | `ciitm-cloud` | For media upload |
| `Cloudinary_API_Key` | Cloudinary API Key | `123456789012345` | For media upload |
| `Cloudinary_API_Secret` | Cloudinary API Secret | `abcdef123456789` | For media upload |
| `Razorpay_key` | Razorpay public key ID | `rzp_test_...` | For payments |
| `Razorpay_secret` | Razorpay private secret | `...` | For payments |
| `CASHFREE_APP_ID` | Cashfree Payments Client ID | `CF_APP_...` | For Cashfree PG |
| `CASHFREE_SECRET_KEY` | Cashfree Payments Secret Key | `CF_SECRET_...` | For Cashfree PG |
| `EMAIL_USER` | SMTP username for transactional mail & OTP | `notifications@ciitm.edu` | For emails |
| `EMAIL_PASS` | SMTP application password | `app_password_here` | For emails |

---

## 🐇 RabbitMQ Message Queues

The application utilizes durable asynchronous message queues to decouple heavy workloads:

| Queue Name | Purpose & Event Triggers | Resilience Mode |
|---|---|:---:|
| `admissions_queue` | Student application submissions, validation, and admission logs | Durable AMQP / Fallback |
| `notifications_queue` | Push notices, urgent alerts, and campus-wide circular broadcasts | Durable AMQP / Fallback |
| `email_queue` | Asynchronous OTP dispatches, status emails, and receipts | Durable AMQP / Fallback |
| `payments_queue` | Tuition fee transactions, webhook verifications, and receipt logs | Durable AMQP / Fallback |
| `audit_queue` | Admin role creations, user authentication logs, and security events | Durable AMQP / Fallback |

*When `RABBITMQ_URL` is omitted or disconnected, the internal queue service seamlessly routes tasks through a thread-safe, in-memory queue emulator with FIFO dispatch.*

---

## ⚡ Real-Time WebSockets (Socket.IO)

The server mounts a Socket.io server on the primary HTTP port:

- **Endpoint**: `ws://localhost:3000/socket.io/`
- **Initial Connection Event**: Emits `'welcome'` with `{ message: 'Welcome to the Socket.IO Server' }`.
- **Registered Handlers**:
  - `FrontendSocket`: Emits live site configuration updates.
  - `DashBoard_Socket`: Emits live admissions counts, tuition totals, and faculty statistics.
  - `Course_Socket`: Emits live updates when courses are created or student enrollments change.

---

## 📖 Complete API Reference & Endpoints

All application routes are prefixed with `/api`.

```
Base URI: http://localhost:3000/api
```

---

### 1. System Diagnostics & Health

#### 1.1 Health Check Probe
- **Method**: `GET`
- **Path**: `/api/health`
- **Auth**: Public

##### Success Response (`200 OK`):
```json
{
  "status": "healthy",
  "uptime": 45.2,
  "timestamp": "2026-09-28T18:00:00.000Z",
  "services": {
    "database": "resilient",
    "rabbitmq": "in-memory (standalone)",
    "port": 3000
  },
  "queues": {
    "connected": false,
    "mode": "in-memory (standalone)",
    "messagesPublished": 8,
    "messagesProcessed": 8,
    "messagesFailed": 0,
    "activeQueues": [
      "admissions_queue",
      "notifications_queue",
      "email_queue",
      "payments_queue",
      "audit_queue"
    ],
    "inMemoryQueueDepths": {
      "admissions_queue": 0,
      "notifications_queue": 0,
      "email_queue": 0,
      "payments_queue": 0,
      "audit_queue": 0
    }
  }
}
```

---

### 2. RabbitMQ Message Queue Engine

#### 2.1 Get Queue Health & Metrics
- **Method**: `GET`
- **Path**: `/api/v1/queue/status`
- **Auth**: Public

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Queue status retrieved successfully",
  "data": {
    "connected": true,
    "mode": "amqp-live",
    "messagesPublished": 24,
    "messagesProcessed": 24,
    "messagesFailed": 0,
    "activeQueues": [
      "admissions_queue",
      "notifications_queue",
      "email_queue",
      "payments_queue",
      "audit_queue"
    ]
  }
}
```

#### 2.2 List Active Queues
- **Method**: `GET`
- **Path**: `/api/v1/queue/list`
- **Auth**: Public

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Active queues listed successfully",
  "data": {
    "total": 5,
    "queues": [
      { "name": "admissions_queue", "purpose": "New student application and enrollment events", "durable": true },
      { "name": "notifications_queue", "purpose": "System notices and student/faculty alerts", "durable": true },
      { "name": "email_queue", "purpose": "Asynchronous transactional emails and OTP dispatch", "durable": true },
      { "name": "payments_queue", "purpose": "Student tuition fees and receipt generation events", "durable": true },
      { "name": "audit_queue", "purpose": "Administrative actions, security logs, and role changes", "durable": true }
    ]
  }
}
```

#### 2.3 Publish Message to Queue
- **Method**: `POST`
- **Path**: `/api/v1/queue/publish`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "queue": "notifications_queue",
  "payload": {
    "title": "Annual Sports Meet 2026",
    "target": "all-students",
    "priority": "normal"
  }
}
```

##### Success Response (`201 Created`):
```json
{
  "status": true,
  "statusCode": 201,
  "message": "Message queued to notifications_queue (in-memory)",
  "data": {
    "success": true,
    "mode": "in-memory",
    "messageId": "msg-1738000000000-8fa12b"
  }
}
```

---

### 3. Authentication & Administrator Accounts

#### 3.1 Admin Registration
- **Method**: `POST`
- **Path**: `/api/v1/auth/Admin/SignUp`
- **Content-Type**: `multipart/form-data` or `application/json`

##### Form Parameters:
| Field | Type | Description |
|---|---|---|
| `name` | string | Full name of the administrator |
| `email` | string | Valid institutional email address |
| `password` | string | Account password |
| `profileImage` | file | *(Optional)* Profile picture |

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "User Created Successfully",
  "data": {
    "_id": "6740b2f5a8c43d9124a87211",
    "name": "Prof. R. K. Sharma",
    "email": "rk.sharma@ciitm.edu",
    "role": "admin"
  }
}
```

#### 3.2 User & Admin Login
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "email": "rk.sharma@ciitm.edu",
  "password": "AdminSecurePassword@123"
}
```

##### Success Response (`200 OK`):
Sets an `HttpOnly` cookie named `token` and returns:
```json
{
  "status": true,
  "statusCode": 200,
  "message": "User Login Successfully",
  "data": {
    "user": {
      "_id": "6740b2f5a8c43d9124a87211",
      "name": "Prof. R. K. Sharma",
      "email": "rk.sharma@ciitm.edu",
      "role": "admin",
      "isActice": true
    }
  }
}
```

---

### 4. Password Recovery & OTP Validation

#### 4.1 Request Password Reset OTP
- **Method**: `POST`
- **Path**: `/api/v1/forgot-password`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "email": "student@ciitm.edu"
}
```

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "OTP has been sent to your email",
  "data": {
    "email": "student@ciitm.edu"
  }
}
```

#### 4.2 Validate OTP & Set New Password
- **Method**: `POST`
- **Path**: `/api/v1/validate/password`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "email": "student@ciitm.edu",
  "otp": 584920,
  "newPassword": "NewSecurePassword@2026"
}
```

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": {
    "email": "student@ciitm.edu"
  }
}
```

---

### 5. Role Management

#### 5.1 Assign Admin Role
- **Method**: `POST`
- **Path**: `/api/v1/role/create`
- **Headers**: `Authorization: Bearer <token>` or valid auth cookie
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "email": "new.coordinator@ciitm.edu"
}
```

##### Success Response (`201 Created`):
```json
{
  "status": true,
  "statusCode": 201,
  "message": "Role created successfully",
  "data": {
    "email": "new.coordinator@ciitm.edu",
    "role": "admin"
  }
}
```

---

### 6. Student Admissions

#### 6.1 Submit Online Admission Application
- **Method**: `POST`
- **Path**: `/api/v1/online/admission`
- **Content-Type**: `multipart/form-data`

##### Form Fields:
| Field | Type | Description |
|---|---|---|
| `firstName` | string | Student first name |
| `lastName` | string | Student last name |
| `email` | string | Primary email address |
| `phoneNumber` | string | Contact phone number |
| `course` | string | Target Course Name / ID |
| `semester` | number | Semester entering (e.g. 1) |
| `gender` | string | `Male`, `Female`, `Other` |
| `dateOfBirth` | string | Date of Birth (`YYYY-MM-DD`) |
| `fatherName` | string | Father's full name |
| `motherName` | string | Mother's full name |
| `address` | string | Residential address |
| `avtar` | file | Passport photograph |

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Application submitted successfully",
  "data": {
    "uniqueId": "CIITM-2026-9842",
    "studentName": "Aarav Sharma",
    "course": "Diploma in Computer Science & Engineering",
    "status": "Pending"
  }
}
```

#### 6.2 Send Admission Test Email
- **Method**: `POST`
- **Path**: `/api/v1/online/admission/testing-email`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "recipientEmail": "applicant@example.com"
}
```

---

### 7. Student Status & Application Review

#### 7.1 Track Application Status by Unique ID
- **Method**: `GET`
- **Path**: `/api/v1/status/find/:uniqueId`
- **Example**: `/api/v1/status/find/CIITM-2026-9842`

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Status found",
  "data": {
    "uniqueId": "CIITM-2026-9842",
    "applicationStatus": "Approved",
    "message": "Document verification completed successfully. Welcome to CIITM!"
  }
}
```

#### 7.2 Update Application Status (Admin)
- **Method**: `PUT`
- **Path**: `/api/v1/status/update/:uniqueId`
- **Headers**: Admin authentication required
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "applicationStatus": "Approved",
  "message": "Your enrollment has been approved."
}
```

*(Approving an application automatically provisions student credentials and dispatches an onboarding email).*

#### 7.3 Send Review Test Email
- **Method**: `POST`
- **Path**: `/api/v1/send-status-test-email`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "recipientEmail": "student@example.com",
  "studentName": "Aarav Sharma",
  "studentPassword": "GeneratedPassword123"
}
```

---

### 8. Student Directory & Record Lookups

#### 8.1 Search Students by Course and Semester
- **Method**: `GET`
- **Path**: `/api/v1/Student/FindByCourseAndSemester?course=CSE&semester=1`

##### Query Parameters:
| Parameter | Type | Required | Description |
|---|---|:---:|---|
| `course` | string | Yes | Course code or name |
| `semester` | number | Yes | Semester digit (1-8) |
| `PerPage` | number | No | Results per page (default: 10) |
| `Limit` | number | No | Total limit |

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Students found successfully",
  "data": [
    {
      "_id": "6740b2f5a8c43d9124a87211",
      "uniqueId": "CIITM-2026-9842",
      "student": {
        "firstName": "Aarav",
        "lastName": "Sharma",
        "email": ["aarav.sharma@ciitm.edu"],
        "course": "CSE",
        "semester": 1
      }
    }
  ]
}
```

#### 8.2 Find Student by Unique ID
- **Method**: `GET`
- **Path**: `/api/v1/Student/FindByUniqueId?uniqueId=CIITM-2026-9842`

#### 8.3 Validate Unique ID
- **Method**: `GET`
- **Path**: `/api/v1/Student/validate/:uniqueId`

---

### 9. Course Catalog & Curriculum

#### 9.1 List All Courses
- **Method**: `GET`
- **Path**: `/api/v1/user/findAllCourse`

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Courses Found",
  "data": [
    {
      "_id": "66d8e1f409bc3a12543e88a1",
      "courseName": "Diploma in Computer Science & Engineering",
      "courseCode": "CSE-101",
      "duration": "3 Years",
      "fee": 45000,
      "eligibility": "10th Standard with Mathematics & Science",
      "description": "Comprehensive engineering curriculum.",
      "courseThumbnail": "/api/images/Knowledge.webp"
    }
  ]
}
```

#### 9.2 Find Course by ID
- **Method**: `GET`
- **Path**: `/api/v1/user/findCourseById/:id`

#### 9.3 Create New Course (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/admin/course/create`
- **Headers**: Admin authentication required
- **Content-Type**: `multipart/form-data`

##### Form Fields:
| Field | Type | Description |
|---|---|---|
| `courseName` | string | Full name of the course |
| `courseCode` | string | Unique course code (e.g., `CSE-101`) |
| `duration` | string | Program duration (e.g., `3 Years`) |
| `fee` | number | Total tuition fee |
| `eligibility` | string | Admission requirements |
| `description` | string | Syllabus summary |
| `courseThumbnail` | file | Course preview image |

---

### 10. Faculty & Teacher Directory

#### 10.1 List All Teachers
- **Method**: `GET`
- **Path**: `/api/v1/user/findAllTeachers`

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Teachers found",
  "data": [
    {
      "_id": "6740b2f5a8c43d9124a87333",
      "name": "Dr. Ananya Roy",
      "department": "Computer Science & Engineering",
      "designation": "Head of Department",
      "qualification": "Ph.D. in AI & Robotics",
      "email": "ananya.roy@ciitm.edu",
      "Avtar": "/api/images/Teacher_Avtar.webp"
    }
  ]
}
```

#### 10.2 Add Teacher (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/admin/teacher/create`
- **Content-Type**: `multipart/form-data` (`Avtar` file)

#### 10.3 Update Teacher (Admin)
- **Method**: `PUT`
- **Path**: `/api/v1/admin/teacher/:id/update`

#### 10.4 Delete Teacher (Admin)
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/teacher/:id/delete`

---

### 11. Tuition Fee Billing & Online Payments

#### 11.1 Get Fee Info by Student Unique ID
- **Method**: `GET`
- **Path**: `/api/v1/Student/FeeInfo?uniqueId=CIITM-2026-9842`

#### 11.2 Get Fee Records by Course & Semester
- **Method**: `GET`
- **Path**: `/api/v1/Student/FeeInfoByStudent?course=CSE&semester=1`

#### 11.3 Get Fee Types
- **Method**: `GET`
- **Path**: `/api/v1/Student/feeType`

#### 11.4 Get Institutional Earnings Analytics (Admin)
- **Method**: `GET`
- **Path**: `/api/v1/Student/getEarning`

#### 11.5 Get Student Bill / Receipt by ID
- **Method**: `GET`
- **Path**: `/api/v1/Student/getStudentBillById?paymentId=PAY-12345`

#### 11.6 Initiate Online Tuition Order
- **Method**: `POST`
- **Path**: `/api/v1/Student/createOrder`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "order_amount": 15000,
  "customer_id": "CIITM-2026-9842",
  "customer_name": "Aarav Sharma",
  "customer_phone": "9876543210",
  "customer_email": "aarav.sharma@ciitm.edu",
  "uniqueId": "CIITM-2026-9842",
  "PaymentType": "Semester Fee",
  "discount": 0
}
```

#### 11.7 Verify Online Payment Webhook / Callback
- **Method**: `GET`
- **Path**: `/api/v1/Student/verifyPayment?order_id=order_...`

#### 11.8 Update Fee Record (Admin)
- **Method**: `PATCH`
- **Path**: `/api/v1/Student/FeeUpdate`

---

### 12. Campus Notices & Circulars

#### 12.1 Get Active Campus Notices
- **Method**: `GET`
- **Path**: `/api/v1/notice/find`

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Notices found",
  "data": [
    {
      "_id": "6740b2f5a8c43d9124a87555",
      "title": "Odd Semester Examinations Schedule 2026",
      "noticeContent": "All students are instructed to download their examination admit cards.",
      "fileUrl": "/api/images/ExamSchedule2026.pdf",
      "date": "2026-10-01T00:00:00.000Z"
    }
  ]
}
```

#### 12.2 Create Campus Notice (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/notice/create`
- **Headers**: Admin authentication required
- **Content-Type**: `multipart/form-data` (`doc` file)

---

### 13. Photo Albums & Media Gallery

#### 13.1 Get All Albums
- **Method**: `GET`
- **Path**: `/api/v1/user/get/album`

#### 13.2 List All Album Names (Admin)
- **Method**: `GET`
- **Path**: `/api/v1/admin/get/all/albumName`

#### 13.3 Create New Album (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/admin/create/album`
- **Content-Type**: `multipart/form-data` (`albumImage` file)

#### 13.4 Delete Album (Admin)
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/delete/album/:albumId`

#### 13.5 Get All Gallery Images
- **Method**: `GET`
- **Path**: `/api/v1/user/get/All/Image`

#### 13.6 Get Images by Album Name
- **Method**: `GET`
- **Path**: `/api/v1/user/get/Album/Image/:Album__Name`

#### 13.7 Upload Image to Album (Admin)
- **Method**: `POST`
- **Path**: `/api/v1/admin/create/image`
- **Content-Type**: `multipart/form-data` (`image` file, `Album_Name` string)

---

### 14. Social Media & Campus Contact Links

#### 14.1 Get Social Media & Contact Links
- **Method**: `GET`
- **Path**: `/api/v1/social/link` (also aliased at `/api/link`)

##### Success Response (`200 OK`):
```json
{
  "message": "Got the Social Media Link",
  "success": true,
  "link": {
    "linkedin": "https://linkedin.com/school/ciitm",
    "facebook": "https://facebook.com/ciitm",
    "instagram": "https://instagram.com/ciitm",
    "email": "info@ciitm.edu",
    "number": 9876543210
  }
}
```

#### 14.2 Update Social Media Links
- **Method**: `PUT`
- **Path**: `/api/v1/social/link`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "linkedin": "https://linkedin.com/school/ciitm",
  "facebook": "https://facebook.com/ciitm",
  "instagram": "https://instagram.com/ciitm",
  "email": "admissions@ciitm.edu",
  "number": 9876543210
}
```

---

### 15. Contact Inquiries & Feedback

#### 15.1 Submit Inquiry Form
- **Method**: `POST`
- **Path**: `/api/v1/contact/create`
- **Content-Type**: `application/json`

##### Request Body:
```json
{
  "name": "Pooja Singh",
  "email": "pooja.singh@example.com",
  "phone": "9812345678",
  "subject": "Diploma Admission 2026 Inquiry",
  "message": "Could you provide details on the hostel accommodation and scholarship options?"
}
```

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Inquiry submitted successfully"
}
```

#### 15.2 Get Inquiries (Admin)
- **Method**: `GET`
- **Path**: `/api/v1/contact/admin/getContact`

#### 15.3 Delete Inquiry (Admin)
- **Method**: `DELETE`
- **Path**: `/api/v1/contact/admin/deleteContact/:id`

---

### 16. Student Testimonials

#### 16.1 List All Testimonials
- **Method**: `GET`
- **Path**: `/api/v1/findAllTestimonials`

##### Success Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "testimonials found",
  "found": true,
  "Find_Testimonial": [
    {
      "_id": "6740b2f5a8c43d9124a87999",
      "name": "Rohit Verma",
      "job_Role": "Alumnus (Batch 2024), Cloud Associate at Wipro",
      "message": "The technical training and laboratory mentorship at CIITM shaped my engineering career path.",
      "star": 5,
      "image": "/api/images/Student_Avtar.webp"
    }
  ]
}
```

#### 16.2 Submit Testimonial
- **Method**: `POST`
- **Path**: `/api/v1/createTestimonial`
- **Content-Type**: `multipart/form-data` (`image` file, `name`, `job_Role`, `message`, `star`)

#### 16.3 Delete Testimonial
- **Method**: `DELETE`
- **Path**: `/api/v1/deleteTestimonial/:id`

---

### 17. Frontend Dynamic Settings

#### 17.1 Get Dynamic Landing & Page Settings
- **Method**: `GET`
- **Path**: `/api/v1/frontend`

##### Success Response (`200 OK`):
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Frontend data loaded",
  "data": {
    "logo": "CIITM Dhanbad",
    "landingPage": {
      "HeroSection": {
        "homeTitle": "Shape Tomorrow with Quality Education",
        "homeParagraph": "Empowering students to achieve academic success with professional resources"
      }
    }
  }
}
```

---

## 🚦 Standard HTTP Status Codes & Error Envelopes

The CIITM API formats responses using consistent JSON envelopes:

### Standard Success Envelope
```json
{
  "status": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Standard Error Envelope
```json
{
  "status": false,
  "statusCode": 400,
  "message": "Detailed description of the validation or domain error"
}
```

| HTTP Status | Meaning | Typical Trigger |
|---|---|---|
| `200 OK` | Request succeeded | Entity retrieved or updated |
| `201 Created` | Resource created | Account registered, admission filed, or message queued |
| `400 Bad Request` | Validation failure | Missing required fields, invalid email format, or bad OTP |
| `401 Unauthorized` | Invalid / missing auth | Missing session cookie or Bearer token |
| `403 Forbidden` | Access forbidden | Non-administrator attempting administrative action |
| `404 Not Found` | Entity not found | Invalid ID, student not found, or unregistered route |
| `500 Internal Error` | Server execution error | Handled runtime exception |
| `503 Service Unavailable`| Dependency offline | Returned with fallback when persistent store is offline |

---

## 🛠️ Scripts & Local Development

### 1. Installation
```bash
npm install
```

### 2. Run Server
```bash
# Production / Development launch
npm start
# or
npm run dev
```

### 3. Generate Encryption Keys
Generate cryptographic secrets for your `.env`:
```bash
npm run genKey
```

### 4. Code Quality & Linting
Run the ESLint suite:
```bash
npm run lint
```

### 5. Running Automated Tests
Run unit and integration tests with Jest:
```bash
npm test
```
