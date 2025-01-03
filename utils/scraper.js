import axios from 'axios'
import cheerio from 'cheerio'
import { faker } from '@faker-js/faker'

export async function scrapeListings() {
  const url = "https://www.kleinanzeigen.de/s-seite:2/iphone/k0"
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': faker.internet.userAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    const listings = []

    $('article.aditem').each((_, element) => {
      const $el = $(element)
      
      listings.push({
        article_id: $el.attr('data-adid'),
        title: $el.find('h2.text-module-begin').text().trim(),
        price: $el.find('p.aditem-main--middle--price-shipping--price').text().trim(),
        location: $el.find('div.aditem-main--top--left').text().trim(),
        timestamp: $el.find('div.aditem-main--top--right').text().trim(),
        description: $el.find('p.aditem-main--middle--description').text().trim(),
        last_seen: new Date().toISOString(),
      })
    })

    return listings
  } catch (error) {
    console.error('Scraping error:', error)
    throw error
  }
} 