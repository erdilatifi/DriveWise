# 🔧 Database Troubleshooting Guide

## ❌ Problem: Test Results Not Saving

### **Quick Checks**

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Complete a test
   - Look for error messages

2. **Expected Console Output:**
   ```
   💾 Attempting to save test attempt with data: {...}
   ✅ Test attempt saved successfully: {...}
   ```

3. **If You See Errors:**
   - Note the error code
   - Note the error message
   - Follow troubleshooting steps below

---

## 🔍 Common Issues & Solutions

### **Issue 1: Table Doesn't Exist**

**Error:** `relation "test_attempts" does not exist`

**Solution:**
```sql
-- Run this in Supabase SQL Editor:
database/database.sql
```

**Verify:**
```sql
SELECT * FROM test_attempts LIMIT 1;
```

---

### **Issue 2: Column Mismatch**

**Error:** `column "xxx" does not exist`

**Check Table Structure:**
```sql
-- Run: database/check_test_attempts.sql
```

**Expected Columns:**
- `id` (UUID)
- `user_id` (UUID)
- `category` (VARCHAR)
- `test_number` (VARCHAR)
- `score` (INTEGER)
- `total_questions` (INTEGER)
- `percentage` (DECIMAL)
- `time_taken_seconds` (INTEGER)
- `is_assigned` (BOOLEAN)
- `assigned_by` (UUID)
- `started_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP)

---

### **Issue 3: RLS Policy Blocking**

**Error:** `new row violates row-level security policy`

**Check RLS Status:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'test_attempts';
```

**Should Show:** `rowsecurity = false` (RLS disabled)

**If RLS is enabled, disable it:**
```sql
ALTER TABLE test_attempts DISABLE ROW LEVEL SECURITY;
```

---

### **Issue 4: Foreign Key Constraint**

**Error:** `violates foreign key constraint`

**Check User Profile Exists:**
```sql
SELECT id, email FROM user_profiles 
WHERE id = 'YOUR_USER_ID';
```

**If Not Found, Create Profile:**
```sql
INSERT INTO user_profiles (id, email, full_name)
VALUES ('YOUR_USER_ID', 'your@email.com', 'Your Name');
```

---

### **Issue 5: Permission Denied**

**Error:** `permission denied for table test_attempts`

**Grant Permissions:**
```sql
GRANT ALL ON test_attempts TO authenticated;
GRANT ALL ON test_attempts TO anon;
```

---

## 🧪 Test Database Manually

### **1. Check Table Exists:**
```sql
SELECT COUNT(*) FROM test_attempts;
```

### **2. Try Manual Insert:**
```sql
INSERT INTO test_attempts (
  user_id,
  category,
  test_number,
  score,
  total_questions,
  percentage,
  completed_at
) VALUES (
  (SELECT id FROM user_profiles LIMIT 1), -- Use existing user
  'A',
  '1',
  8,
  10,
  80.00,
  NOW()
) RETURNING *;
```

### **3. Check If Data Saved:**
```sql
SELECT * FROM test_attempts 
ORDER BY completed_at DESC 
LIMIT 5;
```

---

## 📊 Verify Leaderboard View

### **1. Check View Exists:**
```sql
SELECT * FROM tests_leaderboard LIMIT 5;
```

### **2. If View Doesn't Exist:**
```sql
-- Run: database/create_tests_leaderboard.sql
```

### **3. Verify View Returns Data:**
```sql
SELECT 
  full_name,
  total_tests,
  average_score
FROM tests_leaderboard
ORDER BY average_score DESC;
```

---

## 🔄 Complete Reset (If Needed)

### **⚠️ WARNING: This deletes all test data!**

```sql
-- 1. Drop and recreate table
DROP TABLE IF EXISTS test_attempt_answers CASCADE;
DROP TABLE IF EXISTS test_attempts CASCADE;

-- 2. Run database.sql again
-- File: database/database.sql

-- 3. Recreate leaderboard view
-- File: database/create_tests_leaderboard.sql
```

---

## 🐛 Debug Steps

### **Step 1: Enable Detailed Logging**

The test page now has detailed logging. Check console for:

```javascript
💾 Attempting to save test attempt with data: {
  user_id: "...",
  category: "A",
  test_number: "1",
  score: 8,
  total_questions: 10,
  percentage: 80,
  time_taken_seconds: 300
}
```

### **Step 2: Check For Errors**

Look for:
```javascript
❌ ERROR SAVING TEST ATTEMPT!
Full error object: {...}
Error message: "..."
Error code: "..."
```

### **Step 3: Common Error Codes**

| Code | Meaning | Solution |
|------|---------|----------|
| `42P01` | Table doesn't exist | Run database.sql |
| `42703` | Column doesn't exist | Check table structure |
| `23503` | Foreign key violation | Check user_profiles |
| `42501` | Permission denied | Grant permissions |
| `23505` | Duplicate key | Check unique constraints |

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Table `test_attempts` exists
- [ ] RLS is disabled on `test_attempts`
- [ ] User profile exists in `user_profiles`
- [ ] Can insert test manually via SQL
- [ ] Console shows "✅ Test attempt saved successfully"
- [ ] View `tests_leaderboard` exists
- [ ] Leaderboard shows data after test
- [ ] No errors in browser console

---

## 📝 Quick Fix Script

Run this in Supabase SQL Editor:

```sql
-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  category VARCHAR(10) NOT NULL,
  test_number VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken_seconds INTEGER,
  is_assigned BOOLEAN DEFAULT false,
  assigned_by UUID REFERENCES user_profiles(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS
ALTER TABLE test_attempts DISABLE ROW LEVEL SECURITY;

-- 3. Grant permissions
GRANT ALL ON test_attempts TO authenticated;
GRANT ALL ON test_attempts TO anon;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_category ON test_attempts(category);
CREATE INDEX IF NOT EXISTS idx_test_attempts_completed ON test_attempts(completed_at);

-- 5. Verify
SELECT 'Setup complete!' as status;
SELECT COUNT(*) as existing_attempts FROM test_attempts;
```

---

## 🆘 Still Not Working?

1. **Check Supabase Dashboard:**
   - Go to Table Editor
   - Find `test_attempts` table
   - Try inserting a row manually

2. **Check API Logs:**
   - Supabase Dashboard → Logs
   - Look for failed INSERT queries

3. **Check Network Tab:**
   - Browser DevTools → Network
   - Filter for "test_attempts"
   - Check request/response

4. **Test with Postman/curl:**
   ```bash
   curl -X POST 'YOUR_SUPABASE_URL/rest/v1/test_attempts' \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_USER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "YOUR_USER_ID",
       "category": "A",
       "test_number": "1",
       "score": 8,
       "total_questions": 10,
       "percentage": 80.00,
       "completed_at": "2024-01-01T00:00:00Z"
     }'
   ```

---

## 📞 Getting Help

If still stuck, provide:
1. Error message from console
2. Error code
3. Result of `check_test_attempts.sql`
4. Supabase logs screenshot
5. Network tab screenshot

---

## ✨ Success Indicators

You'll know it's working when:
- ✅ Console shows "Test attempt saved successfully"
- ✅ No error toasts appear
- ✅ Leaderboard updates after test
- ✅ Can see data in Supabase Table Editor
- ✅ View `tests_leaderboard` returns rows
