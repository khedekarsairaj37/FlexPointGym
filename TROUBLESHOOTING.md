# 🔧 Troubleshooting Guide - Flex Point Gym

## 🔥 Firebase Issues

### Problem: "Firebase: Error (auth/configuration-not-found)"
**Solution:**
1. Verify `/src/config/firebase.ts` has correct credentials
2. Ensure you replaced ALL placeholder values
3. Check Firebase Console → Project Settings → Your apps
4. Confirm project ID matches

### Problem: "Firebase: Error (auth/operation-not-allowed)"
**Solution:**
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password" provider
4. Save changes

### Problem: "Missing or insufficient permissions"
**Solution:**
1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Use Test Mode rules (development only):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
4. Publish rules

## 🔐 Authentication Issues

### Problem: "Invalid admin secret key"
**Solution:**
- Default key is `FLEXPOINT_ADMIN_2024`
- Check `/src/utils/constants.ts` for current key
- Ensure no extra spaces when typing

### Problem: Can't login after registration
**Solution:**
1. Check Firebase Console → Authentication → Users
2. Verify user was created
3. Try password reset
4. Clear browser cache and cookies
5. Check browser console for specific error

### Problem: "User does not exist" error
**Solution:**
1. User might not have profile in Firestore
2. Check Firestore → users collection
3. Manual fix: Add document with user's UID

## 📊 Data Loading Issues

### Problem: No members/data showing in dashboard
**Solution:**
1. Click "Create Demo Data" button in admin dashboard
2. Check browser console for errors
3. Verify Firestore rules allow reading
4. Check Network tab in DevTools for failed requests

### Problem: "Cannot read property of undefined"
**Solution:**
- Data structure might be missing fields
- Check Firestore documents match TypeScript types
- Use demo data to see correct structure

### Problem: Old data persisting after changes
**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if data actually updated in Firestore Console

## 🎨 UI/Display Issues

### Problem: Dark mode not working
**Solution:**
- Components use inline styles, not Tailwind dark mode
- Should work automatically
- Check browser console for CSS errors

### Problem: Layout broken on mobile
**Solution:**
1. Clear browser cache
2. Check responsive breakpoints
3. Test with browser DevTools mobile emulation

### Problem: Images not loading
**Solution:**
- This app doesn't use external images
- Icons use Lucide React (should work offline)
- Check browser console for errors

## 🚀 Build/Development Issues

### Problem: "Module not found" errors
**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: TypeScript errors
**Solution:**
1. Check TypeScript version compatibility
2. Run: `npm install --save-dev typescript@latest`
3. Check for missing type definitions

### Problem: Vite dev server won't start
**Solution:**
```bash
# Kill existing processes
npx kill-port 5173

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

## 📱 Role-Based Access Issues

### Problem: Wrong dashboard showing after login
**Solution:**
1. Logout and login again
2. Check Firestore → users → {uid} → role field
3. Verify role is correctly set: 'admin', 'member', or 'user'

### Problem: "Access denied" messages
**Solution:**
- Check user's role in Firestore
- Ensure role matches one of: admin, member, user
- Try re-registering with correct role

## 💾 Database Issues

### Problem: Firestore quota exceeded
**Solution:**
1. Check Firebase Console → Usage tab
2. Free tier limits: 50K reads/day, 20K writes/day
3. Optimize queries or upgrade plan

### Problem: Demo data not creating
**Solution:**
1. Check browser console for specific error
2. Verify Firestore rules allow writes
3. Check if collections already have data
4. Try manual document creation in Firestore Console

### Problem: Data not syncing in real-time
**Solution:**
- App doesn't use real-time listeners
- Reload page to fetch latest data
- Check network connection

## 🔒 Security Issues

### Problem: Anyone can register as admin
**Solution:**
- Admin registration requires secret key
- Change key in `/src/utils/constants.ts`
- For production, use environment variables

### Problem: Members can see admin data
**Solution:**
- Implement Firestore security rules (see README)
- Client-side routing alone isn't secure
- Add server-side validation

## 🌐 Deployment Issues

### Problem: Build fails
**Solution:**
```bash
# Check for TypeScript errors
npm run build

# Fix any reported errors
# Common: missing return types, unused variables
```

### Problem: Environment variables not working
**Solution:**
1. Vite uses `VITE_` prefix
2. Create `.env` file in root
3. Restart dev server after changes
4. Don't commit `.env` to git

## 📞 Getting Additional Help

### Check These First:
1. Browser console (F12) for error messages
2. Firebase Console logs
3. Network tab in DevTools
4. Firestore data structure

### Documentation:
- **Firebase**: https://firebase.google.com/docs
- **React**: https://react.dev/
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### Common Error Codes:

| Code | Meaning | Solution |
|------|---------|----------|
| `auth/invalid-email` | Bad email format | Check email syntax |
| `auth/user-not-found` | User doesn't exist | Register first |
| `auth/wrong-password` | Incorrect password | Reset or retry |
| `permission-denied` | Firestore rules block | Update rules |
| `quota-exceeded` | Free tier limit hit | Upgrade or wait |

## 🛠️ Debug Mode

Enable detailed logging:

```typescript
// In firebase.ts, add:
import { getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized:', getApp().name);
}
```

## 💡 Best Practices

1. **Always check browser console first**
2. **Verify Firebase Console for actual data**
3. **Test with demo data before adding real data**
4. **Use test mode Firestore rules for development**
5. **Implement production rules before going live**
6. **Never commit Firebase credentials to git**
7. **Use environment variables for sensitive data**

---

**Still stuck? Check the full documentation in README.md or SETUP_INSTRUCTIONS.md**
