import express from 'express';

const PORT = 4000;
const app = express();

app.get('/', (_, res) => {
  res.send('Hello there');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
