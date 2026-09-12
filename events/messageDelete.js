const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    // Botların kendi mesajlarını veya boş/bilinmeyen içerikleri loglama
    if (!message.guild) return;
    if (message.author?.bot) return;

    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (!logChannelId) return;

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('🗑️ Mesaj Silindi')
      .addFields(
        { name: 'Kullanıcı', value: message.author ? `${message.author.tag} (${message.author.id})` : 'Bilinmiyor' },
        { name: 'Kanal', value: `${message.channel}` },
        {
          name: 'İçerik',
          value: message.content ? message.content.slice(0, 1000) : '*(metin yok - resim/embed/dosya olabilir)*',
        },
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(() => {});
  },
};
