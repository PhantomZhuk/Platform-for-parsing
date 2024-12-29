import puppeteer from "puppeteer-extra";
import * as cheerio from "cheerio";
import { Services } from "../models/services";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer'
import TelegramBot from "node-telegram-bot-api";
// import randomUseragent from "random-useragent";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
//     polling: true,
// })

// bot.onText(/\/start/, async (msg) => {

//     const chatId = msg.chat.id;

//     // Кнопка для запиту номера телефону
//     const keyboard = {
//         reply_markup: {
//             keyboard: [
//                 [
//                     {
//                         text: "Надіслати номер телефону",
//                         request_contact: true, // Запитує контакт
//                     },
//                 ],
//             ],
//             resize_keyboard: true, // Змінює розмір кнопок під екран користувача
//             one_time_keyboard: true, // Закриває клавіатуру після вибору
//         },
//     };

//     bot.sendMessage(
//         chatId,
//         "Будь ласка, надішліть ваш номер телефону:",
//         keyboard
//     );
// });

// // Обробляємо отримання контактів
// bot.on("contact", async (msg) => {
//     const contact = msg.contact;
//     const chatId = msg.chat.id;

//     if (contact) {
//         const phoneNumber = contact.phone_number;
//         const user = await User.findOne({ phone: phoneNumber }).lean();

//         if (user) {
//             bot.sendMessage(
//                 chatId,
//                 `Дякуємо! Ваш номер телефону: ${phoneNumber} і такого користувача знайдено в базі даних`
//             );
//         } else {
//             bot.sendMessage(
//                 chatId,
//                 `Дякуємо! Ваш номер телефону: ${phoneNumber} і такого користувача не знайдено в базі даних`
//             );
//         }

//         // Можете зберегти номер у базі даних тут
//     }
// });

// // Додатковий обробник
// bot.on("message", (msg) => {
//     if (!msg.contact) {
//         bot.sendMessage(
//             msg.chat.id,
//             "Натисніть на кнопку, щоб поділитися номером телефону."
//         );
//     }
// });



const SECRET_KEY: string = process.env.SECRET_KEY!;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;

interface IProduct {
    productName: string;
    price: string;
    photo: string;
    pageLink: string;
    exists: boolean;
    className: string;
}

interface IRandimProduct {
    productName: string;
    price: string;
    photo: string;
    pageLink: string;
}

interface IProducts {
    productName: string;
    price: string;
    photo: string;
    pageLink: string;
}

interface ImailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}

function authenticateToken(req, res, next): void {
    const token: string = req.cookies.token;
    if (!token) return res.status(401).send({ message: "Access token required" })

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD
    }
})

let randomCode: string;

export default {
    // getProductsFromSearch: async (req, res) => {
    //     try {
    //         const { searchText } = req.body;
    //         const service = await Services.findOne({ domain: 'https://rozetka.com.ua/ua/' });
    //         if (!service) throw new Error('Service not found');

    //         const browser = await puppeteer.launch({ headless: false });
    //         const page = await browser.newPage();

    //         const initialUrl = `${service.domain}${service.search.normalText}${searchText}`;
    //         await page.goto(initialUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    //         await new Promise((resolve) => setTimeout(resolve, 4000));

    //         const finalUrl = page.url();

    //         await page.goto(finalUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    //         await page.waitForSelector(`${service.html.ul}`, { visible: true, timeout: 60000 });

    //         const html = await page.content();
    //         const $ = cheerio.load(html);

    //         const data: IProduct[] = [];
    //         $(`.${service.html.ul} li`).each((index, element) => {
    //             const productName: string = $(element).find(`${service.html.name}`).text().trim();
    //             const price: string = $(element).find(`${service.html.price}`).text().trim();
    //             const photo: string = $(element).find(`${service.html.image} img`).attr('src')!;
    //             const pageLink: string = $(element).find(`${service.html.pageLink}`).attr('href')!;
    //             const exists: boolean = service.html.availability.exists;
    //             const className: string = $(element).find(`${service.html.availability.className}`).text().trim();
    //             data.push({
    //                 productName,
    //                 price,
    //                 photo,
    //                 pageLink,
    //                 exists,
    //                 className,
    //             });
    //         });

    //         const filteredData = data.filter(item =>
    //             item.productName && item.price && item.pageLink && item.photo
    //         );

    //         res.json(filteredData);
    //         await browser.close();
    //     } catch (err) {
    //         console.error('Error:', err);
    //         res.status(500).send({ error: 'Something went wrong', details: err.message });
    //     }
    // },
    getRandomProducts: async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--window-size=10x10',
                    '--disable-gpu',
                    '--window-position=-10000,-10000',
                ]
            });
            const page = await browser.newPage();
            await page.goto(`https://rozetka.com.ua/ua/promo/newyear/?gad_source=1&gclid=EAIaIQobChMI-P2gyemsigMVRLODBx287TcIEAAYASAAEgKYWPD_BwE`, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise((resolve) => setTimeout(resolve, 4000));
            await page.waitForSelector(`.catalog-grid`, { visible: true, timeout: 60000 });
            const html = await page.content();
            const $ = cheerio.load(html);
            const data: IRandimProduct[] = [];
            $(`.catalog-grid li`).each((index, element) => {
                const productName: string = $(element).find(`.goods-tile__title`).text().trim();
                const price: string = $(element).find(`.goods-tile__price-value`).text().trim();
                const photo: string = $(element).find(`.goods-tile__picture img`).attr('src')!;
                const pageLink: string = $(element).find(`.product-link a`).attr('href')!;
                data.push({
                    productName,
                    price,
                    photo,
                    pageLink,
                });
            });

            let filterData: IRandimProduct[] = data.filter(item =>
                item.productName && item.price && item.pageLink && item.photo
            );

            res.json(filterData.length > 12 ? filterData.slice(0, 12) : filterData);
            await browser.close();
        } catch (err) {
            console.log(err);
        }
    },
    getProductByUrl: async (req, res) => {
        try {
            const { url } = req.body;
            if (!url) throw new Error('Url is required');
            const service = await Services.findOne({ domain: 'https://rozetka.com.ua/ua/' });
            if (!service) throw new Error('Service not found');
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--window-size=10x10',
                    '--disable-gpu',
                    '--window-position=-10000,-10000',
                ]
            });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await new Promise((resolve) => setTimeout(resolve, 4000));
            await page.waitForSelector(service.html.ul, { visible: true, timeout: 60000 });
            const html = await page.content();
            const $ = cheerio.load(html);
            const data: IProducts[] = [];
            $(service.html.ul).each((index, element) => {
                const productName: string = $(element).find(service.html.name).text().trim();
                const price: string = $(element).find(service.html.price).text().trim();
                const photo: string = $(element).find(service.html.image).attr('src')!;
                const pageLink: string = $(element).find(service.html.pageLink).attr('href')!;
                data.push({
                    productName,
                    price,
                    photo,
                    pageLink,
                });
            });

            let filterData: IProducts[] = data.filter(item =>
                item.productName && item.price && item.pageLink && item.photo
            );

            res.json(filterData);
            await browser.close();
        } catch (err) { console.log(err) };
    },
    fetchProductFromServices: async (req, res) => {
        try {
            const { searchText } = req.body;
            const services = await Services.find({ serviceName: { $ne: "Rozetka" } });
            if (!services) throw new Error('Service not found');
            const dataProducts: IProduct[] = [];
            for (let service of services) {
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();
                const initialUrl: string = `${service.domain}${service.search.normalText}${searchText}`;
                await page.goto(initialUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
                // await new Promise((resolve) => setTimeout(resolve, 4000));
                await page.waitForSelector(`.${service.html.ul}`, { visible: true, timeout: 60000 });
                const html = await page.content();
                const $ = cheerio.load(html);
                const data: IProduct[] = [];
                $(`.${service.html.ul}`).each((index, element) => {
                    const productName: string = $(element).find(`${service.html.name}`).text().trim();
                    const price: string = $(element).find(`${service.html.price}`).text().trim();
                    const photo: string = $(element).find(`${service.html.image} img`).attr('src')!;
                    const pageLink: string = $(element).find(`${service.html.pageLink}`).attr('href')!;
                    const exists: boolean = service.html.availability.exists;
                    const className: string = $(element).find(`${service.html.availability.className}`).text().trim();
                    if (productName.includes(searchText)) {
                        data.push({
                            productName,
                            price,
                            photo,
                            pageLink,
                            exists,
                            className,
                        });
                    }
                });

                const filteredData = data.filter(item =>
                    item.productName && item.price && item.pageLink && item.photo
                );

                const lowestPrice: number = Math.min(...filteredData.map(item => parseFloat(item.price)));
                dataProducts.push(...filteredData.filter(item => parseFloat(item.price) === lowestPrice));
                await browser.close();
            }

            res.json(dataProducts);
        } catch (err) {
            console.log(err);
        }
    },
    addVisit: async (req, res) => {
        try {
            const serviceName = req.body.serviceName;
            const service = await Services.findOne({ serviceName });
            if (!service) throw new Error("Service not found");
            await service.addVisit(1);
            await service.save();
        } catch (err) {
            console.log(err);
        }
    },
    mailConfirmation: async (req, res) => {
        try {
            const { email } = req.body;
            randomCode = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
            const mailOptions: ImailOptions = {
                from: "Parser platform",
                to: email,
                subject: "Confirm your email",
                text: randomCode
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        error: 'Failed to send email'
                    })
                } else {
                    console.log(`Message was sent: ${info.response}`)
                    return res.status(200).json({
                        message: 'Email sent successfully'
                    })
                }
            })
        } catch (err) { console.log(err); }
    },
    signUp: async (req, res) => {
        try {
            const { login, email, phone, password, userRandomCode } = req.body;
            if (randomCode === userRandomCode) {
                const token: string = jwt.sign({ login: login, email: email }, SECRET_KEY, { expiresIn: '15m' });
                const refreshToken: string = jwt.sign({ login: login, email: email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                const user = await User.findOne({ email });
                if (user) return res.status(400).json({ message: "User already exists" });
                const newUser = new User(
                    {
                        login,
                        email,
                        password: bcrypt.hashSync(password, 10),
                        photo: "",
                        observedProducts: []
                    }
                );
                await newUser.save();
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                    .cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 15 * 60 * 1000
                    })
            } else {
                res.status(400).json({ message: "Invalid code" });
            }
        } catch (err) { console.log(err); }
    },
    signIn: async (req, res) => {
        try {
            const { login, password, email } = req.body;

            if ((!login && !password) || !email) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = login
                ? await User.findOne({ login })
                : await User.findOne({ email });

            const isPasswordValid = await bcrypt.compare(password, user!.password);
            if (!user || !isPasswordValid) {
                return res.status(404).json({ message: "User not found" });
            }

            const token: string = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '15m' });
            const refreshToken: string = jwt.sign({ _id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 15 * 60 * 1000
                })
        } catch (err) {
            console.log(err);
        }
    },
    protected: [authenticateToken, async (req, res) => {
        res.json({ message: 'This is a secure route', user: req.user });
    }],
    refresh: async (req, res) => {
        const refreshToken: string = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user: any) => {
            if (err) {
                console.error('Refresh token verification error:', err);
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const newToken: string = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '15m' });
            res.cookie('token', newToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000
            })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
        })
    },
    getUserInfo: async (req, res) => {
        try {
            const token: string = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Access token required" });
            }
            const userID = jwt.verify(token, SECRET_KEY) as { _id: string };
            const user = await User.findOne({ _id: userID._id });
            res.status(200).json({ user });
        } catch (err) { console.log(err); }
    },
    logout: async (req, res) => {
        res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'none', maxAge: 0 })
            .cookie('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'none', maxAge: 0 })
    },
    updateUserInfo: async (req, res) => {
        try {
            const token: string = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Access token required" });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.photo = req.file.path;
            }

            const userID = jwt.verify(token, SECRET_KEY) as { _id: string };
            const user = await User.findOneAndUpdate({ _id: userID._id }, { updateData }, { new: true });
            res.status(200).json({ user });
        } catch (err) { console.log(err) };
    },
    deleteUser: async (req, res) => {
        try {
            const token: string = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Access token required" });
            }
            const userID = jwt.verify(token, SECRET_KEY) as { _id: string };
            await User.findOneAndDelete({ _id: userID._id });
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) { console.log(err) };
    },
    addProductFreezer: async (req, res) => {
        try {
            const token: string = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Access token required" });
            }
            const userID = jwt.verify(token, SECRET_KEY) as { _id: string };
            const { product } = req.body;
            const user = await User.findOneAndUpdate({ _id: userID._id }, { $push: { observedProducts: product } }, { new: true });
            res.status(200).json({ user });
        } catch (err) { console.log(err) }
    },
    // goodSubscription: async (req, res) => {
    //     try {
    //         console.log("here");
    //         // const goodId = req.body.goodId;
    //         res.json({ message: "Good subscription created" });
    //         // await bot.sendMessage(
    //         //   1998558386,
    //         //   Створено нову відписку з товаром ${goodId}
    //         // );
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },
}