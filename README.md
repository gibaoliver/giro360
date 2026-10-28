# Giro 360 | Portal de Notícias

Portal de notícias moderno, responsivo e modular com cobertura jornalística completa, leitor de áudio nativo (Text-to-Speech), cotações em tempo real, painel administrativo (CMS) e ferramentas de acessibilidade.

## 🚀 Tecnologias Utilizadas

- **HTML5 Semântico**
- **Tailwind CSS (CDN)**
- **JavaScript Moderno (ES6+)**
- **Web Speech API** (Síntese de voz nativa no navegador)
- **AwesomeAPI** (Cotações de moedas em tempo real)
- **LocalStorage** (Persistência de matérias, preferências e comentários)

## 📁 Estrutura do Projeto

```
giro360/
├── assets/                     # Imagens e mídias estáticas
├── styles/
│   └── main.css               # Design system editorial, tipografia e dark mode
├── scripts/
│   ├── data.js                # Banco de dados centralizado e persistência local
│   ├── main.js                # Relógio, cotações, acessibilidade e tema
│   ├── materia.js             # Leitor de áudio TTS, WhatsApp e comentários
│   ├── noticias.js            # Filtros por editoria e busca em tempo real
│   └── admin.js               # Painel CMS para publicação e moderação
├── index.html                 # Página inicial com destaques e feed
├── materia.html               # Página individual da matéria
├── noticias.html              # Arquivo de notícias com filtros
├── colunistas.html            # Artigos de opinião e colunistas
├── admin.html                 # Painel administrativo
└── sobre.html                 # Página institucional e expediente
```

## 🛠️ Como Executar

Por ser uma aplicação construída com tecnologias web padrão, não requer instalação de dependências ou etapas de compilação:

1. Clone o repositório:
   ```bash
   git clone https://github.com/gibaoliver/giro360.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno.
