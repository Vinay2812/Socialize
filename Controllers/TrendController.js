const twitter = require('twitter');

const client = new  twitter({
    consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_API_KEY,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_SECRET_ACCESS_TOKEN
})

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}
const getTrends = async(req, res)=>{
    const id = req.query.woeid;
    try {
        const twitter_trends = await client.get(`/trends/place.json`, {
            id: id
        });

         

        const trends = twitter_trends[0].trends.map((trend)=>{
            if(trend.tweet_volume > 0) {
                const data = {
                    name: !trend.name.startsWith("#")?"#"+trend.name:trend.name,
                    url: trend.url,
                    shares: kFormatter(trend.tweet_volume)
                }
                return data;
            }
            else{
                return null;
            }
        }).filter((trend)=>trend!==null);

        res.status(200).json(trends);
    } catch (err) {
        console.log(err)
    }
    
};

const getWoeid = async(req, res)=>{

};

module.exports = {getTrends, getWoeid}