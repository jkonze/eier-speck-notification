import RSS from 'rss-parser'
import users from '../users.json'
import twilio from 'twilio'

const twilioClient = twilio(process.env.TWILIO_ASID, process.env.TWILIO_KEY);
const parser = new RSS();

const searchStartDate = new Date("Tue, 10 Dec 2018 12:00:00 +0100").getTime();

let checkInterval;

function isRelevant(item) {
    let title = item.title.toLowerCase();
    return (title.includes('vorverkauf') || title.includes('sale'))
        && new Date(item.pubDate).getTime() > searchStartDate
}

async function checkForNews() {
    let newsFeed = await parser.parseURL(process.env.RSS_URL);
    let timeStamp = new Date().toISOString();
    console.log(`Checking now: ${timeStamp}`);
    newsFeed.items.forEach(item => {
        if (isRelevant(item)) {
            users.users.forEach(async (user) => {
                try {
                    await twilioClient.messages
                        .create({
                            from: 'whatsapp:+14155238886',
                            body: `${item.title} - das könnte interessant sein\nhttps://www.eiermitspeck.de/news`,
                            to: `whatsapp:${user.phone}`
                        });
                    console.log(`Message sent to ${user.name}`);
                } catch (e) {
                    console.log(e);
                }
            });
            clearInterval(checkInterval);
            console.log('Done');
        }
    });
}

async function start() {
    let feed = await parser.parseURL(process.env.RSS_URL);
    console.log(`Starting ticket watcher for: ${feed.title}`);
    checkInterval = setInterval(checkForNews, (+process.env.INTERVAL_MINUTES) * 1000 * 60);
}


start().then(() => {
    console.log(`Watching...`);
}).catch((e) => {
    console.log(e);
});

