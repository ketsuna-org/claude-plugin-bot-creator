# Plugin Bot Creator pour Claude Code

[English](README.md)

Créez des commandes de bot Discord pour [Bot Creator](https://bot-creator.fr) avec Claude Code. Claude s'appuie sur la documentation officielle, valide chaque commande et l'exporte dans un fichier qui s'importe dans l'app d'un simple collage.

## Installation

```
/plugin marketplace add ketsuna-org/claude-plugin-bot-creator
/plugin install bot-creator@bot-creator
```

Lancez `/mcp` pour vérifier que le serveur `bot-creator` est connecté. Il est public et en lecture seule, sans compte ni token.

## Contenu

| Composant | Rôle |
|---|---|
| **Serveur MCP** `bot-creator` | La doc officielle sur `https://bot-creator.fr/api/mcp` : `plan_solution`, `get_schema_manifest`, `list_actions`, `validate_actions`, `search_docs` et `get_doc` |
| **Skill** `author-command` | Utilisé automatiquement quand vous demandez une commande Discord ou Bot Creator. Il choisit le moteur (BDFD, Blocks ou JavaScript), planifie avec la doc, évite les pièges classiques et valide le JSON Blocks |
| **Skill** `import-format` | Le format JSON `bot_creator_command` exact qu'accepte *Importer une commande* dans l'app |
| `/bot-creator:new-command` | `/bot-creator:new-command "slash /warn avec un membre et une raison, réservé aux modos" --mode blocks` |
| `/bot-creator:validate` | `/bot-creator:validate warn.botcmd.json` : vérifie l'enveloppe et les actions, puis propose des corrections |
| `/bot-creator:docs` | `/bot-creator:docs setUserVar bdfd` : signature, valeur de retour et exemple |
| **Agent** `bot-creator-expert` | Conçoit de bout en bout les fonctionnalités à plusieurs commandes : tickets, économie, modération |
| **Hook** | À chaque `*.botcmd.json` enregistré par Claude, les actions Blocks sont revalidées avec `validate_actions`, et les erreurs sont renvoyées à Claude pour correction |

## Importer une commande dans l'app

1. Ouvrez le fichier `<nom>.botcmd.json` écrit par Claude et copiez son contenu.
2. Dans Bot Creator, ouvrez votre bot, créez une commande, puis choisissez **Importer une commande**.
3. Collez le JSON (ou sa version Base64), puis enregistrez.

## Confidentialité

Le serveur MCP et le hook n'appellent que `https://bot-creator.fr/api/mcp`. Le hook n'envoie que le tableau `actions` Blocks des fichiers `*.botcmd.json`, jamais de token de bot ni d'autre fichier. Si le serveur est injoignable ou si `node` est absent, le hook ne fait rien et ne bloque jamais.

Pour pointer le hook vers un autre serveur, définissez `BOT_CREATOR_MCP_URL`.

## Prérequis

- Claude Code avec la prise en charge des plugins
- Node.js 18 ou plus récent, uniquement pour le hook de validation (facultatif)

## Licence

MIT
