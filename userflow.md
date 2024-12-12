Landing Experience:
Customer arrives at homepage (/)
Can browse About page (/about)
Clicks login/signup button in navbar
is directed to /login page

After Authentication:

Existing Customer:
Redirects to /dashboard
Can see their previous assessments
Can start new assessments
Can log out 

New Customer:
Redirects to /onboarding
Needs to complete onboarding before starting assessments

After onboarding:
Redirects to /assessment
Can start new assessments

After completing assessment:
is directed to report page
Can print pdf report and close the report page

After closing report:
Redirects to /dashboard
Can see their previous reports
Can start new assessments
Can log out


Pages Required vs Current Status:
✅ Landing Page (app/page.tsx)
✅ About Page (app/about/page.tsx)
✅ Login/Auth Pages (auth components)
✅ Dashboard Page (app/dashboard/page.tsx)
✅ Onboarding Page (app/onboarding/page.tsx)
✅ Assessment Pages:
List: app/assessment/page.tsx
Individual: app/assessment/[id]/page.tsx

❌ Report Page - Missing
Should be either:
/report/[id]/page.tsx or
/assessment/[id]/report/page.tsx