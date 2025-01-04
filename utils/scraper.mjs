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

    const $ = cheerio.load(response.data)
    const listings = []

    console.log('Looking for articles...')
    const articles = $('article.aditem')
    console.log('Found articles:', articles.length)

    articles.each((index, element) => {
      const $el = $(element)
      
      // Debug the HTML structure
      const titleSection = $el.find('.aditem-main--middle')
      console.log(`Article ${index + 1} title section:`, titleSection.html())

      // Get the URL and title from the correct elements
      const linkElement = $el.find('.aditem-main--middle h2.text-module-begin a')
      const articleId = linkElement.attr('name')
      const relativeUrl = linkElement.attr('href')
      const title = linkElement.text().trim()
      const absoluteUrl = relativeUrl ? `https://www.kleinanzeigen.de${relativeUrl}` : null

      // Debug URL and title extraction
      console.log(`Article ${index + 1} parsing:`, {
        articleId,
        relativeUrl,
        absoluteUrl,
        title
      })

      // Get thumbnail URL
      const thumbnailImg = $el.find('.imagebox.srpimagebox img').first()
      const thumbnailUrl = thumbnailImg.attr('src') || thumbnailImg.attr('data-src')

      const listing = {
        article_id: articleId || $el.attr('data-adid'),
        title: title,
        price: $el.find('p.aditem-main--middle--price-shipping--price').text().trim(),
        location: $el.find('div.aditem-main--top--left').text().trim(),
        timestamp: $el.find('div.aditem-main--top--right').text().trim(),
        description: $el.find('p.aditem-main--middle--description').text().trim(),
        url: absoluteUrl,
        thumbnail_url: thumbnailUrl,
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