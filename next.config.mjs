/** @type {import('next').NextConfig} */
const nextConfig = {
  // URL limpa do jogo: /jogar serve o arquivo público public/jogar.html,
  // e o antigo /jogar.html redireciona (301) para /jogar — sem quebrar links existentes.
  async rewrites() {
    return [{ source: "/jogar", destination: "/jogar.html" }];
  },
  async redirects() {
    return [{ source: "/jogar.html", destination: "/jogar", permanent: true }];
  },
};

export default nextConfig;
