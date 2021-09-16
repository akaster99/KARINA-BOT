const {GuildMember} = require('discord.js');

module.exports = {
  name: 'pause',
  description: '노래 일시 정지',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: '먼저 음성 채널에 들어와주세요',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: '카리나와 다른 음성 채널에 있습니다.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | 재생되고 있는 음악이 없어요!',
      });
    const success = queue.setPaused(true);
    return void interaction.followUp({
      content: success ? '⏸ | 일시정지' : '❌ | 에러 발생',
    });
  },
};
