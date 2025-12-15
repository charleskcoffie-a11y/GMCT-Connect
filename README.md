
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

## 📦 How to Share for Testing (No Code)

If you want to send this app to people to try without sharing the code, follow these steps:

### 1. Build the App
Open your terminal in the project folder and run:
```bash
npm run build
```
This creates a **`dist`** folder in your project. This folder contains the "production-ready" version of your app.

### 2. Deploy
The easiest way to share is using **Netlify Drop**:
1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Open your file explorer and find the **`dist`** folder created in Step 1.
3.  **Drag and drop** the `dist` folder onto the Netlify page.
4.  Copy the link generated and send it to your testers.

---

## 🛠 Technical Setup (For Developers)

### 1. Installation
1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run dev`.

### 2. Firebase Configuration
To switch from Mock Data to a Live Database:

1.  **Create Project:** Go to [console.firebase.google.com](https://console.firebase.google.com).
2.  **Enable Auth:** Go to Build > Authentication > Get Started > Enable **Email/Password**.
3.  **Enable Database:** Go to Build > Firestore Database > Create Database > **Start in Test Mode**.
4.  **Get Keys:** Project Settings > General > "Your apps" > Add Web App > Copy Config.
5.  **Env Variables:** Create a `.env` file in the root and paste keys:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    ```

### 3. Database Schema (Required Collections)
You must manually create the initial data structure in the Firestore Console for the app to function correctly.

#### **Collection: `users`**
*   **Document ID:** The Firebase Auth UID of the user.
*   **Fields:**
    *   `name` (string): Full Name
    *   `email` (string): User Email
    *   `role` (string): One of -> `admin`, `rev_minister`, `class_leader`, `society_steward`, `member`
    *   `classId` (string, optional): e.g., "c1" (Required for Class Leaders)
    *   `className` (string, optional): e.g., "Class 1"

#### **Collection: `members`**
Used for Class Rosters.
*   **Document ID:** Auto-ID
*   **Fields:**
    *   `fullName` (string): "Kwame Mensah"
    *   `classId` (string): "c1" (Must match the leader's classId)
    *   `classNumber` (string): "001"
    *   `phone` (string): "024..."
    *   `status` (string): "Active"

#### **Collection: `announcements`**
*   **Fields:** `title`, `content`, `category` (General/Audio/Video), `date` (ISO String), `isFeatured` (boolean).

#### **Collection: `sunday_services`**
*   **Document ID:** Auto-ID or Date based
*   **Fields:**
    *   `date` (string): "2023-11-26"
    *   `theme` (string): "Theme Title"
    *   `preacher` (string): "Rev. Name"
    *   `readings` (array): ["Psalm 23", "John 3:16", ""]

#### **Collection: `leaderNotes`**
Stores notes sent from Class Leaders to Ministers.
*   **Fields:** `leaderId`, `leaderName`, `memberId`, `memberName`, `message`, `isRead` (boolean).

#### **Collection: `attendance`**
*   **Document ID:** `{classId}_{date}_{dayType}` (e.g., `c1_2023-11-20_Sunday`)
*   **Fields:**
    *   `classId` (string)
    *   `date` (string)
    *   `records` (array of objects): `[{ memberId: "...", status: "Present" }]`

#### **Collection: `prayer_requests`**
*   **Fields:** `requesterName`, `phone`, `content`, `status` (New/In-Progress/Closed), `isAnonymous` (boolean).
