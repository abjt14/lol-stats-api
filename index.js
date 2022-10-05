const express = require('express');
const cors = require('cors')
const api = require('./src/api.js');

const app = express();
const port = 3001;

app.use(cors());

app.listen(port, () => {
  // console.log(`Listening on port ${port}`);
})

const mainAPI = async (summoner) => {
  let data = [];

  const playerInfo = await api.getPlayerInfo(summoner);

  const puuid = playerInfo.puuid;
  const matchIDs = await api.getMatchIDs(puuid);
  for (const id of matchIDs) {
    data.push(await api.getMatchData(id, puuid));
  }

  return await Promise.all(data);
}

app.get('/search', async (req, res) => {
  const summoner = req.query.summoner;
  const data = await mainAPI(summoner);

  return res.json(data);
})