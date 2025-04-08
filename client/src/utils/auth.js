import jwt_decode from "jwt-decode";

export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    } catch (err) {
        console.error("Token decode failed", err);
        return true;
    }
};
