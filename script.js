// Global variables
let allData = [];
let vehicleDataMap = new Map();
let vehicleSummaryData = [];
let openingValue = 0;
let closingValue = 0;
let currentVehicleNumber = '';

// DOM elements
const loadingIndicator = document.getElementById('loadingIndicator');
const filtersSection = document.querySelector('.filters');
const resultsSection = document.querySelector('.results');
const vehicleNumberInput = document.getElementById('vehicleNumber');
const searchBtn = document.getElementById('searchBtn');
const printBtn = document.getElementById('printBtn');
const yearFilter = document.getElementById('yearFilter');
const descriptionFilter = document.getElementById('descriptionFilter');
const clearBtn = document.getElementById('clearBtn');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const totalTransactionsSpan = document.getElementById('totalTransactions');
const totalAmountSpan = document.getElementById('totalAmount');
const openingValueSpan = document.getElementById('openingValue');
const closingValueSpan = document.getElementById('closingValue');

// New elements for summary report
const summaryReportSection = document.getElementById('summaryReport');
const singleReportSection = document.getElementById('singleReport');
const summaryReportBtn = document.getElementById('summaryReportBtn');
const singleReportBtn = document.getElementById('singleReportBtn');
const summaryTableBody = document.getElementById('summaryTableBody');
const totalVehiclesSpan = document.getElementById('totalVehicles');
const total2023Span = document.getElementById('total2023');
const highestSpendingSpan = document.getElementById('highestSpending');
const lastUpdatedSpan = document.getElementById('lastUpdated');
const downloadSummaryBtn = document.getElementById('downloadSummaryBtn');
const printSummaryBtn = document.getElementById('printSummaryBtn');
const reportDateSpan = document.getElementById('reportDate');
const currentDateSpan = document.getElementById('currentDate');

// Book7.csv data (converted to array)
const book7Data = [
    {plate: "4735", type: "RAM", brand: "Dodge", driver: "Eng. Bara"},
    {plate: "4896", type: "F150", brand: "Ford", driver: "No Driver"},
    {plate: "13890", type: "TRAILER BODY", brand: "MERCEDES", driver: "Tajbir singh"},
    {plate: "17745", type: "SHOVEL CRANE", brand: "CATEPILAR", driver: "Ranjit"},
    {plate: "24004", type: "SHOVEL CRANE", brand: "CATEPILAR", driver: "Karam Husen"},
    {plate: "29391", type: "PICK UP", brand: "NISSAN", driver: "Mohamad Islam"},
    {plate: "31062", type: "LOADER", brand: "KUMATSO", driver: "Suman Ali"},
    {plate: "31107", type: "WATER TANKER", brand: "TATA", driver: "Ranjit Singh"},
    {plate: "32218", type: "SMALL BOBCAT", brand: "CATERPILAR", driver: "Harun"},
    {plate: "33930", type: "SHOVEL CRANE", brand: "CATERPILLAR", driver: "Ranjit"},
    {plate: "34026", type: "BIG BOBCAT", brand: "CATERPILAR", driver: ""},
    {plate: "35237", type: "6 WHEEL (3 TON)", brand: "MITSUBISHI", driver: "Harendar Khan"},
    {plate: "36588", type: "LOADER", brand: "KUMATSO", driver: "Mir Akbar"},
    {plate: "37481", type: "TRAILER", brand: "MERCEDES", driver: "Arbab Khan"},
    {plate: "37510", type: "TRAILER", brand: "MERCEDES", driver: "Charanjit"},
    {plate: "47054", type: "SHOVEL (TELEHANDLER)", brand: "JCB", driver: "Gul Rehman"},
    {plate: "47055", type: "SHOVEL (TELEHANDLER)", brand: "JCB", driver: "Karam Husen"},
    {plate: "47524", type: "BIG BUS -", brand: "ASHOK LEYLAND", driver: "Basanta"},
    {plate: "49921", type: "SMALL BOBCAT", brand: "JCB", driver: "Imran"},
    {plate: "51421", type: "PICK UP", brand: "NISSAN", driver: "Kotika Aruna"},
    {plate: "56551", type: "MOBILE CRANE", brand: "XCMG", driver: "Sharif Khan"},
    {plate: "59150", type: "PICK UP", brand: "TOYOTA", driver: "Azam Khan"},
    {plate: "66588", type: "BOBCAT (small)", brand: "Bobcat", driver: "Rajeeb"},
    {plate: "66589", type: "BOBCAT (small)", brand: "Bobcat", driver: "Naeem"},
    {plate: "74186", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Asif Husain"},
    {plate: "79723", type: "TRAILER HEAD+TRAILER", brand: "MERCEDES", driver: "Ansari"},
    {plate: "104498", type: "BIG BUS", brand: "ASHOK LEYLAND", driver: "Janab Hussein"},
    {plate: "105086", type: "PICK UP", brand: "MITSUBISHI", driver: "Ansari"},
    {plate: "117325", type: "BIG BUS", brand: "TATA", driver: ""},
    {plate: "125790", type: "BIG BUS", brand: "ASHOK LEYLAND", driver: ""},
    {plate: "132981", type: "6 WHEEL (3 TON)", brand: "MITSUBISHI", driver: "Tajbir singh"},
    {plate: "134037", type: "PICK UP", brand: "TOYOTA", driver: "Govindaraj"},
    {plate: "134494", type: "6 WHEEL (3 TON)", brand: "MITSUBISHI", driver: "Janab Hussein"},
    {plate: "145057", type: "PICK UP", brand: "NISSAN", driver: ""},
    {plate: "145759", type: "TRAILER HEAD", brand: "MERCEDES", driver: "Naveed Khan"},
    {plate: "167502", type: "PICK UP", brand: "NISSAN", driver: "Asrar"},
    {plate: "167503", type: "PICK UP", brand: "NISSAN", driver: "Nosher Khan"},
    {plate: "180212", type: "BIG BUS", brand: "ASHOK LEYLAND", driver: "Arbab Khan"},
    {plate: "191684", type: "PICK UP", brand: "TOYOTA", driver: "Hassan Abdulla"},
    {plate: "192934", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Sakir"},
    {plate: "192955", type: "PICK UP", brand: "TOYOTA", driver: "Halimi"},
    {plate: "193120", type: "PICK UP", brand: "TOYOTA", driver: "Zahid Khan"},
    {plate: "206713", type: "MINI BUS (26 PASSENGER)", brand: "TOYOTA", driver: "Balram"},
    {plate: "220190", type: "FORD F150", brand: "FORD", driver: "Khaled Soltan"},
    {plate: "238490", type: "MINI BUS (30 PASSENGER)", brand: "NISSAN", driver: "Tajbir singh"},
    {plate: "250117", type: "BIG BUS", brand: "ASHOK LEYLAND", driver: "Shahid Khan"},
    {plate: "254081", type: "BIG BUS - NEW", brand: "TATA", driver: "Arbab Khan"},
    {plate: "254258", type: "BIG BUS - NEW", brand: "TATA", driver: "Harendar Khan"},
    {plate: "262203", type: "PICK UP", brand: "TOYOTA", driver: "Mostafa Campboss"},
    {plate: "281839", type: "TRAILER", brand: "MERCEDES", driver: "Arbab Khan"},
    {plate: "314419", type: "PICK UP", brand: "TOYOTA", driver: "Govindaraj"},
    {plate: "318505", type: "MINI BUS", brand: "TOYOTA", driver: "Prasad"},
    {plate: "345468", type: "STATION WAGON (CRUISER)", brand: "TOYOTA", driver: "Abdurahman Yousry"},
    {plate: "456102", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Nematulla"},
    {plate: "456103", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Mr. Jose"},
    {plate: "458630", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Nematolla"},
    {plate: "507521", type: "STATION WAGON (X-TRAIL)", brand: "NISSAN", driver: "Hassan Abdulla"},
    {plate: "526051", type: "SALOON (TIIDA)", brand: "NISSAN", driver: "Micheal"},
    {plate: "672193", type: "PRADO LAND CRUISER", brand: "TOYOTA", driver: "Khaled Soltan"},
    {plate: "751056", type: "HATCHBACK(TIIDA)", brand: "NISSAN", driver: "MD SAKIR HUSSAIN"},
    {plate: "95128", type: "PICK UP", brand: "TOYOTA", driver: "NOSHER KHAN GULAB KHAN"},
    {plate: "95137", type: "PICK UP", brand: "TOYOTA", driver: "ZAHID KHAN FAIYAZ KHAN-BALRAM"},
    {plate: "334239", type: "EXPEDITION", brand: "FORD", driver: "MR. ALI ALMUGHRABI"},
    {plate: "820045", type: "GMC", brand: "YUKON", driver: "MR. MOSTAFA MOHAMED SHENISHN"},
    {plate: "179713", type: "Truck (Canter)", brand: "MITSUBISHI", driver: "NOOR SHAIB SHAHZAD"},
    {plate: "279977", type: "Toyota Hilux", brand: "TOYOTA", driver: "DHARMENDRA SINGH RISHIDEV SINGH"},
    {plate: "317673", type: "Toyota Hilux", brand: "TOYOTA", driver: "SHAHUL HAMEED MOHAMMEDALI"},
    {plate: "925770", type: "Outlander", brand: "MITSUBISHI", driver: "MOHAMED OTHMAN"},
    {plate: "102095", type: "TATA BUS 66 SEATER", brand: "TATA", driver: "ARBAB KHAN PIR GUL"},
    {plate: "173492", type: "TATA BUS 66 SEATER", brand: "TATA", driver: "MOHAMMAD USUF A.KHA"},
    {plate: "78209", type: "HYUNDAI 5 TON FORKLIFT", brand: "MITSUBISHI", driver: "MOUHASIN ANDUL MAJID"},
    {plate: "195891", type: "TOYOTA DOUBLE CABIN PICKUP 4X4", brand: "TOYOTA", driver: "ESAM - 26-11-2024- 06:30 PM"},
    {plate: "220266", type: "TOYOTA DOUBLE CABIN PICKUP 4X4", brand: "TOYOTA", driver: "SAMAD"},
    {plate: "78409", type: "ROLLER COMPACTOR 3 TON", brand: "JCB", driver: "AQIB - 14-01-2025 169"},
    {plate: "174186", type: "TIIDA", brand: "NISSAN", driver: "HAFIZ MUHAMMAD ABBAS"},
    {plate: "698271", type: "TOYOTA RAV", brand: "TOYOTA", driver: "ASIF HUSSEIN"},
    {plate: "H281840-37510", type: "TRAILER-mercedes", brand: "MERCEDES", driver: "MUFTAH UD DIN PIR KHAN"},
    {plate: "H281839-37481", type: "TRAILER-mercedes", brand: "MERCEDES", driver: "SUKHDEV SINGHĀ"},
    {plate: "H145759-13890", type: "TRAILER -mercedes", brand: "MERCEDES", driver: "RANJIT SINGH"},
    {plate: "281840", type: "Trailer", brand: "MERCEDES", driver: ""}
];

// Initialize the application
function init() {
    setupEventListeners();
    loadCSVFromURL();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    reportDateSpan.textContent = now.toLocaleDateString('en-US', options);
    currentDateSpan.textContent = now.toLocaleDateString('en-US', options);
}

function setupEventListeners() {
    // Single vehicle report listeners
    searchBtn.addEventListener('click', searchTransactions);
    printBtn.addEventListener('click', printReport);
    yearFilter.addEventListener('change', filterResults);
    descriptionFilter.addEventListener('input', filterResults);
    clearBtn.addEventListener('click', clearFilters);
    
    vehicleNumberInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchTransactions();
    });
    
    // Summary report listeners
    summaryReportBtn.addEventListener('click', () => {
        switchReport('summary');
    });
    
    singleReportBtn.addEventListener('click', () => {
        switchReport('single');
    });
    
    downloadSummaryBtn.addEventListener('click', downloadSummaryCSV);
    printSummaryBtn.addEventListener('click', printSummaryReport);
}

function switchReport(type) {
    if (type === 'summary') {
        summaryReportSection.classList.add('active');
        singleReportSection.classList.remove('active');
        summaryReportBtn.classList.add('active');
        singleReportBtn.classList.remove('active');
    } else {
        summaryReportSection.classList.remove('active');
        singleReportSection.classList.add('active');
        summaryReportBtn.classList.remove('active');
        singleReportBtn.classList.add('active');
    }
}

function formatFinancial(num) {
    return parseFloat(num || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadCSVFromURL() {
    const url = "https://raw.githubusercontent.com/DC-database/Invoice/main/Vehicle.csv";
    
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data.filter(row => row['Year']);
            processData(allData);
            generateVehicleSummary();
            
            filtersSection.style.display = 'block';
            resultsSection.style.display = 'block';
            loadingIndicator.style.display = 'none';
        },
        error: function(error) {
            console.error('Error loading CSV:', error);
            loadingIndicator.innerHTML = `
                <div style="color: red; padding: 20px;">
                    <p>Error loading data</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    });
}

function processData(data) {
    vehicleDataMap.clear();
    if (!data.length) return;

    const knownVehicleNumbers = book7Data.map(item => item.plate);

    // Process data and populate vehicleDataMap
    data.forEach(row => {
        const transaction = {
            year: row['Year'],
            poNumber: row['PO #'],
            site: row['Project #'],
            description: row['Description'],
            amount: row['Delivered Amount']
        };
        
        knownVehicleNumbers.forEach(num => {
            if (row[num] && row[num].trim() !== '') {
                if (!vehicleDataMap.has(num)) {
                    vehicleDataMap.set(num, []);
                }
                vehicleDataMap.get(num).push(transaction);
            }
        });
    });

    // Populate year filter and datalist
    populateYearFilter(data);
    populateVehicleDatalist();
}

function populateYearFilter(data) {
    const years = [...new Set(data.map(row => row['Year']).filter(Boolean))].sort();
    yearFilter.innerHTML = '<option value="">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function populateVehicleDatalist() {
    const datalist = document.getElementById('vehicleNumbers');
    datalist.innerHTML = '';
    Array.from(vehicleDataMap.keys()).sort().forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        datalist.appendChild(option);
    });
}

function searchTransactions() {
    const vehicleNumber = vehicleNumberInput.value.trim();
    if (!vehicleNumber) {
        alert('Please enter a vehicle number');
        return;
    }

    if (!vehicleDataMap.has(vehicleNumber)) {
        displayResults([]);
        updateSummaryValues(0, 0, 0, 0);
        alert('No transactions found for: ' + vehicleNumber);
        return;
    }

    currentVehicleNumber = vehicleNumber;
    const transactions = vehicleDataMap.get(vehicleNumber);
    displayResults(transactions);
    calculateOpeningClosingValues(transactions);
}

function calculateOpeningClosingValues(transactions) {
    openingValue = 0;
    closingValue = 0;
    
    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;
        const year = parseInt(t.year);
        
        if (!isNaN(year)) {
            if (year >= 1999 && year <= 2024) openingValue += amount;
            closingValue += amount;
        }
    });
    
    updateSummaryValues(
        transactions.length,
        transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
        openingValue,
        closingValue
    );
}

function updateSummaryValues(totalTransactions, totalAmount, opening, closing) {
    totalTransactionsSpan.textContent = totalTransactions;
    totalAmountSpan.textContent = formatFinancial(totalAmount);
    openingValueSpan.textContent = formatFinancial(opening);
    closingValueSpan.textContent = formatFinancial(closing);
}

function displayResults(results) {
    resultsTable.innerHTML = '';
    
    if (!results.length) {
        const row = resultsTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No transactions found';
        cell.className = 'no-results';
        return;
    }
    
    results.forEach(t => {
        const row = resultsTable.insertRow();
        row.setAttribute('data-year', t.year);
        row.setAttribute('data-description', t.description);
        row.setAttribute('data-amount', t.amount);
        
        row.insertCell().textContent = t.year || '';
        row.insertCell().textContent = t.poNumber || '';
        row.insertCell().textContent = t.site || '';
        row.insertCell().textContent = t.description || '';
        
        const amountCell = row.insertCell();
        amountCell.textContent = formatFinancial(t.amount);
        amountCell.className = 'financial';
    });
    
    filterResults();
}

function filterResults() {
    const year = yearFilter.value;
    const description = descriptionFilter.value.trim().toLowerCase();
    
    const rows = resultsTable.rows;
    let visibleCount = 0;
    let filteredAmount = 0;
    
    for (let row of rows) {
        const rowYear = row.getAttribute('data-year');
        const rowDesc = row.getAttribute('data-description').toLowerCase();
        const rowAmount = parseFloat(row.getAttribute('data-amount')) || 0;
        
        const showRow = (!year || rowYear === year) && 
                       (!description || rowDesc.includes(description));
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) {
            visibleCount++;
            filteredAmount += rowAmount;
        }
    }
    
    updateSummaryValues(visibleCount, filteredAmount, openingValue, closingValue);
}

function clearFilters() {
    yearFilter.value = '';
    descriptionFilter.value = '';
    filterResults();
}

function printReport() {
    if (!currentVehicleNumber) {
        alert('Please search for a vehicle first');
        return;
    }
    
    const preparedByName = "System Generated";
    const yearlySummary = generateYearlySummary(currentVehicleNumber);
    const filteredTransactions = getFilteredTransactions();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Vehicle Report - ${currentVehicleNumber}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                    
                    body { 
                        font-family: 'Roboto', sans-serif; 
                        margin: 0; 
                        padding: 0; 
                        color: #333;
                        background-color: #fff;
                    }
                    .container {
                        width: 100%;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .company-info {
                        text-align: left;
                    }
                    .company-name {
                        font-size: 24px;
                        font-weight: 700;
                        color: #2c3e50;
                        margin: 0;
                    }
                    .company-details {
                        font-size: 12px;
                        color: #7f8c8d;
                        margin-top: 5px;
                        line-height: 1.5;
                    }
                    .report-info {
                        text-align: right;
                    }
                    .report-title {
                        font-size: 20px;
                        font-weight: 500;
                        color: #2c3e50;
                        margin: 0;
                    }
                    .report-subtitle {
                        font-size: 16px;
                        color: #7f8c8d;
                        margin-top: 5px;
                    }
                    .report-meta {
                        font-size: 12px;
                        color: #7f8c8d;
                        margin-top: 10px;
                        line-height: 1.5;
                    }
                    .section {
                        margin-bottom: 30px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 500;
                        color: #2c3e50;
                        margin-bottom: 15px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    th {
                        background-color: #3498db;
                        color: white;
                        font-weight: 500;
                        padding: 12px 8px;
                        text-align: left;
                    }
                    td {
                        padding: 10px 8px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    tr:hover {
                        background-color: #f5f5f5;
                    }
                    .financial {
                        text-align: right;
                        font-family: 'Roboto Mono', monospace;
                        font-weight: 500;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .summary-item {
                        background-color: #f8f9fa;
                        border-radius: 5px;
                        padding: 15px;
                    }
                    .summary-label {
                        font-size: 13px;
                        color: #7f8c8d;
                        margin-bottom: 5px;
                    }
                    .summary-value {
                        font-size: 18px;
                        font-weight: 500;
                        color: #2c3e50;
                    }
                    .total-row {
                        font-weight: 500;
                        background-color: #f8f9fa;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        font-size: 12px;
                        color: #7f8c8d;
                        text-align: center;
                        line-height: 1.5;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                        .section {
                            page-break-inside: avoid;
                        }
                        * {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            color-adjust: exact;
                        }
                        th {
                            background-color: #3498db !important;
                            color: white !important;
                        }
                        .summary-item {
                            background-color: #f8f9fa !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="company-info">
                            <h1 class="company-name">IBA Trading & Contracting & Transportation WLL</h1>
                            <div class="company-details">
                                C-Ring Road, Building No: 223<br>
                                P.O.Box-15, Doha-Qatar<br>
                                Phone: +974 4040 3535
                            </div>
                        </div>
                        <div class="report-info">
                            <h2 class="report-title">Vehicle Transaction Report</h2>
                            <div class="report-subtitle">Vehicle #${currentVehicleNumber}</div>
                            <div class="report-meta">
                                Generated: ${formattedDate} at ${formattedTime}<br>
                                Prepared by: ${preparedByName}
                            </div>
                        </div>
                    </div>
                    
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Opening Value (1999-2024)</div>
                            <div class="summary-value financial">${formatFinancial(openingValue)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Closing Value (All Years)</div>
                            <div class="summary-value financial">${formatFinancial(closingValue)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Transactions</div>
                            <div class="summary-value">${filteredTransactions.length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Report Period</div>
                            <div class="summary-value">1999 - ${new Date().getFullYear()}</div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Yearly Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${yearlySummary.map(item => `
                                    <tr>
                                        <td>${item.year}</td>
                                        <td class="financial">${formatFinancial(item.amount)}</td>
                                    </tr>
                                `).join('')}
                                <tr class="total-row">
                                    <td><strong>Total</strong></td>
                                    <td class="financial"><strong>${formatFinancial(yearlySummary.reduce((sum, item) => sum + parseFloat(item.amount), 0))}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Transaction Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>PO Number</th>
                                    <th>Site</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredTransactions.map(transaction => `
                                    <tr>
                                        <td>${transaction.year || ''}</td>
                                        <td>${transaction.poNumber || ''}</td>
                                        <td>${transaction.site || ''}</td>
                                        <td>${transaction.description || ''}</td>
                                        <td class="financial">${formatFinancial(transaction.amount)}</td>
                                    </tr>
                                `).join('')}
                                <tr class="total-row">
                                    <td colspan="4"><strong>Total</strong></td>
                                    <td class="financial"><strong>${formatFinancial(filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0))}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="footer">
                        <p>Confidential - For internal use only</p>
                        <p>Page 1 of 1 | Generated by Vehicle Transaction System</p>
                    </div>
                    
                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Print Report</button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Window</button>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function getFilteredTransactions() {
    const transactions = [];
    const rows = resultsTable.rows;
    
    for (let row of rows) {
        if (row.style.display !== 'none') {
            transactions.push({
                year: row.getAttribute('data-year'),
                poNumber: row.cells[1].textContent,
                site: row.cells[2].textContent,
                description: row.getAttribute('data-description'),
                amount: row.getAttribute('data-amount')
            });
        }
    }
    
    return transactions;
}

function generateYearlySummary() {
    const summary = {};
    const transactions = vehicleDataMap.get(currentVehicleNumber) || [];
    
    transactions.forEach(t => {
        if (t.year) {
            summary[t.year] = (summary[t.year] || 0) + (parseFloat(t.amount) || 0);
        }
    });
    
    return Object.entries(summary)
        .map(([year, amount]) => ({ year, amount }))
        .sort((a, b) => a.year - b.year);
}

// Summary report functions
function generateVehicleSummary() {
    vehicleSummaryData = book7Data.map(vehicle => {
        const plate = vehicle.plate;
        const summary = {
            plate: plate,
            type: vehicle.type,
            brand: vehicle.brand,
            driver: vehicle.driver,
            total: 0
        };
        
        // Initialize yearly amounts
        for (let year = 2020; year <= 2025; year++) {
            summary[year] = 0;
        }
        
        // Get transactions for this vehicle
        const transactions = vehicleDataMap.get(plate) || [];
        
        // Calculate yearly totals
        transactions.forEach(transaction => {
            const year = parseInt(transaction.year);
            const amount = parseFloat(transaction.amount) || 0;
            
            if (year >= 2020 && year <= 2025) {
                summary[year] += amount;
                summary.total += amount;
            }
        });
        
        return summary;
    });
    
    renderSummaryReport();
}

function renderSummaryReport() {
    summaryTableBody.innerHTML = '';
    
    if (!vehicleSummaryData.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 15;
        cell.textContent = 'No vehicle data available';
        cell.className = 'no-results';
        row.appendChild(cell);
        summaryTableBody.appendChild(row);
        return;
    }
    
    // Sort by plate number
    vehicleSummaryData.sort((a, b) => a.plate.localeCompare(b.plate));
    
    let total2023 = 0;
    let highestSpending = { plate: '', amount: 0 };
    let grandTotal = 0;
    const yearTotals = {};
    
    // Initialize year totals
    for (let year = 2020; year <= 2025; year++) {
        yearTotals[year] = 0;
    }
    
    // Populate table rows
    vehicleSummaryData.forEach(vehicle => {
        const row = document.createElement('tr');
        
        // Plate
        const plateCell = document.createElement('td');
        plateCell.textContent = vehicle.plate;
        row.appendChild(plateCell);
        
        // Type
        const typeCell = document.createElement('td');
        typeCell.textContent = vehicle.type;
        row.appendChild(typeCell);
        
        // Brand
        const brandCell = document.createElement('td');
        brandCell.textContent = vehicle.brand;
        row.appendChild(brandCell);
        
        // Driver
        const driverCell = document.createElement('td');
        driverCell.textContent = vehicle.driver || 'No Driver';
        row.appendChild(driverCell);
        
        // Yearly amounts
        for (let year = 2020; year <= 2025; year++) {
            const amount = vehicle[year] || 0;
            const amountCell = document.createElement('td');
            amountCell.className = 'financial';
            amountCell.textContent = formatFinancial(amount);
            row.appendChild(amountCell);
            
            // Add to year totals
            yearTotals[year] += amount;
            
            // Track 2023 total
            if (year === 2023) {
                total2023 += amount;
            }
        }
        
        // Total
        const totalCell = document.createElement('td');
        totalCell.className = 'financial';
        totalCell.textContent = formatFinancial(vehicle.total);
        row.appendChild(totalCell);
        
        grandTotal += vehicle.total;
        
        // Track highest spending vehicle
        if (vehicle.total > highestSpending.amount) {
            highestSpending = {
                plate: vehicle.plate,
                amount: vehicle.total
            };
        }
        
        summaryTableBody.appendChild(row);
    });
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    
    totalRow.innerHTML = `
        <td colspan="4"><strong>GRAND TOTAL</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2020])}</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2021])}</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2022])}</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2023])}</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2024])}</strong></td>
        <td class="financial"><strong>${formatFinancial(yearTotals[2025])}</strong></td>
        <td class="financial"><strong>${formatFinancial(grandTotal)}</strong></td>
    `;
    
    summaryTableBody.appendChild(totalRow);
    
    // Update summary boxes
    totalVehiclesSpan.textContent = vehicleSummaryData.length;
    total2023Span.textContent = formatFinancial(total2023);
    highestSpendingSpan.textContent = `${highestSpending.plate} (${formatFinancial(highestSpending.amount)})`;
    lastUpdatedSpan.textContent = 'Just now';
}

function downloadSummaryCSV() {
    let csvContent = "Plate No.,Type,Brand,Driver,2020,2021,2022,2023,2024,2025,Total\n";
    
    vehicleSummaryData.forEach(vehicle => {
        const row = [
            `"${vehicle.plate}"`,
            `"${vehicle.type}"`,
            `"${vehicle.brand}"`,
            `"${vehicle.driver}"`
        ];
        
        for (let year = 2020; year <= 2025; year++) {
            row.push(vehicle[year] || 0);
        }
        
        row.push(vehicle.total);
        
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vehicle_summary_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printSummaryReport() {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Vehicle Summary Report</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                    
                    body { 
                        font-family: 'Roboto', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .company-info {
                        text-align: left;
                    }
                    .company-name {
                        font-size: 24px;
                        font-weight: 700;
                        color: #2c3e50;
                        margin: 0;
                    }
                    .report-title {
                        font-size: 20px;
                        font-weight: 500;
                        color: #2c3e50;
                        margin: 0;
                    }
                    .report-meta {
                        font-size: 12px;
                        color: #7f8c8d;
                        margin-top: 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        font-size: 12px;
                    }
                    th, td {
                        padding: 10px 8px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #3498db;
                        color: white;
                        font-weight: 500;
                    }
                    .financial {
                        text-align: right;
                    }
                    .year-header {
                        background-color: #e0e7ff;
                        text-align: center;
                    }
                    .total-row {
                        font-weight: 700;
                        background-color: #f0f7ff;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                    }
                    @media print {
                        @page {
                            size: landscape;
                        }
                        body {
                            padding: 10px;
                        }
                        * {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        th {
                            background-color: #3498db !important;
                            color: white !important;
                        }
			
                    }
			.action-buttons {
                        margin: 20px 0;
                        text-align: center;
                    }
                    .action-button {
                        padding: 10px 20px;
                        margin: 0 10px;
                        border: none;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    .print-button {
                        background-color: #3498db;
                        color: white;
                    }
                    .close-button {
                        background-color: #e74c3c;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-info">
                        <h1 class="company-name">IBA Trading & Contracting & Transportation WLL</h1>
                        <div class="report-meta">C-Ring Road, Building No: 223, P.O.Box-15, Doha-Qatar</div>
                    </div>
                    <div>
                        <h2 class="report-title">Vehicle Transaction Summary Report</h2>
                        <div class="report-meta">Generated: ${formattedDate}</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Plate No.</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Driver</th>
                            <th class="year-header">2020</th>
                            <th class="year-header">2021</th>
                            <th class="year-header">2022</th>
                            <th class="year-header">2023</th>
                            <th class="year-header">2024</th>
                            <th class="year-header">2025</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehicleSummaryData.map(vehicle => `
                            <tr>
                                <td>${vehicle.plate}</td>
                                <td>${vehicle.type}</td>
                                <td>${vehicle.brand}</td>
                                <td>${vehicle.driver || 'No Driver'}</td>
                                <td class="financial">${formatFinancial(vehicle[2020])}</td>
                                <td class="financial">${formatFinancial(vehicle[2021])}</td>
                                <td class="financial">${formatFinancial(vehicle[2022])}</td>
                                <td class="financial">${formatFinancial(vehicle[2023])}</td>
                                <td class="financial">${formatFinancial(vehicle[2024])}</td>
                                <td class="financial">${formatFinancial(vehicle[2025])}</td>
                                <td class="financial">${formatFinancial(vehicle.total)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td colspan="4"><strong>GRAND TOTAL</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2020] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2021] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2022] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2023] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2024] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + (v[2025] || 0), 0))}</strong></td>
                            <td class="financial"><strong>${formatFinancial(vehicleSummaryData.reduce((sum, v) => sum + v.total, 0))}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Confidential - For internal use only | Page 1 of 1</p>
                </div>

                
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 200);
                    };
                </script>
            <div class="action-buttons">
                    <button class="action-button print-button" onclick="window.print()">Print Report</button>
                    <button class="action-button close-button" onclick="window.close()">Close Window</button>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);