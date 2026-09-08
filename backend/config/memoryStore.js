const bcrypt = require('bcryptjs');

// Pre-hashed default password 'ase@admin2026'
const DEFAULT_ADMIN_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ase@admin2026', 10);

const memoryStore = {
  admins: [
    {
      _id: 'admin_seed_1',
      name: process.env.ADMIN_NAME || 'Dir. Sajid Raja',
      email: (process.env.ADMIN_EMAIL || 'admin@aseaptitude.com').toLowerCase(),
      password: DEFAULT_ADMIN_HASH,
      role: 'admin',
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, this.password);
      }
    }
  ],

  courses: [
    {
      _id: 'course_1',
      title: 'Spoken English',
      slug: 'spoken-english',
      icon: 'fa-microphone-lines',
      shortDescription: 'Overcome hesitation and speak fluent, articulate English with natural pronunciation, grammar mastery, and professional vocabulary.',
      courseDetails: ['Basic to Advanced', 'Grammar', 'Speaking Practice', 'Interview Skills'],
      theme: 'theme-blue',
      duration: '3 to 6 Months',
      fee: '₹3,500',
      badge: 'High Demand',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'course_2',
      title: 'Computer Courses',
      slug: 'computer-courses',
      icon: 'fa-laptop-code',
      shortDescription: 'Master essential computer applications, office productivity suites, digital literacy, and professional publishing tools.',
      courseDetails: ['DCA (Diploma in Computer App.)', 'ADCA (Adv. Diploma in Comp. App.)', 'DTP (Desktop Publishing)', 'DIT & DFA', 'MS Office', 'Internet'],
      theme: 'theme-orange',
      duration: '6 to 12 Months',
      fee: '₹5,500',
      badge: 'Most Popular',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'course_3',
      title: 'Professional Skills',
      slug: 'professional-skills',
      icon: 'fa-chart-line',
      shortDescription: 'Gain job-ready financial accounting and data calculation skills tailored for modern corporate, banking, and retail commercial roles.',
      courseDetails: ['Tally Prime (with GST)', 'Advanced Excel (VLOOKUP, Pivot)', 'Job-Oriented Training', 'Bilingual Typing'],
      theme: 'theme-teal',
      duration: '2 to 4 Months',
      fee: '₹4,000',
      badge: 'Career Track',
      isActive: true,
      createdAt: new Date()
    }
  ],

  reviews: [
    {
      _id: 'review_ujala',
      studentName: 'Ujala Madhesia',
      studentPhoto: 'images/ujala-madhesia-avatar.jpg',
      videoUrl: 'https://www.instagram.com/reel/Dck2ylIBqPs/?stkn=cmw0d3NveW9ha3F4',
      reviewText: 'ASE Aptitude completely transformed my spoken English confidence and eliminated hesitation. The interactive speaking sessions, dedicated computer lab, and personal guidance from Director Sajid Raja Sir made all the difference!',
      rating: 5,
      role: 'Spoken English Student • ASE Aptitude',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'review_nazia',
      studentName: 'Nazia Parween',
      studentPhoto: 'images/nazia-parween-avatar.jpg',
      videoUrl: 'https://www.instagram.com/reel/DcgV8g9Iw4n/?stkn=YWdxaWNhd21vczE2',
      reviewText: 'The computer training and spoken English environment at ASE Aptitude is wonderful! Practical lab sessions, personal guidance from Director Sir, and supportive teaching helped me build strong career skills.',
      rating: 5,
      role: 'Computer & Spoken English Student • ASE Aptitude',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'review_khushi',
      studentName: 'Khushi Kumari',
      studentPhoto: 'images/khushi-kumari-avatar.jpg',
      videoUrl: 'https://www.instagram.com/reel/DaDSHDPJLrI/?stkn=NzhobXU3YzRmb2Jw',
      reviewText: 'Learning at ASE Aptitude was the best decision for my confidence and career! The practical computer training and spoken English speaking practice are top-notch with great personal attention from teachers.',
      rating: 5,
      role: 'Spoken English & Computer Student • ASE Aptitude',
      isActive: true,
      createdAt: new Date()
    }
  ],

  gallery: [
    {
      _id: 'gallery_1',
      title: 'Certificate Distribution Ceremony & Student Felicitations',
      description: 'Graduating students proudly displaying recognized diploma certificates with Director Sajid Raja.',
      imageUrl: '/images/certificate-ceremony.jpg',
      category: 'activity',
      isFeatured: true,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'gallery_2',
      title: 'Director Sajid Raja Addressing Anniversary Ceremony',
      description: 'Director Sajid Raja inspiring students with communication mastery and leadership on stage.',
      imageUrl: '/images/director-speech.jpg',
      category: 'event',
      isFeatured: true,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'gallery_3',
      title: 'ASE Aptitude Main Campus Building',
      description: 'Near Grameen Bank, Andar Bazar. Well-equipped computer lab and air-conditioned classrooms.',
      imageUrl: '/images/building.jpeg',
      category: 'building',
      isFeatured: true,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'gallery_4',
      title: 'Annual Day & Motivational Seminar',
      description: 'Director Sajid Raja guiding students on communication mastery and career planning.',
      imageUrl: '/images/director.jpeg',
      category: 'event',
      isFeatured: false,
      isActive: true,
      createdAt: new Date()
    }
  ],

  demoApplications: [],
  contactMessages: []
};

module.exports = memoryStore;
