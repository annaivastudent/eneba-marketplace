
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message?: string;
    error?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export async function registerUser(
    data: RegisterData
): Promise<RegisterResponse> {
    const response = await fetch(
        "http://localhost:8000/api/auth/register.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result: RegisterResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Registration failed");
    }

    return result;
}
export interface LoginData {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface LoginResponse {
    message?: string;
    error?: string;
    user?: AuthUser;
}

export async function loginUser(
    data: LoginData
): Promise<LoginResponse> {
    const response = await fetch(
        "http://localhost:8000/api/auth/login.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result: LoginResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Login failed");
    }

    return result;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch(
        "http://localhost:8000/api/auth/me.php",
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Could not check authentication");
    }

    const result: { user: AuthUser | null } = await response.json();

    return result.user;
}

export async function logoutUser(): Promise<void> {
    const response = await fetch(
        "http://localhost:8000/api/auth/logout.php",
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Logout failed");
    }
}
