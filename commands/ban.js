const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı sunucudan yasaklar')
    .addUserOption((option) =>
      option.setName('kullanici').setDescription('Yasaklanacak kullanıcı').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('sebep').setDescription('Yasaklama sebebi').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('kullanici');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    const member = interaction.guild.members.cache.get(target.id);

    if (member && !member.bannable) {
      return interaction.reply({
        content: '❌ Bu kullanıcıyı yasaklayamıyorum. Rolüm yeterince yüksek olmayabilir.',
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.ban(target.id, { reason });

      const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle('🔨 Kullanıcı Yasaklandı')
        .addFields(
          { name: 'Kullanıcı', value: `${target.tag} (${target.id})` },
          { name: 'Yetkili', value: `${interaction.user.tag}` },
          { name: 'Sebep', value: reason },
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
        content: '❌ Yasaklama işlemi sırasında bir hata oluştu.',
        ephemeral: true,
      });
    }
  },
};
