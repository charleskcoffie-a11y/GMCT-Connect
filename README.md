# ChurchConnect App - Firebase Setup Guide

This application is built to work with **Mock Data** out of the box for immediate previewing. To connect it to a live backend, it is pre-configured to use **Google Firebase (Firestore)**.

Follow these steps to connect your own Firebase database.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"**.
3. Name your project (e.g., `church-connect-app`) and click **Continue**.
4. Disable Google Analytics (optional, not needed for this guide) and click **Create project**.

## 2. Register a Web App

1. Once your project is ready, you will be on the Project Overview page.
2. Click the **Web icon (`</>`)** to add a new app.
3. Register the app with a nickname (e.g., `ChurchConnect Web`).
4. Click **Register app**.
5. You will see a code block containing `firebaseConfig`. **Keep this open**, you will need these values for Step 4.

## 3. Enable Cloud Firestore

1. In the left sidebar, click on **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose a location (e.g., `nam5 (us-central)`) and click **Next**.
4. **Important:** For the security rules, choose **Start in test mode** for initial development.
   * *Note: "Test mode" allows anyone with the link to read/write for 30 days. For production, you will need to configure proper Security Rules.*
5. Click **Enable**.

## 4. Configure Environment Variables

1. In the root directory of your project (where `package.json` is), create a new file named `.env`.
2. Copy the values from the `firebaseConfig` you got in Step 2 and paste them into the `.env` file using the specific format below.

**Example `.env` file content:**

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_api_key...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Note:** You must use the prefix `VITE_` for the variables to be exposed to the application.

## 5. Run the Application

Once the `.env` file is saved with valid credentials, restart your development server:

```bash
npm run dev
# or
npm start
```

The application logic (`services/api.ts`) automatically detects if these variables are present.
*   **If Present:** It attempts to connect to Firebase.
*   **If Missing/Invalid:** It gracefully falls back to the static Mock Data.

## 6. Database Collections Structure

When you start adding data to your Firestore, the app expects the following **Collection Names**. The documents inside should match the fields defined in `types.ts`.

| Collection Name | Description |
| :--- | :--- |
| `announcements` | General news, audio, and video updates. |
| `daily_verses` | Daily scripture readings. |
| `events` | Calendar events and programs. |
| `sunday_services`| Weekly service details (theme, preacher, readings). |
| `devotions` | Daily devotionals. |
| `sermons` | Sermon archives with audio/video links. |
| `hymns` | Hymn lyrics and metadata (Book, Number, Title). |
| `liturgical_seasons`| Seasons like Lent, Advent, Kingdomtide. |
| `prayer_requests` | Requests submitted by users. |
| `sick_reports` | Reports of sick members submitted by class leaders. |

### How to populate data?

1.  **Hymns:** You can use the **Settings** page in the app to upload a JSON file of hymns. The app will write them to your Firestore `hymns` collection automatically.
2.  **Devotions:** Clicking "Generate Devotion" on the Devotion page will simulate an AI generation and write the result to your Firestore `devotions` collection.
3.  **Other Data:** You can manually add documents in the Firebase Console to populate Events, Announcements, etc.

## Troubleshooting

*   **"Firebase initialization failed"**: Check your browser console. Ensure your `.env` values are exactly correct and contain no extra spaces or quotes around the values.
*   **Empty Screens**: If you connected Firebase but haven't added data yet, the screens will be empty. The Mock Data is disabled as soon as a valid Firebase connection is detected.
*   **Permission Denied**: Check your Firestore Rules tab in the console. Ensure read/write is allowed.

```firebase_security_rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Only for development!
    }
  }
}
```
