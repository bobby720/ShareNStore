import sql from '@/app/api/utils/sql';
import { hash } from 'argon2';


export async function POST(request) {
  try {
    const { roomId, roomName, adminPassword } = await request.json();

    // Validate input
    if (!roomId || !roomName || !adminPassword) {
      return Response.json(
        { error: 'Room ID, name, and admin password are required' },
        { status: 400 }
      );
    }

    // Check if room ID already exists
    const existingRoom = await sql`
      SELECT room_id FROM rooms WHERE room_id = ${roomId}
    `;

    if (existingRoom.length > 0) {
      return Response.json(
        { error: 'Room ID already exists' },
        { status: 409 }
      );
    }

    // Hash the admin password
    const passwordHash = await hash(adminPassword);

    // Create the room
    const result = await sql`
      INSERT INTO rooms (room_id, room_name, admin_password_hash)
      VALUES (${roomId}, ${roomName}, ${passwordHash})
      RETURNING room_id, room_name, created_at
    `;

    return Response.json({
      success: true,
      room: result[0]
    });

  } catch (error) {
    console.error('Error creating room:', error);
    return Response.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}