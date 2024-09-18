const mongoose = require('mongoose');

// Define the schema for a code block
const codeBlockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    solution: { type: String, required: true }
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

module.exports = CodeBlock;
