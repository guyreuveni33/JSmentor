const mongoose = require('mongoose');

// Define the schema for a code block
const codeBlockSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the code block (e.g., "Async Code Block")
    code: { type: String, required: true }, // Code template for this block
    solution: { type: String, required: true } // The solution to match for this block
});

// Create a model based on the schema
const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

module.exports = CodeBlock;
