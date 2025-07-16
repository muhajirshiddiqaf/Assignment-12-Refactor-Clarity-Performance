import { NextResponse } from "next/server";
import { 
  parseQueryParams, 
  getUsersWithPagination, 
  UsersResponse 
} from "@/lib/userService";

export async function GET(request: Request) {
  console.time("Users API Execution");

  try {
    // Parse query parameters
    const params = parseQueryParams(request);

    // Get users with pagination
    const { users, total } = await getUsersWithPagination(params);

    console.timeEnd("Users API Execution");
    
    return NextResponse.json({
      users,
      total,
      filteredBy: params.division || "all",
      message: "Users retrieved successfully",
    } as UsersResponse);

  } catch (error) {
    console.error("Users API error:", error);
    console.timeEnd("Users API Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
