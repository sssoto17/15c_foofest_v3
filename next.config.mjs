/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "foofest-api.onrender.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
			},
		],
	},
};

export default nextConfig;
