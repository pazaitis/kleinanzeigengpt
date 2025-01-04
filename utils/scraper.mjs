import axios from 'axios'
import * as cheerio from 'cheerio'
import { faker } from '@faker-js/faker'

export async function scrapeListings() {
  const url = "https://www.kleinanzeigen.de/s-seite:2/iphone/k0"
  
  try {
    console.log('Fetching URL:', url)
    const response = await axios.get(url, {
      headers: {
        'User-Agent': faker.internet.userAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })
    console.log('Response status:', response.status)
    console.log('Response data length:', response.data.length)

    const $ = cheerio.load(response.data)
    const listings = []

    console.log('Looking for articles...')
    const articles = $('article.aditem')
    console.log('Found articles:', articles.length)

    articles.each((index, element) => {
      const $el = $(element)
      const listing = {
        article_id: $el.attr('data-adid'),
        title: $el.find('h2.text-module-begin').text().trim(),
        price: $el.find('p.aditem-main--middle--price-shipping--price').text().trim(),
        location: $el.find('div.aditem-main--top--left').text().trim(),
        timestamp: $el.find('div.aditem-main--top--right').text().trim(),
        description: $el.find('p.aditem-main--middle--description').text().trim(),
        last_seen: new Date().toISOString(),
      }
      console.log(`Parsed listing ${index + 1}:`, listing)
      listings.push(listing)
    })

    console.log('Total listings parsed:', listings.length)
    return listings
  } catch (error) {
    console.error('Scraping error details:', {
      message: error.message,
      response: error.response?.status,
      data: error.response?.data
    })
    throw error
  }
} 