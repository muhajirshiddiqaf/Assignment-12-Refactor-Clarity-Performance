import { executeQuery } from "@/lib/database";

// Types
export interface UserQueryParams {
  division?: string;
  limit?: number;
  offset?: number;
}

export interface UserData {
  id: number;
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  bio: string;
  longBio: string;
  address: string;
  phoneNumber: string;
  role: string;
  division: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  filteredBy: string;
  message: string;
}

// Constants
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

// Query builders
export function buildUsersQuery(params: UserQueryParams): { query: string; values: any[] } {
  const values: any[] = [];
  let paramIndex = 1;

  let query = `
    SELECT 
      u.id,
      u.username,
      u.full_name,
      u.birth_date,
      u.bio,
      u.long_bio,
      u.address,
      u.phone_number,
      u.created_at,
      u.updated_at,
      a.email,
      ur.role,
      ud.division_name
    FROM users u
    LEFT JOIN auth a ON u.auth_id = a.id
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN user_divisions ud ON u.id = ud.user_id
  `;

  if (params.division && params.division !== "all") {
    query += ` WHERE ud.division_name = $${paramIndex}`;
    values.push(params.division);
    paramIndex++;
  }

  query += ` ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(params.limit, params.offset);

  return { query, values };
}

export function buildCountQuery(params: UserQueryParams): { query: string; values: any[] } {
  const values: any[] = [];
  let paramIndex = 1;

  let query = `
    SELECT COUNT(*) as total
    FROM users u
    LEFT JOIN user_divisions ud ON u.id = ud.user_id
  `;

  if (params.division && params.division !== "all") {
    query += ` WHERE ud.division_name = $${paramIndex}`;
    values.push(params.division);
  }

  return { query, values };
}

// Data transformation
export function transformUserData(rawUser: any): UserData {
  return {
    id: rawUser.id,
    username: rawUser.username,
    fullName: rawUser.full_name,
    email: rawUser.email,
    birthDate: rawUser.birth_date,
    bio: rawUser.bio || "",
    longBio: rawUser.long_bio || "",
    address: rawUser.address || "",
    phoneNumber: rawUser.phone_number || "",
    role: rawUser.role || "user",
    division: rawUser.division_name || "Unassigned",
    createdAt: rawUser.created_at,
    updatedAt: rawUser.updated_at,
  };
}

// Main service function
export async function getUsersWithPagination(params: UserQueryParams): Promise<{ users: UserData[]; total: number }> {
  // Get total count for pagination
  const countQuery = buildCountQuery(params);
  const countResult = await executeQuery(countQuery.query, countQuery.values);
  const total = parseInt(countResult.rows[0]?.total || "0");

  // Get paginated users
  const usersQuery = buildUsersQuery(params);
  const usersResult = await executeQuery(usersQuery.query, usersQuery.values);
  
  const users = usersResult.rows.map(transformUserData);

  return { users, total };
}

// Parameter parsing
export function parseQueryParams(request: Request): UserQueryParams {
  const url = new URL(request.url);
  const division = url.searchParams.get("division");
  const limit = parseInt(url.searchParams.get("limit") || DEFAULT_LIMIT.toString());
  const offset = parseInt(url.searchParams.get("offset") || "0");

  return {
    division: division || undefined,
    limit: Math.min(limit, MAX_LIMIT),
    offset: Math.max(offset, 0)
  };
} 