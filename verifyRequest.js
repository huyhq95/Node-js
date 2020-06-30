async function verifyRequest(ctx, next) {
    if (!ctx.session.user) return ctx.status = 403;
    return next();
}

module.exports = verifyRequest;