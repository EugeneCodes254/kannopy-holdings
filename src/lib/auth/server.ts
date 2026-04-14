import { db } from "@/db";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { restrictedUsernames } from "./usernames";
import { Resend } from "resend"


const resendApiKey = process.env.RESEND_API_KEY;

// 2. Warn if it's missing (helps for debugging)
if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ Warning: RESEND_API_KEY is not defined.");
}

// 3. FIX: Provide a fallback string. 
// The constructor just needs A string to not throw an error. 
// At runtime, it will use the real key from your GitHub Secrets.
const resend = new Resend(resendApiKey || "re_dummy_key_for_build");



export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [username({
    minUsernameLength: 4,
      maxUsernameLength: 10,
      usernameValidator: (value) => !restrictedUsernames.includes(value),
      usernameNormalization: (value) => value.toLowerCase(),
  })],
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({user,url}){
    await resend.emails.send({
      from: "PriceWatch <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset your password",
      // Use the 'url' string directly
      html: `<p>Click the link below to reset your password:</p>
             <a href="${url}">${url}</a>`, 
    });
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
      gender: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  }
});
