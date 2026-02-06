// Demo data for testing Flex Point Gym Management System
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const createDemoData = async () => {
  try {
    // Demo Members
    const demoMembers = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        package: 'Elite',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        expiryDate: new Date('2024-07-15'),
        createdAt: new Date('2024-01-15'),
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 98765 43211',
        package: 'Pro',
        status: 'active',
        joinDate: new Date('2024-02-01'),
        expiryDate: new Date('2024-05-01'),
        createdAt: new Date('2024-02-01'),
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        phone: '+91 98765 43212',
        package: 'Basic',
        status: 'active',
        joinDate: new Date('2024-02-10'),
        expiryDate: new Date('2024-03-10'),
        createdAt: new Date('2024-02-10'),
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        phone: '+91 98765 43213',
        package: 'Pro',
        status: 'active',
        joinDate: new Date('2024-01-20'),
        expiryDate: new Date('2024-04-20'),
        createdAt: new Date('2024-01-20'),
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 98765 43214',
        package: 'Pending',
        status: 'new',
        joinDate: new Date(),
        createdAt: new Date(),
      },
    ];

    // Add members
    for (const member of demoMembers) {
      await addDoc(collection(db, 'members'), member);
    }

    // Demo Billings
    const demoBillings = [
      {
        memberId: 'rahul.sharma@example.com',
        memberName: 'Rahul Sharma',
        amount: 4000,
        currency: 'INR',
        status: 'paid',
        date: new Date('2024-01-15'),
        description: 'Elite Package - 6 Months',
        packageType: 'Elite',
      },
      {
        memberId: 'priya.patel@example.com',
        memberName: 'Priya Patel',
        amount: 2500,
        currency: 'INR',
        status: 'paid',
        date: new Date('2024-02-01'),
        description: 'Pro Package - 3 Months',
        packageType: 'Pro',
      },
      {
        memberId: 'amit.kumar@example.com',
        memberName: 'Amit Kumar',
        amount: 1500,
        currency: 'INR',
        status: 'pending',
        date: new Date('2024-02-10'),
        description: 'Basic Package - 1 Month',
        packageType: 'Basic',
      },
      {
        memberId: 'sneha.reddy@example.com',
        memberName: 'Sneha Reddy',
        amount: 2500,
        currency: 'INR',
        status: 'paid',
        date: new Date('2024-01-20'),
        description: 'Pro Package - 3 Months',
        packageType: 'Pro',
      },
    ];

    // Add billings
    for (const billing of demoBillings) {
      await addDoc(collection(db, 'billings'), billing);
    }

    // Demo Supplements
    const demoSupplements = [
      {
        name: 'Whey Protein - 1kg',
        price: 2500,
        currency: 'INR',
        stock: 50,
        description: 'Premium quality whey protein isolate',
        category: 'Protein',
      },
      {
        name: 'Creatine Monohydrate - 300g',
        price: 1200,
        currency: 'INR',
        stock: 30,
        description: 'Pure creatine monohydrate for muscle growth',
        category: 'Performance',
      },
      {
        name: 'BCAA - 500g',
        price: 1800,
        currency: 'INR',
        stock: 25,
        description: 'Branched-chain amino acids for recovery',
        category: 'Recovery',
      },
      {
        name: 'Pre-Workout - 300g',
        price: 1500,
        currency: 'INR',
        stock: 40,
        description: 'Energy boost for intense workouts',
        category: 'Performance',
      },
      {
        name: 'Multivitamin - 60 tablets',
        price: 800,
        currency: 'INR',
        stock: 60,
        description: 'Daily multivitamin supplement',
        category: 'Health',
      },
    ];

    // Add supplements
    for (const supplement of demoSupplements) {
      await addDoc(collection(db, 'supplements'), supplement);
    }

    // Demo Diet Plans
    const demoDietPlans = [
      {
        memberId: 'rahul.sharma@example.com',
        memberName: 'Rahul Sharma',
        plan: 'Muscle Building',
        calories: 3000,
        protein: 200,
        carbs: 350,
        fats: 80,
        notes: 'High protein diet with complex carbs. 6 meals per day.',
        createdAt: new Date('2024-01-15'),
      },
      {
        memberId: 'priya.patel@example.com',
        memberName: 'Priya Patel',
        plan: 'Weight Loss',
        calories: 1800,
        protein: 120,
        carbs: 180,
        fats: 60,
        notes: 'Calorie deficit with balanced macros. Focus on lean proteins.',
        createdAt: new Date('2024-02-01'),
      },
      {
        memberId: 'sneha.reddy@example.com',
        memberName: 'Sneha Reddy',
        plan: 'Maintenance',
        calories: 2200,
        protein: 140,
        carbs: 250,
        fats: 70,
        notes: 'Balanced diet for maintaining current physique.',
        createdAt: new Date('2024-01-20'),
      },
    ];

    // Add diet plans
    for (const dietPlan of demoDietPlans) {
      await addDoc(collection(db, 'dietPlans'), dietPlan);
    }

    console.log('✅ Demo data created successfully!');
    return { success: true, message: 'Demo data created successfully' };
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    return { success: false, message: 'Failed to create demo data', error };
  }
};
