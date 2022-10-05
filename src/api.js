const API_TOKEN = 'RGAPI-dbbb78dd-64d0-4691-8067-73457770bf1d';
const axios = require('axios');
const items = require('../static/json/items.json');

const getPlayerInfo = async(summoner) => {
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`;

  const options = {
    method: 'get',
    url: url,
    headers: {
      'X-Riot-Token': API_TOKEN
    }
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const getMatchIDs = async(puuid) => {
  const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`;

  const options = {
    method: 'get',
    url: url,
    params: {
      count: 5
    },
    headers: {
      'X-Riot-Token': API_TOKEN
    }
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const getMatchData = async(match_id, puuid) => {
  const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${match_id}`;

  const options = {
    method: 'get',
    url: url,
    headers: {
      'X-Riot-Token': API_TOKEN
    }
  };

  try {
    const response = await axios(options);
    const returnData = filterMatchData(response.data.info, puuid);

    return returnData;
  } catch (error) {
    console.error(error);
  }
}

const filterMatchData = (data, puuid) => {
  const participantData = data.participants.filter(e => e.puuid === puuid).find(Boolean);

  let {
    win,
    gameDuration,
    summonerName,
    championID,
    championName,
    champLevel,
    kills,
    deaths,
    assists,
    item0,
    item1,
    item2,
    item3,
    item4,
    item5,
    item6,
  } = participantData;

  function itemDataFilter(id) {
    return {
      name: id !== 0 ? items.data[id].name : null,
      image: id !== 0 ? items.data[id].image.full: null,
    }
  }
  const itemData = [
    itemDataFilter(item0),
    itemDataFilter(item1),
    itemDataFilter(item2),
    itemDataFilter(item3),
    itemDataFilter(item4),
    itemDataFilter(item5),
    itemDataFilter(item6),
  ];

  return {
    summonerName: summonerName,
    win: win,
    gameDuration: gameDuration,
    championData: {
      championID: championID,
      championName: championName,
      champLevel: champLevel,
    },
    kda: {
      kills: kills,
      deaths: deaths,
      assists: assists
    },
    items: itemData
  };
}

module.exports = {
  getPlayerInfo,
  getMatchIDs,
  getMatchData,
};