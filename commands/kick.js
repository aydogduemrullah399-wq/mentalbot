const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı sunucudan atar')
    .addUserOption((option) =>
      option.setName('kullanici').setDescription('Atılacak kullanıcı').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('sebep').setDescription('Atma sebebi').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('kullanici');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: '❌ Bu kullanıcı sunucuda bulunamadı.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: '❌ Bu kullanıcıyı atamıyorum. Rolüm yeterince yüksek olmayabilir.',
        ephemeral: true,
      });
    }

    try {
      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xfee75c)
        .setTitle('👢 Kullanıcı Atıldı')
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
        content: '❌ Atma işlemi sırasında bir hata oluştu.',
        ephemeral: true,
      });
    }
  },
};
