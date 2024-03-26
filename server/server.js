const express = require('express');
const { ApolloServer } = require('@apollo/server-express');
const path = require('path');
const { authMiddleware } = require('./utils/Auth');
require('dotenv').config();
const mongoose = require('mongoose');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// MongoDB connection string with password from environment variable
const uri = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas', err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Apply middleware before Apollo Server middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

server.applyMiddleware({ app, path: '/graphql' });

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
