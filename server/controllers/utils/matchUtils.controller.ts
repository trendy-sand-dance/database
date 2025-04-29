import { FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';

export async function formatDate(match: any) {
  return {
	...match,
	date: dayjs(match.date).format('YYYY-MM-DD HH:MM'),
  };
};

