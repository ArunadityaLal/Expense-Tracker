# TrackTally - Expense Manager

A comprehensive full-stack expense tracking application with email verification, visual analytics, and secure authentication to help you manage your personal finances efficiently.

## 🚀 Live Demo

**[https://expense-tracker-nu-vert-50.vercel.app](https://expense-tracker-nu-vert-50.vercel.app)**

## ✨ Key Features

### 💰 Personal Expense Management
- **Add, Edit & Delete Expenses** - Complete CRUD operations for expense records
- **Category-Based Tracking** - Organize expenses across 8 categories:
  - 🍽️ Food
  - 🚗 Transport
  - 💡 Utilities
  - 🎬 Entertainment
  - 🛍️ Shopping
  - 🏥 Healthcare
  - 📚 Education
  - 📝 Others

### 👥 Group Expense & Splitwise Feature
- **Create Unlimited Groups** - Organize expenses for trips, roommates, or any shared costs
- **Member Management** - Add and manage group members easily
- **Track Who Paid What** - Record which member paid for each expense
- **Smart Settlement Algorithm** - Minimizes transactions for optimal debt settlement
- **Intelligent Splitting** - Automatically calculates who owes whom and how much
- **Group Status Management** - Mark groups as Active, Completed, or Cancelled
- **Settlement Summary** - View clear breakdown of all payments needed
- **Member Statistics** - Track total spending per member
- **Group Overview** - See total expenses and member count at a glance

### 📊 Analytics & Insights
- **Multiple View Modes** - Switch between:
  - All Expenses View (sortable table)
  - Monthly View (grouped by date)
  - Analytics Dashboard (visual insights)
- **Visual Charts** - Interactive spending trend visualizations
- **Category Breakdown** - Detailed spending distribution by category
- **Monthly Comparisons** - Track spending patterns across 6 months
- **Real-Time Statistics** - Instant expense summaries and totals
- **Smart Filters** - Filter expenses by category

### 🔐 Security & Authentication
- **Email Verification with OTP** - 6-digit verification codes sent via email
- **Secure Authentication** - Powered by Supabase Auth
- **Password Reset** - Forgot password functionality
- **Session Management** - Secure user sessions
- **Row-Level Security** - Data protection at database level

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI** - Beautiful gradients and smooth animations
- **Toast Notifications** - Real-time feedback for user actions
- **Intuitive Navigation** - Easy-to-use interface

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Icons** - Additional icon set
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Nodemailer** - Email sending service
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database & Auth
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication system
  - Row-level security
  - Real-time subscriptions

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js              # Express server with OTP functionality
│   └── .env                   # Environment variables
├── src/
│   ├── api/                   # API integration layer
│   ├── assets/                # Images and static files
│   ├── components/
│   │   ├── expense/           # Expense-related components
│   │   │   ├── AddExpenseModal.jsx
│   │   │   ├── AllExpensesView.jsx
│   │   │   ├── MonthlyView.jsx
│   │   │   └── AnalyticsView.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   ├── modals/
│   │   ├── CreateAccountModal.jsx
│   │   ├── OTPVerificationModal.jsx
│   │   ├── ForgotPasswordModal.jsx
│   │   ├── AddExpenseModal.jsx    # Group expense modal
│   │   ├── AddNamesModal.jsx      # Group member modal
│   │   └── SettleUpModal.jsx      # Settlement display modal
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PersonalExpense.jsx
│   │   ├── Groups.jsx             # Group listing page
│   │   ├── GroupExpense.jsx       # Individual group page
│   │   ├── AboutUs.jsx
│   │   └── LearnMore.jsx
│   ├── splitwise/
│   │   └── Splitwise.jsx      # Settlement algorithm component
│   ├── utils/
│   │   └── emailService.js    # Email OTP service
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🚀 Getting Started

### Frontend API Integration
- **Personal Expenses** - CRUD operations for individual expenses
- **Group Management** - Create, read, and delete groups
- **Group Members** - Add and manage group members
- **Group Expenses** - Track expenses within groups
- **Splitwise Algorithm** - Calculate optimal debt settlements
- Supabase Authentication
- Real-time data synchronization

## 💡 How Splitwise Settlement Works

The application uses an intelligent greedy algorithm to minimize the number of transactions needed to settle debts:

1. **Calculate Balances** - For each member, calculate net balance (what they paid minus what they owe)
2. **Separate Debtors & Creditors** - Identify who owes money and who should receive money
3. **Optimize Transactions** - Match debtors with creditors to minimize total transactions
4. **Generate Settlement Plan** - Output clear instructions like "Member A pays €50 to Member B"

**Example:**
- Alice paid €60, Bob paid €30, Charlie paid €10 (Total: €100)
- Each person should pay €33.33
- Result: Charlie pays €23.33 to Alice, Bob pays €3.33 to Alice
- Only 2 transactions instead of 6!

## 🛡️ Security Features

- **Email Verification**: OTP-based email verification for new accounts
- **Secure Password Storage**: Passwords hashed by Supabase Auth
- **Row-Level Security**: Database policies ensure users only access their data
- **CORS Protection**: Backend configured with CORS policies
- **Session Management**: Secure JWT-based sessions
- **OTP Expiration**: Verification codes expire after 10 minutes

## 📱 Features in Detail

### Personal Expense Tracking
- Add expenses with name, amount, category, and date
- Edit existing expenses
- Delete unwanted records
- View all expenses in a sortable table
- Filter by category
- See total spending and expense count

### Group Expense Management (Splitwise Feature)
- Create multiple groups for different occasions (trips, roommates, events)
- Set number of members when creating a group
- Add custom names for each group member
- Record expenses with description, amount, payer, and date
- Track which member paid for each expense
- View total group spending and expense count
- See individual expense history with payer information
- Manage group status (Active, Completed, Cancelled)
- Delete individual expenses or entire groups
- Real-time expense tracking for all group members

### Smart Settlement System
- Automatic debt calculation based on all expenses
- Minimizes number of transactions needed
- Clear settlement instructions (e.g., "Alice pays €50 to Bob")
- Visual settlement summary with color-coded display
- Works with any number of group members
- Handles complex multi-person expense splits
- Shows "All settled up!" when no payments needed
- Can view settlements even after group is completed

### Monthly View
- Navigate between months
- View expenses grouped by date
- See monthly totals
- Category-wise breakdown for each month
- Quick access to edit/delete actions

### Analytics Dashboard
- Visual spending trends over 6 months
- Category-wise spending distribution
- Percentage breakdown with color-coded charts
- Insights into spending patterns
- Average expense calculations
- Top spending categories

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for better financial management

---
