const mongoose = require('mongoose');
const CodeBlock = require('../models/codeBlock');
//this code is for seeding the database with some code blocks to be used in the application
mongoose.connect('mongodb+srv://guyhaim55:Uw17m373rAz93CJ8@cluster0.fsmj5.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB for seeding...');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const seedCodeBlocks = async () => {
    const codeBlocks = [
        {
            name: 'Async Case',
            code: `async function fetchData() {
  // Your code here
  return await fetch('/api/data');
}`,
            solution: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}`
        },
        {
            name: 'Array Filter Case',
            code: `function filterEvenNumbers(arr) {
  // Your code here
  return arr.filter();  // Filtering logic needed
}`,
            solution: `function filterEvenNumbers(arr) {
  return arr.filter(num => num % 2 === 0);   
}`
        },
        {
            name: 'Promise Case',
            code: `function makePromise() {
  return new Promise((resolve, reject) => {
    // Your code here
  });
}`,
            solution: `function makePromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Promise Resolved');
    }, 1000);  
  });
}`
        },
        {
            name: 'Object Destructuring Case',
            code: `function displayUserInfo(user) {
  // Your code here
  // Use destructuring to get name and age from user object
}`,
            solution: `function displayUserInfo(user) {
  const { name, age } = user;   
  return \`Name: \${name}, Age: \${age}\`;
}`
        },
        {
            name: 'Callback Case',
            code: `function executeCallback(callback) {
  // Your code here
}`,
            solution: `function executeCallback(callback) {
  if (typeof callback === 'function') {
    callback('Callback executed');
  }
}`
        }
    ];

    try {
        await CodeBlock.insertMany(codeBlocks);
        console.log('Code blocks seeded successfully!');
    } catch (error) {
        console.error('Error seeding code blocks:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedCodeBlocks();