import { FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatMatchDate(match) {
	return {
	  ...match,
	  date: dayjs.tz(match.date, "Europe/Berlin").format('YYYY-MM-DD HH:mm:ss'),
	};
  };

export function formatChatDate(chat) {
return {
	...chat,
	date: dayjs.tz(chat.date, "Europe/Berlin").format('YYYY-MM-DD HH:mm:ss'),
	};
};


export function formatMatchHistory(match, userId) {

	let opponentUsername;

	if (match.winner == userId)
		opponentUsername = match.lost.username;
	else
		opponentUsername = match.won.username;

	return {
			...match,
			date: dayjs.tz(match.date, "Europe/Berlin").format('YYYY-MM-DD HH:mm:ss'),
			opponent: opponentUsername
			};
	};