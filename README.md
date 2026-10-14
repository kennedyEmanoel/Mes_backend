# 🏭 MES - Gestão de OPs e Apontamento de Metas

Este repositório contém a API (Backend) de um Sistema de Execução de Manufatura (MES) desenvolvido para controlar de forma rigorosa o chão de fábrica. O foco central do sistema é o gerenciamento do ciclo de vida das Ordens de Produção (OPs) e o controle em tempo real da eficiência e das metas de fabricação.

## ⚙️ Como o fluxo de produção funciona?

No sistema, a **Ordem de Produção (OP)** funciona como o coração de todo o processo de fabricação, servindo como um guia desde a entrada da matéria-prima até a finalização do lote. O fluxo acontece em três pilares principais:

* **1. Abertura e Roteirização:** O processo se inicia com a criação da OP, onde são definidos a matéria-prima, a previsão de execução e a **meta total de peças**. Imediatamente, essa OP é vinculada a um roteiro obrigatório de etapas sequenciais (ex: Montagem, Soldagem, Revisão e Gravação).
* **2. Apontamento Híbrido:** Durante a execução, o progresso avança através de duas modalidades de apontamento que alimentam o cálculo de eficiência:
  * **Manual:** Líderes de linha registram por lote/hora a quantidade produzida versus a meta em postos não automatizados.
  * **Automático:** Operadores bipam códigos de barras. O sistema extrai e valida o número da peça (IMEI/Serial), contabilizando cada unidade individualmente de forma invisível e somando a produção em tempo real.
* **3. Encerramento Seguro:** Para garantir a integridade dos dados, o sistema conta com uma trava de encerramento. A OP só é considerada concluída quando o sistema cruza os apontamentos (manuais e automáticos) de todas as etapas e confirma que a meta estipulada na abertura foi atingida sem furos no processo.

## 🛠️ Tecnologias Utilizadas

* **Framework:** NestJS
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL
* **ORM:** TypeORM

  ##Frontend
  
https://github.com/kennedyEmanoel/Mes_frontend
