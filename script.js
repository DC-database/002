// Global variables
let allData = [];
let vehicleDataMap = new Map();
let openingValue = 0;
let closingValue = 0;
let currentVehicleNumber = '';

// DOM elements
const filtersSection = document.querySelector('.filters');
const vehicleNumberInput = document.getElementById('vehicleNumber');
const searchBtn = document.getElementById('searchBtn');
const printBtn = document.getElementById('printBtn');
const yearFilter = document.getElementById('yearFilter');
const descriptionFilter = document.getElementById('descriptionFilter');
const clearDescriptionBtn = document.getElementById('clearDescriptionBtn');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const totalTransactionsSpan = document.getElementById('totalTransactions');
const totalAmountSpan = document.getElementById('totalAmount');
const openingValueSpan = document.getElementById('openingValue');
const closingValueSpan = document.getElementById('closingValue');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.querySelector('.results');

// Initialize the application
function init() {
    // Set up event listeners
    searchBtn.addEventListener('click', searchTransactions);
    printBtn.addEventListener('click', printReport);
    yearFilter.addEventListener('change', filterResults);
    descriptionFilter.addEventListener('input', filterResults);
    clearDescriptionBtn.addEventListener('click', () => {
        descriptionFilter.value = '';
        filterResults();
    });
    
    vehicleNumberInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchTransactions();
        }
    });
    
    // Automatically load data from GitHub
    loadCSVFromURL();
}

// Format number as financial (no currency symbol)
function formatFinancial(num) {
    return parseFloat(num || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Load and parse CSV from GitHub URL
function loadCSVFromURL() {
    const url = "https://raw.githubusercontent.com/DC-database/Invoice/main/Vehicle.csv";
    
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data.filter(row => row['Year']);
            processData(allData);
            
            // Show UI components
            filtersSection.style.display = 'block';
            resultsSection.style.display = 'block';
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            console.log(`Data loaded successfully from GitHub! Found ${vehicleDataMap.size} unique vehicle numbers`);
        },
        error: function(error) {
            console.error('Error loading CSV from GitHub:', error);
            loadingIndicator.innerHTML = `
                <div style="color: red; padding: 20px;">
                    <p>Error loading data from GitHub</p>
                    <p>${error.message || 'Please check console for details'}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    });
}

// Process the parsed data and create vehicle number mapping
function processData(data) {
    vehicleDataMap.clear();
    
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    
    const knownVehicleNumbers = [
        "4735", "4896", "13890", "17745", "24004", "29391", "31062", "31107", "32218", 
        "33930", "34026", "35237", "36588", "37481", "37510", "47054", "47055", "47524", 
        "49921", "51421", "56551", "59150", "66588", "66589", "74186", "79723", "104498", 
        "105086", "117325", "125790", "132981", "134037", "134494", "145057", "145759", 
        "167502", "167503", "180212", "191684", "192934", "192955", "193120", "206713", 
        "220190", "238490", "250117", "254081", "254258", "262203", "281839", "314419", 
        "318505", "345468", "456102", "456103", "458630", "507521", "526051", "672193", 
        "751056", "95128", "95137", "334239", "820045", "179713", "279977", "317673",
        "925770", "102095", "173492", "78209", "195891", "220266", "78409", "174186", 
        "698271", "H281840-37510", "H281839-37481", "H145759-13890", "281840", "238184"
    ];
    
    const vehicleNumberColumns = [];
    headers.forEach((header, index) => {
        const cleanHeader = header.trim();
        if (knownVehicleNumbers.includes(cleanHeader)) {
            vehicleNumberColumns.push({
                index: index,
                vehicleNumber: cleanHeader
            });
        }
    });
    
    data.forEach(row => {
        const transaction = {
            year: row['Year'],
            poNumber: row['PO #'],
            site: row['Project #'],
            description: row['Description'],
            amount: row['Delivered Amount']
        };
        
        vehicleNumberColumns.forEach(col => {
            const vehicleNumber = col.vehicleNumber;
            const columnName = headers[col.index];
            
            if (row[columnName] && row[columnName].trim() !== '') {
                if (!vehicleDataMap.has(vehicleNumber)) {
                    vehicleDataMap.set(vehicleNumber, []);
                }
                vehicleDataMap.get(vehicleNumber).push(transaction);
            }
        });
    });
    
    // Populate year filter
    const years = new Set();
    data.forEach(row => {
        if (row['Year']) years.add(row['Year']);
    });
    yearFilter.innerHTML = '<option value="">All Years</option>';
    Array.from(years).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Create vehicle number datalist
    const vehicleNumbers = Array.from(vehicleDataMap.keys()).sort();
    const datalist = document.createElement('datalist');
    datalist.id = 'vehicleNumbers';
    vehicleNumbers.forEach(num => {
        const option = document.createElement('option');
        option.value = num;
        datalist.appendChild(option);
    });
    document.body.appendChild(datalist);
    vehicleNumberInput.setAttribute('list', 'vehicleNumbers');
}

// Calculate opening and closing values for a specific vehicle
function calculateOpeningClosingValues(vehicleNumber) {
    openingValue = 0;
    closingValue = 0;
    currentVehicleNumber = vehicleNumber;
    
    if (!vehicleNumber) {
        openingValueSpan.textContent = formatFinancial(openingValue);
        closingValueSpan.textContent = formatFinancial(closingValue);
        return;
    }
    
    const transactions = vehicleDataMap.get(vehicleNumber) || [];
    
    transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount) || 0;
        const year = parseInt(transaction.year);
        
        if (!isNaN(year)) {
            if (year >= 1999 && year <= 2024) {
                openingValue += amount;
            }
            closingValue += amount;
        }
    });
    
    openingValueSpan.textContent = formatFinancial(openingValue);
    closingValueSpan.textContent = formatFinancial(closingValue);
}

// Search transactions by vehicle number
function searchTransactions() {
    const vehicleNumber = vehicleNumberInput.value.trim();
    
    if (!vehicleNumber) {
        alert('Please enter a vehicle number');
        return;
    }
    
    if (!vehicleDataMap.has(vehicleNumber)) {
        displayResults([]);
        calculateOpeningClosingValues(null);
        alert('No transactions found for vehicle number: ' + vehicleNumber);
        return;
    }
    
    const transactions = vehicleDataMap.get(vehicleNumber);
    displayResults(transactions);
    calculateOpeningClosingValues(vehicleNumber);
}

// Display results in the table
function displayResults(results) {
    resultsTable.innerHTML = '';
    
    if (results.length === 0) {
        const row = resultsTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No transactions found';
        cell.className = 'no-results';
        
        totalTransactionsSpan.textContent = '0';
        totalAmountSpan.textContent = '0.00';
        return;
    }
    
    let totalAmount = 0;
    
    results.forEach(transaction => {
        const row = resultsTable.insertRow();
        row.setAttribute('data-year', transaction.year);
        row.setAttribute('data-description', transaction.description);
        row.setAttribute('data-amount', transaction.amount);
        
        row.insertCell().textContent = transaction.year || '';
        row.insertCell().textContent = transaction.poNumber || '';
        row.insertCell().textContent = transaction.site || '';
        row.insertCell().textContent = transaction.description || '';
        
        const amountCell = row.insertCell();
        amountCell.textContent = formatFinancial(transaction.amount);
        amountCell.className = 'financial';
        
        totalAmount += parseFloat(transaction.amount) || 0;
    });
    
    totalTransactionsSpan.textContent = results.length;
    totalAmountSpan.textContent = formatFinancial(totalAmount);
}

// Filter results based on year and description
function filterResults() {
    const year = yearFilter.value;
    const description = descriptionFilter.value.trim().toLowerCase();
    
    const rows = Array.from(resultsTable.getElementsByTagName('tr')).filter(row => !row.classList.contains('total-row'));
    let visibleCount = 0;
    let totalAmount = 0;
    
    for (let row of rows) {
        const rowYear = row.getAttribute('data-year');
        const rowDescription = row.getAttribute('data-description').toLowerCase();
        const rowAmount = parseFloat(row.getAttribute('data-amount')) || 0;
        
        const yearMatch = !year || rowYear === year;
        const descriptionMatch = !description || rowDescription.includes(description);
        
        if (yearMatch && descriptionMatch) {
            row.style.display = '';
            visibleCount++;
            totalAmount += rowAmount;
        } else {
            row.style.display = 'none';
        }
    }
    
    // Update total row
    const totalRow = resultsTable.querySelector('.total-row');
    if (totalRow) {
        const totalCell = totalRow.cells[4];
        totalCell.textContent = formatFinancial(totalAmount);
    }
    
    totalTransactionsSpan.textContent = visibleCount;
    totalAmountSpan.textContent = formatFinancial(totalAmount);
}

// Get currently filtered transactions from the table
function getFilteredTransactions() {
    const rows = resultsTable.getElementsByTagName('tr');
    const filteredTransactions = [];
    
    for (let row of rows) {
        if (row.style.display !== 'none') {
            filteredTransactions.push({
                year: row.getAttribute('data-year'),
                poNumber: row.cells[1].textContent,
                site: row.cells[2].textContent,
                description: row.getAttribute('data-description'),
                amount: row.getAttribute('data-amount')
            });
        }
    }
    
    return filteredTransactions;
}

// Generate yearly summary for a vehicle
function generateYearlySummary(vehicleNumber) {
    if (!vehicleNumber || !vehicleDataMap.has(vehicleNumber)) return [];
    
    const transactions = vehicleDataMap.get(vehicleNumber);
    const yearlySummary = {};
    
    transactions.forEach(transaction => {
        const year = transaction.year;
        const amount = parseFloat(transaction.amount) || 0;
        
        if (year) {
            if (!yearlySummary[year]) {
                yearlySummary[year] = 0;
            }
            yearlySummary[year] += amount;
        }
    });
    
    return Object.entries(yearlySummary)
        .map(([year, amount]) => ({ year, amount }))
        .sort((a, b) => a.year - b.year);
}

// Print report function
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
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);