> Do not push directly to main. Create a new branch for every single change, even if it is just a small typo fix. Keep the main branch stable and clean.

## Project Structure
This repo follows a organizational pattern. If you are adding a feature, put it where it belongs.

- **app/auth/:** Handles all authentication logic. This includes the signin/ and signup/ flows and their specific components/. Keep auth-only logic contained here.

- **app/guards/:** For route protection, specifically the guest and auth guards. If it controls access, it goes here.

- **app/services/:** Dedicated to data fetching and business logic services used throughout the application.

- **app/interceptors/:** HTTP middleware and request/response manipulation logic.

- **app/dashboard/:** Contains the main dashboard.component.ts and its internal components/.

- **app/landing/:** Contains the landing.components.ts and associated components/.

- **app/shared/:** Only for components that are truly global and reused across multiple modules. Do not treat this as a junk drawer.

And don't use relative paths like `../../` I have added path aliases for every major directory @auth, @dashboard, @guards, @services, and @shared. Check the `tsconfig.json` file for the full list of mappings.
