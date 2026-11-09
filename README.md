# Jaz Singh Personal Trainer Website
Personal Trainer Website of Jaz Singh, Ilford, UK. The website code is maintained by [ATM Enterprise](https://github.com/atmenterprise).

## Tech Stack
- **Public website:** React 19 + React Router (preserved Vite SPA)
- **Admin/auth/API:** Next.js App Router + Auth0 Next.js SDK
- **Build:** Vite public bundle + Next.js server
- **Language:** JavaScript/JSX, TypeScript for Next.js, CSS3
- **Styling:** Bootstrap + Custom Theme CSS

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the public Vite bundle into `public/site`, then builds the Next.js admin/server into `.next`.

### `npm run preview`
Starts the production Next.js server after a build.

### `npm run dev:site`
Runs Vite with hot reloading for public-page edits. Test the Next.js admin at port 3000.

### `npm run build:static`
Builds only the original public website into `dist` for GitHub Pages.

## Credits

### Theme Credit
Based on the Creative Bootstrap Theme originally created by [Start Bootstrap](http://startbootstrap.com).

### Image & Icon Credits
- All images are used under free license terms from [Unsplash](https://unsplash.com).
- GIF icons are used under free license terms from [Flaticon](https://www.flaticon.com/free-animated-icons/gym).

## ATM Content Studio

Visit `/admin` to sign up or sign in to ATM Content Studio, developed by ATM Enterprise. Manage content for multiple project domains with a project switcher and isolated records. Approved users need Auth0 `manage:content` plus membership in each project.

See the [studio setup and migration guide](docs/admin.md) for Auth0, Neon, assigning the initial project owner and upgrading an existing database. Public pages remain independent of studio records in this phase.
