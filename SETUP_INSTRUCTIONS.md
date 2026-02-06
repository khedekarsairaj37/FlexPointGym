# Flex Point Gym Management System - Setup Instructions

## 🏋️ Welcome to Flex Point Gym

A comprehensive gym management system with role-based access control, billing in INR (₹), and Firebase integration.

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Name your project: "Flex Point Gym" (or any name you prefer)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### Step 3: Create Firestore Database

1. In your Firebase project, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Choose a Cloud Firestore location (closest to your region)
5. Click "Enable"

### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname: "Flex Point Gym Web"
5. Copy the `firebaseConfig` object

### Step 5: Update Firebase Configuration

1. Open `/src/config/firebase.ts` in your code editor
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 6: (Optional) Configure Firestore Security Rules

For production, update Firestore rules in Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Members collection - admins can write, all authenticated users can read
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Billings collection - admins and specific members can read
    match /billings/{billingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Supplements, Diet Plans, Notifications - similar rules
    match /supplements/{supplementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /dietPlans/{planId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Running the Application

1. Make sure you've updated the Firebase configuration
2. Run the development server (if using Vite/npm):
   ```bash
   npm install
   npm run dev
   ```
3. Open your browser to the provided localhost URL

## 👥 User Roles & Access

### Admin
- **Secret Key**: `FLEXPOINT_ADMIN_2024` (change this in `/src/utils/constants.ts`)
- **Access**: Full CRUD operations, billing, reports, member management

### Member
- **Access**: View payment history, receipts, notifications, membership status

### Guest/User
- **Access**: Read-only member directory, limited information

## 📦 Package Types & Pricing (INR)

| Package | Price | Duration | Features |
|---------|-------|----------|----------|
| Free | ₹0 | N/A | Basic equipment access |
| Basic | ₹1,500 | 1 Month | All equipment, group classes |
| Pro | ₹2,500 | 3 Months | Personal trainer, diet consultation |
| Elite | ₹4,000 | 6 Months | Unlimited training, supplements |

## 🗂️ Firestore Collections Structure

### users
```json
{
  "uid": "string",
  "email": "string",
  "name": "string",
  "role": "admin | member | user",
  "createdAt": "timestamp"
}
```

### members
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "package": "Basic | Pro | Elite | Free | Pending",
  "status": "active | new | inactive",
  "joinDate": "timestamp",
  "expiryDate": "timestamp",
  "createdAt": "timestamp"
}
```

### billings
```json
{
  "id": "string",
  "memberId": "string",
  "memberName": "string",
  "amount": "number",
  "currency": "INR",
  "status": "paid | pending | overdue",
  "date": "timestamp",
  "description": "string",
  "packageType": "string"
}
```

### supplements
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "currency": "INR",
  "stock": "number",
  "description": "string",
  "category": "string"
}
```

### dietPlans
```json
{
  "id": "string",
  "memberId": "string",
  "memberName": "string",
  "plan": "string",
  "calories": "number",
  "protein": "number",
  "carbs": "number",
  "fats": "number",
  "notes": "string",
  "createdAt": "timestamp"
}
```

### notifications
```json
{
  "id": "string",
  "userId": "string",
  "message": "string",
  "type": "info | warning | success | error",
  "read": "boolean",
  "createdAt": "timestamp"
}
```

## 🎨 Design Features

- **Dark Mode**: Premium slate/black theme
- **Gold Accents**: Yellow gradient highlights for CTAs
- **Responsive**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Hover states and transitions

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- The admin secret key is currently stored in the code for demonstration
- In production, use environment variables
- Never commit sensitive Firebase credentials to version control
- Use Firebase Security Rules to protect your data
- This system is for demonstration - NOT suitable for storing sensitive PII without proper security measures

## 📱 Features by Role

### Admin Dashboard
- ✅ Member CRUD operations
- ✅ Billing management in INR
- ✅ Package management
- ✅ Analytics & Reports
- ✅ Supplement store management
- ✅ Diet plan management

### Member Dashboard
- ✅ Payment history
- ✅ Receipt downloads
- ✅ Notifications
- ✅ Membership status
- ✅ Package details

### Guest Dashboard
- ✅ Member directory (read-only)
- ✅ Search & filter members
- ✅ View public member information

## 🛠️ Troubleshooting

### Firebase not connecting
- Check that you've updated `/src/config/firebase.ts` with your actual credentials
- Verify Email/Password authentication is enabled in Firebase Console
- Check browser console for specific error messages

### Authentication errors
- Clear browser cache and cookies
- Verify Firestore database is created and running
- Check Firebase Console for authentication logs

### Data not loading
- Verify Firestore rules allow read/write access
- Check that collections exist in Firestore
- Look for console errors in browser developer tools

## 📞 Support

For issues or questions about Firebase setup, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Built with ❤️ for Flex Point Gym**
