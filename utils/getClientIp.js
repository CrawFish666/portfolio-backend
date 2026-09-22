const net = require("node:net");

const getClientIp = (req) => {
	const forwardedFor = req.get("x-forwarded-for");

	if (forwardedFor) {
		const clientIp = forwardedFor.split(",")[0].trim();

		if (net.isIP(clientIp)) {
			return clientIp;
		}
	}

	return req.ip || req.socket.remoteAddress || "";
};

module.exports = getClientIp;