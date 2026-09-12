require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`${commands.length} komut kaydediliyor...`);

    if (process.env.GUILD_ID) {
      // Tek sunucuya kaydet (anında görünür, test için ideal)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log('Sunucuya özel komutlar kaydedildi (anında aktif).');
    } else {
      // Global kaydet (tüm sunucularda görünür ama ~1 saat gecikebilir)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log('Global komutlar kaydedildi (yayılması 1 saate kadar sürebilir).');
    }
  } catch (error) {
    console.error(error);
  }
})();
