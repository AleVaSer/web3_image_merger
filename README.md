# LowWarHammer — NFT Image Generator

Сервис для генерации изображений NFT персонажей коллекции LowWarHammer. По токен ID обращается к смарт-контракту на блокчейне, получает данные о слоях персонажа и склеивает их в единый PNG файл.

## Как это работает

```
GET /token/:id
       │
       ▼
checkCachedPng → если картинка уже есть в кэше, вернуть сразу
       │
       ▼
getToken → обратиться к смарт-контракту, получить данные о токене
       │
       ▼
mergeImage → склеить слои (bones, chest, head, mouth, eyes, hat) в PNG
       │
       ▼
сохранить в кэш и вернуть пользователю
```

Персонаж типа `hero` состоит из 6 слоёв, каждый из которых — отдельный NFT токен с собственной редкостью (rarity) и скином (skin).

## Структура проекта

```
├── config/
│   └── cfg.js              # ABI контракта, адрес ноды, порт
├── controller/
│   └── controller.js       # Склейка изображений через merge-images
├── middleware/
│   ├── contractor.js       # Взаимодействие с блокчейном + проверка кэша
│   └── validator.js        # Валидация параметров запроса
├── miscellaneous/
│   ├── cache/              # Кэш сгенерированных изображений
│   ├── pics/               # Исходные PNG слоёв персонажей
│   │   ├── bones/
│   │   ├── chest/
│   │   ├── eyes/
│   │   ├── head/
│   │   ├── hat/
│   └── └── mouth/
├── routes/
│   └── index.js            # Маршруты Express
└── app.js                  # Точка входа
```

## Технологии

- **Node.js** + **Express** — HTTP сервер
- **Web3.js** — взаимодействие со смарт-контрактом ERC-721
- **merge-images** + **canvas** — склейка PNG слоёв в одно изображение
- **express-validator** — валидация параметров запроса
- **dotenv** — конфигурация через переменные окружения

## Установка

```bash
git clone <repo-url>
cd lowwarhammer-contract
npm install
```

## Настройка

Создай файл `.env` в корне проекта:

```env
NODE_ADDRESS=https://your-blockchain-node-url
ADDRESS_BLOCKCHAIN=0xYourContractAddress
APP_PORT=3000
```

Убедись что в `miscellaneous/pics/` есть PNG файлы слоёв, организованные по папкам:

```
miscellaneous/pics/bones/common/skin1.png
miscellaneous/pics/hat/rare/hat2.png
...
```

## Запуск

```bash
node app.js
```

Сервер запустится на порту из `.env` (по умолчанию `3000`).

## API

### GET /token/:id

Возвращает PNG изображение персонажа по ID токена.

**Параметры:**
- `id` — целочисленный ID токена в коллекции

**Ответ:** `image/png`

**Пример:**
```
GET /token/42
```

**Кэширование:** сгенерированные изображения сохраняются в `miscellaneous/cache/<id>.png` и при повторном запросе отдаются напрямую без обращения к блокчейну.

## .gitignore

Не забудь добавить в `.gitignore`:

```
node_modules/
.env
miscellaneous/cache/
```
