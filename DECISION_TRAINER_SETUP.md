# Decision Trainer Setup Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Run Database Migrations

Run these SQL files in Supabase SQL Editor **in this order**:

```sql
-- 1. First, add time tracking columns
-- File: database/add_time_tracking.sql
```

```sql
-- 2. Then, run main schema (if not already done)
-- File: database/decision_trainer_schema.sql
```

### Step 2: Create Storage Bucket (Manual - UI Only)

**⚠️ Important:** Storage buckets must be created via the Dashboard UI, not SQL.

**Quick Method:**
1. Go to Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Name: `decision-trainer`
4. **Check** "Public bucket"
5. Click **"Create bucket"**
6. Done! ✅

**Advanced Method (with policies):**
1. Create bucket as above
2. Click on bucket → **Policies** → **New Policy**
3. Create 4 policies:
   - **Public Access** (SELECT): `true`
   - **Authenticated Upload** (INSERT): `auth.role() = 'authenticated'`
   - **Admin Update** (UPDATE): Check if user is admin
   - **Admin Delete** (DELETE): Check if user is admin

**See `database/create_decision_trainer_bucket.sql` for detailed policy definitions.**

### Step 3: Test the System

1. **Admin Panel**: `/admin/scenarios`
   - Create a test scenario
   - Upload an image
   - Verify preview shows
   - Save and check it appears in list

2. **Decision Trainer**: `/decision-trainer`
   - Select a category
   - Verify timer counts down (30s)
   - Answer questions
   - Check completion time shown

3. **Leaderboard**: `/decision-trainer/leaderboard`
   - Verify your score appears
   - Check time is displayed
   - Confirm sorting works

---

## 📋 Features Checklist

### Database ✅
- [x] `decision_trainer_scenarios` table
- [x] `decision_trainer_progress` table with time columns
- [x] `decision_trainer_attempts` table
- [x] `decision_trainer_badges` table
- [x] Leaderboard view with time tracking
- [x] RLS policies for security

### Storage ✅
- [x] `decision-trainer` bucket created
- [x] Public access for images
- [x] Upload permissions for authenticated users
- [x] Admin-only delete permissions
- [x] 5MB file size limit
- [x] Image type restrictions

### Admin Panel ✅
- [x] Create scenarios
- [x] Edit scenarios
- [x] Delete scenarios
- [x] Upload images with preview
- [x] Image validation (type & size)
- [x] Remove uploaded images
- [x] Loading states
- [x] Error handling
- [x] Success notifications

### Decision Trainer ✅
- [x] 30-second timer per scenario
- [x] Visual countdown
- [x] Red warning at 10 seconds
- [x] Auto-advance on timeout
- [x] Total time tracking
- [x] XP and streak display
- [x] Wrong answer explanations
- [x] Real-world tips

### Leaderboard ✅
- [x] Best time display
- [x] Average time tracking
- [x] Sorted by XP then time
- [x] User highlighting
- [x] Rank icons (🥇🥈🥉)
- [x] Accuracy percentage
- [x] Categories completed

---

## 🎯 Usage Guide

### For Admins

**Creating a Scenario:**

1. Go to `/admin/scenarios`
2. Click "New Scenario"
3. Fill in:
   - **ID**: Unique (e.g., `tl-006`)
   - **Category**: Select from dropdown
   - **Level**: 1-4 (difficulty)
   - **Question**: The scenario question
   - **Image**: Optional (click to upload)
   - **Options**: 4 choices (check correct one)
   - **Explanations**: Why wrong answers are wrong
   - **Correct Explanation**: Why correct answer is right
   - **Real-World Tip**: Practical advice
   - **XP**: Points awarded (10-50)
4. Click "Create Scenario"

**Uploading Images:**

- Click file input
- Select image (JPEG, PNG, GIF, WebP)
- Max size: 5MB
- Preview appears automatically
- Click X to remove
- Image uploads when you save scenario

### For Users

**Taking a Quiz:**

1. Go to `/decision-trainer`
2. Select a category
3. Read question carefully
4. Watch the timer! ⏱️
5. Select your answer
6. Click "Submit Answer"
7. Read explanation (learn!)
8. Click "Next Scenario"
9. Complete all scenarios
10. Check your time and XP!

**Timer Rules:**

- 30 seconds per scenario
- Blue = plenty of time
- Red & pulsing = under 10 seconds
- Auto-advances if time runs out
- Total time tracked for category

---

## 🔧 Troubleshooting

### Issue: "Column does not exist" error

**Solution:**
```sql
-- Run this migration first:
-- database/add_time_tracking.sql
```

### Issue: Image upload fails

**Checks:**
1. Bucket exists: `decision-trainer`
2. Bucket is public
3. File size < 5MB
4. File type is image
5. User is authenticated

**Fix:**
```sql
-- Re-run: database/create_decision_trainer_bucket.sql
```

### Issue: Timer not working

**Checks:**
1. Clear browser cache
2. Check console for errors
3. Verify state updates
4. Refresh page

### Issue: Leaderboard empty

**Checks:**
1. Complete at least one category
2. Check database has progress records
3. Verify view exists
4. Run migration if needed

---

## 📊 Database Schema

### Tables

**decision_trainer_scenarios**
```
- id (TEXT, PK)
- category (TEXT)
- level (INTEGER 1-4)
- question (TEXT)
- image_url (TEXT, nullable)
- options (JSONB)
- correct_explanation (TEXT)
- real_world_tip (TEXT)
- xp (INTEGER)
- is_active (BOOLEAN)
```

**decision_trainer_progress**
```
- id (UUID, PK)
- user_id (UUID, FK)
- category (TEXT)
- total_xp (INTEGER)
- scenarios_completed (INTEGER)
- correct_answers (INTEGER)
- total_attempts (INTEGER)
- current_streak (INTEGER)
- best_streak (INTEGER)
- best_time_seconds (INTEGER) ← NEW
- average_time_seconds (INTEGER) ← NEW
```

### Views

**decision_trainer_leaderboard**
- Aggregates user stats
- Includes time tracking
- Sorted by XP, then time
- Shows best and average times

---

## 🎨 UI Components

### Admin Scenarios Page

**Features:**
- Tabbed by category
- Create/Edit/Delete
- Image upload with preview
- Form validation
- Loading states
- Toast notifications

**Image Upload:**
- Drag & drop support
- File type validation
- Size validation (5MB)
- Instant preview
- Remove button
- Upload progress

### Decision Trainer Page

**Features:**
- Category selection
- Timer display
- Progress bar
- XP tracking
- Streak counter
- Feedback messages
- Educational tips

**Timer:**
- 30s countdown
- Color-coded (blue/red)
- Pulse animation
- Auto-advance
- Total time tracking

### Leaderboard Page

**Features:**
- Rank display
- User highlighting
- Time display
- Stats breakdown
- Responsive design
- Real-time updates

---

## 🔒 Security

### RLS Policies

**Scenarios:**
- Anyone can view active scenarios
- Only admins can create/edit/delete

**Progress:**
- Users can only see their own data
- Users can only update their own data

**Storage:**
- Public read access
- Authenticated upload
- Admin-only delete

### Validation

**Client-side:**
- File type checking
- File size limits
- Form validation
- Input sanitization

**Server-side:**
- RLS enforcement
- Type checking
- Size limits
- MIME type validation

---

## 📈 Performance

### Optimizations

- Indexed columns for fast queries
- View for aggregated leaderboard
- Image size limits
- Lazy loading
- Debounced updates

### Monitoring

- Check Supabase logs
- Monitor storage usage
- Track query performance
- Review error rates

---

## ✅ Production Checklist

- [ ] All migrations run successfully
- [ ] Storage bucket created and configured
- [ ] Test scenario creation works
- [ ] Test image upload works
- [ ] Test timer functionality
- [ ] Test leaderboard display
- [ ] Verify RLS policies active
- [ ] Check error handling
- [ ] Test on mobile devices
- [ ] Review performance
- [ ] Monitor for errors
- [ ] Set up backups

---

## 🎉 You're Done!

The Decision Trainer is now fully set up and production-ready!

**Quick Links:**
- Admin: `/admin/scenarios`
- Trainer: `/decision-trainer`
- Leaderboard: `/decision-trainer/leaderboard`

**Need Help?**
- Check console for errors
- Review Supabase logs
- Verify all migrations ran
- Test with sample data
