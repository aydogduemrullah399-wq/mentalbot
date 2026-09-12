const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Kanaldan toplu mesaj siler')
    .addIntegerOption((option) =>
      option
        .setName('adet')
        .setDescription('Silinecek mesaj sayısı (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    )
    .addUserOption((option) =>
      option.setName('kullanici').setDescription('Sadece bu kullanıcının mesajlarını sil').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('adet');
    const targetUser = interaction.options.getUser('kullanici');

    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = await interaction.channel.messages.fetch({ limit: 100 });

      // Discord API 14 günden eski mesajları toplu silmeye izin vermiyor
      let filtered = messages.filter((m) => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

      if (targetUser) {
        filtered = filtered.filter((m) => m.author.id === targetUser.id);
      }

      const toDelete = [...filtered.values()].slice(0, amount);

      if (toDelete.length === 0) {
        return interaction.editReply('❌ Silinecek uygun mesaj bulunamadı (14 günden eski mesajlar silinemez).');
      }

      const deleted = await interaction.channel.bulkDelete(toDelete, true);

      await interaction.editReply(`✅ ${deleted.size} mesaj silindi.`);

      const logChannelId = process.env.LOG_CHANNEL_ID;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle('🧹 Mesajlar Silindi')
            .addFields(
              { name: 'Kanal', value: `${interaction.channel}` },
              { name: 'Silinen Mesaj', value: `${deleted.size}` },
              { name: 'Yetkili', value: `${interaction.user.tag}` },
            )
            .setTimestamp();
          logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Mesajlar silinirken bir hata oluştu.');
    }
  },
};
