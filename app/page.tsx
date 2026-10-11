const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HackerLife — Simulador de Hacker",
  url: "https://simuladordehacker.com.br/",
  description:
    "Simulador de Hacker em formato RPG: evolua seu personagem, faça missões, gerencie riscos, ganhe reputação e construa sua vida no submundo digital. Jogue grátis no navegador.",
  applicationCategory: "GameApplication",
  genre: "RPG",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  inLanguage: "pt-BR",
  accessibilityFeature: "noInstallationRequired",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "O que é o Simulador de Hacker?", acceptedAnswer: { "@type": "Answer", text: "O Simulador de Hacker é um jogo RPG gratuito jogado direto no navegador. Você assume o papel de ghost_zero, um hacker que foi demitido injustamente e precisa provar sua inocência infiltrando sistemas corporativos, construindo reputação no submundo digital e completando missões interativas." } },
    { "@type": "Question", name: "O jogo é gratuito?", acceptedAnswer: { "@type": "Answer", text: "Sim, o HackerLife é 100% gratuito. Não há compras dentro do jogo, assinaturas ou anúncios." } },
    { "@type": "Question", name: "Precisa instalar alguma coisa?", acceptedAnswer: { "@type": "Answer", text: "Não. O HackerLife roda direto no navegador, em qualquer dispositivo. Nenhum download, nenhum cadastro necessário." } },
    { "@type": "Question", name: "Como jogar o Simulador de Hacker?", acceptedAnswer: { "@type": "Answer", text: "Clique em Jogar Agora, assista à intro, comece fazendo deliveries e hacks básicos para ganhar experiência. O painel de próximos objetivos guia cada etapa da progressão." } },
    { "@type": "Question", name: "O progresso é salvo automaticamente?", acceptedAnswer: { "@type": "Answer", text: "Sim. O jogo salva automaticamente a cada 30 segundos e após cada ação importante. O progresso fica salvo no navegador e é carregado automaticamente quando você voltar." } },
    { "@type": "Question", name: "O que acontece se o risco chegar a 100%?", acceptedAnswer: { "@type": "Answer", text: "O Agente Salles executa uma operação policial. Você tem 60 segundos para decidir: fugir (perde 30% da grana) ou ser capturado (modo foragido por 5 minutos)." } },
    { "@type": "Question", name: "Quanto tempo leva para completar o jogo?", acceptedAnswer: { "@type": "Answer", text: "Completar toda a história principal leva entre 3 e 5 horas de jogo acumuladas, dependendo do estilo de cada jogador." } },
    { "@type": "Question", name: "O jogo ensina hacking de verdade?", acceptedAnswer: { "@type": "Answer", text: "O HackerLife usa conceitos reais de segurança de forma educativa e simplificada. O objetivo é criar consciência sobre como ataques funcionam, não ensinar técnicas prejudiciais." } },
    { "@type": "Question", name: "Qual é a história do jogo?", acceptedAnswer: { "@type": "Answer", text: "Você é Lucas Mendes, sysadmin demitido injustamente da TechNova S.A. O objetivo é infiltrar a empresa, encontrar provas reais e expor a conspiração que destruiu sua carreira." } },
    { "@type": "Question", name: "É possível jogar pelo celular?", acceptedAnswer: { "@type": "Answer", text: "Sim! O jogo foi desenvolvido com mobile em mente. Toda a interface é responsiva e funciona bem em telas pequenas." } },
  ],
};

export default function Home() {
  return (
    <>
      <div id="landing">
        <div className="landing-inner">
          <section className="landing-hero">
            <h1>
              Simulador de <span>Hacker</span>
            </h1>
            <p className="tagline">
              <strong>O hack simulator RPG mais imersivo do Brasil.</strong> Jogue direto no navegador, sem download.
            </p>
            <p className="keywords">hacker rpg · hack simulator online · simulador hacking · jogo de hacker</p>
            <a className="landing-cta" href="/jogar">▶ Jogar Agora — é grátis</a>
          </section>

          <div className="landing-block">
            <h2>O que é o Simulador de Hacker</h2>
            <p>
              <strong>HackerLife</strong> é um simulador de hacker em formato RPG onde você assume o papel de <strong>ghost_zero</strong> — um hacker respeitado que foi incriminado pela megacorporação <strong>TechNova</strong> e perdeu tudo: liberdade, identidade e reputação no submundo digital.
            </p>
            <p>
              Operando de um servidor abandonado, você recomeça do zero. Execute missões no submundo, construa sua reputação, infiltre grupos hackers de elite e suba de <em>Script Kiddie</em> até <em>Ghost</em> — o rank mais temido da rede.
            </p>
            <p>
              O objetivo final é a <strong>Operação Verdade</strong>: infiltrar os servidores da TechNova, encontrar as provas que te incriminaram e expor a conspiração. Mas o caminho é longo, e a polícia digital está sempre rastreando.
            </p>
          </div>

          <hr className="landing-divider" />

          <div className="landing-block">
            <h2>Como funciona</h2>
            <ol className="landing-steps">
              <li><span className="step-n">01</span> <span>Você começa como <strong>ghost_zero</strong>, sem dinheiro e sem reputação. Seu primeiro passo é executar pequenas operações — quebrar Wi-Fi de vizinho, mandar phishing — para acumular grana e XP.</span></li>
              <li><span className="step-n">02</span> <span>Com recursos, você compra <strong>equipamentos</strong> (VPN, Firewall, servidor anônimo) que aumentam seu poder de ataque e diminuem o risco de ser rastreado.</span></li>
              <li><span className="step-n">03</span> <span>Faça <strong>cursos técnicos</strong> — Linux, Criptografia, Engenharia Social — para desbloquear missões mais lucrativas e subir de nível permanentemente.</span></li>
              <li><span className="step-n">04</span> <span>Gerencie o <strong>🔥 risco</strong>: quanto mais você hackeia, mais quente fica o seu rastro. Se a defesa for baixa e o risco alto, você pode sofrer contra-ataque ou ser localizado.</span></li>
              <li><span className="step-n">05</span> <span>Ingresse em <strong>grupos hackers</strong> (Noob Backdoor, Phantom Hex, VX Elite) para acessar missões exclusivas e de alto valor.</span></li>
              <li><span className="step-n">06</span> <span>Quando estiver pronto, execute a <strong>Operação Verdade</strong> — confronto final com a TechNova — e complete sua redenção.</span></li>
            </ol>
          </div>

          <hr className="landing-divider" />

          <div className="landing-block">
            <h2>Possibilidades do jogo</h2>
            <div className="landing-feats">
              <div className="landing-feat"><span className="feat-icon">📶</span><strong>Quebrar Wi-Fi</strong>Brute force em redes próximas. Primeira fonte de renda do iniciante.</div>
              <div className="landing-feat"><span className="feat-icon">🎣</span><strong>Phishing e Engenharia Social</strong>E-mails falsos de banco, páginas clonadas, armadilhas digitais com rastreador GPS.</div>
              <div className="landing-feat"><span className="feat-icon">💾</span><strong>Vazar dados na Dark Web</strong>Scraping, dumps corporativos e publicação em fóruns clandestinos.</div>
              <div className="landing-feat"><span className="feat-icon">🔒</span><strong>Ransomware e Extorsão</strong>Sequestro de dados em empresas pequenas até infraestrutura crítica.</div>
              <div className="landing-feat"><span className="feat-icon">🛡️</span><strong>Pentest autorizado</strong>Trabalho legal: clientes pagam para você testar a segurança deles.</div>
              <div className="landing-feat"><span className="feat-icon">🌐</span><strong>Blog técnico</strong>Publique tutoriais e write-ups para construir audiência e renda passiva.</div>
              <div className="landing-feat"><span className="feat-icon">🏦</span><strong>Operação Blackout</strong>Hackear o Banco Central e escapar sem deixar rastros.</div>
              <div className="landing-feat"><span className="feat-icon">🏛️</span><strong>Redes governamentais</strong>Infiltre ministérios e subestações elétricas no nível elite do jogo.</div>
            </div>
          </div>

          <hr className="landing-divider" />

          <div className="faq-section">
            <h2 className="faq-title">Perguntas Frequentes</h2>

            <div className="faq-category">⚙️ Mecânicas e progressão</div>

            <details className="faq-item">
              <summary className="faq-q">O que é o Simulador de Hacker? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">O Simulador de Hacker é um jogo RPG gratuito jogado direto no navegador. Você assume o papel de ghost_zero, um hacker que foi demitido injustamente e precisa provar sua inocência infiltrando sistemas corporativos, construindo reputação no submundo digital e completando missões interativas baseadas em técnicas reais de segurança.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O jogo é gratuito? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Sim, o HackerLife é 100% gratuito. Não há compras dentro do jogo, assinaturas ou anúncios. Acesse, jogue e evolua sem gastar nada.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Precisa instalar alguma coisa? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Não. O HackerLife roda direto no navegador, em qualquer dispositivo — celular, tablet ou computador. Nenhum download, nenhum cadastro.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">É possível jogar pelo celular? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Sim! O jogo foi desenvolvido com mobile em mente. Toda a interface é responsiva e funciona bem em telas pequenas.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Com que frequência o jogo é atualizado? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">O HackerLife está em desenvolvimento ativo com atualizações regulares. Novas missões, mecânicas e conteúdo narrativo são adicionados frequentemente. Confira o <a href="/changelog.html">changelog</a> para ver o histórico completo.</div>
            </details>

            <div className="faq-category">❓ Perguntas gerais</div>

            <details className="faq-item">
              <summary className="faq-q">Como jogar o Simulador de Hacker? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Para jogar: 1) Clique em &quot;Jogar Agora&quot; na página inicial. 2) Assista à intro que apresenta a história do personagem. 3) Comece fazendo deliveries e pequenos hacks para ganhar experiência e dinheiro. 4) Evolua comprando upgrades, completando missões interativas e entrando em grupos hackers. O painel de &quot;próximos objetivos&quot; guia você em cada etapa.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Quais são os tipos de missões disponíveis? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">O jogo tem missões interativas com terminal real: invasão de servidor Linux, SQL Injection, interceptação de bônus via webmail, phishing de crypto airdrop, defacement de site governamental, armadilha GPS com a polícia, Operação Blackout no Banco Central, alterar nota na faculdade e infiltrar servidores da Netflix — uma missão nova a cada nível.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O que é SQL Injection no jogo? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">No HackerLife, a missão de SQL Injection simula um ataque real em que você insere código malicioso num formulário de login para extrair o banco de dados de um e-commerce. O jogo explica o conceito e apresenta opções de payload para você escolher, ensinando como essa vulnerabilidade funciona na prática.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O progresso é salvo automaticamente? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Sim. O jogo salva automaticamente a cada 30 segundos e após cada ação importante — hacks, compras e missões. O progresso fica salvo no navegador e é carregado automaticamente quando você voltar. Para recomeçar do zero, use o botão &quot;reset&quot; discreto ao lado do nível.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Quanto tempo leva para completar o jogo? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Uma sessão casual de 15 a 30 minutos já permite avançar bastante. Completar toda a história principal — do nível 1 ao 0xVoid com a Operação Verdade — leva entre 3 e 5 horas de jogo acumuladas, dependendo do estilo de cada jogador.</div>
            </details>

            <div className="faq-category">🔒 Segurança e gameplay</div>

            <details className="faq-item">
              <summary className="faq-q">O jogo ensina hacking de verdade? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">O HackerLife usa conceitos reais de segurança — SQL Injection, phishing, engenharia social, CVEs conhecidos — de forma educativa e simplificada. O objetivo é criar consciência sobre como ataques funcionam, não ensinar técnicas prejudiciais. É um jogo de entretenimento com elementos educativos.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Qual a diferença entre risco e exposição no jogo? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Risco representa sua atividade recente — sobe a cada hack e cai fazendo deliveries. Exposição indica a chance do Agente Salles te localizar, calculada com base na sua defesa. Risco alto chama atenção, exposição alta facilita o rastreio. Controlar os dois é essencial para não ser capturado.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O que acontece se o risco chegar a 100%? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Quando o risco atinge 100%, o Agente Salles executa uma operação policial real. Uma cena dramática no terminal se desenrola e você tem 60 segundos para decidir: fugir (perde 30% da grana e upgrades de ataque, mas mantém liberdade) ou ser capturado (perde 50% e entra em modo foragido por 5 minutos).</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Existe multiplayer ou ranking? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Atualmente o HackerLife é single-player com save local no navegador. Sistema de ranking e perfil online estão planejados para versões futuras, permitindo comparar progressos entre jogadores.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O jogo tem conteúdo adulto? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">O HackerLife tem temática de crime digital e tensão narrativa, mas sem conteúdo violento explícito ou sexual. É adequado para maiores de 12 anos interessados em tecnologia, segurança digital e jogos de estratégia com narrativa.</div>
            </details>

            <div className="faq-category">🎮 Conteúdo e grupos</div>

            <details className="faq-item">
              <summary className="faq-q">Quais são os grupos hackers do jogo? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Há três grupos para entrar conforme você evolui: NullByte Crew (nível 3, iniciantes), Phantom Syndicate (nível 6, intermediário — requer Servidor VPS) e 0xVoid (nível 10, elite — o grupo mais perigoso do submundo e porta de entrada para o desfecho da história).</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">O que é a Operação Blackout? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">A Operação Blackout é uma missão de alto risco no nível 7 em que você tenta hackear o sistema de homologação do Banco Central usando a vulnerabilidade Log4Shell. Com uma janela de apenas 4 minutos, você precisa agir rápido e decidir como escapar quando a polícia chegar.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Quais são os requisitos técnicos para jogar? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Qualquer navegador moderno funciona — Chrome, Firefox, Safari ou Edge. Não há requisitos especiais de hardware. O jogo roda em celulares antigos, tablets e computadores sem dificuldade.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Qual é a história do jogo? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">Você é Lucas Mendes, um sysadmin demitido injustamente da TechNova S.A. após um rival plantar provas falsas contra você. Sem emprego, você começa fazendo deliveries e aprendendo a hackear com o mentor Kr4ck3r_BR. O objetivo final: infiltrar a TechNova, encontrar as provas reais e expor a conspiração.</div>
            </details>

            <details className="faq-item">
              <summary className="faq-q">Como ganhar dinheiro mais rápido no início? <span className="faq-arrow">▼</span></summary>
              <div className="faq-a">No início, alterne entre hacks (Wi-Fi do vizinho e phishing) e deliveries de pizza para controlar o risco. Compre o Firewall assim que juntar R$50 para se proteger. A missão de SQL Injection no nível 2 paga R$500 no total — R$150 de adiantamento e R$350 ao completar — e acelera bastante a progressão.</div>
            </details>
          </div>

          <hr className="landing-divider" />

          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <a className="landing-cta" href="/jogar">▶ Jogar Agora — é grátis</a>
          </div>

          <p className="landing-footer">HackerLife RPG · Simulador de Hacker · Hack Simulator Online · Jogo de Hacker no Navegador</p>
          <p className="landing-footer" style={{ marginTop: 8 }}>
            sugestões de hacks? está gostando do jogo? fale comigo: <a className="landing-mail" href="mailto:cavadema@gmail.com">cavadema@gmail.com</a>
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
