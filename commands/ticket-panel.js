const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Destek talebi açma panelini bu kanala gönderir')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎫 Destek Talebi')
      .setDescription(
        'Bir sorunun mu var, yardıma mı ihtiyacın var?\nAşağıdaki butona tıklayarak özel bir destek talebi açabilirsin.',
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('Ticket Aç')
        .setEmoji('🎫')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Panel gönderildi.', ephemeral: true });
  },
};
