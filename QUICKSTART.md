# 🚀 Quick Start Guide - Flex Point Gym

Get up and running in 5 minutes!

## ⚡ Fast Track Setup

### Step 1: Configure Firebase (2 minutes)
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create project → Enable Auth (Email/Password) → Create Firestore
3. Copy config from Project Settings → Web App
4. Paste in `/src/config/firebase.ts`

### Step 2: Create Admin Account (1 minute)
1. Open the app in your browser
2. Click "Sign Up" → Select "Admin"
3. Use secret key: `FLEXPOINT_ADMIN_2024`
4. Complete registration

### Step 3: Add Demo Data (1 minute)
1. Login to admin dashboard
2. Click "Create Demo Data" button in the tab menu
3. Wait for confirmation
4. Explore the system!

## 🎯 What You Get

### Demo Data Includes:
- ✅ 5 Sample members (Elite, Pro, Basic packages)
- ✅ 4 Billing records (mix of paid/pending)
- ✅ 5 Supplements with pricing
- ✅ 3 Diet plans for different goals

## 🔑 Test Accounts

After demo data creation, you can create additional test accounts:

**Member Account:**
- Role: Member
- Email: member@test.com
- Password: (your choice)

**Guest Account:**
- Role: Guest User
- Email: guest@test.com
- Password: (your choice)

## 📱 What to Try

### As Admin
1. **Members Tab**: Add, edit, delete members
2. **Billing Tab**: View all transactions
3. **Supplements Tab**: Manage gym store inventory
4. **Diet Plans Tab**: Create nutrition plans
5. **Reports Tab**: View analytics and revenue

### As Member
1. Check payment history
2. View membership status
3. See notifications (if any)

### As Guest
1. Browse member directory
2. Search and filter members
3. Limited data access

## 🎨 UI Features

- **Dark Mode**: Premium slate/gold theme
- **Responsive**: Works on all devices
- **Real-time**: Firebase integration
- **Secure**: Role-based access control

## 🆘 Need Help?

### Common Issues

**Can't login after signup:**
- Check Firebase Console → Authentication to verify user was created
- Try clearing browser cache

**No data showing:**
- Click "Create Demo Data" in admin dashboard
- Check browser console for errors

**Firebase errors:**
- Verify config in `/src/config/firebase.ts`
- Ensure Auth and Firestore are enabled in Firebase Console

## 📚 Learn More

- Full setup: `SETUP_INSTRUCTIONS.md`
- Complete docs: `README.md`
- Database schema: See README Database Schema section

## 🎯 Next Steps

1. Customize packages in `/src/utils/constants.ts`
2. Change admin secret key (production!)
3. Add Firestore security rules (see README)
4. Customize branding and colors
5. Add your own features!

---

**Happy Managing! 💪**

*Transform Your Body, Transform Your Life*
