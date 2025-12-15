
# GMCT Connect - Church Management App

**GMCT Connect** is a comprehensive church management and community application designed for the Ghana Methodist Church of Toronto. It bridges the gap between the congregation and leadership through role-based portals, liturgical resources, and administrative tools.

---

## 🚀 Operations Guide (How to Use)

This app is currently configured in **Demo Mode**. You do not need to register a real account to test the features. Follow the instructions below to explore the application from different perspectives.

### 1. How to Log In
1. Open the application.
2. From the **Welcome Screen**, click **"Enter App"**.
3. If you are not logged in, you will be redirected to the Sign In page.
4. **Select a Role:** In the blue "Select Role (Demo Mode)" box, choose one of the following:
   * **Member** (General User)
   * **Class Leader** (Attendance & Pastoral Care)
   * **Rev. Minister** (Administration & Liturgy)
   * **Society Steward** (Announcements & Events)
   * **Admin** (App Configuration)
5. Click **Sign In** (Credentials are auto-filled).

---

### 2. Features by Role

#### 👤 General Member
*   **Home Dashboard:** View the daily greeting, featured announcements, upcoming service details, and the daily devotion.
*   **Hymnal:** Browse the Methodist Hymn Book (MHB), CAN, and Canticles. Use the search bar to find hymns by number or title.
*   **My Portal:**
    *   **Prayer Request:** Submit confidential prayer requests directly to the Minister.
    *   **Message Minister:** Send direct messages to the Rev. Minister.
    *   **Message Class Leader:** Send updates (e.g., "I am travelling") to your specific Class Leader.
*   **Resources:** Access Daily Verses, Sermons (Audio/Video), and the Liturgical Calendar.

#### 📋 Class Leader
*   **Access:** Login as *Class Leader* > Go to **My Portal** > Click **Class Manager** (or Member Directory).
*   **Class Verification:** If asked for a code, use **1234**.
*   **Workflows:**
    *   **Members Tab:** View your class roster. Click "Note to Minister" to escalate issues.
    *   **Attendance Tab:**
        1. Select the Date and Day (Sunday/Tuesday).
        2. use the **Multi-Select Lists** to quickly mark members as **Present**, **Sick**, or **Travelled**.
        3. Click **Submit Attendance**.
    *   **History Tab:** View past records. Click "Edit" to modify a previously submitted record.
    *   **Analytics Tab:** View attendance trends and statistics (4-week or 2-week view).
    *   **Follow-Up Tab:** See a list of members absent for more than 4 weeks. Log your follow-up actions (e.g., "Confirm Sick").

#### ✝️ Rev. Minister
*   **Access:** Login as *Rev. Minister* > Go to **My Portal**.
*   **Minister's Dashboard:**
    *   **Prayer Requests:** View incoming requests. Mark them as "In-Progress" or "Closed". Expand requests to see contact details.
    *   **Messages:** Read direct messages from members.
    *   **Class Notes:** Review notes sent by Class Leaders regarding specific members.
*   **Service Planner:**
    *   Go to **Service Planner** from the Portal.
    *   Plan the Liturgy (Theme, Preacher, Readings) for the next 4 Sundays.
    *   Click **Save Schedule** to instantly update the "Upcoming Service" card on everyone's Home screen.

#### 📢 Society Steward
*   **Access:** Login as *Society Steward* > Go to **My Portal** > Click **Steward Dashboard**.
*   **Announcements:**
    *   Click **"Post Announcement"**.
    *   Fill in Title, Content, and Category (General, Audio, Video).
    *   Toggle **Push Notification** to simulate sending an alert to all users.
    *   View and delete active announcements.

#### ⚙️ Administrator
*   **Access:** Login as *Admin* > Open the Sidebar Menu > Click **Settings**.
*   **Configuration:**
    *   **App Theme:** Force Light or Dark mode.
    *   **Church Logo:** Upload a new logo to brand the Welcome screen and Header.
    *   **Member Database:** Interface for CSV bulk imports (Mock UI).

---

## 🛠 Technical Setup (For Developers)

If you wish to deploy this application or connect it to a live backend, follow these steps.

### Prerequisites
*   Node.js (v16+)
*   npm or yarn

### Installation
1.  Clone the repository.
2.  Run `npm install` to install dependencies.

### Configuration (Firebase)
The app works with Mock Data by default. To connect to a live database:

1.  Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2.  Enable **Authentication** and **Firestore Database**.
3.  Create a `.env` file in the root directory:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
4.  Restart the server. The app automatically detects the keys and switches from Mock Data to Firebase.

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```
This generates static files in the `dist` folder, ready for deployment on Vercel, Netlify, or Firebase Hosting.
