# AnimeStream - Beginner's Streaming Site Project

A professional anime streaming site built with Next.js, TypeScript, and Tailwind CSS. Perfect for learning web development!

## 🚀 Features

- **Browse Trending Anime** - See what's popular right now
- **Search Functionality** - Find any anime by title
- **Stream Episodes** - Watch anime episodes directly in your browser
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Netflix-style dark theme with smooth animations

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **A code editor** - We recommend [VS Code](https://code.visualstudio.com/)
- **A terminal** - Command Prompt (Windows), Terminal (Mac/Linux), or VS Code's integrated terminal

## 🛠️ Installation Steps

### Step 1: Open Your Terminal
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "terminal", press Enter
- **VS Code**: Press `` Ctrl + ` `` (backtick)

### Step 2: Navigate to the Project Folder

```bash
cd path/to/anime-streaming-site
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all the necessary packages (React, Next.js, Tailwind, etc.)

### Step 4: Run the Development Server

```bash
npm run dev
```

### Step 5: Open in Your Browser

Open your browser and go to: `http://localhost:3000`

🎉 **You should see your anime streaming site!**

## 📁 Project Structure

```
anime-streaming-site/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Homepage (trending anime grid)
│   ├── watch/           # Watch page (video player)
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   └── AnimeCard.tsx    # Individual anime card component
├── lib/                 # API services
│   ├── anilist.ts       # Fetch anime metadata (AniList API)
│   └── consumet.ts      # Fetch streaming links (Consumet API)
├── package.json         # Dependencies and scripts
└── README.md           # This file!
```

## 🎨 How It Works

### 1. Homepage Flow
```
User visits site → Fetch trending anime from AniList → Display anime cards
```

### 2. Search Flow
```
User types search → Click "Search" → Fetch results from AniList → Display results
```

### 3. Watch Flow
```
User clicks anime card → Navigate to watch page → 
Search anime on Gogoanime (via Consumet) → 
Get episode list → Get streaming link → Play video
```

## 🔧 Customization Ideas

Once you're comfortable, try these improvements:

### Easy Customizations
- Change the color scheme (edit Tailwind classes)
- Add more anime per page (change `perPage` in `anilist.ts`)
- Modify the card design (edit `AnimeCard.tsx`)

### Intermediate Features
- Add episode selection (currently only plays Episode 1)
- Add favorite/bookmark functionality
- Add genre filters
- Add "Continue Watching" section

### Advanced Features
- User authentication (login/signup)
- Comments and ratings
- Watch history tracking
- Episode tracking progress

## 🌐 Deployment (Making It Live)

### Option 1: Vercel (Recommended - Free!)

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository and upload your code
3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Click "Deploy"
7. Your site will be live at `your-project.vercel.app`!

### Option 2: Netlify

1. Upload code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Click "Deploy"

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Run `npm install` again

### Issue: Port 3000 is already in use
**Solution**: 
- Kill the process on port 3000, or
- Run `npm run dev -- -p 3001` to use port 3001

### Issue: No streaming link found
**Solution**: 
- The anime might not be available on Gogoanime
- Try a different, more popular anime
- Check if the Consumet API is working

### Issue: Video won't play
**Solution**:
- This is a limitation of the basic HTML5 video player
- For production, you'd use a library like Vidstack or Video.js
- Some browsers don't support M3U8 streams natively

## 📚 Learning Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **React**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

## ⚖️ Legal Notice

This project is for **educational purposes only**. The streaming sources and APIs used may not have legal rights to distribute content. If you deploy this publicly, ensure you have the proper licenses and permissions.

## 🤝 Contributing

Want to improve this project? Feel free to:
- Fix bugs
- Add new features
- Improve documentation
- Share your deployed version!

## 📝 Next Steps

1. ✅ Get the site running locally
2. ✅ Understand how each part works
3. 🎨 Customize the design
4. 🚀 Add your own features
5. 🌐 Deploy it live
6. 📱 Share with friends!

---

**Happy coding! 🎉**

If you found this helpful, consider starring the repository and sharing it with other beginners!
