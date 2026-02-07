# Inward/Outward Management System
## Software Documentation

**Version:** 1.0.0
**Organization:** Sri Sathya Sai Institute of Higher Learning (SSSIHL)
**Last Updated:** February 7, 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation Guide](#installation-guide)
5. [User Guide](#user-guide)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## System Overview

### Purpose
The Inward/Outward Management System is a web-based application designed to streamline the management of inward and outward correspondence within SSSIHL. It provides a centralized platform for tracking, assigning, and processing institutional communications.

### Key Objectives
- Digitize and track all inward correspondence
- Enable efficient task assignment to teams
- Facilitate outward communication management
- Provide real-time dashboard analytics
- Ensure accountability and transparency in document processing

### Target Users
- **Administrators**: Manage inward entries, assign tasks, view comprehensive statistics
- **Team Members**: Process assigned tasks, create outward entries, track work progress

---

## Architecture

### Technology Stack

#### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.13.0
- **Styling**: Custom CSS with theme support (Dark/Light mode)
- **UI Components**: Lucide React icons
- **Particles**: @tsparticles for animated backgrounds
- **HTTP Client**: Axios 1.13.2
- **Authentication**: Google OAuth (@react-oauth/google)

#### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono 4.4.0
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: JWT token-based
- **Email Service**: Supabase (@supabase/supabase-js)

#### Deployment
- **Frontend Hosting**: Cloudflare Pages
- **Backend API**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Version Control**: Git/GitHub
- **CI/CD**: Automated deployment via GitHub integration

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │    Admin     │  │     Team     │      │
│  │     Page     │  │    Portal    │  │    Portal    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         React SPA (Cloudflare Pages)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Hono)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Inward  │  │ Outward  │  │Dashboard │  │   Auth   │   │
│  │   API    │  │   API    │  │   API    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         Cloudflare Workers                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer (D1/SQLite)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Inward  │  │ Outward  │  │   Teams  │  │  Users   │   │
│  │  Entries │  │  Entries │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│              Cloudflare D1 Database                         │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
Inward_outward System/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── AdminPortal/ # Admin portal components
│   │   │   ├── TeamPortal/  # Team portal components
│   │   │   ├── Dashboard/   # Dashboard components
│   │   │   ├── LandingPage/ # Landing page
│   │   │   └── Messages/    # Messaging components
│   │   ├── services/        # API service layer
│   │   │   └── api.js       # API endpoints
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Global styles
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   │   ├── sssihl-icon.jpg  # University logo
│   │   └── IO_SYS_LOGO.png  # System logo
│   ├── .env                 # Development environment
│   ├── .env.production      # Production environment
│   └── package.json         # Dependencies
│
├── worker/                  # Backend Cloudflare Worker
│   ├── src/
│   │   └── index.js         # API routes and handlers
│   ├── migrations/          # Database migrations
│   │   └── 0001_init.sql    # Initial schema
│   ├── wrangler.toml        # Worker configuration
│   └── package.json         # Dependencies
│
├── package.json             # Root workspace config
└── README.md                # Project readme
```

---

## Features

### Admin Portal

#### Dashboard
- **Overview Statistics**
  - Total inward entries
  - Pending work count
  - Completed tasks count
  - Total outward entries
- **Team Performance Metrics**
  - Individual team statistics
  - Assigned tasks per team
  - Pending and completed work
  - Completion rate percentage
- **Team Detail View**
  - Click on team to view detailed statistics
  - Assigned entries for selected team
  - Team-specific outward entries

#### Entry Management
- **Create Inward Entry**
  - Subject, department, reference number
  - Date received, type, remarks
  - Automatic timestamp tracking
- **Assign Tasks**
  - Assign entries to specific teams
  - Set assignment status (Pending/In Progress/Completed)
  - Add assignment remarks
- **Search & Filter**
  - Search by subject or reference
  - Filter by team, status, type
  - Sort by date or status
- **View All Entries**
  - Comprehensive list with details
  - Color-coded status indicators
  - Quick action buttons

### Team Portal

#### Assignments View
- **Active Assignments**
  - View all assigned tasks
  - Filter by status and team
  - Update assignment status
  - Add remarks/comments
- **Create Outward Entry**
  - Subject, recipient, type
  - Date sent, remarks
  - Link to related inward entry (optional)
- **Task Processing**
  - Update status (Pending → In Progress → Completed)
  - Add processing remarks
  - Track completion time

#### Statistics
- Total assigned tasks
- Pending work count
- Completed tasks count
- Total outward entries created

### Common Features

#### Authentication
- Google OAuth integration
- Email-based authentication
- Whitelisted email domains (@sssihl.edu.in)
- Session management with localStorage

#### Theme Support
- Dark mode (default)
- Light mode
- User preference persistence
- Smooth theme transitions

#### Responsive Design
- Mobile-friendly interface
- Tablet optimization
- Desktop full-feature experience
- Adaptive layouts

---

## Installation Guide

### Prerequisites

```bash
# Required software
Node.js >= 18.x
npm >= 10.x
Git
Cloudflare account (for deployment)
```

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/sathyajain12/IO_SYS.git
cd Inward_outward\ System
```

#### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Or install individually
cd client && npm install
cd ../worker && npm install
```

#### 3. Environment Configuration

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

**Client (.env.production)**
```env
VITE_API_URL=https://inward-outward-api.saisathyajain.workers.dev/api
```

#### 4. Database Setup

```bash
# Navigate to worker directory
cd worker

# Create local D1 database
wrangler d1 create inward-outward-db

# Run migrations locally
npm run db:migrate:local

# Run migrations on production
npm run db:migrate
```

#### 5. Run Development Servers

**Terminal 1 - Frontend**
```bash
cd client
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 - Backend**
```bash
cd worker
npm run dev
# Runs at http://localhost:8787
```

### Build for Production

```bash
# Build client
cd client
npm run build

# Build worker (if needed)
cd ../worker
npm run build

# Or build both from root
cd ..
npm run build
```

---

## User Guide

### Admin User Guide

#### Logging In
1. Navigate to the application URL
2. Click "Enter Admin Portal"
3. Sign in with Google using @sssihl.edu.in email
4. Access granted if whitelisted

#### Creating an Inward Entry
1. Click "Entries" in navigation
2. Click "+ New Entry" button
3. Fill in required fields:
   - Subject
   - Department
   - Reference Number
   - Date Received
   - Type (Letter/Application/Notice/etc.)
   - Remarks (optional)
4. Click "Create Entry"

#### Assigning Tasks to Teams
1. View entry list
2. Click "Assign" on desired entry
3. Select team from dropdown
4. Set initial status (usually "Pending")
5. Add assignment remarks if needed
6. Click "Assign" to confirm

#### Viewing Dashboard Statistics
1. Click "Dashboard" in navigation
2. View overview cards (Total Inward, Pending, Completed, Outward)
3. Scroll to Team Performance section
4. Click on any team card to view detailed statistics
5. View team-specific entries and outward communications

#### Searching and Filtering
1. Use search bar to find entries by subject/reference
2. Use filters to narrow results:
   - Filter by Team
   - Filter by Status
   - Filter by Type
3. Click "Clear Filters" to reset

### Team User Guide

#### Logging In
1. Navigate to application URL
2. Click "Enter Team Portal"
3. Sign in with Google using @sssihl.edu.in email

#### Viewing Assignments
1. Dashboard shows all assigned tasks
2. Use team filter to see specific team assignments
3. Use status filter to see Pending/In Progress/Completed tasks

#### Processing Assignments
1. Locate assigned entry
2. Click "Update Status" button
3. Change status as work progresses:
   - Pending → In Progress (when starting work)
   - In Progress → Completed (when finished)
4. Add remarks about actions taken
5. Save changes

#### Creating Outward Entry
1. Click "+ New Outward" button
2. Fill in details:
   - Subject
   - Recipient
   - Type (Letter/Report/Notice/etc.)
   - Date Sent
   - Remarks
   - Related Inward Entry (optional)
3. Click "Create"

#### Viewing Statistics
1. Statistics cards show:
   - Total Assigned
   - Pending Work
   - Completed Tasks
   - Total Outward
2. Auto-updates as you process entries

---

## API Documentation

### Base URL
- **Production**: `https://inward-outward-api.saisathyajain.workers.dev/api`
- **Local**: `http://localhost:8787/api`

### Authentication
All API requests require authentication. Include credentials in requests as needed.

### Endpoints

#### Inward Entries

**GET /api/inward**
- Retrieves all inward entries
- Response: `{ success: true, entries: [...] }`

**POST /api/inward**
- Creates new inward entry
- Body:
```json
{
  "subject": "string",
  "department": "string",
  "referenceNo": "string",
  "dateReceived": "YYYY-MM-DD",
  "type": "string",
  "remarks": "string"
}
```
- Response: `{ success: true, entry: {...} }`

**PUT /api/inward/:id/assign**
- Assigns entry to team
- Body:
```json
{
  "assignedTeam": "string",
  "assignmentStatus": "string",
  "assignedRemarks": "string"
}
```

**PUT /api/inward/:id/status**
- Updates assignment status
- Body: `{ "assignmentStatus": "string" }`

#### Outward Entries

**GET /api/outward?team=**
- Retrieves outward entries (optionally filtered by team)
- Response: `{ success: true, entries: [...] }`

**POST /api/outward**
- Creates new outward entry
- Body:
```json
{
  "subject": "string",
  "recipient": "string",
  "dateSent": "YYYY-MM-DD",
  "type": "string",
  "remarks": "string",
  "relatedInwardId": "number (optional)"
}
```

**PUT /api/outward/:id**
- Updates outward entry

**PUT /api/outward/:id/close**
- Marks outward entry as closed

#### Dashboard Statistics

**GET /api/dashboard/stats**
- Retrieves overall system statistics
- Response:
```json
{
  "success": true,
  "stats": {
    "totalInward": number,
    "pendingWork": number,
    "completedWork": number,
    "totalOutward": number
  }
}
```

**GET /api/dashboard/teams**
- Retrieves all teams with statistics
- Response:
```json
{
  "success": true,
  "teamStats": [
    {
      "teamName": "string",
      "assigned": number,
      "pending": number,
      "completed": number,
      "completionRate": number
    }
  ]
}
```

**GET /api/dashboard/team-stats/:teamName**
- Retrieves statistics for specific team

---

## Database Schema

### Tables

#### inward_entries
Stores all incoming correspondence

```sql
CREATE TABLE inward_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    department TEXT,
    referenceNo TEXT,
    dateReceived DATE,
    type TEXT,
    remarks TEXT,
    assignedTeam TEXT,
    assignmentStatus TEXT DEFAULT 'Pending',
    assignedRemarks TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique identifier
- `subject`: Subject/title of the entry
- `department`: Originating department
- `referenceNo`: Reference number
- `dateReceived`: Date entry was received
- `type`: Category (Letter, Application, Notice, etc.)
- `remarks`: Additional notes
- `assignedTeam`: Team assigned to process
- `assignmentStatus`: Status (Pending/In Progress/Completed)
- `assignedRemarks`: Assignment notes
- `createdAt`: Entry creation timestamp
- `updatedAt`: Last update timestamp

#### outward_entries
Stores all outgoing correspondence

```sql
CREATE TABLE outward_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    recipient TEXT,
    dateSent DATE,
    type TEXT,
    team TEXT,
    remarks TEXT,
    relatedInwardId INTEGER,
    status TEXT DEFAULT 'Open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (relatedInwardId) REFERENCES inward_entries(id)
);
```

**Fields:**
- `id`: Unique identifier
- `subject`: Subject/title
- `recipient`: Recipient name/organization
- `dateSent`: Date sent
- `type`: Category
- `team`: Originating team
- `remarks`: Additional notes
- `relatedInwardId`: Link to related inward entry
- `status`: Open/Closed status
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### Indexes
```sql
CREATE INDEX idx_inward_team ON inward_entries(assignedTeam);
CREATE INDEX idx_inward_status ON inward_entries(assignmentStatus);
CREATE INDEX idx_outward_team ON outward_entries(team);
```

---

## Deployment

### Cloudflare Pages (Frontend)

#### Prerequisites
- Cloudflare account
- GitHub repository connected

#### Configuration
1. **Build Settings**
   - Build command: `npm run build --workspace=client`
   - Build output directory: `client/dist`
   - Root directory: `/`

2. **Environment Variables**
   - Set `VITE_API_URL` to your Worker API URL

#### Deployment Steps
1. Push code to GitHub
2. Cloudflare Pages auto-builds and deploys
3. Access at: `https://io-sys.pages.dev` (or custom domain)

### Cloudflare Workers (Backend)

#### Prerequisites
- Wrangler CLI installed: `npm install -g wrangler`
- Cloudflare account authenticated: `wrangler login`

#### Configuration
**wrangler.toml**
```toml
name = "inward-outward-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "inward-outward-db"
database_id = "65cdca58-f391-42fd-b314-2bdf52aa6a19"

[vars]
ENVIRONMENT = "production"
```

#### Deployment Steps
```bash
cd worker

# Deploy worker
npm run deploy
# or
wrangler deploy

# Run database migrations
npm run db:migrate
```

### Custom Domain Setup

#### Cloudflare Pages
1. Go to Pages project settings
2. Navigate to "Custom domains"
3. Add domain: `io-sys.yourdomain.com`
4. Update DNS records as instructed

#### Cloudflare Workers
1. Go to Worker settings
2. Navigate to "Triggers"
3. Add custom domain route
4. Update DNS records

---

## Troubleshooting

### Common Issues

#### 1. API Connection Failed
**Symptom**: Frontend can't connect to backend

**Solutions**:
- Check `.env.production` has correct API URL
- Verify Worker is deployed and accessible
- Check CORS settings in Worker
- Verify Cloudflare D1 database is accessible

#### 2. Authentication Fails
**Symptom**: Can't log in with Google

**Solutions**:
- Verify email is whitelisted in code
- Check Google OAuth credentials
- Clear browser cookies/localStorage
- Verify `@sssihl.edu.in` domain is allowed

#### 3. Database Errors
**Symptom**: SQL errors or data not loading

**Solutions**:
```bash
# Verify database exists
wrangler d1 list

# Re-run migrations
cd worker
npm run db:migrate

# Check database locally
npm run db:migrate:local
```

#### 4. Build Failures
**Symptom**: Build errors during deployment

**Solutions**:
- Verify Node.js version >= 18
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors in code
- Verify all dependencies are installed

#### 5. Blank Page After Deployment
**Symptom**: White screen or nothing loads

**Solutions**:
- Hard refresh: Ctrl+Shift+R
- Check browser console for errors
- Verify build completed successfully
- Check API URL is correct in production

---

## Future Enhancements

### Planned Features

#### Phase 1: Core Improvements
- **Priority Levels**: Urgent/High/Medium/Low
- **Due Dates**: Deadline tracking with overdue alerts
- **Comments**: Discussion threads on entries
- **Tags**: Custom categorization
- **Email Notifications**: Automated assignment alerts

#### Phase 2: Advanced Features
- **File Attachments**: Upload and attach documents
- **Advanced Search**: Full-text search with filters
- **Audit Logs**: Complete action history
- **Reports**: PDF/Excel export with custom date ranges
- **Bulk Actions**: Update multiple entries at once

#### Phase 3: Automation
- **Auto-Assignment**: Rule-based task assignment
- **Workflow Templates**: Predefined processes
- **Reminders**: Automated deadline reminders
- **SLA Tracking**: Service level monitoring

#### Phase 4: Integration
- **Email Integration**: Create entries from emails
- **Calendar Sync**: Google Calendar integration
- **Mobile App**: Native mobile applications
- **API Access**: Public API for integrations

### Contribution Guidelines
To contribute to future enhancements:
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request with documentation
5. Code review and merge

---

## Support & Contact

**Technical Support**
- GitHub Issues: https://github.com/sathyajain12/IO_SYS/issues
- Email: sathyajain9@gmail.com

**Documentation Updates**
- Last reviewed: February 7, 2026
- Review frequency: Quarterly
- Maintained by: Development Team

---

## Appendix

### Technology References
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Hono Framework](https://hono.dev)

### Glossary
- **Inward Entry**: Incoming correspondence to the institution
- **Outward Entry**: Outgoing communication from the institution
- **Assignment**: Task allocated to a team for processing
- **Dashboard**: Overview screen with statistics
- **D1**: Cloudflare's serverless SQL database
- **Worker**: Cloudflare's serverless compute platform

### Version History
- **v1.0.0** (February 2026): Initial release
  - Admin Portal with dashboard
  - Team Portal for assignments
  - Inward/Outward entry management
  - Google OAuth authentication
  - Cloudflare deployment

---

**Document End**

*This documentation is maintained by the SSSIHL Development Team and is subject to updates as the system evolves.*
