# StayInn — Full-Stack Property Rental Platform

StayInn is a full-stack property rental marketplace where users can list, browse, search, and review properties. It features secure authentication, role-based authorization, cloud-based image uploads, and location geocoding — built end-to-end with the Node.js/Express/MongoDB stack.

**[Live Demo](https://styinn.onrender.com)**

---

## Features

### Listings
- Create, view, edit, and delete property listings
- Upload and manage listing images via **Cloudinary**
- Automatic location geocoding using the **MapTiler API** (converts address to map coordinates)
- Search listings by title, description, location, country, price, or owner username
- Owner-only edit/delete access enforced via custom authorization middleware

### Reviews
- Add and delete reviews with star ratings and comments
- Review deletion restricted to the review's original author
- Reviews are linked to listings and automatically cleaned up on deletion

### Authentication & Authorization
- Secure user signup/login/logout using **Passport.js** (Local Strategy)
- Session-based authentication with sessions persisted in **MongoDB** (via `connect-mongo`)
- Password hashing and salting handled via `passport-local-mongoose`
- Redirect-after-login support (returns users to the page they intended to visit)
- Flash messages for success/error feedback across the app

### Validation & Error Handling
- Server-side request validation using **Joi** schemas for listings and reviews
- Centralized custom error handler (`ExpressError`) with dedicated error page
- Async route wrapper (`wrapAsync`) to avoid repetitive try/catch blocks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Templating | EJS, EJS-Mate |
| Authentication | Passport.js, passport-local-mongoose |
| Session Store | express-session, connect-mongo |
| File Uploads | Multer, Cloudinary |
| Geocoding | MapTiler Client API |
| Validation | Joi |
| Flash Messages | connect-flash |

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YernintiRevathi/styinn-rental.git
   cd styinn-rental
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following:
   ```env
   MONGOATLAS=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAP_TOKEN=your_maptiler_api_key
   ```

4. **Run the application**
   ```bash
   node app.js
   ```

   The app will be available at `http://localhost:8080`

---

## Key Implementation Highlights

- **Custom middleware chain** for authentication (`isLoggedIn`), listing ownership (`isOwnerOfListing`), and review authorship (`isAuthorOfReview`) — restricting write access at the route level before any controller logic runs
- **Automatic Cloudinary cleanup** — old images are deleted from Cloudinary when a listing's image is updated or the listing itself is deleted, preventing orphaned files
- **Flexible search** — numeric queries match against price using regex, while text queries search across listing fields and matching usernames simultaneously
- **Session persistence** — sessions are stored in MongoDB rather than memory, allowing sessions to survive server restarts

---

## Future Improvements

- Add booking and payment functionality
- Implement pagination for listings
- Migrate to a component-based frontend (React) for a more dynamic UI

---

## License

This project is open source and available under the [MIT License](LICENSE).

---
Built with 🤎 by **Revathi Yerninti**
