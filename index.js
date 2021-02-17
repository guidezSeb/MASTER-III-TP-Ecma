import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({
  logger: true
});

// app.get('/', async (req, res) => {  
//   return {
//     message: `Welcome to Node Babel with ${
//       req.body?.testValue ?? 'no testValue' 
//     }`,
//   };
// });

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

const promise2 = new Promise((resolve => {
  axios.get("https://randomfox.ca/floof/")
    .then((response) => {
      resolve(response.data.image);
    })
})).catch(error => resolve(null));

const promise3 = new Promise((resolve => {
  axios.get("https://date.nager.at/Api/v2/NextPublicHolidays/FR")
    .then((response) => {
      resolve(response.data);
    })
})).catch(error => resolve(null));

const fetchAsyncData = async () => {
  let tab = {}
  return Promise.all([promise1, promise2, promise3]).then(res => {
    tab['foxPicture'] = res[1];
    tab['catFacts'] = res[0];
    tab['holidays'] = res[2];
    return tab;
  })
}

//API CAT
app.get('/', async () => {
  return fetchAsyncData();
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