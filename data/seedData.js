const mongoose = require('mongoose');

module.exports = {
  users: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000011'),
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
      _id: new mongoose.Types.ObjectId('650000000000000000000001'),
      name: 'Technology',
      description: 'Technology and software events'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000002'),
      name: 'Business',
      description: 'Business and entrepreneurship events'
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000003'),
      name: 'Music',
      description: 'Music and entertainment events'
    }
  ],

  events: [
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000101'),
      title: 'Node.js Workshop',
      description: 'Learn how to build APIs with Node.js and MongoDB.',
      category: 'Technology',
      organizer: 'admin@example.com',
      date: '2026-09-15T18:00:00',
      city: 'Atlanta',
      venue: 'Atlanta Convention Center',
      capacity: 100
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000102'),
      title: 'Startup Meetup',
      description: 'A meetup for entrepreneurs and startup founders.',
      category: 'Business',
      organizer: 'admin@example.com',
      date: '2026-10-01T17:00:00',
      city: 'Paris',
      venue: 'Carrousel du Louvre',
      capacity: 150
    },
    {
      _id: new mongoose.Types.ObjectId('650000000000000000000103'),
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
      _id: new mongoose.Types.ObjectId('650000000000000000000104'),
      title: 'Entrepreneurship & Innovation Summit',
      description:
        'A full-day event bringing together entrepreneurs, innovators, and aspiring founders to share ideas and explore new opportunities.',
      category: 'Business',
      organizer: 'admin@example.com',
      date: '2026-11-05T10:00:00',
      city: 'Pasay',
      venue: 'SMX Convention Center Manila',
      capacity: 250
    }
  ]
};