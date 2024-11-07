const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require('discord.js');

module.exports = {
  /**
     * @param {Client} client
     * @param {Interaction} interaction
     *
     */


  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply('The user doesn\'t exist in this server.');
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply('I can\'t ban the owner');
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply('You cant ban user have same/have role than you');
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply('I cant ban that user have same role/high role than me');
      return;
    }

    // ban target user

    try {
      await targetUser.ban({ reason });
      await interaction.editReply(`User ${targetUser} was ban\nReason: ${reason}`);
    } catch (error) {
      console.log(`get error while ban ${error}`);
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },

    {
      name: 'reason',
      description: 'The reason you want to ban',
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermission: [PermissionFlagsBits.BanMembers],
};