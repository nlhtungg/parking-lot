import { cookies } from "next/headers";

export async function serverApiFetch(path, options = {}) {
    const cookieStore = cookies();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        cookie: cookieStore.toString(),
    };
    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
        cache: "no-store",
    });
    return res;
}
