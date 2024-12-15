const { Services, Availability, Search, HTML } = require('../models/services');

module.exports = {
    createServices: async (req, res) => {
        try {
            let { domain, normalText, additionalText, ul, name, link, price, image, pageLink, exists, className } = req.body;
            const availability = new Availability({ exists, className });
            const html = new HTML({ ul, name, link, price, image, pageLink, availability });
            const search = new Search({ normalText, additionalText });
            const services = new Services({ domain, search, html });
            await services.save();
            res.json(services);
        } catch (err) {
            console.log(err);
        }
    }
};