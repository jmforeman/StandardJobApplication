# SJA Profile Creator - Standard Job Application Generator

This web application helps you create a Standard Job Application (SJA) profile in a structured `.json` format. The goal of the SJA format is to streamline the job application process by allowing applicants to maintain a single, comprehensive profile that can potentially be used to auto-fill job applications on websites that support the SJA standard.

**Live Demo (if you deploy it, e.g., on GitHub Pages):** [Link to your live demo]

## ✨ Features

*   **Comprehensive Data Entry:** Supports a wide range of common job application fields, including:
    *   Personal Information (Name, Contact, Address)
    *   Online Profiles (LinkedIn, GitHub, Portfolio, etc.)
    *   Work Authorization
    *   Voluntary Diversity Information
    *   Document Paths (Resume, Cover Letter)
    *   Education History (multiple entries)
    *   Work Experience (multiple entries)
    *   Skills (multiple entries)
*   **Dynamic Sections:** Easily add multiple entries for phones, websites, education, work experience, and skills.
*   **Client-Side Only:** **Your privacy is paramount.** All data is processed and stored *exclusively in your web browser*.
    *   No data is ever sent to any server.
    *   The SJA `.json` file is generated locally and downloaded directly to your computer.
*   **Local Persistence:** Save your progress in your browser's `localStorage` and resume later.
*   **JSON Export:** Download your complete SJA profile as a neatly formatted `.json` file.
*   **Open Standard:** Based on the evolving SJA (Standard Job Application) JSON schema (currently targets v1.3).

## Privacy-focused

We understand the sensitivity of job application data. This tool is built with a "privacy-first" approach:

*   **No Server Interaction for Data:** The application is a static HTML, CSS, and JavaScript page. When you enter your information, it stays within your browser.
*   **Local Storage:** If you choose to "Save to Browser," your data is saved in your browser's own local storage, not on any external server. You can clear this data at any time.
*   **Direct Download:** The generated `.json` file is created by your browser and downloaded directly to your computer.

## 🚀 How to Use

1.  **Access the Application:**
    *   **Option A (Recommended for most users):** Visit the live demo link (if provided above).
    *   **Option B (Run locally):**
        1.  Clone this repository or download the `sja_creator.html` file.
        2.  Open the `sja_creator.html` file directly in your web browser (e.g., Chrome, Firefox, Edge, Safari).

2.  **Fill out the Form:** Enter your job application details into the provided fields. Use the "Add..." buttons for sections where multiple entries are needed (like Education or Work Experience).

3.  **Save Progress (Optional):**
    *   Click "**Save to Browser**" to store your current data in your browser's local storage.
    *   Next time you open the app (in the same browser), your data should automatically load. You can also click "**Load from Browser**."
    *   Click "**Clear Saved Data**" to remove your profile from browser storage and reset the form.

4.  **Generate SJA File:**
    *   Once you're done, click "**Generate & Download SJA File**."
    *   A `.json` file (e.g., `sja_yourlastname_YYYYMMDD.json`) will be downloaded to your computer.

5.  **Using Your SJA File:**
    *   Keep this `.json` file safe. You can edit it manually if needed (it's just text).
    *   The vision is that employers might add an "Upload SJA" feature to their career portals, allowing you to quickly populate application forms.
    *   Client-side browser extensions or scripts could also be developed to parse this SJA file and fill out online forms (this is a separate project).

## 🛠️ Development & Contribution

This application is currently a single HTML file with embedded CSS and JavaScript for simplicity.

**To Contribute:**

1.  **Fork the Repository:** Create your own copy of the project.
2.  **Make Changes:**
    *   **Adding Fields:**
        1.  Add new HTML input elements to `sja_creator.html` within the appropriate form section.
        2.  Update the `collectFormData()` JavaScript function to read from your new fields.
        3.  Update the `populateForm()` JavaScript function to populate your new fields when loading data.
    *   **Improving UI/UX:** Enhance the CSS or JavaScript for better usability.
    *   **Adding Features:** Implement new functionalities (e.g., more robust validation, support for more SJA fields, import from existing JSON).
3.  **Test Thoroughly:** Ensure your changes work correctly and don't break existing functionality.
4.  **Create a Pull Request:** Submit your changes for review. Please describe your changes clearly.

**SJA Schema:**

This tool aims to align with the [SJA JSON Schema Definition](link-to-your-sja-schema-definition-if-you-host-it-separately-or-describe-it-in-another-md-file). As the SJA standard evolves, this application will be updated. The current target version is SJA v1.3.

## 💡 Future Ideas

*   More comprehensive validation for all fields.
*   Direct editing of the raw JSON within the app.
*   Import an existing SJA JSON file to populate the form.
*   Theming options.
*   Integration with a separate SJA schema validator.
*   Splitting the code into separate HTML, CSS, and JS files for better organization as it grows.
*   Potentially migrating to a lightweight JavaScript framework (Vue, Svelte) if complexity increases significantly.

## 📄 License

This project is open source and available under the [MIT License](LICENSE.txt). (You'll need to add a LICENSE.txt file with the MIT license text).

---

We hope this tool makes managing your job application information easier!
