import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email parameter is missing' }, { status: 400 });
  }

  try {
    // 2. Make a GET request to duonguyen.site API using native fetch
    const apiResponse = await fetch(`https://duonguyen.site/api/users?email=${email}`);
    const apiData = await apiResponse.json();

    if (apiData.status !== 200 || !apiData.data) {
      return NextResponse.json({ message: apiData.message || 'Failed to fetch user data from duonguyen.site' }, { status: apiData.status || 500 });
    }

    const userData = apiData.data;

    // 4. Using Prisma, find or create a user
    const user = await prisma.user.upsert({
      where: { userId: userData.user_id },
      update: {
        username: userData.username,
        email: userData.email,
        imageUrl: userData.image_url,
        // Assuming 'role' is a field in your User model
        role: userData.role,
      },
      create: {
        userId: userData.user_id,
        username: userData.username,
        email: userData.email,
        imageUrl: userData.image_url,
        // Assuming 'role' is a field in your User model
        role: userData.role,
      },
    });

    // TODO: Establish user session (e.g., using next-auth, session cookies)
    // For now, we'll just redirect. In a real app, you'd set up a session here.

    // 5. Redirect the user
    // Replace '/dashboard' with the actual path to your user dashboard or homepage
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error('Error during authentication callback:', error);
    return NextResponse.json({ message: 'Internal server error during authentication' }, { status: 500 });
  }
}