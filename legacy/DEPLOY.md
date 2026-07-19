
# 🚀 GUIA RÁPIDO DE PUBLICAÇÃO

## Passo a passo para subir no GitHub Pages

### 1. Prepare os arquivos
Certifique-se de que todos estes arquivos estão na pasta:
- index.html
- logo.jpg
- logo-small.jpg
- logo-180.jpg
- logo-64.jpg

### 2. Acesse seu repositório
URL: https://github.com/robertasousa-dev/Pick-or-Pass-

### 3. Faça upload dos arquivos

**Método A — Drag & Drop:**
1. Clique em "Add file" → "Upload files"
2. Arraste TODOS os arquivos da pasta pickorpass-app
3. Em "Commit changes", escreva: "Primeira versão do Pick or Pass"
4. Clique em "Commit changes"

**Método B — Via terminal:**
```bash
cd /caminho/para/pickorpass-app
git init
git remote add origin https://github.com/robertasousa-dev/Pick-or-Pass-.git
git add .
git commit -m "Primeira versao do Pick or Pass"
git push -u origin main
```

### 4. Ative o GitHub Pages
1. No repositório, clique em **Settings** (aba superior)
2. No menu lateral esquerdo, clique em **Pages**
3. Em "Source", selecione: **Deploy from a branch**
4. Branch: **main** | Folder: **/(root)**
5. Clique em **Save**

### 5. Aguarde 2-5 minutos

### 6. Acesse seu app
URL será: https://robertasousa-dev.github.io/Pick-or-Pass-/

### 7. Teste no celular
- Abra o link no Safari (iOS) ou Chrome (Android)
- Toque em "Compartilhar" → "Adicionar à Tela Inicial"
- O app funcionará como PWA!

---

## ❓ Problemas comuns

**"Não consigo fazer push"**
→ Verifique se você está logado no Git: `git config --global user.name` e `git config --global user.email`

**"A página não carrega"**
→ Aguarde mais 5 minutos. GitHub Pages pode demorar.

**"As imagens não aparecem"**
→ Verifique se os nomes dos arquivos estão EXATAMENTE: logo.jpg, logo-small.jpg (case-sensitive)

**"Quero usar um domínio próprio"**
→ Adicione um arquivo `CNAME` com seu domínio (ex: pickorpass.app) e configure no seu DNS.
