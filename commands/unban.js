const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir kullanıcının yasağını kaldırır')
    .addStringOption((option) =>
      option.setName('kullanici_id').setDescription('Yasağı kaldırılacak kullanıcının ID\'si').setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('kullanici_id');

    try {
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('✅ Yasak Kaldırıldı')
        .addFields(
          { name: 'Kullanıcı ID', value: userId },
          { name: 'Yetkili', value: `${interaction.user.tag}` },
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      const logChannelId = process.env.LOG_CHANNEL_ID;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Bu ID ile yasaklı bir kullanıcı bulunamadı ya da bir hata oluştu.',
        ephemeral: true,
      });
    }
  },
};
