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

// GET - List files in a room
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

    // Verify room access
    const hasAccess = await verifyRoomAccess(roomId, password);
    if (!hasAccess) {
      return Response.json(
        { error: 'Room not found or invalid password' },
        { status: 401 }
      );
    }

    // Get files for the room
    const files = await sql`
      SELECT id, file_name, file_url, file_type, file_size, uploaded_at
      FROM files 
      WHERE room_id = ${roomId}
      ORDER BY uploaded_at DESC
    `;

    return Response.json({
      files: files.map(file => ({
        id: file.id,
        fileName: file.file_name,
        fileUrl: file.file_url,
        fileType: file.file_type,
        fileSize: parseInt(file.file_size),
        uploadedAt: file.uploaded_at
      }))
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    return Response.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// POST - Upload a new file to the room
export async function POST(request) {
  try {
    const { roomId, password, fileName, fileUrl, fileType, fileSize } = await request.json();

    // Validate input
    if (!roomId || !password || !fileName || !fileUrl || !fileType || !fileSize) {
      return Response.json(
        { error: 'All file details are required' },
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

    // Check storage limit
    const roomData = await sql`
      SELECT storage_used, storage_limit FROM rooms WHERE room_id = ${roomId}
    `;

    const currentUsage = parseInt(roomData[0].storage_used);
    const storageLimit = parseInt(roomData[0].storage_limit);

    if (currentUsage + fileSize > storageLimit) {
      return Response.json(
        { error: 'Storage limit exceeded' },
        { status: 413 }
      );
    }

    // Insert file record and update storage usage in a transaction
    const result = await sql.transaction([
      sql`
        INSERT INTO files (room_id, file_name, file_url, file_type, file_size)
        VALUES (${roomId}, ${fileName}, ${fileUrl}, ${fileType}, ${fileSize})
        RETURNING id, file_name, file_url, file_type, file_size, uploaded_at
      `,
      sql`
        UPDATE rooms 
        SET storage_used = storage_used + ${fileSize}, updated_at = CURRENT_TIMESTAMP
        WHERE room_id = ${roomId}
      `
    ]);

    const newFile = result[0][0];

    return Response.json({
      success: true,
      file: {
        id: newFile.id,
        fileName: newFile.file_name,
        fileUrl: newFile.file_url,
        fileType: newFile.file_type,
        fileSize: parseInt(newFile.file_size),
        uploadedAt: newFile.uploaded_at
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}