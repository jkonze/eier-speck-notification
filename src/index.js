import RSS from 'rss-parser'
import dotenv from 'dotenv'
import users from '../users.json'

const env = dotenv.config();
const parser = new RSS();

let checkInterval;

async function checkForNews() {
    let newsFeed = await parser.parseURL(process.env.RSS_URL);

    console.log(new Date().toLocaleDateString("de-DE"));
    newsFeed.items.forEach(item => {
        if(item.title.includes('Vorverkauf') && new Date(item.pubDate).getTime() > new Date("Mon, 10 Dec 2018 11:12:00 +0100").getTime() ) {
            console.log(item.title);
            console.log(new Date(item.pubDate).getTime());
            clearInterval(checkInterval);
            console.log('Done');
        }
    });
}

async function start() {
    let feed = await parser.parseURL(process.env.RSS_URL);
    console.log(`Starting ticket watcher for: ${feed.title}`);
    checkInterval = setInterval(checkForNews, (+process.env.INTERVAL_MINUTES)*1000*60);
}


start();

