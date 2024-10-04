/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/api/openai',
                destination: 'https://api.openai.com/v1/chat/completions',
                permanent: true,
            },
            {
                source: '/api',
                destination: 'http://localhost:8080/',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
