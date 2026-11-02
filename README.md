# Smart Feedback Collection and Analysis System (TCS iON Project)

Welcome! This is the complete, full-stack, AI-powered **Smart Feedback Collection and Analysis System** designed for your **TCS iON** project. 

The application is built using the **MERN (React + Express + Node + MongoDB) stack** and integrates **Google Gemini AI** for real-time natural language sentiment processing and classification.

---

## 🛠️ Step-by-Step Local Setup Guide (For Absolute Beginners)

This guide takes you from an empty computer to running this full-stack application on your personal system.

### 📌 Phase 1: Installing All Required Software

You need three main software components installed on your computer:
1. **Node.js** (The runtime that executes your JavaScript/TypeScript code)
2. **VS Code** (Your code editor)
3. **MongoDB** (Your local NoSQL database)

---

#### 1️⃣ Step 1: Install Node.js
Node.js allows your computer to run the backend Express server and compile the React frontend.

1. Open your web browser and go to: **[https://nodejs.org/](https://nodejs.org/)**
2. Download the **LTS (Long Term Support)** version for your operating system (Windows or macOS).
3. Double-click the downloaded installer and click **Next** on all prompts (use default options).
4. **How to Verify:**
   - Open your command line (search for **Command Prompt** on Windows, or **Terminal** on Mac).
   - Type the following command and press **Enter**:
     ```bash
     node -v
     ```
   - If it prints a version number (like `v20.x.x` or `v22.x.x`), Node.js is installed successfully!
   - Now type:
     ```bash
     npm -v
     ```
   - If it prints a version number (like `10.x.x`), your Package Manager is ready.

---

#### 2️⃣ Step 2: Install Visual Studio Code (VS Code)
VS Code is the editor where you will load your files and run terminal commands.

1. Visit: **[https://code.visualstudio.com/](https://code.visualstudio.com/)**
2. Download and run the installer for your system.
3. Open VS Code once installation is complete.

---

#### 3️⃣ Step 3: Install MongoDB (Community Edition)
This acts as your persistent database to save and query feedback items.

1. Visit: **[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)**
2. Ensure the version is correct for your OS, and click **Download** (select **MSI** installer for Windows).
3. Run the installer:
   - **CRITICAL CLICK:** During installation, make sure to check the box that says **"Install MongoDB as a Service"**. This ensures your database starts automatically in the background when your computer turns on.
   - Also check the box that says **"Install MongoDB Compass"**. This is a beautiful graphical tool that lets you look inside your database visually!
4. **How to Verify:**
   - Open **MongoDB Compass** (it should be on your Desktop or in your Start Menu).
   - Click the green **Connect** button with the default URI: `mongodb://localhost:27017`.
   - If it connects successfully, your database is running perfectly in the background!

---

### 📌 Phase 2: Exporting and Opening the Project Folder

1. **How to Download this Code:**
   - On the top right of this Google AI Studio browser window, click on the **Settings Gear** icon or **Download/Export** menu.
   - Select **Export as ZIP** or download the project.
2. **Extract the Folder:**
   - Extract the downloaded ZIP file to a convenient folder on your computer (for example, inside your `Documents` or on your `Desktop`). Rename the folder to `tcs-feedback-system`.
3. **Open in VS Code:**
   - Open VS Code.
   - Click on **File** (top left menu) -> **Open Folder...**
   - Choose your extracted `tcs-feedback-system` folder and click **Select Folder**.

---

### 📌 Phase 3: Installing Dependencies Locally

Now we need to download all the coding libraries (like Express, React, Mongoose, and Recharts) into your local folder.

1. In VS Code, open the integrated terminal:
   - Click **Terminal** in the top menu -> **New Terminal** (or press ``Ctrl + ` ``).
2. In the terminal prompt at the bottom of your screen, type this command and press **Enter**:
   ```bash
   npm install
   ```
3. Wait about 30–60 seconds. This command reads your `package.json` file and automatically downloads all the safe, secure libraries into a folder called `node_modules`.

---

### 📌 Phase 4: Setting Up Your Secrets & API Keys (`.env`)

To connect to MongoDB and query the Google Gemini AI, we need a secret credentials file.

1. In the VS Code file explorer (left side), right-click on your project background and select **New File**. Name it exactly:
   ```text
   .env
   ```
2. Open this new `.env` file and paste the following content inside:
   ```env
   # 1. Google Gemini AI Key (Get a free one from https://aistudio.google.com/)
   GEMINI_API_KEY="PASTE_YOUR_AI_STUDIO_KEY_HERE"

   # 2. Local MongoDB connection string
   MONGODB_URI="mongodb://localhost:27017/tcs_feedback_db"

   # 3. Development environment indicator
   NODE_ENV="development"
   ```
3. **How to get your free Gemini Key:**
   - Go to [https://aistudio.google.com/](https://aistudio.google.com/) and log in with your Google account.
   - Click the blue **"Get API Key"** button.
   - Create a key, copy it, and paste it into your `.env` file replacing `PASTE_YOUR_AI_STUDIO_KEY_HERE`.

---

### 📌 Phase 5: Starting the Full-Stack Application!

You are ready! You can run the entire frontend and backend with a single terminal command.

1. In your VS Code Terminal, type:
   ```bash
   npm run dev
   ```
2. The terminal will print:
   - `🌍 Smart Feedback Server active at http://localhost:3000`
   - `🚀 Vite middleware mounted in Development mode.`
   - `✅ Google Gemini API client initialized successfully.`
   - `✅ Successfully connected to MongoDB database.`
3. Open your web browser and go to:
   👉 **`http://localhost:3000`**

You will see your beautiful application!

---

## 💡 How to Test & Preview

1. **Submit Feedback:** Try entering a complaint like *"The login panel crashed with code 500 on Chrome"* with a 1-star rating. Watch Gemini instantly extract the key issues, tag it as "Technical Support", analyze it as Negative, and compose a professional apology email!
2. **Access Dashboard:** Switch to the **Admin Analytics Dashboard** view.
3. **Demo Data:** Click the **"Seed Database with Demo Data"** button to instantly pre-populate your charts with monthly metrics and sample customer histories.
4. **Chat with AI:** Type *"Which department is receiving the most negative complaints?"* in the chat box on the bottom right to see how Gemini queries the database and gives summaries!

---

## 🎓 Showcase for TCS iON Evaluators

This project is highly optimized for outstanding feedback in academic evaluations:
- **Architectural Dual-Mode:** The server is engineered to automatically fall back to local file storage if MongoDB is down, making it highly resilient.
- **Strict Separation of Concerns:** Frontend components (`FeedbackForm.tsx`, `DashboardCharts.tsx`) are completely decoupled from backend controllers.
- **Advanced AI Integration:** Instead of simple static rules, it utilizes state-of-the-art Large Language Models (LLM) for real-time categorization and agent drafting.
