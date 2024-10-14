// Function to navigate to a specified page
function navigateToPage(page) {
    localStorage.setItem('activeLink', page); // Store the active link in local storage
    window.location.href = page; // Redirect to the specified page
}

// Function to navigate to the next page without validation
function navigateNext() {
    const activeLink = localStorage.getItem('activeLink') || 'pcs-login.html'; // Default to page 1 if no active link

    // Logic to navigate to the next page
    switch (activeLink) {
        case 'pcs-login.html':
            navigateToPage('electricity.html'); // Next page from page 1 to page 2
            break;
        case 'electricity.html':
            navigateToPage('ess.html'); // Next page from page 2 to page 3
            break;
        case 'ess.html':
            navigateToPage('economic.html'); // Next page from page 3 to page 4
            break;
        case 'economic.html':
            navigateToPage('report.html'); // Next page from page 4 to page 5
            break;
        default:
            alert('You are on the last page.'); // If on the last page, show alert
    }
}

// Function to navigate to the previous page
function navigatePrevious() {
    const activeLink = localStorage.getItem('activeLink') || 'pcs-login.html'; // Default to page 1 if no active link

    // Logic to navigate to the previous page
    switch (activeLink) {
        case 'report.html':
            navigateToPage('economic.html'); // Previous page from page 5 to page 4
            break;
        case 'economic.html':
            navigateToPage('ess.html'); // Previous page from page 4 to page 3
            break;
        case 'ess.html':
            navigateToPage('electricity.html'); // Previous page from page 3 to page 2
            break;
        case 'electricity.html':
            navigateToPage('pcs-login.html'); // Previous page from page 2 to page 1
            break;
        default:
            alert('You are on the first page.'); // If on the first page, show alert
    }
}

// Event listeners for the 'Next' and 'Previous' buttons
document.getElementById('next-button').addEventListener('click', navigateNext);
document.getElementById('previous-button').addEventListener('click', navigatePrevious);

// Function to set the active link
function setActive(link) {
    // Remove active class from all links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(function (l) {
        l.classList.remove('active');
    });

    // Add active class to the clicked link
    link.classList.add('active');

    // Store the active link in local storage
    localStorage.setItem('activeLink', link.getAttribute('href'));

    // Navigate to the page
    navigateToPage(link.getAttribute('href'));
}

// Load the active link when the page loads
function loadActiveLink() {
    const activeLink = localStorage.getItem('activeLink');
    if (activeLink) {
        const link = document.querySelector(`a[href="${activeLink}"]`);
        if (link) {
            link.classList.add('active'); // Highlight the active link
        }
    }
}

// Load the active link when the page loads
window.onload = loadActiveLink;

// Add event listeners for navigation links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default action of the link
        setActive(this); // Set the active link
    });
});

// Function to show the calendar picker for years and limit the selection to 25 years
function showYearPicker(inputId) {
    const input = document.getElementById(inputId);
    
    // Create a date picker limited to selecting years
    const picker = new Pikaday({
        field: input,
        format: 'YYYY',
        yearRange: [1900, new Date().getFullYear()],
        onSelect: function() {
            input.value = this.getMoment().year();
            updateProjectLifecycle(); // Update the message when a year is selected
        }
    });
    picker.show();
}

// Function to update the project lifecycle message based on selected years
function updateProjectLifecycle() {
    const startYear = document.getElementById('start-year').value;
    const endYear = document.getElementById('end-year').value;
    const yearMessage = document.getElementById('year-message');
    const yearsSelectedMessage = document.getElementById('years-selected');

    if (startYear && endYear) {
        const yearsSelected = parseInt(endYear) - parseInt(startYear);
        
        if (yearsSelected > 25) {
            alert('The project lifecycle cannot exceed 25 years.');
            document.getElementById('end-year').value = ''; // Reset end year
            yearMessage.textContent = 'Maximum 25 years';
            yearsSelectedMessage.textContent = ''; // Clear message
        } else if (yearsSelected >= 0) {
            yearMessage.textContent = `Lasts for ${yearsSelected} years`;
            yearMessage.style.color = 'lightgrey';
            yearsSelectedMessage.textContent = `Selected period: ${yearsSelected} years`;
            yearsSelectedMessage.style.color = 'black'; // Set color for visibility
        }
    }
}

// Event listeners for start and end year fields
document.getElementById('start-year').addEventListener('click', function() {
    showYearPicker('start-year');
});

document.getElementById('end-year').addEventListener('click', function() {
    showYearPicker('end-year');
});

// Function to handle cancel action
function cancel() {
    alert('Cancelled.'); // Replace with actual cancel logic if needed
}

// Initialize global variables for data storage
let buildingLoadData = [];
let pvGenerationData = [];

function showFileName() {
    var fileInput = document.getElementById('file-upload');
    var uploadText = document.getElementById('upload-text');

    // Check if a file has been uploaded
    if (fileInput.files.length > 0) {
        var fileName = fileInput.files[0].name; // Get the name of the uploaded file

        // Update the upload text to show the file name
        uploadText.innerHTML = `
            Drag and drop file here
            <div class="upload-subtext"><span class="file-name">${fileName}</span></div>
            <div class="upload-limit">File uploaded successfully</div>
        `;
    }
}

function showPVFileName() {
    var pvFileInput = document.getElementById('pv-file-upload');
    var pvUploadText = document.getElementById('pv-upload-text');

    // Check if a file has been uploaded
    if (pvFileInput.files.length > 0) {
        var pvFileName = pvFileInput.files[0].name; // Get the name of the uploaded file

        // Update the upload text to show the file name
        pvUploadText.innerHTML = `
            Drag and drop file here
            <div class="upload-subtext"><span class="file-name">${pvFileName}</span></div>
            <div class="upload-limit">File uploaded successfully</div>
        `;
    }
}

// Function to save files (placeholder functionality)
function saveFiles() {
    const buildingLoadFile = document.getElementById('file-upload').files[0];
    const pvGenerationFile = document.getElementById('pv-file-upload').files[0];

    if (buildingLoadFile && pvGenerationFile) {
        // Placeholder for successful save
        alert('Files saved successfully.'); 
    } else {
        alert('Please upload both files before saving.');
    }
}

// Function to generate plots based on the selected date
async function generatePlots() {
    const selectedDate = document.getElementById('date-selection').value;

    // Load building load and PV generation data from uploaded files
    const buildingLoadData = await loadFileData('file-upload');
    const pvGenerationData = await loadFileData('pv-file-upload');

    const combinedData = combineDataForDate(selectedDate, buildingLoadData, pvGenerationData);
    plotGraph(combinedData);
}

// Function to load data from uploaded Excel files
function loadFileData(inputId) {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById(inputId);
        if (fileInput.files.length === 0) {
            reject('No file uploaded');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

// Function to combine data based on the selected date
function combineDataForDate(date, buildingLoadData, pvGenerationData) {
    return buildingLoadData.map(load => {
        const pv = pvGenerationData.find(p => p.time === load.time);
        return {
            time: load.time,
            buildingLoad: load.power,
            pvGeneration: pv ? pv.power : 0
        };
    }).filter(data => data.time.startsWith(date)); // Filter by selected date
}

// Function to plot the graph using Chart.js
function plotGraph(data) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    const labels = data.map(d => new Date(d.time).toLocaleTimeString());
    const buildingLoadValues = data.map(d => d.buildingLoad);
    const pvGenerationValues = data.map(d => d.pvGeneration);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Building Load (kW)',
                    data: buildingLoadValues,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'PV Generation (kW)',
                    data: pvGenerationValues,
                    borderColor: 'orange',
                    fill: false,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (kW)'
                    }
                }
            }
        }
    });
}

// Event listeners for file inputs and other UI interactions
document.getElementById('file-upload').addEventListener('change', showFileName);
document.getElementById('pv-file-upload').addEventListener('change', showPVFileName);
document.getElementById('save-button').addEventListener('click', saveFiles);
document.getElementById('generate-plots-button').addEventListener('click', generatePlots);