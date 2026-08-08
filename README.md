
# 🤬 V4
> Início da familia de modelos "v".

![Node.js](https://img.shields.io/badge/Node.js-Pure%20JS-339933?logo=nodedotjs&logoColor=white)
![No Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen)
![Memory](https://img.shields.io/badge/RAM_Usage-~40MB-blue)

Uma Rede Neural **100% customizada** e escrita em **puro JavaScript**, focada em classificar textos e identificar palavrões/ofensas com extrema velocidade. 

O grande diferencial deste modelo **V4** é a arquitetura baseada em **Vetores Esparsos** (*Sparse Vectors*). Ela descarta tudo que é zero, poupando uma quantidade absurda de memória e permitindo rodar bases gigantes em hardwares modestos — tudo isso sem depender de `TensorFlow` ou `node_modules` pesados.

> **Aviso:** O modelo pré-treinado (`v4.json`) já está no repositório. É só baixar e usar!

---

## ⚡ Por que usar a V4?

- 📦 **Zero Dependências:** Código limpo, usando apenas os módulos nativos do Node (`fs`, `path`, `readline`).
- 🪶 **Peso-Pena:** Treine e rode inferências consumindo em média apenas 40MB de RAM.
- 🎯 **Classificação Detalhada:** Retorna a categoria (`leve`, `médio`, `pesado`, `extremo`), um score de 1 a 4 e a % de confiança da rede.
- 🚀 **CLI Nativo:** Interface interativa de chat direto no terminal.

---

## 🕹️ Rodando o Chat

Como não há bibliotecas externas para instalar, os passos são simples:

**1. Clone o repositório**
```bash
git clone https://github.com/eagstu/v4.git
cd v4
```

2. Inicie o modelo
```
node v4
```
3. Teste no terminal
```
  __   __   _  _   
  \ \ / /  | || |  
   \ V /   | || |_ 
    \_/    |__   _|
              |_|  

  [ M O D E L O   V 4   C A R R E G A D O ]
  =========================================
  Digite sua frase para testar.
  Digite "sair" ou "exit" para fechar.
  
> poxa vida
- [Categoria: leve] (Score: 1/4) | Julgamento: Tranquilo | Confiança: 98.5%
```
# 📊 Performance (Log Real)
Para provar a eficiência da V4, abaixo está o log do treinamento desse modelo que você acabou de baixar. Ele processou mais de 650.000 frases usando apenas ~41.5 MB de memória RAM:
```
Carregando 2078 arquivos de ../corpus
  ✓ 719301 raw em 19.44s
Após limpeza/dedupe: 652766
Gerando vetores esparsos...

Prep em 13.41s
Exemplos treino : 652766
Vocabulário     : 1676 tokens
Categorias      : leve, medio, pesado, extremo
Hidden          : 128
Batch size      : 256

📐 Parâmetros da rede:
   W1 (1676×128) = 214.5K
   b1                = 128
   W2 (128×4)   = 512
   b2                = 4
   TOTAL            = 215.2K parâmetros
   RAM pesos ~       = 1.64 MB
   RAM total est.    ≈ 41.5 MB

Treinando...

Época   1 | lr=0.0400 | loss=0.1953 | acc=93.5% (7482/8000) | 14.4s
  💾 salvo acc=93.53%
Época   2 | lr=0.0397 | loss=0.1528 | acc=93.0% (7442/8000) | 19.3s
Época   3 | lr=0.0394 | loss=0.1431 | acc=93.7% (7499/8000) | 26.0s
  💾 salvo acc=93.74%
...
Época  24 | lr=0.0328 | loss=0.1133 | acc=95.4% (7630/8000) | 18.4s
  💾 salvo acc=95.38%
...
Época  34 | lr=0.0297 | loss=0.1092 | acc=95.1% (7611/8000) | 27.5s
Época  35 | lr=0.0294 | loss=0.1087 | acc=94.8% (7588/8000) | 24.1s
```
# 📄 Licença
Distribuído sob a licença MIT.

