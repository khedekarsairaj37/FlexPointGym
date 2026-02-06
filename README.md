# 🏋️ Flex Point Gym Management System

A comprehensive gym management system with role-based access control, billing in Indian Rupees (₹), and Firebase integration.

![Premium Dark Mode Design](https://img.shields.io/badge/Design-Dark%20Mode-yellow?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge)

## ✨ Features

### 🔐 Role-Based Access Control
- **Admin**: Full system access with management capabilities
- **Member**: Personal dashboard with payment history and notifications
- **Guest/User**: Read-only access to member directory

### 💰 Billing System (INR)
- Complete billing management in Indian Rupees (₹)
- Package-based pricing
- Payment status tracking (Paid, Pending, Overdue)
- Automated billing on member registration

### 📊 Admin Dashboard
- ✅ Member CRUD operations
- ✅ Billing & payment management
- ✅ Package management (Basic, Pro, Elite)
- ✅ Analytics & reports
- ✅ Supplement store management
- ✅ Diet plan creation and management
- ✅ Demo data generation

### 👤 Member Dashboard
- View payment history
- Download receipts
- Access notifications
- View membership status and expiry
- Track package details

### 👥 Guest Dashboard
- Searchable member directory
- Filter by package type
- View public member information
- Limited access to sensitive data

## 📦 Package Types

| Package | Price | Duration | Features |
|---------|-------|----------|----------|
| **Free** | ₹0 | Unlimited | Basic equipment access, Locker facility |
| **Basic** | ₹1,500 | 1 Month | All equipment, Group classes |
| **Pro** | ₹2,500 | 3 Months | Personal trainer (2x/week), Diet consultation, Supplement discount |
| **Elite** | ₹4,000 | 6 Months | Unlimited training, Advanced diet plans, Priority booking, Free supplements |

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- npm or pnpm

### 1. Clone & Install
```bash
git clone <repository-url>
cd flex-point-gym
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "Flex Point Gym"
3. Disable Google Analytics (optional)

#### Enable Authentication
1. Navigate to **Build** → **Authentication**
2. Enable **Email/Password** sign-in method

#### Create Firestore Database
1. Navigate to **Build** → **Firestore Database**
2. Create database in **Test mode** (for development)
3. Select your preferred region

#### Get Configuration
1. Go to **Project Settings** (⚙️ icon)
2. Scroll to "Your apps" section
3. Click Web icon (`</>`)
4. Copy the `firebaseConfig` object

### 3. Configure Firebase
Update `/src/config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run the Application
```bash
npm run dev
```

### 5. Create Admin Account
1. Open the application in your browser
2. Click "Sign Up"
3. Select **Admin** as role
4. Enter secret key: `FLEXPOINT_ADMIN_2024`
5. Complete registration

### 6. Add Demo Data (Optional)
1. Login as admin
2. Click "Create Demo Data" button in the admin dashboard
3. Demo members, billings, supplements, and diet plans will be added

## 🗂️ Project Structure

```
flex-point-gym/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx      # Admin panel
│   │   │   ├── MemberDashboard.tsx     # Member portal
│   │   │   ├── GuestDashboard.tsx      # Guest view
│   │   │   ├── Login.tsx               # Auth page
│   │   │   └── QuickStartGuide.tsx     # Setup guide
│   │   └── App.tsx                     # Main app component
│   ├── config/
│   │   └── firebase.ts                 # Firebase config
│   ├── contexts/
│   │   └── AuthContext.tsx             # Auth state management
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── utils/
│       ├── constants.ts                # App constants
│       └── demoData.ts                 # Demo data generator
├── SETUP_INSTRUCTIONS.md               # Detailed setup guide
└── README.md                           # This file
```

## 🎨 Design System

### Color Palette
- **Background**: Slate 950/900 (Dark Mode)
- **Accent**: Yellow 500/600 (Gold)
- **Text**: White/Slate for hierarchy
- **Success**: Green 400/500
- **Warning**: Yellow 400/500
- **Error**: Red 400/500

### Typography
- System font stack with Tailwind defaults
- Clear hierarchy with size and weight variations
- Optimized for readability

## 🔒 Security Features

### Admin Secret Key
- Required for admin registration
- Default: `FLEXPOINT_ADMIN_2024`
- Change in `/src/utils/constants.ts`

### Firestore Security Rules
Implement these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - own data only
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Members - admin write, authenticated read
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Billings - admin write, authenticated read
    match /billings/{billingId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Similar rules for supplements, dietPlans, notifications
  }
}
```

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🗄️ Database Schema

### Collections

#### `users`
```typescript
{
  uid: string,
  email: string,
  name: string,
  role: 'admin' | 'member' | 'user',
  createdAt: timestamp
}
```

#### `members`
```typescript
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  package: 'Basic' | 'Pro' | 'Elite' | 'Free' | 'Pending',
  status: 'active' | 'new' | 'inactive',
  joinDate: timestamp,
  expiryDate: timestamp,
  createdAt: timestamp
}
```

#### `billings`
```typescript
{
  id: string,
  memberId: string,
  memberName: string,
  amount: number,
  currency: 'INR',
  status: 'paid' | 'pending' | 'overdue',
  date: timestamp,
  description: string,
  packageType: string
}
```

#### `supplements`
```typescript
{
  id: string,
  name: string,
  price: number,
  currency: 'INR',
  stock: number,
  description: string,
  category: string
}
```

#### `dietPlans`
```typescript
{
  id: string,
  memberId: string,
  memberName: string,
  plan: string,
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  notes: string,
  createdAt: timestamp
}
```

## 🛠️ Technologies Used

- **Frontend**: React 18.3.1, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📝 Environment Variables

For production, use environment variables instead of hardcoding credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_SECRET_KEY=your_admin_secret
```

## 🚨 Important Notes

⚠️ **Security Warning**: This is a demonstration system. For production use:
- Implement proper Firestore security rules
- Use environment variables for sensitive data
- Add input validation and sanitization
- Implement rate limiting
- Add HTTPS and secure authentication
- Do not store sensitive PII without proper encryption

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify credentials in `/src/config/firebase.ts`
- Check Firebase Console for service status
- Ensure Authentication and Firestore are enabled

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Authentication Errors
- Clear browser cache and cookies
- Check Firebase Authentication is enabled
- Verify admin secret key matches

## 📄 License

This project is created for demonstration purposes. Please ensure you have proper licenses for production use.

## 🤝 Contributing

This is a demonstration project. For production use, please fork and adapt according to your needs.

## 📧 Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

---

**Built with ❤️ for Flex Point Gym**

*Transform Your Body, Transform Your Life* 💪
