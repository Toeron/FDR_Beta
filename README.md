# Flying Dragon Records - Live Inventory Portal

Bespoke web application for browsing rare metal and hardrock records, synced live from a Google Sheet inventory.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Local Development
1. **Clone and Navigate**:
   ```bash
   cd FDR
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the `FDR` directory (I have already created one for you) and add your Google Sheet URL:
   ```env
   VITE_GOOGLE_SHEET_CSV_URL=your_google_sheet_link_here
   ```

4. **Launch the Vault**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## 🛠 Configuration

### Google Sheet Setup
To use your own inventory:
1. Create a Google Sheet with the required columns (Artist, Title, Genre, Price, etc.).
2. Ensure the sheet is shared as **"Anyone with the link can view"**.
3. Copy the URL and paste it into your `.env` file as `VITE_GOOGLE_SHEET_CSV_URL`.

### Automated Sync
The portal automatically fetches and parses the latest data from the spreadsheet every 10 minutes.

## 🔒 Security
Sensitive URLs are managed via environment variables and are excluded from version control via `.gitignore`.
