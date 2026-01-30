# Notes Manager | IIIT Dharwad

A production-grade, secure, and scalable EdTech platform for managing academic notes organized by Branch → Semester → Subject.

## 🚀 Key Features
- **Hierarchical Navigation**: Browse notes through a clear academic structure.
- **Role-Based Access Control (RBAC)**: 
  - `student`: View organizational notes, manage personal notes.
  - `cr` & `professor`: Full management rights. Can upload, edit, and delete any organizational note to ensure content continuity (e.g., if a student contributor leaves the organization).
- **Personal Notes Section**: Private storage for your handwritten or individual study materials.
- **Secure Authentication**: NextAuth.js with JWT and Bcrypt encryption.
- **Responsive UI**: Modern, clean design using Tailwind CSS with an orange/white theme.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js (JWT)
- **Data Fetching & State:**: TanStack Query
- **Styling**: Tailwind CSS
- **Testing**: Jest (Unit/Integration), Playwright (E2E)
- **Deployment**: Vercel

## 🏗️ Architecture
The application follows a Clean Architecture pattern with:
- **Server Components**: Used for data fetching (Dashboard, Branch, Semester, Subject pages) to ensure multi-stage SSR.
- **Client Components**: Used for interactive elements (Forms, Buttons, Auth).
- **API Routes**: Handle CRUD operations and secondary logic.
- **Middleware/Callbacks**: Handle authentication and role verification.

## 🔒 Security
- **JWT Sessions**: Stateless authentication with local session storage.
- **Password Hashing**: Bcrypt with 10 salt rounds.
- **API Protection**: Each endpoint verifies the user session and role before execution.
- **Database Isolation**: Personal notes are query-filtered by `createdBy` and `isPersonal` flags to prevent unauthorized access.

## 🧪 Testing
- **Unit Tests**: Logic for authorization and permissions (`/tests/unit`).
- **Integration Tests**: API endpoint validation.
- **E2E Tests**: Critical paths like Login and Note Discovery using Playwright.

Run tests with:
```bash
npm test
```

## 📦 Deployment & CI/CD
- **Vercel**: Integrated for automatic deployments.
- **GitHub Actions**: Configured to run linting and tests on every push.
- **Environment Variables**:
  - `MONGODB_URI`: Connection string for Atlas.
  - `NEXTAUTH_SECRET`: Encryption key for JWT.
  - `NEXTAUTH_URL`: Base URL of the app.

## 📈 Scalability & Future Enhancements
- **MongoDB Indexing**: Indexes on `subjectId` and `createdBy` for fast lookups.
- **CDN Integration**: Recommending UploadThing or AWS S3 for binary storage.
- **Search & Filter**: Future integration of Algolia or MongoDB Atlas Search.
- **Multiple Organizations**: Multi-tenant support planned for larger rollouts.

---
Built with ❤️ for IIIT Dharwad students from Amruth Mandappa T S.
