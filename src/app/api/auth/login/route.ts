import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const redirectUrl = 'https://duonguyen.site/auth?next=https://ai.codetails.site/validate-auth';
  return NextResponse.redirect(redirectUrl);
}