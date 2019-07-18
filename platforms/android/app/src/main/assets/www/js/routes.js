var routes = [
  // Home
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // Profile
  {
    path: '/profile/',
    componentUrl: './pages/profile.html',
    name: 'profile',
  },
  // Dashboard
  {
    path: '/dashboard/',
    componentUrl: './pages/dashboard.html',
    name: 'dashboard',
  },
  // Guest Dashboard
  {
    path: '/guest-dashboard/',
    componentUrl: './pages/guest-dashboard.html',
    name: 'guest-dashboard',
  },
  // About
  {
    path: '/about/',
    componentUrl: './pages/about.html',
    name: 'about',
  },
  // Campaign
  {
    path: '/campaign/',
    componentUrl: './pages/campaign.html',
    name: 'campaign',
  },
  // Register
  {
    path: '/register/:WSType/:Country/:MobileNo/',
    componentUrl: './pages/register.html',
    name: 'register',
  },
  // OTP
  {
    path: '/otp/',
    componentUrl: './pages/otp.html',
    name: 'otp',
  },
  // Query-Prelogin
  {
    path: '/query-prelogin/',
    componentUrl: './pages/query-prelogin.html',
    name: 'query-prelogin',
  },
   // Query-Prelogin Submit
   {
    path: '/query-prelogin-submit/',
    componentUrl: './pages/query-prelogin-submit.html',
    name: 'query-prelogin-submit',
  },
  // Business Type
  {
    path: '/business-type/:Country/:MobileNo/',
    componentUrl: './pages/business-type.html',
    name: 'business-type',
  },
  // Default route (404 page)
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
