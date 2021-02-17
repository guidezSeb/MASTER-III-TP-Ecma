import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({
  logger: true
});

//REQUETE CHAT
const promise1 = new Promise((resolve => {
  axios.get("https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3")
    .then((response) => {
      let tab = [];
      for (let i = 0; i < response.data.length; i++) {
        tab.push(response.data[i].text);
      }
      resolve(tab);
    })
})).catch(error => resolve(null));

//REQUETE RENARD
const promise2 = new Promise((resolve => {
  axios.get("https://randomfox.ca/floof/")
    .then((response) => {
      resolve(response.data.image);
    })
})).catch(error => resolve(null));

//REQUETE VACANCES
const promise3 = (countryCode) => {

return new Promise((resolve) => {
  axios.get('https://date.nager.at/Api/v2/NextPublicHolidays/'+ countryCode)
    .then((response) => {
      resolve(response.data);
    }).catch(error => resolve(null));
})
}
//AFFICHAGE
const fetchAsyncData = async (countryCode) => {
  const waitp1 = await promise1;
  const waitp2 = await promise2;
  const waitp3 = await promise3(countryCode);
  let tab = {}
  return Promise.all([waitp1, waitp2, waitp3]).then(res => {
    tab['foxPicture'] = res[1];
    tab['catFacts'] = res[0];
    tab['holidays'] = res[2];
    return tab;
  })
}

//POST
app.post('/', async (request, res) => {
  return fetchAsyncData(request.body.countryCode);
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);

  }
};
start();