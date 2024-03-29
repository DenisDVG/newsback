const PORT = process.env.PORT || 8000
const express = require('express')
var cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

var whitelist = ['http://localhost:8001/', 
'http://localhost:8001', 
'http://news-general-news.cf',
'https://news193.p.rapidapi.com/',
'https://news193.p.rapidapi.com',
'https://news-general.neocities.org/',
'https://news-general.neocities.org']
var corsOptions = {
  origin: function (origin, callback) {
    console.log("origin", origin);
    console.log("whitelist.indexOf(origin)", whitelist.indexOf(origin));
    if (whitelist.indexOf(origin) > -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    },
    {
        name: 'abcnews',
        address: 'https://abcnews.go.com/International/',
        base: ''
    }
]

let articles = []


app.get('/', cors(corsOptions), (req, res) => {
    articles = [];
    axios.get("https://abcnews.go.com/International/")
    .then(response => 
        {
            const html = response.data
            const $ = cheerio.load(html)

            $('.ContentRoll__Item').each(function () {
                

                //const title = $(this).text()
                const htmlThis = $(this).html();
                const anchorLink = $('.AnchorLink', htmlThis);
                const urlL1 = $(anchorLink).attr('href');
                const contentRollDesc = $('.ContentRoll__Desc', htmlThis);
                const images = $('img', htmlThis);
                const images1 = $(images).attr('src');
                console.log("-------------------------------------------------------");
                console.log($(this).html());

                articles.push({
                    title:  $(anchorLink).text(),
                    url: urlL1,
                    urlToImage: "",
                    description: $(contentRollDesc).text(),
                    logoUrl: "https://s.abcnews.com/assets/dtci/icomoon/svg/logo.svg",
                    name: "abc News",
                    source:{
                        id: "abcnews",
                        name: "abc News"
                    }

                })
            })
            console.log(articles.length);
            res.json(articles)
        }
    );

})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
