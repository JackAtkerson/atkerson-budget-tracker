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
        uploadTransaction();
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
};

function uploadTransaction() {
    //open a transaction in your browser
    const transaction = db.transaction(['new-transaction'], 'readwrite');

    //access object store
    const budgetObjectStore = transaction.objectStore('new_transaction');

    //get all objects from store and set to a variable
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        //send any data to api server
        if(getAll.result.length > 0) {
            fetch('/api/transaction', {
                metod: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open another transaction
                    const transaction = db.transaction(['new_transaction'], 'readwrite');
                    //access the 'new_transaction' object store
                    const budgetObjectStore = transaction.objectStore('new_transaction');
                    //clear all items in your store
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted')
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
};

//listen for app coming back online
window.addEventListener('online', uploadTransaction);