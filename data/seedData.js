// The seed file gets too crowded with the seed data so i added it seperately

module.exports = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    },
    {
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      password: 'password123',
      role: 'attendee'
    },
    {
      name: 'Sara Mohamed',
      email: 'sara@example.com',
      password: 'password123',
      role: 'attendee'
    }
  ],

  categories: [
    {
      name: 'Technology',
      description: 'Technology and software events'
    },
    {
      name: 'Business',
      description: 'Business and entrepreneurship events'
    },
    {
      name: 'Music',
      description: 'Music and entertainment events'
    }
  ],

  events: [
    {
      title: 'Node.js Workshop',
      description: 'Learn how to build APIs with Node.js and MongoDB.',
      category: 'Technology',
      organizer: 'admin@example.com',
      date: '2026-09-15T18:00:00',
      city: 'Alexandria',
      venue: 'Alexandria Library',
      capacity: 100
    },
    {
      title: 'Startup Meetup',
      description: 'A meetup for entrepreneurs and startup founders.',
      category: 'Business',
      organizer: 'admin@example.com',
      date: '2026-10-01T17:00:00',
      city: 'Alexandria',
      venue: 'Bibliotheca Alexandria',
      capacity: 150
    },
    {
      title: 'Live Music Night',
      description: 'An evening of live music and entertainment.',
      category: 'Music',
      organizer: 'admin@example.com',
      date: '2026-10-10T20:00:00',
      city: 'Alexandria',
      venue: 'Concert Hall',
      capacity: 200
    },
    {
    title: 'Entrepreneurship & Innovation Summit',
    description: 'A full-day event bringing together entrepreneurs, innovators, and aspiring founders to share ideas and explore new opportunities.',
    category: 'Business',
    organizer: 'admin@example.com',
    date: '2026-11-05T10:00:00',
    city: 'Alexandria',
    venue: 'San Stefano Grand Plaza',
    capacity: 250
    }
  ]
};