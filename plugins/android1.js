const cheerio = require('cheerio')
const axios = require('axios')

const searchAndro1 = async(query) => {
const res = await axios.get(`https://an1.com/tags/MOD/?story=Stickman&do=search&subaction=search`)
const $ = cheerio.load(res.data)
const k = $('div')
$(k).find('.search-results > .inner').each(function(a, b) {
let hasil = []
let judul =  $(b).find('.left > .title').find('a').text()
let link = $(b).find('.left > .title').find('a').attr('href')
let thumb = $(b).find('span > img').attr('src')
hasil.push({ judul, link, thumb })
return hasil
})
}
const downAndro1 = async (link) => {
let base = `https://an1.com/`
let url = base + link
res = await axios.get(url)
$ = cheerio.load(res.data)
const k = $('div').find('.white-box')
let hasil = []
let judul = $(k).find('div > h1').text() 

let thumb = $(k).find('div > div > img').attr('src')

let dev = $(k).find('div > .text.dev > span').text()

let andro = $(k).find
('div > .text.android').text()

let versi = $(k).find
('div > .text.version').text()

let genre = $(k).find('div > .text.class').text() 

let updated = $(k).find('.inner > .item > span > time').text() 

let size = $('div.item:nth-child(2) > span:nth-child(2)').text()

let install = $('div.item:nth-child(3) > span:nth-child(2)').text()

let rated = $('div.item:nth-child(4) > span:nth-child(2)').text()

let link = base + $(k).find('.get-product-holder > a').attr('href')

const bes = await axios.get(link)

let dl_link = $('div').find('span').toString() 

hasil.push({ judul, thumb, dev, andro, versi, genre, updated, link, size, install, rated})

return hasil
}

module.exports = { searchAndro1, downAndro1}