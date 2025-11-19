/* import { createClient } from 'redis';
const redisClient = createClient({
    username: 'default',
    password: 'xZDPpg3E4bT8TkMjdYCiJDu39Si1AsaL',
    socket: {
        host: 'redis-16582.c261.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16582
    },
});

redisClient.on('error', err => {
    console.log(`error time ${new Date().toLocaleTimeString('en-IN')}`);
    return console.log('Redis Client Error', err);
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Connected to redis");
    } catch (e) {
        console.log("Error Redis : " + e);
    }
}

export default redisClient; */