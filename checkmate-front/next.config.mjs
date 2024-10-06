/** @type {import('next').NextConfig} */
const nextConfig = {
    // async redirects() {
    //     return [
    //     ]
    // },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'hello',
                        value: 'world',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
