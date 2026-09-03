require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Review = require('../models/Review');
const GalleryImage = require('../models/GalleryImage');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ase_aptitude';
    console.log(`Connecting to MongoDB for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });
    console.log('MongoDB connected successfully for seed operation.');

    // 1. Seed Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@aseaptitude.com').toLowerCase();
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user [${adminEmail}] already exists.`);
    } else {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Dir. Sajid Raja',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'ase@admin2026',
        role: 'admin'
      });
      console.log(`Initial Admin User created: ${adminEmail} (password: ${process.env.ADMIN_PASSWORD || 'ase@admin2026'})`);
    }

    // 2. Seed Default Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const defaultCourses = [
        {
          title: 'Spoken English',
          slug: 'spoken-english',
          icon: 'fa-microphone-lines',
          shortDescription: 'Overcome hesitation and speak fluent, articulate English with natural pronunciation, grammar mastery, and professional vocabulary.',
          courseDetails: [
            'Basic to Advanced',
            'Grammar',
            'Speaking Practice',
            'Interview Skills'
          ],
          theme: 'theme-blue',
          duration: '3 to 6 Months',
          fee: '₹3,500',
          badge: 'High Demand',
          isActive: true
        },
        {
          title: 'Computer Courses',
          slug: 'computer-courses',
          icon: 'fa-laptop-code',
          shortDescription: 'Master essential computer applications, office productivity suites, digital literacy, and professional publishing tools.',
          courseDetails: [
            'DCA (Diploma in Computer App.)',
            'ADCA (Adv. Diploma in Comp. App.)',
            'DTP (Desktop Publishing)',
            'DIT & DFA',
            'MS Office (Word, Excel, PowerPoint)',
            'Internet & Digital Literacy'
          ],
          theme: 'theme-orange',
          duration: '6 to 12 Months',
          fee: '₹5,500',
          badge: 'Most Popular',
          isActive: true
        },
        {
          title: 'Professional Skills',
          slug: 'professional-skills',
          icon: 'fa-chart-line',
          shortDescription: 'Gain job-ready financial accounting and data calculation skills tailored for modern corporate, banking, and retail commercial roles.',
          courseDetails: [
            'Tally Prime (with GST & Invoicing)',
            'Advanced Excel (VLOOKUP, Pivot, Dashboards)',
            'Job-Oriented Training',
            'Bilingual Typing (English + Hindi)'
          ],
          theme: 'theme-teal',
          duration: '2 to 4 Months',
          fee: '₹4,000',
          badge: 'Career Track',
          isActive: true
        }
      ];

      await Course.insertMany(defaultCourses);
      console.log(`Seeded ${defaultCourses.length} default courses.`);
    } else {
      console.log(`Courses already exist (${courseCount} found).`);
    }

    // 3. Seed Default Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const defaultReviews = [
        {
          studentName: 'Rahul Kumar',
          reviewText: 'My spoken English confidence improved a lot.',
          rating: 5,
          role: 'Spoken English Batch',
          isActive: true
        },
        {
          studentName: 'Pooja Verma',
          reviewText: 'Best institute for computer courses. The practical training helped me a lot.',
          rating: 5,
          role: 'ADCA & Tally Student',
          isActive: true
        },
        {
          studentName: 'Aman Singh',
          reviewText: 'Teachers are very supportive and explain everything clearly.',
          rating: 4,
          role: 'DCA & Typing Student',
          isActive: true
        },
        {
          studentName: 'Priya Sharma',
          reviewText: 'The interview training and mock presentations helped me crack my corporate interview with total ease!',
          rating: 5,
          role: 'Professional Skills Track',
          isActive: true
        }
      ];

      await Review.insertMany(defaultReviews);
      console.log(`Seeded ${defaultReviews.length} default student reviews.`);
    } else {
      console.log(`Reviews already exist (${reviewCount} found).`);
    }

    // 4. Seed Default Gallery Images
    const galleryCount = await GalleryImage.countDocuments();
    if (galleryCount === 0) {
      const defaultGallery = [
        {
          title: 'Certificate Distribution Ceremony & Student Felicitations',
          description: 'Graduating students proudly displaying recognized diploma certificates with Director Sajid Raja.',
          imageUrl: '/images/certificate-ceremony.jpg',
          category: 'activity',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'Director Sajid Raja Addressing Anniversary Ceremony',
          description: 'Director Sajid Raja inspiring students with communication mastery and leadership on stage.',
          imageUrl: '/images/director-speech.jpg',
          category: 'event',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'ASE Aptitude Main Campus Building',
          description: 'Near Grameen Bank, Andar Bazar. Well-equipped computer lab and air-conditioned classrooms.',
          imageUrl: '/images/building.jpeg',
          category: 'building',
          isFeatured: true,
          isActive: true
        },
        {
          title: 'Annual Day & Motivational Seminar',
          description: 'Director Sajid Raja guiding students on communication mastery and career planning.',
          imageUrl: '/images/director.jpeg',
          category: 'event',
          isFeatured: false,
          isActive: true
        }
      ];

      await GalleryImage.insertMany(defaultGallery);
      console.log(`Seeded ${defaultGallery.length} default gallery images.`);
    } else {
      console.log(`Gallery images already exist (${galleryCount} found).`);
    }

    console.log('====================================================');
    console.log('Database Seed Completed Successfully!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
