import * as restify from 'restify';
import * as bot from './bot';

const PORT = (process.env.PORT || process.env.port || 3978);
const server = restify.createServer();

server.post('/api/messages', bot.default.connector('*').listen());

server.listen(PORT, () => {
    util.log(`ICD2Bot service is listening on port ${PORT}.`);
});