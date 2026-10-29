# Revisão visual das paletas — 2026-10-26


Atualização após o pedido de suavizar o título: V1 foi corrigido. A barra do
título agora usa o mesmo acento da lateral, misturado a 12% sobre o fundo da
página (a lateral usa 6%), com texto e ícone na cor de títulos. A regra vale
para todas as paletas. Build e 44 verificações no Chromium passaram; o menor
contraste medido para o título foi 5,97:1. Os demais achados abaixo permanecem
como registrados. Os valores de V1 descrevem o estado anterior à correção.

A revisão confirmou inconsistências na adaptação das cores. O seletor aplicou
os identificadores corretos nos testes; o problema observado está nos valores
e nos papéis das cores aplicadas pelo CSS. Esta revisão não altera as paletas.

## Achados prioritários

### V1 — Alta: título do Just the Docs escuro com contraste insuficiente

Na página inicial, em 1440 × 900, `.site-title` usa branco sobre `#5ea1fb`:
contraste medido de **2,64:1**. O texto tem 19px e peso 700, portanto também
fica abaixo do mínimo de 3:1 usado para texto grande. A causa é
`_sass/custom/custom.scss:180`: o fundo da barra usa `--site-link`, uma cor
clara destinada a links sobre fundo escuro, com `--site-brand-ink` branco.
As demais paletas recebem uma regra diferente em
`_sass/custom/_palettes.scss:74`, que usa `--site-brand`.

Recomendação: atribuir um papel próprio ao fundo e ao texto da barra do título,
com a mesma regra para todas as paletas. Conferir o contraste da combinação
realmente renderizada, incluindo hover e botão do menu.

### V2 — Média: as paletas não reproduzem os papéis do Academic Pages

`_sass/custom/_palettes.scss:3` reduz cada variante a quatro valores: fundo,
texto, link e ação preenchida. Os arquivos de origem distinguem cor-base,
links normais/hover/visitados, navegação, texto secundário, código, tabelas,
bordas e rodapé. A cor de ação escurecida localmente também passou a definir
a identidade do título. Isso modifica sensivelmente a aparência do tema.

Exemplos verificados contra os arquivos locais de referência:

| Papel | Academic Pages | Implementação local |
| --- | --- | --- |
| Link do Default claro | `#52adc8` | `#286c7e` |
| Cor-base do Default escuro / ação local | `#0ea1c5` | `#226577` |
| Link do Mint claro | `#11999e` | `#076d70` |
| Cor-base do Mint escuro / ação local | `#30e3ca` | `#14695b` |
| Cor-base do Sunrise claro / ação local | `#fc3a52` | `#a91d33` |
| Cor-base do Dirt claro / ação local | `#343434` | `#675238` |
| Link do Air escuro, normalizado | `#8cd2d5` | `#8cced5` |

Fontes: `references/academicpages.github.io/_sass/theme/`, particularmente
`_default_light.scss:39`, `_default_dark.scss:6`, `_mint_light.scss:15`,
`_mint_dark.scss:5`, `_sunrise_light.scss:5`, `_dirt_light.scss:5` e
`_air_dark.scss:15`.

A comparação de sete papéis em seis paletas × dois modos encontrou 48 valores
diferentes. Esse número não representa 48 defeitos: inclui adaptações
intencionais de contraste e superfícies. Fundos e texto principal conservaram
as cores das fontes, após normalização para RGB de 8 bits. As maiores mudanças
estão em destaques, links, texto secundário, bordas e código.

Recomendação: mapear explicitamente os papéis da fonte. Manter separadas a
cor-base original e as variantes usadas para ações ou texto com contraste
adequado. Documentar as exceções. A lateral suavizada e a posição do seletor
são personalizações solicitadas e devem permanecer como tais.

### V3 — Alta: realce de código com cores incompatíveis com alguns fundos

Em uma amostra temporária de código, inserida somente no DOM da prévia de
`/teaching/`, apareceram combinações abaixo de 4,5:1 em 11 das 22 variantes.
Exemplos:

| Variante e trecho | Cor / fundo renderizado | Contraste |
| --- | --- | --- |
| Sunrise claro, comentário `.c1` | `#6e7781` / `#e1cfb2` | 2,98:1 |
| Sunrise claro, palavra-chave `.k` | `#cf222e` / `#e1cfb2` | 3,51:1 |
| Air claro, comentário `.c1` | `#6e7781` / `#e8e8e8` | 3,71:1 |
| Default escuro, palavra-chave `.k` | `#c6a9ff` / `#4d4d4d` | 4,23:1 |

A causa é a combinação de cores claras herdadas do realçador do Just the Docs
com fundos locais, e de cores escuras fixas para todas as paletas em
`_sass/custom/custom.scss:138`. `_sass/custom/_palettes.scss:79` muda o fundo,
mas não adapta todas as categorias do realce.

Recomendação: tratar código como um conjunto de cores próprio, com fundo,
texto e categorias compatíveis; verificar os tokens efetivos no navegador.
A amostra demonstra um defeito quando houver código nesses estilos, não uma
publicação de conteúdo de teste no site.

### V4 — Média: tokens e superfícies reais não correspondem sempre

`--site-sidebar` é calculado em `_sass/custom/_palettes.scss:55`, mas o fundo
real da lateral é substituído por `color-mix()` em
`_sass/custom/custom.scss:175`. Testar somente a variável não verifica o
contraste na superfície visível. A barra do título também usa um papel
diferente no Just the Docs e nas outras paletas, conforme V1.

Recomendação: tornar os papéis de superfície inequívocos e verificar estilos
computados dos elementos reais. Conservar a exceção da busca, solicitada pelo
usuário. Os testes anteriores cobriam partes dessa adaptação e não sustentam
uma afirmação de consistência visual completa.

## O que funcionou

- 88 combinações de paleta/modo/largura na página inicial: nenhum identificador
  aplicado diferente da opção selecionada, nenhum transbordamento horizontal.
- Persistência da última escolha após navegação para `/teaching/`.
- Seleção por teclado com ArrowUp e busca retornando nove resultados.
- Ausência de exceções JavaScript nas verificações.
- Os 22 pares de modo/paleta estão presentes no seletor e no CSS.

Essas observações não excluem diferenças de cache ou estado em outro navegador
ou no serviço de prévia que o usuário já estava utilizando.

## Método e cobertura

- `bundle check`: passou.
- `bundle exec jekyll build --destination /tmp/ldconstantin-theme-audit/site`:
  passou; saída separada, sem alterar as paletas da fonte.
- `node ../.agents/scripts/check-website-themes.cjs`: passou.
- Os 12 arquivos SCSS de tema do Academic Pages foram compilados
  independentemente com `sass-embedded`; as cores emitidas foram comparadas
  com os tokens locais normalizados no Chromium.
- Chromium: 11 paletas × dois modos × larguras 390, 800, 1440 e 2560; altura
  900px. Transições foram desativadas apenas na página de auditoria para
  capturas determinísticas.
- Outras 22 verificações em uma amostra DOM temporária de texto, links,
  botões, tabela e código; essa amostra foi medida em 2560 × 900.
- Capturas individuais do Just the Docs escuro, Mint escuro e Sunrise claro,
  amostras de código e painéis de todas as paletas claras e escuras foram
  efetivamente abertos e inspecionados.
- Evidências temporárias, scripts e JSONs: `/tmp/ldconstantin-theme-audit/`.
  Esses arquivos podem desaparecer e não são recursos publicados do site.
- `git diff --check`: passou. Nenhuma cor ou comportamento foi alterado nesta
  revisão; somente este relatório foi acrescentado.

Não foram testados leitores de tela, outros motores de navegador, todos os
estados hover/visited, todas as categorias de realce, diagramas/gráficos externos
ou o estado do navegador pessoal do usuário. Não é uma auditoria WCAG completa.

## Cuidados para uma correção posterior

Não copiar cegamente o CSS das referências. No Default claro há expressões
`mix(...)` emitidas literalmente em propriedades CSS customizadas, por exemplo
`_default_light.scss:40`; isso não é uma função de cor CSS válida. Além disso,
reproduzir uma cor original não prova que ela tenha contraste suficiente no
layout local. A correção deve preservar as famílias cromáticas e os papéis
originais, resolver as expressões no Sass e explicitar ajustes de contraste.
Prioridade: V1, V3 e depois a consolidação dos papéis de V2/V4.
