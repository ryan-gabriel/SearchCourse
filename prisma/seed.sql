-- SearchCourse Seed Data
-- Realistic fake data for all tables
-- Generated: 2026-02-02
-- IDs use CUID format (25 chars, lowercase alphanumeric)

-- ============================================
-- CLEAR EXISTING DATA (in order of dependencies)
-- ============================================

DELETE FROM "ClickEvent";
DELETE FROM "RoadmapStep";
DELETE FROM "Roadmap";
DELETE FROM "Coupon";
DELETE FROM "Course";
DELETE FROM "Category";
DELETE FROM "Platform";
DELETE FROM "AdminUser";

-- ============================================
-- PLATFORMS
-- ============================================

INSERT INTO "Platform" (id, name, slug, "logoUrl", "baseUrl", "isActive", "createdAt", "updatedAt") VALUES
('cm5plt01udemy00000000', 'Udemy', 'udemy', 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg', 'https://www.udemy.com', true, NOW(), NOW()),
('cm5plt02coursera00000', 'Coursera', 'coursera', 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/coursera-logo.svg', 'https://www.coursera.org', true, NOW(), NOW()),
('cm5plt03skillshare000', 'Skillshare', 'skillshare', 'https://static.skillshare.com/assets/images/skillshare-logo.svg', 'https://www.skillshare.com', true, NOW(), NOW()),
('cm5plt04pluralsight00', 'Pluralsight', 'pluralsight', 'https://www.pluralsight.com/etc/clientlibs/pluralsight/images/logo.svg', 'https://www.pluralsight.com', true, NOW(), NOW()),
('cm5plt05linkedin00000', 'LinkedIn Learning', 'linkedin-learning', 'https://static.licdn.com/aero-v1/sc/h/alf1mxixy5bze4j8k0w4d4hze', 'https://www.linkedin.com/learning', true, NOW(), NOW()),
('cm5plt06edx0000000000', 'edX', 'edx', 'https://www.edx.org/images/logos/edx-logo.svg', 'https://www.edx.org', true, NOW(), NOW());

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO "Category" (id, name, slug, description, "iconName", "sortOrder", "createdAt", "updatedAt") VALUES
('cm5cat01webdev0000000', 'Web Development', 'web-development', 'Build modern websites and web applications with the latest technologies', 'Globe', 1, NOW(), NOW()),
('cm5cat02mobile0000000', 'Mobile Development', 'mobile-development', 'Create native and cross-platform mobile apps for iOS and Android', 'Smartphone', 2, NOW(), NOW()),
('cm5cat03datascience00', 'Data Science', 'data-science', 'Analyze data, build ML models, and extract insights from complex datasets', 'BarChart3', 3, NOW(), NOW()),
('cm5cat04cybersecurity0', 'Cybersecurity', 'cybersecurity', 'Protect systems, networks, and data from cyber threats', 'Shield', 4, NOW(), NOW()),
('cm5cat05cloud00000000', 'Cloud Computing', 'cloud-computing', 'Master AWS, Azure, GCP and cloud-native architectures', 'Cloud', 5, NOW(), NOW()),
('cm5cat06devops0000000', 'DevOps & CI/CD', 'devops', 'Automate deployments, infrastructure, and development workflows', 'GitBranch', 6, NOW(), NOW()),
('cm5cat07design0000000', 'UI/UX Design', 'ui-ux-design', 'Design beautiful and user-friendly digital experiences', 'Palette', 7, NOW(), NOW()),
('cm5cat08ai00000000000', 'Artificial Intelligence', 'artificial-intelligence', 'Build intelligent systems with machine learning and deep learning', 'Brain', 8, NOW(), NOW()),
('cm5cat09business00000', 'Business & Marketing', 'business-marketing', 'Grow your business with digital marketing and analytics', 'TrendingUp', 9, NOW(), NOW()),
('cm5cat10gamedev000000', 'Game Development', 'game-development', 'Create immersive games with Unity, Unreal, and modern game engines', 'Gamepad2', 10, NOW(), NOW());

-- ============================================
-- COURSES
-- ============================================

INSERT INTO "Course" (id, title, slug, description, "shortDescription", "instructorName", "thumbnailUrl", "originalPrice", currency, level, rating, "reviewCount", "studentCount", duration, "lectureCount", "directUrl", "affiliateUrl", "isActive", "isFeatured", "lastVerifiedAt", "platformId", "categoryId", "createdAt", "updatedAt") VALUES

-- Web Development Courses
('cm5crs01reactcomplete0', 'The Complete React Developer Course', 'complete-react-developer-course', 
'Master React from scratch! Learn React hooks, Redux Toolkit, React Router, and build production-ready applications. This comprehensive course covers everything from JSX basics to advanced patterns like compound components and render props. You''ll build 5 real-world projects including an e-commerce platform, social media dashboard, and task management app.', 
'Master React 19, hooks, Redux, and build 5 real projects. From zero to job-ready React developer.',
'Andrew Mitchell', 'https://img-c.udemycdn.com/course/480x270/react-complete.jpg', 
94.99, 'USD', 'BEGINNER', 4.8, 43521, 187432, '42h 30m', 385,
'https://www.udemy.com/course/complete-react-developer/', 'https://www.udemy.com/course/complete-react-developer/?couponCode=SEARCH2026',
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat01webdev0000000', NOW(), NOW()),

('cm5crs02nextjsmastery0', 'Next.js 15 - The Complete Guide', 'nextjs-15-complete-guide',
'Build full-stack applications with Next.js 15, Server Components, Server Actions, and the App Router. Learn authentication, database integration with Prisma, deployment strategies, and performance optimization. Perfect for developers looking to build modern, scalable web applications.',
'Build production-ready apps with Next.js 15, App Router, Server Components & Actions.',
'Maximilian Chen', 'https://img-c.udemycdn.com/course/480x270/nextjs-complete.jpg',
89.99, 'USD', 'INTERMEDIATE', 4.9, 28934, 112543, '38h 15m', 312,
'https://www.udemy.com/course/nextjs-complete-guide/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat01webdev0000000', NOW(), NOW()),

('cm5crs03nodebootcamp00', 'Node.js Bootcamp: Build REST APIs & GraphQL', 'nodejs-bootcamp-rest-graphql',
'Comprehensive Node.js course covering Express.js, MongoDB, PostgreSQL, authentication, file uploads, real-time features with Socket.io, and GraphQL. Build a complete marketplace API from scratch with payment integration.',
'Complete Node.js backend development with Express, databases, auth & GraphQL.',
'Jonas Schmedtmann', 'https://img-c.udemycdn.com/course/480x270/nodejs-bootcamp.jpg',
99.99, 'USD', 'INTERMEDIATE', 4.7, 35621, 156789, '45h 20m', 402,
'https://www.udemy.com/course/nodejs-bootcamp/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat01webdev0000000', NOW(), NOW()),

('cm5crs04typescriptpro0', 'TypeScript for Professionals', 'typescript-for-professionals',
'Go beyond the basics with advanced TypeScript patterns, generics, decorators, and type gymnastics. Learn to build type-safe libraries and contribute to large-scale TypeScript codebases.',
'Advanced TypeScript: generics, decorators, type-safe patterns for production apps.',
'Matt Pocock', 'https://img-c.udemycdn.com/course/480x270/typescript-pro.jpg',
79.99, 'USD', 'ADVANCED', 4.9, 15432, 67823, '28h 45m', 245,
'https://www.udemy.com/course/typescript-professionals/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat01webdev0000000', NOW(), NOW()),

-- Mobile Development Courses
('cm5crs05fluttercomplete', 'Flutter & Dart - The Complete Development Guide', 'flutter-dart-complete-guide',
'Build beautiful, natively compiled iOS and Android apps with Flutter. Master Dart programming, state management with Riverpod and Bloc, Firebase integration, and publish your apps to both app stores.',
'Build stunning iOS & Android apps with Flutter. Complete guide from basics to deployment.',
'Angela Yu', 'https://img-c.udemycdn.com/course/480x270/flutter-complete.jpg',
94.99, 'USD', 'BEGINNER', 4.8, 52341, 234567, '48h 30m', 425,
'https://www.udemy.com/course/flutter-complete/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat02mobile0000000', NOW(), NOW()),

('cm5crs06reactnative000', 'React Native - Build Mobile Apps', 'react-native-build-mobile-apps',
'Create cross-platform mobile applications using React Native and Expo. Learn navigation, native device features, push notifications, and backend integration with Firebase and Supabase.',
'Build cross-platform mobile apps with React Native, Expo & modern tooling.',
'Stephen Grider', 'https://img-c.udemycdn.com/course/480x270/react-native.jpg',
89.99, 'USD', 'INTERMEDIATE', 4.6, 31245, 145678, '35h 15m', 298,
'https://www.udemy.com/course/react-native-complete/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat02mobile0000000', NOW(), NOW()),

('cm5crs07iosswift000000', 'iOS Development with Swift & SwiftUI', 'ios-development-swift-swiftui',
'Master iOS app development from scratch. Learn Swift programming, SwiftUI for modern UIs, UIKit for legacy code, Core Data, CloudKit, and App Store deployment.',
'Complete iOS development with Swift 6 and SwiftUI. Build 10+ real-world apps.',
'Sean Allen', 'https://img-c.udemycdn.com/course/480x270/ios-swift.jpg',
109.99, 'USD', 'BEGINNER', 4.9, 28765, 98234, '52h 45m', 456,
'https://www.udemy.com/course/ios-swift-swiftui/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat02mobile0000000', NOW(), NOW()),

-- Data Science Courses
('cm5crs08pythonds00000', 'Python for Data Science & Machine Learning', 'python-data-science-ml',
'Complete data science bootcamp using Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, and Keras. From data analysis to deep learning with real-world datasets.',
'Master data science with Python: analysis, visualization, ML & deep learning.',
'Jose Portilla', 'https://img-c.udemycdn.com/course/480x270/python-ds.jpg',
94.99, 'USD', 'BEGINNER', 4.7, 67853, 345678, '56h 30m', 512,
'https://www.udemy.com/course/python-data-science/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat03datascience00', NOW(), NOW()),

('cm5crs09mlstanford0000', 'Machine Learning Specialization', 'machine-learning-stanford',
'Stanford''s renowned machine learning course by Andrew Ng. Cover supervised learning, neural networks, decision trees, clustering, and recommender systems with hands-on assignments.',
'Stanford ML course: supervised learning, neural networks & practical skills.',
'Andrew Ng', 'https://d3njjcbhbojbot.cloudfront.net/course/ml-stanford.jpg',
79.00, 'USD', 'INTERMEDIATE', 4.9, 89234, 567890, '42h 00m', 156,
'https://www.coursera.org/specializations/machine-learning', NULL,
true, true, NOW(), 'cm5plt02coursera00000', 'cm5cat03datascience00', NOW(), NOW()),

('cm5crs10sqlanalytics00', 'SQL for Data Analytics', 'sql-for-data-analytics',
'Master SQL for business intelligence and data analytics. Learn window functions, CTEs, performance optimization, and build dashboards with real company datasets.',
'Advanced SQL for analysts: window functions, CTEs, optimization & BI tools.',
'David Kim', 'https://img-c.udemycdn.com/course/480x270/sql-analytics.jpg',
69.99, 'USD', 'INTERMEDIATE', 4.6, 23456, 89012, '24h 30m', 186,
'https://www.udemy.com/course/sql-data-analytics/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat03datascience00', NOW(), NOW()),

-- Cloud Computing Courses
('cm5crs11awssaa00000000', 'AWS Solutions Architect Associate', 'aws-solutions-architect-associate',
'Prepare for the AWS SAA-C03 exam with comprehensive coverage of EC2, S3, VPC, RDS, Lambda, CloudFront, and architectural best practices. Includes practice exams and hands-on labs.',
'Pass AWS SAA-C03: EC2, S3, Lambda, VPC & architecture best practices.',
'Stephane Maarek', 'https://img-c.udemycdn.com/course/480x270/aws-saa.jpg',
99.99, 'USD', 'INTERMEDIATE', 4.8, 78234, 456789, '32h 15m', 384,
'https://www.udemy.com/course/aws-solutions-architect/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat05cloud00000000', NOW(), NOW()),

('cm5crs12azurefund00000', 'Microsoft Azure Fundamentals AZ-900', 'azure-fundamentals-az900',
'Complete preparation for Azure AZ-900 certification. Understand cloud concepts, Azure services, security, pricing, and governance with practical demonstrations.',
'Pass Azure AZ-900: cloud concepts, core services, security & governance.',
'Scott Duffy', 'https://img-c.udemycdn.com/course/480x270/azure-az900.jpg',
59.99, 'USD', 'BEGINNER', 4.7, 45678, 234567, '18h 30m', 156,
'https://www.udemy.com/course/azure-fundamentals/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat05cloud00000000', NOW(), NOW()),

('cm5crs13kubernetes0000', 'Kubernetes Mastery: Docker to Production', 'kubernetes-mastery',
'Complete Kubernetes course from containers to production deployments. Master pods, services, deployments, Helm, GitOps, monitoring, and security best practices.',
'Master Kubernetes: containers to production with Helm, GitOps & monitoring.',
'Bret Fisher', 'https://img-c.udemycdn.com/course/480x270/kubernetes.jpg',
89.99, 'USD', 'ADVANCED', 4.8, 34567, 145678, '28h 45m', 267,
'https://www.udemy.com/course/kubernetes-mastery/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat05cloud00000000', NOW(), NOW()),

-- DevOps Courses
('cm5crs14dockercomplete', 'Docker & Containers: From Zero to Production', 'docker-complete-guide',
'Master Docker containerization, multi-stage builds, Docker Compose, networking, volumes, and security. Deploy to AWS ECS, Azure Container Apps, and Kubernetes.',
'Complete Docker guide: containers, Compose, networking & cloud deployment.',
'Mumshad Mannambeth', 'https://img-c.udemycdn.com/course/480x270/docker-complete.jpg',
84.99, 'USD', 'BEGINNER', 4.7, 56789, 267890, '26h 30m', 234,
'https://www.udemy.com/course/docker-complete/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat06devops0000000', NOW(), NOW()),

('cm5crs15terraform00000', 'Terraform: Infrastructure as Code', 'terraform-infrastructure-code',
'Build cloud infrastructure with Terraform across AWS, Azure, and GCP. Learn modules, workspaces, state management, and CI/CD integration with GitHub Actions.',
'Master Terraform: IaC for AWS, Azure & GCP with modules & CI/CD.',
'Ned Bellavance', 'https://img-c.udemycdn.com/course/480x270/terraform.jpg',
79.99, 'USD', 'INTERMEDIATE', 4.8, 23456, 98765, '22h 15m', 198,
'https://www.udemy.com/course/terraform-infrastructure/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat06devops0000000', NOW(), NOW()),

('cm5crs16githubactions0', 'GitHub Actions: Complete CI/CD Workflow', 'github-actions-cicd',
'Automate your development workflow with GitHub Actions. Learn workflows, custom actions, matrix builds, deployment strategies, and security best practices.',
'Master GitHub Actions: workflows, custom actions, deployments & security.',
'Ali Spittel', 'https://img-c.udemycdn.com/course/480x270/github-actions.jpg',
64.99, 'USD', 'INTERMEDIATE', 4.6, 15678, 67890, '16h 45m', 145,
'https://www.udemy.com/course/github-actions/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat06devops0000000', NOW(), NOW()),

-- Cybersecurity Courses
('cm5crs17ethicalhacking0', 'Complete Ethical Hacking & Penetration Testing', 'ethical-hacking-penetration',
'Learn ethical hacking from scratch. Master reconnaissance, scanning, exploitation, post-exploitation, and web application security. Prepare for CEH and OSCP certifications.',
'Learn ethical hacking: recon, exploitation, web security & certifications.',
'Zaid Sabih', 'https://img-c.udemycdn.com/course/480x270/ethical-hacking.jpg',
99.99, 'USD', 'INTERMEDIATE', 4.7, 67890, 345678, '45h 30m', 398,
'https://www.udemy.com/course/ethical-hacking/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat04cybersecurity0', NOW(), NOW()),

('cm5crs18securityplus00', 'CompTIA Security+ (SY0-701) Complete Course', 'comptia-security-plus',
'Full preparation for CompTIA Security+ certification. Cover threats, architecture, implementation, operations, and governance with practice exams.',
'Pass CompTIA Security+ SY0-701: comprehensive exam preparation course.',
'Mike Meyers', 'https://img-c.udemycdn.com/course/480x270/security-plus.jpg',
89.99, 'USD', 'BEGINNER', 4.8, 34567, 189012, '28h 15m', 256,
'https://www.udemy.com/course/security-plus/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat04cybersecurity0', NOW(), NOW()),

-- UI/UX Design Courses
('cm5crs19figmacomplete0', 'Figma UI/UX Design Masterclass', 'figma-ui-ux-masterclass',
'Master Figma from basics to advanced prototyping. Learn design systems, auto layout, components, variables, and handoff to developers. Build a complete design portfolio.',
'Master Figma: design systems, prototyping, components & developer handoff.',
'Daniel Walter Scott', 'https://img-c.udemycdn.com/course/480x270/figma-complete.jpg',
84.99, 'USD', 'BEGINNER', 4.8, 45678, 198765, '32h 30m', 287,
'https://www.udemy.com/course/figma-masterclass/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat07design0000000', NOW(), NOW()),

('cm5crs20uxresearch0000', 'UX Research & User Testing Fundamentals', 'ux-research-user-testing',
'Learn user research methods: interviews, surveys, usability testing, A/B testing, and data analysis. Build research skills that companies value.',
'Master UX research: interviews, usability testing, surveys & insights.',
'Sarah Doody', 'https://img-c.udemycdn.com/course/480x270/ux-research.jpg',
74.99, 'USD', 'BEGINNER', 4.6, 23456, 87654, '18h 45m', 156,
'https://www.udemy.com/course/ux-research/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat07design0000000', NOW(), NOW()),

-- AI Courses
('cm5crs21chatgptlangchn', 'ChatGPT & LangChain for Developers', 'chatgpt-langchain-developers',
'Build AI-powered applications with OpenAI''s GPT-4, LangChain, and vector databases. Create chatbots, RAG systems, agents, and production-ready AI solutions.',
'Build AI apps with GPT-4, LangChain, RAG & vector databases.',
'Harrison Chase', 'https://img-c.udemycdn.com/course/480x270/chatgpt-langchain.jpg',
89.99, 'USD', 'INTERMEDIATE', 4.8, 56789, 234567, '24h 30m', 198,
'https://www.udemy.com/course/chatgpt-langchain/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat08ai00000000000', NOW(), NOW()),

('cm5crs22deeplearning00', 'Deep Learning A-Z: Neural Networks & AI', 'deep-learning-neural-networks',
'Complete deep learning course covering ANNs, CNNs, RNNs, Self-Organizing Maps, Boltzmann Machines, and AutoEncoders with Python and TensorFlow.',
'Master deep learning: neural networks, CNNs, RNNs with TensorFlow.',
'Kirill Eremenko', 'https://img-c.udemycdn.com/course/480x270/deep-learning.jpg',
94.99, 'USD', 'INTERMEDIATE', 4.6, 67890, 345678, '42h 15m', 378,
'https://www.udemy.com/course/deep-learning/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat08ai00000000000', NOW(), NOW()),

-- Business Courses
('cm5crs23digitalmarktin', 'Digital Marketing Masterclass', 'digital-marketing-masterclass',
'Complete digital marketing course: SEO, Google Ads, Facebook Ads, email marketing, content marketing, analytics, and conversion optimization.',
'Master digital marketing: SEO, PPC, social media, email & analytics.',
'Ryan Deiss', 'https://img-c.udemycdn.com/course/480x270/digital-marketing.jpg',
99.99, 'USD', 'BEGINNER', 4.5, 34567, 156789, '38h 30m', 312,
'https://www.udemy.com/course/digital-marketing/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat09business00000', NOW(), NOW()),

('cm5crs24googleanalytic', 'Google Analytics 4 Complete Guide', 'google-analytics-4-guide',
'Master GA4 from setup to advanced analysis. Learn event tracking, custom dimensions, audiences, explorations, and integration with Google Ads and BigQuery.',
'Master Google Analytics 4: setup, tracking, analysis & reporting.',
'Julius Fedorovicius', 'https://img-c.udemycdn.com/course/480x270/google-analytics.jpg',
69.99, 'USD', 'INTERMEDIATE', 4.7, 23456, 98765, '16h 45m', 145,
'https://www.udemy.com/course/google-analytics-4/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat09business00000', NOW(), NOW()),

-- Game Development Courses
('cm5crs25unitycomplete0', 'Complete Unity Game Developer 3D', 'unity-game-developer-3d',
'Build 5 games with Unity: FPS shooter, racing game, RPG, puzzle game, and tower defense. Learn C#, physics, AI, and publishing to Steam and mobile.',
'Build 5 games with Unity 3D: FPS, racing, RPG & more. Master C# & game physics.',
'Ben Tristrem', 'https://img-c.udemycdn.com/course/480x270/unity-complete.jpg',
109.99, 'USD', 'BEGINNER', 4.7, 89012, 456789, '55h 30m', 478,
'https://www.udemy.com/course/unity-game-developer/', NULL,
true, true, NOW(), 'cm5plt01udemy00000000', 'cm5cat10gamedev000000', NOW(), NOW()),

('cm5crs26unrealengine00', 'Unreal Engine 5 Blueprint Complete', 'unreal-engine-5-blueprint',
'Create AAA-quality games with Unreal Engine 5. Master Blueprints, Nanite, Lumen, MetaHumans, and build stunning environments without writing code.',
'Master Unreal Engine 5: Blueprints, Nanite, Lumen & AAA game creation.',
'Dev Enabled', 'https://img-c.udemycdn.com/course/480x270/unreal-engine.jpg',
94.99, 'USD', 'INTERMEDIATE', 4.6, 34567, 145678, '48h 15m', 398,
'https://www.udemy.com/course/unreal-engine-5/', NULL,
true, false, NOW(), 'cm5plt01udemy00000000', 'cm5cat10gamedev000000', NOW(), NOW());

-- ============================================
-- COUPONS
-- ============================================

INSERT INTO "Coupon" (id, code, "discountType", "discountValue", "finalPrice", "expiresAt", "isActive", source, "verifiedAt", "courseId", "createdAt", "updatedAt") VALUES

-- Web Development Coupons
('cm5cpn01react1000000', 'REACT2026', 'PERCENTAGE', 85.00, 14.99, '2026-02-28 23:59:59', true, 'Instructor Promo', NOW(), 'cm5crs01reactcomplete0', NOW(), NOW()),
('cm5cpn02react2000000', 'NEWYEAR26', 'PERCENTAGE', 90.00, 9.99, '2026-02-15 23:59:59', true, 'Flash Sale', NOW(), 'cm5crs01reactcomplete0', NOW(), NOW()),
('cm5cpn03nextjs1000000', 'NEXT15GO', 'PERCENTAGE', 80.00, 17.99, '2026-02-20 23:59:59', true, 'Launch Special', NOW(), 'cm5crs02nextjsmastery0', NOW(), NOW()),
('cm5cpn04node10000000', 'BACKEND26', 'PERCENTAGE', 82.00, 17.99, '2026-02-25 23:59:59', true, 'Winter Sale', NOW(), 'cm5crs03nodebootcamp00', NOW(), NOW()),
('cm5cpn05ts100000000', 'TYPESCRIPT', 'PERCENTAGE', 75.00, 19.99, '2026-03-01 23:59:59', true, 'Course Launch', NOW(), 'cm5crs04typescriptpro0', NOW(), NOW()),

-- Mobile Development Coupons
('cm5cpn06flutter100000', 'FLUTTER26', 'PERCENTAGE', 84.00, 14.99, '2026-02-28 23:59:59', true, 'Instructor Promo', NOW(), 'cm5crs05fluttercomplete', NOW(), NOW()),
('cm5cpn07rn1000000000', 'MOBILE26', 'PERCENTAGE', 78.00, 19.99, '2026-02-18 23:59:59', true, 'Platform Sale', NOW(), 'cm5crs06reactnative000', NOW(), NOW()),
('cm5cpn08ios1000000000', 'SWIFT2026', 'PERCENTAGE', 82.00, 19.99, '2026-02-22 23:59:59', true, 'New Year Promo', NOW(), 'cm5crs07iosswift000000', NOW(), NOW()),

-- Data Science Coupons
('cm5cpn09pyds1000000', 'DATASCIENCE', 'PERCENTAGE', 85.00, 14.99, '2026-02-28 23:59:59', true, 'Bestseller Promo', NOW(), 'cm5crs08pythonds00000', NOW(), NOW()),
('cm5cpn10ml10000000000', NULL, 'PERCENTAGE', 100.00, 0.00, '2026-02-10 23:59:59', true, 'Free Audit', NOW(), 'cm5crs09mlstanford0000', NOW(), NOW()),
('cm5cpn11sql1000000000', 'ANALYTICS26', 'PERCENTAGE', 72.00, 19.99, '2026-02-15 23:59:59', true, 'Flash Sale', NOW(), 'cm5crs10sqlanalytics00', NOW(), NOW()),

-- Cloud Computing Coupons
('cm5cpn12aws1000000000', 'AWSCLOUD', 'PERCENTAGE', 85.00, 14.99, '2026-02-28 23:59:59', true, 'Certification Prep', NOW(), 'cm5crs11awssaa00000000', NOW(), NOW()),
('cm5cpn13azure100000000', 'AZURE900', 'PERCENTAGE', 75.00, 14.99, '2026-02-20 23:59:59', true, 'Beginner Special', NOW(), 'cm5crs12azurefund00000', NOW(), NOW()),
('cm5cpn14k8s1000000000', 'KUBEPRO', 'PERCENTAGE', 78.00, 19.99, '2026-02-25 23:59:59', true, 'DevOps Week', NOW(), 'cm5crs13kubernetes0000', NOW(), NOW()),

-- DevOps Coupons
('cm5cpn15docker1000000', 'CONTAINERS', 'PERCENTAGE', 76.00, 19.99, '2026-02-22 23:59:59', true, 'DevOps Sale', NOW(), 'cm5crs14dockercomplete', NOW(), NOW()),
('cm5cpn16tf10000000000', 'TERRAFORM26', 'PERCENTAGE', 81.00, 14.99, '2026-02-28 23:59:59', true, 'IaC Special', NOW(), 'cm5crs15terraform00000', NOW(), NOW()),
('cm5cpn17gha1000000000', 'ACTIONS26', 'PERCENTAGE', 69.00, 19.99, '2026-02-15 23:59:59', true, 'GitHub Promo', NOW(), 'cm5crs16githubactions0', NOW(), NOW()),

-- Cybersecurity Coupons
('cm5cpn18hack1000000', 'SECUREPRO', 'PERCENTAGE', 85.00, 14.99, '2026-02-28 23:59:59', true, 'Security Month', NOW(), 'cm5crs17ethicalhacking0', NOW(), NOW()),
('cm5cpn19sec1000000000', 'SECURITY26', 'PERCENTAGE', 78.00, 19.99, '2026-02-20 23:59:59', true, 'Cert Prep', NOW(), 'cm5crs18securityplus00', NOW(), NOW()),

-- Design Coupons
('cm5cpn20figma100000000', 'DESIGN2026', 'PERCENTAGE', 76.00, 19.99, '2026-02-25 23:59:59', true, 'Creative Sale', NOW(), 'cm5crs19figmacomplete0', NOW(), NOW()),
('cm5cpn21ux10000000000', 'UXRESEARCH', 'PERCENTAGE', 67.00, 24.99, '2026-02-18 23:59:59', true, 'UX Week', NOW(), 'cm5crs20uxresearch0000', NOW(), NOW()),

-- AI Coupons
('cm5cpn22gpt1000000000', 'AIDEV2026', 'PERCENTAGE', 83.00, 14.99, '2026-02-28 23:59:59', true, 'AI Revolution', NOW(), 'cm5crs21chatgptlangchn', NOW(), NOW()),
('cm5cpn23dl10000000000', 'DEEPLEARN', 'PERCENTAGE', 79.00, 19.99, '2026-02-22 23:59:59', true, 'Neural Network Sale', NOW(), 'cm5crs22deeplearning00', NOW(), NOW()),

-- Business Coupons
('cm5cpn24dm10000000000', 'MARKETING26', 'PERCENTAGE', 70.00, 29.99, '2026-02-28 23:59:59', true, 'Business Week', NOW(), 'cm5crs23digitalmarktin', NOW(), NOW()),
('cm5cpn25ga10000000000', 'ANALYTICS', 'PERCENTAGE', 71.00, 19.99, '2026-02-20 23:59:59', true, 'Data Promo', NOW(), 'cm5crs24googleanalytic', NOW(), NOW()),

-- Game Development Coupons
('cm5cpn26unity100000000', 'GAMEDEV26', 'PERCENTAGE', 86.00, 14.99, '2026-02-28 23:59:59', true, 'Game Creator Sale', NOW(), 'cm5crs25unitycomplete0', NOW(), NOW()),
('cm5cpn27unreal1000000', 'UNREAL5', 'PERCENTAGE', 79.00, 19.99, '2026-02-25 23:59:59', true, 'Epic Promo', NOW(), 'cm5crs26unrealengine00', NOW(), NOW());

-- ============================================
-- ROADMAPS
-- ============================================

INSERT INTO "Roadmap" (id, title, slug, description, "iconName", "estimatedHours", "courseCount", "isActive", "isFeatured", "sortOrder", "createdAt", "updatedAt") VALUES

('cm5rdm01fullstack0000', 'Full-Stack Web Developer', 'full-stack-web-developer',
'Become a complete full-stack developer. This roadmap takes you from frontend fundamentals through backend development to deployment and DevOps. You''ll master React, Node.js, databases, and modern deployment strategies.',
'Code', 180, 6, true, true, 1, NOW(), NOW()),

('cm5rdm02frontend00000', 'Frontend Developer', 'frontend-developer',
'Master modern frontend development with React, TypeScript, and Next.js. Learn to build beautiful, performant, and accessible web applications.',
'Layout', 120, 4, true, true, 2, NOW(), NOW()),

('cm5rdm03backend000000', 'Backend Developer', 'backend-developer',
'Build robust backend systems and APIs. Master Node.js, databases, authentication, and cloud deployment.',
'Server', 140, 5, true, false, 3, NOW(), NOW()),

('cm5rdm04mobile0000000', 'Mobile App Developer', 'mobile-app-developer',
'Create stunning mobile applications for iOS and Android. Learn cross-platform development with Flutter and React Native.',
'Smartphone', 130, 4, true, true, 4, NOW(), NOW()),

('cm5rdm05datascience00', 'Data Scientist', 'data-scientist',
'Transform data into insights. Learn Python, SQL, machine learning, and deep learning to become a data scientist.',
'BarChart3', 160, 4, true, true, 5, NOW(), NOW()),

('cm5rdm06cloud00000000', 'Cloud Engineer', 'cloud-engineer',
'Master cloud infrastructure with AWS, Kubernetes, and Infrastructure as Code. Deploy and manage scalable systems.',
'Cloud', 120, 4, true, false, 6, NOW(), NOW()),

('cm5rdm07devops0000000', 'DevOps Engineer', 'devops-engineer',
'Bridge development and operations. Learn Docker, Kubernetes, CI/CD, and infrastructure automation.',
'GitBranch', 110, 4, true, false, 7, NOW(), NOW()),

('cm5rdm08cybersec00000', 'Cybersecurity Specialist', 'cybersecurity-specialist',
'Protect systems and data from cyber threats. Learn ethical hacking, security fundamentals, and best practices.',
'Shield', 100, 3, true, false, 8, NOW(), NOW()),

('cm5rdm09ai00000000000', 'AI/ML Engineer', 'ai-ml-engineer',
'Build intelligent systems with machine learning and AI. From fundamentals to production-ready LLM applications.',
'Brain', 140, 4, true, true, 9, NOW(), NOW()),

('cm5rdm10gamedev000000', 'Game Developer', 'game-developer',
'Create immersive games with Unity and Unreal Engine. Learn 3D game development and publish your games.',
'Gamepad2', 130, 3, true, false, 10, NOW(), NOW());

-- ============================================
-- ROADMAP STEPS
-- ============================================

INSERT INTO "RoadmapStep" (id, title, description, "orderIndex", "roadmapId", "courseId", "createdAt", "updatedAt") VALUES

-- Full-Stack Web Developer Roadmap
('cm5step01fs100000000', 'Master React Fundamentals', 'Start with the most popular frontend library. Learn components, hooks, state management, and build real projects.', 0, 'cm5rdm01fullstack0000', 'cm5crs01reactcomplete0', NOW(), NOW()),
('cm5step02fs200000000', 'Level Up with TypeScript', 'Add type safety to your JavaScript. Essential for large-scale applications and better developer experience.', 1, 'cm5rdm01fullstack0000', 'cm5crs04typescriptpro0', NOW(), NOW()),
('cm5step03fs300000000', 'Build Modern Apps with Next.js', 'Learn full-stack React with Server Components, Server Actions, and production-ready patterns.', 2, 'cm5rdm01fullstack0000', 'cm5crs02nextjsmastery0', NOW(), NOW()),
('cm5step04fs400000000', 'Backend Development with Node.js', 'Master server-side JavaScript. Build REST APIs, work with databases, and handle authentication.', 3, 'cm5rdm01fullstack0000', 'cm5crs03nodebootcamp00', NOW(), NOW()),
('cm5step05fs500000000', 'Containerize with Docker', 'Learn containerization to deploy your applications consistently across any environment.', 4, 'cm5rdm01fullstack0000', 'cm5crs14dockercomplete', NOW(), NOW()),
('cm5step06fs600000000', 'Deploy to AWS Cloud', 'Complete your stack by learning cloud deployment with the industry-leading cloud provider.', 5, 'cm5rdm01fullstack0000', 'cm5crs11awssaa00000000', NOW(), NOW()),

-- Frontend Developer Roadmap
('cm5step07fe100000000', 'React: The Foundation', 'The most in-demand frontend skill. Master React and build interactive user interfaces.', 0, 'cm5rdm02frontend00000', 'cm5crs01reactcomplete0', NOW(), NOW()),
('cm5step08fe200000000', 'TypeScript for Production', 'Professional frontend development requires TypeScript. Learn to write type-safe code.', 1, 'cm5rdm02frontend00000', 'cm5crs04typescriptpro0', NOW(), NOW()),
('cm5step09fe300000000', 'Next.js for Full-Stack React', 'The React framework for production. Learn SSR, SSG, and modern web development.', 2, 'cm5rdm02frontend00000', 'cm5crs02nextjsmastery0', NOW(), NOW()),
('cm5step10fe400000000', 'Design Skills with Figma', 'Collaborate effectively with designers. Understand UI/UX and implement designs pixel-perfect.', 3, 'cm5rdm02frontend00000', 'cm5crs19figmacomplete0', NOW(), NOW()),

-- Backend Developer Roadmap
('cm5step11be100000000', 'Node.js Backend Mastery', 'Build robust APIs and backend services with Node.js, Express, and modern patterns.', 0, 'cm5rdm03backend000000', 'cm5crs03nodebootcamp00', NOW(), NOW()),
('cm5step12be200000000', 'Database & SQL Skills', 'Master data modeling and SQL for efficient data management and analytics.', 1, 'cm5rdm03backend000000', 'cm5crs10sqlanalytics00', NOW(), NOW()),
('cm5step13be300000000', 'Docker for Backend Developers', 'Containerize your applications for consistent development and deployment.', 2, 'cm5rdm03backend000000', 'cm5crs14dockercomplete', NOW(), NOW()),
('cm5step14be400000000', 'AWS Cloud Services', 'Deploy and scale your backend on the cloud with AWS services.', 3, 'cm5rdm03backend000000', 'cm5crs11awssaa00000000', NOW(), NOW()),
('cm5step15be500000000', 'Kubernetes Orchestration', 'Manage containerized applications at scale with Kubernetes.', 4, 'cm5rdm03backend000000', 'cm5crs13kubernetes0000', NOW(), NOW()),

-- Mobile App Developer Roadmap
('cm5step16mob10000000', 'Flutter for Cross-Platform Apps', 'Build beautiful iOS and Android apps from a single codebase with Flutter.', 0, 'cm5rdm04mobile0000000', 'cm5crs05fluttercomplete', NOW(), NOW()),
('cm5step17mob20000000', 'React Native Development', 'Use your React skills to build mobile apps with React Native.', 1, 'cm5rdm04mobile0000000', 'cm5crs06reactnative000', NOW(), NOW()),
('cm5step18mob30000000', 'Native iOS with Swift', 'Deep dive into native iOS development for the best performance and user experience.', 2, 'cm5rdm04mobile0000000', 'cm5crs07iosswift000000', NOW(), NOW()),
('cm5step19mob40000000', 'UI/UX for Mobile', 'Design mobile-first experiences that users love.', 3, 'cm5rdm04mobile0000000', 'cm5crs19figmacomplete0', NOW(), NOW()),

-- Data Scientist Roadmap
('cm5step20ds100000000', 'Python for Data Science', 'The essential toolkit: Python, NumPy, Pandas, and visualization libraries.', 0, 'cm5rdm05datascience00', 'cm5crs08pythonds00000', NOW(), NOW()),
('cm5step21ds200000000', 'SQL for Data Analysis', 'Query and analyze data efficiently with advanced SQL techniques.', 1, 'cm5rdm05datascience00', 'cm5crs10sqlanalytics00', NOW(), NOW()),
('cm5step22ds300000000', 'Machine Learning Fundamentals', 'Learn the theory and practice of machine learning with Stanford''s renowned course.', 2, 'cm5rdm05datascience00', 'cm5crs09mlstanford0000', NOW(), NOW()),
('cm5step23ds400000000', 'Deep Learning & Neural Networks', 'Advance to neural networks, CNNs, RNNs, and modern deep learning.', 3, 'cm5rdm05datascience00', 'cm5crs22deeplearning00', NOW(), NOW()),

-- Cloud Engineer Roadmap
('cm5step24cld10000000', 'AWS Solutions Architect', 'Master AWS, the leading cloud platform. Prepare for certification.', 0, 'cm5rdm06cloud00000000', 'cm5crs11awssaa00000000', NOW(), NOW()),
('cm5step25cld20000000', 'Azure Fundamentals', 'Expand your cloud skills to Microsoft Azure.', 1, 'cm5rdm06cloud00000000', 'cm5crs12azurefund00000', NOW(), NOW()),
('cm5step26cld30000000', 'Docker Containerization', 'Build and deploy containerized applications.', 2, 'cm5rdm06cloud00000000', 'cm5crs14dockercomplete', NOW(), NOW()),
('cm5step27cld40000000', 'Kubernetes at Scale', 'Orchestrate containers in production with Kubernetes.', 3, 'cm5rdm06cloud00000000', 'cm5crs13kubernetes0000', NOW(), NOW()),

-- DevOps Engineer Roadmap
('cm5step28do100000000', 'Docker Deep Dive', 'Master containerization, the foundation of modern DevOps.', 0, 'cm5rdm07devops0000000', 'cm5crs14dockercomplete', NOW(), NOW()),
('cm5step29do200000000', 'Kubernetes Production', 'Deploy and manage containerized applications at scale.', 1, 'cm5rdm07devops0000000', 'cm5crs13kubernetes0000', NOW(), NOW()),
('cm5step30do300000000', 'Infrastructure as Code with Terraform', 'Automate infrastructure provisioning across any cloud.', 2, 'cm5rdm07devops0000000', 'cm5crs15terraform00000', NOW(), NOW()),
('cm5step31do400000000', 'CI/CD with GitHub Actions', 'Build automated pipelines for testing and deployment.', 3, 'cm5rdm07devops0000000', 'cm5crs16githubactions0', NOW(), NOW()),

-- Cybersecurity Specialist Roadmap
('cm5step32sec10000000', 'Security+ Certification Prep', 'Build a strong security foundation with CompTIA Security+.', 0, 'cm5rdm08cybersec00000', 'cm5crs18securityplus00', NOW(), NOW()),
('cm5step33sec20000000', 'Ethical Hacking & Penetration Testing', 'Learn offensive security to understand how attackers think.', 1, 'cm5rdm08cybersec00000', 'cm5crs17ethicalhacking0', NOW(), NOW()),
('cm5step34sec30000000', 'Cloud Security with AWS', 'Secure cloud infrastructure and applications.', 2, 'cm5rdm08cybersec00000', 'cm5crs11awssaa00000000', NOW(), NOW()),

-- AI/ML Engineer Roadmap
('cm5step35ai100000000', 'Python for Data Science & ML', 'The essential Python skills for AI and machine learning.', 0, 'cm5rdm09ai00000000000', 'cm5crs08pythonds00000', NOW(), NOW()),
('cm5step36ai200000000', 'Machine Learning Theory', 'Solid ML foundations from Stanford''s legendary course.', 1, 'cm5rdm09ai00000000000', 'cm5crs09mlstanford0000', NOW(), NOW()),
('cm5step37ai300000000', 'Deep Learning & Neural Networks', 'Master neural networks, CNNs, RNNs, and transformers.', 2, 'cm5rdm09ai00000000000', 'cm5crs22deeplearning00', NOW(), NOW()),
('cm5step38ai400000000', 'LLM Applications with LangChain', 'Build production AI applications with GPT and LangChain.', 3, 'cm5rdm09ai00000000000', 'cm5crs21chatgptlangchn', NOW(), NOW()),

-- Game Developer Roadmap
('cm5step39gd100000000', 'Unity 3D Game Development', 'The most popular game engine. Build 5 complete games.', 0, 'cm5rdm10gamedev000000', 'cm5crs25unitycomplete0', NOW(), NOW()),
('cm5step40gd200000000', 'Unreal Engine 5 Mastery', 'AAA game development with Unreal''s cutting-edge features.', 1, 'cm5rdm10gamedev000000', 'cm5crs26unrealengine00', NOW(), NOW()),
('cm5step41gd300000000', 'Game Design Fundamentals', 'Design engaging games with proper UX principles.', 2, 'cm5rdm10gamedev000000', 'cm5crs19figmacomplete0', NOW(), NOW());

-- ============================================
-- CLICK EVENTS (Analytics Data)
-- ============================================

INSERT INTO "ClickEvent" (id, source, "userAgent", referer, "ipHash", country, "courseId", "createdAt") VALUES

-- Recent clicks on popular courses
('cm5clk01000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', 'abc12345678901234567890', 'US', 'cm5crs01reactcomplete0', NOW() - INTERVAL '1 hour'),
('cm5clk02000000000000', 'WEB', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', 'https://google.com', 'def45678901234567890ab', 'GB', 'cm5crs01reactcomplete0', NOW() - INTERVAL '2 hours'),
('cm5clk03000000000000', 'TELEGRAM', NULL, NULL, 'ghi78901234567890abcd', 'ID', 'cm5crs05fluttercomplete', NOW() - INTERVAL '3 hours'),
('cm5clk04000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://reddit.com/r/learnprogramming', 'jkl01234567890abcdef', 'CA', 'cm5crs08pythonds00000', NOW() - INTERVAL '4 hours'),
('cm5clk05000000000000', 'WEB', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'https://twitter.com', 'mno34567890abcdef123', 'AU', 'cm5crs02nextjsmastery0', NOW() - INTERVAL '5 hours'),
('cm5clk06000000000000', 'TELEGRAM', NULL, NULL, 'pqr67890abcdef123456', 'IN', 'cm5crs11awssaa00000000', NOW() - INTERVAL '6 hours'),
('cm5clk07000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/123.0', 'https://bing.com', 'stu90abcdef1234567890', 'DE', 'cm5crs04typescriptpro0', NOW() - INTERVAL '7 hours'),
('cm5clk08000000000000', 'WEB', 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36', 'https://google.com', 'vwx23abcdef4567890123', 'BR', 'cm5crs21chatgptlangchn', NOW() - INTERVAL '8 hours'),
('cm5clk09000000000000', 'WEB', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NULL, 'yza56abcdef7890123456', 'FR', 'cm5crs25unitycomplete0', NOW() - INTERVAL '9 hours'),
('cm5clk10000000000000', 'TELEGRAM', NULL, NULL, 'bcd89abcdef0123456789', 'SG', 'cm5crs13kubernetes0000', NOW() - INTERVAL '10 hours'),

-- More historical clicks
('cm5clk11000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', 'efg12abcdef3456789012', 'US', 'cm5crs09mlstanford0000', NOW() - INTERVAL '1 day'),
('cm5clk12000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', 'hij45abcdef6789012345', 'JP', 'cm5crs01reactcomplete0', NOW() - INTERVAL '1 day'),
('cm5clk13000000000000', 'WEB', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', 'https://duckduckgo.com', 'klm78abcdef9012345678', 'NL', 'cm5crs05fluttercomplete', NOW() - INTERVAL '1 day'),
('cm5clk14000000000000', 'TELEGRAM', NULL, NULL, 'nop01abcdef2345678901', 'ID', 'cm5crs08pythonds00000', NOW() - INTERVAL '2 days'),
('cm5clk15000000000000', 'WEB', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'https://google.com', 'qrs34abcdef5678901234', 'RU', 'cm5crs14dockercomplete', NOW() - INTERVAL '2 days'),
('cm5clk16000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0', 'https://linkedin.com', 'tuv67abcdef8901234567', 'IN', 'cm5crs03nodebootcamp00', NOW() - INTERVAL '2 days'),
('cm5clk17000000000000', 'WEB', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)', 'https://google.com', 'wxy90abcdef1234567890', 'MX', 'cm5crs07iosswift000000', NOW() - INTERVAL '3 days'),
('cm5clk18000000000000', 'TELEGRAM', NULL, NULL, 'zab23abcdef4567890123', 'PH', 'cm5crs17ethicalhacking0', NOW() - INTERVAL '3 days'),
('cm5clk19000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0', 'https://google.com', 'cde56abcdef7890123456', 'KR', 'cm5crs19figmacomplete0', NOW() - INTERVAL '4 days'),
('cm5clk20000000000000', 'WEB', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/537.36', 'https://producthunt.com', 'fgh89abcdef0123456789', 'US', 'cm5crs15terraform00000', NOW() - INTERVAL '4 days'),

-- More diverse clicks
('cm5clk21000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', 'ijk12abcdef3456789012', 'GB', 'cm5crs01reactcomplete0', NOW() - INTERVAL '5 days'),
('cm5clk22000000000000', 'WEB', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'https://google.com', 'lmn45abcdef6789012345', 'AU', 'cm5crs11awssaa00000000', NOW() - INTERVAL '5 days'),
('cm5clk23000000000000', 'TELEGRAM', NULL, NULL, 'opq78abcdef9012345678', 'MY', 'cm5crs21chatgptlangchn', NOW() - INTERVAL '6 days'),
('cm5clk24000000000000', 'WEB', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/122.0', 'https://hackernews.com', 'rst01abcdef2345678901', 'US', 'cm5crs22deeplearning00', NOW() - INTERVAL '6 days'),
('cm5clk25000000000000', 'WEB', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'https://google.com', 'uvw34abcdef5678901234', 'CA', 'cm5crs02nextjsmastery0', NOW() - INTERVAL '7 days');

-- ============================================
-- ADMIN USERS
-- ============================================

INSERT INTO "AdminUser" (id, email, name, role, "isActive", "createdAt", "updatedAt") VALUES
('cm5adm01super00000000', 'admin@searchcourse.com', 'Super Admin', 'super_admin', true, NOW(), NOW()),
('cm5adm02john000000000', 'john.smith@searchcourse.com', 'John Smith', 'admin', true, NOW(), NOW()),
('cm5adm03sarah00000000', 'sarah.chen@searchcourse.com', 'Sarah Chen', 'admin', true, NOW(), NOW()),
('cm5adm04michael000000', 'michael.rodriguez@searchcourse.com', 'Michael Rodriguez', 'admin', true, NOW(), NOW()),
('cm5adm05emma000000000', 'emma.wilson@searchcourse.com', 'Emma Wilson', 'admin', false, NOW(), NOW());

-- ============================================
-- SUMMARY
-- ============================================
-- Platforms: 6
-- Categories: 10
-- Courses: 26
-- Coupons: 27 (some courses have multiple)
-- Roadmaps: 10
-- RoadmapSteps: 41
-- ClickEvents: 25
-- AdminUsers: 5
