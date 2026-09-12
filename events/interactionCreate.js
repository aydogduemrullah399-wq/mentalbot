const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // --- Slash komutları ---
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const errorMsg = { content: '❌ Komut çalıştırılırken bir hata oluştu.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMsg);
        } else {
          await interaction.reply(errorMsg);
        }
      }
      return;
    }

    // --- Buton: Ticket Aç ---
    if (interaction.isButton() && interaction.customId === 'open_ticket') {
      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      const user = interaction.user;

      // Aynı kullanıcının zaten açık bir ticket'ı var mı kontrol et
      const existing = guild.channels.cache.find(
        (c) => c.topic === `ticket-${user.id}`,
      );
      if (existing) {
        return interaction.editReply(`❗ Zaten açık bir ticket'ın var: ${existing}`);
      }

      const categoryId = process.env.TICKET_CATEGORY_ID;
      const supportRoleId = process.env.SUPPORT_ROLE_ID;

      const permissionOverwrites = [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ];

      if (supportRoleId) {
        permissionOverwrites.push({
          id: supportRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        });
      }

      try {
        const ticketChannel = await guild.channels.create({
          name: `ticket-${user.username}`,
          type: ChannelType.GuildText,
          parent: categoryId || undefined,
          topic: `ticket-${user.id}`,
          permissionOverwrites,
        });

        const embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle('🎫 Destek Talebi Açıldı')
          .setDescription(
            `Merhaba ${user}, destek talebin oluşturuldu.\nSorununu detaylıca yazarsan yetkililer en kısa sürede yardımcı olacak.`,
          );

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Ticket\'ı Kapat')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger),
        );

        const mention = supportRoleId ? `<@&${supportRoleId}>` : '';
        await ticketChannel.send({ content: `${mention}`, embeds: [embed], components: [closeRow] });

        await interaction.editReply(`✅ Ticket'ın oluşturuldu: ${ticketChannel}`);
      } catch (error) {
        console.error(error);
        await interaction.editReply(
          '❌ Ticket oluşturulamadı. Botun kategori oluşturma/kanal izinleri yeterli mi kontrol et.',
        );
      }
      return;
    }

    // --- Buton: Ticket Kapat ---
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
      await interaction.reply('🔒 Bu ticket 5 saniye içinde kapatılacak...');

      const logChannelId = process.env.LOG_CHANNEL_ID;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
          logChannel.send(
            `🔒 **${interaction.channel.name}** ticket'ı **${interaction.user.tag}** tarafından kapatıldı.`,
          );
        }
      }

      setTimeout(() => {
        interaction.channel.delete().catch(console.error);
      }, 5000);
    }
  },
};
