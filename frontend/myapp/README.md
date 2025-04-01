# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

🌟 Introduction
The Baby Growth Tracking System provides an intuitive interface for expectant mothers to monitor pregnancy progression and baby development. This application offers comprehensive tools for tracking growth milestones, managing healthcare appointments, and accessing expert advice throughout the pregnancy journey.

✨ Features
🤰 Pregnancy Tracking
Pregnancy Profile: Create and update personal pregnancy information
Due Date Tracking: Monitor important dates and milestones

👶 Baby Development
Growth Charts: Visualize baby's progress
Weight and Height Tracking: Monitor growth patterns

🏥 Healthcare Management
Appointment Scheduler: Book and manage doctor visits
Health Records: Access and store medical information

💬 Community Support
Pregnancy Forums: Connect with other mothers
Health Tips: Access expert advice

💎 Membership System
Premium Membership: Access to exclusive content and features
Subscription Management: Upgrade and manage your membership plans

💳 VNPay Payment Integration
Secure Payments: Process membership payments through VNPay sandbox
Transaction Verification: Confirm successful payment transactions

👤 User Management
Customer Profile: Manage personal information
Authentication: Secure login and registration system
Contact Form: Easily get in touch with support team

📞 Contact
For support or inquiries, please contact:
Email: support@babygrowthtracker.com
Phone: +84 123 456 789

🚀 Getting Started
Prerequisites
Node.js (v14.0.0 or later)
npm (v6.0.0 or later)

frontend/myapp/
│
├── public/                   # Static files
│   ├── favicon.ico           # Site favicon
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # Web app manifest
│   ├── robots.txt            # Robots file
│   └── assets/               # Static assets
│       └── images/           # Image resources
│
├── src/                      # Source code
│   ├── components/           # Reusable components
│   │   ├── Customer/         # Customer-specific components
│   │   │   ├── BookAppointment/
│   │   │   │   ├── BookAppointment.jsx    # Schedule appointments
│   │   │   │   ├── BookAppointment.css    # Appointment booking styles
│   │   │   │   ├── viewAppointment.jsx    # View existing appointments
│   │   │   │   └── viewAppointment.css    # Appointment viewing styles
│   │   │   │
│   │   │   ├── Contact/
│   │   │   │   ├── Contact.jsx            # Contact form
│   │   │   │   └── Contact.css            # Contact form styles
│   │   │   │
│   │   │   ├── CustomerProfile/
│   │   │   │   ├── CustomerProfile.jsx    # User profile management
│   │   │   │   ├── CustomerProfile.css    # Profile styles
│   │   │   │   ├── handleUploadFile.jsx   # Profile image upload
│   │   │   │   └── ProfileDetails.jsx     # User details display
│   │   │   │
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx              # User login
│   │   │   │   ├── Login.css              # Login styles
│   │   │   │   ├── Register.jsx           # User registration
│   │   │   │   ├── Register.css           # Registration styles
│   │   │   │   ├── ForgotPassword.jsx     # Password recovery
│   │   │   │   └── ResetPassword.jsx      # Password reset
│   │   │   │
│   │   │   ├── Payment/
│   │   │   │   ├── VNPayCheckout.jsx      # VNPay payment gateway
│   │   │   │   ├── PaymentCallback.jsx    # Payment verification
│   │   │   │   └── PaymentHistory.jsx     # Transaction records
│   │   │   │
│   │   │   └── PregnancyProfile/
│   │   │       ├── PregnancyProfile.jsx   # Pregnancy information
│   │   │       ├── PregnancyTracker.jsx   # Weekly development tracking
│   │   │       ├── MilestoneTracker.jsx   # Developmental milestones
│   │   │       └── PregnancyProfile.css   # Pregnancy profile styles
│   │   │
│   │   ├── Common/           # Common UI components
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   │   └── Navbar.css           # Navigation styles
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx           # Footer component
│   │   │   │   └── Footer.css           # Footer styles
│   │   │   │
│   │   │   ├── LoadingSpinner.jsx       # Loading animation
│   │   │   ├── Button.jsx               # Reusable button component
│   │   │   ├── Modal.jsx                # Modal dialog component
│   │   │   └── ErrorBoundary.jsx        # Error handling component
│   │   │
│   │   └── Doctor/          # Doctor-specific components
│   │       ├── DoctorProfile.jsx        # Doctor profile display
│   │       ├── AppointmentManagement.jsx # Doctor appointment view
│   │       └── PrescriptionForm.jsx     # Create prescriptions
│   │
│   ├── Pages/                # Page components
│   │   ├── Home/
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Home.css      # Landing page styles
│   │   │   ├── Features.jsx  # Features section
│   │   │   └── Testimonials.jsx # User testimonials
│   │   │
│   │   ├── Manager/
│   │   │   ├── ManagerDashboard.jsx     # Admin dashboard
│   │   │   ├── ManagerBlogs.jsx         # Blog management
│   │   │   ├── ManagerBlogs.css         # Blog styles
│   │   │   ├── ManagerSchedule.jsx      # Schedule management
│   │   │   ├── ManagerSchedule.css      # Schedule styles
│   │   │   ├── UserManagement.jsx       # User account management
│   │   │   └── Statistics.jsx           # System statistics
│   │   │
│   │   ├── Customer/
│   │   │   ├── CustomerDashboard.jsx    # User dashboard
│   │   │   ├── AppointmentPage.jsx      # Appointment management
│   │   │   ├── MembershipPage.jsx       # Membership options
│   │   │   └── ResourceCenter.jsx       # Educational resources
│   │   │
│   │   └── Error/
│   │       ├── NotFound.jsx             # 404 page
│   │       └── ServerError.jsx          # 500 page
│   │
│   ├── services/             # API services
│   │   ├── authService.js    # Authentication service
│   │   ├── appointmentService.js # Appointment service
│   │   ├── profileService.js # Profile management
│   │   ├── paymentService.js # Payment processing
│   │   ├── pregnancyService.js # Pregnancy data
│   │   └── api.js            # Base API configuration
│   │
│   ├── utils/                # Utility functions
│   │   ├── dateUtils.js      # Date formatting utilities
│   │   ├── validation.js     # Form validation helpers
│   │   ├── formatter.js      # Text and number formatters
│   │   └── localStorage.js   # Browser storage helpers
│   │
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.js    # Authentication context
│   │   └── ThemeContext.js   # Theme management
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useForm.js        # Form handling hook
│   │   └── useApi.js         # API request hook
│   │
│   ├── App.js                # Main app component
│   ├── App.css               # Main app styles
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles
│   └── routes.js             # Application routes
│
├── .env                      # Environment variables
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── package.json              # Project dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Documentation