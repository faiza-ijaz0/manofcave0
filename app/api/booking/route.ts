import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Validate required fields
    const requiredFields = ['service', 'barber', 'date', 'time', 'name', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Here you would typically save to a database
    // For now, we'll just simulate a successful booking

    const bookingId = `BK${Date.now()}`;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking confirmed successfully!',
      details: {
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}