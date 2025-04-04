// This file represents the database schema for Supabase

/*
Table: users
- id: uuid (primary key, default: uuid_generate_v4())
- created_at: timestamp with time zone (default: now())
- email: text (unique, not null)
- name: text
- avatar_url: text
- role: text (default: 'editor')
- preferences: jsonb (default: '{"theme": "system", "notifications": {"email": true, "push": true, "sms": false}, "productiveHours": {"start": 9, "end": 17}}')
*/

/*
Table: tasks
- id: uuid (primary key, default: uuid_generate_v4())
- created_at: timestamp with time zone (default: now())
- updated_at: timestamp with time zone (default: now())
- title: text (not null)
- description: text
- priority: integer (default: 3)
- deadline: timestamp with time zone
- completed: boolean (default: false)
- completed_at: timestamp with time zone
- created_by: uuid (references users.id)
- assigned_to: uuid (references users.id)
- team_id: uuid (references teams.id)
*/

/*
Table: task_dependencies
- id: uuid (primary key, default: uuid_generate_v4())
- task_id: uuid (references tasks.id, not null)
- depends_on_task_id: uuid (references tasks.id, not null)
- created_at: timestamp with time zone (default: now())
*/

/*
Table: task_tags
- id: uuid (primary key, default: uuid_generate_v4())
- task_id: uuid (references tasks.id, not null)
- tag_id: uuid (references tags.id, not null)
- created_at: timestamp with time zone (default: now())
*/

/*
Table: tags
- id: uuid (primary key, default: uuid_generate_v4())
- name: text (not null, unique)
- color: text (default: '#88D9E6')
- created_at: timestamp with time zone (default: now())
- team_id: uuid (references teams.id)
*/

/*
Table: teams
- id: uuid (primary key, default: uuid_generate_v4())
- name: text (not null)
- created_at: timestamp with time zone (default: now())
- created_by: uuid (references users.id)
*/

/*
Table: team_members
- id: uuid (primary key, default: uuid_generate_v4())
- team_id: uuid (references teams.id, not null)
- user_id: uuid (references users.id, not null)
- role: text (default: 'member')
- created_at: timestamp with time zone (default: now())
*/

/*
Table: task_analytics
- id: uuid (primary key, default: uuid_generate_v4())
- task_id: uuid (references tasks.id, not null)
- user_id: uuid (references users.id, not null)
- estimated_duration: integer (in minutes)
- actual_duration: integer (in minutes)
- scheduled_start: timestamp with time zone
- actual_start: timestamp with time zone
- created_at: timestamp with time zone (default: now())
*/

/*
Table: ai_suggestions
- id: uuid (primary key, default: uuid_generate_v4())
- user_id: uuid (references users.id, not null)
- suggestion_type: text (not null)
- suggestion_text: text (not null)
- applied: boolean (default: false)
- created_at: timestamp with time zone (default: now())
- expires_at: timestamp with time zone
*/

// SQL to create these tables is available in the database-setup.sql file

