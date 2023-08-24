export function refreshExpireDate() {
    return new Date(
        new Date().setDate(
            new Date().getDate() +
                parseInt(process.env.REFRESH_EXPIRATION.slice(0, -1), 10)
        )
    );
}
