import sql from '@/app/api/utils/sql';
import { verify } from 'argon2';

export async function GET(request, { params }) {
  try {
    const { roomId } = params;
    const url = new URL(request.url);
    const password = url.searchParams.get('password');

    // Validate input
    if (!roomId || !password) {
      return Response.json(
        { error: 'Room ID and password are required' },
        { status: 400 }
      );
    }

    // Find the room
    const rooms = await sql`
      SELECT room_id, room_name, admin_password_hash, storage_used, storage_limit, created_at
      FROM rooms 
      WHERE room_id = ${roomId}
    `;

    if (rooms.length === 0) {
      return Response.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const room = rooms[0];

    // Verify password
    const isPasswordValid = await verify(room.admin_password_hash, password);

    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return room data (without password hash)
    return Response.json({
      roomId: room.room_id,
      name: room.room_name,
      storageUsed: parseInt(room.storage_used),
      storageLimit: parseInt(room.storage_limit),
      createdAt: room.created_at
    });

  } catch (error) {
    console.error('Error fetching room:', error);
    return Response.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}