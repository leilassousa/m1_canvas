1. auth.users Table (Supabase Default)
Handles authentication and stores user credentials.

Columns:
id: UUID (Primary Key)
email: User email
password: User password (managed by Supabase)

2. profiles Table
Stores user-related data, including administrative status.

Columns:
id: UUID (Primary Key, references auth.users)
email: User email (unique)
full_name: Full name of the user
is_admin: Boolean, marks admin users
created_at: Timestamp of profile creation
updated_at: Timestamp of last update

3. categories Table
Organizes questions into groups or themes.

Columns:
id: Serial (Primary Key)
name: Name of the category (unique)
description: Description of the category (optional)

4. preambles Table
Stores explanatory texts or preambles for categories.

Columns:
id: Serial (Primary Key)
text: Preamble content
category_id: Foreign Key, references categories(id)

5. questions Table
Defines assessment questions linked to categories.

Columns:
id: Serial (Primary Key)
text: Question text
category_id: Foreign Key, references categories(id)
is_active: Boolean, marks active/inactive questions (default TRUE)

6. assessments Table
Tracks individual user assessments.

Columns:
id: UUID (Primary Key)
created_at: Timestamp of creation
updated_at: Timestamp of last update
user_id: Foreign Key, references auth.users(id)
title: Title of the assessment
status: Text (draft, completed)

7. answers Table
Stores answers provided by users in assessments.

Columns:
id: UUID (Primary Key)
created_at: Timestamp of answer creation
updated_at: Timestamp of last update
assessment_id: Foreign Key, references assessments(id)
question_id: Foreign Key, references questions(id)
value: Integer, user’s rating (1–10)
text: Answer explanation or notes
category: Text, identifies the related category

8. reports Table
Tracks generated reports for assessments.

Columns:
id: Serial (Primary Key)
user_id: Foreign Key, references profiles(id)
assessment_id: Foreign Key, references assessments(id)
generated_at: Timestamp of report generation
file_url: Path or URL of the PDF report

9. purchases Table
Tracks user purchases or subscriptions.

Columns:
id: Serial (Primary Key)
user_id: Foreign Key, references profiles(id)
product_id: Integer, identifies the purchased product or plan
purchase_date: Timestamp of purchase
status: Text (pending, completed, failed)
amount: Numeric, purchase amount

Relationships:
profiles ↔ auth.users: One-to-one (user authentication linked to profile data).
assessments ↔ auth.users: One-to-many (users can have multiple assessments).
answers ↔ assessments: One-to-many (an assessment can have multiple answers).
questions ↔ categories: One-to-many (categories contain multiple questions).
preambles ↔ categories: One-to-one or one-to-many (categories can have preambles).
reports ↔ assessments: One-to-one (each assessment generates one report).
purchases ↔ profiles: One-to-many (users can make multiple purchases).

RLS and Security Policies:
RLS is enabled for all tables (profiles, categories, preambles, questions, assessments, answers, reports, purchases).
Policies ensure users can only access their own data, with special permissions for admins.