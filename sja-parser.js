// sja-parser.js
// A simple library to help parse Standard Job Application (SJA) JSON
// and populate HTML forms.

const SJA_Parser = {
    expectedSJAVersion: "1.3", // Target SJA version this parser is built for

    /**
     * Retrieves a value from a nested object using a dot-separated path string.
     * @param {object} obj The object to traverse.
     * @param {string} path The dot-separated path (e.g., "applicant_info.name.first_name").
     * @param {any} defaultValue Value to return if path is not found.
     * @returns {any} The value at the path or the defaultValue.
     */
    getValueFromPath: function(obj, path, defaultValue = '') {
        if (!obj || typeof path !== 'string') return defaultValue;
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        return current !== undefined && current !== null ? current : defaultValue;
    },

    /**
     * Loads an SJA JSON file from a file input and populates a form based on mapping.
     * @param {string} fileInputId The ID of the <input type="file"> element.
     * @param {object} mappingConfig Object defining how SJA paths map to form field selectors.
     * @param {function} [onSuccess] Optional callback on successful load and partial fill.
     * @param {function} [onError] Optional callback on error.
     */
    loadAndFillForm: function(fileInputId, mappingConfig, onSuccess, onError) {
        const fileInput = document.getElementById(fileInputId);
        if (!fileInput) {
            console.error(`SJA_Parser: File input with ID '${fileInputId}' not found.`);
            if (onError) onError(`File input '${fileInputId}' not found.`);
            return;
        }

        if (fileInput.files.length === 0) {
            alert("Please select an SJA JSON file first.");
            if (onError) onError("No file selected.");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const sjaData = JSON.parse(event.target.result);
                console.log("SJA Data Loaded:", sjaData);

                if (sjaData.sja_version !== this.expectedSJAVersion) {
                    alert(`Warning: SJA file version is ${sjaData.sja_version}, parser expects ${this.expectedSJAVersion}. Some fields may not map correctly.`);
                    // Optionally, could have version migration logic here or more robust handling
                }

                // --- Begin Populating Form ---
                for (const sjaPath in mappingConfig) {
                    const config = mappingConfig[sjaPath];
                    const sjaValue = this.getValueFromPath(sjaData, sjaPath);

                    if (config.type === 'array' && Array.isArray(sjaValue)) {
                        this.populateArrayFields(sjaValue, config, sjaData); // Pass sjaData for complex item mapping
                    } else {
                        const element = document.querySelector(config.selector);
                        if (element) {
                            this.setFieldValue(element, sjaValue, config.fieldType || element.type);
                        } else {
                            console.warn(`SJA_Parser: Element for selector '${config.selector}' (SJA path: ${sjaPath}) not found.`);
                        }
                    }
                }

                // --- Special Handling for Resume Path ---
                const resumePath = this.getValueFromPath(sjaData, "resume_path");
                if (resumePath && mappingConfig["resume_path_info_display"]) {
                    const resumeInfoEl = document.querySelector(mappingConfig["resume_path_info_display"].selector);
                    if (resumeInfoEl) {
                        const fileName = resumePath.split(/[\\/]/).pop();
                        resumeInfoEl.innerHTML = `Your SJA indicates your resume is: <strong>${fileName || 'N/A'}</strong>. Please select it for upload.`;
                    }
                }

                if (onSuccess) onSuccess(sjaData);
                else alert("SJA data loaded. Please review the form.");

            } catch (e) {
                console.error("SJA_Parser: Error processing SJA file:", e);
                if (onError) onError("Error parsing SJA file: " + e.message);
                else alert("Error parsing SJA file: " + e.message);
            }
        };

        reader.onerror = () => {
            console.error("SJA_Parser: Error reading file.");
            if (onError) onError("Error reading SJA file.");
            else alert("Error reading SJA file.");
        };

        reader.readAsText(file);
    },

    /**
     * Sets the value of a form field based on its type.
     */
    setFieldValue: function(element, value, fieldType) {
        if (value === undefined || value === null) value = ''; // Default to empty string

        switch (fieldType) {
            case 'select-one':
                element.value = value;
                // For select, might need to find option by text if value attribute isn't directly SJA value
                if (element.value !== value) { // If direct value set failed, try by text
                    for(let i = 0; i < element.options.length; i++) {
                        if(element.options[i].text === value || element.options[i].label === value) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                }
                break;
            case 'radio': // Assumes radio group has same 'name', selector points to one in group
                const radioGroup = document.querySelectorAll(`input[type="radio"][name="${element.name}"]`);
                radioGroup.forEach(radio => radio.checked = (radio.value === value));
                break;
            case 'checkbox':
                element.checked = Boolean(value); // Assumes SJA value is true/false or similar
                break;
            case 'textarea':
                element.value = Array.isArray(value) ? value.join('\n') : value; // Handle array for responsibilities etc.
                break;
            default: // Handles text, email, tel, date, etc.
                element.value = value;
        }
    },

    /**
     * Populates fields for array items (e.g., work experience, education).
     */
    populateArrayFields: function(sjaArrayItems, arrayConfig, sjaData) {
        sjaArrayItems.forEach((item, index) => {
            // Check if a container for this item index already exists
            let itemContainerSelector = arrayConfig.itemContainerPattern.replace('{index}', index);
            let itemContainer = document.querySelector(itemContainerSelector);

            // If container doesn't exist and an "add button" is specified, click it
            if (!itemContainer && arrayConfig.addButtonSelector && index > 0) { // index > 0 to avoid clicking for first item if pre-rendered
                const addButton = document.querySelector(arrayConfig.addButtonSelector);
                if (addButton) {
                    console.log(`SJA_Parser: Clicking add button for item ${index + 1}`);
                    addButton.click(); // This might trigger async UI updates.
                                       // A more robust solution might need MutationObserver or delay.
                    // Re-query for the container after a potential click
                    itemContainer = document.querySelector(itemContainerSelector);
                }
            }
            if (!itemContainer && index === 0 && arrayConfig.firstItemContainerSelector) {
                // If specific selector for the first (often pre-rendered) item
                itemContainer = document.querySelector(arrayConfig.firstItemContainerSelector);
            }


            if (itemContainer) {
                for (const itemKey in arrayConfig.itemMapping) {
                    const fieldConfig = arrayConfig.itemMapping[itemKey];
                    // Path for item values is relative to the item object itself
                    const itemValue = this.getValueFromPath(item, itemKey, ''); // Get value from current SJA array item
                    
                    const fieldElement = itemContainer.querySelector(fieldConfig.selector);
                    if (fieldElement) {
                        this.setFieldValue(fieldElement, itemValue, fieldConfig.fieldType || fieldElement.type);
                    } else {
                        console.warn(`SJA_Parser: Element for item selector '${fieldConfig.selector}' (SJA key: ${itemKey}) in container '${itemContainerSelector}' not found.`);
                    }
                }
            } else {
                console.warn(`SJA_Parser: Container for array item ${index + 1} ('${itemContainerSelector}') not found, and could not be added.`);
            }
        });
    }
};

// Example of how an employer might trigger this if they have global SJA_Mapping and SJA_FileInputId
// document.addEventListener('DOMContentLoaded', () => {
//   const sjaLoadBtn = document.getElementById('loadSjaButton'); // Assuming employer adds this button
//   if (sjaLoadBtn && typeof SJA_Mapping !== 'undefined' && typeof SJA_FileInputId !== 'undefined') {
//     sjaLoadBtn.addEventListener('click', () => {
//       SJA_Parser.loadAndFillForm(SJA_FileInputId, SJA_Mapping,
//         (data) => console.log("SJA Loaded Successfully by auto-trigger", data),
//         (err) => console.error("SJA Auto-load Error:", err)
//       );
//     });
//   }
// });