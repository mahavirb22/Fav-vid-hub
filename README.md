# FavVid Hub

A modern, full-stack video sharing platform where users can discover, add, and watch their favorite YouTube videos organized by categories.

## 🚀 Features

- **Dynamic Categories**: Create and manage video categories dynamically
- **YouTube Integration**: Automatically fetch video titles and thumbnails from YouTube
- **Responsive Design**: Beautiful, mobile-friendly interface with animations
- **Real-time Search**: Filter videos by category
- **Video Management**: Add new videos with category selection or creation
- **Related Videos**: Discover similar content based on categories

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Node-fetch** - HTTP requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/favvid-hub.git
   cd favvid-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/favvidhub
   # Or your MongoDB Atlas connection string
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App will run on http://localhost:5173

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend in Production**
   ```bash
   cd backend
   npm start
   ```

## 📡 API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/random` - Get random videos (with optional category filter)
- `GET /api/videos/related` - Get related videos by category
- `GET /api/videos/:youtubeId` - Get single video by YouTube ID
- `POST /api/videos` - Add new video

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add new category
- `DELETE /api/categories/:id` - Delete category

## 🎨 Usage

1. **Home Page**: Browse random videos or filter by category
2. **Add Video**: Paste a YouTube URL and select or create a category
3. **Watch Page**: View video details and related content
4. **Categories**: Manage video categories dynamically

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the frontend project

2. **Environment Variables**
   - In Vercel dashboard, add environment variable:
     ```
     VITE_API_BASE=https://your-backend-url.com
     ```

3. **Deploy**
   - Vercel will build and deploy automatically
   - Your frontend will be live!

### Backend Deployment (Railway/Render/Heroku)

1. **Choose a Platform**
   - Railway, Render, or Heroku for Node.js apps

2. **Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```

3. **Deploy**
   - Connect your GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`

### Full-Stack Deployment

- Deploy backend first to get the API URL
- Deploy frontend with the backend URL as `VITE_API_BASE`
- Update CORS in backend if needed for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube for video content
- React and Vite communities
- Open source contributors

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.