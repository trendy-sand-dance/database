import { FastifyRequest, FastifyReply } from 'fastify';

export const sendFriendRequest = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

const user = await prisma.user.create({
	data: {
	  email: 'ariadne@prisma.io',
	  name: 'Ariadne',
	  posts: {
		create: [
		  {
			title: 'My first day at Prisma',
			categories: {
			  create: {
				name: 'Office',
			  },
			},
		  },
		  {
			title: 'How to connect to a SQLite database',
			categories: {
			  create: [{ name: 'Databases' }, { name: 'Tutorials' }],
			},
		  },
		],
	  },
	},
  })
}

export const receiveFriendRequest = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

	const user = await prisma.user.create({
		data: {
		  email: 'ariadne@prisma.io',
		  name: 'Ariadne',
		  posts: {
			create: [
			  {
				title: 'My first day at Prisma',
				categories: {
				  create: {
					name: 'Office',
				  },
				},
			  },
			  {
				title: 'How to connect to a SQLite database',
				categories: {
				  create: [{ name: 'Databases' }, { name: 'Tutorials' }],
				},
			  },
			],
		  },
		},
	  })
	}