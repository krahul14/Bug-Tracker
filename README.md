# Bug Tracker Pro

A comprehensive bug and task tracking application built with Next.js, featuring role-based authentication, time tracking, and advanced task management capabilities.

![Bug Tracker Pro](https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Features

### Authentication & Roles
- **Role-based Authentication**: Developer and Manager roles with different permissions
- **Mock Authentication System**: Simple login with demo credentials
- **Secure Session Management**: Persistent login state with localStorage

### Dashboard & Analytics
- **Interactive Dashboard**: Overview of tasks, statistics, and recent activity
- **Trend Analytics**: 7-day trend charts showing task progress and time spent
- **Real-time Statistics**: Live updates of task counts and completion rates
- **Role-specific Views**: Different dashboard layouts for developers and managers

### Task Management
- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Comprehensive Task Fields**:
  - Title and Description
  - Priority levels (Low, Medium, High, Critical)
  - Status tracking (Open, In Progress, Pending Approval, Closed, Reopened)
  - Assignee management
  - Due dates
  - Tags and categorization
- **Advanced Filtering & Sorting**: Filter by status, priority, assignee, and search terms
- **Approval Workflow**: Manager approval required for task closure

### Time Tracking
- **Time Entry Logging**: Log hours spent on individual tasks
- **Detailed Time Reports**: View time entries by user and task
- **Analytics Dashboard**: Time tracking overview with summaries
- **Historical Data**: Track time entries over time with date-based filtering

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Real-time Notifications**: Toast notifications for user actions
- **Keyboard Shortcuts**: Efficient navigation and task management

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 13.5.1 with App Router
- **UI Library**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Charts & Analytics**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Storage**: localStorage (mock backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krahul14/Bug-Tracker.git
   cd Bug-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

The application includes demo users for testing:

### Developer Account
- **Email**: `john@example.com`
- **Password**: `password123`
- **Role**: Developer

### Manager Account
- **Email**: `sarah@example.com`
- **Password**: `password123`
- **Role**: Manager

### Additional Developer
- **Email**: `mike@example.com`
- **Password**: `password123`
- **Role**: Developer

## 📱 Usage Guide

### For Developers

1. **Login** with developer credentials
2. **View Dashboard** to see your assigned tasks and statistics
3. **Manage Tasks**:
   - View tasks in the "My Tasks" section
   - Create new tasks using the "Create Task" button
   - Edit existing tasks by clicking the menu (⋯) on task cards
   - Change task status (Open → In Progress → Pending Approval)
4. **Log Time**:
   - Click "Log Time" from the task menu
   - Enter hours spent and description
   - View time tracking summary in the Time Tracking section

### For Managers

1. **Login** with manager credentials
2. **View Dashboard** to see team overview and analytics
3. **Manage All Tasks**:
   - View all team tasks in the "All Tasks" section
   - Create and assign tasks to team members
   - Approve or reopen tasks in "Pending Approval" status
4. **Monitor Team Performance**:
   - View time tracking for all developers
   - Analyze team productivity through dashboard charts
   - Review task completion trends

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Actions, links, primary buttons
- **Success**: Green (#10B981) - Completed tasks, success states
- **Warning**: Amber (#F59E0B) - Pending items, warnings
- **Error**: Red (#EF4444) - Critical items, errors
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body Text**: Regular weight (400)
- **Small Text**: Medium weight (500)

### Components
- **Cards**: Subtle shadows with rounded corners
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Badges**: Color-coded for status and priority
- **Forms**: Clean inputs with proper validation states

## 📊 Task Workflow

```
Open → In Progress → Pending Approval → Closed
  ↑                                        ↓
  ←←←←←←←←← Reopened ←←←←←←←←←←←←←←←←←←←←←←←
```

1. **Open**: Newly created tasks
2. **In Progress**: Developer actively working on the task
3. **Pending Approval**: Developer completed work, awaiting manager review
4. **Closed**: Manager approved and closed the task
5. **Reopened**: Manager reopened a previously closed task

## 🔧 Configuration

### Environment Variables
No environment variables required for the demo version. The application uses localStorage for data persistence.

### Customization
- **Colors**: Modify `tailwind.config.ts` for theme customization
- **Default Data**: Update `lib/storage.ts` for different demo data
- **User Roles**: Extend user types in `lib/types.ts`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

The application is fully responsive with:
- Mobile-first design approach
- Collapsible navigation on smaller screens
- Optimized layouts for different screen sizes
- Touch-friendly interactions

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
npm run build
```
The application is configured for static export and can be deployed to any static hosting service.

---