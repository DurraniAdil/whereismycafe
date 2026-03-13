
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../wimc-api/.env') });

const UserSchema = new mongoose.Schema({
  email: String,
  name: String
});

const User = mongoose.model('User', UserSchema);

async function checkUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found');
      return;
    }

    await mongoose.connect(mongoUri);
    const email = 'durraniadil13@gmail.com';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log(`User found: ${user.name} (${user.email}) id: ${user._id}`);
    } else {
      console.log(`User not found: ${email}`);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUser();
