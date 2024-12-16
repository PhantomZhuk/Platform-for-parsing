const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Services } = require("../models/services");
const { timeout } = require("puppeteer");
const { set } = require("mongoose");

module.exports = {
    getProductsFromSearch: async (req, res) => {
        try {
            const { searchText } = req.body;
            const service = await Services.findOne({ domain: 'https://rozetka.com.ua/ua/' });
            if (!service) throw new Error('Service not found');

            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();

            const initialUrl = `${service.domain}${service.search.normalText}${searchText}`;
            await page.goto(initialUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            await new Promise((resolve) => setTimeout(resolve, 4000));

            const finalUrl = page.url();

            await page.goto(finalUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            await page.waitForSelector(`.${service.html.ul}`, { visible: true, timeout: 60000 });

            const html = await page.content();
            const $ = cheerio.load(html);

            const data = [];
            $(`.${service.html.ul} li`).each((index, element) => {
                const productName = $(element).find(`.${service.html.name}`).text().trim();
                const price = $(element).find(`.${service.html.price}`).text().trim();
                const photo = $(element).find(`.${service.html.image} img`).attr('src');
                const pageLink = $(element).find(`.${service.html.pageLink}`).attr('href');
                const exists = service.html.availability.exists;
                const className = $(element).find(`.${service.html.availability.className}`).text().trim();
                data.push({
                    productName,
                    price,
                    photo,
                    pageLink,
                    exists,
                    className,
                });
            });

            const filteredData = data.filter(item =>
                item.productName && item.price && item.pageLink && item.photo
            );

            res.json(filteredData);
            await browser.close();
        } catch (err) {
            console.error('Error:', err);
            res.status(500).send({ error: 'Something went wrong', details: err.message });
        }
    },
    getRandomProducts: async (req, res) => {
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(`https://rozetka.com.ua/ua/promo/newyear/?gad_source=1&gclid=EAIaIQobChMI-P2gyemsigMVRLODBx287TcIEAAYASAAEgKYWPD_BwE`, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForSelector(`.catalog-grid`, { visible: true, timeout: 60000 });
            const html = await page.content();
            const $ = cheerio.load(html);
            const data = [];
            $(`.catalog-grid li`).each((index, element) => {
                const productName = $(element).find(`.goods-tile__title`).text().trim();
                const price = $(element).find(`.goods-tile__price-value`).text().trim();
                const photo = $(element).find(`.goods-tile__picture img`).attr('src');
                const pageLink = $(element).find(`.product-link a`).attr('href');
                if (data.length < 10) {
                    data.push({
                        productName,
                        price,
                        photo,
                        pageLink,
                    });
                }else {
                    return;
                }
            });

            res.json(data);
            await browser.close();
        } catch (err) {
            console.log(err);
        }
    }
}