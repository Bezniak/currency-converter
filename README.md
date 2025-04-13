Быстрый старт 

Установка зависимостей

Убедись, что у тебя установлен Node.js (v18+ желательно) и npm или yarn.

1. Клонируй репозиторий:

git clone https://github.com/your-username/currency-converter.git
cd currency-converter

2. Установи зависимости:

npm install
или
yarn install

3. Запуск проекта
 
npm run dev
или
yarn dev


Открой http://localhost:5173 в браузере.

Стек технологий

React

Tailwind CSS

React Datepicker

Frankfurter API

Vite (в качестве сборщика)

Структура проекта

src/
├── components/
│   ├── CurrencyConverter.jsx
│   └── CurrencySelector.jsx
├── api/
│   └── api.js
├── App.jsx
└── main.jsx


API

Используется публичное API: frankfurter.app.

Например:

https://api.frankfurter.app/latest?amount=100&from=USD&to=EUR

Возможности

Двусторонняя конвертация валют (ввод можно в любом поле)

Выбор валют из списка

Выбор даты (до текущей)

Интуитивный и адаптивный дизайн
