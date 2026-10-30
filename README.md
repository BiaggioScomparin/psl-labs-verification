# PSL LABS - Sistema Anti-Clonagem & Gerador Spiral A4351 🇵🇾

Sistema completo desenvolvido para a marca paraguaia **PSL LABS (Paraguay Scientific Laboratories)** com foco em autenticação anti-falsificação, controle unitário de QR Codes e geração de etiquetas milimétricas para folhas **Spiral A4351** (padrão 65 etiquetas por página).

---

## 🚀 Como Iniciar Localmente

```bash
# 1. Instalar dependências
npm install
# ou
pnpm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🖨️ Arquivo PDF Pronto para Impressão

O arquivo **`etiquetas_spiral_a4351_ghk_cu_50mg.pdf`** já está gerado na raiz deste projeto com:
* **Gabarito exato da Spiral A4351:** 65 etiquetas (5 colunas × 13 linhas).
* **Medida de cada etiqueta:** 38,2 mm × 21,2 mm.
* **Produto:** GHK CU 50 MG.
* **Lote:** LOT-2026-01 | **Fab:** 10/2026 | **Val:** 10/2028.
* **65 QR Codes únicos**, cada um com seu código alfanumérico exclusivo já cadastrado no banco de dados.

### Dicas de Impressão na Spiral A4351:
1. Abra o PDF no leitor ou navegador (Edge / Chrome / Adobe Reader).
2. Pressione **Ctrl + P**.
3. Em **Escala / Tamanho**, selecione **"100%" ou "Tamanho Real"** (desative "Ajustar à página").
4. Deixe as **Margens em "Nenhuma"** (as margens de 10,7 mm superior/inferior e 4,5 mm lateral já estão embutidas no PDF).
5. Certifique-se de marcar a opção **"Gráficos de plano de fundo"**.

---

## 🔐 Como Funciona a Tecnologia Anti-Clonagem

1. Cada frasco recebe um QR Code exclusivo apontando para:
   `https://seu-dominio.vercel.app/v/CODIGO_UNICO`
2. **1ª Consulta:**
   * O sistema exibe um selo verde: **"PRODUTO 100% ORIGINAL E AUTÊNTICO"**.
   * Registra a data e hora exata da primeira ativação e incrementa o contador para `1`.
3. **2ª Consulta em diante:**
   * O sistema aciona um alerta âmbar/vermelho: **"ATENÇÃO: CÓDIGO JÁ CONSULTADO X VEZES"**.
   * Mostra quando foi a 1ª consulta original e alerta o consumidor: *"Se você acabou de abrir o frasco lacrado pela primeira vez, este produto pode ser uma réplica/cópia clonada."*
4. **Código Inexistente:**
   * Exibe alerta vermelho de produto falso/não reconhecido.

---

## 🌐 Suporte Bilíngue (PY e PT-BR)

O site possui alternância instantânea entre:
* 🇵🇾 **PY (Español)**: com terminologia regulatória paraguaia e informações sediadas em Assunção.
* 🇧🇷 **PT-BR (Português)**: adaptado para o público consumidor brasileiro.

---

## 🛡️ Painel Administrativo (ADM)

Acesse: `http://localhost:3000/admin` (ou `/admin` na Vercel).
* **Senha padrão:** `psl2026` (ou `admin123`).

### Funcionalidades do Painel:
* **Gerador Spiral A4351:** Gere novas folhas de 65 etiquetas para qualquer lote com impressão direta.
* **Gerenciamento de Lotes:** Crie novos lotes (Batch Number, Data de Fabricação e Validade).
* **Catálogo de Produtos:** Adicione novos produtos com facilidade (BPC-157, TB-500, etc.).
* **Logs & Auditoria:** Acompanhe em tempo real os IPs, horários e alertas de QR codes escaneados.

---

## ☁️ Como Subir para o GitHub e Vercel

```bash
# 1. Vincular seu repositório do GitHub
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main

# 2. Na Vercel (https://vercel.com)
- Clique em "Add New Project"
- Importe o repositório do GitHub
- Clique em "Deploy" (Zero configuração necessária, Next.js é nativo!)
```
