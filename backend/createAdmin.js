import bcrypt from 'bcryptjs';

const adminPassword = 'Yoga@2024';
const studentPassword = 'password123';

console.log('Generating password hashes...\n');

bcrypt.hash(adminPassword, 10, (err, adminHash) => {
  if (err) {
    console.error('Error hashing admin password:', err);
    return;
  }

  console.log('Admin Password Hash (for yogafitness@gmail.com):');
  console.log(adminHash);
  console.log('\n');

  bcrypt.hash(studentPassword, 10, (err, studentHash) => {
    if (err) {
      console.error('Error hashing student password:', err);
      return;
    }

    console.log('Student Password Hash (for rahul.sharma@iips.edu):');
    console.log(studentHash);
    console.log('\n');

    console.log('Use these hashes to update the DATABASE_SETUP.sql file');
    console.log('Or run this SQL in Supabase SQL Editor:\n');
    console.log(`UPDATE users SET password_hash = '${adminHash}' WHERE email = 'yogafitness@gmail.com';`);
    console.log(`UPDATE users SET password_hash = '${studentHash}' WHERE email = 'rahul.sharma@iips.edu';`);
  });
});
