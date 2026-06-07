export const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, must-revalidate');
    res.header('Expires', '-1');
    next();
}
export const nohttp = (req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-XSS-Protection', '0');
    res.header('x-permitted-cross-domain-policies', 'none');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('referrer-policy', 'no-referrer');
    // res.header('content-security-policy', "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';");
    // res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    // res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Single-UI-Authorization, csrf");
    res.header("Access-Control-Expose-Headers", "Single-UI-Authorization, csrf");
    res.header("Access-Control-Max-Age", "86400");
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
}
export const health = (req, res, next) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data);
}