# MERN Blog Application

A full-stack blog application built with MongoDB, Express, React, and Node.js (MERN stack). Features a modern UI with Tailwind CSS and Radix UI components.

## Features

### Core Functionality
- ✅ **CRUD Operations** - Create, read, update, and delete blog posts
- ✅ **Search** - Search blogs by title or content with real-time results
- ✅ **Pagination** - Navigate through blog posts (10 per page)
- ✅ **Comments** - Add and view comments on blog posts

### User Experience
- ✅ **Form Validation** - Client-side validation with helpful error messages
- ✅ **Loading States** - Visual feedback with spinners during data fetching
- ✅ **Error Handling** - User-friendly error messages and confirmations
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## Project Structure

```
MERN blog/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/        # Reusable UI components
│   │   │       ├── BlogCard.jsx
│   │   │       ├── NewBlogDialog.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── input.jsx
│   │   │       └── textarea.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── lib/
│   │   │   └── api.js     # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── Server/                 # Backend Node.js application
    ├── src/
    │   ├── config/
    │   │   └── db.js      # Database configuration
    │   ├── controllers/
    │   │   ├── postController.js
    │   │   └── categoryController.js
    │   ├── middleware/
    │   │   └── errorHandler.js
    │   ├── models/
    │   │   ├── Blog.js
    │   │   └── category.js
    │   ├── routes/
    │   │   └── blog.js
    │   └── server.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### Backend Setup

1. Navigate to the Server directory:
```bash
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-stack-db
ALLOWED_ORIGINS=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Client directory:
```env
VITE_API_URL=http://localhost:5000
VITE_FAKE_USER_ID=demo-abc123
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all blogs (with pagination)
  - Query params: `userId`, `page`, `limit`
- `GET /api/blogs/:id` - Get a single blog by ID
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog
- `GET /api/blogs/search?q=query` - Search blogs

### Comments
- `POST /api/blogs/:id/comments` - Add a comment to a blog

## Usage

### Creating a Blog Post
1. Click the "New Blog Post" button
2. Enter a title (required, max 100 characters)
3. Add content (optional, max 5000 characters)
4. Click "Create"

### Editing a Blog Post
1. Click the "Edit" button on any blog card
2. Modify the title or content
3. Click "Save" to update or "Cancel" to discard changes

### Deleting a Blog Post
1. Click the "Delete" button on any blog card
2. Confirm the deletion in the popup dialog

### Searching for Blogs
1. Type your search query in the search bar
2. Click "Search" or press Enter
3. Click "Clear" to return to all blogs

### Adding Comments
1. Click "Show Comments" on any blog card
2. Type your comment in the input field
3. Click "Comment" to post

### Navigating Pages
- Use the "Previous" and "Next" buttons at the bottom
- Current page and total pages are displayed in the center

## Database Schema

### Blog Post
```javascript
{
  userId: String (required),
  title: String (required, max 100 chars),
  content: String,
  featuredImage: String (default: 'default-post.jpg'),
  slug: String,
  excerpt: String (max 200 chars),
  author: ObjectId (ref: 'User'),
  category: ObjectId (ref: 'Category'),
  tags: [String],
  isPublished: Boolean (default: false),
  viewCount: Number (default: 0),
  comments: [{
    user: ObjectId (ref: 'User'),
    content: String (required),
    createdAt: Date
  }],
  timestamps: true (createdAt, updatedAt)
}
```

## Features to Add (Future Enhancements)

- [ ] User authentication with JWT
- [ ] Image upload for featured images
- [ ] Rich text editor for blog content
- [ ] Categories and tags management
- [ ] Like/favorite functionality
- [ ] User profiles
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Draft and publish workflow
- [ ] SEO optimization with meta tags

## Development

### Running in Development Mode

**Backend:**
```bash
cd Server
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```bash
cd Client
npm run dev  # Vite dev server with HMR
```

### Building for Production

**Frontend:**
```bash
cd Client
npm run build  # Creates optimized production build in dist/
```

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 5000
- Check that frontend URL is in ALLOWED_ORIGINS in backend .env
- Restart both servers after changing CORS settings

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or check services
- Check connection string in Server/.env
- Ensure database name is correct

### Port Already in Use
- Kill existing Node processes: `taskkill /F /IM node.exe` (Windows)
- Or change PORT in .env files

### Module Not Found Errors
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created as a MERN stack learning project - Week 4

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for blazing fast development experience
