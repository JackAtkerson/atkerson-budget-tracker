//create a vriable to hold the db connection
let db;

//establish a connection to IndexedDB database called 'budget-tracker' and set it to version 1
const request = indexedDB.open('budget-tracker', 1);

//will emit when the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};


request.onsuccess = function(event) {
    db = event.target.result;
    //check if app is online
    if (navigator.onLine) {
        //uploadTransaction();
    }
};


request.onerror = function(event) {
    console.log(event.target.errorCode);
};

//will execute if there is no internet connection
function saveRecord(record) {
    //open new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    //access object store for 'new_transaction'
    const budgetObjectStore = transaction.objectStore('new_transaction');

    //add record to your store with add method
    budgetObjectStore.add(record);
}