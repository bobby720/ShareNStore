import sql from '@/app/api/utils/sql';
import { verify } from 'argon2';

// Helper function to verify room access
async function verifyRoomAccess(roomId, password) {
  const rooms = await sql`
    SELECT admin_password_hash FROM rooms WHERE room_id = ${roomId}
  `;
  
  if (rooms.length === 0) {
    return false;
  }
  
  return await verify(rooms[0].admin_password_hash, password);
}

// DELETE - Delete a file from the room
export async function DELETE(request, { params }) {
  try {
    const { roomId, fileId } = params;
    const { password } = await request.json();

    // Validate input
    if (!roomId || !fileId || !password) {
      return Response.json(
        { error: 'Room ID, file ID, and password are required' },
        { status: 400 }
      );
    }

    // Verify room access
    const hasAccess = await verifyRoomAccess(roomId, password);
    if (!hasAccess) {
      return Response.json(
        { error: 'Room not found or invalid password' },
        { status: 401 }
      );
    }

    // Get file details before deletion
    const files = await sql`
      SELECT file_size FROM files 
      WHERE id = ${fileId} AND room_id = ${roomId}
    `;

    if (files.length === 0) {
      return Response.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fileSize = parseInt(files[0].file_size);

    // Delete file and update storage usage in a transaction
    await sql.transaction([
      sql`
        DELETE FROM files 
        WHERE id = ${fileId} AND room_id = ${roomId}
      `,
      sql`
        UPDATE rooms 
        SET storage_used = storage_used - ${fileSize}, updated_at = CURRENT_TIMESTAMP
        WHERE room_id = ${roomId}
      `
    ]);

    return Response.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return Response.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}