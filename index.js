const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');

// Вставьте сюда ваш токен
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Создаем экземпляр бота
const bot = new TelegramBot(token, {polling: true});

// Обработчик для получения файлов
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Проверяем, содержит ли сообщение документ или медиафайл
  if (msg.document || msg.photo || msg.video) {
    let fileId;

    // Если это документ
    if (msg.document) {
      fileId = msg.document.file_id;
    }
    
    // Если это фото
    if (msg.photo) {
      fileId = msg.photo[msg.photo.length - 1].file_id; // Берем последнее фото (в наибольшем разрешении)
    }

    // Если это видео
    if (msg.video) {
      fileId = msg.video.file_id;
    }

    // Получаем ссылку на файл
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    // Скачиваем файл
    const filePath = './downloads/' + (msg.document ? msg.document.file_name : file.file_path.split('/').pop());
    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    writer.on('finish', () => {
      bot.sendMessage(chatId, 'Файл успешно скачан: ' + filePath);
    });

    writer.on('error', () => {
      bot.sendMessage(chatId, 'Произошла ошибка при загрузке файла.');
    });

  } else {
    bot.sendMessage(chatId, 'Отправьте файл для загрузки.');
  }
});
