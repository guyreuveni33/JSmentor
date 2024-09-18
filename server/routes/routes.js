const CodeBlock = require('../models/codeBlock');

const setupRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send('Welcome to the Code Mentor API');
    });

    app.get('/codeblocks', async (req, res) => {
        console.log('Fetching code blocks from the database...');
        try {
            const codeBlocks = await CodeBlock.find();
            console.log(`Found ${codeBlocks.length} code blocks`);
            res.json(codeBlocks);
        } catch (error) {
            console.error('Error fetching code blocks:', error.message);
            res.status(500).send('Server error');
        }
    });
};

module.exports = setupRoutes;