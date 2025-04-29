import { FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';

export function formatMatchDate(match: any) {
  return {
    ...match,
    date: dayjs(match.date).format('YYYY-MM-DD HH:mm:ss'),
  };
};
