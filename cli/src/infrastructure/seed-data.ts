import type { Task } from '../../../src/core/domain/task.js'

const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400_000).toISOString()

export const SEED_TASKS: Task[] = [
  // Work
  {
    id: 'w1',
    title: 'Review quarterly OKRs',
    description: 'Go through Q1 OKRs and update progress notes for the team standup.',
    status: 'in_progress',
    category: 'Work',
    last_touched: hoursAgo(2),
    created_at: daysAgo(5),
    updated_at: hoursAgo(2),
  },
  {
    id: 'w2',
    title: 'Update API documentation',
    description: 'The /users and /auth endpoints are outdated. Add examples for the new token flow.',
    status: 'pending',
    category: 'Work',
    last_touched: daysAgo(5),
    created_at: daysAgo(10),
    updated_at: daysAgo(5),
  },
  {
    id: 'w3',
    title: 'Fix auth token refresh bug',
    description: 'Tokens expire silently — add refresh logic in the HTTP interceptor.',
    status: 'paused',
    category: 'Work',
    last_touched: daysAgo(2),
    created_at: daysAgo(8),
    updated_at: daysAgo(2),
  },

  // Personal
  {
    id: 'p1',
    title: 'Schedule dentist appointment',
    description: null,
    status: 'pending',
    category: 'Personal',
    last_touched: daysAgo(9),
    created_at: daysAgo(14),
    updated_at: daysAgo(9),
  },
  {
    id: 'p2',
    title: 'Organize bookshelf',
    description: 'Sort by genre, donate duplicates.',
    status: 'in_progress',
    category: 'Personal',
    last_touched: hoursAgo(6),
    created_at: daysAgo(3),
    updated_at: hoursAgo(6),
  },

  // Chores
  {
    id: 'ch1',
    title: 'Grocery shopping',
    description: 'Produce, oat milk, coffee beans, rice.',
    status: 'pending',
    category: 'Chores',
    last_touched: daysAgo(1),
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
  },
  {
    id: 'ch2',
    title: 'Fix leaky kitchen faucet',
    description: 'Washer replacement — parts already bought.',
    status: 'paused',
    category: 'Chores',
    last_touched: daysAgo(4),
    created_at: daysAgo(12),
    updated_at: daysAgo(4),
  },

  // Connection
  {
    id: 'cn1',
    title: 'Call Mom',
    description: null,
    status: 'pending',
    category: 'Connection',
    last_touched: daysAgo(8),
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: 'cn2',
    title: 'Plan dinner with Alex & Sam',
    description: 'Try the new Thai place downtown. Saturday evening works best.',
    status: 'in_progress',
    category: 'Connection',
    last_touched: hoursAgo(12),
    created_at: daysAgo(3),
    updated_at: hoursAgo(12),
  },

  // Hobby
  {
    id: 'h1',
    title: 'Practice guitar — Fleetwood Mac',
    description: 'Learning "Landslide" fingerpicking pattern.',
    status: 'in_progress',
    category: 'Hobby',
    last_touched: daysAgo(1),
    created_at: daysAgo(20),
    updated_at: daysAgo(1),
  },
  {
    id: 'h2',
    title: 'Finish reading "Dune Messiah"',
    description: null,
    status: 'paused',
    category: 'Hobby',
    last_touched: daysAgo(11),
    created_at: daysAgo(30),
    updated_at: daysAgo(11),
  },
  {
    id: 'h3',
    title: 'Sketch new logo ideas',
    description: 'Experimenting with geometric shapes and warm tones.',
    status: 'pending',
    category: 'Hobby',
    last_touched: daysAgo(3),
    created_at: daysAgo(7),
    updated_at: daysAgo(3),
  },

  // Rejuvenate
  {
    id: 'r1',
    title: 'Morning meditation — 10 min',
    description: 'Guided breathing, use the Calm app.',
    status: 'completed',
    category: 'Rejuvenate',
    last_touched: hoursAgo(3),
    created_at: daysAgo(1),
    updated_at: hoursAgo(3),
  },
  {
    id: 'r2',
    title: 'Go for a long walk in the park',
    description: null,
    status: 'pending',
    category: 'Rejuvenate',
    last_touched: daysAgo(4),
    created_at: daysAgo(6),
    updated_at: daysAgo(4),
  },
]
